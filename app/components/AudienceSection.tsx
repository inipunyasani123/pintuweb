import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { wa } from '../lib/site'
import { getDict } from '../i18n'
import type { Lang } from '../i18n/config'
import { path } from '../i18n/routes'
import { needsFor, type NeedItem } from '../content/needs'
import { keepRange } from '../content/service-utils'
import SectionHead from './SectionHead'

// "Untuk siapa" di beranda: kebutuhan → paket. Tiap baris berisi kebutuhan dalam kata sehari-hari, paket yang pas,
// harga mulai, dan lama pengerjaannya (semua dari content/needs.ts + lib/packages.ts), lalu menaut ke kartu paketnya
// di halaman Harga. Tanpa tangkapan layar: demo sudah tampil di bagian atas beranda.

/**
 * Daftar kebutuhan → paket bergaya daftar menu: kebutuhan di kiri, titik penuntun, nama paket di kanan, lalu harga
 * mulai & lama pengerjaan di bawahnya. Di ponsel satu kolom bertumpuk (tanpa titik penuntun); di desktop dua kolom.
 * Dipakai beranda (sebagian kebutuhan) dan halaman Harga (semua kebutuhan).
 */
export function NeedsList({ lang, items, base, className = '' }: { lang: Lang; items: NeedItem[]; base: string; className?: string }) {
  const from = getDict(lang).pkg.from
  // Jangkar di halaman yang sama memakai <a> biasa: navigasi klien Next tidak memicu :target (sorotan kartu tujuan).
  const Row = base.startsWith('#') ? 'a' : Link
  return (
    <ul className={`grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 ${className}`}>
      {items.map((n) => (
        <li key={n.key} className="border-b border-[color:var(--border-light)] first:border-t lg:[&:nth-child(2)]:border-t">
          <Row href={base + n.pkg.slug} className="group block py-3 sm:py-3.5">
            <span className="flex items-end gap-2.5">
              <span className="min-w-0 font-medium leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--primary-700)]">{n.need}</span>
              <span className="leader hidden min-w-4 sm:block" aria-hidden="true" />
              <span className="hidden shrink-0 text-[0.9375rem] font-semibold leading-snug text-[color:var(--primary-700)] sm:block">{n.pkg.title}</span>
            </span>
            <span className="mt-1 block text-[0.875rem] leading-snug text-[color:var(--text-tertiary)] sm:text-end">
              <span className="font-semibold text-[color:var(--primary-700)] sm:hidden">{n.pkg.title}</span>
              <span className="sm:hidden" aria-hidden="true">
                {' · '}
              </span>
              {/* "mulai" tidak boleh terpisah dari harganya saat baris patah */}
              <span className="whitespace-nowrap">
                {from} <span className="font-semibold text-[color:var(--text-secondary)]">{n.pkg.priceFrom}</span>
              </span>
              <span aria-hidden="true">{' · '}</span>
              <span>{keepRange(n.pkg.duration)}</span>
            </span>
          </Row>
        </li>
      ))}
    </ul>
  )
}

export default function AudienceSection({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.audience
  const pricing = path(lang, 'pricing')

  return (
    <section id="untuk-siapa" aria-labelledby="audience-title" className="section-y bg-[color:var(--surface-soft)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={t.eyebrow} id="audience-title" title={t.title} lead={t.lead} />

        <NeedsList lang={lang} items={needsFor(lang, 'home')} base={`${pricing}#`} className="mt-8 sm:mt-10 lg:mt-12" />
        <p className="mt-5">
          <Link href={`${pricing}#kebutuhan`} className="link inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold">
            {t.all} <ArrowRight size={15} className="arw" aria-hidden="true" />
          </Link>
        </p>

        {/* Untuk yang kebutuhannya tidak ada di atas */}
        <div className="mt-8 flex flex-col gap-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-[color:var(--border-light)] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <h3 className="text-[1.125rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.25rem]">{t.otherTitle}</h3>
            <p className="mt-1.5 max-w-xl text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{t.otherBody}</p>
          </div>
          <a href={wa(t.otherWa)} target="_blank" rel="noopener noreferrer" className="btn btn-solid shrink-0">
            {t.otherCta} <ArrowUpRight size={16} className="arw arw-ne" aria-hidden="true" />
            <span className="sr-only">{d.common.newTabShort}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
