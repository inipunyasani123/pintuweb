'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ChevronsDownUp, ChevronsUpDown, CodeXml, DoorOpen, LifeBuoy, Route, Search, Wallet, type LucideIcon } from 'lucide-react'
import FaqCard, { type FaqEntry } from './FaqCard'
import CopyLink from './CopyLink'
import { wa } from '../lib/site'
import type { FaqCategoryId } from '../content/faq'

export type FaqCenterText = {
  search: string
  searchPh: string
  clear: string
  categories: string
  /** pola: {n} = jumlah pertanyaan, {c} = jumlah kategori */
  count: string
  /** pola: {n}, {total}, {q} */
  found: string
  /** pola: {n} */
  nQuestions: string
  openAll: string
  closeAll: string
  none: string
  more: string
  follow: string
  /** pesan WhatsApp, pola: {q} = pertanyaannya */
  followText: string
  /** pesan WhatsApp saat pencarian tidak menemukan apa-apa, pola: {q} = kata yang dicari */
  searchAskText: string
  copy: string
  copied: string
  unanswered: string
  askLead: string
  /** janji waktu balas (dari lib/site.ts) */
  note: string
  askWa: string
  newTab: string
}

export type FaqCenterCategory = { id: FaqCategoryId; slug: string; name: string; lead: string }

type Props = { items: FaqEntry[]; categories: FaqCenterCategory[]; t: FaqCenterText; waHref: string }

const ICON: Record<FaqCategoryId, LucideIcon> = { general: DoorOpen, pricing: Wallet, process: Route, technical: CodeXml, support: LifeBuoy }

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''))

/**
 * Isi halaman FAQ: pertanyaan dikelompokkan per kategori, dengan navigasi kategori yang menempel (desktop)
 * dan menandai bagian yang sedang dibaca. Semua tanya-jawab selalu ada di HTML (<details>), sehingga JSON-LD
 * FAQPage cocok dengan isi yang terlihat; pencarian hanya menyembunyikan.
 * Tiap pertanyaan punya alamat sendiri (/faq#garansi): membukanya langsung membuka dan menyorot kartunya.
 */
