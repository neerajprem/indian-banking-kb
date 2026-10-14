// Contrast check of every text/background token pair, light and dark. Text needs 4.5:1 (AA);
// body ink aims for 7:1; graphics, focus rings and control borders need 3:1 (WCAG 1.4.11).
import fs from 'node:fs';
const css = fs.readFileSync('src/styles/tokens.css', 'utf8');
const block = (sel) => {
  const i = css.indexOf(sel + ' {'); const body = css.slice(i, css.indexOf('\n  }', i));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
};
const light = block(':root'); const dark = { ...light, ...block('[data-theme="dark"]') };
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const text = [['ink', 'bg', 7], ['ink', 'surface', 7], ['ink-2', 'bg', 4.5], ['ink-2', 'surface', 4.5], ['ink-3', 'bg', 4.5], ['ink-3', 'surface', 4.5],
  ['accent-ink', 'bg', 4.5], ['accent-ink', 'surface', 4.5], ['accent-ink', 'accent-tint', 4.5], ['on-accent', 'accent', 4.5], ['on-accent', 'accent-ink', 4.5], ['bg', 'ink', 4.5], ['ink', 'accent-tint', 4.5]];
for (const d of ['foundation', 'design', 'decision', 'governance', 'reference']) text.push([`d-${d}-ink`, `d-${d}-tint`, 4.5], [`d-${d}-ink`, 'bg', 4.5], ['ink', `d-${d}-tint`, 4.5]);
for (const c of ['note', 'caution', 'risk', 'definition']) text.push([`c-${c}-ink`, `c-${c}-tint`, 4.5], ['ink', `c-${c}-tint`, 4.5]);
for (const t of ['comment', 'string', 'keyword', 'number', 'func', 'type', 'tag', 'attr', 'variable']) text.push([`tk-${t}`, 'code-bg', 4.5]);
const graphic = [['focus', 'bg', 3], ['rule-strong', 'bg', 3], ['rule-strong', 'surface', 3], ['focus', 'surface', 3], ['ink-2', 'bg', 3], ...['upi', 'imps', 'cts', 'nach', 'cards', 'rtgs', 'neft'].map((r) => [r, 'bg', 3]),
  ...['foundation', 'design', 'decision', 'governance', 'reference'].map((d) => [`d-${d}`, 'bg', 3]), ...['note', 'caution', 'risk', 'definition'].map((c) => [`c-${c}`, `c-${c}-tint`, 3])];
let fails = 0; const rows = [];
for (const [name, t] of [['light', light], ['dark', dark]]) for (const [kind, list] of [['text', text], ['graphic', graphic]]) for (const [fg, bg, min] of list) {
  if (!t[fg] || !t[bg]) { console.log('missing token', name, fg, bg); fails++; continue; }
  const r = ratio(t[fg], t[bg]); const ok = r >= min; if (!ok) fails++;
  rows.push(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(5)} ${kind.padEnd(7)} --${fg} on --${bg}: ${r.toFixed(2)} (needs ${min})`);
}
const min = rows.map((r) => +r.match(/: ([\d.]+) /)[1]);
console.log(rows.filter((r) => r.startsWith('FAIL')).join('\n') || 'All pairs pass.');
console.log(`contrast: ${rows.length} pairs checked, ${fails} failure(s); lowest ratio ${Math.min(...min).toFixed(2)}`);
fs.mkdirSync('tests/output', { recursive: true }); fs.writeFileSync('tests/output/contrast.txt', rows.join('\n'));
process.exit(fails ? 1 : 0);
