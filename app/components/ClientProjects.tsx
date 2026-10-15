import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CLIENTS_ANCHOR, clientAnchor, clientsFor, clientsHref } from '../content/clients'
import { clientShots } from '../content/client-shots'
import { getDict } from '../i18n'
import type { Lang } from '../i18n/config'
import type { ServiceKey } from '../i18n/slugs'

// Proyek klien (data di content/clients.ts) di tiga tempat: daftar ringkas di beranda, kartu lengkap di halaman
// Tentang (#proyek-klien, tiap kartu punya jangkar #klien-<kunci>), dan blok kecil di halaman layanan terkait.
// Ini ringkasan proyek, bukan testimoni: tanpa kutipan, bintang, atau angka di luar data pemilik.

/**
 * Geser panah saat tautannya disorot/difokus, untuk panah yang BUKAN anak langsung <a> (aturan `a:hover > .arw` di
 * globals.css hanya mengenai anak langsung). Pakai transform, bukan translate, supaya di RTL ikut terbalik bersama
 * `scale: -1 1` dari kelas .arw.
 */
const SHIFT = '[a:focus-visible_&]:[transform:translateX(3px)] [a:hover_&]:[transform:translateX(3px)]'

/** Beranda, sesudah "Karya pilihan": nama usaha, bidang, dan proyeknya saja; rinciannya di halaman Tentang. */
export function ClientsHome({ lang }: { lang: Lang }) {
  const t = getDict(lang).clients
  return (
    <section aria-labelledby="clients-title" className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-[color:var(--rule)] pt-10 sm:pt-12">
          {/* Seperti "Karya pilihan": tautan rincian di kanan atas pada desktop, di bawah daftar pada ponsel/tablet. */}
          <div className="flex items-end justify-between gap-10">
            <div className="max-w-2xl">
              <p className="kicker text-[color:var(--primary-700)]">{t.title}</p>
              <h2 id="clients-title" className="mt-2 text-[1.5rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.75rem]">
                {t.lead}
              </h2>
            </div>
            <DetailsLink lang={lang} label={t.details} className="hidden shrink-0 lg:inline" />
          </div>

          <ul className="mt-7 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {clientsFor(lang).map((c) => (
              <li key={c.key} className="border-t border-[color:var(--border-light)]">
                <Link href={clientsHref(lang, c.key)} className="group block h-full py-4 sm:py-5">
                  <span className="block text-[0.8125rem] font-medium leading-snug text-[color:var(--text-tertiary)]">{c.field}</span>
                  {/* panah sebaris dengan nama usaha, berapa baris pun label bidangnya */}
                  <span className="mt-1 flex items-start justify-between gap-4">
                    <span className="display min-w-0 text-[1.1875rem] leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--primary-700)]">{c.business}</span>
                    <ArrowRight size={16} className={`arw mt-1.5 shrink-0 text-[color:var(--primary-700)] ${SHIFT}`} aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{c.project}</span>
                </Link>
              </li>
            ))}
          </ul>
          <DetailsLink lang={lang} label={t.details} className="mt-4 inline-block lg:hidden" />
        </div>
      </div>
    </section>
  )
}

/**
 * "Lihat masalah & solusi tiap proyek" ke #proyek-klien. Bila teksnya terbungkus, panahnya tetap menempel pada kata
 * terakhir (kata itu + panah tidak dipisah); bahasa tanpa spasi (zh) menempelkan huruf terakhir.
 */
function DetailsLink({ lang, label, className = '' }: { lang: Lang; label: string; className?: string }) {
  const cut = label.lastIndexOf(' ')
  const [head, tail] = cut < 0 ? [label.slice(0, -1), label.slice(-1)] : [label.slice(0, cut + 1), label.slice(cut + 1)]
  return (
    <Link href={clientsHref(lang)} className={`link text-[0.9375rem] font-semibold ${className}`}>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <ArrowRight size={15} className={`arw ms-1.5 inline-block align-[-0.15em] ${SHIFT}`} aria-hidden="true" />
      </span>
    </Link>
  )
}

/**
 * Halaman Tentang: satu kartu per proyek. Masalah → solusi tampil sebagai lintasan dua titik (sejalan dengan
 * linimasa "Cerita kami"); "Yang diserahkan" berubah menjadi deretan tangkapan layar begitu berkasnya ada
 * (content/client-shots.ts), selain itu cukup teks.
 */
