// Kode sumber di pesan WhatsApp: pemilik melihat di WA Business dari mana chat berasal, tanpa skrip analitik.
// Semua tautan wa.me/<nomor>?text=… ditambah baris "(ref: <kunjungan> · <halaman>)" di akhir pesan.
// - Kode halaman dihitung dari alamat halaman (pageCode), mis. paket, demo, layanan-landing-page, artikel-biaya.
// - Kode kunjungan: bila alamat dibuka dengan ?ref=xxx atau ?utm_source=xxx (mis. dari bio TikTok/IG), disimpan di
//   sessionStorage dengan kunci REF_KEY ('pw_ref') dan ikut di semua pesan selama sesi. Portal galeri ada di origin yang
//   sama (www.pintuweb.id/<path>), jadi portal bisa membaca kunci ini juga (sessionStorage tab yang sama).
// Pemasangannya terpusat: WaSource (komponen di layout) menyunting tautan saat diklik; formulir kontak memakai withSource().
import { parsePath, toPublicPath } from '../i18n/routes'
import { WA_NUMBER } from './site'

export const REF_KEY = 'pw_ref'

/** Hanya a-z, 0-9 dan tanda hubung, maksimal 24 karakter. Kosong = tidak valid. */
export const cleanRef = (v: string | null | undefined) => (v ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24)

/** Simpan ?ref / ?utm_source dari alamat ke sessionStorage (kunjungan terakhir yang membawa kode menang). */
export function rememberVisitRef(search: string) {
  try {
    const q = new URLSearchParams(search)
    const code = cleanRef(q.get('ref')) || cleanRef(q.get('utm_source'))
    if (code) sessionStorage.setItem(REF_KEY, code)
  } catch {
    // sessionStorage bisa tidak tersedia (jendela pribadi, setelan pemblokir): abaikan
  }
}

export function visitRef(): string {
  try {
    return cleanRef(sessionStorage.getItem(REF_KEY))
  } catch {
    return ''
  }
}

/** Kode halaman dari path publik (mis. /en/pricing -> paket). Bahasa selain Indonesia ditambahkan sebagai kode terakhir. */
export function pageCode(pathname: string): string {
  const pub = toPublicPath(pathname)
  const parsed = parsePath(pub)
  if (!parsed) return cleanRef(pub.split('/').filter(Boolean)[0]) || 'lain'
  const { lang, ref } = parsed
  let code: string
  switch (ref.key) {
    case 'home': code = 'beranda'; break
    case 'pricing': code = 'paket'; break
    case 'about': code = 'tentang'; break
    case 'contact': code = 'kontak'; break
    case 'founder': code = 'owner'; break
    case 'glossary': code = 'kamus'; break
    case 'local': code = 'tulungagung'; break
    case 'payment': code = 'pembayaran'; break
    case 'services': code = ref.service ? `layanan-${ref.service}` : 'layanan'; break
    case 'articles': code = ref.article ? `artikel-${ref.article}` : 'artikel'; break
    default: code = ref.key // demo, faq, privacy, terms
  }
  return lang === 'id' ? code : `${code}-${lang}`
}

/** "(ref: tiktok · paket)" untuk halaman ini dan kunjungan ini. */
export const sourceTag = (pathname: string) => `(ref: ${[visitRef(), pageCode(pathname)].filter(Boolean).join(' · ')})`

/**
 * Menambah kode sumber ke tautan pesan ke nomor PintuWeb. Tautan lain (mis. bagikan artikel ke teman, atau wa.me tanpa
 * isi pesan) dikembalikan apa adanya. Aman dipanggil berulang: kode yang sudah ada tidak ditambah lagi.
 */
export function withSource(href: string, pathname: string): string {
  let u: URL
  try {
    u = new URL(href)
  } catch {
    return href
  }
  if (u.hostname !== 'wa.me' || u.pathname !== `/${WA_NUMBER}`) return href
  const text = u.searchParams.get('text')
  if (!text || /\(ref: [^)]*\)\s*$/.test(text)) return href
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`${text.trimEnd()}\n\n${sourceTag(pathname)}`)}`
}
