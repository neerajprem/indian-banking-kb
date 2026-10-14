# Runbook: hosting on AWS (S3 + CloudFront, ap-south-1)

The site is static files in `dist/`. Production is a **private** S3 bucket served only through CloudFront. No servers, no database. At the owner's direction there is no Terraform; this runbook gives the console steps.

## 1. First-time setup

**S3 bucket** (region ap-south-1)
1. Create a bucket, for example `banking-kb-site`. Keep **Block all public access** on.
2. Default encryption: SSE-S3. Enable **versioning** (this is the rollback mechanism).
3. Add a lifecycle rule that expires non-current versions after 60 days.

**CloudFront distribution**
1. Origin: the bucket's REST endpoint (not the website endpoint). Origin access: **Origin Access Control (OAC)**. Let CloudFront update the bucket policy, or paste the policy it shows.
2. Viewer protocol: redirect HTTP to HTTPS. HTTP/2 and HTTP/3 on. Minimum TLS 1.2. Compression on.
3. Default root object: `index.html`.
4. Functions: create a CloudFront Function from `infra/cloudfront-function.js`, publish it, and attach it to **viewer request** on the default behaviour. It turns `/payment-rails/` into `/payment-rails/index.html`.
5. Error pages: map **403** and **404** to `/404.html` with response code **404**. S3 returns 403 for missing keys under OAC, so both are needed.
6. Response headers policy: create a custom policy with the headers printed by `node scripts/csp-header.mjs` after a build. The CSP includes the SHA-256 hash of the one inline script (the theme loader). If that script changes, the hash changes and the policy must be updated; the deploy workflow prints the current values on every run.
7. Price class: choose one that includes India. All edge locations is simplest.

**Custom domain (optional)**
1. Request a certificate in **ACM in us-east-1** (CloudFront only uses certificates from that region) and validate it by DNS.
2. Add the domain as an alternate name on the distribution and select the certificate.
3. In Route 53, create an alias A and AAAA record to the distribution.
4. Set `SITE_URL` (for example `https://kb.example.com`) so canonical URLs, the sitemap and RSS use the real domain.

**GitHub deployment role (OIDC, no stored keys)**
1. In IAM, add the identity provider `token.actions.githubusercontent.com` (audience `sts.amazonaws.com`).
2. Create a role trusted only by this repository's `main` branch, with this policy:
   - `s3:ListBucket` on the bucket;
   - `s3:PutObject` and `s3:DeleteObject` on `bucket/*`;
   - `cloudfront:CreateInvalidation` and `cloudfront:GetDistribution` on the distribution.
3. In the repository, set variables `AWS_ROLE_ARN`, `BUCKET`, `DISTRIBUTION_ID` and `SITE_URL`, and create an environment named `production`.

## 2. Deploying

- **Automatic:** every push to `main` runs `.github/workflows/deploy.yml`: build, full tests, sync to S3, invalidate CloudFront.
- **Manual:** `BUCKET=... DISTRIBUTION_ID=... scripts/deploy.sh`. Add `--dry-run` to see what would change without changing anything.
- **Two-pass sync:**
  - `_astro/*` files are fingerprinted and cached for a year as `immutable`.
  - Everything else is served with `max-age=0, must-revalidate`, so a deploy is visible at once.

## 3. Rolling back

Because versioning is on, every earlier file is still in the bucket.
1. **Quickest:** check out the last good commit and re-run the deploy (manually or with `workflow_dispatch`).
2. **Without a build:** restore previous versions of the affected objects in the S3 console (Show versions → select the version → restore by copying it over the current one), then invalidate `/*`.

## 4. Cache invalidation

`aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"`. The deploy script does this every time. A wildcard counts as one path for billing.

## 5. Checking a deployment

- `curl -I https://<domain>/payment-rails/` should return 200 with the security headers.
- `curl -I https://<domain>/no-such-page/` should return **404** and the site's 404 page.
- Open the browser console on a few pages: there should be no CSP errors. Locally, `node tests/csp.mjs` checks the same thing.

## 6. Rough running cost

A rough guide only; confirm with the AWS Pricing Calculator.
- **S3:** the site is a few megabytes, so storage costs are negligible.
- **CloudFront:** has a free usage allowance each month. A reference site like this is likely to stay within or near it.
- **Route 53:** charges a small monthly fee per hosted zone.
- **ACM:** public certificates are free.

## 7. Quick test hosting (not for production)

For a throwaway preview you can enable **Static website hosting** on a separate, public bucket and upload `dist/`. It serves over HTTP only, needs a public bucket and ignores the CSP and other headers, so **never use it for production**.

## 8. Weekly freshness check

`.github/workflows/freshness.yml` runs every Monday. It opens or updates an issue labelled `freshness` listing facts whose source was last checked more than 45 days ago (monthly figures) or 90 days ago (everything else). Recheck each source, update `asOf`, `accessed` and the value, then add a changelog entry.
