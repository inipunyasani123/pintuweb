// Panggung 3D "Cara kerja": empat perhentian mengikuti empat tahap, dan hidup satu per satu mengikuti gulir, seirama
// dengan lintasan .proc di bawahnya.
//   1 Ngobrol : ponsel berisi obrolan, gelembungnya keluar dari layar (tanpa kata: berlaku di semua bahasa)
//   2 Rancang : tablet berisi sketsa tata letak yang tergambar sedikit demi sedikit oleh pensil
//   3 Bangun  : laptop membuka, potongan halaman terbang masuk dan tersusun di layarnya
//   4 Online  : logo PintuWeb sebagai pintu sungguhan yang membuka, di baliknya situs yang sudah jadi
// Desktop: keempatnya berjajar di satu panggung sesuai kolom tahap. Ponsel/tablet: tiap tahap punya panggung sendiri di
// kolom teksnya (.proses-langkah), tepat di bawah penjelasannya, sehingga mengikuti susunan lintasan tegak.
// Tanpa indikator "online" palsu, titik ping, atau animasi mengetik.
import { BoxGeometry, ConeGeometry, CylinderGeometry, DoubleSide, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, Shape, ShapeGeometry, SphereGeometry, Texture, type Material } from 'three'
import LAYAR from './layar.json'
import { nyalakan, pasang } from './mesin'
import {
  D2R,
  MM,
  PI,
  UKURAN_LAYAR_LAPTOP,
  bahanLogam,
  bayanganLantai,
  belum,
  bentuk,
  bidangLayar,
  buatLaptop,
  buatPonsel,
  buatTablet,
  busur,
  cahayaStudio,
  campur,
  envLingkungan,
  garisLuar,
  geoSimpan,
  kanvas2d,
  klem,
  kotakBulat,
  lantaiBayang,
  lentur,
  muatTekstur,
  pegas,
  rata,
  sapuan,
  sudutTutup,
  teksturKanvas,
} from './perangkat'

const SAFIR = '#26469c'
const SAFIR_TERANG = '#3a62c9'
const MUDA = '#dfe6f6'
const JARAK = 3 // jarak antarperhentian (satuan dunia)
const FOV = 17
const ELEVASI = 9 * D2R
const CY = 1.22
const FOV_TAHAP = 22
const ELEVASI_TAHAP = 9 * D2R
const CY_TAHAP = 1.16

/** pelat tipis bertepi bulat menghadap +z (gelembung, potongan halaman) */
const pelat = (w: number, h: number, r: number, tebal = 0.03) =>
  geoSimpan(`pelat|${w}|${h}|${r}|${tebal}`, () => {
    const q = Math.min(0.012, tebal / 2)
    return sapuan(garisLuar(w, h, r, 6), [{ t: [[0, -tebal], [0, -q], ...busur(-q, -q, q, 0, 90, 3)], m: 0 }], { akhir: 0 })
  })
const garisTeks = (w: number, warna: string) => {
  const m = new Mesh(
    geoSimpan(`garis|${w}`, () => new ShapeGeometry(bentuk(garisLuar(w, 0.05, 0.024, 3)), 1)),
    new MeshBasicMaterial({ color: warna, toneMapped: false }),
  )
  return m
}

function teksturObrolan() {
  const { c, g } = kanvas2d(402, 874, 1)
  g.fillStyle = '#f2f5fc'
  g.fillRect(0, 0, 402, 874)
  g.fillStyle = SAFIR
  g.fillRect(0, 0, 402, 96)
  g.fillStyle = 'rgba(255,255,255,.92)'
  g.beginPath()
  g.arc(48, 50, 22, 0, PI * 2)
  g.fill()
  kotakBulat(g, 84, 38, 130, 12, 6)
  g.fill()
  g.fillStyle = 'rgba(255,255,255,.55)'
  kotakBulat(g, 84, 58, 80, 9, 4.5)
  g.fill()
  g.fillStyle = '#fff'
  kotakBulat(g, 22, 800, 300, 48, 24)
  g.fill()
  g.fillStyle = SAFIR
  g.beginPath()
  g.arc(356, 824, 24, 0, PI * 2)
  g.fill()
  return teksturKanvas(c)
}

