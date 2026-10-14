# Unverified claims

Nothing listed here may appear on the site as fact until it is confirmed from an opened source and added to `src/data/facts.yaml`. Last updated 29 September 2026 (end of Stage 3).

## Time-sensitive: recheck before the relevant page is published

| Claim | Why it is here | Where to check |
|---|---|---|
| CTS Phase 2 is still postponed | No later RBI notice was found up to 29 Sep 2026; absence is not proof | RBI notifications, filtered by Department of Payment and Settlement Systems |
| NEFT runs 48 half-hourly batches today | The December 2019 circular is now listed as withdrawn (consolidated) | RBI Master Direction or current procedural guidelines for NEFT |
| SBI still runs TCS BaNCS | The 2021 five-year extension ends around 2026 | SBI annual report 2025-26; TCS or SBI announcements |
| DICGC cover is still ₹5 lakh | A ₹7.5 lakh proposal was awaiting approval in June 2026 | dicgc.org.in; Ministry of Finance notifications |
| DICGC risk-based premium in force from 1 April 2026 | Analyst and press reports only; the DICGC circular was not opened | DICGC circular S1803/04-01-046/2025-2026 |
| RBI IT Governance and IT Outsourcing Master Directions under these titles | RBI has been consolidating and withdrawing older instruments | RBI Master Directions index |
| NABARD staff figure | A 2024-25 annual report exists | NABARD Annual Report 2024-25, chapter 9 |
| Finacle reach (100+ countries, 1.3 billion accounts) | Vendor claim from 2020 | EdgeVerve or Finacle site, latest figure |

## Institutions

| Institution | Field | Status |
|---|---|---|
| ReBIT | Headquarters, year established (reported as 2016) | Only third-party sites; ReBIT's site renders client-side |
| IFTAS | Headquarters, incorporation date | Not found on an official page opened |
| CERSAI | Headquarters (reported New Delhi), shareholding (reported 51% Government plus NHB and public-sector banks) | Wikipedia only |
| RBI | Year established, staff strength | Not researched in this pass (well known, but still needs a source) |
| NPCI | Current registered office (Mumbai is confirmed only from a 2009 letterhead); staff strength | npci.org.in renders blank to automated browsers; try its annual report PDF |
| All except NABARD | Employee size | Marked "not yet sourced". Next places to look: annual reports of NPCI, CCIL, NHB, BRBNMPL and DICGC; RBI Annual Report for its own staff |

## Payment rails table

| Row | What is unconfirmed |
|---|---|
| RTGS | "RBI operates"; "typical use" |
| NEFT | "typical use" |
| IMPS, UPI, NACH | Operator, settlement description and typical use (NPCI pages not readable automatically) |
| CTS | "typical use" |

## Brief ledger items not reached

1. UPI: May 2026 at 2,320 crore. This is consistent with the 23.2 billion reported by Business Standard, but the ledger's source was not opened.
2. UPI: banks live rose from 44 in 2016-17 to 703 in 2025-26. A press report says 752 live banks, but the source was not opened.
3. UPI: January 2026 at 21.7 billion; December 2025 at 21.63 billion; February 2026 at 20.39 billion.
4. UPI app shares, December 2025 (PhonePe, Google Pay, Paytm).
5. BaNCS users other than SBI: Bank of Maharashtra, Central Bank of India, Indian Bank.
6. Finacle users: Bank of Baroda (EdgeVerve case study) and IndusInd Bank (Moneylife).
7. Some Finacle modules migrated to EDB Postgres in 2019.
8. UPI P2M limits for jewellery and business collections, and the "no daily cap" wording.

## Known-error items not researched

Items #6, 7, 8 (RuPay share), 10, 12, 13, 16, 17 and 22. They stay blocked or omitted; see `research/KNOWN-ERRORS-REVIEW.md`.

## Glossary

104 of 129 definitions are drafts. Their wording is standard, but no opened source has confirmed each one yet. Priority for Stage 4e:
- **Regulators:** SEBI, IRDAI, PFRDA, FIU-IND, UIDAI and MeitY, from each body's own "about" page.
- **NPCI products:** UPI, IMPS, NACH, BBPS, APB, NETC, BHIM, RuPay and UPI Lite, from NPCI product pages. These need a browser that NPCI will serve, or NPCI's PDFs.
- **RBI terms:** CRR, SLR, LAF, MSF, NPA, PCA and PSL, from RBI's Shabdavali glossary or the relevant Master Directions.

## Relations dropped for lack of a source

- NPCI members connect over INFINET for some flows.
- RBIH's ULI and NPCI's UPI as complementary public infrastructure. This is an interpretation, not a sourced relation.
- NABARD data flows into ULI.
- CCIL settles through banks' accounts at RBI.
- IFTAS's link with CCIL (see known-errors review, new error 5).
- NHB and public-sector banks as shareholders of CERSAI.

## Structural descriptions written in Stage 4a without a citation

These state no number, date, limit or named regulation, but should still be backed by a source before Stage 7.

- UPI device binding ties an app to the phone and SIM; the UPI PIN authorises each payment.
- UPI participant roles: payer's bank, app (bank or TPAP working through PSP banks), NPCI switch, payee's bank.
- NACH collections run under a mandate authorised once by the customer; files are processed in batches.
- BBPS lets a biller connect once and be paid through every participating channel.
- A card-on-file token works only for the merchant it was issued for (bank FAQs say this; RBI text not yet opened for it).
- Core banking practices: stand-in processing with shadow balances during EOD; splitting batch jobs.
- IMPS came before UPI and is used with an account number and IFSC.

## Stage 4c notes

- **Cloud regions in India** come from a third-party infrastructure map. Confirm on each provider's own region page before relying on them.
- **The 2025 authentication Directions** are sourced from press reports of RBI's statement (The Tribune, Business Standard) and a KPMG summary. The Direction's own text (RBI/2025-26/79) was not opened; read it before the Regulators page.
- **RBI model-risk guidance** (drafts of August 2024 and June 2026) comes from press and law-firm summaries. Check whether a final version has been issued.
- **The FREE-AI report** is confirmed from RBI's press release; the full report PDF was not read.
- **Technology landscape tables** describe typical uses as general industry patterns, not claims about named banks. No Indian customer is named except SBI on TCS BaNCS.
- **UPI integration** ("specifications, libraries and certification") is described generically, because NPCI's pages could not be read automatically.

## Added in Stage 4c

| Claim | Status | Where to check |
|---|---|---|
| RBI model risk guidance (draft of 24 June 2026) | Draft for comment; final version not found | RBI notifications and press releases |
| FREE-AI recommendations becoming RBI instruments | Advisory committee report only | RBI circulars and Master Directions |
| Cloud regions in India per provider | Third-party map; not confirmed on provider pages | Each provider's official region list |
| Authentication Directions details (dynamic factor rule) | From analyst summaries and press reports; the RBI text was not opened | RBI/2025-26/79 full text |
| Landscape tables' "typical use in Indian banking" columns | General industry patterns, labelled as such; no named banks | Not applicable (by design) |
