import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { CLIENTS_ANCHOR, clientAnchor, clientsFor, clientsHref, type ClientProject } from '../content/clients'
import { clientShots } from '../content/client-shots'
import { getDict } from '../i18n'
import type { Lang } from '../i18n/config'
import type { ServiceKey } from '../i18n/slugs'
import CardSlider from './CardSlider'
import ClientArt, { CLIENT_TONE } from './ClientArt'

// Proyek klien (data di content/clients.ts) di tiga tempat: kartu geser di beranda, kartu lengkap di halaman Tentang
// (#proyek-klien, tiap kartu punya jangkar #klien-<kunci>), dan kartu geser kecil di halaman layanan terkait. Ketiganya
// memakai kepala kartu yang sama: ilustrasi jenis usaha (ClientArt, buatan sendiri; BUKAN tangkapan layar klien) +
// label jenis sistem, lalu bidang, nama usaha, dan masalah → solusi versi pendek (`before`/`after`).
// Ini ringkasan proyek, bukan testimoni: tanpa kutipan, bintang, atau angka di luar data pemilik.

/**
 * Geser panah saat tautannya disorot/difokus, untuk panah yang BUKAN anak langsung <a> (aturan `a:hover > .arw` di
 * globals.css hanya mengenai anak langsung). Pakai transform, bukan translate, supaya di RTL ikut terbalik bersama
 * `scale: -1 1` dari kelas .arw.
 */
const SHIFT = '[a:focus-visible_&]:[transform:translateX(3px)] [a:hover_&]:[transform:translateX(3px)]'

/** Pita atas kartu: ilustrasi + label jenis sistem di atas warna lembut khas tiap proyek. */
function Band({ c, small = false }: { c: ClientProject; small?: boolean }) {
  const tone = CLIENT_TONE[c.key]
  return (
    <span
      className={`flex items-end justify-between gap-3 px-5 pb-3 ${small ? 'h-20' : 'h-24 sm:h-28'}`}
      style={{ backgroundColor: tone.tint, backgroundImage: `linear-gradient(135deg, transparent 45%, ${tone.color}1f)`, color: tone.color }}
    >
      <ClientArt k={c.key} className={small ? 'h-12 w-12' : 'h-14 w-14 sm:h-16 sm:w-16'} />
      <span className="mb-1 rounded-full bg-white px-2.5 py-1 text-[0.75rem] font-semibold leading-tight" style={{ color: tone.color }}>
        {c.kind}
      </span>
    </span>
  )
}

/** Masalah (titik kosong) → solusi (titik biru) dalam dua baris pendek, seperti lintasan di kartu lengkap. */
function BeforeAfter({ c, lang }: { c: ClientProject; lang: Lang }) {
  const t = getDict(lang).clients
  return (
    <>
      <span className="relative mt-3 block ps-6 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)] before:absolute before:start-[0.3125rem] before:top-[1.1em] before:h-[calc(100%-0.2em)] before:w-0.5 before:rounded-full before:bg-[color:var(--primary-100)] after:absolute after:start-0 after:top-[0.3em] after:h-3 after:w-3 after:rounded-full after:border-2 after:border-[color:var(--neutral-400)] after:bg-white">
        <span className="sr-only">{t.problem}: </span>
        {c.before}
      </span>
      <span className="relative mt-2 block ps-6 text-[0.9375rem] font-medium leading-snug text-[color:var(--text-primary)] after:absolute after:start-0 after:top-[0.3em] after:h-3 after:w-3 after:rounded-full after:bg-[color:var(--primary-700)] after:ring-4 after:ring-[color:var(--primary-100)]">
        <span className="sr-only">{t.solution}: </span>
        {c.after}
      </span>
    </>
  )
}

/** Kartu bertaut (beranda & halaman layanan): seluruh kartu menuju rinciannya di halaman Tentang. */
function ClientCard({ c, lang }: { c: ClientProject; lang: Lang }) {
  const t = getDict(lang).clients
  return (
    <Link href={clientsHref(lang, c.key)} className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-[color:var(--border-light)] transition-shadow hover:ring-[color:var(--primary-300)]">
      <Band c={c} />
      <span className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <span className="block text-[0.8125rem] font-medium leading-snug text-[color:var(--text-tertiary)]">{c.field}</span>
        <span className="display mt-0.5 block text-[1.25rem] leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--primary-700)]">{c.business}</span>
        <BeforeAfter c={c} lang={lang} />
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.875rem] font-semibold text-[color:var(--primary-700)]">
          {t.more} <ArrowRight size={15} className={`arw ${SHIFT}`} aria-hidden="true" />
        </span>
      </span>
    </Link>
  )
}

