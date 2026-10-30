// Satu-satunya sumber data paket & harga.
// Dipakai halaman Paket, bagian harga di beranda, halaman layanan, artikel, FAQ, llms.txt,
// dan JSON-LD — ubah harga di sini saja supaya semuanya tidak pernah berselisih.
//
// 23 Okt 2026: paket baru "Aplikasi Mobile (Android & iOS)" dari pemilik: Rp500.000 – Rp10.000.000+, 3–7 hari kerja, DP 50%.
// PintuWeb menyerahkan file aplikasi + kode sumber; rilis ke Play Store/App Store diurus klien dengan akun developer miliknya.
// Garansi bug GUARANTEE_DAYS hari berlaku juga untuk aplikasi, sejak aplikasi diserahkan (keputusan pemilik 23 Okt 2026).
//
// 22 Okt 2026: harga 14 paket ditetapkan ulang oleh pemilik (angka di DATA di bawah). Website Custom tidak lagi punya
// perkiraan harga: `quote: true` = "harga sesuai kebutuhan", angkanya hanya ada di penawaran setelah konsultasi.
// Waktu pengerjaan, DP 50%, biaya tambahan (ADDONS), dan biaya perpanjangan TIDAK berubah.
//
// 13 Okt 2026: atas permintaan pemilik, harga DAN waktu pengerjaan semua paket diturunkan 50% dari angka 3 Okt di
// bawah ini (waktu: pecahan hari dibulatkan ke atas, 1 minggu = 5 hari kerja).
// Biaya tambahan (ADDONS) dan biaya perpanjangan TIDAK ikut diturunkan.
//
// Harga ditetapkan 3 Okt 2026 (diserahkan pemilik) mengacu kisaran pasar Indonesia 2026:
// landing page ±Rp0,5–1,5 jt, company profile ±Rp1,5–5 jt, e-commerce ±Rp5–25 jt,
// undangan digital ±Rp50–500 rb (premium/custom hingga ±Rp2 jt), sistem booking ±Rp5–12 jt,
// website properti ±Rp2–15 jt (marketplace multi-agen ±Rp15–45 jt), aplikasi web ±Rp2–12 jt,
// desain UI ±Rp250 rb–1 jt per layar. PintuWeb sengaja berada di sisi terjangkau–menengah.

import { GUARANTEE_DAYS, WA_NUMBER } from './site'

export { WA_NUMBER }

export type PaketGroup = 'bisnis' | 'toko' | 'personal' | 'sistem' | 'mobile' | 'desain'

/** Perkiraan waktu pengerjaan: rentang dalam hari kerja atau minggu. `flex` = masih bergantung pada fitur. */
export type Waktu = { min: number; max: number; unit: 'hari' | 'minggu'; flex?: boolean }
const waktuId = (w: Waktu) => `${w.min === w.max ? w.min : `${w.min}–${w.max}`} ${w.unit === 'hari' ? 'hari kerja' : 'minggu'}${w.flex ? ', tergantung fitur' : ''}`

type PaketBase = {
  slug: string
  group: PaketGroup
  title: string
  badge?: string
  badgeColor?: 'green' | 'blue' | 'red' | 'purple'
  /** tampil di ringkasan beranda */
  featured?: boolean
  recommended?: boolean
  subtitle: string
  /** perkiraan waktu pengerjaan setelah konten lengkap (data; teksnya dirakit per bahasa) */
  time: Waktu
  /** `time` dalam bahasa Indonesia, mis. "1–2 hari kerja"; bahasa lain lewat packagesFor() di i18n/facts.ts */
  duration: string
  highlights: string[]
  features: string[]
}

/** Paket berkisaran harga (Rupiah). */
type Berharga = {
  quote?: undefined
  minPrice: number
  maxPrice: number
  /** true bila batas atas bisa lebih (ditampilkan dengan "+") */
  openEnded?: boolean
}
/**
 * Paket TANPA perkiraan harga ("harga sesuai kebutuhan · konsultasi gratis"): tidak punya angka sama sekali, jadi tidak
 * ikut skala peta harga, harga "mulai", JSON-LD harga, atau penanda {{from:…}}/{{max:…}} (fillFacts menolaknya).
 */
type SesuaiKebutuhan = { quote: true; minPrice?: undefined; maxPrice?: undefined; openEnded?: undefined }

export type Paket = PaketBase & (Berharga | SesuaiKebutuhan)
export type PaketBerharga = PaketBase & Berharga