export function ClientCases({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.clients
  return (
    <section id={CLIENTS_ANCHOR} aria-labelledby="clients-title" className="pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="clients-title" className="text-[2rem] leading-[1.12] text-[color:var(--text-primary)] sm:text-[2.5rem]">
          {t.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-[color:var(--text-tertiary)] sm:text-lg">{t.lead}</p>

        <ul className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {clientsFor(lang).map((c) => {
            const id = clientAnchor(c.key)
            const shots = clientShots(c.key, c.docs.length)
            return (
              // Tiga baris grid induk lewat subgrid (kepala, lintasan, yang diserahkan): dalam satu deret, garis
              // "Yang diserahkan" kedua kartu sejajar walau panjang teksnya berbeda.
              <li key={c.key} id={id} className="row-span-3 grid grid-rows-subgrid gap-y-0 rounded-[1.5rem] bg-white p-6 ring-1 ring-[color:var(--border-light)] sm:p-8">
                <div>
                  <p className="kicker text-[color:var(--primary-700)]">{c.field}</p>
                  <h3 className="mt-2 text-[1.5rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.625rem]">{c.business}</h3>
                  <p className="mt-1 text-[0.9375rem] text-[color:var(--text-tertiary)]">{t.client(c.client)}</p>
                  <p className="mt-5 text-[1.0625rem] font-medium leading-snug text-[color:var(--text-primary)]">{c.project}</p>
                </div>

                {/* Lintasan: titik kosong (masalah) → titik biru (solusi). Titik & garisnya pseudo-elemen, supaya isi <dl> tetap dt/dd saja. */}
                <dl className="mt-6">
                  <div className="relative pb-5 ps-7 before:absolute before:-bottom-1 before:start-[0.3125rem] before:top-4 before:w-0.5 before:rounded-full before:bg-[color:var(--primary-100)]">
                    <dt className="kicker relative text-[color:var(--text-secondary)] after:absolute after:-start-7 after:top-1 after:h-3 after:w-3 after:rounded-full after:border-2 after:border-[color:var(--neutral-400)] after:bg-white">
                      {t.problem}
                    </dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{c.problem}</dd>
                  </div>
                  <div className="relative ps-7">
                    <dt className="kicker relative text-[color:var(--primary-700)] after:absolute after:-start-7 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-[color:var(--primary-700)] after:ring-4 after:ring-[color:var(--primary-100)]">
                      {t.solution}
                    </dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)]">{c.solution}</dd>
                  </div>
                </dl>

                <div className="pt-6">
                  <div className="border-t border-[color:var(--border-light)] pt-5">
                    <p id={`${id}-docs`} className="kicker text-[color:var(--text-primary)]">
                      {t.delivered}
                    </p>
                    {shots.some(Boolean) ? (
                      // Tangkapan layar (16:10 dari atas), klik untuk gambar penuh; keterangannya = butir `docs`.
                      <ul aria-labelledby={`${id}-docs`} className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
                        {c.docs.map((doc, i) => {
                          const src = shots[i]
                          return (
                            <li key={doc}>
                              {src ? (
                                <figure>
                                  <a href={src} target="_blank" rel="noopener noreferrer" className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-[color:var(--surface-soft)] ring-1 ring-[color:var(--border-light)]">
                                    <Image src={src} alt={t.shotAlt(doc, c.business)} fill sizes="(min-width: 1024px) 152px, (min-width: 768px) calc(16vw - 32px), calc(33vw - 34px)" className="object-cover object-top" />
                                    <span className="sr-only">{d.common.newTab}</span>
                                  </a>
                                  <figcaption className="mt-1.5 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">{doc}</figcaption>
                                </figure>
                              ) : (
                                <span className="block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">{doc}</span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <ul aria-labelledby={`${id}-docs`} className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                        {c.docs.map((doc) => (
                          <li key={doc} className="flex items-center gap-2 text-[0.9375rem] leading-snug text-[color:var(--text-secondary)]">
                            <span className="h-[5px] w-[5px] shrink-0 bg-[color:var(--primary-700)]" aria-hidden="true" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Halaman layanan: proyek klien yang terkait layanan ini (tidak tampil bila tidak ada). Tata letaknya sejalan dengan FAQ di bawahnya. */
export function ServiceClients({ lang, service }: { lang: Lang; service: ServiceKey }) {
  const list = clientsFor(lang, service)
  if (list.length === 0) return null
  const t = getDict(lang).clients
  return (
    <section aria-labelledby="sclients-title" className="pt-16 sm:pt-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <h2 id="sclients-title" className="text-[2rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.1rem]">
            {t.title}
          </h2>
          <DetailsLink lang={lang} label={t.details} className="mt-3 inline-block" />
        </div>
        <ul className="border-t border-[color:var(--rule)] lg:col-span-9">
          {list.map((c) => (
            <li key={c.key} className="border-b border-[color:var(--border-light)]">
              <Link href={clientsHref(lang, c.key)} className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-1 py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]">
                <span className="min-w-0">
                  <span className="display block text-[1.1875rem] leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--primary-700)]">
                    {c.business}
                  </span>
                  <span className="mt-0.5 block text-[0.8125rem] font-medium text-[color:var(--text-tertiary)]">{c.field}</span>
                </span>
                <span className="col-start-1 row-start-2 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)] sm:col-start-2 sm:row-start-1 sm:pt-0.5">{c.project}</span>
                <ArrowRight size={16} className="arw col-start-2 row-start-1 mt-1.5 shrink-0 text-[color:var(--primary-700)] sm:col-start-3" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
