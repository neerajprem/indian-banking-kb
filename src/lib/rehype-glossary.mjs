// Wraps the first use of each glossary short name on a page in an accessible tooltip.
// Works without JavaScript (hover and focus via CSS); src/scripts/tooltip.ts adds tap and Escape.
import fs from 'node:fs';
import { load as yamlLoad } from 'js-yaml';
import { visit, SKIP } from 'unist-util-visit';

const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'abbr', 'button', 'svg', 'title', 'caption', 'th', 'summary']);

function load() {
  const file = new URL('../data/glossary.yaml', import.meta.url);
  const list = yamlLoad(fs.readFileSync(file, 'utf8')) || [];
  return list.filter((g) => g.autolink !== false);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const classes = (node) => [].concat(node.properties?.className || []);

export default function rehypeGlossary() {
  const terms = load().sort((a, b) => b.term.length - a.term.length);
  const byTerm = Object.fromEntries(terms.map((t) => [t.term, t]));
  const re = terms.length ? new RegExp(`(?<![\\w-])(${terms.map((t) => esc(t.term)).join('|')})(?![\\w-])`) : null;

  return (tree) => {
    if (!re) return;
    const used = new Set();
    visit(tree, (node) => {
      if (node.type === 'element' && (SKIP_TAGS.has(node.tagName) || classes(node).some((c) => c === 'no-gloss' || c === 'gl'))) return SKIP;
      if (!node.children || (node.type !== 'element' && node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement' && node.type !== 'root')) return;
      const out = [];
      let changed = false;
      for (const child of node.children) {
        if (child.type !== 'text') { out.push(child); continue; }
        let text = child.value;
        let buffer = '';
        let m;
        while (text && (m = text.match(re))) {
          const t = byTerm[m[1]];
          const upto = m.index + m[1].length;
          if (used.has(t.id)) { buffer += text.slice(0, upto); text = text.slice(upto); continue; }
          used.add(t.id);
          changed = true;
          buffer += text.slice(0, m.index);
          if (buffer) out.push({ type: 'text', value: buffer });
          buffer = '';
          const tipId = `gl-${t.id}`;
          out.push({
            type: 'element', tagName: 'span', properties: { className: ['gl'] }, children: [
              { type: 'element', tagName: 'a', properties: { className: ['gl-term'], href: `/glossary/#${t.id}`, 'aria-describedby': tipId }, children: [{ type: 'text', value: m[1] }] },
              { type: 'element', tagName: 'span', properties: { id: tipId, role: 'tooltip', className: ['gl-tip'] }, children: [
                { type: 'element', tagName: 'strong', properties: {}, children: [{ type: 'text', value: t.expansion + '.' }] },
                { type: 'text', value: ' ' + t.definition },
              ] },
            ],
          });
          text = text.slice(upto);
        }
        buffer += text;
        if (buffer) out.push({ type: 'text', value: buffer });
      }
      if (changed) node.children = out;
    });
  };
}
