import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDict } from '../i18n'
import { path, type PageKey } from '../i18n/routes'
import type { Lang } from '../i18n/config'
import type { FaqKey } from '../content/faq'
import type { TermsId } from '../content/legal'
import { GUARANTEE_DAYS, PERF_TARGET } from '../lib/site'
import { PACKAGES, byPrice } from '../lib/packages'
import { currencyCode, moneyCompact } from '../i18n/facts'
import { BANDS, BOUNDS, pricePos } from './PriceMap'
import SectionHead from './SectionHead'
import { HlText } from './Bits'

// Janji yang bisa ditagih, disusun sebagai bento kupon. Tiap kupon punya potongan (angka janjinya di dalam "dial") dan
// badan (janji + tautan ke tempat ia tertulis), dipisah garis sobek bertakik.
// Desktop (≥1024px): janji pertama jadi petak biru besar setinggi dua baris, empat janji berikutnya petak kecil
// berselang lebar (4/3 lalu 3/4 kolom), janji terakhir petak lebar di bawah. Potongannya di atas, kecuali petak lebar.
// Ponsel & tablet: daftar kupon dengan potongan di sisi awal baris (ringkas, seperti tiket).
// PROOF dan DIALS sejajar dengan why.promises di kamus. Tiap janji menunjuk langsung ke tempat ia tertulis: pertanyaan di
// FAQ (halaman FAQ membuka dan menyorot kartunya) atau pasal di Syarat & Ketentuan.
const PROOF: { page: PageKey; at?: FaqKey | TermsId }[] = [
  { page: 'pricing' },
  { page: 'faq', at: 'pembayaran' },
  { page: 'terms', at: 'kepemilikan' },
  { page: 'faq', at: 'kecepatan' },
  { page: 'terms', at: 'garansi' },
  { page: 'faq', at: 'website-bermasalah' },
]

/** Isi dial tiap janji, dari angka yang sama dengan janjinya: busur untuk persentase/skor, titik untuk hitungan. */
type DialSpec = { kind: 'arc'; v: number } | { kind: 'dots'; n: number }
const DIALS: DialSpec[] = [
  { kind: 'dots', n: PACKAGES.length }, // satu titik per paket
  { kind: 'arc', v: 0.5 }, // DP 50% (lib/packages.ts: deposit = separuh harga)
  { kind: 'arc', v: 1 }, // 100% milikmu
  { kind: 'arc', v: parseInt(PERF_TARGET, 10) / 100 }, // target skor PageSpeed, seperti cincin skor Lighthouse
  { kind: 'dots', n: GUARANTEE_DAYS }, // satu titik per hari garansi
  { kind: 'dots', n: 24 }, // 24 jam
]

// Petak bento di desktop. Petak 0 = biru besar; petak 5 = lebar.
const SPAN = ['sm:col-span-2 lg:col-span-5 lg:row-span-2', 'lg:col-span-4', 'lg:col-span-3', 'lg:col-span-3', 'lg:col-span-4', 'sm:col-span-2 lg:col-span-12']

