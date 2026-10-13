// Gambar Open Graph 1200×630 dengan gaya situs: putih lapang, logo PintuWeb, huruf Inter (padanan SF Pro yang boleh dibundel).
//   /api/og?l=en&t=Judul      -> kartu judul halaman
//   /api/og?v=home&l=id       -> kartu beranda (kalimat & angka dari kamus, lib/site.ts & lib/demos.ts)
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDict } from '../../i18n'
import { LANG_INFO, isLang, type Lang } from '../../i18n/config'
import { DEMOS } from '../../lib/demos'

const C = { white: '#ffffff', ink: '#0f1b33', ink2: '#4d5b74', blue: '#26469c', line: '#dfe5ef', soft: '#f4f7fc' }

// Baris kecil di kanan atas kartu judul; bahasa tanpa entri memakai versi Inggris.
const TAG: Partial<Record<Lang, string>> & { en: string } = {
  id: 'Jasa pembuatan website',
  en: 'Website design & development',
  ms: 'Perkhidmatan laman web',
  es: 'Diseño y desarrollo web',
  fr: 'Création de sites web',
  pt: 'Criação de sites',
  ru: 'Разработка сайтов',
}

const fonts = async () => {
  const dir = join(process.cwd(), 'app/api/og/fonts')
  const [display, sans] = await Promise.all(['Inter-SemiBold.ttf', 'Inter-Regular.ttf'].map((f) => readFile(join(dir, f))))
  return [
    { name: 'Display', data: display, weight: 600 as const, style: 'normal' as const },
    { name: 'Sans', data: sans, weight: 400 as const, style: 'normal' as const },
  ]
}

/** Logo PintuWeb (app/api/og/logo.png, dibuat scripts/ikon-dari-logo.mjs) sebagai data URI untuk <img>. */
const LOGO_RATIO = 258 / 360
const logoSrc = async () => `data:image/png;base64,${(await readFile(join(process.cwd(), 'app/api/og/logo.png'))).toString('base64')}`

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const raw = q.get('l') ?? ''
  // huruf OG (Inter) tidak memuat aksara Mandarin/Hindi/Bengali/Arab: bahasa itu digambar dalam bahasa Inggris
  const lang: Lang = isLang(raw) ? (LANG_INFO[raw].ogText ? raw : 'en') : 'id'
  const d = getDict(lang)
  const home = q.get('v') === 'home'
  const title = (q.get('t') ?? 'PintuWeb').slice(0, 120)
  const size = title.length > 70 ? 56 : title.length > 40 ? 68 : 80
  const [h0, h1, h2] = d.hero.title
  const logo = await logoSrc()

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: C.white, padding: '56px 72px', fontFamily: 'Sans', position: 'relative' }}>
        {/* Logo besar di kanan */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={Math.round(320 * LOGO_RATIO)} height={320} style={{ position: 'absolute', right: 104, top: 150 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32, fontSize: 22, color: C.ink2 }}>
          <span style={{ display: 'flex', color: C.blue }}>{d.hero.kicker}</span>
          <span style={{ display: 'flex' }}>{home ? d.hero.meta(DEMOS.length) : TAG[lang] ?? TAG.en}</span>
        </div>

        {home ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', width: 780, fontFamily: 'Display', fontSize: 80, lineHeight: 1.05, letterSpacing: -2.6, color: C.ink }}>
            <span style={{ display: 'flex', marginRight: 22 }}>{h0.trim()}</span>
            <span style={{ display: 'flex', color: C.blue, marginRight: 22 }}>{h1}</span>
            <span style={{ display: 'flex' }}>{(h2 ?? '').trim()}</span>
          </div>
        ) : (
          <div style={{ display: 'flex', width: 780, fontFamily: 'Display', fontSize: size - 6, lineHeight: 1.1, letterSpacing: -1.8, color: C.ink }}>{title}</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={logo} width={Math.round(46 * LOGO_RATIO)} height={46} />
            <span style={{ display: 'flex', fontFamily: 'Display', fontSize: 36, color: C.ink, letterSpacing: -0.8 }}>PintuWeb</span>
          </div>
          <span style={{ display: 'flex', fontSize: 22, color: C.ink2 }}>www.pintuweb.id · {lang.toUpperCase()}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: await fonts(), headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable' } },
  )
}
