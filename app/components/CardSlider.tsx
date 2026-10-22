'use client'

import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Deretan kartu geser (scroll-snap) dengan tombol sebelumnya/berikutnya dan penanda posisi. Tanpa putar otomatis.
// Kartunya (<li>) dirakit di server dan dikirim sebagai children; komponen ini hanya mengurus gulir, tombol, dan
// titik penanda. Titik menyala untuk kartu yang sedang terlihat (ponsel 1, tablet 2, desktop 3), jadi tetap jujur di
// semua lebar. Di kanan-ke-kiri scrollLeft bernilai negatif dan arah "berikutnya" ke kiri; keduanya ditangani.

type Props = {
  label: string
  prev: string
  next: string
  children: ReactNode
  listClass?: string
}

export default function CardSlider({ label, prev, next, children, listClass = '' }: Props) {
  const ref = useRef<HTMLUListElement>(null)
  const count = Children.count(children)
  const [seen, setSeen] = useState<boolean[]>(() => Array.from({ length: count }, (_, i) => i === 0))
  const [edge, setEdge] = useState({ start: true, end: count <= 1 })

  useEffect(() => {
    const ul = ref.current
    if (!ul) return
    const items = Array.from(ul.children) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        setSeen((old) => {
          const now = [...old]
          for (const e of entries) now[items.indexOf(e.target as HTMLElement)] = e.intersectionRatio >= 0.6
          return now
        })
      },
      { root: ul, threshold: [0, 0.6, 1] },
    )
    items.forEach((el) => io.observe(el))
    const onScroll = () => {
      const x = Math.abs(ul.scrollLeft)
      const max = ul.scrollWidth - ul.clientWidth
      setEdge({ start: x <= 2, end: x >= max - 2 })
    }
    onScroll()
    ul.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      io.disconnect()
      ul.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const go = (dir: 1 | -1) => {
    const ul = ref.current
    if (!ul) return
    const first = ul.children[0] as HTMLElement | undefined
    const gap = parseFloat(getComputedStyle(ul).columnGap) || 0
    const step = (first?.offsetWidth ?? ul.clientWidth) + gap
    const rtl = getComputedStyle(ul).direction === 'rtl'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ul.scrollBy({ left: dir * step * (rtl ? -1 : 1), behavior: reduce ? 'auto' : 'smooth' })
  }

  const btn =
    'grid h-11 w-11 place-items-center rounded-full bg-white text-[color:var(--text-primary)] ring-1 ring-[color:var(--border-medium)] transition-colors hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-700)] disabled:cursor-default disabled:text-[color:var(--text-muted)] disabled:ring-[color:var(--border-light)] disabled:hover:ring-[color:var(--border-light)]'

  return (
    <div>
      <ul ref={ref} aria-label={label} className={`scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain ${listClass}`}>
        {children}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-4 sm:mt-5">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          {seen.map((on, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${on ? 'w-5 bg-[color:var(--primary-700)]' : 'w-1.5 bg-[color:var(--primary-200)]'}`} />
          ))}
        </span>
        <span className="flex gap-2">
          <button type="button" className={btn} onClick={() => go(-1)} disabled={edge.start} aria-label={prev}>
            <ChevronLeft size={20} className="rtl:-scale-x-100" aria-hidden="true" />
          </button>
          <button type="button" className={btn} onClick={() => go(1)} disabled={edge.end} aria-label={next}>
            <ChevronRight size={20} className="rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </span>
      </div>
    </div>
  )
}
