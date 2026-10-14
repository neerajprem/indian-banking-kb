// Screenshots the first data table on a page at a given width and theme, across the full viewport width.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const port = 4414, base = `http://localhost:${port}`;
const srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const b = await chromium.launch();
for (const j of JSON.parse(process.argv[2])) {
  const ctx = await b.newContext({ viewport: { width: j.w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), j.theme);
  const p = await ctx.newPage(); await p.goto(base + j.route, { waitUntil: 'load' });
  const t = p.locator('.table-wrap').nth(j.n ?? 0); await t.scrollIntoViewIfNeeded();
  const bb = await t.boundingBox();
  await p.screenshot({ path: j.out, clip: { x: 0, y: Math.max(0, bb.y - 10), width: j.w, height: Math.min(bb.height + 60, 900) } });
  await ctx.close();
}
await b.close(); srv.kill();
