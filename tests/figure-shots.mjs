// Screenshots individual figures, to review diagrams at a given width and theme.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const port = 4412, base = `http://localhost:${port}`;
const srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const b = await chromium.launch();
const jobs = JSON.parse(process.argv[2]);
for (const j of jobs) {
  const ctx = await b.newContext({ viewport: { width: j.w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => localStorage.setItem('theme', t), j.theme);
  const p = await ctx.newPage(); await p.goto(base + j.route, { waitUntil: 'load' });
  const fig = p.locator('figure.figure').nth(j.n);
  await fig.scrollIntoViewIfNeeded(); const bb = await fig.boundingBox(); await p.screenshot({ path: j.out, clip: { x: 0, y: bb.y, width: j.w, height: bb.height }, fullPage: false });
  await ctx.close();
}
await b.close(); srv.kill();
