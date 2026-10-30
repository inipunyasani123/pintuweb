'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { parsePath, toPublicPath } from '../i18n/routes'

type Props = {
  aria: string
  demo: { href: string; label: string }
  pricing: { href: string; label: string }
  chat: string
  newTab: string
  /** Tautan WhatsApp (wa()) bawaan, dan yang khusus untuk halaman tertentu (kunci = PageKey). */
  waDefault: string
  waByPage: Partial<Record<string, string>>
}

/**
 * Bilah aksi lengket di bawah layar ponsel (< 768 px): "Lihat demo" (di halaman demo: "Lihat harga") dan Chat WhatsApp.
 * Muncul setelah layar pertama terlewati (gulir > 80% tinggi layar); tersembunyi (visibility hidden + inert) selama footer atau
 * ajakan WhatsApp utama (elemen ber-data-wa-cta) terlihat, dan di halaman legal serta halaman tanpa kerangka situs.
 * Karena bilah hilang begitu footer tampak, isi halaman tidak pernah tertutup di ujung bawah.
 */
export default function StickyBar({ aria, demo, pricing, chat, newTab, waDefault, waByPage }: Props) {
  const pathname = toPublicPath(usePathname() ?? '/')
  const key = parsePath(pathname)?.ref.key
  const allowed = Boolean(key) && key !== 'privacy' && key !== 'terms'
  const [passed, setPassed] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    setPassed(false)
    setBlocked(false)
    if (!allowed) return
    let raf = 0
    const check = () => {
      raf = 0
      setPassed(window.scrollY > window.innerHeight * 0.8)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })

    // footer atau ajakan WhatsApp utama terlihat -> bilah mengalah
    const seen = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))
      setBlocked(seen.size > 0)
    })
    document.querySelectorAll('footer, [data-wa-cta]').forEach((el) => io.observe(el))
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [allowed, pathname])

  if (!allowed) return null
  const shown = passed && !blocked
  const second = key === 'demo' ? pricing : demo
  const waHref = waByPage[key as string] ?? waDefault

  return (
    <div
      role="region"
      aria-label={aria}
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border-light)] bg-white/95 px-3 pt-2.5 shadow-[0_-12px_28px_-22px_rgb(15_29_58/0.5)] backdrop-blur-md transition-[transform,visibility] duration-200 motion-reduce:transition-none md:hidden ${shown ? 'visible translate-y-0' : 'invisible translate-y-full'}`}
      style={{ paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-md gap-2.5">
        <Link href={second.href} className="btn btn-line shrink-0 whitespace-nowrap">
          {second.label}
        </Link>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-solid min-w-0 flex-1 whitespace-nowrap">
          <MessageCircle size={17} aria-hidden="true" /> {chat}
          <span className="sr-only">{newTab}</span>
        </a>
      </div>
    </div>
  )
}
