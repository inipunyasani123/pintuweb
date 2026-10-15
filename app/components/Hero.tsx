import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { DEMOS, type DemoCategory } from '../lib/demos'
import { CATEGORY_COLOR, PACKAGE_FOR_CATEGORY, PORTALS } from '../lib/portals'
import { wa } from '../lib/site'
import { getDict } from '../i18n'
import { packagesFor } from '../i18n/facts'
import { path, pathOf } from '../i18n/routes'
import type { ServiceKey } from '../i18n/slugs'
import type { Lang } from '../i18n/config'
import Kinds, { type Kind } from './Kinds'

const count = (c: DemoCategory) => DEMOS.filter((d) => d.category === c).length

/**
 * Tujuan tautan "Detail & harga" tiap jenis: halaman layanan bila ada satu layanan yang khusus untuk jenis itu
 * (paket utamanya sama dengan PACKAGE_FOR_CATEGORY). Jenis lain (kontes, reservasi, properti, to-do) berbagi layanan
 * "Website Custom" yang terlalu umum, jadi menaut langsung ke kartu paketnya di halaman harga (/paket#slug).
 */
const SERVICE_FOR: Partial<Record<DemoCategory, ServiceKey>> = {
  landing: 'landing-page',
  toko: 'toko-online',
  linkinbio: 'link-in-bio',
  undangan: 'undangan-digital',
  portfolio: 'portofolio',
}

// Server component. Pembuka beranda: kalimat besar di kiri dan gambar utama di kanan, lalu sembilan jenis
// website (daftar + pratinjau besar, komponen klien Kinds) di atas panel biru muda.
export default function Hero({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.hero
  const g = d.portfolio
  const pk = packagesFor(lang)
  const fromOf = (c: DemoCategory) => pk.find((x) => x.slug === PACKAGE_FOR_CATEGORY[c])!.priceFrom
  // Baris penawaran di bawah paragraf pembuka: harga mulai & durasi paket Landing Page (lib/packages.ts), sudah
  // dalam bahasa pengunjung. "IDR" tidak boleh terpisah baris dari angkanya, rentang "1–2" juga tidak (word joiner).
  const landing = pk.find((x) => x.slug === 'landing-page')!
  const offer = t.offer(landing.priceFrom.replace('IDR ', 'IDR '), landing.duration.replace(/–/g, '⁠–⁠'))
  // String siap tampil untuk komponen klien (kamus tidak ikut terkirim ke browser)
  const kindOf = (c: DemoCategory, href: string, image: string): Kind => {
    const gal = g.galleries[c]
    const service = SERVICE_FOR[c]
    return {
      href,
      title: gal.title,
      tagline: gal.tagline,
      count: `${count(c)} ${g.unit[c]}`,
      price: `${d.common.from} ${fromOf(c)}`,
      image,
      open: t.openGallery(gal.title),
      detailHref: service ? pathOf(lang, { key: 'services', service }) : `${path(lang, 'pricing')}#${PACKAGE_FOR_CATEGORY[c]}`,
      detailAria: t.kindDetailFor(gal.title),
      ...CATEGORY_COLOR[c],
    }
  }
  // Delapan galeri portal + toko online (belum punya portal katalog sendiri: menaut ke galeri demo yang tersaring).
  const kinds: Kind[] = PORTALS.map((p) => kindOf(p.category, `/${p.path}`, p.image))
  kinds.splice(1, 0, kindOf('toko', `${path(lang, 'demo')}#toko`, '/images/galeri/toko.jpg'))

  return (
    <section id="hero" className="sm:pb-8" aria-label={t.aria}>
      {/* Pita pembuka: teks di depan, gambar utama di belakangnya pada semua ukuran layar */}
      <div className="relative isolate overflow-hidden pb-2 pt-28 sm:pt-40 md:pb-16 xl:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* dari tablet ke atas teks dibatasi supaya berhenti sebelum isi gambar mulai terlihat; di bahasa kanan-ke-kiri
              kolom ini tetap di sisi kiri (rtl:md:mr-auto) karena gambar utama tidak dibalik */}
          <div className="md:max-w-[25rem] rtl:md:mr-auto lg:max-w-[30rem] xl:max-w-[38rem]">
            <p className="text-[0.9375rem] text-[color:var(--text-tertiary)]">
              <span className="font-semibold text-[color:var(--primary-700)]">{t.kicker}</span>
              <span className="hidden sm:inline md:hidden"> · </span>
              <span className="hidden sm:inline md:mt-1 md:block">{t.meta(DEMOS.length)}</span>
            </p>

            <h1 className="mt-4 text-[2.6rem] leading-[1.04] text-[color:var(--text-primary)] sm:mt-6 sm:text-[3.5rem] md:text-[2.5rem] md:leading-[1.08] lg:text-[3rem] lg:leading-[1.06] xl:text-[3.75rem]">
              {t.title[0]}
              {/* frasa miring tidak dipotong di tengah ("pintu depan") */}
              <em className="whitespace-nowrap text-[color:var(--primary-700)]">{t.title[1]}</em>
              {t.title[2] ?? ''}
            </h1>

            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.6] text-[color:var(--text-tertiary)] sm:mt-7 sm:text-[1.1875rem] sm:leading-relaxed md:text-[1.0625rem] lg:text-[1.1875rem]">{t.lead(DEMOS.length)}</p>
            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-[1.6] text-[color:var(--text-secondary)] sm:mt-4 sm:text-base sm:leading-relaxed">{offer}</p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
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

      <Kinds items={kinds} heading={t.facade} hint={t.facadeHint} detail={t.kindDetail} note={g.galleryLang || undefined} />
    </section>
  )
}
