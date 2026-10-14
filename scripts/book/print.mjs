// Prints the composed book to PDF in two passes: pass 1 finds where every chapter lands (from the PDF outline);
// pass 2 fills the contents page numbers and an index of glossary terms built from the rendered pages.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { load as yamlLoad } from 'js-yaml';
const OUT = process.argv[2] || '/mnt/user-data/outputs/book/indian-banking-ecosystem-book.pdf';
const port = 4421, base = `http://localhost:${port}`;
const srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/__book/`, { waitUntil: 'load' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);
const pdf = (path) => page.pdf({ path, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
const info = (path) => JSON.parse(execFileSync('python3', ['scripts/book/pdfinfo.py', path], { maxBuffer: 64 * 1024 * 1024 }).toString());

await pdf('/tmp/book-pass1.pdf');
const p1 = info('/tmp/book-pass1.pdf');
const plan = JSON.parse(fs.readFileSync('dist/__book/plan.json', 'utf8'));
// Match each contents entry to the first outline heading with its title, in order.
const titles = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.toc-pg')].map((e) => {
  const id = e.dataset.for; const el = document.getElementById(id);
  return [id, el?.querySelector('h1')?.textContent.trim() ?? ''];
})));
const pages = {}; let cursor = 1;
for (const t of plan.toc) {
  const hit = p1.outline.find((o) => o.title === titles[t.id] && o.page >= cursor);
  if (hit) { pages[t.id] = hit.page; cursor = hit.page; }
}
const missing = plan.toc.filter((t) => !pages[t.id]).map((t) => t.id);
// Index: every glossary term, found in the body pages (chapter 1 to the start of Appendix A).
const G = yamlLoad(fs.readFileSync('src/data/glossary.yaml', 'utf8'));
const first = pages['ch-1'], last = (pages['app-a'] ?? p1.pages) - 1;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ranges = (ps) => { const r = []; for (const p of ps) { const l = r[r.length - 1]; if (l && p === l[1] + 1) l[1] = p; else r.push([p, p]); } return r.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)); };
const entries = G.map((g) => {
  const re = new RegExp(`(?<![\\w-])${esc(g.term)}(?![\\w-])`);
  const hits = [];
  for (let i = first; i <= last; i++) if (re.test(p1.texts[i - 1] || '')) hits.push(i);
  return { term: g.term, exp: g.expansion, hits };
}).filter((e) => e.hits.length).sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
let letter = '', ix = '';
for (const e of entries) {
  const L = e.term[0].toUpperCase();
  if (L !== letter) { letter = L; ix += `<p class="ix-letter">${L}</p>`; }
  const r = ranges(e.hits);
  ix += `<p><strong>${e.term}</strong> (${e.exp}) ${r.slice(0, 14).join(', ')}${r.length > 14 ? ', and elsewhere' : ''}</p>`;
}
await page.evaluate(({ pages, ix }) => {
  document.querySelectorAll('.toc-pg').forEach((e) => { e.textContent = pages[e.dataset.for] ?? ''; });
  document.querySelector('[data-index]').innerHTML = ix;
}, { pages, ix });
fs.mkdirSync(OUT.replace(/\/[^/]+$/, ''), { recursive: true });
// Re-render until no contents entry moves: content after the index (which only fills in on the second pass)
// can shift, so the numbers are taken from the latest pass and checked against the next one.
const locate = (outline) => { const out = {}; let cur = 1; for (const t of plan.toc) { const h = outline.find((o) => o.title === titles[t.id] && o.page >= cur); if (h) { out[t.id] = h.page; cur = h.page; } } return out; };
let p2, moved = [], passes = 1;
for (let i = 0; i < 3; i++) {
  await pdf('/tmp/book-pass2.pdf'); passes++;
  p2 = info('/tmp/book-pass2.pdf');
  const now = locate(p2.outline);
  moved = plan.toc.filter((t) => now[t.id] && now[t.id] !== pages[t.id]).map((t) => t.id);
  if (!moved.length) break;
  Object.assign(pages, now);
  await page.evaluate((pages) => document.querySelectorAll('.toc-pg').forEach((e) => { e.textContent = pages[e.dataset.for] ?? ''; }), pages);
}
execFileSync('python3', ['-c', `
from pypdf import PdfReader, PdfWriter
r = PdfReader('/tmp/book-pass2.pdf'); w = PdfWriter(clone_from=r)
w.add_metadata({'/Title': 'Indian Banking Ecosystem: A Complete Guide to the Technology Behind Indian Banking', '/Author': "Infrastructure Team's Knowledgebase", '/Subject': 'First edition. Facts current as of 29 September 2026.'})
w.write('${OUT}')`]);
await browser.close(); srv.kill();
fs.writeFileSync('/tmp/book-report.json', JSON.stringify({ pages1: p1.pages, pages2: p2.pages, toc: pages, missing, moved, indexTerms: entries.length }, null, 2));
console.log(`book: ${p2.pages} pages; contents entries matched ${plan.toc.length - missing.length}/${plan.toc.length}${missing.length ? ' (missing: ' + missing.join(', ') + ')' : ''}; render passes: ${passes}; entries still moving: ${moved.length}; index terms: ${entries.length}`);
