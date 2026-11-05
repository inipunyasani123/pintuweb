// Gambar utama hero yang berkedalaman: bgutama.png (milik pemilik, tidak diubah) digambar ulang dengan peta kedalaman
// (public/layar/bgutama-dalam.webp), jadi orang, kursi, layar, dan tanaman bergeser berbeda-beda mengikuti kursor & gulir.
// WebGL2 polos, sengaja tanpa Three.js: hero tampil di awal kunjungan, jadi efeknya tidak boleh menyeret ±130 KB skrip.
// Saat diam hasilnya sama persis dengan <img> di bawahnya, dan tidak ada yang digambar. Di bawah 768px gambar tertutup
// tabir putih, jadi efek ini tidak dipasang.
import { KUNCI_LAMBAT } from './layak'

const BATAS_MS = 40
const VS = `#version 300 es
out vec2 v;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  v = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`
// berjalan dari lapisan terdekat ke terjauh sampai menabrak permukaan, supaya benda dekat menutupi benda jauh
const FS = `#version 300 es
precision highp float;
in vec2 v;
out vec4 warna;
uniform sampler2D uFoto;
uniform sampler2D uDalam;
uniform vec2 uGeser;
uniform vec2 uLampu;
uniform float uKuat;
const float FOKUS = 0.3;
const int LANGKAH = 18;
void main() {
  vec2 uv = v;
  for (int i = 0; i < LANGKAH; i++) {
    float lapis = 1.0 - float(i) / float(LANGKAH);
    uv = v + uGeser * (lapis - FOKUS);
    if (texture(uDalam, uv).r >= lapis) break;
  }
  vec3 c = texture(uFoto, clamp(uv, 0.0, 1.0)).rgb;
  // cahaya mengikuti kursor: tepi benda (arah dari peta kedalaman) terang di sisi yang menghadap lampu, gelap di sisi
  // sebaliknya, ditambah sorot lembut di sekitar kursor. Saat kursor diam di tengah uKuat = 0: sama persis dengan <img>.
  vec2 e = vec2(0.006, 0.009);
  float dx = texture(uDalam, uv + vec2(e.x, 0.0)).r - texture(uDalam, uv - vec2(e.x, 0.0)).r;
  float dy = texture(uDalam, uv + vec2(0.0, e.y)).r - texture(uDalam, uv - vec2(0.0, e.y)).r;
  float tepi = clamp(dot(vec2(-dx, -dy), normalize(uLampu - v + 0.0001)) * 7.0, -1.0, 1.0);
  float sorot = 1.0 - smoothstep(0.0, 0.72, distance(v, uLampu));
  c *= 1.0 + uKuat * (tepi * 0.2 + (sorot - 0.3) * 0.07);
  warna = vec4(c, 1.0);
}`

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
const klem = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))

function shader(gl: WebGL2RenderingContext, jenis: number, sumber: string) {
  const s = gl.createShader(jenis)!
  gl.shaderSource(s, sumber)
  gl.compileShader(s)
  return s
}
function tekstur(gl: WebGL2RenderingContext, unit: number, img: HTMLImageElement, mipmap: boolean) {
  const t = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  if (mipmap) gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return t
}

