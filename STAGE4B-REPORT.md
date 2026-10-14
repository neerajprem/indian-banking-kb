# Stage 4b report: Architecture

## What was built

| Item | Detail |
|---|---|
| Overview | All nine topic cards first, grouped by depth (3 introductory, 4 intermediate, 2 advanced); "How to read this section"; a map of how the topics connect |
| Topics (locked IDs) | `cbs`, `payments`, `api-first`, `event-driven`, `data`, `modernisation`, `security`, `multi-dc`, `hybrid-cloud` |
| Structure of every topic | Three-sentence summary; why it matters; the model explained; diagrams; how it plays out in Indian banking; trade-offs; failure modes; when to use or avoid; questions for a design review; related topics; sources |
| Length | 900–986 words of rendered text per topic (measured; brief asks 900–1,600) |
| Diagrams | 16 SVG diagrams in total: 11 box diagrams (including the overview map), 4 sequence diagrams and 1 quadrant; every topic has at least one. Every diagram has a title, description and generated text alternative |
| New component | `BoxDiagram`: boxes, zones and arrows from data, at build time; CSP-safe (attributes only); automatic routing; automatic text alternative; build-time label fit check |
| Drill-down | Cards are real links; each topic is its own URL; a card's title morphs into the page heading through a generated `/vt.css` (off under reduced motion); a clear "All architecture topics" back link |
| Cross-links | Core systems links to `cbs`, `modernisation`, `multi-dc` and `hybrid-cloud`; Payment rails links to `payments` |

## Facts added (93 in the ledger, 92 verified)

11 new facts from the full text of RBI's IT Governance Master Direction (read in full) and its IT Outsourcing Direction:
- defining RPO and RTO;
- aiming for near-zero RPO;
- half-yearly DR drills covering a full working day at the DR site;
- identical configurations and patches at both sites;
- tested restores;
- cloud as outsourcing, with lifecycle and shared-responsibility requirements;
- exit strategies;
- 6-hour reporting of service-provider incidents.

**Known error #10 is now resolved: false as stated.** The Direction sets no fixed RPO or RTO values. The multi-DC page says so in a callout.

## Verification (final clean build)

| Check | Result |
|---|---|
| `npm run build` | Pass, 20 pages; fact gate, types, output gate and links all pass |
| Overflow, all routes × 5 widths × 2 themes (4 chunks) | Pass |
| axe, all routes, both themes, desktop and phone, plus open search and drawer (3 chunks) | 0 violations of any severity |
| Contrast | 132 pairs pass |
| Behaviour | 19/19, including new drill-down checks: all 9 cards open their page and return, with and without JavaScript |
| CSP, production headers, 10 pages including 4 architecture pages | No console errors or violations |
| Lighthouse (mobile, production-like serving) | Overview 99 / 100 / 100 / 100, LCP 1.8 s; Security 99 / 100 / 100 / 100, LCP 1.8 s; Payments 100 / 100 / 100 / 100, LCP 1.7 s |
| Budgets | JS 3.4 KB, CSS 10.9 KB, topic HTML 8.4–9.9 KB (gzip) |

## Problems found and fixed

1. **Overview cards overlapped** the next column: a class name (`wide`) collided with the figure-bleed rule. Renamed.
2. **Arrows ran diagonally to box corners.** The router now decides direction by whether boxes are stacked and clamps each end toward the other box.
3. **Zone labels were crossed by arrows**, and one arrow label collided with a box. Zone labels are now drawn on top with a halo; that meaning moved into the caption.
4. **Diagrams were illegible on phones** (text scaled to about 11 px). Diagrams now go full width under 640 px, with larger text. The build picks one size per diagram, the largest at which every label fits. All 11 box diagrams now render at 16–18 px (about 13–15 px on screen). Three boxes were widened and one label split so no diagram is stuck at the smallest size.
5. **Topics were too short** (480–670 words of prose). A design-review checklist was added to every topic, plus one substantive section in five topics. All are now in range.
6. **Eight summaries exceeded 200 characters.** Tightened.
7. **Test harness:**
   - `pkill -f` was killing its own shell, which explains the silent failures last turn.
   - Background jobs do not survive between commands here, so the long tests now run in chunks (`CHUNK=i/n`).
   - A new `tests/csp.mjs` makes the CSP check repeatable.

## Unverified or risky

- **Industry-pattern descriptions are uncited by design.** This covers the generic architecture patterns (strangler fig, outbox, split-brain, HSM use, zero trust and so on). They are standard, labelled illustrative, and state no numbers or named organisations.
- **Specific practices are generic.** Statements such as "PINs are checked inside HSMs" or "large banks run the core in their own data centres" describe common practice, not any named bank.
- **Reading-time estimates run low** (3–4 minutes for about 900 words), because JSX is stripped before counting. Proposed fix in Stage 5.
- **Technologies still shows one card.** It will look sparse until Stage 4c adds the other eleven topics.

## Next: Stage 4c

Technologies: the overview and twelve topics, each with a landscape table, how to choose, trade-offs and pitfalls. Indian customers are named only where publicly sourced.