/** Lebar kartu dalam deretan geser: ponsel 1 + intipan, tablet 2, desktop 3 per tampilan. */
const SLIDE = 'w-[84%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2.5rem)/3)]'
const TRACK = '-mx-4 gap-3 px-4 scroll-px-4 py-1 sm:-mx-6 sm:gap-4 sm:px-6 sm:scroll-px-6 lg:-mx-1 lg:gap-5 lg:px-1 lg:scroll-px-1'

/**
 * Beranda, sesudah "Karya pilihan": KARTU GESER (keputusan pemilik 22 Okt 2026), tanpa putar otomatis. Rincian tiap
 * proyek ada di halaman Tentang.
 */
export function ClientsHome({ lang }: { lang: Lang }) {
  const t = getDict(lang).clients
  return (
    <section aria-labelledby="clients-title" className="section-b">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-[color:var(--rule)] pt-7 sm:pt-12">
          <div className="flex items-end justify-between gap-10">
            <div className="max-w-2xl">
              <p className="kicker text-[color:var(--primary-700)]">{t.title}</p>
              <h2 id="clients-title" className="mt-2 text-[1.375rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.75rem]">
                {t.lead}
              </h2>
            </div>
            <DetailsLink lang={lang} label={t.details} className="hidden shrink-0 lg:inline" />
          </div>

          <div className="mt-5 sm:mt-8">
            <CardSlider label={t.title} prev={t.prev} next={t.next} listClass={TRACK}>
              {clientsFor(lang).map((c) => (
                <li key={c.key} className={SLIDE}>
                  <ClientCard c={c} lang={lang} />
                </li>
              ))}
            </CardSlider>
          </div>
          <DetailsLink lang={lang} label={t.details} className="mt-4 inline-block lg:hidden" />
        </div>
      </div>
    </section>
  )
}

/**
 * "Lihat masalah & solusi tiap proyek" ke #proyek-klien. Bila teksnya terbungkus, panahnya tetap menempel pada kata
 * terakhir (kata itu + panah tidak dipisah); bahasa tanpa spasi (zh) menempelkan huruf terakhir.
 */
function DetailsLink({ lang, label, className = '' }: { lang: Lang; label: string; className?: string }) {
  const cut = label.lastIndexOf(' ')
  const [head, tail] = cut < 0 ? [label.slice(0, -1), label.slice(-1)] : [label.slice(0, cut + 1), label.slice(cut + 1)]
  return (
    <Link href={clientsHref(lang)} className={`link text-[0.9375rem] font-semibold ${className}`}>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <ArrowRight size={15} className={`arw ms-1.5 inline-block align-[-0.15em] ${SHIFT}`} aria-hidden="true" />
      </span>
    </Link>
  )
}

/**
 * Halaman Tentang: satu kartu per proyek. Yang langsung terlihat sama dengan kartu beranda (+ nama klien); proyeknya,
 * masalah → solusi lengkap, dan "Yang diserahkan" ada di balik "Masalah & solusi lengkap" (<details>, tetap di HTML).
 * Datang lewat #klien-<kunci> membuka kartunya (OpenOnHash di halaman Tentang). "Yang diserahkan" berubah menjadi
 * deretan tangkapan layar begitu berkasnya ada (content/client-shots.ts), selain itu cukup teks.
 */
