// Kait pemuat efek 3D: menunggu elemennya mendekat dan halaman menganggur, lalu memuat adegannya (dan Three.js) lewat
// import dinamis. Di perangkat yang tak layak (layak.ts) tidak terjadi apa-apa, jadi tampilan biasa tetap tampil.
// Berkas ini ikut bundel awal, jadi TIDAK boleh mengimpor Three.js.
import { useEffect, useRef, type RefObject } from 'react'
import { layak3D, saatMendekat } from './layak'

export type Pasang = (kanvas: HTMLCanvasElement, batal: () => boolean) => Promise<(() => void) | null>

/**
 * `pesan`: panggung yang mengambil tempat di tata letak memesannya lebih dulu, saat masih di luar layar, bukan saat 3D-nya
 * siap. Kalau menunggu siap, koneksi lambat + gulir cepat membuat isi di bawahnya terdorong selagi terlihat (CLS 0,12).
 */
export function usePakai3D(muat: () => Promise<Pasang>, pesan?: { akar: string; kelas: string }): RefObject<HTMLCanvasElement | null> {
  const ref = useRef<HTMLCanvasElement>(null)
  const pemuat = useRef(muat)
  const pesanan = useRef(pesan)

  useEffect(() => {
    const kanvas = ref.current
    if (!kanvas) return
    let batal = false
    let lepas: (() => void) | null = null
    const akar = pesanan.current ? kanvas.closest(pesanan.current.akar) : null
    const lepasPesanan = () => {
      if (akar && pesanan.current) akar.classList.remove(pesanan.current.kelas)
    }
    const hentikan = saatMendekat(
      kanvas,
      () => {
        // pemeriksaan WebGL-nya sendiri butuh ±10 ms, jadi baru dilakukan saat halaman menganggur
        if (!layak3D()) return
        // gagal memuat potongan skrip = tampilan biasa tetap tampil
        pemuat
          .current()
          .then((pasang) => (batal ? null : pasang(kanvas, () => batal)))
          .then((l) => {
            lepas = l
            if (!l) lepasPesanan()
            if (batal) lepas?.()
          })
          .catch(lepasPesanan)
      },
      () => {
        if (akar && pesanan.current && layak3D()) akar.classList.add(pesanan.current.kelas)
      },
    )
    return () => {
      batal = true
      hentikan()
      lepas?.()
      lepasPesanan()
    }
  }, [])

  return ref
}
