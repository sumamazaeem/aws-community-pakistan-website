#!/usr/bin/env bash
# build-invalidation-cmd.sh — Constructs the aws cloudfront create-invalidation
# command string without executing it. Used by property-based tests to inspect
# the command structure.
#
# Usage: build-invalidation-cmd.sh <DISTRIBUTION_ID> <REGION>

set -euo pipefail

DISTRIBUTION_ID="${1:?DISTRIBUTION_ID argument is required}"
REGION="${2:?REGION argument is required}"

echo "aws cloudfront create-invalidation --distribution-id \"${DISTRIBUTION_ID}\" --paths \"/*\" --output json"
