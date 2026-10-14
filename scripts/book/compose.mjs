// Composes the book from the built site (dist/) in the approved order, so book and site never disagree.
// Output: dist/__book/index.html (temporary; removed after printing). Run after `npm run build`.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { load as yamlLoad } from 'js-yaml';
import { PARTS, FRONT, CH1_INTRO, LEDES, BOOK, AUTHOR } from './text.mjs';

const port = 4420, base = `http://localhost:${port}`;
const srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// ---------- chapter plan ----------
const arch = ['cbs', 'payments', 'api-first', 'event-driven', 'data', 'modernisation', 'security', 'multi-dc', 'hybrid-cloud'];
const tech = ['core-platforms', 'databases', 'messaging', 'integration', 'containers', 'cloud', 'security-tech', 'observability', 'ml-ai', 'mobile', 'languages', 'payment-tech'];
const institutions = ['dicgc', 'brbnmpl', 'rebit', 'iftas', 'rbih', 'idrbt', 'npci', 'ccil', 'nabard', 'nhb', 'cersai'];
const chapters = [];
let n = 0;
const add = (part, route, extra = {}) => chapters.push({ n: ++n, part, route, ...extra });
add(1, '/', { home: true });
add(1, '/core-systems/'); add(1, '/payment-rails/');
arch.forEach((t) => add(2, `/architecture/${t}/`));
tech.forEach((t) => add(3, `/technologies/${t}/`));
add(4, '/high-volume/'); add(4, '/build-vs-buy/'); add(4, '/limitations/');
add(5, '/regulators/'); add(5, '/rbi-ecosystem/', { institutions });
// Routes that map to a chapter, for turning site links into "chapter N" references.
const routeToChapter = Object.fromEntries(chapters.map((c) => [c.route, c.n]));
institutions.forEach((i) => (routeToChapter[`/rbi-ecosystem/${i}/`] = 29));
routeToChapter['/architecture/'] = 'Part II'; routeToChapter['/technologies/'] = 'Part III';
routeToChapter['/glossary/'] = 'Appendix A'; routeToChapter['/sources/'] = 'Appendix C';

