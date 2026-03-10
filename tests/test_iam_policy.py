"""
Property-based tests for IAM policy document structure.

**Validates: Requirements 4.1, 4.2, 6.3, 6.4**

Feature: cloudfront-cache-invalidation
Property 4: IAM policy allows only cloudfront:CreateInvalidation on specific ARN
"""

import re
import pytest
from hypothesis import given, settings, strategies as st


# ---------------------------------------------------------------------------
# Validator
# ---------------------------------------------------------------------------

_VALID_ACTION = "cloudfront:CreateInvalidation"
_RESOURCE_PATTERN = re.compile(
    r"^arn:aws:cloudfront::\d+:distribution/[A-Z0-9]+$"
)


def validate_policy(policy_doc: dict) -> bool:
    """Return True iff the policy document is valid for this feature.

    Valid means:
    - Has a "Statement" key that is a list with exactly one element.
    - That statement's "Action" is exactly "cloudfront:CreateInvalidation"
      (either as a bare string or as a single-element list).
    - That statement's "Resource" matches
      arn:aws:cloudfront::<digits>:distribution/<uppercase-alphanumeric>.
    - No other actions appear anywhere in the document.
    """
    if not isinstance(policy_doc, dict):
        return False

    statements = policy_doc.get("Statement")
    if not isinstance(statements, list) or len(statements) != 1:
        return False

    stmt = statements[0]
    if not isinstance(stmt, dict):
        return False

    # Validate Action
    action = stmt.get("Action")
    if isinstance(action, list):
        if len(action) != 1 or action[0] != _VALID_ACTION:
            return False
    elif isinstance(action, str):
        if action != _VALID_ACTION:
            return False
    else:
        return False

    # Validate Resource
    resource = stmt.get("Resource")
    if not isinstance(resource, str):
        return False
    if not _RESOURCE_PATTERN.match(resource):
        return False

    return True


# ---------------------------------------------------------------------------
# Strategies
# ---------------------------------------------------------------------------

# A valid CloudFront distribution ARN
_account_ids = st.from_regex(r"\d{12}", fullmatch=True)
_dist_ids = st.from_regex(r"[A-Z0-9]{1,20}", fullmatch=True)


@st.composite
def valid_resource(draw):
    account = draw(_account_ids)
    dist = draw(_dist_ids)
    return f"arn:aws:cloudfront::{account}:distribution/{dist}"


@st.composite
def invalid_resource(draw):
    """Produce strings that do NOT match the valid ARN pattern."""
    return draw(
        st.one_of(
            st.just("*"),
            st.just("arn:aws:s3:::my-bucket"),
            st.just("arn:aws:cloudfront::123456789012:distribution/"),  # empty dist id
            st.just("arn:aws:cloudfront:::distribution/ABC123"),         # no account
            st.from_regex(r"[a-z0-9/:-]{5,40}", fullmatch=True),        # lowercase / wrong shape
        )
    )


@st.composite
def valid_action(draw):
    """Return the action in either string or single-element list form."""
    as_list = draw(st.booleans())
    if as_list:
        return [_VALID_ACTION]
    return _VALID_ACTION


@st.composite
def invalid_action(draw):
    """Return an action value that is NOT the single valid action."""
    return draw(
        st.one_of(
            st.just("*"),
            st.just("cloudfront:*"),
            st.just("s3:PutObject"),
            st.just("cloudfront:CreateInvalidation").filter(lambda _: False),  # never chosen
            st.lists(
                st.sampled_from([
                    "cloudfront:CreateInvalidation",
                    "s3:GetObject",
                    "iam:PassRole",
                    "cloudfront:*",
                ]),
                min_size=2,
                max_size=4,
            ),
            st.lists(st.just("s3:PutObject"), min_size=1, max_size=1),
        )
    )


@st.composite
def valid_statement(draw):
    return {
        "Effect": "Allow",
        "Action": draw(valid_action()),
        "Resource": draw(valid_resource()),
    }


@st.composite
def arbitrary_statement(draw):
    """A statement with random action and resource (may or may not be valid)."""
    action = draw(st.one_of(valid_action(), invalid_action()))
    resource = draw(st.one_of(valid_resource(), invalid_resource()))
    return {"Effect": "Allow", "Action": action, "Resource": resource}


