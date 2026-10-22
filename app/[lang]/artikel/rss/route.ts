// Umpan RSS artikel per bahasa: /artikel/rss (ID) dan /en/articles/rss (EN).
import { articlesIn } from '../../../content/articles'
import { ARTICLE_LANGS, isLang, LANG_INFO } from '../../../i18n/config'
import { getPages } from '../../../i18n'
import { urlOf } from '../../../i18n/routes'
import { EMAIL, FOUNDER_NAME } from '../../../lib/site'

export const dynamic = 'force-static'
export const dynamicParams = false
export const generateStaticParams = () => ARTICLE_LANGS.map((lang) => ({ lang }))

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLang(lang) || !ARTICLE_LANGS.includes(lang)) return new Response('Not found', { status: 404 })
  const p = getPages(lang).articles
  const list = articlesIn(lang)
  const home = urlOf(lang, { key: 'articles' })
  const items = list
    .map((a) => {
      const link = urlOf(lang, { key: 'articles', article: a.key })
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${esc(a.description)}</description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <author>${EMAIL} (${FOUNDER_NAME})</author>
${a.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`PintuWeb — ${p.title}`)}</title>
    <link>${home}</link>
    <description>${esc(p.description)}</description>
    <language>${LANG_INFO[lang].htmlLang}</language>
    <atom:link href="${home}/rss" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date(list[0]?.updated ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