// sketsa tata letak: garis biru di kertas berkisi, tergambar satu per satu
const SKETSA: ((g: CanvasRenderingContext2D) => void)[] = [
  (g) => g.strokeRect(36, 36, 408, 44),
  (g) => g.strokeRect(36, 104, 408, 214),
  (g) => {
    g.beginPath()
    g.moveTo(36, 104)
    g.lineTo(444, 318)
    g.moveTo(444, 104)
    g.lineTo(36, 318)
    g.stroke()
  },
  (g) => {
    g.beginPath()
    g.moveTo(36, 356)
    g.lineTo(330, 356)
    g.moveTo(36, 384)
    g.lineTo(260, 384)
    g.stroke()
  },
  (g) => g.strokeRect(36, 412, 150, 46),
  (g) => g.strokeRect(36, 486, 120, 170),
  (g) => g.strokeRect(180, 486, 120, 170),
  (g) => g.strokeRect(324, 486, 120, 170),
]
// titik tengah tiap garis sketsa (pecahan kanvas), tempat ujung pensil menuju
const PENA: [number, number][] = [
  [0.5, 0.08],
  [0.5, 0.3],
  [0.5, 0.3],
  [0.4, 0.53],
  [0.23, 0.62],
  [0.2, 0.82],
  [0.5, 0.82],
  [0.8, 0.82],
]
function buatSketsa() {
  const { c, g } = kanvas2d(480, 700, 1)
  let n = -1
  const gambar = (m: number) => {
    if (m === n) return false
    n = m
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.fillStyle = '#fbfcff'
    g.fillRect(0, 0, 480, 700)
    g.fillStyle = '#d5deef'
    for (let x = 18; x < 480; x += 24) for (let y = 18; y < 700; y += 24) g.fillRect(x, y, 2, 2)
    g.strokeStyle = SAFIR
    g.lineWidth = 3.4
    g.lineJoin = 'round'
    g.lineCap = 'round'
    for (let i = 0; i < m; i++) SKETSA[i](g)
    return true
  }
  gambar(0)
  return { t: teksturKanvas(c), gambar }
}

