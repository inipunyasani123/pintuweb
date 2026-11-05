// Trio perangkat 3D kartu "Demo pilihan" (lima kartu, tiap demo dengan susunan & warna sendiri). Gerak: laptop membuka dan
// tablet + ponsel masuk mengikuti gulir; trio menoleh mengikuti kursor; isi layar bergulir saat kartu disorot/difokus
// (layar sentuh: mengikuti gulir). Bila gagal atau tak layak, trio CSS (DeviceTrio.tsx) tetap tampil.
import { Group, PerspectiveCamera, Scene } from 'three'
import { pasang, nyalakan } from './mesin'
import { D2R, bayanganLantai, belum, buatLaptop, buatPonsel, buatTablet, campur, halus, jeda, klem, muatTekstur, pegas, redam, sudutTutup } from './perangkat'

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
    lega: { lebar: 5.3, cy: 0.86, lap: { x: -1.03, z: -0.72, yaw: 0.09, s: 1 }, tab: { x: 0.98, z: 0.46, yaw: -0.13, s: 0.74 }, pho: { x: 1.86, z: 1.0, yaw: -0.22, s: 0.94 } },
    rapat: { lebar: 4.45, cy: 0.92, lap: { x: -0.56, z: -0.75, yaw: 0.07, s: 1 }, tab: { x: 0.62, z: 0.58, yaw: -0.1, s: 0.72 }, pho: { x: 1.4, z: 1.08, yaw: -0.18, s: 1 } },
  },
  // menu digital dibuka di ponsel: ponsel paling depan & besar
  bakso: {
    lap: '#d8d4cc',
    tab: '#d9dde3',
    pho: '#e8742f',
    rapat: { lebar: 4.5, cy: 0.98, lap: { x: -0.72, z: -0.9, yaw: 0.12, s: 0.96 }, tab: { x: 0.36, z: 0.1, yaw: -0.06, s: 0.68 }, pho: { x: 1.22, z: 1.12, yaw: -0.2, s: 1.3 } },
  },
  // reservasi: laptop di tengah, diapit tablet & ponsel
  hotel: {
    lap: '#d3d9e2',
    tab: '#e1dccf',
    pho: '#dcdddd',
    rapat: { lebar: 4.7, cy: 0.9, lap: { x: 0.02, z: -0.8, yaw: 0, s: 1 }, tab: { x: -1.42, z: 0.5, yaw: 0.26, s: 0.66 }, pho: { x: 1.5, z: 0.72, yaw: -0.3, s: 1 } },
  },
  // link in bio: satu ponsel di tengah, yang lain di belakangnya
  jajan: {
    lap: '#d6d2e4',
    tab: '#d9dde3',
    pho: '#35425c',
    rapat: { lebar: 4.5, cy: 1.02, lap: { x: -0.98, z: -1.0, yaw: 0.24, s: 0.92 }, tab: { x: 1.2, z: -0.2, yaw: -0.3, s: 0.68 }, pho: { x: 0.14, z: 1.05, yaw: -0.04, s: 1.42 } },
  },
  // properti mewah: susunan cermin kartu Tanur, laptop gelap
  lumora: {
    lap: '#2f3642',
    tab: '#343436',
    pho: '#dcdddd',
    rapat: { lebar: 4.45, cy: 0.92, lap: { x: 0.56, z: -0.75, yaw: -0.09, s: 1 }, tab: { x: -0.62, z: 0.58, yaw: 0.1, s: 0.72 }, pho: { x: -1.42, z: 1.08, yaw: 0.2, s: 1 } },
  },
}
const FOV = 16
const ELEVASI = 9 * D2R
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
  lap.root.add(bayanganLantai(3.75, 2.9, 0.02))
  tab.root.add(bayanganLantai(2.5, 0.75, 0.04, 0.85))
  pho.root.add(bayanganLantai(1.2, 0.55, 0.05, 0.9))

  const scene = new Scene()
  const rig = new Group()
  rig.add(lap.root, tab.root, pho.root)
  scene.add(rig)
  const camera = new PerspectiveCamera(FOV, 2, 1, 50)

  let L = gaya.rapat
  const ry = pegas()
  const rx = pegas()
  const buka = pegas()
  const angkat = pegas()
  const geser = pegas()
  const panSentuh = pegas()
  let px = 0
  let py = 0
  let disorot = false
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
      const d = L.lebar / 2 / (Math.tan((FOV / 2) * D2R) * camera.aspect)
      camera.position.set(0, L.cy + d * Math.sin(ELEVASI), d * Math.cos(ELEVASI))
      camera.lookAt(0, L.cy, 0)
      camera.updateProjectionMatrix()
    },
    langkah(now, dt, pertama) {
      const vh = window.innerHeight
      const r = akar.getBoundingClientRect()
      const c = r.top + r.height / 2
      // p: 0 saat trio baru masuk dari bawah, 1 saat tengahnya mencapai 60% tinggi layar
      const p = klem((vh * 1.02 - c) / (vh * 0.42))
      const e = 1 - (1 - p) ** 3
      // -1..1 sepanjang trio melintasi layar
      const lintas = klem((vh / 2 - c) / (vh / 2 + r.height / 2), -1, 1)

      // kartu dengan laptop di kanan menoleh ke arah sebaliknya saat masuk
      const arah = L.lap.x > 0 ? -1 : 1
      const sRy = -0.05 * arah + lintas * 0.12 * arah - (1 - e) * 0.2 * arah + px * 0.16
      const sRx = py * 0.06
      const sAngkat = disorot ? 1 : 0
      if (pertama) {
        ry.x = sRy
        rx.x = sRx
        buka.x = e
      }
      redam(ry, sRy, 0.3, dt)
      redam(rx, sRx, 0.3, dt)
      redam(buka, e, 0.22, dt)
      redam(angkat, sAngkat, 0.26, dt)
      redam(geser, px, 0.3, dt)

      rig.rotation.set(rx.x, ry.x, 0)
      lap.tutup.rotation.x = sudutTutup(campur(68, 106, buka.x))
      const u = 1 - buka.x
      const sisi = Math.sign(L.tab.x - L.lap.x) || 1
      tab.root.position.set(L.tab.x + sisi * u * 0.5 + geser.x * 0.03, angkat.x * 0.03, L.tab.z - u * 0.45 + angkat.x * 0.1)
      const sisiP = Math.sign(L.pho.x - L.lap.x) || 1
      pho.root.position.set(L.pho.x + sisiP * u * 0.85 + geser.x * 0.06, angkat.x * 0.05, L.pho.z - u * 0.7 + angkat.x * 0.2)

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
        redam(panSentuh, s, 0.2, dt)
        for (const g of gulir) g.l.atur(panSentuh.x)
        if (belum(panSentuh, s)) hidup = true
      }
      return hidup || belum(ry, sRy) || belum(rx, sRx) || belum(buka, e) || belum(angkat, sAngkat) || belum(geser, px)
    },
    lepas() {
      window.setTimeout(lepasPeristiwa)
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
  function lepasPeristiwa() {
    kartu.removeEventListener('pointermove', onGerak)
    kartu.removeEventListener('pointerleave', onKeluar)
    kartu.removeEventListener('focusin', onKeluar)
    kartu.removeEventListener('focusout', onKeluar)
  }

  return panggung.lepas
}
