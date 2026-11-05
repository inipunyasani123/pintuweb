'use client'
// Pemuat kecil panggung 3D "Cara kerja" (adegannya di tiga/proses.ts). Hiasan saja: keempat tahap tetap teks biasa di
// bawahnya. Bila perangkatnya tak layak, panggung ini tidak mengambil tempat dan bagian ini tampil seperti biasa.
import { usePakai3D } from './tiga/pakai3D'

export default function Proses3D() {
  const ref = usePakai3D(() => import('./tiga/proses').then((m) => m.pasangProses), { akar: '.proses-wadah', kelas: 'proses-3d-siap' })
  return (
    <div className="proses-panggung" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
