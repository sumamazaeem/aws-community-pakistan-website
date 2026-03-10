#!/usr/bin/env bash
# gate-check.sh — Gate logic extracted from the CloudFront invalidation workflow.
# Accepts a single STATUS argument.
# Exits 0 if STATUS == "Succeeded", exits 1 otherwise.
#
# Usage: gate-check.sh <STATUS>

STATUS="${1}"

if [ "$STATUS" = "Succeeded" ]; then
  exit 0
else
  exit 1
fi
