import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
  /** true bila ada jejak navigasi di atasnya (jarak atas lebih kecil) */
  tight?: boolean
  /** Catatan kecil di kolom tepi, mis. tanggal harga berlaku */
  aside?: ReactNode
}

/**
 * Pembuka halaman dalam: rata kiri seperti halaman judul majalah. Judul mengalir (clamp) dari ±34px di ponsel 390px
 * sampai 60px di desktop, sehingga judul panjang seperti "Jasa pembuatan landing page yang mengubah pengunjung jadi
 * pembeli." berhenti di empat baris pada ponsel. Jarak antarbaris lebih rapat di ponsel.
 */
export default function PageHero({ eyebrow, title, lead, children, tight = false, aside }: Props) {
  return (
    <section className={`mx-auto max-w-6xl px-4 sm:px-6 ${tight ? 'pt-6 sm:pt-10' : 'pt-28 sm:pt-36 lg:pt-40'}`}>
      <div className="grid grid-cols-1 gap-x-10 gap-y-4 pb-2 sm:gap-y-6 sm:pb-4 lg:grid-cols-12">
        <p className="kicker text-[color:var(--primary-700)] lg:col-span-12">{eyebrow}</p>
        <h1 className="-mt-1 text-[clamp(2.125rem,1.45rem+2.9vw,3.75rem)] leading-[1.07] text-[color:var(--text-primary)] sm:mt-0 lg:col-span-10">{title}</h1>
        {lead && <p className="max-w-2xl text-[1.0625rem] leading-[1.6] text-[color:var(--text-tertiary)] sm:text-lg sm:leading-relaxed lg:col-span-7 lg:text-[1.2rem]">{lead}</p>}
        {aside && <div className="kicker self-end text-[color:var(--text-tertiary)] lg:col-span-4 lg:col-start-9 lg:text-end">{aside}</div>}
        {children && <div className="lg:col-span-12">{children}</div>}
      </div>
    </section>
  )
}
