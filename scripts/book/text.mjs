// New prose written for the book edition. It states no numbers, dates or named regulations:
// every figure in the book comes from the verified fact ledger through the chapters themselves.

import fs from 'node:fs';
export const AUTHOR = JSON.parse(fs.readFileSync('src/data/author.json', 'utf8'));

export const BOOK = {
  title: 'Indian Banking Ecosystem: A Complete Guide to the Technology Behind Indian Banking',
  short: 'Indian Banking Ecosystem',
  edition: 'First edition',
  date: '29 September 2026',
  publisher: "Infrastructure Team's Knowledgebase",
};

// The cover's rail lines are plain blocks: an inline SVG here triggered an unexplained page break in Chromium's print engine.
const stripes = ['upi', 'imps', 'cts', 'nach', 'cards', 'rtgs', 'neft'].map((c) => `<i class="stripe stripe-${c}"></i>`).join('');

export const FRONT = {
  title: `<section class="cover" id="title-page">
    <p class="cover-kicker">${BOOK.edition}</p>
    <h1 class="cover-title">Indian Banking Ecosystem</h1>
    <p class="cover-sub">A complete guide to the technology behind Indian banking</p>
    <div class="cover-lines" aria-hidden="true">${stripes}</div>
    <p class="cover-author">${AUTHOR.name}</p>
    <p class="cover-pub">${BOOK.publisher}</p>
  </section>`,
  imprint: `<section class="front imprint" id="imprint">
    <p><strong>${BOOK.title}</strong></p>
    <p>Written by ${AUTHOR.name}. ${BOOK.edition}. Facts current as of ${BOOK.date}.</p>
    <p>Published by ${BOOK.publisher}. All rights reserved until a licence is chosen.</p>
    <h2>Independence</h2>
    <p>This is an independent reference. It is a personal project; the views in it are the author’s own and do not represent any employer. It is not official documentation of the Reserve Bank of India, the National Payments Corporation of India or any bank or vendor, and it is not legal, compliance or investment advice. Product names appear for reference only; nothing here is a recommendation.</p>
    <h2>How the facts were checked</h2>
    <p>Every number, date, limit, named customer and named regulation in this book is drawn from a register of facts, reproduced in Appendix B. Each fact names the source it came from and the date it was true, and each source was opened and read before the fact was recorded. Patterns that describe no particular organisation are labelled illustrative. Figures that change often, such as monthly payment volumes, are dated so that readers can tell how current they are.</p>
    <p>The same register drives the companion website, so the book and the site cannot disagree. Where this book and a later edition of the site differ, the site is more recent.</p>
  </section>`,
  preface: `<section class="front" id="preface"><h1 class="front-title">Preface</h1>
    <p>India moves money at a scale few countries match, and it does so on infrastructure that most people who use it never see. A payment that takes seconds on a phone passes through a bank's app, a national switch, another bank's systems and, eventually, the accounts banks hold at the central bank. Behind each of those steps sit decades of decisions about software, networks, rules and institutions.</p>
    <p>This book explains that machinery. It was written for engineers joining Indian financial services, for architects and product leads who need to reason about it, for students and analysts who want the whole picture in one place, and for anyone in risk and compliance who needs to know where the rules touch the technology.</p>
    <p>It tries to be precise about what is known. Where a public source says how a named organisation works, the book cites it. Where it describes a common industry pattern, it says so. Where a question could not be settled from public sources, the answer is left out rather than guessed. Several claims that circulate widely turned out to be wrong when checked; Appendix D records them.</p>
    <p>The chapters were first written as a website, which remains the most current version. This edition gathers them into one sequence, with connecting text, so they can be read from beginning to end.</p>
  </section>`,
  howto: `<section class="front" id="how-to-read"><h1 class="front-title">How to read this book</h1>
    <p><strong>Reading paths.</strong> Part I is the foundation, and everyone should start there. After that the parts stand on their own: Part II explains architecture, Part III surveys technologies, Part IV covers operating at scale and making build-or-buy decisions, and Part V covers regulators and the institutions around the Reserve Bank. Readers new to banking systems will get most from reading Parts I, II and V in order; practitioners can go straight to the chapter they need.</p>
    <p><strong>Facts and notes.</strong> A small raised number marks a fact taken from a source. The notes at the end of each chapter list those sources in order, with what each one supports and the date it was checked. The full register of facts is in Appendix B, and every source is in Appendix C.</p>
    <p><strong>Illustrative material.</strong> Diagrams and examples labelled illustrative show common patterns, not the systems of any named organisation. Worked examples use made-up amounts.</p>
    <p><strong>Short names.</strong> Acronyms are spelled out on first use in each chapter and collected in the glossary in Appendix A.</p>
    <p><strong>Questions for a review.</strong> Most chapters end with questions to bring to a design or decision review. They are the quickest way to turn a chapter into action.</p>
  </section>`,
};

