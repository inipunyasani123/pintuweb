import type { NextConfig } from "next";
import { PORTALS } from "./app/lib/portals";
import { routingRules } from "./app/i18n/routes";
import { LANGS } from "./app/i18n/config";

// Header keamanan dasar untuk semua halaman. HSTS sudah dipasang Vercel.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://wa.me mailto:; object-src 'none'" },
];

const { rewrites: langRewrites, redirects: langRedirects } = routingRules();

// Path yang TIDAK ditulis ulang ke /id. Berkas public/ & rute statis sudah dilayani sebelum
// afterFiles; daftar ini menjaga bahasa lain, aset Next, dan API. Tiap awalan harus segmen utuh
// ("api" hanya /api dan /api/…), supaya path lain yang kebetulan berawalan sama tetap ditulis ulang ke /id.
const notId = ["_next", "_vercel", "api", ...LANGS].map((p) => `${p}(?:/|$)`).join("|");

// Gambar di public/demos & public/images berganti NAMA bila isinya berubah (favicon memakai ?v=), jadi aman
// disimpan browser/CDN selama seminggu.
const assetCache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
// Varian gambar statis (public/_img) memuat hash isi di namanya: aman disimpan selamanya.
const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const nextConfig: NextConfig = {
  // Font TTF & logo untuk gambar OG dibaca lewat fs saat runtime: pastikan ikut terbundel.
  outputFileTracingIncludes: { "/api/og": ["./app/api/og/fonts/**", "./app/api/og/logo.png"] },
  // next/image TIDAK memakai Image Optimization Vercel (kuota paket Hobby habis → varian baru dibalas 402):
  // loader khusus menunjuk varian WebP statis di public/_img buatan scripts/static-images.mjs. Lebar di bawah harus
  // sama dengan WIDTHS di skrip itu. Setiap menambah/mengganti gambar di public/images, jalankan:
  //   node scripts/static-images.mjs . --dirs public/images
  images: {
    loader: "custom",
    loaderFile: "./image-loader.js",
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/demos/:path*", headers: assetCache },
      { source: "/images/:path*", headers: assetCache },
      { source: "/_img/:path*", headers: immutable },
    ];
  },
  async redirects() {
    return [
      // Versi Indonesia tidak berawalan: /id/... adalah URL internal.
      { source: "/id", destination: "/", permanent: true },
      { source: "/id/:path*", destination: "/:path*", permanent: true },
      ...langRedirects,
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Portal katalog (multi-zone).
        ...PORTALS.flatMap(({ path, origin }) => [
          { source: `/${path}`, destination: `${origin}/${path}` },
          { source: `/${path}/:rest+`, destination: `${origin}/${path}/:rest+` },
        ]),
        // Segmen berbahasa Inggris/Melayu -> folder internal.
        ...langRewrites,
      ],
      // Bahasa Indonesia tanpa awalan -> app/[lang] dengan lang = id
      // (setelah berkas public/ & rute statis, sebelum rute dinamis).
      afterFiles: [
        { source: "/", destination: "/id" },
        { source: `/:path((?!${notId}).+)`, destination: "/id/:path" },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
