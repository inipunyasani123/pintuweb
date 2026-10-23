// Isi /llms.txt & /llms-full.txt, dirakit dari sumber data yang sama dengan halaman situs.
import { CITY, CLIENT_PROJECTS, EMAIL, FOUNDED_YEAR, GUARANTEE_DAYS, PERF_TARGET, SITE, WA_DISPLAY } from '../lib/site'
import { DEMOS } from '../lib/demos'
import { PORTALS } from '../lib/portals'
import { addonsFor, facts, packagesFor } from '../i18n/facts'
import { getDict, getPages } from '../i18n'
import { urlOf, type PageKey } from '../i18n/routes'
import { SERVICES } from './services'
import { articlesIn } from './articles'
import { faqFor } from './faq'
import { clientsFor, clientsHref } from './clients'
import { LANG_INFO, LANGS, X_LANGS, plain } from '../i18n/config'
import { localText } from './local'
import { paymentText } from './payment'
import { PAYMENT_METHODS } from '../lib/packages'

export function llmsDoc(full: boolean) {
  const en = facts('en')
  const pkEn = packagesFor('en')
  const pkId = packagesFor('id')
  const lines: string[] = []
  const push = (...l: string[]) => lines.push(...l)

  push(
    '# PintuWeb',
    '',
    `> PintuWeb is a website design and development studio based in ${CITY}, East Java, Indonesia, founded in ${FOUNDED_YEAR}. It builds fast, SEO-ready websites (landing pages, company profiles, online stores, QR digital menus, portfolios, digital invitations, link-in-bio pages and custom web apps) and Android & iOS mobile apps (React Native + Expo, one codebase for Android, iOS and the web) for small businesses, start-ups and personal brands. ${CLIENT_PROJECTS} client projects completed; ${DEMOS.length} live demos. Prices are in Indonesian Rupiah (IDR).`,
    '',
    'Key facts (kept identical across every page of the site):',
    '',
    `- Founded: ${FOUNDED_YEAR}, ${CITY}, East Java, Indonesia`,
    `- Client projects: ${CLIENT_PROJECTS}; live demos: ${DEMOS.length}`,
    `- Contact: WhatsApp ${WA_DISPLAY}, email ${EMAIL}`,
    `- Hours: ${en.hours}`,
    `- Payment: ${en.payment} Details: ${urlOf('en', { key: 'payment' })}`,
    `- Renewal: ${en.renewal}`,
    `- Guarantee: ${GUARANTEE_DAYS}-day bug-fix guarantee after launch; maintenance as included in each package (not every package includes it; ongoing maintenance is available as a monthly add-on)`,
    `- Performance target: PageSpeed ${PERF_TARGET} (a target, not an average claim)`,
    '- Ownership: for website packages, after full payment the client owns the source code, domain, hosting and admin access; ' +
      'digital invitation themes stay active for 12 months on a personal link, and the Website Design Concepts package grants the right to use the design, not the code',
    `- Mobile apps: PintuWeb hands over the app files and the full source code; publishing to Google Play and the App Store is done by the client with developer accounts in the client’s own name (PintuWeb does not publish apps to the stores); the ${GUARANTEE_DAYS}-day bug-fix guarantee also applies, from the day the app is handed over`,
    '- Languages: Indonesian (default), English (/en) and Malay (/ms) for the whole site; ' +
      `${X_LANGS.map((l) => `${LANG_INFO[l].name} (/${l})`).join(', ')} for the main pages (home, services, pricing, demos, FAQ, about, contact, founder, glossary, local page)`,
    '',
    '## Packages (IDR)',
    '',
    ...pkEn.map((p, i) => `- ${p.title} (${pkId[i].title}): ${p.priceRange}; turnaround ${p.duration}; ${p.subtitle}`),
    '',
    'Optional extras (IDR):',
    '',
    ...addonsFor('en').map((a) => `- ${a.title}: ${a.range} ${a.unit}`),
    '',
    '## Payment',
    '',
    `[${paymentText('en').title}](${urlOf('en', { key: 'payment' })}) (Indonesian: ${urlOf('id', { key: 'payment' })}; also in ${LANGS.filter((l) => l !== 'en' && l !== 'id').map((l) => l.toUpperCase()).join(', ')})`,
    '',
    ...PAYMENT_METHODS.map((m) => `- ${paymentText('en').methods[m].name}: ${paymentText('en').methods[m].body}`),
    '- Bank account numbers, the DANA destination and the USDT network and wallet address are published only on the invoice, never on the website.',
    '',
    '## Services',
    '',
    ...SERVICES.flatMap((s) => [
      `- [${s.text.en.name}](${urlOf('en', { key: 'services', service: s.key })}): ${s.text.en.lead}`,
      `  - Indonesian: [${s.text.id.name}](${urlOf('id', { key: 'services', service: s.key })})`,
    ]),
    '',
    `## Local page: ${CITY}`,
    '',
    `PintuWeb is a service-area business: only the city is published (no street address); all work is done remotely over WhatsApp and email.`,
    '',
    `- [${localText('en').ogTitle}](${urlOf('en', { key: 'local' })}): ${plain(`${localText('en').answerLead} ${localText('en').answer}`)}`,
    `  - Indonesian: [${localText('id').ogTitle}](${urlOf('id', { key: 'local' })})`,
    `  - Other languages: ${LANGS.filter((l) => l !== 'en' && l !== 'id').map((l) => `${urlOf(l, { key: 'local' })} (${l.toUpperCase()})`).join(' · ')}`,
    '',
    '## Main pages',
    '',
    ...(['home', 'pricing', 'payment', 'services', 'demo', 'faq', 'about', 'founder', 'contact', 'glossary'] as PageKey[]).map(
      (key) => `- ${key}: ${urlOf('id', { key } as never)} (ID) · ${urlOf('en', { key } as never)} (EN) · ${urlOf('ms', { key } as never)} (MS)`,
    ),
    '',
    '## Client projects',
    '',
    `Selected real projects for clients (details: ${SITE}${clientsHref('en')}):`,
    '',
    ...clientsFor('en').map((c) => `- ${c.business} (${c.field}), client ${c.client}: ${c.project}. Problem: ${c.problem} Solution: ${c.solution}`),
    '',
    '## Demo galleries (Indonesian)',
    '',
    ...PORTALS.map((p) => `- [${getDict('en').portfolio.galleries[p.category].title}](${SITE}/${p.path}): ${getDict('en').portfolio.galleries[p.category].tagline}`),
    '',
    '## Articles',
    '',
    ...articlesIn('en').map((a) => `- [${a.title}](${urlOf('en', { key: 'articles', article: a.key })}): ${a.description}`),
    ...articlesIn('id').map((a) => `- [${a.title}](${urlOf('id', { key: 'articles', article: a.key })}) (Indonesian): ${a.description}`),
    '',
    '## Optional',
    '',
    `- [Full version with FAQ and article summaries](${SITE}/llms-full.txt)`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
  )

  if (full) {
    for (const lang of ['en', 'id'] as const) {
      push('', `## FAQ (${lang === 'en' ? 'English' : 'Bahasa Indonesia'})`, '')
      for (const f of faqFor(lang).items) push(`### ${f.question}`, '', f.answer, '')
      push(`## ${getPages(lang).articles.takeaways} (${lang.toUpperCase()})`, '')
      for (const a of articlesIn(lang)) {
        push(`### ${a.title}`, '', urlOf(lang, { key: 'articles', article: a.key }), '', ...a.takeaways.map((t) => `- ${t}`), '')
      }
    }
  }
  return lines.join('\n') + '\n'
}
