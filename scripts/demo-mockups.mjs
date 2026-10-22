// Thumbnail galeri demo berupa mockup 3 perangkat (laptop + tablet + ponsel) dari situs demo yang live.
// Dipakai lewat demoThumb / demoSrcSet di app/lib/demos.ts (/demo, layanan, Tentang, halaman lokal).
//
// Pemakaian (dari akar PintuWeb, butuh Google Chrome di /Applications dan jaringan ke <repo>.pintuweb.id):
//   node scripts/demo-mockups.mjs capture [slug...]   tangkap 3 ukuran layar tiap demo ke folder tangkapan
//   node scripts/demo-mockups.mjs compose [slug...]   susun mockup → public/demos/<slug>.webp (720) + -360/-480/-1080
//   node scripts/demo-mockups.mjs all [slug...]       keduanya
//   node scripts/demo-mockups.mjs sheet <out.jpg> [slug...] [--cols 6] [--w 480]   lembar kontak thumbnail 720 (cek mata)
// Tanpa slug = semua demo di DEMOS. Pilihan:
//   --cache <dir>   folder tangkapan (bawaan: <tmp>/pintuweb-demo-mockups; boleh dihapus, bisa ditangkap ulang)
//   --port 9710     port Chrome remote debugging      --jobs 3   jumlah halaman yang ditangkap bersamaan
//   --proxy <url>   proxy untuk Chrome (mis. http://127.0.0.1:8899 bila IPv6 rumah bermasalah)
//   --out <dir>     folder keluaran compose/sheet (bawaan public/demos; pakai folder lain untuk mencoba)
//   --q 360:74,...  kualitas WebP per lebar (bawaan di QUALITY)
// Demo baru: tambahkan ke DEMOS, jalankan `node scripts/demo-mockups.mjs all <slug>`, lalu naikkan THUMB_V di
// app/lib/demos.ts. Menu digital menampilkan lencana buka/tutup menurut jam WIB: tangkap saat kedainya buka
// (Bakso Dalu 16.00–01.00), atau ulangi `capture <slug>` pada jamnya.
//
// Ukuran layar: laptop 1280×800, tablet 820×1180 (emulasi sentuh), ponsel 390×844 (emulasi seluler, DPR 2).
// Sebelum dipotret: tunggu load, document.fonts.ready, gambar di layar selesai, jeda 2,2 dtk, lalu sampai animasi masuk
// (CSS/WAAPI) selesai. CSS atau gambar yang gagal = dicoba ulang (maks. 3x); ringkasan ada di <cache>/report.json.
// Undangan sengaja dipotret dengan sampul tertutup (itulah tampilan pertamanya). Bilah "Situs demo buatan PintuWeb"
// (aside di akhir <body>) disembunyikan hanya bila ikut masuk layar yang dipotret.
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp')

const args = process.argv.slice(2)
const cmd = args[0]
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const flagVals = new Set(['--cache', '--port', '--jobs', '--proxy', '--out', '--cols', '--w', '--q'].flatMap((k) => { const i = args.indexOf(k); return i >= 0 ? [i, i + 1] : [] }))
const named = args.slice(1).filter((a, i) => !flagVals.has(i + 1) && !a.startsWith('--'))
const CACHE = path.resolve(opt('--cache', path.join(tmpdir(), 'pintuweb-demo-mockups')))
const PORT = +opt('--port', 9710)
const JOBS = +opt('--jobs', 3)
const PROXY = opt('--proxy', null)
const OUT = path.resolve(opt('--out', path.join(ROOT, 'public', 'demos')))

