'use client'
// Pemuat kecil trio 3D kartu "Demo pilihan" (adegannya di tiga/trio.ts). Bila perangkatnya tak layak, kanvas ini tak
// terlihat dan tak memuat apa pun: trio CSS (DeviceTrio.tsx) tetap tampil apa adanya.
import { usePakai3D } from './tiga/pakai3D'
import type { IsiTrio } from './tiga/trio'

export default function Trio3D(props: IsiTrio) {
  const ref = usePakai3D(() => import('./tiga/trio').then(({ pasangTrio3D }) => (kanvas, batal) => pasangTrio3D(kanvas, props, batal)))
  return <canvas ref={ref} className="trio-kanvas" />
}
