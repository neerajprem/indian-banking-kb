#!/usr/bin/env bash
# Runs the full test suite in chunks, so each step stays short enough for time-limited runners.
# Usage: bash scripts/test-all.sh   (run `npm run build` first)
set -euo pipefail
for c in 0/5 1/5 2/5 3/5 4/5; do CHUNK=$c node tests/responsive.mjs; done
for c in 0/4 1/4 2/4 3/4; do CHUNK=$c node tests/a11y.mjs; done
node tests/contrast.mjs
PART=core node tests/behaviour.mjs
for s in architecture technologies; do for j in 1 0; do PART=drill DRILL_SECTION=$s DRILL_JS=$j node tests/behaviour.mjs; done; done
node tests/budgets.mjs
node tests/csp.mjs
echo "All test chunks passed."
