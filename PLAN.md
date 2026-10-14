# PLAN.md: Indian Banking Ecosystem: Complete Knowledge Base

Stage 0 output. Written 29 September 2026. The brief (`ALL-IN-ONE.md`) remains the source of truth, amended by the owner decisions below.

## 1. Confirmed owner inputs

| Input | Decision |
|---|---|
| Site name and `<title>` | Indian Banking Ecosystem: Complete Knowledge Base |
| Feel (three words) | Calm, technical, modern |
| Reference site | DigitalOcean documentation: clean white pages, readable sans type, clear hierarchy, click-first navigation |
| Look | Light, white base; low density; an interactive knowledge base; diagrams wherever they help |
| Navigation | Mouse clicks first (click to open cards, steps and panels; nothing hover-only). Keyboard support remains because WCAG 2.2 AA requires it |
| Themes | Light is the default; dark is kept as a secondary, manually selectable theme |
| Domain | None yet. A placeholder origin is used for canonical URLs and the sitemap, set in one config value |
| Licence | None. The footer has no licence line |
| Footer publisher | Infrastructure Team's Knowledgebase, beside the "independent, not official documentation" note |
| AWS region | ap-south-1 |
| Terraform | **Out of scope.** No `/infra` directory |
| `.drawio` download | **Removed.** The interactive relationship map, its table and SVG downloads stay |
| Stage 1 | All three mockups (A, B, C), each on a white base |

## 2. Environment (tested, not assumed)

| Capability | Result | Evidence |
|---|---|---|
| Node 20+ and npm | Yes | Node 22.22.2, npm 10.9.7 |
| Install packages | Yes | Installed Astro 5.18.2 and Pagefind 1.5.2 from npm |
| Headless browser (Playwright) | Yes | Playwright must be pinned to 1.56.0 to match the preinstalled Chromium in `/opt/pw-browsers`. Screenshot at 360 px rendered, including ₹ |
| axe accessibility testing | Yes | `@axe-core/playwright` detected seeded violations (needs `browser.newContext()`) |
| Lighthouse | Yes | Lighthouse 13.5.0 ran against a local page using the Playwright Chromium binary |
| Web search | Yes | Search tool returned results, including the RBI CTS circular PDF |
| Browse primary sources | Yes, with a caveat | RBI site loads over plain HTTP clients. NPCI returns 403 to curl but 200 to the headless browser, so NPCI pages are fetched through Playwright |
| Write files | Yes | |
| Create a zip | Yes | `zip`/`unzip` present |
| Persistence between turns | **Uncertain** | The working directory may reset between turns. See risk 2 |

Because live search works, section B of 04-CONTENT (no-search rules) is not triggered. `UNVERIFIED.md` is still produced in Stage 3 for anything that cannot be confirmed.

## 3. Stages and deliverables

| Stage | Delivers | Gate |
|---|---|---|
| 0 | This plan | Report |
| 1 | `/mockups/a-security-print.html`, `b-rail-map.html`, `c-field-guide.html`, all on white; screenshots at 1440 and 390 px in light and dark; 360 px overflow check; scoring table; recommendation with fonts, tokens, radius and spacing | **Approval gate: design choice** |
| 2 | Astro 5 scaffold, content-layer schemas, `check-facts.ts` with forbidden-strings gate, token-driven CSS in layers, self-hosted fonts, icon sprite, all layouts and components on `/styleguide`, three sample pages; build, axe, overflow and Lighthouse results | Report |
| 3 | `sources.yaml`, `facts.yaml`, `institutions.yaml`, `relations.yaml`, `glossary.yaml`, verdict on every known-error item, `UNVERIFIED.md` | **Approval gate: fact ledger** |
| 4a | Home (signature element), Core systems, Payment rails with diagrams and tables | Report |
| 4b | Architecture overview and 9 topics (may be split into two turns, see risk 2) | Report |
| 4c | Technologies overview and 12 topics (may be split into two or three turns) | Report |
| 4d | High-volume, Build vs buy (with scorer), Limitations | Report |
| 4e | Regulators, RBI ecosystem (map, table, 11 institution pages), Glossary, Sources, Changelog. **No `.drawio` file** | Report |
| 5 | Search, related and prev/next, copy links, print, OG images, sitemap, RSS, JSON-LD, motion and typography audits | Report |
| 6 | **Reduced scope, no Terraform:** `scripts/deploy.sh` (two-pass sync, cache headers, invalidation, dry run), CloudFront Function source file, response-headers and CSP specification as a documented config, GitHub Actions (`ci.yml`, `deploy.yml`, `freshness.yml`), `RUNBOOK.md` with manual AWS console setup for bucket, OAC, distribution, error mapping, headers and OIDC role; local CSP test on ten pages | Report |
| 7 | Adversarial review and fixes; `REVIEW.md` | Report |
| 8 | `CONTRIBUTING.md`, `README.md`, maintenance section, repository zip, `dist` zip, final acceptance table | Final |

