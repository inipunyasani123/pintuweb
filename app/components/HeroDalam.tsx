'use client'
// Pemuat kecil efek kedalaman gambar utama hero (tiga/kedalaman.ts, tanpa Three.js). Dipasang setelah halaman menganggur;
// bila perangkatnya tak layak, kanvas ini tak terlihat dan <img> gambar utamanya tampil seperti biasa.
import { usePakai3D } from './tiga/pakai3D'

export default function HeroDalam() {
  const ref = usePakai3D(() => import('./tiga/kedalaman').then((m) => m.pasangKedalaman))
  return <canvas ref={ref} className="hero-dalam" aria-hidden="true" />
}