/** kusen ∩ logo: sudut atas membulat, terbuka di bawah; titik asal di lantai, tengah */
function buatPintu(situs: Texture, ukuran: number[]) {
  const W = 1.86
  const H = 2.46
  const T = 0.3 // lebar kusen
  const R = 0.46
  const r = Math.max(0.04, R - T)
  const lw = W - 2 * T
  const lh = H - T
  const s = new Shape()
  s.moveTo(-W / 2, 0)
  s.lineTo(-W / 2, H - R)
  s.absarc(-W / 2 + R, H - R, R, PI, PI / 2, true)
  s.lineTo(W / 2 - R, H)
  s.absarc(W / 2 - R, H - R, R, PI / 2, 0, true)
  s.lineTo(W / 2, 0)
  s.lineTo(W / 2 - T, 0)
  s.lineTo(W / 2 - T, H - T - r)
  s.absarc(W / 2 - T - r, H - T - r, r, 0, PI / 2, false)
  s.lineTo(-W / 2 + T + r, H - T)
  s.absarc(-W / 2 + T + r, H - T - r, r, PI / 2, PI, false)
  s.lineTo(-W / 2 + T, 0)
  s.closePath()
  const kusen = new Mesh(
    geoSimpan('pintu-kusen', () => new ExtrudeGeometry(s, { depth: 0.36, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 3, curveSegments: 16 })),
    new MeshStandardMaterial({ color: SAFIR, metalness: 0.22, roughness: 0.34, envMap: envLingkungan(), envMapIntensity: 1 }),
  )
  kusen.position.z = -0.18
  kusen.castShadow = true
  kusen.receiveShadow = true

  // isi ambang: situs di baliknya. Digambar lebih dulu & tanpa menulis kedalaman, supaya daun pintu yang berayun ke dalam
  // tetap tampak di depannya tanpa ruang sungguhan di belakang kusen.
  // situs & bayangan dalam kusen dipanggang jadi satu gambar: ambangnya terasa punya kedalaman
  const img = situs.image as HTMLImageElement
  const bagian = Math.min(1, ukuran[0] / (lw / lh) / ukuran[1])
  const { c: cIsi, g: gIsi } = kanvas2d(384, Math.round((384 * lh) / lw), 1)
  const tIsi = cIsi.height
  gIsi.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * bagian, 0, 0, 384, tIsi)
  const pudar = (x0: number, y0: number, x1: number, y1: number, kuat: number) => {
    const g = gIsi.createLinearGradient(x0, y0, x1, y1)
    g.addColorStop(0, `rgba(10,20,52,${kuat})`)
    g.addColorStop(1, 'rgba(10,20,52,0)')
    gIsi.fillStyle = g
    gIsi.fillRect(0, 0, 384, tIsi)
  }
  pudar(0, 0, 0, tIsi * 0.14, 0.42)
  pudar(0, 0, 384 * 0.12, 0, 0.34)
  pudar(384, 0, 384 * 0.86, 0, 0.3)
  pudar(0, tIsi, 0, tIsi * 0.94, 0.16)
  const tx = teksturKanvas(cIsi)
  const bahanIsi = new MeshBasicMaterial({ map: tx, toneMapped: false, depthWrite: false })
  const isi = new Mesh(
    geoSimpan('pintu-isi', () => {
      const a = new Shape()
      a.moveTo(-lw / 2, 0)
      a.lineTo(-lw / 2, lh - r)
      a.absarc(-lw / 2 + r, lh - r, r, PI, PI / 2, true)
      a.lineTo(lw / 2 - r, lh)
      a.absarc(lw / 2 - r, lh - r, r, PI / 2, 0, true)
      a.lineTo(lw / 2, 0)
      a.closePath()
      const g = new ShapeGeometry(a, 10)
      const pos = g.attributes.position
      const uv = g.attributes.uv
      for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + lw / 2) / lw, pos.getY(i) / lh)
      return g
    }),
    bahanIsi,
  )
  isi.renderOrder = -2
  isi.position.z = -0.02

  // daun pintu berengsel di kanan (seperti logo) dan berayun ke dalam
  const engsel = new Group()
  engsel.position.set(lw / 2 - 0.004, 0, 0)
  const bahanDaun = new MeshStandardMaterial({ color: SAFIR_TERANG, metalness: 0.18, roughness: 0.38, envMap: envLingkungan(), envMapIntensity: 1, side: DoubleSide })
  const daun = new Mesh(
    geoSimpan('pintu-daun', () => new BoxGeometry(lw - 0.012, lh - 0.012, 0.05)),
    bahanDaun,
  )
  daun.position.set(-lw / 2, lh / 2, -0.03)
  daun.castShadow = true
  daun.receiveShadow = true
  engsel.add(daun)
  // dua panel timbul
  ;[lh * 0.7, lh * 0.25].forEach((y, i) => {
    const panel = new Mesh(pelat(lw - 0.28, i ? lh * 0.32 : lh * 0.42, 0.03, 0.022), bahanDaun)
    panel.position.set(-lw / 2, y, 0.012)
    panel.receiveShadow = true
    engsel.add(panel)
  })
  // gagang
  const gagang = new Mesh(
    geoSimpan('pintu-gagang', () => new SphereGeometry(0.052, 16, 12)),
    bahanLogam('#e6e9ef').poles,
  )
  gagang.position.set(-lw + 0.1, lh * 0.47, 0.05)
  gagang.castShadow = true
  engsel.add(gagang)

  const root = new Group()
  root.add(isi, kusen, engsel)
  root.add(bayanganLantai(2.9, 0.9, 0.06, 0.7))
  // cahaya dari balik pintu jatuh ke lantai saat terbuka
  const bahanSinar = new MeshBasicMaterial({ map: (() => {
    const { c, g } = kanvas2d(128, 128, 1)
    const gr = g.createLinearGradient(0, 0, 0, 128)
    gr.addColorStop(0, 'rgba(255,226,170,.75)')
    gr.addColorStop(1, 'rgba(255,226,170,0)')
    g.fillStyle = gr
    g.beginPath()
    g.moveTo(34, 0)
    g.lineTo(94, 0)
    g.lineTo(128, 128)
    g.lineTo(0, 128)
    g.closePath()
    g.fill()
    return teksturKanvas(c)
  })(), transparent: true, depthWrite: false, toneMapped: false, opacity: 0 })
  const sinar = new Mesh(
    geoSimpan('pintu-sinar', () => new PlaneGeometry(1.5, 1.05)),
    bahanSinar,
  )
  sinar.rotation.x = -PI / 2
  sinar.position.set(-0.16, 0.004, 0.58)
  sinar.renderOrder = -1
  root.add(sinar)
  return { root, engsel, tx, bahanIsi, bahanDaun, bahanSinar, bahanKusen: kusen.material as Material }
}

