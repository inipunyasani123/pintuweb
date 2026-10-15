'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import type { Demo, DemoCategory } from '../../lib/demos'
import { CATEGORY_COLOR } from '../../lib/portals'
import type { Hl } from '../../i18n/dict/id'

type Filter = 'semua' | DemoCategory

export type DemoGalleryText = {
  badge: string
  h1: Hl
  lead: string
  note: string
  filterAria: string
  all: string
  search: string
  searchPh: string
  none: string
  /** mis. 'mulai' — diikuti harga mulai kategori demo */
  from: string
  /** templat dengan {n} dan {cat} */
  showingAll: string
  showingCat: string
  imgAlt: string
  newTab: string
  newTabShort: string
  seePackage: string
  ctaTitle: string
  ctaLead: string
  contact: string
  seePricing: string
}

/** Kategori lengkap dengan teks spanduknya (dirakit di server dari kamus & data paket). */
export type DemoCat = {
  id: DemoCategory
  label: string
  /** judul & kalimat galeri kategori ini */
  title: string
  tagline: string
  /** mis. "17 demo" */
  countText: string
  /** harga mulai, mis. "Rp600.000" */
  from: string
  packageHref: string
  portalHref: string
  /** mis. "Buka galeri Landing Page" */
  openLabel: string
}

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''))
const vars = (c: DemoCategory) => ({ '--k': CATEGORY_COLOR[c].color, '--k2': CATEGORY_COLOR[c].to }) as CSSProperties

