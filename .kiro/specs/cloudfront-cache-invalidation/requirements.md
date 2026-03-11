# Requirements Document

## Introduction

This feature adds automated CloudFront cache invalidation for the AWS Community Pakistan website. A GitHub Actions workflow triggers after a successful AWS CodePipeline deployment to the main branch, invalidating all cached paths on the CloudFront distribution so that end users immediately receive the latest content without manual intervention.

## Glossary

- **Workflow**: The GitHub Actions YAML workflow file that orchestrates the cache invalidation process
- **CloudFront_Invalidation**: An AWS API call that clears cached objects from a CloudFront distribution
- **CodePipeline**: The AWS CI/CD service that deploys the website to its origin (S3 or otherwise)
- **Distribution**: The CloudFront distribution serving the AWS Community Pakistan website
- **GitHub_Secrets**: Encrypted repository-level secrets used to store sensitive credentials in GitHub Actions
- **IAM_Credentials**: AWS access key ID and secret access key belonging to an IAM user or role with minimal required permissions

## Requirements

### Requirement 1: Workflow Trigger

**User Story:** As a maintainer, I want the cache invalidation workflow to trigger only after a successful CodePipeline deployment, so that stale cache is never cleared prematurely before the new content is actually deployed.

#### Acceptance Criteria

1. WHEN a push event occurs on the main branch AND the CodePipeline deployment status is successful, THE Workflow SHALL start the CloudFront invalidation job.
2. WHEN a push event occurs on the main branch AND the CodePipeline deployment has not completed successfully, THE Workflow SHALL NOT execute the CloudFront invalidation job.
3. THE Workflow SHALL be triggered exclusively by push events targeting the main branch.

### Requirement 2: CloudFront Cache Invalidation

**User Story:** As a maintainer, I want all CloudFront cached paths to be invalidated after deployment, so that users always receive the most recently deployed version of the website.

#### Acceptance Criteria

1. WHEN the Workflow executes the invalidation step, THE Workflow SHALL call `cloudfront:CreateInvalidation` with the path pattern `/*` to invalidate all cached objects.
2. THE Workflow SHALL target the CloudFront distribution identified by the `CLOUDFRONT_DISTRIBUTION_ID` GitHub Secret.
3. THE Workflow SHALL use the AWS region specified by the `AWS_REGION` GitHub Secret when making the API call.

### Requirement 3: Invalidation Status Reporting

**User Story:** As a maintainer, I want the workflow to confirm whether the invalidation succeeded or failed, so that I can quickly identify and respond to any issues.

#### Acceptance Criteria

1. WHEN the `cloudfront:CreateInvalidation` API call succeeds, THE Workflow SHALL output the invalidation ID and a success message to the job log.
2. IF the `cloudfront:CreateInvalidation` API call fails, THEN THE Workflow SHALL exit with a non-zero status code, causing the GitHub Actions job to be marked as failed.
3. THE Workflow SHALL display the final invalidation status (success or failure) as a visible step in the GitHub Actions job summary.

### Requirement 4: IAM Permissions and Credentials

**User Story:** As a security-conscious maintainer, I want the workflow to use least-privilege IAM credentials, so that the blast radius of a credential compromise is minimised.

#### Acceptance Criteria

1. THE IAM_Credentials used by the Workflow SHALL have only the `cloudfront:CreateInvalidation` permission scoped to the specific Distribution ARN.
2. THE IAM_Credentials SHALL NOT include any S3 permissions.
3. THE Workflow SHALL read `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `CLOUDFRONT_DISTRIBUTION_ID` exclusively from GitHub_Secrets.
4. THE Workflow SHALL NOT hard-code any credential values or distribution identifiers in the workflow file.

### Requirement 5: Workflow Deployment

**User Story:** As a maintainer, I want the workflow file committed to the repository, so that it is version-controlled and applied automatically on future deployments.

#### Acceptance Criteria

1. THE Workflow SHALL be stored at `.github/workflows/cloudfront-invalidation.yml` within the repository.
2. WHEN the workflow file is merged into the main branch, THE Workflow SHALL become active for all subsequent qualifying push events on the main branch.

### Requirement 6: IAM Credentials Provisioning via AWS CLI

**User Story:** As a maintainer, I want to create the IAM credentials using the locally configured AWS CLI, so that I can provision least-privilege access without needing the AWS console.

#### Acceptance Criteria

1. WHEN provisioning access, THE Maintainer SHALL run `aws iam create-user --user-name cloudfront-invalidator` using the locally configured AWS CLI to create a dedicated IAM user.
2. WHEN the IAM user exists, THE Maintainer SHALL run `aws iam create-access-key --user-name cloudfront-invalidator` to generate an access key ID and secret access key for that user.
3. THE Maintainer SHALL attach an inline policy to the IAM user that grants only `cloudfront:CreateInvalidation` scoped to the specific Distribution ARN, using `aws iam put-user-policy`.
4. THE inline policy SHALL NOT grant any permissions beyond `cloudfront:CreateInvalidation` on the target Distribution ARN.
5. WHEN the IAM_Credentials are created, THE Maintainer SHALL store the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` values as GitHub_Secrets using `gh secret set` from the GitHub CLI.
6. THE Maintainer SHALL also set the `AWS_REGION` and `CLOUDFRONT_DISTRIBUTION_ID` values as GitHub_Secrets using `gh secret set`.
