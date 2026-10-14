import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
export const PORT = 4399;
export const BASE = `http://localhost:${PORT}`;
export function startServer(extra = []) {
  const p = spawn('node', ['scripts/serve.mjs', '--port', String(PORT), ...extra], { stdio: 'ignore' });
  return new Promise((r) => setTimeout(() => r(p), 600));
}
export function routes() {
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'pagefind' && e.name !== '_astro') walk(p); }
    else if (e.name === 'index.html') out.push('/' + path.relative('dist', path.dirname(p)).replace(/\\/g, '/') + (path.dirname(p) === 'dist' ? '' : '/'));
  });
  walk('dist');
  // ROUTES=/a/,/b/ restricts a run to specific pages.
  if (process.env.ROUTES) return process.env.ROUTES.split(',');
  const all = out.map((r) => r.replace('//', '/')).sort();
  // CHUNK=i/n runs every n-th route starting at i, so long suites can be split across runs.
  const [i, n] = (process.env.CHUNK || '0/1').split('/').map(Number);
  return all.filter((_, k) => k % n === i);
}
