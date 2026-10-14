import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const port = 4416, srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const b = await chromium.launch();
const jobs = [['/regulators/', 1440, 'light'], ['/rbi-ecosystem/npci/', 390, 'dark'], ['/limitations/', 390, 'light'], ['/', 1440, 'dark'], ['/glossary/', 390, 'light'], ['/build-vs-buy/', 1440, 'dark']];
for (const [r, w, t] of jobs) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((x) => localStorage.setItem('theme', x), t);
  const p = await ctx.newPage(); await p.goto(`http://localhost:${port}${r}`, { waitUntil: 'load' });
  await p.screenshot({ path: `tests/output/review-${r.replace(/\//g, '_')}${w}-${t}.png` });
  await ctx.close();
}
await b.close(); srv.kill();
