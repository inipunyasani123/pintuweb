// Jalan pintas "kebutuhan → paket": tiap kebutuhan pelanggan (dalam kata sehari-hari) menunjuk SATU paket di
// lib/packages.ts. Kalimatnya diturunkan dari subjudul, sorotan (highlights), dan fitur paket itu sendiri di tiap
// bahasa, tanpa klaim baru. Harga & lama pengerjaan TIDAK ditulis di sini: keduanya diambil dari packagesFor().
// Dipakai halaman Harga (semua kebutuhan, di atas peta harga) dan beranda (bagian "Untuk siapa", yang ber-`home`).
// Bahasa Indonesia memakai sapaan "kamu".
import type { Lang } from '../i18n/config'
import { packagesFor, type LocalPaket } from '../i18n/facts'

export const NEED_KEYS = ['promo', 'profil', 'jualan', 'toko', 'tautan', 'undangan', 'acara', 'portofolio', 'booking', 'properti', 'aplikasi', 'khusus'] as const
export type NeedKey = (typeof NEED_KEYS)[number]

/** Kebutuhan → slug paket. `home` = ikut tampil di beranda (kebutuhan yang paling sering ditanyakan). */
const NEED_PACKAGE: Record<NeedKey, { pkg: string; home?: boolean }> = {
  promo: { pkg: 'landing-page', home: true },
  profil: { pkg: 'standar-umkm', home: true },
  jualan: { pkg: 'toko-online-simple', home: true },
  toko: { pkg: 'toko-online-full', home: true },
  tautan: { pkg: 'link-in-bio', home: true },
  undangan: { pkg: 'undangan-digital', home: true },
  acara: { pkg: 'situs-acara' },
  portofolio: { pkg: 'portofolio', home: true },
  booking: { pkg: 'sistem-reservasi', home: true },
  properti: { pkg: 'website-properti' },
  aplikasi: { pkg: 'aplikasi-web' },
  khusus: { pkg: 'website-custom' },
}

