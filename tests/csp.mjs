// Loads pages under the production headers and CSP; fails on any console error or policy violation.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const port = 4413, base = `http://localhost:${port}`;
const srv = spawn('node', ['scripts/serve.mjs', '--port', String(port), '--prod'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const b = await chromium.launch(); const p = await b.newPage(); const msgs = [];
p.on('console', (m) => { if (m.type() === 'error' || /Content.Security.Policy|Refused/i.test(m.text())) msgs.push(`${p.url()}: ${m.text()}`); });
p.on('pageerror', (e) => msgs.push(`${p.url()}: ${e.message}`));
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/core-systems/', '/payment-rails/', '/architecture/', '/architecture/security/', '/architecture/multi-dc/', '/architecture/api-first/', '/glossary/', '/sources/', '/styleguide/'];
for (const r of routes) {
  await p.goto(base + r, { waitUntil: 'load' });
  await p.keyboard.press('/'); await p.keyboard.type('rtgs'); await p.waitForTimeout(300); await p.keyboard.press('Escape');
}
await b.close(); srv.kill();
console.log(msgs.length ? msgs.join('\n') : `csp: ${routes.length} pages under production headers, no console errors or CSP violations`);
process.exit(msgs.length ? 1 : 0);
