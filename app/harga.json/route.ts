// Berkas harga resmi: https://www.pintuweb.id/harga.json
// Dibaca 11 portal galeri saat build (scripts/ambil-harga.mjs di tiap portal), supaya harga cukup diubah di
// app/lib/packages.ts. Setelah PintuWeb live dan harga berubah, jalankan `node scripts/bangun-ulang-portal.mjs`.
import { PACKAGES, PRICES_UPDATED, isPriced } from '../lib/packages'
import { GUARANTEE_DAYS, PERF_TARGET, WA_DISPLAY, WA_NUMBER } from '../lib/site'

export const dynamic = 'force-static'

export function GET() {
  const paket = Object.fromEntries(
    PACKAGES.map((p) => [
      p.slug,
      {
        nama: p.title,
        mulai: isPriced(p) ? p.minPrice : null,
        sampai: isPriced(p) ? p.maxPrice : null,
        lebih: p.openEnded === true,
        sesuaiKebutuhan: p.quote === true,
        waktu: p.duration,
      },
    ]),
  )
  return Response.json(
    {
      diperbarui: PRICES_UPDATED,
      wa: { nomor: WA_NUMBER, tampil: WA_DISPLAY },
      garansiHari: GUARANTEE_DAYS,
      targetSkor: PERF_TARGET,
      paket,
    },
    { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=3600' } },
  )
}
