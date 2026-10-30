// Halaman kota sekitar (Kediri, Blitar, Trenggalek): isi di content/cities.ts, rute tipis di app/[lang]/jasa-pembuatan-website-<kota>.
// PintuWeb berlokasi di Tulungagung dan melayani kota ini online; JSON-LD hanya Service + areaServed (tanpa alamat di kota ini).
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'
import { Breadcrumbs, HlText, JsonLd } from './Bits'
import { DemoCard, FaqList, H2, WaCta } from './BizBits'
import { articlesIn } from '../content/articles'
import { bizOf, bizText } from '../content/business'
import { CITIES, CITY_LANGS, cityByPage, cityText, cityUi, type City } from '../content/cities'
import { faqJsonLd } from '../content/faq'
import { facts, fillFacts, packagesFor } from '../i18n/facts'
import { demosFor, getDict, isLang, LANG_INFO, type Lang } from '../i18n'
import { hasPage, path, pathOf, urlOf, type PageKey } from '../i18n/routes'
import { ORG_ID, localAreaServed, pageGraph, pageMeta } from '../i18n/seo'
import { CATEGORY_COLOR } from '../lib/portals'
import { CITY, wa } from '../lib/site'

type Page = Extract<PageKey, 'cityKediri' | 'cityBlitar' | 'cityTrenggalek'>

function resolve(raw: string, page: Page): Lang | null {
  return isLang(raw) && CITY_LANGS.includes(raw) && hasPage(raw, page) ? raw : null
}

const fill = (lang: Lang, s: string) => fillFacts(lang, s.replace(/\{\{city\}\}/g, CITY))

export async function cityMetadata(rawLang: string, page: Page): Promise<Metadata> {
  const lang = resolve(rawLang, page)
  if (!lang) return {}
  const t = cityText(cityByPage(page), lang)
  return pageMeta({ lang, ref: { key: page }, title: t.title, description: t.description, ogTitle: t.ogTitle })
}

