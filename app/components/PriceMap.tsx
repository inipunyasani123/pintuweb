import Link from 'next/link'
import type { CSSProperties } from 'react'
import { PACKAGES, byPrice, isPriced, pricedOnly } from '../lib/packages'
import { getDict } from '../i18n'
import { currencyCode, groupText, moneyCompact, moneyShort, packagesFor, quoteText } from '../i18n/facts'
import { LANG_INFO, type Lang } from '../i18n/config'

// "Peta harga": semua paket diurutkan dari yang termurah, masing-masing dengan batang kisaran harganya pada
// satu skala bersama, sehingga terlihat sekilas paket mana yang masuk anggaran. Server component (tanpa
// JavaScript); setiap baris menaut ke kartu paketnya. Dipakai di beranda dan di halaman harga.
// Angka selalu dari lib/packages.ts. Paket "sesuai kebutuhan" (quote, tanpa angka) tidak ikut skala: ia tampil sebagai
// baris terakhir TANPA batang, dipisah garis putus-putus, dengan kalimat quoteText().line di tempat harganya.

// Skala berpita: tiap pita sama lebar supaya paket murah tidak tergencet oleh yang jutaan.
// Batasnya ditulis di sumbu, dan pita terakhir berakhir di harga tertinggi yang ada (22 Okt 2026: 500 rb · 1 jt · 3 jt ·
// 10 jt, mengikuti batas harga paket yang baru: banyak paket mulai/berakhir tepat di 1 jt, 3 jt, dan 10 jt).
const STOPS = [0, 500_000, 1_000_000, 3_000_000]
const TOP = Math.max(...pricedOnly(PACKAGES).map((p) => p.maxPrice), STOPS[STOPS.length - 1] + 1)
export const BOUNDS = [...STOPS, TOP]
export const BANDS = BOUNDS.length - 1

/** posisi (0-100) suatu harga pada skala berpita (juga dipakai peta mini di petak janji, WhyUs) */
export function pricePos(v: number) {
  for (let i = 0; i < BANDS; i++) {
    if (v <= BOUNDS[i + 1]) return ((i + (v - BOUNDS[i]) / (BOUNDS[i + 1] - BOUNDS[i])) / BANDS) * 100
  }
  return 100
}

// Kolom bersama sumbu & baris, dan kelas baris/teks/batang: kelas pm-* di globals.css (isinya utilitas yang sama; dipindah
// supaya HTML beranda tidak mengulangnya 15 kali). Garis skala digambar latar .pm-track untuk 4 pita.
const COLS = 'pm-cols'
if (BANDS !== 4) throw new Error(`PriceMap: ${BANDS} pita, padahal garis skala .pm-track di globals.css dibuat untuk 4 pita`)

type Props = {
  lang: Lang
  /** awalan tautan baris; slug paket ditambahkan di belakangnya (mis. "/paket#" atau "#") */
  base: string
  /** warna panel: 'soft' untuk bagian berlatar putih, 'white' untuk bagian berlatar lembut */
  tone?: 'soft' | 'white'
  className?: string
}

