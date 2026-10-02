#!/usr/bin/env python3
"""Validate the structured community data in content/.

Run from the repository root:

    python3 scripts/validate_content.py

Exits 0 if everything is valid, 1 if there are errors. Warnings never fail the
build -- they flag data that is incomplete but honestly marked as such.

Requires PyYAML only. No Node.js, no network, no AWS access.
"""

from __future__ import annotations

import datetime as _dt
import pathlib
import re
import sys

try:
    import yaml
except ImportError:
    sys.exit("PyYAML is required:  pip install pyyaml")

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
EVENT_SLUG_RE = re.compile(r"^(19|20)\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$")
LINKEDIN_RE = re.compile(r"^https://(?:www\.)?linkedin\.com/(?:in|company)/[^\s]+$")
SESSIONIZE_ID_RE = re.compile(r"^[a-z0-9]{6,12}$")

# Keys inside a links: block that are deliberately NOT URLs.
NON_URL_LINK_KEYS = {"sessionize_widget_id"}

GROUP_STATUS = {"active", "dormant", "archived"}
SBG_STATUS = {"active", "inactive", "graduated"}
EVENT_STATUS = {"upcoming", "active", "archived"}
ROLES = {"lead", "co-lead", "mentor", "organizer", "co-organizer",
         "core-team", "unspecified"}

errors: list[str] = []
warnings: list[str] = []


def err(where: str, msg: str) -> None:
    errors.append(f"{where}: {msg}")


def warn(where: str, msg: str) -> None:
    warnings.append(f"{where}: {msg}")


def rel(p: pathlib.Path) -> str:
    return str(p.relative_to(ROOT))


def load(path: pathlib.Path):
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        err(rel(path), f"not valid YAML -- {exc}")
        return None


def check_url(where: str, field: str, value) -> None:
    if value is None:
        return
    if not isinstance(value, str) or not value.startswith("https://"):
        err(where, f"{field} must start with https:// (got {value!r})")


def check_linkedin(where: str, field: str, value) -> None:
    if value is None:
        return
    if not isinstance(value, str) or not LINKEDIN_RE.match(value):
        err(where, f"{field} must be a linkedin.com/in/ or /company/ URL "
                   f"(got {value!r})")


def check_asset(where: str, field: str, value) -> None:
    """An asset path must point at a file that actually exists."""
    if value is None:
        return
    if not isinstance(value, str):
        err(where, f"{field} must be a path or null (got {value!r})")
        return
    if value.startswith(("http://", "https://")):
        check_url(where, field, value)
        return
    if not (ROOT / value).is_file():
        err(where, f"{field} points at a file that does not exist: {value}")


def check_date(where: str, field: str, value, required: bool = False) -> None:
    if value is None:
        if required:
            err(where, f"{field} is required")
        return
    if isinstance(value, _dt.date):
        return
    try:
        _dt.date.fromisoformat(str(value))
    except ValueError:
        err(where, f"{field} must be a YYYY-MM-DD date (got {value!r})")


def check_people(where: str, people, allowed_roles: set[str],
                 require_lead: bool) -> None:
    if people is None:
        return
    if not isinstance(people, list):
        err(where, "leaders must be a list")
        return
    leads = 0
    for i, person in enumerate(people):
        tag = f"{where} leaders[{i}]"
        if not isinstance(person, dict):
            err(tag, "each entry must be a mapping")
            continue
        if not person.get("name"):
            err(tag, "name is required")
        role = person.get("role")
        if role not in allowed_roles:
            err(tag, f"role must be one of {sorted(allowed_roles)} (got {role!r})")
        if role == "lead":
            leads += 1
        check_linkedin(tag, "linkedin", person.get("linkedin"))
        check_asset(tag, "photo", person.get("photo"))
    if require_lead and people and leads == 0:
        warn(where, "no leader has role: lead")


def check_links(where: str, links) -> None:
    """Validate a links: block, skipping keys that are not URLs by design."""
    if links is None:
        return
    if not isinstance(links, dict):
        err(where, "links must be a mapping")
        return
    for field, value in links.items():
        if field == "sessionize_widget_id":
            if value is not None and not (
                isinstance(value, str) and SESSIONIZE_ID_RE.match(value)
            ):
                err(where, f"links.sessionize_widget_id must be a Sessionize "
                           f"widget id such as 'aeseyim7' (got {value!r})")
        elif field in NON_URL_LINK_KEYS:
            continue
        elif field == "linkedin":
            check_linkedin(where, "links.linkedin", value)
        else:
            check_url(where, f"links.{field}", value)


def check_common(where: str, data: dict, statuses: set[str]) -> None:
    if data.get("status") not in statuses:
        err(where, f"status must be one of {sorted(statuses)} "
                   f"(got {data.get('status')!r})")
    check_date(where, "last_updated", data.get("last_updated"))
    check_links(where, data.get("links"))
    check_asset(where, "logo", data.get("logo"))
    if data.get("needs_verification"):
        warn(where, "needs_verification is true -- incomplete data, "
                    "contributions welcome")


