# PintuWeb — Jasa Pembuatan Website Profesional & Cepat

Situs utama PintuWeb, "pintu menuju website impianmu": jasa pembuatan website untuk UMKM, startup, dan personal brand, lengkap dengan 65 demo live yang bisa dicoba langsung.

**Live:** https://www.pintuweb.id

![Tangkapan layar PintuWeb](public/images/og-pintuweb.png)

## Halaman

| Rute | Isi |
|---|---|
| `/` | Beranda: hero, layanan, target industri, cara kerja, showcase portal, perbandingan, ringkasan harga, FAQ |
| `/paket` | Enam paket beserta harga, fitur, dan tombol pesan via WhatsApp |
| `/demo` | Galeri 65 demo live dengan filter kategori |
| `/services` | Rincian layanan |
| `/about` | Tentang PintuWeb |
| `/faq` | Pertanyaan umum |
| `/kontak` | Formulir yang membuka pesan WhatsApp atau email (tanpa backend) |
| `/owner` | Profil pemilik |

## Sumber data

Konten yang sering berubah dipusatkan supaya tidak pernah saling bertentangan:

- `app/lib/packages.ts` — **satu-satunya sumber harga**. Dibaca oleh `/paket`, ringkasan harga di beranda, JSON-LD `offers` di layout, dan jawaban FAQ soal harga. Ubah harga hanya di file ini.
- `app/lib/demos.ts` — daftar 65 demo (landing 17, link-in-bio 12, kontes 9, undangan 8, portfolio 7, reservasi 5, properti 4, to-do 3) untuk `/demo`.
- `app/lib/faqData.ts` — isi FAQ, dipakai komponen FAQ dan JSON-LD `FAQPage`.

## Identitas visual

Tinta hangat, kertas krem, cobalt sebagai warna utama, dan aksen amber. Motif khasnya adalah **gerbang/arch** (kartu showcase dan visual hero berujung atas melengkung) serta grid cetak biru. Judul memakai Bricolage Grotesque, teks memakai Inter. Semua warna berupa variabel CSS di `app/globals.css`, jadi seluruh tema bisa diubah dari satu tempat.

## Teknologi

- Next.js 15.5 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Vercel Analytics
- SEO: metadata dan canonical per halaman, Open Graph, JSON-LD (Organization, WebSite, Service, FAQPage, BreadcrumbList, ItemList), sitemap dan robots dinamis

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk build produksi: `npm run build` lalu `npm start`.

## Deploy

Project ini ter-link ke Vercel (`.vercel/`, tidak di-commit). Deploy produksi dijalankan manual:

```bash
vercel deploy --prod
```

## Multibahasa & SEO/GEO (sejak 3 Okt 2026)

- **Bahasa:** Indonesia (utama, tanpa awalan), Inggris `/en`, Melayu `/ms`. Semua halaman ada di `app/[lang]/`;
  `next.config.ts` menulis ulang URL publik (`/paket`, `/en/pricing`, `/ms/harga`) ke folder internal dan
  mengalihkan alamat internal ke alamat publiknya. Peta segmen per bahasa: `app/i18n/routes.ts`.
- **Teks:** `app/i18n/dict/*` (antarmuka), `app/i18n/pages/*` (per halaman), `app/content/*` (layanan, FAQ,
  kamus, legal, teks paket & demo). Angka bisnis tetap hanya dari `app/lib/site.ts` & `app/lib/packages.ts`.
- **Artikel:** Markdown di `content/articles/{id,en}/`. Penanda `{{from:slug}}`, `{{price:slug}}`, `{{max:slug}}`,
  `{{duration:slug}}`, `{{renewal}}`, `{{pricetable}}`, dll. diisi dari packages.ts saat build. Pasangkan terjemahan
  lewat `key` di frontmatter dan daftarkan slugnya di `app/i18n/slugs.ts`.
- **SEO teknis:** hreflang + x-default di setiap halaman & sitemap, JSON-LD (ProfessionalService, WebPage,
  BreadcrumbList, Service, FAQPage, BlogPosting, DefinedTermSet), RSS (`/artikel/rss`, `/en/articles/rss`),
  `/llms.txt` & `/llms-full.txt`, robots.txt yang mengizinkan perayap AI, gambar OG per halaman (`/api/og`).
- **Setelah deploy:** `node scripts/indexnow.mjs` untuk memberi tahu Bing & mesin IndexNow lain.
  Kode verifikasi Google Search Console / Bing bisa diisi lewat env `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION`.

## Portal demo

Setiap kategori demo punya katalognya sendiri:
[PortalLanding](https://www.pintuweb.id/landing-page) ·
[PortalBio](https://www.pintuweb.id/link-in-bio) ·
[PortalKontes](https://www.pintuweb.id/kontes-desain) ·
[PortalUndangan](https://www.pintuweb.id/undangan-digital) ·
[PortalPorto](https://www.pintuweb.id/website-portofolio) ·
[PortalReservasi](https://www.pintuweb.id/website-reservasi) ·
[PortalProperti](https://www.pintuweb.id/website-properti) ·
[PortalTodo](https://www.pintuweb.id/aplikasi-to-do)