// ---------- extraction in the browser DOM ----------
async function extract(route, prefix, opts = {}) {
  await page.goto(base + route, { waitUntil: 'load' });
  return page.evaluate(({ prefix, routeToChapter, opts }) => {
    const q = (s, r = document) => r.querySelector(s);
    const title = q('h1')?.textContent.trim() ?? '';
    const summary = q('.page-summary')?.textContent.trim() ?? '';
    let body;
    if (opts.home) {
      body = document.createElement('div');
      const kf = q('.key-fact'); if (kf) body.append(kf.cloneNode(true));
      const map = q('[data-railmap]'); if (map) body.append(map.cloneNode(true));
    } else {
      body = q('article.prose').cloneNode(true);
    }
    const notes = q('.sources-list')?.cloneNode(true) ?? null;
    const fix = (root) => {
      if (!root) return;
      root.querySelectorAll('.h-anchor,.copy-btn,.compare-controls,.chips,.map-panel,.explainer-ctrl,.gl-tip,.cite-tip,details.alt-text,.toc-inline,script,.railmap-head p,.note-mark,.no-js-only,.table-wrap + .table-note:empty').forEach((e) => e.remove());
      root.querySelectorAll('svg.map-m').forEach((e) => e.remove());
      // Build-vs-buy scorer becomes a blank worksheet.
      root.querySelectorAll('[data-scorer]').forEach((sc) => {
        const rows = [...sc.querySelectorAll('fieldset')].map((fs) => {
          const ends = fs.querySelectorAll('.scorer-end');
          return `<tr><th scope="row">${fs.querySelector('legend').textContent}</th><td>${ends[0]?.textContent ?? ''}</td><td class="ws-boxes">1 &#9744;&nbsp; 2 &#9744;&nbsp; 3 &#9744;&nbsp; 4 &#9744;&nbsp; 5 &#9744;</td><td>${ends[1]?.textContent ?? ''}</td></tr>`;
        }).join('');
        const div = document.createElement('div');
        div.innerHTML = `<p class="table-caption">Worksheet: rate one capability</p><div class="table-wrap"><table><thead><tr><th scope="col">Question</th><th scope="col">1 means</th><th scope="col">Your rating</th><th scope="col">5 means</th></tr></thead><tbody>${rows}</tbody></table></div><p class="table-note">Differentiation, urgency and in-house talent carry the most weight. High ratings on differentiation, scale, talent and control point towards building; high ratings on regulatory complexity and urgency point towards buying. A mix usually means a hybrid.</p>`;
        sc.replaceWith(div);
      });
      // Glossary links and cross-links become plain text; cross-links gain a chapter reference.
      root.querySelectorAll('a.gl-term').forEach((a) => a.replaceWith(document.createTextNode(a.textContent)));
      root.querySelectorAll('a[href^="/"]').forEach((a) => {
        const href = a.getAttribute('href').split('#')[0];
        const ch = routeToChapter[href];
        const span = document.createElement('span');
        span.textContent = a.textContent + (ch ? (typeof ch === 'number' ? ` (chapter ${ch})` : ` (${ch})`) : '');
        a.replaceWith(span);
      });
      root.querySelectorAll('a[href^="#src-"]').forEach((a) => a.setAttribute('href', '#' + prefix + a.getAttribute('href').slice(1)));
      root.querySelectorAll('[id]').forEach((e) => { if (e.closest('svg')) return; e.id = prefix + e.id; });
      root.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls]').forEach((e) => { if (e.closest('svg')) return; ['aria-labelledby', 'aria-describedby', 'aria-controls'].forEach((k) => { const v = e.getAttribute(k); if (v) e.setAttribute(k, v.split(' ').map((x) => prefix + x).join(' ')); }); });
      root.querySelectorAll('[tabindex]').forEach((e) => e.removeAttribute('tabindex'));
      // Captions become a heading line above the table: Chromium strands a caption on one page and the rows on the next.
      root.querySelectorAll('table > caption').forEach((c) => {
        const wrap = c.closest('.table-wrap') ?? c.parentElement;
        const cap = document.createElement('p'); cap.className = 'table-caption'; cap.textContent = c.textContent;
        wrap.before(cap); c.remove();
      });
      // Wording written for the screen, reworded for print.
      const PRINT = [
        ['Select an institution to see only its connections. The table under the map lists every connection and is generated from the same data.', 'The map shows every sourced relationship; the table after it lists each one, generated from the same data.'],
        ['To compare two rails side by side, choose them below. Without JavaScript, every rail is shown.', 'The table below sets the rails side by side.'],
        ['Rate one capability against the six factors.', 'Rate one capability against the six factors using the worksheet below.'],
      ];
      root.querySelectorAll('p').forEach((pp) => { for (const [a, b] of PRINT) if (pp.textContent.includes(a)) pp.innerHTML = pp.innerHTML.replace(a, b); });
      root.querySelectorAll('h2, h3').forEach((h) => { if (h.textContent.trim() === 'Try it: a simple scorer') h.textContent = 'A worksheet'; });
    };
    fix(body); fix(notes);
    if (notes) { notes.querySelector('h2')?.remove(); }
    return { title, summary, body: body.innerHTML, notes: notes?.innerHTML ?? '' };
  }, { prefix, routeToChapter, opts });
}