export default function PriceMap({ lang, base, tone = 'soft', className = '' }: Props) {
  const t = getDict(lang).pricing
  const groupTitle = groupText(lang)
  const items = byPrice(packagesFor(lang))
  const hasOpen = items.some((p) => p.openEnded)
  const quote = quoteText(lang)
  const panel = tone === 'white' ? 'bg-white ring-1 ring-[color:var(--border-light)]' : 'bg-[color:var(--surface-soft)]'
  const bg = tone === 'white' ? 'bg-white' : 'bg-[color:var(--surface-soft)]'
  const rowHover = tone === 'white' ? 'pm-row-w' : 'pm-row-s'
  // Jangkar di halaman yang sama memakai <a> biasa: navigasi klien Next tidak memicu :target (sorotan kartu tujuan).
  const Row = base.startsWith('#') ? 'a' : Link
  // kanan-ke-kiri: posisi memakai inset-inline-start, gradasi batang dan irisannya dicerminkan
  const rtl = LANG_INFO[lang].dir === 'rtl'

  return (
    <div className={`rounded-[1.75rem] p-2 pb-4 sm:p-4 sm:pb-5 lg:p-5 ${panel} ${className}`}>
      {/* Sumbu: tetap terlihat selama daftar digulir. Sudutnya sengaja siku: warnanya sama dengan panel, jadi saat diam
          tidak terlihat bedanya, sedangkan sudut membulat membuat teks baris tembus di pojoknya saat sumbu menempel. */}
      <div className={`pm-axis ${bg} ${COLS}`} aria-hidden="true">
        <span className="hidden md:block">{t.colPackage}</span>
        <span className="relative me-7 block h-5 md:me-0">
          <span className="absolute start-0">{currencyCode(lang)}</span>
          {BOUNDS.slice(1).map((b, i) => (
            <span
              key={b}
              className={`absolute whitespace-nowrap ${i === BANDS - 1 ? 'end-0 hidden sm:block md:hidden lg:block' : '-translate-x-1/2 rtl:translate-x-1/2'}`}
              style={i === BANDS - 1 ? undefined : { insetInlineStart: `${((i + 1) / BANDS) * 100}%` }}
            >
              {moneyCompact(lang, b)}
            </span>
          ))}
        </span>
        <span className="hidden text-end md:block">{t.colPrice}</span>
      </div>

      <ul>
        {items.map((p) => {
          if (!isPriced(p)) {
            // tanpa angka: tidak ada batang; nama di kiri, kalimat "harga sesuai kebutuhan" rata kanan selebar kolom
            // batang + harga (ponsel: di bawah nama)
            return (
              <li key={p.slug} className="mt-1.5 border-t border-dashed border-[color:var(--primary-200)] pt-1.5">
                <Row href={base + p.slug} className={`group pm-row ${rowHover} ${COLS}`}>
                  <span className="block min-w-0 md:py-3">
                    <span className="pm-name">{p.title}</span>
                    <span className="pm-meta">
                      {groupTitle[p.group].title} · {p.duration}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[0.875rem] font-semibold leading-snug text-[color:var(--text-primary)] md:col-span-2 md:mt-0 md:text-end md:text-[0.9375rem]">{quote.line}</span>
                </Row>
              </li>
            )
          }
          const a = pricePos(p.minPrice)
          const w = pricePos(p.maxPrice) - a
          const price = moneyShort(lang, p)
          // irisan gradasi bersama yang ditampilkan batang ini (0–100)
          const slice = w >= 100 ? 0 : (a / (100 - w)) * 100
          return (
            <li key={p.slug}>
              <Row href={base + p.slug} className={`group pm-row ${rowHover} ${COLS}`}>
                {/* ponsel: nama & kisaran harga sebaris, batang tepat di bawahnya (ringkas; lama pengerjaan ada di kartu
                    paket); desktop: kolom nama (+ kelompok & lama pengerjaan) · batang · harga */}
                <span className="pm-top">
                  <span className="min-w-0">
                    <span className="pm-name">{p.title}</span>
                    <span className="pm-meta">
                      {groupTitle[p.group].title} · {p.duration}
                    </span>
                  </span>
                  <span className="pm-pm">{price}</span>
                </span>
                <span className="pm-pd">{price}</span>

                {/* Batang kisaran harga pada skala bersama */}
                <span className="pm-track" aria-hidden="true">
                  <span
                    className="pm-bar"
                    style={
                      {
                        insetInlineStart: `${a}%`,
                        width: `${w}%`,
                        // satu gradasi untuk seluruh skala: tiap batang menampilkan irisannya sendiri
                        backgroundImage: `linear-gradient(${rtl ? 270 : 90}deg, var(--accent-400), var(--primary-700))`,
                        backgroundSize: `${(100 / w) * 100}% 100%`,
                        backgroundPosition: `${rtl ? 100 - slice : slice}% 0`,
                      } as CSSProperties
                    }
                  />
                  {p.openEnded &&
                    // bisa lebih dari batas atas: ekor titik-titik
                    [0, 1, 2].map((k) => (
                      <span key={k} className="pm-dot" style={{ insetInlineStart: `calc(${a + w}% + ${5 + k * 7}px)`, opacity: 0.75 - k * 0.22 }} />
                    ))}
                </span>
              </Row>
            </li>
          )
        })}
      </ul>

      <div className="mt-3 space-y-1.5 px-3 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)] md:px-4">
        {hasOpen && (
          <p className="flex items-center gap-2.5">
            <span className="flex shrink-0 gap-[3px]" aria-hidden="true">
              {[0.75, 0.53, 0.31].map((o) => (
                <span key={o} className="h-1 w-1 rounded-full bg-[color:var(--primary-700)]" style={{ opacity: o }} />
              ))}
            </span>
            {t.openNote}
          </p>
        )}
        {/* di mana harga jatuh dalam kisarannya: kalimat netral, tanpa aturan per paket */}
        <p className="max-w-3xl">{t.rangeNote}</p>
      </div>
    </div>
  )
}