# ---------------------------------------------------------------------------
# Property-based tests
# ---------------------------------------------------------------------------

@given(resource=valid_resource(), action=valid_action())
@settings(max_examples=100)
def test_property4_valid_policy_is_accepted(resource, action):
    """
    **Validates: Requirements 4.1, 4.2, 6.3, 6.4**

    A policy with exactly one statement, the correct action, and a valid
    CloudFront ARN must always be accepted.
    """
    policy = {
        "Version": "2012-10-17",
        "Statement": [{"Effect": "Allow", "Action": action, "Resource": resource}],
    }
    assert validate_policy(policy) is True


@given(action=invalid_action(), resource=valid_resource())
@settings(max_examples=100)
def test_property4_invalid_action_is_rejected(action, resource):
    """
    **Validates: Requirements 4.1, 4.2, 6.3, 6.4**

    A policy whose Action is anything other than the single allowed value
    must always be rejected.
    """
    policy = {
        "Version": "2012-10-17",
        "Statement": [{"Effect": "Allow", "Action": action, "Resource": resource}],
    }
    assert validate_policy(policy) is False


@given(resource=invalid_resource(), action=valid_action())
@settings(max_examples=100)
def test_property4_invalid_resource_is_rejected(resource, action):
    """
    **Validates: Requirements 4.1, 4.2, 6.3, 6.4**

    A policy whose Resource does not match the required CloudFront ARN
    pattern must always be rejected.
    """
    policy = {
        "Version": "2012-10-17",
        "Statement": [{"Effect": "Allow", "Action": action, "Resource": resource}],
    }
    assert validate_policy(policy) is False


@given(
    statements=st.lists(arbitrary_statement(), min_size=0, max_size=5).filter(
        lambda s: len(s) != 1
    )
)
@settings(max_examples=100)
def test_property4_wrong_statement_count_is_rejected(statements):
    """
    **Validates: Requirements 4.1, 4.2, 6.3, 6.4**

    A policy with any number of statements other than exactly one must
    always be rejected.
    """
    policy = {"Version": "2012-10-17", "Statement": statements}
    assert validate_policy(policy) is False


# ---------------------------------------------------------------------------
# Explicit unit tests
# ---------------------------------------------------------------------------

def test_explicit_valid_policy():
    """A canonical valid policy document is accepted."""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowCloudfrontInvalidationOnly",
                "Effect": "Allow",
                "Action": "cloudfront:CreateInvalidation",
                "Resource": "arn:aws:cloudfront::123456789012:distribution/E1ABCDEF123456",
            }
        ],
    }
    assert validate_policy(policy) is True


def test_explicit_valid_policy_action_as_list():
    """Action supplied as a single-element list is also accepted."""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["cloudfront:CreateInvalidation"],
                "Resource": "arn:aws:cloudfront::123456789012:distribution/ABCDEF123",
            }
        ],
    }
    assert validate_policy(policy) is True


def test_explicit_wildcard_action_rejected():
    """A wildcard action must be rejected."""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "*",
                "Resource": "arn:aws:cloudfront::123456789012:distribution/E1ABCDEF123456",
            }
        ],
    }
    assert validate_policy(policy) is False


def test_explicit_s3_action_rejected():
    """An S3 action must be rejected (Requirement 4.2)."""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:PutObject",
                "Resource": "arn:aws:cloudfront::123456789012:distribution/E1ABCDEF123456",
            }
        ],
    }
    assert validate_policy(policy) is False


def test_explicit_wildcard_resource_rejected():
    """A wildcard resource must be rejected."""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "cloudfront:CreateInvalidation",
                "Resource": "*",
            }
        ],
    }
    assert validate_policy(policy) is False


def test_explicit_multiple_statements_rejected():
    """More than one statement must be rejected."""
    policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "cloudfront:CreateInvalidation",
                "Resource": "arn:aws:cloudfront::123456789012:distribution/E1ABCDEF123456",
            },
            {
                "Effect": "Allow",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::my-bucket/*",
            },
        ],
    }
    assert validate_policy(policy) is False


def test_explicit_empty_statements_rejected():
    """Zero statements must be rejected."""
    policy = {"Version": "2012-10-17", "Statement": []}
    assert validate_policy(policy) is False
