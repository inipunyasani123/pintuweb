// Trio perangkat 3D kartu "Demo pilihan" (lima kartu, tiap demo dengan susunan & warna sendiri). Gerak: laptop membuka dan
// tablet + ponsel masuk mengikuti gulir; trio menoleh mengikuti kursor; isi layar bergulir saat kartu disorot/difokus
// (layar sentuh: mengikuti gulir). Bila gagal atau tak layak, trio CSS (DeviceTrio.tsx) tetap tampil.
import { Group, PerspectiveCamera, Scene } from 'three'
import { pasang, nyalakan } from './mesin'
import { D2R, bayanganLantai, belum, buatLaptop, buatPonsel, buatTablet, cahayaStudio, campur, halus, jeda, klem, lantaiBayang, lentur, muatTekstur, pegas, sudutTutup } from './perangkat'

export type Dev = 'desktop' | 'tablet' | 'phone'
export type IsiTrio = {
  slug: string
  host: string
  /** warna puncak halaman (bilah status ponsel) */
  top: string
  fg: string
  /** ukuran asli tangkapan layar */
  ukuran: Record<Dev, number[]>
  /** alamat varian gambar untuk lebar piksel tertentu */
  gambar: (dev: Dev, lebarPiksel: number) => string
}

type Pose = { x: number; z: number; yaw: number; s: number }
type Susunan = { lebar: number; cy: number; lap: Pose; tab: Pose; pho: Pose }
type Gaya = { lap: string; tab: string; pho: string; lega?: Susunan; rapat: Susunan }

// LEGA = kartu utama ≥640px (rasio ±2:1), RAPAT = selain itu (±1,43:1), sama dengan .trio-main / .trio-tight.
const GAYA: Record<string, Gaya> = {
  tanur: {
    lap: '#d3d9e2',
    tab: '#d9dde3',
    pho: '#35425c',
    lega: { lebar: 5.6, cy: 0.84, lap: { x: -1.14, z: -0.86, yaw: 0.16, s: 1 }, tab: { x: 0.8, z: 0.34, yaw: -0.2, s: 0.74 }, pho: { x: 1.66, z: 1.02, yaw: -0.36, s: 0.9 } },
    rapat: { lebar: 4.6, cy: 0.9, lap: { x: -0.58, z: -0.86, yaw: 0.12, s: 1 }, tab: { x: 0.58, z: 0.5, yaw: -0.16, s: 0.72 }, pho: { x: 1.38, z: 1.12, yaw: -0.3, s: 0.96 } },
  },
  // menu digital dibuka di ponsel: ponsel paling depan & besar
  bakso: {
    lap: '#d8d4cc',
    tab: '#d9dde3',
    pho: '#e8742f',
    rapat: { lebar: 4.65, cy: 0.96, lap: { x: -0.74, z: -1.0, yaw: 0.18, s: 0.96 }, tab: { x: 0.34, z: 0.0, yaw: -0.1, s: 0.68 }, pho: { x: 1.2, z: 1.12, yaw: -0.3, s: 1.24 } },
  },
  // reservasi: laptop di tengah, diapit tablet & ponsel
  hotel: {
    lap: '#d3d9e2',
    tab: '#e1dccf',
    pho: '#dcdddd',
    rapat: { lebar: 4.85, cy: 0.88, lap: { x: 0.02, z: -0.9, yaw: 0, s: 1 }, tab: { x: -1.42, z: 0.5, yaw: 0.34, s: 0.66 }, pho: { x: 1.5, z: 0.72, yaw: -0.4, s: 0.98 } },
  },
  // link in bio: satu ponsel di tengah, yang lain di belakangnya
  jajan: {
    lap: '#d6d2e4',
    tab: '#d9dde3',
    pho: '#35425c',
    rapat: { lebar: 4.65, cy: 1.0, lap: { x: -1.0, z: -1.1, yaw: 0.3, s: 0.92 }, tab: { x: 1.22, z: -0.32, yaw: -0.38, s: 0.68 }, pho: { x: 0.14, z: 1.05, yaw: -0.12, s: 1.36 } },
  },
  // properti mewah: susunan cermin kartu Tanur, laptop gelap
  lumora: {
    lap: '#2f3642',
    tab: '#343436',
    pho: '#dcdddd',
    rapat: { lebar: 4.6, cy: 0.9, lap: { x: 0.58, z: -0.86, yaw: -0.14, s: 1 }, tab: { x: -0.6, z: 0.5, yaw: 0.18, s: 0.72 }, pho: { x: -1.4, z: 1.12, yaw: 0.32, s: 0.96 } },
  },
}
// lensa lebih lebar dari foto produk biasa: yang dekat terasa lebih dekat
const FOV = 21
const ELEVASI = 10 * D2R
const CONDONG = -6 * D2R

