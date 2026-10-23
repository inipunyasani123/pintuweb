import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Github,
  House,
  Images,
  Link2,
  ListChecks,
  Mail,
  MailOpen,
  MapPin,
  Megaphone,
  MessageCircle,
  PenTool,
  QrCode,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import ArticleCard from '../../components/ArticleCard'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { Logo } from '../../components/Logo'
import { articlesIn } from '../../content/articles'
import { DEMOS, DEMO_CATEGORIES, type DemoCategory } from '../../lib/demos'
import { CATEGORY_COLOR, KIND_ORDER, portalOf } from '../../lib/portals'
import { EMAIL, FOUNDED_YEAR, GITHUB, WA_DISPLAY, wa, FOUNDER_NAME } from '../../lib/site'
import { facts } from '../../i18n/facts'
import { getDict, getPages, isLang, type Lang } from '../../i18n'
import { path, urlOf } from '../../i18n/routes'
import { FOUNDER_ID, ORG_ID, pageGraph, pageMeta } from '../../i18n/seo'

type Params = { params: Promise<{ lang: string }> }

const NAME = FOUNDER_NAME

// "Yang saya kerjakan" = jenis website yang dikerjakan PintuWeb (keputusan pemilik 22 Okt 2026: daftar keahlian &
// teknologi pribadi tidak dipublikasikan lagi). Ikon tiap jenis; enam yang pertama sama dengan ikon pemilih kebutuhan
// di beranda (AudienceSection). Kalimat "untuk siapa" ada di founder.kinds, nama jenisnya di portfolio.galleries.
const KIND_ICON: Record<DemoCategory, LucideIcon> = {
  landing: Megaphone,
  toko: ShoppingCart,
  linkinbio: Link2,
  undangan: MailOpen,
  portfolio: Images,
  reservasi: CalendarCheck,
  menu: QrCode,
  kontes: PenTool,
  properti: House,
  todo: ListChecks,
  mobile: Smartphone,
}

/**
 * Petak lebar di bento: sekian jenis dengan demo terbanyak, cukup untuk mengisi penuh kisi 3 kolom (mulai 640px).
 * 10 jenis → 2 petak lebar, 11 jenis (sejak aplikasi mobile, 23 Okt 2026) → 1. Bila jumlah jenis ganjil, petak lebar juga
 * dibentang di kisi 2 kolom ponsel supaya baris terakhir tidak bolong.
 */
const WIDE = (3 - (DEMO_CATEGORIES.length % 3)) % 3
const WIDE_PHONE = DEMO_CATEGORIES.length % 2 === 1

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  if (!isLang(lang)) return {}
  const p = getPages(lang).founder
  return pageMeta({ lang, ref: { key: 'founder' }, title: p.title, description: p.description, ogTitle: p.ogTitle, ogDescription: p.ogDescription, type: 'profile' })
}

