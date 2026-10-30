import { ArrowUpRight, Star } from 'lucide-react'
import { getDict } from '../i18n'
import type { Lang } from '../i18n/config'
import { GOOGLE_MAPS, GOOGLE_REVIEWS } from '../lib/site'

/**
 * Rating dari ulasan Google Bisnis PintuWeb. Tampil HANYA bila GOOGLE_REVIEWS (lib/site.ts) terisi dengan angka asli;
 * selama null komponen ini tidak menghasilkan apa-apa. Sengaja tanpa data terstruktur (AggregateRating/Review).
 */
export default function GoogleRating({ lang, className = '' }: { lang: Lang; className?: string }) {
  if (!GOOGLE_REVIEWS) return null
  const { rating, count } = GOOGLE_REVIEWS
  const t = getDict(lang).conv
  const shown = rating.toFixed(1)
  return (
    <div className={`mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 sm:px-6 ${className}`}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="flex gap-0.5 text-[color:var(--primary-700)]" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={18} fill={i <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={1.75} />
          ))}
        </span>
        <span className="sr-only">{t.ratingLabel}: {t.ratingStars(shown)}</span>
        <span aria-hidden="true" className="text-[1.0625rem] font-semibold text-[color:var(--text-primary)]"><bdi>{shown}</bdi></span>
        <span className="text-[0.9375rem] text-[color:var(--text-tertiary)]"><bdi>{t.reviews(count)}</bdi></span>
      </p>
      <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1 text-[0.9375rem] font-semibold">
        {t.seeReviews} <ArrowUpRight size={15} aria-hidden="true" />
        <span className="sr-only">{getDict(lang).common.newTabShort}</span>
      </a>
    </div>
  )
}
