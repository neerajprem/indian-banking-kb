import { getCollection, getEntries, getEntry, type CollectionEntry } from 'astro:content';

export type Citations = {
  facts: Map<string, CollectionEntry<'facts'>>;
  sources: CollectionEntry<'sources'>[];
  number: Map<string, number>; // source id -> citation number
};

/** Build a page's citation index from the facts it declares in frontmatter. Order is declaration order. */
export async function citationsFor(refs: { collection: 'facts'; id: string }[] = [], extraSources: string[] = []): Promise<Citations> {
  const list = refs.length ? await getEntries(refs) : [];
  const facts = new Map<string, CollectionEntry<'facts'>>();
  const sources: CollectionEntry<'sources'>[] = [];
  const number = new Map<string, number>();
  const add = async (id: string) => {
    if (number.has(id)) return;
    const s = await getEntry('sources', id);
    if (!s) throw new Error(`Unknown source "${id}"`);
    sources.push(s);
    number.set(id, sources.length);
  };
  for (const f of list) {
    if (!f) continue;
    facts.set(f.id, f);
    await add(f.data.source.id);
  }
  for (const id of extraSources) await add(id);
  return { facts, sources, number };
}

export function requireFact(c: Citations | undefined, id: string, where: string) {
  const f = c?.facts.get(id);
  if (!f) throw new Error(`Fact "${id}" is used on ${where} but not listed in that page's facts: frontmatter.`);
  return f;
}

/** Freshness: oldest source access date among a page's facts, and whether any fact is still draft. */
export function freshness(c: Citations) {
  const dates = c.sources.map((s) => s.data.accessed.getTime());
  const drafts = [...c.facts.values()].filter((f) => f.data.status !== 'verified').length;
  return { oldest: dates.length ? new Date(Math.min(...dates)) : undefined, drafts, total: c.facts.size };
}

export async function allFacts() {
  return getCollection('facts');
}
