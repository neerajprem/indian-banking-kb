// Prints the production security headers for this build. Paste the output into the CloudFront
// response-headers policy. Usage: node scripts/csp-header.mjs [--json]
import { securityHeaders } from './security-headers.mjs';
const headers = securityHeaders();
if (process.argv.includes('--json')) console.log(JSON.stringify(headers, null, 2));
else for (const [k, v] of Object.entries(headers)) console.log(`${k}: ${v}`);
