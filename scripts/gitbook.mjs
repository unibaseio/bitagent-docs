// Builds the Starlight site from the GitBook sources, which stay the single
// source of truth while GitBook Git Sync is on: SUMMARY.md drives the sidebar,
// .gitbook.yaml the redirects, and every page in SUMMARY.md is converted into
// src/content/docs/ (generated, gitignored) on each `astro dev` / `astro build`.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'src/content/docs';
const ASIDE = { info: 'note', success: 'tip', warning: 'caution', danger: 'danger' };

// GitBook URL scheme, kept so links and the domain can move over unchanged:
// README.md -> /, build/README.md -> /build/, build/x.md -> /build/x/
export const urlOf = (file) =>
  '/' + file.replace(/(^|\/)README\.md$/, '$1').replace(/\.md$/, '/');

const summary = () =>
  [...fs.readFileSync('SUMMARY.md', 'utf8').matchAll(/^( *)\* \[(.+)\]\((.+\.md)\)$/gm)];

export function sidebar() {
  const top = [];
  for (const [, indent, label, file] of summary()) {
    const item = { label, link: urlOf(file) };
    if (indent) top.at(-1).items.push(item);
    else top.push({ ...item, items: [] });
  }
  // Starlight group headers aren't links, so a section's index page becomes its first entry.
  return top.map(({ label, link, items }) =>
    items.length ? { label, items: [{ label: 'Overview', link }, ...items] } : { label, link },
  );
}

export function redirects() {
  const block = fs.readFileSync('.gitbook.yaml', 'utf8').split('redirects:')[1] ?? '';
  return Object.fromEntries(
    [...block.matchAll(/^\s+(\S+): (\S+\.md)$/gm)].map(([, from, to]) => ['/' + from, urlOf(to)]),
  );
}

function convert(file, src) {
  const title = src.match(/^# (.+)$/m)[1];
  let step = 0;
  let body = src
    .replace(/^# .+\n+/m, '') // Starlight renders the title itself
    .replace(/\]\((?!https?:)([^)\s#]+\.md)(#[^)\s]*)?\)/g, (_, target, hash = '') =>
      `](${urlOf(path.posix.join(path.posix.dirname(file), target))}${hash})`)
    .replace(/\{% hint style="(\w+)" %\}/g, (_, style) => ':::' + (ASIDE[style] ?? 'note'))
    .replace(/\{% endhint %\}/g, ':::')
    .replace(/\{% code title="([^"]+)"([^%]*)%\}\n```(\w*)/g, (_, title, attrs, lang) =>
      `\`\`\`${lang} title="${title}"${attrs.includes('lineNumbers="true"') ? ' showLineNumbers' : ''}`)
    .replace(/\{% endcode %\}\n?/g, '')
    .replace(/\{% step %\}\n+### /g, () => `## Step ${++step}: `)
    .replace(/\{% (stepper|endstepper|endstep) %\}\n?/g, '')
    .replace(/\{% tabs %\}/g, '\n<Tabs syncKey="lang">\n')
    .replace(/\{% tab title="([^"]+)" %\}/g, '\n<TabItem label="$1">\n')
    .replace(/\{% endtab %\}/g, '\n</TabItem>\n')
    .replace(/\{% endtabs %\}/g, '\n</Tabs>\n');

  const mdx = body.includes('<Tabs');
  if (mdx) body = "import { Tabs, TabItem } from '@astrojs/starlight/components';\n\n" + body;
  return { mdx, text: `---\ntitle: ${JSON.stringify(title)}\n---\n\n${body}` };
}

export function generate() {
  fs.rmSync(OUT, { recursive: true, force: true });
  for (const [, , , file] of summary()) {
    const { mdx, text } = convert(file, fs.readFileSync(file, 'utf8'));
    const out = path.join(OUT, file.replace(/README\.md$/, 'index.md').replace(/\.md$/, mdx ? '.mdx' : '.md'));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, text);
  }
}
