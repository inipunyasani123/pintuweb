// Metadata & JSON-LD per halaman: canonical + hreflang lengkap, Open Graph per bahasa,
// dan graf schema.org yang konsisten (Organization, WebSite, WebPage, BreadcrumbList).
import type { Metadata } from 'next'
import { CLIENT_PROJECTS, CLOSES, EMAIL, FOUNDED_YEAR, GITHUB, OPENS, SITE, WA_NUMBER } from '../lib/site'
import { PACKAGES } from '../lib/packages'
import { LANG_INFO, LANGS, plain, type Lang } from './config'
import { alternatesOf, langsOf, urlOf, type DocRef } from './routes'
import { queryOf } from './og'
import { getDict } from './index'

export const ORG_ID = `${SITE}/#organization`
export const WEBSITE_ID = `${SITE}/#website`
export const FOUNDER_ID = `${SITE}/owner#person`

type MetaInput = {
  lang: Lang
  ref: DocRef
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  type?: 'website' | 'article' | 'profile'
  /** true = judul dipakai apa adanya (tanpa template "| PintuWeb"). */
  absoluteTitle?: boolean
  noindex?: boolean
  published?: string
  modified?: string
  image?: string
}

/** Naikkan bila desain gambar OG berubah, supaya perayap media sosial mengambil versi baru. */
const OG_REV = 8
/**
 * Gambar OG bergaya situs berisi judul dokumen. URL-nya memuat kunci dokumen, bukan teks: /api/og membaca judulnya
 * sendiri (i18n/og.ts), jadi tidak bisa dipakai membuat kartu berisi teks sembarang.
 */
export const ogImage = (lang: Lang, ref: DocRef) =>
  // aksara yang tidak ada di huruf OG (Mandarin, Hindi, Bengali, Arab): pakai kartu merek berbahasa Inggris
  LANG_INFO[lang].ogText && ref.key !== 'home' ? `${SITE}/api/og?l=${lang}&${queryOf(ref)}&r=${OG_REV}` : ogHome(lang)
/** Kartu merek beranda; angkanya dirender dari lib/site.ts sehingga tidak pernah usang. */
export const ogHome = (lang: Lang) => `${SITE}/api/og?v=home&l=${LANG_INFO[lang].ogText ? lang : 'en'}&r=${OG_REV}`

export function pageMeta(m: MetaInput): Metadata {
  const { canonical, languages } = alternatesOf(m.lang, m.ref)
  const info = LANG_INFO[m.lang]
  const others = langsOf(m.ref).filter((l) => l !== m.lang).map((l) => LANG_INFO[l].ogLocale)
  const title = plain(m.title)
  const description = plain(m.description)
  const ogTitle = plain(m.ogTitle ?? m.title)
  const ogDescription = plain(m.ogDescription ?? m.description)
  const image = m.image ?? ogImage(m.lang, m.ref)
  return {
    title: m.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: 'PintuWeb',
      locale: info.ogLocale,
      alternateLocale: others,
      type: m.type ?? 'website',
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
      ...(m.type === 'article' && m.published ? { publishedTime: m.published, modifiedTime: m.modified ?? m.published, authors: [`${SITE}/owner`] } : {}),
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: ogDescription, images: [image] },
    ...(m.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Organization + WebSite + layanan inti; dipasang di setiap halaman lewat layout. */
export function siteGraph(lang: Lang) {
  const t = getDict(lang)
  const prices = PACKAGES.map((p) => p.minPrice)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': ORG_ID,
        name: 'PintuWeb',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/images/logo-512.png`, width: 512, height: 512 },
        image: ogHome('id'),
        description: t.meta.orgDescription,
        slogan: t.header.tagline,
        foundingDate: `${FOUNDED_YEAR}`,
        founder: { '@id': FOUNDER_ID },
        email: EMAIL,
        telephone: `+${WA_NUMBER}`,
        priceRange: `IDR ${Math.min(...prices)}–${Math.max(...PACKAGES.map((p) => p.maxPrice))}`,
        currenciesAccepted: 'IDR',
        address: { '@type': 'PostalAddress', addressLocality: 'Trenggalek', addressRegion: 'Jawa Timur', addressCountry: 'ID' },
        areaServed: { '@type': 'Country', name: 'Indonesia' },
        knowsLanguage: LANGS.map((l) => LANG_INFO[l].htmlLang),
        knowsAbout: ['Web design', 'Web development', 'Next.js', 'Search engine optimization', 'Landing pages', 'E-commerce websites', 'Digital invitations'],
        ...(GITHUB ? { sameAs: [`https://${GITHUB}`] } : {}),
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: `+${WA_NUMBER}`,
          email: EMAIL,
          contactType: 'sales',
          availableLanguage: ['Indonesian', 'English', 'Malay'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: OPENS,
            closes: CLOSES,
          },
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: OPENS,
          closes: CLOSES,
        },
        additionalProperty: { '@type': 'PropertyValue', name: lang === 'id' ? 'Proyek klien' : 'Client projects', value: CLIENT_PROJECTS },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE,
        name: 'PintuWeb',
        inLanguage: LANGS.map((l) => LANG_INFO[l].htmlLang),
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'Person',
        '@id': FOUNDER_ID,
        name: 'Sanzy',
        jobTitle: 'Founder & Developer',
        worksFor: { '@id': ORG_ID },
        url: `${SITE}/owner`,
        ...(GITHUB ? { sameAs: [`https://${GITHUB}`] } : {}),
      },
    ],
  }
}

/** WebPage + BreadcrumbList untuk satu halaman. */
export function pageGraph(opts: {
  lang: Lang
  ref: DocRef
  name: string
  description: string
  type?: string
  crumbs: { name: string; url: string }[]
  extra?: Record<string, unknown>[]
  dates?: { published?: string; modified?: string }
}) {
  const url = urlOf(opts.lang, opts.ref)
  const graph: Record<string, unknown>[] = [
    {
      '@type': opts.type ?? 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: opts.name,
      description: opts.description,
      inLanguage: LANG_INFO[opts.lang].htmlLang,
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORG_ID },
      ...(opts.dates?.published ? { datePublished: opts.dates.published } : {}),
      ...(opts.dates?.modified ? { dateModified: opts.dates.modified } : {}),
      ...(opts.crumbs.length > 1 ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    },
  ]
  if (opts.crumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: opts.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': [...graph, ...(opts.extra ?? [])] }
}
