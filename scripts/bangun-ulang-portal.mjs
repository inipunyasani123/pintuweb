// Deploy ulang produksi 11 project portal tanpa commit baru, supaya mereka membaca harga.json terbaru
// (scripts/ambil-harga.mjs berjalan di prebuild tiap portal). Jalankan SETELAH PintuWeb live dengan harga baru.
//
//   node scripts/bangun-ulang-portal.mjs --coba      cetak rencana saja, tidak memicu apa pun
//   node scripts/bangun-ulang-portal.mjs             picu deploy ulang ke-11 portal
//   node scripts/bangun-ulang-portal.mjs portal-bio  hanya project yang disebut
//
// Memakai deployment produksi READY terakhir tiap project. Ingat batas paket Hobby: 100 deploy per hari
// dan 1 build berjalan bersamaan. Token Vercel dibaca dari auth.json CLI dan tidak pernah dicetak.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PORTAL = [
  'portal-bio', 'portal-kontes', 'portal-landing', 'portal-menu', 'portal-mobile', 'portal-porto',
  'portal-properti', 'portal-reservasi', 'portal-todo', 'portal-toko', 'portal-undangan',
]
const args = process.argv.slice(2)
const coba = args.includes('--coba')
const dipilih = args.filter((a) => !a.startsWith('--'))
const daftar = dipilih.length ? dipilih : PORTAL

const akar = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const projectJson = [path.join(akar, '.vercel/project.json'), path.join(akar, '../PintuWeb/.vercel/project.json')].find((f) => fs.existsSync(f))
const team = process.env.VERCEL_TEAM_ID || (projectJson && JSON.parse(fs.readFileSync(projectJson, 'utf8')).orgId)
if (!team) { console.error('teamId tidak ditemukan (.vercel/project.json atau VERCEL_TEAM_ID).'); process.exit(1) }
const salah = daftar.filter((n) => !PORTAL.includes(n))
if (salah.length) { console.error('Bukan project portal:', salah.join(', ')); process.exit(1) }

const authFile = `${process.env.HOME}/Library/Application Support/com.vercel.cli/auth.json`
const tok = fs.existsSync(authFile) ? JSON.parse(fs.readFileSync(authFile, 'utf8')).token : null
if (!tok && !coba) { console.error('Token Vercel tidak ditemukan; login dulu dengan `vercel login`.'); process.exit(1) }
const H = { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }

console.log(`${coba ? '[COBA] ' : ''}Rencana: deploy ulang produksi ${daftar.length} project (batas Hobby 100 deploy/hari, 1 build bersamaan).`)
for (const nama of daftar) {
  if (coba) { console.log(`- ${nama}: ambil deployment produksi READY terakhir, lalu deploy ulang (target production)`); continue }
  const j = await (await fetch(`https://api.vercel.com/v6/deployments?teamId=${team}&app=${nama}&target=production&state=READY&limit=1`, { headers: H })).json()
  const d = j.deployments?.[0]
  if (!d) { console.log(nama, 'tidak ada deployment produksi READY'); continue }
  const r = await fetch(`https://api.vercel.com/v13/deployments?teamId=${team}&forceNew=1`, { method: 'POST', headers: H, body: JSON.stringify({ name: nama, deploymentId: d.uid, target: 'production' }) })
  const o = await r.json()
  console.log(nama, r.status, o.id || '', o.readyState || o.error?.message || '')
}
