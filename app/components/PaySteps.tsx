// Cara bayar dalam tiga langkah bergambar (halaman harga): DP 50% → website jadi → pelunasan 50%. Kalimatnya di
// pages.pricing.pay (sama dengan PAYMENT_SUMMARY di lib/packages.ts); contoh angkanya dihitung dari paket yang
// direkomendasikan di lib/packages.ts, jadi ikut berubah bila harga berubah. Gambar = garis buatan sendiri dengan
// gaya yang sama seperti ilustrasi proyek klien (ClientArt): kanvas 64, garis 2px, satu bidang isi tembus pandang.

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** Gambar tiga langkah (juga dipakai halaman Cara Bayar). */
export const PAY_ART = [
  // separuh lingkaran terisi: bayar separuh dulu
  <>
    <circle cx="32" cy="32" r="21" />
    <path d="M32 11a21 21 0 0 1 0 42z" className="fill-current opacity-25" stroke="none" />
    <path d="M32 11v42" />
  </>,
  // jendela peramban dengan tanda centang: website selesai dan kamu periksa
  <>
    <rect x="8" y="12" width="48" height="38" rx="5" />
    <path d="M8 21h48" />
    <circle cx="14" cy="16.5" r="1.4" />
    <circle cx="19" cy="16.5" r="1.4" />
    <path d="M16 28h14M16 34h10" />
    <circle cx="43" cy="36" r="8" className="fill-current opacity-25" stroke="none" />
    <path d="M39 36l3 3 5-6" />
  </>,
  // lingkaran penuh dengan centang: lunas
  <>
    <circle cx="32" cy="32" r="21" className="fill-current opacity-25" stroke="none" />
    <circle cx="32" cy="32" r="21" />
    <path d="M23 32.5l6 6 12-13" />
  </>,
]

type Props = {
  kicker: string
  title: string
  steps: { title: string; body: string }[]
  example: string
  methods: string
  /** tautan ke halaman Cara Bayar & Metode Pembayaran */
  more?: { href: string; label: string }
}

export default function PaySteps({ kicker, title, steps, example, methods, more }: Props) {
  return (
    <div>
      <p className="kicker text-[color:var(--primary-700)]">{kicker}</p>
      <h2 id="pay-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
        {title}
      </h2>
      <ol className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 md:grid-cols-3 md:gap-5">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex items-center gap-4 rounded-[1.25rem] bg-white p-4 ring-1 ring-[color:var(--border-light)] md:flex-col md:items-start md:gap-0 md:p-6">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-14 w-14 shrink-0 text-[color:var(--primary-700)] md:h-16 md:w-16" aria-hidden="true" focusable="false">
              {PAY_ART[i]}
            </svg>
            <div className="min-w-0 md:mt-4">
              <h3 className="flex items-baseline gap-2 text-[1.125rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.1875rem]">
                <span className="tnum text-[0.875rem] font-semibold text-[color:var(--primary-700)]" aria-hidden="true">
                  {i + 1}
                </span>
                {s.title}
              </h3>
              <p className="mt-0.5 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)] md:mt-1">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 space-y-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] sm:mt-5">
        <p className="font-medium text-[color:var(--text-secondary)]">{example}</p>
        <p>
          {methods}
          {more && (
            <>
              {' '}
              <Link href={more.href} className="link inline-flex items-center gap-1 whitespace-nowrap font-semibold">
                {more.label} <ArrowRight size={14} className="arw" aria-hidden="true" />
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
