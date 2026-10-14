import { getCollection } from 'astro:content';

export const GROUPS: Record<string, { label: string; domain: string; blurb: string }> = {
  'central-bank': { label: 'Central bank', domain: 'reference', blurb: 'The Reserve Bank of India itself.' },
  'rbi-subsidiary': { label: 'Wholly owned by RBI', domain: 'design', blurb: 'Companies RBI owns outright.' },
  'rbi-established': { label: 'Set up by RBI or at its instance, not owned by RBI', domain: 'foundation', blurb: 'Bodies RBI created or promoted, now owned by others or by no one.' },
  government: { label: 'Owned by the Government of India', domain: 'governance', blurb: 'Statutory bodies and Government companies outside RBI ownership.' },
};

export async function institutionsWithRelations() {
  const [records, relations, sources] = await Promise.all([getCollection('institutionData'), getCollection('relations'), getCollection('sources')]);
  const src = Object.fromEntries(sources.map((s) => [s.id, s]));
  return { records, relations, src };
}
