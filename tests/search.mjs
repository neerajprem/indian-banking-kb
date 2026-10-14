// Brief acceptance criterion: any glossary acronym returns its glossary entry as the first search result.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { load as yamlLoad } from 'js-yaml';
import { startServer, BASE } from './lib.mjs';
const terms = yamlLoad(fs.readFileSync('src/data/glossary.yaml', 'utf8'));
const sample = process.env.ALL ? terms : terms.filter((t) => ['upi', 'neft', 'rtgs', 'cts', 'dicgc', 'hsm', 'ifsc', 'nach', 'ckycrr', 'sfms', 'npci', 'rbi'].includes(t.id));
const server = await startServer(); const b = await chromium.launch(); const p = await b.newPage();
await p.goto(BASE + '/', { waitUntil: 'load' });
const res = [];
for (const t of sample) {
  if (!(await p.locator('[data-search]').evaluate((d) => d.open))) await p.click('[data-search-open]');
  await p.fill('#q', ''); await p.type('#q', t.term);
  await p.waitForFunction((term) => document.querySelector('[data-search-results]')?.dataset.q === term, t.term, { timeout: 5000 }).catch(() => {});
  const href = await p.getAttribute('[data-search-results] a', 'href').catch(() => null);
  res.push({ term: t.term, first: href, ok: href === `/glossary/#${t.id}` });
}
await b.close(); server.kill();
const bad = res.filter((r) => !r.ok);
bad.forEach((r) => console.log(`FAIL ${r.term}: first result ${r.first}`));
console.log(`search: ${res.length - bad.length}/${res.length} glossary terms rank their glossary entry first`);
process.exit(bad.length ? 1 : 0);
