"""
Unit tests for .github/workflows/cloudfront-invalidation.yml correctness.

E1 — Workflow trigger configuration
E2 — No hard-coded sensitive values
E3 — Workflow file exists at expected path
"""

import os
import re

import pytest
import yaml

WORKFLOW_PATH = ".github/workflows/cloudfront-invalidation.yml"


def load_yaml():
    with open(WORKFLOW_PATH, "r") as f:
        return yaml.safe_load(f)


def get_on_block(doc: dict):
    """
    PyYAML parses the bare word 'on' as the boolean True.
    Try both the string key and the boolean key so the test is robust.
    """
    if "on" in doc:
        return doc["on"]
    if True in doc:
        return doc[True]
    return None


def load_raw():
    with open(WORKFLOW_PATH, "r") as f:
        return f.read()


# ---------------------------------------------------------------------------
# E1 — Trigger is push to main only
# ---------------------------------------------------------------------------

def test_E1_trigger_is_push_to_main():
    """on: block must contain only push with branches: [main] — no other triggers."""
    doc = load_yaml()
    on_block = get_on_block(doc)

    # Must be a dict (not a list or bare string)
    assert isinstance(on_block, dict), f"Expected 'on' to be a mapping, got: {type(on_block)}"

    # Exactly one trigger key: push
    assert list(on_block.keys()) == ["push"], (
        f"Expected only 'push' trigger, found: {list(on_block.keys())}"
    )

    # push.branches must be exactly ['main']
    push_cfg = on_block["push"]
    assert isinstance(push_cfg, dict), "Expected 'push' to be a mapping with 'branches'"
    branches = push_cfg.get("branches")
    assert branches == ["main"], f"Expected branches: [main], got: {branches}"

    # No extra keys inside push (e.g. tags, paths)
    assert list(push_cfg.keys()) == ["branches"], (
        f"Unexpected keys inside 'push': {list(push_cfg.keys())}"
    )


# ---------------------------------------------------------------------------
# E2 — No hard-coded sensitive values outside secrets/vars references
# ---------------------------------------------------------------------------

def test_E2_no_hardcoded_values():
    """
    After stripping all ${{ secrets.* }} and ${{ vars.* }} references from the
    raw YAML text, no literal AWS account IDs, access key IDs, secret key
    patterns, distribution IDs, or region strings should remain.
    """
    raw = load_raw()

    # Strip all ${{ secrets.ANYTHING }} and ${{ vars.ANYTHING }} references
    sanitised = re.sub(r"\$\{\{\s*secrets\.[A-Za-z0-9_]+\s*\}\}", "", raw)
    sanitised = re.sub(r"\$\{\{\s*vars\.[A-Za-z0-9_]+\s*\}\}", "", sanitised)

    # 12-digit AWS account IDs (standalone number, not part of a longer token)
    account_id_pattern = re.compile(r"(?<!\d)\d{12}(?!\d)")
    assert not account_id_pattern.search(sanitised), (
        "Found a potential hard-coded AWS account ID (12-digit number) in the workflow file."
    )

    # AWS access key IDs: AKIA followed by 16 uppercase alphanumeric chars
    access_key_pattern = re.compile(r"AKIA[A-Z0-9]{16}")
    assert not access_key_pattern.search(sanitised), (
        "Found a potential hard-coded AWS access key ID (AKIA...) in the workflow file."
    )

    # CloudFront distribution IDs: E followed by 13 uppercase alphanumeric chars
    distribution_id_pattern = re.compile(r"\bE[A-Z0-9]{13}\b")
    assert not distribution_id_pattern.search(sanitised), (
        "Found a potential hard-coded CloudFront distribution ID (E[A-Z0-9]{13}) in the workflow file."
    )

    # Common AWS region strings
    region_pattern = re.compile(
        r"\b(us-east-1|us-east-2|us-west-1|us-west-2"
        r"|eu-west-1|eu-west-2|eu-west-3|eu-central-1|eu-north-1"
        r"|ap-southeast-1|ap-southeast-2|ap-northeast-1|ap-northeast-2"
        r"|ap-south-1|sa-east-1|ca-central-1|me-south-1|af-south-1)\b"
    )
    assert not region_pattern.search(sanitised), (
        "Found a potential hard-coded AWS region string in the workflow file."
    )


# ---------------------------------------------------------------------------
# E3 — Workflow file exists at the expected path
# ---------------------------------------------------------------------------

def test_E3_workflow_file_exists():
    """The workflow file must exist at .github/workflows/cloudfront-invalidation.yml."""
    assert os.path.isfile(WORKFLOW_PATH), (
        f"Workflow file not found at: {WORKFLOW_PATH}"
    )
