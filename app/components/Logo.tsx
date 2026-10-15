import Image from 'next/image'

// Logo PintuWeb milik pemilik situs: sumbernya public/images/logo.png. Yang dipakai di sini versi rapatnya
// (logo-pintuweb.png), dibuat oleh scripts/ikon-dari-logo.mjs bersama favicon, ikon aplikasi, dan logo OG.
const SRC = '/images/logo-pintuweb.png'
// Ukuran atribut = 2× tampilan terbesar (h-8: 23×32px), rasio sama dengan berkasnya (367×512). Tanpa `sizes`, Next
// membuat srcset 1x/2x saja (w=48 & w=96, berkas yang sama dengan sebelumnya), bukan 16 kandidat lebar per logo:
// logo ini muncul puluhan kali (header, footer, tiap kartu FAQ), jadi HTML-nya jauh lebih ringan. Tinggi tampilnya
// tetap diatur className (h-* w-auto).
const W = 46
const H = 64

export function LogoMark({ className = 'h-8 w-auto', priority = false }: { className?: string; priority?: boolean }) {
  return <Image src={SRC} alt="" width={W} height={H} priority={priority} className={className} />
}

/** Logo lengkap: gambar logo + nama. Di latar gelap logonya diberi alas putih supaya biru gelapnya tetap terbaca. */
export function Logo({ tone = 'ink', priority = false }: { tone?: 'ink' | 'light'; priority?: boolean }) {
  const light = tone === 'light'
  return (
    <span className="inline-flex items-center gap-2.5">
      {light ? (
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white">
          <LogoMark className="h-6 w-auto" />
        </span>
      ) : (
        <LogoMark className="h-8 w-auto" priority={priority} />
      )}
      <span className={`display text-[1.25rem] leading-none tracking-[-0.02em] ${light ? 'text-white' : 'text-[color:var(--text-primary)]'}`}>PintuWeb</span>
    </span>
  )
}
