import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Rss } from 'lucide-react'
import ArticleCard from '../../components/ArticleCard'
import PageHero from '../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { articlesIn } from '../../content/articles'
import { ARTICLE_LANGS } from '../../i18n/config'
import { getDict, getPages, isLang, LANG_INFO, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import type { ArticleKey } from '../../i18n/slugs'
import { FOUNDER_PERSON, ORG_ID, pageGraph, pageMeta } from '../../i18n/seo'

type Params = { params: Promise<{ lang: string }> }

/** Dua artikel pembuka ("Mulai dari sini"): biaya dan cara memulai. Ditetapkan lewat kunci supaya sama di semua bahasa. */
const LEAD_KEYS: ArticleKey[] = ['biaya', 'website-umkm']

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang) || !ARTICLE_LANGS.includes(lang)) return {}
  const p = getPages(lang).articles
  return pageMeta({ lang, ref: { key: 'articles' }, title: p.title, description: p.description })
}

export default async function ArticlesPage({ params }: Params) {
  const lang = (await params).lang as Lang
  if (!ARTICLE_LANGS.includes(lang)) notFound()
  const d = getDict(lang)
  const p = getPages(lang).articles
  const list = articlesIn(lang)
  const url = urlOf(lang, { key: 'articles' })
  const lead = LEAD_KEYS.map((k) => list.find((a) => a.key === k)).filter((a): a is (typeof list)[number] => Boolean(a))
  const rest = list.filter((a) => !LEAD_KEYS.includes(a.key))

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: p.eyebrow }]} />
      <PageHero tight eyebrow={p.eyebrow} title={<HlText parts={p.h1} mode="italic" tone="primary" />} lead={p.lead}>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] text-[color:var(--text-tertiary)]">
          <span className="font-semibold text-[color:var(--text-primary)]">{p.count(list.length)}</span>
          <a href={`${path(lang, 'articles')}/rss`} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[color:var(--surface-soft)] px-3.5 text-[0.8125rem] font-semibold text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]">
            <Rss size={14} aria-hidden="true" /> {p.rss}
          </a>
        </p>
      </PageHero>

      <section className="mt-12 bg-[color:var(--surface-soft)] py-14 sm:mt-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="kicker text-[color:var(--primary-700)]">{p.startHere}</h2>
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            {lead.map((a, i) => (
              <li key={a.key}>
                {/* sampul kartu pertama = elemen LCP halaman ini: jangan ditunda (lazy) */}
                <ArticleCard lang={lang} a={a} read={p.read(a.minutes)} variant="lead" priority={i === 0} />
              </li>
            ))}
          </ul>

          {rest.length > 0 && (
            <>
              <h2 className="kicker mt-12 text-[color:var(--primary-700)] sm:mt-16">{p.more}</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                {rest.map((a) => (
                  <li key={a.key}>
                    <ArticleCard lang={lang} a={a} read={p.read(a.minutes)} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'articles' },
          name: p.title,
          description: p.description,
          type: 'CollectionPage',
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: p.eyebrow, url },
          ],
          extra: [
            {
              '@type': 'Blog',
              '@id': `${url}#blog`,
              name: p.title,
              url,
              inLanguage: LANG_INFO[lang].htmlLang,
              publisher: { '@id': ORG_ID },
              blogPost: list.map((a) => ({
                '@type': 'BlogPosting',
                headline: a.title,
                url: urlOf(lang, { key: 'articles', article: a.key }),
                datePublished: a.date,
                dateModified: a.updated,
                author: FOUNDER_PERSON,
              })),
            },
          ],
        })}
      />
    </main>
  )
}
