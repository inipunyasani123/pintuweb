import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { DEMOS } from '../lib/demos'
import { CATEGORY_COLOR, alpha } from '../lib/portals'
import { categoriesFor, demosFor, getDict } from '../i18n'
import { path } from '../i18n/routes'
import type { Lang } from '../i18n/config'
import SectionHead from './SectionHead'
import { HlText } from './Bits'

// Lima demo asli dari lima kategori, disusun bento. Tiap karya tampil di bingkai perangkatnya (jendela
// browser atau ponsel) di atas panel berwarna jenisnya; saat kartu disorot, isi layarnya bergulir pelan,
// dan di layar sentuh ikut bergulir bersama halaman (kelas .work/.win/.shot di globals.css).
// Gambar = tangkapan layar panjang situs live di public/images/karya.
// Ponsel (<640px): dua karya pertama tampil besar; tiga sisanya kartu ringkas mendatar (teks + jendela kecil yang
// mengintip dari tepi bawah), supaya bagian ini tidak memakan lima layar penuh.
type Pick = {
  slug: string
  /** ukuran asli tangkapan layar */
  w: number
  h: number
  device: 'browser' | 'phone'
  span: string
  /** rasio jendela paling pendek; jendela memanjang bila kartu di sebelahnya lebih tinggi */
  ratio: string
  /** lama gulir saat disorot; makin panjang halamannya makin lama */
  dur: string
  sizes: string
}
// sizes = lebar jendela browser di kartu: lebar kartu (kisi 1/2/12 kolom) dikurangi margin bingkai (mx-6 / sm:mx-7);
// kartu ringkas di ponsel: jendela 8,25rem.
const SMALL = '(min-width: 1024px) 300px, (min-width: 640px) calc(50vw - 5.625rem), 132px'
const PICKS: Pick[] = [
  { slug: 'lumora', w: 1200, h: 1969, device: 'browser', span: 'sm:col-span-2 lg:col-span-7', ratio: '16 / 10', dur: '7s', sizes: '(min-width: 1024px) 580px, (min-width: 640px) calc(100vw - 6.5rem), calc(100vw - 4.5rem)' },
  // bingkai ponsel 14rem (ponsel: 11rem) dengan tepi 7px
  { slug: 'jajan', w: 560, h: 1310, device: 'phone', span: 'lg:col-span-5', ratio: '9 / 14', dur: '2.5s', sizes: '(min-width: 640px) 210px, 162px' },
  { slug: 'cissycoffee', w: 900, h: 1336, device: 'browser', span: 'lg:col-span-4', ratio: '4 / 3', dur: '4s', sizes: SMALL },
  { slug: 'hotel', w: 900, h: 1336, device: 'browser', span: 'lg:col-span-4', ratio: '4 / 3', dur: '4s', sizes: SMALL },
  { slug: 'celeste', w: 900, h: 1336, device: 'browser', span: 'lg:col-span-4', ratio: '4 / 3', dur: '4s', sizes: SMALL },
]
/** Mulai karya ke berapa kartunya ringkas di ponsel */
const COMPACT_FROM = 2

