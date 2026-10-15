'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Globe, MessageCircle } from 'lucide-react'
import { LANGS, LANG_INFO, type Lang } from '../i18n/config'
import { switchPath, toPublicPath } from '../i18n/routes'
import { Logo } from './Logo'

export type HeaderProps = {
  lang: Lang
  homeHref: string
  nav: { label: string; href: string }[]
  waHref: string
  waDisplay: string
  t: {
    tagline: string
    brandAria: string
    logoAlt: string
    mainNav: string
    mobileNav: string
    guarantee: string
    consult: string
    consultFree: string
    openMenu: string
    closeMenu: string
    menu: string
    demosReady: string
    respond: string
    language: string
    notAvailable: string
    /** keterangan pembaca layar untuk tautan yang membuka tab baru */
    newTab: string
  }
}

/**
 * Pemilih bahasa: tombol (bola dunia + kode bahasa) yang membuka daftar semua bahasa dengan namanya sendiri.
 * Tiap butir menaut ke halaman padanan; bahasa yang belum punya versi halaman ini tampil nonaktif.
 * `big` = versi di lembar menu ponsel: tombol selebar lembar, daftarnya terbuka di bawahnya (bukan melayang).
 */
function LangSwitch({ lang, label, notAvailable, onPick, big = false }: { lang: Lang; label: string; notAvailable: string; onPick?: () => void; big?: boolean }) {
  const pathname = toPublicPath(usePathname() ?? '/')
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const cur = LANG_INFO[lang]

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    // Esc menutup daftar dan mengembalikan fokus ke tombolnya. Didengar di fase capture dan ditandai
    // preventDefault, supaya Esc yang sama tidak ikut menutup lembar menu ponsel (lihat Header).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      setOpen(false)
      btn.current?.focus()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [open])
  // pindah halaman = tutup daftar
  useEffect(() => setOpen(false), [pathname])

  const row = big
    ? 'flex min-h-11 items-center justify-between gap-2 rounded-xl px-3 text-[0.9375rem]'
    : 'flex min-h-10 items-center justify-between gap-3 rounded-xl px-3 text-[0.9375rem]'

  return (
    <div
      ref={box}
      className={big ? 'w-full' : 'relative'}
      // fokus pindah ke luar pemilih (Tab/Shift+Tab melewati daftar): tutup daftarnya
      onBlur={(e) => {
        if (open && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        // versi lembar menu: teks terlihatnya "Bahasa" + nama bahasa, jadi label ini memuat keduanya. Versi bilah:
        // nama aksesibelnya dari isi tombol (kode bahasa yang terlihat lebih dulu, lalu teks sr-only), WCAG 2.5.3.
        aria-label={big ? `${label}: ${cur.name}` : undefined}
        onClick={() => setOpen((v) => !v)}
        className={
          big
            ? 'flex h-12 w-full items-center gap-2.5 rounded-2xl bg-[color:var(--surface-soft)] px-4 text-[0.9375rem] text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)]'
            : 'inline-flex h-9 items-center gap-1.5 rounded-full bg-[color:var(--surface-soft)] pe-2 ps-2.5 text-[0.8125rem] font-semibold text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] transition-colors hover:text-[color:var(--primary-700)]'
        }
      >
        <Globe size={big ? 18 : 15} strokeWidth={1.75} className="shrink-0" aria-hidden="true" />
        {big ? (
          <>
            {/* spasi di antara kedua span: tidak tampil (item flex), tapi teks terlihatnya jadi "Bahasa Bahasa Indonesia",
                sesuai aria-label (WCAG 2.5.3) */}
            <span>{label}</span>{' '}
            <span lang={cur.htmlLang} className="ms-auto font-semibold text-[color:var(--text-primary)]">
              {cur.name}
            </span>
          </>
        ) : (
          <>
            <span>{cur.short}</span>
            <span className="sr-only">
              , {label}: {cur.name}
            </span>
          </>
        )}
        <ChevronDown size={big ? 18 : 14} className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <ul
        id={listId}
        hidden={!open}
        className={
          big
            ? 'mt-2 grid grid-cols-2 gap-1.5'
            : 'absolute end-0 top-[calc(100%+0.625rem)] z-50 max-h-[min(70vh,32rem)] w-60 overflow-y-auto rounded-2xl bg-white p-1.5 shadow-[0_24px_48px_-24px_rgb(15_29_58/0.45)] ring-1 ring-[color:var(--border-light)]'
        }
      >
        {LANGS.map((l) => {
          const href = switchPath(pathname, l)
          const info = LANG_INFO[l]
          const frame = big ? 'bg-white ring-1 ring-[color:var(--border-light)]' : ''
          if (l === lang) {
            return (
              <li key={l}>
                <span lang={info.htmlLang} aria-current="true" className={`${row} bg-[color:var(--primary-50)] font-semibold text-[color:var(--primary-700)]`}>
                  {info.name}
                  <Check size={16} className="shrink-0" aria-hidden="true" />
                </span>
              </li>
            )
          }
          if (!href) {
            return (
              <li key={l}>
                <span lang={info.htmlLang} aria-disabled="true" title={notAvailable} className={`${row} ${frame} cursor-not-allowed text-[color:var(--text-muted)]`}>
                  <span className="line-through">{info.name}</span>
                  <span className="sr-only"> ({notAvailable})</span>
                </span>
              </li>
            )
          }
          return (
            <li key={l}>
              <a
                href={href}
                hrefLang={info.hreflang}
                lang={info.htmlLang}
                onClick={() => {
                  setOpen(false)
                  onPick?.()
                }}
                className={`${row} ${frame} text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--primary-700)]`}
              >
                {info.name}
                {/* kode bahasa hanya di menu desktop; di kisi ponsel nama saja supaya tidak terpotong dua baris */}
                {!big && (
                  <span className="text-[0.75rem] font-semibold text-[color:var(--text-muted)]" aria-hidden="true">
                    {info.short}
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Navbar = bilah membulat yang mengambang di atas halaman. Bersembunyi saat menggulir turun, muncul lagi saat
// menggulir naik. Di bawah lg, tautan pindah ke lembar menu yang turun dari bilah.
export default function Header({ lang, homeHref, nav, waHref, waDisplay, t }: HeaderProps) {
  const pathname = toPublicPath(usePathname() ?? '/')
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  // di puncak halaman bilahnya lebih tembus; setelah digulir lebih pekat dan berbayang
  const [scrolled, setScrolled] = useState(false)

  const lastY = useRef(0)
  const ticking = useRef(false)
  const menuBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      window.requestAnimationFrame(() => {
        const y = window.scrollY
        setVisible(y < 80 || y < lastY.current)
        setScrolled(y > 12)
        lastY.current = y
        ticking.current = false
      })
      ticking.current = true
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    // Esc menutup lembar menu dan mengembalikan fokus ke tombol Menu, kecuali Esc itu sudah dipakai pemilih bahasa
    // untuk menutup daftarnya sendiri (defaultPrevented).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      setMenuOpen(false)
      menuBtn.current?.focus()
    }
    // Selama lembar menu terbuka, isi halaman di belakangnya inert: Tab berputar di bilah & lembar menu saja,
    // tidak tersesat ke konten yang tertutup tirai.
    const behind = [...document.querySelectorAll<HTMLElement>('.skip-link, main, footer')].filter((el) => !el.inert)
    behind.forEach((el) => (el.inert = true))
    // lembar menu hanya ada di bawah 1024px: bila layar melebar selagi terbuka, tutup (supaya halaman tidak tertinggal inert)
    const wide = window.matchMedia('(min-width: 1024px)')
    const onWide = () => wide.matches && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
      behind.forEach((el) => (el.inert = false))
    }
  }, [menuOpen])

  // Pindah halaman = tutup menu
  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {/* Tirai di belakang lembar menu */}
      <div
        className={`fixed inset-0 z-40 bg-[rgb(15_29_58/0.35)] backdrop-blur-[2px] transition-opacity duration-200 lg:hidden ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <header className={`pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300 sm:px-5 ${visible || menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div
          className={`pointer-events-auto mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-3 rounded-full ps-4 pe-2 ring-1 backdrop-blur-md transition-[background-color,box-shadow] duration-300 max-[359px]:gap-2 sm:ps-5 ${
            scrolled || menuOpen
              ? 'bg-white/95 shadow-[0_16px_36px_-22px_rgb(15_29_58/0.45)] ring-[color:var(--border-light)]'
              : 'bg-white/80 shadow-[0_10px_28px_-22px_rgb(15_29_58/0.35)] ring-white/80'
          }`}
        >
          <Link href={homeHref} prefetch={false} className="shrink-0 rounded-full" aria-label={t.brandAria}>
            <Logo priority />
          </Link>

          <nav aria-label={t.mainNav} className="hidden items-center gap-0.5 lg:flex">
            {nav.map((n) => {
              const active = isActive(n.href)
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9375rem] font-medium transition-colors xl:px-3.5 ${
                    active ? 'bg-[color:var(--primary-50)] text-[color:var(--primary-700)]' : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--text-primary)]'
                  }`}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>

          {/* di bawah 360px jarak & bantalan sedikit dirapatkan supaya tombol WhatsApp + Menu muat dalam semua bahasa */}
          <div className="flex shrink-0 items-center gap-2 max-[359px]:gap-1.5">
            <div className="hidden items-center gap-2.5 md:flex">
              <LangSwitch lang={lang} label={t.language} notAvailable={t.notAvailable} />
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid btn-sm">
                {t.consult} <ArrowUpRight size={16} className="arw arw-ne" aria-hidden="true" />
              </a>
            </div>

            {/* Ponsel (<768px): konsultasi WhatsApp tetap satu ketukan, di samping Menu. Di bawah 640px hanya ikon
                (labelnya tetap dibacakan, sr-only) supaya bilah muat di 320px dalam semua bahasa. */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--primary-700)] px-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--primary-800)] sm:pe-4 md:hidden"
            >
              <MessageCircle size={19} strokeWidth={2} className="shrink-0" aria-hidden="true" />
              <span className="max-sm:sr-only">{t.consult}</span>
              <span className="sr-only"> {t.newTab}</span>
            </a>

            <button
              ref={menuBtn}
              className="inline-flex h-11 items-center gap-2.5 rounded-full bg-[color:var(--surface-soft)] ps-4 pe-3.5 text-sm font-semibold text-[color:var(--text-primary)] ring-1 ring-[color:var(--border-light)] max-[359px]:gap-2 max-[359px]:ps-3.5 max-[359px]:pe-3 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true">{t.menu}</span>
              <span aria-hidden="true" className="relative block h-3 w-[1.125rem]">
                <span className={`absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-transform duration-200 ${menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[2px]'}`} />
                <span className={`absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-transform duration-200 ${menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-[2px]'}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Lembar menu (ponsel & tablet) */}
        <div
          id="mobile-menu"
          className={`pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-5.75rem)] max-w-6xl overflow-y-auto rounded-[1.75rem] bg-white p-2.5 shadow-[0_30px_60px_-30px_rgb(15_29_58/0.55)] ring-1 ring-[color:var(--border-light)] transition-[opacity,transform,visibility] duration-200 lg:hidden ${
            menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          <nav aria-label={t.mobileNav}>
            <ul>
              {nav.map((n) => {
                const active = isActive(n.href)
                return (
                  <li key={n.href}>
                    {/* prefetch={false}: lembar menu tertutup tetap "terlihat" oleh IntersectionObserver di ponsel,
                        jadi tanpa ini ketujuh halaman di-prefetch di setiap kunjungan */}
                    <Link
                      href={n.href}
                      prefetch={false}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-[1.1875rem] font-semibold transition-colors ${
                        active ? 'bg-[color:var(--primary-50)] text-[color:var(--primary-700)]' : 'text-[color:var(--text-primary)] hover:bg-[color:var(--surface-soft)]'
                      }`}
                    >
                      {n.label}
                      <ArrowRight size={18} className={`rtl:-scale-x-100 ${active ? 'text-[color:var(--primary-700)]' : 'text-[color:var(--text-muted)]'}`} aria-hidden="true" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-2 border-t border-[color:var(--border-light)] px-1.5 pb-1.5 pt-3">
            <div className="md:hidden">
              <LangSwitch lang={lang} label={t.language} notAvailable={t.notAvailable} onPick={() => setMenuOpen(false)} big />
            </div>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="btn btn-solid mt-3 w-full md:mt-0">
              {t.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
            </a>
            <p className="mt-3 text-center text-sm text-[color:var(--text-tertiary)]">
              {t.respond} · <bdi className="text-[color:var(--text-primary)]">{waDisplay}</bdi>
            </p>
          </div>
        </div>
      </header>
    </>
  )
}
