import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getDict } from '../i18n'
import { path, type PageKey } from '../i18n/routes'
import type { Lang } from '../i18n/config'
import type { FaqKey } from '../content/faq'
import type { TermsId } from '../content/legal'
import SectionHead from './SectionHead'
import { HlText } from './Bits'

// Janji yang bisa ditagih, masing-masing sebagai satu "kupon": potongan kiri memuat angkanya, badan kupon
// memuat janjinya, dan tautan di dasarnya menunjuk halaman tempat janji itu tertulis.
// PROOF sejajar dengan why.promises di kamus. Tiap janji menunjuk langsung ke tempat ia tertulis: pertanyaan di FAQ
// (halaman FAQ membuka dan menyorot kartunya) atau pasal di Syarat & Ketentuan.
const PROOF: { page: PageKey; at?: FaqKey | TermsId }[] = [
  { page: 'pricing' },
  { page: 'faq', at: 'pembayaran' },
  { page: 'terms', at: 'kepemilikan' },
  { page: 'faq', at: 'kecepatan' },
  { page: 'terms', at: 'garansi' },
  { page: 'faq', at: 'website-bermasalah' },
]

export default function WhyUs({ lang }: { lang: Lang }) {
  const t = getDict(lang).why
  return (
    <section aria-labelledby="why-title" className="section-y bg-[color:var(--surface-soft)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={t.eyebrow} id="why-title" title={<HlText parts={t.title} />} lead={t.lead} />

        <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:mt-12 sm:gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-5">
          {t.promises.map((p, i) => (
            // bayangan dipasang di pembungkus supaya mengikuti bentuk takik kupon (kelas .tix di globals.css)
            <li key={p.title} className="[filter:drop-shadow(0_1px_1px_rgb(15_29_58/0.05))_drop-shadow(0_12px_22px_rgb(15_29_58/0.06))]">
              <div className="tix flex h-full overflow-hidden rounded-[1.25rem] bg-white [--stub:5rem] sm:[--stub:8.5rem] lg:[--stub:9.5rem]">
                <div
                  className="flex w-[var(--stub)] shrink-0 flex-col items-center justify-center border-e-2 border-dashed border-[color:var(--primary-200)] px-1.5 py-5 text-center sm:px-2 sm:py-6 [background-image:linear-gradient(160deg,var(--primary-50),var(--accent-100))]"
                  aria-hidden="true"
                >
                  <span className="display text-[1.5rem] font-semibold leading-none tracking-tight text-[color:var(--primary-700)] sm:text-[2.5rem]"><bdi>{p.fig}</bdi></span>
                  <span className="mt-1.5 text-[0.6875rem] font-semibold leading-tight text-[color:var(--primary-800)] sm:mt-2 sm:text-[0.8125rem]">{p.unit}</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col px-4 py-4 sm:p-6 lg:px-7">
                  <h3 className="text-[1.0625rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.25rem]">{p.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-normal text-[color:var(--text-tertiary)] sm:mt-1.5 sm:text-base sm:leading-relaxed">{p.body}</p>
                  <Link href={`${path(lang, PROOF[i].page)}${PROOF[i].at ? `#${PROOF[i].at}` : ''}`} className="mt-auto inline-flex min-h-6 items-center gap-1.5 self-start pt-2.5 text-[0.8125rem] font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline sm:pt-4">
                    {p.proof} <ArrowRight size={14} className="arw" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
