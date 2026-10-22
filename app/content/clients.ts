// Proyek klien: SATU sumber untuk beranda, halaman Tentang (#proyek-klien), dan halaman layanan terkait.
// Data dari pemilik (15 Okt 2026). Keputusan pemilik: nama lengkap klien + nama usaha ditampilkan apa adanya
// (TIDAK diterjemahkan), nilai proyek TIDAK ditampilkan. Ini ringkasan proyek, bukan testimoni: jangan menaruh
// kutipan atau penilaian di mulut klien, tanpa bintang/rating, dan tanpa Review/AggregateRating di JSON-LD.
//
// Teks id/en/ms ditulis di sini; 8 bahasa tambahan di i18n/x/more/<kode>.ts (`clients`), bertipe
// Record<ClientKey, ClientText> sehingga terjemahan yang kurang menggagalkan tsc. Terjemahkan setia dari versi
// Indonesia, tanpa menambah klaim.
//
// Tangkapan layar menyusul: public/images/klien/<kunci>-1.webp, -2.webp, -3.webp (lihat content/client-shots.ts).
// Gambar ke-n memakai butir ke-n di `docs` sebagai keterangannya.
import { isBase, type BaseLang, type Lang } from '../i18n/config'
import { path } from '../i18n/routes'
import type { ServiceKey } from '../i18n/slugs'
import { more } from '../i18n/x/more'

/** Kunci tetap per proyek (urutan tampil = urutan di sini). Juga dipakai untuk jangkar dan nama berkas gambar. */
export const CLIENT_KEYS = ['freshfold', 'sumber-rejeki', 'arif-motor', 'cerdas-akademi', 'lereng-coffee', 'prima-distribusi'] as const
export type ClientKey = (typeof CLIENT_KEYS)[number]

/** Teks satu proyek dalam satu bahasa. */
export type ClientText = {
  /** bidang usaha (label kecil) */
  field: string
  /** proyek yang dikerjakan, satu baris */
  project: string
  /** label jenis sistem yang pendek (1–3 kata), mis. "Dashboard pesanan" */
  kind: string
  /** masalah & solusi versi sangat pendek untuk kartu geser beranda (ringkasan setia dari problem/solution) */
  before: string
  after: string
  problem: string
  solution: string
  /** "Dokumentasi" dari pemilik, tampil sebagai "Yang diserahkan"; sejajar dengan <kunci>-1..3.webp */
  docs: string[]
}

type Client = {
  /** nama lengkap klien, tidak diterjemahkan */
  client: string
  /** nama usaha, tidak diterjemahkan */
  business: string
  /** layanan terkait: halaman layanan ini menampilkan proyeknya */
  services: ServiceKey[]
  text: Record<BaseLang, ClientText>
}