## 4. The three biggest risks

**1. Wrong or stale facts.** The site's value is accuracy, and the hardest facts are the least published: institution headcounts, ownership changes, and regulatory titles and dates. Some primary data is published as images (RBI payment indicators) or behind bot protection (NPCI). The UPI figures in the ledger end at July 2026, and newer months are likely available now.
*Mitigation:* open every source (headless browser for NPCI, PDF text extraction for RBI), record the access date, prefer primary sources, write "not publicly disclosed" rather than estimate, link out for live figures, and hold all prose until you approve the ledger at Stage 3.

**2. Work lost between turns, or stages too large for one turn.** The container may reset between messages. Stages 4b and 4c together require 21 pages of 900 to 1,600 words plus diagrams.
*Mitigation:* at the end of every stage I save a snapshot zip of the repository (without `node_modules` and `dist`) to the outputs folder and restore from it at the start of the next stage. If it is missing, I'll ask you to re-attach the last zip. Stages 4b and 4c are split into batches of four to six topics if needed, each with its own build and checks, reported as 4b-1, 4b-2 and so on.

**3. A white, calm, documentation-like site that reverts to the generic template the brief rejects.** Your preferences (white, low density, DigitalOcean style) are close to the "sidebar and white cards" look the brief calls forgettable.
*Mitigation:* keep the reading surfaces calm and white, and put the personality into the one signature element, the authored diagrams, the domain colour system and typography. Every mockup and later page is checked against the anti-pattern list and the "definition of beautiful" checklist.

## 5. Contradictions and gaps in the brief, with proposed resolutions

