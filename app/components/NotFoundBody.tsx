'use client'
// Isi halaman 404 berbahasa sesuai URL (not-found tidak menerima params, jadi bahasa dibaca dari path).
// Judul & robots halaman diatur metadata di app/[lang]/not-found.tsx.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { WA_NUMBER } from '../lib/site'
import { isLang, type Lang } from '../i18n/config'
import { path } from '../i18n/routes'

// Teks 404 per bahasa (sama dengan pages.notFound; ditulis di sini supaya kamus halaman tidak ikut terkirim ke
// browser). Menambah bahasa = menambah satu baris di sini; tipenya memaksa semua bahasa terisi.
type Text = { title: string; h1: string; lead: string; home: string; demos: string; wa: string; waText: string; newTab: string }
const TEXT: Record<Lang, Text> = {
  id: { title: 'Halaman tidak ditemukan', h1: 'Pintu ini belum ada.', lead: 'Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan. Coba mulai dari salah satu pintu di bawah.', home: 'Ke beranda', demos: 'Lihat demo', wa: 'Atau tanyakan langsung lewat WhatsApp', waText: 'Halo PintuWeb, saya tidak menemukan halaman yang saya cari di situs.', newTab: '(tab baru)' },
  en: { title: 'Page not found', h1: 'This door does not exist yet.', lead: 'The page you are looking for could not be found or has moved. Try starting from one of the doors below.', home: 'Go to the home page', demos: 'See demos', wa: 'Or ask us directly on WhatsApp', waText: 'Hello PintuWeb, I could not find the page I was looking for on your site.', newTab: '(new tab)' },
  ms: { title: 'Halaman tidak ditemui', h1: 'Pintu ini belum wujud.', lead: 'Halaman yang anda cari tidak ditemui atau telah dipindahkan. Cuba mulakan dari salah satu pintu di bawah.', home: 'Ke halaman utama', demos: 'Lihat demo', wa: 'Atau tanya terus melalui WhatsApp', waText: 'Hai PintuWeb, saya tidak menemui halaman yang saya cari di laman anda.', newTab: '(tab baharu)' },
  es: { title: 'Página no encontrada', h1: 'Esta puerta aún no existe.', lead: 'La página que buscas no se ha encontrado o se ha movido. Prueba a empezar por una de las puertas de abajo.', home: 'Ir al inicio', demos: 'Ver demos', wa: 'O pregúntanos directamente por WhatsApp', waText: 'Hola PintuWeb, no he encontrado la página que buscaba en su sitio.', newTab: '(pestaña nueva)' },
  fr: { title: 'Page introuvable', h1: 'Cette porte n’existe pas encore.', lead: 'La page que vous cherchez est introuvable ou a été déplacée. Essayez de repartir de l’une des portes ci-dessous.', home: 'Aller à l’accueil', demos: 'Voir les démos', wa: 'Ou posez-nous la question directement sur WhatsApp', waText: 'Bonjour PintuWeb, je n’ai pas trouvé la page que je cherchais sur votre site.', newTab: '(nouvel onglet)' },
  pt: { title: 'Página não encontrada', h1: 'Esta porta ainda não existe.', lead: 'A página que você procura não foi encontrada ou foi movida. Tente começar por uma das portas abaixo.', home: 'Ir para o início', demos: 'Ver demos', wa: 'Ou pergunte diretamente pelo WhatsApp', waText: 'Olá PintuWeb, não encontrei a página que procurava no site de vocês.', newTab: '(nova aba)' },
  ru: { title: 'Страница не найдена', h1: 'Этой двери пока нет.', lead: 'Страница, которую вы ищете, не найдена или была перемещена. Попробуйте начать с одной из дверей ниже.', home: 'На главную', demos: 'Смотреть демо', wa: 'Или спросите нас напрямую в WhatsApp', waText: 'Здравствуйте, PintuWeb! Не получилось найти нужную страницу на вашем сайте.', newTab: '(новая вкладка)' },
  zh: { title: '页面未找到', h1: '这扇门还不存在。', lead: '您要找的页面不存在或已被移动。试试从下面的某一扇门开始。', home: '回到首页', demos: '查看演示', wa: '或直接在 WhatsApp 上问我们', waText: '您好 PintuWeb，我在你们的网站上没有找到想看的页面。', newTab: '（新标签页）' },
  hi: { title: 'पेज नहीं मिला', h1: 'यह दरवाज़ा अभी मौजूद नहीं है।', lead: 'आप जो पेज ढूँढ रहे हैं, वह नहीं मिला या कहीं और चला गया है। नीचे दिए किसी दरवाज़े से शुरू करके देखिए।', home: 'होम पर जाएँ', demos: 'डेमो देखें', wa: 'या हमसे सीधे WhatsApp पर पूछें', waText: 'नमस्ते PintuWeb, आपकी साइट पर मुझे अपनी ज़रूरत का पेज नहीं मिला।', newTab: '(नया टैब)' },
  bn: { title: 'পেজ পাওয়া যায়নি', h1: 'এই দরজাটি এখনো নেই।', lead: 'আপনি যে পেজ খুঁজছেন তা পাওয়া যায়নি অথবা সরিয়ে নেওয়া হয়েছে। নিচের যেকোনো একটি দরজা দিয়ে শুরু করে দেখুন।', home: 'হোমে যান', demos: 'ডেমো দেখুন', wa: 'অথবা সরাসরি WhatsApp-এ জিজ্ঞাসা করুন', waText: 'হ্যালো PintuWeb, আপনাদের সাইটে আমি যে পেজ খুঁজছিলাম তা পাইনি।', newTab: '(নতুন ট্যাব)' },
  ar: { title: 'الصفحة غير موجودة', h1: 'هذا الباب غير موجود بعد.', lead: 'الصفحة التي تبحث عنها غير موجودة أو نُقلت. جرّب البدء من أحد الأبواب أدناه.', home: 'إلى الرئيسية', demos: 'شاهد العروض التجريبية', wa: 'أو اسألنا مباشرة عبر واتساب', waText: 'مرحبًا PintuWeb، لم أجد الصفحة التي أبحث عنها في موقعكم.', newTab: '(تبويب جديد)' },
}

