// CSP-safe syntax highlighting. Shiki normally writes inline style="" attributes, which the site's
// Content-Security-Policy (style-src 'self') blocks. We give Shiki a theme whose colours are unique
// sentinel values, then a transformer swaps each sentinel colour for a class styled in components.css.
const TOKENS = {
  comment: ['comment', 'punctuation.definition.comment'],
  string: ['string', 'string.quoted', 'string.template'],
  keyword: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new'],
  number: ['constant.numeric', 'constant.language', 'constant.character'],
  func: ['entity.name.function', 'support.function', 'meta.function-call'],
  type: ['entity.name.type', 'support.type', 'support.class', 'entity.name.class'],
  tag: ['entity.name.tag'],
  attr: ['entity.other.attribute-name', 'support.type.property-name', 'meta.object-literal.key'],
  variable: ['variable.parameter', 'variable.other.property'],
};
const names = Object.keys(TOKENS);
const hex = (i) => '#' + (0x100000 + i).toString(16).toUpperCase();
const byColor = Object.fromEntries(names.map((n, i) => [hex(i + 1), n]));

export const sentinelTheme = {
  name: 'kb-sentinel',
  type: 'light',
  colors: { 'editor.background': '#FFFFFE', 'editor.foreground': '#000000' },
  tokenColors: names.map((n, i) => ({ scope: TOKENS[n], settings: { foreground: hex(i + 1) } })),
};

function strip(node) {
  if (node.properties) delete node.properties.style;
}

export const styleToClass = {
  name: 'kb-style-to-class',
  pre(node) {
    strip(node);
    node.properties.class = 'code';
    // Keep the code block keyboard-scrollable (WCAG 2.1.1).
    node.properties.tabindex = '0';
  },
  code(node) { strip(node); },
  line(node) { strip(node); },
  span(node) {
    const s = String(node.properties?.style || '');
    const m = s.match(/color:\s*(#[0-9A-Fa-f]{6})/);
    strip(node);
    const cls = m && byColor[m[1].toUpperCase()];
    if (cls) node.properties.class = 'tk-' + cls;
  },
};