const CLIENTS: Record<ClientKey, Client> = {
  freshfold: {
    client: 'Dimas Aditya',
    business: 'FreshFold Laundry',
    services: ['website-custom'],
    text: {
      id: {
        field: 'Jasa laundry',
        project: 'Sistem pencatatan pesanan dan status cucian berbasis web',
        kind: 'Dashboard pesanan',
        before: 'Pesanan dicatat manual, status cucian sulit dipantau',
        after: 'Dashboard pesanan, status cucian, dan nota digital',
        problem: 'Pencatatan pesanan masih manual sehingga sulit memantau status cucian dan riwayat transaksi pelanggan.',
        solution: 'Dashboard untuk mengelola pesanan, memperbarui status cucian, menyimpan data pelanggan, dan mencetak nota digital.',
        docs: ['Dashboard pesanan', 'Status cucian', 'Nota digital'],
      },
      en: {
        field: 'Laundry service',
        project: 'Web-based system for recording orders and laundry status',
        kind: 'Order dashboard',
        before: 'Orders recorded by hand, laundry status hard to track',
        after: 'Order dashboard, laundry status and digital receipts',
        problem: 'Orders were recorded by hand, which made it hard to keep track of laundry status and customers’ transaction history.',
        solution: 'A dashboard to manage orders, update laundry status, store customer data and print digital receipts.',
        docs: ['Order dashboard', 'Laundry status', 'Digital receipt'],
      },
      ms: {
        field: 'Perkhidmatan dobi',
        project: 'Sistem rekod pesanan dan status cucian berasaskan web',
        kind: 'Papan pemuka pesanan',
        before: 'Pesanan direkod secara manual, status cucian sukar dipantau',
        after: 'Papan pemuka pesanan, status cucian dan resit digital',
        problem: 'Pesanan masih direkodkan secara manual, jadi sukar untuk memantau status cucian dan sejarah transaksi pelanggan.',
        solution: 'Papan pemuka untuk mengurus pesanan, mengemas kini status cucian, menyimpan data pelanggan dan mencetak resit digital.',
        docs: ['Papan pemuka pesanan', 'Status cucian', 'Resit digital'],
      },
    },
  },
  'sumber-rejeki': {
    client: 'Rina Puspitasari',
    business: 'Sumber Rejeki Bangunan',
    services: ['website-custom'],
    text: {
      id: {
        field: 'Perdagangan bahan bangunan',
        project: 'Aplikasi inventaris barang berbasis web',
        kind: 'Aplikasi inventaris',
        before: 'Stok dan barang masuk-keluar dicatat manual',
        after: 'Stok, barang masuk-keluar, dan laporan dalam satu aplikasi',
        problem: 'Pemantauan stok serta pencatatan barang masuk dan keluar masih manual.',
        solution: 'Aplikasi inventaris dengan pengelolaan stok, pencatatan barang masuk dan keluar, serta laporan persediaan.',
        docs: ['Dashboard inventaris', 'Laporan stok', 'Riwayat transaksi barang'],
      },
      en: {
        field: 'Building materials trade',
        project: 'Web-based inventory application',
        kind: 'Inventory app',
        before: 'Stock and goods in and out recorded by hand',
        after: 'Stock, goods in and out, and reports in one app',
        problem: 'Stock monitoring and the recording of incoming and outgoing goods were still done by hand.',
        solution: 'An inventory application with stock management, records of incoming and outgoing goods, and inventory reports.',
        docs: ['Inventory dashboard', 'Stock report', 'Goods transaction history'],
      },
      ms: {
        field: 'Perdagangan bahan binaan',
        project: 'Aplikasi inventori barang berasaskan web',
        kind: 'Aplikasi inventori',
        before: 'Stok serta barang masuk dan keluar direkod secara manual',
        after: 'Stok, barang masuk dan keluar serta laporan dalam satu aplikasi',
        problem: 'Pemantauan stok serta rekod barang masuk dan keluar masih dibuat secara manual.',
        solution: 'Aplikasi inventori dengan pengurusan stok, rekod barang masuk dan keluar, serta laporan inventori.',
        docs: ['Papan pemuka inventori', 'Laporan stok', 'Sejarah transaksi barang'],
      },
    },
  },
  'arif-motor': {
    client: 'Arif Setiawan',
    business: 'Arif Motor Service',
    services: ['website-custom'],
    text: {
      id: {
        field: 'Bengkel sepeda motor',
        project: 'Sistem administrasi servis kendaraan',
        kind: 'Sistem servis',
        before: 'Riwayat servis di buku catatan, sulit dicari',
        after: 'Data pelanggan, riwayat servis, dan invoice digital',
        problem: 'Riwayat servis pelanggan tersimpan di buku catatan sehingga sulit dicari kembali.',
        solution: 'Pencatatan data pelanggan, riwayat servis kendaraan, daftar pekerjaan mekanik, dan pembuatan invoice.',
        docs: ['Data pelanggan', 'Riwayat servis', 'Invoice digital'],
      },
      en: {
        field: 'Motorcycle repair shop',
        project: 'Vehicle service administration system',
        kind: 'Service system',
        before: 'Service history kept in a notebook, hard to look up',
        after: 'Customer data, service history and digital invoices',
        problem: 'Customers’ service histories were kept in a notebook, which made them hard to look up again.',
        solution: 'Recording of customer data and vehicle service history, a job list for the mechanics, and invoice creation.',
        docs: ['Customer data', 'Service history', 'Digital invoice'],
      },
      ms: {
        field: 'Bengkel motosikal',
        project: 'Sistem pentadbiran servis kenderaan',
        kind: 'Sistem servis',
        before: 'Sejarah servis dalam buku catatan, sukar dicari',
        after: 'Data pelanggan, sejarah servis dan invois digital',
        problem: 'Sejarah servis pelanggan disimpan dalam buku catatan, jadi sukar dicari semula.',
        solution: 'Rekod data pelanggan dan sejarah servis kenderaan, senarai kerja mekanik, serta penyediaan invois.',
        docs: ['Data pelanggan', 'Sejarah servis', 'Invois digital'],
      },
    },
  },
  'cerdas-akademi': {
    client: 'Nabila Putri',
    business: 'Cerdas Akademi',
    services: ['website-custom'],
    text: {
      id: {
        field: 'Bimbingan belajar',
        project: 'Website pendaftaran siswa dan pengelolaan jadwal kelas',
        kind: 'Pendaftaran online',
        before: 'Pendaftaran siswa dan jadwal diatur manual',
        after: 'Formulir online, data siswa, dan jadwal kelas',
        problem: 'Pendaftaran siswa dan pengaturan jadwal masih manual.',
        solution: 'Website dengan formulir pendaftaran online, dashboard administrasi, pengelolaan data siswa, dan informasi jadwal kelas.',
        docs: ['Formulir pendaftaran', 'Dashboard admin', 'Halaman jadwal'],
      },
      en: {
        field: 'Tutoring centre',
        project: 'Website for student registration and class schedule management',
        kind: 'Online registration',
        before: 'Student registration and schedules handled by hand',
        after: 'Online form, student data and class schedules',
        problem: 'Student registration and scheduling were still done by hand.',
        solution: 'A website with an online registration form, an admin dashboard, student data management and class schedule information.',
        docs: ['Registration form', 'Admin dashboard', 'Schedule page'],
      },
      ms: {
        field: 'Pusat tuisyen',
        project: 'Laman web pendaftaran pelajar dan pengurusan jadual kelas',
        kind: 'Pendaftaran dalam talian',
        before: 'Pendaftaran pelajar dan jadual diurus secara manual',
        after: 'Borang dalam talian, data pelajar dan jadual kelas',
        problem: 'Pendaftaran pelajar dan penyusunan jadual masih dibuat secara manual.',
        solution: 'Laman web dengan borang pendaftaran dalam talian, papan pemuka pentadbiran, pengurusan data pelajar dan maklumat jadual kelas.',
        docs: ['Borang pendaftaran', 'Papan pemuka admin', 'Halaman jadual'],
      },
    },
  },
  'lereng-coffee': {
    client: 'Bagas Ramadhan',
    business: 'Lereng Coffee Roastery',
    services: ['toko-online'],
    text: {
      id: {
        field: 'Produksi dan penjualan kopi lokal',
        project: 'Website katalog produk dan pemesanan online',
        kind: 'Katalog + pemesanan',
        before: 'Info produk dan pesanan bergantung pada media sosial',
        after: 'Katalog lengkap dengan harga, formulir pesanan, dan WhatsApp',
        problem: 'Informasi produk dan pemesanan bergantung pada media sosial dan komunikasi manual.',
        solution: 'Katalog produk dengan harga dan deskripsi, formulir pemesanan, dan integrasi WhatsApp.',
        docs: ['Halaman katalog', 'Tampilan responsif', 'Formulir pemesanan'],
      },
      en: {
        field: 'Local coffee production and sales',
        project: 'Product catalogue and online ordering website',
        kind: 'Catalogue + ordering',
        before: 'Product info and orders relied on social media',
        after: 'Priced catalogue, order form and WhatsApp',
        problem: 'Product information and ordering relied on social media and manual communication.',
        solution: 'A product catalogue with prices and descriptions, an order form and WhatsApp integration.',
        docs: ['Catalogue page', 'Responsive layout', 'Order form'],
      },
      ms: {
        field: 'Pengeluaran dan jualan kopi tempatan',
        project: 'Laman web katalog produk dan pesanan dalam talian',
        kind: 'Katalog + pesanan',
        before: 'Maklumat produk dan pesanan bergantung pada media sosial',
        after: 'Katalog dengan harga, borang pesanan dan WhatsApp',
        problem: 'Maklumat produk dan pesanan bergantung pada media sosial dan komunikasi manual.',
        solution: 'Katalog produk dengan harga dan penerangan, borang pesanan serta integrasi WhatsApp.',
        docs: ['Halaman katalog', 'Paparan responsif', 'Borang pesanan'],
      },
    },
  },
  'prima-distribusi': {
    client: 'Yoga Pranata',
    business: 'Prima Distribusi',
    services: ['website-custom'],
    text: {
      id: {
        field: 'Distribusi barang',
        project: 'Dashboard pengelolaan pesanan dan pengiriman',
        kind: 'Dashboard internal',
        before: 'Status pesanan dan pengiriman belum terpusat',
        after: 'Pesanan, status kirim, dan laporan per periode di satu dashboard',
        problem: 'Status pesanan dan pengiriman belum terpusat sehingga administrasi operasional menjadi sulit.',
        solution: 'Dashboard internal untuk mencatat pesanan, memperbarui status pengiriman, mencari data, dan membuat laporan per periode.',
        docs: ['Dashboard pesanan', 'Filter tanggal', 'Laporan pengiriman'],
      },
      en: {
        field: 'Goods distribution',
        project: 'Order and delivery management dashboard',
        kind: 'Internal dashboard',
        before: 'Order and delivery statuses not centralised',
        after: 'Orders, delivery status and period reports in one dashboard',
        problem: 'Order and delivery statuses were not centralised, which made operational administration difficult.',
        solution: 'An internal dashboard to record orders, update delivery status, search data and produce reports by period.',
        docs: ['Order dashboard', 'Date filter', 'Delivery report'],
      },
      ms: {
        field: 'Pengedaran barang',
        project: 'Papan pemuka pengurusan pesanan dan penghantaran',
        kind: 'Papan pemuka dalaman',
        before: 'Status pesanan dan penghantaran belum berpusat',
        after: 'Pesanan, status penghantaran dan laporan berkala dalam satu papan pemuka',
        problem: 'Status pesanan dan penghantaran belum berpusat, jadi pentadbiran operasi menjadi sukar.',
        solution: 'Papan pemuka dalaman untuk merekod pesanan, mengemas kini status penghantaran, mencari data dan membuat laporan mengikut tempoh.',
        docs: ['Papan pemuka pesanan', 'Penapis tarikh', 'Laporan penghantaran'],
      },
    },
  },
}

export type ClientProject = ClientText & { key: ClientKey; client: string; business: string }

/** Proyek klien dalam bahasa pengunjung, urut seperti CLIENT_KEYS. Dengan `service`: hanya proyek yang terkait layanan itu. */
export function clientsFor(lang: Lang, service?: ServiceKey): ClientProject[] {
  return CLIENT_KEYS.filter((k) => !service || CLIENTS[k].services.includes(service)).map((key) => {
    const c = CLIENTS[key]
    return { key, client: c.client, business: c.business, ...(isBase(lang) ? c.text[lang] : more(lang).clients[key]) }
  })
}

/** Jangkar bagian "Proyek klien" di halaman Tentang, dan jangkar tiap kartunya. */
export const CLIENTS_ANCHOR = 'proyek-klien'
export const clientAnchor = (key: ClientKey) => `klien-${key}`

/** Tautan ke bagian Proyek klien di halaman Tentang (atau langsung ke kartu satu proyek). */
export const clientsHref = (lang: Lang, key?: ClientKey) => `${path(lang, 'about')}#${key ? clientAnchor(key) : CLIENTS_ANCHOR}`
