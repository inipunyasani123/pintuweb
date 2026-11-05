// Pustaka perangkat 3D beranda: laptop, tablet, ponsel (Three.js polos). Geometri = versi ringkas
// VideoPromo/src/kreasi/perangkat-apple.tsx (ukuran resmi dalam mm, tanpa logo). Geometri & bahan dipakai bersama oleh
// semua panggung di mesin.ts; bersihkanPerangkat() melepas semuanya saat panggung terakhir pergi.
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LinearMipmapLinearFilter,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector3,
  type Material,
} from 'three'

export const PI = Math.PI
export const D2R = PI / 180
/** satuan dunia per milimeter (1 satuan = 10 cm) */
export const MM = 0.01

export const klem = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const campur = (a: number, b: number, t: number) => a + (b - a) * t
export const halus = (t: number) => t * t * (3 - 2 * t)
export const jeda = () => new Promise<void>((r) => setTimeout(r))

// pegas teredam kritis: kecepatan tetap menyambung saat sasarannya berubah di tengah gerak
export type Pegas = { x: number; v: number }
export const pegas = (x = 0): Pegas => ({ x, v: 0 })
export function redam(s: Pegas, sasaran: number, waktu: number, dt: number) {
  const o = 2 / waktu
  const k = o * dt
  const e = 1 / (1 + k + 0.48 * k * k + 0.235 * k * k * k)
  const d = s.x - sasaran
  const t = (s.v + o * d) * dt
  s.v = (s.v - o * t) * e
  s.x = sasaran + (d + t) * e
}
export const belum = (s: Pegas, sasaran: number) => Math.abs(s.x - sasaran) > 0.0004 || Math.abs(s.v) > 0.0008

// ---------------------------------------------------------------------------------------------------------------------
// Sumber bersama
// ---------------------------------------------------------------------------------------------------------------------
let ENV: Texture | null = null
let ANISO = 4
const milik = new Set<{ dispose(): void }>()
const memo = new Map<string, unknown>()

function simpan<T extends { dispose(): void }>(kunci: string, buat: () => T): T {
  let x = memo.get(kunci) as T | undefined
  if (!x) {
    x = buat()
    memo.set(kunci, x)
    milik.add(x)
  }
  return x
}

export function aturLingkungan(env: Texture, aniso: number) {
  ENV = env
  ANISO = aniso
}
export const envLingkungan = () => ENV
export function bersihkanPerangkat() {
  milik.forEach((x) => x.dispose())
  milik.clear()
  memo.clear()
  ENV = null
}

/** memuat gambar (cache per alamat); tiap pemakai membuat salinan lewat .clone() supaya gulirnya sendiri-sendiri */
export function muatTekstur(url: string): Promise<Texture> {
  const k = 'tx|' + url
  const ada = memo.get(k) as Promise<Texture> | undefined
  if (ada) return ada
  const janji = (async () => {
    const img = new Image()
    img.src = url
    await img.decode()
    const t = new Texture(img)
    t.colorSpace = SRGBColorSpace
    t.minFilter = LinearMipmapLinearFilter
    t.anisotropy = ANISO
    t.needsUpdate = true
    milik.add(t)
    return t
  })()
  memo.set(k, janji)
  return janji
}

// ---------------------------------------------------------------------------------------------------------------------
// Geometri: garis luar bersudut kontinu + sapuan profil (tepi bulat/chamfer bernormal benar)
// ---------------------------------------------------------------------------------------------------------------------
type T2 = [number, number]
type Garis = { p: T2[]; n: T2[] }
type SegProfil = { t: T2[]; m: number }
const TANDA: T2[] = [
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, -1],
]
const N_SUPER = 2.65

