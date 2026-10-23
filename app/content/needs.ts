// Jalan pintas "kebutuhan → paket": tiap kebutuhan pelanggan (dalam kata sehari-hari) menunjuk SATU paket di
// lib/packages.ts. Kalimatnya diturunkan dari subjudul, sorotan (highlights), dan fitur paket itu sendiri di tiap
// bahasa, tanpa klaim baru. Harga & lama pengerjaan TIDAK ditulis di sini: keduanya diambil dari packagesFor().
// Dipakai beranda (pemilih kebutuhan "Untuk siapa", kebutuhan ber-`home`). `LABEL` = nama tombol pilihan yang
// pendek (1–3 kata), `TEXT` = kalimat kebutuhannya. Bahasa Indonesia memakai sapaan "kamu".
import type { Lang } from '../i18n/config'
import { packagesFor, type LocalPaket } from '../i18n/facts'
import type { ServiceKey } from '../i18n/slugs'
import { SERVICES } from './services'

export const NEED_KEYS = ['promo', 'profil', 'jualan', 'toko', 'tautan', 'undangan', 'acara', 'portofolio', 'booking', 'properti', 'aplikasi', 'hp', 'khusus'] as const
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
  // aplikasi Android & iOS (23 Okt 2026); tombol ke-9 di beranda, selebar kisi
  hp: { pkg: 'aplikasi-mobile', home: true },
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
    hp: 'Aplikasi HP Android & iOS untuk pelanggan atau timmu',
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
    hp: 'A phone app for Android & iOS, for your customers or team',
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
    hp: 'Aplikasi telefon Android & iOS untuk pelanggan atau pasukan anda',
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
    hp: 'Una app móvil Android e iOS para tus clientes o tu equipo',
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
    hp: 'Une appli mobile Android et iOS pour vos clients ou votre équipe',
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
    hp: 'Um app de celular Android e iOS para seus clientes ou sua equipe',
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
    hp: 'Мобильное приложение для Android и iOS — для клиентов или команды',
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
    hp: '面向顾客或团队的 Android 和 iOS 手机应用',
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
    hp: 'आपके ग्राहकों या टीम के लिए Android और iOS मोबाइल ऐप',
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
    hp: 'আপনার গ্রাহক বা টিমের জন্য Android ও iOS মোবাইল অ্যাপ',
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
    hp: 'تطبيق جوال لنظامي Android وiOS لعملائك أو فريقك',
    khusus: 'تصميم ومزايا مخصصة لشركة ناشئة أو مؤسسة',
  },
}

