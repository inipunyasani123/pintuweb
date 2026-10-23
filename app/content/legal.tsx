// Isi Kebijakan Privasi & Syarat Ketentuan (3 bahasa). Versi Indonesia adalah teks asli;
// EN/MS adalah terjemahan dan, bila ada perbedaan tafsir, versi Indonesia yang berlaku.
// Tiap dokumen = pembuka + daftar pasal { id, title, body }. `id` menjadi jangkar (/syarat-ketentuan#garansi)
// yang ditaut dari beranda dan FAQ, jadi jangan diganti tanpa alasan. Tampilannya diatur components/LegalPage.tsx.
import Link from 'next/link'
import type { ReactNode } from 'react'
import { EMAIL, FACTS_UPDATED, GUARANTEE_DAYS, SITE, WA_DISPLAY, latest } from '../lib/site'
import { PRICES_UPDATED } from '../lib/packages'
import { facts, packagesFor } from '../i18n/facts'
import { path } from '../i18n/routes'
import type { BaseLang } from '../i18n/config'

/** Tanggal kalimat dokumen terakhir diubah. */
const LEGAL_TEXT_UPDATED = '2026-10-23'
/** Tanggal berlaku: dokumen ikut berubah bila kontak (lib/site.ts) atau waktu pengerjaan paket berubah. */
export const LEGAL_UPDATED_ISO = latest(LEGAL_TEXT_UPDATED, FACTS_UPDATED, PRICES_UPDATED)
const fmt = (locale: string) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(LEGAL_UPDATED_ISO))
export const LEGAL_UPDATED: Record<BaseLang, string> = { id: fmt('id-ID'), en: fmt('en-GB'), ms: fmt('ms-MY') }

export type LegalSection = { id: string; title: string; body: ReactNode }
export type LegalDoc = { intro: ReactNode; sections: LegalSection[] }

/** Jangkar pasal Syarat & Ketentuan (sama di ketiga bahasa). */
export type TermsId = 'paket' | 'pembayaran' | 'waktu' | 'revisi' | 'garansi' | 'domain-hosting' | 'kepemilikan' | 'materi' | 'pembatalan' | 'kontak'

const host = SITE.replace('https://', '')

