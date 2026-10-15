// Halaman 404. Metadata di sini menimpa milik layout: judul netral (bahasa belum diketahui di server) dan noindex
// (layout menulis "index, follow"). Isinya komponen klien yang membaca bahasa dari URL.
import type { Metadata } from 'next'
import NotFoundBody from '../components/NotFoundBody'

export const metadata: Metadata = { title: { absolute: '404 · PintuWeb' }, robots: { index: false, follow: true } }

export default function NotFound() {
  return <NotFoundBody />
}
