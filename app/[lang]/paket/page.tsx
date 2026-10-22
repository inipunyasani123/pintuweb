import type { Metadata } from 'next'
import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageHero from '../../components/PageHero'
import { BriefGrid } from '../../components/PackageCard'
import PriceMap from '../../components/PriceMap'
import PackageGuide, { type GuideCard } from '../../components/PackageGuide'
import PaySteps from '../../components/PaySteps'
import Tabs from '../../components/Tabs'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { cardsFor } from '../../components/cards'
import { GUIDE_EXTRA, GUIDE_PURPOSE, GUIDE_RESULTS, GUIDE_SIZE } from '../../content/guide'
import { paymentText } from '../../content/payment'
import { addonsFor, facts, groupText, minPrice, money, paySample } from '../../i18n/facts'
import { LANG_INFO, getDict, getPages, isLang, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import { ORG_ID, offerPrice, pageGraph, pageMeta } from '../../i18n/seo'
import { PACKAGES, PACKAGE_GROUPS, PRICES_UPDATED, pricedOnly } from '../../lib/packages'
import { wa } from '../../lib/site'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const p = getPages(lang).pricing
  const min = money(lang, minPrice())
  return pageMeta({ lang, ref: { key: 'pricing' }, title: p.title, description: p.description(min, PACKAGES.length), ogTitle: p.ogTitle, ogDescription: p.ogDescription(min) })
}