export async function pasangProses(kanvas: HTMLCanvasElement, batal: () => boolean): Promise<(() => void) | null> {
  const akar = kanvas.closest('.proses-wadah') as HTMLElement | null
  const daftar = akar?.querySelector('.proc') as HTMLElement | null
  if (!akar || !daftar) return null
  const kanvasTahap = [...daftar.querySelectorAll<HTMLCanvasElement>('.proses-langkah canvas')]
  const rtl = getComputedStyle(akar).direction === 'rtl'

  /** membangun semua perhentian: `jajar` = satu panggung selebar empat kolom; selain itu satu panggung di dalam tiap tahap */
  const bangun = async (jajar: boolean): Promise<(() => void) | null> => {
    if (!nyalakan()) return null
    akar.classList.add('proses-3d-siap')
    const situs = LAYAR.toko
    let txSitus: Texture
    try {
      txSitus = await muatTekstur(`/layar/${situs.berkas}.webp`)
    } catch {
      return null
    }
    if (batal()) return null

    // 1 Ngobrol
    const txObrolan = teksturObrolan()
    const ponsel = buatPonsel({ top: SAFIR, fg: '#ffffff', halaman: txObrolan, ukuran: [402, 800] })
    ponsel.miring.rotation.x = -5 * D2R
    ponsel.root.scale.setScalar(1.48)
    const st1 = new Group()
    st1.add(ponsel.root, bayanganLantai(1.7, 0.7, 0.05, 0.9))
    // gelembung: pesan pengunjung (safir, kanan), jawaban (putih, kiri); tanpa kata
    const gelembung = ([
      { x: 0.2, y: 1.58, w: 0.9, warna: SAFIR, isi: '#ffffff', m: [0.56, 0.34] },
      { x: -0.24, y: 1.14, w: 0.96, warna: '#ffffff', isi: '#9fb0d2', m: [0.62, 0.42] },
      { x: 0.22, y: 0.7, w: 0.74, warna: SAFIR, isi: '#ffffff', m: [0.44] },
    ] as const).map((b, i) => {
      const h = 0.12 + b.m.length * 0.11
      const k = new Group()
      k.position.set(b.x, b.y, 0.24 + i * 0.05)
      const badan = new Mesh(pelat(b.w, h, 0.09, 0.05), rata(b.warna, 0.42))
      badan.castShadow = true
      k.add(badan)
      b.m.forEach((w, j) => {
        const g = garisTeks(w, b.isi)
        g.position.set(-(b.w - w) / 2 + 0.07, (b.m.length - 1) * 0.055 - j * 0.11, 0.004)
        k.add(g)
      })
      k.scale.setScalar(0.001)
      st1.add(k)
      return k
    })

    // 2 Rancang
    const sketsa = buatSketsa()
    const tablet = buatTablet({ halaman: sketsa.t, ukuran: [480, 700] })
    tablet.miring.rotation.x = -7 * D2R
    tablet.root.scale.setScalar(0.86)
    const st2 = new Group()
    st2.add(tablet.root, bayanganLantai(2.3, 0.72, 0.05, 0.85))
    // pensil: titik asal di ujungnya, condong ke kanan atas
    const pensil = new Group()
    const batang = new Mesh(
      geoSimpan('pensil-batang', () => new CylinderGeometry(0.036, 0.036, 0.92, 14)),
      rata(SAFIR, 0.4),
    )
    batang.position.y = 0.6
    const ujung = new Mesh(
      geoSimpan('pensil-ujung', () => new ConeGeometry(0.036, 0.14, 14)),
      rata('#f4f5f8', 0.5),
    )
    ujung.rotation.x = PI
    ujung.position.y = 0.07
    batang.castShadow = true
    ujung.castShadow = true
    pensil.add(batang, ujung)
    pensil.rotation.set(0.38, 0, -0.62)
    st2.add(pensil)

    // 3 Bangun
    const { c: cPutih, g: gPutih } = kanvas2d(16, 16, 1)
    gPutih.fillStyle = '#f7f9fe'
    gPutih.fillRect(0, 0, 16, 16)
    const txPutih = teksturKanvas(cPutih)
    const laptop = buatLaptop({ warna: '#d3d9e2', host: 'usahamu.id', halaman: txPutih, ukuran: [16, 16] })
    laptop.root.scale.setScalar(jajar ? 0.8 : 0.96)
    laptop.root.position.z = -0.2
    const st3 = new Group()
    st3.add(laptop.root)
    laptop.root.add(bayanganLantai(3.75, 2.9, 0.02))
    // potongan halaman: mendarat rata di layar, koordinat mm di tutup laptop (bilangan w, h = pecahan layar halaman)
    const LW = UKURAN_LAYAR_LAPTOP.w / MM
    const LH = UKURAN_LAYAR_LAPTOP.h / MM
    const LC = UKURAN_LAYAR_LAPTOP.cy / MM
    const potongan = ([
      { x: 0, y: 0.44, w: 1, h: 0.1, warna: '#ffffff', dari: [-40, 90, 120] },
      { x: -0.2, y: 0.12, w: 0.54, h: 0.44, warna: SAFIR, dari: [-150, 40, 140] },
      { x: 0.29, y: 0.12, w: 0.36, h: 0.44, warna: MUDA, dari: [150, 60, 130] },
      { x: -0.32, y: -0.3, w: 0.28, h: 0.28, warna: '#ffffff', dari: [-120, -70, 120] },
      { x: 0, y: -0.3, w: 0.28, h: 0.28, warna: '#ffffff', dari: [0, -110, 150] },
      { x: 0.32, y: -0.3, w: 0.28, h: 0.28, warna: '#ffffff', dari: [120, -70, 120] },
    ] as const).map((p) => {
      const w = p.w * LW * 0.94
      const h = p.h * LH * 0.9
      const m = new Mesh(pelat(w * MM, h * MM, 0.03, 0.02), rata(p.warna, 0.5))
      m.castShadow = true
      m.scale.setScalar(1 / MM)
      const k = new Group()
      k.add(m)
      laptop.tutup.add(k)
      return { k, x: p.x * LW, y: LC + p.y * LH, dari: p.dari }
    })

    // 4 Online
    const pintu = buatPintu(txSitus, situs.ukuran)
    pintu.root.scale.setScalar(0.98)
    const st4 = new Group()
    st4.add(pintu.root)

    const perhentian = [st1, st2, st3, st4]
    const yawDasar = [0.24, -0.1, 0.06, -0.3].map((y) => (rtl ? -y : y))
    const hidupkan = perhentian.map(() => pegas())
    const isi = perhentian.map(() => pegas())
    const gelembungS = gelembung.map(() => pegas())
    const potonganS = potongan.map(() => pegas())
    const pintuS = pegas()
    const tutupS = pegas()
    const penaX = pegas()
    const penaY = pegas(1.8)

    /** memperbarui satu perhentian; q = kemajuan tahapnya (< 0 belum sampai, 1 selesai). true = masih bergerak. */
    const perbarui = (i: number, q: number, dt: number, pertama: boolean, tambahYaw: number) => {
      let hidup = false
      const lihat = (s: { x: number; v: number }, sasaran: number) => {
        if (belum(s, sasaran)) hidup = true
      }
      const bangunkan = q > -0.04 ? 1 : 0
      const kemajuan = klem(q)
      if (pertama) {
        hidupkan[i].x = bangunkan
        isi[i].x = kemajuan
        if (i === 2) tutupS.x = bangunkan
        if (i === 3) pintuS.x = klem(q / 0.92)
      }
      // bangun dari posisi tidur dengan sedikit melewati posisi akhir
      lentur(hidupkan[i], bangunkan, 0.56, 0.74, dt)
      lentur(isi[i], kemajuan, 0.34, 1, dt)
      lihat(hidupkan[i], bangunkan)
      lihat(isi[i], kemajuan)
      const a = hidupkan[i].x
      const s = perhentian[i]
      s.rotation.y = campur(yawDasar[i] + (rtl ? 0.7 : -0.7) * (i === 3 ? 0 : 1), yawDasar[i], a) + tambahYaw
      s.scale.setScalar(campur(0.84, 1, a))

      if (i === 0) {
        // gelembung muncul bergantian, masing-masing dengan pegasnya sendiri
        gelembung.forEach((g, j) => {
          const on = isi[0].x > 0.1 + j * 0.27 ? 1 : 0
          lentur(gelembungS[j], on, 0.42, 0.62, dt)
          g.scale.setScalar(Math.max(0.001, gelembungS[j].x))
          g.rotation.y = (1 - gelembungS[j].x) * (j % 2 ? -0.5 : 0.5)
          lihat(gelembungS[j], on)
        })
      } else if (i === 1) {
        // sketsa tergambar; pensil mengikuti garis yang sedang dibuat, lalu menyingkir
        const b2 = isi[1].x
        if (sketsa.gambar(Math.round(b2 * SKETSA.length))) tablet.layar.segarkan()
        const jalan = b2 * SKETSA.length
        const [pu, pv] = PENA[Math.min(SKETSA.length - 1, Math.floor(jalan))]
        const selesai = b2 > 0.96
        const sPx = selesai ? 0.98 : (pu - 0.5) * 1.3 + Math.sin(jalan * Math.PI * 2) * 0.26
        const sPy = selesai ? 0.56 : 1.06 + (0.5 - pv) * 1.9
        lentur(penaX, sPx, 0.3, 0.92, dt)
        lentur(penaY, sPy, 0.3, 0.92, dt)
        pensil.position.set(penaX.x, penaY.x, 0.32)
        lihat(penaX, sPx)
        lihat(penaY, sPy)
      } else if (i === 2) {
        // laptop membuka, potongan terbang masuk melengkung dan mendarat bergantian
        lentur(tutupS, bangunkan, 0.7, 0.8, dt)
        lihat(tutupS, bangunkan)
        laptop.tutup.rotation.x = sudutTutup(campur(6, 104, tutupS.x))
        potongan.forEach((p, j) => {
          const on = isi[2].x > 0.08 + j * 0.13 ? 1 : 0
          lentur(potonganS[j], on, 0.56, 0.82, dt)
          lihat(potonganS[j], on)
          const u = potonganS[j].x
          const lain = 1 - u
          p.k.visible = u > 0.002
          p.k.position.set(p.x + lain * p.dari[0], p.y + lain * p.dari[1] + Math.sin(klem(u) * PI) * 14, 0.5 + lain * p.dari[2])
          p.k.rotation.set(lain * 0.5, lain * (p.dari[0] > 0 ? -0.7 : 0.7), 0)
          p.k.scale.setScalar(campur(0.72, 1, u))
        })
      } else {
        // pintu berayun membuka mendekati bentuk logo, punya bobot, dan cahaya jatuh ke lantai
        const sPintu = klem(q / 0.92)
        lentur(pintuS, sPintu, 0.82, 0.74, dt)
        lihat(pintuS, sPintu)
        pintu.engsel.rotation.y = -campur(0, 66, pintuS.x) * D2R
        pintu.bahanSinar.opacity = klem(pintuS.x) * 0.9
      }
      return hidup
    }

    const lepasBendaBersama = () => {
      ponsel.lepas()
      tablet.lepas()
      laptop.lepas()
      txObrolan.dispose()
      sketsa.t.dispose()
      txPutih.dispose()
      pintu.tx.dispose()
      pintu.bahanIsi.dispose()
      pintu.bahanDaun.dispose()
      pintu.bahanSinar.dispose()
      pintu.bahanKusen.dispose()
    }

    if (!jajar) {
      // ponsel & tablet: tiap tahap punya panggung sendiri di kolom teksnya. Perangkatnya hidup saat panggung itu sendiri
      // melintasi layar, jadi selalu seirama dengan tahap yang sedang dibaca.
      const lepasan: (() => void)[] = []
      let sisa = perhentian.length
      for (let i = 0; i < perhentian.length; i++) {
        const kanvasI = kanvasTahap[i]
        if (!kanvasI) continue
        const scene = new Scene()
        const camera = new PerspectiveCamera(FOV_TAHAP, 1.6, 1, 60)
        const cahaya = cahayaStudio({ dari: [rtl ? 2.6 : -2.6, 8, 6], rim: '#8fa8ff', kotak: [-3.2, 3.2, 3.4, -2.4], peta: [640, 640], lembut: 3 })
        scene.add(perhentian[i], cahaya.g, lantaiBayang(6.2, 4.8, 0.15))
        const kamera = pegas()
        let jarak = 10
        const p = await pasang({
          kanvas: kanvasI,
          akar,
          kelas: 'proses-3d',
          scene,
          camera,
          ikutGulir: true,
          ukuran(w, h) {
            camera.aspect = w / h
            const t = Math.tan((FOV_TAHAP / 2) * D2R)
            jarak = Math.max(3.5 / 2 / (t * camera.aspect), 2.68 / 2 / t)
            camera.updateProjectionMatrix()
          },
          langkah(_now, dt, pertama) {
            const vh = window.innerHeight
            const r = kanvasI.getBoundingClientRect()
            // 0 saat panggung baru masuk dari bawah, 1 saat puncaknya di sepertiga atas layar
            const q = (0.96 * vh - r.top) / (0.62 * vh)
            const lintas = klem((vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2), -1, 1)
            if (pertama) kamera.x = lintas
            lentur(kamera, lintas, 0.5, 1, dt)
            const hidup = perbarui(i, q, dt, pertama, kamera.x * 0.14)
            const el = ELEVASI_TAHAP - kamera.x * 3 * D2R
            camera.position.set(0, CY_TAHAP + jarak * Math.sin(el), jarak * Math.cos(el))
            camera.lookAt(0, CY_TAHAP, 0)
            return hidup || belum(kamera, lintas)
          },
          lepas() {
            cahaya.lepas()
            if (--sisa === 0) lepasBendaBersama()
          },
        })
        if (p) lepasan.push(p.lepas)
      }
      return lepasan.length ? () => lepasan.forEach((l) => l()) : null
    }

    // desktop: satu panggung, keempat perhentian berjajar sesuai kolom tahap
    const scene = new Scene()
    const rig = new Group()
    scene.add(rig)
    const camera = new PerspectiveCamera(FOV, 4, 1, 80)
    const cahaya = cahayaStudio({ dari: [rtl ? 2.6 : -2.6, 8, 6], rim: '#8fa8ff', kotak: [-7.4, 7.4, 3.6, -2.6], peta: [1600, 640], lembut: 5 })
    scene.add(cahaya.g)
    rig.add(lantaiBayang(19, 6.4, 0.15))
    perhentian.forEach((s, i) => {
      s.position.x = ((rtl ? -1 : 1) * (i - 1.5)) * JARAK
      rig.add(s)
    })
    let jarak = 12
    const geserX = pegas()
    const geserY = pegas()
    const kamera = pegas()
    let px = 0
    let py = 0
    const panggung = await pasang({
      kanvas,
      akar,
      kelas: 'proses-3d',
      scene,
      camera,
      ikutGulir: true,
      ukuran(w, h) {
        camera.aspect = w / h
        const t = Math.tan((FOV / 2) * D2R)
        jarak = Math.max(12 / 2 / (t * camera.aspect), 2.86 / 2 / t)
        camera.updateProjectionMatrix()
      },
      langkah(_now, dt, pertama) {
        const vh = window.innerHeight
        // t: 0..4 sepanjang empat tahap, seirama dengan lintasan .proc
        const r = daftar.getBoundingClientRect()
        const t = klem((0.92 * vh - r.top) / (0.12 * vh + r.height)) * 4
        const rk = kanvas.getBoundingClientRect()
        const lintas = klem((vh / 2 - (rk.top + rk.height / 2)) / (vh / 2 + rk.height / 2), -1, 1)
        if (pertama) kamera.x = lintas
        lentur(geserX, px, 0.5, 0.95, dt)
        lentur(geserY, py, 0.5, 0.95, dt)
        lentur(kamera, lintas, 0.5, 1, dt)
        let hidup = belum(geserX, px) || belum(geserY, py) || belum(kamera, lintas)
        perhentian.forEach((_, i) => {
          if (perbarui(i, t - i, dt, pertama, geserX.x * 0.07)) hidup = true
        })
        const el = ELEVASI - kamera.x * 2.6 * D2R - geserY.x * 1.2 * D2R
        camera.position.set(geserX.x * 0.5, CY + jarak * Math.sin(el), jarak * Math.cos(el))
        camera.lookAt(0, CY, 0)
        cahaya.utama.position.set(cahaya.dari[0] + geserX.x * 3, cahaya.dari[1] - geserY.x * 1.2, cahaya.dari[2])
        return hidup
      },
      lepas() {
        window.setTimeout(lepasPeristiwa)
        cahaya.lepas()
        lepasBendaBersama()
      },
    })
    if (!panggung) return null

    const onGerak = (ev: PointerEvent) => {
      if (ev.pointerType === 'touch') return
      const r = akar.getBoundingClientRect()
      px = klem(((ev.clientX - r.left) / r.width) * 2 - 1, -1, 1)
      py = klem(((ev.clientY - r.top) / r.height) * 2 - 1, -1, 1)
      panggung.minta()
    }
    const onKeluar = () => {
      px = 0
      py = 0
      panggung.minta()
    }
    if (matchMedia('(hover: hover)').matches) {
      akar.addEventListener('pointermove', onGerak, { passive: true })
      akar.addEventListener('pointerleave', onKeluar)
    }
    function lepasPeristiwa() {
      akar?.removeEventListener('pointermove', onGerak)
      akar?.removeEventListener('pointerleave', onKeluar)
    }
    return panggung.lepas
  }

  // susunan berganti di 1024px (mis. tablet diputar): adegannya dibangun ulang untuk susunan yang baru
  const mq = matchMedia('(min-width: 1024px)')
  let lepasAktif = await bangun(mq.matches)
  if (!lepasAktif) return null
  const onUbah = () => {
    lepasAktif?.()
    lepasAktif = null
    bangun(mq.matches)
      .then((l) => {
        lepasAktif = l
      })
      .catch(() => {})
  }
  mq.addEventListener('change', onUbah)
  return () => {
    mq.removeEventListener('change', onUbah)
    lepasAktif?.()
  }
}
