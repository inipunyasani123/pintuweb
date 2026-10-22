import { ArrowUpRight, Check, ChevronDown, Clock } from 'lucide-react'

export type { CardData, CardLabels } from './cards'
import type { CardData, CardLabels } from './cards'

type Props = {
  p: CardData
  labels: CardLabels
  /** tingkat judul kartu (h3 di halaman paket & layanan) */
  as?: 'h2' | 'h3' | 'h4'
  /** jumlah fitur yang langsung terlihat; sisanya di balik "Lihat semua fitur (n)". Infinity = semua terlihat. */
  fold?: number
  /** catatan "Konsultasi gratis lewat WhatsApp" di bawah tombol (halaman paket cukup menuliskannya sekali) */
  note?: boolean
  /** label kecil di atas daftar fitur, mis. "Yang kamu dapatkan" */
  featuresTitle?: string
  /** tombol pilih berwarna penuh (paket tunggal di halaman layanan); bawaan: hanya paket yang direkomendasikan */
  solid?: boolean
}

/**
 * Kartu paket bersama untuk halaman harga & halaman layanan. Semua label berupa teks biasa (tanpa bentuk pil):
 * label paket + lama pengerjaan, nama, harga mulai dengan kisaran & DP, "Cocok untuk: a · b · c", isi paket, tombol
 * pilih. Paket yang direkomendasikan cukup diberi bingkai biru dan tombol penuh.
 *
 * Tata letaknya mengikuti lebar kartu sendiri (container query), bukan lebar layar: kartu sempit bertumpuk (kepala,
 * fitur, tombol); kartu yang cukup lebar (satu paket selebar halaman layanan, atau kartu yang melebar dua kolom di
 * halaman paket) terbelah dua: kepala & tombol di kiri, fitur dua kolom di kanan.
 *
 * Fitur yang dilipat tetap ada di HTML (mesin pencari & pencarian di halaman membacanya): <details> bawaan peramban,
 * bisa dibuka dengan papan ketik tanpa JavaScript.
 */
