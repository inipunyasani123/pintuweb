import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react'
import PageHero from '../../components/PageHero'
import { Breadcrumbs, HlText, JsonLd } from '../../components/Bits'
import { LogoMark } from '../../components/Logo'
import { PAY_ART } from '../../components/PaySteps'
import { BankMark, PayLogo, PayLogoRow } from '../../components/PaymentLogos'
import { paymentText } from '../../content/payment'
import { faqJsonLd } from '../../content/faq'
import { paySample } from '../../i18n/facts'
import { LANG_INFO, getDict, getPages, isLang, type Lang } from '../../i18n'
import { hasPage, path, urlOf } from '../../i18n/routes'
import { pageGraph, pageMeta } from '../../i18n/seo'
import { FACTS_UPDATED, wa } from '../../lib/site'
import type { PaymentMethod } from '../../lib/packages'

// Halaman "Cara Bayar & Metode Pembayaran" (11 bahasa; teksnya di content/payment.ts). Susunan, dari atas:
// pembuka + deretan logo metode, tiga langkah (batang 50/50 + langkah bergambar yang sama dengan halaman harga) di
// samping contoh invoice (angka contoh dari paket yang direkomendasikan di lib/packages.ts), bento lima metode, tanya
// jawab (H3, juga FAQPage JSON-LD), lalu ajakan ke paket & kontak. Tanpa JavaScript klien.
// Nomor rekening, tujuan DANA, dan jaringan/alamat dompet USDT SENGAJA tidak ada di sini: hanya di invoice.

type Params = { params: Promise<{ lang: string }> }

const resolve = (raw: string): Lang | null => (isLang(raw) && hasPage(raw, 'payment') ? raw : null)

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const lang = resolve((await params).lang)
  if (!lang) return {}
  const t = paymentText(lang)
  return pageMeta({ lang, ref: { key: 'payment' }, title: t.title, description: t.description, ogTitle: t.ogTitle, ogDescription: t.ogDescription })
}

/** Petak bento tiap metode (desktop 12 kolom): QRIS tinggi di kiri, transfer bank lebar, DANA & SeaBank berdampingan, USDT selebar halaman. */
const TILE: Record<PaymentMethod, string> = {
  qris: 'col-span-2 lg:col-span-5 lg:row-span-2',
  bank: 'col-span-2 lg:col-span-7',
  dana: 'col-span-1 lg:col-span-4',
  seabank: 'col-span-1 lg:col-span-3',
  usdt: 'col-span-2 lg:col-span-12',
}

