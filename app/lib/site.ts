// Satu-satunya sumber fakta bisnis & kontak PintuWeb.
// Angka yang tampil di situs (tahun berdiri, jumlah proyek, jam kerja, respons, target performa)
// wajib diambil dari sini supaya halaman tidak pernah saling bertentangan lagi.

/** Domain utama. Di Vercel, pintuweb.id (tanpa www) dan pintuweb-lac.vercel.app di-redirect 308 ke sini (setelan domain project). */
export const SITE = 'https://www.pintuweb.id'

export const FOUNDED_YEAR = 2018
export const CLIENT_PROJECTS = '30+'
/** Jumlah jenis website & aplikasi/kategori demo (= DEMO_CATEGORIES di lib/demos.ts; beranda menggagalkan build bila berbeda). */
export const CATEGORY_COUNT = 11
/** Kota tempat PintuWeb berlokasi; kalimat lokasi berhuruf Latin (id/en/ms/es/fr/pt), JSON-LD, FAQ & llms.txt dirakit dari sini. */
export const CITY = 'Tulungagung'
export const LOCATION = `${CITY}, Jawa Timur`

export const WA_NUMBER = '6285190931399'
export const WA_DISPLAY = '+62 851 9093 1399'
export const EMAIL = 'cs@pintuweb.id'
/** Nama founder/pemilik PintuWeb (halaman founder, Tentang, penulis artikel, RSS, JSON-LD Person). */
export const FOUNDER_NAME = 'Arya'
/**
 * Profil GitHub pemilik tanpa https://, mis. 'github.com/namaakun'. Dipakai tombol di halaman Tentang, kartu founder,
 * dan sameAs di data terstruktur. Kosong = semua tautan GitHub disembunyikan (akun GitHub lama ditutup Okt 2026;
 * isi dengan akun baru bila ingin ditampilkan lagi).
 */
export const GITHUB = ''

/** Profil Google Bisnis PintuWeb (Maps, lewat CID agar tetap walau nama tempat berubah). Dipakai hasMap/sameAs dan tautan footer. */
export const GOOGLE_MAPS = 'https://www.google.com/maps?cid=4624734628104466098'
/** Akun media sosial resmi PintuWeb (tautan footer + sameAs data terstruktur). */
export const SOCIAL = {
  tiktok: 'https://www.tiktok.com/@pintuweb.id',
  instagram: 'https://www.instagram.com/pintuwebid',
} as const
/**
 * Ringkasan ulasan Google Bisnis PintuWeb untuk komponen rating di beranda dan /kontak. null = komponen tidak tampil.
 * Isi HANYA dengan angka asli yang terlihat di profil Maps (GOOGLE_MAPS), mis.
 *   { rating: 5, count: 7, updated: '2026-11-15' }
 * rating = skor rata-rata 1–5, count = jumlah ulasan, updated = tanggal angka itu dicek. Perbarui ketiganya bersama.
 * Jangan tambahkan ke data terstruktur (AggregateRating/Review): Google tidak mengizinkan ulasan tentang diri sendiri.
 */
export const GOOGLE_REVIEWS: { rating: number; count: number; updated: string } | null = null

/** Semua profil resmi PintuWeb di luar situs, untuk `sameAs` (Google memakai ini untuk menyatukan entitas). */
export const SAME_AS = [GOOGLE_MAPS, SOCIAL.instagram, SOCIAL.tiktok, ...(GITHUB ? [`https://${GITHUB}`] : [])]

/** Jam buka dan tutup (WIB), format 24 jam. Semua tulisan jam kerja (tiga bahasa) dan JSON-LD dirakit dari sini. */
export const OPENS = '08:00'
export const CLOSES = '19:00'
/** "08.00" — penulisan jam gaya Indonesia/Melayu. */
export const dotTime = (t: string) => t.replace(':', '.')
export const HOURS = `Senin – Sabtu, ${dotTime(OPENS)} – ${dotTime(CLOSES)} WIB`
/** Janji respons yang dipakai di semua halaman. */
export const RESPONSE = 'Respons di hari kerja, maksimal 24 jam'

/** Target, bukan klaim rata-rata: situs dioptimalkan untuk mencapai skor ini. */
export const PERF_TARGET = '90+'

export const GUARANTEE_DAYS = 30

/**
 * Tanggal terakhir fakta di file ini (kontak, jam kerja, angka) berubah. NAIKKAN setiap kali mengubahnya:
 * tanggal berlaku dokumen legal dan lastmod sitemap mengikuti tanggal ini.
 */
export const FACTS_UPDATED = '2026-10-30'

/** Tanggal ISO (YYYY-MM-DD) yang paling baru. */
export const latest = (...dates: string[]) => dates.reduce((a, b) => (b > a ? b : a))

/**
 * Tautan WhatsApp dengan pesan terisi. Kode sumber "(ref: …)" tidak ditulis di sini: ditambahkan WaSource saat tautan
 * diklik (lihat lib/wa-ref.ts), jadi cukup memakai wa() di semua tempat.
 */
export const wa = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
