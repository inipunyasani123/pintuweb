import type { CSSProperties } from 'react'
import { PAYMENT_METHODS, type PaymentMethod } from '../lib/packages'

// Logo metode pembayaran yang diterima (urutan PAYMENT_METHODS di lib/packages.ts). Logo merek = berkas resmi apa adanya
// di public/images/bayar (bentuk & warna tidak diubah; sumber, lisensi, dan catatan merek dagang di
// public/images/SUMBER.md), selalu di atas latar putih seperti panduan mereknya. Transfer bank tidak memakai logo bank
// mana pun: ikon gedung bank buatan sendiri + teks. Logo hanya penunjuk metode yang diterima, bukan tanda kerja sama.

type Brand = Exclude<PaymentMethod, 'bank'>

/** Ukuran intrinsik = viewBox berkas. `k` = pengali tinggi supaya bobot visual setara (DANA & Tether berbentuk
 *  lingkaran penuh setinggi berkas, QRIS bertanda sudut, SeaBank berombak di bawah). */
const LOGO: Record<Brand, { src: string; w: number; h: number; alt: string; k: number }> = {
  qris: { src: '/images/bayar/qris.svg', w: 45.938, h: 17.413, alt: 'QRIS', k: 1.05 },
  dana: { src: '/images/bayar/dana.svg', w: 382, h: 109.22, alt: 'DANA', k: 0.9 },
  seabank: { src: '/images/bayar/seabank.svg', w: 252, h: 81, alt: 'SeaBank', k: 1.1 },
  usdt: { src: '/images/bayar/tether.svg', w: 467, h: 149, alt: 'Tether', k: 1 },
}

/** Ikon umum transfer bank (gedung berpilar), garis 1,75 seperti ikon situs lainnya. */
export function BankMark({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true" focusable="false">
      <path d="M3 9.2 12 4l9 5.2" />
      <path d="M4.5 9.6h15" />
      <path d="M6.5 10.8v6.4M10.2 10.8v6.4M13.8 10.8v6.4M17.5 10.8v6.4" />
      <path d="M4.5 17.6h15M3 20.2h18" />
    </svg>
  )
}

/**
 * Satu logo dengan tinggi dasar `size` px (dikali `k` per logo). `bankLabel` = teks di samping ikon transfer bank;
 * USDT diberi label "USDT" di samping logo Tether supaya nama metodenya terbaca.
 */
export function PayLogo({ m, size, bankLabel }: { m: PaymentMethod; size: number; bankLabel: string }) {
  if (m === 'bank') {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold leading-none text-[color:var(--primary-700)]" style={{ fontSize: `${Math.round(size * 0.68)}px` }}>
        <BankMark style={{ height: `${Math.round(size * 1.15)}px`, width: `${Math.round(size * 1.15)}px` }} className="shrink-0" />
        <span className="text-[color:var(--text-primary)]">{bankLabel}</span>
      </span>
    )
  }
  const l = LOGO[m]
  const h = Math.round(size * l.k)
  const w = Math.round((h * l.w) / l.h)
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- SVG statis kecil; next/image tidak menambah apa pun di sini
    <img src={l.src} alt={l.alt} width={w} height={h} loading="lazy" decoding="async" className="block shrink-0" style={{ height: h, width: w }} />
  )
  if (m !== 'usdt') return img
  return (
    <span className="inline-flex items-center gap-1.5">
      {img}
      <span className="font-semibold leading-none text-[color:var(--text-secondary)]" style={{ fontSize: `${Math.round(size * 0.62)}px` }}>
        USDT
      </span>
    </span>
  )
}

/** Deretan semua logo (strip footer & pembuka halaman Cara Bayar). Daftar berlabel supaya pembaca layar mendengar namanya. */
export function PayLogoRow({ size, bankLabel, label, className = '' }: { size: number; bankLabel: string; label: string; className?: string }) {
  return (
    <ul aria-label={label} className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      {PAYMENT_METHODS.map((m) => (
        <li key={m} className="flex items-center">
          <PayLogo m={m} size={size} bankLabel={bankLabel} />
        </li>
      ))}
    </ul>
  )
}
