import type { MetadataRoute } from 'next'
import { FACTS_UPDATED, SITE, latest } from './lib/site'
import { PRICES_UPDATED } from './lib/packages'
import { PORTALS } from './lib/portals'
import { LANG_INFO } from './i18n/config'
import { SEGMENTS, langsOf, urlOf, type DocRef, type PageKey } from './i18n/routes'
import { SERVICE_KEYS, ARTICLE_KEYS } from './i18n/slugs'
import { getArticle } from './content/articles'
import { LEGAL_UPDATED_ISO } from './content/legal'

// Setiap URL dicantumkan beserta semua versi bahasanya (hreflang + x-default),
// dengan tanggal perubahan isi yang sebenarnya — bukan tanggal build.
const CONTENT_UPDATED = latest('2026-10-14', FACTS_UPDATED, PRICES_UPDATED)

type Entry = { ref: DocRef; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency']; modified: string }

export default function sitemap(): MetadataRoute.Sitemap {
  const PRIORITY: Partial<Record<PageKey, [number, Entry['freq']]>> = {
    home: [1.0, 'weekly'],
    pricing: [0.9, 'monthly'],
    services: [0.9, 'monthly'],
    local: [0.9, 'monthly'],
    demo: [0.8, 'weekly'],
    articles: [0.7, 'weekly'],
    faq: [0.7, 'monthly'],
    about: [0.6, 'monthly'],
    contact: [0.6, 'yearly'],
    glossary: [0.6, 'monthly'],
    founder: [0.5, 'yearly'],
    privacy: [0.2, 'yearly'],
    terms: [0.2, 'yearly'],
  }

  const entries: Entry[] = (Object.keys(SEGMENTS) as PageKey[]).map((key) => {
    const [priority, freq] = PRIORITY[key] ?? [0.5, 'monthly']
    const modified = key === 'privacy' || key === 'terms' ? LEGAL_UPDATED_ISO : CONTENT_UPDATED
    return { ref: { key } as DocRef, priority, freq, modified }
  })
  for (const service of SERVICE_KEYS) entries.push({ ref: { key: 'services', service }, priority: 0.8, freq: 'monthly', modified: CONTENT_UPDATED })
  for (const article of ARTICLE_KEYS) {
    const a = getArticle('id', article)
    entries.push({ ref: { key: 'articles', article }, priority: 0.7, freq: 'monthly', modified: a.updated })
  }

  const out: MetadataRoute.Sitemap = []
  for (const e of entries) {
    const langs = langsOf(e.ref)
    const languages: Record<string, string> = Object.fromEntries(langs.map((l) => [LANG_INFO[l].hreflang, urlOf(l, e.ref)]))
    languages['x-default'] = urlOf(langs.includes('id') ? 'id' : langs[0], e.ref)
    for (const l of langs) {
      out.push({ url: urlOf(l, e.ref), lastModified: e.modified, changeFrequency: e.freq, priority: l === 'id' ? e.priority : Math.round(e.priority * 0.9 * 10) / 10, alternates: { languages } })
    }
  }

  // Portal katalog (zona terpisah, berbahasa Indonesia).
  for (const p of PORTALS) out.push({ url: `${SITE}/${p.path}`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 0.8 })
  return out
}