export default function CityPage({ rawLang, page }: { rawLang: string; page: Page }) {
  const lang = resolve(rawLang, page)
  if (!lang) notFound()
  const city: City = cityByPage(page)
  const t = cityText(city, lang)
  const u = cityUi(lang)
  const d = getDict(lang)
  const f = facts(lang)
  const pk = packagesFor(lang)
  const bySlug = (slug: string) => pk.find((p) => p.slug === slug)!
  const demos = demosFor(lang)
  const demoOf = (slug: string) => demos.find((x) => x.slug === slug)!
  const ref = { key: page } as const
  const url = urlOf(lang, ref)
  const waHref = wa(t.wa)
  const lead = bySlug(city.pkgs[0])
  const related = articlesIn(lang).filter((a) => city.articles.includes(a.key))
  const others = CITIES.filter((c) => c.key !== city.key)
  const faq = t.faq.map((x) => ({ question: x.q, answer: x.a }))
  const tone = CATEGORY_COLOR[city.tone]

  const serviceLd = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: t.ogTitle,
    serviceType: 'Web design and development',
    description: t.description,
    url,
    provider: { '@id': ORG_ID },
    // Tanpa alamat di kota ini: PintuWeb berlokasi di Tulungagung. Kota ini hanya wilayah layanan (online).
    areaServed: [{ '@type': 'City', name: city.name, containedInPlace: { '@type': 'AdministrativeArea', name: 'Jawa Timur', alternateName: 'East Java' } }, ...localAreaServed().slice(1)],
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: urlOf(lang, { key: 'contact' }), availableLanguage: LANG_INFO[lang].htmlLang },
  }

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: t.crumb }]} />

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
              <strong className="font-semibold text-[color:var(--text-primary)]">{fill(lang, t.answerLead)}</strong> {fill(lang, t.answer)}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {d.common.consultFree} <MessageCircle size={17} aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
              <Link href={path(lang, 'pricing')} className="btn btn-line">
                {u.seePricing} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5">
            <div className="rounded-[1.5rem] p-5 text-white [background-image:linear-gradient(135deg,var(--primary-700),var(--primary-900))] sm:p-6">
              <p className="text-[0.875rem] text-white/80">{u.fromLabel}</p>
              <p className="display tnum mt-1 text-[2.25rem] font-semibold leading-none tracking-[-0.02em] sm:text-[2.75rem]">{lead.priceFrom}</p>
              <p className="mt-2 text-[0.9375rem] text-white/85">
                {lead.title} · {lead.duration}
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-[color:var(--surface-soft)] p-5 ring-1 ring-[color:var(--border-light)]">
              <h2 className="text-[1.0625rem] leading-snug text-[color:var(--text-primary)]">{t.onlineTitle}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)]">{t.onlineBody}</p>
              <p className="mt-3 text-[0.8125rem] text-[color:var(--text-tertiary)]">
                {f.hoursDays}, {f.hoursTime}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usaha khas kota ini; fakta daerah diberi nomor sumber */}
      <section aria-labelledby="sectors-title" className="section-y mt-14 bg-[color:var(--surface-primary)] sm:mt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{u.sectorsKicker}</p>
            <h2 id="sectors-title" className={`mt-2 sm:mt-3 ${H2}`}>{t.sectorsTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.sectorsLead}</p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
            {t.sectors.map((s) => {
              const p = bySlug(s.pkg)
              return (
                <li key={s.name} className="flex flex-col rounded-[1.5rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                  <span className="h-1 w-10 rounded-full" style={{ backgroundColor: tone.color }} aria-hidden="true" />
                  <h3 className="mt-4 text-[1.25rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.375rem]">{s.name}</h3>
                  <p className="mb-5 mt-2 leading-relaxed text-[color:var(--text-secondary)]">
                    {s.body}
                    {s.src && (
                      <a href="#sumber" className="ms-1 align-super text-[0.75rem] font-semibold text-[color:var(--primary-700)] underline">
                        [{s.src}]
                      </a>
                    )}
                  </p>
                  <p className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-t border-[color:var(--border-light)] pt-4 text-[0.875rem] text-[color:var(--text-tertiary)]">
                    <span>{u.pkgLabel}</span>
                    <span className="font-semibold text-[color:var(--text-primary)]">{p.title}</span>
                    <span>
                      · {d.common.from} <span className="font-semibold text-[color:var(--text-primary)]">{p.priceFrom}</span>
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="demos-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{u.demoKicker}</p>
            <h2 id="demos-title" className={`mt-2 sm:mt-3 ${H2}`}>{u.demoTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{u.demoLead}</p>
            {d.common.demoLangNote && <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">{d.common.demoLangNote}</p>}
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
            {city.demos.map((slug) => (
              <DemoCard key={slug} demo={demoOf(slug)} why={t.demoWhy[slug]} open={u.openDemo} newTab={d.common.newTab} />
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="pkg-title" className="section-y bg-[color:var(--surface-primary)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{u.pkgKicker}</p>
          <h2 id="pkg-title" className={`mt-2 sm:mt-3 ${H2}`}>{u.pkgTitle}</h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {city.pkgs.map((slug) => {
              const p = bySlug(slug)
              return (
                <li key={slug} className="flex flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                  <h3 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">{p.title}</h3>
                  <p className="mb-4 mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{p.subtitle}</p>
                  <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-[color:var(--border-light)] pt-4 text-[0.875rem]">
                    <div className="min-w-0">
                      <dt className="text-[color:var(--text-tertiary)]">{u.from}</dt>
                      <dd className="mt-0.5 font-semibold text-[color:var(--text-primary)]">{p.priceFrom}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[color:var(--text-tertiary)]">{u.time}</dt>
                      <dd className="mt-0.5 font-semibold text-[color:var(--text-primary)]">{p.duration}</dd>
                    </div>
                  </dl>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cfaq-title" className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="cfaq-title" className="text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">{u.faqTitle}</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={t.faq} />
            <div className="mt-8">
              <WaCta title={u.ctaTitle} lead={u.ctaLead} label={d.common.consultFree} href={waHref} newTab={d.common.newTabShort} />
            </div>
          </div>
        </div>
      </section>

      {/* Tautan antarhalaman: kota lain, Tulungagung, jenis usaha, artikel; lalu sumber */}
      <section className="section-b">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{u.nearbyTitle}</h2>
            <p className="mt-3 text-[0.9375rem] text-[color:var(--text-tertiary)]">{u.nearbyLead}</p>
            <ul className="mt-2">
              {[...others.map((o) => ({ label: cityText(o, lang).ogTitle, href: pathOf(lang, { key: o.page }) })), { label: u.tulungagung, href: path(lang, 'local') }].map((l) => (
                <li key={l.href} className="border-b border-[color:var(--border-light)]">
                  <Link href={l.href} className="group flex items-center justify-between gap-3 py-3 text-[0.9375rem] text-[color:var(--text-secondary)] hover:text-[color:var(--primary-700)]">
                    {l.label} <ArrowRight size={15} aria-hidden="true" className="arw shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="kicker mt-8 border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{u.bizTitle}</h2>
            <ul>
              {city.biz.map((k) => (
                <li key={k} className="border-b border-[color:var(--border-light)]">
                  <Link href={pathOf(lang, { key: 'business', biz: k })} className="group flex items-center justify-between gap-3 py-3 text-[0.9375rem] text-[color:var(--text-secondary)] hover:text-[color:var(--primary-700)]">
                    {bizText(bizOf(k), lang).title} <ArrowRight size={15} aria-hidden="true" className="arw shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            {related.length > 0 && (
              <>
                <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{u.readTitle}</h2>
                <ul>
                  {related.map((a) => (
                    <li key={a.key} className="border-b border-[color:var(--border-light)]">
                      <Link href={pathOf(lang, { key: 'articles', article: a.key })} className="group block py-4">
                        <span className="display block text-[1.1875rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)]">{a.title}</span>
                        <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{a.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div id="sumber" className="mt-8 scroll-mt-28">
              <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{u.sourcesTitle}</h2>
              <p className="mt-3 text-[0.875rem] text-[color:var(--text-tertiary)]">{u.sourcesNote}</p>
              <ol className="mt-3 list-decimal space-y-2 ps-5 text-[0.9375rem] text-[color:var(--text-secondary)] marker:text-[color:var(--text-tertiary)]">
                {city.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--primary-700)] underline underline-offset-2 [overflow-wrap:anywhere]">
                      {s.title}
                      <span className="sr-only"> {d.common.newTabShort}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

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

