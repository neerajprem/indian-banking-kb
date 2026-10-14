import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Shared vocabularies
export const DOMAINS = ['foundation', 'design', 'decision', 'governance', 'reference'] as const;
export const DEPTHS = ['intro', 'intermediate', 'advanced'] as const;
const status = z.enum(['draft', 'verified']).default('draft');
const isoDate = z.coerce.date();

// Pages: Core systems, Payment rails, High-volume, Build vs buy, Limitations, Regulators,
// plus section intros (Architecture, Technologies, RBI ecosystem) with kind: section.
const pageFields = {
  title: z.string(),
  summary: z.string().max(200),
  domain: z.enum(DOMAINS),
  order: z.number(),
  updated: isoDate,
  tags: z.array(z.string()).default([]),
  facts: z.array(reference('facts')).default([]),
};

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({ ...pageFields, kind: z.enum(['page', 'section']).default('page'), navTitle: z.string().optional() }),
});

const topic = z.object({
  ...pageFields,
  topicId: z.string().regex(/^[a-z0-9-]+$/),
  blurb: z.string().max(140),
  depth: z.enum(DEPTHS),
  related: z.array(z.string()).default([]),
  diagrams: z.array(z.string()).default([]),
});

const architecture = defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/architecture' }), schema: topic });
const technologies = defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/technologies' }), schema: topic });

// Institution prose lives in MDX; the structured, sourced record lives in src/data/institutions.yaml.
const institutions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/institutions' }),
  schema: z.object({ updated: isoDate, facts: z.array(reference('facts')).default([]) }),
});

const sourced = z.object({ value: z.number().int().positive(), asOf: isoDate, source: reference('sources') });

const institutionData = defineCollection({
  loader: file('./src/data/institutions.yaml'),
  schema: z
    .object({
      short: z.string(),
      full: z.string(),
      // Verified grouping (Stage 3): wholly owned by RBI; set up by RBI or at its instance but not owned by it;
      // owned by the Government of India; or the central bank itself (hub of the relationship map).
      group: z.enum(['rbi-subsidiary', 'rbi-established', 'government', 'central-bank']),
      category: z.string(),
      headquarters: z.string().optional(),
      established: z.number().int().optional(),
      establishedNote: z.string().optional(),
      employees: sourced.optional(),
      // 'not yet sourced' = no official figure found in the sources checked so far (never an estimate).
      employeesNote: z.enum(['not publicly disclosed', 'not yet sourced']).optional(),
      roles: z.array(z.string()).min(1),
      relations: z.array(reference('institutionData')).default([]),
      officialUrl: z.string().url(),
      sources: z.array(reference('sources')).min(1),
      status,
    })
    .refine((d) => Boolean(d.employees) !== Boolean(d.employeesNote), {
      message: 'Give either a sourced employees figure or employeesNote: "not publicly disclosed", not both',
    }),
});

const facts = defineCollection({
  loader: file('./src/data/facts.yaml'),
  schema: z.object({
    claim: z.string().min(10),
    value: z.union([z.number(), z.string()]).optional(),
    unit: z.string().optional(),
    asOf: isoDate,
    source: reference('sources'),
    volatility: z.enum(['static', 'annual', 'monthly', 'live']),
    confidence: z.enum(['official', 'reported', 'vendor-claim', 'illustrative']),
    status,
    note: z.string().optional(),
    supersededBy: z.string().optional(),
  }),
});

const sources = defineCollection({
  loader: file('./src/data/sources.yaml'),
  schema: z.object({
    title: z.string(),
    publisher: z.string(),
    url: z.string().url(),
    type: z.enum(['primary', 'reputable-press', 'vendor', 'analyst']),
    accessed: isoDate,
  }),
});

const glossary = defineCollection({
  loader: file('./src/data/glossary.yaml'),
  schema: z.object({
    term: z.string(),
    expansion: z.string(),
    definition: z.string().max(240),
    domain: z.enum(['institution', 'payments', 'banking', 'technology', 'regulation']),
    see: z.array(z.string()).default([]),
    source: reference('sources'),
    autolink: z.boolean().default(true),
    status,
  }),
});

const relations = defineCollection({
  loader: file('./src/data/relations.yaml'),
  schema: z.object({
    from: reference('institutionData'),
    to: reference('institutionData'),
    type: z.enum(['operational', 'regulatory', 'data', 'settlement', 'infrastructure', 'ownership', 'founding']),
    label: z.string(),
    description: z.string(),
    source: reference('sources'),
    status,
  }),
});

const rails = defineCollection({
  loader: file('./src/data/rails.yaml'),
  schema: z.object({
    note: z.string().optional(),
    short: z.string(),
    full: z.string(),
    operator: z.string(),
    settlement: z.string(),
    use: z.string(),
    line: z.enum(['upi', 'imps', 'cts', 'nach', 'cards', 'rtgs', 'neft']).optional(),
    facts: z.array(reference('facts')).default([]),
    status,
  }),
});

const platforms = defineCollection({
  loader: file('./src/data/platforms.yaml'),
  schema: z.object({
    name: z.string(),
    maker: z.string(),
    users: z.array(z.object({ bank: z.string(), fact: reference('facts') })).default([]),
    status,
  }),
});

const nav = defineCollection({
  loader: file('./src/data/nav.yaml'),
  schema: z.object({ title: z.string(), domain: z.enum(DOMAINS), order: z.number(), items: z.array(z.string()) }),
});

const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
  schema: z.object({ title: z.string(), date: isoDate }),
});

export const collections = {
  pages, architecture, technologies, institutions, institutionData,
  facts, sources, glossary, relations, rails, platforms, nav, changelog,
};
