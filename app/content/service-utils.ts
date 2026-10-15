import { durationText, packagesFor } from '../i18n/facts'
import type { Lang } from '../i18n/config'
import type { Waktu } from '../lib/packages'
import type { Service } from './services'

/** Satu minggu = 5 hari kerja (sama dengan konvensi di lib/packages.ts). */
const DAYS_PER_WEEK = 5

/**
 * Harga mulai (paket termurah) & rentang lama pengerjaan seluruh paket layanan (packages.ts); null bila layanan tanpa
 * paket. Rentangnya dari pengerjaan tercepat sampai terlama di antara paket layanan itu, mis. Toko Online "3–8 hari
 * kerja"; bila satuannya bercampur (hari & minggu), semuanya ditulis dalam minggu.
 */
export function serviceFrom(lang: Lang, s: Service) {
  const pk = packagesFor(lang)
  const list = s.packages.map((slug) => pk.find((p) => p.slug === slug)!).filter(Boolean)
  if (!list.length) return null
  const cheapest = list.reduce((a, b) => (a.minPrice <= b.minPrice ? a : b))
  return { price: cheapest.priceFrom, duration: durationText(lang, span(list.map((p) => p.time))), list }
}

/** Gabungan beberapa perkiraan waktu menjadi satu rentang. */
function span(times: Waktu[]): Waktu {
  const flex = times.some((t) => t.flex)
  if (times.every((t) => t.unit === 'hari')) {
    return { min: Math.min(...times.map((t) => t.min)), max: Math.max(...times.map((t) => t.max)), unit: 'hari', flex }
  }
  const days = (n: number, t: Waktu) => (t.unit === 'minggu' ? n * DAYS_PER_WEEK : n)
  const lo = Math.min(...times.map((t) => days(t.min, t)))
  const hi = Math.max(...times.map((t) => days(t.max, t)))
  return { min: Math.max(1, Math.floor(lo / DAYS_PER_WEEK)), max: Math.ceil(hi / DAYS_PER_WEEK), unit: 'minggu', flex }
}

/**
 * Lama pengerjaan yang aman dibungkus: "1–4 minggu, tergantung fitur" hanya boleh patah setelah satuan, tidak di tengah
 * "1–4" (word joiner sesudah tanda pisah) dan tidak di antara angka dan satuannya (spasi tak terputus).
 */
export const keepRange = (s: string) => s.replace('–', '–\u2060').replace(' ', '\u00a0')
