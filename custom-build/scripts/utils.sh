#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  Shared Utility Functions (DRY Principle)
# ═══════════════════════════════════════════════════════════════
#
#  Purpose: Centralized functions to avoid code duplication
#  Usage: source this file in other scripts
#
#  Example:
#    #!/usr/bin/env bash
#    source "$(dirname "$0")/utils.sh"
#    log_info "Starting process..."
#
#  ShellCheck: Passes with zero warnings
#
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# ───────────────────────────────────────────────────────────────
#  Terminal Colors (macOS compatible)
# ───────────────────────────────────────────────────────────────

readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# ───────────────────────────────────────────────────────────────
#  Container Configuration
# ───────────────────────────────────────────────────────────────

readonly CONTAINER_NAME="formio-custom"
readonly MONGO_CONTAINER="formio-custom-mongo"
readonly REDIS_CONTAINER="formio-custom-redis"
readonly GCS_CONTAINER="formio-custom-gcs"
readonly TUS_CONTAINER="formio-custom-tus"

readonly FORMIO_PORT="${FORMIO_PORT:-3001}"
readonly MONGO_PORT="${MONGO_PORT:-27017}"
readonly REDIS_PORT="${REDIS_PORT:-6379}"

# ───────────────────────────────────────────────────────────────
#  Logging Functions
# ───────────────────────────────────────────────────────────────

log_info() {
    echo -e "${BLUE}ℹ${NC} $*"
}

log_success() {
    echo -e "${GREEN}✅${NC} $*"
}

log_error() {
    echo -e "${RED}❌${NC} $*" >&2
}

log_warning() {
    echo -e "${YELLOW}⚠️${NC} $*"
}

log_debug() {
    if [[ "${DEBUG:-}" == "true" ]]; then
        echo -e "${PURPLE}🐛${NC} $*"
    fi
}

log_step() {
    echo -e "${CYAN}▶${NC} $*"
}

# ───────────────────────────────────────────────────────────────
#  Docker Health Check Utilities
# ───────────────────────────────────────────────────────────────

# Wait for container to become healthy
# Usage: wait_for_container "container-name" [max_attempts]
wait_for_container() {
    local container=$1
    local max_attempts=${2:-30}
    local attempt=0

    log_info "Waiting for $container to be healthy..."

    while [ $attempt -lt "$max_attempts" ]; do
        if docker inspect "$container" &>/dev/null; then
            local health_status
            health_status=$(docker inspect -f '{{.State.Health.Status}}' "$container" 2>/dev/null || echo "none")

            if [ "$health_status" = "healthy" ]; then
                log_success "$container is healthy"
                return 0
            elif [ "$health_status" = "none" ]; then
                # Container has no health check, check if it's running
                local container_status
                container_status=$(docker inspect -f '{{.State.Status}}' "$container" 2>/dev/null)
                if [ "$container_status" = "running" ]; then
                    log_success "$container is running (no health check defined)"
                    return 0
                fi
            fi
        fi

        sleep 1
        ((attempt++))
    done

    log_error "$container failed to become healthy after $max_attempts seconds"
    docker logs "$container" --tail 20
    return 1
}

