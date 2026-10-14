# Stage 3 report: sources, fact ledger and institution data

Research ran on 28–29 September 2026 in two passes. Every source in `src/data/sources.yaml` was opened and read. Headcounts and volumes were never estimated. Supporting files:

- `research/notes.md`: working notes, one entry per source.
- `research/KNOWN-ERRORS-REVIEW.md`: all 24 known-error items, plus new errors found in the brief.
- `UNVERIFIED.md`: everything not yet confirmed, with where to check.

## Ledger at a glance

| | Count |
|---|---|
| Sources | 40 |
| Sources by type | 29 primary, 5 reputable press, 4 analyst, 2 vendor |
| Facts | 65 (64 verified, 1 draft: the live link-out to RBI's payment indicators) |
| Facts by confidence | 42 official, 20 reported, 3 vendor claim |
| Institutions | 12 (the 11 in the brief plus RBI as the map's centre); 8 fully verified; RBI, ReBIT, IFTAS and CERSAI each have a field still open |
| Relations | 16, all sourced; 6 candidate edges dropped |
| Glossary | 129 terms (the full seed list except DLS); 25 verified, 104 draft |
| Known-error items | 24 reviewed: 7 false, 3 stale or outdated, 2 partly true, 2 true, 10 not checked or policy |

`npm run build` and `npm test` pass on this data. The first build of this stage failed because a styleguide citation still pointed at a superseded source; the citation guard caught it, and it is fixed.

## Verified groupings (replacing the brief's categories)

| Group | Institutions | Basis |
|---|---|---|
| Wholly owned by RBI | DICGC, BRBNMPL, ReBIT, IFTAS, RBIH | Each body's own site or RBI's own notices |
| Set up by RBI or at its instance, not owned by it | IDRBT (society, 1996), NPCI (bank-owned, 2008), CCIL (bank- and institution-owned, 2001) | IDRBT; ICRA; CCIL |
| Owned by the Government of India | NABARD and NHB (RBI stakes sold in 2019), CERSAI (Government company) | RBI press release, 24 Apr 2019; RBI circular, 25 May 2011 |

The brief's instruction "do not call NPCI a subsidiary" is confirmed. The brief's "RBI subsidiaries and promoted institutions" framing is also wrong for NABARD, NHB and CERSAI.

## Corrections to the brief

1. **CTS Phase 2** was postponed until further notice (RBI, 24 Dec 2025). It did not start on 3 January 2026.
2. **CTS sessions** are now 09:00–15:00 for presentation and 09:00–19:00 for confirmation, not 10:00–16:00.
3. **UPI's record month** is August 2026: 24.51 billion transactions, ₹29.82 trillion, 791 million a day. It is not July.
4. **NABARD and NHB** have been fully Government-owned since 2019 (known error #19 said 2023).
5. **CERSAI** is a Government company, not RBI-promoted (#20). Since 2016 it has also run the Central KYC Records Registry.
6. **IDRBT** is a registered society, not a deemed university (#18).
7. **NABARD** had 3,134 staff (31 Mar 2024), not ~28,000 (#15).
8. **NFS** connected 2.61 lakh ATMs (Jul 2024), not 1.2 million (#8).
9. **Card-network enforcement** (#9) was business restrictions on American Express, Diners Club and Mastercard, not fines; Visa was not named.
10. **Finacle** is branded "Infosys Finacle" by the vendor itself and developed by EdgeVerve Systems (#2 partly true). The build pattern was relaxed; the writing rule is to name EdgeVerve as maker.
11. **"RBI Cloud Policy 2023"** does not appear to exist. The two 2023 IT Master Directions are verified (#11, partly).
12. **DICGC premiums** became risk-based from 1 April 2026. Cover is still ₹5 lakh.
13. **Relation edges:** the IFTAS–CCIL link has no source and was dropped. SFMS supports settlement of government securities instead.
14. **Official sources conflict** in two places, and both are recorded:
    - NFS handover: October 2009 (IDRBT) against 14 December 2009 (NPCI).
    - NABARD staff: 3,134 against 3,153.

Confirmed as the brief stated:
- SBI on TCS BaNCS (#1).
- NEFT's 48 half-hourly batches, as of the 2019 circular (#21).
- Positive Pay from ₹50,000, with nuance (#23).
- UPI's new person-to-merchant limits (#4).

## The ten facts I am least sure of

| # | Fact | Why |
|---|---|---|
| 1 | `cts-phase2-postponed` | Still-postponed status rests on the absence of a later notice |
| 2 | `neft-48-batches-2019` | The source circular is marked withdrawn; the rule may have moved or changed |
| 3 | `sbi-bancs` | Vendor claim from 2021; the extension period ends around now |
| 4 | `dicgc-rbp-2026` | Analyst report; DICGC's circular not opened |
| 5 | `npci-2008`, `npci-shareholding-2025` | ICRA rating rationale, because NPCI's site is unreadable to automation |
| 6 | `upi-p2m-limits-2025` and related | Public broadcasters reporting NPCI's circular, not the circular |
| 7 | `nfs-npci-2009` | Two official sources disagree on the month |
| 8 | `certin-6h-2022` | Law-firm analysis; CERT-In's PDF not opened |
| 9 | `ccil-shareholders` | CARE rating report; percentages change over time |
| 10 | `rbi-md-itgrc-2023`, `rbi-md-it-outsourcing-2023` | Titles may have changed in RBI's consolidation of directions |

## Content changed in this stage

- Payment rails: the cheque section now states the postponed Phase 2 and the current session hours.
- Home: headline figure updated to August 2026.
- Rail map: NPCI and IFTAS descriptions tightened to what the sources say.
- The map now links to an institution page only once that page exists, so it can never produce a broken link.
- Build gate: new patterns for the verified errors #5, #9, #11, #15, #18, #19 and #20, plus Phase 2 "began" wording. Patterns #2 and #21 were retired because the claims are now handled through sourced facts.

## Limits of this stage

- NPCI's website renders blank to automated browsers. NPCI facts rest on NPCI PDFs, ICRA and press reports.
- 104 glossary definitions are drafts. The glossary page must mark drafts, or hide them, before publishing (Stage 4e).
- Ten of the twelve institutions have no sourced headcount. None is estimated; each shows "not yet sourced".
- DLS was dropped from the glossary. `forbidden-strings.txt` stays empty at the owner's direction, so only the known-error patterns are enforced.

## What Stage 4a needs

- Approval of this ledger. This is the brief's gate before any page prose.
- Stage 4a (Home, Core systems, Payment rails) can then draw on the verified facts for:
  - CTS, NEFT, RTGS, UPI volumes and limits, and Positive Pay;
  - the data-localisation enforcement;
  - SBI and BaNCS, and Finacle with EdgeVerve.
- Rows still in draft (IMPS, UPI and NACH details) will be marked "awaiting verification" on the page, or sourced first.
