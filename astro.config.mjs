import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { BASE, generate, sidebar, redirects } from './scripts/gitbook.mjs';

generate();

export default defineConfig({
  site: process.env.DOCS_SITE, // e.g. https://unibaseio.github.io — enables sitemap + canonical URLs
  base: BASE || undefined,
  redirects: redirects(),
  integrations: [
    mermaid(), // must come before starlight
    starlight({
      title: 'BitAgent Docs',
      sidebar: sidebar(),
      // Off by default; blocks marked lineNumbers="true" in GitBook get `showLineNumbers`.
      expressiveCode: { plugins: [pluginLineNumbers()], defaultProps: { showLineNumbers: false } },
    }),
  ],
});
