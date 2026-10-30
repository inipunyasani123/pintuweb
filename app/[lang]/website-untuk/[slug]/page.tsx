// Halaman "Website untuk <jenis usaha>" (id/en). Isi di content/business.ts; bahasa lain notFound(), tetapi
// generateStaticParams tetap mengembalikan slug (daftar kosong untuk satu bahasa menghapus halaman di SEMUA bahasa).
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { Breadcrumbs, HlText, JsonLd } from '../../../components/Bits'
import { DemoCard, FaqList, H2, WaCta } from '../../../components/BizBits'
import { articlesIn } from '../../../content/articles'
import { BIZ, BIZ_LANGS, bizText, bizUi } from '../../../content/business'
import { faqJsonLd } from '../../../content/faq'
import { packagesFor } from '../../../i18n/facts'
import { BIZ_KEYS, BIZ_SLUGS, bizKeyBySlug } from '../../../i18n/slugs'
import { demosFor, getDict, getPages, isLang, LANG_INFO, type Lang } from '../../../i18n'
import { hasPage, path, pathOf, urlOf } from '../../../i18n/routes'
import { ORG_ID, localAreaServed, pageGraph, pageMeta } from '../../../i18n/seo'
import { CATEGORY_COLOR, portalOf } from '../../../lib/portals'
import { wa } from '../../../lib/site'

type Params = { params: Promise<{ lang: string; slug: string }> }

export const dynamicParams = false
export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return []
  const lang = BIZ_LANGS.includes(params.lang) ? params.lang : BIZ_LANGS[0]
  return BIZ_KEYS.map((k) => ({ slug: (BIZ_SLUGS[k] as Partial<Record<Lang, string>>)[lang] as string }))
}

function resolve(lang: string, slug: string) {
  if (!isLang(lang) || !BIZ_LANGS.includes(lang) || !hasPage(lang, 'business')) return null
  const key = bizKeyBySlug(lang, slug)
  return key ? { lang, biz: BIZ.find((b) => b.key === key)! } : null
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const r = resolve(lang, slug)
  if (!r) return {}
  const t = bizText(r.biz, r.lang)
  return pageMeta({ lang: r.lang, ref: { key: 'business', biz: r.biz.key }, title: t.title, description: t.description })
}

