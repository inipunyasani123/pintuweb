// Teks halaman lokal "Jasa Pembuatan Website Tulungagung" (rute: app/[lang]/jasa-pembuatan-website-tulungagung).
// id & en ditulis lengkap; bahasa lain versi ringkas. Angka TIDAK ditulis di sini: harga & lama pengerjaan lewat
// penanda {{from:slug}} {{price:slug}} {{duration:slug}} {{renewal}} {{guarantee}} {{demos}} (i18n/facts.ts), fakta
// lain lewat {{city}} {{location}} {{founded}} {{projects}} {{hours}} {{response}} (lib/site.ts lewat facts()).
// Usaha area layanan: hanya kota yang ditulis, tanpa alamat jalan, tanpa janji bertemu langsung (tidak ada di site.ts).
// Fakta daerah (sentra usaha, wisata) hanya yang bersumber; sumbernya di LOCAL_SOURCES dan tampil di halaman.
import { CITY, CLIENT_PROJECTS, FOUNDED_YEAR } from '../lib/site'
import type { DemoCategory } from '../lib/demos'
import { facts, fillFacts } from '../i18n/facts'
import { LANG_INFO, type Lang } from '../i18n/config'
import type { ArticleKey } from '../i18n/slugs'
import type { Hl } from '../i18n/dict/id'

export type SectorKey = 'marmer' | 'fashion' | 'kuliner' | 'wisata' | 'jasa' | 'acara'

/** Urutan petak sektor, paket yang disarankan (slug packages.ts), dan warna aksen (palet CATEGORY_COLOR). */
export const LOCAL_SECTORS: { key: SectorKey; pkg: string; tone: DemoCategory }[] = [
  { key: 'marmer', pkg: 'toko-online-simple', tone: 'properti' },
  { key: 'kuliner', pkg: 'landing-page', tone: 'menu' },
  { key: 'wisata', pkg: 'sistem-reservasi', tone: 'portfolio' },
  { key: 'fashion', pkg: 'toko-online-simple', tone: 'toko' },
  { key: 'jasa', pkg: 'standar-umkm', tone: 'reservasi' },
  { key: 'acara', pkg: 'undangan-digital', tone: 'undangan' },
]

/** Demo yang ditampilkan (slug lib/demos.ts) dan sektor yang diwakilinya. */
export const LOCAL_DEMOS: { slug: string; sector: SectorKey }[] = [
  { slug: 'tanur', sector: 'marmer' },
  { slug: 'kopi', sector: 'kuliner' },
  { slug: 'hotel', sector: 'wisata' },
  { slug: 'lungsin', sector: 'fashion' },
  { slug: 'klinik', sector: 'jasa' },
  { slug: 'wedding', sector: 'acara' },
]

/** Paket yang dirangkum di halaman (slug packages.ts). */
export const LOCAL_PACKAGES = ['landing-page', 'standar-umkm', 'toko-online-simple', 'toko-online-full', 'sistem-reservasi', 'undangan-digital']

/** Sumber fakta daerah yang disebut di halaman (sudah dicek bisa dibuka, 22 Okt 2026). */
export const LOCAL_SOURCES: { title: string; url: string }[] = [
  { title: 'BPS Kabupaten Tulungagung — Kabupaten Tulungagung Dalam Angka 2026', url: 'https://tulungagungkab.bps.go.id/id/publication/2026/02/27/f584576d427a85d6aef19730/kabupaten-tulungagung-dalam-angka-2026.html' },
  { title: 'detikJatim — Tentang Desa Besole yang Bikin Tulungagung Dijuluki Kota Marmer', url: 'https://www.detik.com/jatim/budaya/d-7036125/tentang-desa-besole-yang-bikin-tulungagung-dijuluki-kota-marmer' },
  { title: 'ANTARA Jatim — Kerajinan marmer di Tulungagung', url: 'https://jatim.antaranews.com/berita/1098655/kerajinan-marmer-di-tulungagung' },
  { title: 'ANTARA — Asal usul budaya kopi cethe di Tulungagung', url: 'https://www.antaranews.com/berita/4756537/asal-usul-budaya-kopi-cethe-di-tulungagung' },
  { title: 'detikJatim — 5 Kuliner Khas Tulungagung, dari yang Manis hingga Pedas', url: 'https://www.detik.com/jatim/kuliner/d-7079512/5-kuliner-khas-tulungagung-dari-yang-manis-hingga-pedas' },
  { title: 'Kabar Tulungagung — DWP Disbudpar Jatim Kunjungi Sentra Industri Konveksi', url: 'https://kabar.tulungagung.go.id/dwp-disbudpar-jatim-kunjungi-sentra-industri-konveksi/' },
  { title: 'detikJatim — 5 Daerah Penghasil Batik Terbesar di Jawa Timur', url: 'https://www.detik.com/jatim/budaya/d-6960810/5-daerah-penghasil-batik-terbesar-di-jawa-timur' },
  { title: 'Kompas.com — Magnet Baru Ekonomi Pesisir Jawa, Pansela Tulungagung Tersambung Penuh', url: 'https://www.kompas.com/properti/read/2026/06/11/071754621/magnet-baru-ekonomi-pesisir-jawa-pansela-tulungagung-tersambung-penuh' },
]

type Ring = { label: string; short: string; body: string }

export type LocalText = {
  /** <title> utuh (≤60 karakter, termasuk "| PintuWeb") */
  title: string
  /** meta description ≤155 karakter */
  description: string
  ogTitle: string
  crumb: string
  /** label tautan di footer */
  footerLink: string
  eyebrow: string
  h1: Hl
  answerLead: string
  answer: string
  ctaWa: string
  ctaPricing: string
  facts: { fromLabel: string; baseLabel: string; baseSub: string; hoursLabel: string; sinceLabel: string; sinceValue: string; sinceSub: string; startLabel: string; startValue: string }
  sectorsKicker: string
  sectorsTitle: string
  sectorsLead: string
  pkgLabel: string
  /** keterangan tangkapan layar demo di petak besar */
  demoLabel: (name: string) => string
  /** `points` = daftar fitur singkat; dipakai petak pertama (petak besar di bento) */
  sectors: Record<SectorKey, { name: string; body: string; points?: string[] }>
  sourcesNote: string
  sourcesTitle: string
  areaKicker: string
  areaTitle: string
  areaLead: string
  /** urut dari dalam ke luar: kota, kota sekitar, Indonesia, luar negeri */
  rings: [Ring, Ring, Ring, Ring]
  demosTitle: string
  demosLead: string
  allDemos: string
  pricingKicker: string
  pricingTitle: string
  pricingLead: string
  seePricing: string
  colPrice: string
  colTime: string
  pricingNote: string
  processKicker: string
  processTitle: string
  steps: { title: string; body: string }[]
  faqTitle: string
  faq: { q: string; a: string }[]
  ctaTitle: string
  ctaLead: string
  readTitle: string
  /** artikel terkait (hanya tampil di bahasa yang punya artikel) */
  articles: ArticleKey[]
}

const ARTICLES: ArticleKey[] = ['umkm-tulungagung', 'google-maps', 'katalog-ekspor', 'wisata', 'biaya']

