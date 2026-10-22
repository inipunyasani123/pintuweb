import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarClock, Check, Gauge, Github, LifeBuoy, ReceiptText, type LucideIcon } from 'lucide-react'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { ClientCases } from '../../components/ClientProjects'
import OpenOnHash from '../../components/OpenOnHash'
import { DEMOS, demoSrcSet, demoThumb } from '../../lib/demos'
import { FOUNDED_YEAR, FOUNDER_NAME, GITHUB } from '../../lib/site'
import { facts, packagesFor } from '../../i18n/facts'
import { getDict, getPages, isLang, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import { FOUNDER_ID, ORG_ID, pageGraph, pageMeta } from '../../i18n/seo'
import type { FaqKey } from '../../content/faq'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const p = getPages(lang).about
  return pageMeta({ lang, ref: { key: 'about' }, title: p.title, description: p.description, ogTitle: p.ogTitle, ogDescription: p.ogDescription(DEMOS.length) })
}

// "Tembok karya" di pembuka: tangkapan layar demo asli (public/demos), tiga kolom dari jenis website yang
// berbeda-beda. Murni hiasan (aria-hidden); daftar lengkapnya ada di galeri demo.
const WALL = [
  ['cissycoffee', 'nimbus', 'jajan', 'propertia', 'skywings', 'wedding'],
  ['lumora', 'restoran', 'absorber-segar', 'homigo', 'bioskop', 'atlas'],
  ['hotel', 'celeste', 'milo', 'woodora', 'eduplay', 'kanban-board'],
]

// Sejajar dengan about.why di kamus: ikon, dan pertanyaan FAQ tempat hal itu tertulis.
const WHY: { icon: LucideIcon; faq: FaqKey }[] = [
  { icon: Gauge, faq: 'kecepatan' },
  { icon: CalendarClock, faq: 'lama-pengerjaan' },
  { icon: ReceiptText, faq: 'pembayaran' },
  { icon: LifeBuoy, faq: 'garansi' },
]

