// Judul pada gambar OG per dokumen. /api/og menerima kunci dokumen (?p=pricing, ?p=services&s=landing-page),
// bukan teks bebas, lalu membaca judulnya di sini: tidak ada yang bisa membuat kartu bermerek PintuWeb berisi
// teks sembarang. Sumbernya sama dengan ogTitle/title yang dikirim tiap halaman ke pageMeta().
import { getPages } from './index'
import { plain, type Lang } from './config'
import { langsOf, SEGMENTS, type DocRef, type PageKey } from './routes'
import { ARTICLE_KEYS, SERVICE_KEYS, type ArticleKey, type ServiceKey } from './slugs'
import { serviceOf, serviceText } from '../content/services'
import { getArticle } from '../content/articles'
import { DEMOS } from '../lib/demos'
import { localText } from '../content/local'
import { paymentText } from '../content/payment'

/** Kunci dokumen dari parameter URL; null bila tidak dikenal. */
export function refFromQuery(p: string | null, s: string | null): DocRef | null {
  if (!p || !(p in SEGMENTS)) return null
  const key = p as PageKey
  if (key === 'services') {
    if (!s) return { key }
    return (SERVICE_KEYS as string[]).includes(s) ? { key, service: s as ServiceKey } : null
  }
  if (key === 'articles') {
    if (!s) return { key }
    return (ARTICLE_KEYS as string[]).includes(s) ? { key, article: s as ArticleKey } : null
  }
  return s ? null : ({ key } as DocRef)
}

/** Parameter URL untuk satu dokumen (kebalikan refFromQuery). */
export function queryOf(ref: DocRef): string {
  const sub = ref.key === 'services' ? ref.service : ref.key === 'articles' ? ref.article : undefined
  return `p=${ref.key}${sub ? `&s=${sub}` : ''}`
}

/** Judul kartu OG; null bila dokumen itu tidak ada dalam bahasa ini (beranda memakai kartu merek, bukan judul). */
export function ogTitleOf(lang: Lang, ref: DocRef): string | null {
  if (ref.key === 'home' || !langsOf(ref).includes(lang)) return null
  const p = getPages(lang)
  const title = (() => {
    switch (ref.key) {
      case 'services':
        return ref.service ? serviceText(serviceOf(ref.service), lang).title : p.services.ogTitle
      case 'articles':
        return ref.article ? getArticle(lang, ref.article).title : p.articles.title
      case 'pricing':
        return p.pricing.ogTitle
      case 'demo':
        return p.demo.ogTitle(DEMOS.length)
      case 'faq':
        return p.faq.ogTitle
      case 'about':
        return p.about.ogTitle
      case 'contact':
        return p.contact.ogTitle
      case 'founder':
        return p.founder.ogTitle
      case 'glossary':
        return p.glossary.title
      case 'privacy':
        return p.legal.privacyTitle
      case 'terms':
        return p.legal.termsTitle
      case 'local':
        return localText(lang).ogTitle
      case 'payment':
        return paymentText(lang).ogTitle
    }
  })()
  return plain(title)
}
