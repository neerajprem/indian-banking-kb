// Header check: no two header items may overlap at any desktop or tablet width.
// (The overflow test cannot see this: overlapping items do not cause sideways scrolling.)
import { chromium } from 'playwright';
import { startServer, BASE } from './lib.mjs';
const widths = [1081, 1100, 1180, 1240, 1280, 1366, 1440, 1920, 768, 390];
const server = await startServer(); const b = await chromium.launch();
let bad = 0;
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(BASE + '/payment-rails/', { waitUntil: 'load' });
  const hits = await p.evaluate(() => {
    const els = [...document.querySelectorAll('.brand, .nav-group > summary, .search-btn, .theme-btn, .menu-btn')].filter((e) => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0);
    const r = els.map((e) => ({ n: (e.className || e.tagName).toString().split(' ')[0] + ':' + e.textContent.trim().slice(0, 12), b: e.getBoundingClientRect() }));
    const out = [];
    for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
      const a = r[i].b, c = r[j].b;
      if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1) out.push(`${r[i].n} x ${r[j].n}`);
    }
    return out;
  });
  if (hits.length) bad++;
  console.log(`${hits.length ? 'FAIL' : 'ok  '} ${w}px ${hits.join('; ')}`);
  await p.close();
}
await b.close(); server.kill();
process.exit(bad ? 1 : 0);