export async function pasangKedalaman(kanvas: HTMLCanvasElement, batal: () => boolean): Promise<(() => void) | null> {
  if (window.innerWidth < 768) return null
  const foto = kanvas.parentElement?.querySelector('img') as HTMLImageElement | null
  const area = kanvas.closest('section') as HTMLElement | null
  if (!foto || !area) return null
  const dalam = new Image()
  dalam.src = '/layar/bgutama-dalam.webp'
  try {
    await Promise.all([foto.decode(), dalam.decode()])
  } catch {
    return null
  }
  if (batal()) return null
  const gl = kanvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true })
  if (!gl) return null

  const prog = gl.createProgram()!
  gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VS))
  gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FS))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
  tekstur(gl, 0, foto, true)
  await new Promise((r) => setTimeout(r))
  if (batal()) return null
  tekstur(gl, 1, dalam, false)
  gl.uniform1i(gl.getUniformLocation(prog, 'uFoto'), 0)
  gl.uniform1i(gl.getUniformLocation(prog, 'uDalam'), 1)
  const uGeser = gl.getUniformLocation(prog, 'uGeser')
  const uLampu = gl.getUniformLocation(prog, 'uLampu')
  const uKuat = gl.getUniformLocation(prog, 'uKuat')

  const ax: Pegas = { x: 0, v: 0 }
  const ay: Pegas = { x: 0, v: 0 }
  const lx: Pegas = { x: 0.5, v: 0 }
  const ly: Pegas = { x: 0.5, v: 0 }
  const kuat: Pegas = { x: 0, v: 0 }
  let diDalam = false
  let px = 0
  let py = 0
  const AMP_X = 0.034
  const AMP_Y = 0.02
  // sapaan pelan sekali saat efeknya mulai, supaya kedalamannya terasa juga tanpa kursor
  const mulai = performance.now()
  const LAMA_SAPA = 1900

  const tKursor: [number, number] = [0, 0]
  let raf = 0
  let terlihat = true
  let tadi = 0
  let beruntun = false
  let jumlahMs = 0
  let jumlahF = 0
  let lambat = 0
  let pertama = true
  const minta = () => {
    if (!raf && terlihat) raf = requestAnimationFrame(langkah)
  }
  function langkah(now: number) {
    raf = 0
    const selang = now - tadi
    tadi = now
    const dt = beruntun && selang < 100 ? selang / 1000 : 1 / 60
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
    const tSapa = klem((now - mulai) / LAMA_SAPA)
    const sapa = Math.sin(tSapa * Math.PI) * 0.55
    const sX = (px + sapa) * AMP_X
    // gulir turun: benda dekat naik lebih cepat dari latar
    const sY = -(py * AMP_Y + klem(window.scrollY / Math.max(1, window.innerHeight)) * AMP_Y * 1.2)
    redam(ax, sX, 0.34, dt)
    redam(ay, sY, 0.34, dt)
    // lampu di posisi kursor relatif ke gambar; selama sapaan lampunya ikut menyapu pelan
    const kotak = kanvas.getBoundingClientRect()
    const sLx = diDalam ? klem((tKursor[0] - kotak.left) / kotak.width, -0.2, 1.2) : 0.5 + sapa * 0.5
    const sLy = diDalam ? 1 - klem((tKursor[1] - kotak.top) / kotak.height, -0.2, 1.2) : 0.62
    const sK = diDalam ? 1 : sapa / 0.55
    redam(lx, sLx, 0.3, dt)
    redam(ly, sLy, 0.3, dt)
    redam(kuat, sK, 0.45, dt)
    gl!.viewport(0, 0, kanvas.width, kanvas.height)
    gl!.uniform2f(uGeser, ax.x, ay.x)
    gl!.uniform2f(uLampu, lx.x, ly.x)
    gl!.uniform1f(uKuat, Math.max(0, kuat.x))
    gl!.drawArrays(gl!.TRIANGLES, 0, 3)
    if (pertama) {
      pertama = false
      requestAnimationFrame(() => kanvas.classList.add('hero-dalam-on'))
    }
    const hidup = tSapa < 1 || Math.abs(ax.x - sX) > 0.00002 || Math.abs(ay.x - sY) > 0.00002 || Math.abs(ax.v) > 0.0001 || Math.abs(ay.v) > 0.0001 || Math.abs(kuat.x - sK) > 0.002 || Math.abs(lx.x - sLx) > 0.001 || Math.abs(ly.x - sLy) > 0.001
    beruntun = hidup
    if (hidup) minta()
  }

  const ukur = () => {
    const r = kanvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    kanvas.width = Math.round(r.width * dpr)
    kanvas.height = Math.round(r.height * dpr)
    minta()
  }
  const onGerak = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    const r = area.getBoundingClientRect()
    px = klem(((ev.clientX - r.left) / r.width) * 2 - 1, -1, 1)
    py = klem(((ev.clientY - r.top) / Math.min(r.height, window.innerHeight)) * 2 - 1, -1, 1)
    tKursor[0] = ev.clientX
    tKursor[1] = ev.clientY
    diDalam = true
    minta()
  }
  const onKeluar = () => {
    px = 0
    py = 0
    diDalam = false
    minta()
  }
  const onGulir = () => minta()
  const onHilang = (ev: Event) => {
    ev.preventDefault()
    lepas()
  }
  const ro = new ResizeObserver(ukur)
  const io = new IntersectionObserver((ent) => {
    terlihat = ent[ent.length - 1].isIntersecting
    if (terlihat) minta()
  })
  ukur()
  ro.observe(kanvas)
  io.observe(kanvas)
  area.addEventListener('pointermove', onGerak, { passive: true })
  area.addEventListener('pointerleave', onKeluar)
  window.addEventListener('scroll', onGulir, { passive: true })
  kanvas.addEventListener('webglcontextlost', onHilang)

  let terlepas = false
  function lepas() {
    if (terlepas) return
    terlepas = true
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    ro.disconnect()
    io.disconnect()
    area?.removeEventListener('pointermove', onGerak)
    area?.removeEventListener('pointerleave', onKeluar)
    window.removeEventListener('scroll', onGulir)
    kanvas.removeEventListener('webglcontextlost', onHilang)
    kanvas.classList.remove('hero-dalam-on')
    if (!gl!.isContextLost()) gl!.getExtension('WEBGL_lose_context')?.loseContext()
  }
  return lepas
}
