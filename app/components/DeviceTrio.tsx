'use client'
// Trio perangkat bagian beranda "Demo pilihan" (Portfolio.tsx): laptop di belakang, tablet, ponsel di depan, dirangkai
// dari HTML/CSS (.trio/.dv-*/.win/.shot di globals.css) dengan gaya bingkai mockup /demo. Layar tiap perangkat =
// tangkapan PANJANG situs live di ukuran perangkat itu (public/images/karya/<slug>-<desktop|tablet|phone>.webp,
// ukuran & warna bilah status di app/content/karya.json; dibuat `node scripts/demo-mockups.mjs screens <slug...>`
// lalu `node scripts/static-images.mjs . --dirs public/images`).
//
// Sengaja komponen klien walau tanpa state/efek: HTML-nya tetap dirender di server (tampil tanpa JS), tetapi pohon
// ±20 elemen × 5 kartu tidak ikut diulang di payload RSC beranda (yang dikirim hanya 4 prop per kartu). Dokumen
// beranda tetap seberat sebelumnya; tiap ±0,5 KB gzip tambahan menggeser FCP simulasi Lighthouse ponsel.
import SCREENS from '../content/karya.json'
import staticImageLoader from '../../image-loader'

export type TrioSlug = keyof typeof SCREENS
type Dev = 'desktop' | 'tablet' | 'phone'
/** lebar panggung trio per titik henti: px di ≥1024, lalu [a, b] = a vw − b px di ≥640 dan di bawahnya */
export type Stage = { lg: number; sm: [number, number]; base: [number, number] }

// Lebar layar tiap perangkat sebagai bagian dari lebar panggung (.trio-wide / .trio-tight di globals.css):
// layar laptop 838, tablet 370, ponsel 218 satuan kanvas, dikali skala perangkatnya, dibagi lebar kanvas.
const FRACTION: Record<'wide' | 'tight', Record<Dev, number>> = {
  wide: { desktop: 838 / 1400, tablet: 370 / 1400, phone: 218 / 1400 },
  tight: { desktop: (838 * 0.875) / 1000, tablet: (370 * 0.86) / 1000, phone: (218 * 0.92) / 1000 },
}
// (a vw − b px) × f − 2px (garis tepi layar) = (a·f) vw − (b·f + 2) px
const lin = ([a, b]: [number, number], f: number) => `calc(${Math.round(a * f * 10) / 10}vw - ${Math.round(b * f + 2)}px)`
function sizes(stage: Stage, main: boolean, dev: Dev) {
  const big = FRACTION[main ? 'wide' : 'tight'][dev] // ≥640px; di bawahnya semua kartu memakai susunan rapat
  return `(min-width:1024px) ${Math.round(stage.lg * big) - 2}px,(min-width:640px) ${lin(stage.sm, big)},${lin(stage.base, FRACTION.tight[dev])}`
}
// Varian statis yang mungkin dipilih tiap layar: layar laptop paling lebar ±405px CSS (kartu utama di tablet),
// tablet ±180px, ponsel ±105px; dikali DPR 2. Lebih sedikit dari srcset bawaan next/image (9 lebar).
const WIDTHS: Record<Dev, number[]> = { desktop: [256, 384, 640, 828], tablet: [128, 256, 384], phone: [64, 128, 256] }

function Shot({ slug, dev, sz }: { slug: TrioSlug; dev: Dev; sz: string }) {
  const [w, h] = SCREENS[slug][dev]
  const src = `/images/karya/${slug}-${dev}.webp`
  const ws = WIDTHS[dev]
  return (
    // eslint-disable-next-line @next/next/no-img-element -- varian statis yang sama dengan next/image, srcset dipangkas
    <img
      src={staticImageLoader({ src, width: ws[1] })}
      srcSet={ws.map((x) => `${staticImageLoader({ src, width: x })} ${x}w`).join(',')}
      sizes={sz}
      width={w}
      height={h}
      alt=""
      loading="lazy"
      decoding="async"
      className="shot"
    />
  )
}

/** Dekoratif (aria-hidden): nama & jenis demonya sudah ada di teks tautan kartunya. */
export default function DeviceTrio({ slug, main, host, stage }: { slug: TrioSlug; main: boolean; host: string; stage: Stage }) {
  const s = SCREENS[slug]
  const sz = (dev: Dev) => sizes(stage, main, dev)
  // perkiraan lebar teks 13 satuan, supaya gembok + domain tampak di tengah kolom alamat
  const lockX = Math.round(411 - host.length * 3.55)
  return (
    <span className={`trio ${main ? 'trio-main' : 'trio-tight'}`} aria-hidden="true">
      <span className="dv dv-lap">
        <span className="dv-scr">
          <svg className="dv-bar" viewBox="0 0 838 40">
            <use href="#dv-chrome" />
            <use href="#dv-lock" x={lockX} />
            <text x="425" y="24.6" textAnchor="middle" fontSize="13" fill="#5d6b88">
              {host}
            </text>
          </svg>
          <span className="win">
            <Shot slug={slug} dev="desktop" sz={sz('desktop')} />
          </span>
        </span>
      </span>
      <span className="dv dv-tab">
        <span className="dv-scr win">
          <Shot slug={slug} dev="tablet" sz={sz('tablet')} />
        </span>
      </span>
      <span className="dv dv-pho">
        {/* bilah status berwarna puncak halaman (seperti Safari) + pulau kamera */}
        <span className="dv-scr" style={{ background: s.top, color: s.fg }}>
          <svg className="dv-bar" viewBox="0 0 218 26">
            <use href="#dv-status" />
          </svg>
          <span className="win">
            <Shot slug={slug} dev="phone" sz={sz('phone')} />
          </span>
        </span>
      </span>
    </span>
  )
}

/** Bilah peramban & bilah status ponsel dipakai lima kali: digambar sekali sebagai simbol SVG. */
export function DeviceSprites() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <symbol id="dv-chrome" viewBox="0 0 838 40">
        <rect width="838" height="40" fill="#f3f6fd" />
        <path d="M0 39.5h838" stroke="#d3dcee" vectorEffect="non-scaling-stroke" />
        <circle cx="24" cy="20" r="5.5" fill="#f4a6a0" />
        <circle cx="43" cy="20" r="5.5" fill="#f5d08a" />
        <circle cx="62" cy="20" r="5.5" fill="#9fd8a8" />
        <rect x="234.5" y="8" width="369" height="24" rx="12" fill="#fff" stroke="#d3dcee" vectorEffect="non-scaling-stroke" />
      </symbol>
      <g id="dv-lock" fill="#7d8bab">
        <rect y="18" width="9" height="7" rx="1.5" />
        <path d="M1.8 18v-2.2a2.7 2.7 0 0 1 5.4 0V18" fill="none" stroke="#7d8bab" strokeWidth="1.6" />
      </g>
      {/* teks & ikon = currentColor (gelap/terang menurut warna puncak halaman) */}
      <symbol id="dv-status" viewBox="0 0 218 26" fill="currentColor">
        <rect x="79" y="5" width="60" height="17" rx="8.5" fill="#111827" />
        <text x="30" y="18.6" textAnchor="middle" fontSize="10" fontWeight="600">
          9:41
        </text>
        <path d="M152 16.6h2.6v2.9H152zM156 14.7h2.6v4.8H156zM160 12.8h2.6v6.7H160zM164 10.9h2.6v8.6H164zM175.4 13.4h11v4.7h-11z" />
        <rect x="174" y="12" width="16" height="7.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" opacity=".55" />
      </symbol>
    </svg>
  )
}
