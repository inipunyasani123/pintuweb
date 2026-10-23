// Daftar situs demo yang live di <repo>.pintuweb.id (satu entri per demo; jumlahnya = DEMOS.length).
// Judul diambil dari <title> tiap situs. Gambar = mockup 3 perangkat (laptop 1280×800, tablet 820×1180, ponsel 390×844)
// dari tangkapan situs live, disusun oleh scripts/demo-mockups.mjs menjadi public/demos/<slug>.webp (720×378, rasio
// kartu 1200:630) + <slug>-360/-480/-1080.webp untuk srcset, supaya galeri ringan dan tidak bergantung pada domain demo.
// Demo baru: `node scripts/demo-mockups.mjs all <slug>` lalu naikkan THUMB_V.

export type DemoCategory = 'landing' | 'toko' | 'mobile' | 'menu' | 'undangan' | 'linkinbio' | 'portfolio' | 'reservasi' | 'properti' | 'todo' | 'kontes'

export const DEMO_CATEGORIES: { id: DemoCategory; label: string }[] = [
  { id: 'landing', label: 'Landing Page' },
  { id: 'toko', label: 'Toko Online' },
  // Aplikasi Android & iOS (React Native + Expo, 23 Okt 2026); galeri memakai versi web hasil `expo export -p web`.
  { id: 'mobile', label: 'Aplikasi Mobile' },
  // Menu digital QR untuk kafe & warung: dijual sebagai paket Landing Page (PACKAGE_FOR_CATEGORY di lib/portals.ts).
  { id: 'menu', label: 'Menu Digital' },
  { id: 'undangan', label: 'Undangan Digital' },
  { id: 'linkinbio', label: 'Link in Bio' },
  { id: 'portfolio', label: 'Portofolio' },
  { id: 'reservasi', label: 'Reservasi Online' },
  { id: 'properti', label: 'Website Properti' },
  { id: 'todo', label: 'Aplikasi Produktivitas' },
  // Kategori 'kontes' (URL portal tetap /kontes-desain): konsep-konsep untuk brief kontes desain. Labelnya mengikuti
  // nama paket "Konsep Desain Website" supaya pengunjung tidak bingung antara "kontes" dan "konsep".
  { id: 'kontes', label: 'Konsep Desain' },
]

export type Demo = {
  slug: string
  name: string
  tagline: string
  category: DemoCategory
  url: string
  /** Paket harga bila berbeda dari paket kategorinya (PACKAGE_FOR_CATEGORY di lib/portals.ts). */
  pkg?: string
  /** true = kartunya tanpa harga "mulai …" (mis. konsep redesain tidak resmi: bukan sesuatu yang dijual). */
  noPrice?: true
}