/** persegi superelips; r per sudut [kanan-atas, kiri-atas, kiri-bawah, kanan-bawah]; urutan titik berlawanan jarum jam */
export function garisLuar(w: number, h: number, r: number | number[], seg = 12, cx0 = 0, cy0 = 0): Garis {
  const rr = typeof r === 'number' ? [r, r, r, r] : r
  const e = 2 / N_SUPER
  const en = (2 * (N_SUPER - 1)) / N_SUPER
  const p: T2[] = []
  const n: T2[] = []
  for (let k = 0; k < 4; k++) {
    const a = Math.min(rr[k] * 1.5, w / 2, h / 2)
    const cx = cx0 + TANDA[k][0] * (w / 2 - a)
    const cy = cy0 + TANDA[k][1] * (h / 2 - a)
    for (let i = 0; i <= seg; i++) {
      const f = ((k + i / seg) * PI) / 2
      const c = Math.cos(f)
      const s = Math.sin(f)
      p.push([cx + a * Math.sign(c) * Math.abs(c) ** e, cy + a * Math.sign(s) * Math.abs(s) ** e])
      const nx = Math.sign(c) * Math.abs(c) ** en
      const ny = Math.sign(s) * Math.abs(s) ** en
      const l = Math.hypot(nx, ny) || 1
      n.push([nx / l, ny / l])
    }
  }
  return { p, n }
}

/** busur profil (r, z) berpusat (cr, cz), sudut derajat a0 -> a1 */
export const busur = (cr: number, cz: number, rad: number, a0: number, a1: number, n = 6): T2[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (a0 + ((a1 - a0) * i) / n) * D2R
    return [cr + rad * Math.cos(a), cz + rad * Math.sin(a)] as T2
  })

/** menyapu profil (r = geser dari garis luar, z = tinggi) sepanjang garis luar; m = indeks bahan; antarsegmen tepi tajam */
export function sapuan(g: Garis, segs: SegProfil[], tutup: { awal?: number; akhir?: number } = {}) {
  const pos: number[] = []
  const nor: number[] = []
  const idx: number[][] = []
  const tri = (m: number, a: number, b: number, c: number) => (idx[m] ??= []).push(a, b, c)
  const N = g.p.length
  for (const seg of segs) {
    const tp = seg.t
    const M = tp.length
    const tepi = (k: number): T2 => {
      const tr = tp[k + 1][0] - tp[k][0]
      const tz = tp[k + 1][1] - tp[k][1]
      const l = Math.hypot(tr, tz) || 1
      return [tz / l, -tr / l]
    }
    const dasar = pos.length / 3
    for (let j = 0; j < M; j++) {
      const a = j > 0 ? tepi(j - 1) : null
      const b = j < M - 1 ? tepi(j) : null
      let nr = (a ? a[0] : 0) + (b ? b[0] : 0)
      let nz = (a ? a[1] : 0) + (b ? b[1] : 0)
      const l = Math.hypot(nr, nz) || 1
      nr /= l
      nz /= l
      const [r, z] = tp[j]
      for (let i = 0; i <= N; i++) {
        const [px, py] = g.p[i % N]
        const [ox, oy] = g.n[i % N]
        pos.push(px + r * ox, py + r * oy, z)
        nor.push(nr * ox, nr * oy, nz)
      }
    }
    const B = N + 1
    for (let j = 0; j < M - 1; j++) {
      for (let i = 0; i < N; i++) {
        const a = dasar + j * B + i
        tri(seg.m, a, a + 1, a + 1 + B)
        tri(seg.m, a, a + 1 + B, a + B)
      }
    }
  }
  const tutupan = ([r, z]: T2, m: number, atas: boolean) => {
    const pusat = pos.length / 3
    let cx = 0
    let cy = 0
    for (const t of g.p) {
      cx += t[0]
      cy += t[1]
    }
    cx /= N
    cy /= N
    pos.push(cx, cy, z)
    nor.push(0, 0, atas ? 1 : -1)
    for (let i = 0; i < N; i++) {
      pos.push(g.p[i][0] + r * g.n[i][0], g.p[i][1] + r * g.n[i][1], z)
      nor.push(0, 0, atas ? 1 : -1)
    }
    for (let i = 0; i < N; i++) {
      const a = pusat + 1 + i
      const b = pusat + 1 + ((i + 1) % N)
      if (atas) tri(m, pusat, a, b)
      else tri(m, pusat, b, a)
    }
  }
  if (tutup.awal !== undefined) tutupan(segs[0].t[0], tutup.awal, false)
  if (tutup.akhir !== undefined) {
    const t = segs[segs.length - 1].t
    tutupan(t[t.length - 1], tutup.akhir, true)
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new Float32BufferAttribute(nor, 3))
  const semua: number[] = []
  idx.forEach((l, m) => {
    geo.addGroup(semua.length, l.length, m)
    for (const x of l) semua.push(x)
  })
  geo.setIndex(semua)
  return geo
}

