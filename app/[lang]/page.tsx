import type { Metadata } from 'next'
import Hero from '../components/Hero'
import AudienceSection from '../components/AudienceSection'
import Process from '../components/Process'
import Portfolio from '../components/Portfolio'
import { ClientsHome } from '../components/ClientProjects'
import WhyUs from '../components/WhyUs'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import { JsonLd } from '../components/Bits'
import { faqProps } from '../components/props'
import { DEMOS } from '../lib/demos'
import { getDict, isLang, type Lang } from '../i18n'
import { ogHome, pageGraph, pageMeta } from '../i18n/seo'
import { urlOf } from '../i18n/routes'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const t = getDict(lang).meta
  return pageMeta({
    lang,
    ref: { key: 'home' },
    title: t.homeTitle,
    absoluteTitle: true,
    description: t.homeDescription(DEMOS.length),
    ogDescription: t.ogHomeDescription(DEMOS.length),
    image: ogHome(lang),
  })
}

// Urutan: pernyataan + jenis-jenis website (harga mulai & "Detail & harga" per jenis), demo pilihan, proyek klien
// (ringkas), untuk siapa (kebutuhan → paket), cara kerja, janji, harga (peta harga mulai 640px), FAQ.
// Bukti dulu (demo, klien), lalu pilihan paket, cara kerja & janji, baru rincian harga. Ajakan penutup ada di footer.
// Jarak antarbagian memakai kelas section-y (globals.css): 56px di ponsel, ±120px di layar lebar.
export default async function HomePage({ params }: Params) {
  const lang = (await params).lang as Lang
  const t = getDict(lang)
  const faq = faqProps(lang)
  return (
    <>
      <main id="main-content">
        <Hero lang={lang} />
        <Portfolio lang={lang} />
        <ClientsHome lang={lang} />
        <AudienceSection lang={lang} />
        <Process lang={lang} />
        <WhyUs lang={lang} />
        <Pricing lang={lang} />
        <FAQ {...faq} />
      </main>
      {/* Tanpa JSON-LD FAQPage di sini: pertanyaan yang sama persis sudah ditandai di halaman FAQ, dan Google meminta
          FAQ yang berulang di beberapa halaman ditandai sekali saja. Ini juga memangkas ±10 KB dari HTML + payload RSC. */}
      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'home' },
          name: t.meta.homeTitle,
          description: t.meta.homeDescription(DEMOS.length),
          crumbs: [{ name: t.common.home, url: urlOf(lang, { key: 'home' }) }],
        })}
      />
    </>
  )
}