// Urutan (keputusan pemilik 22 Okt 2026: halaman harga harus simpel untuk orang awam di ponsel): pembuka, PEMANDU
// 3 pertanyaan (paket paling cocok + alternatif), semua paket per kelompok dalam TAB dengan kartu ringkas (isi lengkap
// dilipat), peta harga (tetap: pemilik menyukainya), cara bayar 3 langkah bergambar, lalu setelah tahun pertama,
// garansi, biaya tambahan, dan tautan FAQ. Ajakan penutup ada di footer.
export default async function PaketPage({ params }: Params) {
  const lang = (await params).lang as Lang
  const d = getDict(lang)
  const p = getPages(lang).pricing
  const g8 = p.guide
  const f = facts(lang)
  const min = money(lang, minPrice())
  const { cards, labels } = cardsFor(lang)
  const groups = PACKAGE_GROUPS.map((g) => ({
    id: g,
    ...groupText(lang)[g],
    cards: cards.filter((c) => c.group === g),
    // harga mulai kelompok ini (paket "sesuai kebutuhan" tidak dihitung)
    from: money(lang, Math.min(...pricedOnly(PACKAGES.filter((x) => x.group === g)).map((x) => x.minPrice))),
  })).filter((g) => g.cards.length)
  const addons = addonsFor(lang)
  const reviewed = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : LANG_INFO[lang].intl, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(PRICES_UPDATED))

  // Pemandu: tabel hasil + data kartu hasil (string saja, aman untuk komponen klien)
  const guideCards: Record<string, GuideCard> = Object.fromEntries(
    // paket tanpa perkiraan harga: kalimat lengkapnya ("Harga sesuai kebutuhan · konsultasi gratis"), bukan "mulai …"
    cards.map((c) => [c.slug, { title: c.title, subtitle: c.subtitle, priceFrom: c.quote ? c.priceRange : c.priceFrom, quote: c.quote, duration: c.duration, waHref: c.waHref }]),
  )
  const questions = [
    { id: 'tujuan', legend: g8.questions.purpose, options: GUIDE_PURPOSE.map((o) => ({ id: o, label: g8.purpose[o] })) },
    { id: 'ukuran', legend: g8.questions.size, options: GUIDE_SIZE.map((o) => ({ id: o, label: g8.size[o] })) },
    { id: 'fitur', legend: g8.questions.extra, options: GUIDE_EXTRA.map((o) => ({ id: o, label: g8.extra[o] })) },
  ]
  // tautan #slug (peta harga, pemandu, halaman lain) membuka tab kelompok kartunya
  const anchors = Object.fromEntries(groups.flatMap((g, i) => g.cards.map((c) => [c.slug, i])))

  // Contoh angka cara bayar: paket berharga yang direkomendasikan (lib/packages.ts)
  const sample = paySample(lang)

  const info = [
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
          ...offerPrice(raw),
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

      {/* Pemandu 3 pertanyaan → paket paling cocok + alternatif (content/guide.ts) */}
      <section id="pemandu" aria-labelledby="guide-title" className="pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{g8.kicker}</p>
          <h2 id="guide-title" className="mt-2 text-[1.625rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
            {g8.title}
          </h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)] sm:mt-3">{g8.lead}</p>
          <div className="mt-6 sm:mt-8">
            <PackageGuide
              questions={questions}
              results={GUIDE_RESULTS}
              cards={guideCards}
              labels={{ best: g8.best, alt: g8.alt, see: g8.see, ask: g8.ask, from: labels.from, duration: labels.duration, newTab: d.common.newTabShort, live: g8.live }}
            />
          </div>
          <p className="mt-5 text-[0.9375rem] text-[color:var(--text-tertiary)] lg:mt-6">
            {p.ctaTitle}{' '}
            <a href={wa(p.ctaWa)} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-semibold">
              {d.common.consultFree} <ArrowUpRight size={15} className="arw-ne" aria-hidden="true" />
              <span className="sr-only">{d.common.newTabShort}</span>
            </a>
          </p>
        </div>
      </section>

      {/* Semua paket per kelompok: tab + kartu ringkas. Semua panel tetap ada di HTML; kartu berjangkar #slug. */}
      <section id="paket" aria-labelledby="all-title" className="section-y bg-[color:var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{p.count(PACKAGES.length)}</p>
          <h2 id="all-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
            {p.allTitle}
          </h2>
          <Tabs
            idBase="kelompok"
            label={p.groupsNav}
            mode="hide"
            anchors={anchors}
            tabs={groups.map((g) => ({
              id: g.id,
              label: (
                <Fragment key={g.id}>
                  <span>{g.title}</span>{' '}
                  <span className="tnum text-[0.8125rem] font-medium opacity-80">{g.cards.length}</span>
                </Fragment>
              ),
            }))}
            panels={groups.map((g) => (
              <Fragment key={g.id}>
                <p className="mb-4 max-w-3xl text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">
                  {g.lead} <span className="whitespace-nowrap font-semibold text-[color:var(--text-secondary)]">{labels.from} {g.from}</span>
                </p>
                <BriefGrid cards={g.cards} labels={labels} wide />
              </Fragment>
            ))}
            listClass="mt-5 flex flex-wrap gap-2 sm:mt-6"
            tabClass="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-[0.9375rem] font-semibold leading-tight transition-colors"
            onClass="bg-[color:var(--primary-700)] text-white"
            offClass="bg-white text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]"
            panelsClass="mt-5 sm:mt-6"
          />
        </div>
      </section>

      {/* Semua paket sekilas: peta harga yang sama dengan di beranda; barisnya membuka kartu paketnya di atas */}
      <section aria-labelledby="map-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{p.mapKicker}</p>
          <h2 id="map-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
            {p.mapTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)]">{p.mapLead}</p>
          <PriceMap lang={lang} base="#" className="mt-6 sm:mt-8" />
        </div>
      </section>

      {/* Cara bayar 3 langkah, lalu setelah tahun pertama + garansi, biaya tambahan, FAQ */}
      <section aria-labelledby="pay-title" className="section-y bg-[color:var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <PaySteps kicker={p.payKicker} title={p.payTitle} steps={p.paySteps} example={p.payExample(sample.title, sample.price, sample.deposit, sample.rest)} methods={p.payMethods} more={{ href: path(lang, 'payment'), label: paymentText(lang).stripMore }} />

          <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:mt-14 md:grid-cols-2">
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
