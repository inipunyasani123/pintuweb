import type { ClientKey } from '../content/clients'

// Ilustrasi jenis usaha tiap proyek klien: gambar garis buatan sendiri (bukan foto/tangkapan layar klien), satu gaya
// untuk semuanya: kanvas 64×64, garis 2px berujung bulat warna `currentColor`, satu bidang isi tembus pandang
// (`fill-current` + opacity) sebagai aksen. Warna diatur pemanggil lewat `color`. Murni hiasan (aria-hidden).

const PATHS: Record<ClientKey, React.ReactNode> = {
  // Laundry: mesin cuci, jendela bulat berisi air
  freshfold: (
    <>
      <rect x="13" y="8" width="38" height="48" rx="6" />
      <path d="M13 19h38" />
      <circle cx="21" cy="13.5" r="1.6" />
      <circle cx="27" cy="13.5" r="1.6" />
      <path d="M38 13.5h7" />
      <circle cx="32" cy="37" r="12" />
      <path className="fill-current opacity-20" stroke="none" d="M20.6 39.5c3.6-2.4 7.2 2.4 11.4 0s7.8 2.4 11.4 0A12 12 0 0 1 20.6 39.5z" />
      <path d="M21 39.6c3.6-2.4 7.3 2.4 11 0s7.4 2.4 11 0" />
    </>
  ),
  // Bahan bangunan: tumpukan bata + sendok semen (cetok)
  'sumber-rejeki': (
    <>
      <path className="fill-current opacity-20" stroke="none" d="M8 44h24v10H8z" />
      <rect x="8" y="44" width="24" height="10" rx="1.5" />
      <rect x="32" y="44" width="24" height="10" rx="1.5" />
      <rect x="20" y="34" width="24" height="10" rx="1.5" />
      <rect x="14" y="24" width="18" height="10" rx="1.5" />
      <path d="M40 28l9-13 7 9z" className="fill-current opacity-20" />
      <path d="M40 28l9-13 7 9z" />
      <path d="M52.5 19.5l5-6" />
      <path d="M56 11.5l3.5-4" strokeWidth={3.5} />
    </>
  ),
  // Bengkel motor: sepeda motor
  'arif-motor': (
    <>
      <circle cx="15" cy="44" r="9" />
      <circle cx="49" cy="44" r="9" />
      <circle cx="15" cy="44" r="2.2" />
      <circle cx="49" cy="44" r="2.2" />
      <rect x="23" y="33" width="13" height="9" rx="2" className="fill-current opacity-20" />
      <rect x="23" y="33" width="13" height="9" rx="2" />
      <path d="M15 44l8-7M36 38l6-2" />
      <path d="M17 29h12l4 4h8" />
      <path d="M49 44l-7-20h-4M42 24h6" />
    </>
  ),
  // Bimbingan belajar: buku terbuka + topi wisuda
  'cerdas-akademi': (
    <>
      <path d="M32 14L10 23l22 9 22-9z" className="fill-current opacity-20" />
      <path d="M32 14L10 23l22 9 22-9z" />
      <path d="M18 27v8c0 3 6 6 14 6s14-3 14-6v-8" />
      <path d="M54 23v10" />
      <path d="M8 46c8-3 16-3 24 2 8-5 16-5 24-2v10c-8-3-16-3-24 2-8-5-16-5-24-2z" />
      <path d="M32 48v10" />
    </>
  ),
  // Kopi: cangkir mengepul + biji kopi
  'lereng-coffee': (
    <>
      <path d="M12 30h30v10a14 14 0 0 1-14 14h-2a14 14 0 0 1-14-14z" className="fill-current opacity-20" stroke="none" />
      <path d="M12 30h30v10a14 14 0 0 1-14 14h-2a14 14 0 0 1-14-14z" />
      <path d="M42 33h3a6 6 0 0 1 0 12h-4" />
      <path d="M20 22c-2-3 2-5 0-8M28 22c-2-3 2-5 0-8M36 22c-2-3 2-5 0-8" />
      <ellipse cx="52" cy="18" rx="5" ry="7.5" transform="rotate(30 52 18)" />
      <path d="M49 12c3 3 3 9 6 12" />
    </>
  ),
  // Distribusi: truk boks + paket
  'prima-distribusi': (
    <>
      <path d="M6 18h32v28H6z" className="fill-current opacity-20" stroke="none" />
      <rect x="6" y="18" width="32" height="28" rx="2" />
      <path d="M38 27h10l8 9v10H38z" />
      <path d="M44 27v9h12" />
      <circle cx="16" cy="48" r="5" />
      <circle cx="47" cy="48" r="5" />
      <path d="M16 18v10l4-2.5 4 2.5V18" />
    </>
  ),
}

/** Warna tiap ilustrasi (palet CATEGORY_COLOR di lib/portals.ts): garis kuat + latar muda, kontras teks >= 4,5:1. */
export const CLIENT_TONE: Record<ClientKey, { color: string; tint: string }> = {
  freshfold: { color: '#1d4ed8', tint: '#e8f0ff' },
  'sumber-rejeki': { color: '#92400e', tint: '#fdf1d3' },
  'arif-motor': { color: '#c2410c', tint: '#fff1e6' },
  'cerdas-akademi': { color: '#6d28d9', tint: '#f1ebff' },
  'lereng-coffee': { color: '#0f6b3b', tint: '#dff5e8' },
  'prima-distribusi': { color: '#0e7490', tint: '#e2f5fa' },
}

export default function ClientArt({ k, className = 'h-16 w-16' }: { k: ClientKey; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {PATHS[k]}
    </svg>
  )
}