export const PARTS = [
  { n: 1, roman: 'I', title: 'Foundations', intro: '<p>Three chapters that everything else builds on. The first follows a payment across the institutions that carry it. The second opens the core banking system, the ledger at the centre of every bank. The third walks through the payment rails that connect banks to one another, how they settle and what happens when a payment goes wrong.</p>' },
  { n: 2, roman: 'II', title: 'Architecture', route: '/architecture/', intro: '<p>Nine models that shape how banks build and run their systems. Each chapter explains the model, how it plays out in Indian banking, its trade-offs and the ways it fails, and ends with questions for a design review.</p>' },
  { n: 3, roman: 'III', title: 'Technologies', route: '/technologies/', intro: '<p>Twelve families of technology found in Indian banking. Each chapter surveys the main options in a landscape table, explains how to choose between them and lists the pitfalls that catch teams out.</p>' },
  { n: 4, roman: 'IV', title: 'Scale and decisions', intro: '<p>Three chapters on the hard parts of running banking technology: keeping systems up when volumes peak, deciding what to build and what to buy, and facing the known weaknesses honestly.</p>' },
  { n: 5, roman: 'V', title: 'Governance', intro: '<p>The rules and the institutions. The first chapter explains who regulates bank technology, how rules are made and how they are enforced. The second describes the institutions around the Reserve Bank of India, what each one does and how they connect.</p>' },
];

export const CH1_INTRO = `<div class="prose ch1-intro">
  <p>Every payment in India, whether a tap on a phone, a salary credit or a cheque paid in at a branch, crosses the same basic landscape. There is the bank where the money starts and the bank where it ends. Between them sits a rail: a shared system, with an operator and a rulebook, that carries the instruction from one to the other. Behind every rail sits settlement, the movement of money between the banks themselves in the accounts they hold at the Reserve Bank of India.</p>
  <p>Two operators run most of those rails. The Reserve Bank runs the systems for large and account-to-account transfers. The National Payments Corporation of India runs the systems most customers use every day. Around them is a ring of institutions that built the networks, insure deposits, print notes, run registries and clear securities trades; Part V describes each one.</p>
  <p>The map below shows these parts as a transit map: each rail is a line, and each institution or system a payment passes through is a stop. It is simplified on purpose. Its job is to show which parties a payment touches, not the exact path of every message, and the chapters that follow fill in the detail.</p>
</div>`;

// One short bridge at the start of each chapter: where it fits in the book.
export const LEDES = {
  '/core-systems/': 'The previous chapter followed a payment between banks. This one looks inside a bank, at the system that holds every account and balance.',
  '/payment-rails/': 'With the core in view, this chapter turns to the rails that connect banks to one another: what each one is for, how it settles and how failures are put right.',
  '/architecture/cbs/': 'Part I described what a core banking system does. This chapter explains how one is built, and why its daily cycle shapes the rest of a bank.',
  '/architecture/payments/': 'Next, the architecture of payment systems themselves: switches, settlement and the state machine that stops a payment being lost or made twice.',
  '/architecture/api-first/': 'Payments and the core both need a safe front door. This chapter covers the API layers that provide one, and India\u2019s framework for consented data sharing.',
  '/architecture/event-driven/': 'APIs answer requests. Many systems also need to react to what has happened; this chapter covers events, logs and the outbox pattern.',
  '/architecture/data/': 'Events and transactions become data. This chapter follows it from transaction systems to the reports regulators rely on.',
  '/architecture/modernisation/': 'The earlier chapters describe systems as they are. This one covers how banks change them without stopping the business.',
  '/architecture/security/': 'Every layer described so far needs protecting. This chapter explains defence in depth as banks apply it, conceptually and without describing any organisation\u2019s controls.',
  '/architecture/multi-dc/': 'Security protects against attack; resilience protects against failure. This chapter covers running across data centres, and what the regulator expects from recovery.',
  '/architecture/hybrid-cloud/': 'The last architecture chapter asks where each system should run: in the bank\u2019s own data centres or in the cloud, and under what rules.',
  '/technologies/core-platforms/': 'Part III begins with the products behind the ledger: the commercial and cloud-native core platforms banks choose between.',
  '/technologies/databases/': 'Every core and payment system rests on a database. This chapter covers what money needs from one.',
  '/technologies/messaging/': 'Between databases and services, messages move the work. This chapter compares queues and logs.',
  '/technologies/integration/': 'Messaging is one way to connect systems. This chapter covers the others: service buses, gateways and service meshes.',
  '/technologies/containers/': 'The services described so far increasingly run in containers. This chapter covers the platforms that run them, and what regulated workloads add.',
  '/technologies/cloud/': 'Container platforms often run in the cloud. This chapter covers the providers and the rules that shape their use in Indian banking.',
  '/technologies/security-tech/': 'The architecture of security was covered in Part II. This chapter surveys the tools that implement it.',
  '/technologies/observability/': 'Systems that cannot be seen cannot be run. This chapter covers the metrics, logs and traces that make them visible.',
  '/technologies/ml-ai/': 'Data and observability feed models. This chapter covers where banks use machine learning, and what the regulator has said so far.',
  '/technologies/mobile/': 'For most customers the phone is the bank. This chapter covers how banking apps are built and protected.',
  '/technologies/languages/': 'Behind every system above is code. This chapter looks at the languages banks use, and why.',
  '/technologies/payment-tech/': 'Part III ends where payments demand the most: message standards, keys and PINs, tokens and authentication.',
  '/high-volume/': 'Part IV begins with scale: what peak volume means in India, and the patterns that keep the core standing.',
  '/build-vs-buy/': 'Every system in this book was either built or bought. This chapter offers a framework for choosing.',
  '/limitations/': 'Part IV closes by facing the weaknesses directly, including the cases where a regulator stepped in.',
  '/regulators/': 'Part V turns to governance, beginning with the bodies that set the rules for bank technology.',
  '/rbi-ecosystem/': 'The final chapter describes the institutions around the Reserve Bank, what each one does and how they connect.',
};
