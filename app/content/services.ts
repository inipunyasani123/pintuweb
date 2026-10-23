// Halaman layanan khusus (8 layanan × 3 bahasa dasar; 8 bahasa tambahan di i18n/x/more/). Harga & durasi TIDAK ditulis di sini:
// tabel harga dirakit dari lib/packages.ts lewat `packages`. Layanan tanpa paket (undangan, link in bio)
// sengaja tanpa angka — harganya dikonfirmasi lewat WhatsApp. Jumlah demo juga tidak ditulis: pakai penanda
// {{demos:kategori}} (diisi fillFacts dari lib/demos.ts), sama di 11 bahasa.
import { isBase, type BaseLang, type Lang } from '../i18n/config'
import type { Hl } from '../i18n/dict/id'
import type { ArticleKey, ServiceKey } from '../i18n/slugs'
import type { DemoCategory } from '../lib/demos'
import { more } from '../i18n/x/more'
import { fillFacts } from '../i18n/facts'

export type ServiceText = {
  name: string
  title: string
  description: string
  h1: Hl
  lead: string
  intro: string[]
  forWho: string[]
  /** Hanya untuk layanan tanpa paket; layanan berpaket memakai fitur dari packages.ts. */
  includes?: string[]
  short: string
  suits: string
  faq: { q: string; a: string }[]
  /** Tahap kerja khusus layanan ini (bawaan: 4 tahap website umum di kamus `process.steps`). */
  steps?: { title: string; desc: string }[]
  /** Ubin ringkasan "yang diserahkan", pengganti ubin garansi website di pembuka halaman layanan. */
  handover?: { label: string; value: string }
}

export type Service = {
  key: ServiceKey
  packages: string[]
  demoCategories: DemoCategory[]
  demoSlugs?: string[]
  articles: ArticleKey[]
  text: Record<BaseLang, ServiceText>
}

