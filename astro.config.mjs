import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { sentinelTheme, styleToClass } from './src/lib/highlight.mjs';
import rehypeGlossary from './src/lib/rehype-glossary.mjs';
import rehypeTables from './src/lib/rehype-tables.mjs';

// Set SITE_URL when a domain exists. The placeholder keeps canonical URLs and the sitemap valid meanwhile.
const site = process.env.SITE_URL || 'https://example.invalid';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  prefetch: false,
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !/\/(styleguide|404)\/?$/.test(page) }),
  ],
  markdown: {
    shikiConfig: { theme: sentinelTheme, transformers: [styleToClass], wrap: false },
    rehypePlugins: [rehypeGlossary, rehypeTables],
  },
  vite: { build: { assetsInlineLimit: 0 } },
});
