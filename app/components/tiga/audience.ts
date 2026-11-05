// Perangkat 3D pemilih kebutuhan "Untuk siapa": tiap pilihan menampilkan demo yang cocok di perangkat yang paling pas.
// Saat pilihan berganti perangkatnya berputar dan kembali dengan isi baru, lalu halamannya bergulir pelan sekali. Gambar
// (public/layar, lihat LAYAR) baru diunduh saat tombolnya disorot/dipilih, jadi yang tidak dipilih tidak membebani.
import { Group, PerspectiveCamera, Scene } from 'three'
import LAYAR from './layar.json'
import { nyalakan, pasang } from './mesin'
import { D2R, bayanganLantai, belum, buatLaptop, buatPonsel, buatTablet, cahayaStudio, campur, halus, klem, lantaiBayang, lentur, muatTekstur, pegas, sudutTutup, type Laptop, type Pipih, type Layar } from './perangkat'

type Alat = 'laptop' | 'tablet' | 'ponsel'
type Isi = { alat: Alat; berkas: string; ukuran: number[]; host?: string; top?: string; fg?: string }
const BUTUH = LAYAR as unknown as Record<string, Isi>

const FOV = 21
const ELEVASI = 10 * D2R
const CONDONG = -6 * D2R
const CY = 1.08
/** lebar & tinggi dunia yang harus muat di kanvas */
const MUAT_W = 3.6
const MUAT_H = 2.6
// mulai 640px kanvas lebih besar dari tempatnya (lihat .aud-panggung canvas), supaya laptop yang berputar tidak terpotong
const MUAT_W_LEGA = 5.18
const MUAT_H_LEGA = 4.03
const RUPA: Record<Alat, { s: number; yaw: number }> = {
  laptop: { s: 1.02, yaw: 0.28 },
  tablet: { s: 0.98, yaw: -0.26 },
  ponsel: { s: 1.56, yaw: -0.3 },
}
const urlDari = (k: string) => `/layar/${BUTUH[k].berkas}.webp`
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
  rig.add(lantaiBayang(6, 5))
  scene.add(rig)
  const cahaya = cahayaStudio({ dari: [3, 7, 6], rim: '#7f9dff', kotak: [-3.4, 3.4, 3.4, -2.4], peta: window.innerWidth < 640 ? [384, 384] : [512, 512] })
  scene.add(cahaya.g)
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
        lap.root.add(bayanganLantai(3.75, 2.9, 0.02, 0.7))
        lap.root.position.z = -0.3
        a = { root: lap.root, layar: lap.layar, lap }
      } else if (d.alat === 'tablet') {
        const pipih = buatTablet({ halaman: tx, ukuran: d.ukuran })
        pipih.miring.rotation.x = CONDONG
        pipih.root.add(bayanganLantai(2.3, 0.6, 0.04, 0.7))
        a = { root: pipih.root, layar: pipih.layar, pipih }
      } else {
        const pipih = buatPonsel({ top: d.top ?? '#fff', fg: d.fg ?? '#000', halaman: tx, ukuran: d.ukuran })
        pipih.miring.rotation.x = CONDONG
        pipih.root.add(bayanganLantai(1.1, 0.46, 0.05, 0.7))
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
  const geserX = pegas()
  const geserY = pegas()
  const kamera = pegas()
  const tekan = pegas()
  // sudut putar: pegas yang sasarannya berubah kapan saja, jadi pilihan berikutnya bisa menyela di tengah putaran
  const putarS = pegas()
  let px = 0
  let py = 0
  let ditekan = false
  let berikut: string | null = null
  let menunggu = false
  let jarak = 10
  // gulir pelan isi layar setelah perangkat tiba
  let panMulai = performance.now() + 500
  const PAN_LAMA = 3600
  const PAN_KE = 0.6
  const SISI = 90 * D2R
  const TUKAR = 74 * D2R
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
      const lega = window.innerWidth >= 640
      jarak = Math.max((lega ? MUAT_W_LEGA : MUAT_W) / 2 / (t * camera.aspect), (lega ? MUAT_H_LEGA : MUAT_H) / 2 / t)
      camera.updateProjectionMatrix()
    },
    langkah(now, dt, pertama) {
      const vh = window.innerHeight
      const r = kanvas.getBoundingClientRect()
      const lintas = klem((vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2), -1, 1)
      const sRy = lintas * 0.16 + px * 0.22
      const sRx = py * 0.07
      const sTekan = ditekan ? 1 : 0
      if (pertama) {
        ry.x = sRy
        rx.x = sRx
        kamera.x = lintas
      }
      lentur(ry, sRy, 0.46, 0.88, dt)
      lentur(rx, sRx, 0.46, 0.88, dt)
      lentur(geserX, px, 0.5, 0.95, dt)
      lentur(geserY, py, 0.5, 0.95, dt)
      lentur(kamera, lintas, 0.5, 1, dt)
      lentur(tekan, sTekan, ditekan ? 0.16 : 0.4, ditekan ? 1 : 0.68, dt)
      rig.rotation.set(rx.x, ry.x, 0)
      rig.scale.setScalar(1 - tekan.x * 0.03)

      // keluar: berputar sampai hampir menyamping; isinya ditukar di situ (nyaris tak terlihat), lalu masuk dari sisi
      // sebaliknya dengan kecepatan yang sama dan sedikit melewati posisi akhir, karena pilihan itu aksi yang bertenaga.
      const ingin = berikut && berikut !== kini
      const sPutar = ingin || menunggu ? SISI : 0
      lentur(putarS, sPutar, sPutar ? 0.36 : 0.56, sPutar ? 1 : 0.8, dt)
      if (ingin && !menunggu && putarS.x >= TUKAR) {
        menunggu = true
        const k = berikut as string
        muatTekstur(urlDari(k))
          .then((tx) => {
            tampil = pakai(k, tx)
            kini = k
            buka.x = 0.32
            buka.v = 0
            putarS.x = -putarS.x
            panMulai = performance.now() + 700
          })
          .catch(() => {
            // gambar gagal dimuat: tetap kembali ke isi yang lama
            putarS.x = -putarS.x
            kini = k
          })
          .finally(() => {
            menunggu = false
            if (berikut === k) berikut = null
            panggung?.minta()
          })
      }
      const sin = Math.sin(Math.abs(putarS.x))
      putar.rotation.y = putarS.x
      putar.position.y = sin * 0.1
      putar.scale.setScalar(1 - sin * 0.05)

      let hidup = belum(ry, sRy) || belum(rx, sRx) || belum(geserX, px) || belum(geserY, py) || belum(kamera, lintas) || belum(tekan, sTekan) || belum(putarS, sPutar)
      if (tampil.lap) {
        lentur(buka, 1, 0.62, 0.8, dt)
        tampil.lap.tutup.rotation.x = sudutTutup(campur(58, 105, buka.x))
        if (belum(buka, 1)) hidup = true
      }
      const tPan = klem((now - panMulai) / PAN_LAMA)
      tampil.layar.atur(halus(tPan) * PAN_KE)
      if (tPan < 1) hidup = true

      const el = ELEVASI - kamera.x * 3.4 * D2R - geserY.x * 1.4 * D2R
      camera.position.set(geserX.x * 0.28, CY + jarak * Math.sin(el), jarak * Math.cos(el))
      camera.lookAt(0, CY, 0)
      cahaya.utama.position.set(cahaya.dari[0] + geserX.x * 2.2, cahaya.dari[1] - geserY.x * 1.2, cahaya.dari[2])
      return hidup
    },
    lepas() {
      window.setTimeout(lepasPeristiwa)
      cahaya.lepas()
      for (const n of Object.keys(alat) as Alat[]) (alat[n]!.lap ?? alat[n]!.pipih)?.lepas()
    },
  })
  if (!panggung) return null

  const mo = new MutationObserver(() => {
    const k = kunciAktif()
    if (!BUTUH[k]) return
    // memilih lagi isi yang sedang tampil: putaran berbalik dari posisinya saat ini
    berikut = k === kini ? null : k
    panggung.minta()
  })
  mo.observe(daftar, { subtree: true, attributes: true, attributeFilter: ['aria-selected'] })
  // gambar diunduh saat tombol disorot/difokus, supaya sudah siap ketika dipilih
  const onSiapkan = (ev: Event) => {
    const k = ((ev.target as Element | null)?.closest?.('[role="tab"]')?.id ?? '').replace(/^.*-t-/, '')
    if (BUTUH[k]) muatTekstur(urlDari(k)).catch(() => {})
  }
  daftar.addEventListener('pointerover', onSiapkan, { passive: true })
  daftar.addEventListener('focusin', onSiapkan)
  // tanggapan sejak tombol ditekan, bukan saat dilepas
  const onTekan = (ev: Event) => {
    onSiapkan(ev)
    if (!(ev.target as Element | null)?.closest?.('[role="tab"]')) return
    ditekan = true
    panggung.minta()
    window.addEventListener('pointerup', onLepasTekan, { once: true })
    window.addEventListener('pointercancel', onLepasTekan, { once: true })
  }
  const onLepasTekan = () => {
    ditekan = false
    panggung.minta()
  }
  daftar.addEventListener('pointerdown', onTekan, { passive: true })
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
    daftar?.removeEventListener('pointerdown', onTekan)
    daftar?.removeEventListener('focusin', onSiapkan)
    akar?.removeEventListener('pointermove', onGerak)
    akar?.removeEventListener('pointerleave', onKeluar)
  }

  return panggung.lepas
}