/** true bila paket punya kisaran harga; paket "sesuai kebutuhan" (quote) menghasilkan false. */
export const isPriced = <T extends { quote?: boolean }>(p: T): p is Extract<T, { quote?: undefined }> => !p.quote

/** Omit yang tetap membedakan dua bentuk paket di atas. */
type DistOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

export const PACKAGE_GROUPS: PaketGroup[] = ['bisnis', 'toko', 'personal', 'sistem', 'mobile', 'desain']

/**
 * Tanggal harga & waktu pengerjaan terakhir ditetapkan. NAIKKAN bila angka paket berubah: tampil sebagai
 * "Harga berlaku per …" dan menjadi tanggal pembaruan artikel serta dokumen legal yang memuat angka paket.
 */
export const PRICES_UPDATED = '2026-10-23'

const DATA: DistOmit<Paket, 'duration'>[] = [
  // ---- Website bisnis ----
  {
    slug: 'landing-page',
    group: 'bisnis',
    title: 'Landing Page',
    minPrice: 100000,
    maxPrice: 500000,
    badge: 'Starter',
    badgeColor: 'green',
    featured: true,
    subtitle: 'Satu halaman untuk promosi',
    time: { min: 1, max: 2, unit: 'hari' },
    highlights: ['Promosi produk', 'Event', 'Kampanye iklan'],
    features: [
      '1 halaman promosi',
      'Bantuan menulis teks halaman',
      'Desain modern, enak dibuka di HP',
      'Gratis domain .com/.xyz + SSL 1 tahun',
      'Cepat dibuka & mudah ditemukan di Google',
      'Formulir kontak + tombol WhatsApp',
      'Bonus: maintenance 1 bulan',
    ],
  },
  {
    slug: 'standar-umkm',
    group: 'bisnis',
    title: 'Standar UMKM',
    minPrice: 500000,
    maxPrice: 1500000,
    badge: 'Bisnis',
    badgeColor: 'blue',
    featured: true,
    recommended: true,
    subtitle: 'Website 3–5 halaman untuk usahamu',
    time: { min: 2, max: 3, unit: 'hari' },
    highlights: ['Company profile', 'Jasa & layanan', 'UMKM'],
    features: [
      '3–5 halaman lengkap (Home, Profil, Layanan, Blog, Kontak)',
      'Desain rapi, enak dibuka di HP',
      'Domain .com + hosting + SSL',
      'Form kontak, WhatsApp & Google Maps',
      'Teks dasar & SEO dasar',
      '2× revisi desain',
      'Maintenance & keamanan 1–3 bulan',
    ],
  },
  // ---- Toko online ----
  {
    slug: 'toko-online-simple',
    group: 'toko',
    title: 'Toko Online Simple',
    minPrice: 300000,
    maxPrice: 2000000,
    featured: true,
    subtitle: 'Mulai jualan online dengan mudah',
    time: { min: 3, max: 5, unit: 'hari' },
    highlights: ['Katalog produk', 'Order via WhatsApp', 'Toko ritel'],
    features: [
      'Katalog produk hingga 20 item',
      'Pesanan masuk lewat WhatsApp',
      'Kategori produk & banner promo',
      'Enak dibuka di HP & cepat',
      'Mudah mengubah produk sendiri',
      '2× revisi tampilan/konten',
      'Domain + hosting + SSL sudah termasuk',
    ],
  },
  {
    slug: 'toko-online-full',
    group: 'toko',
    title: 'Toko Online Full',
    minPrice: 3000000,
    maxPrice: 10000000,
    openEnded: true,
    badge: 'Premium',
    badgeColor: 'red',
    subtitle: 'Toko online lengkap dengan halaman admin',
    time: { min: 5, max: 8, unit: 'hari' },
    highlights: ['Toko lengkap', 'Ongkir otomatis', 'Kelola pesanan'],
    features: [
      'Keranjang belanja & sistem checkout lengkap',
      'Pembayaran online',
      'Ongkir otomatis (via RajaOngkir)',
      'Halaman admin untuk produk & pesanan',
      'Cepat dibuka di HP & mudah ditemukan di Google',
      'Maintenance & support 3–6 bulan',
      'Domain + hosting + SSL',
    ],
  },
  // ---- Personal & acara ----
  {
    slug: 'link-in-bio',
    group: 'personal',
    title: 'Link in Bio',
    minPrice: 100000,
    maxPrice: 300000,
    subtitle: 'Satu tautan untuk semua kanalmu',
    time: { min: 1, max: 2, unit: 'hari' },
    highlights: ['Kreator', 'Kafe & warung', 'Musisi'],
    features: [
      'Satu halaman link in bio sesuai mereknya',
      'Tombol WhatsApp & tautan ke semua kanal',
      'Satu fitur khusus: menu, pre-order, jadwal, atau katalog',
      'Domain .my.id/.biz.id + hosting 1 tahun',
      'Cepat dibuka di HP & mudah ditemukan di Google',
      '1× revisi',
    ],
  },
  {
    slug: 'undangan-digital',
    group: 'personal',
    title: 'Undangan Digital',
    minPrice: 50000,
    maxPrice: 200000,
    subtitle: 'Undangan online dari tema galeri, diisi data acaramu',
    time: { min: 1, max: 1, unit: 'hari' },
    highlights: ['Pernikahan', 'Khitanan & aqiqah', 'Ulang tahun & wisuda'],
    features: [
      'Tema dari galeri undangan, disesuaikan data acara',
      'Detail acara + tombol peta lokasi',
      'Hitung mundur & konfirmasi hadir (RSVP)',
      'Galeri foto & musik latar (opsional)',
      'Tautan pribadi aktif 12 bulan, tanpa biaya perpanjangan',
      '1× revisi data',
    ],
  },
  {
    slug: 'situs-acara',
    group: 'personal',
    title: 'Situs Acara & Undangan Custom',
    minPrice: 300000,
    maxPrice: 1000000,
    subtitle: 'Desain khusus untuk acara besar atau acara kantor',
    time: { min: 2, max: 4, unit: 'hari' },
    highlights: ['Acara kantor', 'Seminar & konferensi', 'Pernikahan premium'],
    features: [
      'Desain khusus, bukan tema siap pakai',
      'Agenda, pembicara, atau rangkaian acara',
      'Pendaftaran peserta/RSVP, data bisa diunduh',
      'Domain sendiri (opsional)',
      'Aktif 12 bulan',
      '2× revisi',
    ],
  },
  {
    slug: 'portofolio',
    group: 'personal',
    title: 'Portofolio / Personal Branding',
    minPrice: 150000,
    maxPrice: 1200000,
    subtitle: 'Etalase karya untuk freelancer dan kreator',
    time: { min: 2, max: 3, unit: 'hari' },
    highlights: ['Freelancer', 'Kreator', 'Profesional'],
    features: [
      'Halaman Tentang, Karya, Blog & Kontak',
      'Desain bersih dan rapi',
      'Tombol ke WhatsApp, LinkedIn, IG, dll.',
      'Mudah ditemukan di Google',
      'Domain + hosting + SSL 1 tahun',
      'Cocok untuk freelancer & kreator',
    ],
  },
  // ---- Sistem & aplikasi web ----
  {
    slug: 'sistem-reservasi',
    group: 'sistem',
    title: 'Sistem Reservasi Online',
    minPrice: 1500000,
    maxPrice: 5000000,
    subtitle: 'Booking meja, kamar, jadwal dokter, atau lapangan',
    time: { min: 1, max: 2, unit: 'minggu' },
    highlights: ['Restoran & kafe', 'Klinik', 'Hotel & lapangan'],
    features: [
      'Kalender & jadwal tersedia otomatis',
      'Formulir pesan + konfirmasi lewat WhatsApp/email',
      'Halaman admin untuk jadwal & pesanan',
      'Aturan jam operasional, kapasitas, dan harga',
      'Opsi DP online',
      'Domain + hosting + SSL 1 tahun',
      'Maintenance & support 3 bulan',
    ],
  },
  {
    slug: 'website-properti',
    group: 'sistem',
    title: 'Website Properti',
    minPrice: 1000000,
    maxPrice: 10000000,
    subtitle: 'Katalog listing untuk agen atau developer',
    time: { min: 5, max: 8, unit: 'hari' },
    highlights: ['Agen properti', 'Developer perumahan', 'Kos & kontrakan'],
    features: [
      'Listing dengan filter lokasi, harga, dan tipe',
      'Halaman detail + galeri foto & peta',
      'Formulir jadwal kunjungan / tanya agen',
      'Halaman admin untuk mengelola listing',
      'Tiap listing mudah ditemukan di Google',
      'Domain + hosting + SSL 1 tahun',
      'Maintenance & support 3 bulan',
    ],
  },
  {
    slug: 'marketplace-properti',
    group: 'sistem',
    title: 'Marketplace Properti',
    minPrice: 3000000,
    maxPrice: 10000000,
    openEnded: true,
    subtitle: 'Portal properti: banyak agen memasang, satu tempat mencari',
    time: { min: 2, max: 4, unit: 'minggu' },
    highlights: ['Portal properti', 'Jaringan agen', 'Startup properti'],
    features: [
      'Akun agen & pemilik untuk memasang listing',
      'Admin memeriksa listing sebelum tayang',
      'Pencarian, filter, dan bandingkan listing',
      'Halaman profil agen',
      'Formulir calon pembeli & pemberitahuan',
      'Domain + hosting + SSL 1 tahun',
      'Maintenance & support 6 bulan',
    ],
  },
  {
    slug: 'aplikasi-web',
    group: 'sistem',
    title: 'Aplikasi Web',
    minPrice: 2000000,
    maxPrice: 10000000,
    openEnded: true,
    subtitle: 'Aplikasi kerja: tugas, kanban, kalender, atau data internal',
    time: { min: 1, max: 2, unit: 'minggu' },
    highlights: ['Tim kecil', 'Operasional internal', 'Startup'],
    features: [
      'Login & jenis pengguna',
      'Kelola data: tambah, ubah, hapus, cari',
      'Tampilan kanban, kalender, atau laporan sesuai kebutuhan',
      'Ekspor data (CSV/Excel)',
      'Enak dibuka di HP',
      'Hosting + database 1 tahun',
      'Maintenance & support 3 bulan',
    ],
  },
  {
    slug: 'website-custom',
    group: 'sistem',
    title: 'Website Custom',
    quote: true,
    badge: 'Custom',
    badgeColor: 'purple',
    subtitle: 'Desain dan fitur sesuai kebutuhanmu',
    time: { min: 1, max: 3, unit: 'minggu', flex: true },
    highlights: ['Startup', 'Instansi', 'Sistem khusus'],
    features: [
      'Desain sepenuhnya khusus',
      'Jumlah halaman & fitur fleksibel',
      'Sambungan ke sistem lain, booking, formulir rumit',
      'Teknologi modern (Next.js, Tailwind, dll.)',
      'Konsultasi tampilan & kecepatan',
      'Maintenance teknis 3 bulan',
      'Cocok untuk startup & instansi',
    ],
  },
  // ---- Aplikasi mobile (23 Okt 2026) ----
  {
    slug: 'aplikasi-mobile',
    group: 'mobile',
    title: 'Aplikasi Mobile (Android & iOS)',
    minPrice: 500000,
    maxPrice: 10000000,
    openEnded: true,
    subtitle: 'Aplikasi HP untuk usaha: Android, iOS, dan web',
    time: { min: 3, max: 7, unit: 'hari' },
    highlights: ['Kasir & member', 'Booking & pesan-antar', 'Sekolah, kantor & komunitas'],
    // isi paket dari pemilik (23 Okt 2026), ditulis netral: fitur yang "bila diperlukan" masuk penawaran per proyek
    features: [
      'Aplikasi Android & iOS dari satu kode',
      'Versi web dari kode yang sama',
      'Desain setiap layar sesuai merek',
      'Data tersimpan di HP & bisa offline bila perlu',
      'Notifikasi dan halaman admin sesuai kebutuhan',
      'Serah terima file aplikasi + kode sumber',
      `Garansi perbaikan bug ${GUARANTEE_DAYS} hari sejak aplikasi diserahkan`,
      'Rilis ke Play Store/App Store diurus klien dengan akun developer sendiri',
    ],
  },
  // ---- Desain ----
  {
    slug: 'konsep-desain',
    group: 'desain',
    title: 'Konsep Desain Website',
    minPrice: 1000000,
    maxPrice: 3000000,
    subtitle: 'Beberapa konsep live untuk satu permintaan, pilih yang terbaik',
    time: { min: 3, max: 5, unit: 'hari' },
    highlights: ['Rebranding', 'Pitching', 'Kontes desain'],
    features: [
      '3–5 konsep desain berbeda untuk satu permintaan',
      'Halaman live yang bisa diklik, bukan sekadar gambar',
      'Penjelasan singkat tiap konsep',
      'Konsep terpilih bisa dilanjutkan ke paket website',
      '1× revisi pada konsep terpilih',
      'Hak pakai desain setelah pelunasan',
    ],
  },
]

