'use client'
// Pemuat kecil trio 3D kartu utama "Demo pilihan" (adegannya di trio3d-scene.ts). Three.js + adegan ±136 KB gzip, jadi baru dimuat
// saat kartunya mendekat, setelah halaman menganggur, dan hanya di perangkat yang mampu: gerak tidak dikurangi, tidak
// hemat data/jaringan lambat, memori & inti cukup, WebGL2 berperangkat keras (bukan perenderan perangkat lunak). Selain
// itu trio CSS (DeviceTrio.tsx) tetap tampil apa adanya; kanvas ini tak terlihat dan tak memuat apa pun.
import { useEffect, useRef } from 'react'
import type { Dev, IsiTrio } from './trio3d-scene'

const KUNCI_LAMBAT = 'pw-trio3d'

function layak() {
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

export default function Trio3D({
  host,
  top,
  fg,
  ukuran,
  gambar,
}: {
  host: string
  top: string
  fg: string
  ukuran: Record<Dev, number[]>
  gambar: (dev: Dev, lebarPiksel: number) => string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  // isi trio tidak berubah selama kartunya hidup
  const isi = useRef<IsiTrio>({ host, top, fg, ukuran, gambar })

  useEffect(() => {
    const kanvas = ref.current
    if (!kanvas || !layak()) return
    let batal = false
    let lepas: (() => void) | null = null
    const mulai = async () => {
      const { pasangTrio3D } = await import('./trio3d-scene')
      if (batal) return
      lepas = await pasangTrio3D(kanvas, isi.current, () => batal)
      if (batal) lepas?.()
    }
    const io = new IntersectionObserver(
      (ent) => {
        if (!ent.some((e) => e.isIntersecting)) return
        io.disconnect()
        const nanti = (f: () => void) => (window.requestIdleCallback ? window.requestIdleCallback(f, { timeout: 2000 }) : window.setTimeout(f, 300))
        // gagal memuat potongan skrip = trio CSS tetap tampil
        nanti(() => {
          if (!batal) mulai().catch(() => {})
        })
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(kanvas)
    return () => {
      batal = true
      io.disconnect()
      lepas?.()
    }
  }, [])

  return <canvas ref={ref} className="trio-kanvas" />
}
