import type { CSSProperties } from 'react'
import { getDict } from '../i18n'
import type { Lang } from '../i18n/config'
import SectionHead from './SectionHead'
import { HlText } from './Bits'

// Cara kerja sebagai satu lintasan: empat tahap, dua titik bayar di antaranya (DP setelah tahap 1, pelunasan
// setelah tahap 3), lalu garis putus-putus masa garansi setelah online. Lintasannya terisi mengikuti gulir
// halaman (kelas .proc* di globals.css). Ponsel/tablet: lintasan tegak di kiri. Desktop: mendatar.
export default function Process({ lang }: { lang: Lang }) {
  const t = getDict(lang).process
  const last = t.steps.length - 1
  const flagAfter: Record<number, string[]> = { 0: t.pay.deposit, 2: t.pay.final }

  return (
    <section aria-labelledby="process-title" className="section-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={t.eyebrow} id="process-title" title={<HlText parts={t.title} />} lead={t.lead} />

        <ol className="proc mt-9 grid grid-cols-1 sm:mt-12 lg:mt-16 lg:grid-cols-4 lg:gap-x-8">
          {t.steps.map((s, i) => {
            const flag = flagAfter[i]
            return (
              <li key={s.title} className="proc-step relative pb-7 ps-[4.5rem] last:pb-0 sm:pb-10 lg:pb-0 lg:ps-0 lg:pt-[6.75rem]" style={{ '--i': i } as CSSProperties}>
                {i < last ? (
                  // ruas lintasan menuju tahap berikutnya
                  <span className="absolute -bottom-6 start-[21px] top-6 w-1.5 overflow-hidden rounded-full bg-[color:var(--primary-100)] lg:-end-14 lg:bottom-auto lg:start-6 lg:top-[57px] lg:h-1.5 lg:w-auto" aria-hidden="true">
                    <span className="proc-fill absolute inset-0 rounded-full" />
                  </span>
                ) : (
                  // setelah online: garis putus-putus masa garansi
                  <span className="absolute bottom-4 start-[23px] top-6 border-s-2 border-dashed border-[color:var(--primary-300)] lg:bottom-auto lg:start-6 lg:end-3 lg:top-[59px] lg:border-s-0 lg:border-t-2" aria-hidden="true" />
                )}

                <span
                  className="proc-node absolute start-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full border-2 border-[color:var(--primary-700)] bg-[color:var(--primary-700)] text-[1.0625rem] font-semibold text-white ring-8 ring-white lg:top-9"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>

                <h3 className="pt-3 text-[1.25rem] leading-tight text-[color:var(--text-primary)] sm:pt-2 sm:text-[1.375rem] lg:pt-0">{s.title}</h3>
                <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-[1.6] text-[color:var(--text-tertiary)] sm:mt-2 sm:text-base sm:leading-relaxed lg:pe-2">{s.desc}</p>

                {flag && (
                  // titik bayar: di ponsel di bawah tahapnya, di desktop tepat di tengah ruas lintasan
                  <p className="proc-flag relative mt-4 text-[0.8125rem] leading-5 sm:mt-6 lg:absolute lg:start-[calc(50%+2.5rem)] lg:top-0 lg:mt-0 lg:-translate-x-1/2 rtl:lg:translate-x-1/2 lg:whitespace-nowrap lg:text-center">
                    <span className="proc-dot absolute -start-[3.375rem] top-1 z-10 h-3 w-3 rounded-full border-2 border-[color:var(--primary-700)] bg-[color:var(--primary-700)] ring-4 ring-white lg:start-1/2 lg:top-[54px] lg:-translate-x-1/2 rtl:lg:translate-x-1/2" aria-hidden="true" />
                    <strong className="font-semibold text-[color:var(--primary-700)] lg:block">{flag[0]}</strong> <span className="text-[color:var(--text-tertiary)] lg:block">{flag[1]}</span>
                  </p>
                )}
                {i === last && (
                  <p className="relative mt-4 text-[0.8125rem] leading-5 sm:mt-6 lg:absolute lg:end-0 lg:top-0 lg:mt-0 lg:whitespace-nowrap lg:text-end">
                    <span className="absolute -start-[3.375rem] top-1 z-10 h-3 w-3 rounded-full border-2 border-[color:var(--primary-300)] bg-white lg:start-auto lg:end-0 lg:top-[54px]" aria-hidden="true" />
                    <strong className="font-semibold text-[color:var(--primary-700)] lg:block">{t.pay.after[0]}</strong> <span className="text-[color:var(--text-tertiary)] lg:block">{t.pay.after[1]}</span>
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