export const PACKAGES: Paket[] = DATA.map((p) => ({ ...p, duration: waktuId(p.time) }))

/** Biaya tambahan (per satuan), dipakai halaman Paket & llms.txt. */
export type Addon = { slug: string; title: string; minPrice: number; maxPrice: number; unit: string }
export const ADDONS: Addon[] = [
  { slug: 'halaman', title: 'Halaman tambahan', minPrice: 150000, maxPrice: 350000, unit: 'per halaman' },
  { slug: 'maintenance', title: 'Maintenance lanjutan', minPrice: 150000, maxPrice: 500000, unit: 'per bulan' },
  { slug: 'artikel', title: 'Artikel blog SEO', minPrice: 100000, maxPrice: 250000, unit: 'per artikel' },
]

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
    .format(n)
    .replace(/\s/g, '')

/** "Rp600.000 – Rp1.200.000", atau "... – Rp6.000.000+" bila openEnded; paket quote: "Harga sesuai kebutuhan" */
export const priceRange = (p: Paket) =>
  isPriced(p) ? `${formatRupiah(p.minPrice)} – ${formatRupiah(p.maxPrice)}${p.openEnded ? '+' : ''}` : 'Harga sesuai kebutuhan'

export const waLink = (paket: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo PintuWeb, saya tertarik dengan paket "${paket}". Boleh minta info lebih lanjut?`
  )}`

/** Paket urut dari yang termurah (seri: batas atas lebih rendah dulu); paket "sesuai kebutuhan" di paling akhir. */
export const byPrice = <T extends Paket>(list: T[]): T[] =>
  [...list].sort((a, b) => {
    if (!isPriced(a) || !isPriced(b)) return Number(!isPriced(a)) - Number(!isPriced(b))
    return a.minPrice - b.minPrice || a.maxPrice - b.maxPrice
  })

/** Paket yang punya kisaran harga saja (untuk skala, harga mulai, dan JSON-LD). */
export const pricedOnly = <T extends Paket>(list: T[]) => list.filter(isPriced)

/** Kalimat ringkas harga untuk FAQ — selalu mengikuti PACKAGES. */
export const PRICE_SUMMARY =
  `Harga mulai ${byPrice(pricedOnly(PACKAGES)).map((p) => `${formatRupiah(p.minPrice)} untuk ${p.title}`).join(', ')}` +
  `${PACKAGES.some((p) => p.quote) ? `; ${PACKAGES.filter((p) => p.quote).map((p) => p.title).join(', ')} harganya sesuai kebutuhan (konsultasi gratis)` : ''}. ` +
  'Rincian fitur tiap paket ada di halaman Paket. Semua harga sudah termasuk desain dan pengerjaan; paket website juga mencakup SEO dasar.'

/** Kisaran biaya perpanjangan domain + hosting per tahun mulai tahun kedua (Rupiah). */
export const RENEWAL_PER_YEAR = { min: 300000, max: 500000 }
/** Link in bio memakai domain .my.id/.biz.id yang lebih murah. */
export const RENEWAL_BIO_PER_YEAR = { min: 100000, max: 150000 }

/** Biaya setelah tahun pertama — wajib tampil di halaman harga (bukan hanya di FAQ). */
export const RENEWAL_SUMMARY =
  'Domain dan hosting di dalam paket berlaku untuk tahun pertama. Mulai tahun kedua, perpanjangannya sekitar ' +
  `${formatRupiah(RENEWAL_PER_YEAR.min)}–${formatRupiah(RENEWAL_PER_YEAR.max)} per tahun untuk website dan ` +
  `${formatRupiah(RENEWAL_BIO_PER_YEAR.min)}–${formatRupiah(RENEWAL_BIO_PER_YEAR.max)} untuk link in bio. ` +
  'Untuk sistem dan aplikasi web dengan database, biayanya tertulis di penawaran. Undangan digital aktif 12 bulan ' +
  'tanpa biaya perpanjangan. Kami kabari sebelum jatuh tempo.'

/**
 * Metode pembayaran yang diterima (keputusan pemilik, 22 Okt 2026): QRIS, transfer bank, DANA, SeaBank, dan USDT
 * (USDT untuk semua klien). Nomor rekening, tujuan pembayaran, dan untuk USDT jaringan + alamat dompet hanya ditulis
 * di invoice, tidak di situs. Urutan ini dipakai strip logo di footer dan halaman Cara Bayar.
 */
export const PAYMENT_METHODS = ['qris', 'bank', 'dana', 'seabank', 'usdt'] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export const PAYMENT_SUMMARY =
  'Semua paket: DP 50% untuk memulai, pelunasan 50% setelah website selesai dan kamu setujui. ' +
  'Bayar lewat QRIS, transfer bank, DANA, SeaBank, atau USDT. Invoice dikirim sebelum pembayaran, berisi nomor rekening atau alamat dompet.'
