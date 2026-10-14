// Wraps plain Markdown tables in a scroll container so wide tables never widen the page.
import { visit, SKIP } from 'unist-util-visit';
export default function rehypeTables() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return;
      const cls = [].concat(parent.properties?.className || []);
      if (cls.includes('table-wrap')) return SKIP;
      parent.children[index] = { type: 'element', tagName: 'div', properties: { className: ['table-wrap'], tabIndex: 0, role: 'region', ariaLabel: 'Table' }, children: [node] };
      return SKIP;
    });
  };
}
