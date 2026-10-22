'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

// Tab aksesibel (pola tablist/tab/tabpanel WAI-ARIA): panah kiri-kanan (dan atas-bawah) pindah pilihan, Home/End ke
// ujung, hanya tab terpilih yang masuk urutan Tab. Isi panel dirakit di server dan SEMUA panel tetap ada di HTML
// (terbaca mesin pencari). Komponen ini mengembalikan dua saudara (daftar tab, lalu wadah panel) supaya pemanggil
// bebas menaruh keduanya di sel grid yang berbeda.
//
// mode 'stack': semua panel ditumpuk di satu sel grid dan panel yang tidak aktif hanya dibuat tak terlihat, jadi
//   tinggi wadah = panel tertinggi dan berganti pilihan tidak menggeser apa pun (pemilih kebutuhan di beranda).
// mode 'hide': panel yang tidak aktif `hidden` (kelompok paket di halaman harga). `anchors` (slug kartu → nomor tab)
//   membuat tautan #slug dari mana pun (peta harga, pemandu paket, halaman lain) membuka tab kartu itu, lalu
//   menggulir ke kartunya dan membuka isinya.

type Tab = { id: string; label: ReactNode }

type Props = {
  idBase: string
  /** nama daftar tab untuk pembaca layar */
  label: string
  tabs: Tab[]
  panels: ReactNode[]
  mode?: 'stack' | 'hide'
  listClass: string
  tabClass: string
  onClass: string
  offClass: string
  panelsClass?: string
  panelClass?: string
  anchors?: Record<string, number>
}

export default function Tabs({ idBase, label, tabs, panels, mode = 'stack', listClass, tabClass, onClass, offClass, panelsClass = '', panelClass = '', anchors }: Props) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!anchors) return
    const go = (slug: string) => {
      const i = anchors[slug]
      if (i === undefined) return false
      setActive(i)
      // tunggu panelnya tampil dulu, baru gulir (scroll-padding-top di <html> menjaga jarak dari navbar)
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(slug)
          if (!el) return
          const more = el.querySelector('details')
          if (more) more.open = true
          el.scrollIntoView({ block: 'start' })
        }),
      )
      return true
    }
    const fromHash = () => go(decodeURIComponent(location.hash.slice(1)))
    if (location.hash) fromHash()
    // tautan ke #slug yang sama dengan alamat sekarang tidak memicu hashchange: tangani langsung
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]')
      const slug = a?.getAttribute('href')?.slice(1)
      if (slug && slug in anchors && location.hash === `#${slug}`) {
        e.preventDefault()
        go(slug)
      }
    }
    window.addEventListener('hashchange', fromHash)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', fromHash)
      document.removeEventListener('click', onClick)
    }
  }, [anchors])

  const pick = (i: number) => {
    setActive(i)
    refs.current[i]?.focus()
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl'
    const n = tabs.length
    const next = rtl ? 'ArrowLeft' : 'ArrowRight'
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft'
    let to: number | null = null
    if (e.key === next || e.key === 'ArrowDown') to = (active + 1) % n
    else if (e.key === prev || e.key === 'ArrowUp') to = (active - 1 + n) % n
    else if (e.key === 'Home') to = 0
    else if (e.key === 'End') to = n - 1
    if (to === null) return
    e.preventDefault()
    pick(to)
  }

  return (
    <>
      <div role="tablist" aria-label={label} className={listClass} onKeyDown={onKey}>
        {tabs.map((t, i) => {
          const on = i === active
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${idBase}-t-${t.id}`}
              aria-selected={on}
              aria-controls={`${idBase}-p-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`${tabClass} ${on ? onClass : offClass}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div className={`${mode === 'stack' ? 'grid' : ''} ${panelsClass}`}>
        {panels.map((p, i) => {
          const on = i === active
          const t = tabs[i]
          return (
            <div
              key={t.id}
              role="tabpanel"
              id={`${idBase}-p-${t.id}`}
              aria-labelledby={`${idBase}-t-${t.id}`}
              hidden={mode === 'hide' && !on}
              className={`${mode === 'stack' ? `[grid-area:1/1] ${on ? '' : 'invisible'}` : ''} ${panelClass}`}
            >
              {p}
            </div>
          )
        })}
      </div>
    </>
  )
}
