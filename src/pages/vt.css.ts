// Generated stylesheet: gives each topic card title and its detail-page heading the same
// view-transition name, so the card morphs into the page. Regenerated from the collections on every build.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const ids = [...(await getCollection('architecture')), ...(await getCollection('technologies'))].map((e) => `${e.collection}-${e.id}`);
  const css = ids.map((id) => `[data-vt="${id}"]{view-transition-name:vt-${id}}`).join('\n');
  return new Response(`${css}\n@media (prefers-reduced-motion: reduce){[data-vt]{view-transition-name:none}}\n`, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};
