// Mesin 3D bersama beranda: SATU konteks WebGL untuk semua panggung (kartu demo, pemilih kebutuhan, cara kerja), karena
// peramban membatasi jumlah konteks dan tiap konteks memuat ulang geometri & tekstur. Tiap panggung menggambar di bagian
// kanvas GL lalu disalin ke kanvas 2D miliknya di halaman, jadi ikut tumpukan & gulir elemen itu tanpa jeda.
// Digambar hanya saat ada yang berubah dan panggungnya terlihat: diam = nol kerja GPU. Bila rata-rata di atas BATAS_MS
// per bingkai atau konteks hilang, semua panggung dilepas dan tampilan biasa kembali; perangkat itu diingat selama sesi.
import { BackSide, BoxGeometry, Color, Mesh, MeshBasicMaterial, NeutralToneMapping, PMREMGenerator, Scene, VSMShadowMap, WebGLRenderer, type Camera, type WebGLRenderTarget } from 'three'
import { aturLingkungan, bersihkanPerangkat, jeda } from './perangkat'
import { KUNCI_LAMBAT } from './layak'

const BATAS_MS = 40
const DPR_MAKS = 2

export type Panggung = {
  kanvas: HTMLCanvasElement
  /** penerima kelas aktif (menukar tampilan biasa dengan kanvas) */
  akar: HTMLElement
  kelas: string
  scene: Scene
  camera: Camera
  /** ukuran kanvas berubah (px CSS) */
  ukuran: (w: number, h: number) => void
  /** memperbarui adegan; true = masih bergerak dan butuh bingkai berikutnya */
  langkah: (now: number, dt: number, pertama: boolean) => boolean
  ikutGulir?: boolean
  /** dilepas (oleh pemiliknya atau karena mesin mati) */
  lepas?: () => void
}
type Status = { ctx: CanvasRenderingContext2D; w: number; h: number; terlihat: boolean; perlu: boolean; pertama: boolean; ro: ResizeObserver; io: IntersectionObserver }

let rend: WebGLRenderer | null = null
let envRT: WebGLRenderTarget | null = null
let glW = 0
let glH = 0
const aktif = new Map<Panggung, Status>()
let raf = 0
let tadi = 0
let beruntun = false
let jumlahMs = 0
let jumlahF = 0
let lambat = 0

/** studio putih kebiruan: kubah terang + softbox HDR, supaya aluminium berkilau tanpa lampu per piksel */
function buatLingkungan(renderer: WebGLRenderer) {
  const env = new Scene()
  const kotak = new BoxGeometry(1, 1, 1)
  const papan = (warna: [number, number, number], p: [number, number, number], s: [number, number, number], dalam = false) => {
    const m = new Mesh(kotak, new MeshBasicMaterial({ color: new Color(...warna), ...(dalam ? { side: BackSide } : {}) }))
    m.position.set(...p)
    m.scale.set(...s)
    env.add(m)
  }
  papan([0.84, 0.86, 0.9], [0, 0, 0], [24, 24, 24], true)
  papan([2.5, 2.5, 2.6], [0, 10, 1], [12, 0.2, 8])
  papan([1.9, 2, 2.2], [-11, 3, 3], [0.2, 8, 7])
  papan([2.4, 2.5, 2.7], [11, 2, 1], [0.2, 9, 2.4])
  papan([0.26, 0.32, 0.5], [0, -10, 0], [20, 0.2, 20])
  // di belakang kamera, tempat kaca layar memantul: jendela lebar & satu lajur tipis, supaya pantulannya bergeser saat perangkat menoleh
  papan([3.4, 3.4, 3.6], [-7, 5, 11.5], [5, 5, 0.2])
  papan([4.2, 4.2, 4.4], [5.5, 2.5, 11.5], [0.9, 11, 0.2])
  const pm = new PMREMGenerator(renderer)
  const rt = pm.fromScene(env, 0.025, 0.1, 40)
  pm.dispose()
  env.traverse((o) => {
    if (o instanceof Mesh) o.material.dispose()
  })
  kotak.dispose()
  return rt
}

/** menyalakan mesin bila belum; false = gagal (tampilan biasa tetap) */
export function nyalakan() {
  if (rend) return true
  try {
    const canvas = document.createElement('canvas')
    rend = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true })
    rend.setPixelRatio(1)
    rend.setClearColor(0x000000, 0)
    rend.setScissorTest(true)
    // layar demo tetap berwarna asli (toneMapped: false); hanya bodi & benda yang kena tone mapping
    rend.toneMapping = NeutralToneMapping
    rend.shadowMap.enabled = true
    // VSM: tepi bayangan bisa diburamkan lebar, seperti cahaya softbox; peta kecil sudah cukup
    rend.shadowMap.type = VSMShadowMap
    envRT = buatLingkungan(rend)
    aturLingkungan(envRT.texture, Math.min(8, rend.capabilities.getMaxAnisotropy()))
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      matikan()
    })
    window.addEventListener('scroll', onGulir, { passive: true })
    return true
  } catch {
    rend = null
    return false
  }
}

