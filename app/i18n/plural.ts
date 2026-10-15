// Bentuk kata menurut kaidah jamak suatu bahasa (Intl.PluralRules), untuk teks yang memuat angka:
// plural('ru-RU', 5, { one: 'пакет', few: 'пакета', many: 'пакетов', other: 'пакета' }) -> "пакетов".
// Dipakai bahasa yang katanya berubah menurut angka (Rusia, Arab); bahasa lain cukup menulis satu bentuk.
import type { Plural } from './x/types'
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