const demote = (html) => html.replace(/<(\/?)h4\b/g, '<$1h5').replace(/<(\/?)h3\b/g, '<$1h4').replace(/<(\/?)h2\b/g, '<$1h3');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- assemble ----------
const sections = [];
const toc = [];
const runningHeads = [];
for (const part of PARTS) {
  const pid = `part-${part.n}`;
  let opener = '';
  if (part.route) { const o = await extract(part.route, `${pid}-`); opener = o.body; }
  // Only the part's title page uses the "parts" named page; its opener content flows on ordinary pages
  // (a named page spanning several pages made Chromium push diagrams onto the following page).
  sections.push(`<section class="part" id="${pid}"><div class="part-head"><p class="part-num">Part ${part.roman}</p><h1 class="part-title">${esc(part.title)}</h1><div class="part-intro">${part.intro}</div></div>${opener ? `<div class="part-opener prose">${opener}</div>` : ''}</section>`);
  toc.push({ kind: 'part', id: pid, label: `Part ${part.roman}`, title: part.title });
  for (const c of chapters.filter((x) => x.part === part.n)) {
    const pre = `ch${c.n}-`;
    const x = await extract(c.route, pre, { home: c.home });
    const title = c.home ? 'How money moves in India' : x.title;
    const summary = c.home ? '' : x.summary;
    let extraHtml = '', extraNotes = '';
    if (c.institutions) {
      for (const inst of c.institutions) {
        const y = await extract(`/rbi-ecosystem/${inst}/`, `${pre}${inst}-`);
        extraHtml += `<section class="profile"><h2 id="${pre}${inst}">${esc(y.title)}</h2>${demote(y.body)}${y.notes ? `<div class="profile-notes"><p class="notes-h">Sources for this profile</p>${y.notes}</div>` : ''}</section>`;
      }
    }
    runningHeads.push({ n: c.n, title });
    sections.push(`<section class="chapter ch-${c.n}" id="ch-${c.n}">
      <p class="chapter-num">Chapter ${c.n}</p><h1 class="chapter-title">${esc(title)}</h1>
      ${summary ? `<p class="chapter-summary">${esc(summary)}</p>` : ''}
      ${LEDES[c.route] ? `<p class="chapter-lede">${LEDES[c.route]}</p>` : ''}
      ${c.home ? CH1_INTRO : ''}
      <div class="prose">${x.body}${extraHtml}</div>
      ${x.notes ? `<section class="notes"><h2 class="notes-title" id="${pre}notes">Notes</h2>${x.notes}</section>` : ''}
    </section>`);
    toc.push({ kind: 'chapter', id: `ch-${c.n}`, label: String(c.n), title });
  }
}

// ---------- appendices from the data files ----------
const G = yamlLoad(fs.readFileSync('src/data/glossary.yaml', 'utf8')).sort((a, b) => a.term.localeCompare(b.term));
const F = yamlLoad(fs.readFileSync('src/data/facts.yaml', 'utf8'));
const S = yamlLoad(fs.readFileSync('src/data/sources.yaml', 'utf8'));
const src = Object.fromEntries(S.map((s) => [s.id, s]));
const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const typeName = { primary: 'Primary', 'reputable-press': 'Press', vendor: 'Vendor', analyst: 'Analyst' };

const appA = `<section class="appendix" id="app-a"><p class="chapter-num">Appendix A</p><h1 class="chapter-title">Glossary of short names</h1>
  <p class="chapter-lede">${G.length} short names used in this book. ${G.filter((g) => g.status === 'verified').length} definitions have been checked against a cited source; the rest are marked <span class="draft-tag">unsourced</span> and are still being sourced.</p>
  <dl class="gloss">${G.map((g) => `<div class="gloss-entry"><dt>${esc(g.term)}</dt><dd><strong>${esc(g.expansion)}.</strong> ${esc(g.definition)}${g.status === 'verified' ? '' : ' <span class="draft-tag">unsourced</span>'}</dd></div>`).join('')}</dl></section>`;

const sortedFacts = [...F].sort((a, b) => a.id.localeCompare(b.id));
const appB = `<section class="appendix" id="app-b"><p class="chapter-num">Appendix B</p><h1 class="chapter-title">Register of facts</h1>
  <p class="chapter-lede">Every figure, date, limit and named regulation in this book comes from one of these ${F.length} records. Each was checked against the source named, which was opened and read. "As of" is the date the fact was true.</p>
  <div class="table-wrap"><table class="register"><thead><tr><th scope="col">Fact</th><th scope="col">As of</th><th scope="col">Source</th><th scope="col">Type</th></tr></thead><tbody>
  ${sortedFacts.map((f) => `<tr><td>${esc(f.claim)}</td><td class="nowrap">${fmt(f.asOf)}</td><td>${esc(src[f.source].publisher)}</td><td>${f.confidence === 'official' ? 'Official' : f.confidence === 'vendor-claim' ? 'Vendor claim' : 'Reported'}</td></tr>`).join('')}
  </tbody></table></div></section>`;

const sortedSources = [...S].sort((a, b) => a.publisher.localeCompare(b.publisher) || a.title.localeCompare(b.title));
const appC = `<section class="appendix" id="app-c"><p class="chapter-num">Appendix C</p><h1 class="chapter-title">Bibliography</h1>
  <p class="chapter-lede">All ${S.length} sources used, grouped by publisher. Each was accessed on the date shown. Primary sources are those of regulators, government and the institutions themselves.</p>
  <ol class="biblio">${sortedSources.map((s) => `<li><span class="b-pub">${esc(s.publisher)}.</span> <a href="${esc(s.url)}">${esc(s.title)}</a>. ${typeName[s.type]} source; accessed ${fmt(s.accessed)}. <span class="b-url">${esc(s.url)}</span></li>`).join('')}</ol></section>`;

