// Artikel dari content/articles/<lang>/<slug>.md (hanya dipakai di server: membaca fs saat build).
// Penanda {{…}} diisi dari lib/packages.ts & lib/site.ts supaya angka di artikel selalu sama dengan halaman Paket.
import fs from 'node:fs'
import path from 'node:path'
import { Marked, type Token, type Tokens } from 'marked'
import { fillFacts } from '../i18n/facts'
import { ARTICLE_LANGS, type Lang } from '../i18n/config'
import { ARTICLE_SLUGS, type ArticleKey } from '../i18n/slugs'
import { latest } from '../lib/site'
import { PRICES_UPDATED } from '../lib/packages'

export type Article = {
  key: ArticleKey
  lang: Lang
  slug: string
  title: string
  description: string
  date: string
  updated: string
  tags: string[]
  takeaways: string[]
  sources: { title: string; url: string }[]
  html: string
  toc: { id: string; text: string }[]
  faq: { question: string; answer: string }[]
  words: number
  minutes: number
}

const DIR = path.join(process.cwd(), 'content', 'articles')

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const stripMd = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '')

/** Frontmatter sederhana: `kunci: nilai` dan daftar `- butir` di bawah `kunci:`. */
function parseFrontmatter(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) throw new Error('Frontmatter tidak ditemukan')
  const data: Record<string, string | string[]> = {}
  let listKey: string | null = null
  for (const line of m[1].split(/\r?\n/)) {
    if (/^- /.test(line) && listKey) {
      ;(data[listKey] as string[]).push(line.slice(2).trim())
      continue
    }
    const kv = line.match(/^([a-z]+):\s*(.*)$/)
    if (!kv) continue
    if (kv[2] === '') {
      listKey = kv[1]
      data[listKey] = []
    } else {
      listKey = null
      data[kv[1]] = kv[2].trim()
    }
  }
  return { data, body: m[2] }
}

const fill = fillFacts

const FAQ_HEADING = /^(pertanyaan yang sering diajukan|frequently asked questions)$/i

function render(lang: Lang, body: string) {
  const md = new Marked({ gfm: true })
  const tableLabel = lang === 'id' ? 'Tabel, geser untuk melihat semua kolom' : 'Table, scroll to see every column'
  md.use({
    renderer: {
      heading({ tokens, depth, text }) {
        return `<h${depth} id="${slugify(stripMd(text))}">${this.parser.parseInline(tokens)}</h${depth}>\n`
      },
      link({ href, title, tokens }) {
        const ext = /^https?:\/\//.test(href)
        const t = title ? ` title="${title}"` : ''
        return `<a href="${href}"${t}${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${this.parser.parseInline(tokens)}</a>`
      },
    },
  })
  const tokens = md.lexer(body)
  const toc = tokens
    .filter((t): t is Tokens.Heading => t.type === 'heading' && (t as Tokens.Heading).depth === 2)
    .map((h) => ({ id: slugify(stripMd(h.text)), text: stripMd(h.text) }))

  // FAQ: H3 di bawah H2 "Pertanyaan yang sering diajukan", jawabannya paragraf sesudahnya.
  const faq: { question: string; answer: string }[] = []
  let inFaq = false
  for (const t of tokens as Token[]) {
    if (t.type === 'heading') {
      const h = t as Tokens.Heading
      if (h.depth === 2) inFaq = FAQ_HEADING.test(stripMd(h.text))
      else if (inFaq && h.depth === 3) faq.push({ question: stripMd(h.text), answer: '' })
    } else if (inFaq && t.type === 'paragraph' && faq.length) {
      const last = faq[faq.length - 1]
      last.answer = [last.answer, stripMd((t as Tokens.Paragraph).text)].filter(Boolean).join(' ')
    }
  }

  const html = (md.parser(tokens) as string)
    .replace(/<table>/g, `<div class="table-wrap" role="region" tabindex="0" aria-label="${tableLabel}"><table>`)
    .replace(/<\/table>/g, '</table></div>')
  return { html, toc, faq }
}

const PRICE_MARKER = /\{\{(from|price|max|duration|pricetable|renewal)\b/

function load(lang: Lang, key: ArticleKey): Article {
  const slug = (ARTICLE_SLUGS[key] as Partial<Record<Lang, string>>)[lang]
  if (!slug) throw new Error(`Artikel ${key} tidak ada dalam ${lang}`)
  const raw = fs.readFileSync(path.join(DIR, lang, `${slug}.md`), 'utf8')
  const { data, body } = parseFrontmatter(raw)
  if (data.key !== key) throw new Error(`Kunci frontmatter ${String(data.key)} ≠ ${key} (${lang}/${slug})`)
  const filled = fill(lang, body)
  const { html, toc, faq } = render(lang, filled)
  const words = stripMd(filled).split(/\s+/).filter(Boolean).length
  const list = (k: string) => ((data[k] as string[] | undefined) ?? []).map((s) => fill(lang, s))
  return {
    key,
    lang,
    slug,
    title: fill(lang, String(data.title)),
    description: fill(lang, String(data.description)),
    date: String(data.date),
    // artikel yang memuat angka paket ({{from:…}} dst.) ikut berubah saat harga berubah
    updated: PRICE_MARKER.test(raw) ? latest(String(data.updated ?? data.date), PRICES_UPDATED) : String(data.updated ?? data.date),
    tags: String(data.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    takeaways: list('takeaways'),
    sources: ((data.sources as string[] | undefined) ?? []).map((s) => {
      const [title, url] = s.split(' | ')
      return { title: title.trim(), url: url.trim() }
    }),
    html,
    toc,
    faq,
    words,
    minutes: Math.max(1, Math.round(words / 200)),
  }
}

const cache = new Map<string, Article>()

export function getArticle(lang: Lang, key: ArticleKey): Article {
  const id = `${lang}:${key}`
  if (!cache.has(id)) cache.set(id, load(lang, key))
  return cache.get(id)!
}

/** Semua artikel dalam satu bahasa, terbaru dulu. */
export function articlesIn(lang: Lang): Article[] {
  if (!ARTICLE_LANGS.includes(lang)) return []
  return (Object.keys(ARTICLE_SLUGS) as ArticleKey[])
    .filter((k) => (ARTICLE_SLUGS[k] as Partial<Record<Lang, string>>)[lang])
    .map((k) => getArticle(lang, k))
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title))
}
