# Stage 1 report: design exploration

Three standalone mockups, all on a white base, built from one shared content module so that only the design differs.

| File | Direction | Signature element |
|---|---|---|
| `a-security-print.html` | A: Security Print | Generated guilloché rosette that draws once and turns slightly with the pointer; microtext frame; wave dividers |
| `b-rail-map.html` | B: Rail Map | Interactive transit map of seven rails and nine stops. Click a rail to isolate it; click or press Enter on a stop to open its summary. Vertical map on phones |
| `c-field-guide.html` | C: Field Guide | Click-through UPI explainer: sequence diagram plus seven numbered steps with Previous and Next. Margin sidenotes that become tap-to-open notes on smaller screens |

Each mockup contains the home hero, a long content section (heading, two paragraphs, a figure with a two-panel diagram, a captioned table, a callout, a citation and sidenote treatment), the nine Architecture topics, header navigation with click-to-open menus, light and dark themes, a source list and the footer.

## Verification (run, not assumed)

| Check | Result |
|---|---|
| Horizontal overflow at 1440, 390 and 360 px, light and dark | None on all three mockups (`scrollWidth` equals viewport width) |
| axe, critical and serious issues, 1440 and 390 px, light and dark | Zero on all three after one fix (A's decorative microtext failed contrast at 4.22:1; darkened) |
| Keyboard | B: a stop opens its panel with Enter; rails isolate by button. C: steps and Next/Previous are buttons |
| Reduced motion | All screenshots taken with reduced motion on; draw-in animations and pointer turning are disabled by CSS and JS |
| No JavaScript | C shows all seven steps as a static numbered list. **B's map and A's rosette are empty without JS** (B keeps a text version of the map) |
| Screenshots | 24 screenshots plus three contact sheets in `shots/` |

## Scores

1 to 5; higher is better. For the two risk rows, 5 means lowest risk.

| Criterion | A Security Print | B Rail Map | C Field Guide |
|---|---|---|---|
| Memorability | 4 | 5 | 3 |
| Clarity of hierarchy | 4 | 4 | 5 |
| Suitability for long reading | 4 | 3 | 5 |
| Feasibility on mobile | 5 | 3 | 4 |
| Accessibility risk | 4 | 3 | 4 |
| Implementation risk | 4 | 2 | 4 |
| Fit with "calm, technical, modern" | 2 | 5 | 4 |
| **Total (of 35)** | **27** | **25** | **29** |

## Recommendation: hybrid of B and C, without A

The rail map is the only signature that explains the subject instead of decorating it, and it suits "technical, modern" and the interactive knowledge base you asked for. C gives the calmest, most readable content pages, and its click-through explainer and margin notes match your click-first, low-density preferences. A's rosette is attractive but decorative: it would be the memorable thing without teaching anything, and it pulls the site towards "ornate" rather than "calm". So: B's map as the home hero and, simplified, as the RBI relationship map; C's explainer on the Payment rails page; C's sidenotes and contents-by-depth layout for topic overviews; no security-print texture anywhere (the Chanel rule). The combination stays coherent because both use the same white surfaces, one accent, a single rail and domain colour system, and the same two typefaces.

### Proposed system for the hybrid

**Fonts (two families):** Schibsted Grotesk for headings, navigation, map labels, tables and numerals; Literata for long-form body text only. If you would rather have all-sans body text, like DigitalOcean's docs, swap Literata for Inter Tight; the rest of the system is unchanged.

**Colour tokens**

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0F1522` |
| `--surface` | `#F4F5F8` | `#18213A` |
| `--ink` | `#141925` | `#E8EBF3` |
| `--ink-2` (secondary text) | `#4A5163` | `#AAB2C6` |
| `--ink-3` (tertiary text) | `#687084` | `#8A93AA` |
| `--rule` | `#E1E4EA` | `#27314A` |
| `--rule-strong` | `#A3AAB8` | `#4A5677` |
| `--accent` (UI, links, focus) | `#6A3EC2` | `#A68CF2` |
| `--accent-ink` (text-safe) | `#5A30AE` | `#B9A4F7` |
| Rail: UPI | `#6A3EC2` | `#A68CF2` |
| Rail: IMPS | `#D4460E` | `#FF8A4F` |
| Rail: CTS | `#A86400` | `#F0B24B` |
| Rail: NACH | `#2A8636` | `#63CF70` |
| Rail: cards and ATMs | `#C01E58` | `#FF6FA1` |
| Rail: RTGS | `#0B6C7D` | `#3FC6D8` |
| Rail: NEFT | `#1A62CC` | `#62A5FF` |
| Settlement (dashed) | `#8A91A0` | `#76809A` |
| Domain: Foundations / Design / Decisions and risk / Governance / Reference | NEFT blue / UPI violet / CTS ochre / RTGS teal / `--ink-2` | dark equivalents |

Rail colours meet 3:1 as graphics on their background. They are not used as text; Stage 2 adds text-safe variants where a domain colour labels text (ochre in particular).

**Shape and spacing:** two radii only: 8 px for controls, 14 px for panels. Borders before shadows; one overlay shadow for menus. Spacing on a 4 px base: 4, 8, 12, 16, 24, 32, 48, 64, 96. Content container 1240 px; reading measure 68ch; sidenote margin 17rem from 1100 px wide, inline notes below that. Type scale as in 03-DESIGN, ratio about 1.25.

## Checklist results, stated honestly

**Anti-patterns:** none of the listed patterns remain. Two were caught and fixed during review: B's first card grid was the "identical rounded cards" pattern (now route-line entries with a 2 × 2 lead), and A had a chevron on every card (removed). No all-caps labels, middle-dot metadata, one-word headline accents, big-number heroes, emoji icons or monospace labels.

**Failures and open issues**

1. B's map and A's rosette are drawn by JavaScript. In the real site the map must be rendered to SVG at build time, with JavaScript only adding interaction.
2. B's station labels on a 390 px phone render at about 13 px, just under the 14 px diagram-label rule. The mobile map needs a slightly narrower layout or shorter labels.
3. B's lead topic card has empty space at 1440 px.
4. C's first screen at 1440 px has no visual; the explainer starts below the fold (the key UPI fact is on the first screen, which meets the minimum).
5. A's microtext is 6.5 px decorative text; acceptable only because A is not recommended.
6. The theme choice is not remembered between visits in the mockups (added in Stage 2).
7. The "three words" stranger test cannot be run by me; please judge it yourself.

**Content used in the mockups:** the CTS details (4 October 2025 start, hourly settlement on realisation) match the RBI circular text. Everything else is realistic but not yet re-verified, including the UPI July 2026 figure, the rails table, and the map's claims that NPCI runs the cheque clearing grids and that IFTAS runs SFMS and INFINET. All are flagged for the Stage 3 fact ledger.
