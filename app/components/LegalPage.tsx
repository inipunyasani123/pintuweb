import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import ArticleToc from './ArticleToc'
import PageHero from './PageHero'
import { Breadcrumbs, JsonLd } from './Bits'
import { LEGAL_UPDATED, LEGAL_UPDATED_ISO, privacyDoc, termsDoc } from '../content/legal'
import { GUARANTEE_DAYS } from '../lib/site'
import { getDict, getPages } from '../i18n'
import { path, urlOf } from '../i18n/routes'
import { pageGraph } from '../i18n/seo'
import { isBase, type Lang } from '../i18n/config'

/**
 * Tampilan dokumen legal (Kebijakan Privasi, Syarat & Ketentuan): daftar isi yang menempel dan menandai pasal
 * yang sedang dibaca, ringkasan singkat, lalu pasal bernomor di satu "lembar". Isi dokumennya ada di
 * content/legal.tsx dan tidak diubah di sini; tiap pasal punya jangkar sendiri (mis. /syarat-ketentuan#garansi).
 */
export default function LegalPage({ lang, which }: { lang: Lang; which: 'privacy' | 'terms' }) {
  // dokumen legal hanya ada dalam bahasa dasar; bahasa lain menaut ke versi Inggris
  if (!isBase(lang)) notFound()
  const d = getDict(lang)
  const pages = getPages(lang)
  const p = pages.legal
  const privacy = which === 'privacy'
  const title = privacy ? p.privacyTitle : p.termsTitle
  const description = privacy ? p.privacyDescription : p.termsDescription
  const doc = privacy ? privacyDoc(lang) : termsDoc(lang)
  const points = privacy ? p.privacyPoints : p.termsPoints(GUARANTEE_DAYS)
  const docs = [
    { key: 'privacy' as const, name: p.privacyTitle },
    { key: 'terms' as const, name: p.termsTitle },
  ]

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: title }]} />
      <PageHero tight eyebrow={p.eyebrow} title={title} lead={description} aside={p.since(LEGAL_UPDATED[lang])}>
        {/* Pindah antara dua dokumen legal */}
        <nav aria-label={p.docsNav} className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {docs.map((x) => {
              const on = x.key === which
              return (
                <li key={x.key}>
                  <Link
                    href={path(lang, x.key)}
                    aria-current={on ? 'page' : undefined}
                    className={`inline-flex min-h-10 items-center rounded-full px-4 text-[0.9375rem] transition-colors ${
                      on
                        ? 'bg-[color:var(--primary-700)] font-semibold text-white'
                        : 'bg-[color:var(--surface-soft)] text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]'
                    }`}
                  >
                    {x.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </PageHero>

      <section className="mt-12 bg-[color:var(--surface-soft)] py-12 sm:mt-16 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <ArticleToc items={doc.sections.map((s) => ({ id: s.id, text: s.title }))} title={pages.articles.toc} />
          </div>

          <article className="rounded-[1.5rem] bg-white ring-1 ring-[color:var(--border-light)] lg:col-span-8">
            <div className="p-6 sm:p-9">
              <div className="legal sm:text-[1.125rem]">{doc.intro}</div>

              <section aria-labelledby="ringkasan" className="mt-7 rounded-[1.25rem] bg-[color:var(--primary-50)] p-5 sm:p-6">
                <h2 id="ringkasan" className="kicker text-[color:var(--primary-700)]">
                  {p.summaryTitle}
                </h2>
                <ul className="mt-3.5 grid gap-x-7 gap-y-3 sm:grid-cols-2">
                  {points.map((pt) => (
                    <li key={pt.text} className="flex gap-2.5 text-[0.9375rem] leading-snug text-[color:var(--text-primary)]">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[color:var(--primary-700)]" aria-hidden="true">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {/* <a> biasa: jangkar di halaman yang sama, supaya :target ikut menyala */}
                      {pt.to ? (
                        <a href={`#${pt.to}`} className="underline decoration-[color:var(--primary-300)] underline-offset-4 transition-colors hover:text-[color:var(--primary-700)] hover:decoration-current">
                          {pt.text}
                        </a>
                      ) : (
                        <span>{pt.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.8125rem] leading-relaxed text-[color:var(--text-tertiary)]">{p.summaryNote}</p>
              </section>
            </div>

            <div className="divide-y divide-[color:var(--border-light)] border-t border-[color:var(--border-light)]">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`pasal-${s.id}`} className="group scroll-mt-4 px-6 py-7 sm:grid sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-x-5 sm:px-9 sm:py-9">
                  {/* nomor pasal; menyala saat pasalnya dituju lewat tautan (#jangkar) */}
                  <span
                    className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-[color:var(--primary-50)] text-[0.9375rem] font-semibold text-[color:var(--primary-700)] transition-colors group-target:bg-[color:var(--primary-700)] group-target:text-white sm:mb-0 sm:h-10 sm:w-10"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h2 id={`pasal-${s.id}`} className="text-[1.375rem] leading-tight text-[color:var(--text-primary)] sm:pt-1 sm:text-[1.5rem]">
                      <span className="sr-only">{i + 1}. </span>
                      {s.title}
                    </h2>
                    <div className="legal mt-3">{s.body}</div>
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: which },
          name: title,
          description,
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: title, url: urlOf(lang, { key: which }) },
          ],
          dates: { modified: LEGAL_UPDATED_ISO },
        })}
      />
    </main>
  )
}
