# Implementation Plan: CloudFront Cache Invalidation

## Overview

Provision a least-privilege IAM user via the AWS CLI, create the GitHub Actions workflow file that gates on CodePipeline status before invalidating the CloudFront cache, wire in all required secrets/variables, and commit the workflow to main.

## Tasks

- [x] 1. Provision IAM credentials via AWS CLI
  - [x] 1.1 Create the IAM user and generate access key
    - Run `aws iam create-user --user-name cloudfront-invalidator`
    - Run `aws iam create-access-key --user-name cloudfront-invalidator` and save the `AccessKeyId` and `SecretAccessKey` from the output
    - _Requirements: 6.1, 6.2_

  - [x] 1.2 Attach the least-privilege inline policy
    - Write the IAM policy JSON to `/tmp/cf-policy.json` with exactly one statement: `Action: cloudfront:CreateInvalidation`, `Resource: arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>`
    - Run `aws iam put-user-policy --user-name cloudfront-invalidator --policy-name CloudFrontInvalidationOnly --policy-document file:///tmp/cf-policy.json`
    - Substitute `<ACCOUNT_ID>` and `<DISTRIBUTION_ID>` with real values before running
    - _Requirements: 4.1, 4.2, 6.3, 6.4_

  - [x] 1.3 Write property test for IAM policy document structure (Property 4)
    - Use Python + Hypothesis; generate policy documents with varying statement counts, action lists, and resource values
    - Assert valid only when: exactly one statement, action is `["cloudfront:CreateInvalidation"]`, resource matches `arn:aws:cloudfront::\d+:distribution/[A-Z0-9]+`
    - All other shapes must be rejected
    - Run minimum 100 iterations
    - **Property 4: IAM policy allows only cloudfront:CreateInvalidation on specific ARN**
    - **Validates: Requirements 4.1, 4.2, 6.3, 6.4**

- [x] 2. Store secrets and variables in GitHub
  - [x] 2.1 Set the four GitHub Secrets using the GitHub CLI
    - Run `gh secret set AWS_ACCESS_KEY_ID --body "<AccessKeyId>"`
    - Run `gh secret set AWS_SECRET_ACCESS_KEY --body "<SecretAccessKey>"`
    - Run `gh secret set AWS_REGION --body "us-east-1"` (substitute correct region)
    - Run `gh secret set CLOUDFRONT_DISTRIBUTION_ID --body "<DistributionId>"`
    - _Requirements: 4.3, 4.4, 6.5, 6.6_

  - [x] 2.2 Set the CODEPIPELINE_NAME GitHub Actions variable
    - Run `gh variable set CODEPIPELINE_NAME --body "<PipelineName>"`
    - _Requirements: 1.1, 1.2_

- [x] 3. Create the GitHub Actions workflow file
  - [x] 3.1 Create `.github/workflows/cloudfront-invalidation.yml`
    - Set trigger: `on: push: branches: [main]`
    - Add `Configure AWS credentials` step using `aws-actions/configure-aws-credentials@v4` with `aws-access-key-id`, `aws-secret-access-key`, and `aws-region` from secrets
    - _Requirements: 1.3, 4.3, 4.4, 5.1_

  - [x] 3.2 Add the CodePipeline gate step
    - Add `Check CodePipeline deployment status` step (id: `pipeline-check`) that calls `aws codepipeline get-pipeline-state --name "${{ vars.CODEPIPELINE_NAME }}"` with `--query "stageStates[?stageName=='Deploy'].latestExecution.status"`
    - Exit 1 with a descriptive message if status is not `Succeeded`
    - _Requirements: 1.1, 1.2_

  - [x] 3.3 Write property test for gate logic (Property 1)
    - Use Bats with randomised inputs; generate status strings including all known values (`Succeeded`, `InProgress`, `Failed`, `Stopped`, `Stopping`, `Superseded`) and arbitrary strings
    - Assert exit code is 0 iff status equals exactly `"Succeeded"`
    - Run minimum 100 iterations
    - **Property 1: Gate logic — invalidation runs iff CodePipeline status is Succeeded**
    - **Validates: Requirements 1.1, 1.2**

  - [x] 3.4 Add the CloudFront invalidation step
    - Add `Invalidate CloudFront cache` step (id: `invalidate`) that calls `aws cloudfront create-invalidation --distribution-id "${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}" --paths "/*" --output json`
    - Extract `INVALIDATION_ID` via `jq -r '.Invalidation.Id'` and write to `$GITHUB_OUTPUT`
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.5 Write property test for invalidation path (Property 2)
    - Use Bats with randomised inputs; generate random distribution IDs and region strings
    - Construct the invalidation command string for each and assert it always contains `--paths "/*"` verbatim
    - Run minimum 100 iterations
    - **Property 2: Invalidation path is always /***
    - **Validates: Requirements 2.1**

  - [x] 3.6 Add the status reporting step
    - Add `Report status` step with `if: always()` that writes to `$GITHUB_STEP_SUMMARY`
    - On success (`steps.invalidate.outcome == 'success'`): write `### ✅ CloudFront Invalidation Succeeded` and the invalidation ID
    - On failure: write `### ❌ CloudFront Invalidation Failed`
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.7 Write property test for reporting output (Property 3)
    - Use Bats with randomised inputs; generate random invalidation IDs (alphanumeric strings of varying length)
    - Run the reporting script with simulated success and assert the summary output contains the exact invalidation ID and a success marker
    - Run with failure outcome and assert the summary contains a failure marker
    - Run minimum 100 iterations
    - **Property 3: Reporting output contains invalidation ID on success**
    - **Validates: Requirements 3.1, 3.3**

- [x] 4. Checkpoint — Verify workflow file correctness
  - Parse `.github/workflows/cloudfront-invalidation.yml` and assert:
    - `on:` block contains only `push` with `branches: [main]` (unit test E1)
    - No literal AWS account IDs, access keys, secret keys, distribution IDs, or region strings appear outside `${{ secrets.* }}` or `${{ vars.* }}` references (unit test E2)
    - File exists at `.github/workflows/cloudfront-invalidation.yml` (unit test E3)
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Commit and push the workflow file to main
  - [x] 5.1 Stage and commit the workflow file
    - Run `git add .github/workflows/cloudfront-invalidation.yml`
    - Run `git commit -m "ci: add CloudFront cache invalidation workflow"`
    - _Requirements: 5.1, 5.2_

  - [x] 5.2 Push to main
    - Run `git push origin main`
    - Confirm the workflow appears under the Actions tab in the GitHub repository
    - _Requirements: 5.2_

- [x] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests require Bats (`npm install -g bats` or `brew install bats-core`) for shell logic and Python + Hypothesis (`pip install hypothesis`) for IAM policy validation
- Each task references specific requirements for traceability
- The `Report status` step uses `if: always()` so it runs even when earlier steps fail
- `jq` is pre-installed on `ubuntu-latest` GitHub-hosted runners — no extra setup needed
