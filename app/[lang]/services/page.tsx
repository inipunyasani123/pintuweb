import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PageHero from '../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { SERVICES, serviceText } from '../../content/services'
import { keepRange, serviceFrom } from '../../content/service-utils'
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

      {/* Indeks layanan: nomor · nama · ringkasan · harga mulai & lama pengerjaan (terbaca, dekat tautan detailnya) */}
      <section aria-label={p.listAria} className="section-b pt-8 sm:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ol className="border-t border-[color:var(--rule)]">
            {SERVICES.map((s, i) => {
              const from = serviceFrom(lang, s)
              const href = pathOf(lang, { key: 'services', service: s.key })
              return (
                <li key={s.key} className="border-b border-[color:var(--border-medium)]">
                  {/* ponsel & tablet kecil: bertumpuk; md ke atas: kolom nama · ringkasan · harga (kolom harga cukup lebar
                      untuk "À partir de IDR 1 250 000") */}
                  <Link href={href} className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 py-5 md:grid-cols-12 md:items-baseline md:gap-x-8 md:py-7">
                    <span className="flex items-baseline gap-3 md:col-span-5">
                      <span className="mono tnum text-xs text-[color:var(--primary-700)]" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-[1.375rem] leading-tight text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)] sm:text-[1.6rem] md:text-[1.85rem]">{serviceText(s, lang).name}</h2>
                    </span>
                    <ArrowRight size={17} className="arw mt-1.5 shrink-0 text-[color:var(--primary-700)] md:hidden" aria-hidden="true" />
                    <span className="col-span-2 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] md:col-span-4">{serviceText(s, lang).short}</span>
                    <span className="col-span-2 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)] md:col-span-3 md:text-end">
                      {from ? (
                        <>
                          {from.quote ? '' : `${p.from} `}<span className="whitespace-nowrap font-semibold text-[color:var(--text-primary)]">{from.price}</span>
                          <span aria-hidden="true" className="md:hidden">
                            {' · '}
                          </span>
                          {/* boleh patah (mis. "1–4 minggu, tergantung fitur" di kolom sempit), tapi tidak di tengah rentangnya */}
                          <span className="md:mt-0.5 md:block">{keepRange(from.duration)}</span>
                        </>
                      ) : (
                        p.priceOnRequest
                      )}
                      <span className="mt-2 hidden items-center gap-1 text-sm font-semibold text-[color:var(--primary-700)] md:flex md:justify-end">
                        {p.seeDetail} <ArrowRight size={15} className="arw" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
          <p className="mt-6">
            <Link href={path(lang, 'pricing')} className="link inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold">
              {p.seePackages} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          </p>

          {/* Selalu termasuk */}
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-5 sm:mt-14 lg:grid-cols-12">
            <h2 className="kicker text-[color:var(--text-primary)] lg:col-span-3">{p.includedTitle}</h2>
            {p.included.map((i) => (
              <div key={i.title} className="border-t border-[color:var(--border-medium)] pt-4 lg:col-span-4">
                <h3 className="text-[1.25rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.4rem]">{i.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabel perbandingan, mudah dikutip mesin pencari & asisten AI. Hanya tablet & desktop: di ponsel tabel empat
          kolom harus digeser menyamping, padahal daftar di atas sudah memuat nama, harga mulai, dan lama pengerjaan. */}
      <section aria-labelledby="compare-title" className="section-y hidden bg-[color:var(--surface-primary)] md:block">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{p.colPrice}</p>
            <h2 id="compare-title" className="mt-3 text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">
              <HlText parts={p.compareTitle} />
            </h2>
          </div>
          {/* nama wilayah gulir = keterangan tabel, bukan judul bagian (dua landmark tidak boleh bernama sama) */}
          <div className="table-wrap mt-8" role="region" tabIndex={0} aria-label={p.compareCaption}>
            <table className="w-full text-start">
              <caption className="sr-only">{p.compareCaption}</caption>
              <thead>
                <tr className="kicker border-b border-[color:var(--rule)] text-[color:var(--text-tertiary)]">
                  <th scope="col" className="py-3 pe-4 text-start font-medium">{p.colService}</th>
                  <th scope="col" className="px-4 py-3 text-start font-medium">{p.colFor}</th>
                  <th scope="col" className="px-4 py-3 text-start font-medium">{p.colPrice}</th>
                  <th scope="col" className="py-3 ps-4 text-start font-medium">{p.colTime}</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => {
                  const from = serviceFrom(lang, s)
                  return (
                    <tr key={s.key} className="border-b border-[color:var(--border-medium)]">
                      <th scope="row" className="py-4 pe-4 text-start font-medium">
                        {/* cincin fokus ke dalam: wadah tabel (overflow-x) memotong cincin yang keluar dari tautan */}
                        <Link href={pathOf(lang, { key: 'services', service: s.key })} className="display text-[1.2rem] text-[color:var(--text-primary)] underline-offset-4 hover:text-[color:var(--primary-700)] hover:underline focus-visible:-outline-offset-2">{serviceText(s, lang).name}</Link>
                      </th>
                      <td className="px-4 py-4 text-[0.9375rem] text-[color:var(--text-secondary)]">{serviceText(s, lang).suits}</td>
                      <td className="px-4 py-4 font-semibold text-[color:var(--text-primary)]">{from ? from.price : '—'}</td>
                      <td className="py-4 ps-4 text-[0.9375rem] text-[color:var(--text-secondary)]">{from ? from.duration : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {d.common.priceNote && <p className="mt-4 text-xs text-[color:var(--text-tertiary)]">{d.common.priceNote}</p>}
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