/** Nama pendek tiap kebutuhan untuk tombol pilihan (muat di pil ponsel). */
const LABEL: Record<Lang, Record<NeedKey, string>> = {
  id: { promo: 'Promosi', profil: 'Profil usaha', jualan: 'Jualan via WA', toko: 'Toko lengkap', tautan: 'Link bio', undangan: 'Undangan', acara: 'Situs acara', portofolio: 'Portofolio', booking: 'Booking', properti: 'Properti', aplikasi: 'Aplikasi tim', hp: 'Aplikasi HP (Android & iOS)', khusus: 'Fitur khusus' },
  en: { promo: 'Promotion', profil: 'Business profile', jualan: 'Sell on WhatsApp', toko: 'Full online store', tautan: 'Bio link', undangan: 'Invitation', acara: 'Event site', portofolio: 'Portfolio', booking: 'Booking', properti: 'Property', aplikasi: 'Team app', hp: 'Phone app (Android & iOS)', khusus: 'Custom features' },
  ms: { promo: 'Promosi', profil: 'Profil perniagaan', jualan: 'Jual melalui WA', toko: 'Kedai lengkap', tautan: 'Pautan bio', undangan: 'Jemputan', acara: 'Laman acara', portofolio: 'Portfolio', booking: 'Tempahan', properti: 'Hartanah', aplikasi: 'Aplikasi pasukan', hp: 'Aplikasi telefon (Android & iOS)', khusus: 'Ciri khas' },
  es: { promo: 'Promoción', profil: 'Perfil de negocio', jualan: 'Vender por WhatsApp', toko: 'Tienda completa', tautan: 'Enlace en la bio', undangan: 'Invitación', acara: 'Sitio de evento', portofolio: 'Portafolio', booking: 'Reservas', properti: 'Inmuebles', aplikasi: 'App de equipo', hp: 'App móvil (Android e iOS)', khusus: 'A medida' },
  fr: { promo: 'Promotion', profil: 'Site vitrine', jualan: 'Vente via WhatsApp', toko: 'Boutique complète', tautan: 'Lien de bio', undangan: 'Invitation', acara: 'Site d’événement', portofolio: 'Portfolio', booking: 'Réservations', properti: 'Immobilier', aplikasi: 'Appli d’équipe', hp: 'Appli mobile (Android et iOS)', khusus: 'Sur mesure' },
  pt: { promo: 'Divulgação', profil: 'Site institucional', jualan: 'Vender no WhatsApp', toko: 'Loja completa', tautan: 'Link na bio', undangan: 'Convite', acara: 'Site de evento', portofolio: 'Portfólio', booking: 'Reservas', properti: 'Imóveis', aplikasi: 'App da equipe', hp: 'App de celular (Android e iOS)', khusus: 'Sob medida' },
  ru: { promo: 'Продвижение', profil: 'Сайт компании', jualan: 'Продажи в WhatsApp', toko: 'Интернет-магазин', tautan: 'Ссылка в профиле', undangan: 'Приглашение', acara: 'Сайт события', portofolio: 'Портфолио', booking: 'Бронирование', properti: 'Недвижимость', aplikasi: 'Приложение для команды', hp: 'Мобильное приложение (Android и iOS)', khusus: 'Индивидуально' },
  zh: { promo: '推广', profil: '企业官网', jualan: 'WhatsApp 卖货', toko: '完整网店', tautan: '主页链接', undangan: '请柬', acara: '活动网站', portofolio: '作品集', booking: '预订', properti: '房产', aplikasi: '团队应用', hp: '手机应用（Android 和 iOS）', khusus: '定制功能' },
  hi: { promo: 'प्रचार', profil: 'बिज़नेस प्रोफ़ाइल', jualan: 'WhatsApp से बिक्री', toko: 'पूरा ऑनलाइन स्टोर', tautan: 'बायो लिंक', undangan: 'निमंत्रण', acara: 'इवेंट साइट', portofolio: 'पोर्टफ़ोलियो', booking: 'बुकिंग', properti: 'प्रॉपर्टी', aplikasi: 'टीम ऐप', hp: 'मोबाइल ऐप (Android और iOS)', khusus: 'कस्टम फ़ीचर' },
  bn: { promo: 'প্রচার', profil: 'ব্যবসার প্রোফাইল', jualan: 'WhatsApp-এ বিক্রি', toko: 'পূর্ণ অনলাইন স্টোর', tautan: 'বায়ো লিংক', undangan: 'আমন্ত্রণ', acara: 'ইভেন্ট সাইট', portofolio: 'পোর্টফোলিও', booking: 'বুকিং', properti: 'প্রপার্টি', aplikasi: 'টিম অ্যাপ', hp: 'মোবাইল অ্যাপ (Android ও iOS)', khusus: 'কাস্টম ফিচার' },
  ar: { promo: 'الترويج', profil: 'موقع تعريفي', jualan: 'البيع عبر واتساب', toko: 'متجر متكامل', tautan: 'رابط البايو', undangan: 'دعوة', acara: 'موقع فعالية', portofolio: 'معرض أعمال', booking: 'الحجز', properti: 'العقارات', aplikasi: 'تطبيق للفريق', hp: 'تطبيق جوال (Android وiOS)', khusus: 'ميزات مخصصة' },
}

/**
 * Satu kebutuhan: nama pendek (tombol), kalimat kebutuhannya, paketnya (harga & durasi dari lib/packages.ts), dan
 * halaman layanan yang memuat paket itu (content/services.ts; null bila paket tidak punya halaman layanan).
 */
export type NeedItem = { key: NeedKey; label: string; need: string; pkg: LocalPaket; service: ServiceKey | null }

/** Daftar kebutuhan dalam bahasa pengunjung, masing-masing dengan paketnya (harga & durasi dari lib/packages.ts). */
export function needsFor(lang: Lang, where: 'all' | 'home' = 'all'): NeedItem[] {
  const pk = packagesFor(lang)
  return NEED_KEYS.filter((k) => where === 'all' || NEED_PACKAGE[k].home).map((k) => {
    const pkg = pk.find((p) => p.slug === NEED_PACKAGE[k].pkg)
    // slug salah ketik menggagalkan build, supaya tidak ada tautan ke paket yang tidak ada
    if (!pkg) throw new Error(`Paket tidak dikenal untuk kebutuhan "${k}": ${NEED_PACKAGE[k].pkg}`)
    const service = SERVICES.find((sv) => sv.packages.includes(pkg.slug))?.key ?? null
    return { key: k, label: LABEL[lang][k], need: TEXT[lang][k], pkg, service }
  })
}
