import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { ARTICLE_COVER, articleImage } from '../content/article-covers'
import type { Article } from '../content/articles'
import { CATEGORY_COLOR, alpha } from '../lib/portals'
import { LANG_INFO, type Lang } from '../i18n/config'
import { pathOf } from '../i18n/routes'
import type { ArticleKey } from '../i18n/slugs'

/** Warna sampul sebagai variabel CSS: --k warna kuat, --k2 ujung gradasi. */
export function coverVars(k: ArticleKey) {
  const c = CATEGORY_COLOR[ARTICLE_COVER[k].tone]
  return { vars: { '--k': c.color, '--k2': c.to } as CSSProperties, c }
}

const MARK_SIZE = { lg: 'text-[4.5rem] sm:text-[5.5rem]', md: 'text-[3.25rem]', sm: 'text-[1.375rem] sm:text-[3.25rem]' }

/**
 * Sampul artikel. Bila ada gambar di public/images/artikel/<kunci>.* gambar itu yang tampil; kalau tidak, sampul
 * tipografi: tanda singkat di atas cakram putih, di atas alas pastel. Di dalam elemen ber-kelas `group` sampulnya
 * bereaksi saat disorot (gambar sedikit membesar / alas jadi gradasi). Hiasan saja; pemanggil memasang --k/--k2.
 */
export function ArticleCover({ k, size = 'md', className = '', sizes = '(min-width: 1024px) 360px, 100vw', priority = false }: { k: ArticleKey; size?: keyof typeof MARK_SIZE; className?: string; sizes?: string; priority?: boolean }) {
  const { c } = coverVars(k)
  const img = articleImage(k)
  if (img) {
    return (
      <span className={`relative block overflow-hidden ${className}`} style={{ backgroundColor: c.tint }} aria-hidden="true">
        <Image src={img} alt="" fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </span>
    )
  }
  return (
    <span
      className={`relative grid place-items-center overflow-hidden [container-type:size] ${className}`}
      style={{ backgroundColor: c.tint, backgroundImage: `linear-gradient(135deg, ${c.tint} 10%, ${alpha(c.to, 0.26)})` }}
      aria-hidden="true"
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-500 [background-image:linear-gradient(135deg,var(--k),var(--k2))] group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="absolute aspect-square h-[min(78cqh,74cqw)] rounded-full bg-white/60 transition-colors duration-500 group-hover:bg-white/15 group-focus-visible:bg-white/15" />
      <span className={`display relative whitespace-nowrap font-semibold leading-none tracking-[-0.04em] text-[color:var(--k)] transition-colors duration-500 group-hover:text-white group-focus-visible:text-white ${MARK_SIZE[size]}`}>
        {ARTICLE_COVER[k].mark}
      </span>
    </span>
  )
}

const fmtDate = (lang: Lang, iso: string) => new Intl.DateTimeFormat(LANG_INFO[lang].intl, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))

type CardProps = {
  lang: Lang
  a: Article
  /** teks "N menit baca" */
  read: string
  /** 'lead' = kartu besar (sampul lebar, deskripsi); 'grid' = kartu biasa, di ponsel jadi baris ringkas */
  variant?: 'lead' | 'grid'
  /** tingkat judul, mengikuti letak kartu di halaman */
  as?: 'h2' | 'h3'
  /** true = sampulnya dimuat lebih dulu (kartu pertama di layar pembuka, biasanya elemen LCP) */
  priority?: boolean
}

export default function ArticleCard({ lang, a, read, variant = 'grid', as: H = 'h3', priority = false }: CardProps) {
  const lead = variant === 'lead'
  return (
    <Link
      href={pathOf(lang, { key: 'articles', article: a.key })}
      className={`group flex h-full rounded-[1.25rem] bg-white p-2 ring-1 ring-[color:var(--border-light)] transition-shadow duration-300 hover:shadow-[0_26px_46px_-32px_var(--k)] sm:rounded-[1.5rem] ${lead ? 'flex-col' : 'flex-row gap-1 sm:flex-col sm:gap-0'}`}
      style={coverVars(a.key).vars}
    >
      <ArticleCover
        k={a.key}
        size={lead ? 'lg' : 'sm'}
        sizes={lead ? '(min-width: 768px) 560px, 100vw' : '(min-width: 1024px) 360px, (min-width: 640px) 46vw, 120px'}
        priority={priority}
        className={lead ? 'aspect-[5/2] rounded-[0.95rem] sm:aspect-[2/1] sm:rounded-[1.125rem]' : 'aspect-square w-[5.75rem] shrink-0 rounded-[0.95rem] sm:aspect-[2/1] sm:w-auto sm:rounded-[1.125rem]'}
      />
      <span className={`flex min-w-0 flex-1 flex-col ${lead ? 'px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5' : 'px-3 py-1.5 sm:px-3 sm:pb-3 sm:pt-4'}`}>
        <span className="kicker text-[color:var(--k)]">{a.tags[0]}</span>
        <H className={`mt-1.5 leading-snug text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--k)] sm:mt-2 ${lead ? 'text-[1.375rem] sm:text-[1.625rem]' : 'text-[1.0625rem] sm:text-[1.25rem]'}`}>{a.title}</H>
        <span className={`mt-2 leading-relaxed text-[color:var(--text-tertiary)] ${lead ? 'text-[0.9375rem] sm:text-base' : 'hidden text-[0.9375rem] sm:line-clamp-3'}`}>{a.description}</span>
        <span className="mt-auto flex items-center justify-between gap-3 pt-2.5 text-[0.8125rem] text-[color:var(--text-tertiary)] sm:pt-4 sm:text-sm">
          <span>
            {read} · <time dateTime={a.updated}>{fmtDate(lang, a.updated)}</time>
          </span>
          <ArrowRight size={16} className="arw shrink-0 text-[color:var(--k)]" aria-hidden="true" />
        </span>
      </span>
    </Link>
  )
}
