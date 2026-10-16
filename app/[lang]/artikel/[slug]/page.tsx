import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import ArticleCard, { ArticleCover, coverVars } from '../../../components/ArticleCard'
import ArticleToc from '../../../components/ArticleToc'
import { Breadcrumbs, JsonLd } from '../../../components/Bits'
import CopyLink from '../../../components/CopyLink'
import { articleImage } from '../../../content/article-covers'
import { articlesIn, getArticle } from '../../../content/articles'
import { faqJsonLd } from '../../../content/faq'
import { ARTICLE_LANGS } from '../../../i18n/config'
import { ARTICLE_SLUGS, articleKeyBySlug } from '../../../i18n/slugs'
import { getDict, getPages, isLang, LANG_INFO, type Lang } from '../../../i18n'
import { langsOf, path, pathOf, urlOf } from '../../../i18n/routes'
import { FOUNDER_PERSON, ORG_ID, ogImage, pageGraph, pageMeta } from '../../../i18n/seo'
import { FOUNDED_YEAR, SITE, wa } from '../../../lib/site'

type Params = { params: Promise<{ lang: string; slug: string }> }

export const dynamicParams = false
export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return []
  // Bahasa tanpa artikel tetap diberi daftar (hasilnya 404 saat dirender) — daftar kosong untuk satu
  // bahasa membuat Next tidak membangun artikel bahasa lain sama sekali.
  const lang = ARTICLE_LANGS.includes(params.lang) ? params.lang : ARTICLE_LANGS[0]
  return Object.values(ARTICLE_SLUGS)
    .map((s) => (s as Partial<Record<Lang, string>>)[lang])
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }))
}

function resolve(lang: string, slug: string) {
  if (!isLang(lang) || !ARTICLE_LANGS.includes(lang)) return null
  const key = articleKeyBySlug(lang, slug)
  return key ? getArticle(lang, key) : null
}

const fmtDate = (lang: Lang, iso: string) =>
  new Intl.DateTimeFormat(LANG_INFO[lang].intl, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params
  const a = resolve(lang, slug)
  if (!a) return {}
  return pageMeta({
    lang: a.lang,
    ref: { key: 'articles', article: a.key },
    title: a.seoTitle ?? a.title,
    ogTitle: a.title,
    description: a.description,
    type: 'article',
    published: a.date,
    modified: a.updated,
  })
}

const PILL = 'inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.8125rem] font-semibold text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]'