export default function FaqCenter({ items, categories, t, waHref }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const [focus, setFocus] = useState<string | null>(null)
  const [active, setActive] = useState(categories[0]?.slug ?? '')
  const q = query.trim().toLowerCase()

  const state = useMemo(
    () =>
      items.map((item) => {
        const inQuestion = item.question.toLowerCase().includes(q)
        const inAnswer = item.answer.toLowerCase().includes(q)
        return {
          show: !q || inQuestion || inAnswer,
          // cocoknya hanya di jawaban: buka jawabannya supaya terlihat kenapa item ini muncul
          reveal: q.length >= 2 && !inQuestion && inAnswer,
        }
      }),
    [items, q],
  )
  const shown = items.filter((_, i) => state[i].show)
  const count = shown.length
  const perCat = categories.map((c) => shown.filter((it) => it.category === c.id).length)
  const allOpen = count > 0 && shown.every((it) => open.has(it.key))

  // Tautan langsung: #kunci membuka dan menyorot pertanyaannya; #kategori cukup melompat ke bagiannya.
  useEffect(() => {
    const keys = new Set(items.map((i) => i.key))
    const slugs = new Set(categories.map((c) => c.slug))
    const apply = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (keys.has(id)) {
        setQuery('')
        setOpen((prev) => new Set(prev).add(id))
        setFocus(id)
        // gulir ulang setelah kartunya terbuka (dan pencarian dibersihkan), supaya posisinya tepat
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' })))
      } else if (slugs.has(id)) {
        setQuery('')
        setFocus(null)
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' })))
      }
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [items, categories])

  // Kategori aktif = bagian terakhir yang judulnya sudah melewati garis 160px dari atas layar.
  useEffect(() => {
    let ticking = false
    const update = () => {
      let cur = ''
      for (const c of categories) {
        const el = document.getElementById(c.slug)
        if (!el || el.hidden) continue
        if (!cur) cur = c.slug
        if (el.getBoundingClientRect().top <= 160) cur = c.slug
      }
      setActive(cur)
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [categories, q])

  const toggle = (key: string, isOpen: boolean) => {
    setOpen((prev) => {
      if (prev.has(key) === isOpen) return prev
      const next = new Set(prev)
      if (isOpen) next.add(key)
      else next.delete(key)
      return next
    })
    if (!isOpen && focus === key) setFocus(null)
  }

  const contact = (
    <div className="rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6 lg:block lg:p-5">
      {/* sapaan + ajakan satu paragraf: baris tebalnya bukan judul bagian (axe p-as-heading) */}
      <p className="min-w-0">
        <span className="display block text-[1.0625rem] font-semibold leading-snug text-[color:var(--text-primary)]">{t.unanswered}</span>
        <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">
          {t.askLead} {t.note}
        </span>
      </p>
      <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid btn-sm mt-4 w-full sm:mt-0 sm:w-auto sm:shrink-0 lg:mt-4 lg:w-full">
        {t.askWa} <ArrowUpRight size={15} className="arw arw-ne" aria-hidden="true" />
        <span className="sr-only">{t.newTab}</span>
      </a>
    </div>
  )

  return (
    <section className="mt-10 bg-[color:var(--surface-soft)] py-12 sm:mt-12 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-10">
        {/* Ponsel: pencarian + kategori, daftar, lalu kartu kontak (urutan lewat order). Desktop: semuanya menempel di kiri. */}
        <div className="contents lg:sticky lg:top-28 lg:col-span-4 lg:block lg:self-start">
          <div className="order-1">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" aria-hidden="true" />
              <label htmlFor="faq-search" className="sr-only">
                {t.search}
              </label>
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPh}
                className="h-[3.25rem] w-full rounded-full border-0 bg-white ps-[3.25rem] pe-5 text-base text-[color:var(--text-primary)] outline-none ring-1 ring-[color:var(--border-light)] transition-shadow placeholder:text-[color:var(--text-muted)] focus:ring-2 focus:ring-[color:var(--primary-700)]"
              />
            </div>

            {/* Kategori: pil di ponsel/tablet, daftar tegak di desktop. Ini tautan lompat, bukan saringan. */}
            <nav aria-label={t.categories} className="mt-4">
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:gap-0.5 lg:rounded-[1.25rem] lg:bg-white lg:p-2 lg:ring-1 lg:ring-[color:var(--border-light)]">
                {categories.map((c, i) => {
                  const Icon = ICON[c.id]
                  const n = perCat[i]
                  const on = n > 0 && active === c.slug
                  const base = 'inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.9375rem] lg:flex lg:min-h-11 lg:gap-3 lg:rounded-xl lg:px-3'
                  const inner = (
                    <>
                      {/* ikon hanya di daftar desktop: di ponsel pil tanpa ikon muat tiga per baris */}
                      <Icon size={18} className="hidden shrink-0 lg:block" aria-hidden="true" />
                      <span className="lg:flex-1">{c.name}</span>
                      <span className={`text-[0.8125rem] font-medium ${n > 0 ? 'text-[color:var(--text-muted)]' : ''} ${on ? 'lg:text-[color:var(--primary-700)]' : ''}`}>{n}</span>
                    </>
                  )
                  return (
                    <li key={c.id}>
                      {n > 0 ? (
                        <a
                          href={`#${c.slug}`}
                          aria-current={on ? 'location' : undefined}
                          className={`${base} bg-white text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)] lg:ring-0 ${
                            on ? 'lg:bg-[color:var(--primary-50)] lg:font-semibold lg:text-[color:var(--primary-700)]' : 'lg:hover:bg-[color:var(--surface-soft)]'
                          }`}
                        >
                          {inner}
                        </a>
                      ) : (
                        // pencarian tidak menemukan apa-apa di kategori ini: bukan tautan, tanpa latar putih, tetap terbaca
                        <span className={`${base} border border-dashed border-[color:var(--neutral-400)] text-[color:var(--text-muted)] lg:border-0`}>
                          {inner}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
          <div className="order-3 mt-8 lg:mt-4">{contact}</div>
        </div>

        <div className="order-2 mt-6 lg:col-span-8 lg:mt-0">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 lg:min-h-[3.25rem]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem]">
              <p className="text-[color:var(--text-tertiary)]" role="status">
                {q ? fill(t.found, { n: count, total: items.length, q: query.trim() }) : fill(t.count, { n: items.length, c: categories.length })}
              </p>
              {q && (
                <button type="button" onClick={() => setQuery('')} className="font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline">
                  {t.clear}
                </button>
              )}
            </div>
            {count > 0 && (
              <button
                type="button"
                onClick={() => setOpen(allOpen ? new Set() : new Set(shown.map((it) => it.key)))}
                aria-pressed={allOpen}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.8125rem] font-semibold text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]"
              >
                {allOpen ? <ChevronsDownUp size={14} aria-hidden="true" /> : <ChevronsUpDown size={14} aria-hidden="true" />}
                {allOpen ? t.closeAll : t.openAll}
              </button>
            )}
          </div>

          {/* Semua kategori dan pertanyaan selalu dirender; yang tidak cocok dengan pencarian disembunyikan. */}
          <div className="mt-5 flex flex-col gap-11 sm:gap-14">
            {categories.map((c, ci) => {
              return (
                <section key={c.id} id={c.slug} aria-labelledby={`kat-${c.slug}`} hidden={perCat[ci] === 0} className="scroll-mt-4">
                  {/* kepala kategori tanpa ikon berubin (ikon kategori cukup di daftar kategori desktop) */}
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 id={`kat-${c.slug}`} className="text-[1.375rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.625rem]">
                        {c.name}
                      </h2>
                      <p className="mt-0.5 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)]">{c.lead}</p>
                    </div>
                    <span className="hidden shrink-0 self-start rounded-full bg-white px-3 py-1 text-[0.8125rem] font-semibold text-[color:var(--text-tertiary)] ring-1 ring-[color:var(--border-light)] sm:block">
                      {fill(t.nQuestions, { n: perCat[ci] })}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2.5 sm:mt-5">
                    {items.map((item, i) =>
                      item.category !== c.id ? null : (
                        <FaqCard
                          key={item.key}
                          id={item.key}
                          item={item}
                          q={q}
                          as="h3"
                          hidden={!state[i].show}
                          open={open.has(item.key) || state[i].reveal}
                          // kartu yang terbuka hanya karena pencarian tidak dicatat, supaya tertutup lagi saat pencarian dihapus
                          onToggle={(isOpen) => (isOpen && state[i].reveal ? undefined : toggle(item.key, isOpen))}
                          focused={focus === item.key}
                          moreLabel={t.more}
                          actions={
                            <>
                              <a
                                href={wa(fill(t.followText, { q: item.question }))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-8 items-center gap-1.5 text-[color:var(--text-secondary)] underline-offset-4 hover:text-[color:var(--primary-700)] hover:underline"
                              >
                                {t.follow} <ArrowUpRight size={14} className="arw arw-ne shrink-0" aria-hidden="true" />
                                <span className="sr-only">{t.newTab}</span>
                              </a>
                              <CopyLink label={t.copy} done={t.copied} hash={item.key} plain />
                            </>
                          }
                        />
                      ),
                    )}
                  </div>
                </section>
              )
            })}
          </div>

          {count === 0 && (
            <div className="rounded-[1.25rem] bg-white px-6 py-7 ring-1 ring-[color:var(--border-light)]">
              <p className="text-[color:var(--text-tertiary)]">{t.none}</p>
              <a href={wa(fill(t.searchAskText, { q: query.trim() }))} target="_blank" rel="noopener noreferrer" className="btn btn-solid btn-sm mt-4">
                {t.askWa} <ArrowUpRight size={15} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{t.newTab}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
