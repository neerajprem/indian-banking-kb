#!/usr/bin/env bash
# Build and deploy dist/ to a private S3 bucket behind CloudFront, then invalidate the cache.
# Usage: BUCKET=my-bucket DISTRIBUTION_ID=E123ABC scripts/deploy.sh [--dry-run] [--skip-build]
# Requires: AWS CLI v2 with credentials (locally, or via GitHub OIDC in deploy.yml).
set -euo pipefail
DRY=""; SKIP_BUILD=""
for a in "$@"; do case "$a" in --dry-run) DRY="--dryrun";; --skip-build) SKIP_BUILD=1;; *) echo "Unknown option $a"; exit 2;; esac; done
: "${BUCKET:?Set BUCKET to the S3 bucket name}"
: "${DISTRIBUTION_ID:?Set DISTRIBUTION_ID to the CloudFront distribution ID}"
REGION="${AWS_REGION:-ap-south-1}"

if [ -z "$SKIP_BUILD" ]; then npm ci && npm run build; fi
test -f dist/index.html || { echo "dist/ is missing; build first"; exit 1; }

# Pass 1: fingerprinted assets never change, so cache them for a year.
aws s3 sync dist/_astro "s3://$BUCKET/_astro" --region "$REGION" $DRY --delete \
  --cache-control "public, max-age=31536000, immutable"

# Pass 2: everything else must revalidate so a deploy is visible at once.
aws s3 sync dist "s3://$BUCKET" --region "$REGION" $DRY --delete \
  --exclude "_astro/*" --exclude ".csp-hashes.json" --exclude "_headers" \
  --cache-control "public, max-age=0, must-revalidate"

# Content types S3 may guess wrongly.
aws s3 cp dist/rss.xml "s3://$BUCKET/rss.xml" --region "$REGION" $DRY --content-type "application/rss+xml; charset=utf-8" --cache-control "public, max-age=0, must-revalidate"
aws s3 cp dist/robots.txt "s3://$BUCKET/robots.txt" --region "$REGION" $DRY --content-type "text/plain; charset=utf-8" --cache-control "public, max-age=0, must-revalidate"

if [ -n "$DRY" ]; then
  echo "Dry run: would invalidate /* on $DISTRIBUTION_ID"
else
  aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" --query 'Invalidation.Id' --output text
fi
DOMAIN=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query 'Distribution.DomainName' --output text 2>/dev/null || echo "(distribution domain)")
echo "Deployed to https://$DOMAIN"
echo "Reminder: if the theme script changed, update the CSP in the response-headers policy: node scripts/csp-header.mjs"
