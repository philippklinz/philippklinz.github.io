import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { languages } from './languages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const checkOnly = process.argv.includes('--check');
const config = JSON.parse(await readFile(root + 'site.config.json', 'utf8'));
const baseURL = config.siteURL.replace(/\/$/, '') + '/';
const source = JSON.parse(await readFile(root + 'locales/en.json', 'utf8'));
const provenance = JSON.parse(await readFile(root + 'locales/provenance.json', 'utf8'));
const revision = createHash('sha256').update(JSON.stringify(source)).digest('hex');
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
function flatten(value, path = '', result = {}) {
  if (typeof value === 'string') result[path] = value;
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) flatten(item, path ? `${path}.${key}` : key, result);
  else throw new Error(`Invalid catalogue leaf: ${path}`);
  return result;
}
const sourceKeys = Object.keys(flatten(source)).sort();
const catalogue = {};
for (const [lang] of languages) {
  const messages = JSON.parse(await readFile(root + `locales/${lang}.json`, 'utf8'));
  const leaves = flatten(messages);
  if (JSON.stringify(Object.keys(leaves).sort()) !== JSON.stringify(sourceKeys)) throw new Error(`${lang}: catalogue shape differs from English`);
  if (Object.values(leaves).some(value => !value.trim())) throw new Error(`${lang}: empty translation`);
  if (provenance[lang]?.sourceRevision !== revision) throw new Error(`${lang}: stale source revision; reconcile translations before updating provenance`);
  if (messages.skills.groups.length !== 10) throw new Error(`${lang}: expected ten approved skills groups`);
  catalogue[lang] = messages;
}
const route = lang => lang === 'en' ? 'index.html' : `${lang}/index.html`;
const icon = (paths, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const icons = [
  '<path d="m12 2 9 5v10l-9 5-9-5V7Z"/>',
  '<rect x="3" y="3" width="18" height="18"/><path d="M3 7h18M3 12h18M3 17h18"/>',
  '<rect x="3" y="3" width="18" height="18"/><rect x="6" y="6" width="12" height="12"/>',
  '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  '<path d="M3 3v18h18M7 17v-5m5 5V6m5 11V9"/>',
  '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  '<rect x="2" y="5" width="20" height="14"/><path d="m2 5 10 8L22 5M2 19l7-8m13 8-7-8"/>',
  '<path d="m3 10 17-6v16L3 14Zm4 5 2 6h4l-2-5"/>',
  '<circle cx="12" cy="6" r="3"/><path d="M5 21v-4a7 7 0 0 1 14 0v4Z"/>'
];
const globe = icon('<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>');
const moon = icon('<path d="M20.5 13.2A8.7 8.7 0 0 1 10.8 3.5 8.7 8.7 0 1 0 20.5 13.2Z"/>');
const books = [
  { author: 'Richard P. Feynman', title: 'Sie belieben wohl zu scherzen, Mr. Feynman!', url: 'https://www.thalia.at/shop/home/artikeldetails/A1047288888' },
  { author: 'Werner Heisenberg', title: 'Quantentheorie und Philosophie', url: 'https://www.thalia.at/shop/home/artikeldetails/A1000320947' },
  { author: 'Antoine de Saint-Exupéry', title: 'Der kleine Prinz', url: 'https://www.thalia.at/shop/home/artikeldetails/A1051193971' }
];
function head(lang, t, prefix, is404 = false) {
  const url = baseURL + (lang === 'en' ? '' : `${lang}/`);
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(is404 ? t.ui.notFound + ' — Philipp Klinz' : t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
${is404 ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(url)}">
${languages.map(([tag]) => `<link rel="alternate" hreflang="${tag}" href="${esc(baseURL + (tag === 'en' ? '' : tag + '/'))}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${esc(baseURL)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(baseURL + 'assets/philipp-klinz.jpg')}">
<meta property="og:image:alt" content="${esc(t.ui.portrait)}">`}
<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
<script src="${prefix}assets/theme.js"></script>
<link rel="preload" href="${prefix}assets/fonts/LiberationSansWeb-Regular.latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${prefix}assets/fonts/LiberationSansWeb-Bold.latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/fonts/fonts.css">
<link rel="stylesheet" href="${prefix}assets/modern-objectivity.css">
<link rel="stylesheet" href="${prefix}assets/site.css">`;
}
function page(lang, nativeName) {
  const t = catalogue[lang];
  const prefix = lang === 'en' ? './' : '../';
  const languageLinks = languages.map(([tag, name]) => `<a class="language-link" href="${prefix + route(tag)}" lang="${tag}" hreflang="${tag}"${tag === lang ? ' aria-current="page"' : ''}>${esc(name)}</a>`).join('\n');
  return `<!doctype html>
<html lang="${lang}">
<head>${head(lang, t, prefix)}</head>
<body id="top">
<a class="skip-link" href="#main">${esc(t.ui.skip)}</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="#top" aria-label="Philipp Klinz"><span class="brand-mark" aria-hidden="true">PK</span><span class="brand-name">philipp-klinz.net</span></a>
    <div class="header-tools">
      <div class="utility">
        <button id="theme" class="icon-button" type="button" aria-label="${esc(t.ui.dark)}" title="${esc(t.ui.dark)}" aria-pressed="false" hidden>${moon}</button>
        <details class="languages"><summary aria-label="${esc(t.ui.language)}: ${esc(nativeName)}">${globe}<span lang="${lang}">${esc(nativeName)}</span><span class="chevron" aria-hidden="true"></span></summary><nav class="language-options" aria-label="${esc(t.ui.language)}">${languageLinks}</nav></details>
      </div>
    </div>
  </div>
</header>
<main id="main">
  <section class="container hero" aria-label="Philipp Klinz">
    <div class="hero-text">
      <nav class="hero-tabs" aria-label="${esc(t.header.tabsLabel)}"><a id="tab-profile" href="#profile" data-slide="profile">${esc(t.header.profileTab)}</a><a id="tab-books" href="#books" data-slide="books">${esc(t.header.booksTab)}</a><a id="tab-interests" href="#interests" data-slide="interests">${esc(t.header.interestsTab)}</a></nav>
      <div class="hero-panels">
        <section id="profile" class="hero-panel" aria-labelledby="name"><p class="hero-kicker">${esc(t.header.greeting)}</p><h1 id="name">Philipp Klinz<span class="name-accent">.</span></h1><p class="profile-role">${esc(t.header.role)}</p><p class="profile-copy">${esc(t.header.description)}</p></section>
        <section id="books" class="hero-panel" aria-labelledby="books-title"><h2 id="books-title">${esc(t.books.title)}</h2><div class="book-list">${books.map(book => `<article class="book"><p class="book-author">${esc(book.author)}</p><h3 lang="de"><a href="${book.url}" hreflang="de" rel="external" aria-label="${esc(book.title)} · Thalia">${esc(book.title)}</a></h3></article>`).join('\n')}</div></section>
        <section id="interests" class="hero-panel" aria-labelledby="interests-title"><h2 id="interests-title">${esc(t.interests.title)}</h2><p class="interest-question">${esc(t.interests.question)}</p><p class="interest-description">${esc(t.interests.description)}</p></section>
      </div>
    </div>
    <figure class="hero-portrait"><img src="${prefix}assets/philipp-klinz.jpg" alt="${esc(t.ui.portrait)}" width="1024" height="1024" fetchpriority="high" decoding="async"></figure>
  </section>
  <section id="skills" class="container section" aria-labelledby="skills-title">
    <div class="section-head"><div><span class="eyebrow">${esc(t.skills.label)}</span><h2 id="skills-title">${esc(t.skills.title)}</h2><span class="heading-rule" aria-hidden="true"></span></div><p>${esc(t.skills.intro)}</p></div>
    <div class="skills-grid">${t.skills.groups.map((group, i) => `<article class="skill"><div class="skill-heading">${icon(icons[i], 'skill-icon')}<h3>${esc(group.title)}</h3></div><ul>${group.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article>`).join('\n')}</div>
  </section>
</main>
<footer class="container footer"><p><a href="https://philippklinz.github.io/modern-objectivity-style/?lang=${lang}">${esc(t.ui.design)}</a></p><nav class="footer-links" aria-label="${esc(t.ui.navigation)}"><a href="#top">${esc(t.ui.top)}</a></nav></footer>
<script src="${prefix}assets/site.js" defer></script>
</body>
</html>
`;
}
async function output(path, html) {
  if (checkOnly) {
    if (await readFile(root + path, 'utf8') !== html) throw new Error(`Generated file is out of date: ${path}`);
  } else {
    const parent = path.slice(0, path.lastIndexOf('/'));
    if (parent) await mkdir(root + parent, { recursive: true });
    await writeFile(root + path, html);
  }
}
for (const [lang, name] of languages) await output(route(lang), page(lang, name));
// A single Pages error document offers every supported language, even without JS.
await output('404.html', `<!doctype html><html lang="en"><head>${head('en', source, baseURL, true)}</head><body><main class="container not-found"><h1>404</h1>${languages.map(([lang, name]) => `<article lang="${lang}"><span class="eyebrow">${esc(name)}</span><h2>${esc(catalogue[lang].ui.notFound)}</h2><p>${esc(catalogue[lang].ui.notFoundText)}</p><a href="${baseURL + route(lang)}">${esc(catalogue[lang].ui.home)}</a></article>`).join('\n')}</main></body></html>\n`);
await output('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${languages.map(([lang]) => `<url><loc>${esc(baseURL + (lang === 'en' ? '' : lang + '/'))}</loc></url>`).join('')}</urlset>\n`);
console.log(`${checkOnly ? 'Verified' : 'Generated'} 3 complete language editions, a multilingual 404 and sitemap. ${sourceKeys.length} message leaves per language. Source: ${revision}`);
