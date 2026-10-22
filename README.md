# PintuWeb

Situs studio web PintuWeb (berlokasi di Tulungagung, Jawa Timur): layanan pembuatan website, 14 paket harga, galeri 65 demo live, FAQ, artikel, kamus istilah, dan formulir kontak (WhatsApp/email, tanpa backend).

Live: https://www.pintuweb.id

## Teknologi

- Next.js 15.5 (App Router), React 19, TypeScript (`strict`)
- Tailwind CSS v4; warna, tipografi, dan komponen dasar di `app/globals.css`
- Huruf: tumpukan sistem gaya Apple (SF Pro bawaan perangkat Apple, tidak di-embed), Inter lewat `next/font` untuk perangkat lain
- `marked` untuk artikel Markdown, `lucide-react` untuk ikon, `@vercel/analytics`
- Gambar OG dibuat di `/api/og` dengan `next/og`

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Struktur

| Folder | Isi |
|---|---|
| `app/[lang]/` | Semua halaman: beranda, layanan (7), paket, demo, artikel, kamus, FAQ, tentang, founder, kontak, kebijakan privasi, syarat & ketentuan |
| `app/components/` | Komponen bersama (header, footer, kartu, FAQ, dll.) |
| `app/content/` | Teks layanan, FAQ, kamus, dokumen legal, teks paket & demo, pemuat artikel, proyek klien (`clients.ts`) |
| `content/articles/{id,en}/` | Artikel Markdown; terjemahan dipasangkan lewat `key` di frontmatter dan slug di `app/i18n/slugs.ts` |
| `app/lib/` | Data dan fakta: `site.ts`, `packages.ts`, `demos.ts`, `portals.ts` |
| `public/demos/` | Thumbnail demo `<slug>.webp` (720×378) plus `<slug>-360.webp` dan `<slug>-480.webp` untuk `srcset` |
| `public/images/klien/` | (Belum ada) tangkapan layar proyek klien `<kunci>-1.webp` s.d. `-3.webp`, kunci di `app/content/clients.ts`; tampil otomatis di kartu halaman Tentang setelah build |
| `scripts/` | Skrip perawatan (lihat di bawah) |

## Multibahasa

11 bahasa: Indonesia (tanpa awalan URL), lalu `/en`, `/ms`, `/es`, `/fr`, `/pt`, `/ru`, `/zh`, `/hi`, `/bn`, `/ar` (Arab, kanan-ke-kiri). Semua halaman hidup di `app/[lang]/`; `next.config.ts` menulis ulang URL publik (`/paket`, `/en/pricing`, `/ms/harga`) ke folder internal dan mengalihkan alamat internal ke alamat publiknya.

Isi `app/i18n/`:

- `config.ts`: daftar bahasa (bahasa dasar id/en/ms, bahasa tambahan `X_LANGS`), `LANG_INFO` (nama, hreflang, locale `Intl`, arah tulisan), `ARTICLE_LANGS`.
- `routes.ts`: segmen URL tiap halaman per bahasa, `path()`/`pathOf()`/`urlOf()`, hreflang, pembaca path, serta aturan rewrite & redirect untuk `next.config.ts`. Halaman yang belum ada dalam suatu bahasa ditautkan ke versi Inggris.
- `dict/<kode>.ts`: teks antarmuka (header, footer, bagian beranda).
- `pages/<kode>.ts`: teks per halaman.
- `x/<kode>.ts`: paket bahasa tambahan (fakta, teks 14 paket, label & tagline demo, FAQ); `x/more/<kode>.ts`: layanan, kamus, dan teks proyek klien untuk bahasa tambahan.
- `facts.ts` (fakta & harga yang sudah diformat per bahasa, pengisi penanda `{{…}}`), `seo.ts` (metadata, hreflang, JSON-LD), `og.ts` (judul gambar OG), `slugs.ts`, `plural.ts`.

Cakupan: id, en, ms lengkap; bahasa tambahan punya beranda, layanan, paket, demo, FAQ, tentang, kontak, founder, dan kamus (dokumen legal menaut ke versi Inggris); artikel hanya id & en.

## Sumber fakta

Angka bisnis hanya ditulis di dua file:

