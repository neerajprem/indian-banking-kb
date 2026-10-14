# Stage 7 review

An independent pass over the finished site, done in the four roles the brief asks for: hostile fact-checker, accessibility auditor, designer and security reviewer. Every finding was fixed or is listed under remaining risks. All results come from the final build (47 pages) on 29 September 2026.

## Findings

| # | Severity | Area | Finding | Fix | Status |
|---|---|---|---|---|---|
| F1 | Medium | Facts | Draft glossary definition of NPA stated a regulatory figure ("usually 90 days") with no source | Figure removed until sourced | Fixed |
| F2 | Low | Facts | The only draft fact (link to RBI's payment indicators) had never been opened | Page opened; it also confirmed RBI as operator of RTGS and NEFT, so two rails-table cells were upgraded | Fixed; ledger now 116/116 verified |
| F3 | Info | Facts | Automated audit extracted every figure outside a sourced fact: 550 candidates | All reviewed. The rest are sourced records (institution cards, relation labels, the Sources table), cited table rows, or explicit examples ("such as 99.9%") | Reviewed |
| F4 | Info | Facts | Ten randomly chosen sources re-opened | 7 re-opened with the claim's key terms present. TCS now returns HTTP 403 to automated requests; RBI's IFTAS notice renders client-side; one had no testable keyword. The claims were read when first researched | Recorded |
| F5 | Medium | Content | Known-error gate blocked correction notes that repeated a wrong claim verbatim | Notes reworded to explain the correction without restating the error; gate kept strict | Fixed |
| D1 | Medium | Design | Institution pages showed the wrong domain in the breadcrumb ("Foundations" for NPCI) | Page chrome always uses Governance; group colour only on the category tag | Fixed |
| D2 | Low | Design | Glossary badge said "No sourced figures" while citing 25 sources | Badge falls back to "Sources last checked" when a page cites sources but no facts | Fixed |
| D3 | Low | Design | Capacity chart labels overlapped on phones; relationship-map names overflowed their circles | Labels repositioned; nodes enlarged; hub given its own size | Fixed |
| D4 | Low | Design | Arrowheads hidden under zone labels in box diagrams | Router steers arrows around zone labels where there is room | Fixed |
| A1 | None found | Accessibility | axe (WCAG 2.2 A/AA and best practice) on all 47 pages, both themes, desktop and phone, with search and menu open | Nothing to fix | Pass: 0 violations of any severity |
| A2 | None found | Accessibility | Keyboard: menu drawer focus trap and return, `/` search, arrow keys, Escape, nav menus, glossary tooltips, build-vs-buy scorer, all 21 topic cards with and without JavaScript | Nothing to fix | Pass: 20/20 behaviour checks |
| A3 | None found | Accessibility | Every SVG with `role="img"` has a title and description; every diagram has a text alternative | Nothing to fix | Pass |
| S1 | High (accepted) | Security | `npm audit`: 1 critical and 1 high in Astro 5 and its bundled `sharp`; 2 low. The advisories concern `define:vars`, server islands, image processing and the dev server, none of which this static site uses (verified: 0 uses, static output, 0 processed images). Already on the newest Astro 5 (5.18.2); npm's fix is Astro 7 | Accepted for now; the CI audit reports without blocking; Dependabot added | Open, see risks |
| S2 | None found | Security | Headers and CSP under production settings, on 20 pages across two runs | Nothing to fix | Pass: no violations or console errors |
| S3 | None found | Security | External links: all 0 of them lacking `noopener`; secrets scan for AWS, GitHub, Slack and private keys | Nothing to fix | Pass |

## Final scores

| Check | Result |
|---|---|
| Build (fact gate, `astro check`, build, search index, output gate) | Pass; `check-facts --strict` also passes |
| Facts | 116 of 116 verified, from 65 opened sources: 78 official, 34 reported, 4 vendor claims |
| Overflow, 53 routes × 5 widths × 2 themes | 0 failures |
| Accessibility | 0 violations of any severity |
| Contrast | 132 of 132 token pairs pass; lowest 3.10:1 for graphics; body ink at least 7:1 |
| Behaviour | 20 of 20 |
| Search | 129 of 129 glossary terms return their entry first |
| Print | 3 long pages print with the site chrome hidden |
| Lighthouse (mobile, production-like) | Home 99; Payment rails 99; CBS topic 100; RBI ecosystem 99; Glossary 98. Accessibility, best practices and SEO are 100 on all five. LCP 1.6–2.0 s; CLS 0 |
| Budgets | 47 of 47 pages: JS at most 4.4 KB, CSS 11.4 KB, HTML at most 26.6 KB (gzip) |
| Scalability | One new MDX file produced the page, its card, sitemap entry, search entry, reading-order link and transition name, with no code changes (tested, then removed) |
| 404 | The local server, configured like CloudFront, returns HTTP 404 with the custom page |

## Anti-pattern checklist (03-DESIGN section 6)

No middle-dot metadata strings, emoji icons, "Read more →" links, uppercase eyebrow labels, gradient hero numbers or single-coloured headline words, in the built HTML or the CSS. Cards use rules and spacing, not identical shadowed tiles. The single memorable element is the rail map; everything else is quiet.

## Remaining risks, stated plainly

1. **Astro advisories (S1).** Not exploitable in this static configuration, but they will stay flagged until the site moves to a newer Astro major version. Plan that upgrade as its own change, with the full test suite as the safety net.
2. **Glossary drafts.** 104 of 129 definitions have no opened source yet. They are labelled "Awaiting source" on the page.
3. **Time-sensitive facts:**
   - CTS Phase 2 is still postponed (no later RBI notice found, which is not proof there is none).
   - NEFT's 48 batches comes from a circular RBI now lists as consolidated.
   - The SBI–TCS extension period is ending.
   - RBI's model risk guidance is in draft.
   - DICGC's cover proposal was pending.

   See `UNVERIFIED.md`.
4. **Employer-specific content** is checked only by the known-error patterns, because `forbidden-strings.txt` is empty at the owner's direction.
5. **Deployment is unexercised.** Artefacts, workflows and the runbook are complete and syntax-checked, but nothing was deployed to a real AWS account.
6. **Manual screen-reader testing** was not done. Automated checks cover roles, names and text alternatives, not the listening experience.
7. **LCP on the glossary** is exactly at the 2.0 s budget in the throttled test.
