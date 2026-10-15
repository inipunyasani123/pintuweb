import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { SERVICES, serviceText } from '../../content/services'
import { serviceFrom } from '../../content/service-utils'
import { getDict, getPages, isLang, type Lang } from '../../i18n'
import { hasPage, path, pathOf, urlOf } from '../../i18n/routes'
import { ORG_ID, pageGraph, pageMeta } from '../../i18n/seo'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang) || !hasPage(lang, 'services')) return {}
  const p = getPages(lang).services
  return pageMeta({ lang, ref: { key: 'services' }, title: p.title, description: p.description, ogTitle: p.ogTitle, ogDescription: p.ogDescription })
}

export default async function ServicesPage({ params }: Params) {
  const lang = (await params).lang as Lang
  // bahasa yang halaman layanannya belum diterjemahkan: 404 (tautannya sudah diarahkan ke versi Inggris)
  if (!hasPage(lang, 'services')) notFound()
  const d = getDict(lang)
  const p = getPages(lang).services

  const jsonLd = {
    '@type': 'Service',
    '@id': `${urlOf(lang, { key: 'services' })}#service`,
    serviceType: p.title,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    url: urlOf(lang, { key: 'services' }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: p.ogTitle,
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        url: urlOf(lang, { key: 'services', service: s.key }),
        itemOffered: { '@type': 'Service', name: serviceText(s, lang).name, description: serviceText(s, lang).short },
      })),
    },
  }

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: p.eyebrow }]} />
      <PageHero tight eyebrow={p.eyebrow} title={<HlText parts={p.h1} mode="italic" tone="primary" />} lead={p.lead} />

      {/* Indeks layanan: nomor · nama · ringkasan · harga mulai */}
      <section aria-label={p.listAria} className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ol>
            {SERVICES.map((s, i) => {
              const from = serviceFrom(lang, s)
              const href = pathOf(lang, { key: 'services', service: s.key })
              return (
                <li key={s.key} className="border-b border-[color:var(--border-medium)]">
                  <Link href={href} className="group grid grid-cols-1 gap-x-8 gap-y-2 py-7 sm:grid-cols-12 sm:items-baseline">
                    <span className="mono text-xs text-[color:var(--primary-700)] sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="text-[1.6rem] leading-tight text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)] sm:col-span-5 sm:text-[1.85rem]">{serviceText(s, lang).name}</h2>
                    <span className="text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] sm:col-span-4">{serviceText(s, lang).short}</span>
                    <span className="flex items-baseline justify-between gap-3 sm:col-span-2 sm:flex-col sm:items-end sm:gap-1">
                      <span className="mono text-xs text-[color:var(--text-secondary)] sm:text-right">
                        {from ? (
                          <>
                            {p.from} <span className="text-[color:var(--text-primary)]">{from.price}</span>
                          </>
                        ) : (
                          p.priceOnRequest
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--primary-700)]">
                        {p.seeDetail} <ArrowRight size={15} className="arw" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>

          {/* Selalu termasuk */}
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
            <h2 className="kicker text-[color:var(--text-primary)] lg:col-span-3">{p.includedTitle}</h2>
            {p.included.map((i, n) => (
              <div key={i.title} className="border-t border-[color:var(--border-medium)] pt-5 lg:col-span-4">
                <p className="mono text-xs text-[color:var(--primary-700)]">{String(n + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-[1.4rem] leading-snug text-[color:var(--text-primary)]">{i.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabel perbandingan — mudah dikutip mesin pencari & asisten AI */}
      <section aria-labelledby="compare-title" className="bg-[color:var(--surface-primary)] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{p.colPrice}</p>
            <h2 id="compare-title" className="mt-3 text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">
              <HlText parts={p.compareTitle} />
            </h2>
          </div>
          {/* nama wilayah gulir = keterangan tabel, bukan judul bagian (dua landmark tidak boleh bernama sama) */}
          <div className="table-wrap mt-10" role="region" tabIndex={0} aria-label={p.compareCaption}>
            <table className="w-full min-w-[40rem] text-left">
              <caption className="sr-only">{p.compareCaption}</caption>
              <thead>
                <tr className="kicker border-b border-[color:var(--rule)] text-[color:var(--text-tertiary)]">
                  <th scope="col" className="py-3 pr-4 font-medium">{p.colService}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{p.colFor}</th>
                  <th scope="col" className="px-4 py-3 font-medium">{p.colPrice}</th>
                  <th scope="col" className="py-3 pl-4 font-medium">{p.colTime}</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => {
                  const from = serviceFrom(lang, s)
                  return (
                    <tr key={s.key} className="border-b border-[color:var(--border-medium)]">
                      <th scope="row" className="py-4 pr-4 font-medium">
                        <Link href={pathOf(lang, { key: 'services', service: s.key })} className="display text-[1.2rem] text-[color:var(--text-primary)] underline-offset-4 hover:text-[color:var(--primary-700)] hover:underline">{serviceText(s, lang).name}</Link>
                      </th>
                      <td className="px-4 py-4 text-[0.9375rem] text-[color:var(--text-secondary)]">{serviceText(s, lang).suits}</td>
                      <td className="px-4 py-4 font-semibold text-[color:var(--text-primary)]">{from ? from.price : '—'}</td>
                      <td className="py-4 pl-4 text-[0.9375rem] text-[color:var(--text-secondary)]">{from ? from.duration : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {d.common.priceNote && <p className="mt-4 text-xs text-[color:var(--text-tertiary)]">{d.common.priceNote}</p>}
          <p className="mt-8">
            <Link href={path(lang, 'pricing')} className="link inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold">
              {p.seePackages} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {/* Tanpa pita ajakan sendiri: ajakan penutup footer yang langsung menyusul membawa pesan & tombol yang sama
          (konsultasi WhatsApp gratis). */}
      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'services' },
          name: p.title,
          description: p.description,
          type: 'CollectionPage',
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: p.eyebrow, url: urlOf(lang, { key: 'services' }) },
          ],
          extra: [jsonLd],
        })}
      />
    </main>
  )
}
