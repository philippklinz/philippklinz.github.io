# Philipp Klinz

Personal website for **Philipp Klinz**, hosted through GitHub Pages. The canonical address is **https://philipp-klinz.net/**.

This is the **`weyland-yutani` redesign branch**. `main` preserves the current personal site. The planned Babylon.js version uses a terminal loading screen, an orbital scene and the existing content as an HTML/CSS HUD. It remains static by design, with local browser-ready dependencies and no required website build pipeline. The [Blender spacecraft brief](docs/briefs/blender-spacecraft.md) defines the separate model handoff. The existing implementation described below remains in place until the redesign is built.

The header has three manually selected panels: the approved professional introduction, three confirmed favourite books, and the owner's question and interests. The supplied portrait is displayed in greyscale with CSS. A locally rendered Three.js surface adds a head movement and breathing gesture for 4.6 seconds every 8 seconds, separated by 3.4 seconds of stillness, with the background and frame edges held still. The ten skills groups follow the owner's reference image. Past projects will be added separately when the owner provides their content.

## Languages

- English: `index.html` (default)
- German: `de/index.html`
- Polish: `pl/index.html`

Each version is a complete static HTML document. Reading, navigation and language selection work without JavaScript; all three header panels are then shown in sequence. JavaScript enables the manual tabs and optional appearance switch, and preserves the selected panel and current section when changing language. Tabs support arrow keys, Home and End, with no automatic rotation. The selected panel is recorded in the URL; appearance and portrait-pause preferences are stored locally if the browser allows it. The site contains no analytics, cookies, remote translation service or external runtime service. Three.js and all other assets are served locally.

The living portrait uses the original photograph on a shallow, hand-aligned mesh rather than a reconstructed full head. Its pause control is translated. It keeps the static image when reduced motion is requested or WebGL is unavailable, stops drawing while offscreen or the tab is hidden, and sleeps between gestures. `assets/portrait.mjs` contains the geometry weights and timing. The original JPEG remains untouched.

The owner explicitly limited this website to these three languages. This is a partial adoption of Modern Objectivity's MO-13 language baseline; it does not claim complete coverage of all 24 EU languages. Book titles and links follow the chosen edition in `content/books.json`, with matching language attributes. The owner prefers an English edition when no Polish edition is available. All surrounding text and accessibility labels are translated. German and Polish translations are AI-assisted; independent language review is pending.

## Edit and check

All published pages, CSS, JavaScript and the portrait are checked in. GitHub Pages needs **no build step or package installation**. For centralised maintenance, edit `locales/en.json`, reconcile `locales/de.json` and `locales/pl.json`, and update their source revisions in `locales/provenance.json` only after checking the changed messages. The developer-only generator uses Node's standard library:

```sh
node tools/generate.mjs
node tools/generate.mjs --check
node --check assets/site.js
node --check assets/theme.js
node --check assets/portrait.mjs
python3 tools/check_html.py
```

`tools/generate.mjs` maintains the three pages, a multilingual error page and the sitemap from one shared template. It checks message coverage, empty values and source freshness before generating anything. The source hash is SHA-256 of `JSON.stringify()` of the parsed English catalogue. Coverage checks establish structural completeness, not native-speaker validation.

Edit book editions in `content/books.json`; keep the title, language and destination together. The generator uses the English entry when an edition for the selected language is absent. A related book is not an equivalent translation: substitutions require the owner's choice.

The generator also publishes content-hashed copies of the site CSS and JavaScript. Keep previously published copies: cached pages still refer to them. Language links carry a shared content version so switching languages after an update requests the matching page release. Canonical URLs stay clean; the selected slide and section survive the switch.

## Publish

Repository: [philippklinz/philippklinz.github.io](https://github.com/philippklinz/philippklinz.github.io).

To publish the redesign branch, the owner selects **Settings → Pages → Deploy from a branch → weyland-yutani → /(root)**. Selecting `main` restores the preserved version. `.nojekyll` makes the publication a direct static site. `CNAME`, canonical URLs, language alternates, Open Graph URLs and the sitemap all use `https://philipp-klinz.net/`.

Set `philipp-klinz.net` as the custom domain in GitHub Pages and configure the domain's DNS to point to GitHub Pages. Preserve the checked-in `CNAME` file. The site is already configured for this canonical domain; `siteURL` in `site.config.json` is the shared URL setting if it changes later. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). A custom domain on this user site also becomes the default domain for the account's project Pages sites unless they have their own domains.

## Design and assets

The local `assets/modern-objectivity.css` is copied without modification from [Modern Objectivity](https://github.com/philippklinz/modern-objectivity-style) at commit `4301cfc75e7732550bc9d078cee5edeae49ce8d6`. `assets/site.css` adapts its typography, semantic colours and controls to a personal website. See [NOTICE.md](NOTICE.md) for licensing and asset provenance, and [docs/content-sources.md](docs/content-sources.md) for the supplied content and checked book links.

The website self-hosts [LiberationFontsWeb](https://codeberg.org/philippklinz/LiberationFontsWeb) at revision `991e89ba225875d100b5bc4048626e8b6ac93927`: Sans for the interface and content, including book titles, and Mono for labels. Header panels share the same label styling and starting baseline. Latin and Latin Extended subsets cover the three selected languages. The font software keeps its SIL OFL 1.1 licence.
