import { getCollection } from 'astro:content';

type Item = { href: string; title: string; summary: string; tags: string[] };

async function everything(): Promise<Item[]> {
  const [pages, arch, tech] = await Promise.all([getCollection('pages'), getCollection('architecture'), getCollection('technologies')]);
  return [
    ...pages.map((p) => ({ href: `/${p.id}/`, title: p.data.title, summary: p.data.summary, tags: p.data.tags })),
    ...arch.map((p) => ({ href: `/architecture/${p.id}/`, title: p.data.title, summary: p.data.blurb, tags: p.data.tags })),
    ...tech.map((p) => ({ href: `/technologies/${p.id}/`, title: p.data.title, summary: p.data.blurb, tags: p.data.tags })),
  ];
}

/** Explicit related links first, then pages sharing the most tags. */
export async function relatedTo(href: string, tags: string[], explicit: string[] = [], limit = 3) {
  // Exclude the page itself and, on a section overview, the topics it already lists.
  const all = (await everything()).filter((i) => i.href !== href && !i.href.startsWith(href));
  const picked = explicit.map((h) => all.find((i) => i.href === h)).filter(Boolean) as Item[];
  const scored = all
    .filter((i) => !picked.includes(i))
    .map((i) => ({ i, s: i.tags.filter((t) => tags.includes(t)).length }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.i.title.localeCompare(b.i.title))
    .map((x) => x.i);
  return [...picked, ...scored].slice(0, limit);
}