export default async function PaymentPage({ params }: Params) {
  const lang = resolve((await params).lang)
  if (!lang) notFound()
  const d = getDict(lang)
  const pr = getPages(lang).pricing
  const t = paymentText(lang)
  const sample = paySample(lang)
  const ref = { key: 'payment' as const }
  const bank = t.methods.bank.name
  const share = [d.process.pay.deposit, d.process.pay.final]

  const card = 'rounded-[1.25rem] bg-white ring-1 ring-[color:var(--border-light)]'

  return (
    <main id="main-content">
      <Breadcrumbs label={d.common.breadcrumb} items={[{ name: d.common.home, href: path(lang, 'home') }, { name: t.crumb }]} />
      <PageHero tight eyebrow={t.eyebrow} title={<HlText parts={t.h1} mode="italic" tone="primary" />} lead={t.lead}>
        <div className={`mt-1 inline-flex max-w-full px-4 py-3.5 shadow-[0_18px_34px_-28px_rgb(38_70_156/0.55)] sm:px-6 sm:py-4 ${card}`}>
          <PayLogoRow size={24} bankLabel={bank} label={t.stripLabel} />
        </div>
      </PageHero>

      {/* Tiga langkah + contoh invoice */}
      <section aria-labelledby="steps-title" className="section-y mt-8 bg-[color:var(--surface-soft)] sm:mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{t.stepsKicker}</p>
          <h2 id="steps-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
            {t.stepsTitle}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 lg:grid-cols-12 lg:gap-5">
            <div className={`flex flex-col p-5 sm:p-7 lg:col-span-7 ${card}`}>
              {/* batang bayar: separuh di awal, separuh setelah disetujui (teksnya juga ada di langkah di bawahnya) */}
              <div className="flex gap-1.5" aria-hidden="true">
                {share.map(([head, sub], i) => (
                  <div
                    key={head}
                    className={`flex-1 px-4 py-2.5 sm:py-3 ${i === 0 ? 'rounded-s-full bg-[color:var(--primary-700)] text-white' : 'rounded-e-full bg-[color:var(--primary-50)] text-[color:var(--primary-800)] ring-1 ring-inset ring-[color:var(--primary-100)]'}`}
                  >
                    <span className="block text-[0.9375rem] font-semibold leading-tight sm:text-base">{head}</span>
                    <span className={`block text-[0.75rem] leading-snug sm:text-[0.8125rem] ${i === 0 ? 'text-white/85' : 'text-[color:var(--primary-800)]'}`}>{sub}</span>
                  </div>
                ))}
              </div>

              {/* tiga baris sama tinggi yang mengisi kartu, jadi tingginya sejajar dengan panel invoice di sebelahnya */}
              <ol className="mt-3 grid flex-1 grid-rows-3 sm:mt-4">
                {pr.paySteps.map((s, i) => (
                  <li key={s.title} className="flex items-center gap-4 border-t border-[color:var(--rule)] py-3.5 first:border-t-0 sm:gap-5 sm:py-4">
                    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 shrink-0 text-[color:var(--primary-700)] sm:h-14 sm:w-14" aria-hidden="true" focusable="false">
                      {PAY_ART[i]}
                    </svg>
                    <div className="min-w-0">
                      <h3 className="flex items-baseline gap-2 text-[1.125rem] leading-snug text-[color:var(--text-primary)]">
                        <span className="tnum text-[0.875rem] font-semibold text-[color:var(--primary-700)]" aria-hidden="true">
                          {i + 1}
                        </span>
                        {s.title}
                      </h3>
                      <p className="mt-0.5 text-[0.9375rem] leading-snug text-[color:var(--text-tertiary)]">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Invoice dulu: panel biru + contoh invoice (angka dari paket yang direkomendasikan, ditandai "Contoh") */}
            <div className="rounded-[1.25rem] bg-[linear-gradient(150deg,var(--primary-600),var(--primary-800)_70%)] p-5 text-white sm:p-7 lg:col-span-5">
              <p className="kicker text-[color:var(--accent-200)]">{t.invoice.kicker}</p>
              <h3 className="mt-1.5 text-[1.375rem] leading-tight sm:text-[1.5rem]">{t.invoice.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/85">{t.invoice.body}</p>

              <div className="mt-5 rounded-2xl bg-white p-4 text-[color:var(--text-primary)] shadow-[0_24px_40px_-24px_rgb(0_0_0/0.55)] sm:p-5">
                <div className="flex items-center justify-between gap-3 border-b border-dashed border-[color:var(--primary-200)] pb-3">
                  <span className="flex items-center gap-2">
                    <LogoMark className="h-6 w-auto" />
                    <span className="font-semibold leading-none">{t.mock.head}</span>
                  </span>
                  <span className="rounded-full bg-[color:var(--primary-50)] px-2.5 py-1 text-[0.75rem] font-semibold leading-none text-[color:var(--primary-800)]">{t.mock.sample}</span>
                </div>
                <dl className="mt-3 space-y-2 text-[0.875rem] leading-snug">
                  {[
                    { k: t.mock.pkg, v: sample.title },
                    { k: t.mock.price, v: sample.price },
                    { k: t.mock.dp, v: sample.deposit, strong: true },
                    { k: t.mock.rest, v: sample.rest },
                  ].map((r) => (
                    <div key={r.k} className={`flex items-baseline justify-between gap-4 ${r.strong ? '-mx-2 rounded-lg bg-[color:var(--primary-50)] px-2 py-1.5' : ''}`}>
                      <dt className="text-[color:var(--text-tertiary)]">{r.k}</dt>
                      <dd className={`text-end ${r.strong ? 'font-semibold text-[color:var(--primary-800)]' : 'font-medium'}`}>{r.v}</dd>
                    </div>
                  ))}
                  <div className="border-t border-[color:var(--rule)] pt-2.5">
                    <dt className="text-[color:var(--text-tertiary)]">{t.mock.to}</dt>
                    <dd className="mt-1 flex items-center gap-2 font-medium text-[color:var(--text-secondary)]">
                      <span className="inline-flex gap-1" aria-hidden="true">
                        {PAY_DOTS}
                      </span>
                      {t.mock.toValue}
                    </dd>
                  </div>
                </dl>
              </div>

              <p className="mt-4 flex items-start gap-2 text-[0.875rem] leading-snug text-white/90">
                <ShieldCheck size={17} className="mt-px shrink-0 text-[color:var(--accent-200)]" aria-hidden="true" />
                {t.invoice.caution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lima metode: bento */}
      <section aria-labelledby="methods-title" className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="kicker text-[color:var(--primary-700)]">{t.methodsKicker}</p>
          <h2 id="methods-title" className="mt-2 text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-[2.25rem]">
            {t.methodsTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-[color:var(--text-tertiary)]">{t.methodsLead}</p>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-12 lg:gap-5">
            {(Object.keys(TILE) as PaymentMethod[]).map((m) => {
              const tx = t.methods[m]
              const tall = m === 'qris'
              const wide = m === 'usdt' || m === 'bank'
              return (
                <li key={m} className={`${TILE[m]} flex flex-col p-4 sm:p-6 ${card} ${wide ? 'sm:flex-row sm:items-center sm:gap-6' : ''} ${m === 'usdt' ? 'lg:gap-10' : ''}`}>
                  {/* bidang lembut + keping putih berisi logo (warna asli merek di atas putih); QRIS diberi tanda sudut seperti
                      bingkai pindai */}
                  <div
                    className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-soft)] ${tall ? 'h-36 sm:h-40 lg:h-auto lg:min-h-[13rem] lg:flex-1' : 'h-20 sm:h-24'} ${wide ? 'sm:w-52' : ''}`}
                  >
                    {tall && <ScanCorners />}
                    <span className={`flex items-center rounded-xl bg-white shadow-[0_10px_24px_-18px_rgb(15_29_58/0.45)] ${tall ? 'px-5 py-4' : 'px-3.5 py-2.5'}`}>
                      {m === 'bank' ? <BankMark className="h-9 w-9 text-[color:var(--primary-700)] sm:h-10 sm:w-10" /> : <PayLogo m={m} size={tall ? 40 : 28} bankLabel={bank} />}
                    </span>
                  </div>
                  <div className={`min-w-0 ${tall ? 'mt-4 sm:mt-5' : wide ? 'mt-3.5 sm:mt-0 sm:flex-1' : 'mt-3.5'}`}>
                    <h3 className="flex flex-wrap items-center gap-x-2 text-[1.125rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.25rem]">
                      {m === 'usdt' && <Globe size={18} className="shrink-0 text-[color:var(--primary-700)]" aria-hidden="true" />}
                      {tx.name}
                    </h3>
                    <p className="mt-1 text-[0.875rem] leading-snug text-[color:var(--text-tertiary)] sm:text-[0.9375rem] sm:leading-relaxed">{tx.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Tanya jawab + ajakan */}
      <section aria-labelledby="pay-faq-title" className="section-y bg-[color:var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="pay-faq-title" className="text-[1.75rem] leading-tight text-[color:var(--text-primary)] sm:text-[2.25rem]">
            {t.faqTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2">
            {t.faq.map((f) => (
              <div key={f.q} className={`p-5 sm:p-6 ${card}`}>
                <h3 className="text-[1.0625rem] leading-snug text-[color:var(--text-primary)] sm:text-[1.125rem]">{f.q}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[color:var(--text-tertiary)]">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-5">
            {/* teks mengalir (bukan inline-flex): bila turun baris di ponsel, panahnya tetap menempel di akhir kalimat */}
            <Link href={`${path(lang, 'terms')}#pembayaran`} className="link text-[0.9375rem] font-semibold">
              {t.termsLink}
              <ArrowRight size={15} className="arw ms-1.5 inline align-[-2px]" aria-hidden="true" />
            </Link>
          </p>

          <div className={`mt-10 grid grid-cols-1 gap-5 p-5 sm:mt-14 sm:p-8 lg:grid-cols-12 lg:items-center ${card}`}>
            <div className="lg:col-span-6">
              <h2 className="text-[1.5rem] leading-tight text-[color:var(--text-primary)] sm:text-[1.875rem]">{t.ctaTitle}</h2>
              <p className="mt-2 leading-relaxed text-[color:var(--text-tertiary)]">{t.ctaLead}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-6 lg:justify-end">
              <Link href={path(lang, 'pricing')} className="btn btn-solid">
                {t.ctaPricing} <ArrowRight size={17} className="arw" aria-hidden="true" />
              </Link>
              <Link href={path(lang, 'contact')} className="btn btn-line">
                {t.ctaContact}
              </Link>
              <a href={wa(t.waText)} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                {d.common.consultFree} <ArrowUpRight size={17} className="arw arw-ne" aria-hidden="true" />
                <span className="sr-only">{d.common.newTabShort}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={faqJsonLd(t.faq.map((f) => ({ question: f.q, answer: f.a })), LANG_INFO[lang].htmlLang)} />
      <JsonLd
        data={pageGraph({
          lang,
          ref,
          name: t.title,
          description: t.description,
          crumbs: [
            { name: d.common.home, url: urlOf(lang, { key: 'home' }) },
            { name: t.crumb, url: urlOf(lang, ref) },
          ],
          dates: { modified: FACTS_UPDATED },
        })}
      />
    </main>
  )
}

/** Titik samaran di contoh invoice: tujuan pembayaran yang sebenarnya hanya ada di invoice asli. */
const PAY_DOTS = [0, 1, 2, 3].map((k) => <span key={k} className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary-300)]" />)

/** Tanda sudut seperti bingkai pindai kode QR (hiasan petak QRIS). */
function ScanCorners() {
  const c = 'absolute h-6 w-6 border-[color:var(--primary-300)]'
  return (
    <span aria-hidden="true">
      <span className={`${c} start-4 top-4 rounded-ss-lg border-s-2 border-t-2`} />
      <span className={`${c} end-4 top-4 rounded-se-lg border-e-2 border-t-2`} />
      <span className={`${c} bottom-4 start-4 rounded-es-lg border-b-2 border-s-2`} />
      <span className={`${c} bottom-4 end-4 rounded-ee-lg border-b-2 border-e-2`} />
    </span>
  )
}