export default async function BizPage({ params }: Params) {
  const { lang: rawLang, slug } = await params
  const r = resolve(rawLang, slug)
  if (!r) notFound()
  const { lang, biz } = r
  const t = bizText(biz, lang)
  const u = bizUi(lang)
  const d = getDict(lang)
  const pk = packagesFor(lang)
  const bySlug = (s: string) => pk.find((p) => p.slug === s)!
  const demos = demosFor(lang)
  const ref = { key: 'business' as const, biz: biz.key }
  const url = urlOf(lang, ref)
  const waHref = wa(t.wa)
  const lead = bySlug(biz.pkgs[0])
  const tone = CATEGORY_COLOR[biz.tone]
  const shown = biz.demos.map((s) => demos.find((x) => x.slug === s)!).filter(Boolean)
  const galleries = [...new Set(shown.map((x) => x.category))].map((c) => portalOf(c)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const related = articlesIn(lang).filter((a) => biz.articles.includes(a.key))
  const others = BIZ.filter((b) => b.key !== biz.key)
  const faq = t.faq.map((x) => ({ question: x.q, answer: x.a }))
  const pa = getPages(lang).articles

  const serviceLd = {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: t.title,
    serviceType: 'Web design and development',
    description: t.description,
    url,
    provider: { '@id': ORG_ID },
    areaServed: localAreaServed(),
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: urlOf(lang, { key: 'contact' }), availableLanguage: LANG_INFO[lang].htmlLang },
  }

  return (
    <main id="main-content">
      <Breadcrumbs
        label={d.common.breadcrumb}
        items={[{ name: d.common.home, href: path(lang, 'home') }, { name: u.indexCrumb, href: path(lang, 'business') }, { name: t.name }]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="kicker text-[color:var(--primary-700)]">{u.eyebrow}</p>
            <h1 className="mt-4 text-[clamp(2.125rem,1.45rem+2.9vw,3.5rem)] leading-[1.07] text-[color:var(--text-primary)] sm:mt-5">
              <HlText parts={t.h1} mode="italic" tone="primary" />
            </h1>
            <p className="mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-[color:var(--text-secondary)] sm:text-[1.1875rem]">{t.problem}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {u.consult} <MessageCircle size={17} aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
              <Link href={path(lang, 'pricing')} className="btn btn-line">
                {u.seePricing} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] p-5 text-white [background-image:linear-gradient(135deg,var(--primary-700),var(--primary-900))] sm:p-6 lg:col-span-5">
            <p className="text-[0.875rem] text-white/80">{u.fromLabel}</p>
            <p className="display tnum mt-1 text-[2.25rem] font-semibold leading-none tracking-[-0.02em] sm:text-[2.75rem]">{lead.priceFrom}</p>
            <p className="mt-2 text-[0.9375rem] text-white/85">
              {lead.title} · {lead.duration}
            </p>
            <p className="mt-4 border-t border-white/20 pt-4 text-[0.9375rem] leading-relaxed text-white/85">{t.pkgWhy[lead.slug]}</p>
          </div>
        </div>
      </section>

      {/* Yang bisa dibuat + yang sering terlewat */}
      <section aria-labelledby="builds-title" className="section-y mt-14 bg-[color:var(--surface-primary)] sm:mt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="kicker text-[color:var(--primary-700)]">{u.buildsKicker}</p>
            <h2 id="builds-title" className={`mt-2 sm:mt-3 ${H2}`}>{u.buildsTitle}</h2>
            <ul className="mt-6 space-y-3">
              {t.builds.map((b) => (
                <li key={b} className="flex gap-3 leading-relaxed text-[color:var(--text-secondary)]">
                  <Check size={18} strokeWidth={2.4} className="mt-[0.3em] shrink-0" style={{ color: tone.color }} aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <p className="kicker text-[color:var(--primary-700)]">{u.tipsKicker}</p>
            <ul className="mt-4 grid grid-cols-1 gap-3">
              {t.tips.map((tip) => (
                <li key={tip.title} className="rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                  <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: tone.color }} aria-hidden="true" />
                  <h3 className="mt-3 text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">{tip.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{tip.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="demos-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{u.demosKicker}</p>
            <h2 id="demos-title" className={`mt-2 sm:mt-3 ${H2}`}>{u.demosTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{u.demosLead}</p>
            {d.common.demoLangNote && <p className="mt-1 text-sm text-[color:var(--text-tertiary)]">{d.common.demoLangNote}</p>}
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:mt-10 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
            {shown.map((dm) => (
              <DemoCard key={dm.slug} demo={dm} why={t.demoWhy[dm.slug]} open={u.demoLabel} newTab={d.common.newTab} />
            ))}
          </ul>
          {galleries.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2 border-t border-[color:var(--border-light)] pt-6 sm:mt-12">
              {galleries.map((g) => (
                <li key={g.path}>
                  <Link href={`/${g.path}`} className="btn btn-line btn-sm">
                    {u.galleryLabel(d.portfolio.galleries[g.category].title)} <ArrowRight size={15} className="arw" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="pkg-title" className="section-y bg-[color:var(--surface-primary)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="kicker text-[color:var(--primary-700)]">{u.pkgKicker}</p>
            <h2 id="pkg-title" className={`mt-2 sm:mt-3 ${H2}`}>{u.pkgTitle}</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)]">{u.pkgLead}</p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {biz.pkgs.map((s) => {
              const p = bySlug(s)
              return (
                <li key={s} className="flex flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
                  <h3 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">
                    <Link href={`${path(lang, 'pricing')}#${p.slug}`} className="hover:text-[color:var(--primary-700)]">{p.title}</Link>
                  </h3>
                  <p className="mb-4 mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)]">{t.pkgWhy[s]}</p>
                  <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-[color:var(--border-light)] pt-4 text-[0.875rem]">
                    <div className="min-w-0">
                      <dt className="text-[color:var(--text-tertiary)]">{u.colPrice}</dt>
                      <dd className="mt-0.5 font-semibold text-[color:var(--text-primary)]">{p.priceFrom}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[color:var(--text-tertiary)]">{u.colTime}</dt>
                      <dd className="mt-0.5 font-semibold text-[color:var(--text-primary)]">{p.duration}</dd>
                    </div>
                  </dl>
                </li>
              )
            })}
          </ul>
          <p className="mt-5 text-[0.875rem] text-[color:var(--text-tertiary)]">{u.pkgNote}</p>
        </div>
      </section>

      <section aria-labelledby="bfaq-title" className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="bfaq-title" className="text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">{u.faqTitle}</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={t.faq} />
            <div className="mt-8">
              <WaCta title={u.ctaTitle} lead={u.ctaLead} label={u.consult} href={waHref} newTab={d.common.newTabShort} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-b">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          {related.length > 0 && (
            <div className="lg:col-span-6">
              <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{pa.related}</h2>
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
            </div>
          )}
          <div className={related.length > 0 ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-6'}>
            <h2 className="kicker border-b border-[color:var(--rule)] pb-3 text-[color:var(--text-primary)]">{u.otherTitle}</h2>
            <ul>
              {others.map((o) => (
                <li key={o.key} className="border-b border-[color:var(--border-light)]">
                  <Link href={pathOf(lang, { key: 'business', biz: o.key })} className="group flex items-center justify-between gap-3 py-3 text-[0.9375rem] text-[color:var(--text-secondary)] hover:text-[color:var(--primary-700)]">
                    {bizText(o, lang).name} <ArrowRight size={15} aria-hidden="true" className="arw shrink-0" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href={path(lang, 'business')} className="link inline-flex items-center gap-1.5 py-3 text-[0.9375rem] font-semibold">
                  {u.seeAll} <ArrowRight size={15} className="arw" aria-hidden="true" />
                </Link>
              </li>
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
            { name: u.indexCrumb, url: urlOf(lang, { key: 'business' }) },
            { name: t.name, url },
          ],
          extra: [serviceLd],
          about: ORG_ID,
          mainEntity: `${url}#service`,
        })}
      />
    </main>
  )
}