- `app/lib/site.ts`: tahun berdiri, jumlah proyek klien, lokasi, WhatsApp, email, jam kerja, waktu respons, garansi, target performa, `GITHUB` (sengaja kosong). `FACTS_UPDATED` = tanggal terakhir fakta di file ini berubah; dipakai lastmod sitemap dan tanggal berlaku dokumen legal. Naikkan setiap mengubah file ini.
- `app/lib/packages.ts`: 14 paket (kisaran harga, durasi, kelompok, fitur), biaya tambahan, dan perpanjangan. `PRICES_UPDATED` = tanggal harga terakhir ditetapkan; tampil sebagai "Harga berlaku per …" dan menjadi tanggal pembaruan artikel serta dokumen legal yang memuat angka paket. Naikkan setiap angka paket berubah.

Teks halaman, layanan, dan artikel mengambil angka lewat fungsi di `app/i18n/facts.ts` atau penanda seperti `{{from:landing-page}}`, `{{duration:toko-online-simple}}`, `{{renewal}}`, `{{pricetable}}`; penanda yang tidak dikenal menggagalkan build. Angka yang sama ditulis manual di 8 portal dan formulir 6 demo undangan (repo terpisah), jadi perbarui juga di sana. Sampul artikel `biaya` dan `pilih-jasa` berupa tangkapan layar harga: buat ulang bila harga berubah.

Demo: daftar 65 demo di `app/lib/demos.ts` (`pkg` = paket harga lain dari paket kategorinya, `noPrice` = kartu tanpa harga).

## Portal (multi-zone)

Delapan katalog demo adalah project Next.js terpisah (`portal-*.pintuweb.id`, masing-masing dengan `basePath`) yang tayang di bawah domain ini lewat rewrite `beforeFiles` di `next.config.ts`. Path dan origin-nya di `app/lib/portals.ts`: `/landing-page`, `/link-in-bio`, `/kontes-desain`, `/undangan-digital`, `/website-portofolio`, `/website-reservasi`, `/website-properti`, `/aplikasi-to-do`. Tautan ke portal memakai `<a>` biasa, bukan `next/link`.

## Gambar OG

`app/api/og/route.tsx` menerima kunci dokumen, bukan teks bebas:

- `/api/og?v=home&l=<bahasa>`: kartu merek beranda (angkanya dari `site.ts`).
- `/api/og?l=<bahasa>&p=<halaman>&s=<kunci>`: kartu berjudul. `p` = kunci halaman di `routes.ts` (`pricing`, `services`, `demo`, `faq`, `about`, `contact`, `founder`, `glossary`, `privacy`, `terms`, `articles`); `s` = kunci layanan atau artikel (`app/i18n/slugs.ts`), hanya untuk `services` dan `articles`. Judulnya dibaca dari kamus lewat `app/i18n/og.ts`; dokumen yang tidak ada dalam bahasa itu menghasilkan 404.
- `r=<angka>` = revisi desain (`OG_REV` di `app/i18n/seo.ts`); naikkan bila desain kartu berubah.
- Huruf OG hanya Inter, jadi zh, hi, bn, dan ar digambar dalam bahasa Inggris. Font dan logo dibaca dari `app/api/og/fonts/` dan `app/api/og/logo.png`.

## SEO

Canonical dan hreflang (termasuk `x-default`) di setiap halaman dan sitemap; JSON-LD (antara lain ProfessionalService, WebSite, Person, WebPage, BreadcrumbList, Service, OfferCatalog, FAQPage, BlogPosting, DefinedTermSet); RSS `/artikel/rss` dan `/en/articles/rss` (ditautkan dari setiap halaman); `/sitemap.xml`, `/robots.txt` (perayap AI diizinkan), `/llms.txt`, `/llms-full.txt`. Kode verifikasi Google Search Console dan Bing lewat variabel lingkungan `GOOGLE_SITE_VERIFICATION` dan `BING_SITE_VERIFICATION`.

## Deploy

Project Vercel `pintuweb` terhubung ke repo ini (Vercel Git Integration): setiap push ke `main` otomatis di-deploy ke produksi. `vercel.json` menempatkan fungsi server di region `sin1` (Singapura).

## Skrip

- `node scripts/indexnow.mjs`: mengirim semua URL di sitemap live ke IndexNow (Bing dan mesin lain). Jalankan setelah deploy. Kuncinya di `app/lib/indexnow.ts` dan berkas `public/<kunci>.txt`.
- `node scripts/ikon-dari-logo.mjs`: membuat logo rapat untuk header/footer, favicon, ikon aplikasi, dan logo OG dari `public/images/logo.png` (berkas sumber tidak diubah). Jalankan setelah logo diganti.
