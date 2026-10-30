// Halaman kota sekitar: Kediri, Blitar, Trenggalek (30 Okt 2026). Hanya id & en (halaman lain notFound()).
// PintuWeb BERLOKASI di Tulungagung (lib/site.ts) dan melayani kota-kota ini secara online lewat WhatsApp: halaman ini
// tidak boleh menulis kantor, alamat, atau janji bertemu di kota tersebut, dan JSON-LD-nya hanya Service + areaServed.
// Fakta daerah hanya yang bersumber (CITY_SOURCES, tampil di halaman); bagian tanpa sumber ditulis umum, tanpa angka.
// Harga & durasi dari lib/packages.ts (packagesFor), bukan ditulis di sini.
import type { Hl } from '../i18n/dict/id'
import type { Lang } from '../i18n/config'
import type { PageKey } from '../i18n/routes'
import type { ArticleKey, BizKey } from '../i18n/slugs'
import type { DemoCategory } from '../lib/demos'

export type CityKey = 'kediri' | 'blitar' | 'trenggalek'
export type CityPageKey = 'cityKediri' | 'cityBlitar' | 'cityTrenggalek'
export const CITY_PAGE_KEYS: CityPageKey[] = ['cityKediri', 'cityBlitar', 'cityTrenggalek']

export type CitySector = {
  name: string
  body: string
  /** nomor sumber (urutan di CITY_SOURCES[kota], mulai 1) bila fakta daerahnya bersumber */
  src?: number
  /** demo yang cocok (slug lib/demos.ts) dan paket yang disarankan (slug lib/packages.ts) */
  demo: string
  pkg: string
}

export type CityText = {
  /** <title> tanpa "| PintuWeb" (total ≤60) */
  title: string
  /** meta description ≤155 karakter */
  description: string
  ogTitle: string
  crumb: string
  eyebrow: string
  h1: Hl
  answerLead: string
  answer: string
  onlineTitle: string
  onlineBody: string
  sectorsTitle: string
  sectorsLead: string
  sectors: CitySector[]
  demoWhy: Record<string, string>
  faq: { q: string; a: string }[]
  wa: string
}

export type City = {
  key: CityKey
  page: CityPageKey
  /** nama kota/kabupaten sebagaimana ditulis di teks */
  name: string
  tone: DemoCategory
  demos: string[]
  pkgs: string[]
  articles: ArticleKey[]
  biz: BizKey[]
  sources: { title: string; url: string }[]
  text: Record<'id' | 'en', CityText>
}

export const CITY_LANGS: Lang[] = ['id', 'en']

