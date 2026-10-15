// Merakit props (string saja) untuk komponen klien dari kamus server, supaya kamus 3 bahasa
// tidak ikut terkirim ke browser.
import { getDict, getPages } from '../i18n'
import { path, pathOf } from '../i18n/routes'
import { ARTICLE_SLUGS } from '../i18n/slugs'
import { FAQ_CATEGORY_SLUG, FAQ_MORE, faqFor, type FaqKey } from '../content/faq'
import { getArticle } from '../content/articles'
import { serviceOf, serviceText } from '../content/services'
import { facts } from '../i18n/facts'
import { wa } from '../lib/site'
import { fullStop, type Lang } from '../i18n/config'
import type { FaqText } from './FAQ'
import type { FaqEntry } from './FaqCard'
import type { FaqCenterCategory, FaqCenterText } from './FaqCenter'

/** Tautan "Selengkapnya" suatu jawaban: nama halaman tujuannya + alamatnya dalam bahasa ini. */
function moreOf(lang: Lang, key: FaqKey): FaqEntry['more'] {
  const m = FAQ_MORE[key]
  if (!m) return undefined
  const links = getDict(lang).links
  if ('service' in m) return { label: serviceText(serviceOf(m.service), lang).name, href: pathOf(lang, { key: 'services', service: m.service }) }
  if ('article' in m) {
    // artikel hanya ada dalam sebagian bahasa; bahasa lain memakai halaman penggantinya
    const has = Boolean((ARTICLE_SLUGS[m.article] as Partial<Record<Lang, string>>)[lang])
    return has ? { label: getArticle(lang, m.article).title, href: pathOf(lang, { key: 'articles', article: m.article }) } : { label: links[m.fallback], href: path(lang, m.fallback) }
  }
  return { label: links[m.page], href: `${path(lang, m.page)}${m.at ? `#${m.at}` : ''}` }
}

/** Daftar tanya-jawab yang dipakai tampilan DAN JSON-LD (sumbernya sama, jadi selalu cocok). */
const entries = (lang: Lang): FaqEntry[] => faqFor(lang).items.map((it) => ({ ...it, more: moreOf(lang, it.key) }))

/** Bagian FAQ di beranda. */
export function faqProps(lang: Lang) {
  const t = getDict(lang).faqUi
  const items = entries(lang)
  const text: FaqText = {
    eyebrow: t.eyebrow,
    title: t.title,
    lead: t.lead,
    search: t.search,
    searchPh: t.searchPh,
    categories: t.categories,
    all: t.all,
    none: t.none,
    unanswered: t.unanswered,
    askLead: t.askLead,
    note: facts(lang).response + fullStop(lang),
    allN: t.allN(items.length),
    askWa: t.askWa,
    more: t.more,
    newTab: getDict(lang).common.newTabShort,
  }
  return { items, categories: faqFor(lang).categories.map(({ id, name }) => ({ id, name })), t: text, waHref: wa(t.waText), faqHref: path(lang, 'faq') }
}

/** Isi halaman FAQ. */
export function faqCenterProps(lang: Lang) {
  const d = getDict(lang)
  const t = d.faqUi
  const a = getPages(lang).articles
  const categories: FaqCenterCategory[] = faqFor(lang).categories.map((c) => ({ ...c, slug: FAQ_CATEGORY_SLUG[c.id] }))
  const text: FaqCenterText = {
    search: t.search,
    searchPh: t.searchPh,
    clear: t.clear,
    categories: t.categories,
    count: t.count,
    found: t.found,
    nQuestions: t.nQuestions,
    openAll: t.openAll,
    closeAll: t.closeAll,
    none: t.none,
    more: t.more,
    follow: t.follow,
    followText: t.followText,
    searchAskText: t.searchAskText,
    copy: a.copy,
    copied: a.copied,
    unanswered: t.unanswered,
    askLead: t.askLead,
    note: facts(lang).response + fullStop(lang),
    askWa: t.askWa,
    newTab: d.common.newTabShort,
  }
  return { items: entries(lang), categories, t: text, waHref: wa(t.waText) }
}