# Check if all services are healthy
check_all_services() {
    local failed=0

    log_step "Checking all services..."

    for container in "$MONGO_CONTAINER" "$REDIS_CONTAINER" "$GCS_CONTAINER" "$TUS_CONTAINER" "$CONTAINER_NAME"; do
        if ! wait_for_container "$container" 30; then
            ((failed++))
        fi
    done

    if [ $failed -eq 0 ]; then
        log_success "All services are healthy"
        return 0
    else
        log_error "$failed service(s) failed health checks"
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────
#  HTTP Endpoint Utilities
# ───────────────────────────────────────────────────────────────

# Check if HTTP endpoint is responding
# Usage: check_endpoint "http://localhost:3001/health" [max_attempts]
check_endpoint() {
    local url=$1
    local max_attempts=${2:-30}
    local attempt=0

    log_info "Checking endpoint: $url"

    while [ $attempt -lt "$max_attempts" ]; do
        if curl -sf "$url" >/dev/null 2>&1; then
            log_success "Endpoint is responding: $url"
            return 0
        fi
        sleep 1
        ((attempt++))
    done

    log_error "Endpoint not responding after $max_attempts seconds: $url"
    return 1
}

# Test endpoint and show response
# Usage: test_endpoint "http://localhost:3001/health"
test_endpoint() {
    local url=$1

    log_step "Testing endpoint: $url"

    local response
    response=$(curl -sf "$url" 2>&1)
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        log_success "Response received"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 0
    else
        log_error "Failed to reach endpoint"
        echo "$response"
        return 1
    fi
}

# ───────────────────────────────────────────────────────────────
#  Plugin Verification Utilities
# ───────────────────────────────────────────────────────────────

# Verify plugin is installed correctly
# Usage: verify_plugin_installed
verify_plugin_installed() {
    log_step "Verifying plugin installation..."

    if ! docker exec "$CONTAINER_NAME" node -e "
        try {
            require.resolve('@formio/file-upload');
            console.log('✅ Plugin module found in node_modules');
        } catch (e) {
            console.error('❌ Plugin not found:', e.message);
            process.exit(1);
        }
    "; then
        log_error "Plugin installation check failed"
        return 1
    fi

    log_success "Plugin is installed correctly"
    return 0
}

# Verify plugin components are registered
# Usage: verify_plugin_registered
verify_plugin_registered() {
    log_step "Verifying plugin components are registered..."

    if ! docker exec "$CONTAINER_NAME" node -e "
        const Formio = require('@formio/js').Formio;
        const components = Formio.Components.components;

        const required = ['tusupload', 'uppyupload'];
        const missing = required.filter(c => !components[c]);

        if (missing.length > 0) {
            console.error('❌ Missing components:', missing.join(', '));
            process.exit(1);
        }

        console.log('✅ All plugin components registered:', required.join(', '));
    "; then
        log_error "Plugin registration check failed"
        return 1
    fi

    log_success "Plugin components are registered"
    return 0
}

# ───────────────────────────────────────────────────────────────
#  MongoDB Utilities
# ───────────────────────────────────────────────────────────────

# Check MongoDB connection
# Usage: check_mongodb
check_mongodb() {
    log_step "Checking MongoDB connection..."

    if ! docker exec "$MONGO_CONTAINER" mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        log_error "MongoDB connection failed"
        return 1
    fi

    log_success "MongoDB is connected"
    return 0
}

# ───────────────────────────────────────────────────────────────
#  Redis Utilities
# ───────────────────────────────────────────────────────────────

# Check Redis connection
# Usage: check_redis
check_redis() {
    log_step "Checking Redis connection..."

    if ! docker exec "$REDIS_CONTAINER" redis-cli ping >/dev/null 2>&1; then
        log_error "Redis connection failed"
        return 1
    fi

    log_success "Redis is connected"
    return 0
}

# ───────────────────────────────────────────────────────────────
#  Cleanup Utilities
# ───────────────────────────────────────────────────────────────

# Show container logs
# Usage: show_logs "container-name" [tail_lines]
show_logs() {
    local container=$1
    local tail_lines=${2:-50}

    log_info "Last $tail_lines lines from $container:"
    docker logs "$container" --tail "$tail_lines" 2>&1 || log_warning "No logs available"
}

# Cleanup failed containers
# Usage: cleanup_failed_containers
cleanup_failed_containers() {
    log_step "Cleaning up failed containers..."

    # shellcheck disable=SC2046
    docker rm -f $(docker ps -a -q -f status=exited -f name=formio-custom) 2>/dev/null || true

    log_success "Cleanup complete"
}

# ═══════════════════════════════════════════════════════════════
#  End of Utility Functions
# ═══════════════════════════════════════════════════════════════
