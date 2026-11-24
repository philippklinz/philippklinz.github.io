# Website working instructions

- This repository is Philipp Klinz's personal website. Use plain static HTML, CSS and JavaScript. No application framework, runtime service, analytics or package dependency is needed.
- The owner chose **English, German and Polish only**, with English as the default. Do not expand the language scope without a new request.
- Use the existing local Modern Objectivity stylesheet and semantic tokens. Changes belong in `assets/site.css`; preserve upstream provenance and licence notices.
- The approved first version is: supplied portrait and name, the ten skills groups from the supplied reference, and the three confirmed favourite books. Do not invent biographical details, professional titles, services, project claims or contact details. The owner will provide past-project content separately.
- The confirmed Heisenberg book is **Quantentheorie und Philosophie**, Reclam, ISBN 978-3-15-009948-3.
- Edit language catalogues and the shared template in `tools/generate.mjs`, then regenerate the checked-in pages. Keep translations aligned and record source revisions only after reconciling content changes.
- Keep direct relative links, correct `lang` attributes, translated accessible labels, keyboard focus, reduced-motion support and readable narrow layouts. Core content and language choice must work without JavaScript.
- Validate with the commands in README. Inspect visual changes in a browser when available. Preserve the original portrait file; do not claim it is GPL-licensed.
- Publish to `main` in this repository when requested. Do not publish this website into one of the laboratory repositories. Custom-domain activation is a separate hosting/DNS step.
