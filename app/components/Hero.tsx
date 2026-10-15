import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { DEMOS, type DemoCategory } from '../lib/demos'
import { CATEGORY_COLOR, PACKAGE_FOR_CATEGORY, PORTALS } from '../lib/portals'
import { wa } from '../lib/site'
import { getDict } from '../i18n'
import { packagesFor } from '../i18n/facts'
import { path } from '../i18n/routes'
import type { Lang } from '../i18n/config'
import Kinds, { type Kind } from './Kinds'

const count = (c: DemoCategory) => DEMOS.filter((d) => d.category === c).length

// Server component. Pembuka beranda: kalimat besar di kiri dan gambar utama di kanan, lalu delapan jenis
// website (daftar + pratinjau besar, komponen klien Kinds) di atas panel biru muda.
export default function Hero({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.hero
  const g = d.portfolio
  const pk = packagesFor(lang)
  const fromOf = (c: DemoCategory) => pk.find((x) => x.slug === PACKAGE_FOR_CATEGORY[c])!.priceFrom
  // Baris penawaran di bawah paragraf pembuka: harga mulai & durasi paket Landing Page (lib/packages.ts), sudah
  // dalam bahasa pengunjung. "IDR" tidak boleh terpisah baris dari angkanya, rentang "1\u20132" juga tidak (word joiner).
  const landing = pk.find((x) => x.slug === 'landing-page')!
  const offer = t.offer(landing.priceFrom.replace('IDR ', 'IDR\u00a0'), landing.duration.replace(/\u2013/g, '\u2060\u2013\u2060'))
  // String siap tampil untuk komponen klien (kamus tidak ikut terkirim ke browser)
  const kinds: Kind[] = PORTALS.map((p) => {
    const gal = g.galleries[p.category]
    return {
      href: `/${p.path}`,
      title: gal.title,
      tagline: gal.tagline,
      count: `${count(p.category)} ${g.unit[p.category]}`,
      price: `${d.common.from} ${fromOf(p.category)}`,
      image: p.image,
      open: t.openGallery(gal.title),
      ...CATEGORY_COLOR[p.category],
    }
  })

  return (
    <section id="hero" className="pb-8" aria-label={t.aria}>
      {/* Pita pembuka: teks di depan, gambar utama di belakangnya pada semua ukuran layar */}
      <div className="relative isolate overflow-hidden pb-2 pt-32 sm:pt-40 md:pb-16 xl:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* dari tablet ke atas teks dibatasi supaya berhenti sebelum isi gambar mulai terlihat; di bahasa kanan-ke-kiri
              kolom ini tetap di sisi kiri (rtl:md:mr-auto) karena gambar utama tidak dibalik */}
          <div className="md:max-w-[25rem] rtl:md:mr-auto lg:max-w-[30rem] xl:max-w-[38rem]">
            <p className="text-[0.9375rem] text-[color:var(--text-tertiary)]">
              <span className="font-semibold text-[color:var(--primary-700)]">{t.kicker}</span>
              <span className="hidden sm:inline md:hidden"> · </span>
              <span className="hidden sm:inline md:mt-1 md:block">{t.meta(DEMOS.length)}</span>
            </p>

            <h1 className="mt-6 text-[2.6rem] leading-[1.04] text-[color:var(--text-primary)] sm:text-[3.5rem] md:text-[2.5rem] md:leading-[1.08] lg:text-[3rem] lg:leading-[1.06] xl:text-[3.75rem]">
              {t.title[0]}
              {/* frasa miring tidak dipotong di tengah ("pintu depan") */}
              <em className="whitespace-nowrap text-[color:var(--primary-700)]">{t.title[1]}</em>
              {t.title[2] ?? ''}
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[color:var(--text-tertiary)] sm:text-[1.1875rem] md:text-[1.0625rem] lg:text-[1.1875rem]">{t.lead(DEMOS.length)}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--text-secondary)]">{offer}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={wa(d.header.waText)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {t.ctaConsult} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
              </a>
              <Link href={path(lang, 'demo')} className="btn btn-line">
                {t.ctaDemos(DEMOS.length)} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Gambar utama (public/images/bgutama.png, milik pemilik situs), selalu DI BELAKANG teks:
            - ponsel: latar selebar layar yang menempel di kanan atas; teksnya penuh selebar layar, jadi gambar
              diberi tabir putih (.hero-veil) yang tipis di puncak dan menebal ke bawah supaya teks tetap terbaca;
            - tablet & desktop: sepertiga kiri gambar kosong, jadi gambar menempel di kanan dan tepi
              kiri/atas/bawahnya melebur ke latar putih (lapisan pudar dilebihkan 2px supaya tidak ada garis). */}
        <div className="absolute right-0 top-0 -z-10 aspect-[3/2] w-[185%] sm:w-[130%] md:top-1/2 md:w-[58%] md:-translate-y-[46%] lg:w-[66%] xl:w-[63%]">
          {/* sizes di bawah 768px sengaja kecil (270px, bukan lebar tampilnya): di ponsel gambar tertutup tabir putih
              72–98%, jadi varian 640w/828w sudah cukup dan LCP ponsel tidak menunggu berkas 1080w/1920w. */}
          <Image src="/images/bgutama.png" alt={t.artAlt} fill priority fetchPriority="high" sizes="(min-width: 1280px) 63vw, (min-width: 1024px) 66vw, (min-width: 768px) 58vw, 270px" className="object-cover" />
          <span className="hero-veil absolute -inset-0.5 md:hidden" aria-hidden="true" />
          <span className="absolute -inset-y-0.5 -left-0.5 hidden w-[46%] [background-image:linear-gradient(to_right,#fff_0%,#fff_55%,rgb(255_255_255/0)_100%)] md:block" aria-hidden="true" />
          <span className="absolute -inset-x-0.5 -top-0.5 hidden h-[18%] [background-image:linear-gradient(to_bottom,#fff_0%,#fff_25%,rgb(255_255_255/0)_100%)] md:block" aria-hidden="true" />
          <span className="absolute -inset-x-0.5 -bottom-0.5 hidden h-[26%] [background-image:linear-gradient(to_top,#fff_0%,#fff_30%,rgb(255_255_255/0)_100%)] md:block" aria-hidden="true" />
        </div>

        {/* Kisi tipis di atas lapisan putih; melebur ke putih (kelas .hero-grid di globals.css) */}
        <span className="hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      </div>

      <Kinds items={kinds} heading={t.facade} hint={t.facadeHint} note={g.galleryLang || undefined} />
    </section>
  )
}
