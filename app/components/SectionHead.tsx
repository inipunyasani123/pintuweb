import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  id?: string
  tone?: 'light' | 'dark'
  /** rata tengah (untuk bagian penutup / yang berdiri sendiri) */
  center?: boolean
}

// Kepala bagian: label kecil, judul semibold, satu paragraf pengantar. Ukuran judul mengalir (clamp) dari 28px di
// ponsel 390px sampai 44px di desktop, jadi judul kalimat panjang tidak memakan empat baris di ponsel.
// Jarak ke isi bagian diatur pemanggil (mt-8 di ponsel, lebih lapang di desktop).
export default function SectionHead({ eyebrow, title, lead, id, tone = 'light', center = false }: Props) {
  const dark = tone === 'dark'
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`kicker ${dark ? 'text-[color:var(--accent-200)]' : 'text-[color:var(--primary-700)]'}`}>{eyebrow}</p>
      <h2 id={id} className={`mt-2 text-[clamp(1.75rem,1.25rem+2vw,2.75rem)] leading-[1.12] sm:mt-3 ${dark ? 'text-white' : 'text-[color:var(--text-primary)]'}`}>
        {title}
      </h2>
      {lead && (
        <p className={`mt-3 text-base leading-[1.55] sm:mt-5 sm:text-lg sm:leading-relaxed ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'} ${dark ? 'text-white/75' : 'text-[color:var(--text-tertiary)]'}`}>
          {lead}
        </p>
      )}
    </div>
  )
}
