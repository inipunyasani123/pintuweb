'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export type Kind = {
  href: string
  title: string
  tagline: string
  /** mis. "17 demo" */
  count: string
  /** mis. "mulai Rp600.000" */
  price: string
  image: string
  /** nama tautan galeri, mis. "Buka galeri Landing Page" */
  open: string
  /** "Detail & harga": halaman layanan jenis ini, atau kartu paketnya di halaman harga */
  detailHref: string
  /** nama aksesibel tautan detail, unik per baris (mis. "Detail & harga Landing Page") */
  detailAria: string
  /** warna khas jenis ini (lib/portals.ts CATEGORY_COLOR): warna kuat, ujung gradasi, & latar mudanya */
  color: string
  to: string
  tint: string
}

/** "IDR 1 250 000": kode mata uang tidak boleh terpisah dari angkanya saat baris turun (spasi tak-terputus). */
const keepPrice = (s: string) => s.replace(/IDR /g, 'IDR ')

// Sembilan jenis website sebagai daftar rapi + satu pratinjau besar, masing-masing dengan gradasi warna khasnya.
// Tiap baris punya dua tautan: nama jenisnya membuka galeri (lapisan ::after-nya menutupi seluruh baris, jadi baris
// tetap bisa diklik di mana saja), dan "Detail & harga" di atas lapisan itu menuju halaman layanan/paketnya.
// Menyorot atau memfokus baris mengganti pratinjau dan warna panggungnya (desktop). Di ponsel tiap baris punya
// gambar kecil sendiri dengan garis warna.
export default function Kinds({ items, heading, hint, detail, note }: { items: Kind[]; heading: string; hint: string; detail: string; note?: string }) {
  const [active, setActive] = useState(0)
  // Pratinjau lain baru dimuat setelah daftar disentuh pertama kali, supaya halaman awal tetap ringan.
  const [armed, setArmed] = useState(false)
  const cur = items[active]

  return (
    <div className="mx-auto mt-12 max-w-6xl sm:mt-10 sm:px-6 lg:mt-14 xl:mt-16">
      <div className="bg-[color:var(--surface-soft)] px-4 py-8 sm:rounded-[2rem] sm:p-10 lg:p-12">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-[1.375rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.875rem]">{heading}</h2>
          <p className="hidden text-sm text-[color:var(--text-tertiary)] lg:block">{hint}</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-8 sm:mt-7 lg:mt-9 lg:grid-cols-12 lg:items-start lg:gap-10">
          <ul className="-mx-2 lg:col-span-6 lg:mx-0" onPointerEnter={() => setArmed(true)}>
            {items.map((it, i) => {
              const on = i === active
              return (
                // --k = warna kuat, --k2 = ujung gradasi, --kt = latar muda. Kisi baris: gambar/lencana | teks | (harga) | panah.
                // Ponsel (<640px): nama, "jumlah · harga", lalu "Detail & harga" bertumpuk. Mulai 640px: dua baris, dengan
                // harga dan "Detail & harga" di kolom kanan. Mulai 1024px gambar kecil diganti lencana nomor.
                <li
                  key={it.href}
                  style={{ '--k': it.color, '--k2': it.to, '--kt': it.tint } as CSSProperties}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => {
                    setActive(i)
                    setArmed(true)
                  }}
                  className={`group relative grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-2xl px-2 py-2 transition-colors duration-200 [grid-template-areas:'thumb_title_go''thumb_meta_go''thumb_detail_go'] sm:grid-cols-[4.5rem_minmax(0,1fr)_auto_auto] sm:py-2.5 sm:[grid-template-areas:'thumb_title_price_go''thumb_meta_detail_go'] lg:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] lg:gap-x-3.5 lg:px-3 ${
                    on ? 'ltr:lg:[background-image:linear-gradient(90deg,var(--kt),transparent)] rtl:lg:[background-image:linear-gradient(270deg,var(--kt),transparent)]' : 'lg:hover:bg-white'
                  }`}
                >
                  {/* Ponsel: gambar kecil dengan garis warna jenisnya */}
                  <span className="relative h-14 w-[4.5rem] overflow-hidden rounded-xl bg-white ring-1 ring-[color:var(--border-light)] [grid-area:thumb] lg:hidden" aria-hidden="true">
                    <Image src={it.image} alt="" fill sizes="72px" className="object-cover object-top" />
                    <span className="absolute inset-x-0 bottom-0 h-1 [background-image:linear-gradient(90deg,var(--k),var(--k2))]" />
                  </span>
                  {/* Desktop: lencana nomor bergradasi (yang aktif diberi bayangan sewarna) */}
                  <span
                    className={`hidden h-10 w-10 place-items-center rounded-xl text-sm font-semibold text-white transition-shadow duration-200 [background-image:linear-gradient(135deg,var(--k),var(--k2))] [grid-area:thumb] lg:grid ${on ? 'shadow-[0_8px_18px_-8px_var(--k)]' : ''}`}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Portal = zona Next terpisah: tautan biasa, bukan navigasi klien. Lapisan ::after = seluruh baris. */}
                  <a
                    href={it.href}
                    hrefLang="id"
                    aria-label={it.open}
                    className={`text-[1.0625rem] font-semibold leading-snug text-[color:var(--text-primary)] [grid-area:title] after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[color:var(--primary-600)] ${on ? 'lg:text-[color:var(--k)]' : ''}`}
                  >
                    {it.title}
                  </a>
                  {/* jumlah dan harga boleh turun baris (tanpa elipsis): di 320–360px versi Hindi, Rusia, dan Bengali tidak muat sebaris */}
                  <span className="text-sm leading-snug text-[color:var(--text-tertiary)] [grid-area:meta] sm:mt-0.5">
                    {it.count}
                    {/* di ponsel harga ikut di baris ini; mulai 640px harga punya kolom sendiri */}
                    <span className="sm:hidden"> · {keepPrice(it.price)}</span>
                  </span>
                  <span className="hidden whitespace-nowrap text-end text-sm text-[color:var(--text-secondary)] [grid-area:price] sm:block">{it.price}</span>

                  {/* Di atas lapisan tautan galeri (z-10). Bantalan negatif melebarkan area sentuhnya tanpa menggeser letaknya. */}
                  <a
                    href={it.detailHref}
                    aria-label={it.detailAria}
                    className="relative z-10 -mx-1 inline-flex min-h-6 items-center gap-1 justify-self-start rounded-md px-1 text-[0.8125rem] font-semibold text-[color:var(--primary-700)] underline-offset-4 [grid-area:detail] hover:underline sm:mt-0 sm:justify-self-end"
                  >
                    {detail}
                    <ArrowRight size={13} className="arw shrink-0" aria-hidden="true" />
                  </a>

                  <ArrowUpRight size={17} className="shrink-0 self-center text-[color:var(--k)] transition-transform duration-200 [grid-area:go] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </li>
              )
            })}
          </ul>

          {/* Pratinjau besar di atas "panggung" bergradasi jenis yang aktif (desktop) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="relative overflow-hidden rounded-[1.75rem] p-6" aria-hidden="true">
              {/* Gradasi tidak bisa dianimasikan langsung, jadi tiap jenis punya lapisannya sendiri yang memudar silang */}
              {items.map((it, i) => (
                <span
                  key={it.href}
                  className={`absolute inset-0 transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `radial-gradient(120% 90% at 100% 0%, rgb(255 255 255 / 0.28), transparent 55%), linear-gradient(135deg, ${it.color}, ${it.to})` }}
                />
              ))}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-[0_24px_50px_-24px_rgb(15_29_58/0.55)] ring-1 ring-white/40">
                {items.map((it, i) =>
                  i === active || armed ? (
                    <Image
                      key={it.href}
                      src={it.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 520px, 1px"
                      className={`object-cover object-top transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ) : null,
                )}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-6">
              <p className="min-w-0 text-[color:var(--text-tertiary)]">{cur.tagline}</p>
              <a href={cur.href} hrefLang="id" className="btn btn-sm shrink-0 text-white transition-[filter] duration-200 hover:brightness-90" style={{ backgroundImage: `linear-gradient(135deg, ${cur.color}, ${cur.to})` }}>
                {cur.open} <ArrowUpRight size={16} className="arw arw-ne" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {note && <p className="mt-6 text-sm text-[color:var(--text-tertiary)] sm:mt-7">{note}</p>}
      </div>
    </div>
  )
}