// DEMOS dibaca dari app/lib/demos.ts (cukup slug, url, kategori), supaya skrip tidak perlu kompilasi TypeScript.
function readDemos() {
  const src = readFileSync(path.join(ROOT, 'app/lib/demos.ts'), 'utf8')
  return [...src.matchAll(/\{ slug: "([^"]+)", name: "([^"]+)".*?category: '(\w+)', url: "([^"]+)"/g)].map((m) => ({ slug: m[1], name: m[2], category: m[3], url: m[4] }))
}
const ALL = readDemos()
const pick = () => {
  if (!named.length) return ALL
  const miss = named.filter((s) => !ALL.some((d) => d.slug === s))
  if (miss.length) { console.error('slug tidak dikenal:', miss.join(', ')); process.exit(1) }
  return ALL.filter((d) => named.includes(d.slug))
}

const DEVICES = {
  desktop: { w: 1280, h: 800, dpr: 1, mobile: false, touch: false },
  tablet: { w: 820, h: 1180, dpr: 1, mobile: true, touch: true },
  phone: { w: 390, h: 844, dpr: 2, mobile: true, touch: true },
}
const UA = {
  // UA ponsel/tablet supaya situs yang membaca UA (jarang) ikut versi seluler; Chrome tetap mesin yang sama.
  phone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  tablet: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
}
const shotPath = (slug, dev) => path.join(CACHE, `${slug}-${dev}.png`)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ───────────────────────────── 1. Tangkap ───────────────────────────── */

async function startChrome() {
  const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const profile = mkdtempSync(path.join(tmpdir(), 'mockup-chrome-'))
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio', '--no-first-run', '--no-default-browser-check',
    '--force-color-profile=srgb', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
    ...(PROXY ? [`--proxy-server=${PROXY}`] : []), 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  await new Promise((res, rej) => {
    let buf = ''
    chrome.stderr.on('data', (d) => { buf += d; if (/DevTools listening on/.test(buf)) res() })
    setTimeout(() => rej(new Error('Chrome tidak siap')), 20000)
  })
  const stop = async () => { chrome.kill(); await sleep(500); try { rmSync(profile, { recursive: true, force: true }) } catch {} }
  return { stop }
}

async function openTab() {
  const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(t.webSocketDebuggerUrl)
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j })
  let id = 0
  const pending = new Map()
  const listeners = new Set()
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) } else if (d.method) for (const l of listeners) l(d)
  }
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text)
    return r.result?.result?.value
  }
  const close = async () => { ws.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`).catch(() => {}) }
  return { send, evaluate, close, on: (f) => listeners.add(f), off: (f) => listeners.delete(f) }
}

// Menunggu semua <img> yang terlihat di layar selesai dimuat (atau gagal), plus gambar latar CSS yang sudah diminta.
const SETTLE = `(async () => {
  await document.fonts.ready
  const vh = innerHeight, t0 = Date.now()
  const visible = () => [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < vh && r.width > 0 && getComputedStyle(i).visibility !== 'hidden' })
  while (Date.now() - t0 < 10000 && visible().some((i) => !i.complete)) await new Promise((r) => setTimeout(r, 150))
  await Promise.all(visible().map((i) => (i.decode ? i.decode().catch(() => {}) : 0)))
  await document.fonts.ready
  // gagal dimuat, atau belum selesai setelah 10 dtk: keduanya dianggap rusak supaya halamannya ditangkap ulang
  return visible().filter((i) => !i.complete || i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).slice(-70)).slice(0, 3)
})()`
// Menunggu animasi CSS/WAAPI yang berhingga (fade/slide masuk) selesai, maks. 8 dtk; animasi tak berujung diabaikan.
const CALM = `(async () => {
  const t0 = Date.now()
  const busy = () => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getTiming?.().iterations !== Infinity && !a.timeline?.axis && !(a.timeline instanceof (window.ScrollTimeline || class {}))).length
  while (Date.now() - t0 < 8000 && busy()) await new Promise((r) => setTimeout(r, 150))
  await new Promise((r) => setTimeout(r, 400))
  return busy()
})()`
const INFO = `(() => {
  const bar = document.querySelector('aside[aria-label="Tentang situs demo ini"]')
  let barHidden = false
  if (bar && bar.getBoundingClientRect().top < innerHeight) { bar.style.display = 'none'; barHidden = true }
  // CSS yang gagal dimuat (jaringan) = halaman polos tanpa gaya: dicoba ulang
  const css = [...document.querySelectorAll('link[rel=stylesheet]')].every((l) => { try { return l.sheet && l.sheet.cssRules.length > 0 } catch { return true } })
  return { title: document.title, h1: (document.querySelector('h1')?.textContent || '').trim().slice(0, 60), text: document.body.innerText.trim().length, barHidden, css }
})()`

async function captureOne(demo, dev) {
  const D = DEVICES[dev]
  const tab = await openTab()
  try {
    await tab.send('Page.enable')
    await tab.send('Emulation.setDeviceMetricsOverride', { width: D.w, height: D.h, deviceScaleFactor: D.dpr, mobile: D.mobile, screenWidth: D.w, screenHeight: D.h })
    if (D.touch) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
    if (UA[dev]) await tab.send('Emulation.setUserAgentOverride', { userAgent: UA[dev], platform: dev === 'phone' ? 'iPhone' : 'iPad' })
    await tab.send('Emulation.setTimezoneOverride', { timezoneId: 'Asia/Jakarta' })
    await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] })
    let fired = false
    const onEv = (e) => { if (e.method === 'Page.loadEventFired') fired = true }
    tab.on(onEv)
    const nav = await tab.send('Page.navigate', { url: demo.url })
    if (nav.result?.errorText) throw new Error(nav.result.errorText)
    const t0 = Date.now()
    while (!fired && Date.now() - t0 < 30000) await sleep(100)
    tab.off(onEv)
    await tab.evaluate(SETTLE)
    await sleep(2200) // animasi masuk (fade/slide) berjalan
    await tab.evaluate(CALM)
    const broken = await tab.evaluate(SETTLE)
    const info = await tab.evaluate(INFO)
    await sleep(250)
    const shot = await tab.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: D.w, height: D.h, scale: 1 } })
    if (!shot.result?.data) throw new Error('screenshot kosong')
    writeFileSync(shotPath(demo.slug, dev), Buffer.from(shot.result.data, 'base64'))
    return { ...info, broken, loaded: fired }
  } finally {
    await tab.close()
  }
}

async function capture(list) {
  mkdirSync(CACHE, { recursive: true })
  const chrome = await startChrome()
  const jobs = list.flatMap((d) => Object.keys(DEVICES).map((dev) => ({ d, dev })))
  const report = []
  // Navigasi pertama Chrome headless kadang gagal (jaringan): pemanasan dulu.
  try { const w = await openTab(); await w.send('Page.navigate', { url: 'https://www.pintuweb.id/robots.txt' }); await sleep(2500); await w.close() } catch {}
  let next = 0
  const worker = async () => {
    while (next < jobs.length) {
      const { d, dev } = jobs[next++]
      let res, err
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          // batas 75 dtk per percobaan: halaman yang menggantung (font/gambar tak kunjung selesai) dicoba ulang
          res = await Promise.race([captureOne(d, dev), sleep(75000).then(() => { throw new Error('waktu habis') })])
          err = null
          if (res.text > 0 && res.css && !res.broken.length && !/404|not found|tidak ditemukan/i.test(res.title)) break
        } catch (e) { err = e }
        await sleep(1500 * attempt)
      }
      const line = { slug: d.slug, dev, ...(res || {}), error: err?.message }
      report.push(line)
      console.log(`${err ? 'GAGAL' : 'ok   '} ${d.slug.padEnd(18)} ${dev.padEnd(7)} ${err ? err.message : `${res.title.slice(0, 50)}${res.css ? '' : '  CSS GAGAL'}${res.barHidden ? '  [bilah demo disembunyikan]' : ''}${res.broken?.length ? '  GAMBAR RUSAK ' + res.broken.join(' ') : ''}`}`)
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, JOBS) }, worker))
  await chrome.stop()
  writeFileSync(path.join(CACHE, 'report.json'), JSON.stringify(report, null, 1))
  const bad = report.filter((r) => r.error || !r.text || !r.css || r.broken?.length)
  if (bad.length) console.log(`\nPerlu dicek: ${bad.map((r) => `${r.slug}/${r.dev}`).join(', ')}`)
}

/* ───────────────────────────── 2. Susun ───────────────────────────── */

// Kanvas rancangan 1440×756 (= rasio kartu 1200:630); semua angka di bawah dalam satuan kanvas ini lalu diskalakan.
const CW = 1440, CH = 756
const INK = '#adbcdc' // garis bingkai: biru keabuan lembut
const INK2 = '#d3dcee' // garis dalam / detail
const FONT = `-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif`
// Laptop di belakang (kiri), tablet di tengah, ponsel di depan (kanan); semuanya berdiri di satu garis lantai (y 704).
// Layar tablet 370×532 = rasio 820×1180; ponsel: bilah status 26 + isi 218×454 (390×812 bagian atas tangkapan).
const G = {
  laptop: { lid: { x: 84, y: 69, w: 868, h: 609, r: 26 }, bezel: { t: 15, s: 15, b: 30 }, bar: 40, deck: { x: 36, y: 678, w: 964, h: 26 } },
  tablet: { x: 872, y: 142, w: 400, h: 562, r: 34, bezel: 15 },
  phone: { x: 1166, y: 206, w: 236, h: 498, r: 40, bezel: 9, status: 26 },
}

const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${CW} ${CH}">${body}</svg>`)
const round = (n) => Math.round(n)
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// Tangkapan layar diperkecil ke ukuran layar perangkat (bagian atas, lebar penuh) lalu diberi sudut membulat.
async function screen(file, w, h, r) {
  const m = await sharp(file).metadata()
  const srcH = Math.min(m.height, round((m.width * h) / w))
  const buf = await sharp(file).extract({ left: 0, top: 0, width: m.width, height: srcH }).resize(w, h, { fit: 'cover', position: 'top', kernel: 'lanczos3' }).png().toBuffer()
  if (!r) return buf
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}"/></svg>`)
  return sharp(buf).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}
