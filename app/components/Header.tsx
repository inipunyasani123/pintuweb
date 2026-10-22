// Navbar: pembungkus server untuk HeaderBar (komponen klien). Di sini daftar layanan untuk menu "Layanan" dirakit
// dalam bahasa pengunjung (nama, ringkasan, harga mulai dari lib/packages.ts lewat serviceFrom), lalu dikirim sebagai
// string saja, jadi isi layanan 11 bahasa tidak ikut terkirim ke browser. Props-nya sama dengan HeaderBar tanpa
// data layanan, sehingga layout cukup memanggil <Header … />.
import { SERVICES, serviceText } from '../content/services'
import { serviceFrom } from '../content/service-utils'
import { getDict } from '../i18n'
import { path, pathOf } from '../i18n/routes'
import HeaderBar, { type HeaderProps, type ServiceLink } from './HeaderBar'

export type { HeaderProps }

export default function Header(props: HeaderProps) {
  const { lang } = props
  const d = getDict(lang)
  const services: ServiceLink[] = SERVICES.map((s) => {
    const text = serviceText(s, lang)
    const from = serviceFrom(lang, s)
    return {
      key: s.key,
      name: text.name,
      short: text.short,
      // "IDR 300,000": kode mata uang tidak boleh terpisah baris dari angkanya
      // semua paket layanan tanpa angka: kalimatnya saja ("Sesuai kebutuhan"), tanpa kata "mulai"
      from: from ? (from.quote ? from.price : `${d.common.from} ${from.price.replace('IDR ', 'IDR ')}`) : undefined,
      href: pathOf(lang, { key: 'services', service: s.key }),
    }
  })
  return <HeaderBar {...props} services={services} servicesHref={path(lang, 'services')} servicesT={{ all: d.header.allServices, allLead: d.header.allServicesLead }} />
}
