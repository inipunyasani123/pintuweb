import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock, ShieldCheck, Tag, Wallet } from 'lucide-react'
import PageHero from '../../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../../components/Bits'
import { SERVICES, serviceOf, serviceText } from '../../../content/services'
import { keepRange, serviceFrom } from '../../../content/service-utils'
import { fillFacts } from '../../../i18n/facts'
import { cardsFor } from '../../../components/cards'
import PackageCard, { BriefGrid } from '../../../components/PackageCard'
import { ServiceClients } from '../../../components/ClientProjects'
import { articlesIn } from '../../../content/articles'
import { faqJsonLd } from '../../../content/faq'
import { categoriesFor, demosFor, getDict, getPages, isLang, LANG_INFO, type Lang } from '../../../i18n'
import { SERVICE_SLUGS, serviceKeyBySlug } from '../../../i18n/slugs'
import { hasPage, path, pathOf, urlOf } from '../../../i18n/routes'
import { ORG_ID, offerPrice, pageGraph, pageMeta } from '../../../i18n/seo'
import { PACKAGES } from '../../../lib/packages'
import { portalOf } from '../../../lib/portals'
import { DEMOS, demoSrcSet, demoThumb } from '../../../lib/demos'
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

// Urutan: pembuka (ringkasan bergambar: harga, waktu, bayar, garansi + ajakan), untuk siapa (penjelasan panjang
// dilipat; keputusan pemilik 22 Okt 2026: halaman layanan terlalu banyak teks di ponsel), harga & paket, cara kerja, demo, proyek klien,
// FAQ (dengan ajakan WhatsApp khusus layanan), bacaan terkait & layanan lain. Ajakan penutup umum ada di footer, jadi
// halaman ini tidak memasang pita ajakan sendiri di ujungnya.
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
  const waHref = wa(p.ctaWa(t.name))

  // Kartu paket milik layanan ini (string siap tampil, sama persis dengan halaman Paket).
  const { cards, labels } = cardsFor(lang, (slug) => s.packages.includes(slug))
  const ordered = s.packages.map((slug) => cards.find((c) => c.slug === slug)!).filter(Boolean)
  const single = ordered.length === 1

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
              ...offerPrice(raw),
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
      <PageHero tight eyebrow={t.name} title={<HlText parts={t.h1} mode="italic" tone="primary" />} lead={t.lead}>
        {/* Ringkasan sekilas: empat ubin (ponsel 2×2), lalu ajakan. Angka dari lib/packages.ts & lib/site.ts. */}
        {from && (
          <dl className="grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {[
              { icon: Tag, label: getPages(lang).services.from, value: from.price },
              { icon: Clock, label: p.colTime, value: keepRange(from.duration) },
              { icon: Wallet, label: p.summary.pay, value: d.pkg.deposit },
              { icon: ShieldCheck, label: p.summary.guarantee, value: p.summary.guaranteeValue },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-[color:var(--surface-soft)] px-3.5 py-3 ring-1 ring-[color:var(--border-light)] sm:px-4">
                <dt className="flex items-center gap-1.5 text-[0.8125rem] text-[color:var(--text-tertiary)]">
                  <Icon size={14} className="shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1 text-[1rem] font-semibold leading-snug text-[color:var(--text-primary)] sm:text-[1.0625rem]">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-5 sm:mt-6">
          {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
          <span className="sr-only">{d.common.newTabShort}</span>
        </a>
      </PageHero>

      {/* Untuk siapa (daftar centang yang mudah dipindai) + penjelasan panjang yang dilipat (tetap di HTML) */}
      <section className="section-b pt-10 sm:pt-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="kicker text-[color:var(--primary-700)]">{p.forWho}</h2>
            <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {t.forWho.map((w) => (
                <li key={w} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-[color:var(--text-secondary)]">
                  <Check size={16} strokeWidth={2.4} className="mt-[0.15em] shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <details className="group/intro self-start rounded-[1.25rem] bg-[color:var(--surface-soft)] px-5 ring-1 ring-[color:var(--border-light)] lg:col-span-5">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[0.9375rem] font-semibold text-[color:var(--primary-700)] hover:text-[color:var(--primary-800)] [&::-webkit-details-marker]:hidden">
              {p.readIntro(t.name)}
              <ChevronDown size={16} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-open/intro:rotate-180" aria-hidden="true" />
            </summary>
            <div className="space-y-3 pb-5 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)] sm:text-[1rem]">
              {t.intro.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* Harga & paket. Satu paket: kartu selebar halaman (tanpa tabel yang mengulang angka yang sama). Dua paket atau
          lebih: tabel ringkas untuk membandingkan (desktop; di ponsel kartunya sudah memuat angka yang sama), lalu kartu. */}
      <section aria-labelledby="pricing-title" className="section-y bg-[color:var(--surface-primary)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{p.colPackage}</p>
            <h2 id="pricing-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">{p.pricing}</h2>
          </div>
          {from ? (
            <>
              {single ? (
                // satu paket: kartu selebar halaman, semua fitur terlihat (di desktop dua kolom di sisi kanan)
                <div className="mt-6 sm:mt-8">
                  <PackageCard p={ordered[0]} labels={labels} as="h3" fold={Infinity} featuresTitle={p.included} solid />
                </div>
              ) : (
                <>
                  <div className="table-wrap mt-8 hidden md:block" role="region" tabIndex={0} aria-label={p.pricingCaption(t.name)}>
                    <table className="w-full text-start">
                      <caption className="sr-only">{p.pricingCaption(t.name)}</caption>
                      <thead>
                        <tr className="kicker border-b border-[color:var(--rule)] text-[color:var(--text-tertiary)]">
                          <th scope="col" className="py-3 pe-4 text-start font-medium">{p.colPackage}</th>
                          <th scope="col" className="px-4 py-3 text-start font-medium">{p.colRange}</th>
                          <th scope="col" className="px-4 py-3 text-start font-medium">{p.colDeposit}</th>
                          <th scope="col" className="py-3 ps-4 text-start font-medium">{p.colTime}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordered.map((pk) => (
                          <tr key={pk.slug} className="border-b border-[color:var(--border-medium)]">
                            <th scope="row" className="py-3.5 pe-4 text-start">
                              <a href={`#${pk.slug}`} className="display text-[1.125rem] font-medium text-[color:var(--text-primary)] underline-offset-4 hover:text-[color:var(--primary-700)] hover:underline focus-visible:-outline-offset-2">{pk.title}</a>
                            </th>
                            <td className="px-4 py-3.5 font-semibold text-[color:var(--text-primary)]">{pk.priceRange}</td>
                            <td className="px-4 py-3.5 text-[color:var(--text-secondary)]">{pk.deposit}</td>
                            <td className="py-3.5 ps-4 text-[color:var(--text-secondary)]">{pk.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <BriefGrid cards={ordered} labels={labels} wide={ordered.length > 2} className="mt-6 md:mt-10" />
                </>
              )}
              <div className="mt-6 flex flex-col gap-x-10 gap-y-3 text-[0.875rem] leading-relaxed text-[color:var(--text-tertiary)] lg:flex-row lg:items-start lg:justify-between">
                <p className="max-w-3xl">
                  {d.pricing.rangeNote}
                  {d.common.priceNote ? ` ${d.common.priceNote}` : ''}
                </p>
                <Link href={path(lang, 'pricing')} className="link inline-flex shrink-0 items-center gap-1.5 self-start text-[0.9375rem] font-semibold">
                  {p.seePricing} <ArrowRight size={15} className="arw" aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-8 max-w-2xl">
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
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-6">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Cara kerja ringkas: daftar bernomor tanpa ikon */}
      <section aria-labelledby="how-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{d.process.eyebrow}</p>
            <h2 id="how-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">{p.process}</h2>
          </div>
          <ol className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:mt-10 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4">
            {d.process.steps.map((st, i) => (
              <li key={st.title} className="border-t border-[color:var(--rule)] pt-4">
                <h3 className="flex items-baseline gap-2.5 text-[1.1875rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.3rem]">
                  <span className="tnum text-[0.9375rem] font-semibold text-[color:var(--primary-700)]" aria-hidden="true">
                    {i + 1}
                  </span>
                  {st.title}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{st.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contoh demo: dua kolom sejak ponsel supaya bagian ini tidak memanjang */}
      {shown.length > 0 && (
        <section aria-labelledby="demos-title" className="section-y bg-[color:var(--surface-primary)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="kicker text-[color:var(--primary-700)]">Demo</p>
              <h2 id="demos-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">{p.demos}</h2>
              <p className="mt-3 max-w-2xl text-[color:var(--text-tertiary)]">{p.demosLead}</p>
              {d.common.demoLangNote && <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">{d.common.demoLangNote}</p>}
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
              {shown.map((dm) => (
                <li key={dm.slug}>
                  <a href={dm.url} target="_blank" rel="noopener noreferrer" className="group block">
                    {/* sizes = lebar kartu: 2 kolom (ponsel & tablet), 3 kolom (lg) */}
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
                        <span className="display block text-[1rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)] sm:text-[1.35rem] sm:leading-tight">{dm.name}</span>
                        <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)] sm:mt-1 sm:text-[0.9375rem]">{dm.tagline}</span>
                      </span>
                      <ArrowUpRight size={17} className="arw-ne mt-1 hidden shrink-0 text-[color:var(--primary-700)] transition-transform sm:block" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{d.common.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            {portals.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-3 border-t border-[color:var(--border-light)] pt-6 sm:mt-12">
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

      {/* FAQ layanan, ditutup ajakan WhatsApp khusus layanan ini */}
      <section aria-labelledby="sfaq-title" className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 id="sfaq-title" className="text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">{p.faq}</h2>
          </div>
          <div className="lg:col-span-9">
            <div className="border-t border-[color:var(--rule)]">
              {t.faq.map((f) => (
                <details key={f.q} className="group border-b border-[color:var(--border-light)]">
                  <summary className="flex cursor-pointer list-none items-start gap-6 py-4 text-start sm:py-5 [&::-webkit-details-marker]:hidden">
                    <h3 className="flex-1 text-[1.0625rem] leading-snug text-[color:var(--text-primary)] group-open:text-[color:var(--primary-700)] sm:text-[1.1875rem]">{f.q}</h3>
                    <span aria-hidden="true" className="relative mt-2.5 h-3 w-3 shrink-0 text-[color:var(--text-tertiary)] transition-transform duration-300 group-open:rotate-45 group-open:text-[color:var(--primary-700)]">
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pe-10 leading-relaxed text-[color:var(--text-secondary)]">{f.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-[1.25rem] bg-[color:var(--primary-50)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
              <div className="min-w-0">
                <h2 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.3rem]">{p.ctaTitle(t.name)}</h2>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{p.ctaLead}</p>
              </div>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid shrink-0">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bacaan terkait + layanan lain */}
      <section className="section-b">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          {related.length > 0 && (
            <div className="lg:col-span-6">
              <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{p.readArticles}</h2>
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
          <div className={related.length > 0 ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-6'}>
            <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{p.other}</h2>
            <ul>
              {others.map((o) => (
                <li key={o.key} className="border-b border-[color:var(--border-light)]">
                  <Link href={pathOf(lang, { key: 'services', service: o.key })} className="group flex items-center justify-between gap-3 py-3 text-[0.9375rem] text-[color:var(--text-secondary)] hover:text-[color:var(--primary-700)] sm:py-3.5">
                    {serviceText(o, lang).name} <ArrowRight size={15} aria-hidden="true" className="arw shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