// Warna rata-rata baris teratas tangkapan ponsel: dipakai untuk bilah status, seperti Safari mewarnainya.
async function topColor(file) {
  const m = await sharp(file).metadata()
  const st = await sharp(file).extract({ left: 0, top: 0, width: m.width, height: 6 }).stats()
  const [r, g, b] = st.channels.slice(0, 3).map((c) => round(c.mean))
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return { fill: `rgb(${r},${g},${b})`, fg: lum > 0.6 ? '#111827' : '#ffffff' }
}

async function compose(demo, W) {
  const s = W / CW, H = round(CH * s)
  const sw = (n) => (Math.max(1, n * s) / s).toFixed(2) // tebal garis dalam satuan kanvas (min 1 px keluaran)
  const L = G.laptop, T = G.tablet, P = G.phone
  const scr = {
    laptop: { x: L.lid.x + L.bezel.s, y: L.lid.y + L.bezel.t, w: L.lid.w - 2 * L.bezel.s, h: L.lid.h - L.bezel.t - L.bezel.b, r: 8 },
    tablet: { x: T.x + T.bezel, y: T.y + T.bezel, w: T.w - 2 * T.bezel, h: T.h - 2 * T.bezel, r: T.r - T.bezel + 4 },
    phone: { x: P.x + P.bezel, y: P.y + P.bezel, w: P.w - 2 * P.bezel, h: P.h - 2 * P.bezel, r: P.r - P.bezel },
  }
  // kotak dalam piksel keluaran (dibulatkan dari kedua tepinya supaya tidak ada celah)
  const px = (o) => ({ x: round(o.x * s), y: round(o.y * s), w: round((o.x + o.w) * s) - round(o.x * s), h: round((o.y + o.h) * s) - round(o.y * s), r: (o.r || 0) * s })
  const rect = (o, extra = '') => `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}" ry="${o.r}" ${extra}/>`
  const layer = async (body) => ({ input: await sharp(svg(W, H, body)).png().toBuffer(), left: 0, top: 0 })
  const shadow = async (shape, blur, op, dy) => ({ input: await sharp(svg(W, H, `<g transform="translate(0 ${dy})" fill="#192f66" fill-opacity="${op}">${shape}</g>`)).blur(Math.max(0.5, blur * s)).png().toBuffer(), left: 0, top: 0 })
  const tint = TINT[demo.category] || '#e8f0ff'

  // latar: putih → biru sangat muda + cahaya lembut warna kategori di kanan atas
  const layers = [await layer(`<defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e7eefa"/></linearGradient>
      <radialGradient id="k" cx="0.84" cy="0.08" r="0.6"><stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="${tint}" stop-opacity="0"/></radialGradient>
    </defs><rect width="${CW}" height="${CH}" fill="url(#g)"/><rect width="${CW}" height="${CH}" fill="url(#k)"/>`)]

  // ── laptop: tutup + layar ber-bilah peramban (titik tiga + kolom alamat berisi domain demo) + alas tipis
  const lid = L.lid, dk = L.deck, ls = scr.laptop
  const deckPath = `M${dk.x} ${dk.y} H${dk.x + dk.w} V${dk.y + dk.h - 13} Q${dk.x + dk.w} ${dk.y + dk.h} ${dk.x + dk.w - 30} ${dk.y + dk.h} H${dk.x + 30} Q${dk.x} ${dk.y + dk.h} ${dk.x} ${dk.y + dk.h - 13} Z`
  layers.push(await shadow(`${rect(lid)}<path d="${deckPath}"/>`, 26, 0.16, 18))
  layers.push(await layer(rect(lid, `fill="#fff" stroke="${INK}" stroke-width="${sw(2.5)}"`)))
  const content = px({ x: ls.x, y: ls.y + L.bar, w: ls.w, h: ls.h - L.bar })
  layers.push({ input: await screen(shotPath(demo.slug, 'desktop'), content.w, content.h, 0), left: content.x, top: content.y })
  const bar = { x: ls.x, y: ls.y, w: ls.w, h: L.bar }, cy = bar.y + bar.h / 2
  const pill = { x: bar.x + bar.w * 0.28, y: cy - 12, w: bar.w * 0.44, h: 24, r: 12 }
  const host = new URL(demo.url).host
  const tw = host.length * 7.1 // perkiraan lebar teks 13px
  const lockX = pill.x + pill.w / 2 - tw / 2 - 14
  layers.push(await layer(`
      <path d="M${bar.x} ${bar.y + bar.h} V${bar.y + ls.r} Q${bar.x} ${bar.y} ${bar.x + ls.r} ${bar.y} H${bar.x + bar.w - ls.r} Q${bar.x + bar.w} ${bar.y} ${bar.x + bar.w} ${bar.y + ls.r} V${bar.y + bar.h} Z" fill="#f3f6fd"/>
      <line x1="${bar.x}" y1="${bar.y + bar.h}" x2="${bar.x + bar.w}" y2="${bar.y + bar.h}" stroke="${INK2}" stroke-width="${sw(1.5)}"/>
      ${['#f4a6a0', '#f5d08a', '#9fd8a8'].map((c, i) => `<circle cx="${bar.x + 24 + i * 19}" cy="${cy}" r="5.5" fill="${c}"/>`).join('')}
      ${rect(pill, `fill="#fff" stroke="${INK2}" stroke-width="${sw(1.5)}"`)}
      <g fill="none" stroke="#7d8bab" stroke-width="1.6"><rect x="${lockX}" y="${cy - 2}" width="9" height="7" rx="1.5" fill="#7d8bab" stroke="none"/><path d="M${lockX + 1.8} ${cy - 2} v-2.2 a2.7 2.7 0 0 1 5.4 0 v2.2"/></g>
      <text x="${pill.x + pill.w / 2 + 6}" y="${cy + 4.6}" text-anchor="middle" font-family="${FONT}" font-size="13" fill="#5d6b88">${esc(host)}</text>
      ${rect(ls, `fill="none" stroke="${INK2}" stroke-width="${sw(1.5)}"`)}
      <path d="${deckPath}" fill="#fff" stroke="${INK}" stroke-width="${sw(2.5)}"/>
      <path d="M${dk.x + dk.w / 2 - 80} ${dk.y} v5 q0 6 8 6 h144 q8 0 8 -6 v-5" fill="none" stroke="${INK2}" stroke-width="${sw(2)}"/>
      <circle cx="${lid.x + lid.w / 2}" cy="${lid.y + L.bezel.t / 2 + 0.5}" r="2.6" fill="${INK2}"/>`))

  // ── tablet
  const tsr = scr.tablet, ts = px(tsr)
  layers.push(await shadow(rect(T), 22, 0.18, 16))
  layers.push(await layer(rect(T, `fill="#fff" stroke="${INK}" stroke-width="${sw(2.5)}"`)))
  layers.push({ input: await screen(shotPath(demo.slug, 'tablet'), ts.w, ts.h, ts.r), left: ts.x, top: ts.y })
  layers.push(await layer(`${rect(tsr, `fill="none" stroke="${INK2}" stroke-width="${sw(1.5)}"`)}<circle cx="${T.x + T.w / 2}" cy="${T.y + T.bezel / 2 + 0.5}" r="2.6" fill="${INK2}"/>`))

  // ── ponsel (paling depan): bilah status berwarna atas halaman + pulau kamera, lalu isi halaman
  const psr = scr.phone, phoneShot = shotPath(demo.slug, 'phone')
  const top = await topColor(phoneShot)
  layers.push(await shadow(rect(P), 18, 0.22, 14))
  layers.push(await layer(`${rect(P, `fill="#fff" stroke="${INK}" stroke-width="${sw(2.5)}"`)}${rect(psr, `fill="${top.fill}"`)}`))
  const pc = px({ x: psr.x, y: psr.y + P.status, w: psr.w, h: psr.h - P.status })
  const pshot = await screen(phoneShot, pc.w, pc.h, 0)
  // sudut bawah isi mengikuti layar ponsel yang membulat
  const pm = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pc.w}" height="${pc.h}"><path d="M0 0 H${pc.w} V${pc.h - psr.r * s} Q${pc.w} ${pc.h} ${pc.w - psr.r * s} ${pc.h} H${psr.r * s} Q0 ${pc.h} 0 ${pc.h - psr.r * s} Z"/></svg>`)
  layers.push({ input: await sharp(pshot).composite([{ input: pm, blend: 'dest-in' }]).png().toBuffer(), left: pc.x, top: pc.y })
  const sy = psr.y + P.status / 2 + 2
  layers.push(await layer(`${rect(psr, `fill="none" stroke="${INK2}" stroke-width="${sw(1.5)}"`)}
      <rect x="${psr.x + psr.w / 2 - 30}" y="${psr.y + 5}" width="60" height="17" rx="8.5" fill="#111827"/>
      <text x="${psr.x + 30}" y="${sy + 3.6}" text-anchor="middle" font-family="${FONT}" font-weight="600" font-size="10" fill="${top.fg}">9:41</text>
      <g fill="${top.fg}"><rect x="${psr.x + psr.w - 44}" y="${sy - 3}" width="16" height="7.5" rx="2" fill="none" stroke="${top.fg}" stroke-width="1.1" opacity=".55"/><rect x="${psr.x + psr.w - 42.6}" y="${sy - 1.6}" width="11" height="4.7" rx="1"/>
        ${[0, 1, 2, 3].map((i) => `<rect x="${psr.x + psr.w - 66 + i * 4}" y="${sy + 3.5 - (i + 1) * 1.9}" width="2.6" height="${(i + 1) * 1.9 + 1}" rx=".6"/>`).join('')}</g>`))

  return sharp({ create: { width: W, height: H, channels: 4, background: '#ffffff' } }).composite(layers).flatten({ background: '#ffffff' })
}

