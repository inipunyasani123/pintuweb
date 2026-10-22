// Halaman lokal: jasa pembuatan website di kota tempat PintuWeb berlokasi (CITY di lib/site.ts).
// URL publik per bahasa ada di i18n/routes.ts (segmen 'local'); teksnya di content/local.ts, angka dari
// lib/packages.ts & lib/site.ts lewat penanda {{…}}. Usaha area layanan: hanya kota yang ditulis, tanpa alamat jalan.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Clock,
  Gem,
  MapPin,
  MessageCircle,
  PartyPopper,
  Shirt,
  Stethoscope,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { articlesIn } from '../../content/articles'
import { faqJsonLd } from '../../content/faq'
import { LOCAL_DEMOS, LOCAL_PACKAGES, LOCAL_SECTORS, LOCAL_SOURCES, localText, type SectorKey } from '../../content/local'
import { facts, packagesFor } from '../../i18n/facts'
import { demosFor, getDict, isLang, LANG_INFO, type Lang } from '../../i18n'
import { hasPage, path, pathOf, urlOf } from '../../i18n/routes'
import { ORG_ID, localAreaServed, pageGraph, pageMeta } from '../../i18n/seo'
import { PACKAGES, pricedOnly } from '../../lib/packages'
import { CATEGORY_COLOR } from '../../lib/portals'
import { demoSrcSet, demoThumb } from '../../lib/demos'
import { wa } from '../../lib/site'

type Params = { params: Promise<{ lang: string }> }

function resolve(raw: string): Lang | null {
  return isLang(raw) && hasPage(raw, 'local') ? raw : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const lang = resolve((await params).lang)
  if (!lang) return {}
  const t = localText(lang)
  return pageMeta({ lang, ref: { key: 'local' }, title: t.title, absoluteTitle: true, description: t.description, ogTitle: t.ogTitle })
}

const SECTOR_ICON: Record<SectorKey, LucideIcon> = {
  marmer: Gem,
  fashion: Shirt,
  kuliner: UtensilsCrossed,
  wisata: Waves,
  jasa: Stethoscope,
  acara: PartyPopper,
}

const H2 = 'text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]'

