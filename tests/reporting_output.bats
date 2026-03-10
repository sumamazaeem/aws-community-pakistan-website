#!/usr/bin/env bats
# Feature: cloudfront-cache-invalidation
# Property 3: reporting output contains invalidation ID on success
# Validates: Requirements 3.1, 3.3

REPORT_SCRIPT="$(dirname "$BATS_TEST_FILENAME")/../scripts/report-status.sh"

# ---------------------------------------------------------------------------
# Deterministic cases
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 3: success outcome contains Succeeded marker" {
  run "$REPORT_SCRIPT" "success" "IABCDEF123456"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Succeeded"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: success outcome contains checkmark emoji" {
  run "$REPORT_SCRIPT" "success" "IABCDEF123456"
  [ "$status" -eq 0 ]
  [[ "$output" == *"✅"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: success outcome contains exact invalidation ID" {
  run "$REPORT_SCRIPT" "success" "IABCDEF123456"
  [ "$status" -eq 0 ]
  [[ "$output" == *"IABCDEF123456"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: failure outcome contains Failed marker" {
  run "$REPORT_SCRIPT" "failure" "IABCDEF123456"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Failed"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: failure outcome contains cross emoji" {
  run "$REPORT_SCRIPT" "failure" "IABCDEF123456"
  [ "$status" -eq 0 ]
  [[ "$output" == *"❌"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: failure outcome does NOT contain the invalidation ID" {
  run "$REPORT_SCRIPT" "failure" "IABCDEF123456"
  [ "$status" -eq 0 ]
  [[ "$output" != *"IABCDEF123456"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: success with ID E2QWRUHEXAMPLE contains that ID" {
  run "$REPORT_SCRIPT" "success" "E2QWRUHEXAMPLE"
  [ "$status" -eq 0 ]
  [[ "$output" == *"E2QWRUHEXAMPLE"* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 3: non-success outcome (error) contains failure marker" {
  run "$REPORT_SCRIPT" "error" "SOMEID"
  [ "$status" -eq 0 ]
  [[ "$output" == *"Failed"* ]]
}

# ---------------------------------------------------------------------------
# Property-based: 100 iterations — success outcome always contains the ID
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 3: 100 random IDs on success always appear in output" {
  local iterations=100
  local i inv_id

  for (( i = 0; i < iterations; i++ )); do
    # Random alphanumeric invalidation ID, 8–20 chars (uppercase, matching CloudFront format)
    local len=$(( (RANDOM % 13) + 8 ))
    inv_id=$(cat /dev/urandom | tr -dc 'A-Z0-9' | head -c "$len" 2>/dev/null || true)

    run "$REPORT_SCRIPT" "success" "$inv_id"

    if [ "$status" -ne 0 ]; then
      echo "FAIL: report-status.sh exited $status for inv_id='$inv_id'" >&2
      return 1
    fi

    if [[ "$output" != *"$inv_id"* ]]; then
      echo "FAIL: output did not contain invalidation ID '$inv_id'" >&2
      echo "  actual output: $output" >&2
      return 1
    fi

    if [[ "$output" != *"Succeeded"* ]]; then
      echo "FAIL: output did not contain 'Succeeded' for inv_id='$inv_id'" >&2
      echo "  actual output: $output" >&2
      return 1
    fi
  done
}

# ---------------------------------------------------------------------------
# Property-based: 100 iterations — failure outcome never contains the ID
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 3: 100 random IDs on failure never appear in output" {
  local iterations=100
  local i inv_id

  for (( i = 0; i < iterations; i++ )); do
    local len=$(( (RANDOM % 13) + 8 ))
    inv_id=$(cat /dev/urandom | tr -dc 'A-Z0-9' | head -c "$len" 2>/dev/null || true)

    run "$REPORT_SCRIPT" "failure" "$inv_id"

    if [ "$status" -ne 0 ]; then
      echo "FAIL: report-status.sh exited $status for inv_id='$inv_id'" >&2
      return 1
    fi

    if [[ "$output" == *"$inv_id"* ]]; then
      echo "FAIL: failure output unexpectedly contained invalidation ID '$inv_id'" >&2
      echo "  actual output: $output" >&2
      return 1
    fi

    if [[ "$output" != *"Failed"* ]]; then
      echo "FAIL: output did not contain 'Failed' for inv_id='$inv_id'" >&2
      echo "  actual output: $output" >&2
      return 1
    fi
  done
}
