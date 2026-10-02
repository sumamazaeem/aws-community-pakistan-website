# Deployment

How awscommunity.pk actually gets published. Everything in the "Current state"
section was verified against the repository and the live site; nothing here is
assumed.

## Current state

```
merge / push to the production branch
        │
        ▼
AWS CodePipeline          ← definition is NOT in this repository
        │                   (no IaC; name held in the CODEPIPELINE_NAME Actions variable)
        ▼
S3 origin                 ← the repository is synced verbatim, every file
        │
        ▼
CloudFront                ← GitHub Actions invalidates /* after the pipeline reports success
        │
        ▼
Cloudflare → https://awscommunity.pk
```

Confirmed from the live response headers: `via: ...cloudfront.net` sitting behind
`server: cloudflare`.

### What GitHub Actions does and does not do

`.github/workflows/cloudfront-invalidation.yml` **does not deploy**. CodePipeline
deploys. The workflow only waits for the pipeline and then clears the CDN cache.

### Secrets and variables

Referenced by name only; values live in GitHub repository settings.

| Name | Kind | Used for |
| --- | --- | --- |
| `AWS_ACCESS_KEY_ID` | secret | authenticating the invalidation call |
| `AWS_SECRET_ACCESS_KEY` | secret | authenticating the invalidation call |
| `AWS_REGION` | secret | region for the AWS CLI |
| `CLOUDFRONT_DISTRIBUTION_ID` | secret | which distribution to invalidate |
| `CODEPIPELINE_NAME` | variable | which pipeline to poll |

`AWS_REGION` does not need to be a secret — a region is not sensitive. CloudFront's
API is global and only accepts `us-east-1`.

### No rollback, no previews, no PR checks

- **Rollback:** none. The only path is `git revert` plus waiting for a full
  pipeline run. There is no tagged-release or versioned-object mechanism.
- **Preview deployments:** none.
- **PR validation:** none before this change. The production branch is unprotected,
  so a direct push publishes without review.
- **Tests:** `tests/` contains node, bats and pytest files. Nothing ran them.

## Known problems

### 1. The invalidation can cache stale content (correctness bug)

The workflow reads:

```
stageStates[?stageName=='Deploy'].latestExecution.status
```

immediately after the push. If the new pipeline execution has not started yet, this
returns the **previous** execution's `Succeeded`. The job then invalidates the cache
straight away and exits 0 — before the new files have reached S3. CloudFront
re-fetches and re-caches the *old* content.

It never checks that the execution it is looking at corresponds to the commit that
was just pushed. This is precisely the stale-content failure the workflow was
written to prevent, and it is the first thing to suspect when a change "deployed
successfully" but the site has not changed.

**Fix:** correlate the execution with the pushed commit SHA before invalidating.
See `.github/workflows/cloudfront-invalidation.yml`, which now resolves the
pipeline execution and compares its source revision to `GITHUB_SHA`, and refuses
to invalidate a pre-existing execution.

### 2. Long-lived AWS access keys

The workflow authenticates with a static access key pair stored in GitHub Secrets.
`aws-actions/configure-aws-credentials@v4` supports GitHub OIDC role assumption,
which removes the stored credentials entirely:

```yaml
permissions:
  id-token: write
  contents: read
# ...
    with:
      role-to-assume: arn:aws:iam::<account-id>:role/<github-actions-role>
      aws-region: us-east-1
```

This matters more once the repository accepts public contributions.

### 3. The repository is served verbatim, including development artifacts

Because the pipeline syncs everything, files that are not part of the website are
publicly downloadable. Verified live, each returning HTTP 200:

| URL | Size |
| --- | --- |
| `/.vs/slnx.sqlite` | 282,624 bytes |
| `/.vs/aws-community-pakistan-website/config/applicationhost.config` | 82,580 bytes |
| `/lahore/aws-community-day-lahore-2022/GPUCache/index` | 262,512 bytes |
| `/lahore/aws-community-day-lahore-2022/debug.log` | 7,422 bytes |
| `/.idea/vcs.xml` | 167 bytes |

Also reachable: `/README.md`, `/package.json`, `/config.rb`,
`/.github/workflows/cloudfront-invalidation.yml`, `/.DS_Store`, and a 16.6 MB
`aws-website.rar`.

These are committed IDE and build artifacts, not site content. `.gitignore` now
excludes them so no new ones appear, but **the existing files are still committed
and still served**. Removing them is a deliberate, separate decision — see
`docs/restructure-plan.md`. Until then, treat anything in the repository as public.

## Recommended target state

Keep it simple enough for volunteers to maintain.

```
Contributor opens a pull request
        │
        ▼
validate.yml   → content schema · asset references · internal links
        │        ~60s, requires no secrets, so it runs safely on forks
        ▼
CODEOWNERS review
        │
        ▼
Merge to the production branch (protected: PR required, checks must pass)
        │
        ▼
deploy.yml     → s3 sync --delete, then CloudFront invalidation
        │         authenticated by OIDC, no stored keys
        ▼
awscommunity.pk
```

Folding the deploy into GitHub Actions removes CodePipeline from the critical path
and makes the ordering sequential by construction, which eliminates problem 1
rather than patching it. If CodePipeline must stay, move the invalidation into the
pipeline as its own final stage instead.

Deliberately **not** recommended: per-PR preview environments (real cost and IAM
complexity for a volunteer project — a passing build check catches most breakage),
or any container/test-matrix work.

## Troubleshooting

**"I merged but the site has not changed."**

1. Check the CodePipeline execution actually ran for your commit, not a previous one.
2. Check the invalidation workflow run — if it succeeded suspiciously fast, it hit
   problem 1 above and cached the old content. Re-run an invalidation manually.
3. Cloudflare sits in front of CloudFront. A CloudFront invalidation does not clear
   Cloudflare's cache; that may need purging separately.
