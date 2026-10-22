'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUpRight, Clock } from 'lucide-react'

// Pemandu paket (halaman harga): tiga pertanyaan berupa tombol pilihan (radio bawaan, jadi panah & Tab sudah jalan
// tanpa ARIA tambahan), hasilnya langsung tampil: satu paket paling cocok + satu alternatif. Tabel hasil dihitung di
// server dari lib/packages.ts (content/guide.ts); komponen ini hanya membacanya. Tautan "Lihat isi paket" (#slug)
// ditangani Tabs: tab kelompoknya dibuka, kartu digulir ke layar, dan isinya dibuka.

export type GuideCard = { title: string; subtitle: string; priceFrom: string; duration: string; waHref: string }
type Option = { id: string; label: string }

type Props = {
  questions: { id: string; legend: string; options: Option[] }[]
  results: Record<string, [string, string]>
  cards: Record<string, GuideCard>
  /** `live` = pola pengumuman untuk pembaca layar, dengan penanda {best} dan {alt} (fungsi tidak bisa dikirim ke komponen klien) */
  labels: { best: string; alt: string; see: string; ask: string; from: string; duration: string; newTab: string; live: string }
}

export default function PackageGuide({ questions, results, cards, labels }: Props) {
  const [pick, setPick] = useState<string[]>(() => questions.map((q) => q.options[0].id))
  const [bestSlug, altSlug] = results[pick.join('|')]
  const best = cards[bestSlug]
  const alt = cards[altSlug]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
      <div className="space-y-5 sm:space-y-6 lg:col-span-7">
        {questions.map((q, qi) => (
          <fieldset key={q.id}>
            <legend className="flex items-center gap-2.5 text-[1.0625rem] font-semibold leading-snug text-[color:var(--text-primary)] sm:text-[1.125rem]">
              <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--primary-50)] text-[0.875rem] text-[color:var(--primary-700)] ring-1 ring-[color:var(--primary-100)]" aria-hidden="true">
                {qi + 1}
              </span>
              {q.legend}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-white px-4 py-2 text-[0.9375rem] font-medium leading-tight text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-medium)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-700)] has-[:checked]:bg-[color:var(--primary-700)] has-[:checked]:font-semibold has-[:checked]:text-white has-[:checked]:ring-[color:var(--primary-700)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[color:var(--primary-600)]"
                >
                  <input
                    type="radio"
                    name={`pemandu-${q.id}`}
                    value={o.id}
                    checked={pick[qi] === o.id}
                    onChange={() => setPick((old) => old.map((v, i) => (i === qi ? o.id : v)))}
                    className="sr-only"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="lg:sticky lg:top-28 lg:col-span-5">
        <p className="sr-only" aria-live="polite">
          {labels.live.replace('{best}', best.title).replace('{alt}', alt.title)}
        </p>
        <div className="rounded-[1.5rem] bg-[color:var(--primary-700)] p-5 text-white sm:p-7">
          <p className="kicker text-[color:var(--accent-200)]">{labels.best}</p>
          <p className="display mt-1 text-[1.625rem] leading-tight text-white sm:text-[1.875rem]">{best.title}</p>
          <p className="mt-1.5 text-[0.9375rem] leading-snug text-white/80">{best.subtitle}</p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[0.875rem] text-white/80">{labels.from}</span>
            <span className="display text-[1.5rem] font-semibold leading-none">{best.priceFrom}</span>
            <span className="inline-flex items-center gap-1.5 text-[0.875rem] text-white/85">
              <Clock size={14} aria-hidden="true" />
              <span className="sr-only">{labels.duration}: </span>
              {best.duration}
            </span>
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
            <a href={`#${bestSlug}`} className="btn btn-white">
              {labels.see} <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a href={best.waHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
              {labels.ask} <ArrowUpRight size={16} className="arw-ne" aria-hidden="true" />
              <span className="sr-only">{labels.newTab}</span>
            </a>
          </div>
          <div className="mt-5 border-t border-white/20 pt-4">
            <p className="text-[0.8125rem] text-white/80">{labels.alt}</p>
            <p className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 text-[0.9375rem] leading-snug">
              <a href={`#${altSlug}`} className="font-semibold text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">
                {alt.title}
              </a>
              <span className="whitespace-nowrap text-white/85">
                {labels.from} {alt.priceFrom}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
