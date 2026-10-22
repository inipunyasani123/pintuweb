// Data kartu paket per bahasa, dirakit di server. CardData berisi string saja; CardLabels memuat fungsi (more), jadi
// kartunya (PackageCard) tetap komponen server.
import type { Lang } from '../i18n/config'
import { getDict } from '../i18n'
import { packagesFor, waPackageText } from '../i18n/facts'
import { wa } from '../lib/site'

/** Data kartu yang sudah siap tampil (string saja, aman dikirim ke komponen klien). */
export type CardData = {
  slug: string
  group: string
  title: string
  subtitle: string
  badge?: string
  recommended?: boolean
  /** true = paket tanpa perkiraan harga: priceFrom berisi kalimat (mis. "Sesuai kebutuhan"), tulis tanpa kata "mulai" */
  quote?: boolean
  priceFrom: string
  priceRange: string
  deposit: string
  duration: string
  highlights: string[]
  features: string[]
  waHref: string
  choose: string
}
export type CardLabels = {
  from: string
  range: string
  deposit: string
  duration: string
  suits: string
  free: string
  /** "Lihat semua fitur (n)" */
  more: (n: number) => string
  less: string
  newTab: string
  /** kartu ringkas: "Lihat isi paket" / "Tutup isi paket" / tombol "Pilih" */
  open: string
  close: string
  pick: string
}

export function cardsFor(lang: Lang, filter?: (slug: string, featured?: boolean) => boolean): { cards: CardData[]; labels: CardLabels } {
  const d = getDict(lang)
  const t = d.pkg
  const cards = packagesFor(lang)
    .filter((p) => (filter ? filter(p.slug, p.featured) : true))
    .map((p) => ({
      slug: p.slug,
      group: p.group,
      title: p.title,
      subtitle: p.subtitle,
      badge: p.badge,
      recommended: p.recommended,
      quote: p.quote,
      priceFrom: p.priceFrom,
      priceRange: p.priceRange,
      deposit: p.deposit,
      duration: p.duration,
      highlights: p.highlights,
      features: p.features,
      waHref: wa(waPackageText(lang, p.title)),
      choose: t.choose(p.title),
    }))
  return {
    cards,
    labels: { from: t.from, range: t.range, deposit: t.deposit, duration: t.duration, suits: t.suits, free: t.free, more: t.more, less: t.less, newTab: d.common.newTabShort, open: t.open, close: t.close, pick: t.pick },
  }
}

