// Panggung 3D "Cara kerja": empat perhentian mengikuti empat tahap, dan hidup satu per satu mengikuti gulir, seirama
// dengan lintasan .proc di bawahnya.
//   1 Ngobrol : ponsel berisi obrolan, gelembungnya keluar dari layar (tanpa kata: berlaku di semua bahasa)
//   2 Rancang : tablet berisi sketsa tata letak yang tergambar sedikit demi sedikit oleh pensil
//   3 Bangun  : laptop membuka, potongan halaman terbang masuk dan tersusun di layarnya
//   4 Online  : logo PintuWeb sebagai pintu sungguhan yang membuka, di baliknya situs yang sudah jadi
// Desktop: keempatnya berjajar sesuai kolom tahap. Ponsel/tablet: kamera berpindah dari satu perhentian ke berikutnya.
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
  campur,
  envLingkungan,
  garisLuar,
  geoSimpan,
  halus,
  kanvas2d,
  klem,
  kotakBulat,
  muatTekstur,
  pegas,
  rata,
  redam,
  sapuan,
  sudutTutup,
  teksturKanvas,
} from './perangkat'

const SAFIR = '#26469c'
const SAFIR_TERANG = '#3a62c9'
const MUDA = '#dfe6f6'
const JARAK = 3 // jarak antarperhentian (satuan dunia)
const FOV = 13
const ELEVASI = 8 * D2R
const CY = 1.22

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
const redakan = (t: number) => {
  const c = 1.3
  const x = klem(t)
  return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
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
    geoSimpan('pintu-kusen', () => new ExtrudeGeometry(s, { depth: 0.24, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 14 })),
    new MeshStandardMaterial({ color: SAFIR, metalness: 0.22, roughness: 0.34, envMap: envLingkungan(), envMapIntensity: 1 }),
  )
  kusen.position.z = -0.12

  // isi ambang: situs di baliknya. Digambar lebih dulu & tanpa menulis kedalaman, supaya daun pintu yang berayun ke dalam
  // tetap tampak di depannya tanpa ruang sungguhan di belakang kusen.
  const bagian = Math.min(1, ukuran[0] / (lw / lh) / ukuran[1])
  const tx = situs.clone()
  tx.repeat.set(1, bagian)
  tx.offset.y = 1 - bagian
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
  engsel.add(daun)
  // gagang
  const gagang = new Mesh(
    geoSimpan('pintu-gagang', () => new SphereGeometry(0.052, 16, 12)),
    bahanLogam('#e6e9ef').poles,
  )
  gagang.position.set(-lw + 0.12, lh * 0.46, 0.04)
  engsel.add(gagang)

  const root = new Group()
  root.add(isi, kusen, engsel)
  root.add(bayanganLantai(3, 1.1, 0.08))
  return { root, engsel, tx, bahanIsi, bahanDaun, bahanKusen: kusen.material as Material }
}

