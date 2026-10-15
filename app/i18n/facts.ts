// Kalimat fakta bisnis per bahasa. Angka & kontak tetap dari lib/site.ts dan lib/packages.ts
// (satu-satunya sumber); di sini hanya cara menuliskannya.
import { CLOSES, GUARANTEE_DAYS, HOURS, LOCATION, OPENS, PERF_TARGET, RESPONSE, dotTime } from '../lib/site'
import { DEMOS } from '../lib/demos'
import { ADDONS, PACKAGES, PAYMENT_SUMMARY, RENEWAL_BIO_PER_YEAR, RENEWAL_PER_YEAR, RENEWAL_SUMMARY, type Paket, type Waktu } from '../lib/packages'
import { LANG_INFO, isBase, type BaseLang, type Lang } from './config'
import { ADDON_TEXT, PACKAGE_GROUP_TEXT, PACKAGE_TEXT } from '../content/packages-text'
import { pack } from './x'
import { plural } from './plural'
import type { Facts } from './x/types'

const FACTS: Record<BaseLang, Facts> = {
  id: {
    hours: HOURS,
    hoursDays: HOURS.split(', ')[0],
    hoursTime: HOURS.split(', ')[1],
    response: RESPONSE,
    location: LOCATION,
    serves: 'Melayani seluruh Indonesia',
    payment: PAYMENT_SUMMARY,
    renewal: RENEWAL_SUMMARY,
    guarantee: `Bug dan masalah teknis diperbaiki gratis selama ${GUARANTEE_DAYS} hari setelah website online. Setelah itu, maintenance mengikuti isi paket dan bisa diperpanjang.`,
  },
  en: {
    hours: `Monday – Saturday, ${OPENS} – ${CLOSES} WIB (UTC+7)`,
    hoursDays: 'Monday – Saturday',
    hoursTime: `${OPENS} – ${CLOSES} WIB (UTC+7)`,
    response: 'We reply on working days, within 24 hours',
    location: 'Trenggalek, East Java, Indonesia',
    serves: 'Working with clients remotely',
    payment:
      'Every package: a 50% deposit to start, and the remaining 50% once the website is finished and you have approved it. ' +
      'We accept Indonesian bank transfer, e-wallets (OVO, GoPay, DANA) and QRIS. The invoice is sent before you pay.',
    renewal:
      'The domain and hosting included in a package cover the first year. From the second year, renewal costs roughly ' +
      `${money('en', RENEWAL_PER_YEAR.min)}–${money('en', RENEWAL_PER_YEAR.max).replace('IDR ', '')} per year for websites and ` +
      `${money('en', RENEWAL_BIO_PER_YEAR.min)}–${money('en', RENEWAL_BIO_PER_YEAR.max).replace('IDR ', '')} for link-in-bio pages; ` +
      'for systems and web apps with a database, the cost is stated in the quote. Digital invitations stay active for 12 months ' +
      'with no renewal fee. We remind you before anything is due.',
    guarantee: `Bugs and technical issues are fixed free of charge for ${GUARANTEE_DAYS} days after launch. After that, maintenance follows what your package includes and can be extended.`,
  },
  ms: {
    hours: `Isnin – Sabtu, ${dotTime(OPENS)} – ${dotTime(CLOSES)} WIB (UTC+7)`,
    hoursDays: 'Isnin – Sabtu',
    hoursTime: `${dotTime(OPENS)} – ${dotTime(CLOSES)} WIB (UTC+7)`,
    response: 'Kami membalas pada hari bekerja, dalam masa 24 jam',
    location: 'Trenggalek, Jawa Timur, Indonesia',
    serves: 'Bekerja dengan pelanggan secara jarak jauh',
    payment:
      'Semua pakej: deposit 50% untuk bermula, baki 50% selepas laman web siap dan anda luluskan. ' +
      'Kami menerima pindahan bank Indonesia, e-dompet (OVO, GoPay, DANA) dan QRIS. Invois dihantar sebelum pembayaran.',
    renewal:
      'Domain dan hosting dalam pakej sah untuk tahun pertama. Mulai tahun kedua, kos pembaharuan sekitar ' +
      `${money('ms', RENEWAL_PER_YEAR.min)}–${money('ms', RENEWAL_PER_YEAR.max).replace('IDR ', '')} setahun untuk laman web dan ` +
      `${money('ms', RENEWAL_BIO_PER_YEAR.min)}–${money('ms', RENEWAL_BIO_PER_YEAR.max).replace('IDR ', '')} untuk link in bio; ` +
      'untuk sistem & aplikasi web dengan pangkalan data, kosnya dinyatakan dalam sebut harga. Kad jemputan digital aktif 12 bulan ' +
      'tanpa kos pembaharuan. Kami maklumkan sebelum tarikh luput.',
    guarantee: `Pepijat dan masalah teknikal dibaiki secara percuma selama ${GUARANTEE_DAYS} hari selepas laman web dilancarkan. Selepas itu, penyelenggaraan mengikut isi pakej dan boleh dilanjutkan.`,
  },
}

