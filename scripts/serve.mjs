// Minimal static server for dist/, mirroring CloudFront behaviour: clean URLs and a real 404 status.
// Usage: node scripts/serve.mjs [--port 4321] [--headers] [--prod]
//   --headers adds the production security headers; --prod adds CloudFront-like compression and cache headers.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || Number(process.env.PORT) || 4321;
const withHeaders = args.includes('--headers') || args.includes('--prod');
const prod = args.includes('--prod');
const root = path.resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.wasm': 'application/wasm', '.pf_meta': 'application/octet-stream', '.pf_index': 'application/octet-stream', '.pf_fragment': 'application/octet-stream', '.pagefind': 'application/octet-stream', '.drawio': 'application/xml' };
// When dist/_headers exists (the file Cloudflare Pages and Netlify read), serve exactly those headers,
// so local tests exercise the generated file itself.
function headersFile() {
  try {
    const txt = fs.readFileSync(path.join(root, '_headers'), 'utf8');
    const block = txt.split(/\n(?=\S)/).find((b) => b.startsWith('/*'));
    if (!block) return null;
    return Object.fromEntries(block.split('\n').slice(1).map((l) => l.trim()).filter(Boolean).map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]));
  } catch { return null; }
}
function security() {
  const fromFile = headersFile();
  if (fromFile) return fromFile;
  let hashes = [];
  try { hashes = JSON.parse(fs.readFileSync(path.join(root, '.csp-hashes.json'), 'utf8')); } catch {}
  return {
    'Content-Security-Policy': `default-src 'self'; script-src 'self' 'wasm-unsafe-eval' ${hashes.join(' ')}; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'`,
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Cross-Origin-Opener-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  };
}
http.createServer((req, res) => {
  let u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (u.endsWith('/')) u += 'index.html';
  else if (!path.basename(u).includes('.')) u += '/index.html';
  let file = path.join(root, u);
  let status = 200;
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(root, '404.html'); status = 404; }
  const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', ...(withHeaders ? security() : {}) };
  if (prod) {
    // Same cache policy the deploy script will set: hashed assets immutable, everything else revalidated.
    headers['Cache-Control'] = u.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate';
    const ext = path.extname(file);
    if (/\.(html|css|js|json|svg|xml|txt)$/.test(ext) && /\bbr\b/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'br'; headers['Vary'] = 'Accept-Encoding';
      res.writeHead(status, headers); return res.end(zlib.brotliCompressSync(fs.readFileSync(file)));
    }
  }
  res.writeHead(status, headers);
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving dist on http://localhost:${port}${withHeaders ? ' with security headers' : ''}`));
