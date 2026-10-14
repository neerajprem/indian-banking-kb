/** Run an initialiser now (or on DOMContentLoaded) and again after any client-side page swap. Initialisers must be idempotent. */
export function ready(fn: () => void) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
  document.addEventListener('astro:page-load', fn);
}
