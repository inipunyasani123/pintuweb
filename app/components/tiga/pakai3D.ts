// Kait pemuat efek 3D: menunggu elemennya mendekat dan halaman menganggur, lalu memuat adegannya (dan Three.js) lewat
// import dinamis. Di perangkat yang tak layak (layak.ts) tidak terjadi apa-apa, jadi tampilan biasa tetap tampil.
// Berkas ini ikut bundel awal, jadi TIDAK boleh mengimpor Three.js.
import { useEffect, useRef, type RefObject } from 'react'
import { layak3D, saatMendekat } from './layak'

export type Pasang = (kanvas: HTMLCanvasElement, batal: () => boolean) => Promise<(() => void) | null>

export function usePakai3D(muat: () => Promise<Pasang>): RefObject<HTMLCanvasElement | null> {
  const ref = useRef<HTMLCanvasElement>(null)
  const pemuat = useRef(muat)

  useEffect(() => {
    const kanvas = ref.current
    if (!kanvas) return
    let batal = false
    let lepas: (() => void) | null = null
    const hentikan = saatMendekat(kanvas, () => {
      // pemeriksaan WebGL-nya sendiri butuh ±10 ms, jadi baru dilakukan saat halaman menganggur
      if (!layak3D()) return
      // gagal memuat potongan skrip = tampilan biasa tetap tampil
      pemuat
        .current()
        .then((pasang) => (batal ? null : pasang(kanvas, () => batal)))
        .then((l) => {
          lepas = l
          if (batal) lepas?.()
        })
        .catch(() => {})
    })
    return () => {
      batal = true
      hentikan()
      lepas?.()
    }
  }, [])

  return ref
}
