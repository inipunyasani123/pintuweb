import type { Metadata } from 'next'
import DemoGallery, { type DemoCat, type DemoGalleryText } from './DemoGallery'
import { JsonLd } from '../../components/Bits'
import { categoriesFor, demosFor, getDict, getPages, isLang, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import { pageGraph, pageMeta } from '../../i18n/seo'
import { packagesFor } from '../../i18n/facts'
import { PACKAGE_FOR_CATEGORY, portalOf } from '../../lib/portals'
import { demoSrcSet, type DemoCategory } from '../../lib/demos'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const p = getPages(lang).demo
  const n = demosFor(lang).length
  return pageMeta({ lang, ref: { key: 'demo' }, title: p.title(n), description: p.description(n), ogTitle: p.ogTitle(n), ogDescription: p.ogDescription })
}

export default async function DemoPage({ params }: Params) {
  const lang = (await params).lang as Lang
  const d = getDict(lang)
  const p = getPages(lang).demo
  const demos = demosFor(lang)
  const n = demos.length
  const pk = packagesFor(lang)
  const g = d.portfolio
  const count = (c: DemoCategory) => demos.filter((x) => x.category === c).length
  // Tiap kategori lengkap dengan teks spanduknya: judul galeri, jumlah, harga mulai, paket, dan galeri khususnya.
  const cats: DemoCat[] = categoriesFor(lang).map((c) => {
    const slug = PACKAGE_FOR_CATEGORY[c.id]
    const gal = g.galleries[c.id]
    return {
      id: c.id,
      label: c.label,
      title: gal.title,
      tagline: gal.tagline,
      countText: `${count(c.id)} ${g.unit[c.id]}`,
      from: pk.find((x) => x.slug === slug)!.priceFrom,
      packageHref: `${path(lang, 'pricing')}#${slug}`,
      portalHref: `/${portalOf(c.id)!.path}`,
      openLabel: d.hero.openGallery(gal.title),
    }
  })

  // Templat {n}/{cat}/{name} diisi di klien, supaya fungsi kamus tidak perlu dikirim ke browser.
  const t: DemoGalleryText = {
    badge: p.badge,
    from: d.common.from,
    h1: p.h1(n),
    lead: p.lead,
    note: d.common.demoLangNote,
    filterAria: p.filterAria,
    all: p.all,
    search: p.search,
    searchPh: p.searchPh,
    none: p.none,
    seePackage: p.seePackage,
    newTabShort: d.common.newTabShort,
    showingAll: p.showing(999, null).replace('999', '{n}'),
    showingCat: p.showing(999, '§').replace('999', '{n}').replace('§', '{cat}'),
    imgAlt: p.imgAlt('§').replace('§', '{name}'),
    newTab: d.common.newTab,
    ctaTitle: p.ctaTitle,
    ctaLead: p.ctaLead,
    contact: p.contact,
    seePricing: p.seePricing,
  }

  const jsonLd = pageGraph({
    lang,
    ref: { key: 'demo' },
    name: p.title(n),
    description: p.description(n),
    type: 'CollectionPage',
    crumbs: [
      { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
      { name: p.badge, url: urlOf(lang, { key: 'demo' }) },
    ],
    extra: [
      {
        '@type': 'ItemList',
        name: p.listName,
        numberOfItems: n,
        itemListElement: demos.map((dm, i) => ({ '@type': 'ListItem', position: i + 1, name: `${dm.name} — ${dm.tagline}`, url: dm.url })),
      },
    ],
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      {/* pkg = harga dari paket lain (mis. "corporate" -> situs-acara); noPrice = kartu tanpa harga (DemoGallery) */}
      <DemoGallery
        demos={demos.map((dm) => (dm.pkg && !dm.noPrice ? { ...dm, from: pk.find((x) => x.slug === dm.pkg)!.priceFrom } : dm))}
        cats={cats}
        t={t}
        contactHref={path(lang, 'contact')}
        pricingHref={path(lang, 'pricing')}
        thumbSrcSet={demoSrcSet('{slug}')}
      />
    </>
  )
}
