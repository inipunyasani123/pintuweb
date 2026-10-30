'use client'

import { useEffect } from 'react'
import { rememberVisitRef, withSource } from '../lib/wa-ref'

/**
 * Tanpa tampilan. Menyimpan kode kunjungan (?ref=, ?utm_source=) dan menambah kode sumber ke tautan WhatsApp PintuWeb
 * tepat sebelum diikuti (klik, klik tengah, menu klik kanan, sentuh), jadi tautan di HTML tetap polos dan semua
 * komponen cukup memakai wa() dari lib/site.ts. Aturan kodenya ada di lib/wa-ref.ts.
 */
export default function WaSource() {
  useEffect(() => {
    rememberVisitRef(window.location.search)
    const tag = (e: Event) => {
      const a = (e.target instanceof Element ? e.target.closest('a[href^="https://wa.me/"]') : null) as HTMLAnchorElement | null
      if (!a) return
      const next = withSource(a.href, window.location.pathname)
      if (next !== a.href) a.href = next
    }
    const events = ['pointerdown', 'click', 'auxclick', 'contextmenu'] as const
    for (const ev of events) document.addEventListener(ev, tag, true)
    return () => {
      for (const ev of events) document.removeEventListener(ev, tag, true)
    }
  }, [])
  return null
}
