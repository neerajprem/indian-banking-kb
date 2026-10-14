// Weight budgets from 02-TRD section 10: JS <= 50 KB gzip per content page (search index excluded, it loads on demand),
// CSS <= 40 KB gzip, <= 2 font families and <= 4 preloaded files, longest page HTML <= 150 KB gzip.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const gz = (f) => zlib.gzipSync(fs.readFileSync(f)).length;
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const pages = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) { if (!['pagefind', '_astro'].includes(e.name)) walk(p); } else if (p.endsWith('.html')) pages.push(p); });
walk('dist');
function jsClosure(file, seen = new Set()) {
  if (seen.has(file) || !fs.existsSync(file)) return seen;
  seen.add(file);
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/(?:import|from)\s*["'](\.{1,2}\/[^"']+\.js)["']/g)) jsClosure(path.join(path.dirname(file), m[1]), seen);
  return seen;
}
let fail = 0; const rows = [];
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const js = new Set();
  for (const m of html.matchAll(/<script[^>]*\bsrc="(\/_astro\/[^"]+\.js)"/g)) jsClosure(path.join('dist', m[1]), js);
  const css = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(\/_astro\/[^"]+\.css)"/g)].map((m) => path.join('dist', m[1]));
  const preload = [...html.matchAll(/rel="preload"[^>]*as="font"/g)].length;
  const jsGz = [...js].reduce((a, f) => a + gz(f), 0), cssGz = css.reduce((a, f) => a + gz(f), 0), htmlGz = gz(p);
  const ok = jsGz <= 50 * 1024 && cssGz <= 40 * 1024 && preload <= 4 && htmlGz <= 150 * 1024;
  if (!ok) fail++;
  rows.push({ page: '/' + path.relative('dist', p).replace(/index\.html$/, ''), js: kb(jsGz), files: js.size, css: kb(cssGz), fonts: preload, html: kb(htmlGz), ok });
}
const fonts = fs.readdirSync('dist/_astro').filter((f) => f.endsWith('.woff2')).map((f) => `${f.split('.')[0]} ${kb(fs.statSync('dist/_astro/' + f).size)}`);
console.table(rows); console.log('font files:', fonts.join(', '));
process.exit(fail ? 1 : 0);
