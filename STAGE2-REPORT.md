# Stage 2 report: scaffold and design system

Direction: hybrid B + C, as approved. Schibsted Grotesk for headings and interface, Literata for long-form body.
Repository root: `/home/claude/site`. Snapshot: `snapshots/stage2-snapshot.zip`.

## What was built

| Area | Delivered |
|---|---|
| Project | Astro 5.18, TypeScript strict, static output, directory URLs, trailing slashes. Repository layout per TRD section 3. |
| Content model | `src/content.config.ts`: collections for pages, architecture, technologies, institutions (MDX prose), institutionData, facts, sources, glossary, relations, rails, platforms, nav, changelog. Zod schemas; the build rejects invalid content (it caught an over-long summary during this stage). |
| Fact system | `<Fact>` and `<Cite>` render sourced values with numbered citations and tooltips; a page must declare every fact it uses. Live facts render as links, never numbers. Draft facts are underlined and counted in the page's freshness badge. |
| Build gates | `scripts/check-facts.ts` (before the build) and `scripts/check-dist.ts` (after). Details below. |
| Styling | `@layer reset, tokens, base, layout, components, utilities` declared once. Tokens for light and dark in `tokens.css`, plus `prefers-contrast`. Print stylesheet. No inline styles anywhere, so the CSP's `style-src 'self'` holds. |
| Fonts | Self-hosted, OFL-licensed, cut by `scripts/subset-fonts.py` to the characters and weights used: Schibsted 36 KB, Literata 32 KB, plus tiny ₹ faces loaded only when needed. |
| Icons | One inline sprite of 18 Lucide icons. |
| Layouts | Base, Page, Topic, Institution, plus SectionOverview and TopicPage helpers. |
| Components | Every component in TRD section 6: header, click-open menus, mobile drawer, search, theme toggle, page header with breadcrumbs, table of contents with scroll-spy, topic index and cards, callouts, data table, fact, cite, source list, glossary tooltip (automatic on first use), sidenote, figure, code block, compare, pager, related, footer, freshness badge, institution card. Diagrams: sequence, click-through explainer, stack, flow, timeline, quadrant, rail map (rendered at build time) and relationship graph. All are shown on `/styleguide/`. |
| Sample content | Payment rails (introduction), Core banking system architecture, Messaging and streaming, the Architecture and Technologies overviews, and generated Glossary, Sources and Changelog pages. |
| Tooling | `scripts/serve.mjs` serves `dist/` like CloudFront: clean URLs, a real 404 status, and with `--prod` the planned security headers, CSP, Brotli compression and cache headers. |

## Verification, all from a clean build

| Check | Command | Result |
|---|---|---|
| Content gate | `npm run check-facts` | Pass. Proven to fail on 5 planted violations: unknown source, undeclared fact, TODO text, known error #1, forbidden string. |
| Types | `astro check` | 0 errors, 0 warnings, 0 hints |
| Build | `npm run build` | Pass; 11 pages; search indexes 9 (styleguide and 404 excluded) |
| Output gate | `check-dist` | Pass: no inline styles, no stray inline scripts, every internal link and anchor resolves. It caught a real missing anchor on the home page, now fixed. Records the theme script's CSP hash. |
| Overflow | `npm run test:responsive` | No horizontal scroll: 11 routes × 320, 360, 768, 1280, 1920 px × 2 themes |
| Accessibility | `npm run test:a11y` | axe (WCAG 2.2 A/AA plus best practice): zero violations of any severity, all routes, both themes, 1280 and 390 px, with search and drawer open. The first run found 44; fixed. |
| Contrast | `node tests/contrast.mjs` | 132 token pairs, light and dark: all pass. Lowest 3.10:1 (graphics); body ink 7:1 or better. Two border tokens were darkened to pass. |
| Behaviour | `node tests/behaviour.mjs` | 14/14: works without JavaScript; drawer traps and restores focus; `/` opens search; arrows select; Escape closes; menus keyboard-operable; theme persists without flash; glossary tip on focus |
| CSP | production headers, 4 pages with a live search | No console errors or CSP violations |
| Weight | `node tests/budgets.mjs` | JS 3.4 to 4.7 KB gzip per page (budget 50); CSS 10.3 KB (budget 40); 2 families, 2 preloads; largest HTML 13.5 KB |
| Lighthouse (mobile, throttled, CloudFront-like serving) | `LH_PROD=1 node tests/lighthouse.mjs` | Performance 98 to 99 (one run 95 from CPU noise), accessibility 100, best practices 100, SEO 100 on home, Payment rails, CBS and Messaging. CLS 0 to 0.002. **LCP 1.9 to 2.1 s against a 2.0 s budget: marginal.** |

