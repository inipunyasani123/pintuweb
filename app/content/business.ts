// Halaman "Website untuk <jenis usaha>" (rute: app/[lang]/website-untuk, indeks + 8 halaman). Hanya id & en (seperti artikel).
// Pembantu orang awam memilih: masalah umum, yang bisa dibuat, demo yang cocok, paket, FAQ. Angka TIDAK ditulis di sini:
// harga & durasi diambil dari lib/packages.ts lewat packagesFor(). Demo = slug di lib/demos.ts (nama & tagline dari demosFor()).
import type { DemoCategory } from '../lib/demos'
import type { Hl } from '../i18n/dict/id'
import type { Lang } from '../i18n/config'
import type { BizKey } from '../i18n/slugs'
import type { ArticleKey, ServiceKey } from '../i18n/slugs'

export type BizLang = 'id' | 'en'
export const BIZ_LANGS: Lang[] = ['id', 'en']

export type BizText = {
  /** nama jenis usaha, dipakai di kartu indeks dan tautan */
  name: string
  /** <title> tanpa "| PintuWeb" (template menambahkannya; total ≤60 karakter) */
  title: string
  /** meta description ≤155 karakter */
  description: string
  h1: Hl
  /** 1–2 kalimat masalah yang umum di usaha ini */
  problem: string
  /** satu kalimat untuk kartu di indeks */
  blurb: string
  /** 3–5 poin: apa yang bisa dibuat */
  builds: string[]
  /** 2 hal yang sering terlewat */
  tips: { title: string; body: string }[]
  /** alasan tiap demo cocok (kuncinya slug demo) */
  demoWhy: Record<string, string>
  /** alasan tiap paket disarankan (kuncinya slug paket) */
  pkgWhy: Record<string, string>
  faq: { q: string; a: string }[]
  /** pesan pembuka WhatsApp */
  wa: string
}

export type Biz = {
  key: BizKey
  tone: DemoCategory
  /** demo (slug lib/demos.ts) yang cocok, urut dari yang paling mewakili */
  demos: string[]
  /** paket yang disarankan (slug lib/packages.ts); yang pertama jadi harga utama */
  pkgs: string[]
  /** layanan yang menaut ke halaman ini */
  services: ServiceKey[]
  /** artikel terkait (hanya id/en, seperti halamannya) */
  articles: ArticleKey[]
  text: Record<BizLang, BizText>
}

