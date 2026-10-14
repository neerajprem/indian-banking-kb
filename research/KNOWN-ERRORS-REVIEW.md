# Known-errors review (04-CONTENT section I)

Stage 3, researched 28–29 September 2026. "Verified" means the source was opened and read. Every "still blocked" item stays in `src/data/known-errors.json`, so the build fails if it appears.

| # | Claim in earlier drafts | Verdict | Evidence (fact id → source) | Gate |
|---|---|---|---|---|
| 1 | SBI runs Finacle | **False.** SBI has run TCS BaNCS since an implementation that began in 2001 | `sbi-bancs` → TCS press release, 6 Oct 2021 (vendor, quotes SBI's CIO) | Blocked |
| 2 | "Infosys Finacle" as the maker | **Partly true.** The vendor itself brands it "Infosys Finacle"; the developer is EdgeVerve Systems, a wholly owned Infosys subsidiary | `finacle-edgeverve` → EdgeVerve release, 2020 | Pattern removed; writing rule: name EdgeVerve as maker |
| 3 | UPI at 14B+ a month, 450M+ a day | **Stale.** August 2026: 24.51 billion transactions, 791 million a day | `upi-volume-2026-08`, `upi-daily-2026-08` → Business Standard, 1 Sep 2026 | Blocked |
| 4 | UPI limit ₹1 lakh for all payments | **Outdated.** Verified merchants in specified categories: up to ₹5 lakh per transaction (₹10 lakh a day for capital markets and insurance); person-to-person still ₹1 lakh | `upi-p2m-limits-2025`, `upi-gem-limit-2025`, `upi-card-bill-limit-2025`, `upi-p2p-limit-2025` → DD News, AIR | Allowed only via facts |
| 5 | Cheques clear T+1 | **Outdated.** Continuous clearing since 4 October 2025 (Phase 1); Phase 2 postponed | `cts-phase1-live`, `cts-phase2-postponed` → RBI/2025-26/156 | Blocked |
| 6 | NPCI internals (Oracle RAC, TPS figures, active-active, HSM placement and so on) | **Unverifiable.** Not publicly documented | none | Blocked |
| 7 | UPI Lite and UPI 123PAY caps | **Not checked.** Link out to NPCI | none | Link out only |
| 8 | RuPay ~60% of debit cards; NFS 1.2 million ATMs | **NFS: false.** 2.61 lakh ATMs of 1,317 member banks (31 Jul 2024). **RuPay share:** not checked | `nfs-atms-2024` → IDRBT | Blocked |
| 9 | Visa and Mastercard fined under the 2018 localisation circular | **False as stated.** Business restrictions, not fines, under section 17 of the PSS Act: American Express and Diners Club from 1 May 2021; Mastercard from 22 July 2021, lifted June 2022. Visa was not named | `amex-diners-2021`, `mastercard-restriction-2021`, `mastercard-lifted-2022` → Tribune, Business Standard, RBI | Blocked (pattern "fined") |
| 10 | RBI mandates RPO ≤ 6 hours, RTO ≤ 24 hours | **False as stated.** RBI's 2023 IT Governance Direction sets no fixed values. It requires banks to define RPO and RTO for critical systems and to prioritise a minimal RTO and near-zero RPO (checked in Stage 4b) | `itgrc-rpo-rto-define`, `itgrc-near-zero-rpo` → RBI/2023-24/107 full text | Blocked |
| 11 | "RBI Cloud Policy 2023", "Cybersecurity Framework 2016", "IT Framework 2011" | **Partly.** Verified: IT Governance, Risk, Controls and Assurance Practices MD (7 Nov 2023); Outsourcing of IT Services MD (10 Apr 2023, effective 1 Oct 2023). **No "RBI Cloud Policy" found**; cloud falls under the outsourcing MD. 2016 and 2011 titles not checked | `rbi-md-itgrc-2023`, `rbi-md-it-outsourcing-2023` → RBI | "RBI Cloud Policy" blocked |
| 12 | CIBIL has 90%+ market share | **Invented** | none | Blocked |
| 13 | Named private banks or SFBs on specific platforms | **Not checked.** Only sourced users may appear | none | Policy |
| 14 | Claims about a bank's outage or DR failure | **Policy:** omit unless primary or reputable source | none | Policy |
| 15 | Invented headcounts ("NABARD ~28,000", "NPCI ~5,500") | **False.** NABARD had 3,134 staff on 31 March 2024. NPCI: no official figure found | `nabard-staff-2024` → NABARD Annual Report 2023-24 | Blocked |
| 16 | CCIL "zero settlement failures since 2001" | **Not checked** | none | Blocked |
| 17 | NABARD "33 StCBs, 351 DCCBs, 43 RRBs" | **Not checked** | none | Blocked |
| 18 | IDRBT is a deemed university | **False.** A society registered in March 1996 under the Societies Registration Act | `idrbt-society-1996` → IDRBT | Blocked |
| 19 | NABARD stake moved to Government in 2023 | **False.** RBI's last NABARD shares sold on 26 February 2019 (NHB on 19 March 2019) | `nabard-nhb-divest-2019` → RBI press release, 24 Apr 2019 | Blocked |
| 20 | CERSAI is RBI-promoted | **False.** A Government company set up for the registry notified by the Ministry of Finance | `cersai-govt-2011` → RBI/2010-2011/545 | Blocked |
| 21 | NEFT "48 half-hourly cycles" | **True as of the December 2019 circular.** RBI now lists that circular as withdrawn (consolidated); confirm current guidelines | `neft-48-batches-2019` → RBI/2019-20/111 | Pattern removed; allowed only via fact |
| 22 | SFB rules (75% PSL, 50% small loans, 25% rural branches, 15% CRAR) | **Not checked** | none | Omit until sourced |
| 23 | Positive Pay applies to cheques of ₹50,000 and above | **True, with nuance.** Banks must offer it from ₹50,000; using it is the customer's choice; banks may make it mandatory from ₹5 lakh | `positive-pay-2020` → RBI/2020-21/41 | Allowed via fact |
| 24 | Employer-specific content | **Out of scope.** Enforced by the optional `forbidden-strings.txt` gate | none | Policy |

## New errors found in the brief itself

1. **CTS Phase 2 (ledger H):** listed as starting 3 January 2026. RBI postponed it until further notice on 24 December 2025.
2. **CTS session hours (ledger H):** 10:00–16:00 is superseded. The presentation session is 09:00–15:00 and the confirmation session 09:00–19:00.
3. **UPI headline (ledger H):** July 2026 is no longer "the highest month to date". August 2026 set a new record.
4. **Section F framing:** "RBI's subsidiaries and promoted institutions" includes three bodies that are neither.
   - NABARD and NHB have been wholly owned by the Government of India since 2019.
   - CERSAI is a Government company.
   - The site uses three verified groups instead: wholly owned by RBI; set up by RBI or at its instance but not owned by it; and Government of India.
5. **Candidate relation "IFTAS carries SFMS messages used in securities settlement with CCIL":** no source links SFMS to CCIL. IDRBT says SFMS supports delivery-versus-payment settlement of government securities. The CCIL part was dropped.
6. **Glossary seed:**
   - "DLS" has no identifiable meaning in this context, so it was dropped.
   - "CIC" collides: credit information company versus core investment company. The entry covers both.
7. **Known-errors pattern for #2:** too strict, because it blocks the vendor's own brand name. Replaced with a writing rule.
8. **Conflicts between official sources, recorded rather than hidden:**
   - The NFS handover date is October 2009 according to IDRBT but 14 December 2009 according to NPCI's operational notice. NPCI's date is preferred.
   - NABARD's staff count is 3,134 in its annual report but 3,153 in its Citizen's Charter, for the same date. The annual report figure is used.
9. **DICGC premium:** the flat 12 paise per ₹100 was replaced by a risk-based framework from 1 April 2026. Any earlier draft stating the flat rate as current is outdated.
