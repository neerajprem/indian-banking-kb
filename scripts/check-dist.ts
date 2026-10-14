/**
 * check-dist: runs on the built site. Fails on:
 *  - inline style="" attributes or <style> elements (blocked by the CSP's style-src 'self')
 *  - inline scripts other than the known theme snippet and JSON-LD data blocks
 *  - internal links or #anchors that do not resolve
 *  - known-wrong claims or forbidden strings in the rendered text
 * Writes dist/.csp-hashes.json with the SHA-256 of every allowed inline script, for the CSP header.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DIST = path.join(process.cwd(), 'dist');
const errors: string[] = [];
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? (e.name === 'pagefind' ? [] : walk(p)) : p.endsWith('.html') ? [p] : [];
});
const pages = walk(DIST);
const urlOf = (file: string) => '/' + path.relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
const ids = new Map<string, Set<string>>();
const html = new Map<string, string>();
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8');
  html.set(urlOf(f), h);
  ids.set(urlOf(f), new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}
const known = JSON.parse(fs.readFileSync('src/data/known-errors.json', 'utf8')).patterns as { id: number; re: string; why: string }[];
const forbidden = fs.existsSync('forbidden-strings.txt')
  ? fs.readFileSync('forbidden-strings.txt', 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')) : [];
const hashes = new Set<string>();
const exists = (u: string) => {
  const clean = u.split('#')[0].split('?')[0];
  if (clean === '' ) return true;
  const f = path.join(DIST, decodeURIComponent(clean));
  return (fs.existsSync(f) && fs.statSync(f).isFile()) || fs.existsSync(path.join(f, 'index.html'));
};

for (const [url, h] of html) {
  if (/\sstyle="/.test(h)) errors.push(`${url}: inline style attribute`);
  if (/<style[\s>]/.test(h)) errors.push(`${url}: <style> element`);
  for (const m of h.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1], body = m[2];
    if (/application\/ld\+json/.test(attrs)) continue;
    if (!body.startsWith("(function(){var d=document.documentElement;")) { errors.push(`${url}: unexpected inline script`); continue; }
    hashes.add("'sha256-" + crypto.createHash('sha256').update(body).digest('base64') + "'");
  }
  for (const m of h.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    if (href.startsWith('#')) { if (href.length > 1 && !ids.get(url)!.has(decodeURIComponent(href.slice(1)))) errors.push(`${url}: missing anchor ${href}`); continue; }
    if (!href.startsWith('/')) { errors.push(`${url}: relative link ${href}`); continue; }
    if (!exists(href)) { errors.push(`${url}: broken link ${href}`); continue; }
    const [p, a] = href.split('#');
    if (a && html.has(p) && !ids.get(p)!.has(decodeURIComponent(a))) errors.push(`${url}: missing anchor ${href}`);
  }
  // Block boundaries (cells, rows, paragraphs, list items, headings) become line breaks, so a pattern
  // cannot match across two separate table cells or list items.
  const text = h
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<\/(td|th|tr|p|li|h[1-6]|div|section|figcaption|caption|dd|dt)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t]+/g, ' ');
  // Rendering slips: a JavaScript value printed instead of content.
  for (const slip of ['[object Object]', ' undefined ', ' NaN ']) if (text.includes(slip)) errors.push(`${url}: rendering slip "${slip.trim()}" in page text`);
  for (const k of known) if (new RegExp(k.re, 'i').test(text)) errors.push(`${url}: known error #${k.id} (${k.why})`);
  for (const s of forbidden) if (text.toLowerCase().includes(s.toLowerCase())) errors.push(`${url}: forbidden string`);
}
fs.writeFileSync(path.join(DIST, '.csp-hashes.json'), JSON.stringify([...hashes], null, 2));
console.log(`check-dist: ${pages.length} pages, ${hashes.size} inline script hash(es)`);
if (errors.length) { errors.forEach((e) => console.error('  ERROR:', e)); console.error(`check-dist failed with ${errors.length} error(s)`); process.exit(1); }
console.log('check-dist passed');
