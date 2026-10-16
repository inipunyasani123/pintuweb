// Satu-satunya sumber fakta bisnis & kontak PintuWeb.
// Angka yang tampil di situs (tahun berdiri, jumlah proyek, jam kerja, respons, target performa)
// wajib diambil dari sini supaya halaman tidak pernah saling bertentangan lagi.

/** Domain utama. Di Vercel, pintuweb.id (tanpa www) dan pintuweb-lac.vercel.app di-redirect 308 ke sini (setelan domain project). */
export const SITE = 'https://www.pintuweb.id'

export const FOUNDED_YEAR = 2018
export const CLIENT_PROJECTS = '20+'
export const CATEGORY_COUNT = 9
export const LOCATION = 'Trenggalek, Jawa Timur'

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
export const FACTS_UPDATED = '2026-10-16'

/** Tanggal ISO (YYYY-MM-DD) yang paling baru. */
export const latest = (...dates: string[]) => dates.reduce((a, b) => (b > a ? b : a))

export const wa = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
