// axe-core (WCAG 2.0/2.1/2.2 A and AA rules) on every route, in both themes, plus open-dialog states.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { startServer, routes, BASE } from './lib.mjs';
const server = await startServer();
const browser = await chromium.launch();
let bad = 0; const summary = {};
async function audit(page, label) {
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
  for (const v of res.violations) {
    summary[v.impact] = (summary[v.impact] ?? 0) + 1;
    const serious = v.impact === 'critical' || v.impact === 'serious';
    if (serious) bad++;
    console.log(`${serious ? 'FAIL' : 'note'} [${v.impact}] ${label}: ${v.id} (${v.nodes.length}) ${v.help}`);
    if (serious) v.nodes.slice(0, 3).forEach((n) => console.log('     ', n.target.join(' '), '|', (n.failureSummary || '').split('\n').slice(1, 2).join(' ')));
  }
}
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
  const page = await ctx.newPage();
  for (const r of routes()) {
    for (const w of [1280, 390]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(BASE + r, { waitUntil: 'networkidle' });
      await audit(page, `${theme} ${r} @${w}`);
    }
  }
  // Interactive states
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BASE + '/payment-rails/', { waitUntil: 'networkidle' });
  await page.keyboard.press('/'); await page.keyboard.type('upi'); await page.waitForTimeout(600);
  await audit(page, `${theme} search dialog open`);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(BASE + '/payment-rails/', { waitUntil: 'networkidle' });
  await page.click('[data-drawer-open]'); await page.waitForTimeout(200);
  await audit(page, `${theme} mobile drawer open`);
  await ctx.close();
}
await browser.close(); server.kill();
console.log('a11y summary by impact:', JSON.stringify(summary));
console.log(bad ? `a11y: ${bad} critical/serious violation(s)` : 'a11y: zero critical or serious violations');
process.exit(bad ? 1 : 0);
