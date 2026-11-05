// Syarat perangkat untuk semua efek 3D beranda. Berkas ini ikut bundel awal, jadi TIDAK boleh mengimpor Three.js.
// Gerak tidak dikurangi, tidak hemat data/jaringan lambat, memori & inti cukup, WebGL2 berperangkat keras. Selain itu
// tampilan biasa (trio CSS, gambar hero) tetap tampil apa adanya dan tidak ada unduhan tambahan.
export const KUNCI_LAMBAT = 'pw-trio3d'

let hasil: boolean | null = null

function periksa() {
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return false
  const n = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }
  if (n.connection?.saveData || /(^|-)[23]g$/.test(n.connection?.effectiveType ?? '')) return false
  if ((n.deviceMemory ?? 8) < 4 || (n.hardwareConcurrency ?? 8) < 4) return false
  try {
    // perangkat ini sudah terbukti terlalu lambat di sesi ini
    if (sessionStorage.getItem(KUNCI_LAMBAT) === '0') return false
  } catch {}
  const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
  if (!gl) return false
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const perangkatLunak = !!info && /swiftshader|llvmpipe|software/i.test(String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)))
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  return !perangkatLunak
}

export function layak3D() {
  return (hasil ??= periksa())
}

/** menjalankan f saat elemen mendekat dan halaman sedang menganggur (`segera` tanpa menunggu menganggur); mengembalikan pembatal */
export function saatMendekat(el: Element, f: () => void, segera?: () => void, jarak = '600px 0px') {
  let batal = false
  const io = new IntersectionObserver(
    (ent) => {
      if (!ent.some((e) => e.isIntersecting)) return
      io.disconnect()
      segera?.()
      const jalan = () => {
        if (!batal) f()
      }
      if (window.requestIdleCallback) window.requestIdleCallback(jalan, { timeout: 2000 })
      else window.setTimeout(jalan, 300)
    },
    { rootMargin: jarak },
  )
  io.observe(el)
  return () => {
    batal = true
    io.disconnect()
  }
}
