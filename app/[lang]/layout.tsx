// Layout akar per bahasa. URL Indonesia tanpa awalan (/paket) ditulis ulang ke /id/… oleh next.config.ts.
import '../globals.css'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StickyBar from '../components/StickyBar'
import WaSource from '../components/WaSource'
import { JsonLd } from '../components/Bits'
import { DEMOS } from '../lib/demos'
import { FOUNDER_NAME, SITE, WA_DISPLAY, wa } from '../lib/site'
import { LANGS, LANG_INFO, getDict, isLang, type Lang } from '../i18n'
import { getPages } from '../i18n'
import { hasPage, path } from '../i18n/routes'
import { rssTypes, siteGraph } from '../i18n/seo'

// Huruf bergaya Apple. Perangkat Apple memakai SF Pro bawaan sistem (-apple-system di globals.css;
// SF Pro sendiri tidak boleh di-embed di web). Perangkat lain memakai Inter (wght + opsz), padanan terbuka yang paling
// dekat; @font-face-nya di globals.css, berkasnya di public/fonts. Subset latin perlu dipramuat supaya teks tidak
// menunggu, tetapi pramuat biasa ikut mengunduh ±72 KB di iPhone/Mac yang tidak memakainya. Jadi pramuatnya dipasang
// skrip kecil ini: ukur lebar teks di kanvas dengan tiap huruf sistem Apple dari tumpukan huruf; bila semuanya sama
// dengan monospace (hurufnya tidak ada), pasang <link rel="preload"> Inter latin. Subset lain (mis. Kiril untuk versi
// Rusia) tetap diunduh hanya bila halaman memuat hurufnya. Ganti berkas Inter = ganti juga alamat di sini.
const INTER_LATIN = '/fonts/inter-latin.32b04a22.woff2'
// Kode skripnya sengaja tanpa kutip, & dan < (hanya backtick), supaya atribut src data: tidak membengkak oleh escape.
const preloadInter =
  'try{var c=document.createElement(`canvas`).getContext(`2d`),w=function(f){c.font=`40px ${f},monospace`;return c.measureText(`mmmmmmmmmmiiiiil`).width},m=w(`monospace`);' +
  '[`-apple-system`,`BlinkMacSystemFont`,`SF Pro Text`].some(function(f){return w(f)!=m})||document.head.appendChild(Object.assign(document.createElement(`link`),' +
  `{rel:\`preload\`,as:\`font\`,type:\`font/woff2\`,crossOrigin:\`\`,href:\`${INTER_LATIN}\`}))}catch(e){}`

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
    authors: [{ name: FOUNDER_NAME, url: `${SITE}/owner` }],
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
  const pages = getPages(lang)

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
    <html lang={LANG_INFO[lang].htmlLang} dir={LANG_INFO[lang].dir} suppressHydrationWarning>
      <head>
        {/* async + data: supaya tidak menunggu CSS selesai dimuat (skrip inline di <head> menunggu stylesheet di depannya) */}
        <script async src={`data:text/javascript,${preloadInter}`} />
      </head>
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
        <StickyBar
          aria={t.conv.stickyAria}
          demo={{ href: path(lang, 'demo'), label: t.conv.seeDemos }}
          pricing={{ href: path(lang, 'pricing'), label: t.conv.seePricing }}
          chat={t.conv.chat}
          newTab={t.common.newTabShort}
          waDefault={wa(t.header.waText)}
          waByPage={{
            pricing: wa(pages.pricing.ctaWa),
            services: wa(pages.services.ctaWa),
            about: wa(pages.about.ctaWa),
            founder: wa(pages.founder.ctaWa),
          }}
        />
        <WaSource />
        <JsonLd data={siteGraph(lang)} />
        <Analytics />
      </body>
    </html>
  )
}
