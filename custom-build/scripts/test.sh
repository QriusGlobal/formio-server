#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  Integration Tests for Custom FormIO Build
# ═══════════════════════════════════════════════════════════════
#
#  Purpose: Verify plugin integration works correctly
#  Usage: ./scripts/test.sh
#
#  Exit Codes:
#    0 - All tests passed
#    1 - One or more tests failed
#
#  ShellCheck: Passes with zero warnings
#
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ───────────────────────────────────────────────────────────────
#  Setup
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/utils.sh
source "$SCRIPT_DIR/utils.sh"

# ───────────────────────────────────────────────────────────────
#  Test Functions
# ───────────────────────────────────────────────────────────────

run_test() {
    local test_name=$1
    shift

    log_step "Test: $test_name"

    if "$@"; then
        log_success "PASS: $test_name"
        return 0
    else
        log_error "FAIL: $test_name"
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────
#  Main Test Suite
# ───────────────────────────────────────────────────────────────

main() {
    local failed=0

    log_info "🧪 Running Custom FormIO Build Integration Tests"
    echo ""

    # Test 1: Container Health
    if ! run_test "Container health checks" check_all_services; then
        ((failed++))
    fi
    echo ""

    # Test 2: Health Endpoint
    if ! run_test "Health endpoint responds" check_endpoint "http://localhost:${FORMIO_PORT}/health" 30; then
        ((failed++))
        show_logs "$CONTAINER_NAME" 50
    fi
    echo ""

    # Test 3: Plugin Installation
    if ! run_test "Plugin installed in node_modules" verify_plugin_installed; then
        ((failed++))
        show_logs "$CONTAINER_NAME" 30
    fi
    echo ""

    # Test 4: Plugin Registration
    if ! run_test "Plugin components registered" verify_plugin_registered; then
        ((failed++))
        show_logs "$CONTAINER_NAME" 30
    fi
    echo ""

    # Test 5: MongoDB Connection
    if ! run_test "MongoDB connection" check_mongodb; then
        ((failed++))
    fi
    echo ""

    # Test 6: Redis Connection
    if ! run_test "Redis connection" check_redis; then
        ((failed++))
    fi
    echo ""

    # ───────────────────────────────────────────────────────────
    #  Summary
    # ───────────────────────────────────────────────────────────

    echo "══════════════════════════════════════════════════════════"
    if [ $failed -eq 0 ]; then
        log_success "All tests passed! ✨"
        echo ""
        log_info "FormIO custom build is working correctly"
        log_info "Access the application at: http://localhost:${FORMIO_PORT}"
        echo "══════════════════════════════════════════════════════════"
        return 0
    else
        log_error "$failed test(s) failed"
        echo ""
        log_warning "Run 'docker compose logs formio-custom' for details"
        echo "══════════════════════════════════════════════════════════"
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────
#  Entry Point
# ───────────────────────────────────────────────────────────────

main "$@"