// Galeri semua demo: pencarian, saringan kategori berwarna, spanduk kategori (harga + galeri khususnya),
// dan kisi kartu. Kategori tercermin di hash URL (/demo#undangan) supaya halaman lain bisa menautkannya.
export default function DemoGallery({ demos, cats, t, contactHref, pricingHref }: { demos: (Demo & { from?: string })[]; cats: DemoCat[]; t: DemoGalleryText; contactHref: string; pricingHref: string }) {
  const catOf = useMemo(() => Object.fromEntries(cats.map((c) => [c.id, c])) as Record<DemoCategory, DemoCat>, [cats])
  const [filter, setFilterState] = useState<Filter>('semua')
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const setFilter = (f: Filter) => {
    setFilterState(f)
    history.replaceState(null, '', f === 'semua' ? location.pathname : `#${f}`)
  }
  const [failed, setFailed] = useState<Set<string>>(() => new Set())
  const markFailed = (slug: string) => setFailed((prev) => new Set(prev).add(slug))

  // Gambar yang sudah gagal sebelum hydration tidak memicu onError — tangkap di sini.
  useEffect(() => {
    // Kategori dari hash, juga saat hash berubah setelah halaman terbuka (tautan ke /demo#kategori, tombol kembali).
    const fromHash = () => {
      const h = location.hash.slice(1)
      if (cats.some((c) => c.id === h)) {
        setFilterState(h as DemoCategory)
        setQuery('')
      } else if (!h) setFilterState('semua')
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    document.querySelectorAll<HTMLImageElement>('img[data-demo]').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) markFailed(img.dataset.demo!)
    })
    return () => window.removeEventListener('hashchange', fromHash)
  }, [cats])

  const counts = useMemo(() => {
    const c = {} as Record<DemoCategory, number>
    for (const d of demos) c[d.category] = (c[d.category] ?? 0) + 1
    return c
  }, [demos])

  const shown = useMemo(
    () => demos.filter((d) => (filter === 'semua' || d.category === filter) && (!q || d.name.toLowerCase().includes(q) || d.tagline.toLowerCase().includes(q) || catOf[d.category].label.toLowerCase().includes(q))),
    [demos, filter, q, catOf],
  )
  const banner = filter !== 'semua' && !q ? catOf[filter] : null
  // Beberapa demo memakai nama yang sama: entri kontes desain adalah beberapa konsep untuk satu merek
  // ("EthyleneAbsorber" x4, "Positive Crave" x5) dan pembedanya ada di tagline ("Konsep Korporat", ...).
  // Untuk nama seperti itu, tagline dijadikan judul kartu dan nama mereknya jadi keterangan, supaya tidak
  // tampak sebagai kartu ganda.
  const sharedNames = useMemo(() => {
    const n = new Map<string, number>()
    for (const d of demos) n.set(d.name, (n.get(d.name) ?? 0) + 1)
    return new Set([...n].filter(([, c]) => c > 1).map(([k]) => k))
  }, [demos])

  const chip = (id: Filter, label: string, n: number) => {
    const on = filter === id
    const c = id === 'semua' ? null : CATEGORY_COLOR[id]
    return (
      <button
        key={id}
        type="button"
        onClick={() => setFilter(id)}
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
    <main id="main-content" className="pt-28 sm:pt-36">
      {/* Kepala halaman */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="kicker text-[color:var(--primary-700)]">{t.badge}</p>
        <h1 className="mt-5 text-[2.4rem] leading-[1.06] text-[color:var(--text-primary)] sm:text-[3.25rem] lg:text-[3.75rem]">
          {t.h1[0]}
          <em className="text-[color:var(--primary-700)]">{t.h1[1]}</em>
          {t.h1[2] ?? ''}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--text-tertiary)] lg:text-[1.2rem]">{t.lead}</p>
        {t.note && <p className="mt-3 text-[0.9375rem] text-[color:var(--text-tertiary)]">{t.note}</p>}
      </div>

      <section className="mt-10 bg-[color:var(--surface-soft)] pb-16 pt-10 sm:mt-12 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Pencarian + kategori */}
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]" aria-hidden="true" />
            <label htmlFor="demo-search" className="sr-only">
              {t.search}
            </label>
            <input
              id="demo-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                // mencari berarti mencari di semua kategori
                if (e.target.value.trim() && filter !== 'semua') setFilter('semua')
              }}
              placeholder={t.searchPh}
              className="h-[3.25rem] w-full rounded-full border-0 bg-white ps-[3.25rem] pe-5 text-base text-[color:var(--text-primary)] outline-none ring-1 ring-[color:var(--border-light)] transition-shadow placeholder:text-[color:var(--text-muted)] focus:ring-2 focus:ring-[color:var(--primary-700)]"
            />
          </div>
          {/* Ponsel: sembilan pil memakan banyak baris, jadi kategori dipilih lewat satu menu. Layar lebih lebar: pil. */}
          <div className="relative mt-3 sm:hidden">
            <label htmlFor="demo-cat" className="sr-only">
              {t.filterAria}
            </label>
            <select
              id="demo-cat"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="h-12 w-full appearance-none rounded-full border-0 bg-white ps-5 pe-11 text-[0.9375rem] font-semibold text-[color:var(--text-primary)] outline-none ring-1 ring-[color:var(--border-light)] focus:ring-2 focus:ring-[color:var(--primary-700)]"
            >
              <option value="semua">
                {t.all} ({demos.length})
              </option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({counts[c.id]})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute end-5 top-1/2 h-2 w-2 -translate-y-[70%] rotate-45 border-b-2 border-r-2 border-[color:var(--text-secondary)]" aria-hidden="true" />
          </div>
          <div role="group" aria-label={t.filterAria} className="mt-4 hidden flex-wrap gap-2 sm:flex">
            {chip('semua', t.all, demos.length)}
            {cats.map((c) => chip(c.id, c.label, counts[c.id]))}
          </div>
          <p className="mt-4 text-[0.9375rem] text-[color:var(--text-tertiary)]" role="status">
            {filter === 'semua' ? fill(t.showingAll, { n: shown.length }) : fill(t.showingCat, { n: shown.length, cat: catOf[filter].label })}
          </p>

          {/* Spanduk kategori: apa jenisnya, mulai berapa, dan galeri khususnya */}
          {banner && (
            <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-[color:var(--border-light)]" style={vars(banner.id)}>
              <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10" style={{ backgroundImage: `linear-gradient(120deg, ${CATEGORY_COLOR[banner.id].tint} 0%, #ffffff 70%)` }}>
                <div className="min-w-0">
                  <p className="text-[0.8125rem] font-semibold text-[color:var(--k)]">
                    {banner.countText} · {t.from} {banner.from}
                  </p>
                  <h2 className="mt-1.5 text-[1.5rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.75rem]">{banner.title}</h2>
                  <p className="mt-1.5 max-w-xl leading-relaxed text-[color:var(--text-tertiary)]">{banner.tagline}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                  <Link href={banner.packageHref} className="btn btn-line btn-sm bg-white">
                    {t.seePackage} <ArrowRight size={15} className="arw" aria-hidden="true" />
                  </Link>
                  {/* Portal = zona Next terpisah: tautan biasa, bukan navigasi klien. */}
                  <a href={banner.portalHref} hrefLang="id" className="btn btn-sm text-white transition-[filter] duration-200 hover:brightness-90" style={{ backgroundImage: 'linear-gradient(135deg, var(--k), var(--k2))' }}>
                    {banner.openLabel} <ArrowUpRight size={15} className="arw arw-ne" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Kisi kartu */}
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {shown.map((d) => {
              const shared = sharedNames.has(d.name) && Boolean(d.tagline)
              const title = shared ? d.tagline : d.name
              const sub = shared ? d.name : d.tagline
              return (
              <li key={d.slug}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[1.125rem] bg-white p-1.5 ring-1 ring-[color:var(--border-light)] transition-shadow duration-300 hover:shadow-[0_24px_44px_-30px_var(--k)] sm:rounded-[1.375rem] sm:p-2"
                  style={vars(d.category)}
                >
                  <span className="relative block aspect-[1200/630] overflow-hidden rounded-[0.8rem] bg-[color:var(--neutral-100)] ring-1 ring-black/5 sm:rounded-[1rem]">
                    {failed.has(d.slug) ? (
                      // Cadangan bila gambar demo gagal dimuat
                      <span className="grid h-full w-full place-items-center p-3 text-center [background-image:linear-gradient(135deg,var(--k),var(--k2))]">
                        <span className="display text-base font-semibold text-white sm:text-lg">{title}</span>
                      </span>
                    ) : (
                      // Thumbnail lokal yang sudah diperkecil (lib/demos.ts); tidak perlu optimizer Next.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/demos/${d.slug}.webp`}
                        alt={fill(t.imgAlt, { name: shared ? `${d.name} (${d.tagline})` : d.name })}
                        width={720}
                        height={378}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        data-demo={d.slug}
                        onError={() => markFailed(d.slug)}
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    )}
                  </span>
                  <span className="flex flex-1 flex-col px-1.5 pb-1.5 pt-2.5 sm:px-2.5 sm:pb-2 sm:pt-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold leading-tight text-[color:var(--k)] sm:text-[0.8125rem]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full [background-image:linear-gradient(135deg,var(--k),var(--k2))] sm:h-2 sm:w-2" aria-hidden="true" />
                      {catOf[d.category].label}
                    </span>
                    <h2 className="mt-1 text-[0.9375rem] leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--k)] sm:mt-1.5 sm:text-[1.125rem]">{title}</h2>
                    {/* keterangan: di ponsel disembunyikan, kecuali untuk nama bersama (di sana ia nama mereknya) */}
                    {sub && <span className={`mt-1 leading-snug text-[color:var(--text-tertiary)] ${shared ? 'block text-[0.8125rem] sm:text-[0.875rem]' : 'hidden text-[0.875rem] sm:line-clamp-2'}`}>{sub}</span>}
                    <span className="mt-auto flex items-center justify-between gap-2 pt-2 text-[0.75rem] text-[color:var(--text-tertiary)] sm:pt-3 sm:text-[0.8125rem]">
                      <span>
                        {t.from} {d.from ?? catOf[d.category].from}
                      </span>
                      <ArrowUpRight size={15} className="arw-ne shrink-0 text-[color:var(--k)] transition-transform" aria-hidden="true" />
                    </span>
                    <span className="sr-only">{t.newTabShort}</span>
                  </span>
                </a>
              </li>
              )
            })}
          </ul>

          {shown.length === 0 && <p className="mt-6 rounded-[1.25rem] bg-white px-6 py-8 text-[color:var(--text-tertiary)] ring-1 ring-[color:var(--border-light)]">{t.none}</p>}

          {/* Ajakan */}
          <div className="mt-12 flex flex-col gap-6 rounded-[2rem] bg-[color:var(--primary-700)] p-8 text-white [background-image:linear-gradient(135deg,var(--primary-700),var(--primary-900))] sm:mt-16 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-2xl">
              <h2 className="text-[1.75rem] leading-[1.12] sm:text-[2.25rem]">{t.ctaTitle}</h2>
              <p className="mt-3 leading-relaxed text-white/85">{t.ctaLead}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link href={contactHref} className="btn btn-white">
                {t.contact}
              </Link>
              <Link href={pricingHref} className="btn btn-ghost-dark">
                {t.seePricing} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
