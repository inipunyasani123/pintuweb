// Satu-satunya sumber data paket & harga.
// Dipakai halaman Paket, bagian harga di beranda, halaman layanan, artikel, FAQ, llms.txt,
// dan JSON-LD — ubah harga di sini saja supaya semuanya tidak pernah berselisih.
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

import { WA_NUMBER } from './site'

export { WA_NUMBER }

export type PaketGroup = 'bisnis' | 'toko' | 'personal' | 'sistem' | 'desain'

/** Perkiraan waktu pengerjaan: rentang dalam hari kerja atau minggu. `flex` = masih bergantung pada fitur. */
export type Waktu = { min: number; max: number; unit: 'hari' | 'minggu'; flex?: boolean }
const waktuId = (w: Waktu) => `${w.min === w.max ? w.min : `${w.min}–${w.max}`} ${w.unit === 'hari' ? 'hari kerja' : 'minggu'}${w.flex ? ', tergantung fitur' : ''}`

export type Paket = {
  slug: string
  group: PaketGroup
  title: string
  minPrice: number
  maxPrice: number
  /** true bila batas atas bisa lebih (ditampilkan dengan "+") */
  openEnded?: boolean
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

export const PACKAGE_GROUPS: PaketGroup[] = ['bisnis', 'toko', 'personal', 'sistem', 'desain']

/**
 * Tanggal harga & waktu pengerjaan terakhir ditetapkan. NAIKKAN bila angka paket berubah: tampil sebagai
 * "Harga berlaku per …" dan menjadi tanggal pembaruan artikel serta dokumen legal yang memuat angka paket.
 */
export const PRICES_UPDATED = '2026-10-13'

const DATA: Omit<Paket, 'duration'>[] = [
  // ---- Website bisnis ----
  {
    slug: 'landing-page',
    group: 'bisnis',
    title: 'Landing Page',
    minPrice: 300000,
    maxPrice: 600000,
    badge: 'Starter',
    badgeColor: 'green',
    featured: true,
    subtitle: 'Satu halaman promosi yang fokus konversi',
    time: { min: 1, max: 2, unit: 'hari' },
    highlights: ['Promosi produk', 'Event', 'Kampanye iklan'],
    features: [
      '1 halaman promosi yang fokus konversi',
      'Copywriting halaman promosi',
      'Desain modern & mobile-friendly',
      'Gratis domain .com/.xyz + SSL 1 tahun',
      'Optimasi kecepatan & SEO dasar',
      'Form kontak + tombol WhatsApp',
      'Bonus: CDN & maintenance 1 bulan',
    ],
  },
  {
    slug: 'standar-umkm',
    group: 'bisnis',
    title: 'Standar UMKM',
    minPrice: 750000,
    maxPrice: 1250000,
    badge: 'Bisnis',
    badgeColor: 'blue',
    featured: true,
    recommended: true,
    subtitle: 'Website 3–5 halaman untuk usaha',
    time: { min: 2, max: 3, unit: 'hari' },
    highlights: ['Company profile', 'Jasa & layanan', 'UMKM'],
    features: [
      '3–5 halaman lengkap (Home, Profil, Layanan, Blog, Kontak)',
      'Desain profesional & responsif',
      'Domain .com + hosting + SSL',
      'Form kontak, WhatsApp & Google Maps',
      'Copywriting dasar & setup SEO on-page',
      '2× revisi desain',
      'Maintenance & dukungan keamanan 1–3 bulan',
    ],
  },
  // ---- Toko online ----
  {
    slug: 'toko-online-simple',
    group: 'toko',
    title: 'Toko Online Simple',
    minPrice: 1250000,
    maxPrice: 1750000,
    featured: true,
    subtitle: 'Mulai jualan online tanpa ribet',
    time: { min: 3, max: 5, unit: 'hari' },
    highlights: ['Katalog produk', 'Order via WhatsApp', 'Toko ritel'],
    features: [
      'Katalog produk hingga 20 item',
      'Checkout via WhatsApp (langsung order)',
      'Kategori produk & banner promo',
      'Desain responsif + performa cepat',
      'CMS ringan – mudah update produk',
      '2× revisi tampilan/konten',
      'Domain + hosting + SSL sudah termasuk',
    ],
  },
  {
    slug: 'toko-online-full',
    group: 'toko',
    title: 'Toko Online Full',
    minPrice: 2500000,
    maxPrice: 4500000,
    badge: 'Premium',
    badgeColor: 'red',
    subtitle: 'Toko online lengkap dengan dashboard admin',
    time: { min: 5, max: 8, unit: 'hari' },
    highlights: ['E-commerce', 'Ongkir otomatis', 'Kelola pesanan'],
    features: [
      'Keranjang belanja & sistem checkout lengkap',
      'Integrasi payment gateway',
      'Ongkir otomatis (via RajaOngkir)',
      'Dashboard admin – kelola produk & pesanan',
      'Desain mobile-first, loading cepat & SEO-ready',
      'Maintenance & support 3–6 bulan',
      'Domain + hosting + SSL',
    ],
  },
  // ---- Personal & acara ----
  {
    slug: 'link-in-bio',
    group: 'personal',
    title: 'Link in Bio',
    minPrice: 125000,
    maxPrice: 375000,
    subtitle: 'Satu tautan bio dengan desain & fitur milik sendiri',
    time: { min: 1, max: 2, unit: 'hari' },
    highlights: ['Kreator', 'Kafe & warung', 'Musisi'],
    features: [
      'Satu halaman link in bio sesuai merek',
      'Tombol WhatsApp & tautan ke semua kanal',
      'Satu fitur khusus: menu, pre-order, jadwal, atau katalog',
      'Domain .my.id/.biz.id + hosting 1 tahun',
      'Cepat dibuka di ponsel & SEO dasar',
      '1× revisi',
    ],
  },
  {
    slug: 'undangan-digital',
    group: 'personal',
    title: 'Undangan Digital',
    minPrice: 75000,
    maxPrice: 225000,
    subtitle: 'Undangan website dari tema galeri, diisi data acaramu',
    time: { min: 1, max: 1, unit: 'hari' },
    highlights: ['Pernikahan', 'Khitanan & aqiqah', 'Ulang tahun & wisuda'],
    features: [
      'Tema dari galeri undangan, disesuaikan data acara',
      'Detail acara + tombol peta lokasi',
      'Hitung mundur & konfirmasi kehadiran (RSVP)',
      'Galeri foto & musik latar (opsional)',
      'Tautan pribadi aktif 12 bulan, tanpa biaya perpanjangan',
      '1× revisi data',
    ],
  },
  {
    slug: 'situs-acara',
    group: 'personal',
    title: 'Situs Acara & Undangan Custom',
    minPrice: 500000,
    maxPrice: 1250000,
    subtitle: 'Desain khusus untuk acara besar atau acara kantor',
    time: { min: 2, max: 4, unit: 'hari' },
    highlights: ['Acara kantor', 'Seminar & konferensi', 'Pernikahan premium'],
    features: [
      'Desain undangan/situs acara khusus, bukan tema siap pakai',
      'Agenda, pembicara, atau rangkaian acara',
      'Pendaftaran peserta/RSVP dengan ekspor data',
      'Domain sendiri (opsional)',
      'Aktif 12 bulan',
      '2× revisi',
    ],
  },
  {
    slug: 'portofolio',
    group: 'personal',
    title: 'Portofolio / Personal Branding',
    minPrice: 750000,
    maxPrice: 1250000,
    subtitle: 'Etalase karya untuk freelancer & kreator',
    time: { min: 2, max: 3, unit: 'hari' },
    highlights: ['Freelancer', 'Kreator', 'Profesional'],
    features: [
      'Halaman Tentang, Karya, Blog & Kontak',
      'Desain bersih & profesional',
      'CTA ke WhatsApp, LinkedIn, IG, dsb.',
      'SEO dasar & struktur heading rapi',
      'Domain + hosting + SSL 1 tahun',
      'Ideal untuk freelancer & kreator',
    ],
  },
  // ---- Sistem & aplikasi web ----
  {
    slug: 'sistem-reservasi',
    group: 'sistem',
    title: 'Sistem Reservasi Online',
    minPrice: 2500000,
    maxPrice: 6000000,
    subtitle: 'Booking meja, kamar, jadwal dokter, atau lapangan',
    time: { min: 1, max: 2, unit: 'minggu' },
    highlights: ['Restoran & kafe', 'Klinik', 'Hotel & lapangan'],
    features: [
      'Kalender & slot ketersediaan otomatis',
      'Form pemesanan + konfirmasi lewat WhatsApp/email',
      'Dashboard admin untuk jadwal & pesanan',
      'Aturan jam operasional, kapasitas, dan harga',
      'Opsi DP online lewat payment gateway',
      'Domain + hosting + SSL 1 tahun',
      'Maintenance & support 3 bulan',
    ],
  },
  {
    slug: 'website-properti',
    group: 'sistem',
    title: 'Website Properti',
    minPrice: 2000000,
    maxPrice: 4500000,
    subtitle: 'Katalog listing untuk agen atau developer',
    time: { min: 5, max: 8, unit: 'hari' },
    highlights: ['Agen properti', 'Developer perumahan', 'Kos & kontrakan'],
    features: [
      'Listing dengan filter lokasi, harga, dan tipe',
      'Halaman detail + galeri foto & peta',
      'Formulir jadwal kunjungan / tanya agen',
      'Panel admin untuk mengelola listing',
      'SEO per listing',
      'Domain + hosting + SSL 1 tahun',
      'Maintenance & support 3 bulan',
    ],
  },
  {
    slug: 'marketplace-properti',
    group: 'sistem',
    title: 'Marketplace Properti',
    minPrice: 7500000,
    maxPrice: 15000000,
    openEnded: true,
    subtitle: 'Portal multi-agen: banyak pemasang, satu tempat cari',
    time: { min: 2, max: 4, unit: 'minggu' },
    highlights: ['Portal properti', 'Jaringan agen', 'Startup proptech'],
    features: [
      'Akun agen & pemilik untuk memasang listing',
      'Moderasi listing oleh admin',
      'Pencarian & filter lanjutan, bandingkan listing',
      'Halaman profil agen',
      'Formulir prospek & notifikasi',
      'Domain + hosting + SSL 1 tahun',
      'Maintenance & support 6 bulan',
    ],
  },
  {
    slug: 'aplikasi-web',
    group: 'sistem',
    title: 'Aplikasi Web',
    minPrice: 2000000,
    maxPrice: 5000000,
    openEnded: true,
    subtitle: 'Aplikasi kerja: tugas, kanban, kalender, atau data internal',
    time: { min: 1, max: 2, unit: 'minggu' },
    highlights: ['Tim kecil', 'Operasional internal', 'Startup'],
    features: [
      'Login & peran pengguna',
      'Kelola data: tambah, ubah, hapus, cari',
      'Tampilan kanban, kalender, atau laporan sesuai kebutuhan',
      'Ekspor data (CSV/Excel)',
      'Responsif di ponsel',
      'Hosting + database 1 tahun',
      'Maintenance & support 3 bulan',
    ],
  },
  {
    slug: 'website-custom',
    group: 'sistem',
    title: 'Website Custom',
    minPrice: 2500000,
    maxPrice: 7500000,
    openEnded: true,
    badge: 'Custom',
    badgeColor: 'purple',
    subtitle: 'Desain & fitur sepenuhnya sesuai kebutuhan',
    time: { min: 1, max: 3, unit: 'minggu', flex: true },
    highlights: ['Startup', 'Instansi', 'Sistem khusus'],
    features: [
      'Desain & layout sepenuhnya custom',
      'Jumlah halaman & fitur fleksibel',
      'Integrasi API, booking, formulir kompleks',
      'Framework modern (Next.js, Tailwind, dsb.)',
      'Konsultasi UX & optimasi performa',
      'Maintenance & support teknis 3 bulan',
      'Cocok untuk startup & instansi',
    ],
  },
  // ---- Desain ----
  {
    slug: 'konsep-desain',
    group: 'desain',
    title: 'Konsep Desain Website',
    minPrice: 1250000,
    maxPrice: 2500000,
    subtitle: 'Beberapa konsep live untuk satu brief, pilih yang terbaik',
    time: { min: 3, max: 5, unit: 'hari' },
    highlights: ['Rebranding', 'Pitching', 'Kontes desain'],
    features: [
      '3–5 konsep desain berbeda untuk satu brief',
      'Berupa halaman live yang bisa diklik, bukan sekadar gambar',
      'Penjelasan arah visual tiap konsep',
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

/** "Rp600.000 – Rp1.200.000", atau "... – Rp6.000.000+" bila openEnded */
export const priceRange = (p: Pick<Paket, 'minPrice' | 'maxPrice' | 'openEnded'>) =>
  `${formatRupiah(p.minPrice)} – ${formatRupiah(p.maxPrice)}${p.openEnded ? '+' : ''}`

export const waLink = (paket: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Halo PintuWeb, saya tertarik dengan paket "${paket}". Boleh minta info lebih lanjut?`
  )}`

/** Paket urut dari yang termurah — untuk kalimat ringkasan harga. */
export const byPrice = <T extends Pick<Paket, 'minPrice'>>(list: T[]) => [...list].sort((a, b) => a.minPrice - b.minPrice)

/** Kalimat ringkas harga untuk FAQ — selalu mengikuti PACKAGES. */
export const PRICE_SUMMARY =
  `Harga mulai ${byPrice(PACKAGES).map((p) => `${formatRupiah(p.minPrice)} untuk ${p.title}`).join(', ')}. ` +
  'Rincian fitur tiap paket ada di halaman Paket. Semua harga sudah termasuk desain dan pengerjaan; paket website juga mencakup SEO dasar.'

/** Kisaran biaya perpanjangan domain + hosting per tahun mulai tahun kedua (Rupiah). */
export const RENEWAL_PER_YEAR = { min: 300000, max: 500000 }
/** Link in bio memakai domain .my.id/.biz.id yang lebih murah. */
export const RENEWAL_BIO_PER_YEAR = { min: 100000, max: 150000 }

/** Biaya setelah tahun pertama — wajib tampil di halaman harga (bukan hanya di FAQ). */
export const RENEWAL_SUMMARY =
  'Domain & hosting yang termasuk paket berlaku untuk tahun pertama. Mulai tahun kedua, perpanjangannya sekitar ' +
  `${formatRupiah(RENEWAL_PER_YEAR.min)}–${formatRupiah(RENEWAL_PER_YEAR.max)} per tahun untuk website dan ` +
  `${formatRupiah(RENEWAL_BIO_PER_YEAR.min)}–${formatRupiah(RENEWAL_BIO_PER_YEAR.max)} untuk link in bio; ` +
  'untuk sistem & aplikasi web dengan database, biayanya dicantumkan di penawaran. Undangan digital aktif 12 bulan ' +
  'tanpa biaya perpanjangan. Kami kabari sebelum jatuh tempo.'

export const PAYMENT_SUMMARY =
  'Semua paket: DP 50% untuk memulai, pelunasan 50% setelah website selesai dan disetujui. ' +
  'Kami terima transfer bank, e-wallet (OVO, GoPay, DANA), atau QRIS. Invoice dikirim sebelum pembayaran.'