export async function pasangProses(kanvas: HTMLCanvasElement, batal: () => boolean): Promise<(() => void) | null> {
  const akar = kanvas.closest('.proses-wadah') as HTMLElement | null
  const daftar = akar?.querySelector('.proc') as HTMLElement | null
  if (!akar || !daftar || !nyalakan()) return null
  const langkahEl = [...daftar.querySelectorAll<HTMLElement>('.proc-step')]
  const situs = LAYAR.toko
  let txSitus: Texture
  try {
    txSitus = await muatTekstur(`/layar/${situs.berkas}.webp`)
  } catch {
    return null
  }
  if (batal()) return null
  const rtl = getComputedStyle(akar).direction === 'rtl'

  const scene = new Scene()
  const rig = new Group()
  scene.add(rig)
  const camera = new PerspectiveCamera(FOV, 4, 1, 80)
  const pos = (i: number) => ((rtl ? -1 : 1) * (i - 1.5)) * JARAK

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
    k.position.set(b.x, b.y, 0.34 + i * 0.06)
    const badan = new Mesh(pelat(b.w, h, 0.09, 0.04), rata(b.warna, 0.42))
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
  pensil.add(batang, ujung)
  pensil.rotation.set(0.38, 0, -0.62)
  st2.add(pensil)

  // 3 Bangun
  const { c: cPutih, g: gPutih } = kanvas2d(16, 16, 1)
  gPutih.fillStyle = '#f7f9fe'
  gPutih.fillRect(0, 0, 16, 16)
  const txPutih = teksturKanvas(cPutih)
  const laptop = buatLaptop({ warna: '#d3d9e2', host: 'usahamu.id', halaman: txPutih, ukuran: [16, 16] })
  laptop.root.scale.setScalar(0.8)
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
    const m = new Mesh(pelat(w * MM, h * MM, 0.03, 0.014), rata(p.warna, 0.5))
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
  perhentian.forEach((s, i) => {
    s.position.x = pos(i)
    rig.add(s)
  })
  const yawDasar = [0.24, -0.1, 0.06, -0.3].map((y) => (rtl ? -y : y))

  let mode: 'jajar' | 'pindah' = 'jajar'
  const hidupkan = perhentian.map(() => pegas())
  const isi = perhentian.map(() => pegas())
  const fokus = pegas(0)
  const yaw = pegas()
  let px = 0
  const adaSorot = matchMedia('(hover: hover)').matches

  const panggung = await pasang({
    kanvas,
    akar,
    kelas: 'proses-3d',
    scene,
    camera,
    ikutGulir: true,
    ukuran(w, h) {
      mode = window.innerWidth >= 1024 ? 'jajar' : 'pindah'
      camera.aspect = w / h
      const t = Math.tan((FOV / 2) * D2R)
      const lebar = mode === 'jajar' ? 12 : 5.4
      camera.userData.d = Math.max(lebar / 2 / (t * camera.aspect), (mode === 'jajar' ? 2.86 : 2.66) / 2 / t)
      camera.updateProjectionMatrix()
    },
    langkah(_now, dt, pertama) {
      const vh = window.innerHeight
      // t: 0..4 sepanjang empat tahap, seirama dengan lintasan .proc
      let t = 0
      if (mode === 'jajar') {
        const r = daftar.getBoundingClientRect()
        t = klem((0.92 * vh - r.top) / (0.12 * vh + r.height)) * 4
      } else {
        const garis = 0.55 * vh
        t = langkahEl.length
        for (let i = 0; i < langkahEl.length; i++) {
          const r = langkahEl[i].getBoundingClientRect()
          if (r.top > garis) {
            t = i
            break
          }
          if (r.bottom > garis) {
            t = i + (garis - r.top) / r.height
            break
          }
        }
      }

      let hidup = false
      const sasaran = (i: number) => (t > i - 0.04 ? 1 : 0)
      if (pertama) {
        perhentian.forEach((_, i) => {
          hidupkan[i].x = sasaran(i)
          isi[i].x = klem(t - i)
        })
        fokus.x = klem(t - 0.5, 0, 3)
      }
      perhentian.forEach((s, i) => {
        redam(hidupkan[i], sasaran(i), 0.3, dt)
        redam(isi[i], klem(t - i), 0.18, dt)
        const a = klem(hidupkan[i].x, -0.2, 1.25)
        s.rotation.y = campur(yawDasar[i] + (rtl ? 0.7 : -0.7) * (i === 3 ? 0 : 1), yawDasar[i], a) + yaw.x * 0.5
        const sk = campur(0.84, 1, a)
        s.scale.setScalar(sk)
        if (belum(hidupkan[i], sasaran(i)) || belum(isi[i], klem(t - i))) hidup = true
      })

      // 1: gelembung muncul bergantian
      const b1 = isi[0].x
      gelembung.forEach((g, i) => g.scale.setScalar(Math.max(0.001, redakan((b1 - 0.1 - i * 0.27) / 0.24))))
      // 2: sketsa tergambar; pensil mengikuti lalu menyingkir ke samping
      const b2 = isi[1].x
      if (sketsa.gambar(Math.round(b2 * SKETSA.length))) tablet.layar.segarkan()
      const jalan = b2 * SKETSA.length
      const baris = campur(1.8, 0.5, klem(b2 / 0.92))
      pensil.position.set(campur(-0.42, 0.42, (Math.sin(jalan * 2.6) + 1) / 2) + halus(klem((b2 - 0.9) / 0.1)) * 0.5, baris, 0.34)
      // 3: laptop membuka, potongan terbang masuk satu per satu
      const b3 = isi[2].x
      laptop.tutup.rotation.x = sudutTutup(campur(8, 104, halus(klem(hidupkan[2].x))))
      potongan.forEach((p, i) => {
        const u = halus(klem((b3 - 0.06 - i * 0.12) / 0.32))
        p.k.visible = u > 0.001
        p.k.position.set(p.x + (1 - u) * p.dari[0], p.y + (1 - u) * p.dari[1], 0.5 + (1 - u) * p.dari[2])
        p.k.scale.setScalar(campur(0.7, 1, u))
      })
      // 4: pintu terbuka mendekati bentuk logo
      pintu.engsel.rotation.y = -campur(0, 66, halus(klem(isi[3].x * 1.05 + (t >= 3.98 ? 1 : 0)))) * D2R

      redam(yaw, px * 0.16, 0.3, dt)
      if (belum(yaw, px * 0.16)) hidup = true
      if (mode === 'pindah') {
        const f = klem(t - 0.5, 0, 3)
        redam(fokus, f, 0.34, dt)
        if (belum(fokus, f)) hidup = true
        const x = pos(fokus.x)
        const d = camera.userData.d as number
        camera.position.set(x, CY + d * Math.sin(ELEVASI), d * Math.cos(ELEVASI))
        camera.lookAt(x, CY, 0)
      } else {
        const d = camera.userData.d as number
        camera.position.set(0, CY + d * Math.sin(ELEVASI), d * Math.cos(ELEVASI))
        camera.lookAt(0, CY, 0)
      }
      return hidup
    },
    lepas() {
      window.setTimeout(lepasPeristiwa)
      ponsel.lepas()
      tablet.lepas()
      laptop.lepas()
      txObrolan.dispose()
      sketsa.t.dispose()
      txPutih.dispose()
      pintu.tx.dispose()
      pintu.bahanIsi.dispose()
      pintu.bahanDaun.dispose()
      pintu.bahanKusen.dispose()
    },
  })
  if (!panggung) return null

  const onGerak = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    const r = akar.getBoundingClientRect()
    px = klem(((ev.clientX - r.left) / r.width) * 2 - 1, -1, 1)
    panggung.minta()
  }
  const onKeluar = () => {
    px = 0
    panggung.minta()
  }
  if (adaSorot) {
    akar.addEventListener('pointermove', onGerak, { passive: true })
    akar.addEventListener('pointerleave', onKeluar)
  }
  function lepasPeristiwa() {
    akar?.removeEventListener('pointermove', onGerak)
    akar?.removeEventListener('pointerleave', onKeluar)
  }
  return panggung.lepas
}