export const bentuk = (g: Garis) => new Shape(g.p.map(([x, y]) => new Vector2(x, y)))

/** bidang menghadap +z dengan UV 0..1 selebar kotaknya (untuk isi layar) */
export function bidangLayar(w: number, h: number, r: number | number[], cx = 0, cy = 0) {
  const geo = new ShapeGeometry(bentuk(garisLuar(w, h, r, 8, cx, cy)), 1)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - (cx - w / 2)) / w, (pos.getY(i) - (cy - h / 2)) / h)
  return geo
}

// ---------------------------------------------------------------------------------------------------------------------
// Tekstur buatan: bilah peramban, bilah status ponsel, bayangan lantai
// ---------------------------------------------------------------------------------------------------------------------
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export function kanvas2d(w: number, h: number, skala: number) {
  const c = document.createElement('canvas')
  c.width = w * skala
  c.height = h * skala
  const g = c.getContext('2d')!
  g.scale(skala, skala)
  return { c, g }
}
export function kotakBulat(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}
export function teksturKanvas(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = ANISO
  return t
}

/** gambar sama dengan simbol dv-chrome + dv-lock di DeviceTrio.tsx */
function bilahPeramban(host: string) {
  return simpan('bilah|' + host, () => {
    const { c, g } = kanvas2d(838, 40, 2)
    g.fillStyle = '#f3f6fd'
    g.fillRect(0, 0, 838, 40)
    g.fillStyle = '#d3dcee'
    g.fillRect(0, 39, 838, 1)
    ;(
      [
        [24, '#f4a6a0'],
        [43, '#f5d08a'],
        [62, '#9fd8a8'],
      ] as const
    ).forEach(([x, w]) => {
      g.fillStyle = w
      g.beginPath()
      g.arc(x, 20, 5.5, 0, PI * 2)
      g.fill()
    })
    kotakBulat(g, 234.5, 8, 369, 24, 12)
    g.fillStyle = '#fff'
    g.fill()
    g.strokeStyle = '#d3dcee'
    g.stroke()
    g.fillStyle = '#5d6b88'
    g.font = `13px ${FONT}`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(host, 425, 20.5)
    const lx = 411 - host.length * 3.55
    g.fillStyle = '#7d8bab'
    kotakBulat(g, lx, 18, 9, 7, 1.5)
    g.fill()
    g.strokeStyle = '#7d8bab'
    g.lineWidth = 1.6
    g.beginPath()
    g.arc(lx + 4.5, 15.8, 2.7, PI, 0)
    g.stroke()
    return teksturKanvas(c)
  })
}

/** gambar sama dengan simbol dv-status di DeviceTrio.tsx; latarnya transparan (warna puncak halaman ada di lapisan dasar) */
function bilahStatus(fg: string) {
  return simpan('status|' + fg, () => {
    const { c, g } = kanvas2d(218, 26, 4)
    kotakBulat(g, 79, 5, 60, 17, 8.5)
    g.fillStyle = '#111827'
    g.fill()
    g.fillStyle = fg
    g.font = `600 10px ${FONT}`
    g.textAlign = 'center'
    g.textBaseline = 'alphabetic'
    g.fillText('9:41', 30, 18.6)
    g.fill(new Path2D('M152 16.6h2.6v2.9H152zM156 14.7h2.6v4.8H156zM160 12.8h2.6v6.7H160zM164 10.9h2.6v8.6H164zM175.4 13.4h11v4.7h-11z'))
    g.strokeStyle = fg
    g.globalAlpha = 0.55
    g.lineWidth = 1.1
    kotakBulat(g, 174, 12, 16, 7.5, 2)
    g.stroke()
    return teksturKanvas(c)
  })
}

