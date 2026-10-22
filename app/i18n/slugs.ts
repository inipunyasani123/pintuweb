// Slug per bahasa untuk halaman bertingkat (layanan & artikel). Dipakai untuk membangun URL,
// hreflang, dan pemilih bahasa. Isi lengkapnya ada di app/content/.
import { BASE_LANGS, X_LANGS, type BaseLang, type Lang } from './config'

const BASE_SERVICE_SLUGS = {
  'landing-page': { id: 'landing-page', en: 'landing-page', ms: 'landing-page' },
  'company-profile': { id: 'company-profile', en: 'company-profile-website', ms: 'laman-web-syarikat' },
  'toko-online': { id: 'toko-online', en: 'online-store', ms: 'kedai-dalam-talian' },
  portofolio: { id: 'website-portofolio', en: 'portfolio-website', ms: 'laman-web-portfolio' },
  'website-custom': { id: 'website-custom', en: 'custom-website', ms: 'laman-web-tersuai' },
  'undangan-digital': { id: 'undangan-digital', en: 'digital-invitation', ms: 'kad-jemputan-digital' },
  'link-in-bio': { id: 'link-in-bio', en: 'link-in-bio', ms: 'link-in-bio' },
} satisfies Record<string, Record<BaseLang, string>>

export type ServiceKey = keyof typeof BASE_SERVICE_SLUGS
export const SERVICE_KEYS = Object.keys(BASE_SERVICE_SLUGS) as ServiceKey[]

/** Slug layanan per bahasa; bahasa tambahan memakai slug Inggris. */
export const SERVICE_SLUGS = Object.fromEntries(
  SERVICE_KEYS.map((k) => [k, Object.fromEntries([...BASE_LANGS.map((l) => [l, BASE_SERVICE_SLUGS[k][l]]), ...X_LANGS.map((l) => [l, BASE_SERVICE_SLUGS[k].en])])]),
) as Record<ServiceKey, Record<Lang, string>>

/** Artikel hanya ada dalam ID & EN. */
export const ARTICLE_SLUGS = {
  biaya: { id: 'biaya-membuat-website', en: 'website-cost-indonesia' },
  'landing-vs-compro': { id: 'landing-page-vs-company-profile', en: 'landing-page-vs-company-profile' },
  'website-umkm': { id: 'cara-membuat-website-umkm', en: 'small-business-website-guide' },
  'domain-hosting': { id: 'domain-dan-hosting-untuk-pemula', en: 'domain-and-hosting-basics' },
  'website-vs-sosmed': { id: 'website-vs-media-sosial', en: 'website-vs-social-media' },
  'seo-checklist': { id: 'checklist-seo-website-baru', en: 'new-website-seo-checklist' },
  'pilih-jasa': { id: 'cara-memilih-jasa-pembuatan-website', en: 'how-to-choose-a-web-developer' },
  undangan: { id: 'panduan-undangan-digital', en: 'digital-invitation-guide' },
  // 22 Okt 2026: gelombang SEO lokal (Tulungagung) + pertanyaan calon klien
  'umkm-tulungagung': { id: 'website-umkm-tulungagung', en: 'tulungagung-business-websites' },
  'google-maps': { id: 'cara-muncul-di-google-maps', en: 'google-business-profile-guide' },
  'katalog-ekspor': { id: 'website-katalog-marmer-onyx', en: 'marble-onyx-catalog-website' },
  wisata: { id: 'website-wisata-dan-penginapan', en: 'tourism-and-homestay-website' },
  'toko-vs-marketplace': { id: 'toko-online-vs-marketplace', en: 'online-store-vs-marketplace' },
  'menu-qr': { id: 'menu-digital-qr', en: 'qr-code-menu-guide' },
  booking: { id: 'sistem-booking-online', en: 'online-booking-system-guide' },
  'lama-pembuatan': { id: 'berapa-lama-membuat-website', en: 'how-long-to-build-a-website' },
  'jarak-jauh': { id: 'jasa-pembuatan-website-online', en: 'hire-web-developer-indonesia' },
  'website-gratis': { id: 'website-gratis-vs-berbayar', en: 'free-vs-paid-website' },
} satisfies Record<string, Partial<Record<Lang, string>>>

export type ArticleKey = keyof typeof ARTICLE_SLUGS
export const ARTICLE_KEYS = Object.keys(ARTICLE_SLUGS) as ArticleKey[]

export const serviceKeyBySlug = (lang: Lang, slug: string) =>
  SERVICE_KEYS.find((k) => SERVICE_SLUGS[k][lang] === slug)

export const articleKeyBySlug = (lang: Lang, slug: string) =>
  ARTICLE_KEYS.find((k) => (ARTICLE_SLUGS[k] as Partial<Record<Lang, string>>)[lang] === slug)
