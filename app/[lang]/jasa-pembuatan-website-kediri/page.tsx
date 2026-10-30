// Halaman kota sekitar: Kediri (isi di content/cities.ts, tampilan di components/CityPage.tsx). Hanya id/en; bahasa lain notFound().
import CityPage, { cityMetadata } from '../../components/CityPage'

type Params = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Params) {
  return cityMetadata((await params).lang, 'cityKediri')
}

export default async function Page({ params }: Params) {
  return <CityPage rawLang={(await params).lang} page="cityKediri" />
}
