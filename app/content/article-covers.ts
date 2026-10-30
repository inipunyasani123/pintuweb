// Sampul artikel. Hanya dipakai di server (membaca folder public saat build).
//
// 1. Gambar sampul: public/images/artikel/<kunci>.webp|jpg|jpeg|png (kunci = ArticleKey, sama untuk semua bahasa).
//    Bila berkasnya ada, gambar itu dipakai di kartu dan di kepala artikel. Untuk mengganti gambar, cukup timpa
//    berkasnya; rasio 16:9 (mis. 1600x900) dengan isi penting di tengah, karena kartu memotongnya jadi 2:1 dan,
//    di ponsel, jadi persegi.
// 2. Sampul tipografi (cadangan bila gambarnya tidak ada): satu tanda singkat yang mewakili isi artikel dan
//    sepasang warna. Warnanya meminjam palet CATEGORY_COLOR supaya serasi dengan bagian lain; pasangannya hanya
//    soal palet, bukan berarti artikelnya termasuk jenis website itu.
import fs from 'node:fs'
import path from 'node:path'
import type { DemoCategory } from '../lib/demos'
import type { ArticleKey } from '../i18n/slugs'

export const ARTICLE_COVER: Record<ArticleKey, { mark: string; tone: DemoCategory }> = {
  biaya: { mark: 'Rp', tone: 'properti' },
  'website-umkm': { mark: '0→1', tone: 'portfolio' },
  'pilih-jasa': { mark: '12', tone: 'reservasi' },
  'seo-checklist': { mark: 'SEO', tone: 'kontes' },
  'domain-hosting': { mark: '.id', tone: 'linkinbio' },
  'landing-vs-compro': { mark: 'vs', tone: 'landing' },
  undangan: { mark: 'RSVP', tone: 'undangan' },
  'website-vs-sosmed': { mark: '@', tone: 'todo' },
  'umkm-tulungagung': { mark: 'UMKM', tone: 'landing' },
  'google-maps': { mark: 'Maps', tone: 'properti' },
  'katalog-ekspor': { mark: 'Onyx', tone: 'kontes' },
  wisata: { mark: 'Stay', tone: 'portfolio' },
  'toko-vs-marketplace': { mark: '%', tone: 'toko' },
  'menu-qr': { mark: 'QR', tone: 'menu' },
  booking: { mark: '09.00', tone: 'reservasi' },
  'lama-pembuatan': { mark: 'ETA', tone: 'todo' },
  'jarak-jauh': { mark: 'UTC+7', tone: 'linkinbio' },
  'website-gratis': { mark: 'Rp0', tone: 'undangan' },
  'website-sekolah': { mark: 'Sch', tone: 'todo' },
  'website-desa': { mark: 'Desa', tone: 'properti' },
  'biaya-aplikasi': { mark: 'App', tone: 'mobile' },
  'biaya-toko-online': { mark: 'Cart', tone: 'toko' },
  'website-murah': { mark: 'Rp', tone: 'landing' },
}

const DIR = path.join(process.cwd(), 'public', 'images', 'artikel')
const EXT = ['webp', 'jpg', 'jpeg', 'png']
const found = new Map<ArticleKey, string | null>()

/** Alamat gambar sampul artikel (mis. "/images/artikel/biaya.webp"), atau null bila berkasnya belum ada. */
export function articleImage(key: ArticleKey): string | null {
  if (!found.has(key)) {
    const ext = EXT.find((e) => fs.existsSync(path.join(DIR, `${key}.${e}`)))
    found.set(key, ext ? `/images/artikel/${key}.${ext}` : null)
  }
  return found.get(key) ?? null
}