export default async function ArticlePage({ params }: Params) {
  const { lang: rawLang, slug } = await params
  const a = resolve(rawLang, slug)
  if (!a) notFound()
  const lang = a.lang
  const d = getDict(lang)
  const p = getPages(lang).articles
  const ref = { key: 'articles' as const, article: a.key }
  const url = urlOf(lang, ref)
  const others = langsOf(ref).filter((l) => l !== lang)
  const related = articlesIn(lang).filter((x) => x.key !== a.key).slice(0, 3)
  const cover = coverVars(a.key)
  const coverImg = articleImage(a.key)

  const posting = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: a.title,
    description: a.description,
    image: coverImg ? [ogImage(lang, { key: 'articles', article: a.key }), `${SITE}${coverImg}`] : ogImage(lang, { key: 'articles', article: a.key }),
    datePublished: a.date,
    dateModified: a.updated,
    inLanguage: LANG_INFO[lang].htmlLang,
    author: FOUNDER_PERSON,
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    wordCount: a.words,
    timeRequired: `PT${a.minutes}M`,
    keywords: a.tags.join(', '),
    abstract: a.takeaways.join(' '),
    ...(a.sources.length ? { citation: a.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })) } : {}),
    ...(others.length ? { workTranslation: others.map((l) => ({ '@type': 'BlogPosting', url: urlOf(l, ref), inLanguage: LANG_INFO[l].htmlLang })) } : {}),
  }

  return (
    // .read-scope/.read-subject/.read-progress: garis kemajuan membaca di puncak layar (globals.css, tanpa JS)
    <main id="main-content" className="read-scope">
      <div className="read-progress" aria-hidden="true" />
      <Breadcrumbs
        label={d.common.breadcrumb}
        items={[{ name: d.common.home, href: path(lang, 'home') }, { name: p.eyebrow, href: path(lang, 'articles') }, { name: a.title }]}
      />

      <article className="read-subject pb-16 pt-8 sm:pt-10">
        <header className="mx-auto max-w-6xl px-4 sm:px-6" style={cover.vars}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-8">
              {/* topik artikel: teks kecil biasa, dipisah titik tengah (bukan pil) */}
              <p className="kicker text-[color:var(--k)]">{a.tags.join(' · ')}</p>
              <h1 className="mt-5 text-[2.1rem] leading-[1.1] text-[color:var(--text-primary)] sm:text-[2.75rem] lg:text-[3.1rem]">{a.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[color:var(--text-tertiary)] lg:text-[1.2rem]">{a.description}</p>
            </div>
            {/* Sampul yang sama dengan kartu artikel di daftar. Gambar tampil di semua ukuran layar; sampul tipografi hanya di desktop. */}
            <div className={coverImg ? 'lg:col-span-4' : 'hidden lg:col-span-4 lg:block'}>
              <ArticleCover k={a.key} size="lg" priority sizes="(min-width: 1024px) 380px, 100vw" className="aspect-[16/9] rounded-[1.25rem] ring-1 ring-[color:var(--border-light)] sm:rounded-[1.75rem] lg:aspect-[4/3]" />
            </div>
          </div>

          {/* Penulis, tanggal, dan bagikan */}
          <div className="mt-8 flex flex-col gap-4 rounded-[1.25rem] bg-[color:var(--surface-soft)] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[color:var(--navy)] text-base font-semibold text-white" aria-hidden="true">
                S
              </span>
              <div className="min-w-0 leading-snug">
                <p className="text-[0.9375rem] text-[color:var(--text-primary)]">
                  {p.by}{' '}
                  <Link href={path(lang, 'founder')} rel="author" className="py-1 font-semibold underline decoration-[color:var(--primary-300)] underline-offset-4 hover:decoration-[color:var(--primary-700)]">
                    Arya
                  </Link>
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-[color:var(--text-tertiary)]">
                  {p.published} <time dateTime={a.date}>{fmtDate(lang, a.date)}</time>
                  {a.updated !== a.date && (
                    <>
                      {' · '}
                      {p.updated} <time dateTime={a.updated}>{fmtDate(lang, a.updated)}</time>
                    </>
                  )}
                  {' · '}
                  {p.read(a.minutes)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="me-1 text-[0.8125rem] text-[color:var(--text-tertiary)]">{p.share}</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(`${a.title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`${p.shareWa} ${d.common.newTabShort}`} className={PILL}>
                WhatsApp <ArrowUpRight size={14} className="arw-ne transition-transform" aria-hidden="true" />
              </a>
              <CopyLink label={p.copy} done={p.copied} />
            </div>
          </div>

          {others.length > 0 && (
            <p className="mt-3 px-1 text-[0.8125rem] text-[color:var(--text-tertiary)]">
              {p.alsoIn}{' '}
              {others.map((l, i) => (
                <span key={l}>
                  {i > 0 && ', '}
                  <a href={pathOf(l, ref)} hrefLang={LANG_INFO[l].hreflang} lang={LANG_INFO[l].htmlLang} className="py-1 font-semibold text-[color:var(--primary-700)] underline underline-offset-4">
                    {LANG_INFO[l].name}
                  </a>
                </span>
              ))}
            </p>
          )}
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-x-10 px-4 sm:px-6 lg:mt-12 lg:grid-cols-12">
          {/* Kolom tepi: daftar isi (desktop menempel dan menandai bagian aktif; ponsel berupa lipatan) */}
          <div className="lg:col-span-3">{a.toc.length > 2 && <ArticleToc items={a.toc} title={p.toc} />}</div>

          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            {/* Ringkasan di awal — mudah dibaca manusia & dikutip mesin jawaban */}
            {a.takeaways.length > 0 && (
              <aside aria-labelledby="takeaways-title" className="rounded-[1.5rem] bg-[color:var(--primary-50)] p-6 ring-1 ring-[color:var(--primary-100)] sm:p-7">
                <h2 id="takeaways-title" className="kicker text-[color:var(--primary-700)]">{p.takeaways}</h2>
                <ul className="mt-4 space-y-3">
                  {a.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed text-[color:var(--text-secondary)]">
                      <Check size={18} strokeWidth={2.4} className="mt-[0.3em] shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="prose-article mt-10" dangerouslySetInnerHTML={{ __html: a.html }} />

            {a.sources.length > 0 && (
              <section aria-labelledby="sources-title" className="mt-12 rounded-[1.5rem] bg-[color:var(--surface-soft)] p-6 sm:p-7">
                <h2 id="sources-title" className="kicker text-[color:var(--text-primary)]">{p.sources}</h2>
                <ol className="mt-4 list-decimal space-y-2 ps-5 text-[0.9375rem] text-[color:var(--text-secondary)] marker:text-[color:var(--text-tertiary)]">
                  {a.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--primary-700)] underline underline-offset-2 [overflow-wrap:anywhere]">
                        {s.title}
                        <span className="sr-only"> {d.common.newTabShort}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Penulis */}
            <div className="mt-6 flex items-center gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:p-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[color:var(--navy)] text-xl font-semibold text-white" aria-hidden="true">
                S
              </span>
              <div className="min-w-0">
                {/* nama + peran satu paragraf (bukan <p> bergaya judul yang disusul <p> lain) */}
                <p>
                  <span className="display block text-[1.125rem] font-semibold leading-snug text-[color:var(--text-primary)]">Arya</span>
                  <span className="mt-0.5 block text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{p.authorRole(FOUNDED_YEAR)}</span>
                </p>
                {/* py-1 + margin negatif: bidang sentuh tautan teks kecil >= 24px (WCAG 2.5.8) tanpa menggeser tata letak */}
                <Link href={path(lang, 'founder')} className="-mb-1 mt-1 inline-flex items-center gap-1.5 py-1 text-[0.8125rem] font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline">
                  {p.authorLink} <ArrowRight size={14} className="arw" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Ajakan */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-[color:var(--primary-700)] p-8 text-white [background-image:linear-gradient(135deg,var(--primary-700),var(--primary-900))] sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div className="max-w-2xl">
            <h2 className="text-[1.75rem] leading-[1.12] sm:text-[2.25rem]">{p.ctaTitle}</h2>
            <p className="mt-3 leading-relaxed text-white/85">{p.ctaLead}</p>
          </div>
          <a href={wa(p.ctaWa(a.title))} target="_blank" rel="noopener noreferrer" className="btn btn-white shrink-0">
            {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
            <span className="sr-only">{d.common.newTabShort}</span>
          </a>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16 bg-[color:var(--surface-soft)] py-14 sm:mt-20 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-[1.5rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.875rem]">{p.related}</h2>
              <Link href={path(lang, 'articles')} className="-my-1 inline-flex shrink-0 items-center gap-1.5 py-1 text-sm font-semibold text-[color:var(--primary-700)]">
                {p.all} <ArrowRight size={15} className="arw" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {related.map((r) => (
                <li key={r.key} className="last:sm:max-lg:hidden">
                  <ArticleCard lang={lang} a={r} read={p.read(r.minutes)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {a.faq.length > 0 && <JsonLd data={faqJsonLd(a.faq, LANG_INFO[lang].htmlLang)} />}
      <JsonLd
        data={pageGraph({
          lang,
          ref,
          name: a.title,
          description: a.description,
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: p.eyebrow, url: urlOf(lang, { key: 'articles' }) },
            { name: a.title, url },
          ],
          dates: { published: a.date, modified: a.updated },
          extra: [posting],
        })}
      />
    </main>
  )
}
