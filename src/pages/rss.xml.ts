// RSS feed of the changelog, newest first.
import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { SITE } from '../lib/site';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const GET: APIRoute = async ({ site }) => {
  const entries = (await getCollection('changelog')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const link = new URL('/changelog/', site).href;
  const items = entries.map((e) => `<item><title>${esc(e.data.title)}</title><link>${link}#cl-${e.id}</link><guid isPermaLink="false">${e.id}</guid><pubDate>${e.data.date.toUTCString()}</pubDate><description>${esc((e.body ?? '').trim())}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE.name)}: changelog</title><link>${link}</link><description>What changed on the site and when.</description><language>en-in</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