export const BIZ: Biz[] = [
  {
    key: 'kafe-restoran',
    tone: 'menu',
    demos: ['kopi', 'bakso', 'restoran', 'cissycoffee', 'member'],
    pkgs: ['landing-page', 'sistem-reservasi', 'aplikasi-mobile'],
    services: ['landing-page', 'aplikasi-mobile'],
    articles: ['menu-qr', 'booking'],
    text: {
      id: {
        name: 'Kafe & restoran',
        title: 'Website untuk Kafe & Restoran',
        description: 'Website kafe dan restoran: menu digital QR, halaman promo, dan pesan meja online. Lihat demo yang cocok, paket, dan harga mulainya.',
        h1: ['Website untuk ', 'kafe & restoran', ' yang menu dan jam bukanya selalu terbaru.'],
        problem: 'Menu cetak cepat usang, harga berubah, dan tamu bertanya hal yang sama lewat chat setiap hari. Website membuat info itu satu tempat, bisa dibuka dari QR di meja.',
        blurb: 'Menu QR, halaman promo, dan pesan meja.',
        builds: [
          'Menu digital yang dibuka dari QR di meja, foto dan harga mudah diganti',
          'Halaman promo dengan jam buka, peta, dan tombol WhatsApp',
          'Pesan meja online lewat denah, supaya tamu tidak perlu menelepon',
          'Kartu member dan poin di aplikasi, bila kamu ingin pelanggan kembali',
        ],
        tips: [
          { title: 'Mulai dari menu, bukan dari fitur', body: 'Banyak kafe langsung ingin aplikasi. Biasanya menu QR dan halaman promo sudah menjawab sebagian besar pertanyaan tamu.' },
          { title: 'Foto makanan yang jujur', body: 'Foto sendiri dengan cahaya jendela sering lebih meyakinkan daripada foto stok. Siapkan beberapa foto sebelum desain mulai.' },
        ],
        demoWhy: {
          kopi: 'Menu bergaya kartu cupping untuk kedai kopi.',
          bakso: 'Menu warung dengan pilihan level pedas.',
          restoran: 'Tamu memilih meja dari denah, tanpa telepon.',
          cissycoffee: 'Halaman promo satu kedai kopi.',
          member: 'Kartu member dan poin untuk pelanggan tetap.',
        },
        pkgWhy: {
          'landing-page': 'Menu digital dan halaman promo masuk paket ini. Cocok untuk memulai.',
          'sistem-reservasi': 'Untuk restoran yang ingin tamu memesan meja sendiri.',
          'aplikasi-mobile': 'Untuk member, poin, atau pesan-antar di HP pelanggan.',
        },
        faq: [
          { q: 'Apa bedanya menu QR dan website kafe?', a: 'Menu QR adalah halaman menu yang dibuka dengan memindai kode di meja. Website kafe bisa memuat menu itu, ditambah cerita, jam buka, peta, dan promo. Keduanya bisa dibuat dalam satu paket Landing Page.' },
          { q: 'Kalau harga menu berubah, apa harus minta ke PintuWeb?', a: 'Soal siapa yang mengubah isi dibicarakan saat konsultasi, sesuai paket yang kamu pilih. Sampaikan kebutuhanmu supaya kami sarankan cara yang paling mudah.' },
          { q: 'Bisa terima pesanan atau reservasi lewat website?', a: 'Bisa. Paket Sistem Reservasi Online memuat pesan meja dengan konfirmasi lewat WhatsApp atau email dan panel admin. Pesan-antar bisa dibuat sebagai aplikasi.' },
        ],
        wa: 'Halo PintuWeb, saya punya kafe/restoran dan ingin tanya soal website (halaman Website untuk Kafe & Restoran).',
      },
      en: {
        name: 'Cafes & restaurants',
        title: 'Website for Cafes & Restaurants',
        description: 'Websites for cafes and restaurants: QR digital menus, promo pages and online table booking. See matching demos, packages and starting prices.',
        h1: ['A website for your ', 'cafe or restaurant', ' with a menu and hours that are always current.'],
        problem: 'Printed menus go out of date, prices change, and guests ask the same questions by chat every day. A website keeps it all in one place, one scan away from the table.',
        blurb: 'QR menus, promo pages and table booking.',
        builds: [
          'A digital menu opened from a QR code on the table, with photos and prices that are easy to change',
          'A promo page with opening hours, a map and a WhatsApp button',
          'Online table booking from a floor plan, so guests do not need to phone',
          'A member card with points in an app, if you want guests to come back',
        ],
        tips: [
          { title: 'Start with the menu, not with features', body: 'Many cafes want an app straight away. A QR menu and a promo page usually answer most of what guests ask.' },
          { title: 'Honest food photos', body: 'Your own photos in window light are often more convincing than stock photos. Have a few ready before the design starts.' },
        ],
        demoWhy: {
          kopi: 'A menu styled like a cupping card, for a coffee shop.',
          bakso: 'A street-stall menu with spice levels.',
          restoran: 'Guests pick a table from a floor plan, no phone call.',
          cissycoffee: 'A promo page for one coffee shop.',
          member: 'A member card and points for regular customers.',
        },
        pkgWhy: {
          'landing-page': 'The digital menu and promo page fit in this package. A good place to start.',
          'sistem-reservasi': 'For restaurants that want guests to book tables themselves.',
          'aplikasi-mobile': 'For members, points or delivery on your customers’ phones.',
        },
        faq: [
          { q: 'What is the difference between a QR menu and a cafe website?', a: 'A QR menu is a menu page opened by scanning a code on the table. A cafe website can hold that menu plus your story, hours, map and promos. Both can be built in one Landing Page package.' },
          { q: 'If a menu price changes, do I have to ask PintuWeb?', a: 'Who updates the content is agreed during the consultation, depending on the package you choose. Tell us what you need and we will suggest the easiest way.' },
          { q: 'Can the website take orders or bookings?', a: 'Bookings, yes. The Online Reservation System package includes table booking with confirmation by WhatsApp or email and an admin panel. Delivery ordering can be built as an app.' },
        ],
        wa: 'Hello PintuWeb, I run a cafe/restaurant and would like to ask about a website (Website for Cafes & Restaurants page).',
      },
    },
  },
  {
    key: 'klinik-kesehatan',
    tone: 'reservasi',
    demos: ['klinik', 'takar', 'absensi'],
    pkgs: ['sistem-reservasi', 'standar-umkm'],
    services: ['company-profile', 'website-custom'],
    articles: ['booking', 'seo-checklist'],
    text: {
      id: {
        name: 'Klinik & kesehatan',
        title: 'Website untuk Klinik & Kesehatan',
        description: 'Website klinik, praktik dokter, dan usaha kesehatan: jadwal dokter, janji temu online, dan halaman layanan. Lihat demo, paket, dan harga mulai.',
        h1: ['Website untuk ', 'klinik & usaha kesehatan', ' yang membuat pasien tahu harus ke mana.'],
        problem: 'Pasien bertanya jadwal dokter, layanan, dan jam buka lewat telepon, sementara resepsionis sibuk. Website yang jelas menjawab semua itu lebih dulu.',
        blurb: 'Jadwal dokter, janji temu, halaman layanan.',
        builds: [
          'Halaman layanan dan profil dokter yang mudah dibaca dari HP',
          'Jadwal praktik, jam buka, dan peta di satu tempat',
          'Janji temu online dengan slot yang terisi otomatis, dikelola dari panel admin',
          'Konfirmasi janji lewat WhatsApp atau email',
        ],
        tips: [
          { title: 'Jangan tulis janji yang tidak bisa ditepati', body: 'Hindari kata seperti “terbaik” atau “pasti sembuh”. Cukup tulis layanan, jadwal, dan cara membuat janji dengan jelas.' },
          { title: 'Data pasien tidak perlu ada di website', body: 'Website cukup menerima nama dan keperluan janji. Hal medis tetap dibicarakan langsung dengan tenaga kesehatan.' },
        ],
        demoWhy: {
          klinik: 'Pasien memilih dokter dan jam, lalu membuat janji temu.',
          takar: 'Contoh toko untuk produk perawatan kulit dengan kandungan ditulis jelas.',
          absensi: 'Absensi dan jadwal shift, berguna bila stafmu bergantian.',
        },
        pkgWhy: {
          'sistem-reservasi': 'Janji temu dengan kalender, slot, dan panel admin.',
          'standar-umkm': 'Website 3–5 halaman bila kamu cukup dengan profil, layanan, dan kontak.',
        },
        faq: [
          { q: 'Apakah janji temu bisa dikelola oleh admin klinik?', a: 'Bisa. Paket Sistem Reservasi Online memuat panel admin untuk jadwal dan pesanan, serta aturan jam operasional dan kapasitas.' },
          { q: 'Apakah pasien harus membuat akun?', a: 'Itu bisa diatur sesuai kebutuhan. Bicarakan alurnya saat konsultasi; pada demo, pasien cukup memilih dokter dan waktu.' },
          { q: 'Apakah ada website yang lebih sederhana dulu?', a: 'Ada. Paket Standar UMKM cukup untuk profil klinik, daftar layanan, dan kontak. Sistem janji temu bisa ditambahkan nanti.' },
        ],
        wa: 'Halo PintuWeb, saya mengelola klinik/usaha kesehatan dan ingin tanya soal website (halaman Website untuk Klinik & Kesehatan).',
      },
      en: {
        name: 'Clinics & health',
        title: 'Website for Clinics & Health Practices',
        description: 'Websites for clinics, doctors and health businesses: doctor schedules, online appointments and service pages. See demos, packages and starting prices.',
        h1: ['A website for your ', 'clinic or health practice', ' that shows patients where to go.'],
        problem: 'Patients phone to ask about doctor schedules, services and opening hours while reception is busy. A clear website answers all of that first.',
        blurb: 'Doctor schedules, appointments, service pages.',
        builds: [
          'Service and doctor profile pages that read well on a phone',
          'Practice schedule, opening hours and a map in one place',
          'Online appointments with slots that fill automatically, managed from an admin panel',
          'Appointment confirmation by WhatsApp or email',
        ],
        tips: [
          { title: 'Do not write promises you cannot keep', body: 'Avoid words like “the best” or “guaranteed cure”. Simply state the services, the schedule and how to book.' },
          { title: 'Patient records do not belong on the website', body: 'The site only needs a name and the reason for the visit. Medical matters stay between patient and professional.' },
        ],
        demoWhy: {
          klinik: 'Patients pick a doctor and a time, then book.',
          takar: 'A sample shop for skin-care products with ingredients stated plainly.',
          absensi: 'Attendance and shift schedules, handy when your staff rotate.',
        },
        pkgWhy: {
          'sistem-reservasi': 'Appointments with a calendar, slots and an admin panel.',
          'standar-umkm': 'A 3–5 page website if a profile, services and contact are enough.',
        },
        faq: [
          { q: 'Can the clinic staff manage the appointments?', a: 'Yes. The Online Reservation System package includes an admin panel for schedules and bookings, plus rules for opening hours and capacity.' },
          { q: 'Do patients need to create an account?', a: 'That can be set up to suit you. We talk through the flow in the consultation; in the demo, patients just pick a doctor and a time.' },
          { q: 'Is there a simpler website to start with?', a: 'Yes. The SME Standard package covers a clinic profile, a list of services and contact details. Appointments can be added later.' },
        ],
        wa: 'Hello PintuWeb, I run a clinic/health business and would like to ask about a website (Website for Clinics & Health page).',
      },
    },
  },
  {
    key: 'sekolah-kursus',
    tone: 'landing',
    demos: ['sekolah', 'eduplay', 'lumicast', 'reuni'],
    pkgs: ['standar-umkm', 'aplikasi-mobile', 'landing-page'],
    services: ['company-profile', 'aplikasi-mobile'],
    articles: ['website-sekolah', 'biaya-aplikasi'],
    text: {
      id: {
        name: 'Sekolah & kursus',
        title: 'Website untuk Sekolah & Kursus',
        description: 'Website sekolah, bimbel, dan tempat kursus: profil, jadwal, pendaftaran, dan aplikasi orang tua. Lihat demo yang cocok, paket, dan harga mulai.',
        h1: ['Website untuk ', 'sekolah & tempat kursus', ' yang menjawab pertanyaan orang tua.'],
        problem: 'Orang tua ingin tahu program, jadwal, biaya, dan cara mendaftar, tetapi infonya tersebar di brosur dan grup chat. Satu website merapikannya.',
        blurb: 'Profil, program, pendaftaran, aplikasi orang tua.',
        builds: [
          'Profil sekolah atau kursus, program, dan jadwal yang mudah dibaca',
          'Halaman pendaftaran dengan tombol WhatsApp ke admin',
          'Landing page khusus untuk satu kelas atau program baru',
          'Aplikasi orang tua untuk info dan pengumuman, bila diperlukan',
        ],
        tips: [
          { title: 'Tulis biaya dan syarat dengan jelas', body: 'Pertanyaan paling sering dari orang tua adalah biaya dan cara daftar. Letakkan keduanya di halaman yang mudah ditemukan.' },
          { title: 'Perbarui jadwal secara rutin', body: 'Jadwal lama membuat orang ragu. Bicarakan di awal siapa yang memperbarui isi.' },
        ],
        demoWhy: {
          sekolah: 'Aplikasi orang tua siswa SD untuk info sehari-hari.',
          eduplay: 'Halaman satu program belajar matematika untuk anak SD.',
          lumicast: 'Landing page siaran pelatihan untuk pengurus organisasi.',
          reuni: 'Undangan reuni angkatan, cocok untuk alumni.',
        },
        pkgWhy: {
          'standar-umkm': 'Profil, program, blog pengumuman, dan kontak dalam 3–5 halaman.',
          'aplikasi-mobile': 'Aplikasi untuk orang tua atau siswa di Android dan iOS.',
          'landing-page': 'Satu halaman untuk promosi kelas atau program baru.',
        },
        faq: [
          { q: 'Apakah ada artikel soal biaya website sekolah?', a: 'Ada. Baca artikel soal harga website sekolah di bagian artikel untuk gambaran biaya dan apa yang perlu disiapkan.' },
          { q: 'Bisa membuat aplikasi untuk orang tua siswa?', a: 'Bisa lewat paket Aplikasi Mobile. Fitur yang kamu butuhkan, seperti pengumuman atau jadwal, dibicarakan dan masuk penawaran.' },
          { q: 'Kursus kecil perlu website lengkap?', a: 'Belum tentu. Satu landing page dengan program, jadwal, dan tombol WhatsApp sering sudah cukup sebagai awal.' },
        ],
        wa: 'Halo PintuWeb, saya mengelola sekolah/kursus dan ingin tanya soal website (halaman Website untuk Sekolah & Kursus).',
      },
      en: {
        name: 'Schools & courses',
        title: 'Website for Schools & Course Providers',
        description: 'Websites for schools, tutoring centres and course providers: profile, schedule, enrolment and a parent app. See matching demos, packages and prices.',
        h1: ['A website for your ', 'school or course', ' that answers parents’ questions.'],
        problem: 'Parents want to know the programmes, schedule, fees and how to enrol, but the details are scattered across brochures and chat groups. One website tidies it up.',
        blurb: 'Profile, programmes, enrolment, parent app.',
        builds: [
          'A school or course profile with programmes and schedules that are easy to read',
          'An enrolment page with a WhatsApp button to your admin',
          'A landing page for one class or a new programme',
          'A parent app for news and announcements, if needed',
        ],
        tips: [
          { title: 'State fees and requirements plainly', body: 'Fees and how to enrol are what parents ask most. Put both where they are easy to find.' },
          { title: 'Keep the schedule current', body: 'An old schedule makes people hesitate. Agree at the start who updates the content.' },
        ],
        demoWhy: {
          sekolah: 'A parent app for primary-school pupils’ daily information.',
          eduplay: 'A page for one maths programme for primary-school children.',
          lumicast: 'A landing page for training broadcasts for organisation staff.',
          reuni: 'A class-reunion invitation, handy for alumni.',
        },
        pkgWhy: {
          'standar-umkm': 'Profile, programmes, a news blog and contact in 3–5 pages.',
          'aplikasi-mobile': 'An app for parents or pupils on Android and iOS.',
          'landing-page': 'One page to promote a class or a new programme.',
        },
        faq: [
          { q: 'Is there an article about school website costs?', a: 'Yes. Read our article on school website costs in the articles section for a picture of the cost and what to prepare.' },
          { q: 'Can you build an app for pupils’ parents?', a: 'Yes, with the Mobile App package. The features you need, such as announcements or a schedule, are discussed and go into the quote.' },
          { q: 'Does a small course need a full website?', a: 'Not necessarily. One landing page with the programme, schedule and a WhatsApp button is often enough to begin with.' },
        ],
        wa: 'Hello PintuWeb, I run a school/course and would like to ask about a website (Website for Schools & Courses page).',
      },
    },
  },
  {
    key: 'kos-properti-penginapan',
    tone: 'properti',
    demos: ['beranda', 'homigo', 'hotel', 'kos', 'lumora', 'propertia'],
    pkgs: ['website-properti', 'sistem-reservasi', 'standar-umkm'],
    services: ['website-custom', 'aplikasi-mobile'],
    articles: ['wisata', 'google-maps'],
    text: {
      id: {
        name: 'Kos, properti & penginapan',
        title: 'Website untuk Kos, Properti & Penginapan',
        description: 'Website agen properti, kos, dan penginapan: katalog listing, jadwal kunjungan, dan pesan kamar online. Lihat demo yang cocok, paket, dan harga mulai.',
        h1: ['Website untuk ', 'kos, properti & penginapan', ' yang membuat calon penghuni cepat yakin.'],
        problem: 'Foto tersebar di grup dan media sosial, harga berubah-ubah, dan calon penghuni tidak tahu kamar mana yang masih kosong. Satu katalog merapikan semuanya.',
        blurb: 'Katalog listing, kunjungan, pesan kamar.',
        builds: [
          'Katalog listing dengan filter lokasi, harga, dan tipe',
          'Halaman detail dengan galeri foto dan peta',
          'Formulir jadwal kunjungan atau tanya agen',
          'Pesan kamar dengan kalender ketersediaan untuk penginapan',
          'Aplikasi pemilik kos untuk tagihan dan laporan kerusakan',
        ],
        tips: [
          { title: 'Foto dan denah lebih menentukan dari kata-kata', body: 'Calon penghuni mencari ukuran kamar, kamar mandi, dan lingkungan. Siapkan foto yang jelas sebelum desain mulai.' },
          { title: 'Pisahkan jual-sewa dan menginap', body: 'Katalog properti dan pesan kamar punya alur berbeda. Pilih yang sesuai usahamu, lalu tambah yang lain bila perlu.' },
        ],
        demoWhy: {
          beranda: 'Pencari memilih kawasan dulu, baru melihat listing.',
          homigo: 'Rumah pertama dan tempat sewa dalam satu katalog.',
          hotel: 'Pesan kamar di penginapan dengan kalender.',
          kos: 'Aplikasi pemilik kos: tagihan sewa dan laporan kerusakan.',
          lumora: 'Hunian mewah dengan kunjungan privat.',
          propertia: 'Katalog rumah yang dikurasi.',
        },
        pkgWhy: {
          'website-properti': 'Katalog listing dengan panel admin untuk agen atau developer.',
          'sistem-reservasi': 'Pesan kamar atau penginapan dengan kalender ketersediaan.',
          'standar-umkm': 'Profil sederhana bila listing-mu hanya beberapa.',
        },
        faq: [
          { q: 'Bisa memasang banyak listing sendiri?', a: 'Bisa. Paket Website Properti memuat panel admin untuk mengelola listing, dengan SEO per listing.' },
          { q: 'Bagaimana dengan penginapan kecil atau homestay?', a: 'Paket Sistem Reservasi Online cocok: kalender ketersediaan, aturan harga dan kapasitas, dan konfirmasi lewat WhatsApp atau email. Baca juga artikel soal website wisata dan penginapan.' },
          { q: 'Apakah ada aplikasi untuk pemilik kos?', a: 'Demo Grendel Kos menunjukkan contohnya: tagihan sewa dan laporan kerusakan. Fitur yang kamu butuhkan dibicarakan dan masuk penawaran.' },
        ],
        wa: 'Halo PintuWeb, saya punya usaha kos/properti/penginapan dan ingin tanya soal website (halaman Website untuk Kos, Properti & Penginapan).',
      },
      en: {
        name: 'Boarding houses, property & lodging',
        title: 'Website for Rentals, Property & Lodging',
        description: 'Websites for property agents, boarding houses and lodging: listings, viewing requests and online room booking. See matching demos, packages and prices.',
        h1: ['A website for your ', 'rentals, property or lodging', ' that helps people decide quickly.'],
        problem: 'Photos are scattered across chat groups and social media, prices keep changing, and people cannot tell which room is still free. One catalogue tidies it all.',
        blurb: 'Listings, viewings, room booking.',
        builds: [
          'A listing catalogue with filters for location, price and type',
          'Detail pages with a photo gallery and a map',
          'A form to book a viewing or ask an agent',
          'Room booking with an availability calendar for lodging',
          'A landlord app for rent bills and damage reports',
        ],
        tips: [
          { title: 'Photos and floor plans matter more than words', body: 'People look for room size, bathroom and the neighbourhood. Prepare clear photos before the design starts.' },
          { title: 'Separate sales or rentals from overnight stays', body: 'A property catalogue and room booking work differently. Pick the one that fits your business, then add the other if needed.' },
        ],
        demoWhy: {
          beranda: 'Visitors choose an area first, then see listings.',
          homigo: 'First homes and rentals in one catalogue.',
          hotel: 'Room booking for a lodge, with a calendar.',
          kos: 'A landlord app: rent bills and damage reports.',
          lumora: 'Luxury homes with private viewings.',
          propertia: 'A curated catalogue of homes.',
        },
        pkgWhy: {
          'website-properti': 'A listing catalogue with an admin panel for agents or developers.',
          'sistem-reservasi': 'Room or lodging booking with an availability calendar.',
          'standar-umkm': 'A simple profile if you only have a few listings.',
        },
        faq: [
          { q: 'Can I add many listings myself?', a: 'Yes. The Property Website package includes an admin panel to manage listings, with SEO for each listing.' },
          { q: 'What about a small guesthouse or homestay?', a: 'The Online Reservation System package fits: an availability calendar, price and capacity rules, and confirmation by WhatsApp or email. See also our article on tourism and homestay websites.' },
          { q: 'Is there an app for boarding-house owners?', a: 'The Grendel Kos demo shows one: rent bills and damage reports. The features you need are discussed and go into the quote.' },
        ],
        wa: 'Hello PintuWeb, I run a rental/property/lodging business and would like to ask about a website (Website for Rentals, Property & Lodging page).',
      },
    },
  },
  {
    key: 'toko-umkm-produk',
    tone: 'toko',
    demos: ['tanur', 'lungsin', 'daunjendela', 'takar', 'kasir', 'woodora'],
    pkgs: ['toko-online-simple', 'toko-online-full', 'aplikasi-mobile'],
    services: ['toko-online'],
    articles: ['toko-vs-marketplace', 'biaya-toko-online'],
    text: {
      id: {
        name: 'Toko & UMKM produk',
        title: 'Website untuk Toko Online & UMKM Produk',
        description: 'Website toko online dan UMKM produk: katalog, pesan lewat WhatsApp, dan aplikasi kasir. Lihat demo yang cocok, paket, dan harga mulainya.',
        h1: ['Website untuk ', 'toko & UMKM produk', ' yang bisa dipesan tanpa bolak-balik chat.'],
        problem: 'Katalog di status WhatsApp dan Instagram cepat tenggelam, dan pembeli harus bertanya satu per satu. Toko online membuat produk, harga, dan cara memesan ada di satu tempat.',
        blurb: 'Katalog, pesan via WhatsApp, kasir.',
        builds: [
          'Katalog produk dengan foto, harga, dan kategori',
          'Checkout lewat WhatsApp, langsung jadi pesanan',
          'Toko lengkap dengan keranjang dan pembayaran online bila kamu butuh',
          'Aplikasi kasir untuk warung dan UMKM',
        ],
        tips: [
          { title: 'Pelajari dulu marketplace-mu', body: 'Marketplace bagus untuk ditemukan, toko sendiri bagus untuk pelanggan tetap. Banyak usaha memakai keduanya; baca artikel perbandingannya.' },
          { title: 'Mulai dari 20 produk terbaik', body: 'Paket Toko Online Simple memuat sampai 20 item. Itu cukup untuk menguji apakah pembeli datang.' },
        ],
        demoWhy: {
          tanur: 'Keramik buatan tangan dengan katalog rapi.',
          lungsin: 'Pakaian dari kain lurik tenun.',
          daunjendela: 'Tanaman hias yang dipilih dari cahaya jendela.',
          takar: 'Perawatan kulit dengan takaran pakai yang jelas.',
          kasir: 'Aplikasi kasir warung di HP.',
          woodora: 'Landing page furnitur kayu sesuai ukuran.',
        },
        pkgWhy: {
          'toko-online-simple': 'Katalog sampai 20 item dengan checkout lewat WhatsApp.',
          'toko-online-full': 'Toko lengkap bila pesanan dan stokmu sudah banyak.',
          'aplikasi-mobile': 'Untuk kasir atau aplikasi pesanan di HP.',
        },
        faq: [
          { q: 'Toko sendiri atau marketplace?', a: 'Keduanya punya tempat. Marketplace membantu ditemukan; toko sendiri memegang data pelanggan dan tampilan mereknya. Artikel perbandingannya membahas hal ini.' },
          { q: 'Bisa pesan lewat WhatsApp saja?', a: 'Bisa. Paket Toko Online Simple memakai checkout lewat WhatsApp, jadi tidak perlu sistem pembayaran rumit di awal.' },
          { q: 'Berapa lama toko online jadi?', a: 'Lihat durasi paket di bawah. Waktunya dihitung setelah bahan seperti foto dan daftar produk lengkap.' },
        ],
        wa: 'Halo PintuWeb, saya punya usaha produk dan ingin tanya soal toko online (halaman Website untuk Toko & UMKM Produk).',
      },
      en: {
        name: 'Shops & product businesses',
        title: 'Website for Online Shops & Product Businesses',
        description: 'Websites for online shops and product-based small businesses: catalogue, ordering by WhatsApp and a cashier app. See matching demos, packages and prices.',
        h1: ['A website for your ', 'shop or product business', ' that takes orders without endless chats.'],
        problem: 'A catalogue in WhatsApp status and Instagram sinks fast, and buyers have to ask one question at a time. An online shop puts products, prices and how to order in one place.',
        blurb: 'Catalogue, WhatsApp ordering, cashier.',
        builds: [
          'A product catalogue with photos, prices and categories',
          'Checkout by WhatsApp that turns straight into an order',
          'A full shop with a cart and online payment if you need it',
          'A cashier app for small shops and stalls',
        ],
        tips: [
          { title: 'Think about marketplaces first', body: 'Marketplaces help you get found, your own shop suits repeat customers. Many businesses use both; read our comparison article.' },
          { title: 'Start with your 20 best products', body: 'The Simple Online Store package holds up to 20 items. That is enough to test whether buyers show up.' },
        ],
        demoWhy: {
          tanur: 'Handmade ceramics with a tidy catalogue.',
          lungsin: 'Clothing made from woven lurik cloth.',
          daunjendela: 'House plants chosen by the light in your window.',
          takar: 'Skin care with clear usage amounts.',
          kasir: 'A shop cashier app on a phone.',
          woodora: 'A landing page for made-to-size wooden furniture.',
        },
        pkgWhy: {
          'toko-online-simple': 'A catalogue of up to 20 items with checkout by WhatsApp.',
          'toko-online-full': 'A full shop once your orders and stock grow.',
          'aplikasi-mobile': 'For a cashier or ordering app on a phone.',
        },
        faq: [
          { q: 'My own shop or a marketplace?', a: 'Both have a place. A marketplace helps you get found; your own shop keeps customer data and your brand look. Our comparison article covers it.' },
          { q: 'Can orders just come through WhatsApp?', a: 'Yes. The Simple Online Store package uses checkout by WhatsApp, so no complicated payment system is needed at the start.' },
          { q: 'How long does an online shop take?', a: 'See the package durations below. The time counts from when materials such as photos and the product list are complete.' },
        ],
        wa: 'Hello PintuWeb, I run a product business and would like to ask about an online shop (Website for Shops & Product Businesses page).',
      },
    },
  },
  {
    key: 'salon-laundry-jasa',
    tone: 'reservasi',
    demos: ['booking', 'laundry', 'futsal', 'kasir'],
    pkgs: ['sistem-reservasi', 'landing-page', 'aplikasi-mobile'],
    services: ['aplikasi-mobile', 'landing-page'],
    articles: ['booking', 'google-maps'],
    text: {
      id: {
        name: 'Salon, laundry & jasa',
        title: 'Website untuk Salon, Laundry & Usaha Jasa',
        description: 'Website salon, barbershop, laundry, dan usaha jasa: booking online, status cucian, dan aplikasi kasir. Lihat demo yang cocok, paket, dan harga mulai.',
        h1: ['Website untuk ', 'salon, laundry & usaha jasa', ' yang jadwalnya tidak lagi bentrok.'],
        problem: 'Pelanggan memesan lewat chat, jadwal ditulis di buku, dan dua orang bisa datang di jam yang sama. Booking online dan status yang jelas mengurangi salah paham.',
        blurb: 'Booking, status pesanan, kasir.',
        builds: [
          'Booking online dengan slot jam dan kapasitas yang diatur sendiri',
          'Halaman harga layanan dengan tombol WhatsApp',
          'Aplikasi status cucian dan jemput-antar untuk laundry',
          'Aplikasi kasir atau kartu pelanggan untuk usaha harian',
        ],
        tips: [
          { title: 'Daftar harga yang jelas mengurangi chat', body: 'Banyak pertanyaan pelanggan hanya soal harga dan lama pengerjaan. Tulis keduanya di halaman layanan.' },
          { title: 'Pilih jam yang benar-benar bisa dilayani', body: 'Slot booking sebaiknya mengikuti kapasitas nyata. Aturan jam buka dan kapasitas bisa diatur di sistem.' },
        ],
        demoWhy: {
          booking: 'Booking pangkas rambut dan salon dengan pilihan jam.',
          laundry: 'Pelanggan melihat status cucian dan meminta jemput-antar.',
          futsal: 'Booking lapangan dengan jadwal yang terisi otomatis.',
          kasir: 'Kasir sederhana di HP untuk usaha harian.',
        },
        pkgWhy: {
          'sistem-reservasi': 'Booking dengan kalender, slot, dan panel admin.',
          'landing-page': 'Satu halaman layanan dan harga bila booking lewat WhatsApp sudah cukup.',
          'aplikasi-mobile': 'Aplikasi status pesanan atau kasir di HP.',
        },
        faq: [
          { q: 'Bisa booking online tanpa aplikasi?', a: 'Bisa. Paket Sistem Reservasi Online berupa website dengan kalender dan slot, jadi pelanggan cukup membuka tautan. Artikel soal sistem booking online menjelaskan lebih lanjut.' },
          { q: 'Laundry kecil butuh aplikasi?', a: 'Belum tentu. Halaman layanan dengan harga dan tombol WhatsApp sering cukup. Aplikasi status cucian berguna bila pelanggan sering bertanya posisi cucian.' },
          { q: 'Apakah DP bisa dibayar online?', a: 'Paket Sistem Reservasi Online memuat opsi DP online lewat payment gateway. Bicarakan kebutuhanmu saat konsultasi.' },
        ],
        wa: 'Halo PintuWeb, saya punya usaha jasa (salon/laundry/lainnya) dan ingin tanya soal website (halaman Website untuk Salon, Laundry & Jasa).',
      },
      en: {
        name: 'Salons, laundries & services',
        title: 'Website for Salons, Laundries & Services',
        description: 'Websites for salons, barbershops, laundries and service businesses: online booking, laundry status and a cashier app. See demos, packages and prices.',
        h1: ['A website for your ', 'salon, laundry or service business', ' so appointments stop clashing.'],
        problem: 'Customers book by chat, the schedule lives in a notebook and two people can turn up at the same hour. Online booking and clear status cut the confusion.',
        blurb: 'Booking, order status, cashier.',
        builds: [
          'Online booking with time slots and capacity you set yourself',
          'A service price page with a WhatsApp button',
          'A laundry status and pick-up app',
          'A cashier or customer-card app for daily trade',
        ],
        tips: [
          { title: 'A clear price list means fewer chats', body: 'Many customer questions are only about price and turnaround. Put both on the service page.' },
          { title: 'Offer hours you can really serve', body: 'Booking slots should follow real capacity. Opening hours and capacity can be set in the system.' },
        ],
        demoWhy: {
          booking: 'Barber and salon booking with a choice of times.',
          laundry: 'Customers see laundry status and ask for pick-up and delivery.',
          futsal: 'Court booking with a schedule that fills automatically.',
          kasir: 'A simple cashier on a phone for daily trade.',
        },
        pkgWhy: {
          'sistem-reservasi': 'Booking with a calendar, slots and an admin panel.',
          'landing-page': 'One page of services and prices if booking by WhatsApp is enough.',
          'aplikasi-mobile': 'An order-status or cashier app on a phone.',
        },
        faq: [
          { q: 'Can people book online without an app?', a: 'Yes. The Online Reservation System package is a website with a calendar and slots, so customers just open a link. Our article on online booking systems explains more.' },
          { q: 'Does a small laundry need an app?', a: 'Not necessarily. A service page with prices and a WhatsApp button is often enough. A status app helps when customers keep asking where their laundry is.' },
          { q: 'Can a deposit be paid online?', a: 'The Online Reservation System package includes an online deposit option through a payment gateway. Talk to us about your needs in the consultation.' },
        ],
        wa: 'Hello PintuWeb, I run a service business (salon/laundry/other) and would like to ask about a website (Website for Salons, Laundries & Services page).',
      },
    },
  },
  {
    key: 'acara-undangan',
    tone: 'undangan',
    demos: ['wedding', 'aqiqah', 'khitanan', 'corporate', 'wisuda', 'tiket'],
    pkgs: ['undangan-digital', 'situs-acara', 'aplikasi-mobile'],
    services: ['undangan-digital', 'landing-page'],
    articles: ['undangan'],
    text: {
      id: {
        name: 'Acara & undangan',
        title: 'Website untuk Acara & Undangan Digital',
        description: 'Undangan digital pernikahan, aqiqah, khitanan, dan wisuda, serta situs acara dan tiket QR. Lihat demo yang cocok, paket, dan harga mulainya.',
        h1: ['Website untuk ', 'acara & undangan', ' yang sekali kirim, semua tamu tahu detailnya.'],
        problem: 'Undangan lewat chat sering terlewat, lokasi ditanyakan berulang, dan kamu tidak tahu siapa yang hadir. Undangan digital menaruh semuanya di satu tautan.',
        blurb: 'Undangan digital, situs acara, tiket QR.',
        builds: [
          'Undangan dari tema galeri, diisi data acaramu',
          'Detail acara, tombol peta, hitung mundur, dan konfirmasi hadir (RSVP)',
          'Situs acara untuk seminar atau pertemuan perusahaan',
          'Aplikasi e-tiket dengan kode QR untuk acara berbayar',
        ],
        tips: [
          { title: 'Setiap jenis acara punya tata letak sendiri', body: 'Pernikahan, aqiqah, khitanan, dan wisuda punya suasana berbeda. Pilih tema yang cocok dengan acaramu, bukan sekadar yang paling ramai.' },
          { title: 'Kirim tautan, jangan file', body: 'Tautan pribadi lebih ringan dibagikan lewat WhatsApp. Pada paket undangan digital, tautan aktif 12 bulan tanpa biaya perpanjangan.' },
        ],
        demoWhy: {
          wedding: 'Undangan pernikahan dengan cerita dan RSVP.',
          aqiqah: 'Undangan aqiqah dengan suasana tersendiri.',
          khitanan: 'Undangan khitanan dengan tata letak khas.',
          corporate: 'Situs acara untuk pertemuan perusahaan.',
          wisuda: 'Undangan wisuda untuk syukuran kelulusan.',
          tiket: 'Aplikasi tiket dengan e-tiket QR.',
        },
        pkgWhy: {
          'undangan-digital': 'Tema dari galeri, diisi data acaramu.',
          'situs-acara': 'Untuk acara besar yang butuh beberapa halaman.',
          'aplikasi-mobile': 'Untuk e-tiket dan check-in di HP.',
        },
        faq: [
          { q: 'Berapa lama undangan digital jadi?', a: 'Lihat durasi paket di bawah. Waktunya dihitung setelah data acara dan foto kamu kirim lengkap.' },
          { q: 'Apakah tamu perlu memasang aplikasi?', a: 'Tidak. Undangan berupa tautan website yang dibuka dari WhatsApp atau peramban.' },
          { q: 'Ada panduan memilih undangan digital?', a: 'Ada. Baca panduan undangan digital di bagian artikel untuk membandingkan tema dan hal yang perlu disiapkan.' },
        ],
        wa: 'Halo PintuWeb, saya ingin tanya soal undangan digital/situs acara (halaman Website untuk Acara & Undangan).',
      },
      en: {
        name: 'Events & invitations',
        title: 'Website for Events & Digital Invitations',
        description: 'Digital invitations for weddings, aqiqah, circumcision and graduations, plus event sites and QR tickets. See matching demos, packages and prices.',
        h1: ['A website for your ', 'event or invitation', ' so every guest has the details after one send.'],
        problem: 'Invitations sent by chat get missed, guests keep asking for the location and you never know who is coming. A digital invitation puts it all behind one link.',
        blurb: 'Digital invitations, event sites, QR tickets.',
        builds: [
          'An invitation from a gallery theme, filled with your event details',
          'Event details, a map button, a countdown and RSVP',
          'An event site for a seminar or a company gathering',
          'An e-ticket app with QR codes for paid events',
        ],
        tips: [
          { title: 'Each kind of event has its own layout', body: 'Weddings, aqiqah, circumcision and graduations feel different. Pick the theme that fits your event, not just the busiest one.' },
          { title: 'Send a link, not a file', body: 'A personal link is light to share on WhatsApp. With the digital invitation package the link stays active for 12 months with no renewal fee.' },
        ],
        demoWhy: {
          wedding: 'A wedding invitation with a story and RSVP.',
          aqiqah: 'An aqiqah invitation with its own mood.',
          khitanan: 'A circumcision invitation with a distinct layout.',
          corporate: 'An event site for a company gathering.',
          wisuda: 'A graduation invitation for the celebration.',
          tiket: 'A ticket app with QR e-tickets.',
        },
        pkgWhy: {
          'undangan-digital': 'A gallery theme filled with your event details.',
          'situs-acara': 'For bigger events that need several pages.',
          'aplikasi-mobile': 'For e-tickets and check-in on a phone.',
        },
        faq: [
          { q: 'How long does a digital invitation take?', a: 'See the package durations below. The time counts from when you have sent the full event details and photos.' },
          { q: 'Do guests need to install an app?', a: 'No. The invitation is a website link opened from WhatsApp or a browser.' },
          { q: 'Is there a guide to choosing one?', a: 'Yes. Read our digital invitation guide in the articles section to compare themes and see what to prepare.' },
        ],
        wa: 'Hello PintuWeb, I would like to ask about a digital invitation/event site (Website for Events & Invitations page).',
      },
    },
  },
  {
    key: 'komunitas-masjid',
    tone: 'mobile',
    demos: ['masjid', 'tiket', 'kaset', 'reuni'],
    pkgs: ['standar-umkm', 'aplikasi-mobile', 'landing-page'],
    services: ['aplikasi-mobile', 'company-profile'],
    articles: ['website-desa', 'biaya-aplikasi'],
    text: {
      id: {
        name: 'Komunitas & masjid',
        title: 'Website untuk Komunitas, Masjid & Organisasi',
        description: 'Website dan aplikasi masjid, komunitas, dan organisasi: jadwal salat, kajian, kas, dan tiket acara. Lihat demo yang cocok, paket, dan harga mulai.',
        h1: ['Website untuk ', 'masjid, komunitas & organisasi', ' yang kegiatannya mudah diikuti.'],
        problem: 'Jadwal kajian, kegiatan, dan laporan kas biasanya tersebar di papan pengumuman dan grup chat. Satu tempat membuat jamaah dan anggota tahu apa yang terjadi.',
        blurb: 'Jadwal, kegiatan, kas, tiket acara.',
        builds: [
          'Aplikasi masjid dengan jadwal salat, kajian, dan kas',
          'Halaman profil dan kegiatan untuk komunitas atau organisasi',
          'Tiket acara dengan e-tiket QR untuk kegiatan besar',
          'Landing page untuk penggalangan atau pendaftaran satu kegiatan',
        ],
        tips: [
          { title: 'Tentukan siapa yang mengisi', body: 'Kegiatan yang rutin berganti butuh orang yang memperbarui. Putuskan sejak awal siapa pengurusnya.' },
          { title: 'Laporan kas ditulis apa adanya', body: 'Halaman kas menumbuhkan kepercayaan bila diperbarui rutin. Lebih baik sederhana tetapi konsisten.' },
        ],
        demoWhy: {
          masjid: 'Jadwal salat, kajian, dan kas masjid dalam satu aplikasi.',
          tiket: 'Tiket acara dengan e-tiket QR untuk kegiatan komunitas.',
          kaset: 'Mixtape dan radio komunitas dalam satu halaman.',
          reuni: 'Undangan reuni untuk menghimpun alumni.',
        },
        pkgWhy: {
          'standar-umkm': 'Profil, kegiatan, dan kontak untuk organisasi dalam 3–5 halaman.',
          'aplikasi-mobile': 'Aplikasi jadwal, kajian, atau tiket di HP anggota.',
          'landing-page': 'Satu halaman untuk satu kegiatan atau pendaftaran.',
        },
        faq: [
          { q: 'Apakah demo masjid memakai data masjid sungguhan?', a: 'Tidak. Semua demo memakai usaha dan data fiktif. Data masjidmu akan diganti dengan yang asli.' },
          { q: 'Organisasi kecil perlu aplikasi?', a: 'Belum tentu. Website sederhana atau satu landing page dengan jadwal sering sudah cukup. Aplikasi berguna bila anggota sering membuka info yang sama.' },
          { q: 'Bisa untuk acara berbayar?', a: 'Aplikasi tiket seperti demo Karcis Wetan menampilkan e-tiket QR. Rinciannya dibicarakan saat konsultasi.' },
        ],
        wa: 'Halo PintuWeb, saya mengurus masjid/komunitas/organisasi dan ingin tanya soal website atau aplikasi (halaman Website untuk Komunitas & Masjid).',
      },
      en: {
        name: 'Communities & mosques',
        title: 'Website for Communities, Mosques & Groups',
        description: 'Websites and apps for mosques, communities and organisations: prayer times, talks, funds and event tickets. See matching demos, packages and prices.',
        h1: ['A website for your ', 'mosque, community or group', ' so activities are easy to follow.'],
        problem: 'Talk schedules, activities and fund reports are usually spread across notice boards and chat groups. One place lets members see what is happening.',
        blurb: 'Schedules, activities, funds, event tickets.',
        builds: [
          'A mosque app with prayer times, talks and funds',
          'A profile and activities page for a community or organisation',
          'Event tickets with QR e-tickets for larger gatherings',
          'A landing page to collect sign-ups or donations for one activity',
        ],
        tips: [
          { title: 'Decide who fills it in', body: 'Activities change often and need someone to update them. Decide at the start who looks after it.' },
          { title: 'Write fund reports as they are', body: 'A funds page builds trust when updated regularly. Simple but consistent is best.' },
        ],
        demoWhy: {
          masjid: 'Prayer times, talks and mosque funds in one app.',
          tiket: 'Event tickets with QR e-tickets for community activities.',
          kaset: 'Mixtapes and community radio on one page.',
          reuni: 'A reunion invitation to gather alumni.',
        },
        pkgWhy: {
          'standar-umkm': 'A profile, activities and contact for a group in 3–5 pages.',
          'aplikasi-mobile': 'A schedule, talks or tickets app on members’ phones.',
          'landing-page': 'One page for one activity or sign-up.',
        },
        faq: [
          { q: 'Does the mosque demo use a real mosque’s data?', a: 'No. Every demo uses a fictional business and fictional data. Your own mosque’s details replace them.' },
          { q: 'Does a small group need an app?', a: 'Not necessarily. A simple website or one landing page with the schedule is often enough. An app helps when members open the same information often.' },
          { q: 'Can it work for paid events?', a: 'A ticket app such as the Karcis Wetan demo shows QR e-tickets. The details are discussed in the consultation.' },
        ],
        wa: 'Hello PintuWeb, I look after a mosque/community/group and would like to ask about a website or app (Website for Communities & Mosques page).',
      },
    },
  },
]

