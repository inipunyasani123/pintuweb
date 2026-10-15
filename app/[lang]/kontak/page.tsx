import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, MessageCircle, type LucideIcon } from 'lucide-react'
import ContactForm, { type ContactPackage, type ContactText } from './ContactForm'
import PageHero from '../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { faqFor, type FaqKey } from '../../content/faq'
import { facts, packagesFor } from '../../i18n/facts'
import { demosFor, getDict, getPages, isLang, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import { ORG_ID, pageGraph, pageMeta } from '../../i18n/seo'
import { EMAIL, WA_DISPLAY, WA_NUMBER } from '../../lib/site'

type Params = { params: Promise<{ lang: string }> }

// Pertanyaan yang paling sering perlu dijawab sebelum menghubungi; tautannya membuka kartunya di halaman FAQ.
const BEFORE: FaqKey[] = ['biaya', 'lama-pengerjaan', 'pembayaran', 'persiapan']

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const p = getPages(lang).contact
  return pageMeta({ lang, ref: { key: 'contact' }, title: p.title, description: p.description, ogTitle: p.ogTitle, ogDescription: p.ogDescription })
}

export default async function KontakPage({ params }: Params) {
  const lang = (await params).lang as Lang
  const d = getDict(lang)
  const p = getPages(lang).contact
  const f = facts(lang)
  // Semua isi p.contact berupa string, jadi aman dikirim ke komponen klien.
  const t: ContactText = p
  const packages: ContactPackage[] = packagesFor(lang).map((x) => ({ slug: x.slug, title: x.title, from: x.priceFrom, duration: x.duration, href: `${path(lang, 'pricing')}#${x.slug}` }))
  // beberapa demo memakai nama yang sama (konsep kontes untuk satu merek): cukup satu saran per nama
  const all = demosFor(lang)
  const demos = Array.from(new Set(all.map((x) => x.name)))
  // ?demo=<slug> dari situs demo -> nama demo dalam bahasa halaman; nama bersama diberi taglinenya (mis. "Positive Crave (Konsep Noir)")
  const shared = new Set(all.filter((x, i) => all.findIndex((y) => y.name === x.name) !== i).map((x) => x.name))
  const demoBySlug = Object.fromEntries(all.map((x) => [x.slug, shared.has(x.name) ? `${x.name} (${x.tagline})` : x.name]))
  const faq = faqFor(lang).items
  const before = BEFORE.map((k) => faq.find((q) => q.key === k)!)

  const direct: { icon: LucideIcon; label: string; value: string; sub?: string; href?: string; external?: boolean }[] = [
    { icon: MessageCircle, label: p.infoWa, value: WA_DISPLAY, sub: f.response, href: `https://wa.me/${WA_NUMBER}`, external: true },
    { icon: Mail, label: p.infoEmail, value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, label: p.infoLocation, value: f.location, sub: f.serves },
    { icon: Clock, label: p.infoHours, value: f.hoursDays, sub: f.hoursTime },
  ]

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: d.nav.contact }]} />
      <PageHero tight eyebrow={p.badge} title={<HlText parts={p.h1} mode="italic" tone="primary" />} lead={p.lead}>
        {/* Hubungi langsung. Ponsel: satu kartu berbaris (alamat email tidak muat di dua kolom); mulai 640px: kartu terpisah. */}
        <ul
          aria-label={p.infoAria}
          className="mt-4 divide-y divide-[color:var(--border-light)] overflow-hidden rounded-[1.25rem] bg-[color:var(--surface-soft)] sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:bg-transparent lg:grid-cols-4"
        >
          {direct.map((c) => {
            const inner = (
              <>
                {/* ikon polos (tanpa ubin): penanda jenis kontak */}
                <c.icon size={21} strokeWidth={1.75} className="shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.8125rem] text-[color:var(--text-tertiary)]">{c.label}</span>
                  <span className="mt-0.5 block break-words text-[1.0625rem] font-semibold leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--primary-700)]"><bdi>{c.value}</bdi></span>
                  {c.sub && <span className="mt-0.5 block text-[0.875rem] leading-snug text-[color:var(--text-tertiary)]">{c.sub}</span>}
                </span>
                {c.href && <ArrowUpRight size={16} className="shrink-0 self-center text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--primary-700)] sm:absolute sm:end-5 sm:top-5 sm:self-auto" aria-hidden="true" />}
              </>
            )
            const box = 'relative flex h-full items-center gap-4 p-4 sm:flex-col sm:items-start sm:rounded-[1.25rem] sm:bg-[color:var(--surface-soft)] sm:p-5'
            return (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    // ponsel: kartu-kartu ini satu blok ber-overflow-hidden, jadi cincin fokusnya digambar di DALAM
                    // (offset negatif, sudut membulat) supaya tidak terpotong tepi kartu
                    className={`group ${box} ring-inset ring-transparent transition-[background-color,box-shadow] duration-200 hover:bg-white max-sm:rounded-[1.25rem] max-sm:focus-visible:-outline-offset-2 sm:ring-1 sm:hover:ring-[color:var(--primary-300)]`}
                  >
                    {inner}
                    {c.external && <span className="sr-only">{d.common.newTabShort}</span>}
                  </a>
                ) : (
                  <div className={box}>{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </PageHero>

      <ContactForm
        t={t}
        packages={packages}
        demos={demos}
        demoBySlug={demoBySlug}
        waNumber={WA_NUMBER}
        email={EMAIL}
        hours={`${f.hoursDays} · ${f.hoursTime}`}
        fromLabel={d.common.from}
        seePackage={d.links.pricing}
        newTab={d.common.newTabShort}
      />

      {/* Sebelum bertanya: empat jawaban yang paling sering dicari */}
      <section aria-labelledby="before-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="before-title" className="text-[1.75rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.25rem]">
              {p.faqTitle}
            </h2>
            <Link href={path(lang, 'faq')} className="btn btn-line btn-sm self-start sm:self-auto">
              {d.faqUi.allN(faq.length)} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {before.map((q) => (
              <li key={q.key}>
                <Link
                  href={`${path(lang, 'faq')}#${q.key}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-[1.25rem] bg-[color:var(--surface-soft)] px-5 py-4 ring-1 ring-inset ring-transparent transition-[background-color,box-shadow] duration-200 hover:bg-white hover:ring-[color:var(--primary-300)] sm:px-6 sm:py-5"
                >
                  <span className="text-[1.0625rem] leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--primary-700)]">{q.question}</span>
                  <ArrowRight size={17} className="arw shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'contact' },
          name: p.pageName,
          description: p.description,
          type: 'ContactPage',
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: d.nav.contact, url: urlOf(lang, { key: 'contact' }) },
          ],
          extra: [{ '@id': ORG_ID }],
        })}
      />
    </main>
  )
}