/**
 * Di bahasa kanan-ke-kiri, harga (huruf Latin + angka + tanda "+") dibungkus isolasi LTR (U+2066…U+2069) supaya
 * urutannya tidak teracak oleh teks Arab di sekitarnya: tanpa ini "IDR 2,500,000+" tampil sebagai "+IDR 2,500,000".
 * Tanda isolasi dibuang lagi dari meta dan JSON-LD (lihat plain() di config.ts).
 */
function iso(lang: Lang, s: string) {
  return LANG_INFO[lang].dir === 'rtl' ? `\u2066${s}\u2069` : s
}

/** "IDR 300,000–500,000": kisaran dengan kode mata uang sekali saja di depan. */
const idrRange = (lang: Lang, r: { min: number; max: number }) => iso(lang, `${rawMoney(lang, r.min)}–${rawMoney(lang, r.max).replace('IDR ', '')}`)

const factsCache = new Map<Lang, Facts>()
export function facts(lang: Lang): Facts {
  if (isBase(lang)) return FACTS[lang]
  if (!factsCache.has(lang)) {
    factsCache.set(lang, pack(lang).facts({ opens: OPENS, closes: CLOSES, days: GUARANTEE_DAYS, renewal: idrRange(lang, RENEWAL_PER_YEAR), renewalBio: idrRange(lang, RENEWAL_BIO_PER_YEAR) }))
  }
  return factsCache.get(lang)!
}

/** Rp600.000 (id) / IDR 600,000 (en, ms). */
export function money(lang: Lang, n: number) {
  return iso(lang, rawMoney(lang, n))
}

function rawMoney(lang: Lang, n: number) {
  if (lang === 'id') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n).replace(/\s/g, '')
  }
  return `IDR ${new Intl.NumberFormat(LANG_INFO[lang].intl, { maximumFractionDigits: 0 }).format(n)}`
}

export const moneyRange = (lang: Lang, p: Paket) =>
  iso(lang, `${rawMoney(lang, p.minPrice)} – ${rawMoney(lang, p.maxPrice)}${p.openEnded ? '+' : ''}`)

/** Angka ringkas untuk papan harga: "300 rb" / "1,25 jt" (id), "300k" / "1.25M" (en), "300 ribu" / "1.25 juta" (ms). */
function compact(lang: Lang, n: number) {
  const intl = LANG_INFO[lang].intl
  // bahasa tambahan: notasi ringkas bawaan Intl ("300 k", "30万", "3 लाख", "300 тыс."). Hindi & Bengali memakai bentuk
  // panjang karena bentuk pendeknya berupa singkatan yang sulit dibaca ("3 क॰", "75 হা").
  if (!isBase(lang)) {
    const compactDisplay = lang === 'hi' || lang === 'bn' ? 'long' : 'short'
    return new Intl.NumberFormat(intl, { notation: 'compact', compactDisplay, maximumFractionDigits: 2 }).format(n)
  }
  const fmt = (v: number) => new Intl.NumberFormat(intl, { maximumFractionDigits: 2 }).format(v)
  const big = n >= 1_000_000
  const v = fmt(big ? n / 1_000_000 : n / 1_000)
  if (lang === 'id') return `${v} ${big ? 'jt' : 'rb'}`
  if (lang === 'en') return `${v}${big ? 'M' : 'k'}`
  return `${v} ${big ? 'juta' : 'ribu'}`
}