export function ClientCases({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.clients
  return (
    <section id={CLIENTS_ANCHOR} aria-labelledby="clients-title" className="pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="clients-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
          {t.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)] sm:text-lg">{t.lead}</p>

        <ul className="mt-8 grid grid-cols-1 items-start gap-3 sm:mt-9 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5">
          {clientsFor(lang).map((c) => {
            const id = clientAnchor(c.key)
            const shots = clientShots(c.key, c.docs.length)
            return (
              <li key={c.key} id={id} className="scroll-mt-4 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-[color:var(--border-light)] target:ring-2 target:ring-[color:var(--primary-700)]">
                <Band c={c} small />
                <div className="px-5 pb-2 pt-4">
                  <p className="text-[0.8125rem] font-medium leading-snug text-[color:var(--text-tertiary)]">{c.field}</p>
                  <h3 className="mt-0.5 text-[1.25rem] leading-snug text-[color:var(--text-primary)]">{c.business}</h3>
                  <p className="mt-0.5 text-[0.8125rem] text-[color:var(--text-tertiary)]">{t.client(c.client)}</p>
                  <p className="flex flex-col">
                    <BeforeAfter c={c} lang={lang} />
                  </p>
                </div>

                <details className="group/kasus mx-5 mb-2 border-t border-[color:var(--rule)]">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-[0.875rem] font-semibold text-[color:var(--primary-700)] hover:text-[color:var(--primary-800)] [&::-webkit-details-marker]:hidden">
                    {t.fullStory}
                    <ChevronDown size={15} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-open/kasus:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="pb-4">
                    <p className="text-[1rem] font-medium leading-snug text-[color:var(--text-primary)]">{c.project}</p>
                    {/* Lintasan: titik kosong (masalah) → titik biru (solusi). Titik & garisnya pseudo-elemen, supaya isi <dl> tetap dt/dd saja. */}
                    <dl className="mt-4">
                      <div className="relative pb-4 ps-7 before:absolute before:-bottom-1 before:start-[0.3125rem] before:top-4 before:w-0.5 before:rounded-full before:bg-[color:var(--primary-100)]">
                        <dt className="kicker relative text-[color:var(--text-secondary)] after:absolute after:-start-7 after:top-1 after:h-3 after:w-3 after:rounded-full after:border-2 after:border-[color:var(--neutral-400)] after:bg-white">
                          {t.problem}
                        </dt>
                        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{c.problem}</dd>
                      </div>
                      <div className="relative ps-7">
                        <dt className="kicker relative text-[color:var(--primary-700)] after:absolute after:-start-7 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-[color:var(--primary-700)] after:ring-4 after:ring-[color:var(--primary-100)]">
                          {t.solution}
                        </dt>
                        <dd className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)]">{c.solution}</dd>
                      </div>
                    </dl>

                    <p id={`${id}-docs`} className="kicker mt-5 text-[color:var(--text-primary)]">
                      {t.delivered}
                    </p>
                    {shots.some(Boolean) ? (
                      // Tangkapan layar (16:10 dari atas), klik untuk gambar penuh; keterangannya = butir `docs`.
                      <ul aria-labelledby={`${id}-docs`} className="mt-3 grid grid-cols-3 gap-2.5">
                        {c.docs.map((doc, i) => {
                          const src = shots[i]
                          return (
                            <li key={doc}>
                              {src ? (
                                <figure>
                                  <a href={src} target="_blank" rel="noopener noreferrer" className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-[color:var(--surface-soft)] ring-1 ring-[color:var(--border-light)]">
                                    <Image src={src} alt={t.shotAlt(doc, c.business)} fill sizes="(min-width: 1024px) 110px, (min-width: 768px) calc(16vw - 32px), calc(33vw - 34px)" className="object-cover object-top" />
                                    <span className="sr-only">{d.common.newTab}</span>
                                  </a>
                                  <figcaption className="mt-1.5 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">{doc}</figcaption>
                                </figure>
                              ) : (
                                <span className="block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">{doc}</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <ul aria-labelledby={`${id}-docs`} className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                        {c.docs.map((doc) => (
                          <li key={doc} className="flex items-center gap-2 text-[0.9375rem] leading-snug text-[color:var(--text-secondary)]">
                            <span className="h-[5px] w-[5px] shrink-0 bg-[color:var(--primary-700)]" aria-hidden="true" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Halaman layanan: proyek klien yang terkait layanan ini (tidak tampil bila tidak ada), kartu yang sama dengan beranda. */
export function ServiceClients({ lang, service }: { lang: Lang; service: ServiceKey }) {
  const list = clientsFor(lang, service)
  if (list.length === 0) return null
  const t = getDict(lang).clients
  return (
    <section aria-labelledby="sclients-title" className="section-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
          <h2 id="sclients-title" className="text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">
            {t.title}
          </h2>
          <DetailsLink lang={lang} label={t.details} />
        </div>
        <div className="mt-5 sm:mt-7">
          {list.length > 1 ? (
            <CardSlider label={t.title} prev={t.prev} next={t.next} listClass={TRACK}>
              {list.map((c) => (
                <li key={c.key} className={SLIDE}>
                  <ClientCard c={c} lang={lang} />
                </li>
              ))}
            </CardSlider>
          ) : (
            <div className="max-w-md">
              <ClientCard c={list[0]} lang={lang} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
