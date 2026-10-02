# Restructuring plan

Status of the work to make this repository maintainable and ready for public
community contributions.

## Ground rules for this effort

1. **Nothing is deleted.** No asset, image, event page or data file is removed.
   Cleanup is proposed in documentation, never performed silently.
2. **The theme is preserved.** No restyling. The measured palette is recorded in
   `docs/architecture.md` and is binding.
3. **Archives are immutable.** A past event page is a historical record.
4. **Upstream is never modified from here.** This is a working copy.

## Phase 1 — foundation (this change)

Entirely **additive**, apart from two one-line bug fixes. No page layout, styling
or asset changed.

| Added | Why |
| --- | --- |
| `README.md` (rewritten) | the previous content was one line naming a different project |
| `docs/deployment.md` | the pipeline was documented nowhere |
| `docs/architecture.md` | repo map, asset-directory decoder, theme tokens |
| `docs/restructure-plan.md` | this file |
| `CONTRIBUTING.md` | there was no contribution path |
| `content/user-groups/*.yml` | 6 groups, extracted from the live HTML |
| `content/student-builder-groups/` | template + guide; no real data exists yet |
| `content/events/*.yml` | 7 events, dates verified from each page |
| `scripts/validate_content.py` | schema + reference + link validation, Python only |
| `.github/workflows/validate.yml` | runs the validator on every pull request |
| `.github/CODEOWNERS` | routes content changes to organizers |
| `.github/pull_request_template.md` | checklist |
| `.github/ISSUE_TEMPLATE/*` | forms that produce correct YAML for contributors |

| Fixed | Why |
| --- | --- |
| `karachi/session.html` | loaded the Sessionize **Speakers** view; now loads **Sessions** |
| `.github/workflows/cloudfront-invalidation.yml` | correlates the pipeline execution with the pushed commit, closing the stale-cache race |
| `.gitignore` | stops new IDE/build artifacts being committed |

### Why no framework migration in this phase

A move to a static site generator is the right long-term direction — it is what
turns `content/*.yml` into rendered pages. It is not in this phase because:

- There is **no Node.js in the environment this work was done in**, so an Astro or
  Eleventy build could not be installed, run or verified. Shipping an unverified
  build config would be worse than shipping none.
- The colour scheme must survive the migration exactly. The tokens are now
  measured and written down, which is the prerequisite.

The data layer landing first is deliberate: it is useful on its own, it carries no
risk to the live site, and it means the migration later has clean input.

## Phase 2 — remaining work

### 2a. Decide on the committed development artifacts

Still committed and still publicly served: `.vs/` (incl. a 282 KB
`slnx.sqlite`), `.idea/`, `GPUCache/`, 9 `debug.log`, 9 `.DS_Store`, `.suo`,
`applicationhost.config`, and a 16.6 MB `aws-website.rar`. `.gitignore` now
prevents new ones; the existing files need an explicit decision.

None are referenced by any page — verified by a sweep of all 263 HTML/CSS/SCSS
files — so removing them cannot break the site. **Not done here**, because the
instruction for this pass was to delete nothing.

### 2b. Duplicate assets

113.8 MiB of the repository is byte-identical duplicates (1,927 groups, 2,177
redundant copies). The largest single case: six identical 7.26 MiB JPEGs in
`simages/`, referenced by nothing —

```
simages/14677_1688901055.jpg   simages/32931_1688900983.jpg
simages/3378_1688900839.jpg    simages/34160_1688902100.jpg
simages/69556_1688904060.jpg   simages/98857_1688902345.jpg
```

Deduplicating is safe (keep one, repoint references) but is a deletion, so it is
deferred to an explicit decision.

### 2c. Vendored admin theme

`global_assets/` (583 files, 32.70 MiB) is the commercial "Limitless" Bootstrap
admin template; `assets/css/all.min.css` hardcodes absolute URLs to
`demo.interface.club`. Nothing that renders references it. Two reasons to resolve
this before the repository is made public: it is dead weight, and redistributing a
paid template without a licence is a real risk. It is also present in git history,
so deleting it from the tree alone does not remove it.

### 2d. Archive boundary and URL preservation

Move past events under a single `archive/` root with `<year>-<city>` slugs. Bare
year routes do not work — 2024 had two Community Days. Existing URLs are in
LinkedIn posts and search indexes going back five years, so any move must ship
with CloudFront redirects from every old path.

### 2e. Separate the User Group page from the last event page

`islamabad/index.html` is byte-identical to `islamabad/community-day-2024/index.html`.
A city's User Group page should be durable and describe the group;
`/community-days/2024-islamabad/` should be the frozen event. Islamabad is the
right pilot — it is the most bespoke city page and has the richest organizer data.

### 2f. Fix the leftover template content

Remove the unrendered Blade placeholders and the Indian-template strings from the
Lahore pages. Content edits to a live page, so they need review.

### 2g. Then migrate to a static site generator

Render `content/` into pages. Keep archives as untouched passthrough. Preserve the
theme tokens exactly.

### 2h. Open-source preparation

Recommended: keep everything in **one repository** — directory-scoped CODEOWNERS
plus schema validation already give contributors an isolated surface, and a second
data repository would add sync machinery that volunteers will break, while
preventing a contributor from seeing their own change rendered.

Do **not** make the existing repository public. Its history contains the full 216 MB
of accumulated assets and the commercial template. Seed a **new** public repository
from the cleaned tree as a single initial commit and keep the current repository
private as the permanent historical archive.

## Open questions

These cannot be answered from the repository:

1. Who owns the AWS account running CodePipeline, S3 and CloudFront, and does any
   IaC exist outside this repository?
2. Is there a licence for the Limitless template?
3. Should the 2023 event site (separate repository) be imported as an archive?
4. Community Day 2026 — city, date, national or per-city?
5. Is AWS User Group Lahore's absence from the Kirothon logo strip deliberate, and
   are Faisalabad and Peshawar currently active?
6. Which Student Builder Groups exist, with which leaders and universities?
7. Is the 2024 Sessionize grid on the 2025 Lahore page intentional?
8. Is `docs/sponsorship-deck.pdf` meant to be publicly downloadable?
9. What is the correct year for `old-website/aws-community-day-pakistan-2021/`,
   whose own page advertises 1 October 2022?
