# AWS Student Builder Groups

**This directory is intentionally empty apart from the template.**

A complete search of all 263 HTML and CSS files in this repository returns **zero**
matches for "Student Builder", "Student Ambassador" or "SBG". The website has never
had any Student Builder Group content, so there was nothing to migrate and nothing
has been invented here.

## Adding your group

1. Copy `_TEMPLATE.yml` to `<slug>.yml` — for example `uol-lahore.yml`.
2. Fill in what you know. Leave anything you do not know as `null`; do not guess.
3. Set `parent_user_group` to the nearest AWS User Group — it must match a filename
   in `../user-groups/`.
4. Run `python3 scripts/validate_content.py` if you can, then open a pull request.

Files starting with `_` are templates and are skipped by the validator.

## Why `term` matters

Student leadership turns over every academic year. When a leader moves on, do
**not** overwrite them — add the new leader with the new `term` and keep the
previous entry. A group whose leadership has fully moved on becomes
`status: graduated` rather than being deleted. The point is that the record stays
accurate about who led when.

## What still needs a human

Nobody has yet supplied the list of which Student Builder Groups exist in Pakistan,
their universities, or their leaders. That list cannot be derived from this
repository — it has to come from the community. Until it does, this directory stays
empty rather than carrying placeholder names.
