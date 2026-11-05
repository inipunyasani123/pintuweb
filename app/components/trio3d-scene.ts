// Trio perangkat 3D kartu utama "Demo pilihan" (Three.js polos, tanpa react-three-fiber). Berkas ini dan Three.js hanya
// dimuat oleh Trio3D.tsx saat kartunya mendekat di perangkat yang mampu; selain itu trio CSS (DeviceTrio.tsx) tetap tampil.
// Geometri = versi ringkas VideoPromo/src/kreasi/perangkat-apple.tsx (ukuran resmi dalam mm, tanpa logo).
//
// Gerak: laptop membuka dan tablet + ponsel masuk mengikuti gulir halaman; seluruh trio menoleh mengikuti kursor; isi
// layar bergulir saat kartu disorot/difokus (layar sentuh: mengikuti gulir). Digambar hanya saat ada yang berubah dan
// kartunya terlihat, jadi diam = nol kerja GPU. Bila rata-rata di atas BATAS_MS per frame, 3D dilepas dan trio CSS kembali.
import {
  BackSide,
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
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three'

export type Dev = 'desktop' | 'tablet' | 'phone'
export type IsiTrio = {
  host: string
  /** warna puncak halaman (bilah status ponsel) */
  top: string
  fg: string
  /** ukuran asli tangkapan layar */
  ukuran: Record<Dev, number[]>
  /** alamat varian gambar untuk lebar piksel tertentu */
  gambar: (dev: Dev, lebarPiksel: number) => string
}

const PI = Math.PI
const D2R = PI / 180
/** satuan dunia per milimeter (1 satuan = 10 cm) */
const MM = 0.01
const BATAS_MS = 40
const KUNCI_LAMBAT = 'pw-trio3d'

const klem = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const campur = (a: number, b: number, t: number) => a + (b - a) * t
const halus = (t: number) => t * t * (3 - 2 * t)
const jeda = () => new Promise<void>((r) => setTimeout(r))

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
function garisLuar(w: number, h: number, r: number | number[], seg = 12, cx0 = 0, cy0 = 0): Garis {
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
const busur = (cr: number, cz: number, rad: number, a0: number, a1: number, n = 6): T2[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (a0 + ((a1 - a0) * i) / n) * D2R
    return [cr + rad * Math.cos(a), cz + rad * Math.sin(a)] as T2
  })

/** menyapu profil (r = geser dari garis luar, z = tinggi) sepanjang garis luar; m = indeks bahan; antarsegmen tepi tajam */
function sapuan(g: Garis, segs: SegProfil[], tutup: { awal?: number; akhir?: number } = {}) {
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

const bentuk = (g: Garis) => new Shape(g.p.map(([x, y]) => new Vector2(x, y)))

/** bidang menghadap +z dengan UV 0..1 selebar kotaknya (untuk isi layar) */
function bidangLayar(w: number, h: number, r: number | number[], cx = 0, cy = 0) {
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

function kanvas2d(w: number, h: number, skala: number) {
  const c = document.createElement('canvas')
  c.width = w * skala
  c.height = h * skala
  const g = c.getContext('2d')!
  g.scale(skala, skala)
  return { c, g }
}
function kotakBulat(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}
function teksturKanvas(c: HTMLCanvasElement, aniso: number) {
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = aniso
  return t
}

/** gambar sama dengan simbol dv-chrome + dv-lock di DeviceTrio.tsx */
function teksturBilahPeramban(host: string, aniso: number) {
  const { c, g } = kanvas2d(838, 40, 2)
  g.fillStyle = '#f3f6fd'
  g.fillRect(0, 0, 838, 40)
  g.fillStyle = '#d3dcee'
  g.fillRect(0, 39, 838, 1)
  ;[
    [24, '#f4a6a0'],
    [43, '#f5d08a'],
    [62, '#9fd8a8'],
  ].forEach(([x, w]) => {
    g.fillStyle = w as string
    g.beginPath()
    g.arc(x as number, 20, 5.5, 0, PI * 2)
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
  return teksturKanvas(c, aniso)
}

/** gambar sama dengan simbol dv-status di DeviceTrio.tsx; latarnya transparan (warna puncak halaman ada di lapisan dasar layar) */
function teksturBilahStatus(fg: string, aniso: number) {
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
  return teksturKanvas(c, aniso)
}

function teksturBayangan() {
  const { c, g } = kanvas2d(128, 128, 1)
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64)
  gr.addColorStop(0, 'rgba(19,36,84,.44)')
  gr.addColorStop(0.45, 'rgba(19,36,84,.22)')
  gr.addColorStop(1, 'rgba(19,36,84,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

// ---------------------------------------------------------------------------------------------------------------------
// Bahan
// ---------------------------------------------------------------------------------------------------------------------
function bahanLogam(warna: string) {
  const c = new Color(warna)
  return {
    al: new MeshStandardMaterial({ color: c, metalness: 0.72, roughness: 0.44, envMapIntensity: 1.05 }),
    // chamfer tak boleh terlalu licin: pantulan softbox di tepi selebar ±1 piksel lolos MSAA jadi bintik berselang-seling
    poles: new MeshStandardMaterial({ color: c.clone().lerp(new Color('#ffffff'), 0.3), metalness: 0.9, roughness: 0.36, envMapIntensity: 0.95 }),
  }
}
const kacaHitam = () => new MeshStandardMaterial({ color: '#030406', metalness: 0, roughness: 0.1, envMapIntensity: 0.32 })
const dop = (warna: string, kasar = 0.7) => new MeshStandardMaterial({ color: warna, metalness: 0, roughness: kasar, envMapIntensity: 0.55 })

// ---------------------------------------------------------------------------------------------------------------------
// Perangkat (titik asal di lantai, tengah alasnya). Isi layar: atur(pan) menggeser tangkapan layar 0..1.
// ---------------------------------------------------------------------------------------------------------------------
type Layar = { tekstur: Texture; atur: (pan: number) => void }

/** memasang tangkapan layar panjang di jendela selebar rasio tertentu; pan 0 = puncak halaman, 1 = dasar */
function layarGulir(tekstur: Texture, ukuran: number[], rasioJendela: number): Layar {
  const bagian = Math.min(1, ukuran[0] / rasioJendela / ukuran[1])
  tekstur.repeat.set(1, bagian)
  const atur = (pan: number) => {
    tekstur.offset.y = (1 - bagian) * (1 - pan)
  }
  atur(0)
  return { tekstur, atur }
}

const isiLayar = (t: Texture) => new MeshBasicMaterial({ map: t, toneMapped: false })

// MacBook Air 13"
const MB = { W: 304.1, Dp: 215, kaki: 0.8, tb: 7.4, celah: 0.3, tl: 3.6, Ld: 207.4, R: 10.5, layarW: 290.29, layarH: 188.69, bezelAtas: 6.2, poni: 6.3 }
const MB_DEK = MB.kaki + MB.tb
const MB_ENGSEL: [number, number, number] = [0, MB_DEK + MB.celah, -MB.Dp / 2 + 7.6]
const P_TUTS = 18.9
const Q_TUTS = 18
const CELAH_TUTS = 2.3
const KB_W = 14.5 * P_TUTS
const KB_Z0 = -MB.Dp / 2 + 13.5
const BARIS_TUTS = [
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1],
]

function buatLaptop(isi: IsiTrio, halaman: Texture, aniso: number) {
  const { W, Dp, tl, Ld, R, layarW, layarH } = MB
  const { al, poles } = bahanLogam('#d3d9e2')
  const kaca = kacaHitam()
  const root = new Group()
  const mm = new Group()
  mm.scale.setScalar(MM)
  root.add(mm)

  // alas: disapu di bidang xy lalu ditegakkan (y -> -z, z -> y)
  const alas = new Mesh(
    sapuan(
      garisLuar(W, Dp, R, 12),
      [
        { t: [...busur(-2.4, MB.kaki + 2.4, 2.4, -90, 0, 6), [0, MB_DEK - 0.45]], m: 0 },
        { t: [[0, MB_DEK - 0.45], [-0.45, MB_DEK]], m: 1 },
      ],
      { awal: 0, akhir: 0 },
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
  const KB_D = 6 * Q_TUTS
  dekDatar(new ShapeGeometry(bentuk(garisLuar(KB_W + 3.6, KB_D + 3.6, 3, 6)), 1), dop('#07080a', 0.85), MB_DEK + 0.1, KB_Z0 + KB_D / 2)
  const jml = BARIS_TUTS.reduce((n, b) => n + b.length, 0)
  const tuts = new InstancedMesh(new BoxGeometry(1, 1, 1), dop('#101115', 0.62), jml)
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
  mm.add(tuts)
  const padZ = KB_Z0 + KB_D + 6.5 + 39
  dekDatar(new ShapeGeometry(bentuk(garisLuar(134.9, 78.9, 6.4, 8)), 1), dop('#7f8897', 0.5), MB_DEK + 0.08, padZ)
  dekDatar(new ShapeGeometry(bentuk(garisLuar(134, 78, 6, 8)), 1), al, MB_DEK + 0.16, padZ)

  const engsel = new Mesh(new CylinderGeometry(2.4, 2.4, W - 46, 16), dop('#3a3f49', 0.45))
  engsel.position.set(0, MB_ENGSEL[1] - 0.9, MB_ENGSEL[2] - 0.5)
  engsel.rotation.z = PI / 2
  mm.add(engsel)

  // tutup berputar di engsel: x = lebar, y = dari engsel ke atas, z+ = sisi layar
  const tutup = new Group()
  tutup.position.set(...MB_ENGSEL)
  mm.add(tutup)
  tutup.add(
    new Mesh(
      sapuan(
        garisLuar(W, Ld, R, 12, 0, Ld / 2),
        [
          { t: [...busur(-1.4, -tl + 1.4, 1.4, -90, 0, 5), [0, -0.5]], m: 0 },
          { t: [[0, -0.5], [-0.25, -0.25]], m: 1 },
          { t: [[-0.25, -0.25], [-0.95, -0.25]], m: 0 },
        ],
        { awal: 0 },
      ),
      [al, poles],
    ),
  )
  tutup.add(new Mesh(sapuan(garisLuar(W - 1.9, Ld - 1.9, R - 0.95, 12, 0, Ld / 2), [{ t: [[0, -0.45], ...busur(-0.2, -0.2, 0.2, 0, 90, 3)], m: 0 }], { akhir: 0 }), kaca))

  // layar: jalur menu hitam (poni menyatu) di atas, lalu bilah peramban, lalu halaman
  const puncak = Ld - MB.bezelAtas - MB.poni
  const bilahH = (40 / 838) * layarW
  const dasar = Ld - MB.bezelAtas - layarH
  const halH = puncak - bilahH - dasar
  const bilah = new Mesh(new PlaneGeometry(layarW, bilahH), isiLayar(teksturBilahPeramban(isi.host, aniso)))
  bilah.position.set(0, puncak - bilahH / 2, 0.06)
  tutup.add(bilah)
  const hal = new Mesh(new PlaneGeometry(layarW, halH), isiLayar(halaman))
  hal.position.set(0, dasar + halH / 2, 0.06)
  tutup.add(hal)

  return { root, tutup, layar: layarGulir(halaman, isi.ukuran.desktop, layarW / halH) }
}

/** badan tablet/ponsel (sisi datar, chamfer poles, kaca depan) berpusat di titik asal */
function buatBadan(W: number, H: number, D: number, R: number, warna: string, tepiKaca: number) {
  const h = D / 2
  const { al, poles } = bahanLogam(warna)
  const g = new Group()
  g.add(
    new Mesh(
      sapuan(
        garisLuar(W, H, R, 12),
        [
          { t: [...busur(-1.5, -h + 1.5, 1.5, -90, 0, 5), [0, h - 0.7]], m: 0 },
          { t: [[0, h - 0.7], [-0.3, h - 0.4]], m: 1 },
          { t: [[-0.3, h - 0.4], [-0.5, h - 0.4]], m: 0 },
        ],
        { awal: 0 },
      ),
      [al, poles],
    ),
  )
  g.add(new Mesh(sapuan(garisLuar(W - tepiKaca, H - tepiKaca, R - tepiKaca / 2, 12), [{ t: [[0, h - 0.6], ...busur(-0.35, h - 0.35, 0.35, 0, 90, 3)], m: 0 }], { akhir: 0 }), kacaHitam()))
  return { g, al }
}

function buatTablet(isi: IsiTrio, halaman: Texture) {
  // iPad Pro 11"
  const W = 177.5
  const H = 249.7
  const D = 5.3
  const lw = 160.48
  const lh = 232.83
  const { g } = buatBadan(W, H, D, 11.9, '#d9dde3', 0.9)
  const layar = new Mesh(bidangLayar(lw, lh, 4.5), isiLayar(halaman))
  layar.position.z = D / 2 + 0.06
  g.add(layar)
  g.position.y = H / 2
  const root = new Group()
  const mm = new Group()
  mm.scale.setScalar(MM)
  mm.add(g)
  root.add(mm)
  return { root, layar: layarGulir(halaman, isi.ukuran.tablet, lw / lh) }
}

function buatPonsel(isi: IsiTrio, halaman: Texture, aniso: number) {
  // iPhone 17 Pro
  const W = 71.9
  const H = 150
  const D = 8.75
  const lw = 66.59
  const lh = 144.78
  const r = 10.2
  const { g, al } = buatBadan(W, H, D, 12.6, '#35425c', 1.2)
  const bilahH = (26 / 218) * lw
  const halH = lh - bilahH
  // lapisan dasar berwarna puncak halaman = sudut atas membulat; bilah status (transparan) & halaman di atasnya
  const dasar = new Mesh(bidangLayar(lw, lh, r), new MeshBasicMaterial({ color: isi.top, toneMapped: false }))
  dasar.position.z = D / 2 + 0.05
  g.add(dasar)
  const bilah = new Mesh(new PlaneGeometry(lw, bilahH), new MeshBasicMaterial({ map: teksturBilahStatus(isi.fg, aniso), transparent: true, depthWrite: false, toneMapped: false }))
  bilah.position.set(0, lh / 2 - bilahH / 2, D / 2 + 0.09)
  g.add(bilah)
  const hal = new Mesh(bidangLayar(lw, halH, [0.01, 0.01, r, r], 0, -lh / 2 + halH / 2), isiLayar(halaman))
  hal.position.z = D / 2 + 0.09
  g.add(hal)
  // tombol samping
  const geo = new BoxGeometry(1.3, 1, 2.9)
  ;[
    [-W / 2 + 0.1, H / 2 - 31, 7.4],
    [-W / 2 + 0.1, H / 2 - 45.5, 10.6],
    [-W / 2 + 0.1, H / 2 - 57.6, 10.6],
    [W / 2 - 0.1, H / 2 - 48.5, 17.5],
  ].forEach(([x, y, l]) => {
    const t = new Mesh(geo, al)
    t.position.set(x, y, 0.55)
    t.scale.y = l
    g.add(t)
  })
  g.position.y = H / 2
  const root = new Group()
  const mm = new Group()
  mm.scale.setScalar(MM)
  mm.add(g)
  root.add(mm)
  return { root, layar: layarGulir(halaman, isi.ukuran.phone, lw / halH) }
}

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
  const pm = new PMREMGenerator(renderer)
  const rt = pm.fromScene(env, 0.025, 0.1, 40)
  pm.dispose()
  env.traverse((o) => {
    if (o instanceof Mesh) o.material.dispose()
  })
  kotak.dispose()
  return rt
}

// ---------------------------------------------------------------------------------------------------------------------
// Susunan: LEGA = kartu utama ≥640px (rasio ±2:1), RAPAT = di bawahnya (±1,43:1). Sama dengan .trio-main / .trio-tight.
// ---------------------------------------------------------------------------------------------------------------------
type Pose = { x: number; z: number; yaw: number; s: number }
type Susunan = { lebar: number; cy: number; lap: Pose; tab: Pose; pho: Pose }
const LEGA: Susunan = {
  lebar: 5.3,
  cy: 0.86,
  lap: { x: -1.03, z: -0.72, yaw: 0.09, s: 1 },
  tab: { x: 0.98, z: 0.46, yaw: -0.13, s: 0.74 },
  pho: { x: 1.86, z: 1.0, yaw: -0.22, s: 0.94 },
}
const RAPAT: Susunan = {
  lebar: 4.45,
  cy: 0.92,
  lap: { x: -0.56, z: -0.75, yaw: 0.07, s: 1 },
  tab: { x: 0.62, z: 0.58, yaw: -0.1, s: 0.72 },
  pho: { x: 1.4, z: 1.08, yaw: -0.18, s: 1 },
}
const FOV = 16
const ELEVASI = 9 * D2R
const CONDONG = -6 * D2R

// pegas teredam kritis: kecepatan tetap menyambung saat sasarannya berubah di tengah gerak
type Pegas = { x: number; v: number }
function redam(s: Pegas, sasaran: number, waktu: number, dt: number) {
  const o = 2 / waktu
  const k = o * dt
  const e = 1 / (1 + k + 0.48 * k * k + 0.235 * k * k * k)
  const d = s.x - sasaran
  const t = (s.v + o * d) * dt
  s.v = (s.v - o * t) * e
  s.x = sasaran + (d + t) * e
}

/**
 * Menyalakan trio 3D di `kanvas` (anak .trio). Mengembalikan fungsi pelepas, atau null bila gagal/dibatalkan
 * (trio CSS tetap tampil). Bila kemudian terlalu lambat atau konteks WebGL hilang, ia melepas dirinya sendiri.
 */
export async function pasangTrio3D(kanvas: HTMLCanvasElement, isi: IsiTrio, batal: () => boolean): Promise<(() => void) | null> {
  const akar = kanvas.parentElement as HTMLElement
  const kartu = (kanvas.closest('.work') as HTMLElement | null) ?? akar

  const renderer = new WebGLRenderer({ canvas: kanvas, alpha: true, antialias: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true })
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 0)
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())

  // varian gambar menurut ukuran tampil layar di trio CSS: berkas yang sama dengan pilihan srcset-nya, jadi tidak terunduh dua kali
  const muat = async (dev: Dev, pilih: string) => {
    const lebar = (akar.querySelector(pilih) as HTMLElement | null)?.getBoundingClientRect().width ?? 300
    const img = new Image()
    img.src = isi.gambar(dev, lebar * (window.devicePixelRatio || 1))
    await img.decode()
    const t = new Texture(img)
    t.colorSpace = SRGBColorSpace
    t.minFilter = LinearMipmapLinearFilter
    t.anisotropy = aniso
    t.needsUpdate = true
    return t
  }

  let lepas: () => void = () => {}
  try {
    const [txL, txT, txP] = await Promise.all([muat('desktop', '.dv-lap .win'), muat('tablet', '.dv-tab .win'), muat('phone', '.dv-pho .win')])
    if (batal()) throw new Error('batal')
    await jeda()

    const scene = new Scene()
    const envRT = buatLingkungan(renderer)
    await jeda()

    const lap = buatLaptop(isi, txL, aniso)
    const tab = buatTablet(isi, txT)
    const pho = buatPonsel(isi, txP, aniso)
    tab.root.children[0].rotation.x = CONDONG
    pho.root.children[0].rotation.x = CONDONG

    // bayangan lantai panggang: satu bidang lembut per perangkat
    const txB = teksturBayangan()
    const bahanB = new MeshBasicMaterial({ map: txB, transparent: true, depthWrite: false, toneMapped: false })
    const bayangan = (induk: Group, w: number, d: number, z = 0, opasitas = 1) => {
      const m = new Mesh(new PlaneGeometry(w, d), opasitas === 1 ? bahanB : Object.assign(bahanB.clone(), { opacity: opasitas }))
      m.rotation.x = -PI / 2
      m.position.set(0, 0.002, z)
      m.renderOrder = -1
      induk.add(m)
    }
    bayangan(lap.root, 3.75, 2.9, 0.02)
    bayangan(tab.root, 2.5, 0.75, 0.04, 0.85)
    bayangan(pho.root, 1.2, 0.55, 0.05, 0.9)

    const rig = new Group()
    rig.add(lap.root, tab.root, pho.root)
    scene.add(rig)
    // envMapIntensity tiap bahan hanya berlaku lewat material.envMap (bukan scene.environment)
    scene.traverse((o) => {
      if (!(o instanceof Mesh)) return
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m instanceof MeshStandardMaterial) m.envMap = envRT.texture
    })

    const camera = new PerspectiveCamera(FOV, 2, 1, 40)
    let L = LEGA
    const atur = () => {
      const r = kanvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      renderer.setSize(r.width, r.height, false)
      const a = akar.getBoundingClientRect()
      L = a.width / a.height > 1.7 ? LEGA : RAPAT
      lap.root.position.set(L.lap.x, 0, L.lap.z)
      lap.root.rotation.y = L.lap.yaw
      lap.root.scale.setScalar(L.lap.s)
      tab.root.rotation.y = L.tab.yaw
      tab.root.scale.setScalar(L.tab.s)
      pho.root.rotation.y = L.pho.yaw
      pho.root.scale.setScalar(L.pho.s)
      camera.aspect = r.width / r.height
      const d = L.lebar / 2 / (Math.tan((FOV / 2) * D2R) * camera.aspect)
      camera.position.set(0, L.cy + d * Math.sin(ELEVASI), d * Math.cos(ELEVASI))
      camera.lookAt(0, L.cy, 0)
      camera.updateProjectionMatrix()
    }
    atur()

    // tanpa ekstensi ini shader dikompilasi saat bingkai pertama saja (compileAsync akan mencetak peringatan)
    if (renderer.extensions.has('KHR_parallel_shader_compile')) await renderer.compileAsync(scene, camera)
    renderer.initTexture(txL)
    await jeda()
    renderer.initTexture(txT)
    renderer.initTexture(txP)
    if (batal()) throw new Error('batal')

    // ---- gerak ----------------------------------------------------------------------------------------------------
    const adaSorot = matchMedia('(hover: hover)').matches
    const ry: Pegas = { x: 0, v: 0 }
    const rx: Pegas = { x: 0, v: 0 }
    const buka: Pegas = { x: 0, v: 0 }
    const angkat: Pegas = { x: 0, v: 0 }
    const geser: Pegas = { x: 0, v: 0 }
    const panSentuh: Pegas = { x: 0, v: 0 }
    let px = 0
    let py = 0
    let disorot = false
    const gulir = [
      { l: lap.layar, x: 0, dari: 0, ke: 0, mulai: 0, lama: 1, tunggu: 0.15, dur: 6 },
      { l: tab.layar, x: 0, dari: 0, ke: 0, mulai: 0, lama: 1, tunggu: 0.35, dur: 5.5 },
      { l: pho.layar, x: 0, dari: 0, ke: 0, mulai: 0, lama: 1, tunggu: 0.55, dur: 5 },
    ]
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
      minta()
    }

    let raf = 0
    let terlihat = true
    let tadi = 0
    let pertama = true
    let beruntun = false
    let jumlahMs = 0
    let jumlahF = 0
    let lambat = 0
    const minta = () => {
      if (!raf && terlihat) raf = requestAnimationFrame(langkah)
    }

    function langkah(now: number) {
      raf = 0
      const selang = now - tadi
      tadi = now
      const dt = pertama || selang > 100 ? 1 / 60 : selang / 1000

      const vh = window.innerHeight
      const r = akar.getBoundingClientRect()
      const c = r.top + r.height / 2
      // p: 0 saat trio baru masuk dari bawah, 1 saat tengahnya mencapai 60% tinggi layar
      const p = klem((vh * 1.02 - c) / (vh * 0.42))
      const e = 1 - (1 - p) ** 3
      // g: -1..1 sepanjang trio melintasi layar
      const lintas = klem((vh / 2 - c) / (vh / 2 + r.height / 2), -1, 1)

      const sRy = -0.05 + lintas * 0.12 - (1 - e) * 0.2 + px * 0.16
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
      lap.tutup.rotation.x = (90 - campur(68, 106, buka.x)) * D2R
      const u = 1 - buka.x
      tab.root.position.set(L.tab.x + u * 0.5 + geser.x * 0.03, angkat.x * 0.03, L.tab.z - u * 0.45 + angkat.x * 0.1)
      pho.root.position.set(L.pho.x + u * 0.85 + geser.x * 0.06, angkat.x * 0.05, L.pho.z - u * 0.7 + angkat.x * 0.2)

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
        if (Math.abs(panSentuh.x - s) > 0.001 || Math.abs(panSentuh.v) > 0.001) hidup = true
      }

      renderer.render(scene, camera)
      if (pertama) {
        pertama = false
        requestAnimationFrame(() => akar.classList.add('trio-3d'))
      }

      // penjaga: dua jendela berturut-turut terlalu lambat = kembali ke trio CSS. Hanya bingkai yang beruntun dihitung;
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
            lepas()
            return
          }
        }
      }

      const belum = (s: Pegas, sasaran: number) => Math.abs(s.x - sasaran) > 0.0004 || Math.abs(s.v) > 0.0008
      beruntun = hidup || belum(ry, sRy) || belum(rx, sRx) || belum(buka, e) || belum(angkat, sAngkat) || belum(geser, px)
      if (beruntun) minta()
    }

    // ---- peristiwa ------------------------------------------------------------------------------------------------
    const onGulir = () => minta()
    const onGerak = (ev: PointerEvent) => {
      if (ev.pointerType === 'touch') return
      const k = kartu.getBoundingClientRect()
      px = klem(((ev.clientX - k.left) / k.width) * 2 - 1, -1, 1)
      py = klem(((ev.clientY - k.top) / k.height) * 2 - 1, -1, 1)
      setSorot(true)
      minta()
    }
    const onKeluar = () => setSorot(kartu.matches(':focus-visible'))
    const onFokus = () => setSorot(kartu.matches(':focus-visible'))
    const onHilang = (ev: Event) => {
      ev.preventDefault()
      lepas()
    }
    window.addEventListener('scroll', onGulir, { passive: true })
    if (adaSorot) {
      kartu.addEventListener('pointermove', onGerak, { passive: true })
      kartu.addEventListener('pointerleave', onKeluar)
    }
    kartu.addEventListener('focusin', onFokus)
    kartu.addEventListener('focusout', onFokus)
    kanvas.addEventListener('webglcontextlost', onHilang)
    const ro = new ResizeObserver(() => {
      atur()
      minta()
    })
    ro.observe(kanvas)
    const io = new IntersectionObserver((ent) => {
      terlihat = ent[ent.length - 1].isIntersecting
      if (terlihat) minta()
      else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    io.observe(kanvas)

    lepas = () => {
      lepas = () => {}
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      window.removeEventListener('scroll', onGulir)
      kartu.removeEventListener('pointermove', onGerak)
      kartu.removeEventListener('pointerleave', onKeluar)
      kartu.removeEventListener('focusin', onFokus)
      kartu.removeEventListener('focusout', onFokus)
      kanvas.removeEventListener('webglcontextlost', onHilang)
      ro.disconnect()
      io.disconnect()
      akar.classList.remove('trio-3d')
      const bahan = new Set<Material>()
      scene.traverse((o) => {
        if (o instanceof Mesh || o instanceof InstancedMesh) {
          o.geometry.dispose()
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) bahan.add(m)
        }
      })
      bahan.forEach((m) => {
        ;(m as MeshBasicMaterial).map?.dispose()
        m.dispose()
      })
      txB.dispose()
      envRT.dispose()
      const gl = renderer.getContext()
      renderer.dispose()
      if (!gl.isContextLost()) renderer.forceContextLoss()
    }

    minta()
    return () => lepas()
  } catch {
    renderer.dispose()
    return null
  }
}