export default async function LocalPage({ params }: Params) {
  const lang = resolve((await params).lang)
  if (!lang) notFound()
  const t = localText(lang)
  const d = getDict(lang)
  const f = facts(lang)
  const pk = packagesFor(lang)
  const bySlug = (slug: string) => pk.find((p) => p.slug === slug)!
  const landing = bySlug('landing-page')
  const ref = { key: 'local' as const }
  const url = urlOf(lang, ref)
  const waHref = wa(t.ctaWa)
  const demos = demosFor(lang)
  const shown = LOCAL_DEMOS.map((s) => demos.find((dm) => dm.slug === s.slug)!).filter(Boolean)
  /** versi lengkap (petak pertama berdaftar fitur) memakai tata letak bento 2×2 */
  const big = Boolean(t.sectors[LOCAL_SECTORS[0].key].points)
  const sectorDemo = shown.find((dm) => LOCAL_DEMOS.find((x) => x.slug === dm.slug)?.sector === LOCAL_SECTORS[0].key)
  const related = articlesIn(lang).filter((a) => t.articles.includes(a.key))
  const faq = t.faq.map((x) => ({ question: x.q, answer: x.a }))

  // paket berharga saja (paket "sesuai kebutuhan" tidak punya angka untuk lowPrice/highPrice)
  const lows = pricedOnly(LOCAL_PACKAGES.map((s) => PACKAGES.find((p) => p.slug === s)!))
  const serviceLd = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: t.ogTitle,
    serviceType: 'Web design and development',
    description: t.description,
    url,
    provider: { '@id': ORG_ID },
    areaServed: localAreaServed(),
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: urlOf(lang, { key: 'contact' }), availableLanguage: LANG_INFO[lang].htmlLang },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: Math.min(...lows.map((p) => p.minPrice)),
      highPrice: Math.max(...lows.map((p) => p.maxPrice)),
      offerCount: lows.length,
      url: urlOf(lang, { key: 'pricing' }),
    },
  }

  const tiles = [
    { icon: MapPin, label: t.facts.baseLabel, value: f.location, sub: t.facts.baseSub },
    { icon: Clock, label: t.facts.hoursLabel, value: f.hoursDays, sub: f.hoursTime },
    { icon: CalendarCheck, label: t.facts.sinceLabel, value: t.facts.sinceValue, sub: t.facts.sinceSub },
    { icon: MessageCircle, label: t.facts.startLabel, value: t.facts.startValue, sub: f.response },
  ]

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: t.crumb }]} />

      {/* Pembuka: jawaban langsung (siapa, di mana, harga, lama, cara mulai) + ringkasan fakta dalam petak */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="kicker inline-flex items-center gap-2 text-[color:var(--primary-700)]">
              <MapPin size={15} strokeWidth={2.2} aria-hidden="true" /> {t.eyebrow}
            </p>
            <h1 className="mt-4 text-[clamp(2.125rem,1.45rem+2.9vw,3.5rem)] leading-[1.07] text-[color:var(--text-primary)] sm:mt-5">
              <HlText parts={t.h1} mode="italic" tone="primary" />
            </h1>
            <p className="mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-[color:var(--text-secondary)] sm:text-[1.1875rem]">
              <strong className="font-semibold text-[color:var(--text-primary)]">{t.answerLead}</strong> {t.answer}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
              <Link href={path(lang, 'pricing')} className="btn btn-line">
                {t.ctaPricing} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Ringkasan: petak biru (harga mulai) + empat petak fakta. Angka dari packages.ts & site.ts. */}
          <dl className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-5">
            <div className="col-span-2 rounded-[1.5rem] p-5 text-white [background-image:linear-gradient(135deg,var(--primary-700),var(--primary-900))] sm:p-6">
              <dt className="text-[0.875rem] text-white/80">{t.facts.fromLabel}</dt>
              <dd className="mt-1">
                <span className="display tnum block text-[2.25rem] font-semibold leading-none tracking-[-0.02em] sm:text-[2.75rem]">{landing.priceFrom}</span>
                <span className="mt-2 block text-[0.9375rem] text-white/85">
                  {landing.title} · {landing.duration}
                </span>
              </dd>
            </div>
            {tiles.map((x) => (
              <div key={x.label} className="min-w-0 rounded-[1.25rem] bg-[color:var(--surface-soft)] p-4 ring-1 ring-[color:var(--border-light)] sm:p-5">
                <dt className="flex items-center gap-2 text-[0.8125rem] text-[color:var(--text-tertiary)]">
                  <x.icon size={15} strokeWidth={2.2} className="shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" /> {x.label}
                </dt>
                <dd className="mt-2 min-w-0">
                  <span className="block font-semibold leading-snug text-[color:var(--text-primary)] [overflow-wrap:anywhere]">
                    <bdi>{x.value}</bdi>
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">{x.sub}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Jenis website per sektor usaha: bento, petak pertama lebih lebar di desktop */}
      <section aria-labelledby="sectors-title" className="section-y mt-14 bg-[color:var(--surface-primary)] sm:mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{t.sectorsKicker}</p>
            <h2 id="sectors-title" className={`mt-2 sm:mt-3 ${H2}`}>{t.sectorsTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.sectorsLead}</p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {LOCAL_SECTORS.map((s, i) => {
              const Icon = SECTOR_ICON[s.key]
              const c = CATEGORY_COLOR[s.tone]
              const p = bySlug(s.pkg)
              const text = t.sectors[s.key]
              return (
                // bento (bila petak pertama punya daftar fitur, yaitu versi lengkap id/en): petak pertama 2×2 di desktop dan
                // selebar dua kolom di tablet, petak terakhir selebar dua kolom di tablet. Versi ringkas: enam petak sama besar.
                <li
                  key={s.key}
                  className={`flex flex-col rounded-[1.5rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6 ${big && i === 0 ? 'sm:col-span-2 lg:row-span-2 lg:p-8' : ''} ${big && i === LOCAL_SECTORS.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full" style={{ backgroundColor: c.tint, color: c.color }} aria-hidden="true">
                    <Icon size={21} strokeWidth={2} />
                  </span>
                  <h3 className={`mt-4 leading-snug text-[color:var(--text-primary)] ${big && i === 0 ? 'text-[1.375rem] sm:text-[1.625rem]' : 'text-[1.25rem] sm:text-[1.375rem]'}`}>{text.name}</h3>
                  <p className={`mb-5 mt-2 leading-relaxed text-[color:var(--text-secondary)] ${big && i === 0 ? 'lg:text-[1.0625rem]' : ''}`}>{text.body}</p>
                  {text.points && (
                    <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                      {text.points.map((pt) => (
                        <li key={pt} className="flex gap-2.5 text-[0.9375rem] leading-snug text-[color:var(--text-secondary)]">
                          <Check size={17} strokeWidth={2.4} className="mt-[0.1em] shrink-0" style={{ color: c.color }} aria-hidden="true" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* petak besar (desktop): tangkapan layar demo katalog untuk sektor ini, mengisi tinggi petak */}
                  {big && i === 0 && sectorDemo && (
                    <a href={sectorDemo.url} target="_blank" rel="noopener noreferrer" className="group mb-6 hidden lg:block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={demoThumb(sectorDemo.slug)}
                        srcSet={demoSrcSet(sectorDemo.slug)}
                        sizes="560px"
                        alt=""
                        width={720}
                        height={378}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-[1200/630] w-full rounded-xl border border-[color:var(--border-light)] object-cover object-top"
                      />
                      <span className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-[color:var(--text-tertiary)] group-hover:text-[color:var(--primary-700)]">
                        {t.demoLabel(sectorDemo.name)} <ArrowUpRight size={14} className="arw-ne transition-transform" aria-hidden="true" />
                        <span className="sr-only">{d.common.newTabShort}</span>
                      </span>
                    </a>
                  )}
                  <p className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-[color:var(--border-light)] pt-4 text-[0.875rem] text-[color:var(--text-tertiary)]">
                    <span>{t.pkgLabel}</span>
                    <span className="font-semibold text-[color:var(--text-primary)]">{p.title}</span>
                    <span>
                      · {d.common.from} <span className="font-semibold text-[color:var(--text-primary)]">{p.priceFrom}</span>
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
          {t.sourcesNote && <p className="mt-5 text-[0.875rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.sourcesNote} <a href="#sumber" className="link font-semibold">{t.sourcesTitle}</a>.</p>}
        </div>
      </section>

      {/* Area layanan: lingkaran konsentris (hiasan) + daftar yang dibaca pembaca layar */}
      <section aria-labelledby="area-title" className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-x-12 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="kicker text-[color:var(--primary-700)]">{t.areaKicker}</p>
            <h2 id="area-title" className={`mt-2 sm:mt-3 ${H2}`}>{t.areaTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.areaLead}</p>
            <ol className="mt-7 border-t border-[color:var(--rule)]">
              {t.rings.map((r, i) => (
                <li key={r.label} className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-[color:var(--border-light)] py-4">
                  <span className="tnum pt-0.5 text-[0.9375rem] font-semibold text-[color:var(--primary-700)]" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug text-[color:var(--text-primary)]">{r.label}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{r.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-6" aria-hidden="true">
            <div className="relative mx-auto aspect-square w-full max-w-[24rem] sm:max-w-[28rem]">
              {[100, 76, 52, 28].map((size, i) => (
                <span
                  key={size}
                  className="absolute rounded-full"
                  style={{
                    inset: `${(100 - size) / 2}%`,
                    background: i === 3 ? 'linear-gradient(135deg,var(--primary-700),var(--primary-900))' : i === 0 ? 'var(--primary-50)' : i === 1 ? '#fff' : 'var(--primary-100)',
                    boxShadow: i === 3 ? '0 24px 48px -24px rgb(25 47 102 / .6)' : 'inset 0 0 0 1px var(--primary-200)',
                  }}
                />
              ))}
              <span className="absolute inset-0 grid place-items-center text-center text-white">
                <span className="flex flex-col items-center gap-1 px-2">
                  <MapPin size={20} strokeWidth={2.2} />
                  <span className="display text-[0.9375rem] font-semibold leading-tight sm:text-[1.0625rem]">{t.rings[0].short}</span>
                </span>
              </span>
              {t.rings.slice(1).map((r, i) => (
                <span
                  key={r.label}
                  className="absolute left-1/2 max-w-[70%] -translate-x-1/2 -translate-y-1/2 truncate rounded-full bg-white px-3 py-1 text-[0.75rem] font-semibold text-[color:var(--primary-800)] shadow-[0_6px_16px_-10px_rgb(15_29_58/.5)] ring-1 ring-[color:var(--primary-200)] sm:text-[0.8125rem]"
                  // di tengah pita tiap lingkaran: pita 52% = 24–36%, 76% = 12–24%, 100% = 0–12%
                  style={{ top: `${[30, 18, 6][i]}%` }}
                >
                  {r.short}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contoh demo yang relevan (usaha fiktif) */}
      <section aria-labelledby="demos-title" className="section-y bg-[color:var(--surface-primary)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">Demo</p>
            <h2 id="demos-title" className={`mt-2 sm:mt-3 ${H2}`}>{t.demosTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.demosLead}</p>
            {d.common.demoLangNote && <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">{d.common.demoLangNote}</p>}
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
            {shown.map((dm) => {
              const label = t.sectors[LOCAL_DEMOS.find((x) => x.slug === dm.slug)!.sector].name
              return (
                <li key={dm.slug}>
                  <a href={dm.url} target="_blank" rel="noopener noreferrer" className="group block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={demoThumb(dm.slug)}
                      srcSet={demoSrcSet(dm.slug)}
                      sizes="(min-width: 1152px) 352px, (min-width: 1024px) calc(33vw - 32px), (min-width: 640px) calc(50vw - 36px), calc(50vw - 22px)"
                      alt=""
                      width={720}
                      height={378}
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[1200/630] w-full rounded-lg border border-[color:var(--border-light)] object-cover object-top sm:rounded-xl"
                    />
                    <span className="mt-2.5 flex items-start justify-between gap-3 sm:mt-4">
                      <span className="min-w-0">
                        <span className="block text-[0.75rem] font-semibold text-[color:var(--primary-700)] sm:text-[0.8125rem]">{label}</span>
                        <span className="display mt-0.5 block text-[1rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)] sm:text-[1.3rem] sm:leading-tight">{dm.name}</span>
                        <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)] sm:mt-1 sm:text-[0.9375rem]">{dm.tagline}</span>
                      </span>
                      <ArrowUpRight size={17} className="arw-ne mt-1 hidden shrink-0 text-[color:var(--primary-700)] transition-transform sm:block" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{d.common.newTab}</span>
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="mt-8 border-t border-[color:var(--border-light)] pt-6 sm:mt-12">
            <Link href={path(lang, 'demo')} className="btn btn-line btn-sm">
              {t.allDemos} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Paket & harga (angka dari packages.ts, sama dengan halaman Harga) */}
      <section aria-labelledby="pricing-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="kicker text-[color:var(--primary-700)]">{t.pricingKicker}</p>
              <h2 id="pricing-title" className={`mt-2 sm:mt-3 ${H2}`}>{t.pricingTitle}</h2>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.pricingLead}</p>
            </div>
            <Link href={path(lang, 'pricing')} className="link inline-flex shrink-0 items-center gap-1.5 self-start text-[0.9375rem] font-semibold lg:self-end">
              {t.seePricing} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {LOCAL_PACKAGES.map((slug) => {
              const p = bySlug(slug)
              return (
                <li key={slug} className="flex flex-col rounded-[1.25rem] bg-[color:var(--surface-soft)] p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                  <h3 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">{p.title}</h3>
                  <p className="mb-4 mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{p.subtitle}</p>
                  <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-[color:var(--border-light)] pt-4 text-[0.875rem]">
                    <div className="min-w-0">
                      <dt className="text-[color:var(--text-tertiary)]">{t.colPrice}</dt>
                      <dd className="mt-0.5 font-semibold text-[color:var(--text-primary)]">{p.priceFrom}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[color:var(--text-tertiary)]">{t.colTime}</dt>
                      <dd className="mt-0.5 font-semibold text-[color:var(--text-primary)]">{p.duration}</dd>
                    </div>
                  </dl>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 max-w-3xl text-[0.875rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.pricingNote}</p>
        </div>
      </section>

      {/* Cara kerja (seluruhnya online) */}
      <section aria-labelledby="how-title" className="section-y bg-[color:var(--surface-primary)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{t.processKicker}</p>
            <h2 id="how-title" className={`mt-2 sm:mt-3 ${H2}`}>{t.processTitle}</h2>
          </div>
          <ol className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {t.steps.map((st, i) => (
              <li key={st.title} className="rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                <span className="tnum grid h-9 w-9 place-items-center rounded-full bg-[color:var(--primary-50)] text-[0.9375rem] font-semibold text-[color:var(--primary-700)] ring-1 ring-[color:var(--primary-100)]" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">{st.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ (juga JSON-LD FAQPage) + ajakan */}
      <section aria-labelledby="lfaq-title" className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="lfaq-title" className="text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">{t.faqTitle}</h2>
          </div>
          <div className="lg:col-span-8">
            <div className="border-t border-[color:var(--rule)]">
              {t.faq.map((x) => (
                <details key={x.q} className="group border-b border-[color:var(--border-light)]">
                  <summary className="flex cursor-pointer list-none items-start gap-6 py-4 text-start sm:py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="flex-1 text-[1.0625rem] leading-snug text-[color:var(--text-primary)] group-open:text-[color:var(--primary-700)] sm:text-[1.1875rem]">{x.q}</h3>
                    <span aria-hidden="true" className="relative mt-2.5 h-3 w-3 shrink-0 text-[color:var(--text-tertiary)] transition-transform duration-300 group-open:rotate-45 group-open:text-[color:var(--primary-700)]">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pe-10 leading-relaxed text-[color:var(--text-secondary)]">{x.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-[1.25rem] bg-[color:var(--primary-50)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
              <div className="min-w-0">
                <h2 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.3rem]">{t.ctaTitle}</h2>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.ctaLead}</p>
              </div>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid shrink-0">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bacaan terkait (artikel hanya id/en) + sumber data daerah */}
      {(related.length > 0 || t.sourcesNote) && (
        <section className="section-b">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
            {related.length > 0 && (
              <div className="lg:col-span-7">
                <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{t.readTitle}</h2>
                <ul>
                  {related.map((a) => (
                    <li key={a.key} className="border-b border-[color:var(--border-light)]">
                      <Link href={pathOf(lang, { key: 'articles', article: a.key })} className="group block py-4 sm:py-5">
                        <span className="display block text-[1.1875rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)] sm:text-[1.3rem]">{a.title}</span>
                        <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] sm:mt-1.5">{a.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {t.sourcesNote && (
              <div id="sumber" className={`scroll-mt-28 ${related.length > 0 ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-6'}`}>
                <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{t.sourcesTitle}</h2>
                <ol className="mt-4 list-decimal space-y-2 ps-5 text-[0.9375rem] text-[color:var(--text-secondary)] marker:text-[color:var(--text-tertiary)]">
                  {LOCAL_SOURCES.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--primary-700)] underline underline-offset-2 [overflow-wrap:anywhere]">
                        {s.title}
                        <span className="sr-only"> {d.common.newTabShort}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      <JsonLd data={faqJsonLd(faq, LANG_INFO[lang].htmlLang)} />
      <JsonLd
        data={pageGraph({
          lang,
          ref,
          name: t.ogTitle,
          description: t.description,
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: t.crumb, url },
          ],
          extra: [serviceLd],
          about: ORG_ID,
          mainEntity: `${url}#service`,
        })}
      />
    </main>
  )
}