/** Menyalakan trio 3D di `kanvas` (anak .trio). Mengembalikan pelepas, atau null bila gagal/dibatalkan. */
export async function pasangTrio3D(kanvas: HTMLCanvasElement, isi: IsiTrio, batal: () => boolean): Promise<(() => void) | null> {
  const gaya = GAYA[isi.slug]
  if (!gaya || !nyalakan()) return null
  const akar = kanvas.parentElement as HTMLElement
  const kartu = (kanvas.closest('.work') as HTMLElement | null) ?? akar
  const dpr = window.devicePixelRatio || 1

  // varian gambar menurut ukuran tampil layar di trio CSS: berkas yang sama dengan pilihan srcset-nya, jadi tidak terunduh dua kali
  const muat = (dev: Dev, pilih: string) => muatTekstur(isi.gambar(dev, ((akar.querySelector(pilih) as HTMLElement | null)?.getBoundingClientRect().width ?? 300) * dpr))
  let txL, txT, txP
  try {
    ;[txL, txT, txP] = await Promise.all([muat('desktop', '.dv-lap .win'), muat('tablet', '.dv-tab .win'), muat('phone', '.dv-pho .win')])
  } catch {
    return null
  }
  if (batal()) return null
  await jeda()

  const lap = buatLaptop({ warna: gaya.lap, host: isi.host, halaman: txL, ukuran: isi.ukuran.desktop })
  const tab = buatTablet({ warna: gaya.tab, halaman: txT, ukuran: isi.ukuran.tablet })
  const pho = buatPonsel({ warna: gaya.pho, top: isi.top, fg: isi.fg, halaman: txP, ukuran: isi.ukuran.phone })
  tab.miring.rotation.x = CONDONG
  pho.miring.rotation.x = CONDONG
  lap.root.add(bayanganLantai(3.75, 2.9, 0.02, 0.7))
  tab.root.add(bayanganLantai(2.3, 0.6, 0.04, 0.7))
  pho.root.add(bayanganLantai(1.1, 0.46, 0.05, 0.7))

  const scene = new Scene()
  const rig = new Group()
  rig.add(lap.root, tab.root, pho.root, lantaiBayang(8.4, 6.4))
  scene.add(rig)
  // lampu utama dari sisi perangkat terdepan, supaya bayangannya jatuh ke perangkat di belakangnya;
  // lampu tepi berwarna jenis demonya (--k pada kartu)
  const utama = isi.slug === 'hotel' ? 0.6 : isi.slug === 'lumora' ? -1 : 1
  const rendah = window.innerWidth < 640
  const cahaya = cahayaStudio({
    dari: [3.2 * utama, 7, 6],
    rim: getComputedStyle(kartu).getPropertyValue('--k').trim() || undefined,
    kotak: [-4.4, 4.4, 3.4, -2.4],
    peta: rendah ? [448, 360] : [640, 512],
  })
  scene.add(cahaya.g)
  const camera = new PerspectiveCamera(FOV, 2, 1, 50)

  let L = gaya.rapat
  const ry = pegas()
  const rx = pegas()
  const buka = pegas()
  const masukT = pegas()
  const masukP = pegas()
  const angkat = pegas()
  const geserX = pegas()
  const geserY = pegas()
  const panSentuh = pegas()
  const kamera = pegas()
  const miring = pegas()
  const tekan = pegas()
  let jarak = 10
  let yLalu = window.scrollY
  let px = 0
  let py = 0
  let disorot = false
  let ditekan = false
  const adaSorot = matchMedia('(hover: hover)').matches
  const gulir = [
    { l: lap.layar, x: 0, dari: 0, ke: 0, mulai: 0, lama: 1, tunggu: 0.15, dur: 6 },
    { l: tab.layar, x: 0, dari: 0, ke: 0, mulai: 0, lama: 1, tunggu: 0.35, dur: 5.5 },
    { l: pho.layar, x: 0, dari: 0, ke: 0, mulai: 0, lama: 1, tunggu: 0.55, dur: 5 },
  ]

  const panggung = await pasang({
    kanvas,
    akar,
    kelas: 'trio-3d',
    scene,
    camera,
    ikutGulir: true,
    ukuran(w, h) {
      const a = akar.getBoundingClientRect()
      L = a.width / a.height > 1.7 && gaya.lega ? gaya.lega : gaya.rapat
      lap.root.position.set(L.lap.x, 0, L.lap.z)
      lap.root.rotation.y = L.lap.yaw
      lap.root.scale.setScalar(L.lap.s)
      tab.root.rotation.y = L.tab.yaw
      tab.root.scale.setScalar(L.tab.s)
      pho.root.rotation.y = L.pho.yaw
      pho.root.scale.setScalar(L.pho.s)
      camera.aspect = w / h
      jarak = L.lebar / 2 / (Math.tan((FOV / 2) * D2R) * camera.aspect)
      camera.updateProjectionMatrix()
    },
    langkah(now, dt, pertama) {
      const vh = window.innerHeight
      const r = akar.getBoundingClientRect()
      const c = r.top + r.height / 2
      // p: 0 saat trio baru masuk dari bawah, 1 saat tengahnya mencapai 60% tinggi layar; tiap perangkat menyusul bergantian
      const p = klem((vh * 1.02 - c) / (vh * 0.42))
      const e = 1 - (1 - klem(p / 0.7)) ** 3
      const eT = 1 - (1 - klem((p - 0.14) / 0.7)) ** 3
      const eP = 1 - (1 - klem((p - 0.28) / 0.72)) ** 3
      // -1..1 sepanjang trio melintasi layar
      const lintas = klem((vh / 2 - c) / (vh / 2 + r.height / 2), -1, 1)
      // laju gulir: seluruh trio condong sedikit, seakan punya bobot, lalu kembali
      const y = window.scrollY
      const laju = pertama ? 0 : klem((y - yLalu) / Math.max(dt, 1 / 120) / 2600, -1, 1)
      yLalu = y

      // kartu dengan laptop di kanan menoleh ke arah sebaliknya saat masuk
      const arah = L.lap.x > 0 ? -1 : 1
      const sRy = -0.03 * arah + lintas * 0.12 * arah - (1 - e) * 0.2 * arah + px * 0.13
      const sRx = py * 0.06
      const sAngkat = disorot ? 1 : 0
      const sTekan = ditekan ? 1 : 0
      if (pertama) {
        ry.x = sRy
        rx.x = sRx
        buka.x = e
        masukT.x = eT
        masukP.x = eP
        kamera.x = lintas
      }
      lentur(ry, sRy, 0.46, 0.88, dt)
      lentur(rx, sRx, 0.46, 0.88, dt)
      lentur(buka, e, 0.6, 0.84, dt)
      lentur(masukT, eT, 0.56, 0.82, dt)
      lentur(masukP, eP, 0.52, 0.8, dt)
      lentur(angkat, sAngkat, 0.42, 0.78, dt)
      lentur(geserX, px, 0.5, 0.95, dt)
      lentur(geserY, py, 0.5, 0.95, dt)
      lentur(kamera, lintas, 0.5, 1, dt)
      lentur(miring, laju, 0.36, 0.72, dt)
      // menekan menanggapi seketika, melepas memantul pelan
      lentur(tekan, sTekan, ditekan ? 0.16 : 0.4, ditekan ? 1 : 0.68, dt)

      rig.rotation.set(rx.x + miring.x * 0.05, ry.x, 0)
      rig.scale.setScalar(1 - tekan.x * 0.022)
      lap.tutup.rotation.x = sudutTutup(campur(62, 106, buka.x))
      const sisi = Math.sign(L.tab.x - L.lap.x) || 1
      const sisiP = Math.sign(L.pho.x - L.lap.x) || 1
      const uT = 1 - masukT.x
      const uP = 1 - masukP.x
      // yang lebih dekat bergeser & menoleh lebih banyak; saat disorot trio sedikit merenggang
      tab.root.position.set(L.tab.x + sisi * (uT * 0.55 + angkat.x * 0.03) + geserX.x * 0.02, 0, L.tab.z - uT * 0.5 + angkat.x * 0.14)
      tab.root.rotation.y = L.tab.yaw + geserX.x * 0.05 + sisi * uT * 0.5
      pho.root.position.set(L.pho.x + sisiP * (uP * 0.9 + angkat.x * 0.05) + geserX.x * 0.03, 0, L.pho.z - uP * 0.75 + angkat.x * 0.3)
      pho.root.rotation.y = L.pho.yaw + geserX.x * 0.12 + sisiP * uP * 0.75
      pho.root.rotation.x = miring.x * 0.05

      // kamera: pandangan sedikit naik-turun mengikuti posisi kartu di layar, dan bergeser mengikuti kursor
      const el = ELEVASI - kamera.x * 3.4 * D2R - geserY.x * 1.4 * D2R
      camera.position.set(geserX.x * 0.3, L.cy + jarak * Math.sin(el), jarak * Math.cos(el))
      camera.lookAt(0, L.cy, 0)
      // lampu utama mengikuti kursor: kilap & bayangan ikut bergerak
      cahaya.utama.position.set(cahaya.dari[0] + geserX.x * 2.2, cahaya.dari[1] - geserY.x * 1.2, cahaya.dari[2])

      let hidup = false
      if (adaSorot) {
        for (const g of gulir) {
          const t = klem((now - g.mulai) / g.lama)
          g.x = campur(g.dari, g.ke, halus(t))
          g.l.atur(g.x)
          if (t < 1) hidup = true
        }
      } else {
        // layar sentuh: isi layar mengikuti lintasan kartu, seperti view-timeline trio CSS
        const k = kartu.getBoundingClientRect()
        const s = klem((vh - k.bottom) / Math.max(1, vh - k.height))
        lentur(panSentuh, s, 0.4, 1, dt)
        for (const g of gulir) g.l.atur(panSentuh.x)
        if (belum(panSentuh, s)) hidup = true
      }
      return hidup || belum(ry, sRy) || belum(rx, sRx) || belum(buka, e) || belum(masukT, eT) || belum(masukP, eP) || belum(angkat, sAngkat) || belum(geserX, px) || belum(geserY, py) || belum(kamera, lintas) || belum(miring, laju) || belum(tekan, sTekan)
    },
    lepas() {
      window.setTimeout(lepasPeristiwa)
      cahaya.lepas()
      lap.lepas()
      tab.lepas()
      pho.lepas()
    },
  })
  if (!panggung) return null

  const setSorot = (on: boolean) => {
    if (on === disorot) return
    disorot = on
    const now = performance.now()
    for (const g of gulir) {
      g.dari = g.x
      g.ke = on ? 1 : 0
      g.mulai = on ? now + g.tunggu * 1000 : now
      g.lama = on ? g.dur * 1000 : 900
    }
    if (!on) {
      px = 0
      py = 0
    }
    panggung.minta()
  }
  const onGerak = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    const k = kartu.getBoundingClientRect()
    px = klem(((ev.clientX - k.left) / k.width) * 2 - 1, -1, 1)
    py = klem(((ev.clientY - k.top) / k.height) * 2 - 1, -1, 1)
    setSorot(true)
    panggung.minta()
  }
  const onKeluar = () => setSorot(kartu.matches(':focus-visible'))
  if (adaSorot) {
    kartu.addEventListener('pointermove', onGerak, { passive: true })
    kartu.addEventListener('pointerleave', onKeluar)
  }
  kartu.addEventListener('focusin', onKeluar)
  kartu.addEventListener('focusout', onKeluar)
  // tanggapan sejak jari/kursor menekan, bukan saat dilepas
  const onTekan = () => {
    ditekan = true
    panggung.minta()
    window.addEventListener('pointerup', onLepasTekan, { once: true })
    window.addEventListener('pointercancel', onLepasTekan, { once: true })
  }
  const onLepasTekan = () => {
    ditekan = false
    panggung.minta()
  }
  kartu.addEventListener('pointerdown', onTekan, { passive: true })
  function lepasPeristiwa() {
    kartu.removeEventListener('pointerdown', onTekan)
    kartu.removeEventListener('pointermove', onGerak)
    kartu.removeEventListener('pointerleave', onKeluar)
    kartu.removeEventListener('focusin', onKeluar)
    kartu.removeEventListener('focusout', onKeluar)
  }

  return panggung.lepas
}
