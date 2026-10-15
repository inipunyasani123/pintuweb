import Link from 'next/link'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { EMAIL, WA_DISPLAY, WA_NUMBER, wa } from '../lib/site'
import { DEMOS } from '../lib/demos'
import { PORTALS } from '../lib/portals'
import { getDict } from '../i18n'
import { facts } from '../i18n/facts'
import { LANGS, LANG_INFO, type Lang } from '../i18n/config'
import { hasPage, path, pathOf } from '../i18n/routes'
import { SERVICES, serviceText } from '../content/services'
import { HlText } from './Bits'
import FooterAction from './FooterAction'
import { Logo, LogoMark } from './Logo'

// Footer = ajakan penutup + kontak + peta tautan internal (semua layanan, galeri, sumber daya, halaman perusahaan).
// Ajakannya berbentuk kartu obrolan: sapaan dari PintuWeb, beberapa pesan pembuka siap pakai, dan kolom untuk
// menulis sendiri. Semuanya tautan biasa yang membuka WhatsApp dengan pesan terisi (tanpa JavaScript).
export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang)
  const f = facts(lang)
  const year = new Date().getFullYear()

  const CONTACTS: { label: string; value: string; sub?: string; link?: string }[] = [
    { label: t.footer.phone, value: WA_DISPLAY, link: `https://wa.me/${WA_NUMBER}` },
    { label: t.footer.email, value: EMAIL, link: `mailto:${EMAIL}` },
    { label: t.footer.location, value: f.location, sub: f.serves },
    { label: t.footer.hours, value: f.hoursDays, sub: f.hoursTime },
  ]

  const cols: { title: string; links: { label: string; href: string; zone?: boolean }[] }[] = [
    {
      title: t.footer.colServices,
      links: SERVICES.map((s) => ({ label: serviceText(s, lang).name, href: pathOf(lang, { key: 'services', service: s.key }) })),
    },
    {
      title: t.footer.colGalleries,
      links: PORTALS.map((p) => ({ label: t.portfolio.galleries[p.category].title, href: `/${p.path}`, zone: true })),
    },
    {
      title: t.footer.colResources,
      links: [
        ...(hasPage(lang, 'articles') ? [{ label: t.links.articles, href: path(lang, 'articles') }] : []),
        { label: t.links.glossary, href: path(lang, 'glossary') },
        { label: t.links.demo, href: path(lang, 'demo') },
        { label: t.links.pricing, href: path(lang, 'pricing') },
        { label: t.links.faq, href: path(lang, 'faq') },
      ],
    },
    {
      title: t.footer.colCompany,
      links: [
        { label: t.links.about, href: path(lang, 'about') },
        { label: t.links.founder, href: path(lang, 'founder') },
        { label: t.links.contact, href: path(lang, 'contact') },
        { label: t.links.privacy, href: path(lang, 'privacy') },
        { label: t.links.terms, href: path(lang, 'terms') },
      ],
    },
  ]

  return (
    <footer id="contact" className="relative overflow-hidden bg-[color:var(--navy)] text-white" aria-label={t.footer.aria}>
      <div className="section-t relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <p className="kicker text-[color:var(--accent-200)]">{t.footer.kicker}</p>
            <h2 className="mt-4 text-[2.25rem] leading-[1.08] sm:mt-5 sm:text-[2.75rem] lg:text-[3.1rem]">
              <HlText parts={t.footer.title} mode="italic" tone="accent" />
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75 sm:mt-6">{t.footer.lead(f.response)}</p>
            <FooterAction
              pricing={{ href: path(lang, 'pricing'), label: t.footer.seePackages }}
              demos={{ href: path(lang, 'demo'), label: t.portfolio.allDemos(DEMOS.length) }}
            />
          </div>

          {/* Kartu obrolan: tiap gelembung biru adalah pesan pembuka yang langsung membuka WhatsApp.
              data-light: kartu terang di footer gelap, cincin fokusnya tetap biru (globals.css). */}
          <div className="lg:col-span-5">
            <div data-light className="max-w-md rounded-[1.75rem] bg-white p-3 text-[color:var(--text-primary)] shadow-[0_40px_70px_-40px_rgb(0_0_0/0.75)] sm:p-4">
              <div className="flex items-center gap-3 px-2 pb-3 pt-1">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--primary-50)] ring-1 ring-[color:var(--border-light)]" aria-hidden="true">
                  <LogoMark className="h-5 w-auto" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-tight">PintuWeb</span>
                  <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">
                    {f.hoursDays} · {f.hoursTime}
                  </span>
                </span>
              </div>

              <div className="rounded-[1.25rem] bg-[color:var(--surface-soft)] p-4">
                <p className="max-w-[88%] rounded-[1.125rem] rounded-ss-md bg-white px-4 py-2.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-secondary)] ring-1 ring-[color:var(--border-light)]">{t.footer.chatHello}</p>
                <p className="mt-5 text-end text-[0.8125rem] text-[color:var(--text-tertiary)]">{t.footer.chatPick}</p>
                <ul className="mt-2 flex flex-col items-end gap-2">
                  {t.footer.starters.map((s) => (
                    <li key={s.label}>
                      <a
                        href={wa(s.text)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-[1.125rem] rounded-ee-md bg-[color:var(--primary-700)] px-4 py-2.5 text-start text-[0.9375rem] font-medium leading-snug text-white transition-colors hover:bg-[color:var(--primary-800)]"
                      >
                        {s.label} <ArrowUpRight size={15} className="arw-ne shrink-0 opacity-80 transition-transform" aria-hidden="true" />
                        <span className="sr-only">{t.common.newTabShort}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={wa(t.footer.waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-3 flex h-12 items-center justify-between gap-3 rounded-full bg-[color:var(--surface-soft)] ps-5 pe-1.5 text-[0.9375rem] text-[color:var(--text-tertiary)] ring-1 ring-[color:var(--border-light)] transition-shadow hover:ring-[color:var(--primary-300)]"
              >
                <span className="min-w-0 truncate">{t.footer.chatOwn}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--primary-700)] text-white transition-colors group-hover:bg-[color:var(--primary-800)]" aria-hidden="true">
                  <ArrowUp size={17} />
                </span>
                <span className="sr-only">{t.common.newTabShort}</span>
              </a>
            </div>
          </div>
        </div>

        {/* dua kolom sejak ponsel: alamat email sekarang pendek (cs@pintuweb.id), jadi muat di setengah lebar */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-8 sm:mt-16 sm:gap-y-8 sm:pt-10 lg:mt-20 lg:grid-cols-4">
          {CONTACTS.map((c) => (
            <div key={c.label} className="min-w-0">
              <dt className="text-sm text-white/65">{c.label}</dt>
              <dd className="mt-1.5 min-w-0">
                {c.link ? (
                  // WhatsApp dibuka di tab baru (diumumkan lewat teks sr-only); mailto: cukup di tab yang sama
                  <a
                    href={c.link}
                    {...(c.link.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="py-1 text-white underline decoration-white/35 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-white"
                  >
                    <bdi>{c.value}</bdi>
                    {!c.link.startsWith('mailto:') && <span className="sr-only"> {t.common.newTabShort}</span>}
                  </a>
                ) : (
                  <span className="text-white"><bdi>{c.value}</bdi></span>
                )}
                {c.sub && <span className="mt-0.5 block text-sm text-white/65">{c.sub}</span>}
              </dd>
            </div>
          ))}
        </dl>

        {/* Ponsel: tiap kelompok tautan bisa dilipat (semua tautan tetap ada di HTML); mulai 640px: empat kolom terbuka. */}
        <nav aria-label={t.footer.linksAria} className="mt-10 sm:hidden">
          {cols.map((c) => (
            <details key={c.title} className="group border-t border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="kicker text-[color:var(--accent-200)]">{c.title}</span>
                <span aria-hidden="true" className="relative h-3 w-3 shrink-0 text-white/65 transition-transform duration-300 group-open:rotate-45">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <ul className="-mt-1 pb-4">
                {c.links.map((l) => (
                  <li key={l.href}>
                    {l.zone ? (
                      <a href={l.href} className="block py-1.5 text-[0.9375rem] text-white/75 transition-colors hover:text-white">{l.label}</a>
                    ) : (
                      <Link href={l.href} prefetch={false} className="block py-1.5 text-[0.9375rem] text-white/75 transition-colors hover:text-white">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
        <nav aria-label={t.footer.linksAria} className="mt-10 hidden grid-cols-4 gap-x-6 gap-y-10 border-t border-white/10 pt-12 sm:grid">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="kicker text-[color:var(--accent-200)]">{c.title}</p>
              {/* tautan block + py-1.5 (bidang sentuh ±34px, bukan 18px); jarak antarbaris diambil dari bantalan itu,
                  jadi susunannya tetap seperti sebelumnya */}
              <ul className="mt-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    {l.zone ? (
                      // Portal = zona Next terpisah: tautan biasa, bukan navigasi klien.
                      <a href={l.href} className="block py-1.5 text-[0.9375rem] text-white/75 transition-colors hover:text-white">{l.label}</a>
                    ) : (
                      <Link href={l.href} prefetch={false} className="block py-1.5 text-[0.9375rem] text-white/75 transition-colors hover:text-white">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-white/65 sm:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <Logo tone="light" />
          <p>{t.footer.copyright(year)}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{t.footer.otherLangs}:</span>
            {LANGS.filter((l) => l !== lang).map((l) => (
              <a key={l} href={path(l, 'home')} hrefLang={LANG_INFO[l].hreflang} lang={LANG_INFO[l].htmlLang} className="-my-0.5 py-0.5 text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white">
                {LANG_INFO[l].name}
              </a>
            ))}
          </p>
          <p>{t.footer.basedIn}</p>
        </div>
      </div>
    </footer>
  )
}
