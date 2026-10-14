/**
 * Freshness report: lists facts whose source was last checked longer ago than the fact's window
 * (monthly 45 days, others 90). Prints Markdown; exits 0 always (the workflow decides what to do).
 */
import fs from 'node:fs';
import { load } from 'js-yaml';
type Fact = { id: string; claim: string; source: string; volatility: string; asOf: string | Date };
type Source = { id: string; title: string; url: string; accessed: string | Date };
const facts = load(fs.readFileSync('src/data/facts.yaml', 'utf8')) as Fact[];
const sources = Object.fromEntries((load(fs.readFileSync('src/data/sources.yaml', 'utf8')) as Source[]).map((s) => [s.id, s]));
const limit: Record<string, number> = { monthly: 45, annual: 90, static: 90, live: 90 };
const now = Date.now();
const stale = facts.map((f) => ({ f, s: sources[f.source], age: Math.floor((now - new Date(sources[f.source].accessed).getTime()) / 86400000) }))
  .filter((x) => x.age > (limit[x.f.volatility] ?? 90)).sort((a, b) => b.age - a.age);
if (!stale.length) { console.log('All facts are within their freshness window.'); process.exit(0); }
console.log(`${stale.length} fact(s) need rechecking:\n`);
console.log('| Fact | Last checked | Source |\n|---|---|---|');
for (const x of stale) console.log(`| \`${x.f.id}\`: ${x.f.claim.replace(/\|/g, '/')} | ${x.age} days ago | [${x.s.title}](${x.s.url}) |`);