export default function NotFoundBody() {
  const first = usePathname()?.split('/')[1] ?? ''
  const lang: Lang = isLang(first) ? first : 'id'
  const t = TEXT[lang]
  // judul tab dalam bahasa pengunjung (HTML server memakai judul netral dari metadata)
  useEffect(() => {
    document.title = `${t.title} | PintuWeb`
  }, [t.title])
  return (
    <main id="main-content" className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto grid grid-cols-1 max-w-6xl items-end gap-x-10 gap-y-12 px-4 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="kicker text-[color:var(--primary-700)]">404 · {t.title}</p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.05] text-[color:var(--text-primary)] sm:text-[3.75rem]">{t.h1}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--text-tertiary)]">{t.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={path(lang, 'home')} className="btn btn-solid">
              {t.home} <ArrowRight size={17} className="arw" aria-hidden="true" />
            </Link>
            <Link href={path(lang, 'demo')} className="btn btn-line">
              {t.demos} <ArrowRight size={17} className="arw" aria-hidden="true" />
            </Link>
          </div>
          <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t.waText)}`} target="_blank" rel="noopener noreferrer" className="link mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold">
            {t.wa} <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only">{t.newTab}</span>
          </a>
        </div>
        {/* Pintu yang masih tertutup */}
        <div className="md:col-span-4" aria-hidden="true">
          <div className="pintu-frame mx-auto w-44 bg-white p-[3px] md:ms-auto md:me-0">
            <div className="arch-top grid aspect-[5/7] place-items-center bg-[color:var(--surface-primary)]">
              <span className="display text-5xl text-[color:var(--primary-700)]">404</span>
            </div>
          </div>
          <div className="mx-auto h-[3px] w-44 bg-[color:var(--rule)] md:ms-auto md:me-0" />
        </div>
      </div>
    </main>
  )
}
