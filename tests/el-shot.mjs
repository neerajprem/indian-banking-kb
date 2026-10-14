// Screenshot one element by selector: node tests/el-shot.mjs route width theme selector out
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const [route, w, theme, sel, out] = process.argv.slice(2);
const port = 4414, srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: 900 }, reducedMotion: 'reduce' });
await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
const p = await ctx.newPage(); await p.goto(`http://localhost:${port}${route}`, { waitUntil: 'load' });
const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: out });
await b.close(); srv.kill();
