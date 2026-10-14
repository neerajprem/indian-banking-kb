// Lighthouse, mobile preset with default throttling, on representative pages.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { startServer, BASE } from './lib.mjs';
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/payment-rails/', '/architecture/cbs/', '/technologies/messaging/'];
const chrome = process.env.CHROME_PATH || fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium-')).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`)[0];
fs.mkdirSync('tests/output/lighthouse', { recursive: true });
const server = await startServer(process.env.LH_PROD ? ['--prod'] : []);
const rows = []; let fail = 0;
for (const p of pages) {
  const out = `tests/output/lighthouse/${p.replace(/\//g, '_') || 'home'}.json`;
  let r;
  for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    execFileSync('npx', ['lighthouse', BASE + p, '--quiet', '--output=json', `--output-path=${out}`, '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless=new --no-sandbox'], { env: { ...process.env, CHROME_PATH: chrome }, stdio: 'pipe', timeout: 180000 });
  } catch (e) { if (!fs.existsSync(out)) { console.log('lighthouse failed on', p, String(e.stderr).slice(0, 300)); } }
    r = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : null;
    // Lighthouse occasionally fails to record a trace (NO_NAVSTART); that is a tool fault, so retry.
    if (r && !r.runtimeError) break;
    console.log(`  retrying ${p} (${r?.runtimeError?.code ?? 'no report'})`);
  }
  if (!r || r.runtimeError) { fail++; continue; }
  const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const a = r.audits;
  rows.push({ page: p, ...s, LCP: a['largest-contentful-paint'].displayValue, CLS: a['cumulative-layout-shift'].displayValue, TBT: a['total-blocking-time'].displayValue });
  if (s.performance < 95 || s.accessibility < 100 || s['best-practices'] < 95 || s.seo < 95) fail++;
  for (const [k, v] of Object.entries(a)) if (v.score !== null && v.score < 0.9 && v.scoreDisplayMode !== 'informative' && v.scoreDisplayMode !== 'notApplicable' && v.scoreDisplayMode !== 'manual') console.log(`  ${p} audit below 0.9: ${k} (${v.displayValue ?? v.score})`);
}
server.kill();
console.table(rows);
process.exit(fail ? 1 : 0);
