// Indeks "Website untuk usahamu": daftar 8 jenis usaha (id/en). Bahasa lain notFound().
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { BIZ, BIZ_LANGS, bizText, bizUi } from '../../content/business'
import { CITIES, cityText } from '../../content/cities'
import { packagesFor } from '../../i18n/facts'
import { getDict, isLang, LANG_INFO, type Lang } from '../../i18n'
import { hasPage, path, pathOf, urlOf } from '../../i18n/routes'
import { pageGraph, pageMeta } from '../../i18n/seo'
import { CATEGORY_COLOR } from '../../lib/portals'
import { wa } from '../../lib/site'

type Params = { params: Promise<{ lang: string }> }

function resolve(raw: string): Lang | null {
  return isLang(raw) && BIZ_LANGS.includes(raw) && hasPage(raw, 'business') ? raw : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const lang = resolve((await params).lang)
  if (!lang) return {}
  const u = bizUi(lang)
  return pageMeta({ lang, ref: { key: 'business' }, title: u.indexTitle, description: u.indexDescription })
}

export default async function BizIndex({ params }: Params) {
  const lang = resolve((await params).lang)
  if (!lang) notFound()
  const u = bizUi(lang)
  const d = getDict(lang)
  const pk = packagesFor(lang)
  const ref = { key: 'business' as const }
  const url = urlOf(lang, ref)

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: u.indexCrumb }]} />

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <p className="kicker text-[color:var(--primary-700)]">{u.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.125rem,1.45rem+2.9vw,3.5rem)] leading-[1.07] text-[color:var(--text-primary)] sm:mt-5">
          <HlText parts={u.indexH1} mode="italic" tone="primary" />
        </h1>
        <p className="mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-[color:var(--text-secondary)]">{u.indexLead}</p>
      </section>

      <section aria-label={u.indexCrumb} className="mx-auto mt-10 max-w-6xl px-4 sm:mt-14 sm:px-6">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {BIZ.map((b) => {
            const t = bizText(b, lang)
            const c = CATEGORY_COLOR[b.tone]
            const p = pk.find((x) => x.slug === b.pkgs[0])!
            return (
              <li key={b.key}>
                <Link href={pathOf(lang, { key: 'business', biz: b.key })} className="group flex h-full flex-col rounded-[1.5rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] transition-shadow hover:ring-[color:var(--primary-300)] sm:p-6">
                  <span className="h-1 w-10 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
                  <h2 className="mt-4 text-[1.25rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)]">{t.name}</h2>
                  <p className="mb-5 mt-2 leading-relaxed text-[color:var(--text-secondary)]">{t.blurb}</p>
                  <p className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--border-light)] pt-4 text-[0.875rem] text-[color:var(--text-tertiary)]">
                    <span>
                      {d.common.from} <span className="font-semibold text-[color:var(--text-primary)]">{p.priceFrom}</span>
                    </span>
                    <ArrowRight size={16} className="arw text-[color:var(--primary-700)]" aria-hidden="true" />
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 px-4 sm:mt-16 sm:px-6 lg:grid-cols-2">
        <div className="rounded-[1.25rem] bg-[color:var(--primary-50)] p-5 sm:p-6">
          <h2 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.3rem]">{u.indexMissingTitle}</h2>
          <p className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{u.indexMissingBody}</p>
          <a href={wa(lang === 'en' ? 'Hello PintuWeb, my business is not in your list and I would like some advice on a website.' : 'Halo PintuWeb, jenis usaha saya tidak ada di daftar dan saya ingin minta saran soal website.')} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-4">
            {u.consult} <MessageCircle size={17} aria-hidden="true" />
            <span className="sr-only">{d.common.newTabShort}</span>
          </a>
        </div>
        <div className="rounded-[1.25rem] bg-[color:var(--surface-soft)] p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
          <h2 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.3rem]">{u.indexCityTitle}</h2>
          <ul className="mt-2">
            {[...CITIES.map((c) => ({ label: cityText(c, lang).ogTitle, href: pathOf(lang, { key: c.page }) })), { label: lang === 'en' ? 'Tulungagung web design' : 'Jasa Website Tulungagung', href: path(lang, 'local') }].map((l) => (
              <li key={l.href} className="border-b border-[color:var(--border-light)] last:border-0">
                <Link href={l.href} className="group flex items-center justify-between gap-3 py-3 text-[0.9375rem] text-[color:var(--text-secondary)] hover:text-[color:var(--primary-700)]">
                  {l.label} <ArrowRight size={15} aria-hidden="true" className="arw shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref,
          name: u.indexTitle,
          description: u.indexDescription,
          type: 'CollectionPage',
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: u.indexCrumb, url },
          ],
          extra: [
            {
              '@type': 'ItemList',
              name: u.indexTitle,
              numberOfItems: BIZ.length,
              itemListElement: BIZ.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: bizText(b, lang).title, url: urlOf(lang, { key: 'business', biz: b.key }) })),
            },
          ],
        })}
      />
      <div className="h-16" aria-hidden="true" />
    </main>
  )
}
