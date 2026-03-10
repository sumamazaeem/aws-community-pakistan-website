#!/usr/bin/env bash
# set-github-secrets.sh
#
# Run this script after substituting the placeholder values below with your
# real AWS credentials and CloudFront distribution ID (obtained from task 1.1).
#
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated: gh auth login
#   - Run from inside the repository directory
#
# Usage:
#   chmod +x scripts/set-github-secrets.sh
#   ./scripts/set-github-secrets.sh

set -euo pipefail

# ---------------------------------------------------------------------------
# Substitute these values before running
# ---------------------------------------------------------------------------
AWS_ACCESS_KEY_ID="<AccessKeyId>"           # e.g. AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY="<SecretAccessKey>"   # e.g. wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION="us-east-1"                      # substitute your actual region if different
CLOUDFRONT_DISTRIBUTION_ID="<DistributionId>" # e.g. E1ABCDEF123456
CODEPIPELINE_NAME="<PipelineName>"          # e.g. my-website-pipeline
# ---------------------------------------------------------------------------

gh secret set AWS_ACCESS_KEY_ID          --body "$AWS_ACCESS_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY      --body "$AWS_SECRET_ACCESS_KEY"
gh secret set AWS_REGION                 --body "$AWS_REGION"
gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "$CLOUDFRONT_DISTRIBUTION_ID"

gh variable set CODEPIPELINE_NAME        --body "$CODEPIPELINE_NAME"

echo "All GitHub Secrets and variables set successfully."
