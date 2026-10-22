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
import DeviceTrio, { DeviceSprites, type Stage, type TrioSlug } from './DeviceTrio'

// Lima demo dari lima jenis, disusun bento. Tiap kartu menampilkan trio perangkat (laptop di belakang, tablet, ponsel
// di depan, components/DeviceTrio.tsx) dengan gaya bingkai mockup /demo; layar tiap perangkat berisi tangkapan
// PANJANG situs live di ukuran perangkat itu dan bergulir pelan saat kartu disorot/difokus; di layar sentuh ikut
// bergulir bersama halaman. Mati bila gerak dikurangi. Kelas .work/.trio/.dv-*/.win/.shot di globals.css.
// Ganti demo pilihan: ubah PICKS, lalu `node scripts/demo-mockups.mjs screens <slug...>` dan
// `node scripts/static-images.mjs . --dirs public/images` (lihat komentar di skrip itu).
// Ponsel (<640px): kartu utama selebar layar (susunan rapat supaya perangkatnya cukup besar), empat lainnya 2×2.
type Pick = { slug: TrioSlug; span: string; stage: Stage }
// Lebar panggung trio (untuk sizes) = lebar kartu dikurangi tepi panggung (ponsel px-4 utama / px-2.5 kecil; sm:px-5).
// Kisi: 2 kolom (gap 12px / sm 20px); lg 12 kolom di wadah 1104px (gap 24px): 7 kolom 634px, 5 kolom 446px, 4 kolom 352px.
// sm/base = [a, b] untuk (a vw − b px).
const SMALL: Omit<Stage, 'lg'> = { sm: [50, 74], base: [50, 42] }
const PICKS: Pick[] = [
  { slug: 'tanur', span: 'col-span-2 lg:col-span-7', stage: { lg: 594, sm: [100, 88], base: [100, 64] } },
  { slug: 'bakso', span: 'lg:col-span-5', stage: { ...SMALL, lg: 406 } },
  { slug: 'hotel', span: 'lg:col-span-4', stage: { ...SMALL, lg: 312 } },
  { slug: 'jajan', span: 'lg:col-span-4', stage: { ...SMALL, lg: 312 } },
  { slug: 'lumora', span: 'lg:col-span-4', stage: { ...SMALL, lg: 312 } },
]

export default function Portfolio({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.portfolio
  const demos = demosFor(lang)
  const label = Object.fromEntries(categoriesFor(lang).map((c) => [c.id, c.label]))
  const items = PICKS.map((p) => ({ pick: p, demo: demos.find((x) => x.slug === p.slug)! }))

  return (
    <section id="portfolio" aria-labelledby="showcase-title" className="section-y">
      <DeviceSprites />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead eyebrow={t.eyebrow} id="showcase-title" title={<HlText parts={t.title} />} lead={t.lead(DEMOS.length)} />
          <Link href={path(lang, 'demo')} className="btn btn-line hidden shrink-0 lg:inline-flex">
            {t.allDemos(DEMOS.length)} <ArrowRight size={16} className="arw" aria-hidden="true" />
          </Link>
        </div>

        {/* Tiap kartu memakai dua baris grid induk (teks, lalu panggung perangkat) lewat subgrid, sehingga dalam satu
            deret teksnya sama tinggi dan semua trio berdiri di garis dasar yang sama. */}
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:mt-14 lg:grid-cols-12 lg:gap-6">
          {items.map(({ pick, demo }, i) => {
            const c = CATEGORY_COLOR[demo.category]
            const host = demo.url.replace('https://', '')
            const main = i === 0
            return (
              <li key={demo.slug} className={`row-span-2 grid grid-rows-subgrid gap-y-0 ${pick.span}`}>
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work group relative row-span-2 grid grid-rows-subgrid gap-y-0 overflow-hidden rounded-[1.25rem] ring-1 ring-[color:var(--border-light)] transition-shadow duration-300 hover:shadow-[0_34px_60px_-40px_var(--k)] sm:rounded-[1.75rem]"
                  style={
                    {
                      '--k': c.color,
                      '--k2': c.to,
                      // warna jenisnya berpendar dari dasar kartu, tempat perangkatnya berdiri
                      backgroundImage: `radial-gradient(100% 62% at 50% 100%, ${alpha(c.color, 0.14)}, transparent 72%), linear-gradient(165deg, ${c.tint} 0%, #ffffff 115%)`,
                    } as CSSProperties
                  }
                >
                  <span className={`flex items-start justify-between gap-4 sm:p-7 sm:pb-5 ${main ? 'p-5 pb-3' : 'p-3.5 pb-2'}`}>
                    <span className="min-w-0">
                      <span className={`kicker block text-[color:var(--k)] ${main ? '' : 'max-sm:text-[0.75rem]'}`}>{label[demo.category]}</span>
                      <span
                        className={`display mt-1 block leading-tight text-[color:var(--text-primary)] sm:mt-1.5 ${main ? 'text-[1.5rem] lg:text-[1.875rem]' : 'text-[1.0625rem] sm:text-[1.5rem]'}`}
                      >
                        {demo.name}
                      </span>
                      <span className={`mt-1 block text-[color:var(--text-tertiary)] ${main ? 'text-[0.9375rem]' : 'text-[0.8125rem] leading-snug sm:text-[0.9375rem] sm:leading-normal'}`}>
                        {demo.tagline}
                      </span>
                    </span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[color:var(--k)] shadow-[0_1px_2px_rgb(15_29_58/0.08)] ring-1 ring-black/5 transition-colors duration-300 group-hover:text-white group-hover:[background-image:linear-gradient(135deg,var(--k),var(--k2))] ${main ? '' : 'max-sm:hidden'}`}
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={18} className="arw-ne transition-transform" />
                    </span>
                    <span className="sr-only">
                      {t.open} {d.common.newTabShort}
                    </span>
                  </span>

                  <span className={`block self-end sm:px-5 sm:pb-5 ${main ? 'px-4 pb-4' : 'px-2.5 pb-3'}`}>
                    <DeviceTrio slug={pick.slug} main={main} host={host} stage={pick.stage} />
                  </span>
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
