# Contributing

Everything on the site is plain files in `src/content` (prose) and `src/data` (facts and records). Adding content never needs code changes. Run `npm run build` before every commit: it refuses anything unsourced, broken or known to be wrong.

## Setup

```bash
npm ci
npx playwright install chromium      # only needed for the tests
npm run dev                          # http://localhost:4321
```

## Add a fact (do this first)

Every number, date, limit, named customer or named regulation must be a fact.

1. **Add the source** to `src/data/sources.yaml`: `id`, `title`, `publisher`, `url`, `type` (`primary`, `reputable-press`, `vendor` or `analyst`) and `accessed` (the day you opened it). Only list sources you have actually opened and read.
2. **Add the fact** to `src/data/facts.yaml`: `id`, `claim` (one plain sentence), optional `value` and `unit`, `asOf` (the date the fact was true), `source`, `volatility` (`static`, `annual`, `monthly` or `live`), `confidence` (`official`, `reported`, `vendor-claim` or `illustrative`) and `status: verified`.
3. **Declare it** in the page's frontmatter under `facts:` and use it in text:
   - `<Fact id="..." />` shows the value;
   - `<Fact id="..." show="claim" />` shows the sentence;
   - `<Cite fact="..." />` shows only the citation marker.

   A `live` fact always renders as a link to its source, never as a number.

## Add a page, topic or institution

- **Page:** `src/content/pages/<slug>.mdx` with `title`, `summary` (200 characters at most), `domain`, `order`, `updated`, `tags` and `facts`. To show it in the menus, add the slug to a group in `src/data/nav.yaml`.
- **Topic:** `src/content/architecture/<id>.mdx` or `src/content/technologies/<id>.mdx`. Frontmatter adds `topicId` (equal to the file name), `blurb` (140 characters at most) and `depth` (`intro`, `intermediate` or `advanced`), plus optional `related`. The card, search entry, sitemap, reading order and page transition appear automatically.
- **Institution:**
  1. Add the structured record to `src/data/institutions.yaml`: group, category, headquarters, established year, `employees` (with `asOf` and `source`) or `employeesNote`, roles, official URL and sources. Never estimate headcounts.
  2. Add relationships to `src/data/relations.yaml`, each with a source.
  3. Write the prose in `src/content/institutions/<id>.mdx`.

  The map, comparison table and page are generated from these files.

Every detail page starts with a three-sentence summary, explains a concept before its acronym, and labels patterns that describe no named organisation as illustrative.

## Add a glossary term

Add an entry to `src/data/glossary.yaml`: `id`, `term`, `expansion`, `definition` (240 characters at most), `domain`, `see`, `source` and `status`. Use `status: verified` only if the cited source supports the definition. The first use of the term on any page becomes a tooltip automatically. Set `autolink: false` for ordinary words, such as Circular.

## Add a diagram

Use the components available in every MDX file, inside a `<Figure title caption>`. Pick the one that fits:

- `BoxDiagram`: boxes, zones and arrows. Coordinates sit in a viewBox about 440 units wide; the build warns if a label will not fit.
- `Sequence` and `Explainer`: message flows between parties.
- `Stack`, `Flow` and `Timeline`: HTML diagrams that reflow on small screens.
- `Quadrant` and `CapacityChart`: positioned charts.

Every diagram needs a `title` and `desc`; text alternatives are generated from the same data. Never use inline `style` attributes: the security policy blocks them, and the build fails on them.

## How the checks work

| Check | What fails it |
|---|---|
| `check-facts` (before the build) | Unknown or undeclared facts or sources; a fact without source or `asOf`; TODO or lorem text; wrong `topicId`; any pattern in `src/data/known-errors.json`; any string in the optional, git-ignored `forbidden-strings.txt`. `--strict` also fails on drafts, stale facts and missing locked topics |
| Schemas (`src/content.config.ts`) | Missing fields, over-long summaries, bad dates |
| `astro check` | TypeScript errors |
| `check-dist` (after the build) | Inline styles or scripts, broken internal links or anchors, known errors in rendered text |
| `npm test` | Horizontal overflow at 320–1920 px; accessibility violations (axe); contrast; keyboard and no-JavaScript behaviour; weight budgets; CSP violations |
| `npm run test:search`, `test:lighthouse` | Glossary terms not ranked first; Lighthouse below target |

Long suites can be split with `CHUNK=0/4` (every fourth page) or narrowed with `ROUTES=/a/,/b/`.

## Keeping facts fresh

A weekly workflow opens an issue listing facts past their window: 45 days for monthly figures, 90 days for everything else. For each one:
1. Reopen the source.
2. Update `value`, `asOf` and the source's `accessed` date, or retire the fact.
3. Add a dated entry in `src/content/changelog/`.

## Deploying

Merges to `main` deploy automatically; see `RUNBOOK.md` for the one-time AWS setup, manual deploys and rollback.