export default function PackageCard({ p, labels, as: Heading = 'h3', fold = 4, note = true, featuresTitle, solid }: Props) {
  const rec = p.recommended
  const shown = p.features.slice(0, fold)
  const rest = p.features.slice(fold)

  const feature = (f: string) => (
    <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-[color:var(--text-secondary)]">
      <Check size={16} strokeWidth={2.4} className="mt-[0.15em] shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
      <span>{f}</span>
    </li>
  )
  const list = 'grid grid-cols-1 gap-x-8 gap-y-2 @2xl:grid-cols-2'

  return (
    <article className={`@container h-full rounded-[1.25rem] bg-white p-4 sm:p-6 ${rec ? 'ring-2 ring-[color:var(--primary-700)]' : 'ring-1 ring-[color:var(--border-light)]'}`}>
      {/* sempit: kepala / fitur / tombol (baris fitur merenggang, jadi tombol kartu sebaris selalu sejajar di dasar);
          lebar: kepala & tombol di kiri, fitur di kanan */}
      <div className="grid h-full grid-rows-[auto_1fr_auto] [grid-template-areas:'head'_'feat'_'cta'] @2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @2xl:grid-rows-[auto_1fr] @2xl:gap-x-10 @2xl:[grid-template-areas:'head_feat'_'cta_feat']">
        <div className="[grid-area:head]">
          <div className="flex min-h-5 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            {/* label paket ("Starter", "Bisnis", ...) sebagai teks biasa; paket tanpa label tetap menyisakan barisnya */}
            {p.badge ? <p className="kicker text-[color:var(--primary-700)]">{p.badge}</p> : <span aria-hidden="true" />}
            <p className="inline-flex items-center gap-1.5 text-[0.8125rem] leading-tight text-[color:var(--text-tertiary)]">
              <Clock size={14} className="shrink-0 self-center" aria-hidden="true" />
              <span>
                <span className="sr-only">{labels.duration}: </span>
                {p.duration}
              </span>
            </p>
          </div>

          <Heading className="mt-2 text-[1.375rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.5rem]">{p.title}</Heading>
          <p className="mt-1 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)]">{p.subtitle}</p>

          {/* Harga: "mulai" + angka besar, lalu kisaran dan DP sebagai baris kecil. Paket tanpa perkiraan harga: kalimat
              "Sesuai kebutuhan" tanpa kata "mulai" (kisarannya berisi "Harga sesuai kebutuhan · konsultasi gratis") */}
          <div className="mt-3.5">
            <p className="flex flex-wrap items-baseline gap-x-2">
              {!p.quote && <span className="text-[0.875rem] font-semibold text-[color:var(--text-tertiary)]">{labels.from}</span>}
              <span className={`display font-semibold leading-none tracking-tight text-[color:var(--text-primary)] ${p.quote ? 'text-[1.5rem]' : 'text-[1.875rem]'}`}>{p.priceFrom}</span>
            </p>
            <dl className="mt-2 space-y-0.5 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">
              <div className="flex flex-wrap gap-x-1.5">
                <dt>{labels.range}</dt>
                <dd className="font-semibold text-[color:var(--text-secondary)]">{p.priceRange}</dd>
              </div>
              <div className="flex flex-wrap gap-x-1.5">
                <dt>{labels.deposit}</dt>
                <dd className="font-semibold text-[color:var(--text-secondary)]">{p.deposit}</dd>
              </div>
            </dl>
          </div>

          {p.highlights.length > 0 && (
            <p className="mt-2.5 text-[0.875rem] leading-snug text-[color:var(--text-tertiary)]">
              <span className="font-semibold text-[color:var(--text-secondary)]">{labels.suits}</span> {p.highlights.join(' · ')}
            </p>
          )}
        </div>

        <div className="mt-4 border-t border-[color:var(--rule)] pt-4 [grid-area:feat] @2xl:mt-0 @2xl:border-s @2xl:border-t-0 @2xl:ps-10 @2xl:pt-0">
          {featuresTitle && <p className="kicker mb-3 text-[color:var(--text-primary)]">{featuresTitle}</p>}
          <ul className={list}>{shown.map(feature)}</ul>
          {rest.length > 0 && (
            <details className="group/more">
              <summary className="mt-1 inline-flex min-h-8 cursor-pointer list-none items-center gap-1.5 rounded-md text-[0.875rem] font-semibold text-[color:var(--primary-700)] hover:text-[color:var(--primary-800)] [&::-webkit-details-marker]:hidden">
                <span className="group-open/more:hidden">{labels.more(p.features.length)}</span>
                <span className="hidden group-open/more:inline">{labels.less}</span>
                <ChevronDown size={15} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-open/more:rotate-180" aria-hidden="true" />
              </summary>
              <ul className={`mt-1 ${list}`}>{rest.map(feature)}</ul>
            </details>
          )}
        </div>

        <div className="mt-4 [grid-area:cta] @2xl:mt-5 @2xl:flex @2xl:flex-wrap @2xl:items-center @2xl:gap-x-5 @2xl:gap-y-2.5 @2xl:self-start">
          <a href={p.waHref} target="_blank" rel="noopener noreferrer" className={`btn w-full @2xl:w-auto ${rec || solid ? 'btn-solid' : 'btn-line'}`}>
            {p.choose} <ArrowUpRight size={16} className="arw arw-ne" aria-hidden="true" />
            <span className="sr-only">{labels.newTab}</span>
          </a>
          {note && <p className="mt-2.5 text-center text-[0.8125rem] text-[color:var(--text-tertiary)] @2xl:mt-0 @2xl:text-start">{labels.free}</p>}
        </div>
      </div>
    </article>
  )
}

/**
 * Kartu RINGKAS (halaman harga & layanan berpaket lebih dari satu; keputusan pemilik 22 Okt 2026: kartu lengkap
 * terlalu banyak teks untuk orang awam). Yang langsung terlihat: label + lama pengerjaan, nama, untuk apa, harga mulai,
 * tombol pilih. Isi lengkap (kisaran, DP, cocok untuk, semua fitur) ada di balik "Lihat isi paket": <details> bawaan,
 * jadi tetap ada di HTML dan bisa dibuka papan ketik tanpa JavaScript. Tautan #slug dari peta harga/pemandu membukanya
 * otomatis (Tabs).
 */