// Appendix D from the known-errors review table.
const md = fs.readFileSync('research/KNOWN-ERRORS-REVIEW.md', 'utf8');
const rows = md.split('\n').filter((l) => /^\| \d+ \|/.test(l)).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
const clean = (s) => esc(s.replace(/`/g, '').replace(/\*\*/g, '')).replace(/→/g, 'from');
const appD = `<section class="appendix" id="app-d"><p class="chapter-num">Appendix D</p><h1 class="chapter-title">Corrections to earlier drafts</h1>
  <p class="chapter-lede">Earlier drafts of this material contained claims that research showed to be wrong, outdated or unverifiable. They were removed or corrected, and the build now refuses them. This is the record.</p>
  <div class="table-wrap"><table class="register"><thead><tr><th scope="col">#</th><th scope="col">Earlier claim</th><th scope="col">What the sources show</th></tr></thead><tbody>
  ${rows.map((r) => `<tr><td>${r[0]}</td><td>${clean(r[1])}</td><td>${clean(r[2])}</td></tr>`).join('')}
  </tbody></table></div></section>`;

toc.push({ kind: 'back', id: 'app-a', label: 'A', title: 'Glossary of short names' }, { kind: 'back', id: 'app-b', label: 'B', title: 'Register of facts' },
  { kind: 'back', id: 'app-c', label: 'C', title: 'Bibliography' }, { kind: 'back', id: 'app-d', label: 'D', title: 'Corrections to earlier drafts' }, { kind: 'back', id: 'index', label: '', title: 'Index' }, { kind: 'back', id: 'about-author', label: '', title: 'About the author' });

// ---------- page ----------
const cssHref = (fs.readFileSync('dist/index.html', 'utf8').match(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"/) || [])[1];
const tocHtml = `<section class="front contents-page" id="contents"><h1 class="front-title">Contents</h1><ol class="toc-list">
  ${toc.map((t) => `<li class="toc-${t.kind}"><span class="toc-label">${esc(t.label)}</span><span class="toc-title">${esc(t.title)}</span><span class="toc-pg" data-for="${t.id}"></span></li>`).join('')}
</ol></section>`;
const headCss = runningHeads.map((r) => `.ch-${r.n}{page:ch${r.n}} @page ch${r.n}{@top-left{content:"${r.n}  ${r.title.replace(/"/g, '\\"')}";}}`).join('\n');
const html = `<!doctype html><html lang="en-IN" class="no-js" data-theme="light"><head><meta charset="utf-8"><title>${esc(BOOK.title)}</title>
<link rel="stylesheet" href="${cssHref}"><link rel="stylesheet" href="/__book/book.css"><style>${headCss}</style></head>
<body class="book">
${FRONT.title}
${FRONT.imprint}
${tocHtml}
${FRONT.preface}
${FRONT.howto}
${sections.join('\n')}
${appA}${appB}${appC}${appD}
<section class="appendix" id="index"><h1 class="chapter-title">Index</h1><div class="index-body" data-index></div></section>
<section class="appendix about-author" id="about-author"><h1 class="chapter-title">About the author</h1>
  <p class="chapter-lede">${esc(AUTHOR.role)}</p>
  <div class="prose"><p>${esc(AUTHOR.bio)}</p>
  <p>The companion website, with the latest version of every chapter, is at ibs.neerajprem.in.</p>
  <ul>${AUTHOR.links.map((l) => `<li>${esc(l.label)}: <a href="${esc(l.url)}">${esc(l.url)}</a></li>`).join('')}</ul></div></section>
</body></html>`;
fs.mkdirSync('dist/__book', { recursive: true });
fs.writeFileSync('dist/__book/index.html', html);
fs.copyFileSync('scripts/book/book.css', 'dist/__book/book.css');
fs.writeFileSync('dist/__book/plan.json', JSON.stringify({ toc, chapters: chapters.map((c) => ({ n: c.n, route: c.route })) }, null, 2));
await browser.close(); srv.kill();
console.log(`composed: ${chapters.length} chapters, ${PARTS.length} parts, ${G.length} glossary terms, ${F.length} facts, ${S.length} sources, ${rows.length} corrections; ${(html.length / 1024).toFixed(0)} KB HTML`);