| # | Issue | Proposed resolution |
|---|---|---|
| 1 | Owner wants white; Direction A specifies green-grey paper and C specifies off-white | All three mockups use a white base; each direction keeps its signature, type and accents |
| 2 | Direction C and the PRD specify a scroll-driven UPI explainer; owner wants click navigation | Click-through step sequence (Next/Previous buttons and clickable steps) with the diagram highlighting each party; numbered static list as the no-JS fallback |
| 3 | Dark mode is required; owner prefers light | Light is the default for everyone; dark is available through the toggle. Not following the system setting by default (a change from PRD section 5), because the owner asked for a light site |
| 4 | Terraform removed, but acceptance criteria require a private bucket behind CloudFront with headers | Criteria become "documented and verified locally": the RUNBOOK gives exact console steps, the CSP and headers are tested against a local server, and live verification is a manual step for you after setup |
| 5 | `.drawio` removed, but it appears in PRD scope 9, the features table, the TRD repository layout and Stage 4e | Removed everywhere; relationship map and table remain, plus an SVG download of the map |
| 6 | 04-CONTENT J says "all 11 pages", but the sitemap has 10 content pages (Home plus 9 sections) before Glossary, Sources and Changelog | Use the explicit route list in PRD section 4 as the checklist |
| 7 | TRD places content config at `src/content/config.ts`; Astro 5's content layer uses `src/content.config.ts` with loaders | Use the Astro 5 location and loaders; schemas unchanged |
| 8 | Glossary is described as a collection, but the repository layout puts it in `src/data/glossary.yaml`. Stage 3 produces `institutions.yaml`, but the layout has `institutions/*.mdx` | YAML files are the single source for structured data (loaded as data collections); MDX files hold institution prose only, joined by id. Nothing is stored twice |
| 9 | CSP `style-src 'self'` with no `'unsafe-inline'` may break inline style attributes emitted by Astro, view transitions or Pagefind UI | Set `inlineStylesheets: 'never'`, avoid inline style attributes in components, test the exact CSP in Stage 2 and Stage 6, and report any required relaxation instead of hiding it |
| 10 | The "90 days" freshness rule and per-volatility windows are both specified but not reconciled | Flag a fact when it is older than 90 days or its window, whichever is shorter: monthly 45 days, annual 400 days, static never (beyond 90-day review), live never shows a number |
| 11 | The forbidden-strings gate needs employer and internal repository names, which the brief does not list (correctly, since it is public) | `check-facts.ts` reads a `forbidden-strings.txt` that is git-ignored and filled in by you locally. The known-error phrases are committed separately |
| 12 | Stage 1 asks for screenshots at 1440 and 390 px; the master prompt asks for 360, 768, 1280 and 1920 | Mockups: 1440 and 390 px screenshots plus an automated no-overflow check at 360. Built site: all four widths |
| 13 | Glossary seed terms "DLS" and "KMM" are ambiguous (KMM in particular) | Resolve in Stage 3 from a source (for example Kotlin Multiplatform Mobile, digital lending service); drop if no clear source |
| 14 | CTS Phase 2 (3 January 2026) is in the ledger as a scheduled change | Re-verify in Stage 3 whether Phase 2 went live as scheduled or was changed, before the "known error 5" wording is written |
| 15 | Home page requires "the sourced UPI headline figures", but the ledger's latest month is July 2026 | Update to the latest published month in Stage 3, or link to the live NPCI and RBI pages |

## 6. Acceptance criteria mapped to stages (PRD section 7)

| Criterion | Built in | Verified in |
|---|---|---|
| Design: "definition of beautiful" checklist; direction approved | 1 (gate), 2, 4a, 5 | 7 |
| Content: all pages and topics exist; every fact has `source` and `asOf`; no known errors; no employer content | 3 (gate), 4a to 4e | `check-facts` at every build; 7 |
| Accessibility: WCAG 2.2 AA, zero critical or serious axe issues, keyboard, reduced motion | 2 (components), 4a to 4e | axe on every stage; manual walkthrough in 7 |
| Performance: Lighthouse ≥ 95 / 100 / ≥ 95; JS ≤ 50 KB gzip; no layout shift | 2 (budgets), 5 | Lighthouse every stage from 2; full audit in 7 |
| Responsiveness: no page overflow at 320 px; tables scroll inside containers; four-width screenshots | 2, 4a to 4e | Playwright overflow assertions every stage; 7 |
| Search: glossary term ranks first for any acronym | 4e (glossary), 5 (Pagefind) | Automated test in 5; 7 |
| Deployment: static `dist/`; one-command deploy and invalidation; private bucket; headers; 404 status | 2 (build), 6 (script, runbook, local header test) | 6 locally; **live checks are yours after manual AWS setup** (Terraform excluded) |
| Scalability: one Markdown file adds a topic; nav, search, sitemap, prev/next, related update | 2 (content model) | Test in 5 (add a dummy topic, confirm, remove); 8 |
| Currency: scheduled job flags stale facts | 3 (`asOf` data), 6 (`freshness.yml`) | 6 dry run; 7 |
| Docs: `CONTRIBUTING.md` under two pages | 8 | 8 |
