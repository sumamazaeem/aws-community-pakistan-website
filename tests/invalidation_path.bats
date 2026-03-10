#!/usr/bin/env bats
# Feature: cloudfront-cache-invalidation
# Property 2: invalidation path is always /*
# Validates: Requirements 2.1

BUILD_CMD="$(dirname "$BATS_TEST_FILENAME")/../scripts/build-invalidation-cmd.sh"

# ---------------------------------------------------------------------------
# Deterministic cases — known distribution IDs
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 2: known ID E1ABCDEF123456 contains --paths \"/*\"" {
  run "$BUILD_CMD" "E1ABCDEF123456" "us-east-1"
  [ "$status" -eq 0 ]
  [[ "$output" == *'--paths "/*"'* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 2: known ID EDFDVBD6EXAMPLE contains --paths \"/*\"" {
  run "$BUILD_CMD" "EDFDVBD6EXAMPLE" "eu-west-1"
  [ "$status" -eq 0 ]
  [[ "$output" == *'--paths "/*"'* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 2: known ID E2QWRUHEXAMPLE contains --paths \"/*\"" {
  run "$BUILD_CMD" "E2QWRUHEXAMPLE" "ap-southeast-1"
  [ "$status" -eq 0 ]
  [[ "$output" == *'--paths "/*"'* ]]
}

@test "Feature: cloudfront-cache-invalidation, Property 2: known ID ABCDEF123456 with us-west-2 contains --paths \"/*\"" {
  run "$BUILD_CMD" "ABCDEF123456" "us-west-2"
  [ "$status" -eq 0 ]
  [[ "$output" == *'--paths "/*"'* ]]
}

# ---------------------------------------------------------------------------
# Property-based: 100 iterations of random distribution IDs and regions
# ---------------------------------------------------------------------------

@test "Feature: cloudfront-cache-invalidation, Property 2: 100 random distribution IDs always produce --paths \"/*\"" {
  local iterations=100
  local i dist_id region cmd_output

  # Sample region pool
  local regions=("us-east-1" "us-east-2" "us-west-1" "us-west-2"
                  "eu-west-1" "eu-west-2" "eu-central-1"
                  "ap-southeast-1" "ap-southeast-2" "ap-northeast-1")

  for (( i = 0; i < iterations; i++ )); do
    # Random uppercase alphanumeric distribution ID, 6–20 chars
    local len=$(( (RANDOM % 15) + 6 ))
    dist_id=$(cat /dev/urandom | tr -dc 'A-Z0-9' | head -c "$len" 2>/dev/null || true)

    # Pick a random region from the pool
    region="${regions[$(( RANDOM % ${#regions[@]} ))]}"

    run "$BUILD_CMD" "$dist_id" "$region"

    if [ "$status" -ne 0 ]; then
      echo "FAIL: build-invalidation-cmd.sh exited $status for dist_id='$dist_id' region='$region'" >&2
      return 1
    fi

    if [[ "$output" != *'--paths "/*"'* ]]; then
      echo "FAIL: output did not contain '--paths \"/*\"' for dist_id='$dist_id' region='$region'" >&2
      echo "  actual output: $output" >&2
      return 1
    fi
  done
}
