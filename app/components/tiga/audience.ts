// Perangkat 3D pemilih kebutuhan "Untuk siapa": tiap pilihan menampilkan demo yang cocok di perangkat yang paling pas.
// Saat pilihan berganti perangkatnya berputar dan kembali dengan isi baru, lalu halamannya bergulir pelan sekali. Gambar
// (public/layar, lihat LAYAR) baru diunduh saat tombolnya disorot/dipilih, jadi yang tidak dipilih tidak membebani.
import { Group, PerspectiveCamera, Scene } from 'three'
import LAYAR from './layar.json'
import { nyalakan, pasang } from './mesin'
import { D2R, bayanganLantai, belum, buatLaptop, buatPonsel, buatTablet, campur, halus, klem, muatTekstur, pegas, redam, sudutTutup, type Laptop, type Pipih, type Layar } from './perangkat'

type Alat = 'laptop' | 'tablet' | 'ponsel'
type Isi = { alat: Alat; berkas: string; ukuran: number[]; host?: string; top?: string; fg?: string }
const BUTUH = LAYAR as unknown as Record<string, Isi>

const FOV = 16
const ELEVASI = 9 * D2R
const CONDONG = -6 * D2R
const CY = 1.08
/** lebar & tinggi dunia yang harus muat di kanvas */
const MUAT_W = 3.6
const MUAT_H = 2.6
const RUPA: Record<Alat, { s: number; yaw: number }> = {
  laptop: { s: 1.02, yaw: 0.2 },
  tablet: { s: 0.98, yaw: -0.16 },
  ponsel: { s: 1.56, yaw: -0.16 },
}
const urlDari = (k: string) => `/layar/${BUTUH[k].berkas}.webp`
// berputar masuk dengan sedikit lewat lalu kembali
const lewat = (t: number) => {
  const c = 1.15
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
}