export const CITIES: City[] = [
  {
    key: 'kediri',
    page: 'cityKediri',
    name: 'Kediri',
    tone: 'toko',
    demos: ['tanur', 'lungsin', 'jajan', 'hotel', 'kopi', 'booking'],
    pkgs: ['toko-online-simple', 'landing-page', 'sistem-reservasi'],
    articles: ['toko-vs-marketplace', 'google-maps'],
    biz: ['toko-umkm-produk', 'kafe-restoran', 'salon-laundry-jasa'],
    sources: [
      { title: 'Direktorat Jenderal Pajak — Pariwisata Kota Kediri Menjadi Primadona Ekonomi', url: 'https://pajak.go.id/id/artikel/pariwisata-kota-kediri-menjadi-primadona-ekonomi' },
      { title: 'ANTARA Jatim — Tenun ikat Kediri tembus mancanegara', url: 'https://jatim.antaranews.com/berita/246501/tenun-ikat-kediri-tembus-mancanegara' },
      { title: 'Good News From Indonesia — Berburu Tahu di Kampung Tahu Tinalan, Kota Kediri', url: 'https://www.goodnewsfromindonesia.id/2025/01/23/berburu-tahu-di-kampung-tahu-tinalan-kota-kediri' },
    ],
    text: {
      id: {
        title: 'Jasa Pembuatan Website Kediri',
        description: 'Jasa pembuatan website untuk usaha di Kediri: toko tahu dan tenun, kafe, penginapan. Dikerjakan online lewat WhatsApp, harga mulai dari Landing Page.',
        ogTitle: 'Jasa Pembuatan Website untuk Usaha di Kediri',
        crumb: 'Website Kediri',
        eyebrow: 'Melayani Kediri secara online',
        h1: ['Jasa pembuatan website untuk usaha di ', 'Kediri', ', dikerjakan lewat WhatsApp.'],
        answerLead: 'PintuWeb berlokasi di {{city}} dan melayani usaha di Kediri secara online.',
        answer: 'Landing page mulai {{from:landing-page}} ({{duration:landing-page}}), toko online sederhana mulai {{from:toko-online-simple}} ({{duration:toko-online-simple}}). Ceritakan usahamu, terima penawaran tertulis, lalu pengerjaan dimulai setelah DP 50%.',
        onlineTitle: 'Bagaimana kalau kita tidak bertemu langsung?',
        onlineBody: 'Seluruh pekerjaan dilakukan online: konsultasi, desain, revisi, sampai serah terima lewat WhatsApp dan email. PintuWeb tidak punya kantor di Kediri dan tidak memerlukan pertemuan tatap muka. Kamu cukup mengirim foto, daftar produk, dan cerita usahamu.',
        sectorsTitle: 'Website yang cocok untuk usaha di Kediri',
        sectorsLead: 'Kediri dikenal lewat tahu, tenun ikat, dan satu industri besar. Pajak penghasilan dari perusahaan rokok adalah penerimaan pajak terbesar kota ini, dan kota ini punya lebih dari 31 ribu usaha (data 2018). Banyaknya usaha kecil berarti persaingan, jadi tampil jelas di Google membantu.',
        sectors: [
          { name: 'Tahu takwa & oleh-oleh makanan', body: 'Kampung Tahu Tinalan di Kecamatan Pesantren dikenal sebagai sentra tahu takwa, tahu kuning yang diwarnai kunyit. Hasilnya dijual langsung di tempat produksi, di toko oleh-oleh, dan di marketplace. Katalog sendiri membantu pembeli dari luar kota melihat produk lengkap dan memesan lewat WhatsApp.', src: 3, demo: 'jajan', pkg: 'toko-online-simple' },
          { name: 'Tenun ikat & busana', body: 'Sentra tenun ikat ada di Kelurahan Bandar Kidul, Kecamatan Mojoroto. Produknya tidak lagi hanya sarung: ada kain, baju, tas, dan sepatu bermotif tenun. Foto motif yang besar dan jelas membantu pembeli memilih tanpa datang ke lokasi.', src: 2, demo: 'lungsin', pkg: 'toko-online-simple' },
          { name: 'Wisata, kafe & penginapan', body: 'Kediri punya tujuan wisata seperti Goa Selomangkleng dan Gunung Kelud, dan jalan tol memperpendek perjalanan dari Surabaya. Kafe, warung, dan penginapan bisa menampilkan menu, kamar, dan peta dalam satu halaman, lalu menerima pesanan lewat WhatsApp.', src: 1, demo: 'hotel', pkg: 'sistem-reservasi' },
          { name: 'Salon, klinik, bimbel & jasa lain', body: 'Untuk usaha jasa, yang dicari pelanggan adalah layanan, harga, jam buka, dan cara membuat janji. Halaman layanan dengan booking online mengurangi bolak-balik chat dan jadwal yang bentrok.', demo: 'booking', pkg: 'sistem-reservasi' },
        ],
        demoWhy: {
          jajan: 'Jajanan dan oleh-oleh dengan tautan pesan.',
          lungsin: 'Busana dari kain tenun dengan foto motif.',
          hotel: 'Pesan kamar dengan kalender.',
          tanur: 'Katalog produk buatan tangan yang rapi.',
          kopi: 'Menu kedai kopi dari QR di meja.',
          booking: 'Booking jam untuk salon dan pangkas rambut.',
        },
        faq: [
          { q: 'Apakah PintuWeb punya kantor di Kediri?', a: 'Tidak. PintuWeb berlokasi di Tulungagung dan melayani Kediri secara online lewat WhatsApp dan email. Semua tahap dikerjakan jarak jauh.' },
          { q: 'Saya jualan tahu atau oleh-oleh. Perlu toko online lengkap?', a: 'Belum tentu. Paket Toko Online Simple memuat katalog sampai 20 item dengan checkout lewat WhatsApp. Itu cukup untuk memulai; toko lengkap bisa menyusul bila pesananmu bertambah.' },
          { q: 'Berapa lama sampai website jadi?', a: 'Lihat perkiraan waktu tiap paket di bawah. Waktunya dihitung setelah foto, daftar produk, dan teks usahamu lengkap.' },
        ],
        wa: 'Halo PintuWeb, usaha saya di Kediri dan saya ingin tanya soal pembuatan website (halaman Jasa Pembuatan Website Kediri).',
      },
      en: {
        title: 'Web Design for Kediri Businesses',
        description: 'Website design for businesses in Kediri: tofu and woven-cloth shops, cafes, lodging. Done online through WhatsApp, with prices starting at a Landing Page.',
        ogTitle: 'Web Design for Businesses in Kediri',
        crumb: 'Kediri websites',
        eyebrow: 'Serving Kediri online',
        h1: ['Website design for businesses in ', 'Kediri', ', done over WhatsApp.'],
        answerLead: 'PintuWeb is based in {{city}} and serves businesses in Kediri online.',
        answer: 'A landing page starts at {{from:landing-page}} ({{duration:landing-page}}) and a simple online store at {{from:toko-online-simple}} ({{duration:toko-online-simple}}). Tell us about your business, get a written quote, and work starts after a 50% deposit.',
        onlineTitle: 'What if we never meet in person?',
        onlineBody: 'All the work is online: consultation, design, revisions and handover through WhatsApp and email. PintuWeb has no office in Kediri and does not need a face-to-face meeting. You just send photos, a product list and the story of your business.',
        sectorsTitle: 'Websites that suit businesses in Kediri',
        sectorsLead: 'Kediri is known for tofu, woven ikat cloth and one big industry. Income tax from a cigarette company is the city’s largest tax revenue, and the city has more than 31,000 businesses (2018 figure). With so many small businesses, standing out on Google helps.',
        sectors: [
          { name: 'Takwa tofu & food gifts', body: 'Tinalan Tofu Village in Pesantren district is known as the centre of tahu takwa, a yellow tofu coloured with turmeric. It is sold at the workshops, in gift shops and on marketplaces. Your own catalogue lets buyers from other cities see the full range and order by WhatsApp.', src: 3, demo: 'jajan', pkg: 'toko-online-simple' },
          { name: 'Ikat weaving & clothing', body: 'The ikat weaving centre is in Bandar Kidul, Mojoroto district. Its products are no longer just sarongs: there are fabrics, shirts, bags and shoes in woven patterns. Large, clear photos of the patterns help buyers choose without visiting.', src: 2, demo: 'lungsin', pkg: 'toko-online-simple' },
          { name: 'Tourism, cafes & lodging', body: 'Kediri has attractions such as Selomangkleng Cave and Mount Kelud, and the toll road shortens the trip from Surabaya. Cafes, eateries and guesthouses can show a menu, rooms and a map on one page, then take enquiries by WhatsApp.', src: 1, demo: 'hotel', pkg: 'sistem-reservasi' },
          { name: 'Salons, clinics, tutoring & other services', body: 'For service businesses, customers look for the service, the price, opening hours and how to book. A service page with online booking cuts back-and-forth chats and clashing appointments.', demo: 'booking', pkg: 'sistem-reservasi' },
        ],
        demoWhy: {
          jajan: 'Snacks and gifts with an order link.',
          lungsin: 'Clothing from woven cloth with pattern photos.',
          hotel: 'Room booking with a calendar.',
          tanur: 'A tidy catalogue of handmade products.',
          kopi: 'A coffee-shop menu opened from a QR code.',
          booking: 'Time-slot booking for salons and barbers.',
        },
        faq: [
          { q: 'Does PintuWeb have an office in Kediri?', a: 'No. PintuWeb is based in Tulungagung and serves Kediri online through WhatsApp and email. Every stage is done remotely.' },
          { q: 'I sell tofu or gifts. Do I need a full online store?', a: 'Not necessarily. The Simple Online Store package holds a catalogue of up to 20 items with checkout by WhatsApp. That is enough to begin, and a full store can follow as orders grow.' },
          { q: 'How long until the website is ready?', a: 'See each package’s estimated time below. It counts from when your photos, product list and text are complete.' },
        ],
        wa: 'Hello PintuWeb, my business is in Kediri and I would like to ask about a website (Web Design for Kediri page).',
      },
    },
  },
  {
    key: 'blitar',
    page: 'cityBlitar',
    name: 'Blitar',
    tone: 'menu',
    demos: ['rasanusantara', 'luxeelectro', 'restoran', 'kopi', 'daunjendela', 'wedding'],
    pkgs: ['standar-umkm', 'landing-page', 'undangan-digital'],
    articles: ['wisata', 'biaya'],
    biz: ['kafe-restoran', 'kos-properti-penginapan', 'acara-undangan'],
    sources: [
      { title: 'Good News From Indonesia — Kabupaten Blitar jadi sentra utama produksi telur ayam ras di Indonesia', url: 'https://www.goodnewsfromindonesia.id/short/kabupaten-blitar-jadi-sentra-utama-produksi-telur-ayam-ras-di-indonesia' },
      { title: 'JawaPos — Duo bakul pecel yang sering nyambangi Bung Karno di Ndalem Gebang', url: 'https://www.jawapos.com/warung-ri-1/2205030050/duo-bakul-pecel-yang-sering-nyambangi-bung-karno-di-ndalem-gebang' },
    ],
    text: {
      id: {
        title: 'Jasa Pembuatan Website Blitar',
        description: 'Jasa pembuatan website untuk usaha di Blitar: peternak dan pedagang, warung pecel, kafe, penginapan, undangan. Dikerjakan online lewat WhatsApp.',
        ogTitle: 'Jasa Pembuatan Website untuk Usaha di Blitar',
        crumb: 'Website Blitar',
        eyebrow: 'Melayani Blitar secara online',
        h1: ['Jasa pembuatan website untuk usaha di ', 'Blitar', ', tanpa perlu datang ke kantor.'],
        answerLead: 'PintuWeb berlokasi di {{city}} dan melayani usaha di Blitar secara online.',
        answer: 'Website profil usaha (Standar UMKM) mulai {{from:standar-umkm}} ({{duration:standar-umkm}}), landing page mulai {{from:landing-page}}. Semua lewat WhatsApp: ceritakan usahamu, terima penawaran tertulis, lalu mulai setelah DP 50%.',
        onlineTitle: 'Bagaimana kalau kita tidak bertemu langsung?',
        onlineBody: 'Konsultasi, desain, revisi, dan serah terima semuanya online lewat WhatsApp dan email. PintuWeb tidak punya kantor di Blitar dan tidak memerlukan pertemuan tatap muka. Yang perlu kamu siapkan hanya foto, keterangan produk, dan cerita usahamu.',
        sectorsTitle: 'Website yang cocok untuk usaha di Blitar',
        sectorsLead: 'Blitar dikenal lewat peternakan ayam petelur dan wisata sejarah Bung Karno. Dua dunia itu butuh website yang berbeda: yang satu berbicara kepada pembeli dalam jumlah besar, yang lain kepada pengunjung yang mencari tempat makan dan menginap.',
        sectors: [
          { name: 'Peternak & pedagang telur', body: 'Kabupaten Blitar disebut sebagai sentra utama produksi telur ayam ras di Indonesia. Bagi peternak dan pedagang yang menjual dalam jumlah besar, website profil usaha berisi jenis produk, ukuran kemasan, area pengiriman, dan tombol WhatsApp membuat calon pembeli grosir cepat menghubungi.', src: 1, demo: 'luxeelectro', pkg: 'standar-umkm' },
          { name: 'Warung pecel, kafe & wisata sejarah', body: 'Ndalem Gebang, rumah orang tua Bung Karno, kini menjadi Museum Istana Gebang, dan pecel punya ceritanya sendiri dengan Bung Karno. Warung makan dan kafe di sekitar tempat wisata sejarah bisa menampilkan menu, jam buka, dan peta dalam satu halaman yang dibuka dari QR di meja.', src: 2, demo: 'restoran', pkg: 'landing-page' },
          { name: 'Toko oleh-oleh, tanaman & kerajinan', body: 'Pengunjung ingin membawa pulang sesuatu, dan pembeli di luar kota ingin tahu stok dan harga. Katalog dengan foto jelas dan tombol pesan lewat WhatsApp sudah cukup untuk mulai berjualan online.', demo: 'daunjendela', pkg: 'toko-online-simple' },
          { name: 'Pernikahan, aqiqah & acara keluarga', body: 'Undangan digital menaruh jam, lokasi, dan konfirmasi hadir di satu tautan yang mudah dibagikan ke keluarga besar dan kerabat yang tinggal di kota lain.', demo: 'wedding', pkg: 'undangan-digital' },
        ],
        demoWhy: {
          rasanusantara: 'Contoh halaman usaha yang melayani dapur restoran dan pembeli dalam jumlah besar.',
          luxeelectro: 'Halaman yang menulis spesifikasi lengkap, pola yang sama untuk ukuran dan kemasan produk.',
          restoran: 'Pesan meja dari denah, cocok untuk rumah makan.',
          kopi: 'Menu kedai kopi yang dibuka dari QR.',
          daunjendela: 'Katalog tanaman dengan panduan memilih.',
          wedding: 'Undangan pernikahan dengan RSVP.',
        },
        faq: [
          { q: 'Apakah PintuWeb punya kantor di Blitar?', a: 'Tidak. PintuWeb berlokasi di Tulungagung dan melayani Blitar secara online lewat WhatsApp dan email. Semua tahap dikerjakan jarak jauh.' },
          { q: 'Apakah bisa untuk usaha yang menjual dalam jumlah besar?', a: 'Bisa. Website profil usaha dengan keterangan produk dan tombol WhatsApp cocok untuk pembeli grosir. Bila kamu butuh fitur khusus, sampaikan saat konsultasi.' },
          { q: 'Berapa biaya undangan digital untuk acara keluarga?', a: 'Paket Undangan Digital punya harga mulai yang tertera di bawah, dan tautannya aktif 12 bulan tanpa biaya perpanjangan.' },
        ],
        wa: 'Halo PintuWeb, usaha saya di Blitar dan saya ingin tanya soal pembuatan website (halaman Jasa Pembuatan Website Blitar).',
      },
      en: {
        title: 'Web Design for Blitar Businesses',
        description: 'Website design for businesses in Blitar: egg farmers and traders, pecel eateries, cafes, lodging, invitations. Done online through WhatsApp.',
        ogTitle: 'Web Design for Businesses in Blitar',
        crumb: 'Blitar websites',
        eyebrow: 'Serving Blitar online',
        h1: ['Website design for businesses in ', 'Blitar', ', no office visit needed.'],
        answerLead: 'PintuWeb is based in {{city}} and serves businesses in Blitar online.',
        answer: 'A business profile website (SME Standard) starts at {{from:standar-umkm}} ({{duration:standar-umkm}}) and a landing page at {{from:landing-page}}. Everything runs over WhatsApp: tell us about your business, get a written quote, and start after a 50% deposit.',
        onlineTitle: 'What if we never meet in person?',
        onlineBody: 'Consultation, design, revisions and handover are all online through WhatsApp and email. PintuWeb has no office in Blitar and does not need a face-to-face meeting. All you prepare is photos, product details and the story of your business.',
        sectorsTitle: 'Websites that suit businesses in Blitar',
        sectorsLead: 'Blitar is known for its egg farms and for Bung Karno’s history. Those two worlds need different websites: one speaks to bulk buyers, the other to visitors looking for somewhere to eat and stay.',
        sectors: [
          { name: 'Egg farmers & traders', body: 'Blitar Regency is described as the main centre of chicken-egg production in Indonesia. For farmers and traders selling in bulk, a business profile website with product types, pack sizes, delivery areas and a WhatsApp button lets wholesale buyers get in touch quickly.', src: 1, demo: 'luxeelectro', pkg: 'standar-umkm' },
          { name: 'Pecel eateries, cafes & heritage visits', body: 'Ndalem Gebang, Bung Karno’s parents’ home, is now the Istana Gebang Museum, and pecel has its own story with Bung Karno. Eateries and cafes near heritage sites can show a menu, hours and a map on one page opened from a QR code on the table.', src: 2, demo: 'restoran', pkg: 'landing-page' },
          { name: 'Gift shops, plants & crafts', body: 'Visitors want something to take home, and buyers in other cities want to know stock and prices. A catalogue with clear photos and ordering by WhatsApp is enough to start selling online.', demo: 'daunjendela', pkg: 'toko-online-simple' },
          { name: 'Weddings, aqiqah & family events', body: 'A digital invitation puts the time, place and RSVP behind one link that is easy to share with a big family and relatives living in other cities.', demo: 'wedding', pkg: 'undangan-digital' },
        ],
        demoWhy: {
          rasanusantara: 'A sample page for a business serving restaurant kitchens and bulk buyers.',
          luxeelectro: 'A page that spells out full specifications, the same approach for pack sizes and product details.',
          restoran: 'Table booking from a floor plan, suited to eateries.',
          kopi: 'A coffee-shop menu opened from a QR code.',
          daunjendela: 'A plant catalogue with a how-to-choose guide.',
          wedding: 'A wedding invitation with RSVP.',
        },
        faq: [
          { q: 'Does PintuWeb have an office in Blitar?', a: 'No. PintuWeb is based in Tulungagung and serves Blitar online through WhatsApp and email. Every stage is done remotely.' },
          { q: 'Does it work for a business that sells in bulk?', a: 'Yes. A business profile site with product details and a WhatsApp button suits wholesale buyers. If you need special features, mention them in the consultation.' },
          { q: 'What does a digital invitation for a family event cost?', a: 'The Digital Invitation package has the starting price shown below, and the link stays active for 12 months with no renewal fee.' },
        ],
        wa: 'Hello PintuWeb, my business is in Blitar and I would like to ask about a website (Web Design for Blitar page).',
      },
    },
  },
  {
    key: 'trenggalek',
    page: 'cityTrenggalek',
    name: 'Trenggalek',
    tone: 'reservasi',
    demos: ['hotel', 'beranda', 'antar', 'jajan', 'lungsin', 'modewear'],
    pkgs: ['sistem-reservasi', 'toko-online-simple', 'landing-page'],
    articles: ['wisata', 'toko-vs-marketplace'],
    biz: ['kos-properti-penginapan', 'toko-umkm-produk', 'kafe-restoran'],
    sources: [
      { title: 'Good News From Indonesia — Pantai Prigi Trenggalek, Teluk dengan Sisi Wisata dan Sisi Nelayan yang Hidup Berdampingan', url: 'https://www.goodnewsfromindonesia.id/indonesiana/wisata/pantai-prigi-trenggalek-teluk-dengan-sisi-wisata-dan-sisi-nelayan-yang-hidup-berdampingan' },
      { title: 'Bisnis.com — Omzet Perajin Tempe Trenggalek Meningkat 300%', url: 'https://ekonomi.bisnis.com/read/20160705/87/563956/omzet-perajin-tempe-trenggalek-meningkat-300' },
      { title: 'detikFinance — Menteri Rini Kepincut Batik Trenggalek', url: 'https://finance.detik.com/sosok/d-3393516/menteri-rini-kepincut-batik-trenggalek' },
    ],
    text: {
      id: {
        title: 'Jasa Pembuatan Website Trenggalek',
        description: 'Jasa pembuatan website untuk usaha di Trenggalek: penginapan pantai, hasil laut, keripik tempe, batik. Dikerjakan online lewat WhatsApp.',
        ogTitle: 'Jasa Pembuatan Website untuk Usaha di Trenggalek',
        crumb: 'Website Trenggalek',
        eyebrow: 'Melayani Trenggalek secara online',
        h1: ['Jasa pembuatan website untuk usaha di ', 'Trenggalek', ', dari pantai sampai pasar.'],
        answerLead: 'PintuWeb berlokasi di {{city}} dan melayani usaha di Trenggalek secara online.',
        answer: 'Sistem reservasi untuk penginapan mulai {{from:sistem-reservasi}} ({{duration:sistem-reservasi}}), toko online sederhana mulai {{from:toko-online-simple}}, landing page mulai {{from:landing-page}}. Semua lewat WhatsApp, dengan DP 50% untuk memulai.',
        onlineTitle: 'Bagaimana kalau kita tidak bertemu langsung?',
        onlineBody: 'Seluruh proses online: konsultasi, desain, revisi, dan serah terima lewat WhatsApp dan email. PintuWeb tidak punya kantor di Trenggalek dan tidak memerlukan pertemuan tatap muka. Siapkan foto, keterangan produk atau kamar, dan cerita usahamu.',
        sectorsTitle: 'Website yang cocok untuk usaha di Trenggalek',
        sectorsLead: 'Trenggalek menghadap laut selatan, jadi kebutuhannya berbeda dari kota di pedalaman: penginapan dan hasil laut di pesisir, camilan dan batik di dalam kota.',
        sectors: [
          { name: 'Wisata pantai, homestay & penginapan', body: 'Teluk Prigi punya dua sisi: sisi barat untuk wisata dengan bumi perkemahan dan penginapan, sisi timur untuk dermaga nelayan. Penginapan dan homestay di sekitarnya bisa memakai kalender ketersediaan, foto kamar, dan peta, sehingga tamu memesan tanpa bertanya satu per satu.', src: 1, demo: 'hotel', pkg: 'sistem-reservasi' },
          { name: 'Hasil laut & warung pesisir', body: 'Pelabuhan perikanan dan tempat pelelangan ikan di Prigi bisa dikunjungi, dan pengunjung dapat membeli ikan segar serta melihat lelang pagi hari. Pedagang dan warung bisa memakai halaman pesan-antar atau katalog sederhana dengan pemesanan lewat WhatsApp.', src: 1, demo: 'antar', pkg: 'landing-page' },
          { name: 'Keripik tempe & camilan oleh-oleh', body: 'Keripik tempe adalah produk UMKM khas Trenggalek, dan permintaannya naik menjelang Lebaran. Toko online sederhana membantu pembeli dari luar kota memesan, dan katalog yang rapi membuat pesanan musiman lebih mudah dicatat.', src: 2, demo: 'jajan', pkg: 'toko-online-simple' },
          { name: 'Batik & busana', body: 'Batik warna alam adalah salah satu batik khas Trenggalek. Foto kain yang dekat dan jelas, ukuran, dan cerita pewarnanya membantu pembeli yang tidak bisa datang meraba kainnya.', src: 3, demo: 'lungsin', pkg: 'toko-online-simple' },
        ],
        demoWhy: {
          hotel: 'Pesan kamar dengan kalender ketersediaan.',
          beranda: 'Pilih kawasan dulu, cocok untuk banyak penginapan atau kos.',
          antar: 'Pesan-antar dari warung lokal.',
          jajan: 'Jajanan dengan tautan pesan.',
          lungsin: 'Busana dari kain tenun dengan foto motif dekat.',
          modewear: 'Pakaian yang dijahit setelah dipesan.',
        },
        faq: [
          { q: 'Apakah PintuWeb punya kantor di Trenggalek?', a: 'Tidak. PintuWeb berlokasi di Tulungagung dan melayani Trenggalek secara online lewat WhatsApp dan email. Semua tahap dikerjakan jarak jauh.' },
          { q: 'Homestay kecil perlu sistem reservasi?', a: 'Belum tentu. Bila kamarmu sedikit, landing page dengan foto dan tombol WhatsApp bisa cukup. Sistem reservasi berguna bila tamu sering bertanya kamar mana yang kosong.' },
          { q: 'Bisakah penjual camilan menerima pesanan dari luar kota?', a: 'Bisa. Katalog dengan checkout lewat WhatsApp di paket Toko Online Simple adalah cara yang paling ringan untuk memulai.' },
        ],
        wa: 'Halo PintuWeb, usaha saya di Trenggalek dan saya ingin tanya soal pembuatan website (halaman Jasa Pembuatan Website Trenggalek).',
      },
      en: {
        title: 'Web Design for Trenggalek Businesses',
        description: 'Website design for businesses in Trenggalek: beach lodging, seafood, tempeh chips, batik. Done online through WhatsApp.',
        ogTitle: 'Web Design for Businesses in Trenggalek',
        crumb: 'Trenggalek websites',
        eyebrow: 'Serving Trenggalek online',
        h1: ['Website design for businesses in ', 'Trenggalek', ', from the beach to the market.'],
        answerLead: 'PintuWeb is based in {{city}} and serves businesses in Trenggalek online.',
        answer: 'A reservation system for lodging starts at {{from:sistem-reservasi}} ({{duration:sistem-reservasi}}), a simple online store at {{from:toko-online-simple}} and a landing page at {{from:landing-page}}. Everything runs over WhatsApp, with a 50% deposit to start.',
        onlineTitle: 'What if we never meet in person?',
        onlineBody: 'The whole process is online: consultation, design, revisions and handover through WhatsApp and email. PintuWeb has no office in Trenggalek and does not need a face-to-face meeting. Prepare photos, product or room details and the story of your business.',
        sectorsTitle: 'Websites that suit businesses in Trenggalek',
        sectorsLead: 'Trenggalek faces the southern sea, so the needs differ from an inland town: lodging and seafood on the coast, snacks and batik in town.',
        sectors: [
          { name: 'Beach tourism, homestays & lodging', body: 'Prigi Bay has two sides: the western side for tourism with a campground and lodging, the eastern side for the fishing pier. Lodging and homestays nearby can use an availability calendar, room photos and a map, so guests book without asking one question at a time.', src: 1, demo: 'hotel', pkg: 'sistem-reservasi' },
          { name: 'Seafood & coastal eateries', body: 'The fishing port and fish auction hall at Prigi can be visited, and visitors can buy fresh fish and watch the morning auction. Traders and eateries can use a delivery-ordering page or a simple catalogue with ordering by WhatsApp.', src: 1, demo: 'antar', pkg: 'landing-page' },
          { name: 'Tempeh chips & snack gifts', body: 'Tempeh chips are a signature small-business product of Trenggalek, and demand rises before Lebaran. A simple online store helps buyers from other cities order, and a tidy catalogue makes seasonal orders easier to track.', src: 2, demo: 'jajan', pkg: 'toko-online-simple' },
          { name: 'Batik & clothing', body: 'Natural-dye batik is one of Trenggalek’s signature batiks. Close, clear photos of the cloth, its size and the story of the dyeing help buyers who cannot come and feel the fabric.', src: 3, demo: 'lungsin', pkg: 'toko-online-simple' },
        ],
        demoWhy: {
          hotel: 'Room booking with an availability calendar.',
          beranda: 'Pick an area first, good for many guesthouses or rentals.',
          antar: 'Delivery ordering from local eateries.',
          jajan: 'Snacks with an order link.',
          lungsin: 'Clothing from woven cloth with close-up pattern photos.',
          modewear: 'Clothing sewn after it is ordered.',
        },
        faq: [
          { q: 'Does PintuWeb have an office in Trenggalek?', a: 'No. PintuWeb is based in Tulungagung and serves Trenggalek online through WhatsApp and email. Every stage is done remotely.' },
          { q: 'Does a small homestay need a reservation system?', a: 'Not necessarily. With only a few rooms, a landing page with photos and a WhatsApp button may be enough. A reservation system helps when guests keep asking which room is free.' },
          { q: 'Can a snack seller take orders from other cities?', a: 'Yes. A catalogue with checkout by WhatsApp in the Simple Online Store package is the lightest way to start.' },
        ],
        wa: 'Hello PintuWeb, my business is in Trenggalek and I would like to ask about a website (Web Design for Trenggalek page).',
      },
    },
  },
]