function jadwal() {
  if (!raf) raf = requestAnimationFrame(bingkai)
}
function onGulir() {
  let ada = false
  aktif.forEach((s, p) => {
    if (p.ikutGulir && s.terlihat) {
      s.perlu = true
      ada = true
    }
  })
  if (ada) jadwal()
}

function gambar(p: Panggung, s: Status) {
  const r = rend!
  if (glW < s.w || glH < s.h) {
    glW = Math.max(glW, s.w)
    glH = Math.max(glH, s.h)
    r.setSize(glW, glH, false)
  }
  r.setViewport(0, 0, s.w, s.h)
  r.setScissor(0, 0, s.w, s.h)
  r.render(p.scene, p.camera)
  s.ctx.globalCompositeOperation = 'copy'
  s.ctx.drawImage(r.domElement, 0, glH - s.h, s.w, s.h, 0, 0, s.w, s.h)
}

function bingkai(now: number) {
  raf = 0
  if (!rend) return
  const selang = now - tadi
  tadi = now
  const dt = beruntun && selang < 100 ? selang / 1000 : 1 / 60

  // penjaga: dua jendela berturut-turut terlalu lambat = kembali ke tampilan biasa. Hanya bingkai yang beruntun dihitung;
  // jeda antar-tik gulir bukan tanda perangkat lambat.
  if (beruntun && selang < 200) {
    jumlahMs += selang
    if (++jumlahF === 45) {
      lambat = jumlahMs / jumlahF > BATAS_MS ? lambat + 1 : 0
      jumlahMs = 0
      jumlahF = 0
      if (lambat >= 2) {
        try {
          sessionStorage.setItem(KUNCI_LAMBAT, '0')
        } catch {}
        matikan()
        return
      }
    }
  }

  let lanjut = false
  aktif.forEach((s, p) => {
    if (!s.perlu || !s.terlihat || !s.w || !s.h) return
    s.perlu = false
    const pertama = s.pertama
    const hidup = p.langkah(now, dt, pertama)
    gambar(p, s)
    if (pertama) {
      s.pertama = false
      requestAnimationFrame(() => p.akar.classList.add(p.kelas))
    }
    if (hidup) {
      s.perlu = true
      lanjut = true
    }
  })
  beruntun = lanjut
  if (lanjut) jadwal()
}

/** memasang panggung; adegannya sudah harus lengkap. Mengembalikan peminta bingkai & pelepas. */
export async function pasang(p: Panggung) {
  const ctx = p.kanvas.getContext('2d')
  if (!rend || !ctx) return null
  if (rend.extensions.has('KHR_parallel_shader_compile')) await rend.compileAsync(p.scene, p.camera)
  await jeda()
  if (!rend) return null
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAKS)
  const atur = (s: Status) => {
    const r = p.kanvas.getBoundingClientRect()
    if (!r.width || !r.height) return
    s.w = Math.round(r.width * dpr)
    s.h = Math.round(r.height * dpr)
    p.kanvas.width = s.w
    p.kanvas.height = s.h
    p.ukuran(r.width, r.height)
    s.perlu = true
    jadwal()
  }
  const ro = new ResizeObserver(() => atur(s))
  const io = new IntersectionObserver((ent) => {
    s.terlihat = ent[ent.length - 1].isIntersecting
    if (s.terlihat) {
      s.perlu = true
      jadwal()
    }
  })
  const s: Status = { ctx, w: 0, h: 0, terlihat: true, perlu: true, pertama: true, ro, io }
  aktif.set(p, s)
  atur(s)
  ro.observe(p.kanvas)
  io.observe(p.kanvas)
  return {
    minta() {
      s.perlu = true
      jadwal()
    },
    lepas() {
      lepaskan(p)
      if (!aktif.size) matikan()
    },
  }
}

function lepaskan(p: Panggung) {
  const s = aktif.get(p)
  if (!s) return
  s.ro.disconnect()
  s.io.disconnect()
  aktif.delete(p)
  p.akar.classList.remove(p.kelas)
  p.lepas?.()
}

function matikan() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  ;[...aktif.keys()].forEach(lepaskan)
  window.removeEventListener('scroll', onGulir)
  bersihkanPerangkat()
  envRT?.dispose()
  envRT = null
  if (rend) {
    const gl = rend.getContext()
    rend.dispose()
    if (!gl.isContextLost()) rend.forceContextLoss()
  }
  rend = null
  glW = 0
  glH = 0
}
