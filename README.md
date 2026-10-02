# AWS Community Pakistan — Website

The website for **AWS Community Pakistan**, the umbrella for the AWS User Groups
and AWS Community Days across Pakistan.

- **Live site:** https://awscommunity.pk
- **Hosting:** AWS S3 + CloudFront, behind Cloudflare
- **Deploys:** automatically, on every merge to the production branch

> **Note on this repository.** This is a working copy used to restructure the site.
> The canonical repository is `AWS-Community-Pakistan/aws-community-pakistan-website`.
> Changes are developed here and proposed upstream; nothing here deploys to
> awscommunity.pk on its own.

---

## What is in this repository

Five years of AWS Community Pakistan events and three city User Group pages, all
served as **static HTML**. There is no framework and no build step — the files in
this repository are what the browser receives.

| Path | What it is | Status |
| --- | --- | --- |
| `index.html` | National landing page, links to the city sites | active |
| `karachi/` | AWS User Group Karachi + Community Day Karachi 2025 | active |
| `lahore/` | AWS User Group Lahore + Community Day Lahore 2025 | active |
| `islamabad/` | AWS User Group Islamabad (currently the 2024 event page) | active |
| `kirothon/` | Kirothon 2026 hackathon landing page | active |
| `lahore/aws-community-day-lahore-2022/` | Community Day Lahore, 1 Oct 2022 | archive |
| `lahore/aws-community-day-lahore-2024/` | Community Day Lahore, 25 Feb 2024 | archive |
| `islamabad/community-day-2024/` | Community Day Islamabad, 24 Aug 2024 | archive |
| `old-website/aws-community-day-pakistan-2021/` | earlier national event site (see note below) | archive |
| `content/` | **structured community data — start here to contribute** | active |
| `docs/` | architecture, deployment and restructuring notes | active |

> The directory `old-website/aws-community-day-pakistan-2021/` is named 2021 but its
> `index.html` advertises **1 October 2022**. The year in that folder name is not
> reliable and has not yet been corrected — see `docs/restructure-plan.md`.

## Technology stack

- **Static HTML**, hand-authored. No SSG, no bundler, no `npm run build`.
- **CSS** arrives three ways: inline `<style>` blocks, committed stylesheets in
  `stylesheets/`, and Tailwind loaded at runtime from `cdn.tailwindcss.com`.
- **Legacy SASS**: `config.rb` + `sass/` configure Compass (Ruby). Nothing in CI
  compiles it, and `stylesheets/` holds the committed output. Treat `stylesheets/`
  as the live CSS.
- **Speaker and session data** is not in this repository — it comes from
  **Sessionize** widgets, embedded by widget ID.
- **Content validation** uses Python 3 (`scripts/validate_content.py`). No Node
  required for anything in this repository.

## Local development

There is no build. Serve the directory and open it:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
# then open http://127.0.0.1:8080
```

To check your content changes before opening a pull request:

```bash
python3 scripts/validate_content.py
```

This is the same check CI runs. It needs no dependencies and no AWS access.

## Contributing

Most contributions change **one small YAML file** in `content/` and nothing else.
You do not need to understand the HTML to update a User Group, a leader, or a link.

- Update an AWS User Group → `content/user-groups/<city>.yml`
- Update a Student Builder Group → `content/student-builder-groups/<slug>.yml`
- Fix a LinkedIn or social URL → the same file as the person or group
- Add a Community Day → `content/events/<year>-<city>.yml`

Full instructions, with a worked example, are in **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## How archives work

Past Community Days are **historical records and are not edited**. Each event keeps
its own directory, its own assets and its own styling exactly as it was published.
Do not refactor an archived event, fix its links, or update its dependencies — a
2022 page is allowed to look like 2022.

If you spot something wrong on an archived page, open an issue rather than a fix.

## Deployment

Merging to the production branch deploys automatically. The pipeline that does the
deploying lives in an AWS account, **not in this repository** — see
**[docs/deployment.md](docs/deployment.md)** for the full flow, the known
cache-invalidation race, and what to do when a change does not appear.

## Event history

| Year | Event | Date | Venue |
| --- | --- | --- | --- |
| 2026 | Kirothon 2026 | build phase 1 Apr – 20 May 2026 | online |
| 2025 | Community Day Lahore | 20 Dec 2025 | One World Tower, Lahore |
| 2025 | Community Day Karachi | 22 Feb 2025 | Mohammad Ali Jinnah University, Karachi |
| 2024 | Community Day Islamabad | 24 Aug 2024 | National Incubation Centre, Islamabad |
| 2024 | Community Day Lahore | 25 Feb 2024 | FAST NUCES, Lahore |
| 2022 | Community Day Lahore | 1 Oct 2022 | UET Lahore |
| 2023 | Community Day Pakistan | — | in a separate repository, not yet imported |

## Documentation

- [docs/architecture.md](docs/architecture.md) — repository layout, content model, theme tokens
- [docs/deployment.md](docs/deployment.md) — hosting, pipeline, secrets, rollback
- [docs/restructure-plan.md](docs/restructure-plan.md) — what is being changed and why
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to contribute

## Code of conduct

All AWS Community Pakistan events and spaces follow the
[code of conduct](codeofconduct.html).