function Dial({ d, dark }: { d: DialSpec; dark: boolean }) {
  const r = 44
  const c = 2 * Math.PI * r
  return (
    // busur mulai dari arah jam 12 dan berjalan searah bacaan: searah jarum jam, atau sebaliknya di bahasa kanan-ke-kiri
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90 rtl:-scale-y-100" aria-hidden="true">
      {d.kind === 'arc' ? (
        <>
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="5" className={dark ? 'stroke-white/20' : 'stroke-[color:var(--primary-100)]'} />
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(c * d.v).toFixed(2)} ${c.toFixed(2)}`} className={dark ? 'stroke-white' : 'stroke-[color:var(--primary-700)]'} />
        </>
      ) : (
        Array.from({ length: d.n }, (_, k) => {
          const a = (k / d.n) * 2 * Math.PI
          return <circle key={k} cx={(50 + r * Math.cos(a)).toFixed(2)} cy={(50 + r * Math.sin(a)).toFixed(2)} r={d.n > 20 ? 2.3 : 3.1} className={dark ? 'fill-white' : 'fill-[color:var(--primary-700)]'} />
        })
      )}
    </svg>
  )
}

/**
 * Peta harga mini untuk petak "harga ditulis di depan" (desktop): satu batang per paket, diurutkan dari yang termurah,
 * pada skala berpita yang sama dengan peta harga di bawahnya (PriceMap). Dekoratif; angkanya ada di peta harga.
 */
function MiniMap({ lang }: { lang: Lang }) {
  return (
    <div className="mt-auto hidden pt-8 lg:block" aria-hidden="true">
      <div className="space-y-[7px]">
        {byPrice(PACKAGES).map((p) => {
          const a = pricePos(p.minPrice)
          const w = Math.max(pricePos(p.maxPrice) - a, 2)
          return (
            <span key={p.slug} className="relative block h-1.5 rounded-full bg-white/10">
              <span className="absolute inset-y-0 rounded-full bg-white/70" style={{ insetInlineStart: `${a}%`, width: `${w}%` }} />
            </span>
          )
        })}
      </div>
      <div className="relative mt-2.5 h-4 text-[0.6875rem] font-semibold text-white/55">
        <span className="absolute start-0">{currencyCode(lang)}</span>
        {BOUNDS.slice(1, -1).map((b, k) => (
          <span key={b} className="absolute -translate-x-1/2 whitespace-nowrap rtl:translate-x-1/2" style={{ insetInlineStart: `${((k + 1) / BANDS) * 100}%` }}>
            {moneyCompact(lang, b)}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function WhyUs({ lang }: { lang: Lang }) {
  const t = getDict(lang).why
  return (
    <section aria-labelledby="why-title" className="section-y bg-[color:var(--surface-soft)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={t.eyebrow} id="why-title" title={<HlText parts={t.title} />} lead={t.lead} />

        <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:mt-14 lg:grid-cols-12 lg:gap-5">
          {t.promises.map((p, i) => {
            const hero = i === 0
            const wide = i === t.promises.length - 1
            // kupon berdiri (potongan di atas) hanya di desktop, dan bukan untuk petak lebar
            const col = !wide
            const long = p.fig.length >= 4
            return (
              // bayangan dipasang di pembungkus supaya mengikuti bentuk takik kupon (utilitas tix-v / tix-h di globals.css)
              <li key={p.title} className={`[filter:drop-shadow(0_1px_1px_rgb(15_29_58/0.05))_drop-shadow(0_12px_22px_rgb(15_29_58/0.06))] ${SPAN[i]}`}>
                <div
                  className={`tix-v flex h-full overflow-hidden rounded-[1.25rem] [--stub:5rem] sm:[--stub:8.5rem] ${
                    hero ? 'bg-[linear-gradient(150deg,var(--primary-600),var(--primary-800)_70%)] text-white' : 'bg-white'
                  } ${col ? 'lg:tix-h lg:flex-col' : 'lg:[--stub:11rem]'} ${hero ? 'lg:[--stub:14rem]' : col ? 'lg:[--stub:7rem]' : ''}`}
                >
                  {/* potongan kupon: dial berisi angka janji + satuannya */}
                  <div
                    className={`flex w-[var(--stub)] shrink-0 flex-col items-center justify-center gap-1.5 border-e-2 border-dashed px-1 py-4 text-center sm:gap-2 sm:px-1.5 sm:py-6 ${
                      hero ? 'border-white/30 bg-white/[0.07]' : 'border-[color:var(--primary-200)] [background-image:linear-gradient(160deg,var(--primary-50),var(--accent-100))]'
                    } ${col ? `lg:h-[var(--stub)] lg:w-auto lg:flex-row lg:justify-start lg:border-b-2 lg:border-e-0 lg:px-7 lg:py-0 lg:text-start ${hero ? 'lg:gap-6' : 'lg:gap-4'}` : ''}`}
                    aria-hidden="true"
                  >
                    <span className={`relative grid h-14 w-14 shrink-0 place-items-center sm:h-[4.5rem] sm:w-[4.5rem] ${hero ? 'lg:h-[9.5rem] lg:w-[9.5rem]' : ''}`}>
                      <Dial d={DIALS[i]} dark={hero} />
                      <span
                        className={`display relative font-semibold leading-none tracking-tight ${hero ? 'text-white' : 'text-[color:var(--primary-700)]'} ${
                          long ? 'text-[0.9375rem] sm:text-[1.0625rem]' : 'text-[1.1875rem] sm:text-[1.375rem]'
                        } ${hero ? 'lg:text-[3.25rem]' : ''}`}
                      >
                        <bdi>{p.fig}</bdi>
                      </span>
                    </span>
                    <span className={`text-[0.6875rem] font-semibold leading-tight sm:text-[0.8125rem] ${hero ? 'text-white/85 lg:text-[1.125rem]' : 'text-[color:var(--primary-800)] lg:text-[0.9375rem]'}`}>{p.unit}</span>
                  </div>

                  {/* badan kupon */}
                  <div className={`flex min-w-0 flex-1 flex-col px-4 py-3.5 sm:p-6 lg:px-7 ${hero ? 'lg:py-7' : ''} ${wide ? 'lg:flex-row lg:items-center lg:gap-10' : ''}`}>
                    <div className={wide ? 'min-w-0 lg:flex-1' : 'contents'}>
                      <h3 className={`leading-snug ${hero ? 'text-[1.0625rem] text-white sm:text-[1.25rem] lg:text-[1.75rem] lg:leading-tight' : 'text-[1.0625rem] text-[color:var(--text-primary)] sm:text-[1.25rem]'}`}>{p.title}</h3>
                      <p className={`mt-1 text-[0.9375rem] leading-normal sm:mt-1.5 sm:text-base sm:leading-relaxed ${hero ? 'text-white/80 lg:mt-3 lg:text-[1.0625rem]' : 'text-[color:var(--text-tertiary)]'}`}>{p.body}</p>
                    </div>
                    {hero && <MiniMap lang={lang} />}
                    <Link
                      href={`${path(lang, PROOF[i].page)}${PROOF[i].at ? `#${PROOF[i].at}` : ''}`}
                      className={`mt-auto inline-flex min-h-6 items-center gap-1.5 self-start pt-2 text-[0.8125rem] font-semibold underline-offset-4 hover:underline sm:pt-4 ${
                        hero ? 'text-white decoration-white/60' : 'text-[color:var(--primary-700)]'
                      } ${wide ? 'lg:mt-0 lg:shrink-0 lg:self-center lg:pt-0' : ''} ${hero ? 'lg:mt-0 lg:pt-5' : ''}`}
                    >
                      {p.proof} <ArrowRight size={14} className="arw" aria-hidden="true" />
                    </Link>
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
