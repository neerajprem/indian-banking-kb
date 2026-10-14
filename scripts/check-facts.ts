/**
 * check-facts: the content gate. Runs before every build and fails it on:
 *  - a fact, glossary entry, relation or institution citing an unknown source
 *  - a fact without a source or an asOf date
 *  - a page using <Fact>/<Cite fact> for a fact it does not declare, or declaring an unknown fact
 *  - a topic whose topicId does not match its file name
 *  - TODO or lorem ipsum text in content or data
 *  - any known-wrong claim (src/data/known-errors.json) or forbidden string (forbidden-strings.txt)
 * It warns (does not fail) on stale facts and on locked topic IDs that do not exist yet.
 * Pass --strict to turn warnings about drafts, staleness and missing topics into failures (used at release).
 */
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

const ROOT = process.cwd();
const strict = process.argv.includes('--strict');
const errors: string[] = [];
const warnings: string[] = [];
const rel = (p: string) => path.relative(ROOT, p);
const yaml = <T>(f: string): T => (load(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8')) ?? []) as T;
const walk = (dir: string, exts: string[]): string[] =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
        const p = path.join(dir, d.name);
        return d.isDirectory() ? walk(p, exts) : exts.some((e) => p.endsWith(e)) ? [p] : [];
      })
    : [];

type Source = { id: string; title: string; publisher: string; url: string; type: string; accessed: string | Date };
type Fact = { id: string; claim: string; source: string; asOf: string | Date; volatility: string; confidence: string; status?: string };
const sources = yaml<Source[]>('sources.yaml');
const facts = yaml<Fact[]>('facts.yaml');
const glossary = yaml<{ id: string; term: string; definition: string; source: string; see?: string[]; status?: string }[]>('glossary.yaml');
const institutions = yaml<{ id: string; sources?: string[]; relations?: string[]; employees?: { source: string }; employeesNote?: string; status?: string }[]>('institutions.yaml');
const relations = yaml<{ id: string; from: string; to: string; source: string; status?: string }[]>('relations.yaml');
const rails = yaml<{ id: string; facts?: string[]; status?: string }[]>('rails.yaml');
const platforms = yaml<{ id: string; users?: { fact: string }[] }[]>('platforms.yaml');

const sourceIds = new Set(sources.map((s) => s.id));
const factIds = new Set(facts.map((f) => f.id));
const instIds = new Set(institutions.map((i) => i.id));
const glossIds = new Set(glossary.map((g) => g.id));
const dupes = (list: { id: string }[], what: string) => {
  const seen = new Set<string>();
  for (const { id } of list) { if (seen.has(id)) errors.push(`Duplicate ${what} id "${id}"`); seen.add(id); }
};
dupes(sources, 'source'); dupes(facts, 'fact'); dupes(glossary, 'glossary'); dupes(institutions, 'institution'); dupes(relations, 'relation');

// Sources
for (const s of sources) {
  for (const k of ['title', 'publisher', 'url', 'type', 'accessed'] as const) if (!s[k]) errors.push(`Source "${s.id}" has no ${k}`);
  try { new URL(s.url); } catch { errors.push(`Source "${s.id}" has an invalid url`); }
}
// Facts
const DAY = 86400000;
const windowDays: Record<string, number> = { monthly: 45, annual: 400, static: 90, live: Infinity };
const accessed = Object.fromEntries(sources.map((s) => [s.id, new Date(s.accessed).getTime()]));
for (const f of facts) {
  if (!f.source) errors.push(`Fact "${f.id}" has no source`);
  else if (!sourceIds.has(f.source)) errors.push(`Fact "${f.id}" cites unknown source "${f.source}"`);
  if (!f.asOf || isNaN(new Date(f.asOf).getTime())) errors.push(`Fact "${f.id}" has no valid asOf date`);
  if (!f.claim) errors.push(`Fact "${f.id}" has no claim`);
  if (f.source && accessed[f.source]) {
    const age = Math.floor((Date.now() - accessed[f.source]) / DAY);
    const limit = Math.min(90, windowDays[f.volatility] ?? 90);
    if (age > limit) (strict ? errors : warnings).push(`Fact "${f.id}" was last checked ${age} days ago (limit ${limit})`);
  }
  if (strict && f.status !== 'verified') errors.push(`Fact "${f.id}" is still a draft`);
}
// Glossary
for (const g of glossary) {
  if (!sourceIds.has(g.source)) errors.push(`Glossary "${g.id}" cites unknown source "${g.source}"`);
  if ((g.definition ?? '').length > 240) errors.push(`Glossary "${g.id}" definition is over 240 characters`);
  for (const s of g.see ?? []) if (!glossIds.has(s)) errors.push(`Glossary "${g.id}" sees unknown term "${s}"`);
}
// Institutions and relations
for (const i of institutions) {
  for (const s of i.sources ?? []) if (!sourceIds.has(s)) errors.push(`Institution "${i.id}" cites unknown source "${s}"`);
  if (i.employees && !sourceIds.has(i.employees.source)) errors.push(`Institution "${i.id}" employee figure cites unknown source`);
  if (!i.employees && !i.employeesNote) errors.push(`Institution "${i.id}" needs a sourced employee figure or "not publicly disclosed"`);
  for (const r of i.relations ?? []) if (!instIds.has(r)) errors.push(`Institution "${i.id}" relates to unknown institution "${r}"`);
}
for (const r of relations) {
  if (!instIds.has(r.from) || !instIds.has(r.to)) errors.push(`Relation "${r.id}" points at an unknown institution`);
  if (!sourceIds.has(r.source)) errors.push(`Relation "${r.id}" cites unknown source "${r.source}"`);
}
for (const r of rails) for (const f of r.facts ?? []) if (!factIds.has(f)) errors.push(`Rail "${r.id}" uses unknown fact "${f}"`);
for (const p of platforms) for (const u of p.users ?? []) if (!factIds.has(u.fact)) errors.push(`Platform "${p.id}" user cites unknown fact "${u.fact}"`);