// tint kategori (sama dengan CATEGORY_COLOR[...].tint di app/lib/portals.ts)
const TINT = Object.fromEntries([...readFileSync(path.join(ROOT, 'app/lib/portals.ts'), 'utf8').matchAll(/^\s+(\w+): \{ color: '[^']+', to: '[^']+', tint: '([^']+)' \}/gm)].map((m) => [m[1], m[2]]))

// Lebar keluaran: <slug>.webp (720, src cadangan) + varian srcset. Lihat demoSrcSet di app/lib/demos.ts.
const SIZES = [360, 480, 720, 1080]
const QUALITY = { 360: 74, 480: 74, 720: 76, 1080: 72, ...Object.fromEntries((opt('--q', '') || '').split(',').filter(Boolean).map((kv) => kv.split(':').map(Number))) }
const outName = (slug, w) => path.join(OUT, w === 720 ? `${slug}.webp` : `${slug}-${w}.webp`)

async function composeAll(list) {
  const miss = list.filter((d) => Object.keys(DEVICES).some((dev) => !existsSync(shotPath(d.slug, dev))))
  if (miss.length) { console.error(`belum ditangkap (jalankan capture dulu): ${miss.map((d) => d.slug).join(', ')}`); process.exit(1) }
  mkdirSync(OUT, { recursive: true })
  for (const d of list) {
    const sizes = []
    for (const w of SIZES) {
      const img = await compose(d, w)
      await img.webp({ quality: QUALITY[w], effort: 6, smartSubsample: true }).toFile(outName(d.slug, w))
      sizes.push(`${w}:${(statSync(outName(d.slug, w)).size / 1024).toFixed(0)}K`)
    }
    console.log(d.slug.padEnd(18), sizes.join('  '))
  }
}

/* ───────────────────────────── 3. Lembar kontak ───────────────────────────── */

// Semua thumbnail 720 (atau slug yang disebut) dalam satu kisi berlabel, untuk diperiksa mata sebelum di-commit.
async function sheet(file, list) {
  const cols = +opt('--cols', 6), w = +opt('--w', 480), h = round(w * CH / CW), lab = 26, gap = 12
  const rows = Math.ceil(list.length / cols)
  const W = cols * w + (cols + 1) * gap, H = rows * (h + lab + gap) + gap
  const tiles = []
  for (const [i, d] of list.entries()) {
    const x = gap + (i % cols) * (w + gap), y = gap + Math.floor(i / cols) * (h + lab + gap)
    tiles.push({ input: await sharp(outName(d.slug, 720)).resize(w).png().toBuffer(), left: x, top: y })
    tiles.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${lab}"><text x="2" y="18" font-family="${FONT}" font-size="15" fill="#1f2a44">${i + 1}. ${esc(d.slug)} · ${esc(d.category)}</text></svg>`), left: x, top: y + h })
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).composite(tiles).jpeg({ quality: 82 }).toFile(file)
  console.log(`${file} (${list.length} thumbnail, ${W}×${H})`)
}

if (cmd === 'capture' || cmd === 'all') await capture(pick())
if (cmd === 'compose' || cmd === 'all') await composeAll(pick())
if (cmd === 'sheet') await sheet(path.resolve(named[0] || 'demo-mockups-sheet.jpg'), named.length > 1 ? ALL.filter((d) => named.slice(1).includes(d.slug)) : ALL)
if (!['capture', 'compose', 'all', 'sheet'].includes(cmd)) console.log('pakai: node scripts/demo-mockups.mjs capture|compose|all [slug...]  atau  sheet <out.jpg> [slug...]')
