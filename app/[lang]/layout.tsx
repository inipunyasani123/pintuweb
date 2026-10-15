// Layout akar per bahasa. URL Indonesia tanpa awalan (/paket) ditulis ulang ke /id/… oleh next.config.ts.
import '../globals.css'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { JsonLd } from '../components/Bits'
import { DEMOS } from '../lib/demos'
import { SITE, WA_DISPLAY, wa } from '../lib/site'
import { LANGS, LANG_INFO, getDict, isLang, type Lang } from '../i18n'
import { hasPage, path } from '../i18n/routes'
import { rssTypes, siteGraph } from '../i18n/seo'

// Huruf bergaya Apple. Perangkat Apple memakai SF Pro bawaan sistem (-apple-system di globals.css;
// SF Pro sendiri tidak boleh di-embed di web). Perangkat lain memakai Inter, padanan terbuka yang paling
// dekat; sumbu optical size membuat judul besar memakai potongan "display" seperti SF Pro Display.
// `subsets` hanya menentukan berkas yang di-preload di SETIAP halaman, jadi cukup 'latin'. @font-face untuk subset
// lain (termasuk Kiril untuk versi Rusia) tetap ada di CSS dengan unicode-range-nya, dan berkasnya baru diunduh bila
// halaman memang memuat huruf itu. Aksara lain (Mandarin, Hindi, Bengali, Arab) memakai huruf bawaan perangkat lewat
// daftar cadangan di globals.css.
const inter = Inter({ subsets: ['latin'], axes: ['opsz'], variable: '--font-inter', display: 'swap' })

/** Naikkan bila favicon/ikon berubah: browser menyimpan favicon lama sangat lama, parameter ini memaksanya mengambil ulang. */
const ICON_REV = 3

export const dynamicParams = false
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }))

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDict(lang)
  return {
    metadataBase: new URL(SITE),
    title: { default: t.meta.homeTitle, template: '%s | PintuWeb' },
    description: t.meta.homeDescription(DEMOS.length),
    applicationName: 'PintuWeb',
    authors: [{ name: 'Sanzy', url: `${SITE}/owner` }],
    creator: 'PintuWeb',
    publisher: 'PintuWeb',
    keywords: t.meta.keywords,
    category: 'technology',
    formatDetection: { telephone: false, email: false, address: false },
    icons: {
      icon: [
        { url: `/images/favicon.ico?v=${ICON_REV}` },
        { url: `/images/favicon-32x32.png?v=${ICON_REV}`, sizes: '32x32', type: 'image/png' },
        { url: `/images/favicon-16x16.png?v=${ICON_REV}`, sizes: '16x16', type: 'image/png' },
      ],
      shortcut: `/images/favicon.ico?v=${ICON_REV}`,
      apple: `/images/apple-touch-icon.png?v=${ICON_REV}`,
    },
    manifest: '/site.webmanifest',
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    // Kode verifikasi diisi lewat variabel lingkungan Vercel bila tersedia (Google Search Console, Bing).
    verification: {
      ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
      ...(process.env.BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } } : {}),
    },
    // umpan RSS artikel (halaman yang memakai pageMeta memasangnya lagi, lihat rssTypes di i18n/seo.ts)
    alternates: { types: rssTypes(lang) },
  }
}

export const viewport: Viewport = {
  themeColor: '#26469c',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default async function LangLayout({ children, params }: { children: React.ReactNode } & Params) {
  const { lang: raw } = await params
  if (!isLang(raw)) notFound()
  const lang: Lang = raw
  const t = getDict(lang)

  const nav = [
    { label: t.nav.services, href: path(lang, 'services') },
    { label: t.nav.demo, href: path(lang, 'demo') },
    { label: t.nav.pricing, href: path(lang, 'pricing') },
    ...(hasPage(lang, 'articles') ? [{ label: t.nav.articles, href: path(lang, 'articles') }] : []),
    { label: t.nav.faq, href: path(lang, 'faq') },
    { label: t.nav.about, href: path(lang, 'about') },
    { label: t.nav.contact, href: path(lang, 'contact') },
  ]

  return (
    <html lang={LANG_INFO[lang].htmlLang} dir={LANG_INFO[lang].dir} className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">{t.common.skip}</a>
        <Header
          lang={lang}
          homeHref={path(lang, 'home')}
          nav={nav}
          waHref={wa(t.header.waText)}
          waDisplay={WA_DISPLAY}
          t={{
            tagline: t.header.tagline,
            brandAria: t.header.brandAria,
            logoAlt: t.header.logoAlt,
            mainNav: t.header.mainNav,
            mobileNav: t.header.mobileNav,
            guarantee: t.header.guarantee,
            consult: t.header.consult,
            consultFree: t.header.consultFree,
            openMenu: t.header.openMenu,
            closeMenu: t.header.closeMenu,
            menu: t.header.menu,
            demosReady: t.header.demosReady(DEMOS.length),
            respond: t.header.respond,
            language: t.header.language,
            notAvailable: t.header.notAvailable,
            newTab: t.common.newTabShort,
          }}
        />
        {children}
        <Footer lang={lang} />
        <JsonLd data={siteGraph(lang)} />
        <Analytics />
      </body>
    </html>
  )
}
