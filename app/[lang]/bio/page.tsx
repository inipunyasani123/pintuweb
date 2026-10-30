// Halaman "link in bio" PintuWeb sendiri, untuk dipasang di bio TikTok/Instagram (www.pintuweb.id/bio?ref=tiktok).
// Keputusan: hanya bahasa Indonesia (bahasa lain notFound), noindex (halaman penyalur, bukan untuk pencarian), tidak masuk
// sitemap/hreflang (bukan bagian SEGMENTS), dan header/footer situs disembunyikan lewat CSS supaya pengunjung tidak keluar jalur.
// ?ref= dibaca WaSource (layout) dan ikut di semua pesan WhatsApp, juga setelah pengunjung pindah ke portal galeri.
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight,
  CalendarCheck,
  House,
  Images,
  Instagram,
  Link2,
  ListChecks,
  MailOpen,
  MapPin,
  Megaphone,
  MessageCircle,
  Music,
  PenTool,
  QrCode,
  ShoppingCart,
  Smartphone,
  Tag,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '../../components/Logo'
import { DEMOS, type DemoCategory } from '../../lib/demos'
import { CATEGORY_COLOR, portalOf } from '../../lib/portals'
import { CITY, GOOGLE_MAPS, RESPONSE, SITE, SOCIAL, wa } from '../../lib/site'
import { getDict } from '../../i18n'

type Params = { params: Promise<{ lang: string }> }

// Urutan baku galeri; nama menurut kebiasaan orang mencari (bukan nama teknis kategori).
const GALLERIES: { id: DemoCategory; label: string; icon: LucideIcon }[] = [
  { id: 'landing', label: 'Landing Page', icon: Megaphone },
  { id: 'toko', label: 'Toko Online', icon: ShoppingCart },
  { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
  { id: 'menu', label: 'Menu Digital', icon: QrCode },
  { id: 'linkinbio', label: 'Link in Bio', icon: Link2 },
  { id: 'kontes', label: 'Konsep Desain', icon: PenTool },
  { id: 'undangan', label: 'Undangan Digital', icon: MailOpen },
  { id: 'portfolio', label: 'Portofolio Pribadi', icon: Images },
  { id: 'reservasi', label: 'Reservasi & Booking', icon: CalendarCheck },
  { id: 'properti', label: 'Properti', icon: House },
  { id: 'todo', label: 'To-Do & Produktivitas', icon: ListChecks },
]

export const metadata: Metadata = {
  title: 'Bio PintuWeb',
  description: 'Pintu menuju web impianmu: lihat contoh website dan aplikasi, pilih paket, lalu chat lewat WhatsApp.',
  alternates: { canonical: `${SITE}/bio` },
  robots: { index: false, follow: true },
}

const row =
  'group flex min-h-14 items-center gap-3 rounded-[1.125rem] bg-white px-4 py-3 text-[color:var(--text-primary)] ring-1 ring-[color:var(--border-light)] transition-[box-shadow,transform] duration-200 hover:ring-[color:var(--primary-300)] motion-reduce:transition-none'

export default async function BioPage({ params }: Params) {
  const { lang } = await params
  if (lang !== 'id') notFound()
  const t = getDict('id')
  const count = (c: DemoCategory) => DEMOS.filter((d) => d.category === c).length

  return (
    <main id="main-content" className="min-h-dvh bg-[color:var(--surface-soft)] pb-10">
      {/* halaman penyalur: tanpa navigasi situs dan footer besar */}
      <style>{`body:has(#bio-page) > header, body:has(#bio-page) > footer { display: none }`}</style>
      <div id="bio-page" className="mx-auto flex max-w-md flex-col px-4 pt-10 sm:pt-14">
        <div className="flex flex-col items-center text-center">
          <Logo priority />
          <h1 className="mt-5 text-[1.625rem] leading-[1.15] text-[color:var(--text-primary)]">{t.header.tagline}</h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-[color:var(--text-secondary)]">
            Jasa pembuatan website dan aplikasi, berlokasi di {CITY}. Lihat contohnya dulu, lalu ceritakan kebutuhanmu.
          </p>
        </div>

        <a
          href={wa(t.header.waText)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solid mt-7 w-full"
        >
          <MessageCircle size={18} aria-hidden="true" /> {t.conv.chat}
          <span className="sr-only">{t.common.newTabShort}</span>
        </a>
        <p className="mt-2.5 text-center text-[0.875rem] text-[color:var(--text-tertiary)]">{RESPONSE}</p>

        <h2 className="kicker mt-10 text-[color:var(--primary-700)]">Lihat contoh website dan aplikasi</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {GALLERIES.map((g) => {
            const portal = portalOf(g.id)
            if (!portal) return null
            const c = CATEGORY_COLOR[g.id]
            return (
              <li key={g.id}>
                {/* portal = zona Next lain di origin yang sama: tautan biasa, bukan next/link */}
                <a href={`/${portal.path}`} className={row}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: c.tint, color: c.color }} aria-hidden="true">
                    <g.icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{g.label}</span>
                    <span className="block text-[0.8125rem] text-[color:var(--text-tertiary)]">{count(g.id)} demo</span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--primary-700)]" aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>

        <ul className="mt-6 flex flex-col gap-2.5">
          <li>
            <Link href="/paket" className={row}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--primary-50)] text-[color:var(--primary-700)]" aria-hidden="true">
                <Tag size={20} strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 font-semibold leading-snug">Lihat paket dan harga</span>
              <ArrowUpRight size={16} className="shrink-0 text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--primary-700)]" aria-hidden="true" />
            </Link>
          </li>
          <li>
            <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className={row}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--primary-50)] text-[color:var(--primary-700)]" aria-hidden="true">
                <MapPin size={20} strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1 font-semibold leading-snug">Lokasi di Google Maps</span>
              <ArrowUpRight size={16} className="shrink-0 text-[color:var(--text-muted)] transition-colors group-hover:text-[color:var(--primary-700)]" aria-hidden="true" />
              <span className="sr-only">{t.common.newTabShort}</span>
            </a>
          </li>
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            <Music size={17} aria-hidden="true" /> TikTok
            <span className="sr-only">{t.common.newTabShort}</span>
          </a>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            <Instagram size={17} aria-hidden="true" /> Instagram
            <span className="sr-only">{t.common.newTabShort}</span>
          </a>
        </div>

        <p className="mt-8 text-center text-[0.875rem] text-[color:var(--text-tertiary)]">
          <Link href="/" className="link">pintuweb.id</Link>
        </p>
      </div>
    </main>
  )
}
