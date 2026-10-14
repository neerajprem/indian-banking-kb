// Small index of glossary short names, used by the search box to pin exact matches first.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const terms = (await getCollection('glossary')).map((g) => ({ t: g.data.term, id: g.id, e: g.data.expansion }));
  return new Response(JSON.stringify(terms), { headers: { 'Content-Type': 'application/json' } });
};
