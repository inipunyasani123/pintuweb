// Potongan bersama halaman "Website untuk <usaha>" dan halaman kota sekitar: kartu demo, daftar FAQ, ajakan WhatsApp.
import { ArrowUpRight } from 'lucide-react'
import type { Demo } from '../lib/demos'
import { demoSrcSet, demoThumb } from '../lib/demos'

export const H2 = 'text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]'

/** Lebar kartu demo per tata letak: 2 kolom di bawah 1024px, lalu 3 atau 4 kolom (lihat gridDemo). */
const DEMO_SIZES = {
  3: '(min-width: 1152px) 352px, (min-width: 1024px) calc(33vw - 32px), (min-width: 640px) calc(50vw - 36px), calc(50vw - 22px)',
  4: '(min-width: 1152px) 258px, (min-width: 1024px) calc(25vw - 30px), (min-width: 640px) calc(50vw - 36px), calc(50vw - 22px)',
} as const

/**
 * Kolom daftar demo di layar lebar: kelipatan 4 (4, 8) jadi 4 kolom supaya tidak ada baris yang pincang
 * (8 demo = dua baris penuh, bukan 3+3+2); selain itu 3 kolom. Di bawah 1024px selalu 2 kolom.
 */
export function gridDemo(jumlah: number) {
  const kolom = jumlah > 0 && jumlah % 4 === 0 ? 4 : 3
  return { kolom, kelas: kolom === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3' } as const
}

/**
 * Kolom daftar paket: 4 paket = 2x2 dari 640px lalu 4 sebaris dari 1280px (bukan 3+1); selain itu 3 kolom dari 640px
 * (1 kolom di bawahnya). Empat sebaris baru dari xl: kartu 264px (lebar tetap kontainer) cukup untuk harga dan waktu
 * berdampingan, sedangkan di bawah itu harga seperti "IDR 3,000,000" terpotong ke dua baris.
 */
export const gridPaket = (jumlah: number) => (jumlah === 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-3')

export function DemoCard({ demo, why, open, newTab, cols = 3 }: { demo: Demo; why: string; open: string; newTab: string; cols?: 3 | 4 }) {
  return (
    <li className="flex flex-col">
      <a href={demo.url} target="_blank" rel="noopener noreferrer" className="group block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={demoThumb(demo.slug)}
          srcSet={demoSrcSet(demo.slug)}
          sizes={DEMO_SIZES[cols]}
          alt=""
          width={720}
          height={378}
          loading="lazy"
          decoding="async"
          className="block aspect-[1200/630] w-full rounded-lg border border-[color:var(--border-light)] object-cover object-top sm:rounded-xl"
        />
        <span className="mt-2.5 flex items-start justify-between gap-3 sm:mt-4">
          <span className="min-w-0">
            <span className="display block text-[1rem] leading-snug text-[color:var(--text-primary)] group-hover:text-[color:var(--primary-700)] sm:text-[1.3rem] sm:leading-tight">{demo.name}</span>
            <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)] sm:text-[0.9375rem]">{demo.tagline}</span>
          </span>
          <ArrowUpRight size={17} className="arw-ne mt-1 hidden shrink-0 text-[color:var(--primary-700)] transition-transform sm:block" aria-hidden="true" />
        </span>
        <span className="sr-only">
          {open}. {newTab}
        </span>
      </a>
      <p className="mt-1.5 text-[0.8125rem] leading-snug text-[color:var(--text-secondary)] sm:text-[0.9375rem] sm:leading-relaxed">{why}</p>
    </li>
  )
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-[color:var(--rule)]">
      {items.map((x) => (
        <details key={x.q} className="group border-b border-[color:var(--border-light)]">
          <summary className="flex cursor-pointer list-none items-start gap-6 py-4 text-start sm:py-5 [&::-webkit-details-marker]:hidden">
            <h3 className="flex-1 text-[1.0625rem] leading-snug text-[color:var(--text-primary)] group-open:text-[color:var(--primary-700)] sm:text-[1.1875rem]">{x.q}</h3>
            <span aria-hidden="true" className="relative mt-2.5 h-3 w-3 shrink-0 text-[color:var(--text-tertiary)] transition-transform duration-300 group-open:rotate-45 group-open:text-[color:var(--primary-700)]">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 pe-10 leading-relaxed text-[color:var(--text-secondary)]">{x.a}</p>
        </details>
      ))}
    </div>
  )
}

export function WaCta({ title, lead, label, href, newTab }: { title: string; lead: string; label: string; href: string; newTab: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.25rem] bg-[color:var(--primary-50)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6">
      <div className="min-w-0">
        <h2 className="text-[1.1875rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.3rem]">{title}</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{lead}</p>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-solid shrink-0">
        {label} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
        <span className="sr-only">{newTab}</span>
      </a>
    </div>
  )
}
