'use client'

import { useEffect } from 'react'

// Datang lewat #jangkar ke kartu yang isinya dilipat (<details>, mis. proyek klien di halaman Tentang): buka isinya
// supaya pengunjung langsung melihat yang ia klik. Saat dimuat dan saat hash berubah; tidak menampilkan apa pun.
export default function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(location.hash.slice(1))
      const el = id ? document.getElementById(id) : null
      const more = el?.querySelector('details')
      if (more) more.open = true
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])
  return null
}
