# Stage 4c report: Technologies

## What was built

| Item | Detail |
|---|---|
| Overview | All 12 topic cards grouped by depth (4 introductory, 6 intermediate, 2 advanced); "How to read this section"; a concept map placing each topic in its layer |
| Topics (locked IDs) | `core-platforms`, `databases`, `messaging` (rewritten), `integration`, `containers`, `cloud`, `security-tech`, `observability`, `ml-ai`, `mobile`, `languages`, `payment-tech` |
| Structure of every topic | Summary; why it matters; a landscape table; how to choose; trade-offs; pitfalls; design-review questions; related topics; sources |
| Length | 630–940 rendered words per topic; the brief sets no length for this section |
| Vendor names | Text only. The single Indian customer named is SBI (TCS BaNCS), which is sourced. Landscape "typical use" columns describe general patterns and say so |

## Facts added (102 in the ledger, 101 verified)

Nine new facts from 8 sources:
- **FREE-AI report:** RBI's press release (primary). An advisory committee report: 7 principles and 26 recommendations across 6 pillars.
- **Model risk drafts:** RBI's 2024 draft on credit models and its 24 June 2026 draft covering all models, AI and ML included. Both are marked draft on the page.
- **Authentication Directions, 2025:**
  - two factors for domestic digital payments from 1 April 2026;
  - at least one dynamic factor for payments other than card-present ones;
  - SMS OTP not discontinued;
  - validation of an extra factor for cross-border card-not-present payments by 1 October 2026.
- **Cloud regions in India:** from a third-party map, labelled "reported".
- **Finacle on EDB Postgres:** a 2019 vendor claim. This resolves a brief ledger item; no Indian bank is named.

## Verification (final clean build)

| Check | Result |
|---|---|
| `npm run build` | Pass, 31 pages; all 21 locked topics now exist |
| Overflow, all routes × 5 widths × 2 themes | Pass |
| axe, all routes, both themes, desktop and phone | 0 violations of any severity |
| Contrast | 132 pairs pass |
| Behaviour | 19/19 in 23 s, including all 21 cards opening their page and returning, with and without JavaScript |
| CSP, 10 Technologies pages under production headers | No errors or violations, including the highlighted code block |
| Lighthouse (mobile, production-like) | Overview 100/100/100/100, LCP 1.6 s; ML/AI 99/100/100/100, LCP 1.9 s; Payment tech 100/100/100/100, LCP 1.7–1.8 s |
| Budgets | 31/31 pages within budget |

## Problems found and fixed

1. **Unsourced claims resurfaced** in core platforms: "a handful of platforms run most banks" and "most large banks run on-premises". Reworded, as on Core systems.
2. **Seven summaries** were over 200 characters. Tightened.
3. **Arrowheads disappeared under zone labels** in the technology map. The router now shifts an arrow past any zone label it crosses, where the boxes' overlap allows. This also improved the security zones diagram.
4. **The drill-down test was slow and flaky.** The view-transition overlay briefly takes pointer events, so clicks retried until each animation ended. The test now runs under reduced motion, which switches transitions off; the animated path had already passed. The run time fell from over 280 s to 23 s.

## Unverified or risky

- **One noisy Lighthouse run.** Payment tech scored 88, with 440 ms of blocking time, in one run; two re-runs scored 100 with 0 ms. This matches earlier CPU noise on this machine, but it is reported rather than hidden.
- **A real, minor user effect.** For about 180 ms during a page transition, clicks are ignored. Invisible in normal use; noted for the Stage 5 motion audit.
- **AI and model risk.** Expectations rest on a committee report and drafts. The page says so and must be rechecked when RBI finalises them.
- **Authentication details** come from press and analyst summaries of RBI/2025-26/79, not the RBI text itself.
- **Sourcing gaps.** See `UNVERIFIED.md` for the full list.

## Next: Stage 4d

High-volume systems, Build vs buy and Limitations and known problems, including the client-side build-vs-buy scorer.
