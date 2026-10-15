import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PACKAGES } from '../lib/packages'
import { getDict } from '../i18n'
import { path } from '../i18n/routes'
import type { Lang } from '../i18n/config'
import SectionHead from './SectionHead'
import { HlText } from './Bits'
import PriceMap from './PriceMap'

// Bagian harga di beranda: peta harga semua paket (komponen PriceMap, juga dipakai di halaman harga), lalu cara bayar
// & masa setelah online, dan tautan ke rincian paket. Peta tampil di semua ukuran layar, termasuk ponsel
// (keputusan pemilik situs, 16 Okt 2026).
export default function Pricing({ lang }: { lang: Lang }) {
  const t = getDict(lang).pricing

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={t.eyebrow} id="pricing-title" title={<HlText parts={t.title} />} lead={t.lead} />

        <PriceMap lang={lang} base={`${path(lang, 'pricing')}#`} className="mt-8 sm:mt-12 lg:mt-14" />

        <div className="mt-7 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-center lg:gap-10">
          <p className="border-t border-[color:var(--border-light)] pt-4 leading-relaxed text-[color:var(--text-tertiary)] sm:border-0 sm:pt-0">
            <span className="block font-semibold text-[color:var(--text-primary)]">{t.depositTitle}</span>
            {t.depositBody}
          </p>
          <p className="border-t border-[color:var(--border-light)] pt-4 leading-relaxed text-[color:var(--text-tertiary)] sm:border-0 sm:pt-0">
            <span className="block font-semibold text-[color:var(--text-primary)]">{t.maintTitle}</span>
            {t.maintBody}
          </p>
          <Link href={path(lang, 'pricing')} className="btn btn-solid mt-2 w-full sm:col-span-2 sm:mt-0 sm:w-auto sm:justify-self-start lg:col-span-1 lg:justify-self-end">
            {t.seeAll(PACKAGES.length)} <ArrowRight size={17} className="arw" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