export default async function OwnerPage({ params }: Params) {
  const lang = (await params).lang as Lang
  const d = getDict(lang)
  const pages = getPages(lang)
  const p = pages.founder
  const f = facts(lang)
  const n = DEMOS.length
  const writing = articlesIn(lang)
  const timeline = p.timeline(n)
  const g = d.portfolio

  // Urutan sama dengan daftar jenis di beranda (KIND_ORDER). Yang punya portal katalog menaut ke portalnya (zona
  // terpisah, isinya berbahasa Indonesia); yang belum menaut ke galeri demo yang tersaring.
  const kinds = DEMO_CATEGORIES.map((c) => c.id)
    .sort((a, b) => KIND_ORDER[a] - KIND_ORDER[b])
    .map((c) => {
      const portal = portalOf(c)
      return {
        id: c,
        title: g.galleries[c].title,
        count: DEMOS.filter((x) => x.category === c).length,
        href: portal ? `/${portal.path}` : `${path(lang, 'demo')}#${c}`,
        portal: !!portal,
        image: portal ? portal.image : `/images/galeri/${c}.jpg`,
        Icon: KIND_ICON[c],
      }
    })
  const wide = new Set([...kinds].sort((a, b) => b.count - a.count).slice(0, WIDE).map((k) => k.id))

  // Tahun berdiri ada di lencana kartu nama; jumlah proyek & demo di linimasa dan tombol demo. Deretan angka di
  // bawah pembuka sudah dihapus karena hanya mengulangnya.
  // Baris kartu nama: kontak dari lib/site.ts
  const card: { icon: LucideIcon; text: string; href?: string; rel?: string }[] = [
    { icon: MapPin, text: f.location },
    { icon: MessageCircle, text: WA_DISPLAY, href: wa(p.ctaWa), rel: 'noopener noreferrer' },
    { icon: Mail, text: EMAIL, href: `mailto:${EMAIL}` },
    // rel="me": profil ini dan akun GitHub itu milik orang yang sama
    ...(GITHUB ? [{ icon: Github, text: GITHUB, href: `https://${GITHUB}`, rel: 'noopener noreferrer me' }] : []),
  ]

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: p.title }]} />

      {/* Perkenalan + kartu nama. overflow-x-clip: kartu kedua yang miring tidak boleh membuat halaman bisa digeser. */}
      <section className="overflow-x-clip">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-x-12 gap-y-12 px-4 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker text-[color:var(--primary-700)]">{p.badge}</p>
            <h1 className="mt-5 text-[2.4rem] leading-[1.06] text-[color:var(--text-primary)] sm:text-[3.25rem] lg:text-[3.75rem]">
              <HlText parts={p.h1} mode="italic" tone="primary" />
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--text-tertiary)] lg:text-[1.2rem]">{p.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={wa(p.ctaWa)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
              <Link href={path(lang, 'demo')} className="btn btn-line">
                {p.ctaDemos(n)} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Kartu nama */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[26rem] lg:ms-auto lg:me-0">
              <span className="absolute inset-0 translate-x-2 translate-y-3 rotate-[4deg] rounded-[1.75rem] [background-image:linear-gradient(145deg,var(--primary-600),var(--primary-900))] sm:translate-x-3" aria-hidden="true" />
              <div className="relative rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgb(15_29_58/0.5)] ring-1 ring-[color:var(--border-light)] sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <Logo />
                  <span className="rounded-full bg-[color:var(--primary-50)] px-3 py-1 text-[0.8125rem] font-semibold text-[color:var(--primary-700)]">
                    {pages.about.stats.since} {FOUNDED_YEAR}
                  </span>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <span
                    role="img"
                    aria-label={p.monogram}
                    className="display grid h-16 w-16 shrink-0 select-none place-items-center rounded-2xl text-[2.25rem] font-semibold leading-none text-white [background-image:linear-gradient(145deg,var(--primary-600),var(--primary-900))]"
                  >
                    {NAME[0]}
                  </span>
                  {/* nama + jabatan satu paragraf (dua baris): bukan judul bagian, jadi tidak dibuat <p> bergaya judul */}
                  <p className="min-w-0">
                    <span className="display block text-[1.625rem] font-semibold leading-tight tracking-tight text-[color:var(--text-primary)]">{NAME}</span>
                    <span className="block text-[0.9375rem] text-[color:var(--text-tertiary)]">{p.jobTitle}</span>
                  </p>
                </div>
                <ul className="mt-6 border-t border-[color:var(--border-light)] pt-2">
                  {card.map((r) => {
                    const inner = (
                      <>
                        <r.icon size={17} strokeWidth={1.75} className="shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate"><bdi>{r.text}</bdi></span>
                      </>
                    )
                    return (
                      <li key={r.text}>
                        {r.href ? (
                          <a
                            href={r.href}
                            {...(r.rel ? { target: '_blank', rel: r.rel } : {})}
                            className="group -mx-2 flex min-h-11 items-center gap-3 rounded-xl px-2 text-[0.9375rem] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--primary-700)]"
                          >
                            {inner}
                            {r.rel && <span className="sr-only">{d.common.newTabShort}</span>}
                            <ArrowUpRight size={15} className="shrink-0 text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--primary-700)]" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="flex min-h-11 items-center gap-3 text-[0.9375rem] text-[color:var(--text-secondary)]">{inner}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perjalanan: rel tegak di ponsel, mendatar mulai 768px */}
      <section aria-labelledby="journey-title" className="mt-16 bg-[color:var(--surface-soft)] py-16 sm:mt-24 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="journey-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
            {p.journeyTitle}
          </h2>
          {/* satu kolom per tahap mulai 768px (kini dua tahap); rel mendatar tiap tahap menjangkau celah gap-x-8 sampai titik berikutnya */}
          <ol className={`mt-10 grid grid-cols-1 gap-y-9 md:gap-x-8 ${timeline.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
            {timeline.map((t, i) => (
              <li key={t.year} className="relative ps-8 md:ps-0 md:pt-9">
                <span className="absolute start-0 top-[0.3125rem] h-3 w-3 rounded-full bg-[color:var(--primary-700)] ring-4 ring-[color:var(--primary-100)] md:top-0" aria-hidden="true" />
                {i < timeline.length - 1 && (
                  <span
                    className="absolute -bottom-9 start-[0.3125rem] top-6 w-0.5 rounded-full bg-[color:var(--primary-200)] md:-end-8 md:bottom-auto md:start-6 md:top-[0.3125rem] md:h-0.5 md:w-auto"
                    aria-hidden="true"
                  />
                )}
                <p className="text-[0.875rem] font-semibold text-[color:var(--primary-700)]">{t.year}</p>
                <h3 className="mt-1 text-[1.3125rem] leading-snug text-[color:var(--text-primary)]">{t.title}</h3>
                <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Yang saya kerjakan (bento jenis website) + prinsip kerja */}
      <section aria-labelledby="kinds-title" className="section-y">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="kinds-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
              {p.kindsTitle}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[color:var(--text-tertiary)]">{p.kindsLead}</p>
            {/* Ponsel: 2 kolom seragam. Mulai 640px: 3 kolom, dan jenis dengan demo terbanyak mendapat petak lebar
                bergambar pratinjau portalnya. grid-flow-row-dense menjaga kisi tetap penuh bila jumlah demo berubah. */}
            <ul className="mt-7 grid grid-flow-row-dense grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {kinds.map((k) => {
                const isWide = wide.has(k.id)
                const c = CATEGORY_COLOR[k.id]
                const cls =
                  'group flex h-full gap-4 rounded-[1.25rem] bg-[color:var(--surface-soft)] p-4 ring-1 ring-transparent transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_16px_32px_-24px_rgb(15_29_58/0.45)] hover:ring-[color:var(--primary-200)] sm:p-5'
                const body = (
                  <>
                    {/* Urutan DOM = urutan baca (nama, untuk siapa, jumlah demo); kisi area memindahkan jumlah demo ke
                        pojok atas secara visual, sejajar ikon berwarna khas jenisnya (CATEGORY_COLOR, sama dengan beranda). */}
                    <span className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] content-start gap-x-2 [grid-template-areas:'icon_count''title_title''for_for']">
                      <span className="grid h-9 w-9 place-items-center rounded-xl [grid-area:icon]" style={{ backgroundColor: c.tint, color: c.color }} aria-hidden="true">
                        <k.Icon size={18} strokeWidth={1.75} />
                      </span>{' '}
                      <span className="mt-3.5 text-[0.9375rem] font-semibold leading-snug text-[color:var(--text-primary)] [grid-area:title] break-words hyphens-auto sm:mt-4 sm:text-[1rem]">
                        {k.title}
                      </span>{' '}
                      <span className="mt-1 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)] [grid-area:for]">{p.kinds[k.id]}</span>{' '}
                      <span className="justify-self-end text-end leading-none [grid-area:count]">
                        <bdi className="display block text-[1.625rem] font-semibold leading-none tracking-tight text-[color:var(--text-primary)]">{k.count}</bdi>{' '}
                        {/* panah "buka" ikut satuan jumlah demo, bukan di belakang nama jenis: di 360px nama panjang
                            (mis. "Бронирование", "ব্যক্তিগত পোর্টফোলিও") membuat panah itu turun baris sendirian */}
                        <span className="mt-1 flex items-center justify-end gap-0.5 text-[0.75rem] leading-tight text-[color:var(--text-tertiary)]">
                          {g.unit[k.id]}
                          <ArrowUpRight size={13} className="arw-ne shrink-0 text-[color:var(--text-muted)] transition-[color,transform] duration-200 group-hover:text-[color:var(--primary-700)]" aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                    {/* petak lebar: pratinjau portal (hiasan) di sisi akhir */}
                    {isWide && (
                      <span className="relative hidden w-[44%] shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-[color:var(--border-light)] sm:block" aria-hidden="true">
                        <Image src={k.image} alt="" fill sizes="200px" className="object-cover object-top" />
                        <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundImage: `linear-gradient(90deg, ${c.color}, ${c.to})` }} />
                      </span>
                    )}
                  </>
                )
                return (
                  <li key={k.id} className={isWide ? (WIDE_PHONE ? 'col-span-2' : 'sm:col-span-2') : ''}>
                    {k.portal ? (
                      <a href={k.href} hrefLang="id" className={cls}>
                        {body}
                      </a>
                    ) : (
                      <Link href={k.href} className={cls}>
                        {body}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
            {g.galleryLang && <p className="mt-4 text-sm text-[color:var(--text-tertiary)]">{g.galleryLang}</p>}
          </div>
          {/* Prinsip kerja: pernyataan cara kerja dari fakta situs (harga, persetujuan desain, garansi), BUKAN kutipan
              Arya. Teksnya sama dengan kartu "Di balik PintuWeb" di halaman Tentang. Mulai 1024px kartunya menempel
              (sticky) di samping bento yang lebih tinggi, bukan direntang menjadi balok biru yang setengahnya kosong. */}
          <section aria-labelledby="principles-title" className="flex flex-col gap-7 rounded-[1.75rem] p-7 text-white [background-image:linear-gradient(150deg,var(--primary-700),var(--primary-900))] sm:p-9 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <h2 id="principles-title" className="kicker text-[color:var(--accent-200)]">
              {p.principlesTitle}
            </h2>
            <ul className="divide-y divide-white/15">
              {p.principles.map((x) => (
                <li key={x} className="display py-4 text-[1.3125rem] font-semibold leading-snug tracking-tight first:pt-0 last:pb-0 sm:text-[1.5rem]">
                  {x}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      {/* Tulisan — sinyal keahlian (E-E-A-T). Artikel hanya ada dalam sebagian bahasa. */}
      {writing.length > 0 && (
        <section aria-labelledby="writing-title" className="bg-[color:var(--surface-soft)] section-y">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="writing-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
                {p.writing}
              </h2>
              <Link href={path(lang, 'articles')} className="btn btn-line btn-sm self-start sm:self-auto">
                {pages.articles.all} <ArrowRight size={15} className="arw" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {writing.slice(0, 3).map((a) => (
                <li key={a.key}>
                  <ArticleCard lang={lang} a={a} read={pages.articles.read(a.minutes)} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Ajakan */}
      <section className={writing.length > 0 ? 'section-y' : 'pb-16 sm:pb-24'}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-7 rounded-[2rem] p-7 ring-1 ring-[color:var(--border-light)] sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-2xl">
              <h2 className="text-[1.75rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.25rem]">{p.ctaTitle}</h2>
              <p className="mt-3 leading-relaxed text-[color:var(--text-tertiary)]">{p.ctaLead}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={wa(p.ctaWa)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
              <Link href={path(lang, 'about')} className="btn btn-line">
                {pages.about.ogTitle} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd
        data={pageGraph({
          lang,
          ref: { key: 'founder' },
          name: p.title,
          description: p.description,
          type: 'ProfilePage',
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: p.title, url: urlOf(lang, { key: 'founder' }) },
          ],
          extra: [
            {
              '@type': 'Person',
              '@id': FOUNDER_ID,
              name: NAME,
              jobTitle: p.jobTitle,
              worksFor: { '@id': ORG_ID },
              // jenis website yang dikerjakan (bagian "Yang saya kerjakan"), bukan daftar keahlian pribadi
              knowsAbout: kinds.map((k) => k.title),
              ...(GITHUB ? { sameAs: [`https://${GITHUB}`] } : {}),
            },
          ],
        })}
      />
    </main>
  )
}
