// Site-wide progressive enhancements: glossary and citation tooltips, sidenotes, heading links, code copy.
import { ready } from './ready';

function clampTip(tip: HTMLElement) {
  tip.classList.remove('tip-flip');
  const r = tip.getBoundingClientRect();
  if (r.right > window.innerWidth - 8) tip.classList.add('tip-flip');
}

ready(() => {
  if (document.body.dataset.enhanced) return;
  document.body.dataset.enhanced = '1';

  // Glossary tooltips: hover and focus work in CSS; here we add tap-to-open, Escape to dismiss and edge flipping.
  let coarse = matchMedia('(pointer: coarse)').matches;
  document.addEventListener('pointerover', (e) => {
    const term = (e.target as Element).closest?.('.gl-term, .cite a');
    const tip = term?.nextElementSibling as HTMLElement | null;
    if (tip) requestAnimationFrame(() => clampTip(tip));
  });
  document.addEventListener('focusin', (e) => {
    const tip = (e.target as Element).nextElementSibling as HTMLElement | null;
    if (tip?.matches('.gl-tip, .cite-tip')) requestAnimationFrame(() => clampTip(tip));
    document.querySelectorAll('.gl.dismissed').forEach((g) => g.classList.remove('dismissed'));
  });
  document.addEventListener('click', (e) => {
    const term = (e.target as Element).closest('.gl-term') as HTMLAnchorElement | null;
    document.querySelectorAll('.gl.open').forEach((g) => { if (!term || g !== term.parentElement) g.classList.remove('open'); });
    if (term && coarse && !term.parentElement!.classList.contains('open')) {
      e.preventDefault(); // first tap shows the definition; a second tap follows the link
      term.parentElement!.classList.add('open');
      clampTip(term.nextElementSibling as HTMLElement);
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.gl.open').forEach((g) => g.classList.remove('open'));
    const g = (document.activeElement as Element)?.closest?.('.gl');
    if (g) g.classList.add('dismissed');
  });

  // Sidenotes: tap-to-open below 1100 px.
  document.addEventListener('click', (e) => {
    const m = (e.target as Element).closest('.note-mark') as HTMLButtonElement | null;
    if (!m || matchMedia('(min-width: 1100px)').matches) return;
    const open = m.getAttribute('aria-expanded') !== 'true';
    m.setAttribute('aria-expanded', String(open));
    document.getElementById(m.getAttribute('aria-controls')!)?.classList.toggle('open', open);
  });

  // Copy link to heading
  document.querySelectorAll<HTMLElement>('.prose h2[id], .prose h3[id]').forEach((h) => {
    const a = document.createElement('a');
    a.className = 'h-anchor'; a.href = '#' + h.id; a.textContent = '#';
    a.setAttribute('aria-label', `Copy link to “${h.textContent}”`);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', a.href);
      navigator.clipboard?.writeText(location.href).then(() => { a.textContent = 'Copied'; setTimeout(() => (a.textContent = '#'), 1500); });
    });
    h.append(a);
  });

  // Copy code
  document.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('[data-copy]') as HTMLButtonElement | null;
    if (!b) return;
    const code = b.parentElement?.querySelector('pre')?.textContent ?? '';
    navigator.clipboard?.writeText(code).then(() => { b.textContent = 'Copied'; setTimeout(() => (b.textContent = 'Copy'), 1500); });
  });
});
