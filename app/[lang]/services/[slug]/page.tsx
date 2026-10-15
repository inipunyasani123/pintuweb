import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import PageHero from '../../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../../components/Bits'
import { SERVICES, serviceOf, serviceText } from '../../../content/services'
import { serviceFrom } from '../../../content/service-utils'
import { fillFacts } from '../../../i18n/facts'
import { cardsFor } from '../../../components/cards'
import PackageCard from '../../../components/PackageCard'
import { ServiceClients } from '../../../components/ClientProjects'
import { articlesIn } from '../../../content/articles'
import { faqJsonLd } from '../../../content/faq'
import { categoriesFor, demosFor, getDict, getPages, isLang, LANG_INFO, type Lang } from '../../../i18n'
import { SERVICE_SLUGS, serviceKeyBySlug } from '../../../i18n/slugs'
import { hasPage, path, pathOf, urlOf } from '../../../i18n/routes'
import { ORG_ID, pageGraph, pageMeta } from '../../../i18n/seo'
import { PACKAGES } from '../../../lib/packages'
import { portalOf } from '../../../lib/portals'
import { DEMOS, demoSrcSet } from '../../../lib/demos'
import { wa } from '../../../lib/site'

type Params = { params: Promise<{ lang: string; slug: string }> }

export const dynamicParams = false
export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return []
  // Bahasa yang halaman layanannya belum diterjemahkan TETAP harus mengembalikan slug (di sini slug Inggris):
  // daftar kosong untuk satu bahasa membuat Next menggugurkan halaman layanan SEMUA bahasa. Halamannya sendiri
  // berakhir notFound() lewat resolve() di bawah.
  const lang = hasPage(params.lang, 'services') ? params.lang : 'en'
  return SERVICES.map((s) => ({ slug: SERVICE_SLUGS[s.key][lang] }))
}

function resolve(lang: string, slug: string) {
  if (!isLang(lang) || !hasPage(lang, 'services')) return null
  const key = serviceKeyBySlug(lang, slug)
  return key ? { lang, service: serviceOf(key) } : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const r = resolve(lang, slug)
  if (!r) return {}
  const t = serviceText(r.service, r.lang)
  return pageMeta({ lang: r.lang, ref: { key: 'services', service: r.service.key }, title: t.title, description: t.description })
}

