# Contributing

Thanks for helping maintain AWS Community Pakistan's website.

Most changes need **one small YAML file** and nothing else. You do not need to read
or understand the website's HTML.

## Before you start

- You need a GitHub account. That is all — no Node.js, no build tools.
- To check your change locally (optional): `python3 scripts/validate_content.py`
- Never edit anything under an **archive** directory. Past Community Days are
  historical records. If something is wrong on one, open an issue instead.

## Worked example: fix a User Group Leader's LinkedIn URL

Say the AWS User Group Islamabad lead's LinkedIn has changed.

1. Open `content/user-groups/islamabad.yml` on GitHub and click the pencil icon.
2. Find the person and change one line:

   ```yaml
   leaders:
     - name: Hamza Shabbir
       role: organizer
       linkedin: https://www.linkedin.com/in/hamzashabbir1/   # ← edit this
   ```

3. Update the date at the bottom of the file:

   ```yaml
   last_updated: 2026-10-02
   ```

4. Commit to a new branch and open a pull request. CI validates the file within
   about a minute. An organizer reviews and merges.

That is the whole process. No HTML, no CSS, no build.

## What to edit for which task

| I want to… | Edit |
| --- | --- |
| Add or update an AWS User Group | `content/user-groups/<city>.yml` |
| Change a User Group Leader or co-lead | the `leaders:` list in that file |
| Add a Student Builder Group | copy `content/student-builder-groups/_TEMPLATE.yml` |
| Update a Student Builder Group Leader | `content/student-builder-groups/<slug>.yml` |
| Fix a LinkedIn or social URL | the file holding that person or group |
| Add a future Community Day | `content/events/<year>-<city>.yml` |
| Mark an event as past | set `status: archived` in its event file |
| Update national contact or social links | `content/community.yml` |

## Rules the validator enforces

A pull request fails CI if any of these is wrong. The error message names the file
and the field.

- The filename must match the `slug` inside the file, and be lowercase letters,
  digits and hyphens only.
- `status` must be one of the allowed values (listed in each file's comments).
- Every URL must start with `https://`.
- A LinkedIn URL must be a `linkedin.com/in/...` profile or a
  `linkedin.com/company/...` page.
- Every `logo:` and `photo:` path must point at a file that actually exists.
- A Student Builder Group's `parent_user_group` must match a real file in
  `content/user-groups/`.
- `last_updated` must be a real `YYYY-MM-DD` date.

## Adding images

- Put a User Group logo in `kirothon/logos/` (where the current ones live) or
  `<city>/images/`, and a person's photo in `<city>/images/team/`.
- Keep images **under 300 KB**. Several existing photos are over 2 MB; please do
  not add more. Resize to about 400×400 for a portrait.
- Use lowercase, hyphenated filenames: `hamza-shabbir.jpg`, not `Hamza Shabbir.JPG`.
- Never overwrite an image an archived page uses.

## Data we cannot verify

Some files carry `needs_verification: true`. That means the website shows the group
exists but the repository has no record of its URLs, leaders or status — so nothing
was invented. If you know the real values, filling one of these in is one of the
most useful contributions you can make. Remove the flag in the same pull request.

Currently flagged: Faisalabad, Peshawar, Women in Tech Lahore.

## Do not change

- Colours and styling. The palette is the AWS brand pair (`#ff9900`, `#232f3f`) and
  is documented in `docs/architecture.md`. Restyling needs a separate discussion.
- Anything in an archive directory.
- Deployment workflows, unless that is the point of your pull request.

## Pull request etiquette

- One topic per pull request. "Update Islamabad leaders" is good; "update
  Islamabad leaders and redesign the homepage" is not.
- Use a descriptive branch name: `update/islamabad-leaders`, `fix/karachi-linkedin`.
- Fill in the pull request template; it is four checkboxes.
- If CI fails, read the error — it names the exact file and field.

## Reporting a problem instead

Use the issue templates: they ask the right questions and produce correctly
formatted data, so you do not have to write YAML by hand.

- Update an AWS User Group
- Add a Student Builder Group
- Report a broken or outdated link
