'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, ArrowUpRight } from 'lucide-react'
import SectionHead from './SectionHead'
import { HlText } from './Bits'
import FaqCard, { type FaqEntry } from './FaqCard'
import type { Hl } from '../i18n/dict/id'
import type { FaqCategoryId } from '../content/faq'

export type FaqText = {
  eyebrow: string
  title: Hl
  lead: string
  search: string
  searchPh: string
  categories: string
  all: string
  none: string
  unanswered: string
  askLead: string
  /** janji waktu balas (dari lib/site.ts) */
  note: string
  allN: string
  askWa: string
  more: string
  /** keterangan pembaca layar untuk tautan yang membuka tab baru */
  newTab: string
}

type Props = {
  items: FaqEntry[]
  categories: { id: FaqCategoryId; name: string }[]
  t: FaqText
  waHref: string
  faqHref: string
}

/**
 * Bagian FAQ di beranda. Semua pertanyaan & jawaban selalu ada di HTML (<details>); kategori & pencarian hanya
 * menyembunyikan item. JSON-LD FAQPage cukup sekali di situs, yaitu di halaman FAQ (pertanyaannya sama persis).
 * Halaman FAQ sendiri memakai FaqCenter (kartu pertanyaannya sama: FaqCard).
 */
export default function FAQ({ items, categories, t, waHref, faqHref }: Props) {
  const [category, setCategory] = useState<FaqCategoryId | 'all'>('general')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const state = useMemo(
    () =>
      items.map((item) => {
        const inQuestion = item.question.toLowerCase().includes(q)
        const inAnswer = item.answer.toLowerCase().includes(q)
        return {
          show: (category === 'all' || item.category === category) && (!q || inQuestion || inAnswer),
          // cocoknya hanya di jawaban: buka jawabannya supaya terlihat kenapa item ini muncul
          reveal: q.length >= 2 && !inQuestion && inAnswer,
        }
      }),
    [items, category, q],
  )
  const count = state.filter((s) => s.show).length

  const tabs = [{ id: 'all' as const, name: t.all, n: items.length }, ...categories.map((c) => ({ ...c, n: items.filter((i) => i.category === c.id).length }))]

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-[color:var(--surface-soft)]">
      <div className="mx-auto flex max-w-6xl flex-col px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Ponsel: judul, daftar, lalu kartu (urutan lewat order). Desktop: judul + kartu menempel di kiri. */}
        <div className="contents lg:sticky lg:top-24 lg:col-span-4 lg:block lg:self-start">
          <div className="order-1 mb-6 sm:mb-10 lg:mb-0">
            <SectionHead eyebrow={t.eyebrow} id="faq-title" title={<HlText parts={t.title} />} lead={t.lead} />
          </div>
          {/* Kartu "belum terjawab". Ponsel (<640px): cukup tombol ke semua pertanyaan; ajakan WhatsApp-nya sudah ada di
              footer tepat di bawah bagian ini (kartu obrolan), jadi tidak diulang dua kali berturut-turut. */}
          <div className="order-3 mt-6 sm:mt-8 lg:mt-9">
            <Link href={faqHref} className="btn btn-line w-full sm:hidden">
              {t.allN} <ArrowRight size={16} className="arw" aria-hidden="true" />
            </Link>
            <div className="hidden rounded-[1.5rem] bg-white p-6 ring-1 ring-[color:var(--border-light)] sm:block">
              {/* satu paragraf dengan dua baris (bukan <p> tebal + <p>): axe menganggap paragraf tebal di atas paragraf
                  lain sebagai judul palsu (p-as-heading) */}
              <p className="text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">
                <span className="display block text-[1.125rem] font-semibold leading-snug text-[color:var(--text-primary)]">{t.unanswered}</span>
                <span className="mt-1.5 block">
                  {t.askLead} {t.note}
                </span>
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row lg:flex-col">
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid btn-sm">
                  {t.askWa} <ArrowUpRight size={15} className="arw arw-ne" aria-hidden="true" />
                  <span className="sr-only"> {t.newTab}</span>
                </a>
                <Link href={faqHref} className="btn btn-line btn-sm">
                  {t.allN} <ArrowRight size={15} className="arw" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="order-2 lg:col-span-8">
          {/* Pencarian */}
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" aria-hidden="true" />
            <label htmlFor="faq-search-home" className="sr-only">
              {t.search}
            </label>
            <input
              id="faq-search-home"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                // mencari berarti mencari di semua kategori
                if (e.target.value.trim()) setCategory('all')
              }}
              placeholder={t.searchPh}
              className="h-[3.25rem] w-full rounded-full border-0 bg-white ps-[3.25rem] pe-5 text-base text-[color:var(--text-primary)] outline-none ring-1 ring-[color:var(--border-light)] transition-shadow placeholder:text-[color:var(--text-muted)] focus:ring-2 focus:ring-[color:var(--primary-700)]"
            />
          </div>

          {/* Kategori */}
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.categories}>
            {tabs.map((tab) => {
              const active = category === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategory(tab.id)}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.9375rem] transition-colors ${
                    active
                      ? 'bg-[color:var(--primary-700)] font-semibold text-white'
                      : 'bg-white text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]'
                  }`}
                >
                  {tab.name}
                  <span className={`text-[0.8125rem] font-medium ${active ? 'text-white/80' : 'text-[color:var(--text-muted)]'}`}>{tab.n}</span>
                </button>
              )
            })}
          </div>

          {/* Daftar: semua item selalu dirender */}
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6">
            {items.map((item, i) => (
              <FaqCard key={item.key} item={item} q={q} as="h3" hidden={!state[i].show} open={state[i].reveal} moreLabel={t.more} />
            ))}
          </div>

          {count === 0 && (
            <p className="rounded-[1.25rem] bg-white px-6 py-8 text-[color:var(--text-tertiary)] ring-1 ring-[color:var(--border-light)]" role="status">
              {t.none}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