export async function pasangAudience(kanvas: HTMLCanvasElement, batal: () => boolean): Promise<(() => void) | null> {
  const akar = kanvas.closest('section') as HTMLElement | null
  const daftar = akar?.querySelector('[role="tablist"]')
  if (!akar || !daftar || !nyalakan()) return null
  const kunciAktif = () => (daftar.querySelector('[aria-selected="true"]')?.id ?? '').replace(/^.*-t-/, '')
  let kini = kunciAktif()
  if (!BUTUH[kini]) kini = Object.keys(BUTUH)[0]
  let tx0
  try {
    tx0 = await muatTekstur(urlDari(kini))
  } catch {
    return null
  }
  if (batal()) return null

  const scene = new Scene()
  const rig = new Group()
  const putar = new Group()
  rig.add(putar)
  scene.add(rig)
  const camera = new PerspectiveCamera(FOV, 1, 1, 50)

  const alat: Partial<Record<Alat, { root: Group; layar: Layar; lap?: Laptop; pipih?: Pipih }>> = {}
  const pakai = (k: string, tx: Awaited<typeof tx0>) => {
    const d = BUTUH[k]
    let a = alat[d.alat]
    if (a) {
      a.layar.ganti(tx, d.ukuran)
      if (d.host) a.lap?.aturHost(d.host)
      if (d.top && d.fg) a.pipih?.aturWarnaPuncak?.(d.top, d.fg)
    } else {
      if (d.alat === 'laptop') {
        const lap = buatLaptop({ warna: '#d3d9e2', host: d.host ?? '', halaman: tx, ukuran: d.ukuran })
        lap.root.add(bayanganLantai(3.75, 2.9, 0.02))
        lap.root.position.z = -0.3
        a = { root: lap.root, layar: lap.layar, lap }
      } else if (d.alat === 'tablet') {
        const pipih = buatTablet({ halaman: tx, ukuran: d.ukuran })
        pipih.miring.rotation.x = CONDONG
        pipih.root.add(bayanganLantai(2.5, 0.75, 0.04, 0.85))
        a = { root: pipih.root, layar: pipih.layar, pipih }
      } else {
        const pipih = buatPonsel({ top: d.top ?? '#fff', fg: d.fg ?? '#000', halaman: tx, ukuran: d.ukuran })
        pipih.miring.rotation.x = CONDONG
        pipih.root.add(bayanganLantai(1.2, 0.55, 0.05, 0.9))
        a = { root: pipih.root, layar: pipih.layar, pipih }
      }
      a.root.scale.setScalar(RUPA[d.alat].s)
      a.root.rotation.y = RUPA[d.alat].yaw
      alat[d.alat] = a
      putar.add(a.root)
    }
    for (const n of Object.keys(alat) as Alat[]) alat[n]!.root.visible = n === d.alat
    return a
  }
  let tampil = pakai(kini, tx0)

  const ry = pegas()
  const rx = pegas()
  const buka = pegas(1)
  let px = 0
  let py = 0
  let fase: 'diam' | 'keluar' | 'tunggu' | 'masuk' = 'diam'
  let mulai = 0
  let sudut = 0
  let berikut: string | null = null
  // gulir pelan isi layar setelah perangkat tiba
  let panMulai = performance.now() + 500
  const PAN_LAMA = 3600
  const PAN_KE = 0.6
  const adaSorot = matchMedia('(hover: hover)').matches

  const panggung = await pasang({
    kanvas,
    akar,
    kelas: 'aud-3d',
    scene,
    camera,
    ikutGulir: true,
    ukuran(w, h) {
      camera.aspect = w / h
      const t = Math.tan((FOV / 2) * D2R)
      const d = Math.max(MUAT_W / 2 / (t * camera.aspect), MUAT_H / 2 / t)
      camera.position.set(0, CY + d * Math.sin(ELEVASI), d * Math.cos(ELEVASI))
      camera.lookAt(0, CY, 0)
      camera.updateProjectionMatrix()
    },
    langkah(now, dt, pertama) {
      const vh = window.innerHeight
      const r = kanvas.getBoundingClientRect()
      const lintas = klem((vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2), -1, 1)
      const sRy = lintas * 0.16 + px * 0.2
      const sRx = py * 0.06
      if (pertama) {
        ry.x = sRy
        rx.x = sRx
      }
      redam(ry, sRy, 0.3, dt)
      redam(rx, sRx, 0.3, dt)
      rig.rotation.set(rx.x, ry.x, 0)

      let hidup = belum(ry, sRy) || belum(rx, sRx)
      if (fase === 'keluar') {
        const t = klem((now - mulai) / 210)
        sudut = t * t * 90 * D2R
        hidup = true
        if (t >= 1) {
          fase = 'tunggu'
          const k = berikut as string
          berikut = null
          muatTekstur(urlDari(k))
            .then((tx) => {
              tampil = pakai(k, tx)
              kini = k
              buka.x = 0.35
              fase = 'masuk'
              mulai = performance.now()
              panMulai = mulai + 700
              // pilihan sudah berganti lagi selama gambar dimuat
              const a = kunciAktif()
              if (a !== k && BUTUH[a]) berikut = a
              panggung?.minta()
            })
            .catch(() => {
              fase = 'masuk'
              mulai = performance.now()
              panggung?.minta()
            })
        }
      } else if (fase === 'masuk') {
        const t = klem((now - mulai) / 560)
        sudut = (-90 * D2R) * (1 - lewat(t))
        hidup = true
        if (t >= 1) {
          sudut = 0
          fase = 'diam'
          if (berikut && berikut !== kini) mulaiKeluar()
        }
      }
      putar.rotation.y = sudut

      if (tampil.lap) {
        redam(buka, 1, 0.3, dt)
        tampil.lap.tutup.rotation.x = sudutTutup(campur(66, 105, buka.x))
        if (belum(buka, 1)) hidup = true
      }
      const tPan = klem((now - panMulai) / PAN_LAMA)
      tampil.layar.atur(halus(tPan) * PAN_KE)
      if (tPan < 1) hidup = true
      return hidup
    },
    lepas() {
      window.setTimeout(lepasPeristiwa)
      for (const n of Object.keys(alat) as Alat[]) (alat[n]!.lap ?? alat[n]!.pipih)?.lepas()
    },
  })
  if (!panggung) return null

  function mulaiKeluar() {
    fase = 'keluar'
    mulai = performance.now()
    panggung?.minta()
  }
  const mo = new MutationObserver(() => {
    const k = kunciAktif()
    if (!BUTUH[k] || k === kini) {
      if (k === kini) berikut = null
      return
    }
    berikut = k
    if (fase === 'diam') mulaiKeluar()
  })
  mo.observe(daftar, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] })
  // gambar diunduh saat tombol disorot/difokus, supaya sudah siap ketika dipilih
  const onSiapkan = (ev: Event) => {
    const k = ((ev.target as Element | null)?.closest?.('[role="tab"]')?.id ?? '').replace(/^.*-t-/, '')
    if (BUTUH[k]) muatTekstur(urlDari(k)).catch(() => {})
  }
  daftar.addEventListener('pointerover', onSiapkan, { passive: true })
  daftar.addEventListener('focusin', onSiapkan)
  const onGerak = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    const k = kanvas.getBoundingClientRect()
    px = klem((ev.clientX - (k.left + k.width / 2)) / 600, -1, 1)
    py = klem((ev.clientY - (k.top + k.height / 2)) / 500, -1, 1)
    panggung.minta()
  }
  const onKeluar = () => {
    px = 0
    py = 0
    panggung.minta()
  }
  if (adaSorot) {
    akar.addEventListener('pointermove', onGerak, { passive: true })
    akar.addEventListener('pointerleave', onKeluar)
  }
  function lepasPeristiwa() {
    mo.disconnect()
    daftar?.removeEventListener('pointerover', onSiapkan)
    daftar?.removeEventListener('focusin', onSiapkan)
    akar?.removeEventListener('pointermove', onGerak)
    akar?.removeEventListener('pointerleave', onKeluar)
  }

  return panggung.lepas
}
