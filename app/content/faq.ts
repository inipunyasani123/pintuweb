// Satu-satunya sumber FAQ (3 bahasa): bagian FAQ di beranda, halaman FAQ, dan JSON-LD FAQPage.
// Semua angka dirakit dari lib/packages.ts & lib/site.ts lewat i18n/facts.ts supaya tidak pernah bertentangan.
import { CITY, CLIENT_PROJECTS, FOUNDED_YEAR, GUARANTEE_DAYS, PERF_TARGET } from '../lib/site'
import { DEMOS } from '../lib/demos'
import { facts, packagesFor } from '../i18n/facts'
import { byPrice } from '../lib/packages'
import { isBase, type BaseLang, type Lang } from '../i18n/config'
import { pack } from '../i18n/x'
import type { Listed } from '../i18n/x/types'
import type { PageKey } from '../i18n/routes'
import type { ArticleKey, ServiceKey } from '../i18n/slugs'
import type { TermsId } from './legal'

export type FaqCategoryId = 'general' | 'pricing' | 'process' | 'technical' | 'support'

/** Jawaban yang memuat daftar: tampil sebagai pembuka + daftar + penutup, bukan satu kalimat panjang. */
export type FaqList = { intro: string; rows: { label: string; value?: string }[]; outro: string; ordered?: boolean }
type RawItem = { category: FaqCategoryId; question: string; answer: string; list?: FaqList }

// Kunci tiap pertanyaan, sejajar dengan urutan daftar di bawah (sama di ketiga bahasa). Dipakai sebagai
// jangkar di halaman FAQ (/faq#garansi), jadi jangan diganti tanpa alasan: tautan lama akan putus.
export const FAQ_KEYS = [
  'mulai-dari-nol', 'usia-pintuweb', 'muncul-di-google', 'beda-pintuweb', 'alur-kerja', 'hak-milik', 'fitur-custom', 'aplikasi-mobile',
  'biaya', 'biaya-tersembunyi', 'pembayaran', 'tidak-cocok', 'diskon', 'ppn-faktur', 'email-bisnis',
  'lama-pengerjaan', 'persiapan', 'tanpa-konten', 'revisi', 'progres', 'tambah-fitur', 'lihat-desain',
  'responsif', 'teknologi', 'kecepatan', 'panel-admin', 'keamanan', 'integrasi', 'rilis-aplikasi',
  'garansi', 'update-konten', 'website-bermasalah', 'migrasi', 'bantuan-lanjutan', 'tidak-diperpanjang',
] as const
export type FaqKey = (typeof FAQ_KEYS)[number]
export type FaqItem = RawItem & { key: FaqKey }

/** Jangkar bagian kategori di halaman FAQ (sama di ketiga bahasa). */
export const FAQ_CATEGORY_SLUG: Record<FaqCategoryId, string> = { general: 'umum', pricing: 'harga', process: 'proses', technical: 'teknis', support: 'dukungan' }

/** Halaman yang membahas suatu jawaban lebih rinci (tautan "Selengkapnya" di bawah jawaban). */
type MorePage = Exclude<PageKey, 'home' | 'services' | 'articles' | 'local' | 'business' | 'cityKediri' | 'cityBlitar' | 'cityTrenggalek'>
/** `at` = pasal Syarat & Ketentuan yang dituju (jangkar), bila halamannya 'terms'. */
export type FaqMore = { page: MorePage; at?: TermsId } | { service: ServiceKey } | { article: ArticleKey; fallback: Exclude<MorePage, 'payment'> }
export const FAQ_MORE: Partial<Record<FaqKey, FaqMore>> = {
  'usia-pintuweb': { page: 'demo' },
  'muncul-di-google': { article: 'seo-checklist', fallback: 'glossary' },
  'beda-pintuweb': { page: 'about' },
  'hak-milik': { page: 'terms', at: 'kepemilikan' },
  'fitur-custom': { service: 'website-custom' },
  // aplikasi Android & iOS (23 Okt 2026): halaman layanannya memuat paket, demo, dan cara serah terima
  'aplikasi-mobile': { service: 'aplikasi-mobile' },
  'rilis-aplikasi': { service: 'aplikasi-mobile' },
  biaya: { page: 'pricing' },
  'biaya-tersembunyi': { page: 'pricing' },
  // halaman Cara Bayar (11 bahasa): metode, langkah, dan aturan; pasal S&K-nya ditaut dari sana
  pembayaran: { page: 'payment' },
  'tidak-cocok': { page: 'terms', at: 'revisi' },
  'ppn-faktur': { page: 'payment' },
  'lihat-desain': { page: 'demo' },
  'lama-pengerjaan': { page: 'pricing' },
  revisi: { page: 'terms', at: 'revisi' },
  responsif: { page: 'demo' },
  teknologi: { page: 'glossary' },
  garansi: { page: 'terms', at: 'garansi' },
  'website-bermasalah': { page: 'contact' },
  'tidak-diperpanjang': { page: 'terms', at: 'kepemilikan' },
}

