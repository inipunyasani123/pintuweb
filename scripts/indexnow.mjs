// Kirim semua URL di sitemap live ke IndexNow (Bing, Yandex, Naver, Seznam, dll.) setelah deploy.
// Jalankan: node scripts/indexnow.mjs   (butuh Node 18+; kunci publik ada di public/<kunci>.txt)
import fs from 'node:fs'

const SITE = 'https://www.pintuweb.id'
const KEY = fs.readFileSync(new URL('../app/lib/indexnow.ts', import.meta.url), 'utf8').match(/'([0-9a-f]{32})'/)[1]

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
})
console.log(`IndexNow: ${urls.length} URL dikirim -> HTTP ${res.status} ${res.statusText}`)
