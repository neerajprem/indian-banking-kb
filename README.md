# Indian Banking Ecosystem: Complete Knowledge Base

A public, static reference on the technology behind Indian banking: core systems, payment rails, architecture, technologies, high-volume systems, build versus buy, limitations, regulators and the RBI ecosystem. Every figure is sourced and dated. Published by the Infrastructure Team's Knowledgebase.

## Quick start

```bash
npm ci
npm run dev                         # local preview with live reload
npm run build                       # full gated build into dist/
npm run preview                     # serve dist/ like CloudFront (clean URLs, real 404)
npx playwright install chromium && npm test
```

Requires Node 20 or newer. The build is fully static; there is no server or database.

**Previewing a built copy (for example the dist zip):** serve the folder over HTTP rather than opening `index.html` directly. Run `python3 -m http.server 8000` (or `npx serve .`) inside the extracted folder, then open http://localhost:8000. Opened as a `file://` page, every `/`-rooted link to the CSS, fonts, scripts and search index points at the root of your disk, so the page appears unstyled and search and navigation fail. On S3 and CloudFront, or any web server, it works as intended.

## How it is built

| Layer | Choice |
|---|---|
| Framework | Astro 5, strict TypeScript, static output with one folder per page |
| Content | MDX in `src/content`; facts, sources, glossary, institutions, relations, rails and navigation as YAML in `src/data`, validated by Zod schemas |
| Trust model | Pages cite facts, never raw numbers. Each fact names an opened source and the date it was true. `scripts/check-facts.ts` and `scripts/check-dist.ts` block the build on unsourced, undeclared or known-wrong claims |
| Styling | Hand-written CSS in declared cascade layers, light and dark tokens, self-hosted subset fonts (Schibsted Grotesk and Literata). No inline styles anywhere, so the CSP can forbid them |
| Diagrams | Build-time SVG and HTML components, each with a title, description and generated text alternative |
| Interactivity | Small scripts for the theme, menus, search, tooltips, the rail map, relationship map, explainer, compare table and build-versus-buy scorer. Every page works without JavaScript |
| Search | Pagefind static index; exact short-name matches are pinned to the glossary |
| Hosting | Private S3 bucket behind CloudFront with OAC, a clean-URL function, a custom 404 and a strict CSP. See `RUNBOOK.md` |

Key directories: `src/components` (UI and diagrams), `src/layouts`, `src/pages` (routes), `src/styles`, `scripts` (gates, deploy and headers), `tests` (browser tests), `infra` (CloudFront function), `.github/workflows` (CI, deploy and freshness).

## Hosting on Cloudflare Pages or Netlify (ibs.neerajprem.in)

Every build writes `dist/_headers` with the security headers (CSP, HSTS and others) and cache rules; Cloudflare Pages and Netlify both apply it. Set `SITE_URL=https://ibs.neerajprem.in` in the host's build settings so canonical links, the sitemap, RSS and link previews use the real domain. Build command `npm run build`, output folder `dist`, Node 22. `netlify.toml` already holds these settings for Netlify. GitHub Pages is not recommended: it cannot send the security headers. For AWS, see `RUNBOOK.md`; the AWS deploy workflow runs only when the `BUCKET` repository variable is set.

## Book edition

`npm run build && npm run book` produces `indian-banking-ecosystem-book.pdf`: a 6 × 9 inch book of about 150 pages, generated from the same content and fact register as the site. Chapters come from the built pages, notes from each page's sources, and the appendices (glossary, fact register, bibliography, corrections) from the data files. Contents page numbers and the index are filled in by a second print pass. The book's own prose (preface, part openers, chapter bridges) lives in `scripts/book/text.mjs` and states no facts of its own.

## Content maintenance

- **Adding content:** see `CONTRIBUTING.md`. A new topic, fact, glossary term or institution is a data or MDX change only.
- **Freshness:** a weekly workflow lists facts whose source is older than 45 days (monthly figures) or 90 days (everything else). Reopen each source, update the value and dates, and log the change in `src/content/changelog/`.
- **Open questions:** `UNVERIFIED.md` lists everything not yet confirmed, including 104 draft glossary definitions and several time-sensitive facts. `research/KNOWN-ERRORS-REVIEW.md` records how each known error from the brief was resolved.
- **Before a release:** run `npx tsx scripts/check-facts.ts --strict`.

## Acceptance criteria (01-PRD section 7)

| Area | Criterion | Result | Evidence |
|---|---|---|---|
| Design | Passes the "definition of beautiful" checklist; direction approved at Stage 1 | **Pass** | Hybrid B+C approved by the owner; anti-pattern and checklist review in `REVIEW.md` |
| Content | All pages and topics exist; every fact has `source` and `asOf`; no known errors; no employer-specific content | **Pass, with one limit** | 47 pages; 9 + 12 locked topics; 11 institutions; 116/116 facts verified; the known-error gate passes on source and rendered HTML. Employer-specific content is checked only by pattern, because the forbidden-strings list is empty at the owner's direction |
| Accessibility | WCAG 2.2 AA; zero critical or serious axe violations; full keyboard operation; reduced motion respected | **Pass** | axe finds 0 violations of any severity on all pages, both themes, both widths; 20/20 keyboard and no-JS checks; motion audit. Not done: manual screen-reader test |
| Performance | Lighthouse (mobile) ≥ 95 performance, 100 accessibility, ≥ 95 best practices and SEO; JS ≤ 50 KB gzip; no layout shift | **Pass** | Home 99, Payment rails 99, CBS topic 100 (plus RBI ecosystem 99, Glossary 98); 100 / 100 / 100 elsewhere; CLS 0; JS at most 4.4 KB. Glossary LCP is exactly 2.0 s |
| Responsiveness | No horizontal scroll at 320 px; tables scroll inside their own container; four-width screenshots | **Pass** | 53 routes × 5 widths × 2 themes; the rails table becomes cards on phones; screenshots in each stage's outputs |
| Search | Any glossary acronym returns its glossary entry first | **Pass** | `tests/search.mjs`: 129/129 through the real search box |
| Deployment | Static `dist/`; one-command deploy; private bucket behind CloudFront; security headers; custom 404 returns 404 | **Built, not exercised** | `scripts/deploy.sh` (with `--dry-run`), CloudFront function (6 URL cases tested), header generator, OIDC deploy workflow and runbook. Local server returns 404 correctly. Not deployed to a real account |
| Scalability | A new topic needs one Markdown file and no code changes | **Pass** | Probe topic produced its page, card, sitemap entry, search entry (45 → 46 pages indexed), reading-order link and transition name; then removed |
| Currency | A scheduled job flags facts older than 90 days | **Pass** | `.github/workflows/freshness.yml` with `scripts/check-freshness.ts` (monthly facts flagged at 45 days) |
| Docs | `CONTRIBUTING.md` covers adding a page, topic, fact, glossary term and diagram in under two pages | **Pass** | `CONTRIBUTING.md` |

## Licence and independence

No licence has been chosen yet; all rights are reserved until one is. The site is independent. It is not official documentation of RBI, NPCI or any bank, and it is not legal, compliance or investment advice.
