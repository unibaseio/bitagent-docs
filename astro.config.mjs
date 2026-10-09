import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { generate, sidebar, redirects } from './scripts/gitbook.mjs';

generate();

export default defineConfig({
  // site: 'https://docs.example.com', // set once the domain is chosen (sitemap + canonical URLs)
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
