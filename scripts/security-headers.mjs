// Single definition of the production security headers. Used by:
//   scripts/csp-header.mjs   (prints them for the CloudFront response-headers policy)
//   scripts/write-headers.mjs (writes dist/_headers for Cloudflare Pages and Netlify)
// The CSP allows only the inline scripts whose hashes check-dist recorded for this build.
import fs from 'node:fs';
export function securityHeaders(dist = 'dist') {
  const hashes = JSON.parse(fs.readFileSync(`${dist}/.csp-hashes.json`, 'utf8'));
  // 'wasm-unsafe-eval' lets Pagefind's WebAssembly search index run; it does not allow JavaScript eval.
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'wasm-unsafe-eval' ${hashes.join(' ')}`,
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ');
  return {
    'Content-Security-Policy': csp,
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-Frame-Options': 'DENY',
  };
}
