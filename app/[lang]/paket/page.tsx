import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageHero from '../../components/PageHero'
import PackageCard from '../../components/PackageCard'
import PriceMap from '../../components/PriceMap'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { cardsFor } from '../../components/cards'
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
      >
        {/* Lompat ke kelompok paket */}
        <nav aria-label={p.groupsNav} className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[color:var(--surface-soft)] px-4 text-[0.9375rem] text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]"
                >
                  {g.title}
                  <span className="text-[0.8125rem] font-medium text-[color:var(--text-muted)]">{g.cards.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Semua paket sekilas: peta harga yang sama dengan di beranda; barisnya melompat ke kartu paket di bawah */}
      <section aria-labelledby="map-title" className="mt-12 bg-[color:var(--surface-soft)] py-14 sm:mt-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{p.mapKicker}</p>
          <h2 id="map-title" className="mt-3 text-[1.875rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">
            {p.mapTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)]">{p.mapLead}</p>
          <PriceMap lang={lang} base="#" tone="white" className="mt-8" />
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.id} id={g.id} aria-labelledby={`grup-${g.id}`} className="border-b border-[color:var(--rule)] py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-8 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="kicker text-[color:var(--primary-700)]">
                  {p.count(g.cards.length)} · {labels.from} {g.from}
                </p>
                <h2 id={`grup-${g.id}`} className="mt-3 text-[1.875rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">
                  {g.title}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{g.lead}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-9">
              {g.cards.map((c) => (
                // kartu yang dituju dari peta harga (#slug) diberi lingkar sorot
                <div key={c.slug} id={c.slug} className="scroll-mt-4 rounded-[1.5rem] target:shadow-[0_0_0_4px_var(--primary-200)]">
                  <PackageCard p={c} labels={labels} as="h3" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Biaya tambahan */}
      <section aria-labelledby="addons-title" className="bg-[color:var(--surface-soft)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="addons-title" className="text-[1.875rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">
            <HlText parts={p.addonsTitle} />
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)]">{p.addonsLead}</p>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {addons.map((a) => (
              <li key={a.slug} className="flex flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                <h3 className="text-[1.125rem] leading-snug text-[color:var(--text-primary)]">{a.title}</h3>
                <p className="display mt-3 text-[1.375rem] font-semibold leading-tight tracking-tight text-[color:var(--text-primary)]">{a.range}</p>
                <p className="mt-1 text-[0.9375rem] text-[color:var(--text-tertiary)]">{a.unit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="info-title" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="info-title" className="max-w-3xl text-[1.875rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">
            <HlText parts={p.infoTitle} />
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {info.map((i) => (
              <li key={i.title} className="rounded-[1.25rem] bg-[color:var(--surface-soft)] p-5 sm:p-6">
                <h3 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">{i.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{i.body}</p>
              </li>
            ))}
          </ul>

          {/* Ajakan */}
          <div className="mt-10 flex flex-col gap-6 rounded-[2rem] bg-[color:var(--primary-700)] p-8 text-white [background-image:linear-gradient(135deg,var(--primary-700),var(--primary-900))] sm:mt-12 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-2xl">
              <h2 className="text-[1.75rem] leading-[1.12] sm:text-[2.25rem]">{p.ctaTitle}</h2>
              <p className="mt-3 leading-relaxed text-white/85">{p.ctaLead}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={wa(p.ctaWa)} target="_blank" rel="noopener noreferrer" className="btn btn-white">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
              </a>
              <Link href={path(lang, 'faq')} className="btn btn-ghost-dark">
                {p.readFaq} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>
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