export default async function AboutPage({ params }: Params) {
  const lang = (await params).lang as Lang
  const d = getDict(lang)
  const pages = getPages(lang)
  const p = pages.about
  const pf = pages.founder
  const f = facts(lang)
  const pk = packagesFor(lang)
  const landing = pk.find((x) => x.slug === 'landing-page')!.duration
  const business = pk.find((x) => x.slug === 'standar-umkm')!.duration
  const n = DEMOS.length
  // "Tertulis di FAQ": teks yang sama dengan kupon janji di beranda
  const inFaq = d.why.promises[1].proof

  // Angka-angka (proyek klien, jumlah demo, tahun berdiri, jumlah kategori) cukup di judul, cerita, dan linimasa;
  // deretan kartu angka di bawah pembuka sudah dihapus karena hanya mengulangnya.
  const timeline = p.timeline(n)
  const [vision, ...beliefs] = p.beliefs(n)

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: p.eyebrow }]} />

      {/* Pembuka: perkenalan + tembok karya */}
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 items-center gap-x-10 gap-y-9 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-[color:var(--primary-700)]">{p.eyebrow}</p>
            <h1 className="mt-5 text-[2.4rem] leading-[1.06] text-[color:var(--text-primary)] sm:text-[3.25rem]">
              <HlText parts={p.h1} mode="italic" tone="primary" />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--text-tertiary)] lg:text-[1.2rem]">{p.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={path(lang, 'demo')} className="btn btn-solid">
                {p.ctaDemos(n)} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
              <Link href={path(lang, 'founder')} className="btn btn-line">
                {d.links.founder} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div
            className="grid h-[15rem] grid-cols-2 gap-2.5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] sm:h-[22rem] sm:grid-cols-3 sm:gap-3 lg:col-span-7 lg:h-[30rem]"
            aria-hidden="true"
          >
            {WALL.map((col, ci) => (
              // ponsel: dua kolom saja, supaya tiap tangkapan layar masih terbaca
              <div key={col[0]} className={`wall-col flex flex-col gap-2.5 sm:gap-3 ${ci === 1 ? 'wall-col-rev' : ''} ${ci === 2 ? 'hidden sm:flex' : ''}`}>
                {col.map((slug) => (
                  <span key={slug} className="relative block aspect-[720/378] shrink-0 overflow-hidden rounded-xl bg-[color:var(--surface-soft)] ring-1 ring-[color:var(--border-light)] sm:rounded-2xl">
                    {/* Thumbnail demo yang sudah diperkecil (360/480/720w, lib/demos.ts), seperti galeri demo: tanpa optimizer
                        Next, srcset 3 kandidat (bukan 8, yang di atas 720w hanya menghasilkan berkas yang sama). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={demoThumb(slug)}
                      srcSet={demoSrcSet(slug)}
                      sizes="(min-width: 1024px) 200px, (min-width: 640px) 31vw, 46vw"
                      alt=""
                      width={720}
                      height={378}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cerita + linimasa */}
      <section aria-labelledby="story-title" className="mt-14 bg-[color:var(--surface-soft)] section-y sm:mt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-x-12 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="story-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
              {p.storyTitle}
            </h2>
            <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-[color:var(--text-secondary)]">
              {p.story(n).map((s, i) => (
                <p key={s} className={i === 0 ? 'text-[1.25rem] font-medium leading-snug text-[color:var(--text-primary)] sm:text-[1.375rem]' : undefined}>
                  {s}
                </p>
              ))}
            </div>
          </div>
          <ol className="rounded-[1.5rem] bg-white p-6 ring-1 ring-[color:var(--border-light)] sm:p-8 lg:col-span-6">
            {timeline.map((t, i) => (
              <li key={t.year} className="relative grid grid-cols-[0.75rem_1fr] gap-x-5 pb-8 last:pb-0">
                {/* rel linimasa: titik per tahap, garis sampai tahap berikutnya */}
                {i < timeline.length - 1 && <span className="absolute bottom-0 start-[0.3125rem] top-5 w-0.5 rounded-full bg-[color:var(--primary-100)]" aria-hidden="true" />}
                <span className="relative mt-[0.4375rem] h-3 w-3 rounded-full bg-[color:var(--primary-700)] ring-4 ring-[color:var(--primary-100)]" aria-hidden="true" />
                <div>
                  <p className="text-[0.875rem] font-semibold text-[color:var(--primary-700)]">{t.year}</p>
                  <h3 className="mt-1 text-[1.25rem] leading-snug text-[color:var(--text-primary)]">{t.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proyek klien (content/clients.ts): bukti untuk "proyek klien" yang disebut cerita di atas. Beranda dan halaman
          layanan menaut ke #proyek-klien dan ke kartu tiap proyek (#klien-<kunci>). */}
      <ClientCases lang={lang} />
      <OpenOnHash />

      {/* Orang di baliknya */}
      <section aria-labelledby="founder-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-x-12 gap-y-8 rounded-[2rem] bg-[color:var(--surface-soft)] p-6 sm:p-10 lg:grid-cols-12 lg:p-12">
            <div className="lg:col-span-3">
              <div
                role="img"
                aria-label={pf.monogram}
                className="grid aspect-square w-20 place-items-center rounded-[1.25rem] text-white [background-image:linear-gradient(145deg,var(--primary-600),var(--primary-900))] sm:w-32 sm:rounded-[1.75rem] lg:w-full lg:rounded-[2.25rem]"
              >
                <span className="display select-none text-[2.75rem] font-semibold leading-none sm:text-[4.5rem] lg:text-[7.5rem]">{[...FOUNDER_NAME][0]}</span>
              </div>
            </div>
            <div className="lg:col-span-9">
              <h2 id="founder-title" className="kicker text-[color:var(--primary-700)]">
                {p.founderTitle}
              </h2>
              {/* Nama + peran, lalu prinsip kerja (teks yang sama dengan halaman Founder). Sengaja BUKAN kutipan:
                  kalimat yang ditampilkan atas nama orang sungguhan tidak boleh dikarang. */}
              <h3 className="display mt-4 text-[1.75rem] font-semibold leading-tight tracking-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">{FOUNDER_NAME}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] sm:text-[1.0625rem]">{pages.articles.authorRole(FOUNDED_YEAR)}</p>
              <h4 id="about-principles" className="kicker mt-7 text-[color:var(--text-secondary)]">
                {pf.principlesTitle}
              </h4>
              <ul aria-labelledby="about-principles" className="mt-2 max-w-2xl divide-y divide-[color:var(--border-light)] border-y border-[color:var(--border-light)]">
                {pf.principles.map((x) => (
                  <li key={x} className="py-3 text-[1.0625rem] font-medium leading-snug text-[color:var(--text-primary)]">
                    {x}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={pf.skillsTitle}>
                {pf.skills.map((s) => (
                  <li key={s} className="rounded-full bg-white px-3 py-1 text-[0.8125rem] font-medium text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)]">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href={path(lang, 'founder')} className="btn btn-solid btn-sm">
                  {d.links.founder} <ArrowRight size={15} className="arw" aria-hidden="true" />
                </Link>
                {GITHUB && (
                  <a href={`https://${GITHUB}`} target="_blank" rel="noopener noreferrer" className="btn btn-line btn-sm">
                    <Github size={15} aria-hidden="true" /> GitHub <span className="sr-only">{d.common.newTabShort}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi, misi, fokus + nilai */}
      <section aria-labelledby="belief-title" className="bg-[color:var(--surface-soft)] section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="belief-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
            <HlText parts={p.beliefTitle} />
          </h2>
          <div className="mt-9 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
            {/* Visi: satu pernyataan besar */}
            <div className="flex flex-col justify-between gap-10 rounded-[1.75rem] p-7 text-white [background-image:linear-gradient(150deg,var(--primary-700),var(--primary-900))] sm:p-9 lg:col-span-5">
              <h3 className="kicker text-[color:var(--accent-200)]">{vision.title}</h3>
              <p className="display text-[1.5rem] font-semibold leading-snug tracking-tight sm:text-[1.75rem] lg:text-[2rem]">{vision.body}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:col-span-7 lg:gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                {beliefs.map((b) => (
                  <div key={b.title} className="rounded-[1.25rem] bg-white p-6 ring-1 ring-[color:var(--border-light)]">
                    <h3 className="kicker text-[color:var(--primary-700)]">{b.title}</h3>
                    <p className="mt-3 text-[1.0625rem] leading-relaxed text-[color:var(--text-primary)]">{b.body}</p>
                  </div>
                ))}
              </div>
              <ul className="divide-y divide-[color:var(--border-light)] rounded-[1.25rem] bg-white ring-1 ring-[color:var(--border-light)]">
                {p.values.map((v) => (
                  <li key={v.title} className="flex gap-4 px-6 py-4 sm:py-5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--primary-50)] text-[color:var(--primary-700)]" aria-hidden="true">
                      <Check size={15} strokeWidth={2.5} />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] font-semibold leading-snug text-[color:var(--text-primary)]">{v.title}</h3>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{v.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mengapa */}
      <section aria-labelledby="why-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="why-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
            {p.whyTitle}
          </h2>
          <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {p.why(landing, business, f.response).map((w, i) => {
              const Icon = WHY[i].icon
              return (
                // ponsel: ikon di samping teks (lebih ringkas); mulai 640px ikon di atas. Ikon polos, tanpa ubin.
                <li key={w.title} className="flex gap-3.5 rounded-[1.25rem] bg-[color:var(--surface-soft)] p-5 sm:flex-col sm:gap-3 sm:p-6">
                  <Icon size={22} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[color:var(--primary-700)] sm:mt-0" aria-hidden="true" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)]">{w.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{w.body}</p>
                    {/* tiap alasan menunjuk ke pertanyaan FAQ tempat hal itu tertulis */}
                    <Link href={`${path(lang, 'faq')}#${WHY[i].faq}`} className="mt-auto inline-flex items-center gap-1.5 self-start pt-3 text-[0.8125rem] font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline sm:pt-4">
                      {inFaq} <ArrowRight size={14} className="arw" aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
          {/* Ajakan penutup halaman ini sudah dihapus: isinya (obrolan WhatsApp gratis, lokasi, jam kerja, waktu balas)
              sama persis dengan ajakan & kontak di footer yang langsung menyusul. */}
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'about' },
          name: p.title,
          description: p.description,
          type: 'AboutPage',
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: p.eyebrow, url: urlOf(lang, { key: 'about' }) },
          ],
          extra: [{ '@id': ORG_ID, founder: { '@id': FOUNDER_ID } }],
        })}
      />
    </main>
  )
}