export const SERVICES: Service[] = [
  {
    key: 'landing-page',
    packages: ['landing-page'],
    // menu digital QR dijual sebagai paket Landing Page: demonya ikut tampil di sini (cissycoffee & citarasa sudah
    // tampil di Company Profile)
    demoCategories: ['landing', 'menu'],
    demoSlugs: ['bribu', 'eduplay', 'elevinar', 'lumicast', 'kopi', 'bakso'],
    articles: ['landing-vs-compro', 'biaya', 'seo-checklist'],
    text: {
      id: {
        name: 'Landing Page',
        title: 'Jasa Pembuatan Landing Page',
        description: 'Jasa pembuatan landing page cepat dan fokus konversi untuk promosi, event, dan iklan. Harga transparan, selesai dalam hitungan hari. Coba {{demos:landing}} demonya.',
        h1: ['Jasa pembuatan ', 'landing page', ' yang mengubah pengunjung jadi pembeli.'],
        lead: 'Landing page adalah satu halaman web yang dibuat untuk satu tujuan: membuat pengunjung melakukan satu tindakan, misalnya membeli, mendaftar webinar, atau menghubungi lewat WhatsApp. Karena hanya satu halaman, landing page cepat dibuat dan cocok sebagai tujuan iklan.',
        intro: [
          'Berbeda dengan website lengkap, landing page tidak punya menu ke banyak halaman. Semua isinya — masalah yang diselesaikan, bukti, harga, dan tombol ajakan — disusun berurutan supaya pengunjung tidak tersesat sebelum bertindak.',
          'Kami membangun landing page dengan Next.js sehingga ringan dan cepat dibuka di ponsel. Kecepatan penting: iklan yang mengarah ke halaman lambat membuang anggaran.',
        ],
        forWho: ['Peluncuran produk atau promo musiman', 'Pendaftaran webinar, kelas, dan event', 'Tujuan iklan Meta, TikTok, atau Google Ads', 'Startup yang ingin menguji ide dan mengumpulkan calon pelanggan', 'Menu digital QR untuk kafe, warung, dan restoran', 'UMKM yang butuh satu halaman jualan sebelum punya website lengkap'],
        short: 'Satu halaman yang fokus konversi untuk promosi produk, event, atau kampanye iklan.',
        suits: 'Promosi, event, iklan',
        faq: [
          { q: 'Apa bedanya landing page dengan website company profile?', a: 'Landing page hanya satu halaman dengan satu tujuan, misalnya pendaftaran atau penjualan. Company profile terdiri dari beberapa halaman (profil, layanan, kontak, blog) untuk memperkenalkan usaha secara menyeluruh. Kalau tujuanmu menjalankan iklan untuk satu produk, landing page biasanya lebih tepat.' },
          { q: 'Apakah landing page bisa dipakai untuk iklan Facebook, Instagram, atau Google?', a: 'Bisa. Kami pastikan halaman cepat dimuat di ponsel dan siap dipasangi Meta Pixel atau tag Google, sehingga hasil iklan bisa diukur.' },
          { q: 'Apakah landing page bisa muncul di Google?', a: 'Bisa, karena kami memasang meta tag, structured data, dan sitemap. Namun landing page satu halaman biasanya kalah bersaing untuk kata kunci umum dibanding website dengan banyak artikel; untuk lalu lintas berbayar, landing page sangat efektif.' },
          { q: 'Bisakah landing page dikembangkan menjadi website lengkap nanti?', a: 'Bisa. Desain dan kodenya bisa menjadi dasar website multi-halaman, sehingga kamu tidak perlu mulai dari nol.' },
        ],
      },
      en: {
        name: 'Landing Page',
        title: 'Landing Page Design & Development',
        description: 'Fast, conversion-focused landing pages for product launches, events, webinars and ads. Transparent pricing, ready in a few working days, {{demos:landing}} live demos.',
        h1: ['', 'Landing pages', ' that turn visitors into customers.'],
        lead: 'A landing page is a single web page built for one goal: getting visitors to take one action, such as buying, registering for a webinar or messaging you on WhatsApp. Because it is a single page, it is quick to build and ideal as the destination for an ad.',
        intro: [
          'Unlike a full website, a landing page has no menu leading to many pages. Everything — the problem you solve, the proof, the price and the call to action — is laid out in order so visitors do not wander off before acting.',
          'We build landing pages with Next.js, so they are light and quick to open on a phone. Speed matters: ads that lead to a slow page waste budget.',
        ],
        forWho: ['Product launches and seasonal promotions', 'Webinar, class and event registrations', 'Destinations for Meta, TikTok or Google Ads', 'Start-ups testing an idea and collecting leads', 'QR digital menus for cafés, food stalls and restaurants', 'Small businesses that need one sales page before a full website'],
        short: 'One page focused on conversion for product launches, events or ad campaigns.',
        suits: 'Promotions, events, ads',
        faq: [
          { q: 'How is a landing page different from a company profile website?', a: 'A landing page is one page with one goal, such as sign-ups or sales. A company profile has several pages (about, services, contact, blog) that introduce the whole business. If you are running ads for one product, a landing page is usually the better fit.' },
          { q: 'Can I use the landing page for Facebook, Instagram or Google ads?', a: 'Yes. We make sure the page loads quickly on phones and is ready for the Meta Pixel or Google tags, so your ad results can be measured.' },
          { q: 'Can a landing page rank on Google?', a: 'It can, because we add meta tags, structured data and a sitemap. However, a single page usually loses out on broad keywords to websites with many articles; for paid traffic, a landing page is very effective.' },
          { q: 'Can the landing page grow into a full website later?', a: 'Yes. Its design and code can become the base of a multi-page website, so you do not have to start from scratch.' },
        ],
      },
      ms: {
        name: 'Landing Page',
        title: 'Perkhidmatan Membina Landing Page',
        description: 'Landing page pantas yang fokus pada penukaran untuk pelancaran produk, acara dan iklan. Harga telus, siap dalam beberapa hari bekerja. Cuba {{demos:landing}} demonya.',
        h1: ['', 'Landing page', ' yang menukar pelawat menjadi pembeli.'],
        lead: 'Landing page ialah satu halaman web yang dibina untuk satu tujuan: membuat pelawat melakukan satu tindakan, seperti membeli, mendaftar webinar atau menghubungi melalui WhatsApp. Kerana hanya satu halaman, ia cepat dibina dan sesuai sebagai destinasi iklan.',
        intro: [
          'Berbeza dengan laman web lengkap, landing page tidak mempunyai menu ke banyak halaman. Semua kandungan — masalah yang diselesaikan, bukti, harga dan butang tindakan — disusun berturutan supaya pelawat tidak tersesat sebelum bertindak.',
          'Kami membina landing page dengan Next.js supaya ringan dan cepat dibuka di telefon. Kelajuan penting: iklan yang membawa ke halaman yang perlahan membazirkan bajet.',
        ],
        forWho: ['Pelancaran produk atau promosi bermusim', 'Pendaftaran webinar, kelas dan acara', 'Destinasi iklan Meta, TikTok atau Google Ads', 'Syarikat pemula yang ingin menguji idea dan mengumpul prospek', 'Menu digital QR untuk kafe, gerai makan dan restoran', 'PKS yang memerlukan satu halaman jualan sebelum ada laman web lengkap'],
        short: 'Satu halaman yang fokus pada penukaran untuk promosi produk, acara atau kempen iklan.',
        suits: 'Promosi, acara, iklan',
        faq: [
          { q: 'Apakah beza landing page dengan laman web profil syarikat?', a: 'Landing page hanya satu halaman dengan satu tujuan, seperti pendaftaran atau jualan. Profil syarikat terdiri daripada beberapa halaman (profil, perkhidmatan, hubungi, blog) untuk memperkenalkan perniagaan secara menyeluruh. Jika anda menjalankan iklan untuk satu produk, landing page biasanya lebih sesuai.' },
          { q: 'Bolehkah landing page digunakan untuk iklan Facebook, Instagram atau Google?', a: 'Boleh. Kami pastikan halaman dimuat pantas di telefon dan sedia untuk Meta Pixel atau tag Google, supaya hasil iklan boleh diukur.' },
          { q: 'Bolehkah landing page muncul di Google?', a: 'Boleh, kerana kami memasang tag meta, data berstruktur dan peta laman. Namun satu halaman biasanya kalah bersaing untuk kata kunci umum berbanding laman web dengan banyak artikel; untuk trafik berbayar, landing page sangat berkesan.' },
          { q: 'Bolehkah landing page dikembangkan menjadi laman web lengkap kemudian?', a: 'Boleh. Reka bentuk dan kodnya boleh menjadi asas laman web berbilang halaman, jadi anda tidak perlu bermula dari kosong.' },
        ],
      },
    },
  },
  {
    key: 'company-profile',
    packages: ['standar-umkm'],
    demoCategories: ['landing'],
    demoSlugs: ['cissycoffee', 'citarasa', 'woodora', 'rasanusantara'],
    articles: ['landing-vs-compro', 'website-umkm', 'domain-hosting'],
    text: {
      id: {
        name: 'Company Profile & Website UMKM',
        title: 'Jasa Pembuatan Website Company Profile & UMKM',
        description: 'Jasa pembuatan website company profile untuk UMKM: 3–5 halaman, domain .com, hosting, SSL, Google Maps, dan SEO on-page. Harga transparan, DP 50%.',
        h1: ['Website ', 'company profile', ' yang membuat usahamu dipercaya.'],
        lead: 'Website company profile adalah website beberapa halaman yang memperkenalkan usaha secara lengkap: siapa kamu, apa yang dijual, di mana lokasinya, dan bagaimana menghubungi. Calon pelanggan sering mengecek website sebelum memutuskan membeli atau bekerja sama.',
        intro: [
          'Paket Standar UMKM kami berisi 3–5 halaman inti — Beranda, Profil, Layanan, Blog, dan Kontak — lengkap dengan domain .com, hosting, SSL, formulir kontak, tombol WhatsApp, dan peta Google.',
          'Kami menulis struktur judul dan meta yang rapi sejak awal, sehingga nama usaha dan layananmu lebih mudah ditemukan di Google, termasuk pencarian lokal seperti “jasa … di kotamu”.',
        ],
        forWho: ['UMKM yang ingin terlihat profesional di Google', 'Usaha jasa: konsultan, kontraktor, bengkel, laundry, travel', 'Restoran, kafe, dan usaha kuliner', 'Klinik, sekolah, dan lembaga kursus', 'Usaha yang ingin berhenti bergantung pada media sosial saja'],
        short: 'Website 3–5 halaman yang memperkenalkan usahamu: profil, layanan, blog, dan kontak.',
        suits: 'UMKM, usaha jasa',
        faq: [
          { q: 'Berapa halaman yang saya dapat?', a: 'Paket Standar UMKM berisi 3–5 halaman inti, biasanya Beranda, Profil, Layanan, Blog, dan Kontak. Halaman tambahan bisa dibicarakan sesuai kebutuhan.' },
          { q: 'Apakah saya bisa menulis artikel blog sendiri?', a: 'Bisa diatur. Selama masa maintenance, kirimkan tulisannya lewat WhatsApp dan kami unggah; bila kamu ingin mengelola sendiri, CMS bisa ditambahkan sebagai fitur.' },
          { q: 'Apakah domain .com sudah termasuk?', a: 'Ya, domain .com, hosting, dan SSL untuk tahun pertama sudah termasuk. Biaya perpanjangan mulai tahun kedua kami sebutkan sejak awal di halaman Paket.' },
          { q: 'Bagaimana kalau saya belum punya foto dan teks?', a: 'Kami bantu menulis teks dari brief singkat dan bisa memakai foto stok berlisensi. Foto asli usahamu tetap lebih meyakinkan, jadi kami juga bisa merekomendasikan fotografer.' },
        ],
      },
      en: {
        name: 'Company Profile Website',
        title: 'Company Profile Website for Small Businesses',
        description: 'Company profile websites for small businesses: 3–5 pages, a .com domain, hosting, SSL, Google Maps and on-page SEO. Transparent pricing, 50% deposit.',
        h1: ['A ', 'company profile website', ' that makes your business trusted.'],
        lead: 'A company profile website is a multi-page website that introduces your business in full: who you are, what you sell, where you are and how to get in touch. Prospective customers often check your website before deciding to buy or work with you.',
        intro: [
          'Our Small Business Standard package includes 3–5 core pages — Home, About, Services, Blog and Contact — with a .com domain, hosting, SSL, a contact form, a WhatsApp button and a Google map.',
          'We write a clean heading and meta structure from the start, so your business name and services are easier to find on Google, including local searches such as “service in your city”.',
        ],
        forWho: ['Small businesses that want to look professional on Google', 'Service businesses: consultants, contractors, workshops, laundries, travel agents', 'Restaurants, cafés and food businesses', 'Clinics, schools and training centres', 'Businesses that want to stop relying on social media alone'],
        short: 'A 3–5 page website that introduces your business: about, services, blog and contact.',
        suits: 'Small & service businesses',
        faq: [
          { q: 'How many pages do I get?', a: 'The Small Business Standard package includes 3–5 core pages, usually Home, About, Services, Blog and Contact. Extra pages can be discussed as needed.' },
          { q: 'Can I write my own blog posts?', a: 'That can be arranged. During the maintenance period, send your posts over WhatsApp and we will publish them; if you want to manage them yourself, a CMS can be added as a feature.' },
          { q: 'Is a .com domain included?', a: 'Yes, a .com domain, hosting and SSL for the first year are included. Renewal costs from the second year are stated up front on the Pricing page.' },
          { q: 'What if I do not have photos or copy yet?', a: 'We help write the copy from a short brief and can use licensed stock photos. Real photos of your business are more convincing, so we can also recommend a photographer.' },
        ],
      },
      ms: {
        name: 'Laman Web Profil Syarikat',
        title: 'Membina Laman Web Profil Syarikat untuk PKS',
        description: 'Laman web profil syarikat untuk PKS: 3–5 halaman, domain .com, hosting, SSL, Google Maps dan SEO on-page. Harga telus dengan deposit 50%.',
        h1: ['Laman web ', 'profil syarikat', ' yang membuat perniagaan anda dipercayai.'],
        lead: 'Laman web profil syarikat ialah laman web beberapa halaman yang memperkenalkan perniagaan secara lengkap: siapa anda, apa yang dijual, di mana lokasinya dan cara menghubungi. Bakal pelanggan sering menyemak laman web sebelum membuat keputusan.',
        intro: [
          'Pakej Standard PKS kami mengandungi 3–5 halaman utama — Utama, Profil, Perkhidmatan, Blog dan Hubungi — lengkap dengan domain .com, hosting, SSL, borang hubungan, butang WhatsApp dan peta Google.',
          'Kami menyusun struktur tajuk dan meta yang kemas sejak awal, supaya nama perniagaan dan perkhidmatan anda lebih mudah ditemui di Google, termasuk carian setempat.',
        ],
        forWho: ['PKS yang ingin kelihatan profesional di Google', 'Perniagaan perkhidmatan: perunding, kontraktor, bengkel, dobi, agensi pelancongan', 'Restoran, kafe dan perniagaan makanan', 'Klinik, sekolah dan pusat latihan', 'Perniagaan yang tidak mahu bergantung pada media sosial sahaja'],
        short: 'Laman web 3–5 halaman yang memperkenalkan perniagaan anda: profil, perkhidmatan, blog dan hubungi.',
        suits: 'PKS, perniagaan perkhidmatan',
        faq: [
          { q: 'Berapa halaman yang saya dapat?', a: 'Pakej Standard PKS mengandungi 3–5 halaman utama, biasanya Utama, Profil, Perkhidmatan, Blog dan Hubungi. Halaman tambahan boleh dibincangkan mengikut keperluan.' },
          { q: 'Bolehkah saya menulis artikel blog sendiri?', a: 'Boleh diatur. Sepanjang tempoh penyelenggaraan, hantar tulisan anda melalui WhatsApp dan kami muat naik; jika anda ingin mengurus sendiri, CMS boleh ditambah sebagai ciri.' },
          { q: 'Adakah domain .com sudah termasuk?', a: 'Ya, domain .com, hosting dan SSL untuk tahun pertama sudah termasuk. Kos pembaharuan mulai tahun kedua dinyatakan sejak awal di halaman Harga.' },
          { q: 'Bagaimana jika saya belum ada foto dan teks?', a: 'Kami bantu menulis teks berdasarkan ringkasan pendek dan boleh menggunakan foto stok berlesen. Foto sebenar perniagaan anda tetap lebih meyakinkan, jadi kami juga boleh mengesyorkan jurugambar.' },
        ],
      },
    },
  },
  {
    key: 'toko-online',
    packages: ['toko-online-simple', 'toko-online-full'],
    // empat demo toko (galeri /toko-online) + dua link in bio yang menerima pesanan lewat WhatsApp (gaya Toko Online Simple)
    demoCategories: ['toko', 'linkinbio'],
    demoSlugs: ['tanur', 'takar', 'lungsin', 'daunjendela', 'jajan', 'vendra'],
    articles: ['website-vs-sosmed', 'biaya', 'website-umkm'],
    text: {
      id: {
        name: 'Toko Online',
        title: 'Jasa Pembuatan Toko Online',
        description: 'Jasa pembuatan toko online sendiri: katalog dengan order via WhatsApp, atau toko dengan keranjang, payment gateway, ongkir otomatis, dan dashboard admin.',
        h1: ['', 'Toko online', ' milikmu sendiri, tanpa potongan per transaksi dari platform.'],
        lead: 'Toko online adalah website tempat pelanggan melihat katalog produk dan memesan langsung darimu. Ada dua tingkat: katalog dengan pemesanan lewat WhatsApp untuk mulai cepat, dan toko lengkap dengan keranjang, pembayaran otomatis, dan ongkir otomatis.',
        intro: [
          'Toko Online Simple cocok untuk usaha yang pesanannya masih dilayani manual: pelanggan memilih produk di katalog, lalu pesan terkirim rapi ke WhatsApp-mu. Toko Online Full cocok bila pesanan sudah banyak: ada keranjang, payment gateway, ongkir otomatis lewat RajaOngkir, dan dashboard untuk mengelola produk serta pesanan.',
          'Marketplace tetap berguna untuk menjangkau pembeli baru. Toko online sendiri melengkapinya: data pelanggan milikmu, tampilan sesuai merek, dan tidak ada aturan platform yang tiba-tiba berubah.',
        ],
        forWho: ['Toko ritel, fesyen, dan produk kerajinan', 'Usaha makanan dengan pre-order', 'Penjual yang sudah ramai di marketplace dan ingin kanal sendiri', 'Distributor atau reseller dengan katalog produk', 'Usaha yang ingin mengurangi ketergantungan pada satu platform'],
        short: 'Katalog dengan order via WhatsApp, sampai toko lengkap dengan keranjang, payment gateway, dan ongkir otomatis.',
        suits: 'Toko ritel, kuliner, reseller',
        faq: [
          { q: 'Apa beda Toko Online Simple dan Toko Online Full?', a: 'Simple berisi katalog hingga 20 produk dengan pemesanan lewat WhatsApp dan CMS ringan. Full menambahkan keranjang belanja, checkout lengkap, payment gateway, ongkir otomatis, dan dashboard admin untuk pesanan.' },
          { q: 'Apakah saya perlu meninggalkan marketplace?', a: 'Tidak perlu. Banyak penjual memakai keduanya: marketplace untuk pembeli baru, toko online sendiri untuk pelanggan setia, promosi, dan data pelanggan yang kamu kelola sendiri.' },
          { q: 'Bisakah saya mengubah produk dan harga sendiri?', a: 'Bisa. Kedua paket toko online dilengkapi pengelolaan produk, jadi kamu bisa menambah, mengubah, atau menonaktifkan produk tanpa menghubungi kami.' },
          { q: 'Metode pembayaran apa yang didukung?', a: 'Pada Toko Online Full, pembayaran berjalan lewat payment gateway yang kami integrasikan sesuai kebutuhanmu. Pada Toko Online Simple, pembayaran diatur langsung antara kamu dan pembeli setelah pesanan masuk lewat WhatsApp.' },
        ],
      },
      en: {
        name: 'Online Store',
        title: 'Online Store Development',
        description: 'Your own online store, from a WhatsApp order catalogue to a full shop with a cart, payment gateway, automatic shipping rates and an admin dashboard.',
        h1: ['An ', 'online store', ' of your own, with no platform cut on every sale.'],
        lead: 'An online store is a website where customers browse your product catalogue and order directly from you. It comes in two levels: a catalogue with ordering via WhatsApp to get started quickly, and a full store with a cart, automatic payments and automatic shipping rates.',
        intro: [
          'The Simple Online Store suits businesses that still handle orders by hand: customers choose products in the catalogue and a tidy order message lands in your WhatsApp. The Full Online Store suits higher order volumes: a cart, a payment gateway, automatic shipping rates via RajaOngkir (for shipping within Indonesia) and a dashboard to manage products and orders.',
          'Marketplaces are still useful for reaching new buyers. Your own store complements them: the customer data is yours, the look matches your brand, and there are no platform rules that change overnight.',
        ],
        forWho: ['Retail, fashion and craft shops', 'Food businesses taking pre-orders', 'Sellers busy on marketplaces who want their own channel', 'Distributors or resellers with a product catalogue', 'Businesses that want to depend less on one platform'],
        short: 'A catalogue with orders via WhatsApp, up to a full store with a cart, payment gateway and automatic shipping.',
        suits: 'Retail, food, resellers',
        faq: [
          { q: 'What is the difference between the Simple and Full Online Store?', a: 'Simple is a catalogue of up to 20 products with ordering via WhatsApp and a lightweight CMS. Full adds a shopping cart, complete checkout, a payment gateway, automatic shipping rates and an admin dashboard for orders.' },
          { q: 'Do I need to leave the marketplaces?', a: 'No. Many sellers use both: marketplaces for new buyers, and their own store for loyal customers, promotions and customer data they control.' },
          { q: 'Can I change products and prices myself?', a: 'Yes. Both online store packages include product management, so you can add, edit or hide products without contacting us.' },
          { q: 'Which payment methods are supported?', a: 'On the Full Online Store, payments run through a payment gateway we integrate to suit your needs. On the Simple Online Store, payment is arranged directly between you and the buyer after the order arrives on WhatsApp.' },
        ],
      },
      ms: {
        name: 'Kedai Dalam Talian',
        title: 'Membina Kedai Dalam Talian',
        description: 'Kedai dalam talian milik anda: katalog dengan pesanan melalui WhatsApp, atau kedai lengkap dengan troli, gerbang pembayaran dan papan pemuka admin.',
        h1: ['', 'Kedai dalam talian', ' milik anda sendiri, tanpa potongan platform setiap jualan.'],
        lead: 'Kedai dalam talian ialah laman web tempat pelanggan melihat katalog produk dan membuat pesanan terus daripada anda. Terdapat dua tahap: katalog dengan pesanan melalui WhatsApp untuk bermula cepat, dan kedai lengkap dengan troli, pembayaran automatik dan kos penghantaran automatik.',
        intro: [
          'Kedai Online Ringkas sesuai untuk perniagaan yang masih melayan pesanan secara manual: pelanggan memilih produk dalam katalog, lalu mesej pesanan yang kemas sampai ke WhatsApp anda. Kedai Online Penuh sesuai apabila pesanan sudah banyak: troli, gerbang pembayaran, kos penghantaran automatik melalui RajaOngkir (untuk penghantaran dalam Indonesia) dan papan pemuka untuk mengurus produk serta pesanan.',
          'Platform pasaran tetap berguna untuk mencapai pembeli baharu. Kedai sendiri melengkapinya: data pelanggan milik anda, paparan mengikut jenama, dan tiada peraturan platform yang tiba-tiba berubah.',
        ],
        forWho: ['Kedai runcit, fesyen dan kraf', 'Perniagaan makanan dengan pra-tempahan', 'Penjual yang sudah aktif di platform pasaran dan mahu saluran sendiri', 'Pengedar atau penjual semula dengan katalog produk', 'Perniagaan yang mahu kurang bergantung pada satu platform'],
        short: 'Katalog dengan pesanan melalui WhatsApp, hingga kedai lengkap dengan troli, gerbang pembayaran dan penghantaran automatik.',
        suits: 'Runcit, makanan, penjual semula',
        faq: [
          { q: 'Apakah beza Kedai Online Ringkas dan Kedai Online Penuh?', a: 'Ringkas ialah katalog sehingga 20 produk dengan pesanan melalui WhatsApp dan CMS ringan. Penuh menambah troli beli-belah, proses pembayaran lengkap, gerbang pembayaran, kos penghantaran automatik dan papan pemuka admin untuk pesanan.' },
          { q: 'Perlukah saya meninggalkan platform pasaran?', a: 'Tidak perlu. Ramai penjual menggunakan kedua-duanya: platform pasaran untuk pembeli baharu, kedai sendiri untuk pelanggan setia, promosi dan data pelanggan yang anda kawal.' },
          { q: 'Bolehkah saya mengubah produk dan harga sendiri?', a: 'Boleh. Kedua-dua pakej kedai dalam talian dilengkapi pengurusan produk, jadi anda boleh menambah, mengubah atau menyembunyikan produk tanpa menghubungi kami.' },
          { q: 'Kaedah pembayaran apakah yang disokong?', a: 'Pada Kedai Online Penuh, pembayaran melalui gerbang pembayaran yang kami integrasikan mengikut keperluan anda. Pada Kedai Online Ringkas, pembayaran diatur terus antara anda dan pembeli selepas pesanan masuk melalui WhatsApp.' },
        ],
      },
    },
  },
  {
    key: 'portofolio',
    packages: ['portofolio'],
    demoCategories: ['portfolio'],
    articles: ['website-vs-sosmed', 'seo-checklist'],
    text: {
      id: {
        name: 'Website Portofolio',
        title: 'Jasa Pembuatan Website Portofolio',
        description: 'Website portofolio dan personal branding untuk desainer, developer, fotografer, dan freelancer: karya, studi kasus, blog, dan kontak. Lihat {{demos:portfolio}} demonya.',
        h1: ['Website ', 'portofolio', ' yang membuat karyamu dilirik klien.'],
        lead: 'Website portofolio adalah etalase karya pribadi: tempat klien atau perekrut melihat apa yang sudah kamu kerjakan, cara kamu bekerja, dan cara menghubungi. Dibanding PDF atau media sosial, website portofolio punya alamat sendiri dan bisa ditemukan lewat Google.',
        intro: [
          'Paket Portofolio berisi halaman Tentang, Karya, Blog, dan Kontak, dengan tautan ke WhatsApp, LinkedIn, Instagram, atau kanalmu yang lain. Struktur judulnya kami susun rapi supaya nama dan keahlianmu mudah dibaca mesin pencari.',
          'Ada {{demos:portfolio}} gaya portofolio di galeri kami — dari minimal editorial sampai neo-brutalis — yang bisa dicoba langsung, lengkap dengan studi kasus dan mode terang/gelap.',
        ],
        forWho: ['Desainer UI/UX, grafis, dan ilustrator', 'Developer dan creative technologist', 'Fotografer, videografer, dan penulis', 'Freelancer yang mencari klien langsung', 'Profesional yang sedang melamar kerja'],
        short: 'Etalase karya untuk freelancer, kreator, dan profesional, lengkap dengan studi kasus.',
        suits: 'Freelancer, kreator',
        faq: [
          { q: 'Apakah saya bisa menambah karya baru sendiri?', a: 'Kirim karya baru lewat WhatsApp dan kami tambahkan; untuk pembaruan rutin tersedia layanan tambahan maintenance bulanan. Bila kamu sering memperbarui portofolio, CMS bisa ditambahkan agar kamu mengelolanya sendiri.' },
          { q: 'Apakah persona di demo portofolio itu nyata?', a: 'Tidak. Persona di demo portofolio kami fiktif; saat dipesan, semua isinya diganti dengan karya, foto, dan kontak milikmu.' },
          { q: 'Apakah perlu domain dengan nama saya sendiri?', a: 'Sangat disarankan. Domain + hosting + SSL untuk tahun pertama sudah termasuk di paket Portofolio, dan alamat dengan namamu lebih mudah diingat klien.' },
        ],
      },
      en: {
        name: 'Portfolio Website',
        title: 'Portfolio & Personal Branding Websites',
        description: 'Portfolio websites for designers, developers, photographers and freelancers: work pages, case studies, a blog and contact. See {{demos:portfolio}} live portfolio demos.',
        h1: ['A ', 'portfolio website', ' that gets your work noticed.'],
        lead: 'A portfolio website is a personal showcase of your work: where clients or recruiters see what you have done, how you work and how to reach you. Compared with a PDF or social media, it has its own address and can be found on Google.',
        intro: [
          'The Portfolio package includes About, Work, Blog and Contact pages, with links to WhatsApp, LinkedIn, Instagram or your other channels. We keep the heading structure tidy so search engines can clearly read your name and skills.',
          'The {{demos:portfolio}} portfolio styles in our gallery — from minimal editorial to neo-brutalist — can be tried right now, complete with case studies and light/dark modes.',
        ],
        forWho: ['UI/UX and graphic designers, illustrators', 'Developers and creative technologists', 'Photographers, videographers and writers', 'Freelancers looking for direct clients', 'Professionals applying for jobs'],
        short: 'A showcase of work for freelancers, creators and professionals, complete with case studies.',
        suits: 'Freelancers, creators',
        faq: [
          { q: 'Can I add new work myself?', a: 'Send new work over WhatsApp and we will add it; for regular updates, a monthly maintenance add-on is available. If you update your portfolio often, a CMS can be added so you can manage it yourself.' },
          { q: 'Are the people in the portfolio demos real?', a: 'No. The personas in our portfolio demos are fictional; when you order, everything is replaced with your own work, photos and contact details.' },
          { q: 'Do I need a domain with my own name?', a: 'We strongly recommend it. A domain, hosting and SSL for the first year are included in the Portfolio package, and an address with your name is easier for clients to remember.' },
        ],
      },
      ms: {
        name: 'Laman Web Portfolio',
        title: 'Membina Laman Web Portfolio & Jenama Peribadi',
        description: 'Laman web portfolio dan jenama peribadi untuk pereka, pembangun, jurugambar dan pekerja bebas: karya, kajian kes, blog dan hubungi. Lihat {{demos:portfolio}} demo.',
        h1: ['Laman web ', 'portfolio', ' yang membuatkan karya anda dilihat.'],
        lead: 'Laman web portfolio ialah pameran karya peribadi: tempat pelanggan atau perekrut melihat apa yang telah anda hasilkan, cara anda bekerja dan cara menghubungi. Berbanding PDF atau media sosial, ia mempunyai alamat sendiri dan boleh ditemui melalui Google.',
        intro: [
          'Pakej Portfolio mengandungi halaman Tentang, Karya, Blog dan Hubungi, dengan pautan ke WhatsApp, LinkedIn, Instagram atau saluran anda yang lain. Struktur tajuknya kami susun kemas supaya nama dan kepakaran anda mudah dibaca enjin carian.',
          'Terdapat {{demos:portfolio}} gaya portfolio dalam galeri kami — dari editorial minimalis hingga neo-brutalis — yang boleh dicuba sekarang, lengkap dengan kajian kes dan mod cerah/gelap.',
        ],
        forWho: ['Pereka UI/UX, grafik dan ilustrator', 'Pembangun dan teknologis kreatif', 'Jurugambar, jurukamera video dan penulis', 'Pekerja bebas yang mencari pelanggan terus', 'Profesional yang sedang memohon kerja'],
        short: 'Pameran karya untuk pekerja bebas, pencipta kandungan dan profesional, lengkap dengan kajian kes.',
        suits: 'Pekerja bebas, pencipta',
        faq: [
          { q: 'Bolehkah saya menambah karya baharu sendiri?', a: 'Hantar karya baharu melalui WhatsApp dan kami tambahkan; untuk kemas kini berkala, perkhidmatan tambahan penyelenggaraan bulanan tersedia. Jika anda kerap mengemas kini portfolio, CMS boleh ditambah supaya anda mengurusnya sendiri.' },
          { q: 'Adakah persona dalam demo portfolio itu nyata?', a: 'Tidak. Persona dalam demo portfolio kami adalah rekaan; apabila ditempah, semua kandungan diganti dengan karya, foto dan maklumat hubungan anda.' },
          { q: 'Perlukah domain dengan nama saya sendiri?', a: 'Sangat disyorkan. Domain + hosting + SSL untuk tahun pertama sudah termasuk dalam pakej Portfolio, dan alamat dengan nama anda lebih mudah diingati pelanggan.' },
        ],
      },
    },
  },
  {
    key: 'website-custom',
    packages: ['sistem-reservasi', 'website-properti', 'marketplace-properti', 'aplikasi-web', 'website-custom'],
    demoCategories: ['reservasi', 'properti', 'todo'],
    demoSlugs: ['restoran', 'klinik', 'hotel', 'lumora', 'homigo', 'kanban-board'],
    articles: ['pilih-jasa', 'biaya'],
    text: {
      id: {
        name: 'Website Custom & Aplikasi Web',
        title: 'Jasa Pembuatan Website Custom & Aplikasi Web',
        description: 'Jasa pembuatan website custom dan aplikasi web dengan Next.js: sistem reservasi, katalog properti, area member, dan integrasi API. Coba demonya.',
        h1: ['Website custom untuk ', 'kebutuhan yang tidak muat di template.'],
        lead: 'Website custom adalah website yang desain, alur, dan fiturnya dibuat khusus untuk proses bisnismu — misalnya sistem reservasi, katalog properti dengan filter, area member, atau integrasi dengan sistem yang sudah kamu pakai.',
        intro: [
          'Proyek custom dimulai dari memetakan alur: siapa penggunanya, data apa yang masuk, dan apa yang harus terjadi setelahnya. Dari situ kami menyusun penawaran tertulis dengan ruang lingkup yang jelas sebelum ada baris kode yang ditulis.',
          'Demonya bisa dicoba di galeri kami: {{demos:reservasi}} sistem reservasi (restoran, hotel, klinik, futsal, bioskop), {{demos:properti}} marketplace properti, dan {{demos:todo}} aplikasi produktivitas.',
        ],
        forWho: ['Restoran, hotel, klinik, dan lapangan yang butuh reservasi online', 'Agen dan pengembang properti', 'Startup yang membangun produk web pertama', 'Instansi dan sekolah dengan formulir atau alur khusus', 'Usaha yang ingin menghubungkan website dengan sistem yang sudah ada'],
        short: 'Sistem reservasi, katalog properti, aplikasi web, atau fitur khusus lain sesuai kebutuhan bisnis.',
        suits: 'Startup, instansi, sistem khusus',
        faq: [
          { q: 'Bagaimana harga website custom ditentukan?', a: 'Dari ruang lingkup: jumlah halaman, fitur, integrasi, dan peran pengguna. Sistem reservasi mulai {{from:sistem-reservasi}}, website properti mulai {{from:website-properti}}, dan aplikasi web mulai {{from:aplikasi-web}}. Website custom tidak punya harga patokan: harganya dihitung sesuai kebutuhan setelah konsultasi gratis, dan angka pastinya ada di penawaran tertulis yang kamu setujui sebelum pengerjaan.' },
          { q: 'Apakah bisa terhubung dengan sistem yang sudah saya pakai?', a: 'Bisa, selama sistem tersebut menyediakan API atau cara pertukaran data. Kami cek dokumentasinya dulu sebelum menjanjikan integrasi.' },
          { q: 'Siapa pemilik kodenya?', a: 'Kamu. Setelah pelunasan, source code, akses hosting, domain, dan database diserahkan sepenuhnya.' },
          { q: 'Apakah ada dukungan setelah website online?', a: `Ya, ada garansi perbaikan bug dan maintenance & support teknis 3 bulan di paket Website Custom, yang bisa diperpanjang.` },
        ],
      },
      en: {
        name: 'Custom Website & Web App',
        title: 'Custom Website & Web App Development',
        description: 'Custom websites and web apps with Next.js: booking systems, property catalogues, member areas and API integrations. Try our booking and property demos.',
        h1: ['Custom websites for ', 'needs that do not fit a template.'],
        lead: 'A custom website is one whose design, flow and features are built specifically around how your business works — for example a booking system, a property catalogue with filters, a member area or an integration with a system you already use.',
        intro: [
          'A custom project starts by mapping the flow: who the users are, what data comes in and what must happen next. From there we prepare a written quote with a clear scope before a single line of code is written.',
          'You can try demos in our gallery: {{demos:reservasi}} booking systems (restaurant, hotel, clinic, futsal court, cinema), {{demos:properti}} property marketplaces and {{demos:todo}} productivity apps.',
        ],
        forWho: ['Restaurants, hotels, clinics and courts that need online booking', 'Property agents and developers', 'Start-ups building their first web product', 'Institutions and schools with special forms or workflows', 'Businesses connecting their website to existing systems'],
        short: 'Booking systems, property catalogues, web apps or other bespoke features for your business.',
        suits: 'Start-ups, institutions, bespoke systems',
        faq: [
          { q: 'How is the price of a custom website decided?', a: 'By scope: the number of pages, features, integrations and user roles. Booking systems start at {{from:sistem-reservasi}}, property websites at {{from:website-properti}} and web apps at {{from:aplikasi-web}}. A custom website has no list price: it is priced to your needs after a free consultation, and the exact figure is in the written quote you approve before work starts.' },
          { q: 'Can it connect to a system I already use?', a: 'Yes, as long as that system offers an API or another way to exchange data. We check its documentation before promising an integration.' },
          { q: 'Who owns the code?', a: 'You do. Once the final payment is made, the source code, hosting, domain and database access are handed over in full.' },
          { q: 'Is there support after launch?', a: 'Yes, there is a bug-fix guarantee and 3 months of maintenance and technical support in the Custom Website package, which can be extended.' },
        ],
      },
      ms: {
        name: 'Laman Web Tersuai & Aplikasi Web',
        title: 'Membina Laman Web Tersuai & Aplikasi Web',
        description: 'Laman web tersuai dan aplikasi web dengan Next.js: sistem tempahan, katalog hartanah, ruang ahli dan integrasi API. Cuba demo tempahan & hartanah kami.',
        h1: ['Laman web tersuai untuk ', 'keperluan yang tidak muat dalam templat.'],
        lead: 'Laman web tersuai ialah laman web yang reka bentuk, aliran dan cirinya dibina khas mengikut proses perniagaan anda — contohnya sistem tempahan, katalog hartanah dengan penapis, ruang ahli atau integrasi dengan sistem yang sedia digunakan.',
        intro: [
          'Projek tersuai bermula dengan memetakan aliran: siapa penggunanya, data apa yang masuk dan apa yang perlu berlaku seterusnya. Dari situ kami sediakan sebut harga bertulis dengan skop yang jelas sebelum sebarang kod ditulis.',
          'Demonya boleh dicuba dalam galeri kami: {{demos:reservasi}} sistem tempahan (restoran, hotel, klinik, futsal, panggung wayang), {{demos:properti}} pasaran hartanah dan {{demos:todo}} aplikasi produktiviti.',
        ],
        forWho: ['Restoran, hotel, klinik dan gelanggang yang memerlukan tempahan dalam talian', 'Ejen dan pemaju hartanah', 'Syarikat pemula yang membina produk web pertama', 'Institusi dan sekolah dengan borang atau aliran khas', 'Perniagaan yang ingin menghubungkan laman web dengan sistem sedia ada'],
        short: 'Sistem tempahan, katalog hartanah, aplikasi web atau ciri khas lain mengikut keperluan perniagaan.',
        suits: 'Syarikat pemula, institusi, sistem khas',
        faq: [
          { q: 'Bagaimanakah harga laman web tersuai ditentukan?', a: 'Berdasarkan skop: bilangan halaman, ciri, integrasi dan peranan pengguna. Sistem tempahan bermula {{from:sistem-reservasi}}, laman web hartanah {{from:website-properti}} dan aplikasi web {{from:aplikasi-web}}. Laman web tersuai tiada harga tetap: harganya dikira ikut keperluan selepas konsultasi percuma, dan angka tepatnya dalam sebut harga bertulis yang anda luluskan sebelum kerja bermula.' },
          { q: 'Bolehkah ia disambungkan dengan sistem yang saya gunakan?', a: 'Boleh, selagi sistem itu menyediakan API atau cara pertukaran data. Kami semak dokumentasinya dahulu sebelum menjanjikan integrasi.' },
          { q: 'Siapakah pemilik kodnya?', a: 'Anda. Selepas bayaran penuh, kod sumber, akses hosting, domain dan pangkalan data diserahkan sepenuhnya.' },
          { q: 'Adakah sokongan selepas pelancaran?', a: 'Ya, terdapat jaminan pembaikan pepijat serta penyelenggaraan & sokongan teknikal 3 bulan dalam pakej Laman Web Tersuai, yang boleh dilanjutkan.' },
        ],
      },
    },
  },
  {
    // Aplikasi Android & iOS (23 Okt 2026): React Native + Expo, satu kode untuk Android, iOS, dan web. PintuWeb menyerahkan
    // file aplikasi + kode sumber; rilis ke Play Store/App Store diurus klien (akun developer milik klien). Tahap kerja
    // (`steps`) dan ubin "Diserahkan" (`handover`) menggantikan versi website yang umum ("siap SEO", "website online"). Garansi bug {{guarantee}} hari
    // berlaku sejak aplikasi diserahkan (keputusan pemilik 23 Okt 2026), jadi ubin garansi tetap tampil di samping ubin serah terima.
    key: 'aplikasi-mobile',
    packages: ['aplikasi-mobile'],
    demoCategories: ['mobile'],
    demoSlugs: ['kasir', 'booking', 'member', 'sekolah', 'absensi', 'antar'],
    articles: ['jarak-jauh', 'pilih-jasa'],
    text: {
      id: {
        name: 'Aplikasi Android & iOS',
        title: 'Jasa Pembuatan Aplikasi Android & iOS',
        description: 'Jasa pembuatan aplikasi Android & iOS untuk usaha: kasir, booking, member, sekolah, absensi. Satu kode React Native, mulai {{from:aplikasi-mobile}}. Coba {{demos:mobile}} demonya.',
        h1: ['', 'Aplikasi Android & iOS', ' untuk usahamu, dibangun dari satu kode.'],
        lead: 'Aplikasi mobile adalah aplikasi yang dipasang di HP pelanggan atau timmu, misalnya untuk kasir, booking, kartu member, absensi, atau info sekolah. Kami membangunnya dengan React Native dan Expo: satu kode menghasilkan aplikasi Android, aplikasi iOS, sekaligus versi web.',
        intro: [
          'Kapan aplikasi lebih tepat daripada website? Saat penggunanya datang berkali-kali: kasir yang dibuka setiap hari, pelanggan yang mengumpulkan poin, orang tua yang mengecek nilai, atau karyawan yang absen tiap pagi. Aplikasi bisa menyimpan data di HP, tetap berjalan saat sinyal hilang bila diperlukan, dan mengirim notifikasi.',
          'Yang kami serahkan adalah file aplikasi beserta kode sumbernya. Rilis ke Google Play dan App Store kamu urus sendiri dengan akun developer atas namamu, jadi aplikasinya terdaftar atas nama usahamu sejak awal. Di galeri kami ada {{demos:mobile}} demo aplikasi yang bisa langsung dicoba di browser.',
        ],
        forWho: ['UMKM yang butuh kasir dan catatan stok di HP', 'Kafe, salon, dan barbershop dengan member atau booking', 'Sekolah, masjid, dan komunitas yang rutin berbagi info', 'Usaha dengan karyawan shift: absensi, jadwal, dan cuti', 'Laundry, kos, dan usaha jasa dengan pelanggan tetap', 'Penyelenggara acara yang menjual tiket'],
        short: 'Aplikasi HP untuk Android dan iOS dari satu kode, lengkap dengan versi webnya.',
        suits: 'Kasir, member, booking, sekolah',
        faq: [
          { q: 'Apakah aplikasinya bisa dipakai di Android dan iPhone?', a: 'Bisa. Aplikasi dibangun dengan React Native dan Expo, jadi satu kode menghasilkan aplikasi Android dan iOS, ditambah versi web yang bisa dibuka di browser.' },
          { q: 'Apakah PintuWeb yang merilis aplikasi ke Play Store dan App Store?', a: 'Tidak. Kami menyerahkan file aplikasi beserta kode sumbernya; rilis ke Google Play dan App Store kamu urus sendiri dengan akun developer atas namamu (Google Play Console dan Apple Developer Program, keduanya berbayar). Dengan begitu aplikasinya terdaftar atas nama usahamu. Garansi perbaikan bug {{guarantee}} hari berlaku sejak aplikasi diserahkan.' },
          { q: 'Berapa biaya dan lama pembuatan aplikasi?', a: 'Kisarannya {{price:aplikasi-mobile}}, dengan pengerjaan {{duration:aplikasi-mobile}} setelah isi dan alur aplikasinya lengkap. Angka pastinya tergantung jumlah layar dan fitur, dan tertulis di penawaran sebelum mulai. DP 50% untuk memulai.' },
          { q: 'Apakah demo aplikasinya bisa dicoba tanpa memasang apa pun?', a: 'Bisa. Demo di galeri adalah versi web dari aplikasi yang sama, jadi bisa dibuka langsung di browser HP atau laptop. Usaha dan data di demo itu fiktif.' },
        ],
        steps: [
          { title: 'Ngobrol dulu', desc: 'Ceritakan siapa pengguna aplikasinya dan apa yang perlu mereka lakukan. Kami usulkan fitur dan mengirim penawaran tertulis.' },
          { title: 'Rancang layar', desc: 'Kami susun alur dan desain tiap layar. Kamu setujui tampilannya sebelum kami mulai membangun.' },
          { title: 'Bangun & coba', desc: 'Aplikasi dibangun dari satu kode untuk Android, iOS, dan web. Progresnya bisa kamu coba lewat pratinjau versi web.' },
          { title: 'Serah terima', desc: 'File aplikasi dan kode sumbernya kami serahkan. Rilis ke Play Store dan App Store kamu lakukan dengan akun developer milikmu.' },
        ],
        handover: { label: 'Diserahkan', value: 'File aplikasi + kode sumber' },
      },
      en: {
        name: 'Android & iOS Apps',
        title: 'Android & iOS App Development',
        description: 'Android & iOS apps for businesses: point of sale, booking, loyalty, schools, attendance. One React Native codebase, from {{from:aplikasi-mobile}}. Try {{demos:mobile}} demos.',
        h1: ['', 'Android & iOS apps', ' for your business, built from one codebase.'],
        lead: 'A mobile app is installed on your customers’ or your team’s phones, for things like a point of sale, bookings, a loyalty card, attendance or school updates. We build with React Native and Expo: one codebase produces the Android app, the iOS app and a web version.',
        intro: [
          'When is an app a better fit than a website? When people come back again and again: a till opened every day, customers collecting points, parents checking grades or staff clocking in each morning. An app can keep data on the phone, keep working without a signal where needed, and send notifications.',
          'What we hand over is the app files and their source code. You publish to Google Play and the App Store yourself, with developer accounts in your name, so the app is registered to your business from the start. Our gallery has {{demos:mobile}} demo apps you can try in the browser right now.',
        ],
        forWho: ['Small businesses that need a till and stock records on a phone', 'Cafés, salons and barbershops with loyalty or bookings', 'Schools, mosques and communities that share regular updates', 'Businesses with shift staff: attendance, rosters and leave', 'Laundries, boarding houses and services with regular customers', 'Event organisers selling tickets'],
        short: 'Phone apps for Android and iOS from one codebase, with a web version too.',
        suits: 'Point of sale, loyalty, booking, schools',
        faq: [
          { q: 'Will the app work on both Android and iPhone?', a: 'Yes. Apps are built with React Native and Expo, so one codebase produces the Android and iOS apps, plus a web version that opens in a browser.' },
          { q: 'Does PintuWeb publish the app to the Play Store and App Store?', a: 'No. We hand over the app files and their source code; you publish to Google Play and the App Store yourself with developer accounts in your name (Google Play Console and the Apple Developer Program, both paid). That way the app is registered to your business. The {{guarantee}}-day bug-fix guarantee runs from the day the app is handed over.' },
          { q: 'How much does an app cost and how long does it take?', a: 'The range is {{price:aplikasi-mobile}}, with {{duration:aplikasi-mobile}} of work once the app’s content and flows are complete. The exact figure depends on the number of screens and features, and is in a written quote before we start. A 50% deposit starts the work.' },
          { q: 'Can I try the demo apps without installing anything?', a: 'Yes. The demos in our gallery are the web version of the same apps, so they open straight in a phone or laptop browser. The businesses and data in them are fictional.' },
        ],
        steps: [
          { title: 'Talk first', desc: 'Tell us who will use the app and what they need to do. We suggest the features and send a written quote.' },
          { title: 'Design the screens', desc: 'We lay out the flow and design of each screen. You approve the look before we start building.' },
          { title: 'Build & try', desc: 'The app is built from one codebase for Android, iOS and the web. You can follow progress through a web preview.' },
          { title: 'Handover', desc: 'We hand over the app files and source code. You publish to the Play Store and App Store with your own developer accounts.' },
        ],
        handover: { label: 'Handed over', value: 'App files + source code' },
      },
      ms: {
        name: 'Aplikasi Android & iOS',
        title: 'Membina Aplikasi Android & iOS',
        description: 'Aplikasi Android & iOS untuk perniagaan: juruwang, tempahan, ahli, sekolah, kehadiran. Satu kod React Native, dari {{from:aplikasi-mobile}}. Cuba {{demos:mobile}} demo.',
        h1: ['', 'Aplikasi Android & iOS', ' untuk perniagaan anda, dibina daripada satu kod.'],
        lead: 'Aplikasi mudah alih ialah aplikasi yang dipasang di telefon pelanggan atau pasukan anda, contohnya untuk juruwang, tempahan, kad ahli, kehadiran atau maklumat sekolah. Kami membinanya dengan React Native dan Expo: satu kod menghasilkan aplikasi Android, aplikasi iOS dan juga versi web.',
        intro: [
          'Bilakah aplikasi lebih sesuai daripada laman web? Apabila penggunanya kembali berulang kali: juruwang yang dibuka setiap hari, pelanggan yang mengumpul mata ganjaran, ibu bapa yang menyemak markah atau pekerja yang merekod kehadiran setiap pagi. Aplikasi boleh menyimpan data di telefon, terus berfungsi tanpa isyarat jika perlu, dan menghantar pemberitahuan.',
          'Yang kami serahkan ialah fail aplikasi berserta kod sumbernya. Penerbitan ke Google Play dan App Store diuruskan sendiri oleh anda dengan akaun pembangun atas nama anda, jadi aplikasi itu didaftarkan atas nama perniagaan anda sejak awal. Galeri kami mempunyai {{demos:mobile}} demo aplikasi yang boleh dicuba terus dalam pelayar.',
        ],
        forWho: ['PKS yang memerlukan juruwang dan rekod stok di telefon', 'Kafe, salun dan kedai gunting rambut dengan keahlian atau tempahan', 'Sekolah, masjid dan komuniti yang kerap berkongsi maklumat', 'Perniagaan dengan pekerja syif: kehadiran, jadual dan cuti', 'Dobi, rumah sewa dan perkhidmatan dengan pelanggan tetap', 'Penganjur acara yang menjual tiket'],
        short: 'Aplikasi telefon untuk Android dan iOS daripada satu kod, lengkap dengan versi web.',
        suits: 'Juruwang, ahli, tempahan, sekolah',
        faq: [
          { q: 'Bolehkah aplikasi digunakan di Android dan iPhone?', a: 'Boleh. Aplikasi dibina dengan React Native dan Expo, jadi satu kod menghasilkan aplikasi Android dan iOS, serta versi web yang boleh dibuka dalam pelayar.' },
          { q: 'Adakah PintuWeb yang menerbitkan aplikasi ke Play Store dan App Store?', a: 'Tidak. Kami menyerahkan fail aplikasi berserta kod sumbernya; penerbitan ke Google Play dan App Store diuruskan sendiri oleh anda dengan akaun pembangun atas nama anda (Google Play Console dan Apple Developer Program, kedua-duanya berbayar). Dengan itu aplikasi didaftarkan atas nama perniagaan anda. Jaminan pembaikan pepijat {{guarantee}} hari bermula sejak aplikasi diserahkan.' },
          { q: 'Berapakah kos dan tempoh membina aplikasi?', a: 'Julatnya {{price:aplikasi-mobile}}, dengan tempoh kerja {{duration:aplikasi-mobile}} selepas kandungan dan aliran aplikasi lengkap. Angka tepatnya bergantung pada bilangan skrin dan ciri, dan dinyatakan dalam sebut harga sebelum bermula. Deposit 50% untuk bermula.' },
          { q: 'Bolehkah demo aplikasi dicuba tanpa memasang apa-apa?', a: 'Boleh. Demo dalam galeri ialah versi web daripada aplikasi yang sama, jadi boleh dibuka terus dalam pelayar telefon atau komputer riba. Perniagaan dan data dalam demo itu rekaan.' },
        ],
        steps: [
          { title: 'Berbincang dahulu', desc: 'Ceritakan siapa pengguna aplikasi dan apa yang perlu mereka lakukan. Kami cadangkan ciri dan menghantar sebut harga bertulis.' },
          { title: 'Reka skrin', desc: 'Kami susun aliran dan reka bentuk setiap skrin. Anda luluskan paparannya sebelum kami mula membina.' },
          { title: 'Bina & cuba', desc: 'Aplikasi dibina daripada satu kod untuk Android, iOS dan web. Kemajuannya boleh anda cuba melalui pratonton versi web.' },
          { title: 'Serahan', desc: 'Fail aplikasi dan kod sumbernya kami serahkan. Penerbitan ke Play Store dan App Store anda lakukan dengan akaun pembangun sendiri.' },
        ],
        handover: { label: 'Diserahkan', value: 'Fail aplikasi + kod sumber' },
      },
    },
  },
  {
    key: 'undangan-digital',
    packages: ['undangan-digital', 'situs-acara'],
    demoCategories: ['undangan'],
    articles: ['undangan'],
    text: {
      id: {
        name: 'Undangan Digital',
        title: 'Jasa Pembuatan Undangan Digital (Website)',
        description: 'Jasa undangan digital berbentuk website untuk pernikahan, khitanan, wisuda, dan acara kantor: RSVP, hitung mundur, peta, galeri, musik. Lihat {{demos:undangan}} tema live.',
        h1: ['', 'Undangan digital', ' yang dibuka, dibaca, dan dibalas tamu.'],
        lead: 'Undangan digital adalah undangan acara berbentuk halaman web yang dikirim lewat tautan — biasanya melalui WhatsApp. Tamu bisa melihat waktu dan lokasi acara, membuka peta, mengonfirmasi kehadiran (RSVP), dan menyimpan tanggalnya dari satu tautan.',
        intro: [
          'Galeri kami berisi {{demos:undangan}} tema dengan karakter berbeda, bukan satu desain yang diganti warna: pernikahan, lamaran, khitanan, aqiqah, ulang tahun, wisuda, reuni, hingga situs acara korporat dengan agenda dan pendaftaran peserta.',
          'Fitur yang bisa dipilih antara lain amplop pembuka, hitung mundur, peta lokasi, galeri foto, musik latar, dan formulir RSVP. Undangan dari tema galeri mulai {{from:undangan-digital}}; untuk acara kantor atau desain khusus, paket Situs Acara mulai {{from:situs-acara}}.',
        ],
        forWho: ['Pasangan yang menyiapkan pernikahan atau lamaran', 'Keluarga yang mengadakan khitanan atau aqiqah', 'Panitia reuni, wisuda, dan ulang tahun', 'Perusahaan yang mengadakan konferensi, peluncuran, atau gathering', 'Siapa pun yang ingin undangan mudah dibagikan lewat WhatsApp'],
        includes: ['Halaman undangan dengan tautan sendiri', 'Detail acara: tanggal, waktu, dan lokasi dengan peta', 'Hitung mundur menuju acara', 'Formulir konfirmasi kehadiran (RSVP)', 'Galeri foto dan musik latar (opsional)', 'Tampilan yang nyaman di layar ponsel kecil'],
        short: 'Undangan berbentuk website untuk pernikahan, khitanan, wisuda, reuni, hingga acara kantor.',
        suits: 'Pernikahan, keluarga, acara kantor',
        faq: [
          { q: 'Berapa harga undangan digital?', a: 'Mulai {{from:undangan-digital}} untuk undangan dari tema galeri (kisaran {{price:undangan-digital}}, selesai {{duration:undangan-digital}}), dan mulai {{from:situs-acara}} untuk situs acara atau desain khusus. Undangan aktif 12 bulan tanpa biaya perpanjangan.' },
          { q: 'Apakah nama dan foto di demo undangan itu asli?', a: 'Tidak. Nama, foto, dan data di demo undangan kami fiktif; saat dipesan, semuanya diganti dengan data acaramu.' },
          { q: 'Bagaimana cara membagikan undangannya?', a: 'Cukup kirim tautannya lewat WhatsApp, media sosial, atau email. Tamu membukanya di browser tanpa perlu memasang aplikasi.' },
          { q: 'Apakah undangan digital bisa menggantikan undangan cetak?', a: 'Untuk banyak acara bisa, terutama tamu yang jauh. Sebagian keluarga tetap mencetak beberapa undangan untuk orang tua atau tamu kehormatan; keduanya bisa berjalan bersamaan.' },
        ],
      },
      en: {
        name: 'Digital Invitation',
        title: 'Digital Invitation Websites',
        description: 'Digital invitation websites for weddings, birthdays, graduations and corporate events, with RSVP, countdown, map, gallery and music. See {{demos:undangan}} live themes.',
        h1: ['', 'Digital invitations', ' that guests open, read and reply to.'],
        lead: 'A digital invitation is an event invitation in the form of a web page that you share as a link — usually over WhatsApp. From one link, guests can see the time and place, open the map, confirm attendance (RSVP) and save the date.',
        intro: [
          'The {{demos:undangan}} themes in our gallery each have a distinct character rather than one design in different colours: a wedding, an engagement, two Indonesian family celebrations (khitanan and aqiqah), a birthday, a graduation, a reunion and a corporate event site with an agenda and attendee registration.',
          'Optional features include an opening envelope, a countdown, a location map, a photo gallery, background music and an RSVP form. An invitation from our theme gallery starts at {{from:undangan-digital}}; for corporate events or a bespoke design, the Event Website package starts at {{from:situs-acara}}.',
        ],
        forWho: ['Couples planning a wedding or engagement', 'Families hosting a celebration', 'Organisers of reunions, graduations and birthdays', 'Companies holding conferences, launches or gatherings', 'Anyone who wants an invitation that is easy to share on WhatsApp'],
        includes: ['An invitation page with its own link', 'Event details: date, time and location with a map', 'A countdown to the event', 'An attendance confirmation (RSVP) form', 'Photo gallery and background music (optional)', 'A layout that is comfortable on small phone screens'],
        short: 'Invitations as websites for weddings, family events, graduations, reunions and corporate events.',
        suits: 'Weddings, family & corporate events',
        faq: [
          { q: 'How much does a digital invitation cost?', a: 'From {{from:undangan-digital}} for an invitation from our theme gallery (range {{price:undangan-digital}}, ready in {{duration:undangan-digital}}), and from {{from:situs-acara}} for an event website or bespoke design. Invitations stay active for 12 months with no renewal fee.' },
          { q: 'Are the names and photos in the demos real?', a: 'No. The names, photos and details in our demo invitations are fictional; when you order, everything is replaced with your event details.' },
          { q: 'How do I share the invitation?', a: 'Just send the link over WhatsApp, social media or email. Guests open it in their browser without installing an app.' },
          { q: 'Can a digital invitation replace a printed one?', a: 'For many events it can, especially for guests who live far away. Some families still print a few invitations for elders or guests of honour; both can work together.' },
        ],
      },
      ms: {
        name: 'Kad Jemputan Digital',
        title: 'Membina Kad Jemputan Digital (Laman Web)',
        description: 'Kad jemputan digital berbentuk laman web untuk perkahwinan, majlis keluarga dan acara korporat: RSVP, kiraan detik, peta, galeri dan muzik. Lihat {{demos:undangan}} tema.',
        h1: ['', 'Kad jemputan digital', ' yang dibuka, dibaca dan dibalas tetamu.'],
        lead: 'Kad jemputan digital ialah jemputan majlis berbentuk halaman web yang dihantar melalui pautan — biasanya melalui WhatsApp. Daripada satu pautan, tetamu boleh melihat masa dan lokasi, membuka peta, mengesahkan kehadiran (RSVP) dan menyimpan tarikhnya.',
        intro: [
          'Galeri kami mengandungi {{demos:undangan}} tema dengan watak berbeza, bukan satu reka bentuk yang ditukar warna: perkahwinan, pertunangan, majlis berkhatan, akikah, hari jadi, konvokesyen, reunion hingga laman acara korporat dengan agenda dan pendaftaran peserta.',
          'Ciri pilihan termasuk sampul pembuka, kiraan detik, peta lokasi, galeri foto, muzik latar dan borang RSVP. Jemputan daripada tema galeri bermula {{from:undangan-digital}}; untuk acara korporat atau reka bentuk khas, pakej Laman Acara bermula {{from:situs-acara}}.',
        ],
        forWho: ['Pasangan yang merancang perkahwinan atau pertunangan', 'Keluarga yang mengadakan majlis', 'Penganjur reunion, konvokesyen dan hari jadi', 'Syarikat yang mengadakan persidangan, pelancaran atau perhimpunan', 'Sesiapa yang mahu jemputan mudah dikongsi melalui WhatsApp'],
        includes: ['Halaman jemputan dengan pautan sendiri', 'Butiran majlis: tarikh, masa dan lokasi dengan peta', 'Kiraan detik menuju majlis', 'Borang pengesahan kehadiran (RSVP)', 'Galeri foto dan muzik latar (pilihan)', 'Paparan yang selesa di skrin telefon kecil'],
        short: 'Jemputan berbentuk laman web untuk perkahwinan, majlis keluarga, konvokesyen, reunion dan acara korporat.',
        suits: 'Perkahwinan, keluarga, korporat',
        faq: [
          { q: 'Berapakah harga kad jemputan digital?', a: 'Dari {{from:undangan-digital}} untuk jemputan daripada tema galeri (julat {{price:undangan-digital}}, siap dalam {{duration:undangan-digital}}), dan dari {{from:situs-acara}} untuk laman acara atau reka bentuk khas. Jemputan aktif 12 bulan tanpa kos pembaharuan.' },
          { q: 'Adakah nama dan foto dalam demo itu asli?', a: 'Tidak. Nama, foto dan data dalam demo jemputan kami adalah rekaan; apabila ditempah, semuanya diganti dengan butiran majlis anda.' },
          { q: 'Bagaimana cara berkongsi jemputan?', a: 'Hantar sahaja pautannya melalui WhatsApp, media sosial atau e-mel. Tetamu membukanya dalam pelayar tanpa perlu memasang aplikasi.' },
          { q: 'Bolehkah jemputan digital menggantikan kad bercetak?', a: 'Untuk banyak majlis boleh, terutamanya tetamu yang jauh. Sesetengah keluarga tetap mencetak beberapa kad untuk orang tua atau tetamu kehormat; kedua-duanya boleh digunakan bersama.' },
        ],
      },
    },
  },
  {
    key: 'link-in-bio',
    packages: ['link-in-bio'],
    demoCategories: ['linkinbio'],
    articles: ['website-vs-sosmed'],
    text: {
      id: {
        name: 'Link in Bio',
        title: 'Jasa Pembuatan Halaman Link in Bio',
        description: 'Halaman link in bio dengan domain dan desain sendiri untuk kreator, UMKM, musisi, dan kafe: menu, pre-order, toko, dan tombol WhatsApp. Lihat {{demos:linkinbio}} demo.',
        h1: ['Halaman ', 'link in bio', ' milikmu sendiri — bukan sekadar daftar tombol.'],
        lead: 'Halaman link in bio adalah satu halaman web yang ditautkan dari bio Instagram atau TikTok dan berisi semua tujuan penting: WhatsApp, toko, jadwal, karya, atau formulir pemesanan. Versi buatan sendiri bisa memakai domain dan desain merekmu, serta memuat fitur yang tidak ada di layanan link in bio umum.',
        intro: [
          'Ada {{demos:linkinbio}} demo di galeri kami yang menunjukkan seberapa jauh halaman ini bisa berkembang: papan menu warung yang menampilkan status buka sesuai jam WIB, pre-order kedai kopi, jadwal tur band dengan pemilih tiket, toko stiker, hingga halaman komisi ilustrator.',
          'Paket Link in Bio mulai {{from:link-in-bio}} dan selesai {{duration:link-in-bio}}; halaman atau fitur tambahan dihitung di penawaran tertulis.',
        ],
        forWho: ['Kreator konten dan influencer', 'Kafe, warung, dan usaha kuliner dengan pre-order', 'Musisi, band, dan penyelenggara acara', 'Ilustrator, penulis, dan pekerja kreatif', 'UMKM yang aktif berjualan lewat Instagram atau TikTok'],
        includes: ['Halaman dengan domain dan desain sesuai merek', 'Tombol WhatsApp dan tautan ke semua kanalmu', 'Fitur sesuai kebutuhan: menu, pre-order, jadwal, toko, atau formulir', 'Tampilan yang cepat dibuka di ponsel', 'SEO dasar sehingga namamu bisa ditemukan di Google'],
        short: 'Satu tautan untuk bio media sosial dengan domain, desain, dan fitur milik sendiri.',
        suits: 'Kreator, kafe, musisi',
        faq: [
          { q: 'Apa bedanya dengan layanan link in bio gratis?', a: 'Layanan gratis biasanya hanya berisi daftar tombol dengan tampilan terbatas. Halaman buatan sendiri bisa memakai domainmu, desain sesuai merek, dan fitur khusus seperti menu, pre-order, atau jadwal — dan kontennya sepenuhnya milikmu.' },
          { q: 'Berapa harganya?', a: 'Mulai {{from:link-in-bio}} untuk satu halaman dengan satu fitur khusus (kisaran {{price:link-in-bio}}), sudah termasuk domain .my.id/.biz.id dan hosting tahun pertama. Halaman atau fitur tambahan dihitung di penawaran tertulis sebelum mulai.' },
          { q: 'Apakah bisa dipakai untuk Instagram dan TikTok sekaligus?', a: 'Bisa. Tautannya sama untuk semua platform, jadi cukup dipasang di bio masing-masing akun.' },
        ],
      },
      en: {
        name: 'Link in Bio',
        title: 'Custom Link-in-Bio Pages',
        description: 'Link-in-bio pages with your own domain and design for creators, small businesses and cafés: menus, pre-orders, shops and WhatsApp. See {{demos:linkinbio}} live demos.',
        h1: ['A ', 'link-in-bio page', ' of your own — not just a list of buttons.'],
        lead: 'A link-in-bio page is a single web page linked from your Instagram or TikTok bio that holds every important destination: WhatsApp, your shop, your schedule, your work or an order form. A custom version can use your own domain and brand design, with features generic link-in-bio services do not offer.',
        intro: [
          'The {{demos:linkinbio}} demos in our gallery show how far such a page can go: a food stall menu board that shows whether it is open based on Indonesian time, coffee-shop pre-orders, a band tour schedule with a ticket picker, a sticker shop and an illustrator commission page.',
          'The Link in Bio package starts at {{from:link-in-bio}} and is ready in {{duration:link-in-bio}}; extra pages or features are priced in the written quote.',
        ],
        forWho: ['Content creators and influencers', 'Cafés, food stalls and food businesses taking pre-orders', 'Musicians, bands and event organisers', 'Illustrators, writers and creative workers', 'Small businesses selling actively on Instagram or TikTok'],
        includes: ['A page on your own domain with your brand design', 'A WhatsApp button and links to all your channels', 'Features as needed: menu, pre-orders, schedule, shop or forms', 'Fast loading on phones', 'Basic SEO so your name can be found on Google'],
        short: 'One link for your social bio, with your own domain, design and features.',
        suits: 'Creators, cafés, musicians',
        faq: [
          { q: 'How is this different from a free link-in-bio service?', a: 'Free services usually offer a list of buttons with limited styling. A custom page can use your domain, your brand design and special features such as a menu, pre-orders or a schedule — and the content is entirely yours.' },
          { q: 'How much does it cost?', a: 'From {{from:link-in-bio}} for one page with one special feature (range {{price:link-in-bio}}), including a .my.id/.biz.id domain and first-year hosting. Extra pages or features are priced in the written quote before we start.' },
          { q: 'Can I use it for Instagram and TikTok at the same time?', a: 'Yes. The link is the same on every platform, so you simply add it to each account bio.' },
        ],
      },
      ms: {
        name: 'Link in Bio',
        title: 'Membina Halaman Link in Bio Sendiri',
        description: 'Halaman link in bio dengan domain dan reka bentuk sendiri untuk pencipta kandungan, PKS dan kafe: menu, pra-tempahan, kedai, WhatsApp. Lihat {{demos:linkinbio}} demo.',
        h1: ['Halaman ', 'link in bio', ' milik anda sendiri — bukan sekadar senarai butang.'],
        lead: 'Halaman link in bio ialah satu halaman web yang dipautkan dari bio Instagram atau TikTok dan mengandungi semua destinasi penting: WhatsApp, kedai, jadual, karya atau borang pesanan. Versi tersuai boleh menggunakan domain dan reka bentuk jenama anda, serta ciri yang tiada dalam perkhidmatan link in bio biasa.',
        intro: [
          'Terdapat {{demos:linkinbio}} demo dalam galeri kami yang menunjukkan sejauh mana halaman ini boleh berkembang: papan menu gerai yang memaparkan status buka mengikut waktu Indonesia, pra-tempahan kedai kopi, jadual jelajah kumpulan muzik dengan pemilih tiket, kedai pelekat hingga halaman komisen ilustrator.',
          'Pakej Link in Bio bermula {{from:link-in-bio}} dan siap dalam {{duration:link-in-bio}}; halaman atau ciri tambahan dikira dalam sebut harga bertulis.',
        ],
        forWho: ['Pencipta kandungan dan pempengaruh', 'Kafe, gerai dan perniagaan makanan dengan pra-tempahan', 'Pemuzik, kumpulan muzik dan penganjur acara', 'Ilustrator, penulis dan pekerja kreatif', 'PKS yang aktif berniaga melalui Instagram atau TikTok'],
        includes: ['Halaman dengan domain dan reka bentuk mengikut jenama', 'Butang WhatsApp dan pautan ke semua saluran anda', 'Ciri mengikut keperluan: menu, pra-tempahan, jadual, kedai atau borang', 'Paparan yang pantas dibuka di telefon', 'SEO asas supaya nama anda boleh ditemui di Google'],
        short: 'Satu pautan untuk bio media sosial dengan domain, reka bentuk dan ciri sendiri.',
        suits: 'Pencipta, kafe, pemuzik',
        faq: [
          { q: 'Apakah bezanya dengan perkhidmatan link in bio percuma?', a: 'Perkhidmatan percuma biasanya hanya senarai butang dengan paparan terhad. Halaman tersuai boleh menggunakan domain anda, reka bentuk jenama dan ciri khas seperti menu, pra-tempahan atau jadual — dan kandungannya milik anda sepenuhnya.' },
          { q: 'Berapakah harganya?', a: 'Dari {{from:link-in-bio}} untuk satu halaman dengan satu ciri khas (julat {{price:link-in-bio}}), termasuk domain .my.id/.biz.id dan hosting tahun pertama. Halaman atau ciri tambahan dikira dalam sebut harga bertulis sebelum bermula.' },
          { q: 'Bolehkah digunakan untuk Instagram dan TikTok sekali gus?', a: 'Boleh. Pautannya sama untuk semua platform, jadi cukup dipasang di bio setiap akaun.' },
        ],
      },
    },
  },
]

