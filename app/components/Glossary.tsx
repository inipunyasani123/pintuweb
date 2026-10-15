'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowRight, Search } from 'lucide-react'

export type GlossaryItem = {
  id: string
  topic: string
  term: string
  def: string
  /** huruf pengelompokan (huruf pertama istilah, kapital) */
  letter: string
  see?: { label: string; href: string }
}
export type GlossaryTopic = { id: string; label: string; color: string; to: string; tint: string }
export type GlossaryText = {
  search: string
  searchPh: string
  topicLabel: string
  all: string
  jump: string
  related: string
  none: string
  /** "N istilah" untuk tiap kemungkinan jumlah tidak dikirim; cukup pola dengan {n} dan {total} */
  count: string
  countOf: string
  linkTo: string
}

/** Menandai potongan teks yang cocok dengan kata yang dicari. */
function mark(text: string, q: string): ReactNode {
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

/**
 * Kamus istilah: pencarian, saringan topik berwarna, indeks huruf yang menempel (desktop), dan kartu istilah.
 * Semua istilah selalu ada di HTML (sesuai JSON-LD DefinedTermSet); pencarian dan topik hanya menyembunyikan.
 */
export default function Glossary({ items, topics, t }: { items: GlossaryItem[]; topics: GlossaryTopic[]; t: GlossaryText }) {
  const [topic, setTopic] = useState<string>('all')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const letters = useMemo(() => Array.from(new Set(items.map((i) => i.letter))), [items])
  const [active, setActive] = useState(letters[0] ?? '')

  const show = useMemo(() => items.map((i) => (topic === 'all' || i.topic === topic) && (!q || i.term.toLowerCase().includes(q) || i.def.toLowerCase().includes(q))), [items, topic, q])
  const count = show.filter(Boolean).length
  const liveLetters = useMemo(() => new Set(items.filter((_, i) => show[i]).map((i) => i.letter)), [items, show])
  const topicOf = useMemo(() => Object.fromEntries(topics.map((x) => [x.id, x])), [topics])
  // kartu pertama yang tampil untuk tiap huruf: di sanalah jangkar #huruf-X dan lencana hurufnya berada
  const firstOf = useMemo(() => {
    const m = new Map<string, number>()
    items.forEach((it, i) => {
      if (show[i] && !m.has(it.letter)) m.set(it.letter, i)
    })
    return m
  }, [items, show])

  // huruf aktif = kelompok huruf terakhir yang sudah melewati garis 150px dari atas layar
  useEffect(() => {
    let ticking = false
    const update = () => {
      let cur = ''
      for (const l of letters) {
        const el = document.getElementById(`huruf-${l}`)
        if (!el) continue
        if (!cur) cur = l
        if (el.getBoundingClientRect().top <= 150) cur = l
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
  }, [letters, show])

  const chip = (id: string, label: string, n: number, c?: GlossaryTopic) => {
    const on = topic === id
    return (
      <button
        key={id}
        type="button"
        onClick={() => setTopic(id)}
        aria-pressed={on}
        className={`inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.9375rem] transition-colors ${
          on ? 'font-semibold text-white' : 'bg-white text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] hover:text-[color:var(--text-primary)] hover:ring-[color:var(--primary-300)]'
        }`}
        style={on ? { backgroundImage: c ? `linear-gradient(135deg, ${c.color}, ${c.to})` : 'linear-gradient(135deg, var(--primary-700), var(--primary-800))' } : undefined}
      >
        {c && !on && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundImage: `linear-gradient(135deg, ${c.color}, ${c.to})` }} aria-hidden="true" />}
        {label}
        <span className={`text-[0.8125rem] font-medium ${on ? 'text-white/80' : 'text-[color:var(--text-muted)]'}`}>{n}</span>
      </button>
    )
  }

  return (
    <div>
      {/* Pencarian + topik */}
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" aria-hidden="true" />
        <label htmlFor="glossary-search" className="sr-only">
          {t.search}
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            // mencari berarti mencari di semua topik
            if (e.target.value.trim()) setTopic('all')
          }}
          placeholder={t.searchPh}
          className="h-[3.25rem] w-full rounded-full border-0 bg-white pl-[3.25rem] pr-5 text-base text-[color:var(--text-primary)] outline-none ring-1 ring-[color:var(--border-light)] transition-shadow placeholder:text-[color:var(--text-muted)] focus:ring-2 focus:ring-[color:var(--primary-700)]"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label={t.topicLabel}>
        {chip('all', t.all, items.length)}
        {topics.map((c) => chip(c.id, c.label, items.filter((i) => i.topic === c.id).length, c))}
      </div>
      <p className="mt-4 text-[0.9375rem] text-[color:var(--text-tertiary)]" role="status">
        {count === items.length ? t.count.replace('{n}', String(count)) : t.countOf.replace('{n}', String(count)).replace('{total}', String(items.length))}
      </p>

      <div className="mt-6 lg:grid lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:gap-x-8">
        {/* Indeks huruf: baris pil di ponsel/tablet, rel tegak yang menempel di desktop */}
        <nav aria-label={t.jump} className="mb-6 lg:mb-0">
          <ul className="flex flex-wrap gap-1.5 lg:sticky lg:top-28 lg:flex-col lg:items-center lg:gap-1 lg:rounded-full lg:bg-white lg:p-1.5 lg:ring-1 lg:ring-[color:var(--border-light)]">
            {letters.map((l) => {
              const live = liveLetters.has(l)
              const on = live && l === active
              return (
                <li key={l}>
                  {live ? (
                    <a
                      href={`#huruf-${l}`}
                      aria-current={on ? 'location' : undefined}
                      className={`grid h-10 w-10 place-items-center rounded-full text-[0.9375rem] font-semibold transition-colors ${
                        on ? 'bg-[color:var(--primary-700)] text-white' : 'bg-white text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] hover:text-[color:var(--primary-700)] lg:ring-0 lg:hover:bg-[color:var(--surface-soft)]'
                      }`}
                    >
                      {l}
                    </a>
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full text-[0.9375rem] font-semibold text-[color:var(--neutral-400)]" aria-hidden="true">
                      {l}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {/* Satu kisi menerus menurut abjad; huruf ditandai lencana kecil di kartu pertamanya. */}
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:gap-4 xl:grid-cols-3">
            {items.map((it, i) => {
              const c = topicOf[it.topic]
              const first = firstOf.get(it.letter) === i
              return (
                <div
                  key={it.id}
                  id={it.id}
                  hidden={!show[i]}
                  className="relative flex scroll-mt-4 flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] transition-shadow duration-300 target:shadow-[0_22px_40px_-26px_var(--k)] target:ring-2 target:ring-[color:var(--k)]"
                  style={{ '--k': c.color, '--k2': c.to } as CSSProperties}
                >
                  {/* Urutan DOM: istilah, topik, definisi (dl yang sah); urutan tampil diatur dengan order. */}
                  <dt className="display order-2 mt-2 text-[1.25rem] font-semibold leading-snug text-[color:var(--text-primary)]">
                    <dfn className="not-italic">{mark(it.term, q)}</dfn>
                  </dt>
                  <dd className="order-1 flex items-center gap-2">
                    {first && <span id={`huruf-${it.letter}`} className="pointer-events-none absolute left-0 top-0 scroll-mt-4" aria-hidden="true" />}
                    <span className="inline-flex min-w-0 flex-1 items-center gap-2 text-[0.8125rem] font-semibold text-[color:var(--k)]">
                      <span className="h-2 w-2 shrink-0 rounded-full [background-image:linear-gradient(135deg,var(--k),var(--k2))]" aria-hidden="true" />
                      <span className="truncate">{c.label}</span>
                    </span>
                    {first && (
                      <span className="grid h-7 min-w-7 shrink-0 place-items-center rounded-full bg-[color:var(--primary-50)] px-2 text-[0.8125rem] font-semibold text-[color:var(--primary-700)]" aria-hidden="true">
                        {it.letter}
                      </span>
                    )}
                    <a
                      href={`#${it.id}`}
                      aria-label={t.linkTo.replace('{term}', it.term)}
                      className="-mr-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.9375rem] font-semibold text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--k)]"
                    >
                      #
                    </a>
                  </dd>
                  <dd className="order-3 mt-2 flex flex-1 flex-col text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)] sm:text-base">
                    <span>{mark(it.def, q)}</span>
                    {it.see && (
                      <Link href={it.see.href} className="mt-auto inline-flex items-start gap-1.5 self-start pt-4 text-[0.875rem] font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline">
                        <span>
                          {t.related}: {it.see.label}
                        </span>
                        <ArrowRight size={15} className="arw mt-[0.2em] shrink-0" aria-hidden="true" />
                      </Link>
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>

          {count === 0 && <p className="mt-0 rounded-[1.25rem] bg-white px-6 py-8 text-[color:var(--text-tertiary)] ring-1 ring-[color:var(--border-light)]">{t.none}</p>}
        </div>
      </div>
    </div>
  )
}