const TEXT: Record<Lang, LocalText> = {
  id: {
    title: 'Jasa Pembuatan Website Tulungagung mulai {{from:landing-page}}',
    description:
      'Jasa pembuatan website di Tulungagung: landing page mulai {{from:landing-page}}, toko online, menu QR & booking. Dikerjakan online, melayani seluruh Indonesia.',
    ogTitle: 'Jasa Pembuatan Website Tulungagung',
    crumb: 'Website Tulungagung',
    footerLink: 'Jasa website Tulungagung',
    eyebrow: '{{location}}',
    h1: ['Jasa pembuatan website ', 'Tulungagung', ' dengan harga yang jelas sejak awal.'],
    answerLead: 'PintuWeb adalah jasa pembuatan website yang berlokasi di {{city}}, Jawa Timur, dan membuat website sejak {{founded}}.',
    answer:
      'Landing page mulai {{from:landing-page}} dan selesai {{duration:landing-page}}; website company profile mulai {{from:standar-umkm}} ({{duration:standar-umkm}}). Semua dikerjakan online: ceritakan usahamu lewat WhatsApp, terima penawaran tertulis, lalu pengerjaan dimulai setelah DP 50%.',
    ctaWa: 'Halo PintuWeb, saya membaca halaman Jasa Pembuatan Website Tulungagung dan ingin konsultasi.',
    ctaPricing: 'Lihat semua harga',
    facts: {
      fromLabel: 'Harga mulai',
      baseLabel: 'Berlokasi di',
      baseSub: 'Melayani online, dari mana saja',
      hoursLabel: 'Jam kerja',
      sinceLabel: 'Membuat website sejak',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} proyek klien',
      startLabel: 'Cara mulai',
      startValue: 'Chat WhatsApp',
    },
    sectorsKicker: 'Per jenis usaha',
    sectorsTitle: 'Website yang cocok untuk usaha di Tulungagung',
    sectorsLead:
      'Usaha yang berbeda butuh website yang berbeda. Ini titik awal yang kami sarankan untuk jenis usaha yang banyak ditemui di Tulungagung; paketnya tetap bisa disesuaikan.',
    pkgLabel: 'Paket yang cocok:',
    demoLabel: (n) => `Contoh katalog: ${n} (demo, usaha fiktif)`,
    sectors: {
      marmer: { name: 'Perajin marmer & onyx', body: 'Tulungagung dijuluki Kota Marmer: industrinya berpusat di Desa Besole (Kecamatan Besuki), sentra kerajinannya ada di Campurdarat, dan BPS mencatat ubin, mozaik, serta wastafel marmer dan onyx dari Tulungagung diekspor ke Amerika, Eropa, dan Asia. Website katalog membantu pembeli dari luar kota dan luar negeri melihat produk sebelum menanyakan harga.', points: ["Katalog dengan ukuran, bahan, dan finishing", "Galeri foto dan video proses produksi", "Formulir permintaan penawaran untuk pesanan khusus & grosir", "Versi bahasa Inggris bila menyasar pembeli luar negeri", "Tombol WhatsApp langsung ke bagian penjualan"] },
      kuliner: { name: 'Kuliner, kafe & warung', body: 'Dari warung nasi lodho sampai warung kopi dengan tradisi cethe yang membuat Tulungagung dijuluki Kota Cethe, usaha makan dan minum paling terbantu oleh menu digital QR: harga selalu terbaru, jam buka jelas, dan tombol pesan lewat WhatsApp.' },
      wisata: { name: 'Wisata & penginapan', body: 'BPS mencatat 25 tempat wisata pantai di Tulungagung, dari Popoh dan Sine sampai Gemah dan Brumbun, dan Jalur Lintas Selatan di Tulungagung tersambung penuh pada pertengahan 2026. Homestay, villa, dan pengelola wisata butuh halaman yang bisa langsung dipesan.' },
      fashion: { name: 'Konveksi, batik & fashion', body: 'Tulungagung punya sentra industri pakaian dalam di Desa Sobontoro (Boyolangu) dan sentra batik di beberapa desa. Katalog online dengan ukuran, warna, dan pemesanan lewat WhatsApp melayani pesanan eceran maupun grosir.' },
      jasa: { name: 'Klinik, sekolah & usaha jasa', body: 'Klinik, bimbel, bengkel, dan usaha jasa lain butuh profil yang jelas: layanan, jam buka, lokasi di Google Maps, dan cara membuat janji. Mulai dari website company profile, lalu tambah booking online saat jadwal mulai padat.' },
      acara: { name: 'Hajatan & acara', body: 'Undangan digital untuk pernikahan, khitanan, aqiqah, atau syukuran: dibagikan lewat WhatsApp, lengkap dengan peta lokasi, hitung mundur, dan konfirmasi kehadiran.' },
    },
    sourcesNote: 'Fakta tentang sentra usaha dan wisata Tulungagung di atas diambil dari sumber publik; daftarnya ada di bagian',
    sourcesTitle: 'Sumber data daerah',
    areaKicker: 'Area layanan',
    areaTitle: 'Berlokasi di Tulungagung, melayani dari mana saja',
    areaLead:
      'Seluruh proses berjalan online lewat WhatsApp dan email, jadi harga paketnya sama di mana pun usahamu berada.',
    rings: [
      { label: 'Tulungagung', short: 'Tulungagung', body: 'Tempat PintuWeb berlokasi. Usaha di sini kami layani dengan cara yang sama dengan klien lain: online, dengan penawaran tertulis.' },
      { label: 'Kota sekitar', short: 'Trenggalek · Kediri · Blitar', body: 'Usaha di kabupaten tetangga seperti Trenggalek, Kediri, dan Blitar memakai paket dan harga yang sama.' },
      { label: 'Seluruh Indonesia', short: 'Seluruh Indonesia', body: 'Klien di kota lain cukup menghubungi lewat WhatsApp; semua tahap, dari penawaran sampai website online, bisa diselesaikan dari jauh.' },
      { label: 'Luar negeri', short: 'Luar negeri', body: 'Klien di luar Indonesia bisa berkomunikasi dalam bahasa Inggris atau Melayu. Harga dalam Rupiah; pembayaran lewat QRIS, transfer bank, DANA, SeaBank, atau USDT.' },
    ],
    demosTitle: 'Contoh yang bisa kamu buka sekarang',
    demosLead:
      'Usaha di demo ini fiktif, tapi fiturnya sungguhan: katalog, menu QR, pemesanan kamar, janji temu, dan undangan. Buka dari ponselmu untuk merasakan tampilannya.',
    allDemos: 'Lihat semua {{demos}} demo',
    pricingKicker: 'Harga',
    pricingTitle: 'Paket untuk usaha di Tulungagung',
    pricingLead:
      'Harga dan lama pengerjaan di bawah diambil dari daftar paket yang sama dengan halaman Harga, berlaku untuk klien di Tulungagung maupun kota lain.',
    seePricing: 'Bandingkan semua paket',
    colPrice: 'Mulai',
    colTime: 'Pengerjaan',
    pricingNote:
      'Lama pengerjaan dihitung setelah konten lengkap. Semua paket: DP 50% untuk mulai, pelunasan setelah website selesai dan kamu setujui. Domain & hosting tahun pertama sudah termasuk; perpanjangannya sekitar {{renewal}} per tahun.',
    processKicker: 'Cara kerja',
    processTitle: 'Empat langkah, semuanya online',
    steps: [
      { title: 'Ceritakan usahamu', body: 'Kirim pesan WhatsApp: jenis usaha, contoh website yang kamu suka, dan kapan ingin online. Konsultasinya gratis.' },
      { title: 'Terima penawaran', body: 'Kami usulkan paket yang pas beserta fitur, harga, dan jadwal tertulis. Pengerjaan dimulai setelah DP 50%.' },
      { title: 'Cek pratinjau', body: 'Kamu menerima pratinjau website yang bisa dibuka sendiri dari ponsel, lalu memberi revisi sesuai paket.' },
      { title: 'Online & didampingi', body: 'Setelah kamu setujui, website online dengan garansi perbaikan bug {{guarantee}} hari. Setelah lunas, domain, kode, dan aksesnya milikmu.' },
    ],
    faqTitle: 'Pertanyaan seputar jasa website di Tulungagung',
    faq: [
      {
        q: 'Berapa biaya pembuatan website di Tulungagung?',
        a: 'Di PintuWeb, landing page mulai {{from:landing-page}}, website company profile mulai {{from:standar-umkm}}, toko online mulai {{from:toko-online-simple}}, dan sistem reservasi mulai {{from:sistem-reservasi}}. Harganya sama untuk klien di Tulungagung maupun kota lain dan sudah termasuk desain, pengerjaan, serta domain dan hosting tahun pertama.',
      },
      {
        q: 'Berapa lama website selesai dibuat?',
        a: 'Landing page {{duration:landing-page}}, website company profile {{duration:standar-umkm}}, toko online {{duration:toko-online-simple}}, dan sistem reservasi {{duration:sistem-reservasi}}, dihitung setelah konten lengkap.',
      },
      { q: 'Bisakah usaha di Tulungagung dibuatkan aplikasi Android dan iOS?', a: 'Bisa. Aplikasi Android dan iOS kami bangun dari satu kode (React Native + Expo), mulai {{from:aplikasi-mobile}} dengan pengerjaan {{duration:aplikasi-mobile}}. Kami menyerahkan file aplikasi dan kode sumbernya; rilis ke Play Store dan App Store memakai akun developer milikmu.' },
      {
        q: 'Apakah harus bertemu langsung?',
        a: 'Tidak perlu. Semua tahap berjalan online lewat WhatsApp dan email: konsultasi, penawaran, pratinjau, revisi, sampai website online. Jam kerja kami {{hours}}.',
      },
      {
        q: 'Apakah PintuWeb melayani usaha di luar Tulungagung?',
        a: 'Ya. Karena semuanya online, kami melayani usaha di kota sekitar seperti Trenggalek, Kediri, dan Blitar, di seluruh Indonesia, dan klien luar negeri dalam bahasa Inggris atau Melayu.',
      },
      {
        q: 'Bisakah usaha saya muncul di Google Maps?',
        a: 'Bisa, lewat Profil Bisnis Google (Google Business Profile) yang didaftarkan dan diverifikasi sendiri oleh pemilik usaha. Website dari kami bisa dipasangi peta lokasi dan ditautkan ke profil itu; langkah-langkahnya ada di artikel kami tentang cara muncul di Google Maps.',
      },
      { q: 'Bagaimana cara pembayarannya?', a: '{{payment}}' },
      {
        q: 'Apakah domain dan hosting sudah termasuk?',
        a: 'Ya, untuk tahun pertama. Mulai tahun kedua, perpanjangannya sekitar {{renewal}} per tahun untuk website, dan kami kabari sebelum jatuh tempo.',
      },
    ],
    ctaTitle: 'Mulai dari satu pesan WhatsApp',
    ctaLead: 'Ceritakan usahamu; kami balas dengan saran paket dan perkiraan biaya. {{response}}.',
    readTitle: 'Bacaan untuk usaha lokal',
    articles: ARTICLES,
  },

  en: {
    title: 'Web Design in Tulungagung, East Java | PintuWeb',
    description:
      'Web design studio in Tulungagung, East Java: landing pages from {{from:landing-page}}, online stores, QR menus and booking sites. Remote, for clients worldwide.',
    ogTitle: 'Web Design & Development in Tulungagung',
    crumb: 'Web design in Tulungagung',
    footerLink: 'Web design in Tulungagung',
    eyebrow: '{{location}}',
    h1: ['Web design in ', 'Tulungagung', ', with prices you can see up front.'],
    answerLead: 'PintuWeb is a web design and development studio based in {{city}}, East Java, Indonesia, building websites since {{founded}}.',
    answer:
      'Landing pages start at {{from:landing-page}} and take {{duration:landing-page}}; company websites start at {{from:standar-umkm}} ({{duration:standar-umkm}}). Everything happens remotely: tell us about your business on WhatsApp, get a written quote, and work starts after a 50% deposit.',
    ctaWa: 'Hello PintuWeb, I read your page about web design in Tulungagung and would like to talk about a website.',
    ctaPricing: 'See all prices',
    facts: {
      fromLabel: 'Prices from',
      baseLabel: 'Based in',
      baseSub: 'Working remotely, anywhere',
      hoursLabel: 'Working hours',
      sinceLabel: 'Building websites since',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} client projects',
      startLabel: 'How to start',
      startValue: 'Message on WhatsApp',
    },
    sectorsKicker: 'By type of business',
    sectorsTitle: 'What businesses in Tulungagung usually need',
    sectorsLead:
      'Different businesses need different websites. These are the starting points we suggest for the kinds of business you find across Tulungagung; every package can still be adjusted.',
    pkgLabel: 'Suggested package:',
    demoLabel: (n) => `Example catalogue: ${n} (demo, fictional business)`,
    sectors: {
      marmer: { name: 'Marble & onyx workshops', body: 'Tulungagung is nicknamed the City of Marble: the industry is centred on Besole village in Besuki district, there is a craft centre in Campurdarat, and Statistics Indonesia (BPS) records marble and onyx tiles, mosaics and basins from Tulungagung exported to the US, Europe and Asia. A catalogue site lets out-of-town and overseas buyers see the products before asking for a price.', points: ["A catalogue with sizes, materials and finishes", "Photo and video galleries of the workshop", "A quote request form for custom and wholesale orders", "An English version if you sell to overseas buyers", "A WhatsApp button straight to sales"] },
      kuliner: { name: 'Food, cafés & warungs', body: "From stalls serving nasi lodho to coffee shops with the cethe tradition (painting cigarettes with coffee grounds) behind Tulungagung's nickname, Kota Cethe, food businesses gain most from a QR menu: current prices, clear opening hours and a WhatsApp order button." },
      wisata: { name: 'Tourism & places to stay', body: "BPS lists 25 beach attractions in Tulungagung, from Popoh and Sine to Gemah and Brumbun, and the regency's stretch of the southern coastal road (JLS) was fully connected in mid-2026. Homestays, villas and tour operators need a page guests can book from directly." },
      fashion: { name: 'Garments, batik & fashion', body: 'Tulungagung has an underwear manufacturing centre in Sobontoro village (Boyolangu) and batik centres in several villages. An online catalogue with sizes, colours and WhatsApp ordering handles both retail and wholesale orders.' },
      jasa: { name: 'Clinics, schools & services', body: 'Clinics, tutoring centres, workshops and other service businesses need a clear profile: services, opening hours, a Google Maps location and a way to book. Start with a company website and add online booking once the schedule fills up.' },
      acara: { name: 'Weddings & events', body: 'Digital invitations for weddings, circumcision ceremonies, aqiqah or thanksgiving gatherings, shared on WhatsApp with a map, countdown and RSVP.' },
    },
    sourcesNote: 'Facts about Tulungagung’s industries and attractions above come from public sources, listed under',
    sourcesTitle: 'Local sources',
    areaKicker: 'Service area',
    areaTitle: 'Based in Tulungagung, working with clients anywhere',
    areaLead: 'The whole process runs remotely over WhatsApp and email, so the package prices are the same wherever your business is.',
    rings: [
      { label: 'Tulungagung', short: 'Tulungagung', body: 'Where PintuWeb is based. Local businesses work with us the same way as every other client: remotely, with a written quote.' },
      { label: 'Neighbouring regencies', short: 'Trenggalek · Kediri · Blitar', body: 'Businesses in neighbouring regencies such as Trenggalek, Kediri and Blitar get the same packages and prices.' },
      { label: 'Anywhere in Indonesia', short: 'All of Indonesia', body: 'Clients in other cities simply message us on WhatsApp; every step, from the quote to launch, can be done at a distance.' },
      { label: 'Outside Indonesia', short: 'Worldwide', body: 'International clients can work with us in English or Malay. Prices are in Indonesian Rupiah (IDR); payment is by QRIS, bank transfer, DANA, SeaBank or USDT.' },
    ],
    demosTitle: 'Examples you can open right now',
    demosLead:
      'The businesses in these demos are fictional, but the features are real: catalogues, QR menus, room booking, appointments and invitations. Open them on your phone to get a feel for them.',
    allDemos: 'See all {{demos}} demos',
    pricingKicker: 'Pricing',
    pricingTitle: 'Packages for local businesses',
    pricingLead: 'Prices and turnaround below come from the same package list as the Pricing page, and apply to clients in Tulungagung and everywhere else.',
    seePricing: 'Compare every package',
    colPrice: 'From',
    colTime: 'Turnaround',
    pricingNote:
      'Turnaround starts once your content is complete. Every package: a 50% deposit to start, the rest once the website is finished and you have approved it. The first year of domain and hosting is included; renewal is roughly {{renewal}} a year.',
    processKicker: 'How it works',
    processTitle: 'Four steps, all of them online',
    steps: [
      { title: 'Tell us about your business', body: 'Send a WhatsApp message: what you do, websites you like, and when you want to launch. The consultation is free.' },
      { title: 'Get a written quote', body: 'We suggest the right package with its features, price and schedule in writing. Work starts after a 50% deposit.' },
      { title: 'Review the preview', body: 'You get a preview of the website to open on your own phone, then send revisions as your package allows.' },
      { title: 'Launch with support', body: 'Once you approve it, the website goes live with a {{guarantee}}-day bug-fix guarantee. After the final payment, the domain, code and access are yours.' },
    ],
    faqTitle: 'Questions about web design in Tulungagung',
    faq: [
      {
        q: 'How much does a website cost in Tulungagung?',
        a: 'At PintuWeb, landing pages start at {{from:landing-page}}, company websites at {{from:standar-umkm}}, online stores at {{from:toko-online-simple}} and booking systems at {{from:sistem-reservasi}}. Prices are the same for clients in Tulungagung and elsewhere, and include design, development and the first year of domain and hosting.',
      },
      {
        q: 'How long does it take?',
        a: 'Landing pages take {{duration:landing-page}}, company websites {{duration:standar-umkm}}, online stores {{duration:toko-online-simple}} and booking systems {{duration:sistem-reservasi}}, counted from when your content is complete.',
      },
      { q: 'Can you build an Android and iOS app for a business in Tulungagung?', a: 'Yes. We build Android and iOS apps from one codebase (React Native + Expo), from {{from:aplikasi-mobile}} with a turnaround of {{duration:aplikasi-mobile}}. We hand over the app files and source code; publishing to the Play Store and App Store uses your own developer accounts.' },
      {
        q: 'Do we need to meet in person?',
        a: 'No. Every step runs online over WhatsApp and email: consultation, quote, preview, revisions and launch. Our working hours are {{hours}}.',
      },
      {
        q: 'Can you work with clients outside Indonesia?',
        a: 'Yes. We work remotely in English or Malay. Prices are in Indonesian Rupiah (IDR). We accept QRIS, bank transfer, DANA, SeaBank and USDT; clients outside Indonesia can pay in USDT, with the network and wallet address stated on the invoice.',
      },
      {
        q: 'Can my business appear on Google Maps?',
        a: 'Yes, through a Google Business Profile, which the business owner registers and verifies. We can add a location map to your website and link it to that profile; our article on Google Business Profile explains the steps.',
      },
      { q: 'How does payment work?', a: '{{payment}}' },
    ],
    ctaTitle: 'Start with one WhatsApp message',
    ctaLead: 'Tell us about your business and we will reply with a suggested package and an estimate. {{response}}.',
    readTitle: 'Further reading',
    articles: ARTICLES,
  },

  ms: {
    title: 'Pembuatan Laman Web di Tulungagung | PintuWeb',
    description:
      'Studio laman web di Tulungagung, Jawa Timur: landing page dari {{from:landing-page}}, kedai dalam talian dan sistem tempahan. Bekerja jarak jauh.',
    ogTitle: 'Pembuatan Laman Web di Tulungagung',
    crumb: 'Laman web Tulungagung',
    footerLink: 'Laman web Tulungagung',
    eyebrow: '{{location}}',
    h1: ['Pembuatan laman web di ', 'Tulungagung', ', dengan harga yang jelas dari awal.'],
    answerLead: 'PintuWeb ialah studio reka bentuk dan pembangunan laman web yang berpangkalan di {{city}}, Jawa Timur, Indonesia, sejak {{founded}} membina laman web.',
    answer:
      'Landing page bermula {{from:landing-page}} ({{duration:landing-page}}); laman web syarikat bermula {{from:standar-umkm}} ({{duration:standar-umkm}}). Semuanya jarak jauh: ceritakan perniagaan anda di WhatsApp, terima sebut harga bertulis, dan kerja bermula selepas deposit 50%.',
    ctaWa: 'Hai PintuWeb, saya membaca halaman laman web Tulungagung dan ingin berbincang tentang laman web.',
    ctaPricing: 'Lihat semua harga',
    facts: {
      fromLabel: 'Harga dari',
      baseLabel: 'Berpangkalan di',
      baseSub: 'Bekerja jarak jauh, di mana-mana',
      hoursLabel: 'Waktu bekerja',
      sinceLabel: 'Membina laman web sejak',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} projek pelanggan',
      startLabel: 'Cara bermula',
      startValue: 'Mesej WhatsApp',
    },
    sectorsKicker: 'Mengikut jenis perniagaan',
    sectorsTitle: 'Laman web untuk perniagaan di Tulungagung',
    sectorsLead: 'Titik permulaan yang kami cadangkan untuk jenis perniagaan yang banyak terdapat di Tulungagung.',
    pkgLabel: 'Pakej dicadangkan:',
    demoLabel: (n) => `Contoh katalog: ${n} (demo, perniagaan rekaan)`,
    sectors: {
      marmer: { name: 'Bengkel marmar & oniks', body: 'Tulungagung digelar Kota Marmar: industrinya berpusat di Desa Besole (Besuki) dan Campurdarat, dengan jubin dan sinki marmar serta oniks dieksport ke Amerika, Eropah dan Asia. Laman katalog membantu pembeli luar melihat produk sebelum bertanya harga.' },
      kuliner: { name: 'Makanan, kafe & warung', body: 'Daripada warung nasi lodho hingga kedai kopi dengan tradisi cethe, menu digital QR memastikan harga sentiasa terkini dan pesanan boleh dihantar melalui WhatsApp.' },
      wisata: { name: 'Pelancongan & penginapan', body: 'BPS mencatat 25 tarikan pantai di Tulungagung, seperti Popoh, Sine dan Gemah. Homestay dan vila memerlukan halaman yang boleh terus ditempah.' },
      fashion: { name: 'Pakaian, batik & fesyen', body: 'Sentra pakaian dalam di Desa Sobontoro dan batik Tulungagung sesuai dengan katalog dalam talian dan pesanan WhatsApp, untuk runcit atau borong.' },
      jasa: { name: 'Klinik, sekolah & perkhidmatan', body: 'Profil yang jelas: perkhidmatan, waktu buka, lokasi Google Maps dan temu janji; tambah sistem tempahan apabila jadual makin padat.' },
      acara: { name: 'Majlis & acara', body: 'Kad jemputan digital untuk perkahwinan dan majlis keluarga, dikongsi melalui WhatsApp dengan peta, kiraan detik dan RSVP.' },
    },
    sourcesNote: 'Fakta tentang industri dan tarikan Tulungagung di atas diambil daripada sumber awam, disenaraikan di bahagian',
    sourcesTitle: 'Sumber tempatan',
    areaKicker: 'Kawasan perkhidmatan',
    areaTitle: 'Berpangkalan di Tulungagung, melayani dari mana-mana',
    areaLead: 'Seluruh proses berjalan dalam talian melalui WhatsApp dan e-mel, jadi harga pakej sama di mana-mana pun.',
    rings: [
      { label: 'Tulungagung', short: 'Tulungagung', body: 'Tempat PintuWeb berpangkalan.' },
      { label: 'Kabupaten berjiran', short: 'Trenggalek · Kediri · Blitar', body: 'Pakej dan harga yang sama untuk Trenggalek, Kediri, Blitar dan sekitarnya.' },
      { label: 'Seluruh Indonesia', short: 'Seluruh Indonesia', body: 'Semua langkah, dari sebut harga hingga pelancaran, boleh dibuat dari jauh.' },
      { label: 'Luar Indonesia', short: 'Luar negara', body: 'Pelanggan antarabangsa boleh berurusan dalam bahasa Melayu atau Inggeris. Harga dalam Rupiah (IDR); pembayaran melalui QRIS, pindahan bank, DANA, SeaBank atau USDT.' },
    ],
    demosTitle: 'Contoh yang boleh dibuka sekarang',
    demosLead: 'Perniagaan dalam demo ini rekaan, tetapi cirinya benar: katalog, menu QR, tempahan bilik, temu janji dan jemputan.',
    allDemos: 'Lihat semua {{demos}} demo',
    pricingKicker: 'Harga',
    pricingTitle: 'Pakej untuk perniagaan tempatan',
    pricingLead: 'Harga dan tempoh siap diambil daripada senarai pakej yang sama dengan halaman Harga.',
    seePricing: 'Bandingkan semua pakej',
    colPrice: 'Dari',
    colTime: 'Tempoh siap',
    pricingNote: 'Tempoh siap dikira selepas kandungan lengkap. Deposit 50% untuk bermula; domain & hosting tahun pertama termasuk, pembaharuan sekitar {{renewal}} setahun.',
    processKicker: 'Cara kerja',
    processTitle: 'Empat langkah, semuanya dalam talian',
    steps: [
      { title: 'Ceritakan perniagaan anda', body: 'Hantar mesej WhatsApp. Konsultasi percuma.' },
      { title: 'Terima sebut harga', body: 'Pakej, ciri, harga dan jadual secara bertulis. Kerja bermula selepas deposit 50%.' },
      { title: 'Semak pratonton', body: 'Buka pratonton laman web di telefon anda dan hantar pembetulan mengikut pakej.' },
      { title: 'Dilancarkan', body: 'Selepas anda luluskan, laman web dilancarkan dengan jaminan pembaikan pepijat {{guarantee}} hari. Selepas bayaran penuh, domain, kod dan akses menjadi milik anda.' },
    ],
    faqTitle: 'Soalan lazim',
    faq: [
      { q: 'Berapakah kos laman web?', a: 'Landing page dari {{from:landing-page}}, laman web syarikat dari {{from:standar-umkm}}, kedai dalam talian dari {{from:toko-online-simple}} dan sistem tempahan dari {{from:sistem-reservasi}}, termasuk domain dan hosting tahun pertama.' },
      { q: 'Berapa lama masa diperlukan?', a: 'Landing page {{duration:landing-page}}, laman web syarikat {{duration:standar-umkm}} dan kedai dalam talian {{duration:toko-online-simple}}, dikira selepas kandungan lengkap.' },
      { q: 'Bolehkah perniagaan di Tulungagung dibina aplikasi Android dan iOS?', a: 'Boleh. Aplikasi Android dan iOS kami bina daripada satu kod (React Native + Expo), dari {{from:aplikasi-mobile}} dengan tempoh {{duration:aplikasi-mobile}}. Kami serahkan fail aplikasi dan kod sumbernya; penerbitan ke Play Store dan App Store menggunakan akaun pembangun anda sendiri.' },
      { q: 'Perlukah kita berjumpa?', a: 'Tidak. Semua langkah berjalan melalui WhatsApp dan e-mel. Waktu bekerja kami {{hours}}.' },
      { q: 'Bagaimanakah cara pembayaran?', a: '{{payment}}' },
    ],
    ctaTitle: 'Bermula dengan satu mesej WhatsApp',
    ctaLead: 'Ceritakan perniagaan anda; kami balas dengan cadangan pakej dan anggaran kos. {{response}}.',
    readTitle: 'Bacaan lanjut',
    articles: [],
  },

  es: {
    title: 'Diseño web en Tulungagung, Indonesia | PintuWeb',
    description:
      'Estudio de diseño web en Tulungagung (Java Oriental): landing pages desde {{from:landing-page}}, tiendas online y reservas. Trabajo a distancia.',
    ogTitle: 'Diseño y desarrollo web en Tulungagung',
    crumb: 'Diseño web en Tulungagung',
    footerLink: 'Diseño web en Tulungagung',
    eyebrow: '{{location}}',
    h1: ['Diseño web en ', 'Tulungagung', ', con precios claros desde el principio.'],
    answerLead: 'PintuWeb es un estudio de diseño y desarrollo web con sede en {{city}}, Java Oriental (Indonesia), que crea sitios web desde {{founded}}.',
    answer:
      'Las landing pages cuestan desde {{from:landing-page}} y tardan {{duration:landing-page}}; los sitios corporativos, desde {{from:standar-umkm}} ({{duration:standar-umkm}}). Todo se hace a distancia: nos escribes por WhatsApp, recibes un presupuesto por escrito y empezamos tras un anticipo del 50 %.',
    ctaWa: 'Hola PintuWeb, leí su página sobre diseño web en Tulungagung y quiero hablar de un sitio web.',
    ctaPricing: 'Ver todos los precios',
    facts: {
      fromLabel: 'Precios desde',
      baseLabel: 'Con sede en',
      baseSub: 'Trabajo a distancia',
      hoursLabel: 'Horario',
      sinceLabel: 'Creando sitios desde',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} proyectos de clientes',
      startLabel: 'Cómo empezar',
      startValue: 'Mensaje por WhatsApp',
    },
    sectorsKicker: 'Por tipo de negocio',
    sectorsTitle: 'Sitios web para negocios de Tulungagung',
    sectorsLead: 'Los puntos de partida que recomendamos para los negocios más comunes de Tulungagung.',
    pkgLabel: 'Paquete sugerido:',
    demoLabel: (n) => `Catálogo de ejemplo: ${n} (demo, negocio ficticio)`,
    sectors: {
      marmer: { name: 'Talleres de mármol y ónix', body: 'A Tulungagung la llaman la Ciudad del Mármol: la industria se concentra en Besole (Besuki) y Campurdarat, y exporta baldosas y lavabos de mármol y ónix a EE. UU., Europa y Asia. Un catálogo web deja ver los productos antes de pedir precio.' },
      kuliner: { name: 'Comida, cafés y warungs', body: 'Desde puestos de nasi lodho hasta cafés con la tradición cethe, un menú QR mantiene los precios al día y permite pedir por WhatsApp.' },
      wisata: { name: 'Turismo y alojamiento', body: 'La oficina de estadística (BPS) registra 25 playas turísticas en Tulungagung, como Popoh, Sine y Gemah. Casas de huéspedes y villas necesitan una página para reservar directamente.' },
      fashion: { name: 'Confección, batik y moda', body: 'Con un centro de ropa interior en Sobontoro y batik propio, un catálogo online con pedidos por WhatsApp sirve para venta al por menor y al por mayor.' },
      jasa: { name: 'Clínicas, escuelas y servicios', body: 'Un perfil claro con servicios, horario, ubicación en Google Maps y citas; se añade un sistema de reservas cuando la agenda se llena.' },
      acara: { name: 'Bodas y eventos', body: 'Invitaciones digitales para bodas y celebraciones familiares, compartidas por WhatsApp con mapa, cuenta atrás y confirmación.' },
    },
    sourcesNote: 'Los datos sobre las industrias y atractivos de Tulungagung provienen de fuentes públicas, citadas en',
    sourcesTitle: 'Fuentes locales',
    areaKicker: 'Zona de servicio',
    areaTitle: 'Con sede en Tulungagung, para clientes de cualquier lugar',
    areaLead: 'Todo el proceso se hace en línea por WhatsApp y correo, así que los precios son los mismos estés donde estés.',
    rings: [
      { label: 'Tulungagung', short: 'Tulungagung', body: 'Donde tiene su sede PintuWeb.' },
      { label: 'Regencias vecinas', short: 'Trenggalek · Kediri · Blitar', body: 'Los mismos paquetes y precios para Trenggalek, Kediri, Blitar y alrededores.' },
      { label: 'Toda Indonesia', short: 'Toda Indonesia', body: 'Cada paso, del presupuesto al lanzamiento, se hace a distancia.' },
      { label: 'Fuera de Indonesia', short: 'Internacional', body: 'Atendemos en inglés o malayo. Precios en rupias indonesias (IDR); el pago es por QRIS, transferencia bancaria, DANA, SeaBank o USDT.' },
    ],
    demosTitle: 'Ejemplos que puedes abrir ahora',
    demosLead: 'Los negocios de estas demos son ficticios, pero las funciones son reales: catálogos, menús QR, reservas, citas e invitaciones.',
    allDemos: 'Ver las {{demos}} demos',
    pricingKicker: 'Precios',
    pricingTitle: 'Paquetes para negocios locales',
    pricingLead: 'Precios y plazos tomados de la misma lista de paquetes que la página de Precios.',
    seePricing: 'Comparar todos los paquetes',
    colPrice: 'Desde',
    colTime: 'Plazo',
    pricingNote: 'El plazo empieza cuando el contenido está completo. Anticipo del 50 %; el primer año de dominio y hosting está incluido, y la renovación ronda {{renewal}} al año.',
    processKicker: 'Cómo trabajamos',
    processTitle: 'Cuatro pasos, todos en línea',
    steps: [
      { title: 'Cuéntanos tu negocio', body: 'Escríbenos por WhatsApp. La consulta es gratuita.' },
      { title: 'Recibe el presupuesto', body: 'Paquete, funciones, precio y calendario por escrito. Empezamos tras el anticipo del 50 %.' },
      { title: 'Revisa la vista previa', body: 'Ábrela en tu propio teléfono y envía las revisiones que incluya tu paquete.' },
      { title: 'Lanzamiento', body: 'Cuando lo apruebas, el sitio se publica con {{guarantee}} días de garantía de corrección de errores. Tras el pago final, dominio, código y accesos son tuyos.' },
    ],
    faqTitle: 'Preguntas frecuentes',
    faq: [
      { q: '¿Cuánto cuesta un sitio web?', a: 'Landing pages desde {{from:landing-page}}, sitios corporativos desde {{from:standar-umkm}}, tiendas online desde {{from:toko-online-simple}} y sistemas de reservas desde {{from:sistem-reservasi}}, con el primer año de dominio y hosting incluido.' },
      { q: '¿Cuánto tarda?', a: 'Landing page {{duration:landing-page}}, sitio corporativo {{duration:standar-umkm}} y tienda online {{duration:toko-online-simple}}, desde que el contenido está completo.' },
      { q: '¿Pueden crear una app Android e iOS para un negocio de Tulungagung?', a: 'Sí. Creamos apps Android e iOS desde un solo código (React Native + Expo), desde {{from:aplikasi-mobile}} y con un plazo de {{duration:aplikasi-mobile}}. Entregamos los archivos de la app y el código fuente; la publicación en Play Store y App Store se hace con tus propias cuentas de desarrollador.' },
      { q: '¿Hace falta reunirse en persona?', a: 'No. Todo se hace por WhatsApp y correo. Nuestro horario: {{hours}}.' },
      { q: '¿Cómo se paga?', a: '{{payment}}' },
    ],
    ctaTitle: 'Empieza con un mensaje de WhatsApp',
    ctaLead: 'Cuéntanos tu negocio y te responderemos con un paquete sugerido y un presupuesto estimado. {{response}}.',
    readTitle: 'Lecturas',
    articles: [],
  },

  fr: {
    title: 'Création de site web à Tulungagung | PintuWeb',
    description:
      'Studio de création web à Tulungagung (Java oriental) : landing pages dès {{from:landing-page}}, boutiques en ligne et réservations. Travail à distance.',
    ogTitle: 'Création de sites web à Tulungagung',
    crumb: 'Sites web à Tulungagung',
    footerLink: 'Sites web à Tulungagung',
    eyebrow: '{{location}}',
    h1: ['Création de sites web à ', 'Tulungagung', ', avec des prix clairs dès le départ.'],
    answerLead: 'PintuWeb est un studio de conception et de développement web basé à {{city}}, Java oriental (Indonésie), qui crée des sites depuis {{founded}}.',
    answer:
      'Une landing page coûte à partir de {{from:landing-page}} et prend {{duration:landing-page}} ; un site d’entreprise, à partir de {{from:standar-umkm}} ({{duration:standar-umkm}}). Tout se fait à distance : vous nous écrivez sur WhatsApp, recevez un devis écrit, et le travail commence après un acompte de 50 %.',
    ctaWa: 'Bonjour PintuWeb, j’ai lu votre page sur la création de sites à Tulungagung et je voudrais parler d’un site web.',
    ctaPricing: 'Voir tous les tarifs',
    facts: {
      fromLabel: 'Tarifs dès',
      baseLabel: 'Basé à',
      baseSub: 'Travail à distance',
      hoursLabel: 'Horaires',
      sinceLabel: 'Sites créés depuis',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} projets clients',
      startLabel: 'Pour commencer',
      startValue: 'Message WhatsApp',
    },
    sectorsKicker: 'Par type d’activité',
    sectorsTitle: 'Des sites pour les entreprises de Tulungagung',
    sectorsLead: 'Les points de départ que nous conseillons pour les activités les plus courantes à Tulungagung.',
    pkgLabel: 'Formule conseillée :',
    demoLabel: (n) => `Exemple de catalogue : ${n} (démo, entreprise fictive)`,
    sectors: {
      marmer: { name: 'Ateliers de marbre et d’onyx', body: 'Surnommée la ville du marbre, Tulungagung concentre son industrie à Besole (Besuki) et Campurdarat, et exporte carrelages et vasques en marbre et en onyx vers les États-Unis, l’Europe et l’Asie. Un catalogue en ligne montre les produits avant la demande de prix.' },
      kuliner: { name: 'Restauration, cafés et warungs', body: 'Des stands de nasi lodho aux cafés de la tradition cethe, un menu QR garde les prix à jour et permet de commander par WhatsApp.' },
      wisata: { name: 'Tourisme et hébergement', body: 'L’institut statistique (BPS) recense 25 plages touristiques à Tulungagung, dont Popoh, Sine et Gemah. Maisons d’hôtes et villas ont besoin d’une page de réservation directe.' },
      fashion: { name: 'Confection, batik et mode', body: 'Avec un pôle de lingerie à Sobontoro et un batik local, un catalogue en ligne avec commande par WhatsApp sert la vente au détail comme en gros.' },
      jasa: { name: 'Cliniques, écoles et services', body: 'Un profil clair : services, horaires, emplacement sur Google Maps et prise de rendez-vous ; un système de réservation s’ajoute quand l’agenda se remplit.' },
      acara: { name: 'Mariages et événements', body: 'Des invitations numériques pour mariages et fêtes de famille, partagées sur WhatsApp avec carte, compte à rebours et confirmation de présence.' },
    },
    sourcesNote: 'Les informations sur les filières et les sites de Tulungagung proviennent de sources publiques, listées dans',
    sourcesTitle: 'Sources locales',
    areaKicker: 'Zone desservie',
    areaTitle: 'Basé à Tulungagung, au service de clients partout',
    areaLead: 'Tout se fait en ligne par WhatsApp et e-mail : les tarifs sont les mêmes où que vous soyez.',
    rings: [
      { label: 'Tulungagung', short: 'Tulungagung', body: 'Là où PintuWeb est basé.' },
      { label: 'Régences voisines', short: 'Trenggalek · Kediri · Blitar', body: 'Mêmes formules et mêmes tarifs pour Trenggalek, Kediri, Blitar et alentour.' },
      { label: 'Toute l’Indonésie', short: 'Toute l’Indonésie', body: 'Chaque étape, du devis à la mise en ligne, se fait à distance.' },
      { label: 'Hors d’Indonésie', short: 'International', body: 'Échanges en anglais ou en malais. Prix en roupies indonésiennes (IDR) ; paiement par QRIS, virement bancaire, DANA, SeaBank ou USDT.' },
    ],
    demosTitle: 'Des exemples à ouvrir dès maintenant',
    demosLead: 'Les entreprises de ces démos sont fictives, mais les fonctions sont réelles : catalogues, menus QR, réservations, rendez-vous et invitations.',
    allDemos: 'Voir les {{demos}} démos',
    pricingKicker: 'Tarifs',
    pricingTitle: 'Des formules pour les entreprises locales',
    pricingLead: 'Prix et délais issus de la même liste de formules que la page Tarifs.',
    seePricing: 'Comparer toutes les formules',
    colPrice: 'Dès',
    colTime: 'Délai',
    pricingNote: 'Le délai court une fois le contenu complet. Acompte de 50 % ; la première année de domaine et d’hébergement est incluse, le renouvellement coûte environ {{renewal}} par an.',
    processKicker: 'Méthode',
    processTitle: 'Quatre étapes, toutes en ligne',
    steps: [
      { title: 'Présentez votre activité', body: 'Écrivez-nous sur WhatsApp. La consultation est gratuite.' },
      { title: 'Recevez le devis', body: 'Formule, fonctions, prix et calendrier par écrit. Début après l’acompte de 50 %.' },
      { title: 'Vérifiez l’aperçu', body: 'Ouvrez-le sur votre téléphone et envoyez les retouches prévues par votre formule.' },
      { title: 'Mise en ligne', body: 'Une fois validé, le site est mis en ligne avec {{guarantee}} jours de garantie de correction des bugs. Après le solde, domaine, code et accès vous appartiennent.' },
    ],
    faqTitle: 'Questions fréquentes',
    faq: [
      { q: 'Combien coûte un site web ?', a: 'Landing page dès {{from:landing-page}}, site d’entreprise dès {{from:standar-umkm}}, boutique en ligne dès {{from:toko-online-simple}} et système de réservation dès {{from:sistem-reservasi}}, avec la première année de domaine et d’hébergement.' },
      { q: 'Quel est le délai ?', a: 'Landing page {{duration:landing-page}}, site d’entreprise {{duration:standar-umkm}}, boutique en ligne {{duration:toko-online-simple}}, à partir du contenu complet.' },
      { q: 'Pouvez-vous créer une appli Android et iOS pour une entreprise de Tulungagung ?', a: 'Oui. Nous créons des applis Android et iOS à partir d’un seul code (React Native + Expo), dès {{from:aplikasi-mobile}}, avec un délai de {{duration:aplikasi-mobile}}. Nous remettons les fichiers de l’appli et le code source ; la publication sur le Play Store et l’App Store se fait avec vos propres comptes développeur.' },
      { q: 'Faut-il se rencontrer ?', a: 'Non. Tout se fait par WhatsApp et e-mail. Nos horaires : {{hours}}.' },
      { q: 'Comment payer ?', a: '{{payment}}' },
    ],
    ctaTitle: 'Commencez par un message WhatsApp',
    ctaLead: 'Présentez votre activité ; nous répondons avec une formule conseillée et une estimation. {{response}}.',
    readTitle: 'À lire',
    articles: [],
  },

  pt: {
    title: 'Criação de sites em Tulungagung | PintuWeb',
    description:
      'Estúdio de criação de sites em Tulungagung (Java Oriental): landing pages a partir de {{from:landing-page}}, lojas virtuais e reservas. Trabalho remoto.',
    ogTitle: 'Criação de sites em Tulungagung',
    crumb: 'Sites em Tulungagung',
    footerLink: 'Sites em Tulungagung',
    eyebrow: '{{location}}',
    h1: ['Criação de sites em ', 'Tulungagung', ', com preços claros desde o início.'],
    answerLead: 'A PintuWeb é um estúdio de design e desenvolvimento web sediado em {{city}}, Java Oriental (Indonésia), que cria sites desde {{founded}}.',
    answer:
      'Landing pages custam a partir de {{from:landing-page}} e ficam prontas em {{duration:landing-page}}; sites institucionais, a partir de {{from:standar-umkm}} ({{duration:standar-umkm}}). Tudo é feito a distância: você fala conosco pelo WhatsApp, recebe um orçamento por escrito e o trabalho começa após um sinal de 50%.',
    ctaWa: 'Olá PintuWeb, li a página sobre criação de sites em Tulungagung e quero conversar sobre um site.',
    ctaPricing: 'Ver todos os preços',
    facts: {
      fromLabel: 'Preços a partir de',
      baseLabel: 'Sediada em',
      baseSub: 'Trabalho remoto',
      hoursLabel: 'Horário',
      sinceLabel: 'Criando sites desde',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} projetos de clientes',
      startLabel: 'Como começar',
      startValue: 'Mensagem no WhatsApp',
    },
    sectorsKicker: 'Por tipo de negócio',
    sectorsTitle: 'Sites para negócios de Tulungagung',
    sectorsLead: 'Os pontos de partida que sugerimos para os negócios mais comuns de Tulungagung.',
    pkgLabel: 'Pacote sugerido:',
    demoLabel: (n) => `Catálogo de exemplo: ${n} (demo, negócio fictício)`,
    sectors: {
      marmer: { name: 'Oficinas de mármore e ônix', body: 'Conhecida como cidade do mármore, Tulungagung concentra a indústria em Besole (Besuki) e Campurdarat e exporta pisos e cubas de mármore e ônix para EUA, Europa e Ásia. Um catálogo on-line mostra os produtos antes do pedido de preço.' },
      kuliner: { name: 'Comida, cafés e warungs', body: 'Das barracas de nasi lodho aos cafés da tradição cethe, um cardápio QR mantém os preços atualizados e aceita pedidos pelo WhatsApp.' },
      wisata: { name: 'Turismo e hospedagem', body: 'O instituto de estatística (BPS) registra 25 praias turísticas em Tulungagung, como Popoh, Sine e Gemah. Pousadas e villas precisam de uma página com reserva direta.' },
      fashion: { name: 'Confecção, batik e moda', body: 'Com um polo de roupas íntimas em Sobontoro e batik próprio, um catálogo on-line com pedidos pelo WhatsApp atende varejo e atacado.' },
      jasa: { name: 'Clínicas, escolas e serviços', body: 'Um perfil claro com serviços, horário, localização no Google Maps e agendamento; o sistema de reservas entra quando a agenda enche.' },
      acara: { name: 'Casamentos e eventos', body: 'Convites digitais para casamentos e festas de família, enviados pelo WhatsApp com mapa, contagem regressiva e confirmação de presença.' },
    },
    sourcesNote: 'As informações sobre os setores e atrações de Tulungagung vêm de fontes públicas, listadas em',
    sourcesTitle: 'Fontes locais',
    areaKicker: 'Área de atendimento',
    areaTitle: 'Sediada em Tulungagung, atendendo clientes de qualquer lugar',
    areaLead: 'Todo o processo acontece on-line, por WhatsApp e e-mail, então os preços são os mesmos onde quer que você esteja.',
    rings: [
      { label: 'Tulungagung', short: 'Tulungagung', body: 'Onde a PintuWeb está sediada.' },
      { label: 'Regências vizinhas', short: 'Trenggalek · Kediri · Blitar', body: 'Os mesmos pacotes e preços para Trenggalek, Kediri, Blitar e arredores.' },
      { label: 'Toda a Indonésia', short: 'Toda a Indonésia', body: 'Cada etapa, do orçamento ao lançamento, é feita a distância.' },
      { label: 'Fora da Indonésia', short: 'Internacional', body: 'Atendimento em inglês ou malaio. Preços em rupias indonésias (IDR); pagamento por QRIS, transferência bancária, DANA, SeaBank ou USDT.' },
    ],
    demosTitle: 'Exemplos para abrir agora',
    demosLead: 'Os negócios destas demos são fictícios, mas os recursos são reais: catálogos, cardápios QR, reservas, agendamentos e convites.',
    allDemos: 'Ver as {{demos}} demos',
    pricingKicker: 'Preços',
    pricingTitle: 'Pacotes para negócios locais',
    pricingLead: 'Preços e prazos da mesma lista de pacotes da página de Preços.',
    seePricing: 'Comparar todos os pacotes',
    colPrice: 'A partir de',
    colTime: 'Prazo',
    pricingNote: 'O prazo começa quando o conteúdo está completo. Sinal de 50%; o primeiro ano de domínio e hospedagem está incluído e a renovação custa cerca de {{renewal}} por ano.',
    processKicker: 'Como funciona',
    processTitle: 'Quatro etapas, todas on-line',
    steps: [
      { title: 'Conte sobre o seu negócio', body: 'Mande uma mensagem no WhatsApp. A consulta é gratuita.' },
      { title: 'Receba o orçamento', body: 'Pacote, recursos, preço e cronograma por escrito. Começamos após o sinal de 50%.' },
      { title: 'Confira a prévia', body: 'Abra no seu próprio celular e envie as revisões previstas no pacote.' },
      { title: 'Lançamento', body: 'Depois da sua aprovação, o site vai ao ar com {{guarantee}} dias de garantia de correção de erros. Após o pagamento final, domínio, código e acessos são seus.' },
    ],
    faqTitle: 'Perguntas frequentes',
    faq: [
      { q: 'Quanto custa um site?', a: 'Landing page a partir de {{from:landing-page}}, site institucional a partir de {{from:standar-umkm}}, loja virtual a partir de {{from:toko-online-simple}} e sistema de reservas a partir de {{from:sistem-reservasi}}, com o primeiro ano de domínio e hospedagem.' },
      { q: 'Quanto tempo leva?', a: 'Landing page {{duration:landing-page}}, site institucional {{duration:standar-umkm}} e loja virtual {{duration:toko-online-simple}}, a partir do conteúdo completo.' },
      { q: 'Vocês fazem app Android e iOS para negócios de Tulungagung?', a: 'Sim. Criamos apps Android e iOS a partir de um só código (React Native + Expo), a partir de {{from:aplikasi-mobile}} e com prazo de {{duration:aplikasi-mobile}}. Entregamos os arquivos do app e o código-fonte; a publicação na Play Store e na App Store é feita com as suas próprias contas de desenvolvedor.' },
      { q: 'Precisamos nos encontrar pessoalmente?', a: 'Não. Tudo é feito por WhatsApp e e-mail. Nosso horário: {{hours}}.' },
      { q: 'Como funciona o pagamento?', a: '{{payment}}' },
    ],
    ctaTitle: 'Comece com uma mensagem no WhatsApp',
    ctaLead: 'Conte sobre o seu negócio e responderemos com um pacote sugerido e uma estimativa. {{response}}.',
    readTitle: 'Leituras',
    articles: [],
  },

  ru: {
    title: 'Разработка сайтов в Тулунгагунге | PintuWeb',
    description:
      'Студия веб-разработки в Тулунгагунге (Восточная Ява): лендинги от {{from:landing-page}}, интернет-магазины и системы бронирования. Удалённо.',
    ogTitle: 'Разработка сайтов в Тулунгагунге',
    crumb: 'Сайты в Тулунгагунге',
    footerLink: 'Сайты в Тулунгагунге',
    eyebrow: '{{location}}',
    h1: ['Разработка сайтов в ', 'Тулунгагунге', ' — с понятными ценами с самого начала.'],
    answerLead: 'PintuWeb — студия дизайна и разработки сайтов из Тулунгагунга (Восточная Ява, Индонезия), создающая сайты с {{founded}} года.',
    answer:
      'Лендинг стоит от {{from:landing-page}} и делается за {{duration:landing-page}}; сайт компании — от {{from:standar-umkm}} ({{duration:standar-umkm}}). Всё удалённо: вы пишете нам в WhatsApp, получаете письменное предложение, а работа начинается после предоплаты 50%.',
    ctaWa: 'Здравствуйте, PintuWeb! Я прочитал страницу о разработке сайтов в Тулунгагунге и хочу обсудить сайт.',
    ctaPricing: 'Все цены',
    facts: {
      fromLabel: 'Цены от',
      baseLabel: 'Где мы',
      baseSub: 'Работаем удалённо',
      hoursLabel: 'Часы работы',
      sinceLabel: 'Делаем сайты с',
      sinceValue: '{{founded}}',
      sinceSub: 'Клиентских проектов: {{projects}}',
      startLabel: 'Как начать',
      startValue: 'Написать в WhatsApp',
    },
    sectorsKicker: 'По видам бизнеса',
    sectorsTitle: 'Сайты для бизнеса Тулунгагунга',
    sectorsLead: 'С чего мы советуем начать самым распространённым видам бизнеса в Тулунгагунге.',
    pkgLabel: 'Подходящий пакет:',
    demoLabel: (n) => `Пример каталога: ${n} (демо, вымышленная компания)`,
    sectors: {
      marmer: { name: 'Мастерские мрамора и оникса', body: 'Тулунгагунг называют городом мрамора: отрасль сосредоточена в Бесоле (округ Бесуки) и Чампурдарате, а плитка и раковины из мрамора и оникса экспортируются в США, Европу и Азию. Сайт-каталог показывает товар до запроса цены.' },
      kuliner: { name: 'Еда, кафе и варунги', body: 'От прилавков с наси лодхо до кофеен с традицией четхе — QR-меню держит цены актуальными и принимает заказы в WhatsApp.' },
      wisata: { name: 'Туризм и жильё', body: 'Статистическое ведомство (BPS) насчитывает в Тулунгагунге 25 туристических пляжей, в том числе Попох, Сине и Гемах. Гостевым домам и виллам нужна страница с прямым бронированием.' },
      fashion: { name: 'Пошив, батик и мода', body: 'Центр пошива белья в Собонторо и местный батик: онлайн-каталог с заказом через WhatsApp подходит и для розницы, и для опта.' },
      jasa: { name: 'Клиники, школы и услуги', body: 'Понятный профиль: услуги, часы работы, место на Google Картах и запись; система бронирования добавляется, когда расписание заполняется.' },
      acara: { name: 'Свадьбы и мероприятия', body: 'Цифровые приглашения на свадьбы и семейные праздники: рассылка в WhatsApp, карта, обратный отсчёт и подтверждение присутствия.' },
    },
    sourcesNote: 'Сведения об отраслях и достопримечательностях Тулунгагунга взяты из открытых источников, перечисленных в разделе',
    sourcesTitle: 'Местные источники',
    areaKicker: 'География',
    areaTitle: 'Находимся в Тулунгагунге, работаем с клиентами где угодно',
    areaLead: 'Вся работа идёт онлайн через WhatsApp и электронную почту, поэтому цены одинаковы, где бы вы ни находились.',
    rings: [
      { label: 'Тулунгагунг', short: 'Тулунгагунг', body: 'Здесь находится PintuWeb.' },
      { label: 'Соседние округа', short: 'Trenggalek · Kediri · Blitar', body: 'Те же пакеты и цены для Тренггалека, Кедири, Блитара и окрестностей.' },
      { label: 'Вся Индонезия', short: 'Вся Индонезия', body: 'Каждый этап — от предложения до запуска — проходит удалённо.' },
      { label: 'За пределами Индонезии', short: 'Весь мир', body: 'Общаемся на английском или малайском. Цены в индонезийских рупиях (IDR); оплата через QRIS, банковским переводом, через DANA, SeaBank или в USDT.' },
    ],
    demosTitle: 'Примеры, которые можно открыть сейчас',
    demosLead: 'Компании в демо вымышлены, но функции настоящие: каталоги, QR-меню, бронирование, запись на приём и приглашения.',
    allDemos: 'Все демо ({{demos}})',
    pricingKicker: 'Цены',
    pricingTitle: 'Пакеты для местного бизнеса',
    pricingLead: 'Цены и сроки — из того же списка пакетов, что и на странице цен.',
    seePricing: 'Сравнить все пакеты',
    colPrice: 'От',
    colTime: 'Срок',
    pricingNote: 'Срок считается с момента, когда материалы готовы. Предоплата 50%; первый год домена и хостинга включён, продление — около {{renewal}} в год.',
    processKicker: 'Как мы работаем',
    processTitle: 'Четыре шага, все онлайн',
    steps: [
      { title: 'Расскажите о бизнесе', body: 'Напишите нам в WhatsApp. Консультация бесплатна.' },
      { title: 'Получите предложение', body: 'Пакет, функции, цена и сроки письменно. Начинаем после предоплаты 50%.' },
      { title: 'Проверьте превью', body: 'Откройте его на своём телефоне и пришлите правки в рамках пакета.' },
      { title: 'Запуск', body: 'После вашего одобрения сайт запускается с гарантией исправления ошибок {{guarantee}} дней. После полной оплаты домен, код и доступы принадлежат вам.' },
    ],
    faqTitle: 'Частые вопросы',
    faq: [
      { q: 'Сколько стоит сайт?', a: 'Лендинг — от {{from:landing-page}}, сайт компании — от {{from:standar-umkm}}, интернет-магазин — от {{from:toko-online-simple}}, система бронирования — от {{from:sistem-reservasi}}; первый год домена и хостинга включён.' },
      { q: 'Сколько времени это занимает?', a: 'Лендинг — {{duration:landing-page}}, сайт компании — {{duration:standar-umkm}}, интернет-магазин — {{duration:toko-online-simple}} с момента готовности материалов.' },
      { q: 'Можно заказать приложение для Android и iOS для бизнеса в Тулунгагунге?', a: 'Да. Мы делаем приложения для Android и iOS из одного кода (React Native + Expo) — от {{from:aplikasi-mobile}}, срок {{duration:aplikasi-mobile}}. Мы передаём файлы приложения и исходный код; публикация в Play Store и App Store идёт через ваши собственные аккаунты разработчика.' },
      { q: 'Нужно ли встречаться лично?', a: 'Нет. Всё происходит через WhatsApp и электронную почту. Часы работы: {{hours}}.' },
      { q: 'Как проходит оплата?', a: '{{payment}}' },
    ],
    ctaTitle: 'Начните с одного сообщения в WhatsApp',
    ctaLead: 'Расскажите о своём бизнесе — мы ответим с подходящим пакетом и оценкой стоимости. {{response}}.',
    readTitle: 'Что почитать',
    articles: [],
  },

  zh: {
    title: '图隆阿贡（Tulungagung）网站设计与开发 | PintuWeb',
    description: '位于印尼东爪哇图隆阿贡的网站设计工作室：落地页 {{from:landing-page}} 起，另有网店与预订系统，远程为各地客户服务。',
    ogTitle: '图隆阿贡网站设计与开发',
    crumb: '图隆阿贡网站建设',
    footerLink: '图隆阿贡网站建设',
    eyebrow: '{{location}}',
    h1: ['', '图隆阿贡', '网站设计与开发，价格从一开始就清清楚楚。'],
    answerLead: 'PintuWeb 是一家位于印度尼西亚东爪哇省图隆阿贡（Tulungagung）的网站设计与开发工作室，自 {{founded}} 年起制作网站。',
    answer:
      '落地页 {{from:landing-page}} 起，制作周期 {{duration:landing-page}}；企业官网 {{from:standar-umkm}} 起（{{duration:standar-umkm}}）。全程远程：通过 WhatsApp 介绍您的业务，收到书面报价，支付 50% 定金后开工。',
    ctaWa: '您好 PintuWeb，我看了图隆阿贡网站建设的页面，想咨询一下网站。',
    ctaPricing: '查看全部价格',
    facts: {
      fromLabel: '价格起',
      baseLabel: '所在地',
      baseSub: '远程服务各地客户',
      hoursLabel: '工作时间',
      sinceLabel: '制作网站始于',
      sinceValue: '{{founded}}',
      sinceSub: '客户项目 {{projects}}',
      startLabel: '如何开始',
      startValue: 'WhatsApp 留言',
    },
    sectorsKicker: '按行业',
    sectorsTitle: '适合图隆阿贡各类商家的网站',
    sectorsLead: '针对图隆阿贡常见行业，我们建议的起点方案。',
    pkgLabel: '建议套餐：',
    demoLabel: (n) => `目录示例：${n}（演示，虚构商家）`,
    sectors: {
      marmer: { name: '大理石与缟玛瑙作坊', body: '图隆阿贡素有“大理石之城”之称：产业集中在贝索勒（Besole）村和詹普尔达拉特（Campurdarat），大理石与缟玛瑙地砖、洗手盆远销美国、欧洲和亚洲。目录网站让买家在询价前先看到产品。' },
      kuliner: { name: '餐饮、咖啡馆与小吃店', body: '从卖 nasi lodho 的小店到有“cethe”传统的咖啡摊，二维码菜单让价格随时更新，还能通过 WhatsApp 下单。' },
      wisata: { name: '旅游与住宿', body: '印尼统计局（BPS）记录图隆阿贡有 25 处海滩景点，如 Popoh、Sine 和 Gemah。民宿和别墅需要可直接预订的页面。' },
      fashion: { name: '服装加工、蜡染与时装', body: '索邦托罗（Sobontoro）村有内衣生产中心，当地也有蜡染；带 WhatsApp 下单的在线目录适合零售和批发。' },
      jasa: { name: '诊所、学校与服务业', body: '清晰的介绍页：服务项目、营业时间、谷歌地图位置与预约方式；日程变满时再加上预订系统。' },
      acara: { name: '婚礼与活动', body: '用于婚礼和家庭庆典的电子请柬，通过 WhatsApp 分享，附地图、倒计时和出席确认。' },
    },
    sourcesNote: '以上关于图隆阿贡产业与景点的信息来自公开资料，见',
    sourcesTitle: '本地资料来源',
    areaKicker: '服务范围',
    areaTitle: '立足图隆阿贡，服务各地客户',
    areaLead: '全程通过 WhatsApp 和电子邮件在线进行，无论您在哪里，套餐价格都一样。',
    rings: [
      { label: '图隆阿贡', short: '图隆阿贡', body: 'PintuWeb 的所在地。' },
      { label: '周边县', short: 'Trenggalek · Kediri · Blitar', body: '登格勒克（Trenggalek）、谏义里（Kediri）、勿里达（Blitar）等周边地区享有相同的套餐与价格。' },
      { label: '印度尼西亚全境', short: '印尼全境', body: '从报价到上线，每个环节都可远程完成。' },
      { label: '印尼以外', short: '海外', body: '可用英语或马来语沟通。价格以印尼盾（IDR）计；付款方式为 QRIS、银行转账、DANA、SeaBank 或 USDT。' },
    ],
    demosTitle: '现在就能打开的示例',
    demosLead: '演示中的商家均为虚构，但功能是真实的：商品目录、二维码菜单、订房、预约和请柬。',
    allDemos: '查看全部 {{demos}} 个演示',
    pricingKicker: '价格',
    pricingTitle: '适合本地商家的套餐',
    pricingLead: '价格与周期取自与价格页面相同的套餐列表。',
    seePricing: '比较所有套餐',
    colPrice: '起价',
    colTime: '周期',
    pricingNote: '周期自内容齐全时起算。50% 定金开工；首年域名与主机已包含，续费约每年 {{renewal}}。',
    processKicker: '合作流程',
    processTitle: '四个步骤，全部在线',
    steps: [
      { title: '介绍您的业务', body: '在 WhatsApp 上给我们留言，咨询免费。' },
      { title: '收到报价', body: '书面列明套餐、功能、价格与进度，支付 50% 定金后开工。' },
      { title: '查看预览', body: '用您自己的手机打开预览，并按套餐提出修改。' },
      { title: '上线', body: '经您确认后网站上线，并享有 {{guarantee}} 天的错误修复保障；付清尾款后，域名、代码与各项权限归您所有。' },
    ],
    faqTitle: '常见问题',
    faq: [
      { q: '做一个网站要多少钱？', a: '落地页 {{from:landing-page}} 起，企业官网 {{from:standar-umkm}} 起，网店 {{from:toko-online-simple}} 起，预订系统 {{from:sistem-reservasi}} 起，均含首年域名与主机。' },
      { q: '需要多长时间？', a: '落地页 {{duration:landing-page}}，企业官网 {{duration:standar-umkm}}，网店 {{duration:toko-online-simple}}，自内容齐全时起算。' },
      { q: '能为图隆阿贡的商家开发 Android 和 iOS 应用吗？', a: '可以。我们用一套代码（React Native + Expo）开发 Android 和 iOS 应用，{{from:aplikasi-mobile}} 起，工期 {{duration:aplikasi-mobile}}。我们交付应用文件和源代码；上架 Play Store 和 App Store 使用您自己的开发者账号。' },
      { q: '需要见面吗？', a: '不需要。全部通过 WhatsApp 和电子邮件完成。工作时间：{{hours}}。' },
      { q: '如何付款？', a: '{{payment}}' },
    ],
    ctaTitle: '从一条 WhatsApp 消息开始',
    ctaLead: '介绍您的业务，我们会回复建议套餐和费用估算。{{response}}。',
    readTitle: '延伸阅读',
    articles: [],
  },

  hi: {
    title: 'तुलुंगागुंग में वेबसाइट डिज़ाइन | PintuWeb',
    description:
      'पूर्वी जावा के तुलुंगागुंग में वेबसाइट डिज़ाइन स्टूडियो: लैंडिंग पेज {{from:landing-page}} से, ऑनलाइन स्टोर और बुकिंग सिस्टम। पूरा काम रिमोट।',
    ogTitle: 'तुलुंगागुंग में वेबसाइट डिज़ाइन और डेवलपमेंट',
    crumb: 'तुलुंगागुंग में वेबसाइट',
    footerLink: 'तुलुंगागुंग में वेबसाइट',
    eyebrow: '{{location}}',
    h1: ['', 'तुलुंगागुंग', ' में वेबसाइट डिज़ाइन, शुरू से साफ़ क़ीमतों के साथ।'],
    answerLead: 'PintuWeb इंडोनेशिया के पूर्वी जावा में तुलुंगागुंग (Tulungagung) स्थित वेबसाइट डिज़ाइन और डेवलपमेंट स्टूडियो है, जो {{founded}} से वेबसाइट बना रहा है।',
    answer:
      'लैंडिंग पेज {{from:landing-page}} से शुरू होते हैं और {{duration:landing-page}} में बनते हैं; कंपनी वेबसाइट {{from:standar-umkm}} से ({{duration:standar-umkm}})। पूरा काम रिमोट होता है: WhatsApp पर अपने व्यवसाय के बारे में बताइए, लिखित कोटेशन पाइए, और 50% अग्रिम के बाद काम शुरू होता है।',
    ctaWa: 'नमस्ते PintuWeb, मैंने तुलुंगागुंग में वेबसाइट डिज़ाइन वाला पेज पढ़ा है और वेबसाइट के बारे में बात करना चाहता हूँ।',
    ctaPricing: 'सभी क़ीमतें देखें',
    facts: {
      fromLabel: 'क़ीमत शुरू',
      baseLabel: 'स्थान',
      baseSub: 'रिमोट, कहीं से भी',
      hoursLabel: 'काम के घंटे',
      sinceLabel: 'वेबसाइट बना रहे हैं',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} क्लाइंट प्रोजेक्ट',
      startLabel: 'शुरुआत कैसे करें',
      startValue: 'WhatsApp संदेश',
    },
    sectorsKicker: 'व्यवसाय के प्रकार के अनुसार',
    sectorsTitle: 'तुलुंगागुंग के व्यवसायों के लिए वेबसाइट',
    sectorsLead: 'तुलुंगागुंग में आम व्यवसायों के लिए हमारी सुझाई गई शुरुआत।',
    pkgLabel: 'सुझाया गया पैकेज:',
    demoLabel: (n) => `कैटलॉग का उदाहरण: ${n} (डेमो, काल्पनिक व्यवसाय)`,
    sectors: {
      marmer: { name: 'संगमरमर और ओनिक्स कारीगर', body: 'तुलुंगागुंग को संगमरमर का शहर कहा जाता है: उद्योग बेसोले (बेसुकी) और चम्पुरदरात में केंद्रित है, और संगमरमर व ओनिक्स की टाइलें और वॉश-बेसिन अमेरिका, यूरोप और एशिया को निर्यात होते हैं। कैटलॉग वेबसाइट ख़रीदारों को दाम पूछने से पहले उत्पाद दिखाती है।' },
      kuliner: { name: 'खान-पान, कैफ़े और वारुंग', body: 'नासी लोधो की दुकानों से लेकर ‘चेथे’ परंपरा वाले कॉफ़ी अड्डों तक, QR मेन्यू क़ीमतें ताज़ा रखता है और WhatsApp पर ऑर्डर लेता है।' },
      wisata: { name: 'पर्यटन और ठहरने की जगहें', body: 'इंडोनेशिया के सांख्यिकी विभाग (BPS) के अनुसार तुलुंगागुंग में 25 पर्यटन समुद्र-तट हैं, जैसे पोपोह, सिने और गेमाह। होमस्टे और विला को सीधे बुकिंग वाला पेज चाहिए।' },
      fashion: { name: 'सिलाई, बाटिक और फ़ैशन', body: 'सोबोन्तोरो गाँव में अंतर्वस्त्र उत्पादन केंद्र और स्थानीय बाटिक: WhatsApp ऑर्डर वाला ऑनलाइन कैटलॉग खुदरा और थोक दोनों के लिए।' },
      jasa: { name: 'क्लिनिक, स्कूल और सेवाएँ', body: 'साफ़ प्रोफ़ाइल: सेवाएँ, समय, Google Maps पर स्थान और अपॉइंटमेंट; शेड्यूल भरने पर बुकिंग सिस्टम जोड़ें।' },
      acara: { name: 'शादियाँ और आयोजन', body: 'शादी और पारिवारिक समारोहों के लिए डिजिटल निमंत्रण, WhatsApp पर साझा, नक़्शा, उलटी गिनती और उपस्थिति पुष्टि के साथ।' },
    },
    sourcesNote: 'तुलुंगागुंग के उद्योगों और पर्यटन स्थलों की जानकारी सार्वजनिक स्रोतों से ली गई है, देखें',
    sourcesTitle: 'स्थानीय स्रोत',
    areaKicker: 'सेवा क्षेत्र',
    areaTitle: 'तुलुंगागुंग में स्थित, हर जगह के क्लाइंट के लिए',
    areaLead: 'पूरी प्रक्रिया WhatsApp और ईमेल पर ऑनलाइन चलती है, इसलिए आप कहीं भी हों, पैकेज की क़ीमत वही रहती है।',
    rings: [
      { label: 'तुलुंगागुंग', short: 'तुलुंगागुंग', body: 'जहाँ PintuWeb स्थित है।' },
      { label: 'पड़ोसी ज़िले', short: 'Trenggalek · Kediri · Blitar', body: 'त्रेंग्गालेक, केदिरी, ब्लिटार और आसपास के लिए वही पैकेज और क़ीमतें।' },
      { label: 'पूरा इंडोनेशिया', short: 'पूरा इंडोनेशिया', body: 'कोटेशन से लॉन्च तक हर चरण दूर से पूरा होता है।' },
      { label: 'इंडोनेशिया के बाहर', short: 'विदेश', body: 'अंग्रेज़ी या मलय में बातचीत। क़ीमतें इंडोनेशियाई रुपिया (IDR) में; भुगतान QRIS, बैंक ट्रांसफ़र, DANA, SeaBank या USDT से।' },
    ],
    demosTitle: 'उदाहरण जिन्हें आप अभी खोल सकते हैं',
    demosLead: 'इन डेमो के व्यवसाय काल्पनिक हैं, पर सुविधाएँ असली हैं: कैटलॉग, QR मेन्यू, कमरा बुकिंग, अपॉइंटमेंट और निमंत्रण।',
    allDemos: 'सभी {{demos}} डेमो देखें',
    pricingKicker: 'क़ीमतें',
    pricingTitle: 'स्थानीय व्यवसायों के लिए पैकेज',
    pricingLead: 'क़ीमतें और समय वही पैकेज सूची से हैं जो क़ीमतों वाले पेज पर है।',
    seePricing: 'सभी पैकेज की तुलना करें',
    colPrice: 'शुरू',
    colTime: 'समय',
    pricingNote: 'समय सामग्री पूरी होने के बाद से गिना जाता है। 50% अग्रिम; पहले साल का डोमेन और होस्टिंग शामिल, नवीनीकरण लगभग {{renewal}} प्रति वर्ष।',
    processKicker: 'काम का तरीक़ा',
    processTitle: 'चार चरण, सब ऑनलाइन',
    steps: [
      { title: 'अपने व्यवसाय के बारे में बताइए', body: 'WhatsApp पर संदेश भेजिए। सलाह मुफ़्त है।' },
      { title: 'कोटेशन पाइए', body: 'पैकेज, सुविधाएँ, क़ीमत और समय-सारिणी लिखित में। 50% अग्रिम के बाद काम शुरू।' },
      { title: 'प्रीव्यू देखिए', body: 'अपने फ़ोन पर खोलिए और पैकेज के अनुसार बदलाव भेजिए।' },
      { title: 'लॉन्च', body: 'आपकी मंज़ूरी के बाद वेबसाइट {{guarantee}} दिनों की बग-फ़िक्स गारंटी के साथ लाइव होती है। पूरा भुगतान होने पर डोमेन, कोड और एक्सेस आपके होते हैं।' },
    ],
    faqTitle: 'अक्सर पूछे जाने वाले सवाल',
    faq: [
      { q: 'वेबसाइट की क़ीमत कितनी है?', a: 'लैंडिंग पेज {{from:landing-page}} से, कंपनी वेबसाइट {{from:standar-umkm}} से, ऑनलाइन स्टोर {{from:toko-online-simple}} से और बुकिंग सिस्टम {{from:sistem-reservasi}} से, पहले साल के डोमेन और होस्टिंग सहित।' },
      { q: 'कितना समय लगता है?', a: 'लैंडिंग पेज {{duration:landing-page}}, कंपनी वेबसाइट {{duration:standar-umkm}}, ऑनलाइन स्टोर {{duration:toko-online-simple}}, सामग्री पूरी होने के बाद से।' },
      { q: 'क्या तुलुंगागुंग के व्यवसाय के लिए Android और iOS ऐप बन सकता है?', a: 'हाँ। हम एक ही कोड (React Native + Expo) से Android और iOS ऐप बनाते हैं, {{from:aplikasi-mobile}} से, {{duration:aplikasi-mobile}} में। हम ऐप की फ़ाइलें और सोर्स कोड सौंपते हैं; Play Store और App Store पर प्रकाशन आपके अपने डेवलपर खातों से होता है।' },
      { q: 'क्या आमने-सामने मिलना ज़रूरी है?', a: 'नहीं। सब कुछ WhatsApp और ईमेल पर होता है। काम के घंटे: {{hours}}।' },
      { q: 'भुगतान कैसे होता है?', a: '{{payment}}' },
    ],
    ctaTitle: 'एक WhatsApp संदेश से शुरू करें',
    ctaLead: 'अपने व्यवसाय के बारे में बताइए; हम सुझाए गए पैकेज और अनुमानित लागत के साथ जवाब देंगे। {{response}}।',
    readTitle: 'आगे पढ़ें',
    articles: [],
  },

  bn: {
    title: 'তুলুংগাগুংয়ে ওয়েবসাইট ডিজাইন | PintuWeb',
    description:
      'পূর্ব জাভার তুলুংগাগুংয়ে ওয়েবসাইট ডিজাইন স্টুডিও: ল্যান্ডিং পেজ {{from:landing-page}} থেকে, অনলাইন স্টোর ও বুকিং সিস্টেম। সম্পূর্ণ রিমোট কাজ।',
    ogTitle: 'তুলুংগাগুংয়ে ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট',
    crumb: 'তুলুংগাগুংয়ে ওয়েবসাইট',
    footerLink: 'তুলুংগাগুংয়ে ওয়েবসাইট',
    eyebrow: '{{location}}',
    h1: ['', 'তুলুংগাগুংয়ে', ' ওয়েবসাইট ডিজাইন, শুরু থেকেই স্পষ্ট দামে।'],
    answerLead: 'PintuWeb ইন্দোনেশিয়ার পূর্ব জাভার তুলুংগাগুং (Tulungagung)-ভিত্তিক একটি ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট স্টুডিও, যা {{founded}} সাল থেকে ওয়েবসাইট তৈরি করছে।',
    answer:
      'ল্যান্ডিং পেজ {{from:landing-page}} থেকে শুরু, সময় লাগে {{duration:landing-page}}; কোম্পানি ওয়েবসাইট {{from:standar-umkm}} থেকে ({{duration:standar-umkm}})। সব কাজ রিমোটে হয়: WhatsApp-এ আপনার ব্যবসার কথা বলুন, লিখিত কোটেশন নিন, আর ৫০% অগ্রিমের পর কাজ শুরু হয়।',
    ctaWa: 'হ্যালো PintuWeb, আমি তুলুংগাগুংয়ে ওয়েবসাইট ডিজাইনের পেজটি পড়েছি এবং একটি ওয়েবসাইট নিয়ে কথা বলতে চাই।',
    ctaPricing: 'সব দাম দেখুন',
    facts: {
      fromLabel: 'দাম শুরু',
      baseLabel: 'অবস্থান',
      baseSub: 'রিমোটে, যেকোনো জায়গা থেকে',
      hoursLabel: 'কাজের সময়',
      sinceLabel: 'ওয়েবসাইট তৈরি করছি',
      sinceValue: '{{founded}}',
      sinceSub: '{{projects}} ক্লায়েন্ট প্রজেক্ট',
      startLabel: 'কীভাবে শুরু করবেন',
      startValue: 'WhatsApp বার্তা',
    },
    sectorsKicker: 'ব্যবসার ধরন অনুযায়ী',
    sectorsTitle: 'তুলুংগাগুংয়ের ব্যবসার জন্য ওয়েবসাইট',
    sectorsLead: 'তুলুংগাগুংয়ের সাধারণ ব্যবসাগুলোর জন্য আমাদের প্রস্তাবিত শুরু।',
    pkgLabel: 'প্রস্তাবিত প্যাকেজ:',
    demoLabel: (n) => `ক্যাটালগের উদাহরণ: ${n} (ডেমো, কাল্পনিক ব্যবসা)`,
    sectors: {
      marmer: { name: 'মার্বেল ও অনিক্স কারিগর', body: 'তুলুংগাগুংকে মার্বেলের শহর বলা হয়: শিল্পটি বেসোলে (বেসুকি) ও চাম্পুরদারাতে কেন্দ্রীভূত, আর মার্বেল ও অনিক্সের টাইল ও বেসিন যুক্তরাষ্ট্র, ইউরোপ ও এশিয়ায় রপ্তানি হয়। ক্যাটালগ ওয়েবসাইট দাম জানতে চাওয়ার আগেই ক্রেতাকে পণ্য দেখায়।' },
      kuliner: { name: 'খাবার, ক্যাফে ও ওয়ারুং', body: 'নাসি লোধোর দোকান থেকে ‘চেথে’ ঐতিহ্যের কফির আড্ডা পর্যন্ত, QR মেনু দাম হালনাগাদ রাখে এবং WhatsApp-এ অর্ডার নেয়।' },
      wisata: { name: 'পর্যটন ও থাকার জায়গা', body: 'ইন্দোনেশিয়ার পরিসংখ্যান সংস্থা (BPS) তুলুংগাগুংয়ে ২৫টি পর্যটন সৈকত নথিভুক্ত করেছে, যেমন পোপোহ, সিনে ও গেমাহ। হোমস্টে ও ভিলার জন্য সরাসরি বুকিংয়ের পেজ দরকার।' },
      fashion: { name: 'পোশাক তৈরি, বাটিক ও ফ্যাশন', body: 'সোবোনতোরো গ্রামে অন্তর্বাস তৈরির কেন্দ্র ও স্থানীয় বাটিক: WhatsApp অর্ডারসহ অনলাইন ক্যাটালগ খুচরা ও পাইকারি দুটোর জন্যই।' },
      jasa: { name: 'ক্লিনিক, স্কুল ও সেবা', body: 'স্পষ্ট প্রোফাইল: সেবা, সময়, Google Maps-এ অবস্থান ও অ্যাপয়েন্টমেন্ট; সময়সূচি ভরে গেলে বুকিং সিস্টেম যোগ করুন।' },
      acara: { name: 'বিয়ে ও অনুষ্ঠান', body: 'বিয়ে ও পারিবারিক অনুষ্ঠানের ডিজিটাল আমন্ত্রণ, WhatsApp-এ শেয়ার, মানচিত্র, কাউন্টডাউন ও উপস্থিতি নিশ্চিতকরণসহ।' },
    },
    sourcesNote: 'তুলুংগাগুংয়ের শিল্প ও দর্শনীয় স্থানের তথ্য প্রকাশ্য উৎস থেকে নেওয়া, দেখুন',
    sourcesTitle: 'স্থানীয় উৎস',
    areaKicker: 'সেবা এলাকা',
    areaTitle: 'তুলুংগাগুংয়ে অবস্থিত, যেকোনো জায়গার ক্লায়েন্টের জন্য',
    areaLead: 'পুরো প্রক্রিয়া WhatsApp ও ইমেইলে অনলাইনে চলে, তাই আপনি যেখানেই থাকুন প্যাকেজের দাম একই।',
    rings: [
      { label: 'তুলুংগাগুং', short: 'তুলুংগাগুং', body: 'যেখানে PintuWeb অবস্থিত।' },
      { label: 'প্রতিবেশী জেলা', short: 'Trenggalek · Kediri · Blitar', body: 'ত্রেংগালেক, কেদিরি, ব্লিটার ও আশপাশের জন্য একই প্যাকেজ ও দাম।' },
      { label: 'সারা ইন্দোনেশিয়া', short: 'সারা ইন্দোনেশিয়া', body: 'কোটেশন থেকে লঞ্চ পর্যন্ত প্রতিটি ধাপ দূর থেকে সম্পন্ন হয়।' },
      { label: 'ইন্দোনেশিয়ার বাইরে', short: 'বিদেশ', body: 'ইংরেজি বা মালয় ভাষায় যোগাযোগ। দাম ইন্দোনেশিয়ান রুপিয়ায় (IDR); পেমেন্ট QRIS, ব্যাংক ট্রান্সফার, DANA, SeaBank বা USDT-তে।' },
    ],
    demosTitle: 'এখনই খুলে দেখার মতো উদাহরণ',
    demosLead: 'এই ডেমোর ব্যবসাগুলো কাল্পনিক, কিন্তু ফিচারগুলো আসল: ক্যাটালগ, QR মেনু, রুম বুকিং, অ্যাপয়েন্টমেন্ট ও আমন্ত্রণ।',
    allDemos: 'সব {{demos}}টি ডেমো দেখুন',
    pricingKicker: 'দাম',
    pricingTitle: 'স্থানীয় ব্যবসার জন্য প্যাকেজ',
    pricingLead: 'দাম ও সময় দাম পেজের একই প্যাকেজ তালিকা থেকে নেওয়া।',
    seePricing: 'সব প্যাকেজ তুলনা করুন',
    colPrice: 'শুরু',
    colTime: 'সময়',
    pricingNote: 'সময় গোনা হয় কনটেন্ট সম্পূর্ণ হওয়ার পর থেকে। ৫০% অগ্রিম; প্রথম বছরের ডোমেইন ও হোস্টিং অন্তর্ভুক্ত, নবায়ন প্রতি বছর প্রায় {{renewal}}।',
    processKicker: 'কাজের ধরন',
    processTitle: 'চারটি ধাপ, সবই অনলাইনে',
    steps: [
      { title: 'আপনার ব্যবসার কথা বলুন', body: 'WhatsApp-এ বার্তা পাঠান। পরামর্শ বিনামূল্যে।' },
      { title: 'কোটেশন নিন', body: 'প্যাকেজ, ফিচার, দাম ও সময়সূচি লিখিতভাবে। ৫০% অগ্রিমের পর কাজ শুরু।' },
      { title: 'প্রিভিউ দেখুন', body: 'নিজের ফোনে খুলুন এবং প্যাকেজ অনুযায়ী সংশোধন পাঠান।' },
      { title: 'লঞ্চ', body: 'আপনার অনুমোদনের পর ওয়েবসাইট {{guarantee}} দিনের বাগ-ফিক্স গ্যারান্টিসহ লাইভ হয়। পুরো পেমেন্টের পর ডোমেইন, কোড ও অ্যাক্সেস আপনার।' },
    ],
    faqTitle: 'সাধারণ প্রশ্ন',
    faq: [
      { q: 'একটি ওয়েবসাইটের দাম কত?', a: 'ল্যান্ডিং পেজ {{from:landing-page}} থেকে, কোম্পানি ওয়েবসাইট {{from:standar-umkm}} থেকে, অনলাইন স্টোর {{from:toko-online-simple}} থেকে এবং বুকিং সিস্টেম {{from:sistem-reservasi}} থেকে, প্রথম বছরের ডোমেইন ও হোস্টিংসহ।' },
      { q: 'কত সময় লাগে?', a: 'ল্যান্ডিং পেজ {{duration:landing-page}}, কোম্পানি ওয়েবসাইট {{duration:standar-umkm}}, অনলাইন স্টোর {{duration:toko-online-simple}}, কনটেন্ট সম্পূর্ণ হওয়ার পর থেকে।' },
      { q: 'তুলুংগাগুংয়ের ব্যবসার জন্য কি Android ও iOS অ্যাপ বানানো যায়?', a: 'হ্যাঁ। আমরা একটি কোড (React Native + Expo) থেকে Android ও iOS অ্যাপ বানাই, {{from:aplikasi-mobile}} থেকে, সময় {{duration:aplikasi-mobile}}। আমরা অ্যাপের ফাইল ও সোর্স কোড হস্তান্তর করি; Play Store ও App Store-এ প্রকাশ হয় আপনার নিজের ডেভেলপার অ্যাকাউন্ট দিয়ে।' },
      { q: 'সরাসরি দেখা করা কি জরুরি?', a: 'না। সব কিছু WhatsApp ও ইমেইলে হয়। কাজের সময়: {{hours}}।' },
      { q: 'পেমেন্ট কীভাবে হয়?', a: '{{payment}}' },
    ],
    ctaTitle: 'একটি WhatsApp বার্তা দিয়ে শুরু করুন',
    ctaLead: 'আপনার ব্যবসার কথা বলুন; আমরা প্রস্তাবিত প্যাকেজ ও আনুমানিক খরচসহ উত্তর দেব। {{response}}।',
    readTitle: 'আরও পড়ুন',
    articles: [],
  },

  ar: {
    title: 'تصميم مواقع الويب في تولونغاغونغ | PintuWeb',
    description:
      'استوديو تصميم مواقع في تولونغاغونغ بجاوة الشرقية: صفحات هبوط تبدأ من {{from:landing-page}}، ومتاجر إلكترونية وأنظمة حجز. عمل عن بُعد.',
    ogTitle: 'تصميم وتطوير مواقع الويب في تولونغاغونغ',
    crumb: 'مواقع الويب في تولونغاغونغ',
    footerLink: 'مواقع الويب في تولونغاغونغ',
    eyebrow: '{{location}}',
    h1: ['تصميم مواقع الويب في ', 'تولونغاغونغ', '، بأسعار واضحة منذ البداية.'],
    answerLead: 'PintuWeb استوديو لتصميم وتطوير مواقع الويب مقرّه تولونغاغونغ في جاوة الشرقية بإندونيسيا، ويصنع المواقع منذ عام {{founded}}.',
    answer:
      'تبدأ صفحات الهبوط من {{from:landing-page}} وتستغرق {{duration:landing-page}}؛ ومواقع الشركات من {{from:standar-umkm}} ({{duration:standar-umkm}}). يتم كل شيء عن بُعد: أخبرنا عن نشاطك عبر واتساب، واستلم عرض سعر مكتوبًا، ويبدأ العمل بعد دفعة مقدمة بنسبة 50٪.',
    ctaWa: 'مرحبًا PintuWeb، قرأت صفحة تصميم المواقع في تولونغاغونغ وأودّ التحدث عن موقع ويب.',
    ctaPricing: 'عرض جميع الأسعار',
    facts: {
      fromLabel: 'الأسعار تبدأ من',
      baseLabel: 'المقر',
      baseSub: 'نعمل عن بُعد من أي مكان',
      hoursLabel: 'ساعات العمل',
      sinceLabel: 'نصنع المواقع منذ',
      sinceValue: '{{founded}}',
      sinceSub: 'مشاريع العملاء: {{projects}}',
      startLabel: 'كيف تبدأ',
      startValue: 'رسالة واتساب',
    },
    sectorsKicker: 'حسب نوع النشاط',
    sectorsTitle: 'مواقع لأنشطة تولونغاغونغ التجارية',
    sectorsLead: 'نقاط البداية التي نقترحها لأكثر الأنشطة انتشارًا في تولونغاغونغ.',
    pkgLabel: 'الباقة المقترحة:',
    demoLabel: (n) => `مثال على كتالوج: ${n} (عرض تجريبي لنشاط خيالي)`,
    sectors: {
      marmer: { name: 'ورش الرخام والعقيق اليماني', body: 'تُلقّب تولونغاغونغ بمدينة الرخام: تتركز الصناعة في قرية بيسولي (بيسوكي) وفي تشامبوردارات، وتُصدَّر بلاطات وأحواض الرخام والعقيق إلى أمريكا وأوروبا وآسيا. موقع الكتالوج يعرض المنتجات على المشترين قبل طلب السعر.' },
      kuliner: { name: 'المطاعم والمقاهي والوارونغ', body: 'من أكشاك ناسي لودهو إلى مقاهي تقليد «تشيثي»، تُبقي قائمة QR الأسعار محدّثة وتستقبل الطلبات عبر واتساب.' },
      wisata: { name: 'السياحة وأماكن الإقامة', body: 'يسجّل جهاز الإحصاء الإندونيسي (BPS) 25 شاطئًا سياحيًا في تولونغاغونغ، منها بوبوه وسيني وغيماه. تحتاج بيوت الضيافة والفلل إلى صفحة للحجز المباشر.' },
      fashion: { name: 'الخياطة والباتيك والأزياء', body: 'مركز لصناعة الملابس الداخلية في قرية سوبونتورو وباتيك محلي: كتالوج إلكتروني مع الطلب عبر واتساب يناسب البيع بالتجزئة والجملة.' },
      jasa: { name: 'العيادات والمدارس والخدمات', body: 'صفحة تعريفية واضحة: الخدمات وساعات العمل والموقع على خرائط Google وحجز المواعيد، ثم نظام حجز حين يمتلئ الجدول.' },
      acara: { name: 'الأعراس والمناسبات', body: 'دعوات رقمية للأعراس والمناسبات العائلية، تُرسل عبر واتساب مع خريطة وعدّ تنازلي وتأكيد الحضور.' },
    },
    sourcesNote: 'المعلومات عن صناعات تولونغاغونغ ومعالمها مأخوذة من مصادر عامة مذكورة في قسم',
    sourcesTitle: 'المصادر المحلية',
    areaKicker: 'نطاق الخدمة',
    areaTitle: 'مقرّنا تولونغاغونغ، ونخدم العملاء في كل مكان',
    areaLead: 'تجري العملية كلها عبر الإنترنت من خلال واتساب والبريد الإلكتروني، لذا أسعار الباقات واحدة أينما كنت.',
    rings: [
      { label: 'تولونغاغونغ', short: 'تولونغاغونغ', body: 'حيث يقع مقر PintuWeb.' },
      { label: 'المحافظات المجاورة', short: 'Trenggalek · Kediri · Blitar', body: 'الباقات والأسعار نفسها لترينغاليك وكيديري وبليتار وما حولها.' },
      { label: 'إندونيسيا كلها', short: 'إندونيسيا كلها', body: 'كل خطوة، من عرض السعر حتى الإطلاق، تتم عن بُعد.' },
      { label: 'خارج إندونيسيا', short: 'دوليًا', body: 'نتواصل بالإنجليزية أو الملايوية. الأسعار بالروبية الإندونيسية (IDR)، والدفع عبر QRIS أو التحويل البنكي أو DANA أو SeaBank أو USDT.' },
    ],
    demosTitle: 'أمثلة يمكنك فتحها الآن',
    demosLead: 'الأنشطة في هذه العروض خيالية، لكن الميزات حقيقية: كتالوجات وقوائم QR وحجز غرف ومواعيد ودعوات.',
    allDemos: 'عرض كل العروض ({{demos}})',
    pricingKicker: 'الأسعار',
    pricingTitle: 'باقات للأنشطة المحلية',
    pricingLead: 'الأسعار والمدد مأخوذة من قائمة الباقات نفسها في صفحة الأسعار.',
    seePricing: 'قارن جميع الباقات',
    colPrice: 'يبدأ من',
    colTime: 'المدة',
    pricingNote: 'تُحسب المدة بعد اكتمال المحتوى. دفعة مقدمة 50٪؛ السنة الأولى من النطاق والاستضافة مشمولة، والتجديد نحو {{renewal}} سنويًا.',
    processKicker: 'طريقة العمل',
    processTitle: 'أربع خطوات، كلها عبر الإنترنت',
    steps: [
      { title: 'أخبرنا عن نشاطك', body: 'أرسل رسالة واتساب. الاستشارة مجانية.' },
      { title: 'استلم عرض السعر', body: 'الباقة والميزات والسعر والجدول مكتوبة. يبدأ العمل بعد دفعة 50٪.' },
      { title: 'راجع المعاينة', body: 'افتحها على هاتفك وأرسل التعديلات المشمولة في باقتك.' },
      { title: 'الإطلاق', body: 'بعد موافقتك يُطلق الموقع مع ضمان إصلاح الأخطاء لمدة {{guarantee}} يومًا، وبعد الدفعة الأخيرة يصبح النطاق والشيفرة وصلاحيات الوصول ملكًا لك.' },
    ],
    faqTitle: 'أسئلة شائعة',
    faq: [
      { q: 'كم تكلفة الموقع؟', a: 'صفحة الهبوط من {{from:landing-page}}، وموقع الشركة من {{from:standar-umkm}}، والمتجر الإلكتروني من {{from:toko-online-simple}}، ونظام الحجز من {{from:sistem-reservasi}}، مع السنة الأولى من النطاق والاستضافة.' },
      { q: 'كم يستغرق العمل؟', a: 'صفحة الهبوط {{duration:landing-page}}، وموقع الشركة {{duration:standar-umkm}}، والمتجر الإلكتروني {{duration:toko-online-simple}}، بعد اكتمال المحتوى.' },
      { q: 'هل يمكنكم بناء تطبيق Android وiOS لنشاط تجاري في تولونغاغونغ؟', a: 'نعم. نبني تطبيقات Android وiOS من شيفرة واحدة (React Native + Expo)، ابتداءً من {{from:aplikasi-mobile}} وبمدة تنفيذ {{duration:aplikasi-mobile}}. نسلّمك ملفات التطبيق والشيفرة المصدرية، ويتم النشر على Play Store وApp Store بحسابات المطوّر الخاصة بك.' },
      { q: 'هل يلزم اللقاء وجهًا لوجه؟', a: 'لا. يتم كل شيء عبر واتساب والبريد الإلكتروني. ساعات العمل: {{hours}}.' },
      { q: 'كيف يتم الدفع؟', a: '{{payment}}' },
    ],
    ctaTitle: 'ابدأ برسالة واتساب واحدة',
    ctaLead: 'أخبرنا عن نشاطك، وسنرد باقتراح باقة وتقدير للتكلفة. {{response}}.',
    readTitle: 'قراءات',
    articles: [],
  },
}