/** Angka ringkas tanpa mata uang, untuk label sumbu peta harga: "1 jt" / "1M" / "1 juta". */
export const moneyCompact = compact
/** Kode mata uang yang dipakai moneyShort: "Rp" (id) / "IDR" (en, ms). */
export const currencyCode = (lang: Lang) => (lang === 'id' ? 'Rp' : 'IDR')

/** "Rp600 rb – 1,2 jt" (id) / "IDR 600k – 1.2M" (en) — mata uang sekali saja di depan. */
export const moneyShort = (lang: Lang, p: Pick<Paket, 'minPrice' | 'maxPrice' | 'openEnded'>) =>
  `${lang === 'id' ? 'Rp' : 'IDR '}${compact(lang, p.minPrice)} – ${compact(lang, p.maxPrice)}${p.openEnded ? '+' : ''}`

/** Paket dengan teks sesuai bahasa; angka selalu dari PACKAGES. */
export type LocalPaket = Paket & { priceFrom: string; priceRange: string; deposit: string }

/** Perkiraan waktu pengerjaan dalam bahasa pengunjung, mis. "1–2 working days" / "1–3 minggu, bergantung pada ciri". */
export function durationText(lang: Lang, w: Waktu): string {
  const n = w.min === w.max ? `${w.min}` : `${w.min}–${w.max}`
  const one = w.max === 1
  const intl = LANG_INFO[lang].intl
  if (!isBase(lang)) {
    // bentuk katanya mengikuti kaidah jamak bahasa itu untuk angka terakhir rentang
    const t = pack(lang).time
    return `${n} ${plural(intl, w.max, w.unit === 'hari' ? t.day : t.week)}${w.flex ? t.flex : ''}`
  }
  if (lang === 'en') return `${n} ${w.unit === 'hari' ? (one ? 'working day' : 'working days') : one ? 'week' : 'weeks'}${w.flex ? ', depending on features' : ''}`
  if (lang === 'ms') return `${n} ${w.unit === 'hari' ? 'hari bekerja' : 'minggu'}${w.flex ? ', bergantung pada ciri' : ''}`
  return `${n} ${w.unit === 'hari' ? 'hari kerja' : 'minggu'}${w.flex ? ', tergantung fitur' : ''}`
}

export function packagesFor(lang: Lang): LocalPaket[] {
  return PACKAGES.map((p) => {
    const t = lang === 'id' ? null : isBase(lang) ? PACKAGE_TEXT[lang][p.slug] : pack(lang).packages[p.slug]
    const base: Paket = t ? { ...p, ...t } : p
    return {
      ...base,
      duration: durationText(lang, p.time),
      priceFrom: money(lang, p.minPrice),
      priceRange: moneyRange(lang, p),
      deposit: money(lang, Math.round(p.minPrice / 2)),
    }
  })
}

export const minPrice = () => Math.min(...PACKAGES.map((p) => p.minPrice))

/** Paket dengan perkiraan pengerjaan tercepat dan terlama (dari `time` di packages.ts; satu minggu = 5 hari kerja). */
export function durationSpan(lang: Lang) {
  const days = (n: number, p: Paket) => n * (p.time.unit === 'minggu' ? 5 : 1)
  const span = PACKAGES.map((p) => ({ slug: p.slug, lo: days(p.time.min, p), hi: days(p.time.max, p) }))
  const fast = span.reduce((a, b) => (b.lo < a.lo || (b.lo === a.lo && b.hi < a.hi) ? b : a))
  const slow = span.reduce((a, b) => (b.hi > a.hi ? b : a))
  const pk = packagesFor(lang)
  return { fastest: pk.find((p) => p.slug === fast.slug)!, slowest: pk.find((p) => p.slug === slow.slug)! }
}

