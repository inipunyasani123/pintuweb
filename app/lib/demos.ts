// Dibuat dari 65 situs demo yang live di Vercel.
// Judul diambil dari <title> tiap situs; gambar = og.jpg milik situs itu sendiri, diperkecil
// jadi public/demos/<slug>.webp (720x378) supaya galeri ringan dan tidak bergantung pada 65 domain lain.

export type DemoCategory = 'landing' | 'undangan' | 'linkinbio' | 'portfolio' | 'reservasi' | 'properti' | 'todo' | 'kontes'

export const DEMO_CATEGORIES: { id: DemoCategory; label: string }[] = [
  { id: 'landing', label: 'Landing Page' },
  { id: 'undangan', label: 'Undangan Digital' },
  { id: 'linkinbio', label: 'Link in Bio' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'reservasi', label: 'Reservasi Online' },
  { id: 'properti', label: 'Marketplace Properti' },
  { id: 'todo', label: 'Aplikasi Produktivitas' },
  { id: 'kontes', label: 'Kontes Desain' },
]

export type Demo = {
  slug: string
  name: string
  tagline: string
  category: DemoCategory
  url: string
}

export const DEMOS: Demo[] = [
  { slug: "bribu", name: "Bribu", tagline: "Papan Brief Desain, Tiga Sketsa yang Dibayar", category: 'landing', url: "https://landing-bribu.vercel.app" },
  { slug: "cissycoffee", name: "Cissy Coffee", tagline: "Kedai Kopi dengan Papan Menu Kapur", category: 'landing', url: "https://landing-cissycoffee.vercel.app" },
  { slug: "citarasa", name: "CitaRasa Digital", tagline: "Rumah Makan Lama, Pesanan dari Ponsel", category: 'landing', url: "https://landing-citarasa.vercel.app" },
  { slug: "eduplay", name: "EduPlay", tagline: "Matematika SD, Sepuluh Menit Sehari", category: 'landing', url: "https://landing-eduplay.vercel.app" },
  { slug: "elevinar", name: "Elevinar", tagline: "Presentasi yang Didengar", category: 'landing', url: "https://landing-elevinar.vercel.app" },
  { slug: "lumicast", name: "Lumicast", tagline: "Siaran Pelatihan untuk Pengurus Organisasi", category: 'landing', url: "https://landing-lumicast.vercel.app" },
  { slug: "luxeelectro", name: "LuxeElectro", tagline: "Audio dengan Spesifikasi yang Ditulis Lengkap", category: 'landing', url: "https://landing-luxeelectro.vercel.app" },
  { slug: "modewear", name: "Modewear", tagline: "Pakaian Kerja yang Dijahit Setelah Dipesan", category: 'landing', url: "https://landing-modewear.vercel.app" },
  { slug: "nexttalks", name: "NextTalks", tagline: "Empat Pembicara, Satu Meja", category: 'landing', url: "https://landing-nexttalks.vercel.app" },
  { slug: "nimbus", name: "Nimbus", tagline: "Server di Indonesia, Status yang Terbuka", category: 'landing', url: "https://landing-nimbus.vercel.app" },
  { slug: "rasanusantara", name: "Rasa Nusantara", tagline: "Kartu Resep Terstandar untuk Dapur Restoran", category: 'landing', url: "https://landing-rasanusantara.vercel.app" },
  { slug: "sanzyhub", name: "SanzyHub", tagline: "Template Landing Page Next.js yang Lebih dari Satu Halaman", category: 'landing', url: "https://landing-sanzyhub.vercel.app" },
  { slug: "skywings", name: "SkyWings", tagline: "Maskapai Antarkota yang Tepat Waktu", category: 'landing', url: "https://landing-skywings.vercel.app" },
  { slug: "sribu", name: "Sribu", tagline: "Konsep Redesain Tidak Resmi", category: 'landing', url: "https://landing-sribu.vercel.app" },
  { slug: "tastycorner", name: "Tasty Corner", tagline: "Struk Mingguan untuk Usaha Makanan", category: 'landing', url: "https://landing-tastycorner.vercel.app" },
  { slug: "woodora", name: "Woodora", tagline: "Furnitur Kayu Solid Sesuai Ukuran", category: 'landing', url: "https://landing-woodora.vercel.app" },
  { slug: "zychrome", name: "Zychrome", tagline: "Webinar yang Bisa Membalas Anda", category: 'landing', url: "https://landing-zychrome.vercel.app" },
  { slug: "corporate", name: "Situs Acara Korporat Digital", tagline: "Temu Rekayasa Nusa 2027", category: 'undangan', url: "https://undangan-corporate-delta.vercel.app" },
  { slug: "aqiqah", name: "Undangan Aqiqah Digital", tagline: "Aisyah Khairunnisa", category: 'undangan', url: "https://undangan-aqiqah-puce.vercel.app" },
  { slug: "khitanan", name: "Undangan Khitanan Digital", tagline: "Kapten Fauzan", category: 'undangan', url: "https://undangan-khitanan-theta.vercel.app" },
  { slug: "wedding", name: "Undangan Pernikahan Digital", tagline: "Raka & Sinta", category: 'undangan', url: "https://undangan-wedding-eight.vercel.app" },
  { slug: "reuni", name: "Undangan Reuni Digital", tagline: "Angkatan 2010 SMA Kencana Mulia", category: 'undangan', url: "https://undangan-reuni-livid.vercel.app" },
  { slug: "engagement", name: "Undangan Tunangan Digital", tagline: "Raka & Sinta", category: 'undangan', url: "https://undangan-engagement.vercel.app" },
  { slug: "birthday", name: "Undangan Ulang Tahun Digital", tagline: "Kayla", category: 'undangan', url: "https://undangan-birthday.vercel.app" },
  { slug: "wisuda", name: "Undangan Wisuda Digital", tagline: "Dimas Prasetyo", category: 'undangan', url: "https://undangan-wisuda-ten.vercel.app" },
  { slug: "arsip", name: "Dara Puspita", tagline: "Penulis & Penyair, Yogyakarta", category: 'linkinbio', url: "https://linkinbio-arsip.vercel.app" },
  { slug: "atlas", name: "Atlas Studio", tagline: "Konsultan Brand & Desain, Bandung", category: 'linkinbio', url: "https://linkinbio-atlas.vercel.app" },
  { slug: "cipher", name: "c1ph3r", tagline: "Security Researcher & Pemain CTF", category: 'linkinbio', url: "https://linkinbio-cipher.vercel.app" },
  { slug: "disko", name: "Disko Panda", tagline: "Band Funk-Disko dari Bandung", category: 'linkinbio', url: "https://linkinbio-disko.vercel.app" },
  { slug: "jajan", name: "Jajanan Bu Rina", tagline: "Jajanan Pasar & Rice Bowl, Bandung", category: 'linkinbio', url: "https://linkinbio-jajan.vercel.app" },
  { slug: "kaset", name: "Kaset Kita FM", tagline: "Mixtape & Radio Komunitas, Bandung", category: 'linkinbio', url: "https://linkinbio-kaset.vercel.app" },
  { slug: "vendra", name: "Kopi Vendra", tagline: "Kedai Kopi Rumahan di Bandung", category: 'linkinbio', url: "https://linkinbio-vendra.vercel.app" },
  { slug: "vinyl", name: "Laras", tagline: "Penyanyi & Penulis Lagu", category: 'linkinbio', url: "https://linkinbio-vinyl.vercel.app" },
  { slug: "mellow", name: "Mella", tagline: "Ilustrator & Sticker Artist", category: 'linkinbio', url: "https://linkinbio-mellow.vercel.app" },
  { slug: "nova", name: "Nova Ardhana", tagline: "Creative Technologist", category: 'linkinbio', url: "https://linkinbio-nova.vercel.app" },
  { slug: "pulse", name: "Raka Wijaya", tagline: "Motion Designer", category: 'linkinbio', url: "https://linkinbio-pulse.vercel.app" },
  { slug: "zen", name: "Sena", tagline: "Guru Mindfulness & Teman Minum Teh", category: 'linkinbio', url: "https://linkinbio-zen.vercel.app" },
  { slug: "aria", name: "Aria", tagline: "Portofolio Kaca untuk Creative Developer", category: 'portfolio', url: "https://portfolio-aria-pearl.vercel.app" },
  { slug: "carlos", name: "Carlos Mendoza", tagline: "Portofolio Gelap untuk Desainer & Developer", category: 'portfolio', url: "https://portfolio-carlos-eosin.vercel.app" },
  { slug: "celeste", name: "Celeste", tagline: "Portofolio Editorial untuk Brand Designer", category: 'portfolio', url: "https://portfolio-celeste-one.vercel.app" },
  { slug: "milo", name: "Milo", tagline: "Portofolio Bento untuk Ilustrator", category: 'portfolio', url: "https://portfolio-milo.vercel.app" },
  { slug: "noelle", name: "Noelle", tagline: "Portofolio Minimal untuk Desainer UI/UX", category: 'portfolio', url: "https://portfolio-noelle-one.vercel.app" },
  { slug: "rex", name: "Rex", tagline: "Portofolio Neo-brutalis untuk Desainer Grafis", category: 'portfolio', url: "https://portfolio-rex-zeta.vercel.app" },
  { slug: "sorelle", name: "Sorelle", tagline: "Portofolio Ceria untuk Desainer UI/UX", category: 'portfolio', url: "https://portfolio-sorelle.vercel.app" },
  { slug: "futsal", name: "Gelanggang Petang", tagline: "Booking Lapangan Futsal", category: 'reservasi', url: "https://reservasi-futsal.vercel.app" },
  { slug: "klinik", name: "Klinik Rumpun Waras", tagline: "Janji Temu Dokter", category: 'reservasi', url: "https://reservasi-klinik-rose.vercel.app" },
  { slug: "restoran", name: "Pawon Lirih", tagline: "Pesan Meja lewat Denah", category: 'reservasi', url: "https://reservasi-restoran-gilt.vercel.app" },
  { slug: "hotel", name: "Tanjung Lengkung", tagline: "Pesan Kamar di Ujung Teluk", category: 'reservasi', url: "https://reservasi-hotel-kappa.vercel.app" },
  { slug: "bioskop", name: "Bioskop Kelir", tagline: "Pesan Tiket & Pilih Kursi", category: 'reservasi', url: "https://reservasi-bioskop.vercel.app" },
  { slug: "beranda", name: "Beranda", tagline: "Pilih Kawasannya Dulu", category: 'properti', url: "https://properti-beranda.vercel.app" },
  { slug: "homigo", name: "Homigo", tagline: "Rumah Pertama & Tempat Sewa", category: 'properti', url: "https://properti-homigo.vercel.app" },
  { slug: "lumora", name: "Lumora", tagline: "Hunian Mewah, Kunjungan Privat", category: 'properti', url: "https://properti-lumora.vercel.app" },
  { slug: "propertia", name: "Propertia", tagline: "Rumah yang Dikurasi", category: 'properti', url: "https://properti-propertia.vercel.app" },
  { slug: "classic-todo", name: "Hari Ini", tagline: "Satu Daftar untuk Satu Hari", category: 'todo', url: "https://todo-classic.vercel.app" },
  { slug: "kanban-board", name: "Lajur", tagline: "Papan Kanban dengan Batas WIP", category: 'todo', url: "https://todo-kanban-one.vercel.app" },
  { slug: "task-manager", name: "Tuntas", tagline: "Pengelola Tugas dengan Kalender", category: 'todo', url: "https://todo-manager-ivory-seven.vercel.app" },
  { slug: "absorber-dickson", name: "EthyleneAbsorber", tagline: "Konsep Korporat", category: 'kontes', url: "https://absorber-dickson.vercel.app" },
  { slug: "absorber-divine", name: "EthyleneAbsorber", tagline: "Konsep Divine", category: 'kontes', url: "https://absorber-divine.vercel.app" },
  { slug: "absorber-premium", name: "EthyleneAbsorber", tagline: "Konsep Premium", category: 'kontes', url: "https://absorber-premium.vercel.app" },
  { slug: "absorber-segar", name: "EthyleneAbsorber", tagline: "Konsep Segar", category: 'kontes', url: "https://absorber-segar.vercel.app" },
  { slug: "crave-amber", name: "Positive Crave", tagline: "Konsep Amber", category: 'kontes', url: "https://crave-amber-mu.vercel.app" },
  { slug: "crave-close", name: "Positive Crave", tagline: "Konsep Close", category: 'kontes', url: "https://crave-close.vercel.app" },
  { slug: "crave-grace", name: "Positive Crave", tagline: "Konsep Grace", category: 'kontes', url: "https://crave-grace.vercel.app" },
  { slug: "crave-lumen", name: "Positive Crave", tagline: "Konsep Lumen", category: 'kontes', url: "https://crave-lumen.vercel.app" },
  { slug: "crave-noir", name: "Positive Crave", tagline: "Konsep Noir", category: 'kontes', url: "https://crave-noir.vercel.app" },
]

export const demoImage = (d: Demo) => `/demos/${d.slug}.webp`