/** bayangan lantai panggang: bidang lembut di y≈0 (w × d satuan dunia) */
export function bayanganLantai(w: number, d: number, z = 0, opasitas = 1) {
  const tx = simpan('tx-bayangan', () => {
    const { c, g } = kanvas2d(128, 128, 1)
    const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64)
    gr.addColorStop(0, 'rgba(19,36,84,.44)')
    gr.addColorStop(0.45, 'rgba(19,36,84,.22)')
    gr.addColorStop(1, 'rgba(19,36,84,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, 128, 128)
    return teksturKanvas(c)
  })
  const bahan = simpan('bayangan|' + opasitas, () => new MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false, opacity: opasitas }))
  const m = new Mesh(
    simpan('geo-bidang1', () => new PlaneGeometry(1, 1)),
    bahan,
  )
  m.scale.set(w, d, 1)
  m.rotation.x = -PI / 2
  m.position.set(0, 0.002, z)
  m.renderOrder = -1
  return m
}

// ---------------------------------------------------------------------------------------------------------------------
// Bahan
// ---------------------------------------------------------------------------------------------------------------------
export function bahanLogam(warna: string) {
  const c = new Color(warna)
  return {
    al: simpan('al|' + warna, () => new MeshStandardMaterial({ color: c, metalness: 0.72, roughness: 0.44, envMap: ENV, envMapIntensity: 1.05 })),
    // chamfer tak boleh terlalu licin: pantulan softbox di tepi selebar ±1 piksel lolos MSAA jadi bintik berselang-seling
    poles: simpan('poles|' + warna, () => new MeshStandardMaterial({ color: c.clone().lerp(new Color('#ffffff'), 0.3), metalness: 0.9, roughness: 0.36, envMap: ENV, envMapIntensity: 0.95 })),
  }
}
export const kacaHitam = () => simpan('kaca', () => new MeshStandardMaterial({ color: '#030406', metalness: 0, roughness: 0.1, envMap: ENV, envMapIntensity: 0.32 }))
export const dop = (warna: string, kasar = 0.7) => simpan(`dop|${warna}|${kasar}`, () => new MeshStandardMaterial({ color: warna, metalness: 0, roughness: kasar, envMap: ENV, envMapIntensity: 0.55 }))
/** bahan warna rata untuk benda buatan (gelembung, potongan halaman): putihnya tetap putih di studio ini */
export const rata = (warna: string, kasar = 0.5) => simpan(`rata|${warna}|${kasar}`, () => new MeshStandardMaterial({ color: warna, metalness: 0, roughness: kasar, envMap: ENV, envMapIntensity: 1.06 }))
export const geoSimpan = <T extends { dispose(): void }>(k: string, buat: () => T) => simpan('geo|' + k, buat)

// ---------------------------------------------------------------------------------------------------------------------
// Layar: isi tangkapan panjang yang bisa digulir & diganti
// ---------------------------------------------------------------------------------------------------------------------
export type Layar = {
  /** pan 0 = puncak halaman, 1 = dasar */
  atur: (pan: number) => void
  ganti: (dasar: Texture, ukuran: number[]) => void
  /** isi kanvas sumbernya baru digambar ulang */
  segarkan: () => void
  lepas: () => void
}

function layarGulir(bahan: MeshBasicMaterial, rasioJendela: number, dasar: Texture, ukuran: number[]): Layar {
  let tx: Texture | null = null
  let bagian = 1
  const l: Layar = {
    atur(pan) {
      if (tx) tx.offset.y = (1 - bagian) * (1 - pan)
    },
    ganti(d, uk) {
      tx?.dispose()
      tx = d.clone()
      bagian = Math.min(1, uk[0] / rasioJendela / uk[1])
      tx.repeat.set(1, bagian)
      bahan.map = tx
      bahan.needsUpdate = true
      l.atur(0)
    },
    segarkan() {
      if (tx) tx.needsUpdate = true
    },
    lepas() {
      tx?.dispose()
      bahan.dispose()
    },
  }
  l.ganti(dasar, ukuran)
  return l
}

const isiLayar = () => new MeshBasicMaterial({ toneMapped: false })

