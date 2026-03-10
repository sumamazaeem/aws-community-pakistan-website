#!/usr/bin/env bats
# Feature: cloudfront-cache-invalidation
# Property 1: invalidation runs iff CodePipeline status is Succeeded
# Validates: Requirements 1.1, 1.2

GATE_SCRIPT="$(dirname "$BATS_TEST_FILENAME")/../scripts/gate-check.sh"

# ---------------------------------------------------------------------------
# Known status values — deterministic cases
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 1: Succeeded exits 0" {
  run "$GATE_SCRIPT" "Succeeded"
  [ "$status" -eq 0 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: InProgress exits 1" {
  run "$GATE_SCRIPT" "InProgress"
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: Failed exits 1" {
  run "$GATE_SCRIPT" "Failed"
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: Stopped exits 1" {
  run "$GATE_SCRIPT" "Stopped"
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: Stopping exits 1" {
  run "$GATE_SCRIPT" "Stopping"
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: Superseded exits 1" {
  run "$GATE_SCRIPT" "Superseded"
  [ "$status" -eq 1 ]
}

# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 1: empty string exits 1" {
  run "$GATE_SCRIPT" ""
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: lowercase succeeded exits 1" {
  run "$GATE_SCRIPT" "succeeded"
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: SUCCEEDED uppercase exits 1" {
  run "$GATE_SCRIPT" "SUCCEEDED"
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: Succeeded with trailing space exits 1" {
  run "$GATE_SCRIPT" "Succeeded "
  [ "$status" -eq 1 ]
}

@test "Feature: cloudfront-cache-invalidation, Property 1: Succeeded with leading space exits 1" {
  run "$GATE_SCRIPT" " Succeeded"
  [ "$status" -eq 1 ]
}

# ---------------------------------------------------------------------------
# Property-based: 100 iterations of random strings — all must exit 1
# (random strings will never equal exactly "Succeeded")
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 1: 100 random strings all exit 1" {
  local iterations=100
  local i random_status

  for (( i = 0; i < iterations; i++ )); do
    # Generate a random alphanumeric string of length 4–20 using /dev/urandom
    random_status=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c $(( (RANDOM % 17) + 4 )) 2>/dev/null || true)

    # Skip the astronomically unlikely collision with "Succeeded"
    if [ "$random_status" = "Succeeded" ]; then
      continue
    fi

    run "$GATE_SCRIPT" "$random_status"
    if [ "$status" -ne 1 ]; then
      echo "FAIL: random_status='$random_status' returned exit code $status (expected 1)" >&2
      return 1
    fi
  done
}
