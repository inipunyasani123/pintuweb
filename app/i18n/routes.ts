// Peta URL publik per bahasa. Folder internal di app/[lang]/ memakai segmen versi Indonesia;
// next.config.ts membangun rewrite (publik -> internal) dan redirect (internal -> publik) dari tabel ini.
import { BASE_LANGS, DEFAULT_LANG, LANGS, LANG_INFO, X_LANGS, isLang, type BaseLang, type Lang, type XLang } from './config'
import { ARTICLE_SLUGS, SERVICE_SLUGS, articleKeyBySlug, serviceKeyBySlug, type ArticleKey, type ServiceKey } from './slugs'
import { SITE } from '../lib/site'

export type PageKey =
  | 'home' | 'services' | 'pricing' | 'demo' | 'faq' | 'about' | 'contact'
  | 'founder' | 'privacy' | 'terms' | 'articles' | 'glossary' | 'local' | 'payment'

/** Segmen URL bahasa dasar. null = halaman itu tidak ada dalam bahasa tersebut. */
const BASE_SEGMENTS: Record<PageKey, Record<BaseLang, string | null>> = {
  home: { id: '', en: '', ms: '' },
  services: { id: 'services', en: 'services', ms: 'perkhidmatan' },
  pricing: { id: 'paket', en: 'pricing', ms: 'harga' },
  demo: { id: 'demo', en: 'demos', ms: 'demo' },
  faq: { id: 'faq', en: 'faq', ms: 'soalan-lazim' },
  about: { id: 'about', en: 'about', ms: 'tentang-kami' },
  contact: { id: 'kontak', en: 'contact', ms: 'hubungi' },
  founder: { id: 'owner', en: 'founder', ms: 'pengasas' },
  privacy: { id: 'kebijakan-privasi', en: 'privacy-policy', ms: 'dasar-privasi' },
  terms: { id: 'syarat-ketentuan', en: 'terms', ms: 'terma-syarat' },
  articles: { id: 'artikel', en: 'articles', ms: null },
  glossary: { id: 'kamus-website', en: 'glossary', ms: 'glosari' },
  // Halaman lokal (kota di lib/site.ts). Segmen berisi kata kunci yang dicari orang; folder internal = segmen id.
  local: { id: 'jasa-pembuatan-website-tulungagung', en: 'web-design-tulungagung', ms: 'laman-web-tulungagung' },
  // Cara bayar & metode pembayaran (22 Okt 2026); folder internal = segmen id
  payment: { id: 'pembayaran', en: 'payment', ms: 'pembayaran' },
}

/**
 * Halaman yang SUDAH diterjemahkan untuk tiap bahasa tambahan. Halaman di luar daftar ini tidak dibuat untuk
 * bahasa itu, dan tautan ke sana otomatis menuju versi Inggris (lihat path()). Artikel tidak pernah ada di sini.
 */
const X_CORE: PageKey[] = ['home', 'services', 'pricing', 'demo', 'faq', 'about', 'contact', 'founder', 'glossary', 'local', 'payment']
const X_READY: Record<string, PageKey[]> = Object.fromEntries((X_LANGS as readonly XLang[]).map((l) => [l, X_CORE]))

/** Segmen URL per halaman per bahasa; bahasa tambahan memakai segmen Inggris. null = halaman tidak ada. */
export const SEGMENTS = Object.fromEntries(
  (Object.keys(BASE_SEGMENTS) as PageKey[]).map((key) => [
    key,
    Object.fromEntries([
      ...BASE_LANGS.map((l) => [l, BASE_SEGMENTS[key][l]]),
      ...X_LANGS.map((l) => [l, X_READY[l].includes(key) ? BASE_SEGMENTS[key].en : null]),
    ]),
  ]),
) as Record<PageKey, Record<Lang, string | null>>

const prefix = (lang: Lang) => (lang === DEFAULT_LANG ? '' : `/${lang}`)

export const hasPage = (lang: Lang, key: PageKey) => SEGMENTS[key][lang] !== null

/** Bahasa cadangan untuk menaut halaman yang belum ada dalam suatu bahasa. */
const FALLBACK: Lang = 'en'

/**
 * Path publik, mis. path('en', 'pricing') -> '/en/pricing'. Bila halaman itu belum ada dalam bahasa yang diminta
 * (bahasa tambahan yang belum lengkap), hasilnya path versi Inggris, supaya tautannya tetap hidup.
 * Untuk memutuskan apakah sebuah halaman ADA, pakai hasPage()/langsOf(), jangan path().
 */
export function path(lang: Lang, key: PageKey, slug?: string): string {
  const seg = SEGMENTS[key][lang]
  if (seg === null) {
    if (lang !== FALLBACK && SEGMENTS[key][FALLBACK] !== null) return path(FALLBACK, key, slug)
    throw new Error(`Halaman ${key} tidak ada dalam bahasa ${lang}`)
  }
  const p = [prefix(lang), seg, slug].filter(Boolean).join('/')
  return p ? (p.startsWith('/') ? p : `/${p}`) : '/'
}

export const url = (lang: Lang, key: PageKey, slug?: string) => {
  const p = path(lang, key, slug)
  return p === '/' ? SITE : `${SITE}${p}`
}

