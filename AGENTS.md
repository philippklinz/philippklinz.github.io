# Website working instructions

## Active redesign branch

- The owner selected **`weyland-yutani`** for the new Babylon.js orbital website. Work and publish commits for this redesign only on that branch. Preserve `main` as the existing website; do not merge into it or change Pages settings on the owner's behalf.
- The approved direction is a terminal loading screen, an orbital view with a stormy planet and a slowly passing spacecraft, and the existing content as an HTML/CSS HUD. Use Modern Objectivity with the requested Weyland-Yutani-inspired future corporate setting. Specific earlier terminal labels remain design ideas, not approved replacement copy.
- Keep rendering settings and local automatic quality selection in scope. Structure the runtime so later scenes or a ship interior can be added; building an interior is not part of the first version.
- **Static by design:** deploy and run checked-in HTML/CSS/JS/assets directly, with browser-ready Babylon/loader files hosted locally. No npm install, bundler, transpiler, runtime service or required website build pipeline. Offline asset authoring/export is allowed; deliver the resulting GLBs and textures as static files.
- The planet and browser effects belong to the website work. The spacecraft asset brief is `docs/briefs/blender-spacecraft.md`; a separate Blender agent will receive it from the owner. Keep asset handoff paths separate from site implementation.
- The header/Three.js portrait rules below describe the preserved `main` baseline. They do not require carrying that layout or renderer into the approved Babylon redesign. Preserve the approved content, languages, credits, legal notice, local assets and accessibility behaviour when implementing its replacement.

## Existing website baseline and shared requirements

- This repository is Philipp Klinz's personal website. Use plain static HTML, CSS and JavaScript. No application framework, runtime service, analytics or package dependency is needed.
- The owner chose **English, German and Polish only**, with English as the default. Do not expand the language scope without a new request.
- Load the vendored LiberationFontsWeb families from `assets/fonts/`. Preserve font files, Web family names, licence and upstream revision.
- Use the existing local Modern Objectivity stylesheet and semantic tokens. Changes belong in `assets/site.css`; preserve upstream provenance and licence notices.
- The approved content is: supplied portrait and name, the professional title and description from the owner's profile reference, the ten skills groups from the supplied reference, three confirmed favourite books, and the owner's question and interests documented in `docs/content-sources.md`. Do not invent additional biographical details, professional titles, services, project claims or contact details. The owner will provide past-project content separately.
- Keep the header's three manually selected panels (profile, books, interests) with the fixed CSS-greyscale portrait. Preserve the selected panel on language changes, support keyboard navigation, and show all content without JavaScript. Do not add automatic rotation.
- The owner approved a subtle living portrait: small head movement and breathing, separated by stillness, using local Three.js r180. Preserve its pause control, reduced-motion/static fallback and offscreen suspension. Keep the original JPEG unchanged and retain the vendored MIT licence. This animation is separate from the manual header tabs.
- The German Heisenberg book is **Quantentheorie und Philosophie**, Reclam, ISBN 978-3-15-009948-3. The owner explicitly chose **Physics and Philosophy** for English and **Fizyka a filozofia** for Polish, knowing they are a related work rather than a translation of the complete Reclam selection.
- Maintain language-specific book titles and links in `content/books.json`. Use an English edition if a Polish edition is unavailable, as requested by the owner. Do not silently replace a favourite book with a different work by the same author.
- Edit language catalogues and the shared template in `tools/generate.mjs`, then regenerate the checked-in pages. Keep translations aligned and record source revisions only after reconciling content changes.
- Edit `assets/site.css`, `assets/site.js`, `assets/theme.js` and `assets/portrait.mjs` as sources, then regenerate their content-hashed published copies. Keep older hashed copies for cached pages. Preserve the target page version when updating language links.
- Keep direct relative links, correct `lang` attributes, translated accessible labels, keyboard focus, reduced-motion support and readable narrow layouts. Core content and language choice must work without JavaScript.
- Validate with the commands in README. Inspect visual changes in a browser when available. Preserve the original portrait file; do not claim it is GPL-licensed.
- Publish redesign work to `weyland-yutani` only. Do not publish this website into one of the laboratory repositories. The owner handles switching the GitHub Pages source branch; custom-domain activation is a separate hosting/DNS step.