export const bizOf = (key: BizKey) => BIZ.find((b) => b.key === key)!

/** Teks antarmuka halaman bisnis (bersama untuk semua jenis usaha). */
export type BizUi = {
  indexTitle: string
  indexDescription: string
  indexCrumb: string
  indexH1: Hl
  indexLead: string
  indexMissingTitle: string
  indexMissingBody: string
  indexCityTitle: string
  footerLink: string
  demoPageLink: string
  eyebrow: string
  fromLabel: string
  consult: string
  seePricing: string
  buildsKicker: string
  buildsTitle: string
  tipsKicker: string
  demosKicker: string
  demosTitle: string
  demosLead: string
  demoLabel: string
  galleryLabel: (title: string) => string
  pkgKicker: string
  pkgTitle: string
  pkgLead: string
  colPrice: string
  colTime: string
  pkgNote: string
  faqTitle: string
  otherKicker: string
  otherTitle: string
  ctaTitle: string
  ctaLead: string
  relatedServices: string
  seeAll: string
}

const UI: Record<BizLang, BizUi> = {
  id: {
    indexTitle: 'Website untuk Usahamu: Pilih Sesuai Jenis Usaha',
    indexDescription: 'Bingung website apa yang cocok? Pilih jenis usahamu: kafe, klinik, sekolah, kos, toko, salon, acara, atau masjid. Ada demo, paket, dan harga mulai.',
    indexCrumb: 'Website untuk usahamu',
    indexH1: ['Website apa yang ', 'cocok untuk usahamu', '?'],
    indexLead: 'Pilih jenis usahamu. Di tiap halaman ada masalah yang umum, apa yang bisa dibuat, demo yang bisa kamu coba, paket yang disarankan, dan jawaban pertanyaan yang sering muncul.',
    indexMissingTitle: 'Usahamu tidak ada di daftar?',
    indexMissingBody: 'Ceritakan usahamu lewat WhatsApp. Kami bantu pilih bentuk website yang paling pas, tanpa biaya konsultasi.',
    indexCityTitle: 'Lokasi usahamu di sekitar Tulungagung?',
    footerLink: 'Website untuk usahamu',
    demoPageLink: 'Bingung memilih? Lihat website untuk jenis usahamu',
    eyebrow: 'Website untuk usahamu',
    fromLabel: 'Paket mulai',
    consult: 'Konsultasi gratis',
    seePricing: 'Lihat semua harga',
    buildsKicker: 'Yang bisa dibuat',
    buildsTitle: 'Apa yang bisa kamu dapat',
    tipsKicker: 'Yang sering terlewat',
    demosKicker: 'Demo yang cocok',
    demosTitle: 'Coba contohnya langsung',
    demosLead: 'Semua usaha di demo ini fiktif. Buka salah satunya di HP, lalu bayangkan usahamu di sana.',
    demoLabel: 'Buka demo',
    galleryLabel: (t) => `Galeri lengkap: ${t}`,
    pkgKicker: 'Paket yang disarankan',
    pkgTitle: 'Mulai dari paket yang pas',
    pkgLead: 'Harga di bawah adalah harga mulai. Angka akhirnya mengikuti kebutuhanmu dan kamu terima tertulis sebelum DP.',
    colPrice: 'Harga mulai',
    colTime: 'Perkiraan waktu',
    pkgNote: 'Harga dan waktu mengikuti halaman Harga.',
    faqTitle: 'Pertanyaan yang sering muncul',
    otherKicker: 'Jenis usaha lain',
    otherTitle: 'Lihat jenis usaha lain',
    ctaTitle: 'Ceritakan usahamu',
    ctaLead: 'Balasan di jam kerja, tanpa biaya konsultasi. Kami bantu pilih paket yang pas.',
    relatedServices: 'Website untuk jenis usahamu',
    seeAll: 'Semua jenis usaha',
  },
  en: {
    indexTitle: 'Website for Your Business: Pick by Business Type',
    indexDescription: 'Not sure which website fits? Pick your business: cafe, clinic, school, rentals, shop, salon, events or mosque. Demos, packages and starting prices.',
    indexCrumb: 'Website for your business',
    indexH1: ['Which website ', 'suits your business', '?'],
    indexLead: 'Pick your kind of business. Each page covers a common problem, what can be built, demos you can try, a suggested package and answers to frequent questions.',
    indexMissingTitle: 'Your business is not listed?',
    indexMissingBody: 'Tell us about it on WhatsApp. We will help you pick the right kind of website, with no consultation fee.',
    indexCityTitle: 'Is your business near Tulungagung?',
    footerLink: 'Website for your business',
    demoPageLink: 'Not sure what to pick? See websites by business type',
    eyebrow: 'Website for your business',
    fromLabel: 'Package from',
    consult: 'Free consultation',
    seePricing: 'See all pricing',
    buildsKicker: 'What can be built',
    buildsTitle: 'What you can get',
    tipsKicker: 'Often overlooked',
    demosKicker: 'Matching demos',
    demosTitle: 'Try the examples yourself',
    demosLead: 'Every business in these demos is fictional. Open one on your phone and picture your own business there.',
    demoLabel: 'Open demo',
    galleryLabel: (t) => `Full gallery: ${t}`,
    pkgKicker: 'Suggested packages',
    pkgTitle: 'Start with the right package',
    pkgLead: 'The prices below are starting prices. The final figure follows your needs and you get it in writing before the deposit.',
    colPrice: 'Starting price',
    colTime: 'Estimated time',
    pkgNote: 'Prices and times follow the Pricing page.',
    faqTitle: 'Frequently asked questions',
    otherKicker: 'Other businesses',
    otherTitle: 'See other kinds of business',
    ctaTitle: 'Tell us about your business',
    ctaLead: 'We reply during working hours, with no consultation fee. We help you pick the right package.',
    relatedServices: 'Websites by type of business',
    seeAll: 'All business types',
  },
}

export const bizUi = (lang: Lang): BizUi => UI[lang === 'en' ? 'en' : 'id']
export const bizText = (b: Biz, lang: Lang): BizText => b.text[lang === 'en' ? 'en' : 'id']
