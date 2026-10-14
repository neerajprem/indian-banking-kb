// Prints long pages to PDF through the print stylesheet and checks chrome is hidden and content is present.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { startServer, BASE } from './lib.mjs';
const pages = ['/payment-rails/', '/architecture/multi-dc/', '/limitations/'];
fs.mkdirSync('tests/output/print', { recursive: true });
const server = await startServer(); const b = await chromium.launch(); const p = await b.newPage();
let bad = 0;
for (const r of pages) {
  await p.goto(BASE + r, { waitUntil: 'load' });
  await p.emulateMedia({ media: 'print' });
  const chrome = await p.evaluate(() => ['.site-header', '.page-toc', '.pager', '.footer-dir'].filter((s) => { const e = document.querySelector(s); return e && getComputedStyle(e).display !== 'none'; }));
  const out = `tests/output/print/${r.replace(/\//g, '_')}.pdf`;
  await p.pdf({ path: out, format: 'A4', printBackground: false });
  const size = fs.statSync(out).size, pagesCount = (fs.readFileSync(out, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const ok = chrome.length === 0 && pagesCount > 1;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r}: ${pagesCount} A4 pages, ${(size / 1024).toFixed(0)} KB${chrome.length ? `; visible chrome: ${chrome.join(', ')}` : ''}`);
  await p.emulateMedia({ media: 'screen' });
}
await b.close(); server.kill();
process.exit(bad ? 1 : 0);
