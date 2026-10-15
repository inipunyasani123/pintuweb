'use client'

import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { ArrowUpRight, Check, ChevronDown, Copy, Mail } from 'lucide-react'
import { LogoMark } from '../../components/Logo'
import { copyText } from '../../components/CopyLink'
import type { Hl } from '../../i18n/dict/id'

type Form = { nama: string; usaha: string; paket: string; demo: string; pesan: string }
const EMPTY: Form = { nama: '', usaha: '', paket: '', demo: '', pesan: '' }

export type ContactText = {
  badge: string
  h1: Hl
  lead: string
  name: string
  business: string
  optional: string
  pkg: string
  pkgUnsure: string
  demo: string
  demoPh: string
  message: string
  messagePh: string
  errName: string
  errMessage: string
  sendWa: string
  sendEmail: string
  privacy: string
  infoAria: string
  infoWa: string
  infoEmail: string
  infoLocation: string
  infoHours: string
  msgIntro: string
  msgName: string
  msgBusiness: string
  msgPkg: string
  msgDemo: string
  subject: string
  formTitle: string
  previewTitle: string
  copy: string
  copied: string
  faqTitle: string
}

export type ContactPackage = { slug: string; title: string; from: string; duration: string; href: string }

type Props = {
  t: ContactText
  packages: ContactPackage[]
  /** nama demo untuk saran isian "demo yang kamu suka" */
  demos: string[]
  /** slug demo -> namanya dalam bahasa halaman, untuk isian awal dari ?demo=<slug> */
  demoBySlug: Record<string, string>
  waNumber: string
  email: string
  /** jam kerja, satu baris */
  hours: string
  /** kata "mulai" di depan harga */
  fromLabel: string
  /** teks tautan ke rincian paket */
  seePackage: string
  newTab: string
}

/**
 * Formulir kontak tanpa backend: isian di kiri, dan di kanan pratinjau pesan (gelembung obrolan) yang
 * tersusun saat diketik, lalu dikirim lewat WhatsApp atau email dari aplikasi pengunjung sendiri, atau disalin.
 */