// ---------------------------------------------------------------------------------------------------------------------
// MacBook Air 13"
// ---------------------------------------------------------------------------------------------------------------------
const MB = { W: 304.1, Dp: 215, kaki: 0.8, tb: 7.4, celah: 0.3, tl: 3.6, Ld: 207.4, R: 10.5, layarW: 290.29, layarH: 188.69, bezelAtas: 6.2, poni: 6.3 }
const MB_DEK = MB.kaki + MB.tb
const MB_ENGSEL: [number, number, number] = [0, MB_DEK + MB.celah, -MB.Dp / 2 + 7.6]
const P_TUTS = 18.9
const Q_TUTS = 18
const CELAH_TUTS = 2.3
const KB_W = 14.5 * P_TUTS
const KB_Z0 = -MB.Dp / 2 + 13.5
const KB_D = 6 * Q_TUTS
const BARIS_TUTS = [
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1],
]
const BILAH_MB = (40 / 838) * MB.layarW
const PUNCAK_MB = MB.Ld - MB.bezelAtas - MB.poni
const DASAR_MB = MB.Ld - MB.bezelAtas - MB.layarH
const HAL_MB = PUNCAK_MB - BILAH_MB - DASAR_MB
/** ukuran dunia layar halaman laptop (di koordinat tutup, skala 1) */
export const UKURAN_LAYAR_LAPTOP = { w: MB.layarW * MM, h: HAL_MB * MM, cy: (DASAR_MB + HAL_MB / 2) * MM }

export type Laptop = { root: Group; tutup: Group; layar: Layar; aturHost: (host: string) => void; lepas: () => void }

export function buatLaptop(o: { warna: string; host: string; halaman: Texture; ukuran: number[] }): Laptop {
  const { W, Dp, tl, Ld, R, layarW } = MB
  const { al, poles } = bahanLogam(o.warna)
  const root = new Group()
  const mm = new Group()
  mm.scale.setScalar(MM)
  root.add(mm)

  // alas: disapu di bidang xy lalu ditegakkan (y -> -z, z -> y)
  const alas = new Mesh(
    geoSimpan('mb-alas', () =>
      sapuan(
        garisLuar(W, Dp, R, 12),
        [
          { t: [...busur(-2.4, MB.kaki + 2.4, 2.4, -90, 0, 6), [0, MB_DEK - 0.45]], m: 0 },
          {
            t: [
              [0, MB_DEK - 0.45],
              [-0.45, MB_DEK],
            ],
            m: 1,
          },
        ],
        { awal: 0, akhir: 0 },
      ),
    ),
    [al, poles],
  )
  alas.rotation.x = -PI / 2
  mm.add(alas)

  // sumur keyboard + tuts (satu InstancedMesh) + trackpad
  const dekDatar = (g: BufferGeometry, m: Material, y: number, z: number) => {
    const b = new Mesh(g, m)
    b.position.set(0, y, z)
    b.rotation.x = -PI / 2
    mm.add(b)
  }
  dekDatar(
    geoSimpan('mb-sumur', () => new ShapeGeometry(bentuk(garisLuar(KB_W + 3.6, KB_D + 3.6, 3, 6)), 1)),
    dop('#07080a', 0.85),
    MB_DEK + 0.1,
    KB_Z0 + KB_D / 2,
  )
  mm.add(
    simpan('mb-tuts', () => {
      const jml = BARIS_TUTS.reduce((n, b) => n + b.length, 0)
      const tuts = new InstancedMesh(
        geoSimpan('mb-tuts-geo', () => new BoxGeometry(1, 1, 1)),
        dop('#101115', 0.62),
        jml,
      )
      const mt = new Matrix4()
      const qt = new Quaternion()
      let ke = 0
      BARIS_TUTS.forEach((baris, b) => {
        let x = -KB_W / 2
        const z = KB_Z0 + (b + 0.5) * Q_TUTS
        for (const u of baris) {
          const w = u * P_TUTS - CELAH_TUTS
          mt.compose(new Vector3(x + (u * P_TUTS) / 2, MB_DEK + 0.2, z), qt, new Vector3(w, 0.6, Q_TUTS - CELAH_TUTS))
          tuts.setMatrixAt(ke++, mt)
          x += u * P_TUTS
        }
      })
      return tuts
    }).clone(),
  )
  const padZ = KB_Z0 + KB_D + 6.5 + 39
  dekDatar(
    geoSimpan('mb-alur', () => new ShapeGeometry(bentuk(garisLuar(134.9, 78.9, 6.4, 8)), 1)),
    dop('#7f8897', 0.5),
    MB_DEK + 0.08,
    padZ,
  )
  dekDatar(
    geoSimpan('mb-pad', () => new ShapeGeometry(bentuk(garisLuar(134, 78, 6, 8)), 1)),
    al,
    MB_DEK + 0.16,
    padZ,
  )

  const engsel = new Mesh(
    geoSimpan('mb-engsel', () => new CylinderGeometry(2.4, 2.4, W - 46, 16)),
    dop('#3a3f49', 0.45),
  )
  engsel.position.set(0, MB_ENGSEL[1] - 0.9, MB_ENGSEL[2] - 0.5)
  engsel.rotation.z = PI / 2
  mm.add(engsel)

  // tutup berputar di engsel: x = lebar, y = dari engsel ke atas, z+ = sisi layar
  const tutup = new Group()
  tutup.position.set(...MB_ENGSEL)
  mm.add(tutup)
  tutup.add(
    new Mesh(
      geoSimpan('mb-tutup', () =>
        sapuan(
          garisLuar(W, Ld, R, 12, 0, Ld / 2),
          [
            { t: [...busur(-1.4, -tl + 1.4, 1.4, -90, 0, 5), [0, -0.5]], m: 0 },
            {
              t: [
                [0, -0.5],
                [-0.25, -0.25],
              ],
              m: 1,
            },
            {
              t: [
                [-0.25, -0.25],
                [-0.95, -0.25],
              ],
              m: 0,
            },
          ],
          { awal: 0 },
        ),
      ),
      [al, poles],
    ),
  )
  tutup.add(
    new Mesh(
      geoSimpan('mb-kaca', () => sapuan(garisLuar(W - 1.9, Ld - 1.9, R - 0.95, 12, 0, Ld / 2), [{ t: [[0, -0.45], ...busur(-0.2, -0.2, 0.2, 0, 90, 3)], m: 0 }], { akhir: 0 })),
      kacaHitam(),
    ),
  )

  // layar: jalur menu hitam (poni menyatu) di atas, lalu bilah peramban, lalu halaman
  const bahanBilah = new MeshBasicMaterial({ map: bilahPeramban(o.host), toneMapped: false })
  const bilah = new Mesh(
    geoSimpan('mb-bilah', () => new PlaneGeometry(layarW, BILAH_MB)),
    bahanBilah,
  )
  bilah.position.set(0, PUNCAK_MB - BILAH_MB / 2, 0.06)
  tutup.add(bilah)
  const bahanHal = isiLayar()
  const layar = layarGulir(bahanHal, layarW / HAL_MB, o.halaman, o.ukuran)
  const hal = new Mesh(
    geoSimpan('mb-hal', () => new PlaneGeometry(layarW, HAL_MB)),
    bahanHal,
  )
  hal.position.set(0, DASAR_MB + HAL_MB / 2, 0.06)
  tutup.add(hal)

  return {
    root,
    tutup,
    layar,
    aturHost(h) {
      bahanBilah.map = bilahPeramban(h)
    },
    lepas() {
      layar.lepas()
      bahanBilah.dispose()
    },
  }
}

