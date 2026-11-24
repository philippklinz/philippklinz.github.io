# Website working instructions

- This repository is Philipp Klinz's personal website. Use plain static HTML, CSS and JavaScript. No application framework, runtime service, analytics or package dependency is needed.
- The owner chose **English, German and Polish only**, with English as the default. Do not expand the language scope without a new request.
- Load the vendored LiberationFontsWeb families from `assets/fonts/`. Preserve font files, Web family names, licence and upstream revision.
- Use the existing local Modern Objectivity stylesheet and semantic tokens. Changes belong in `assets/site.css`; preserve upstream provenance and licence notices.
- The approved content is: supplied portrait and name, the professional title and description from the owner's profile reference, the ten skills groups from the supplied reference, three confirmed favourite books, and the owner's question and interests documented in `docs/content-sources.md`. Do not invent additional biographical details, professional titles, services, project claims or contact details. The owner will provide past-project content separately.
- Keep the header's three manually selected panels (profile, books, interests) with the fixed CSS-greyscale portrait. Preserve the selected panel on language changes, support keyboard navigation, and show all content without JavaScript. Do not add automatic rotation.
- The confirmed Heisenberg book is **Quantentheorie und Philosophie**, Reclam, ISBN 978-3-15-009948-3.
- Edit language catalogues and the shared template in `tools/generate.mjs`, then regenerate the checked-in pages. Keep translations aligned and record source revisions only after reconciling content changes.
- Edit `assets/site.css`, `assets/site.js` and `assets/theme.js` as sources, then regenerate their content-hashed published copies. Keep older hashed copies for cached pages. Preserve the target page version when updating language links.
- Keep direct relative links, correct `lang` attributes, translated accessible labels, keyboard focus, reduced-motion support and readable narrow layouts. Core content and language choice must work without JavaScript.
- Validate with the commands in README. Inspect visual changes in a browser when available. Preserve the original portrait file; do not claim it is GPL-licensed.
- Publish to `main` in this repository when requested. Do not publish this website into one of the laboratory repositories. Custom-domain activation is a separate hosting/DNS step.