/** Bahasa + slug untuk satu "dokumen". Halaman tanpa slug cukup { key }. */
export type DocRef =
  | { key: Exclude<PageKey, 'services' | 'articles'> }
  | { key: 'services'; service?: ServiceKey }
  | { key: 'articles'; article?: ArticleKey }

/** Bahasa yang memiliki dokumen ini. */
export function langsOf(ref: DocRef): Lang[] {
  return LANGS.filter((l) => {
    if (!hasPage(l, ref.key)) return false
    if (ref.key === 'articles' && ref.article) return Boolean((ARTICLE_SLUGS[ref.article] as Partial<Record<Lang, string>>)[l])
    return true
  })
}

export function pathOf(lang: Lang, ref: DocRef): string {
  // layanan: slug mengikuti bahasa yang benar-benar dipakai (Inggris bila halaman layanan belum ada di bahasa ini)
  if (ref.key === 'services' && ref.service) return path(lang, 'services', SERVICE_SLUGS[ref.service][hasPage(lang, 'services') ? lang : FALLBACK])
  if (ref.key === 'articles' && ref.article) {
    const slug = (ARTICLE_SLUGS[ref.article] as Partial<Record<Lang, string>>)[lang]
    if (!slug) throw new Error(`Artikel ${ref.article} tidak ada dalam bahasa ${lang}`)
    return path(lang, 'articles', slug)
  }
  return path(lang, ref.key)
}

export const urlOf = (lang: Lang, ref: DocRef) => {
  const p = pathOf(lang, ref)
  return p === '/' ? SITE : `${SITE}${p}`
}

/** canonical + hreflang (termasuk x-default ke versi Indonesia) untuk metadata Next. */
export function alternatesOf(lang: Lang, ref: DocRef) {
  const langs = langsOf(ref)
  const languages: Record<string, string> = {}
  for (const l of langs) languages[LANG_INFO[l].hreflang] = urlOf(l, ref)
  languages['x-default'] = urlOf(langs.includes(DEFAULT_LANG) ? DEFAULT_LANG : langs[0], ref)
  return { canonical: urlOf(lang, ref), languages }
}

/** Membaca path publik menjadi bahasa + dokumen. null bila bukan halaman situs ini. */
export function parsePath(pathname: string): { lang: Lang; ref: DocRef } | null {
  const parts = pathname.split('/').filter(Boolean)
  let lang: Lang = DEFAULT_LANG
  if (parts[0] && isLang(parts[0]) && parts[0] !== DEFAULT_LANG) lang = parts.shift() as Lang
  if (parts.length === 0) return { lang, ref: { key: 'home' } }
  const key = (Object.keys(SEGMENTS) as PageKey[]).find((k) => SEGMENTS[k][lang] === parts[0])
  if (!key) return null
  if (key === 'services' && parts[1]) {
    const service = serviceKeyBySlug(lang, parts[1])
    return service ? { lang, ref: { key, service } } : null
  }
  if (key === 'articles' && parts[1]) {
    const article = articleKeyBySlug(lang, parts[1])
    return article ? { lang, ref: { key, article } } : null
  }
  return { lang, ref: { key } as DocRef }
}

/**
 * Menyamakan path internal & publik. Di server, usePathname() mengembalikan path hasil rewrite
 * (/id/paket, /en/paket), di browser path publik (/paket, /en/pricing). Tanpa normalisasi,
 * HTML server & klien berbeda (hydration error) dan tautan pemilih bahasa bisa salah.
 */
export function toPublicPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === DEFAULT_LANG) parts.shift()
  else if (parts[0] && isLang(parts[0]) && parts[1]) {
    const lang = parts[0]
    const key = (Object.keys(SEGMENTS) as PageKey[]).find((k) => SEGMENTS[k][DEFAULT_LANG] === parts[1])
    const pub = key ? SEGMENTS[key][lang] : null
    if (pub) parts[1] = pub
  }
  return `/${parts.join('/')}`
}

/** Path padanan di bahasa lain untuk pemilih bahasa; null bila versi itu tidak ada. */
export function switchPath(pathname: string, target: Lang): string | null {
  const parsed = parsePath(pathname)
  if (!parsed) return target === DEFAULT_LANG ? '/' : `/${target}`
  return langsOf(parsed.ref).includes(target) ? pathOf(target, parsed.ref) : null
}

/** Rewrite & redirect untuk next.config.ts (dihitung dari SEGMENTS). */
export function routingRules() {
  const rewrites: { source: string; destination: string }[] = []
  const redirects: { source: string; destination: string; permanent: true }[] = []
  for (const lang of LANGS.filter((l) => l !== DEFAULT_LANG)) {
    for (const key of Object.keys(SEGMENTS) as PageKey[]) {
      const pub = SEGMENTS[key][lang]
      const internal = SEGMENTS[key][DEFAULT_LANG]
      if (!pub || !internal || pub === internal) continue
      rewrites.push(
        { source: `/${lang}/${pub}`, destination: `/${lang}/${internal}` },
        { source: `/${lang}/${pub}/:rest*`, destination: `/${lang}/${internal}/:rest*` },
      )
      redirects.push(
        { source: `/${lang}/${internal}`, destination: `/${lang}/${pub}`, permanent: true },
        { source: `/${lang}/${internal}/:rest*`, destination: `/${lang}/${pub}/:rest*`, permanent: true },
      )
    }
  }
  return { rewrites, redirects }
}