const CATEGORIES: Record<BaseLang, { id: FaqCategoryId; name: string; lead: string }[]> = {
  id: [
    { id: 'general', name: 'Umum', lead: 'Siapa kami, cara kami bekerja, dan apa yang kamu dapat.' },
    { id: 'pricing', name: 'Harga', lead: 'Biaya, cara bayar, dan apa saja yang sudah termasuk.' },
    { id: 'process', name: 'Proses', lead: 'Dari konsultasi pertama sampai website online.' },
    { id: 'technical', name: 'Teknis', lead: 'Teknologi, kecepatan, keamanan, dan integrasi.' },
    { id: 'support', name: 'Dukungan', lead: 'Garansi, perubahan konten, dan bantuan setelah website jadi.' },
  ],
  en: [
    { id: 'general', name: 'General', lead: 'Who we are, how we work and what you get.' },
    { id: 'pricing', name: 'Pricing', lead: 'Cost, how payment works and what is included.' },
    { id: 'process', name: 'Process', lead: 'From the first consultation to launch.' },
    { id: 'technical', name: 'Technical', lead: 'Technology, speed, security and integrations.' },
    { id: 'support', name: 'Support', lead: 'The guarantee, content updates and help after launch.' },
  ],
  ms: [
    { id: 'general', name: 'Umum', lead: 'Siapa kami, cara kami bekerja dan apa yang anda terima.' },
    { id: 'pricing', name: 'Harga', lead: 'Kos, cara pembayaran dan apa yang sudah termasuk.' },
    { id: 'process', name: 'Proses', lead: 'Dari konsultasi pertama hingga laman web dilancarkan.' },
    { id: 'technical', name: 'Teknikal', lead: 'Teknologi, kelajuan, keselamatan dan integrasi.' },
    { id: 'support', name: 'Sokongan', lead: 'Jaminan, kemas kini kandungan dan bantuan selepas laman web siap.' },
  ],
}

/**
 * Jawaban berbentuk daftar. Teks utuhnya (untuk JSON-LD, llms.txt, dan pencarian) dirakit dari bagian yang sama
 * dengan yang ditampilkan, jadi keduanya tidak bisa berselisih.
 */
function listed(intro: string, rows: FaqList['rows'], outro: string, ordered = false): Listed {
  const flat = rows.map((r, i) => `${ordered ? `${i + 1}) ` : ''}${r.label}${r.value ? `: ${r.value}` : ''}`).join('; ')
  return { answer: `${intro} ${flat}. ${outro}`, list: { intro, rows, outro, ordered } }
}

/** Kategori tiap pertanyaan menurut urutan FAQ_KEYS: 8 umum, 7 harga, 7 proses, 7 teknis, 6 dukungan. */
const CATEGORY_OF: FaqCategoryId[] = (
  [
    ['general', 8],
    ['pricing', 7],
    ['process', 7],
    ['technical', 7],
    ['support', 6],
  ] as const
).flatMap(([c, n]) => Array<FaqCategoryId>(n).fill(c))