const TEXT: Record<Lang, Record<NeedKey, string>> = {
  id: {
    promo: 'Promosi produk, event, atau kampanye iklan',
    profil: 'Website profil untuk usaha atau jasamu',
    jualan: 'Jualan online, pesanan masuk lewat WhatsApp',
    toko: 'Toko online dengan keranjang, pembayaran, dan ongkir',
    tautan: 'Satu tautan di bio untuk semua kanalmu',
    undangan: 'Undangan pernikahan atau acara keluarga',
    acara: 'Situs acara kantor, seminar, atau konferensi',
    portofolio: 'Portofolio karya untuk freelancer dan kreator',
    booking: 'Booking meja, kamar, jadwal dokter, atau lapangan',
    properti: 'Katalog listing properti untuk agen atau developer',
    aplikasi: 'Aplikasi kerja tim: tugas, kalender, atau data internal',
    khusus: 'Desain dan fitur khusus untuk startup atau instansi',
  },
  en: {
    promo: 'Promoting a product, event or ad campaign',
    profil: 'A profile website for your business or services',
    jualan: 'Selling online, with orders over WhatsApp',
    toko: 'An online store with a cart, payments and shipping rates',
    tautan: 'One bio link for all your channels',
    undangan: 'A wedding or family celebration invitation',
    acara: 'A site for a corporate event, seminar or conference',
    portofolio: 'A portfolio for freelancers and creators',
    booking: 'Booking tables, rooms, doctor appointments or courts',
    properti: 'A property listings catalogue for an agent or developer',
    aplikasi: 'A work app for your team: tasks, calendar or internal data',
    khusus: 'Bespoke design and features for a start-up or institution',
  },
  ms: {
    promo: 'Promosi produk, acara atau kempen iklan',
    profil: 'Laman web profil untuk perniagaan atau perkhidmatan anda',
    jualan: 'Berniaga dalam talian, pesanan melalui WhatsApp',
    toko: 'Kedai dalam talian dengan troli, pembayaran dan kos penghantaran',
    tautan: 'Satu pautan bio untuk semua saluran anda',
    undangan: 'Jemputan perkahwinan atau majlis keluarga',
    acara: 'Laman acara korporat, seminar atau persidangan',
    portofolio: 'Portfolio karya untuk pekerja bebas dan pencipta kandungan',
    booking: 'Tempahan meja, bilik, temu janji doktor atau gelanggang',
    properti: 'Katalog penyenaraian hartanah untuk ejen atau pemaju',
    aplikasi: 'Aplikasi kerja pasukan: tugasan, kalendar atau data dalaman',
    khusus: 'Reka bentuk dan ciri khas untuk syarikat pemula atau institusi',
  },
  es: {
    promo: 'Promocionar un producto, un evento o una campaña',
    profil: 'Un sitio de perfil para tu negocio o tus servicios',
    jualan: 'Vender en línea, con pedidos por WhatsApp',
    toko: 'Una tienda en línea con carrito, pagos y envíos',
    tautan: 'Un solo enlace en tu bio para todos tus canales',
    undangan: 'Invitación de boda o de celebración familiar',
    acara: 'Sitio para un evento corporativo, seminario o conferencia',
    portofolio: 'Portafolio para freelancers y creadores',
    booking: 'Reservas de mesas, habitaciones, citas médicas o pistas',
    properti: 'Catálogo de inmuebles para un agente o promotor',
    aplikasi: 'Una app de trabajo para tu equipo: tareas, calendario o datos internos',
    khusus: 'Diseño y funciones a medida para una startup o institución',
  },
  fr: {
    promo: 'Promouvoir un produit, un événement ou une campagne',
    profil: 'Un site vitrine pour votre entreprise ou vos services',
    jualan: 'Vendre en ligne, avec des commandes via WhatsApp',
    toko: 'Une boutique en ligne avec panier, paiement et frais de livraison',
    tautan: 'Un seul lien de bio pour tous vos canaux',
    undangan: 'Une invitation de mariage ou de fête de famille',
    acara: 'Un site pour un événement d’entreprise, un séminaire ou une conférence',
    portofolio: 'Un portfolio pour freelances et créateurs',
    booking: 'Réserver des tables, des chambres, des rendez-vous médicaux ou des terrains',
    properti: 'Un catalogue d’annonces immobilières pour un agent ou un promoteur',
    aplikasi: 'Une appli de travail pour votre équipe : tâches, calendrier ou données internes',
    khusus: 'Un design et des fonctionnalités sur mesure pour une start-up ou une institution',
  },
  pt: {
    promo: 'Divulgar um produto, evento ou campanha de anúncios',
    profil: 'Um site institucional para o seu negócio ou serviço',
    jualan: 'Vender online, com pedidos pelo WhatsApp',
    toko: 'Uma loja online com carrinho, pagamento e frete',
    tautan: 'Um só link na bio para todos os seus canais',
    undangan: 'Convite de casamento ou de celebração em família',
    acara: 'Site para evento corporativo, seminário ou conferência',
    portofolio: 'Portfólio para freelancers e criadores',
    booking: 'Reservas de mesas, quartos, consultas médicas ou quadras',
    properti: 'Catálogo de imóveis para um corretor ou incorporadora',
    aplikasi: 'Um app de trabalho para a sua equipe: tarefas, calendário ou dados internos',
    khusus: 'Design e recursos sob medida para uma startup ou instituição',
  },
  ru: {
    promo: 'Продвижение товара, мероприятия или рекламной кампании',
    profil: 'Сайт о вашей компании или услугах',
    jualan: 'Продажи онлайн с заказами через WhatsApp',
    toko: 'Интернет-магазин с корзиной, оплатой и расчётом доставки',
    tautan: 'Одна ссылка в профиле для всех ваших каналов',
    undangan: 'Приглашение на свадьбу или семейное торжество',
    acara: 'Сайт корпоративного события, семинара или конференции',
    portofolio: 'Портфолио для фрилансеров и авторов',
    booking: 'Бронирование столиков, номеров, приёмов у врача или площадок',
    properti: 'Каталог объектов недвижимости для агента или застройщика',
    aplikasi: 'Рабочее приложение для команды: задачи, календарь или внутренние данные',
    khusus: 'Индивидуальный дизайн и функции для стартапа или организации',
  },
  zh: {
    promo: '推广产品、活动或广告投放',
    profil: '介绍您的生意或服务的企业官网',
    jualan: '线上销售，通过 WhatsApp 下单',
    toko: '带购物车、在线支付和运费计算的网店',
    tautan: '一个主页链接，汇集您的所有渠道',
    undangan: '婚礼或家庭庆典请柬',
    acara: '企业活动、研讨会或会议网站',
    portofolio: '面向自由职业者和创作者的作品集',
    booking: '预订餐桌、客房、门诊或场地',
    properti: '经纪人或开发商的房源目录',
    aplikasi: '团队工作应用：任务、日历或内部数据',
    khusus: '为初创公司或机构定制的设计和功能',
  },
  hi: {
    promo: 'प्रोडक्ट, इवेंट या विज्ञापन अभियान का प्रचार',
    profil: 'आपके व्यवसाय या सेवाओं के लिए प्रोफ़ाइल वेबसाइट',
    jualan: 'ऑनलाइन बिक्री, WhatsApp पर ऑर्डर',
    toko: 'कार्ट, भुगतान और शिपिंग शुल्क वाला ऑनलाइन स्टोर',
    tautan: 'आपके सभी चैनलों के लिए एक बायो लिंक',
    undangan: 'शादी या पारिवारिक समारोह का निमंत्रण',
    acara: 'कॉर्पोरेट इवेंट, सेमिनार या सम्मेलन की साइट',
    portofolio: 'फ़्रीलांसरों और क्रिएटरों के लिए पोर्टफ़ोलियो',
    booking: 'टेबल, कमरे, डॉक्टर अपॉइंटमेंट या कोर्ट की बुकिंग',
    properti: 'एजेंट या डेवलपर के लिए प्रॉपर्टी कैटलॉग',
    aplikasi: 'टीम के काम का ऐप: टास्क, कैलेंडर या आंतरिक डेटा',
    khusus: 'स्टार्टअप या संस्था के लिए कस्टम डिज़ाइन और सुविधाएँ',
  },
  bn: {
    promo: 'পণ্য, ইভেন্ট বা বিজ্ঞাপন ক্যাম্পেইনের প্রচার',
    profil: 'আপনার ব্যবসা বা সেবার জন্য প্রোফাইল ওয়েবসাইট',
    jualan: 'অনলাইনে বিক্রি, WhatsApp-এ অর্ডার',
    toko: 'কার্ট, পেমেন্ট ও শিপিং চার্জসহ অনলাইন স্টোর',
    tautan: 'আপনার সব চ্যানেলের জন্য একটি বায়ো লিংক',
    undangan: 'বিয়ে বা পারিবারিক অনুষ্ঠানের আমন্ত্রণ',
    acara: 'কর্পোরেট ইভেন্ট, সেমিনার বা সম্মেলনের সাইট',
    portofolio: 'ফ্রিল্যান্সার ও ক্রিয়েটরদের জন্য পোর্টফোলিও',
    booking: 'টেবিল, রুম, ডাক্তারের অ্যাপয়েন্টমেন্ট বা কোর্ট বুকিং',
    properti: 'এজেন্ট বা ডেভেলপারের জন্য প্রপার্টি ক্যাটালগ',
    aplikasi: 'টিমের কাজের অ্যাপ: টাস্ক, ক্যালেন্ডার বা অভ্যন্তরীণ ডেটা',
    khusus: 'স্টার্টআপ বা প্রতিষ্ঠানের জন্য কাস্টম ডিজাইন ও ফিচার',
  },
  ar: {
    promo: 'الترويج لمنتج أو فعالية أو حملة إعلانية',
    profil: 'موقع تعريفي لنشاطك التجاري أو خدماتك',
    jualan: 'البيع عبر الإنترنت مع الطلب عبر واتساب',
    toko: 'متجر إلكتروني بسلة شراء ودفع وحساب لرسوم الشحن',
    tautan: 'رابط واحد في البايو لكل قنواتك',
    undangan: 'دعوة زفاف أو مناسبة عائلية',
    acara: 'موقع لفعالية شركة أو ندوة أو مؤتمر',
    portofolio: 'معرض أعمال للمستقلين وصنّاع المحتوى',
    booking: 'حجز الطاولات أو الغرف أو مواعيد الأطباء أو الملاعب',
    properti: 'كتالوج عقارات لوسيط أو مطوّر',
    aplikasi: 'تطبيق عمل للفريق: مهام أو تقويم أو بيانات داخلية',
    khusus: 'تصميم ومزايا مخصصة لشركة ناشئة أو مؤسسة',
  },
}

export type NeedItem = { key: NeedKey; need: string; pkg: LocalPaket }

/** Daftar kebutuhan dalam bahasa pengunjung, masing-masing dengan paketnya (harga & durasi dari lib/packages.ts). */
export function needsFor(lang: Lang, where: 'all' | 'home' = 'all'): NeedItem[] {
  const pk = packagesFor(lang)
  return NEED_KEYS.filter((k) => where === 'all' || NEED_PACKAGE[k].home).map((k) => {
    const pkg = pk.find((p) => p.slug === NEED_PACKAGE[k].pkg)
    // slug salah ketik menggagalkan build, supaya tidak ada tautan ke paket yang tidak ada
    if (!pkg) throw new Error(`Paket tidak dikenal untuk kebutuhan "${k}": ${NEED_PACKAGE[k].pkg}`)
    return { key: k, need: TEXT[lang][k], pkg }
  })
}
