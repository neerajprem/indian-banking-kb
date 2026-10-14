import { getCollection } from 'astro:content';

export type NavItem = { slug: string; title: string; href: string; domain: string };
export type NavGroup = { id: string; title: string; domain: string; items: NavItem[] };

// Routes that exist without a pages-collection entry.
const BUILT_IN: Record<string, string> = { glossary: 'Glossary', sources: 'Sources', changelog: 'Changelog' };
export const BUILT_IN_SUMMARY: Record<string, string> = {
  glossary: 'Every short name used on the site, with its expansion and a plain definition.',
  sources: 'How facts are chosen, dated and checked, and when each was last verified.',
  changelog: 'What changed on the site and when, newest first.',
};
// Section pages whose children come from a collection.
export const SECTION_CHILDREN: Record<string, 'architecture' | 'technologies' | 'institutions'> = {
  architecture: 'architecture',
  technologies: 'technologies',
  'rbi-ecosystem': 'institutions',
};

export async function getNav(): Promise<NavGroup[]> {
  const groups = (await getCollection('nav')).sort((a, b) => a.data.order - b.data.order);
  const pages = new Map((await getCollection('pages')).map((p) => [p.id, p]));
  const out: NavGroup[] = [];
  for (const g of groups) {
    const items: NavItem[] = [];
    for (const slug of g.data.items) {
      const page = pages.get(slug);
      if (page) items.push({ slug, title: page.data.navTitle ?? page.data.title, href: `/${slug}/`, domain: g.data.domain });
      else if (BUILT_IN[slug]) items.push({ slug, title: BUILT_IN[slug], href: `/${slug}/`, domain: g.data.domain });
    }
    if (items.length) out.push({ id: g.id, title: g.data.title, domain: g.data.domain, items });
  }
  return out;
}

export async function sectionChildren(slug: string) {
  const col = SECTION_CHILDREN[slug];
  if (!col) return [];
  if (col === 'institutions') {
    // Institution pages exist only where an MDX file does; titles come from the structured record.
    const data = new Map((await getCollection('institutionData')).map((d) => [d.id, d]));
    const pages = (await getCollection('institutions')).filter((e) => data.has(e.id));
    return pages
      .map((e) => ({ slug: `${slug}/${e.id}`, title: data.get(e.id)!.data.short, href: `/${slug}/${e.id}/`, domain: 'governance' }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }
  const list = await getCollection(col);
  return list
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
    .map((e) => ({ slug: `${slug}/${e.id}`, title: e.data.title, href: `/${slug}/${e.id}/`, domain: e.data.domain }));
}

/** Reading order: every nav item, with each section's topics straight after the section page. */
export async function readingOrder(): Promise<NavItem[]> {
  const order: NavItem[] = [];
  for (const g of await getNav()) {
    for (const item of g.items) {
      order.push(item);
      order.push(...(await sectionChildren(item.slug)));
    }
  }
  return order;
}

export async function pagerFor(href: string) {
  const order = await readingOrder();
  const i = order.findIndex((o) => o.href === href);
  return { prev: i > 0 ? order[i - 1] : undefined, next: i >= 0 && i < order.length - 1 ? order[i + 1] : undefined };
}

export async function groupFor(href: string) {
  const nav = await getNav();
  const top = '/' + href.split('/').filter(Boolean)[0] + '/';
  return nav.find((g) => g.items.some((i) => i.href === top));
}