`npm test` runs responsive, accessibility, contrast, behaviour and budgets in one go.

## Problems found and fixed this stage

1. Header buttons lost their accessible names on phones (hidden with `display: none`); now visually hidden but announced.
2. Code blocks were not keyboard-scrollable (the highlighter stripped `tabindex`).
3. The Menu button showed at desktop width. A cascade-layer ordering bug: a `layout` rule lost to a `components` rule. Moved into the right layer.
4. The header overflowed at 320 and 360 px.
5. `--rule-strong` borders on inputs were 2.3:1; now 3.4:1 (light) and 3.6:1 (dark).
6. Sequence and quadrant diagrams scaled up to fill wide columns; number badges overlapped labels.
7. Schibsted's tabular figures widened commas and full stops ("Gross , one"); tabular figures now apply to numeric columns only.
8. Escape cleared the search box instead of closing the search.
9. Fonts cut from 98 KB to 68 KB to bring LCP near budget.

## Decisions that differ from the brief

- **View transitions** use the browser's CSS cross-document transitions, not Astro's client router. That means zero JavaScript and no CSP risk; Firefox does a normal load. Scripts are written so the client router can be added in Stage 4b if you want in-place swaps.
- **Search** is a custom dialog on Pagefind's JavaScript API, not Pagefind's bundled interface, so it matches the design and needs no extra CSS.
- **Syntax highlighting** uses a sentinel-colour theme converted to classes, because Shiki's inline styles would break the CSP.
- **Status field.** Facts, glossary entries, relations, rails and institutions carry `status: draft | verified`. `check-facts --strict` (for release) fails on drafts, stale facts and missing locked topics.
- **Institutions** are structured data in `institutions.yaml` plus prose in MDX, joined by id.
- **Navigation** shows a group only once it has a page, so Decisions and risk and Governance appear when their pages exist. The home reading path marks unwritten pages "coming soon".

## Unverified or risky

- **LCP is at the budget line**, not under it with margin. The remaining delay is the stylesheet and font fetch on simulated slow 4G. Options for Stage 5: inline the critical CSS (needs a CSP hash for styles), or use `font-display: optional` for Literata, which conflicts with the TRD's `swap`.
- **Content is mostly draft.** 2 of 4 facts are verified (both from the RBI CTS circular). All 10 glossary definitions, the six rails rows and the map's stop descriptions are drafts, and the pages say so. Stage 3 resolves this.
- **`forbidden-strings.txt` is empty**, so employer-specific names are not checked yet. The build warns about this on every run.
- **Map legibility:** the "Payer's bank" label touches its line at desktop width. Mobile labels are about 13 px effective. Both are for Stage 4a.
- Lighthouse occasionally fails to record a trace (`NO_NAVSTART`); the script retries.
- Schibsted's tabular figures have a footed "1" that reads slightly mechanical in numeric columns. Within the brief, but worth your eye.

## What Stage 3 needs

1. Your approval of this stage, and any design changes.
2. The contents of `forbidden-strings.txt`: employer names, internal repository names, anything that must never appear.
3. Then Stage 3, the research and approval gate:
   - verify or drop every seeded fact, rails row, glossary definition and map stop;
   - research the 11 institutions and their relations;
   - work through the known-errors table and write `UNVERIFIED.md`.
