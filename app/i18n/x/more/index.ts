// Halaman layanan, kamus, dan proyek klien untuk bahasa tambahan (gelombang 2). Satu berkas per bahasa, terjemahan dari versi Inggris.
import type { Lang, XLang } from '../../config'
import type { More } from '../types'
import es from './es'
import fr from './fr'
import pt from './pt'
import ru from './ru'
import zh from './zh'
import hi from './hi'
import bn from './bn'
import ar from './ar'

export const MORE: Record<XLang, More> = { es, fr, pt, ru, zh, hi, bn, ar }

/** Isi layanan, kamus & proyek klien bahasa tambahan. Panggil hanya untuk bahasa di luar BASE_LANGS. */
export const more = (lang: Lang): More => {
  const m = (MORE as Record<string, More | undefined>)[lang]
  if (!m) throw new Error(`Bahasa ${lang} belum punya isi layanan & kamus di i18n/x/more/`)
  return m
}