export function privacyDoc(lang: BaseLang): LegalDoc {
  const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
  if (lang === 'en' || lang === 'ms') {
    const en = lang === 'en'
    return {
      intro: (
        <p>
          {en
            ? `This policy explains what data PintuWeb receives when you visit ${host} or contact us, how that data is used and your rights over it, in line with Indonesia's Personal Data Protection Law (Law No. 27 of 2022). The Indonesian version is the original; if the versions differ, the Indonesian version prevails.`
            : `Dasar ini menerangkan data yang diterima PintuWeb apabila anda melawat ${host} atau menghubungi kami, cara data itu digunakan dan hak anda ke atasnya, selaras dengan Undang-Undang Pelindungan Data Peribadi Indonesia (UU No. 27 Tahun 2022). Versi bahasa Indonesia ialah teks asal; jika terdapat perbezaan, versi bahasa Indonesia terpakai.`}
        </p>
      ),
      sections: [
        {
          id: 'data-diterima',
          title: en ? 'Data we receive' : 'Data yang kami terima',
          body: (
            <ul>
              <li>
                <strong>{en ? 'Data you send yourself' : 'Data yang anda hantar sendiri'}</strong>{' '}
                {en
                  ? 'over WhatsApp or email, such as your name, business name and website needs. The form on the '
                  : 'melalui WhatsApp atau e-mel, seperti nama, nama perniagaan dan keperluan laman web. Borang di halaman '}
                <Link href={path(lang, 'contact')}>{en ? 'Contact' : 'Hubungi'}</Link>
                {en
                  ? ' page stores nothing on our server; it only composes a message and opens your WhatsApp or email app.'
                  : ' tidak menyimpan apa-apa di pelayan kami; ia hanya menyusun mesej dan membuka aplikasi WhatsApp atau e-mel anda.'}
              </li>
              <li>
                <strong>{en ? 'Anonymous visit statistics' : 'Statistik lawatan tanpa nama'}</strong>{' '}
                {en
                  ? 'from Vercel Web Analytics, such as pages viewed and device type. These statistics use no cookies and do not identify you personally.'
                  : 'daripada Vercel Web Analytics, seperti halaman yang dibuka dan jenis peranti. Statistik ini tidak menggunakan kuki dan tidak mengenal pasti anda secara peribadi.'}
              </li>
              <li>
                <strong>{en ? 'Project materials' : 'Bahan projek'}</strong>{' '}
                {en
                  ? 'you provide while we work together, such as logos, photos and text for your website.'
                  : 'yang anda berikan semasa bekerjasama, contohnya logo, foto dan teks untuk laman web anda.'}
              </li>
            </ul>
          ),
        },
        {
          id: 'penggunaan',
          title: en ? 'What the data is used for' : 'Tujuan penggunaan data',
          body: (
            <ul>
              {(en
                ? ['Answering questions and preparing quotes.', 'Building, maintaining and supporting your website.', 'Reminding you of domain and hosting renewal dates.', 'Understanding which pages help visitors, from anonymous statistics.']
                : ['Menjawab soalan dan menyediakan sebut harga.', 'Membina, menyelenggara dan menyokong laman web anda.', 'Mengingatkan tarikh pembaharuan domain dan hosting.', 'Memahami halaman mana yang berguna kepada pelawat, daripada statistik tanpa nama.']
              ).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ),
        },
        {
          id: 'berbagi-data',
          title: en ? 'Sharing data' : 'Perkongsian data',
          body: (
            <p>
              {en
                ? 'We do not sell or rent your data. It is shared only with service providers genuinely needed to run your website, such as the domain registrar and hosting provider, or when required by law.'
                : 'Kami tidak menjual atau menyewakan data anda. Data hanya dikongsi dengan penyedia perkhidmatan yang benar-benar diperlukan untuk menjalankan laman web anda, seperti pendaftar domain dan penyedia hosting, atau apabila dikehendaki oleh undang-undang.'}
            </p>
          ),
        },
        {
          id: 'penyimpanan',
          title: en ? 'Storage & security' : 'Penyimpanan & keselamatan',
          body: (
            <p>
              {en
                ? 'Conversations and project materials are kept for as long as they are needed for our work together and support. Website code is kept in a Git repository with restricted access.'
                : 'Perbualan dan bahan projek disimpan selama diperlukan untuk kerjasama dan sokongan. Kod laman web disimpan dalam repositori Git dengan akses terhad.'}
            </p>
          ),
        },
        {
          id: 'hak-anda',
          title: en ? 'Your rights' : 'Hak anda',
          body: (
            <p>
              {en
                ? 'You may ask for a copy, correction or deletion of the data you have given us. Send your request to '
                : 'Anda boleh meminta salinan, pembetulan atau pemadaman data yang anda berikan kepada kami. Hantar permintaan ke e-mel '}
              {mail} {en ? 'or WhatsApp' : 'atau WhatsApp'} {WA_DISPLAY}.
            </p>
          ),
        },
        {
          id: 'perubahan',
          title: en ? 'Changes to this policy' : 'Perubahan dasar',
          body: (
            <p>
              {en ? 'If this policy changes, the effective date above will be updated. See also the ' : 'Jika dasar ini berubah, tarikh berkuat kuasa di atas akan dikemas kini. Lihat juga '}
              <Link href={path(lang, 'terms')}>{en ? 'Terms & Conditions' : 'Terma & Syarat'}</Link>.
            </p>
          ),
        },
      ],
    }
  }

  return {
    intro: (
      <p>
        Kebijakan ini menjelaskan data apa yang PintuWeb terima saat Anda mengunjungi {host} atau
        menghubungi kami, bagaimana data itu dipakai, dan hak Anda atasnya, sejalan dengan Undang-Undang Nomor 27 Tahun
        2022 tentang Pelindungan Data Pribadi.
      </p>
    ),
    sections: [
      {
        id: 'data-diterima',
        title: 'Data yang kami terima',
        body: (
          <ul>
            <li>
              <strong>Data yang Anda kirim sendiri</strong> lewat WhatsApp atau email, misalnya nama, nama usaha, dan kebutuhan
              website. Formulir di halaman <Link href="/kontak">Kontak</Link> tidak menyimpan apa pun di server kami; formulir itu
              hanya menyusun pesan lalu membuka aplikasi WhatsApp atau email Anda.
            </li>
            <li>
              <strong>Statistik kunjungan anonim</strong> dari Vercel Web Analytics, seperti halaman yang dibuka dan jenis perangkat.
              Statistik ini tidak memakai cookie dan tidak mengidentifikasi Anda secara pribadi.
            </li>
            <li>
              <strong>Materi proyek</strong> yang Anda berikan saat bekerja sama, misalnya logo, foto, dan teks untuk website Anda.
            </li>
          </ul>
        ),
      },
      {
        id: 'penggunaan',
        title: 'Untuk apa data dipakai',
        body: (
          <ul>
            <li>Menjawab pertanyaan dan menyiapkan penawaran.</li>
            <li>Mengerjakan, memelihara, dan mendukung website Anda.</li>
            <li>Mengingatkan jadwal perpanjangan domain dan hosting.</li>
            <li>Memahami halaman mana yang berguna bagi pengunjung, dari statistik anonim.</li>
          </ul>
        ),
      },
      {
        id: 'berbagi-data',
        title: 'Berbagi data',
        body: (
          <p>
            Kami tidak menjual atau menyewakan data Anda. Data hanya dibagikan kepada penyedia layanan yang memang diperlukan
            untuk menjalankan website Anda, seperti registrar domain dan penyedia hosting, atau bila diwajibkan oleh hukum.
          </p>
        ),
      },
      {
        id: 'penyimpanan',
        title: 'Penyimpanan & keamanan',
        body: (
          <p>
            Percakapan dan materi proyek disimpan selama dibutuhkan untuk kerja sama dan dukungan. Kode website disimpan di
            repository Git yang aksesnya terbatas.
          </p>
        ),
      },
      {
        id: 'hak-anda',
        title: 'Hak Anda',
        body: (
          <p>
            Anda boleh meminta salinan, perbaikan, atau penghapusan data yang Anda berikan kepada kami. Kirim permintaan ke
            email {mail} atau WhatsApp {WA_DISPLAY}.
          </p>
        ),
      },
      {
        id: 'perubahan',
        title: 'Perubahan kebijakan',
        body: (
          <p>
            Bila kebijakan ini berubah, tanggal berlaku di atas akan diperbarui. Lihat juga{' '}
            <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>.
          </p>
        ),
      },
    ],
  }
}

export function termsDoc(lang: BaseLang): LegalDoc {
  const f = facts(lang)
  const pk = packagesFor(lang)
  const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
  // Perkiraan waktu tiap paket (dari lib/packages.ts) sebagai daftar, bukan satu kalimat panjang.
  const durations = (
    <ul className="rows">
      {pk.map((p) => (
        <li key={p.slug}>
          {/* nilai pendek ("1–3 hari kerja") tidak boleh terpotong baris; yang panjang boleh */}
          <span>{p.title}</span> <span className={p.duration.length > 16 ? 'wrap' : undefined}>{p.duration}</span>
        </li>
      ))}
    </ul>
  )
  const sec = (id: TermsId, title: string, body: ReactNode): LegalSection => ({ id, title, body })

  if (lang === 'en' || lang === 'ms') {
    const en = lang === 'en'
    const T = en
      ? {
          intro: 'These terms apply to the PintuWeb website service. The final details of each project — features, price and schedule — are set out in a written quote (over WhatsApp or by invoice) that you approve before work starts. If anything differs, that written quote applies. The Indonesian version of these terms is the original and prevails if the versions differ.',
          h: ['Packages & scope', 'Price & payment', 'Turnaround', 'Revisions', 'Guarantee & maintenance', 'Domain & hosting', 'Ownership', 'Client materials', 'Cancellation', 'Contact'],
          scope1: 'What each package includes is listed on the ',
          scopeLink: 'Pricing',
          scope2: ' page. Work outside a package, such as major extra features, gets a separate quote and is only done once you approve it.',
          timeIntro: 'Estimated time per package:',
          timeAfter: 'The clock starts when the deposit is received and the materials (text, logo, photos) are complete. Late materials from the client shift the schedule.',
          rev: 'The number of revisions follows your package. Small changes such as text, photos or contact details are free during the maintenance period. Major changes beyond the original agreement are discussed and priced first.',
          guar: `Bugs and technical issues are fixed free of charge for ${GUARANTEE_DAYS} days after launch. After that, maintenance applies as included in your package and can be extended. The guarantee does not cover damage caused by code changes made by others or requests for new features. For mobile apps (Android & iOS), the ${GUARANTEE_DAYS}-day guarantee applies from the day the app is handed over.`,
          dom: 'If renewal is not made, the domain and hosting may expire under the provider’s terms.',
          own: 'Once paid in full, the website with its source code, admin access, hosting access and domain becomes entirely yours. Exception: invitation themes from our gallery stay active for 12 months on a personal link, and the Website Design Concepts package grants the right to use the design, not the code. PintuWeb only lists your project among its client projects if you allow it. For mobile apps (Android & iOS), PintuWeb hands over the app files and the source code after payment in full; publishing to Google Play and the App Store is done by you with a developer account in your own name, and the cost of that developer account is borne by you.',
          mat: 'You are responsible for making sure the materials you provide (logos, photos, text) may be used and do not infringe anyone else’s rights.',
          cancel: 'Cancellation and refund terms for each project are set out in the written quote before work starts.',
          contact1: 'Questions about these terms can be sent to ',
          contact2: ' or WhatsApp ',
          contact3: '. See also the ',
          privacy: 'Privacy Policy',
        }
      : {
          intro: 'Terma ini terpakai untuk perkhidmatan membina laman web PintuWeb. Butiran akhir setiap projek — ciri, harga dan jadual — dinyatakan dalam sebut harga bertulis (melalui WhatsApp atau invois) yang anda luluskan sebelum kerja bermula. Jika ada perbezaan, sebut harga bertulis itulah yang terpakai. Versi bahasa Indonesia terma ini ialah teks asal dan terpakai jika terdapat perbezaan.',
          h: ['Pakej & skop', 'Harga & pembayaran', 'Tempoh siap', 'Semakan', 'Jaminan & penyelenggaraan', 'Domain & hosting', 'Pemilikan', 'Bahan daripada pelanggan', 'Pembatalan', 'Hubungi'],
          scope1: 'Kandungan setiap pakej tertera di halaman ',
          scopeLink: 'Harga',
          scope2: '. Kerja di luar pakej, contohnya ciri tambahan yang besar, diberikan sebut harga berasingan dan hanya dilaksanakan selepas anda luluskan.',
          timeIntro: 'Anggaran masa setiap pakej:',
          timeAfter: 'Masa dikira sejak deposit diterima dan bahan (teks, logo, foto) lengkap. Kelewatan bahan daripada pelanggan akan menganjakkan jadual.',
          rev: 'Bilangan semakan mengikut pakej. Perubahan kecil seperti teks, foto atau maklumat hubungan dibantu tanpa caj sepanjang tempoh penyelenggaraan. Perubahan besar di luar persetujuan awal dibincangkan dan dipersetujui kosnya terlebih dahulu.',
          guar: `Pepijat dan masalah teknikal dibaiki secara percuma selama ${GUARANTEE_DAYS} hari selepas laman web dilancarkan. Selepas itu, penyelenggaraan terpakai mengikut isi pakej dan boleh dilanjutkan. Jaminan tidak meliputi kerosakan akibat perubahan kod oleh pihak lain atau permintaan ciri baharu. Bagi aplikasi mudah alih (Android & iOS), jaminan ${GUARANTEE_DAYS} hari terpakai sejak aplikasi diserahkan.`,
          dom: 'Jika pembaharuan tidak dibuat, domain dan hosting boleh tamat mengikut terma penyedianya.',
          own: 'Selepas bayaran penuh, laman web beserta kod sumber, akses admin, akses hosting dan domain menjadi milik anda sepenuhnya. Pengecualian: tema jemputan daripada galeri kami aktif 12 bulan pada pautan peribadi, dan pakej Konsep Reka Bentuk Laman Web memberikan hak menggunakan reka bentuk, bukan kod. PintuWeb hanya memaparkan projek anda sebagai projek pelanggan jika anda membenarkannya. Bagi aplikasi mudah alih (Android & iOS), PintuWeb menyerahkan fail aplikasi beserta kod sumbernya selepas bayaran penuh; penerbitan ke Google Play dan App Store dilakukan oleh anda dengan akaun pembangun atas nama anda sendiri, dan kos akaun pembangun itu ditanggung oleh anda.',
          mat: 'Anda bertanggungjawab memastikan bahan yang anda berikan (logo, foto, teks) boleh digunakan dan tidak melanggar hak pihak lain.',
          cancel: 'Terma pembatalan dan pemulangan wang bagi setiap projek dinyatakan dalam sebut harga bertulis sebelum kerja bermula.',
          contact1: 'Soalan tentang terma ini boleh dihantar ke ',
          contact2: ' atau WhatsApp ',
          contact3: '. Lihat juga ',
          privacy: 'Dasar Privasi',
        }
    return {
      intro: <p>{T.intro}</p>,
      sections: [
        sec('paket', T.h[0], <p>{T.scope1}<Link href={path(lang, 'pricing')}>{T.scopeLink}</Link>{T.scope2}</p>),
        sec('pembayaran', T.h[1], <p>{f.payment}</p>),
        sec('waktu', T.h[2], <><p>{T.timeIntro}</p>{durations}<p>{T.timeAfter}</p></>),
        sec('revisi', T.h[3], <p>{T.rev}</p>),
        sec('garansi', T.h[4], <p>{T.guar}</p>),
        sec('domain-hosting', T.h[5], <p>{f.renewal} {T.dom}</p>),
        sec('kepemilikan', T.h[6], <p>{T.own}</p>),
        sec('materi', T.h[7], <p>{T.mat}</p>),
        sec('pembatalan', T.h[8], <p>{T.cancel}</p>),
        sec('kontak', T.h[9], <p>{T.contact1}{mail}{T.contact2}{WA_DISPLAY}{T.contact3}<Link href={path(lang, 'privacy')}>{T.privacy}</Link>.</p>),
      ],
    }
  }

  return {
    intro: (
      <p>
        Ketentuan ini berlaku untuk layanan pembuatan website PintuWeb. Rincian akhir setiap proyek, seperti fitur, harga,
        dan jadwal, dicantumkan dalam penawaran tertulis (lewat WhatsApp atau invoice) yang Anda setujui sebelum pengerjaan
        dimulai. Bila ada perbedaan, penawaran tertulis itulah yang berlaku.
      </p>
    ),
    sections: [
      sec(
        'paket',
        'Paket & ruang lingkup',
        <p>
          Isi setiap paket tercantum di halaman <Link href="/paket">Paket</Link>. Pekerjaan di luar paket, misalnya fitur
          tambahan yang besar, dibuatkan penawaran terpisah dan baru dikerjakan setelah Anda setujui.
        </p>,
      ),
      sec('pembayaran', 'Harga & pembayaran', <p>{f.payment}</p>),
      sec(
        'waktu',
        'Waktu pengerjaan',
        <>
          <p>Perkiraan waktu per paket:</p>
          {durations}
          <p>
            Waktu dihitung sejak DP diterima dan materi (teks, logo, foto) lengkap. Keterlambatan materi dari pihak klien
            menggeser jadwal.
          </p>
        </>,
      ),
      sec(
        'revisi',
        'Revisi',
        <p>
          Jatah revisi mengikuti paket. Perubahan kecil seperti teks, foto, atau info kontak dibantu tanpa biaya selama masa
          maintenance. Perubahan besar di luar kesepakatan awal dibicarakan dan disepakati biayanya lebih dulu.
        </p>,
      ),
      sec(
        'garansi',
        'Garansi & maintenance',
        <p>
          Bug dan masalah teknis diperbaiki gratis selama {GUARANTEE_DAYS} hari setelah website online. Setelah itu,
          maintenance berlaku sesuai isi paket dan bisa diperpanjang. Garansi tidak mencakup kerusakan akibat perubahan
          kode oleh pihak lain atau permintaan fitur baru. Untuk aplikasi mobile (Android & iOS), garansi {GUARANTEE_DAYS} hari berlaku sejak aplikasi diserahkan.
        </p>,
      ),
      sec(
        'domain-hosting',
        'Domain & hosting',
        <p>
          {f.renewal} Bila perpanjangan tidak dilakukan, domain dan hosting dapat berakhir sesuai ketentuan
          penyedianya.
        </p>,
      ),
      sec(
        'kepemilikan',
        'Kepemilikan',
        <p>
          Setelah pelunasan, website beserta source code, akses admin, akses hosting, dan domain sepenuhnya menjadi milik
          Anda. Pengecualian: tema undangan dari galeri kami aktif 12 bulan di tautan pribadi, dan paket Konsep Desain
          memberi hak pakai desain, bukan kode. PintuWeb hanya mencantumkan proyek Anda di daftar proyek klien bila Anda
          mengizinkannya. Untuk aplikasi mobile (Android & iOS), PintuWeb menyerahkan file aplikasi beserta kode sumbernya setelah pelunasan; rilis ke Google Play dan App Store dilakukan oleh Anda dengan akun developer atas nama Anda sendiri, dan biaya akun developer itu ditanggung Anda.
        </p>,
      ),
      sec(
        'materi',
        'Materi dari klien',
        <p>
          Anda bertanggung jawab memastikan materi yang Anda berikan (logo, foto, teks) boleh dipakai dan tidak melanggar hak
          pihak lain.
        </p>,
      ),
      sec(
        'pembatalan',
        'Pembatalan',
        <p>
          Ketentuan pembatalan dan pengembalian dana untuk tiap proyek dicantumkan dalam penawaran tertulis sebelum
          pengerjaan dimulai.
        </p>,
      ),
      sec(
        'kontak',
        'Kontak',
        <p>
          Pertanyaan soal ketentuan ini dapat dikirim ke {mail} atau WhatsApp {WA_DISPLAY}.
          Lihat juga <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>.
        </p>,
      ),
    ],
  }
}
