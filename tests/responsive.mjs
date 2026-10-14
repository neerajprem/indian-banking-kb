// Asserts no horizontal page scroll at five widths on every route, and saves screenshots of key pages.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { startServer, routes, BASE } from './lib.mjs';
const WIDTHS = [320, 360, 768, 1280, 1920];
const SHOTS = ['/', '/styleguide/', '/payment-rails/', '/architecture/', '/architecture/cbs/', '/technologies/messaging/'];
const shotWidths = [360, 768, 1280, 1920];
fs.mkdirSync('tests/output/responsive', { recursive: true });
const server = await startServer();
const browser = await chromium.launch();
let failures = 0;
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
  const page = await ctx.newPage();
  for (const r of [...routes(), ...(process.env.CHUNK && !process.env.CHUNK.startsWith('0/') ? [] : ['/404-test/'])]) {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(BASE + r, { waitUntil: 'load' });
      const { sw, iw, far } = await page.evaluate(() => {
        const iw = window.innerWidth;
        // Elements poking past the viewport edge, ignoring those clipped by a scroll container (tables, code).
        // Only elements that actually cross the right edge are checked against their ancestors.
        const far = [...document.querySelectorAll('body *')].filter((e) => {
          const r = e.getBoundingClientRect();
          if (r.right <= iw + 1 || r.width === 0) return false;
          for (let p = e.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return false; }
          return true;
        }).slice(0, 3).map((e) => `${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).split(' ')[0]}`);
        return { sw: document.documentElement.scrollWidth, iw, far };
      });
      if (sw > iw || far.length) { failures++; console.log(`OVERFLOW ${theme} ${r} @${w}: scrollWidth ${sw} vs ${iw}; ${far.join(', ')}`); }
      if (SHOTS.includes(r) && shotWidths.includes(w) && (theme === 'light' || r === '/styleguide/' || r === '/'))
        await page.screenshot({ path: `tests/output/responsive/${theme}-${r.replace(/\//g, '_') || 'home'}-${w}.png`, fullPage: true });
    }
  }
  await ctx.close();
}
await browser.close(); server.kill();
console.log(failures ? `responsive: ${failures} overflow failure(s)` : `responsive: no horizontal overflow on ${routes().length + 1} routes x ${WIDTHS.length} widths x 2 themes`);
process.exit(failures ? 1 : 0);
