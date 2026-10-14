import authorData from '../data/author.json';
export const AUTHOR = authorData;

export const SITE = {
  name: 'Indian Banking Ecosystem: Complete Knowledge Base',
  short: 'Indian Banking Ecosystem',
  sub: 'Complete Knowledge Base',
  pitch: 'How money moves in India, and the technology underneath it.',
  publisher: "Infrastructure Team's Knowledgebase",
  lang: 'en-IN',
};

export const DOMAIN_NAMES: Record<string, string> = {
  foundation: 'Foundations',
  design: 'Design',
  decision: 'Decisions and risk',
  governance: 'Governance',
  reference: 'Reference',
};

export const DEPTH_NAMES: Record<string, string> = { intro: 'Introductory', intermediate: 'Intermediate', advanced: 'Advanced' };

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const readingMinutes = (body = '') => {
  // Count the words a reader actually sees: prose plus the text inside component props (table cells,
  // captions, diagram labels), but not code, import lines, prop names or component names.
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/code=\{`[\s\S]*?`\}/g, ' ')
    .replace(/^import .*$/gm, ' ')
    .replace(/\b[a-zA-Z]+(?=\s*[:=])/g, ' ')
    .replace(/<\/?[A-Z][A-Za-z]*/g, ' ')
    .replace(/<\/?[a-z]+[^>]*>/g, ' ');
  const words = (text.match(/[A-Za-z][A-Za-z'’-]+/g) || []).length;
  return Math.max(1, Math.round(words / 200));
};
