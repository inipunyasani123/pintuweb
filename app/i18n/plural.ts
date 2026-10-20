// Bentuk kata menurut kaidah jamak suatu bahasa (Intl.PluralRules), untuk teks yang memuat angka:
// plural('ru-RU', 5, { one: 'пакет', few: 'пакета', many: 'пакетов', other: 'пакета' }) -> "пакетов".
// Dipakai bahasa yang katanya berubah menurut angka (Rusia, Arab); bahasa lain cukup menulis satu bentuk.
import type { Plural } from './x/types'
import type { Lang } from './config'
import { DEMOS, DEMO_CATEGORIES, type DemoCategory } from '../lib/demos'

const rules = new Map<string, Intl.PluralRules>()

export function plural(locale: string, n: number, forms: Plural): string {
  if (!rules.has(locale)) rules.set(locale, new Intl.PluralRules(locale))
  return forms[rules.get(locale)!.select(n) as keyof Plural] ?? forms.other
}

/**
 * Satuan di belakang jumlah demo tiap kategori ("17 demo", "1 demo" / "17 demos"). Semua kategori memakai kata "demo"
 * (satu istilah untuk satu hal); bentuk katanya mengikuti jumlah demo kategori itu di lib/demos.ts.
 */
export const demoUnits = (word: (n: number) => string) =>
  Object.fromEntries(DEMO_CATEGORIES.map((c) => [c.id, word(DEMOS.filter((d) => d.category === c.id).length)])) as Record<DemoCategory, string>

/**
 * Bilangan 1–12 sebagai kata, untuk judul yang lebih enak dibaca dengan kata daripada angka ("Sepuluh jenis website
 * yang kami buat", angkanya CATEGORY_COUNT di lib/site.ts). Di luar 1–12 jatuh ke angka. Bentuk dasar tanpa kata benda:
 * kata benda (dan bentuk jamaknya, mis. ru/ar lewat plural()) ditulis di kamus. Arab: bentuk untuk kata benda maskulin.
 */
const NUMBER_WORDS: Record<Lang, string[]> = {
  id: ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas'],
  en: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
  ms: ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'lapan', 'sembilan', 'sepuluh', 'sebelas', 'dua belas'],
  es: ['un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
  fr: ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'],
  pt: ['um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze'],
  ru: ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'одиннадцать', 'двенадцать'],
  zh: ['一', '两', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  hi: ['एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह'],
  bn: ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো'],
  ar: ['واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر'],
}

export const numberWord = (lang: Lang, n: number) => NUMBER_WORDS[lang][n - 1] ?? String(n)

/** Huruf pertama kapital (untuk kata bilangan di awal judul). */
export const capFirst = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1)