export default function ContactForm({ t, packages, demos, demoBySlug, waNumber, email, hours, fromLabel, seePackage, newTab }: Props) {
  const [f, setF] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [copied, setCopied] = useState(false)
  const picked = packages.find((p) => p.title === f.paket)

  // Isian awal dari alamat: situs demo menaut ke /kontak?demo=<slug> (opsional &paket=<slug paket>). Dibaca dari
  // window.location setelah halaman terpasang (bukan useSearchParams, yang membuat halaman statis ini dirender di
  // klien). Nilai yang tidak dikenal diabaikan.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const slug = q.get('demo') ?? ''
    const demo = Object.prototype.hasOwnProperty.call(demoBySlug, slug) ? demoBySlug[slug] : ''
    const pkg = packages.find((p) => p.slug === q.get('paket'))
    if (!demo && !pkg) return
    setF((prev) => ({ ...prev, ...(demo ? { demo } : {}), ...(pkg ? { paket: pkg.title } : {}) }))
  }, [demoBySlug, packages])

  // Baris rincian pesan; baris opsional yang kosong tidak ikut terkirim.
  const details = [
    { label: t.msgName, value: f.nama.trim(), always: true },
    { label: t.msgBusiness, value: f.usaha.trim(), always: false },
    { label: t.msgPkg, value: f.paket || t.pkgUnsure, always: true },
    { label: t.msgDemo, value: f.demo.trim(), always: false },
  ].filter((d) => d.always || d.value)

  const compose = () => `${t.msgIntro}\n\n${details.map((d) => `${d.label}: ${d.value}`).join('\n')}\n\n${f.pesan.trim()}`

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }))
    // galat suatu isian hilang begitu isian itu diperbaiki, tidak menunggu tombol kirim ditekan lagi
    if (errors[k])
      setErrors((prev) => {
        const next = { ...prev }
        delete next[k]
        return next
      })
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!f.nama.trim()) e.nama = t.errName
    if (f.pesan.trim().length < 10) e.pesan = t.errMessage
    // flushSync: aria-invalid & aria-describedby sudah terpasang di DOM sebelum fokus berpindah, jadi pembaca layar
    // langsung membacakan galatnya saat isian itu difokus
    flushSync(() => setErrors(e))
    // bawa pengunjung ke isian pertama yang perlu diperbaiki
    const first = (Object.keys(e) as (keyof Form)[])[0]
    if (first) document.getElementById(first)?.focus()
    return !first
  }

  const sendWa = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(compose())}`, '_blank', 'noopener,noreferrer')
  }

  const sendEmail = () => {
    if (!validate()) return
    const subject = `${t.subject} — ${f.nama.trim()}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose())}`
  }

  const copy = async () => {
    if (!validate()) return
    if (!(await copyText(compose()))) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  const field =
    'mt-1.5 w-full rounded-xl border-0 bg-[color:var(--surface-soft)] px-4 text-base text-[color:var(--text-primary)] outline-none ring-1 ring-[color:var(--border-light)] transition-shadow placeholder:text-[color:var(--text-muted)] focus:bg-white focus:ring-2 focus:ring-[color:var(--primary-700)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[color:var(--error-600)]'
  const label = 'text-[0.875rem] font-semibold text-[color:var(--text-primary)]'
  const err = 'mt-1.5 text-sm font-medium text-[color:var(--error-700)]'
  const star = (
    <span aria-hidden="true" className="text-[color:var(--error-700)]">
      *
    </span>
  )
  // isian yang boleh dikosongkan ditandai di labelnya (bukan di placeholder, yang hilang begitu diketik)
  const opt = <span className="font-normal text-[color:var(--text-tertiary)]">· {t.optional}</span>
  // bagian pesan yang belum diisi
  const blank = <span className="text-white/75">…</span>

  return (
    <section aria-labelledby="form-title" className="mt-12 bg-[color:var(--surface-soft)] py-12 sm:mt-16 sm:py-16">
      <form onSubmit={sendWa} noValidate className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-x-8 gap-y-6 px-4 sm:px-6 lg:grid-cols-12">
        {/* Isian */}
        <div className="rounded-[1.5rem] bg-white p-6 ring-1 ring-[color:var(--border-light)] sm:p-8 lg:col-span-7">
          <h2 id="form-title" className="text-[1.5rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.75rem]">
            {t.formTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nama" className={label}>
                {t.name} {star}
              </label>
              <input id="nama" autoComplete="name" required value={f.nama} onChange={set('nama')} aria-invalid={!!errors.nama} aria-describedby={errors.nama ? 'nama-err' : undefined} className={`${field} h-12`} />
              {errors.nama && (
                <p id="nama-err" className={err}>
                  {errors.nama}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="usaha" className={label}>
                {t.business} {opt}
              </label>
              <input id="usaha" autoComplete="organization" value={f.usaha} onChange={set('usaha')} className={`${field} h-12`} />
            </div>
            <div>
              <label htmlFor="paket" className={label}>
                {t.pkg}
              </label>
              <div className="relative">
                <select id="paket" value={f.paket} onChange={set('paket')} aria-describedby={picked ? 'paket-info' : undefined} className={`${field} h-12 appearance-none pe-11`}>
                  <option value="">{t.pkgUnsure}</option>
                  {packages.map((p) => (
                    <option key={p.title} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute end-4 top-1/2 mt-[0.1875rem] -translate-y-1/2 text-[color:var(--text-muted)]" aria-hidden="true" />
              </div>
              {/* paket terpilih: harga mulai + lama pengerjaan dari lib/packages.ts; rinciannya dibuka di tab baru supaya isian tidak hilang */}
              {picked && (
                <p id="paket-info" className="mt-1.5 text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">
                  {fromLabel} {picked.from} · {picked.duration} ·{' '}
                  <a href={picked.href} target="_blank" rel="noopener" className="font-semibold text-[color:var(--primary-700)] underline-offset-4 hover:underline">
                    {seePackage}
                    <span className="sr-only"> {newTab}</span>
                  </a>
                </p>
              )}
            </div>
            <div>
              <label htmlFor="demo" className={label}>
                {t.demo} {opt}
              </label>
              <input id="demo" list="demo-saran" value={f.demo} onChange={set('demo')} className={`${field} h-12`} placeholder={t.demoPh} />
              <datalist id="demo-saran">
                {demos.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pesan" className={label}>
                {t.message} {star}
              </label>
              <textarea id="pesan" rows={5} required value={f.pesan} onChange={set('pesan')} aria-invalid={!!errors.pesan} aria-describedby={errors.pesan ? 'pesan-err' : undefined} className={`${field} min-h-[8.5rem] resize-y py-3 leading-relaxed`} placeholder={t.messagePh} />
              {errors.pesan && (
                <p id="pesan-err" className={err}>
                  {errors.pesan}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pratinjau pesan + kirim */}
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="rounded-[1.75rem] bg-white p-3 ring-1 ring-[color:var(--border-light)] sm:p-4">
            <div className="flex items-center gap-3 px-2 pb-3 pt-1">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--primary-50)] ring-1 ring-[color:var(--border-light)]" aria-hidden="true">
                <LogoMark className="h-5 w-auto" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold leading-tight text-[color:var(--text-primary)]">PintuWeb</span>
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[color:var(--text-tertiary)]">{hours}</span>
              </span>
            </div>

            <div className="rounded-[1.25rem] bg-[color:var(--surface-soft)] p-4">
              <h3 className="text-end text-[0.8125rem] font-normal text-[color:var(--text-tertiary)]">{t.previewTitle}</h3>
              <div className="ms-auto mt-2 w-fit max-w-[94%] break-words rounded-[1.125rem] rounded-ee-md bg-[color:var(--primary-700)] px-4 py-3 text-[0.9375rem] leading-relaxed text-white">
                <p>{t.msgIntro}</p>
                <p className="mt-3">
                  {details.map((d) => (
                    <span key={d.label} className="block">
                      {d.label}: {d.value || blank}
                    </span>
                  ))}
                </p>
                <p className="mt-3 whitespace-pre-line">{f.pesan.trim() || blank}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2.5 px-1 pb-1">
              <button type="submit" className="btn btn-solid w-full">
                {t.sendWa} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
              </button>
              <div className="grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2">
                <button type="button" onClick={sendEmail} className="btn btn-line btn-sm">
                  <Mail size={15} aria-hidden="true" /> {t.sendEmail}
                </button>
                <button type="button" onClick={copy} className="btn btn-line btn-sm">
                  {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                  <span aria-live="polite">{copied ? t.copied : t.copy}</span>
                </button>
              </div>
            </div>
          </div>
          <p className="mt-4 px-2 text-sm leading-relaxed text-[color:var(--text-tertiary)]">{t.privacy}</p>
        </div>
      </form>
    </section>
  )
}
