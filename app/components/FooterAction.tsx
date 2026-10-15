'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { parsePath, toPublicPath } from '../i18n/routes'

type Action = { href: string; label: string }

/**
 * Tombol di ajakan penutup footer: "Lihat harga", kecuali di halaman Paket sendiri (bahasa apa pun) — di sana
 * tombol itu hanya menaut ke halaman yang sedang dibuka, jadi gantinya menuju galeri demo.
 * Footer ada di layout (tidak dirender ulang per halaman), karena itu pemeriksaannya di klien lewat usePathname.
 */
export default function FooterAction({ pricing, demos }: { pricing: Action; demos: Action }) {
  // usePathname() di server berisi path internal (/id/paket): samakan dulu dengan path publik
  const onPricing = parsePath(toPublicPath(usePathname() ?? '/'))?.ref.key === 'pricing'
  const a = onPricing ? demos : pricing
  return (
    <Link href={a.href} className="btn btn-ghost-dark mt-9">
      {a.label} <ArrowRight size={17} className="arw" aria-hidden="true" />
    </Link>
  )
}