/** Pesan WhatsApp untuk paket, dalam bahasa pengunjung (supaya kami tahu bahasa balasannya). */
export function waPackageText(lang: Lang, title: string) {
  if (!isBase(lang)) return pack(lang).waPackage(title)
  if (lang === 'en') return `Hello PintuWeb, I'm interested in the "${title}" package. Could you tell me more?`
  if (lang === 'ms') return `Hai PintuWeb, saya berminat dengan pakej "${title}". Boleh kongsikan maklumat lanjut?`
  return `Halo PintuWeb, saya tertarik dengan paket "${title}". Boleh minta info lebih lanjut?`
}

/** Biaya tambahan per bahasa (angka dari ADDONS di packages.ts). */
export function addonsFor(lang: Lang) {
  return ADDONS.map((a) => {
    const t = (isBase(lang) ? ADDON_TEXT[lang] : pack(lang).addons)[a.slug]
    return { ...a, title: t.title, unit: t.unit, range: iso(lang, `${rawMoney(lang, a.minPrice)} – ${rawMoney(lang, a.maxPrice)}`) }
  })
}

/** Nama & pengantar kelompok paket dalam bahasa pengunjung. */
export const groupText = (lang: Lang) => (isBase(lang) ? PACKAGE_GROUP_TEXT[lang] : pack(lang).groups)

/** Jumlah demo dalam satu kategori (lib/demos.ts); kategori tanpa demo dianggap salah ketik dan menggagalkan build. */
function demoCount(category: string) {
  const n = DEMOS.filter((d) => d.category === category).length
  if (!n) throw new Error(`Kategori demo tidak dikenal: ${category}`)
  return n
}

/**
 * Mengisi penanda harga/fakta di teks (artikel, halaman layanan):
 * {{from:slug}} {{price:slug}} {{max:slug}} {{duration:slug}} {{renewal}} {{guarantee}} {{demos}} {{demos:kategori}}
 * {{perf}} {{pricetable}}. {{demos:kategori}} = jumlah demo kategori itu (landing, undangan, linkinbio, portfolio,
 * reservasi, properti, todo, kontes). Penanda yang tidak dikenal menggagalkan build supaya tidak ada angka yang lolos
 * tanpa sumber.
 */
export function fillFacts(lang: Lang, s: string): string {
  if (!s.includes('{{')) return s
  const pk = packagesFor(lang)
  const bySlug = (slug: string) => {
    const p = pk.find((x) => x.slug === slug)
    if (!p) throw new Error(`Paket tidak dikenal: ${slug}`)
    return p
  }
  const renewal =
    lang === 'id'
      ? `${money('id', RENEWAL_PER_YEAR.min)}–${money('id', RENEWAL_PER_YEAR.max)}`
      : idrRange(lang, RENEWAL_PER_YEAR)
  const head = lang === 'id' ? ['Paket', 'Kisaran harga', 'Pengerjaan', 'Cocok untuk'] : ['Package', 'Price range', 'Turnaround', 'Best for']
  const table = [
    `| ${head.join(' | ')} |`,
    `|${head.map(() => '---').join('|')}|`,
    ...pk.map((p) => `| ${p.title} | ${p.priceRange} | ${p.duration} | ${p.highlights.join(', ')} |`),
  ].join('\n')
  const out = s
    .replace(/\{\{pricetable\}\}/g, table)
    .replace(/\{\{from:([a-z-]+)\}\}/g, (_, slug) => bySlug(slug).priceFrom)
    .replace(/\{\{price:([a-z-]+)\}\}/g, (_, slug) => bySlug(slug).priceRange)
    .replace(/\{\{max:([a-z-]+)\}\}/g, (_, slug) => money(lang, bySlug(slug).maxPrice))
    .replace(/\{\{duration:([a-z-]+)\}\}/g, (_, slug) => bySlug(slug).duration)
    .replace(/\{\{renewal\}\}/g, renewal)
    .replace(/\{\{guarantee\}\}/g, String(GUARANTEE_DAYS))
    .replace(/\{\{demos\}\}/g, String(DEMOS.length))
    .replace(/\{\{demos:([a-z]+)\}\}/g, (_, category) => String(demoCount(category)))
    .replace(/\{\{perf\}\}/g, PERF_TARGET)
  const left = out.match(/\{\{[^}]+\}\}/)
  if (left) throw new Error(`Penanda tak dikenal: ${left[0]}`)
  return out
}