/** sudut tutup: 0 tertutup, 90 tegak */
export const sudutTutup = (derajat: number) => (90 - derajat) * D2R

// ---------------------------------------------------------------------------------------------------------------------
// Tablet & ponsel (sisi datar, chamfer, kaca depan; berdiri di lantai, titik asal di tengah sisi bawah)
// ---------------------------------------------------------------------------------------------------------------------
function badanPipih(kunci: string, W: number, H: number, D: number, R: number, warna: string, tepiKaca: number) {
  const h = D / 2
  const { al, poles } = bahanLogam(warna)
  const g = new Group()
  g.add(
    new Mesh(
      geoSimpan(kunci + '-badan', () =>
        sapuan(
          garisLuar(W, H, R, 12),
          [
            { t: [...busur(-1.5, -h + 1.5, 1.5, -90, 0, 5), [0, h - 0.7]], m: 0 },
            {
              t: [
                [0, h - 0.7],
                [-0.3, h - 0.4],
              ],
              m: 1,
            },
            {
              t: [
                [-0.3, h - 0.4],
                [-0.5, h - 0.4],
              ],
              m: 0,
            },
          ],
          { awal: 0 },
        ),
      ),
      [al, poles],
    ),
  )
  g.add(
    new Mesh(
      geoSimpan(kunci + '-kaca', () => sapuan(garisLuar(W - tepiKaca, H - tepiKaca, R - tepiKaca / 2, 12), [{ t: [[0, h - 0.6], ...busur(-0.35, h - 0.35, 0.35, 0, 90, 3)], m: 0 }], { akhir: 0 })),
      kacaHitam(),
    ),
  )
  return { g, al }
}

