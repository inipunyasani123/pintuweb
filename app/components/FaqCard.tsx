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
          <li key={r.label} className={`faq-li ${r.value ? 'faq-li-v' : 'faq-li-s'}`}>
            {l.ordered && (
              <span className="grid h-5 w-5 shrink-0 translate-y-[-1px] place-items-center rounded-full bg-white text-[0.75rem] font-semibold leading-none text-[color:var(--primary-700)]" aria-hidden="true">
                {i + 1}
              </span>
            )}
            <span className="min-w-0">{mark(r.label, q)}</span>
            {/* nilai pendek (harga, "1-3 hari kerja") tidak boleh terpotong baris */}
            {r.value && <span className={`faq-val ${r.value.length <= 16 ? 'whitespace-nowrap' : 'max-w-[55%]'}`}>{mark(r.value, q)}</span>}
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
  /** nomor urut di antara kartu yang sedang tampil (01, 02, …); petak nomornya menyala biru saat kartu dibuka */
  num?: number
}

/**
 * Kartu pertanyaan (<details>). Jawabannya tampil seperti balasan obrolan dari PintuWeb: logo + gelembung.
 * Dipakai bagian FAQ di beranda dan halaman FAQ.
 */
export default function FaqCard({ item, q, as: Q, hidden, open, onToggle, id, focused, moreLabel, actions, num }: Props) {
  return (
    <details
      id={id}
      hidden={hidden}
      open={onToggle ? Boolean(open) : open || undefined}
      onToggle={onToggle ? (e) => onToggle(e.currentTarget.open) : undefined}
      // kelas faq-* di globals.css (isi utilitasnya sama; dipindah supaya HTML beranda tidak mengulang 31 kali)
      className={`faq-item group${focused ? ' faq-focus' : ''}`}
    >
      <summary className={`faq-sum ${num ? 'faq-sum-n' : 'faq-sum-p'}`}>
        {num !== undefined && (
          // nomor hanya penanda urutan (dekoratif); sejajar dengan logo di gelembung jawaban di bawahnya
          <span aria-hidden="true" className="faq-num">
            {String(num).padStart(2, '0')}
          </span>
        )}
        <Q className="faq-q">{mark(item.question, q)}</Q>
        {/* kartu bernomor: yang menyala biru saat dibuka cukup petak nomornya, tombol +/× tetap tenang. Dua garis tanda
            plus = ::before/::after kelas faq-x. */}
        <span aria-hidden="true" className={`faq-x ${num ? 'faq-x-n' : 'faq-x-p'}`} />
      </summary>
      <div className={`faq-answer ${num ? 'faq-pad-n' : 'faq-pad-p'}`}>
        <div className="flex items-start gap-3">
          <span className="faq-logo" aria-hidden="true">
            <LogoMark className="h-[1.125rem] w-auto" />
          </span>
          <div className="faq-bubble">
            <Answer item={item} q={q} />
          </div>
        </div>
        {(item.more || actions) && (
          <div className="faq-more">
            {item.more && (
              <Link href={item.more.href} className="faq-more-a">
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
