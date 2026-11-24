# Philipp Klinz

Personal website for **Philipp Klinz**, hosted through GitHub Pages. The canonical address is **https://philipp-klinz.net/**.

The first version contains the supplied portrait, the ten skills groups from the owner's reference image, and three confirmed favourite books. Past projects will be added separately when the owner provides their content. No biography, services pitch or additional professional claims have been invented.

## Languages

- English: `index.html` (default)
- German: `de/index.html`
- Polish: `pl/index.html`

Each version is a complete static HTML document. Reading, navigation and language selection work without JavaScript. JavaScript only enables the optional appearance switch and preserves the current section when changing language. The appearance preference is stored locally if the browser allows it. The site contains no analytics, cookies, remote translation service or third-party runtime.

The owner explicitly limited this website to these three languages. This is a partial adoption of Modern Objectivity's MO-13 language baseline; it does not claim complete coverage of all 24 EU languages. German bibliographic titles remain as printed on the linked editions and carry `lang="de"`. All surrounding text and accessibility labels are translated. German and Polish translations are AI-assisted; independent language review is pending.

## Edit and check

All published pages, CSS, JavaScript and the portrait are checked in. GitHub Pages needs **no build step or package installation**. For centralised maintenance, edit `locales/en.json`, reconcile `locales/de.json` and `locales/pl.json`, and update their source revisions in `locales/provenance.json` only after checking the changed messages. The developer-only generator uses Node's standard library:

```sh
node tools/generate.mjs
node tools/generate.mjs --check
node --check assets/site.js
node --check assets/theme.js
python3 tools/check_html.py
```

`tools/generate.mjs` maintains the three pages, a multilingual error page and the sitemap from one shared template. It checks message coverage, empty values and source freshness before generating anything. The source hash is SHA-256 of `JSON.stringify()` of the parsed English catalogue. Coverage checks establish structural completeness, not native-speaker validation.

## Publish

Repository: [philippklinz/philippklinz.github.io](https://github.com/philippklinz/philippklinz.github.io).

Use **Settings → Pages → Deploy from a branch → main → /(root)**. `.nojekyll` makes the publication a direct static site. `CNAME`, canonical URLs, language alternates, Open Graph URLs and the sitemap all use `https://philipp-klinz.net/`.

Set `philipp-klinz.net` as the custom domain in GitHub Pages and configure the domain's DNS to point to GitHub Pages. Preserve the checked-in `CNAME` file. The site is already configured for this canonical domain; `siteURL` in `site.config.json` is the shared URL setting if it changes later. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). A custom domain on this user site also becomes the default domain for the account's project Pages sites unless they have their own domains.

## Design and assets

The local `assets/modern-objectivity.css` is copied without modification from [Modern Objectivity](https://github.com/philippklinz/modern-objectivity-style) at commit `4301cfc75e7732550bc9d078cee5edeae49ce8d6`. `assets/site.css` adapts its typography, semantic colours and controls to a personal website. See [NOTICE.md](NOTICE.md) for licensing and asset provenance, and [docs/content-sources.md](docs/content-sources.md) for the supplied content and checked book links.

The website self-hosts [LiberationFontsWeb](https://codeberg.org/philippklinz/LiberationFontsWeb) at revision `991e89ba225875d100b5bc4048626e8b6ac93927`: Sans for the interface, Mono for labels, and Serif for book titles. Latin and Latin Extended subsets cover the three selected languages. The font software keeps its SIL OFL 1.1 licence.