export const DEMOS: Demo[] = [
  { slug: "bribu", name: "Bribu", tagline: "Papan Brief Desain, Tiga Sketsa yang Dibayar", category: 'landing', url: "https://landing-bribu.pintuweb.id" },
  { slug: "cissycoffee", name: "Cissy Coffee", tagline: "Kedai Kopi dengan Papan Menu Kapur", category: 'landing', url: "https://landing-cissycoffee.pintuweb.id" },
  { slug: "citarasa", name: "CitaRasa Digital", tagline: "Rumah Makan Lama, Pesanan dari Ponsel", category: 'landing', url: "https://landing-citarasa.pintuweb.id" },
  { slug: "eduplay", name: "EduPlay", tagline: "Matematika SD, Sepuluh Menit Sehari", category: 'landing', url: "https://landing-eduplay.pintuweb.id" },
  { slug: "elevinar", name: "Elevinar", tagline: "Presentasi yang Didengar", category: 'landing', url: "https://landing-elevinar.pintuweb.id" },
  { slug: "lumicast", name: "Lumicast", tagline: "Siaran Pelatihan untuk Pengurus Organisasi", category: 'landing', url: "https://landing-lumicast.pintuweb.id" },
  { slug: "luxeelectro", name: "LuxeElectro", tagline: "Audio dengan Spesifikasi yang Ditulis Lengkap", category: 'landing', url: "https://landing-luxeelectro.pintuweb.id" },
  { slug: "modewear", name: "Modewear", tagline: "Pakaian Kerja yang Dijahit Setelah Dipesan", category: 'landing', url: "https://landing-modewear.pintuweb.id" },
  { slug: "nexttalks", name: "NextTalks", tagline: "Empat Pembicara, Satu Meja", category: 'landing', url: "https://landing-nexttalks.pintuweb.id" },
  { slug: "nimbus", name: "Nimbus", tagline: "Server di Indonesia, Status yang Terbuka", category: 'landing', url: "https://landing-nimbus.pintuweb.id" },
  { slug: "rasanusantara", name: "Rasa Nusantara", tagline: "Kartu Resep Terstandar untuk Dapur Restoran", category: 'landing', url: "https://landing-rasanusantara.pintuweb.id" },
  { slug: "sanzyhub", name: "SanzyHub", tagline: "Template Landing Page Next.js yang Lebih dari Satu Halaman", category: 'landing', url: "https://landing-sanzyhub.pintuweb.id" },
  { slug: "skywings", name: "SkyWings", tagline: "Maskapai Antarkota yang Tepat Waktu", category: 'landing', url: "https://landing-skywings.pintuweb.id" },
  { slug: "sribu", name: "Sribu", tagline: "Konsep Redesain Tidak Resmi", category: 'landing', url: "https://landing-sribu.pintuweb.id", noPrice: true },
  { slug: "tastycorner", name: "Tasty Corner", tagline: "Struk Mingguan untuk Usaha Makanan", category: 'landing', url: "https://landing-tastycorner.pintuweb.id" },
  { slug: "woodora", name: "Woodora", tagline: "Furnitur Kayu Solid Sesuai Ukuran", category: 'landing', url: "https://landing-woodora.pintuweb.id" },
  { slug: "zychrome", name: "Zychrome", tagline: "Webinar yang Bisa Membalas Anda", category: 'landing', url: "https://landing-zychrome.pintuweb.id" },
  { slug: "tanur", name: "Tanur", tagline: "Keramik Buatan Tangan untuk Meja Sehari-hari", category: 'toko', url: "https://toko-tanur.pintuweb.id", pkg: 'toko-online-full' },
  { slug: "takar", name: "Takar", tagline: "Perawatan Kulit Berkadar Jelas, Takaran Pakainya Jujur", category: 'toko', url: "https://toko-takar.pintuweb.id", pkg: 'toko-online-full' },
  { slug: "lungsin", name: "Lungsin", tagline: "Pakaian Harian dari Kain Lurik Tenun, Dijahit di Klaten", category: 'toko', url: "https://toko-lungsin.pintuweb.id", pkg: 'toko-online-full' },
  { slug: "daunjendela", name: "Daun Jendela", tagline: "Tanaman Hias yang Dipilih dari Cahaya Jendelamu", category: 'toko', url: "https://toko-daunjendela.pintuweb.id", pkg: 'toko-online-full' },
  { slug: "kopi", name: "Sepertiga Kopi", tagline: "Kedai Kopi dengan Menu Bergaya Kartu Cupping", category: 'menu', url: "https://menu-kopi.pintuweb.id", pkg: 'landing-page' },
  { slug: "bakso", name: "Bakso Dalu", tagline: "Warung Tenda Malam dengan Level Pedas 0–5", category: 'menu', url: "https://menu-bakso.pintuweb.id", pkg: 'landing-page' },
  { slug: "jepang", name: "Akagane Shokudō", tagline: "Warung Jepang Rumahan dengan Ikon Alergen", category: 'menu', url: "https://menu-jepang.pintuweb.id", pkg: 'landing-page' },
  { slug: "dessert", name: "Lintang Manis", tagline: "Dessert Bar dengan Bowl Rakitan Sendiri", category: 'menu', url: "https://menu-dessert.pintuweb.id", pkg: 'landing-page' },
  // Aplikasi mobile: paketnya Aplikasi Mobile lewat PACKAGE_FOR_CATEGORY (lib/portals.ts)
  { slug: "kasir", name: "Ketip", tagline: "Kasir Warung & UMKM di HP", category: 'mobile', url: "https://app-kasir.pintuweb.id" },
  { slug: "booking", name: "Kursi Putar", tagline: "Booking Pangkas Rambut & Salon", category: 'mobile', url: "https://app-booking.pintuweb.id" },
  { slug: "sekolah", name: "Kapur", tagline: "Aplikasi Orang Tua Siswa SD", category: 'mobile', url: "https://app-sekolah.pintuweb.id" },
  { slug: "member", name: "Kopi Blirik", tagline: "Kartu Member & Poin Kafe", category: 'mobile', url: "https://app-member.pintuweb.id" },
  { slug: "antar", name: "Pincuk", tagline: "Pesan-Antar dari Warung Lokal", category: 'mobile', url: "https://app-antar.pintuweb.id" },
  { slug: "laundry", name: "Busa Ungu", tagline: "Status Cucian & Jemput-Antar Laundry", category: 'mobile', url: "https://app-laundry.pintuweb.id" },
  { slug: "absensi", name: "Gilir", tagline: "Absensi, Shift & Cuti Karyawan", category: 'mobile', url: "https://app-absensi.pintuweb.id" },
  { slug: "tiket", name: "Karcis Wetan", tagline: "Tiket Acara dengan E-Tiket QR", category: 'mobile', url: "https://app-tiket.pintuweb.id" },
  { slug: "masjid", name: "Nurul Ufuk", tagline: "Jadwal Salat, Kajian & Kas Masjid", category: 'mobile', url: "https://app-masjid.pintuweb.id" },
  { slug: "kos", name: "Grendel Kos", tagline: "Tagihan Sewa & Lapor Kerusakan Kos", category: 'mobile', url: "https://app-kos.pintuweb.id" },
  { slug: "corporate", name: "Situs Acara Korporat Digital", tagline: "Temu Rekayasa Nusa 2027", category: 'undangan', url: "https://undangan-corporate.pintuweb.id", pkg: 'situs-acara' },
  { slug: "aqiqah", name: "Undangan Aqiqah Digital", tagline: "Aisyah Khairunnisa", category: 'undangan', url: "https://undangan-aqiqah.pintuweb.id" },
  { slug: "khitanan", name: "Undangan Khitanan Digital", tagline: "Kapten Fauzan", category: 'undangan', url: "https://undangan-khitanan.pintuweb.id" },
  { slug: "wedding", name: "Undangan Pernikahan Digital", tagline: "Raka & Sinta", category: 'undangan', url: "https://undangan-wedding.pintuweb.id" },
  { slug: "reuni", name: "Undangan Reuni Digital", tagline: "Angkatan 2010 SMA Kencana Mulia", category: 'undangan', url: "https://undangan-reuni.pintuweb.id" },
  { slug: "engagement", name: "Undangan Tunangan Digital", tagline: "Raka & Sinta", category: 'undangan', url: "https://undangan-engagement.pintuweb.id" },
  { slug: "birthday", name: "Undangan Ulang Tahun Digital", tagline: "Kayla", category: 'undangan', url: "https://undangan-birthday.pintuweb.id" },
  { slug: "wisuda", name: "Undangan Wisuda Digital", tagline: "Dimas Prasetyo", category: 'undangan', url: "https://undangan-wisuda.pintuweb.id" },
  { slug: "arsip", name: "Dara Puspita", tagline: "Penulis & Penyair, Yogyakarta", category: 'linkinbio', url: "https://linkinbio-arsip.pintuweb.id" },
  { slug: "atlas", name: "Atlas Studio", tagline: "Konsultan Brand & Desain, Bandung", category: 'linkinbio', url: "https://linkinbio-atlas.pintuweb.id" },
  { slug: "cipher", name: "c1ph3r", tagline: "Security Researcher & Pemain CTF", category: 'linkinbio', url: "https://linkinbio-cipher.pintuweb.id" },
  { slug: "disko", name: "Disko Panda", tagline: "Band Funk-Disko dari Bandung", category: 'linkinbio', url: "https://linkinbio-disko.pintuweb.id" },
  { slug: "jajan", name: "Jajanan Bu Rina", tagline: "Jajanan Pasar & Rice Bowl, Bandung", category: 'linkinbio', url: "https://linkinbio-jajan.pintuweb.id" },
  { slug: "kaset", name: "Kaset Kita FM", tagline: "Mixtape & Radio Komunitas, Bandung", category: 'linkinbio', url: "https://linkinbio-kaset.pintuweb.id" },
  { slug: "vendra", name: "Kopi Vendra", tagline: "Kedai Kopi Rumahan di Bandung", category: 'linkinbio', url: "https://linkinbio-vendra.pintuweb.id" },
  { slug: "vinyl", name: "Laras", tagline: "Penyanyi & Penulis Lagu", category: 'linkinbio', url: "https://linkinbio-vinyl.pintuweb.id" },
  { slug: "mellow", name: "Mella", tagline: "Ilustrator & Sticker Artist", category: 'linkinbio', url: "https://linkinbio-mellow.pintuweb.id" },
  { slug: "nova", name: "Nova Ardhana", tagline: "Creative Technologist", category: 'linkinbio', url: "https://linkinbio-nova.pintuweb.id" },
  { slug: "pulse", name: "Raka Wijaya", tagline: "Motion Designer", category: 'linkinbio', url: "https://linkinbio-pulse.pintuweb.id" },
  { slug: "zen", name: "Sena", tagline: "Guru Mindfulness & Teman Minum Teh", category: 'linkinbio', url: "https://linkinbio-zen.pintuweb.id" },
  { slug: "aria", name: "Aria", tagline: "Portofolio Kaca untuk Creative Developer", category: 'portfolio', url: "https://portfolio-aria.pintuweb.id" },
  { slug: "carlos", name: "Carlos Mendoza", tagline: "Portofolio Gelap untuk Desainer & Developer", category: 'portfolio', url: "https://portfolio-carlos.pintuweb.id" },
  { slug: "celeste", name: "Celeste", tagline: "Portofolio Editorial untuk Brand Designer", category: 'portfolio', url: "https://portfolio-celeste.pintuweb.id" },
  { slug: "milo", name: "Milo", tagline: "Portofolio Bento untuk Ilustrator", category: 'portfolio', url: "https://portfolio-milo.pintuweb.id" },
  { slug: "noelle", name: "Noelle", tagline: "Portofolio Minimal untuk Desainer UI/UX", category: 'portfolio', url: "https://portfolio-noelle.pintuweb.id" },
  { slug: "rex", name: "Rex", tagline: "Portofolio Neo-brutalis untuk Desainer Grafis", category: 'portfolio', url: "https://portfolio-rex.pintuweb.id" },
  { slug: "sorelle", name: "Sorelle", tagline: "Portofolio Ceria untuk Desainer UI/UX", category: 'portfolio', url: "https://portfolio-sorelle.pintuweb.id" },
  { slug: "futsal", name: "Gelanggang Petang", tagline: "Booking Lapangan Futsal", category: 'reservasi', url: "https://reservasi-futsal.pintuweb.id" },
  { slug: "klinik", name: "Klinik Rumpun Waras", tagline: "Janji Temu Dokter", category: 'reservasi', url: "https://reservasi-klinik.pintuweb.id" },
  { slug: "restoran", name: "Pawon Lirih", tagline: "Pesan Meja lewat Denah", category: 'reservasi', url: "https://reservasi-restoran.pintuweb.id" },
  { slug: "hotel", name: "Tanjung Lengkung", tagline: "Pesan Kamar di Ujung Teluk", category: 'reservasi', url: "https://reservasi-hotel.pintuweb.id" },
  { slug: "bioskop", name: "Bioskop Kelir", tagline: "Pesan Tiket & Pilih Kursi", category: 'reservasi', url: "https://reservasi-bioskop.pintuweb.id" },
  { slug: "beranda", name: "Beranda", tagline: "Pilih Kawasannya Dulu", category: 'properti', url: "https://properti-beranda.pintuweb.id" },
  { slug: "homigo", name: "Homigo", tagline: "Rumah Pertama & Tempat Sewa", category: 'properti', url: "https://properti-homigo.pintuweb.id" },
  { slug: "lumora", name: "Lumora", tagline: "Hunian Mewah, Kunjungan Privat", category: 'properti', url: "https://properti-lumora.pintuweb.id" },
  { slug: "propertia", name: "Propertia", tagline: "Rumah yang Dikurasi", category: 'properti', url: "https://properti-propertia.pintuweb.id" },
  { slug: "classic-todo", name: "Hari Ini", tagline: "Satu Daftar untuk Satu Hari", category: 'todo', url: "https://todo-classic.pintuweb.id" },
  { slug: "kanban-board", name: "Lajur", tagline: "Papan Kanban dengan Batas WIP", category: 'todo', url: "https://todo-kanban.pintuweb.id" },
  { slug: "task-manager", name: "Tuntas", tagline: "Pengelola Tugas dengan Kalender", category: 'todo', url: "https://todo-manager.pintuweb.id" },
  { slug: "absorber-dickson", name: "EthyleneAbsorber", tagline: "Konsep Korporat", category: 'kontes', url: "https://absorber-dickson.pintuweb.id" },
  { slug: "absorber-divine", name: "EthyleneAbsorber", tagline: "Konsep Divine", category: 'kontes', url: "https://absorber-divine.pintuweb.id" },
  { slug: "absorber-premium", name: "EthyleneAbsorber", tagline: "Konsep Premium", category: 'kontes', url: "https://absorber-premium.pintuweb.id" },
  { slug: "absorber-segar", name: "EthyleneAbsorber", tagline: "Konsep Segar", category: 'kontes', url: "https://absorber-segar.pintuweb.id" },
  { slug: "crave-amber", name: "Positive Crave", tagline: "Konsep Amber", category: 'kontes', url: "https://crave-amber.pintuweb.id" },
  { slug: "crave-close", name: "Positive Crave", tagline: "Konsep Close", category: 'kontes', url: "https://crave-close.pintuweb.id" },
  { slug: "crave-grace", name: "Positive Crave", tagline: "Konsep Grace", category: 'kontes', url: "https://crave-grace.pintuweb.id" },
  { slug: "crave-lumen", name: "Positive Crave", tagline: "Konsep Lumen", category: 'kontes', url: "https://crave-lumen.pintuweb.id" },
  { slug: "crave-noir", name: "Positive Crave", tagline: "Konsep Noir", category: 'kontes', url: "https://crave-noir.pintuweb.id" },
]

/** Versi thumbnail public/demos: naikkan setiap kali thumbnail ditangkap ulang. Nama berkasnya tetap (<slug>.webp)
 *  sedangkan CDN & peramban menyimpannya 7 hari, jadi versi ini yang membuat tampilan baru langsung terlihat. */
export const THUMB_V = '20261023b'
export const demoThumb = (slug: string) => `/demos/${slug}.webp?v=${THUMB_V}`
export const demoImage = (d: Demo) => demoThumb(d.slug)

/** srcset thumbnail demo: 360w, 480w, berkas utamanya (720w), dan 1080w untuk kartu lebar di layar retina. */
export const demoSrcSet = (slug: string) =>
  `/demos/${slug}-360.webp?v=${THUMB_V} 360w, /demos/${slug}-480.webp?v=${THUMB_V} 480w, /demos/${slug}.webp?v=${THUMB_V} 720w, /demos/${slug}-1080.webp?v=${THUMB_V} 1080w`