def validate_user_groups() -> set[str]:
    slugs: set[str] = set()
    directory = CONTENT / "user-groups"
    if not directory.is_dir():
        err("content/user-groups", "directory is missing")
        return slugs
    files = sorted(p for p in directory.glob("*.yml") if not p.name.startswith("_"))
    if not files:
        err("content/user-groups", "no user group files found")
    for path in files:
        where = rel(path)
        data = load(path)
        if not isinstance(data, dict):
            err(where, "file must contain a YAML mapping")
            continue
        slug = data.get("slug")
        if slug != path.stem:
            err(where, f"slug {slug!r} does not match filename {path.stem!r}")
        if not isinstance(slug, str) or not SLUG_RE.match(slug or ""):
            err(where, f"slug must be lowercase letters, digits and hyphens "
                       f"(got {slug!r})")
        else:
            slugs.add(slug)
        for field in ("name", "city"):
            if not data.get(field):
                err(where, f"{field} is required")
        check_common(where, data, GROUP_STATUS)
        check_people(where, data.get("leaders"), ROLES, require_lead=False)
        if data.get("page"):
            check_asset(where, "page", data["page"])
    return slugs


def validate_student_builder_groups(group_slugs: set[str]) -> None:
    directory = CONTENT / "student-builder-groups"
    if not directory.is_dir():
        err("content/student-builder-groups", "directory is missing")
        return
    files = sorted(p for p in directory.glob("*.yml") if not p.name.startswith("_"))
    if not files:
        warn("content/student-builder-groups",
             "no groups recorded yet -- see the README in that directory")
    for path in files:
        where = rel(path)
        data = load(path)
        if not isinstance(data, dict):
            err(where, "file must contain a YAML mapping")
            continue
        slug = data.get("slug")
        if slug != path.stem:
            err(where, f"slug {slug!r} does not match filename {path.stem!r}")
        if not isinstance(slug, str) or not SLUG_RE.match(slug or ""):
            err(where, f"slug must be lowercase letters, digits and hyphens "
                       f"(got {slug!r})")
        if not data.get("university"):
            err(where, "university is required")
        check_common(where, data, SBG_STATUS)
        check_people(where, data.get("leaders"), {"lead", "co-lead"},
                     require_lead=True)
        parent = data.get("parent_user_group")
        if parent is None:
            warn(where, "parent_user_group is not set")
        elif parent not in group_slugs:
            err(where, f"parent_user_group {parent!r} does not match any file in "
                       f"content/user-groups/ (known: {sorted(group_slugs)})")


def validate_events(group_slugs: set[str]) -> None:
    directory = CONTENT / "events"
    if not directory.is_dir():
        err("content/events", "directory is missing")
        return
    for path in sorted(p for p in directory.glob("*.yml")
                       if not p.name.startswith("_")):
        where = rel(path)
        data = load(path)
        if not isinstance(data, dict):
            err(where, "file must contain a YAML mapping")
            continue
        slug = data.get("slug")
        if slug != path.stem:
            err(where, f"slug {slug!r} does not match filename {path.stem!r}")
        if not isinstance(slug, str) or not EVENT_SLUG_RE.match(slug or ""):
            err(where, f"event slug must look like 2026-lahore (got {slug!r})")
        if not data.get("name"):
            err(where, "name is required")
        year = data.get("year")
        if not isinstance(year, int) or not 2000 <= year <= 2100:
            err(where, f"year must be a four-digit integer (got {year!r})")
        elif isinstance(slug, str) and not slug.startswith(f"{year}-"):
            warn(where, f"slug {slug!r} does not start with year {year}")
        check_common(where, data, EVENT_STATUS)
        check_date(where, "date", data.get("date"))
        check_date(where, "end_date", data.get("end_date"))
        if data.get("page"):
            check_asset(where, "page", data["page"])
        for referenced in (data.get("user_groups") or []):
            if referenced not in group_slugs:
                err(where, f"user_groups entry {referenced!r} does not match any "
                           f"file in content/user-groups/")
        for i, person in enumerate(data.get("team") or []):
            tag = f"{where} team[{i}]"
            if not isinstance(person, dict):
                err(tag, "each entry must be a mapping")
                continue
            if not person.get("name"):
                err(tag, "name is required")
            check_linkedin(tag, "linkedin", person.get("linkedin"))
            check_asset(tag, "photo", person.get("photo"))


def validate_community() -> None:
    path = CONTENT / "community.yml"
    if not path.is_file():
        warn("content/community.yml", "file is missing")
        return
    where = rel(path)
    data = load(path)
    if not isinstance(data, dict):
        err(where, "file must contain a YAML mapping")
        return
    if not data.get("name"):
        err(where, "name is required")
    check_url(where, "site", data.get("site"))
    check_asset(where, "logo", data.get("logo"))
    check_links(where, data.get("links"))
    check_date(where, "last_updated", data.get("last_updated"))


def main() -> int:
    if not CONTENT.is_dir():
        print("FAIL  content/ directory not found -- run this from the "
              "repository root", file=sys.stderr)
        return 1

    group_slugs = validate_user_groups()
    validate_student_builder_groups(group_slugs)
    validate_events(group_slugs)
    validate_community()

    if warnings:
        print(f"{len(warnings)} warning(s):")
        for line in warnings:
            print(f"  WARN  {line}")
        print()

    if errors:
        print(f"{len(errors)} error(s):")
        for line in errors:
            print(f"  FAIL  {line}")
        print("\nContent validation FAILED. See CONTRIBUTING.md for the rules.")
        return 1

    print(f"Content validation passed. "
          f"{len(group_slugs)} user group(s) checked.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
