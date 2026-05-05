#!/bin/bash

# Playwright Multi-Framework Test Runner with Allure Reporting
# Runs tests for csharp-playwright, ts-playwright, and js-playwright

ENVIRONMENT="${1:-qa}"
BROWSER="${2:-chromium}"
HEADED="${3:-false}"
GENERATE_REPORT="${4:-false}"

echo "========================================"
echo "Playwright Multi-Framework Test Runner"
echo "========================================"
echo "Environment: $ENVIRONMENT"
echo "Browser: $BROWSER"
echo "Headed Mode: $HEADED"
echo "Generate Allure Report: $GENERATE_REPORT"
echo ""

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULTS_FILE="$BASE_DIR/test-results.json"
echo "[]" > "$RESULTS_FILE"

# Function to run tests and track results
run_test_suite() {
    local name="$1"
    local path="$2"
    local command="$3"
    
    echo "----------------------------------------"
    echo "Running $name Tests"
    echo "----------------------------------------"
    
    cd "$path" || exit 1
    local exit_code=0
    
    eval "$command" || exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ $name tests PASSED"
        echo "[{\"framework\":\"$name\",\"status\":\"PASSED\",\"exitCode\":$exit_code}]" > "$RESULTS_FILE"
    else
        echo "❌ $name tests FAILED"
        echo "[{\"framework\":\"$name\",\"status\":\"FAILED\",\"exitCode\":$exit_code}]" > "$RESULTS_FILE"
    fi
    
    echo ""
    cd "$BASE_DIR" || exit 1
}

# Build headed flag
if [ "$HEADED" = "true" ]; then
    HEADED_FLAG="--headed"
else
    HEADED_FLAG=""
fi

# Run JS Playwright Tests
run_test_suite "JS Playwright" "$BASE_DIR/frameworks/js-playwright" "npx playwright test $HEADED_FLAG"

# Run TS Playwright Tests
run_test_suite "TS Playwright" "$BASE_DIR/frameworks/ts-playwright" "npx playwright test $HEADED_FLAG"

# Run C# Playwright Tests
run_test_suite "C# Playwright" "$BASE_DIR/frameworks/csharp-playwright" "dotnet test --filter \"BrowserName=$BROWSER\""

# Generate Allure Report if requested
if [ "$GENERATE_REPORT" = "true" ]; then
    echo "----------------------------------------"
    echo "Generating Allure Report"
    echo "----------------------------------------"
    
    # Create allure-results directory
    ALLURE_RESULTS_DIR="$BASE_DIR/allure-results"
    rm -rf "$ALLURE_RESULTS_DIR"
    mkdir -p "$ALLURE_RESULTS_DIR"
    
    # Copy all allure-results to main directory
    find "$BASE_DIR" -type d -name "allure-results" | while read -r dir; do
        cp -r "$dir"/* "$ALLURE_RESULTS_DIR"/ 2>/dev/null || true
    done
    
    # Generate Allure report
    if command -v allure &> /dev/null; then
        allure generate "$ALLURE_RESULTS_DIR" --clean -o "$BASE_DIR/allure-report"
        echo "✅ Allure report generated at: $BASE_DIR/allure-report"
        echo "   Open with: allure open $BASE_DIR/allure-report"
    else
        echo "❌ Allure command line not found. Install with: npm install -g allure-commandline"
    fi
    echo ""
fi

# Summary
echo "========================================"
echo "TEST EXECUTION SUMMARY"
echo "========================================"
echo ""

if [ -f "$RESULTS_FILE" ]; then
    cat "$RESULTS_FILE"
fi

echo ""
echo "Check individual test reports for details."
echo ""

# Exit with failure if any test failed
if grep -q '"status":"FAILED"' "$RESULTS_FILE"; then
    echo "❌ Some tests failed!"
    exit 1
else
    echo "✅ All tests passed!"
    exit 0
fi
