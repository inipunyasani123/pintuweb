import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarCheck, Check, Clock, Images, Link2, MailOpen, Megaphone, MessageCircle, ShoppingCart, Smartphone, Store, type LucideIcon } from 'lucide-react'
import { wa } from '../lib/site'
import { getDict } from '../i18n'
import type { Lang } from '../i18n/config'
import { path, pathOf } from '../i18n/routes'
import { needsFor, type NeedKey } from '../content/needs'
import { serviceOf, serviceText } from '../content/services'
import { keepRange } from '../content/service-utils'
import { quoteText } from '../i18n/facts'
import SectionHead from './SectionHead'
import { LogoMark } from './Logo'
import Tabs from './Tabs'

// "Untuk siapa" di beranda = PEMILIH KEBUTUHAN (keputusan pemilik 22 Okt 2026: bagian ini dulu daftar panjang yang
// membingungkan orang awam). Deretan tombol kebutuhan pendek; mengetuk satu menampilkan SATU kartu jawaban: kalimat
// kebutuhannya sebagai gelembung obrolan, lalu paket yang pas, harga mulai, lama pengerjaan, tiga isi utama paket,
// tombol WhatsApp (pesannya sudah berisi kebutuhan itu), dan tautan ke halaman layanannya. Semua angka dari
// lib/packages.ts lewat content/needs.ts. Ponsel: tombol dalam kisi 2 kolom (label panjang boleh dua baris, tanpa gulir
// menyamping), kartu di bawahnya; tablet 4 kolom. Tombol terakhir yang sendirian di barisnya (9 pilihan sejak aplikasi
// HP, 23 Okt 2026) dibentang selebar kisi.
// Desktop: bento, tombol dua kolom di kiri, kartu besar di kanan. Kartu ditumpuk di satu sel grid (Tabs mode
// 'stack'), jadi tingginya tetap saat pilihan berganti.

const ICON: Partial<Record<NeedKey, LucideIcon>> = {
  promo: Megaphone,
  profil: Store,
  jualan: MessageCircle,
  toko: ShoppingCart,
  tautan: Link2,
  undangan: MailOpen,
  portofolio: Images,
  booking: CalendarCheck,
  hp: Smartphone,
}

export default function AudienceSection({ lang }: { lang: Lang }) {
  const d = getDict(lang)
  const t = d.audience
  const items = needsFor(lang, 'home')

  // kelas aud-* di globals.css: isi utilitasnya sama, dipindah supaya 9 kartu tidak mengulangnya di HTML & payload RSC
  const panels = items.map((n) => {
    const svc = n.service ? serviceOf(n.service) : null
    return (
      <article key={n.key} className="aud-card">
        {/* kebutuhan pengunjung sebagai pesan masuk, jawaban kami di bawahnya */}
        <p className="aud-need">
          <span className="sr-only">{t.needLabel}: </span>
          {n.need}
        </p>

        <div className="aud-head">
          <span className="aud-logo" aria-hidden="true">
            <LogoMark className="h-5 w-auto" />
          </span>
          <div className="min-w-0">
            <p className="kicker text-[color:var(--primary-700)]">{t.answer}</p>
            <h3 className="aud-title">{n.pkg.title}</h3>
          </div>
        </div>

        <dl className="aud-facts">
          <div className="aud-tile">
            <dt className="aud-dt">{n.pkg.quote ? quoteText(lang).label : d.pkg.from}</dt>
            <dd className="display aud-price">{n.pkg.priceFrom}</dd>
          </div>
          <div className="aud-tile">
            <dt className="aud-dt flex items-center gap-1.5">
              <Clock size={13} aria-hidden="true" />
              {d.pkg.duration}
            </dt>
            <dd className="aud-dur">{keepRange(n.pkg.duration)}</dd>
          </div>
        </dl>

        <p className="aud-inc">{t.includes}</p>
        <ul className="mt-2 space-y-1.5">
          {n.pkg.features.slice(0, 3).map((f) => (
            <li key={f} className="aud-li">
              <Check size={16} strokeWidth={2.4} className="aud-ck" aria-hidden="true" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="aud-act">
          <a href={wa(t.wa(n.need, n.pkg.title))} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
            {t.ask} <ArrowUpRight size={16} className="arw arw-ne" aria-hidden="true" />
            <span className="sr-only">{d.common.newTabShort}</span>
          </a>
          {svc ? (
            <Link href={pathOf(lang, { key: 'services', service: svc.key })} className="link aud-link">
              {t.service(serviceText(svc, lang).name)} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          ) : (
            <Link href={`${path(lang, 'pricing')}#${n.pkg.slug}`} className="link aud-link">
              {t.pricing} <ArrowRight size={15} className="arw" aria-hidden="true" />
            </Link>
          )}
        </div>
      </article>
    )
  })

  const tabs = items.map((n) => {
    const Icon = ICON[n.key]
    return {
      id: n.key,
      label: (
        <Fragment key={n.key}>
          {Icon && <Icon size={17} strokeWidth={2} className="shrink-0" aria-hidden="true" />}
          <span>{n.label}</span>
        </Fragment>
      ),
    }
  })

  return (
    <section id="untuk-siapa" aria-labelledby="audience-title" className="section-y bg-[color:var(--surface-soft)]">
      {/* ponsel: judul, pilihan, kartu, ajakan; desktop: judul + pilihan + ajakan di kiri, kartu di kanan */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 px-4 [grid-template-areas:'head'_'tabs'_'card'_'other'] sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 lg:[grid-template-areas:'head_card'_'tabs_card'_'other_card']">
        <div className="[grid-area:head]">
          <SectionHead eyebrow={t.eyebrow} id="audience-title" title={t.title} lead={t.lead} />
        </div>
        <Tabs
          idBase="butuh"
          label={t.tabs}
          tabs={tabs}
          panels={panels}
          mode="stack"
          listClass="mt-6 grid grid-cols-2 gap-2 [grid-area:tabs] sm:mt-8 sm:grid-cols-4 lg:grid-cols-2 lg:gap-2.5 [&>:last-child:nth-child(odd)]:col-span-full"
          tabClass="flex min-h-11 items-center gap-2 rounded-2xl px-3.5 py-2 text-start text-[0.9375rem] font-semibold leading-tight transition-colors lg:px-4 lg:py-3"
          onClass="bg-[color:var(--primary-700)] text-white"
          offClass="bg-white text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)] hover:text-[color:var(--primary-700)] hover:ring-[color:var(--primary-300)]"
          panelsClass="mt-5 [grid-area:card] sm:mt-6 lg:mt-0"
        />
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)] [grid-area:other] lg:mt-6">
          {t.otherTitle}{' '}
          <a href={wa(t.otherWa)} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 font-semibold">
            {t.otherCta} <ArrowUpRight size={15} className="arw-ne" aria-hidden="true" />
            <span className="sr-only">{d.common.newTabShort}</span>
          </a>
        </p>
      </div>
    </section>
  )
}