export default function Portfolio({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.portfolio
  const demos = demosFor(lang)
  const label = Object.fromEntries(categoriesFor(lang).map((c) => [c.id, c.label]))
  const items = PICKS.map((p) => ({ ...p, demo: demos.find((x) => x.slug === p.slug)! }))

  return (
    <section id="portfolio" aria-labelledby="showcase-title" className="section-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow={t.eyebrow} id="showcase-title" title={<HlText parts={t.title} />} lead={t.lead(DEMOS.length)} />
          <Link href={path(lang, 'demo')} className="btn btn-line hidden shrink-0 lg:inline-flex">
            {t.allDemos(DEMOS.length)} <ArrowRight size={16} className="arw" aria-hidden="true" />
          </Link>
        </div>

        {/* Tiap kartu memakai dua baris grid induk (teks, lalu perangkat) lewat subgrid, sehingga dalam satu
            deret teksnya sama tinggi dan semua perangkat mulai serta berakhir di garis yang sama. */}
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-6">
          {items.map(({ demo, span, device, w, h, ratio, dur, sizes }, i) => {
            const c = CATEGORY_COLOR[demo.category]
            const host = demo.url.replace('https://', '')
            const compact = i >= COMPACT_FROM
            // subgrid dua baris; kartu ringkas baru memakainya mulai 640px (di ponsel: satu baris mendatar)
            const sub = compact ? 'sm:row-span-2 sm:grid sm:grid-rows-subgrid sm:gap-y-0' : 'row-span-2 grid grid-rows-subgrid gap-y-0'
            const win = (
              <span className="win relative block grow overflow-hidden bg-white" style={{ aspectRatio: ratio }}>
                <span className="shot absolute inset-x-0 top-0 block">
                  <Image src={`/images/karya/${demo.slug}.webp`} alt={t.shotAlt(demo.name)} width={w} height={h} sizes={sizes} className="h-auto w-full" />
                </span>
              </span>
            )
            return (
              <li key={demo.slug} className={`${sub} ${span}`}>
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`work group relative overflow-hidden rounded-[1.5rem] ring-1 ring-[color:var(--border-light)] transition-shadow duration-300 hover:shadow-[0_34px_60px_-40px_var(--k)] sm:rounded-[1.75rem] ${compact ? 'flex items-end' : ''} ${sub}`}
                  style={
                    {
                      '--k': c.color,
                      '--k2': c.to,
                      '--dur': dur,
                      // warna jenisnya berpendar dari dasar kartu, tempat perangkatnya berdiri
                      backgroundImage: `radial-gradient(100% 62% at 50% 100%, ${alpha(c.color, 0.16)}, transparent 72%), linear-gradient(165deg, ${c.tint} 0%, #ffffff 115%)`,
                    } as CSSProperties
                  }
                >
                  <span className={`flex items-start justify-between gap-4 sm:p-7 sm:pb-6 ${compact ? 'min-w-0 flex-1 self-stretch p-5' : 'p-5 pb-4'}`}>
                    <span className="min-w-0">
                      <span className="kicker block text-[color:var(--k)]">{label[demo.category]}</span>
                      <span className={`display mt-1 block leading-tight text-[color:var(--text-primary)] sm:mt-1.5 ${i === 0 ? 'text-[1.5rem] lg:text-[1.875rem]' : compact ? 'text-[1.25rem] sm:text-[1.5rem]' : 'text-[1.5rem]'}`}>{demo.name}</span>
                      <span className={`mt-1 block text-[color:var(--text-tertiary)] ${compact ? 'text-sm leading-snug sm:text-[0.9375rem] sm:leading-normal' : 'text-[0.9375rem]'}`}>{demo.tagline}</span>
                    </span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[color:var(--k)] shadow-[0_1px_2px_rgb(15_29_58/0.08)] ring-1 ring-black/5 transition-colors duration-300 group-hover:text-white group-hover:[background-image:linear-gradient(135deg,var(--k),var(--k2))] ${compact ? 'max-sm:hidden' : ''}`}
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={18} className="arw-ne transition-transform" />
                    </span>
                    <span className="sr-only">
                      {t.open} {d.common.newTabShort}
                    </span>
                  </span>

                  {device === 'browser' ? (
                    // Jendela browser yang "mengintip" dari dasar kartu
                    <span
                      className={`flex flex-col overflow-hidden bg-white shadow-[0_-10px_40px_-22px_rgb(15_29_58/0.4)] ring-1 ring-black/10 sm:mx-7 sm:w-auto sm:rounded-t-xl ${
                        compact ? 'me-4 mt-5 w-[8.25rem] shrink-0 rounded-t-lg' : 'mx-5 rounded-t-xl'
                      }`}
                    >
                      <span className={`flex items-center gap-1.5 border-b border-[color:var(--border-light)] sm:px-3 sm:py-2 ${compact ? 'gap-1 px-2 py-1.5 sm:gap-1.5' : 'px-3 py-2'}`} aria-hidden="true">
                        <span className={`rounded-full bg-[color:var(--neutral-300)] sm:h-2 sm:w-2 ${compact ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
                        <span className={`rounded-full bg-[color:var(--neutral-300)] sm:h-2 sm:w-2 ${compact ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
                        <span className={`rounded-full bg-[color:var(--neutral-300)] sm:h-2 sm:w-2 ${compact ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
                        <span className={`mx-auto max-w-[72%] truncate rounded-md bg-[color:var(--neutral-100)] px-3 py-0.5 text-[0.6875rem] text-[color:var(--text-tertiary)] ${compact ? 'max-sm:hidden' : ''}`}>{host}</span>
                      </span>
                      {win}
                    </span>
                  ) : (
                    // Bingkai ponsel untuk karya yang memang dirancang untuk layar kecil
                    <span className="relative mx-auto flex w-[11rem] max-w-[72%] flex-col overflow-hidden rounded-t-[2rem] border-[7px] border-b-0 border-[color:var(--navy)] bg-white shadow-[0_-10px_40px_-18px_rgb(15_29_58/0.5)] sm:w-[14rem]">
                      <span className="absolute left-1/2 top-2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[color:var(--navy)]" aria-hidden="true" />
                      {win}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <p className="mt-6 hidden text-center text-sm text-[color:var(--text-tertiary)] lg:block">{t.hoverHint}</p>

        <div className="mt-8 flex justify-center sm:mt-10 lg:hidden">
          <Link href={path(lang, 'demo')} className="btn btn-line">
            {t.allDemos(DEMOS.length)} <ArrowRight size={16} className="arw" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
