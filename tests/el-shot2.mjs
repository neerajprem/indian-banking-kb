// Like el-shot, but hides the sticky header so it cannot overlap the element.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const [route, w, theme, sel, out] = process.argv.slice(2);
const port = 4415, srv = spawn('node', ['scripts/serve.mjs', '--port', String(port)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: 1000 }, reducedMotion: 'reduce' });
await ctx.addInitScript((t) => localStorage.setItem('theme', t), theme);
const p = await ctx.newPage(); await p.goto(`http://localhost:${port}${route}`, { waitUntil: 'load' });
await p.addStyleTag({ content: '.site-header{position:static!important}' });
const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: out });
await b.close(); srv.kill();