export default async function ServicePage({ params }: Params) {
  const { lang: rawLang, slug } = await params
  const r = resolve(rawLang, slug)
  if (!r) notFound()
  const lang: Lang = r.lang
  const s = r.service
  const raw = serviceText(s, lang)
  const fill = (x: string) => fillFacts(lang, x)
  const t = { ...raw, lead: fill(raw.lead), intro: raw.intro.map(fill), includes: raw.includes?.map(fill), faq: raw.faq.map((q) => ({ q: q.q, a: fill(q.a) })) }
  const d = getDict(lang)
  const p = getPages(lang).service
  const from = serviceFrom(lang, s)
  const ref = { key: 'services' as const, service: s.key }
  const url = urlOf(lang, ref)

  // Fitur: dari paket (packages.ts) bila ada, selain itu dari daftar khusus layanan.
  // Kartu paket milik layanan ini (string siap tampil, sama persis dengan halaman Paket).
  const { cards, labels } = cardsFor(lang, (slug) => s.packages.includes(slug))
  const ordered = s.packages.map((slug) => cards.find((c) => c.slug === slug)!).filter(Boolean)

  // Contoh demo: slug pilihan, atau semua demo pada kategori layanan (maks. 6).
  const demos = demosFor(lang)
  const catLabel = Object.fromEntries(categoriesFor(lang).map((c) => [c.id, c.label]))
  const shown = (s.demoSlugs ? s.demoSlugs.map((x) => demos.find((dm) => dm.slug === x)!).filter(Boolean) : demos.filter((dm) => s.demoCategories.includes(dm.category))).slice(0, 6)
  const portals = s.demoCategories.map((c) => ({ c, portal: portalOf(c), n: DEMOS.filter((dm) => dm.category === c).length })).filter((x) => x.portal)

  const related = articlesIn(lang).filter((a) => s.articles.includes(a.key))
  const others = SERVICES.filter((o) => o.key !== s.key)
  const faq = t.faq.map((f) => ({ question: f.q, answer: f.a }))

  const serviceLd: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: t.name,
    serviceType: t.title,
    description: t.lead,
    url,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    ...(from
      ? {
          offers: from.list.map((pk) => {
            const raw = PACKAGES.find((x) => x.slug === pk.slug)!
            return {
              '@type': 'Offer',
              name: pk.title,
              url: urlOf(lang, { key: 'pricing' }),
              priceCurrency: 'IDR',
              price: raw.minPrice,
              priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'IDR', minPrice: raw.minPrice, ...(raw.openEnded ? {} : { maxPrice: raw.maxPrice }) },
            }
          }),
        }
      : {}),
  }

  return (
    <main id="main-content">
      <Breadcrumbs
        label={d.common.breadcrumb}
        items={[{ name: d.common.home, href: path(lang, 'home') }, { name: p.breadcrumbServices, href: path(lang, 'services') }, { name: t.name }]}
      />
      <PageHero
        tight
        eyebrow={t.name}
        title={<HlText parts={t.h1} mode="italic" tone="primary" />}
        lead={t.lead}
        aside={from ? <>{getPages(lang).services.from} {from.price} · {from.duration}</> : undefined}
      >
        <a href={wa(p.ctaWa(t.name))} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-2">
          {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
        </a>
      </PageHero>

      {/* Pengantar + untuk siapa */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-x-10 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="space-y-5 text-[1.125rem] leading-relaxed text-[color:var(--text-secondary)] lg:col-span-7">
            {t.intro.map((para, i) => (
              <p key={para} className={i === 0 ? 'text-[1.25rem] font-medium leading-snug text-[color:var(--text-primary)]' : undefined}>{para}</p>
            ))}
          </div>
          <div className="border-t border-[color:var(--rule)] pt-5 lg:col-span-4 lg:col-start-9">
            <h2 className="kicker text-[color:var(--primary-700)]">{p.forWho}</h2>
            <ul className="mt-3">
              {t.forWho.map((w) => (
                <li key={w} className="flex items-start gap-3 border-b border-[color:var(--border-light)] py-3 text-[0.9375rem] text-[color:var(--text-secondary)]">
                  <span className="mt-[0.55em] h-[5px] w-[5px] shrink-0 bg-[color:var(--primary-700)]" aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Harga & paket: tabel ringkas (mudah dikutip) + kartu paket lengkap */}
      <section aria-labelledby="pricing-title" className="bg-[color:var(--surface-primary)] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{p.colPackage}</p>
            <h2 id="pricing-title" className="mt-3 text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">{p.pricing}</h2>
          </div>
          {from ? (
            <>
              <div className="table-wrap mt-10" role="region" tabIndex={0} aria-label={p.pricingCaption(t.name)}>
                <table className="w-full min-w-[30rem] text-left">
                  <caption className="sr-only">{p.pricingCaption(t.name)}</caption>
                  <thead>
                    <tr className="kicker border-b border-[color:var(--rule)] text-[color:var(--text-tertiary)]">
                      <th scope="col" className="py-3 pr-4 font-medium">{p.colPackage}</th>
                      <th scope="col" className="px-4 py-3 font-medium">{p.colRange}</th>
                      <th scope="col" className="px-4 py-3 font-medium">{p.colDeposit}</th>
                      <th scope="col" className="py-3 pl-4 font-medium">{p.colTime}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordered.map((pk) => (
                      <tr key={pk.slug} className="border-b border-[color:var(--border-medium)]">
                        <th scope="row" className="display py-4 pr-4 text-[1.2rem] font-medium text-[color:var(--text-primary)]">{pk.title}</th>
                        <td className="px-4 py-4 font-semibold text-[color:var(--text-primary)]">{pk.priceRange}</td>
                        <td className="px-4 py-4 text-[color:var(--text-secondary)]">{pk.deposit}</td>
                        <td className="py-4 pl-4 text-[color:var(--text-secondary)]">{pk.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {d.common.priceNote && <p className="mt-3 text-xs text-[color:var(--text-tertiary)]">{d.common.priceNote}</p>}

              <h3 className="kicker mt-14 text-[color:var(--text-primary)]">{p.included}</h3>
              <div className={`mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 ${ordered.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                {ordered.map((c) => (
                  <PackageCard key={c.slug} p={c} labels={labels} as="h4" />
                ))}
              </div>
              <Link href={path(lang, 'pricing')} className="link mt-8 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold">
                {p.seePricing} <ArrowRight size={15} className="arw" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <div className="mt-10 max-w-2xl">
              {t.includes && (
                <ul className="mb-6">
                  {t.includes.map((x) => (
                    <li key={x} className="flex items-start gap-3 border-b border-[color:var(--border-light)] py-3 text-[color:var(--text-secondary)]">
                      <span className="mt-[0.55em] h-[5px] w-[5px] shrink-0 bg-[color:var(--primary-700)]" aria-hidden="true" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="leading-relaxed text-[color:var(--text-secondary)]">{p.priceOnRequest}</p>
              <a href={wa(p.ctaWa(t.name))} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-6">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Cara kerja ringkas */}
      <section aria-labelledby="how-title" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{d.process.eyebrow}</p>
            <h2 id="how-title" className="mt-3 text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">{p.process}</h2>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {d.process.steps.map((st, i) => (
              <li key={st.title}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--primary-700)] text-[0.9375rem] font-semibold text-white" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-5 text-[1.4rem] text-[color:var(--text-primary)]">{st.title}</h3>
                <p className="mt-1.5 leading-relaxed text-[color:var(--text-tertiary)]">{st.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contoh demo */}
      {shown.length > 0 && (
        <section aria-labelledby="demos-title" className="bg-[color:var(--surface-primary)] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="kicker text-[color:var(--primary-700)]">Demo</p>
              <div>
                <h2 id="demos-title" className="mt-3 text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">{p.demos}</h2>
                <p className="mt-3 max-w-2xl text-[color:var(--text-tertiary)]">{p.demosLead}</p>
                {d.common.demoLangNote && <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">{d.common.demoLangNote}</p>}
              </div>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((dm) => (
                <li key={dm.slug}>
                  <a href={dm.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="crop block">
                      {/* sizes = lebar kartu: 1 kolom (ponsel), 2 kolom (sm), 3 kolom (lg) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/demos/${dm.slug}.webp`}
                        srcSet={demoSrcSet(dm.slug)}
                        sizes="(min-width: 1152px) 352px, (min-width: 1024px) calc(33vw - 32px), (min-width: 640px) calc(50vw - 36px), calc(100vw - 32px)"
                        alt=""
                        width={720}
                        height={378}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[1200/630] w-full border border-[color:var(--border-light)] object-cover object-top"
                      />
                    </span>
                    <span className="mt-4 flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="display block text-[1.35rem] leading-tight text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)]">{dm.name}</span>
                        <span className="mt-1 block text-[0.9375rem] text-[color:var(--text-tertiary)]">{dm.tagline}</span>
                      </span>
                      <ArrowUpRight size={17} className="arw-ne mt-1 shrink-0 text-[color:var(--primary-700)] transition-transform" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{d.common.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            {portals.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-3 border-t border-[color:var(--border-light)] pt-6">
                {portals.map(({ c, portal, n }) => (
                  <li key={c}>
                    <a href={`/${portal!.path}`} hrefLang="id" className="btn btn-line btn-sm">
                      {p.portal(n, catLabel[c])} <ArrowRight size={15} className="arw" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Proyek klien yang terkait layanan ini (content/clients.ts); tidak tampil bila tidak ada */}
      <ServiceClients lang={lang} service={s.key} />

      {/* FAQ layanan */}
      <section aria-labelledby="sfaq-title" className="py-16 sm:py-24">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-x-10 gap-y-8 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 id="sfaq-title" className="text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">{p.faq}</h2>
          </div>
          <div className="border-t border-[color:var(--rule)] lg:col-span-9">
            {t.faq.map((f) => (
              <details key={f.q} className="group border-b border-[color:var(--border-light)]">
                <summary className="flex cursor-pointer list-none items-start gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="flex-1 text-[1.0625rem] leading-snug text-[color:var(--text-primary)] group-open:text-[color:var(--primary-700)] sm:text-[1.1875rem]">{f.q}</h3>
                  <span aria-hidden="true" className="relative mt-2.5 h-3 w-3 shrink-0 text-[color:var(--text-tertiary)] transition-transform duration-300 group-open:rotate-45 group-open:text-[color:var(--primary-700)]">
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 pr-10 leading-relaxed text-[color:var(--text-secondary)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bacaan terkait + layanan lain */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-x-10 gap-y-12 px-4 sm:px-6 lg:grid-cols-12">
          {related.length > 0 && (
            <div className="lg:col-span-6">
              <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{p.readArticles}</h2>
              <ul>
                {related.map((a) => (
                  <li key={a.key} className="border-b border-[color:var(--border-light)]">
                    <Link href={pathOf(lang, { key: 'articles', article: a.key })} className="group block py-5">
                      <span className="display block text-[1.3rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)]">{a.title}</span>
                      <span className="mt-1.5 block text-[0.9375rem] text-[color:var(--text-tertiary)]">{a.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={related.length > 0 ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-6'}>
            <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{p.other}</h2>
            <ul>
              {others.map((o) => (
                <li key={o.key} className="border-b border-[color:var(--border-light)]">
                  <Link href={pathOf(lang, { key: 'services', service: o.key })} className="group flex items-center justify-between gap-3 py-3.5 text-[0.9375rem] text-[color:var(--text-secondary)] hover:text-[color:var(--primary-700)]">
                    {serviceText(o, lang).name} <ArrowRight size={15} aria-hidden="true" className="arw shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Ajakan */}
      <section className="bg-[color:var(--primary-700)] py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-[2.2rem] leading-[1.08] sm:text-5xl">{p.ctaTitle(t.name)}</h2>
            <p className="mt-4 text-lg text-white/85">{p.ctaLead}</p>
          </div>
          <a href={wa(p.ctaWa(t.name))} target="_blank" rel="noopener noreferrer" className="btn btn-white shrink-0">
            {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
          </a>
        </div>
      </section>

      <JsonLd data={faqJsonLd(faq, LANG_INFO[lang].htmlLang)} />
      <JsonLd
        data={pageGraph({
          lang,
          ref,
          name: t.title,
          description: t.description,
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: p.breadcrumbServices, url: urlOf(lang, { key: 'services' }) },
            { name: t.name, url },
          ],
          extra: [serviceLd],
        })}
      />
    </main>
  )
}
