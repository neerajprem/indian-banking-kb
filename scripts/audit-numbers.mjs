// Stage 7 audit: lists numbers, dates, amounts and percentages in rendered article text that are NOT inside
// a sourced fact, a citation, a code block, a diagram, or a figure/table marked illustrative. Each hit needs review.
import fs from 'node:fs';
import path from 'node:path';
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) { if (!['pagefind', '_astro', 'styleguide'].includes(e.name)) walk(p); } else if (e.name === 'index.html') files.push(p); });
walk('dist');
const NUM = /(₹\s?[\d,.]+(\s?(lakh|crore|trillion|billion))?|\b\d{1,3}(,\d{2,3})+\b|\b\d+(\.\d+)?\s?(%|per cent|billion|million|lakh|crore|trillion|days?|hours?|months?|years?|minutes?|seconds?|ms|KB|MB)\b|\b(19|20)\d{2}\b|\bT\+\d\b)/gi;
let total = 0;
for (const f of files) {
  let h = fs.readFileSync(f, 'utf8');
  const a = h.indexOf('<article'); if (a < 0) continue;
  h = h.slice(a, h.indexOf('</article>'));
  h = h.replace(/<svg[\s\S]*?<\/svg>|<pre[\s\S]*?<\/pre>|<details class="alt-text">[\s\S]*?<\/details>/g, ' ')
       .replace(/<span class="(fact|fact fact--draft)"[^>]*>[\s\S]*?<\/span>/g, ' ')
       .replace(/<sup class="cite">[\s\S]*?<\/sup>/g, ' ')
       .replace(/<span[^>]*class="(gl-tip|cite-tip)"[^>]*>[\s\S]*?<\/span>/g, ' ');
  // Tables and figures whose own note or caption says "Illustrative" are excluded.
  h = h.replace(/<figure[\s\S]*?<\/figure>/g, (m) => (/Illustrative/i.test(m) ? ' ' : m));
  h = h.replace(/<div class="table-wrap[\s\S]*?<\/table>\s*<\/div>\s*(<p class="table-note">[\s\S]*?<\/p>)?/g, (m) => (/Illustrative|Sources|see sources|general (industry )?patterns/i.test(m) ? ' ' : m));
  const text = h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');
  const hits = [...new Set([...text.matchAll(NUM)].map((m) => { const i = m.index; return text.slice(Math.max(0, i - 60), i + m[0].length + 30).trim(); }))];
  if (hits.length) { total += hits.length; console.log(`\n${f.replace('dist', '').replace('index.html', '')} (${hits.length})`); hits.slice(0, 12).forEach((x) => console.log('   …' + x + '…')); if (hits.length > 12) console.log(`   (+${hits.length - 12} more)`); }
}
console.log(`\n${total} candidate figures outside sourced facts`);
