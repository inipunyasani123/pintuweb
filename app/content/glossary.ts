// Kamus istilah website (3 bahasa). Definisi dibuka dengan kalimat "X adalah …" supaya mudah dikutip.
import type { BaseLang } from '../i18n/config'
import type { DocRef } from '../i18n/routes'

/** Topik istilah: dasar website, jenis website, SEO & kecepatan, bisnis & pemasaran. */
export const TERM_TOPICS = ['dasar', 'jenis', 'seo', 'bisnis'] as const
export type TermTopic = (typeof TERM_TOPICS)[number]

export type Term = { id: string; topic: TermTopic; term: Record<BaseLang, string>; def: Record<BaseLang, string>; see?: DocRef }

export const TERMS: Term[] = [
  {
    id: 'domain',
    topic: 'dasar',
    term: { id: 'Domain', en: 'Domain', ms: 'Domain' },
    def: {
      id: 'Domain adalah alamat website yang diketik orang di browser, misalnya pintuweb.id. Domain disewa per tahun dari registrar dan harus diperpanjang agar tidak hilang.',
      en: 'A domain is the website address people type into a browser, such as pintuweb.id. Domains are rented yearly from a registrar and must be renewed so you do not lose them.',
      ms: 'Domain ialah alamat laman web yang ditaip orang dalam pelayar, contohnya pintuweb.id. Domain disewa setiap tahun daripada pendaftar dan perlu diperbaharui supaya tidak hilang.',
    },
    see: { key: 'articles', article: 'domain-hosting' },
  },
  {
    id: 'hosting',
    topic: 'dasar',
    term: { id: 'Hosting', en: 'Hosting', ms: 'Hosting' },
    def: {
      id: 'Hosting adalah layanan server yang menyimpan file website dan menayangkannya ke pengunjung 24 jam. Domain adalah alamatnya, hosting adalah “rumah” tempat isinya disimpan.',
      en: 'Hosting is the server service that stores your website files and serves them to visitors around the clock. The domain is the address; hosting is the “house” where the content lives.',
      ms: 'Hosting ialah perkhidmatan pelayan yang menyimpan fail laman web dan memaparkannya kepada pelawat 24 jam. Domain ialah alamatnya, hosting ialah “rumah” tempat kandungan disimpan.',
    },
    see: { key: 'articles', article: 'domain-hosting' },
  },
  {
    id: 'ssl',
    topic: 'dasar',
    term: { id: 'SSL / HTTPS', en: 'SSL / HTTPS', ms: 'SSL / HTTPS' },
    def: {
      id: 'SSL adalah sertifikat yang mengenkripsi data antara browser dan website, ditandai alamat berawalan https://. Tanpa SSL, browser menandai website sebagai “tidak aman”.',
      en: 'SSL is a certificate that encrypts data between the browser and the website, shown by an address starting with https://. Without it, browsers label the site “not secure”.',
      ms: 'SSL ialah sijil yang menyulitkan data antara pelayar dan laman web, ditandakan dengan alamat bermula https://. Tanpa SSL, pelayar menandakan laman itu sebagai “tidak selamat”.',
    },
  },
  {
    id: 'dns',
    topic: 'dasar',
    term: { id: 'DNS', en: 'DNS', ms: 'DNS' },
    def: {
      id: 'DNS (Domain Name System) adalah sistem yang menerjemahkan nama domain menjadi alamat server. Pengaturan DNS menentukan ke hosting mana sebuah domain mengarah.',
      en: 'DNS (Domain Name System) is the system that translates a domain name into a server address. DNS settings decide which hosting a domain points to.',
      ms: 'DNS (Domain Name System) ialah sistem yang menukar nama domain kepada alamat pelayan. Tetapan DNS menentukan hosting mana yang dituju oleh sesuatu domain.',
    },
  },
  {
    id: 'cdn',
    topic: 'dasar',
    term: { id: 'CDN', en: 'CDN', ms: 'CDN' },
    def: {
      id: 'CDN (Content Delivery Network) adalah jaringan server di banyak lokasi yang menyimpan salinan website, sehingga halaman dikirim dari server terdekat dengan pengunjung dan terbuka lebih cepat.',
      en: 'A CDN (Content Delivery Network) is a network of servers in many locations that keeps copies of your website, so pages are served from the server nearest the visitor and load faster.',
      ms: 'CDN (Content Delivery Network) ialah rangkaian pelayan di banyak lokasi yang menyimpan salinan laman web, supaya halaman dihantar dari pelayan terdekat dengan pelawat dan dimuat lebih pantas.',
    },
  },
  {
    id: 'cms',
    topic: 'dasar',
    term: { id: 'CMS', en: 'CMS', ms: 'CMS' },
    def: {
      id: 'CMS (Content Management System) adalah panel admin untuk mengubah isi website — teks, gambar, produk, atau artikel — tanpa menyentuh kode.',
      en: 'A CMS (Content Management System) is an admin panel for changing website content — text, images, products or articles — without touching code.',
      ms: 'CMS (Content Management System) ialah panel admin untuk mengubah kandungan laman web — teks, imej, produk atau artikel — tanpa menyentuh kod.',
    },
  },
  {
    id: 'landing-page',
    topic: 'jenis',
    term: { id: 'Landing page', en: 'Landing page', ms: 'Landing page' },
    def: {
      id: 'Landing page adalah satu halaman web dengan satu tujuan, misalnya pembelian atau pendaftaran, dan biasanya menjadi tujuan iklan.',
      en: 'A landing page is a single web page with one goal, such as a purchase or a sign-up, and is usually the destination of an ad.',
      ms: 'Landing page ialah satu halaman web dengan satu tujuan, seperti pembelian atau pendaftaran, dan biasanya menjadi destinasi iklan.',
    },
    see: { key: 'services', service: 'landing-page' },
  },
  {
    id: 'company-profile',
    topic: 'jenis',
    term: { id: 'Company profile', en: 'Company profile website', ms: 'Laman web profil syarikat' },
    def: {
      id: 'Website company profile adalah website beberapa halaman yang memperkenalkan usaha: profil, layanan atau produk, lokasi, dan kontak.',
      en: 'A company profile website is a multi-page website that introduces a business: who it is, its services or products, location and contact details.',
      ms: 'Laman web profil syarikat ialah laman web beberapa halaman yang memperkenalkan perniagaan: profil, perkhidmatan atau produk, lokasi dan maklumat hubungan.',
    },
    see: { key: 'services', service: 'company-profile' },
  },
  {
    id: 'responsive',
    topic: 'dasar',
    term: { id: 'Responsif (mobile-friendly)', en: 'Responsive (mobile-friendly)', ms: 'Responsif (mesra mudah alih)' },
    def: {
      id: 'Website responsif adalah website yang tata letaknya menyesuaikan ukuran layar, sehingga tetap nyaman dibaca di ponsel, tablet, maupun desktop.',
      en: 'A responsive website adapts its layout to the screen size, so it stays comfortable to read on phones, tablets and desktops.',
      ms: 'Laman web responsif ialah laman web yang susun aturnya menyesuaikan saiz skrin, jadi tetap selesa dibaca di telefon, tablet atau desktop.',
    },
  },
  {
    id: 'seo',
    topic: 'seo',
    term: { id: 'SEO', en: 'SEO', ms: 'SEO' },
    def: {
      id: 'SEO (Search Engine Optimization) adalah upaya membuat website mudah dipahami dan dipercaya mesin pencari, agar muncul di hasil pencarian untuk kata kunci yang relevan.',
      en: 'SEO (Search Engine Optimisation) is the work of making a website easy for search engines to understand and trust, so it appears in results for relevant keywords.',
      ms: 'SEO (Search Engine Optimisation) ialah usaha menjadikan laman web mudah difahami dan dipercayai enjin carian, supaya muncul dalam hasil carian untuk kata kunci yang relevan.',
    },
    see: { key: 'articles', article: 'seo-checklist' },
  },
  {
    id: 'meta-description',
    topic: 'seo',
    term: { id: 'Meta description', en: 'Meta description', ms: 'Meta description' },
    def: {
      id: 'Meta description adalah ringkasan singkat sebuah halaman yang ditulis di kode dan sering ditampilkan Google di bawah judul hasil pencarian.',
      en: 'A meta description is a short summary of a page written in its code, often shown by Google under the title in search results.',
      ms: 'Meta description ialah ringkasan pendek sesuatu halaman yang ditulis dalam kod dan sering dipaparkan Google di bawah tajuk hasil carian.',
    },
  },
  {
    id: 'sitemap',
    topic: 'seo',
    term: { id: 'Sitemap', en: 'Sitemap', ms: 'Peta laman (sitemap)' },
    def: {
      id: 'Sitemap adalah file berisi daftar halaman website yang membantu mesin pencari menemukan semua halaman, termasuk halaman baru.',
      en: 'A sitemap is a file listing a website’s pages that helps search engines find every page, including new ones.',
      ms: 'Peta laman (sitemap) ialah fail yang menyenaraikan halaman laman web untuk membantu enjin carian menemui semua halaman, termasuk halaman baharu.',
    },
  },
  {
    id: 'structured-data',
    topic: 'seo',
    term: { id: 'Structured data (schema)', en: 'Structured data (schema)', ms: 'Data berstruktur (schema)' },
    def: {
      id: 'Structured data adalah keterangan tambahan dalam kode halaman (biasanya format JSON-LD dari schema.org) yang menjelaskan isi halaman kepada mesin pencari, misalnya harga, FAQ, atau artikel.',
      en: 'Structured data is extra markup in a page’s code (usually JSON-LD from schema.org) that explains the content to search engines, such as prices, FAQs or articles.',
      ms: 'Data berstruktur ialah penerangan tambahan dalam kod halaman (biasanya JSON-LD daripada schema.org) yang menjelaskan kandungan kepada enjin carian, seperti harga, soalan lazim atau artikel.',
    },
  },
  {
    id: 'core-web-vitals',
    topic: 'seo',
    term: { id: 'Core Web Vitals', en: 'Core Web Vitals', ms: 'Core Web Vitals' },
    def: {
      id: 'Core Web Vitals adalah tiga ukuran pengalaman halaman dari Google: LCP (kecepatan konten utama tampil, baik ≤ 2,5 detik), INP (respons terhadap interaksi, baik ≤ 200 ms), dan CLS (stabilitas tata letak, baik ≤ 0,1).',
      en: 'Core Web Vitals are Google’s three page-experience metrics: LCP (how fast the main content appears, good at ≤ 2.5 s), INP (responsiveness to input, good at ≤ 200 ms) and CLS (layout stability, good at ≤ 0.1).',
      ms: 'Core Web Vitals ialah tiga ukuran pengalaman halaman daripada Google: LCP (kelajuan kandungan utama dipaparkan, baik ≤ 2.5 saat), INP (tindak balas terhadap interaksi, baik ≤ 200 ms) dan CLS (kestabilan susun atur, baik ≤ 0.1).',
    },
    see: { key: 'articles', article: 'seo-checklist' },
  },
  {
    id: 'pagespeed',
    topic: 'seo',
    term: { id: 'PageSpeed', en: 'PageSpeed', ms: 'PageSpeed' },
    def: {
      id: 'PageSpeed Insights adalah alat gratis dari Google yang memberi skor 0–100 untuk kecepatan dan kualitas teknis sebuah halaman, beserta saran perbaikannya.',
      en: 'PageSpeed Insights is a free Google tool that scores a page from 0 to 100 for speed and technical quality, with suggestions for improvement.',
      ms: 'PageSpeed Insights ialah alat percuma Google yang memberi skor 0–100 untuk kelajuan dan kualiti teknikal sesuatu halaman, beserta cadangan penambahbaikan.',
    },
  },
  {
    id: 'search-console',
    topic: 'seo',
    term: { id: 'Google Search Console', en: 'Google Search Console', ms: 'Google Search Console' },
    def: {
      id: 'Google Search Console adalah layanan gratis dari Google untuk memantau bagaimana website tampil di pencarian: halaman yang terindeks, kata kunci, klik, dan masalah teknis.',
      en: 'Google Search Console is a free Google service for monitoring how your website appears in search: indexed pages, queries, clicks and technical issues.',
      ms: 'Google Search Console ialah perkhidmatan percuma Google untuk memantau bagaimana laman web dipaparkan dalam carian: halaman yang diindeks, kata kunci, klik dan isu teknikal.',
    },
  },
  {
    id: 'google-business-profile',
    topic: 'seo',
    term: { id: 'Google Business Profile', en: 'Google Business Profile', ms: 'Google Business Profile' },
    def: {
      id: 'Google Business Profile adalah profil usaha gratis yang tampil di Google Maps dan pencarian lokal, berisi alamat, jam buka, foto, dan ulasan.',
      en: 'Google Business Profile is a free business listing that appears on Google Maps and in local search, with your address, opening hours, photos and reviews.',
      ms: 'Google Business Profile ialah profil perniagaan percuma yang dipaparkan di Google Maps dan carian setempat, mengandungi alamat, waktu operasi, foto dan ulasan.',
    },
  },
  {
    id: 'cta',
    topic: 'bisnis',
    term: { id: 'Call to action (CTA)', en: 'Call to action (CTA)', ms: 'Seruan tindakan (CTA)' },
    def: {
      id: 'Call to action adalah tombol atau ajakan yang meminta pengunjung melakukan satu langkah berikutnya, misalnya “Chat WhatsApp” atau “Daftar sekarang”.',
      en: 'A call to action is a button or prompt asking visitors to take one next step, such as “Chat on WhatsApp” or “Register now”.',
      ms: 'Seruan tindakan ialah butang atau ajakan yang meminta pelawat mengambil satu langkah seterusnya, contohnya “Sembang di WhatsApp” atau “Daftar sekarang”.',
    },
  },
  {
    id: 'conversion',
    topic: 'bisnis',
    term: { id: 'Konversi', en: 'Conversion', ms: 'Penukaran (conversion)' },
    def: {
      id: 'Konversi adalah saat pengunjung melakukan tindakan yang Anda harapkan — membeli, mendaftar, atau menghubungi. Tingkat konversi adalah persentase pengunjung yang melakukannya.',
      en: 'A conversion is when a visitor takes the action you want — buying, signing up or getting in touch. The conversion rate is the percentage of visitors who do it.',
      ms: 'Penukaran ialah apabila pelawat melakukan tindakan yang anda harapkan — membeli, mendaftar atau menghubungi. Kadar penukaran ialah peratusan pelawat yang melakukannya.',
    },
  },
  {
    id: 'payment-gateway',
    topic: 'bisnis',
    term: { id: 'Payment gateway', en: 'Payment gateway', ms: 'Gerbang pembayaran' },
    def: {
      id: 'Payment gateway adalah layanan yang memproses pembayaran online di website — transfer bank, e-wallet, QRIS, atau kartu — dan memberi tahu toko saat pembayaran berhasil.',
      en: 'A payment gateway is a service that processes online payments on a website — bank transfers, e-wallets, QR codes or cards — and tells the shop when a payment succeeds.',
      ms: 'Gerbang pembayaran ialah perkhidmatan yang memproses pembayaran dalam talian di laman web — pindahan bank, e-dompet, kod QR atau kad — dan memaklumkan kedai apabila pembayaran berjaya.',
    },
    see: { key: 'services', service: 'toko-online' },
  },
  {
    id: 'link-in-bio',
    topic: 'jenis',
    term: { id: 'Link in bio', en: 'Link in bio', ms: 'Link in bio' },
    def: {
      id: 'Link in bio adalah satu halaman yang ditautkan dari bio media sosial dan berisi semua tujuan penting: WhatsApp, toko, jadwal, atau karya.',
      en: 'Link in bio is a single page linked from a social media bio that collects every important destination: WhatsApp, shop, schedule or work.',
      ms: 'Link in bio ialah satu halaman yang dipautkan dari bio media sosial dan mengumpulkan semua destinasi penting: WhatsApp, kedai, jadual atau karya.',
    },
    see: { key: 'services', service: 'link-in-bio' },
  },
  {
    id: 'undangan-digital',
    topic: 'jenis',
    term: { id: 'Undangan digital', en: 'Digital invitation', ms: 'Kad jemputan digital' },
    def: {
      id: 'Undangan digital adalah undangan acara berbentuk halaman web yang dibagikan lewat tautan, biasanya dilengkapi peta lokasi, hitung mundur, dan konfirmasi kehadiran (RSVP).',
      en: 'A digital invitation is an event invitation in the form of a web page shared as a link, usually with a location map, a countdown and attendance confirmation (RSVP).',
      ms: 'Kad jemputan digital ialah jemputan majlis berbentuk halaman web yang dikongsi melalui pautan, biasanya dengan peta lokasi, kiraan detik dan pengesahan kehadiran (RSVP).',
    },
    see: { key: 'services', service: 'undangan-digital' },
  },
  {
    id: 'redirect',
    topic: 'seo',
    term: { id: 'Redirect 301/308', en: '301/308 redirect', ms: 'Pengalihan 301/308' },
    def: {
      id: 'Redirect permanen (301 atau 308) adalah pengalihan dari alamat lama ke alamat baru yang memberi tahu mesin pencari bahwa halaman sudah pindah, sehingga peringkatnya ikut berpindah.',
      en: 'A permanent redirect (301 or 308) sends visitors from an old address to a new one and tells search engines the page has moved, so its rankings move with it.',
      ms: 'Pengalihan kekal (301 atau 308) membawa pelawat dari alamat lama ke alamat baharu dan memberitahu enjin carian bahawa halaman telah berpindah, supaya kedudukannya turut berpindah.',
    },
  },
  {
    id: 'hreflang',
    topic: 'seo',
    term: { id: 'Hreflang', en: 'Hreflang', ms: 'Hreflang' },
    def: {
      id: 'Hreflang adalah penanda di kode halaman yang memberi tahu mesin pencari versi bahasa lain dari halaman yang sama, supaya pengunjung diarahkan ke bahasa yang tepat.',
      en: 'Hreflang is a tag in a page’s code that tells search engines about other language versions of the same page, so visitors are shown the right language.',
      ms: 'Hreflang ialah penanda dalam kod halaman yang memberitahu enjin carian tentang versi bahasa lain bagi halaman yang sama, supaya pelawat ditunjukkan bahasa yang betul.',
    },
  },
  {
    id: 'analytics',
    topic: 'bisnis',
    term: { id: 'Analytics', en: 'Analytics', ms: 'Analitik' },
    def: {
      id: 'Analytics adalah alat yang mencatat statistik kunjungan — jumlah pengunjung, halaman yang dibuka, dan asal kunjungan — untuk menilai apa yang berhasil di website.',
      en: 'Analytics tools record visit statistics — number of visitors, pages viewed and traffic sources — so you can see what works on your website.',
      ms: 'Analitik ialah alat yang merekod statistik lawatan — bilangan pelawat, halaman yang dibuka dan sumber trafik — untuk menilai apa yang berkesan di laman web.',
    },
  },
  {
    id: 'maintenance',
    topic: 'dasar',
    term: { id: 'Maintenance', en: 'Maintenance', ms: 'Penyelenggaraan' },
    def: {
      id: 'Maintenance website adalah perawatan rutin setelah website online: memperbarui konten kecil, menambal keamanan, memperbarui dependensi, dan memperbaiki masalah teknis.',
      en: 'Website maintenance is the routine care after launch: small content updates, security patches, dependency updates and fixing technical issues.',
      ms: 'Penyelenggaraan laman web ialah penjagaan rutin selepas pelancaran: kemas kini kandungan kecil, tampalan keselamatan, kemas kini kebergantungan dan pembaikan isu teknikal.',
    },
  },
]