/** Mengisi penanda fakta. Tahun & jumlah proyek dibungkus isolasi LTR di bahasa kanan-ke-kiri (lihat iso() di facts.ts). */
function fill(lang: Lang, s: string): string {
  if (!s.includes('{{')) return s
  const f = facts(lang)
  const iso = (x: string) => (LANG_INFO[lang].dir === 'rtl' ? `⁦${x}⁩` : x)
  return fillFacts(
    lang,
    s
      .replace(/\{\{city\}\}/g, CITY)
      .replace(/\{\{location\}\}/g, f.location)
      .replace(/\{\{founded\}\}/g, iso(String(FOUNDED_YEAR)))
      .replace(/\{\{projects\}\}/g, iso(CLIENT_PROJECTS))
      .replace(/\{\{hours\}\}/g, f.hours)
      .replace(/\{\{response\}\}/g, f.response)
      .replace(/\{\{payment\}\}/g, f.payment),
  )
}

function deepFill<T>(lang: Lang, v: T): T {
  if (typeof v === 'string') return fill(lang, v) as T
  if (Array.isArray(v)) return v.map((x) => deepFill(lang, x)) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deepFill(lang, x)])) as T
  return v
}

const cache = new Map<Lang, LocalText>()

/** Teks halaman lokal dengan semua penanda sudah terisi. */
export function localText(lang: Lang): LocalText {
  if (!cache.has(lang)) cache.set(lang, deepFill(lang, TEXT[lang]))
  return cache.get(lang)!
}
