// Pemandu paket di halaman harga: tiga pertanyaan singkat → satu paket paling cocok + satu alternatif.
// Logikanya deterministik dan hanya memakai data di lib/packages.ts: tiap paket diberi ciri yang diturunkan dari
// subjudul, sorotan, dan fiturnya sendiri (untuk apa, seberapa besar, bisa bayar online/booking atau tidak), lalu
// diberi skor. Seri dipecah oleh kecocokan tujuan utama, lalu harga termurah. Semua 6 × 3 × 3 kombinasi dihitung
// di server (GUIDE_RESULTS), jadi komponen kliennya hanya membaca tabel. Paket tanpa ciri di FIT (Konsep Desain)
// sengaja tidak pernah disarankan pemandu; ia tetap ada di daftar paket.
import { PACKAGES } from '../lib/packages'

export const GUIDE_PURPOSE = ['usaha', 'jual', 'diri', 'acara', 'properti', 'tim'] as const
export const GUIDE_SIZE = ['satu', 'beberapa', 'banyak'] as const
export const GUIDE_EXTRA = ['tidak', 'bayar', 'booking'] as const
export type GuidePurpose = (typeof GUIDE_PURPOSE)[number]
export type GuideSize = (typeof GUIDE_SIZE)[number]
export type GuideExtra = (typeof GUIDE_EXTRA)[number]

type Fit = {
  /** tujuan; butir pertama = tujuan utama paket itu */
  for: GuidePurpose[]
  /** ukuran yang dilayani paket ini */
  size: GuideSize[]
  /** kemampuan bayar online / booking: 'full' = tersedia penuh, 'part' = sebagian (mis. opsi DP, formulir jadwal) */
  pay?: 'full' | 'part'
  booking?: 'full' | 'part'
  /** kemampuan yang menjadi INTI paket: bagi yang tidak memerlukannya, paket ini kelebihan */
  core?: 'pay' | 'booking'
}

// Sumber tiap ciri (lib/packages.ts):
const FIT: Record<string, Fit> = {
  // "1 halaman promosi"; sorotan: Promosi produk, Event, Kampanye iklan
  'landing-page': { for: ['usaha', 'jual', 'acara'], size: ['satu'] },
  // "3–5 halaman lengkap"
  'standar-umkm': { for: ['usaha'], size: ['beberapa'] },
  // "Katalog produk hingga 20 item", "Checkout via WhatsApp"
  'toko-online-simple': { for: ['jual'], size: ['satu', 'beberapa'] },
  // "Keranjang belanja & sistem checkout lengkap", "Integrasi payment gateway"
  'toko-online-full': { for: ['jual'], size: ['banyak'], pay: 'full', core: 'pay' },
  // "Satu halaman link in bio"; sorotan Kreator, Kafe & warung; "Satu fitur khusus: menu, pre-order, jadwal, atau katalog"
  'link-in-bio': { for: ['diri', 'usaha'], size: ['satu'], booking: 'part' },
  // undangan satu halaman; "konfirmasi kehadiran (RSVP)"
  'undangan-digital': { for: ['acara'], size: ['satu'], booking: 'part' },
  // "Desain khusus untuk acara besar", "Agenda, pembicara, atau rangkaian acara", "Pendaftaran peserta/RSVP"
  'situs-acara': { for: ['acara'], size: ['beberapa', 'banyak'], booking: 'part' },
  // "Halaman Tentang, Karya, Blog & Kontak"
  portofolio: { for: ['diri'], size: ['beberapa'] },
  // "Kalender & slot ketersediaan otomatis", "Opsi DP online lewat payment gateway"
  'sistem-reservasi': { for: ['usaha'], size: ['beberapa', 'banyak'], booking: 'full', pay: 'part', core: 'booking' },
  // "Listing dengan filter", "Formulir jadwal kunjungan"
  'website-properti': { for: ['properti'], size: ['beberapa'], booking: 'part' },
  // "Portal multi-agen"
  'marketplace-properti': { for: ['properti'], size: ['banyak'], booking: 'part' },
  // "Aplikasi kerja: tugas, kanban, kalender, atau data internal"
  'aplikasi-web': { for: ['tim'], size: ['beberapa', 'banyak'] },
  // "Jumlah halaman & fitur fleksibel", "Integrasi API, booking, formulir kompleks"
  'website-custom': { for: ['usaha', 'jual', 'diri', 'acara', 'properti', 'tim'], size: ['banyak'], pay: 'full', booking: 'full' },
}

const SIZE_AT: Record<GuideSize, number> = { satu: 0, beberapa: 1, banyak: 2 }

function score(slug: string, purpose: GuidePurpose, size: GuideSize, extra: GuideExtra) {
  const f = FIT[slug]
  const main = f.for[0] === purpose
  let s = main ? 100 : f.for.includes(purpose) ? 80 : 0
  const gap = Math.min(...f.size.map((x) => Math.abs(SIZE_AT[x] - SIZE_AT[size])))
  s += gap === 0 ? 30 : gap === 1 ? 10 : 0
  if (extra === 'tidak') {
    s += f.core ? 20 : 40
  } else {
    const can = extra === 'bayar' ? f.pay : f.booking
    s += can === 'full' ? 40 : can === 'part' ? 20 : -40
  }
  // paket serba-bisa kalah tipis dari paket yang memang dibuat untuk kebutuhan itu
  if (slug === 'website-custom') s -= 6
  return { s, main }
}

function rank(purpose: GuidePurpose, size: GuideSize, extra: GuideExtra) {
  return PACKAGES.filter((p) => FIT[p.slug])
    .map((p) => ({ slug: p.slug, price: p.minPrice, ...score(p.slug, purpose, size, extra) }))
    .sort((a, b) => b.s - a.s || Number(b.main) - Number(a.main) || a.price - b.price)
}

/** Kunci tabel hasil: "usaha|satu|tidak". */
export const guideKey = (p: GuidePurpose, s: GuideSize, e: GuideExtra) => `${p}|${s}|${e}`

/** [paling cocok, alternatif] untuk tiap kombinasi jawaban. */
export const GUIDE_RESULTS: Record<string, [string, string]> = Object.fromEntries(
  GUIDE_PURPOSE.flatMap((p) =>
    GUIDE_SIZE.flatMap((s) =>
      GUIDE_EXTRA.map((e) => {
        const [best, alt] = rank(p, s, e)
        return [guideKey(p, s, e), [best.slug, alt.slug]]
      }),
    ),
  ),
)

// Ciri yang menunjuk slug yang tidak ada (salah ketik / paket dihapus) menggagalkan build.
for (const slug of Object.keys(FIT)) if (!PACKAGES.some((p) => p.slug === slug)) throw new Error(`Pemandu: paket tidak dikenal ${slug}`)
