import { plain } from '../i18n/config'
import Link from 'next/link'
import type { Hl } from '../i18n/dict/id'

/**
 * Judul berpola [biasa, sorotan, sisa?]. Default polos (satu warna); 'italic' memberi sorotan
 * warna (di judul tampil tegak, lihat globals.css) — dipakai hemat: hero, pembuka halaman, footer.
 */
export function HlText({ parts, mode = 'plain', tone = 'ink' }: { parts: Hl; mode?: 'plain' | 'italic'; tone?: 'ink' | 'primary' | 'accent' }) {
  if (mode === 'plain') return <>{parts.join('')}</>
  const color = tone === 'accent' ? 'text-[color:var(--accent-300)]' : tone === 'primary' ? 'text-[color:var(--primary-700)]' : ''
  return (
    <>
      {parts[0]}
      <em className={color}>{parts[1]}</em>
      {parts[2] ?? ''}
    </>
  )
}

/** Data terstruktur JSON-LD. "<" ditulis sebagai \u003c (tetap JSON yang sama) supaya teks berisi "</script>" tidak bisa menutup tag. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: plain(JSON.stringify(data)).replace(/</g, '\\u003c') }} />
}

/**
 * Jejak navigasi yang terlihat (pasangan BreadcrumbList di JSON-LD). Butir pertama (Beranda) tidak di-prefetch:
 * tautannya tampil di setiap halaman dalam, padahal jarang diklik dan RSC beranda paling besar.
 * Tautannya -my-1 py-1: bidang sentuh 24px (WCAG 2.5.8) tanpa menggeser tata letak teks 12px-nya.
 */
export function Breadcrumbs({ items, label }: { items: { name: string; href?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className="mx-auto max-w-6xl px-4 pt-28 sm:px-6 sm:pt-32">
      <ol className="mono flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.04em] text-[color:var(--text-tertiary)]">
        {items.map((it, i) => (
          <li key={it.name} className="inline-flex min-w-0 max-w-full items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-[color:var(--neutral-400)]">/</span>}
            {it.href ? (
              <Link href={it.href} prefetch={i === 0 ? false : undefined} className="-my-1 py-1 underline-offset-4 hover:text-[color:var(--primary-700)] hover:underline">{it.name}</Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 text-[color:var(--text-primary)]">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
