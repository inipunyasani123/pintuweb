// Tangkapan layar proyek klien. Hanya dipakai di server (membaca folder public saat build), seperti article-covers.ts.
//
// Berkas: public/images/klien/<kunci>-1.webp, <kunci>-2.webp, <kunci>-3.webp (kunci = ClientKey di content/clients.ts).
// Gambar ke-n memakai butir ke-n di `docs` proyek itu sebagai keterangannya; bila berkasnya tidak ada, butir itu
// tampil sebagai teks saja. Kartu memotong gambar menjadi 16:10 dari bagian atas, dan klik membuka gambar penuh.
import fs from 'node:fs'
import path from 'node:path'
import type { ClientKey } from './clients'

const DIR = path.join(process.cwd(), 'public', 'images', 'klien')
const found = new Map<string, string | null>()

/** Alamat gambar per butir `docs` (urutannya sama), null bila berkasnya belum ada. */
export function clientShots(key: ClientKey, count: number): (string | null)[] {
  return Array.from({ length: count }, (_, i) => {
    const file = `${key}-${i + 1}.webp`
    if (!found.has(file)) found.set(file, fs.existsSync(path.join(DIR, file)) ? `/images/klien/${file}` : null)
    return found.get(file) ?? null
  })
}