export type Pipih = { root: Group; miring: Group; layar: Layar; lepas: () => void; aturWarnaPuncak?: (top: string, fg: string) => void }

function bungkus(g: Group, H: number) {
  g.position.y = H / 2
  const root = new Group()
  const miring = new Group()
  miring.scale.setScalar(MM)
  miring.add(g)
  root.add(miring)
  return { root, miring }
}

export function buatTablet(o: { warna?: string; halaman: Texture; ukuran: number[] }): Pipih {
  // iPad Pro 11"
  const W = 177.5
  const H = 249.7
  const D = 5.3
  const lw = 160.48
  const lh = 232.83
  const { g } = badanPipih('tab', W, H, D, 11.9, o.warna ?? '#d9dde3', 0.9)
  const bahan = isiLayar()
  const layar = layarGulir(bahan, lw / lh, o.halaman, o.ukuran)
  const m = new Mesh(
    geoSimpan('tab-layar', () => bidangLayar(lw, lh, 4.5)),
    bahan,
  )
  m.position.z = D / 2 + 0.06
  g.add(m)
  return { ...bungkus(g, H), layar, lepas: () => layar.lepas() }
}

export function buatPonsel(o: { warna?: string; top: string; fg: string; halaman: Texture; ukuran: number[] }): Pipih {
  // iPhone 17 Pro
  const W = 71.9
  const H = 150
  const D = 8.75
  const lw = 66.59
  const lh = 144.78
  const r = 10.2
  const { g, al } = badanPipih('pho', W, H, D, 12.6, o.warna ?? '#35425c', 1.2)
  const bilahH = (26 / 218) * lw
  const halH = lh - bilahH
  // lapisan dasar berwarna puncak halaman = sudut atas membulat; bilah status (transparan) & halaman di atasnya
  const bahanDasar = new MeshBasicMaterial({ color: o.top, toneMapped: false })
  const dasar = new Mesh(
    geoSimpan('pho-dasar', () => bidangLayar(lw, lh, r)),
    bahanDasar,
  )
  dasar.position.z = D / 2 + 0.05
  g.add(dasar)
  const bahanBilah = new MeshBasicMaterial({ map: bilahStatus(o.fg), transparent: true, depthWrite: false, toneMapped: false })
  const bilah = new Mesh(
    geoSimpan('pho-bilah', () => new PlaneGeometry(lw, bilahH)),
    bahanBilah,
  )
  bilah.position.set(0, lh / 2 - bilahH / 2, D / 2 + 0.09)
  g.add(bilah)
  const bahan = isiLayar()
  const layar = layarGulir(bahan, lw / halH, o.halaman, o.ukuran)
  const hal = new Mesh(
    geoSimpan('pho-hal', () => bidangLayar(lw, halH, [0.01, 0.01, r, r], 0, -lh / 2 + halH / 2)),
    bahan,
  )
  hal.position.z = D / 2 + 0.09
  g.add(hal)
  // tombol samping
  const tombol = geoSimpan('pho-tombol', () => new BoxGeometry(1.3, 1, 2.9))
  ;[
    [-W / 2 + 0.1, H / 2 - 31, 7.4],
    [-W / 2 + 0.1, H / 2 - 45.5, 10.6],
    [-W / 2 + 0.1, H / 2 - 57.6, 10.6],
    [W / 2 - 0.1, H / 2 - 48.5, 17.5],
  ].forEach(([x, y, l]) => {
    const t = new Mesh(tombol, al)
    t.position.set(x, y, 0.55)
    t.scale.y = l
    g.add(t)
  })
  return {
    ...bungkus(g, H),
    layar,
    lepas() {
      layar.lepas()
      bahanDasar.dispose()
      bahanBilah.dispose()
    },
    aturWarnaPuncak(top, fg) {
      bahanDasar.color.set(top)
      bahanBilah.map = bilahStatus(fg)
    },
  }
}
