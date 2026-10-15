'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { LogoMark } from './Logo'
import type { FaqCategoryId, FaqList } from '../content/faq'

/** Satu tanya-jawab yang siap ditampilkan (string saja, dirakit di server oleh props.ts). */
export type FaqEntry = {
  key: string
  category: FaqCategoryId
  question: string
  /** teks utuh jawaban: yang dicari, dan yang masuk JSON-LD */
  answer: string
  list?: FaqList
  /** halaman yang membahasnya lebih rinci */
  more?: { label: string; href: string }
}

/** Menandai potongan teks yang cocok dengan kata yang dicari. */
export function mark(text: string, q: string): ReactNode {
  if (q.length < 2) return text
  const lower = text.toLowerCase()
  const out: ReactNode[] = []
  let from = 0
  for (let at = lower.indexOf(q); at !== -1; at = lower.indexOf(q, from)) {
    if (at > from) out.push(text.slice(from, at))
    out.push(
      <mark key={at} className="rounded-[3px] bg-[color:var(--accent-200)] px-0.5 text-inherit">
        {text.slice(at, at + q.length)}
      </mark>,
    )
    from = at + q.length
  }
  if (from < text.length) out.push(text.slice(from))
  return out
}

/** Isi gelembung jawaban: paragraf biasa, atau pembuka + daftar + penutup bila jawabannya berupa daftar. */
function Answer({ item, q }: { item: FaqEntry; q: string }) {
  const l = item.list
  if (!l) return <p>{mark(item.answer, q)}</p>
  const List = l.ordered ? 'ol' : 'ul'
  return (
    <>
      <p>{mark(l.intro, q)}</p>
      {/* dua kolom yang dibaca dari atas ke bawah, supaya urutannya (termurah dulu, tahap 1-6) tetap terjaga */}
      <List className="my-2.5 gap-x-8 sm:columns-2">
        {l.rows.map((r, i) => (
          <li key={r.label} className={`flex break-inside-avoid items-baseline gap-2.5 ${r.value ? 'justify-between border-b border-[color:var(--primary-200)] py-1.5' : 'py-1'}`}>
            {l.ordered && (
              <span className="grid h-5 w-5 shrink-0 translate-y-[-1px] place-items-center rounded-full bg-white text-[0.75rem] font-semibold leading-none text-[color:var(--primary-700)]" aria-hidden="true">
                {i + 1}
              </span>
            )}
            <span className="min-w-0">{mark(r.label, q)}</span>
            {/* nilai pendek (harga, "1-3 hari kerja") tidak boleh terpotong baris */}
            {r.value && <span className={`text-end font-semibold text-[color:var(--text-primary)] ${r.value.length <= 16 ? 'whitespace-nowrap' : 'max-w-[55%]'}`}>{mark(r.value, q)}</span>}
          </li>
        ))}
      </List>
      <p>{mark(l.outro, q)}</p>
    </>
  )
}

type Props = {
  item: FaqEntry
  /** kata yang sedang dicari (huruf kecil), untuk sorotan */
  q: string
  as: 'h2' | 'h3'
  hidden?: boolean
  open?: boolean
  /** bila diisi, buka-tutup dikendalikan pemanggil (halaman FAQ); kalau tidak, <details> mengatur dirinya sendiri */
  onToggle?: (open: boolean) => void
  id?: string
  /** kartu yang dituju lewat tautan langsung (#kunci) */
  focused?: boolean
  moreLabel: string
  /** tindakan tambahan di bawah jawaban (halaman FAQ: tanya lanjut, salin tautan) */
  actions?: ReactNode
}

/**
 * Kartu pertanyaan (<details>). Jawabannya tampil seperti balasan obrolan dari PintuWeb: logo + gelembung.
 * Dipakai bagian FAQ di beranda dan halaman FAQ.
 */
export default function FaqCard({ item, q, as: Q, hidden, open, onToggle, id, focused, moreLabel, actions }: Props) {
  return (
    <details
      id={id}
      hidden={hidden}
      open={onToggle ? Boolean(open) : open || undefined}
      onToggle={onToggle ? (e) => onToggle(e.currentTarget.open) : undefined}
      className={`faq-item group scroll-mt-4 rounded-[1.25rem] bg-white transition-shadow duration-300 open:shadow-[0_18px_34px_-26px_rgb(38_70_156/0.55)] ${
        focused ? 'ring-2 ring-[color:var(--primary-700)]' : 'ring-1 ring-[color:var(--border-light)] open:ring-[color:var(--primary-300)]'
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-[1.25rem] px-5 py-4 text-start sm:px-6 sm:py-[1.125rem] [&::-webkit-details-marker]:hidden">
        <Q className="flex-1 text-[1.0625rem] leading-snug text-[color:var(--text-primary)] transition-colors group-open:text-[color:var(--primary-700)] sm:text-[1.125rem]">{mark(item.question, q)}</Q>
        <span
          aria-hidden="true"
          className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--surface-soft)] text-[color:var(--text-secondary)] transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-[color:var(--primary-700)] group-open:text-white"
        >
          <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
          <span className="absolute h-3 w-[1.5px] rounded-full bg-current" />
        </span>
      </summary>
      <div className="faq-answer px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[color:var(--border-light)]" aria-hidden="true">
            <LogoMark className="h-[1.125rem] w-auto" />
          </span>
          <div className="min-w-0 max-w-2xl rounded-[1.125rem] rounded-ss-md bg-[color:var(--primary-50)] px-4 py-3 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)] sm:text-base">
            <Answer item={item} q={q} />
          </div>
        </div>
        {(item.more || actions) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 ps-11 text-[0.8125rem] font-semibold">
            {item.more && (
              <Link href={item.more.href} className="inline-flex min-h-8 items-center gap-1.5 text-[color:var(--primary-700)] underline-offset-4 hover:underline">
                <span>
                  {moreLabel}: {item.more.label}
                </span>
                <ArrowRight size={14} className="arw shrink-0" aria-hidden="true" />
              </Link>
            )}
            {actions}
          </div>
        )}
      </div>
    </details>
  )
}