export const cityOf = (key: CityKey) => CITIES.find((c) => c.key === key)!
export const cityByPage = (page: PageKey) => CITIES.find((c) => c.page === page)!
export const cityText = (c: City, lang: Lang): CityText => c.text[lang === 'en' ? 'en' : 'id']

/** Teks antarmuka halaman kota (bersama untuk tiga kota). */
export const CITY_UI = {
  id: {
    sectorsKicker: 'Per jenis usaha',
    demoKicker: 'Demo yang cocok',
    demoTitle: 'Contoh yang bisa kamu coba',
    demoLead: 'Semua usaha di demo ini fiktif. Buka di HP-mu dan bayangkan usahamu di sana.',
    openDemo: 'Buka demo',
    pkgKicker: 'Paket yang disarankan',
    pkgTitle: 'Harga mulai dan perkiraan waktu',
    from: 'Harga mulai',
    time: 'Perkiraan waktu',
    pkgLabel: 'Paket yang cocok:',
    fromLabel: 'Harga mulai',
    sourcesTitle: 'Sumber',
    sourcesNote: 'Fakta daerah dirujuk ke sumber di bawah.',
    nearbyTitle: 'Melayani juga',
    nearbyLead: 'Kota lain yang kami layani secara online, dan kota tempat PintuWeb berlokasi.',
    readTitle: 'Bacaan terkait',
    bizTitle: 'Website untuk jenis usahamu',
    faqTitle: 'Pertanyaan yang sering muncul',
    ctaTitle: 'Ceritakan usahamu',
    ctaLead: 'Balasan di jam kerja, tanpa biaya konsultasi.',
    seePricing: 'Lihat semua harga',
    tulungagung: 'Jasa Website Tulungagung',
  },
  en: {
    sectorsKicker: 'By type of business',
    demoKicker: 'Matching demos',
    demoTitle: 'Examples you can try',
    demoLead: 'Every business in these demos is fictional. Open one on your phone and picture your business there.',
    openDemo: 'Open demo',
    pkgKicker: 'Suggested packages',
    pkgTitle: 'Starting prices and estimated time',
    from: 'Starting price',
    time: 'Estimated time',
    pkgLabel: 'Suggested package:',
    fromLabel: 'Starting price',
    sourcesTitle: 'Sources',
    sourcesNote: 'Local facts are referenced to the sources below.',
    nearbyTitle: 'Also serving',
    nearbyLead: 'Other cities we serve online, and the city where PintuWeb is based.',
    readTitle: 'Related reading',
    bizTitle: 'Websites by type of business',
    faqTitle: 'Frequently asked questions',
    ctaTitle: 'Tell us about your business',
    ctaLead: 'We reply during working hours, with no consultation fee.',
    seePricing: 'See all pricing',
    tulungagung: 'Tulungagung web design',
  },
} as const
export const cityUi = (lang: Lang) => CITY_UI[lang === 'en' ? 'en' : 'id']
