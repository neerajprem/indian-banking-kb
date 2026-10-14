// Report screenshots: styleguide and sample pages, light and dark, desktop and phone.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { startServer, BASE } from './lib.mjs';
fs.mkdirSync(process.env.SHOT_DIR || 'tests/output/stage2', { recursive: true });
const server = await startServer(); const browser = await chromium.launch();
const OUT = process.env.SHOT_DIR || 'tests/output/stage2';
const shots = (process.env.SHOT_ROUTES ? process.env.SHOT_ROUTES.split(',') : ['/styleguide/', '/', '/payment-rails/']).flatMap((r) => [360, 768, 1280, 1920].map((w) => [r, w]));
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
  const p = await ctx.newPage();
  for (const [r, w] of shots) {
    await p.setViewportSize({ width: w, height: 900 });
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.screenshot({ path: `${OUT}/${theme}-${r.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home'}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close(); server.kill();
