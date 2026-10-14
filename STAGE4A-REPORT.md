# Stage 4a report: Home, Core systems, Payment rails

## What was built

| Page | Contents |
|---|---|
| Home | The rail map; both UPI headline figures (volume and daily average) with a link to RBI's live indicators; reading path; directory; "How to use this site"; independence note |
| Core systems | What a CBS is and why "core" means centralised; the layered stack; a table of the surrounding systems; the platform landscape with sourced users only; the EOD and BOD cycle and why 24x7 payments strain it; deployment models; why cores are hard to change |
| Payment rails | The rails table (9 rails, draft rows labelled) and side-by-side compare; gross versus net with a worked example; RTGS and NEFT; IMPS and UPI; participant roles; device binding and PIN; the 7-step UPI explainer; the UPI limits table; UPI variants and credit on UPI; failed transactions with RBI's reversal deadlines; NACH; cards, tokenisation and NFS; data localisation enforcement; cheque clearing and Positive Pay; BBPS; SFMS, INFINET and SWIFT; Account Aggregators; "which rail for which job" |

New components: `RailsTable`, `NetVsGross` (worked example), source markers on `DataTable`, and a rehype plugin that wraps any plain Markdown table in a scroll container.

## Facts added (82 in the ledger, 81 verified)

17 new facts from 8 new sources, researched this stage:
- RBI's failed-transaction rules (RBI/2019-20/67);
- card-data storage restrictions (RBI/2022-2023/95);
- the RTGS FAQ;
- the Account Aggregator Master Direction, plus the Department of Financial Services and a SEBI paper;
- credit lines and RuPay credit cards on UPI;
- IFTAS's community cloud providing core banking.

No Indian Finacle customer was confirmed from an opened source, so the Core systems page names only SBI on TCS BaNCS as a sourced user.

## Verification

| Check | Result |
|---|---|
| `npm run build` (fact gate, types, build, search, output gate) | Pass, 12 pages |
| Known-error gate | Pass. Two false positives found and fixed (see below); a planted "SBI runs Finacle" is still caught |
| Overflow, 12 routes × 5 widths × 2 themes | Pass |
| axe, all routes, both themes, desktop and phone | 0 violations of any severity, after fixing a skipped heading level in the new diagram |
| Contrast | 132 pairs pass |
| Behaviour (no-JS, keyboard, theme) | 15/15; the rail-count test now reads the data file |
| Lighthouse, mobile, production-like serving | Home 99 / 100 / 100 / 100, LCP 1.8 s; Core systems 99 / 100 / 100 / 100, LCP 1.8 s; Payment rails 99 / 100 / 100 / 100, LCP 1.9 s |
| Budgets | JS ≤ 4.1 KB, CSS 10.7 KB, largest HTML 18.3 KB (all gzip) |

## Problems found and fixed

1. **Known-error pattern #1 matched a fact id.** `sbi-bancs` sat next to `finacle-edgeverve`. The pattern now ignores hyphenated ids.
2. **Output checker matched across table cells.** Block boundaries now become line breaks when text is extracted. A negative test confirms real errors are still caught.
3. **Duplicate citation markers** in tables (two facts, one source). Markers are now deduplicated by source.
4. **Paragraphs lost their spacing** when they began with a `<Fact>`, because MDX treats such lines as blocks. Wrapped in explicit paragraphs.
5. **Diagram pills and flow boxes were misaligned** because the article's list-item spacing applied inside diagrams. Scoped out.
6. **The flow diagram was cramped** in the text column. It is now wide, with the badge above the label and a horizontal breakpoint at 600 px.
7. **Skipped heading level** (h2 to h4) in the gross-versus-net diagram. Fixed.

## Known errors 1–9 on these pages

- **#1, #2:** SBI on BaNCS; Finacle attributed to EdgeVerve.
- **#3:** August 2026 volumes only.
- **#4:** UPI limits table by category.
- **#5:** continuous cheque clearing, with Phase 2 postponed.
- **#6:** nothing about NPCI's internal implementation; the explainer is labelled "simplified and illustrative".
- **#7:** UPI Lite and 123PAY limits link to NPCI instead of stating numbers.
- **#8:** NFS 2.61 lakh ATMs; no RuPay share.
- **#9:** restrictions, not fines, naming American Express, Diners Club and Mastercard.

## Unverified or risky

- **General-knowledge claims without a citation.** These pages include a few structural descriptions with no number, date or regulation: device binding, the NACH mandate model, BBPS interoperability, merchant-bound card tokens, the UPI participant roles and core-banking practices such as stand-in processing. Added to `UNVERIFIED.md` for sourcing.
- **Draft rails rows.** IMPS, UPI, NACH, BBPS and the cards row still show "awaiting verification" in the table.
- **UPI limits.** The ceilings rest on public-broadcaster reports of NPCI's circular. The table says where categories are incomplete.
- **Rails table on phones.** The nine-row table scrolls sideways on phones. Stacked cards below 640 px would read better; proposed for Stage 5.

## Next: Stage 4b

Architecture: the overview and all nine topic pages. The existing `cbs` topic will be expanded, and the Core systems page already links to it.