export function PackageBrief({ p, labels, as: Heading = 'h3' }: { p: CardData; labels: CardLabels; as?: 'h2' | 'h3' | 'h4' }) {
  const rec = p.recommended
  return (
    <article className={`flex h-full flex-col rounded-[1.25rem] bg-white p-4 sm:p-5 ${rec ? 'ring-2 ring-[color:var(--primary-700)]' : 'ring-1 ring-[color:var(--border-light)]'}`}>
      <div className="flex min-h-5 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {p.badge ? <p className="kicker text-[color:var(--primary-700)]">{p.badge}</p> : <span aria-hidden="true" />}
        <p className="inline-flex items-center gap-1.5 text-[0.8125rem] leading-tight text-[color:var(--text-tertiary)]">
          <Clock size={14} className="shrink-0 self-center" aria-hidden="true" />
          <span>
            <span className="sr-only">{labels.duration}: </span>
            {p.duration}
          </span>
        </p>
      </div>
      <Heading className="mt-1.5 text-[1.25rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.375rem]">{p.title}</Heading>
      <p className="mt-1 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)]">{p.subtitle}</p>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-3">
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          {!p.quote && <span className="text-[0.8125rem] font-semibold text-[color:var(--text-tertiary)]">{labels.from}</span>}
          <span className={`display font-semibold leading-none tracking-tight text-[color:var(--text-primary)] ${p.quote ? 'text-[1.25rem]' : 'text-[1.5rem]'}`}>{p.priceFrom}</span>
        </p>
        <a href={p.waHref} target="_blank" rel="noopener noreferrer" className={`btn btn-sm ${rec ? 'btn-solid' : 'btn-line'}`}>
          {labels.pick}
          <span className="sr-only"> {p.title} {labels.newTab}</span>
          <ArrowUpRight size={15} className="arw arw-ne" aria-hidden="true" />
        </a>
      </div>

      <details className="group/isi mt-3 border-t border-[color:var(--rule)]">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-[0.875rem] font-semibold text-[color:var(--primary-700)] hover:text-[color:var(--primary-800)] [&::-webkit-details-marker]:hidden">
          <span className="group-open/isi:hidden">{labels.open}</span>
          <span className="hidden group-open/isi:inline">{labels.close}</span>
          <ChevronDown size={15} strokeWidth={2.4} className="shrink-0 transition-transform duration-200 group-open/isi:rotate-180" aria-hidden="true" />
        </summary>
        <div className="pb-1">
          <dl className="space-y-0.5 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">
            <div className="flex flex-wrap gap-x-1.5">
              <dt>{labels.range}</dt>
              <dd className="font-semibold text-[color:var(--text-secondary)]">{p.priceRange}</dd>
            </div>
            <div className="flex flex-wrap gap-x-1.5">
              <dt>{labels.deposit}</dt>
              <dd className="font-semibold text-[color:var(--text-secondary)]">{p.deposit}</dd>
            </div>
          </dl>
          {p.highlights.length > 0 && (
            <p className="mt-2 text-[0.875rem] leading-snug text-[color:var(--text-tertiary)]">
              <span className="font-semibold text-[color:var(--text-secondary)]">{labels.suits}</span> {p.highlights.join(' · ')}
            </p>
          )}
          <ul className="mt-3 space-y-2">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-[color:var(--text-secondary)]">
                <Check size={16} strokeWidth={2.4} className="mt-[0.15em] shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </article>
  )
}

/**
 * Kisi kartu ringkas: 1 kolom (ponsel), 2 (≥640), 3 (≥1024, bila `wide`). Tiap kartu berjangkar #slug untuk tautan dari
 * peta harga, pemandu paket, dan halaman lain; kartu yang dituju diberi lingkar sorot. Kartu yang dibuka tidak
 * meregangkan tetangganya (items-start).
 */
export function BriefGrid({ cards, labels, wide = false, className = '' }: { cards: CardData[]; labels: CardLabels; wide?: boolean; className?: string }) {
  return (
    <div className={`grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4 ${wide ? 'lg:grid-cols-3' : ''} ${className}`}>
      {cards.map((c) => (
        <div key={c.slug} id={c.slug} className="scroll-mt-4 rounded-[1.25rem] target:shadow-[0_0_0_4px_var(--primary-200)]">
          <PackageBrief p={c} labels={labels} />
        </div>
      ))}
    </div>
  )
}

/**
 * Kisi kartu paket dua kolom (ponsel satu kolom). Jumlah ganjil: kartu terakhir melebar dua kolom (kartunya otomatis
 * terbelah dua), jadi tidak ada sel kosong di samping kartu. Tiap kartu berjangkar #slug untuk tautan dari daftar
 * kebutuhan, peta harga, dan halaman lain; kartu yang dituju diberi lingkar sorot.
 */
export function PackageGrid({ cards, labels, note = true, className = '' }: { cards: CardData[]; labels: CardLabels; note?: boolean; className?: string }) {
  const odd = cards.length % 2 === 1
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 ${className}`}>
      {cards.map((c, i) => (
        <div key={c.slug} id={c.slug} className={`scroll-mt-4 rounded-[1.25rem] target:shadow-[0_0_0_4px_var(--primary-200)] ${odd && i === cards.length - 1 ? 'sm:col-span-2' : ''}`}>
          <PackageCard p={c} labels={labels} as="h3" note={note} />
        </div>
      ))}
    </div>
  )
}
