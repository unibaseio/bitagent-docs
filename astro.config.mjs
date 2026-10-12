import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineConfig({
  site: 'https://docs.bitagent.io',
  // Old URLs from the GitBook era
  redirects: {
    "/build/deploy-agent-sdk": "/build/deploy-agent/",
    "/build/deploy-agent-go-sdk": "/build/deploy-agent/"
  },
  integrations: [
    mermaid(), // must come before starlight
    starlight({
      title: 'BitAgent Docs',
      favicon: '/favicon.ico', // same icon as bitagent.io
      // Line numbers are opt-in per block: ```ts showLineNumbers
      expressiveCode: { plugins: [pluginLineNumbers()], defaultProps: { showLineNumbers: false } },
      sidebar: [
        {
          "label": "Overview",
          "link": "/"
        },
        {
          "label": "Platform",
          "items": [
            {
              "label": "Overview",
              "slug": "platform"
            },
            {
              "label": "Projects",
              "slug": "platform/projects"
            },
            {
              "label": "AIP Marketplace",
              "slug": "platform/aip-marketplace"
            },
            {
              "label": "Terminal",
              "slug": "platform/terminal"
            },
            {
              "label": "Rankings",
              "slug": "platform/rankings"
            }
          ]
        },
        {
          "label": "Build",
          "items": [
            {
              "label": "Overview",
              "slug": "build"
            },
            {
              "label": "SDK Quickstart",
              "slug": "build/sdk-quickstart"
            },
            {
              "label": "Register Agent to AIP",
              "slug": "build/register-agent"
            },
            {
              "label": "Deploy Agent",
              "slug": "build/deploy-agent"
            },
            {
              "label": "Service Market Integration",
              "slug": "build/service-market"
            },
            {
              "label": "Skill Usage Guide",
              "slug": "build/skill-guide"
            },
            {
              "label": "SDK Reference",
              "slug": "build/sdk-reference"
            },
            {
              "label": "Launch a New Project",
              "slug": "build/launch-project"
            },
            {
              "label": "Launchpad Parameters",
              "slug": "build/launchpad-params"
            },
            {
              "label": "Bond SDK (Trading & Launch)",
              "slug": "build/bond-sdk"
            }
          ]
        },
        {
          "label": "Protocol",
          "items": [
            {
              "label": "Overview",
              "slug": "protocol"
            },
            {
              "label": "AIP Protocol",
              "slug": "protocol/aip-protocol"
            },
            {
              "label": "ERC-8183 Settlement",
              "slug": "protocol/erc8183-agent-commerce"
            },
            {
              "label": "Glossary",
              "slug": "protocol/glossary"
            }
          ]
        },
        {
          "label": "Reference",
          "items": [
            {
              "label": "Overview",
              "slug": "reference"
            },
            {
              "label": "Networks & Contracts",
              "slug": "reference/contracts"
            },
            {
              "label": "Tokenomics",
              "slug": "reference/tokenomics"
            },
            {
              "label": "FAQ",
              "slug": "reference/faq"
            },
            {
              "label": "Links",
              "slug": "reference/links"
            }
          ]
        }
      ],
    }),
  ],
});