// MDX content: declared facts, used facts, topic ids
const LOCKED: Record<string, string[]> = {
  architecture: ['cbs', 'payments', 'event-driven', 'modernisation', 'multi-dc', 'api-first', 'data', 'security', 'hybrid-cloud'],
  technologies: ['core-platforms', 'databases', 'messaging', 'integration', 'containers', 'cloud', 'security-tech', 'observability', 'ml-ai', 'mobile', 'languages', 'payment-tech'],
};
const contentFiles = walk(path.join(ROOT, 'src/content'), ['.mdx', '.md']);
for (const file of contentFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  const data = (fm ? load(fm[1]) : {}) as { facts?: string[]; topicId?: string };
  const declared = new Set(data.facts ?? []);
  for (const f of declared) if (!factIds.has(f)) errors.push(`${rel(file)} declares unknown fact "${f}"`);
  for (const m of text.matchAll(/<(?:Fact\s+[^>]*?id|Cite\s+[^>]*?fact)="([^"]+)"/g)) {
    if (!factIds.has(m[1])) errors.push(`${rel(file)} uses unknown fact "${m[1]}"`);
    else if (!declared.has(m[1])) errors.push(`${rel(file)} uses fact "${m[1]}" without declaring it in facts:`);
  }
  for (const m of text.matchAll(/<Cite\s+[^>]*?source="([^"]+)"/g)) if (!sourceIds.has(m[1])) errors.push(`${rel(file)} cites unknown source "${m[1]}"`);
  const col = path.relative(path.join(ROOT, 'src/content'), file).split(path.sep)[0];
  if (LOCKED[col]) {
    const id = path.basename(file).replace(/\.mdx?$/, '');
    if (data.topicId !== id) errors.push(`${rel(file)}: topicId "${data.topicId}" must equal the file name "${id}"`);
  }
}
for (const [col, ids] of Object.entries(LOCKED)) {
  const have = new Set(walk(path.join(ROOT, 'src/content', col), ['.mdx']).map((f) => path.basename(f, '.mdx')));
  const missing = ids.filter((i) => !have.has(i));
  if (missing.length) (strict ? errors : warnings).push(`${col}: ${missing.length} locked topics not written yet (${missing.join(', ')})`);
}

// Text gates: TODO/lorem, known errors, forbidden strings
const scanFiles = [
  ...contentFiles,
  ...walk(path.join(ROOT, 'src/data'), ['.yaml', '.yml']),
  ...walk(path.join(ROOT, 'src/pages'), ['.astro', '.ts']),
  ...walk(path.join(ROOT, 'src/components'), ['.astro']),
];
const known = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/known-errors.json'), 'utf8')).patterns as { id: number; re: string; why: string }[];
const forbiddenFile = path.join(ROOT, 'forbidden-strings.txt');
const forbidden = fs.existsSync(forbiddenFile)
  ? fs.readFileSync(forbiddenFile, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  : [];
// forbidden-strings.txt is optional (git-ignored); when absent, only the known-error patterns are enforced.
for (const file of scanFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (/\bTODO\b|lorem ipsum/i.test(text)) errors.push(`${rel(file)} contains TODO or lorem ipsum`);
  for (const k of known) if (new RegExp(k.re, 'i').test(text)) errors.push(`${rel(file)} matches known error #${k.id}: ${k.why}`);
  const lower = text.toLowerCase();
  for (const s of forbidden) if (lower.includes(s.toLowerCase())) errors.push(`${rel(file)} contains a forbidden string (see forbidden-strings.txt)`);
}

// Report
const count = <T,>(list: T[], key: (t: T) => string) => list.reduce<Record<string, number>>((a, t) => ((a[key(t)] = (a[key(t)] ?? 0) + 1), a), {});
console.log(`check-facts: ${sources.length} sources, ${facts.length} facts, ${glossary.length} glossary terms, ${institutions.length} institutions, ${relations.length} relations`);
console.log('  facts by status:', JSON.stringify(count(facts, (f) => f.status ?? 'draft')), ' by confidence:', JSON.stringify(count(facts, (f) => f.confidence)));
console.log('  glossary by status:', JSON.stringify(count(glossary, (g) => g.status ?? 'draft')));
for (const w of warnings) console.log('  warning:', w);
if (errors.length) {
  for (const e of errors) console.error('  ERROR:', e);
  console.error(`check-facts failed with ${errors.length} error(s)`);
  process.exit(1);
}
console.log('check-facts passed');