export const serviceOf = (key: ServiceKey) => SERVICES.find((s) => s.key === key)!

const textCache = new Map<string, ServiceText>()

/**
 * Teks layanan dalam bahasa pengunjung; bahasa tambahan diambil dari i18n/x/more/<kode>.ts. SEMUA string sudah
 * melewati fillFacts (harga {{from:…}}, durasi, jumlah demo {{demos:kategori}}, dst.), jadi judul, meta description,
 * dan JSON-LD ikut berisi angka dari lib/packages.ts & lib/demos.ts, bukan penanda mentah.
 */
export const serviceText = (s: Service, lang: Lang): ServiceText => {
  const cacheKey = `${lang}:${s.key}`
  const hit = textCache.get(cacheKey)
  if (hit) return hit
  const raw = isBase(lang) ? s.text[lang] : more(lang).services[s.key]
  const f = (x: string) => fillFacts(lang, x)
  const t: ServiceText = {
    name: f(raw.name),
    title: f(raw.title),
    description: f(raw.description),
    h1: raw.h1.map((x) => (x === undefined ? x : f(x))) as Hl,
    lead: f(raw.lead),
    intro: raw.intro.map(f),
    forWho: raw.forWho.map(f),
    ...(raw.includes ? { includes: raw.includes.map(f) } : {}),
    short: f(raw.short),
    suits: f(raw.suits),
    faq: raw.faq.map((x) => ({ q: f(x.q), a: f(x.a) })),
    ...(raw.steps ? { steps: raw.steps.map((x) => ({ title: f(x.title), desc: f(x.desc) })) } : {}),
    ...(raw.handover ? { handover: { label: f(raw.handover.label), value: f(raw.handover.value) } } : {}),
  }
  textCache.set(cacheKey, t)
  return t
}
