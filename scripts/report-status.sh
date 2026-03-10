#!/usr/bin/env bash
# report-status.sh — Simulates the "Report status" step from the CloudFront
# invalidation workflow. Writes the same content the workflow writes to
# $GITHUB_STEP_SUMMARY, but outputs to stdout for testability.
#
# Usage: report-status.sh <OUTCOME> <INVALIDATION_ID>
#   OUTCOME         "success" to simulate a successful invalidation; anything
#                   else simulates a failure.
#   INVALIDATION_ID The CloudFront invalidation ID (used only on success).

set -euo pipefail

OUTCOME="${1:?OUTCOME argument is required}"
INVALIDATION_ID="${2:-}"

if [ "$OUTCOME" = "success" ]; then
  echo "### ✅ CloudFront Invalidation Succeeded"
  echo "Invalidation ID: ${INVALIDATION_ID}"
else
  echo "### ❌ CloudFront Invalidation Failed"
fi
