'use client'
// Pemuat kecil perangkat 3D di pemilih kebutuhan "Untuk siapa" (adegannya di tiga/audience.ts). Hiasan saja: semua
// isinya ada di kartu jawaban. Bila perangkatnya tak layak, tata letak kartu tetap seperti biasa.
import { usePakai3D } from './tiga/pakai3D'

export default function Audience3D() {
  const ref = usePakai3D(() => import('./tiga/audience').then((m) => m.pasangAudience), { akar: 'section', kelas: 'aud-3d-siap' })
  return (
    <div className="aud-panggung" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  )
}