function items(lang: Lang): RawItem[] {
  const f = facts(lang)
  const pk = packagesFor(lang)
  const durations = pk.map((p) => ({ label: p.title, value: p.duration }))
  // termurah dulu; paket tanpa perkiraan harga di akhir dengan kalimatnya ("Harga sesuai kebutuhan · konsultasi gratis")
  const prices = byPrice(pk).map((p) => ({ label: p.title, value: p.quote ? p.priceRange : p.priceFrom }))
  const steps = (list: string[]) => list.map((label) => ({ label }))
  const n = DEMOS.length
  // paket Aplikasi Mobile (lib/packages.ts) untuk jawaban "apakah membuat aplikasi Android & iOS?"
  const appPkg = pk.find((p) => p.slug === 'aplikasi-mobile')!
  const app = { from: appPkg.priceFrom, duration: appPkg.duration }

  // Bahasa tambahan: 31 pasang [pertanyaan, jawaban] dari paketnya, berurutan seperti FAQ_KEYS.
  if (!isBase(lang)) {
    return pack(lang)
      .faq({ year: FOUNDED_YEAR, projects: CLIENT_PROJECTS, demos: n, perf: PERF_TARGET, days: GUARANTEE_DAYS, facts: f, prices, durations, app, listed, steps })
      .map(([question, a], i) => ({ category: CATEGORY_OF[i], question, ...(typeof a === 'string' ? { answer: a } : a) }))
  }

  if (lang === 'en') {
    return [
      { category: 'general', question: 'I have never had a website. Can you help me from scratch?', answer: 'Of course. We guide you step by step, from concept, design and content to the website going live. You do not need any technical knowledge; just tell us about your business and what you need.' },
      { category: 'general', question: 'How long has PintuWeb been around?', answer: `PintuWeb was founded in ${FOUNDED_YEAR} in ${CITY}, East Java, Indonesia, and has completed ${CLIENT_PROJECTS} client projects. There are also ${n} live demos you can try for yourself on the Demos page.` },
      { category: 'general', question: 'Will my website show up on Google?', answer: 'Yes. Every website is optimised for search from day one: meta tags, structured data, a sitemap and a clean heading structure. A new website usually starts being indexed by Google within 1–2 weeks, and its rankings grow with good-quality content.' },
      { category: 'general', question: 'What makes PintuWeb different?', answer: `You can start from one of our demo designs, tailored to your business identity, or ask for a bespoke design from scratch. We aim for a PageSpeed score of ${PERF_TARGET}, mobile-first design and SEO from the start, plus a ${GUARANTEE_DAYS}-day guarantee and maintenance according to your package.` },
      { category: 'general', question: 'What does the process look like from start to finish?', ...listed('Here is how it works:', steps(['A consultation about your needs', 'A quote and agreement', 'An initial design for your approval', 'Development', 'Testing and revisions', 'Launch and handover']), 'We keep you updated over WhatsApp at every stage.', true) },
      { category: 'general', question: 'Will I fully own the website?', answer: 'Yes. Once the final payment is made, you receive the source code, admin access, hosting and domain access and every credential. The website is entirely yours, with no dependence on us. Exceptions: invitation themes from our gallery stay active for 12 months on a personal link, and the Website Design Concepts package gives you the right to use the design, not the code.' },
      { category: 'general', question: 'Can I request custom features for my business?', answer: 'Yes. Booking systems, member areas, calculators, dynamic catalogues or integrations with systems you already use can be built through the Custom Website package. Tell us what you need and we will give you an estimate.' },
      { category: 'general', question: 'Do you also build Android and iOS apps?', answer: `Yes. We build mobile apps with React Native and Expo: one codebase produces the Android app, the iOS app and a web version. The Mobile App package starts at ${app.from} with a turnaround of ${app.duration}, and you can try the demo apps in your browser on the Demos page.` },
      { category: 'pricing', question: 'How much does a website cost?', ...listed('Starting prices per package, cheapest first:', prices, 'Full details of each package are on the Pricing page, and all prices are in Indonesian Rupiah (IDR). Every price includes design and build; website packages also include basic SEO.') },
      { category: 'pricing', question: 'Are there any hidden costs?', answer: `No. The package price covers design and build (plus basic SEO for website packages). The only recurring cost from us is the domain and hosting renewal: ${f.renewal} For online stores with a payment gateway, transaction fees are deducted directly by the gateway provider (not by us), and the merchant account is opened in your name. Any major features outside the package are always discussed and agreed first.` },
      { category: 'pricing', question: 'How does payment work?', answer: f.payment },
      { category: 'pricing', question: 'What if I am not happy with the result?', answer: 'You approve the design before development starts, with the number of revisions set by your package. The remaining 50% is only paid once the website is finished and you have approved it, so you never pay in full for work that is not right yet.' },
      { category: 'pricing', question: 'Do you offer discounts for start-ups or small businesses?', answer: 'Our package prices are already set to be affordable for small businesses. For large projects or several websites at once, we can put together a custom quote. Contact us to talk it through.' },
      { category: 'pricing', question: 'Does the price include VAT? Can I get a tax invoice?', answer: `We always send the invoice before you pay, so you can check what the charge covers. If you need a tax invoice or other documents for a company or institution, tell us during the consultation so we can talk it through before you accept the quote.` },
      { category: 'pricing', question: 'Is a business email on my own domain (name@yourbusiness.com) included?', answer: `The packages do not list an email address on your own domain. What is included is the website domain and hosting for the first year. If you would like an address like name@yourbusiness.com, tell us during the consultation and we will talk it over together.` },
      { category: 'process', question: 'How long does it take to build a website?', ...listed('Estimated time per package once your content is complete:', durations, 'It can be quicker or longer depending on how complete your content is and how complex the features are.') },
      { category: 'process', question: 'What do I need to prepare?', answer: 'Required: your business name, a description of your business and contact details. Helpful: a logo, photos of your products or services and examples of websites you like. If anything is missing, we will help you prepare it.' },
      { category: 'process', question: 'What if I do not have any content or photos?', answer: 'No problem. We can write the content from a short brief, use licensed stock photos, or recommend a photographer if you need your own product photos.' },
      { category: 'process', question: 'Can I revise the design?', answer: 'Yes. The number of revisions depends on your package (for example, 2 design revisions for the Small Business Standard and Simple Online Store packages). Small changes such as text, photos or contact details are free during the maintenance period.' },
      { category: 'process', question: 'Can I see the progress?', answer: 'Yes. We send you a preview of the website that you can open yourself, and update you over WhatsApp at every stage.' },
      { category: 'process', question: 'What if I need extra features halfway through?', answer: 'Small additions can usually be included straight away. Larger features such as an online store or a booking system get a separate quote and are built once you approve it.' },
      { category: 'process', question: 'Can I see the design before I pay?', answer: `Before the deposit you can try our demos and receive a written quote. The first design is made after the 50% deposit, and you must approve it before the website is built. The remaining 50% is paid once the website is finished and you have approved it.` },
      { category: 'technical', question: 'Is the website responsive (mobile-friendly)?', answer: 'Yes. All our websites are mobile-first and tested across screen sizes, from phones to desktops. This also matters for your Google rankings.' },
      { category: 'technical', question: 'What technology do you use?', answer: 'Next.js, React and Tailwind CSS, with cloud hosting on a CDN. For websites that need data, we use databases such as PostgreSQL depending on the project.' },
      { category: 'technical', question: 'How fast will my website be?', answer: `We aim for a PageSpeed score of ${PERF_TARGET} through image optimisation, lazy loading, a CDN and caching. The final result also depends on the page content, such as the number of videos or large images.` },
      { category: 'technical', question: 'Is there an admin panel or CMS?', answer: 'The online store, booking system, property and web app packages include an admin panel. For other packages, content changes can be made through us during the maintenance period, or a CMS can be added as a feature.' },
      { category: 'technical', question: 'How is the website kept secure?', answer: 'Every website uses SSL (HTTPS), security headers and input validation. The code is stored in a Git repository so earlier versions can be restored, and during maintenance we update dependencies regularly.' },
      { category: 'technical', question: 'Can the website connect to social media or other services?', answer: 'Yes: WhatsApp buttons, Instagram, TikTok, Google Analytics, Meta Pixel, Google Maps, email marketing and even payment gateways for the online store packages.' },
      { category: 'technical', question: 'Do you publish the app to the Play Store and App Store?', answer: 'Publishing is done by the client. We hand over the app files and their source code, and you release them on Google Play and the App Store with developer accounts in your name (Google Play Console and the Apple Developer Program, both paid). That way the app is registered to your business. ' + `The ${GUARANTEE_DAYS}-day bug-fix guarantee runs from the day the app is handed over.` },
      { category: 'support', question: 'Is there a guarantee?', answer: `Yes. For ${GUARANTEE_DAYS} days after launch, bugs and technical issues are fixed free of charge. After that, maintenance follows what your package includes and can be extended monthly or on request.` },
      { category: 'support', question: 'How do I update the content once the website is finished?', answer: 'With the online store packages, you can manage products yourself. For other packages, just send the changes over WhatsApp; during the maintenance period, small updates such as text, images or contact details are free. We also give you a short guide to managing the website.' },
      { category: 'support', question: 'What if my website has a problem or goes down?', answer: `Message us on WhatsApp. ${f.response}, during working hours (${f.hours}). Fixes are free during the ${GUARANTEE_DAYS}-day guarantee, and because the code is kept in Git, an earlier version can always be restored.` },
      { category: 'support', question: 'Can you migrate my old website?', answer: 'Yes. We move your content, set up redirects from the old addresses so your SEO rankings are not lost, and help transfer your domain if needed.' },
      { category: 'support', question: 'Can I still get help after the website is finished?', answer: `Of course. You can still reach us on WhatsApp for advice, fixes or ongoing maintenance. ${f.response}.` },
      { category: 'support', question: 'What happens if the domain or hosting is not renewed?', answer: `The website is entirely yours, but the domain and hosting must be renewed for it to stay online. If they are not, the website stops being available once the active period ends, and the domain name can be registered by someone else after the grace period. ${f.renewal}` },
    ]
  }

  if (lang === 'ms') {
    return [
      { category: 'general', question: 'Saya tidak pernah ada laman web. Bolehkah dibantu dari awal?', answer: 'Tentu sekali. Kami bimbing anda langkah demi langkah, daripada konsep, reka bentuk dan kandungan sehingga laman web dilancarkan. Anda tidak perlu tahu hal teknikal; cukup ceritakan tentang perniagaan dan keperluan anda.' },
      { category: 'general', question: 'Sudah berapa lama PintuWeb beroperasi?', answer: `PintuWeb ditubuhkan pada ${FOUNDED_YEAR} di ${CITY}, Jawa Timur, Indonesia, dan telah menyiapkan ${CLIENT_PROJECTS} projek pelanggan. Terdapat juga ${n} demo langsung yang boleh anda cuba sendiri di halaman Demo.` },
      { category: 'general', question: 'Adakah laman web saya akan muncul di Google?', answer: 'Ya. Setiap laman web dioptimumkan untuk carian sejak awal: tag meta, data berstruktur, peta laman dan struktur tajuk yang kemas. Laman web baharu biasanya mula diindeks Google dalam 1–2 minggu, dan kedudukannya meningkat seiring kandungan yang berkualiti.' },
      { category: 'general', question: 'Apakah yang membezakan PintuWeb?', answer: `Anda boleh bermula daripada salah satu reka bentuk demo kami yang disesuaikan dengan identiti perniagaan anda, atau meminta reka bentuk khas dari awal. Kami menyasarkan skor PageSpeed ${PERF_TARGET}, reka bentuk mudah alih dahulu dan SEO sejak awal, berserta jaminan ${GUARANTEE_DAYS} hari dan penyelenggaraan mengikut pakej.` },
      { category: 'general', question: 'Bagaimanakah proses kerja dari awal hingga akhir?', ...listed('Alirannya seperti ini:', steps(['Konsultasi keperluan', 'Sebut harga dan persetujuan', 'Reka bentuk awal untuk kelulusan anda', 'Pembangunan', 'Pengujian dan semakan', 'Pelancaran dan serahan']), 'Kami maklumkan setiap peringkat melalui WhatsApp.', true) },
      { category: 'general', question: 'Adakah saya memiliki laman web itu sepenuhnya?', answer: 'Ya. Selepas bayaran penuh, anda menerima kod sumber, akses admin, akses hosting dan domain, serta semua kelayakan masuk. Laman web itu milik anda sepenuhnya, tanpa bergantung kepada kami. Pengecualian: tema jemputan daripada galeri kami aktif 12 bulan pada pautan peribadi, dan pakej Konsep Reka Bentuk Laman Web memberikan hak menggunakan reka bentuk, bukan kod.' },
      { category: 'general', question: 'Bolehkah saya meminta ciri khas untuk perniagaan saya?', answer: 'Boleh. Sistem tempahan, ruang ahli, kalkulator, katalog dinamik atau integrasi dengan sistem sedia ada boleh dibina melalui pakej Laman Web Tersuai. Bincangkan keperluan anda dan kami berikan anggaran.' },
      { category: 'general', question: 'Adakah PintuWeb juga membina aplikasi Android dan iOS?', answer: `Ya. Kami membina aplikasi mudah alih dengan React Native dan Expo: satu kod menghasilkan aplikasi Android, aplikasi iOS dan versi web. Pakej Aplikasi Mudah Alih bermula ${app.from} dengan tempoh ${app.duration}, dan demo aplikasinya boleh dicuba terus dalam pelayar melalui halaman Demo.` },
      { category: 'pricing', question: 'Berapakah kos membina laman web?', ...listed('Harga permulaan setiap pakej, daripada yang paling murah:', prices, 'Butiran setiap pakej ada di halaman Harga, dan semua harga dalam Rupiah Indonesia (IDR). Setiap harga sudah termasuk reka bentuk dan pembinaan; pakej laman web juga merangkumi SEO asas.') },
      { category: 'pricing', question: 'Adakah kos tersembunyi?', answer: `Tiada. Harga pakej merangkumi reka bentuk dan pembinaan (serta SEO asas untuk pakej laman web). Satu-satunya kos berkala daripada kami ialah pembaharuan domain dan hosting: ${f.renewal} Untuk kedai dalam talian dengan gerbang pembayaran, yuran transaksi dipotong terus oleh penyedia gerbang (bukan oleh kami), dan akaun pedagang dibuka atas nama anda. Ciri besar di luar pakej sentiasa dibincang dan dipersetujui terlebih dahulu.` },
      { category: 'pricing', question: 'Bagaimanakah sistem pembayarannya?', answer: f.payment },
      { category: 'pricing', question: 'Bagaimana jika saya tidak berpuas hati dengan hasilnya?', answer: 'Anda meluluskan reka bentuk sebelum pembangunan bermula, dengan bilangan semakan mengikut pakej. Baki 50% hanya dibayar selepas laman web siap dan anda luluskan, jadi anda tidak membayar penuh untuk hasil yang belum sesuai.' },
      { category: 'pricing', question: 'Adakah diskaun untuk syarikat pemula atau PKS?', answer: 'Harga pakej kami sudah disusun supaya mampu milik untuk PKS. Untuk projek besar atau beberapa laman web sekali gus, kami boleh menyediakan sebut harga khas. Hubungi kami untuk berbincang.' },
      { category: 'pricing', question: 'Adakah harga termasuk cukai? Bolehkah saya meminta invois cukai?', answer: `Kami sentiasa menghantar invois sebelum anda membayar, jadi anda boleh menyemak butiran caj. Jika anda memerlukan invois cukai atau dokumen lain untuk syarikat atau institusi, nyatakan semasa konsultasi supaya dapat dibincangkan sebelum anda bersetuju dengan sebut harga.` },
      { category: 'pricing', question: 'Adakah e-mel perniagaan dengan domain sendiri (nama@perniagaananda.com) termasuk?', answer: `Pakej tidak menyenaraikan e-mel dengan domain sendiri. Yang termasuk ialah domain dan hosting laman web untuk tahun pertama. Jika anda mahukan alamat seperti nama@perniagaananda.com, nyatakan semasa konsultasi dan kita bincangkan bersama.` },
      { category: 'process', question: 'Berapa lama masa untuk membina laman web?', ...listed('Anggaran setiap pakej selepas kandungan lengkap:', durations, 'Masa boleh lebih cepat atau lebih lama bergantung pada kelengkapan kandungan dan kerumitan ciri.') },
      { category: 'process', question: 'Apakah yang perlu saya sediakan?', answer: 'Wajib: nama perniagaan, penerangan perniagaan dan maklumat hubungan. Membantu: logo, foto produk atau perkhidmatan, dan contoh laman web yang anda suka. Jika belum lengkap, kami bantu menyediakannya.' },
      { category: 'process', question: 'Bagaimana jika saya tiada kandungan atau foto?', answer: 'Tiada masalah. Kami boleh menulis kandungan berdasarkan ringkasan pendek, menggunakan foto stok berlesen, atau mengesyorkan jurugambar jika anda memerlukan foto produk sendiri.' },
      { category: 'process', question: 'Bolehkah saya menyemak semula reka bentuk?', answer: 'Boleh. Bilangan semakan mengikut pakej (contohnya 2× semakan reka bentuk untuk pakej Standard PKS dan Kedai Online Ringkas). Perubahan kecil seperti teks, foto atau maklumat hubungan dibantu tanpa caj sepanjang tempoh penyelenggaraan.' },
      { category: 'process', question: 'Bolehkah saya melihat kemajuan kerja?', answer: 'Boleh. Kami hantar pratonton laman web yang boleh anda buka sendiri, dan maklumkan kemajuan melalui WhatsApp pada setiap peringkat.' },
      { category: 'process', question: 'Bagaimana jika saya perlukan ciri tambahan di tengah proses?', answer: 'Tambahan kecil biasanya boleh terus dimasukkan. Ciri besar seperti kedai dalam talian atau sistem tempahan diberikan sebut harga berasingan dan dibina selepas anda luluskan.' },
      { category: 'process', question: 'Bolehkah saya melihat reka bentuk sebelum membayar?', answer: `Sebelum deposit, anda boleh mencuba demo kami dan menerima sebut harga bertulis. Reka bentuk awal dibuat selepas deposit 50%, dan anda mesti meluluskannya sebelum laman web dibina. Baki 50% dibayar selepas laman web siap dan anda luluskan.` },
      { category: 'technical', question: 'Adakah laman web itu responsif (mesra mudah alih)?', answer: 'Ya. Semua laman web kami direka untuk mudah alih dahulu dan diuji pada pelbagai saiz skrin, dari telefon hingga desktop. Ini juga penting untuk kedudukan di Google.' },
      { category: 'technical', question: 'Teknologi apakah yang digunakan?', answer: 'Next.js, React dan Tailwind CSS, dengan hosting awan ber-CDN. Untuk laman web yang memerlukan data, kami menggunakan pangkalan data seperti PostgreSQL mengikut keperluan projek.' },
      { category: 'technical', question: 'Sepantas manakah laman web yang dibina?', answer: `Kami menyasarkan skor PageSpeed ${PERF_TARGET} melalui pengoptimuman imej, lazy loading, CDN dan caching. Hasil akhir juga dipengaruhi kandungan halaman, contohnya bilangan video atau imej besar.` },
      { category: 'technical', question: 'Adakah panel admin atau CMS?', answer: 'Pakej kedai dalam talian, sistem tempahan, hartanah dan aplikasi web sudah dilengkapi panel admin. Untuk pakej lain, perubahan kandungan boleh dibuat melalui kami sepanjang tempoh penyelenggaraan, atau CMS ditambah sebagai ciri.' },
      { category: 'technical', question: 'Bagaimanakah keselamatan laman web dijamin?', answer: 'Semua laman web menggunakan SSL (HTTPS), pengepala keselamatan dan pengesahan input. Kod disimpan dalam repositori Git supaya versi terdahulu boleh dipulihkan, dan sepanjang penyelenggaraan kami mengemas kini kebergantungan secara berkala.' },
      { category: 'technical', question: 'Bolehkah laman web disambungkan ke media sosial atau perkhidmatan lain?', answer: 'Boleh: butang WhatsApp, Instagram, TikTok, Google Analytics, Meta Pixel, Google Maps, pemasaran e-mel hingga gerbang pembayaran untuk pakej kedai dalam talian.' },
      { category: 'technical', question: 'Adakah aplikasi dibantu diterbitkan ke Play Store dan App Store?', answer: 'Penerbitan diuruskan sendiri oleh pelanggan. Kami menyerahkan fail aplikasi berserta kod sumbernya, kemudian anda menerbitkannya di Google Play dan App Store dengan akaun pembangun atas nama anda (Google Play Console dan Apple Developer Program, kedua-duanya berbayar). Dengan itu aplikasi didaftarkan atas nama perniagaan anda. ' + `Jaminan pembaikan pepijat ${GUARANTEE_DAYS} hari bermula sejak aplikasi diserahkan.` },
      { category: 'support', question: 'Adakah jaminan?', answer: `Ya. Selama ${GUARANTEE_DAYS} hari selepas laman web dilancarkan, pepijat dan masalah teknikal dibaiki secara percuma. Selepas itu, penyelenggaraan mengikut isi pakej dan boleh dilanjutkan secara bulanan atau atas permintaan.` },
      { category: 'support', question: 'Bagaimana cara mengemas kini kandungan selepas laman web siap?', answer: 'Untuk pakej kedai dalam talian, produk boleh diurus sendiri. Untuk pakej lain, hantar sahaja perubahan melalui WhatsApp; sepanjang tempoh penyelenggaraan, kemas kini kecil seperti teks, imej atau maklumat hubungan dibuat secara percuma. Kami juga berikan panduan ringkas mengurus laman web.' },
      { category: 'support', question: 'Bagaimana jika laman web saya bermasalah atau tidak dapat diakses?', answer: `Maklumkan kepada kami melalui WhatsApp. ${f.response}, pada waktu bekerja (${f.hours}). Sepanjang jaminan ${GUARANTEE_DAYS} hari pembaikan adalah percuma, dan kerana kod disimpan dalam Git, versi terdahulu sentiasa boleh dipulihkan.` },
      { category: 'support', question: 'Bolehkah laman web lama dipindahkan?', answer: 'Boleh. Kami pindahkan kandungan, memasang pengalihan dari alamat lama supaya kedudukan SEO tidak hilang, dan membantu pemindahan domain jika perlu.' },
      { category: 'support', question: 'Selepas laman web siap, bolehkah saya masih meminta bantuan?', answer: `Tentu. Anda masih boleh menghubungi kami melalui WhatsApp untuk konsultasi, pembaikan atau penyelenggaraan lanjutan. ${f.response}.` },
      { category: 'support', question: 'Apa yang berlaku jika domain atau hosting tidak diperbaharui?', answer: `Laman web ini sepenuhnya milik anda, tetapi domain dan hosting mesti diperbaharui supaya ia kekal dalam talian. Jika tidak, laman web berhenti boleh diakses selepas tempoh aktif tamat, dan nama domain boleh didaftarkan oleh orang lain selepas tempoh bertenang. ${f.renewal}` },
    ]
  }

  return [
    { category: 'general', question: 'Saya belum pernah punya website, apakah bisa dibantu dari awal?', answer: 'Tentu. Kami memandumu langkah demi langkah, mulai dari konsep, desain, dan konten sampai website online. Kamu tidak perlu paham teknis; cukup ceritakan usaha dan kebutuhanmu.' },
    { category: 'general', question: 'Sudah berapa lama PintuWeb berdiri?', answer: `PintuWeb berdiri sejak ${FOUNDED_YEAR} di ${CITY}, Jawa Timur, dan sudah menyelesaikan ${CLIENT_PROJECTS} proyek klien. Selain itu ada ${n} demo live yang bisa kamu coba langsung di halaman Demo.` },
    { category: 'general', question: 'Apakah website yang dibuat bisa muncul di Google?', answer: 'Ya. Setiap website dioptimasi SEO sejak awal: meta tag, structured data, sitemap, dan struktur heading yang rapi. Biasanya website mulai terindeks Google dalam 1–2 minggu, lalu peringkatnya tumbuh seiring konten yang berkualitas.' },
    { category: 'general', question: 'Apa yang membedakan PintuWeb dengan jasa lain?', answer: `Kamu bisa memulai dari salah satu desain demo kami yang disesuaikan dengan identitas usahamu, atau meminta desain khusus dari nol. Kami menargetkan skor PageSpeed ${PERF_TARGET}, desain mobile-first, SEO sejak awal, serta garansi ${GUARANTEE_DAYS} hari dan maintenance sesuai paket.` },
    { category: 'general', question: 'Bagaimana proses kerja dari awal sampai akhir?', ...listed('Alurnya seperti ini:', steps(['Konsultasi kebutuhan', 'Penawaran dan kesepakatan', 'Desain awal untuk kamu setujui', 'Pengembangan', 'Pengujian dan revisi', 'Website online dan serah terima']), 'Setiap tahap kami kabarkan lewat WhatsApp.', true) },
    { category: 'general', question: 'Apakah saya memiliki hak penuh atas website?', answer: 'Ya. Setelah pelunasan, kamu mendapat source code, akses admin, akses hosting dan domain, serta semua kredensial. Website sepenuhnya milikmu, tanpa ketergantungan pada kami. Pengecualian: tema undangan dari galeri kami aktif 12 bulan di tautan pribadi, dan paket Konsep Desain memberi hak pakai desain, bukan kode.' },
    { category: 'general', question: 'Apakah bisa request fitur custom sesuai kebutuhan bisnis?', answer: 'Bisa. Sistem booking, area member, kalkulator, katalog dinamis, atau integrasi dengan sistem yang sudah ada dapat kami buatkan lewat paket Website Custom. Diskusikan kebutuhanmu dan kami beri estimasi.' },
    { category: 'general', question: 'Apakah PintuWeb juga membuat aplikasi Android dan iOS?', answer: `Ya. Kami membuat aplikasi mobile dengan React Native dan Expo: satu kode menghasilkan aplikasi Android, aplikasi iOS, sekaligus versi web. Paket Aplikasi Mobile mulai ${app.from} dengan pengerjaan ${app.duration}, dan demo aplikasinya bisa dicoba langsung di browser lewat halaman Demo.` },
    { category: 'pricing', question: 'Berapa biaya pembuatan website?', ...listed('Harga mulai tiap paket, dari yang termurah:', prices, 'Rincian fitur tiap paket ada di halaman Paket. Semua harga sudah termasuk desain dan pengerjaan; paket website juga mencakup SEO dasar.') },
    { category: 'pricing', question: 'Apakah ada biaya tersembunyi?', answer: `Tidak. Harga paket sudah mencakup desain dan pengerjaan (plus SEO dasar untuk paket website). Biaya berkala satu-satunya dari kami adalah perpanjangan domain dan hosting: ${f.renewal} Untuk toko online dengan payment gateway, biaya transaksi dipotong langsung oleh penyedia gateway (bukan oleh kami), dan akun merchant dibuat atas namamu. Fitur besar di luar paket selalu dibicarakan dan disepakati lebih dulu.` },
    { category: 'pricing', question: 'Bagaimana sistem pembayarannya?', answer: f.payment },
    { category: 'pricing', question: 'Bagaimana kalau saya tidak cocok dengan hasilnya?', answer: 'Desain kamu setujui dulu sebelum pengembangan dimulai, dengan jatah revisi sesuai paket. Pelunasan 50% baru dibayar setelah website selesai dan kamu setujui, jadi kamu tidak membayar penuh untuk hasil yang belum sesuai.' },
    { category: 'pricing', question: 'Apakah ada diskon untuk startup atau UMKM?', answer: 'Harga paket sudah kami susun agar terjangkau untuk UMKM. Untuk proyek besar atau beberapa website sekaligus, kami bisa menyusun penawaran khusus. Hubungi kami untuk membicarakannya.' },
    { category: 'pricing', question: 'Apakah harga sudah termasuk PPN? Bisa minta faktur pajak?', answer: `Invoice selalu kami kirim sebelum kamu membayar, jadi rincian tagihannya bisa kamu cek dulu. Kalau kamu butuh faktur pajak atau dokumen lain untuk perusahaan atau instansi, sampaikan saat konsultasi supaya bisa dibicarakan sebelum penawaran disepakati.` },
    { category: 'pricing', question: 'Apakah paket termasuk email bisnis berdomain sendiri (nama@usahamu.com)?', answer: `Paket tidak mencantumkan email berdomain sendiri. Yang termasuk adalah domain dan hosting website untuk tahun pertama. Kalau kamu ingin alamat email seperti nama@usahamu.com, sampaikan saat konsultasi supaya kita bicarakan bersama.` },
    { category: 'process', question: 'Berapa lama proses pembuatan website?', ...listed('Perkiraan per paket setelah konten lengkap:', durations, 'Waktu bisa lebih cepat atau lebih lama tergantung kelengkapan konten dan kompleksitas fitur.') },
    { category: 'process', question: 'Apa saja yang perlu saya siapkan?', answer: 'Yang wajib: nama bisnis, deskripsi usaha, dan kontak. Yang membantu: logo, foto produk atau layanan, dan contoh website yang kamu suka. Kalau belum lengkap, kami bantu menyiapkannya.' },
    { category: 'process', question: 'Bagaimana jika saya tidak punya konten atau foto?', answer: 'Tidak masalah. Kami bisa menulis konten berdasarkan brief singkat, memakai foto stok berlisensi, atau merekomendasikan fotografer bila kamu butuh foto produk sendiri.' },
    { category: 'process', question: 'Apakah saya bisa merevisi desain?', answer: 'Bisa. Jatah revisi mengikuti paket (misalnya 2× revisi desain untuk paket Standar UMKM dan Toko Online Simple). Perubahan kecil seperti teks, foto, atau info kontak kami bantu tanpa biaya selama masa maintenance.' },
    { category: 'process', question: 'Apakah saya bisa melihat progres pengerjaan?', answer: 'Bisa. Kami kirim pratinjau website yang bisa kamu buka sendiri, dan mengabarkan progres lewat WhatsApp di setiap tahap.' },
    { category: 'process', question: 'Bagaimana jika saya butuh tambahan fitur di tengah proses?', answer: 'Tambahan kecil biasanya bisa langsung kami masukkan. Fitur besar seperti toko online atau sistem booking dibuatkan penawaran terpisah dan dikerjakan setelah kamu setujui.' },
    { category: 'process', question: 'Bisa lihat desain dulu sebelum bayar?', answer: `Sebelum DP, kamu bisa mencoba demo kami dan menerima penawaran tertulis. Desain awal dikerjakan setelah DP 50%, dan harus kamu setujui sebelum website dibangun. Sisa 50% dibayar setelah website selesai dan kamu setujui.` },
    { category: 'technical', question: 'Apakah website-nya responsif (mobile-friendly)?', answer: 'Ya. Semua website kami mobile-first dan diuji di berbagai ukuran layar, dari ponsel sampai desktop. Ini juga penting untuk peringkat di Google.' },
    { category: 'technical', question: 'Teknologi apa yang digunakan?', answer: 'Next.js, React, dan Tailwind CSS, dengan hosting cloud ber-CDN. Untuk website yang butuh data, kami memakai database seperti PostgreSQL sesuai kebutuhan proyek.' },
    { category: 'technical', question: 'Seberapa cepat website yang dibuat?', answer: `Kami menargetkan skor PageSpeed ${PERF_TARGET} lewat optimasi gambar, lazy loading, CDN, dan caching. Hasil akhirnya juga dipengaruhi isi halaman, misalnya jumlah video atau gambar besar.` },
    { category: 'technical', question: 'Apakah ada admin panel atau CMS?', answer: 'Paket toko online, sistem reservasi, properti, dan aplikasi web sudah dilengkapi panel admin. Untuk paket lain, perubahan konten bisa lewat kami selama masa maintenance, atau CMS ditambahkan sebagai fitur.' },
    { category: 'technical', question: 'Bagaimana keamanan website dijamin?', answer: 'Semua website memakai SSL (HTTPS), security headers, dan validasi input. Kode tersimpan di repository Git sehingga versi sebelumnya bisa dipulihkan, dan selama masa maintenance kami memperbarui dependensi secara berkala.' },
    { category: 'technical', question: 'Apakah website bisa diintegrasikan dengan media sosial atau layanan lain?', answer: 'Bisa: tombol WhatsApp, Instagram, TikTok, Google Analytics, Meta Pixel, Google Maps, email marketing, hingga payment gateway untuk paket toko online.' },
    { category: 'technical', question: 'Apakah aplikasinya dibantu rilis ke Play Store dan App Store?', answer: 'Rilis diurus sendiri oleh klien. Kami menyerahkan file aplikasi beserta kode sumbernya, lalu kamu merilisnya ke Google Play dan App Store dengan akun developer atas namamu (Google Play Console dan Apple Developer Program, keduanya berbayar). Dengan begitu aplikasinya terdaftar atas nama usahamu. ' + `Garansi perbaikan bug ${GUARANTEE_DAYS} hari berlaku sejak aplikasi diserahkan.` },
    { category: 'support', question: 'Apakah ada garansi?', answer: `Ya. Selama ${GUARANTEE_DAYS} hari setelah website online, bug dan masalah teknis kami perbaiki gratis. Setelah itu, maintenance mengikuti isi paket dan bisa diperpanjang bulanan atau per permintaan.` },
    { category: 'support', question: 'Bagaimana cara update konten setelah website jadi?', answer: 'Untuk paket toko online, produk bisa kamu kelola sendiri. Untuk paket lain, kirim saja perubahan lewat WhatsApp; selama masa maintenance, update kecil seperti teks, gambar, atau info kontak kami kerjakan gratis. Kami juga memberi panduan singkat cara mengelola website.' },
    { category: 'support', question: 'Bagaimana jika website saya bermasalah atau down?', answer: `Kabari kami lewat WhatsApp. ${f.response}, pada jam kerja (${f.hours}). Selama garansi ${GUARANTEE_DAYS} hari perbaikannya gratis, dan karena kode tersimpan di Git, versi sebelumnya selalu bisa dipulihkan.` },
    { category: 'support', question: 'Apakah bisa migrasi dari website lama?', answer: 'Bisa. Kami pindahkan konten, memasang redirect dari alamat lama agar peringkat SEO tidak hilang, dan membantu transfer domain bila diperlukan.' },
    { category: 'support', question: 'Setelah website selesai, apakah masih bisa minta bantuan?', answer: `Tentu. Kami tetap bisa dihubungi lewat WhatsApp untuk konsultasi, perbaikan, atau maintenance lanjutan. ${f.response}.` },
    { category: 'support', question: 'Apa yang terjadi kalau domain atau hosting tidak diperpanjang?', answer: `Website sepenuhnya milikmu, tetapi domain dan hosting perlu diperpanjang supaya website tetap tayang. Kalau tidak, website berhenti tayang setelah masa aktifnya habis, dan nama domain bisa dipakai orang lain bila sudah lewat masa tenggang. ${f.renewal}` },
  ]
}

export function faqFor(lang: Lang): { categories: { id: FaqCategoryId; name: string; lead: string }[]; items: FaqItem[] } {
  const list = items(lang)
  const categories = isBase(lang)
    ? CATEGORIES[lang]
    : (['general', 'pricing', 'process', 'technical', 'support'] as const).map((id) => ({ id, ...pack(lang).faqCategories[id] }))
  // daftar tiap bahasa harus sejajar dengan FAQ_KEYS; kalau tidak, jangkar akan menunjuk pertanyaan yang salah
  if (list.length !== FAQ_KEYS.length) throw new Error(`FAQ ${lang}: ${list.length} pertanyaan, tetapi ada ${FAQ_KEYS.length} kunci`)
  return { categories, items: list.map((it, i) => ({ ...it, key: FAQ_KEYS[i] })) }
}

/** JSON-LD FAQPage dari daftar tanya-jawab yang sama dengan yang tampil. */
export const faqJsonLd = (list: { question: string; answer: string }[], inLanguage: string) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage,
  mainEntity: list.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
})
