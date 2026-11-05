'use client'
// Pemuat kecil 3D "Cara kerja" (adegannya di tiga/proses.ts). Kanvas ini = panggung desktop di atas keempat kolom; ponsel &
// tablet memakai kanvas di dalam tiap tahap (.proses-langkah, Process.tsx). Hiasan saja: keempat tahap tetap teks biasa.
// Bila perangkatnya tak layak, semua panggung tidak mengambil tempat dan bagian ini tampil seperti biasa.
import { usePakai3D } from './tiga/pakai3D'

export default function Proses3D() {
  const ref = usePakai3D(() => import('./tiga/proses').then((m) => m.pasangProses), { akar: '.proses-wadah', kelas: 'proses-3d-siap' })
  return (
    <div className="proses-panggung" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
