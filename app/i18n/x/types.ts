// Bentuk "paket bahasa" untuk bahasa tambahan (lihat i18n/config.ts). Satu paket = isi situs di luar kamus
// antarmuka (dict/<kode>.ts) dan teks halaman (pages/<kode>.ts): fakta bisnis, satuan waktu, teks 14 paket,
// kelompok & biaya tambahan, label + tagline 65 demo, dan 29 tanya-jawab FAQ.
// Angka (harga, hari garansi, jam kerja, jumlah demo) TIDAK ditulis di paket: semuanya datang lewat konteks
// dari lib/site.ts dan lib/packages.ts, sama seperti bahasa dasar.
import type { Paket, PaketGroup } from '../../lib/packages'
import type { DemoCategory } from '../../lib/demos'
import type { ServiceText } from '../../content/services'
import type { ClientKey, ClientText } from '../../content/clients'
import type { ServiceKey } from '../slugs'

/** Kalimat fakta bisnis per bahasa (dipakai kontak, FAQ, footer, dokumen). */
export type Facts = {
  hours: string
  hoursDays: string
  hoursTime: string
  response: string
  location: string
  serves: string
  payment: string
  renewal: string
  guarantee: string
}

/** Bahan untuk merakit Facts: jam & angka dari lib/site.ts, kisaran biaya perpanjangan sudah diformat. */
export type FactsCtx = { opens: string; closes: string; days: number; renewal: string; renewalBio: string }

/** Bentuk kata menurut kaidah jamak bahasa itu (Intl.PluralRules); `other` wajib. */
export type Plural = Partial<Record<'zero' | 'one' | 'two' | 'few' | 'many', string>> & { other: string }

export type PaketText = Pick<Paket, 'title' | 'subtitle' | 'highlights' | 'features'> & { badge?: string }

/** Baris daftar di jawaban FAQ ("nama … nilai"). */
export type Rows = { label: string; value?: string }[]
export type Listed = { answer: string; list: { intro: string; rows: Rows; outro: string; ordered?: boolean } }

/** Bahan untuk merakit jawaban FAQ: angka dari sumber tunggal + daftar harga/waktu yang sudah diformat. */
export type FaqCtx = {
  year: number
  projects: string
  demos: number
  perf: string
  days: number
  facts: Facts
  /** "paket: harga mulai", termurah dulu */
  prices: Rows
  /** "paket: perkiraan waktu" */
  durations: Rows
  listed: (intro: string, rows: Rows, outro: string, ordered?: boolean) => Listed
  steps: (list: string[]) => Rows
}

export type FaqCategoryKey = 'general' | 'pricing' | 'process' | 'technical' | 'support'

export type Pack = {
  facts: (c: FactsCtx) => Facts
  /** satuan waktu pengerjaan; `flex` = sambungan ", tergantung fitur" */
  time: { day: Plural; week: Plural; flex: string }
  /** pesan WhatsApp saat memilih paket */
  waPackage: (title: string) => string
  /** teks 14 paket, kuncinya slug di lib/packages.ts */
  packages: Record<string, PaketText>
  groups: Record<PaketGroup, { title: string; lead: string }>
  addons: Record<string, { title: string; unit: string }>
  demoCategories: Record<DemoCategory, string>
  /** tagline (dan nama, bila perlu diterjemahkan) tiap demo, kuncinya slug di lib/demos.ts */
  demos: Record<string, { name?: string; tagline: string }>
  faqCategories: Record<FaqCategoryKey, { name: string; lead: string }>
  /** 29 pasang [pertanyaan, jawaban], URUTANNYA sama dengan FAQ_KEYS di content/faq.ts */
  faq: (c: FaqCtx) => [string, string | Listed][]
}

/** Teks satu istilah kamus. `letter` hanya bila huruf indeks otomatis salah (mis. aksara Han berbacaan ganda). */
export type TermText = { term: string; def: string; letter?: string }

/**
 * Isi halaman layanan, kamus, dan proyek klien untuk bahasa tambahan (gelombang 2), disimpan terpisah dari Pack
 * supaya paket inti tetap ringkas. Penanda harga ({{from:slug}} dst.) dipertahankan apa adanya: angkanya diisi fillFacts().
 */
export type More = {
  /** 7 layanan, kuncinya ServiceKey (i18n/slugs.ts) */
  services: Record<ServiceKey, ServiceText>
  /** 26 istilah, kuncinya id di content/glossary.ts */
  terms: Record<string, TermText>
  /** teks 6 proyek klien (content/clients.ts); nama klien & nama usaha tidak diterjemahkan, jadi tidak ada di sini */
  clients: Record<ClientKey, ClientText>
}
