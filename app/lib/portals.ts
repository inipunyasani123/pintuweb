// Portal katalog yang tayang di bawah domain ini (multi-zone). Tiap portal tetap project Vercel
// sendiri dengan basePath = path di sini; next.config.ts meneruskan permintaannya. Isinya berbahasa Indonesia.
import type { DemoCategory } from './demos'

/** Paket harga untuk tiap kategori demo/portal (slug di lib/packages.ts). */
export const PACKAGE_FOR_CATEGORY: Record<DemoCategory, string> = {
  landing: 'landing-page',
  toko: 'toko-online-simple',
  menu: 'landing-page',
  linkinbio: 'link-in-bio',
  kontes: 'konsep-desain',
  undangan: 'undangan-digital',
  portfolio: 'portofolio',
  reservasi: 'sistem-reservasi',
  properti: 'website-properti',
  todo: 'aplikasi-web',
}

/**
 * Warna khas tiap jenis website (aksen di beranda; tema situs tetap biru-putih).
 * color = warna kuat (teks di latar muda); to = ujung gradasi (color -> to dipakai untuk lencana, panggung
 * pratinjau, dan tombol berteks putih; kontras putih >= 4,5:1 di sepanjang gradasi); tint = latar mudanya.
 */
export const CATEGORY_COLOR: Record<DemoCategory, { color: string; to: string; tint: string }> = {
  landing: { color: '#c2410c', to: '#e11d48', tint: '#fff1e6' }, // jingga -> mawar
  toko: { color: '#be185d', to: '#7c3aed', tint: '#fdeef5' }, // merah muda -> ungu
  // hijau pindai; ujung gradasinya #138548 (bukan #17a35b yang lebih terang: putih di atasnya hanya 3,3:1)
  menu: { color: '#0f6b3b', to: '#138548', tint: '#dff5e8' }, // hijau tua -> hijau pindai
  linkinbio: { color: '#6d28d9', to: '#2563eb', tint: '#f1ebff' }, // ungu -> biru
  kontes: { color: '#047857', to: '#4d7c0f', tint: '#e3f6ee' }, // zamrud -> hijau limau
  undangan: { color: '#be123c', to: '#a21caf', tint: '#ffecef' }, // mawar -> magenta
  portfolio: { color: '#1d4ed8', to: '#0e7490', tint: '#e8f0ff' }, // biru -> toska
  reservasi: { color: '#92400e', to: '#c2410c', tint: '#fdf1d3' }, // cokelat emas -> jingga
  properti: { color: '#0e7490', to: '#047857', tint: '#e2f5fa' }, // toska -> zamrud
  todo: { color: '#a21caf', to: '#6d28d9', tint: '#fbeafc' }, // magenta -> ungu
}

export const PORTALS: { path: string; origin: string; category: DemoCategory; image: string }[] = [
  { path: 'landing-page', origin: 'https://portal-landing.pintuweb.id', category: 'landing', image: '/images/galeri/landing.jpg' },
  { path: 'link-in-bio', origin: 'https://portal-bio.pintuweb.id', category: 'linkinbio', image: '/images/galeri/bio.jpg' },
  { path: 'kontes-desain', origin: 'https://portal-kontes.pintuweb.id', category: 'kontes', image: '/images/galeri/kontes.jpg' },
  { path: 'undangan-digital', origin: 'https://portal-undangan.pintuweb.id', category: 'undangan', image: '/images/galeri/undangan.jpg' },
  { path: 'website-portofolio', origin: 'https://portal-porto.pintuweb.id', category: 'portfolio', image: '/images/galeri/porto.jpg' },
  { path: 'website-reservasi', origin: 'https://portal-reservasi.pintuweb.id', category: 'reservasi', image: '/images/galeri/reservasi.jpg' },
  { path: 'website-properti', origin: 'https://portal-properti.pintuweb.id', category: 'properti', image: '/images/galeri/properti.jpg' },
  { path: 'aplikasi-to-do', origin: 'https://portal-todo.pintuweb.id', category: 'todo', image: '/images/galeri/todo.jpg' },
  { path: 'menu-digital', origin: 'https://portal-menu.pintuweb.id', category: 'menu', image: '/images/galeri/menu.jpg' },
  { path: 'toko-online', origin: 'https://portal-toko.pintuweb.id', category: 'toko', image: '/images/galeri/toko.jpg' },
]

export const portalOf = (c: DemoCategory) => PORTALS.find((p) => p.category === c)

/**
 * Urutan jenis website di beranda (komponen Kinds lewat Hero.tsx); wajib memuat semua kategori. Jenis yang punya
 * portal menaut ke portalnya; kategori baru yang belum punya portal menaut ke galeri demo yang tersaring
 * (/demo#<kategori>) dengan gambar /images/galeri/<kategori>.jpg. Portal baru cukup ditambahkan ke PORTALS di atas.
 */
export const KIND_ORDER: Record<DemoCategory, number> = {
  landing: 1,
  toko: 2,
  menu: 3,
  linkinbio: 4,
  kontes: 5,
  undangan: 6,
  portfolio: 7,
  reservasi: 8,
  properti: 9,
  todo: 10,
}

/** #rrggbb -> rgb(r g b / a): lapisan tembus pandang dari warna jenis */
export const alpha = (hex: string, a: number) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')} / ${a})`
