import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageHero from '../../components/PageHero'
import { PackageGrid } from '../../components/PackageCard'
import PriceMap from '../../components/PriceMap'
import { NeedsList } from '../../components/AudienceSection'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { cardsFor } from '../../components/cards'
import { needsFor } from '../../content/needs'
import { addonsFor, facts, groupText, minPrice, money } from '../../i18n/facts'
import { LANG_INFO, getDict, getPages, isLang, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import { ORG_ID, pageGraph, pageMeta } from '../../i18n/seo'
import { PACKAGES, PACKAGE_GROUPS, PRICES_UPDATED } from '../../lib/packages'
import { wa } from '../../lib/site'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const p = getPages(lang).pricing
  const min = money(lang, minPrice())
  return pageMeta({ lang, ref: { key: 'pricing' }, title: p.title, description: p.description(min, PACKAGES.length), ogTitle: p.ogTitle, ogDescription: p.ogDescription(min) })
}

// Urutan: pembuka, "mulai dari kebutuhanmu" (kebutuhan → paket, plus lompatan ke kategori), peta harga, kartu paket
// per kategori, lalu hal yang perlu diketahui + biaya tambahan. Tanpa pita ajakan sendiri: ajakan penutup footer yang
// langsung menyusul membawa pesan & tombol yang sama; ajakan konsultasi paket ada di bagian kebutuhan.
export default async function PaketPage({ params }: Params) {
  const lang = (await params).lang as Lang
  const d = getDict(lang)
  const p = getPages(lang).pricing
  const f = facts(lang)
  const min = money(lang, minPrice())
  const { cards, labels } = cardsFor(lang)
  const groups = PACKAGE_GROUPS.map((g) => ({
    id: g,
    ...groupText(lang)[g],
    cards: cards.filter((c) => c.group === g),
    // harga mulai kelompok ini
    from: money(lang, Math.min(...PACKAGES.filter((x) => x.group === g).map((x) => x.minPrice))),
  })).filter((g) => g.cards.length)
  const addons = addonsFor(lang)
  const reviewed = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : LANG_INFO[lang].intl, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(PRICES_UPDATED))

  const info = [
    { title: p.payment, body: f.payment },
    { title: p.afterYear, body: f.renewal },
    { title: p.guarantee, body: f.guarantee },
  ]

  const offers = {
    '@type': 'OfferCatalog',
    '@id': `${urlOf(lang, { key: 'pricing' })}#offers`,
    name: p.title,
    itemListElement: groups.map((g) => ({
      '@type': 'OfferCatalog',
      name: g.title,
      itemListElement: g.cards.map((c) => {
        const raw = PACKAGES.find((x) => x.slug === c.slug)!
        return {
          '@type': 'Offer',
          name: c.title,
          description: c.subtitle,
          url: `${urlOf(lang, { key: 'pricing' })}#${c.slug}`,
          seller: { '@id': ORG_ID },
          priceCurrency: 'IDR',
          price: raw.minPrice,
          priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'IDR', minPrice: raw.minPrice, ...(raw.openEnded ? {} : { maxPrice: raw.maxPrice }) },
        }
      }),
    })),
  }

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: d.nav.pricing }]} />
      <PageHero
        tight
        eyebrow={p.eyebrow}
        title={<HlText parts={p.h1} mode="italic" tone="primary" />}
        lead={p.lead(min)}
        aside={
          <>
            {p.updated} {reviewed}
            {d.common.priceNote ? ` · ${d.common.priceNote}` : ''}
          </>
        }
      />

      {/* Mulai dari kebutuhan: tiap baris melompat ke kartu paketnya di bawah (content/needs.ts) */}
      <section id="kebutuhan" aria-labelledby="needs-title" className="pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="needs-title" className="text-[1.5rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.875rem]">
            {p.needsTitle}
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)]">{p.needsLead}</p>
          <NeedsList lang={lang} items={needsFor(lang)} base="#" className="mt-6 sm:mt-8" />

          <div className="mt-6 flex flex-col gap-x-10 gap-y-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Lompat ke kategori: tautan teks sebaris yang membungkus ke baris berikut (tanpa gulir menyamping) */}
            <nav aria-label={p.groupsNav}>
              <p className="text-[0.9375rem] leading-[1.9] text-[color:var(--text-tertiary)]">
                <span className="me-3">{p.groupsLead}</span>
                {groups.map((g) => (
                  <Fragment key={g.id}>
                    <a href={`#${g.id}`} className="me-4 inline-block whitespace-nowrap py-0.5 font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline">
                      {g.title} <span className="text-[0.8125rem] font-medium text-[color:var(--text-muted)]">{g.cards.length}</span>
                    </a>{' '}
                  </Fragment>
                ))}
              </p>
            </nav>
            <p className="shrink-0 text-[0.9375rem] text-[color:var(--text-tertiary)]">
              {p.ctaTitle}{' '}
              <a href={wa(p.ctaWa)} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-semibold">
                {d.common.consultFree} <ArrowUpRight size={15} className="arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Semua paket sekilas: peta harga yang sama dengan di beranda; barisnya melompat ke kartu paket di bawah */}
      <section aria-labelledby="map-title" className="section-y bg-[color:var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{p.mapKicker}</p>
          <h2 id="map-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
            {p.mapTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)]">{p.mapLead}</p>
          <PriceMap lang={lang} base="#" tone="white" className="mt-6 sm:mt-8" />
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`grup-${g.id}`} className="border-b border-[color:var(--rule)] py-8 sm:py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-5 px-4 sm:px-6 lg:grid-cols-12 lg:gap-y-8">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="kicker text-[color:var(--primary-700)]">
                  {p.count(g.cards.length)} · {labels.from} {g.from}
                </p>
                <h2 id={`grup-${g.id}`} className="mt-2 text-[1.625rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.1rem]">
                  {g.title}
                </h2>
                {/* ponsel: pengantar kelompok disembunyikan; subjudul tiap kartu sudah menjelaskan isinya */}
                <p className="mt-3 hidden text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] sm:block">{g.lead}</p>
              </div>
            </div>
            {/* kartu berjangkar #slug: tujuan daftar kebutuhan, peta harga, dan tautan dari halaman lain */}
            <PackageGrid cards={g.cards} labels={labels} note={false} className="lg:col-span-9" />
          </div>
        </section>
      ))}

      {/* Yang perlu diketahui sebelum memesan + biaya tambahan */}
      <section aria-labelledby="info-title" className="section-y bg-[color:var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="info-title" className="max-w-3xl text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">
            <HlText parts={p.infoTitle} />
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:mt-8 md:grid-cols-3">
            {info.map((i) => (
              <li key={i.title} className="border-t border-[color:var(--rule)] pt-4">
                <h3 className="text-[1.125rem] leading-snug text-[color:var(--text-primary)]">{i.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{i.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-4 sm:mt-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 id="addons-title" className="text-[1.375rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.5rem]">
                <HlText parts={p.addonsTitle} />
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{p.addonsLead}</p>
            </div>
            <ul aria-labelledby="addons-title" className="lg:col-span-8">
              {addons.map((a) => (
                <li key={a.slug} className="border-b border-[color:var(--border-light)] py-3 first:border-t sm:flex sm:items-end sm:gap-3">
                  <span className="block font-medium leading-snug text-[color:var(--text-primary)]">{a.title}</span>
                  <span className="leader hidden sm:block" aria-hidden="true" />
                  <span className="mt-0.5 block text-[0.9375rem] leading-snug sm:mt-0 sm:shrink-0 sm:text-end">
                    <span className="font-semibold text-[color:var(--text-primary)]">{a.range}</span>{' '}
                    <span className="text-[0.875rem] text-[color:var(--text-tertiary)]">{a.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8">
            <Link href={path(lang, 'faq')} className="link inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold">
              {p.readFaq} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'pricing' },
          name: p.title,
          description: p.description(min, PACKAGES.length),
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: d.nav.pricing, url: urlOf(lang, { key: 'pricing' }) },
          ],
          dates: { modified: PRICES_UPDATED },
          extra: [offers],
        })}
      />
    </main>
  )
}
