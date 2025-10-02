# Form.io Bootstrap Scripts

## Overview

Automation scripts for programmatic Form.io setup and management.

---

## Bootstrap Script

### formio-bootstrap.sh

Complete Form.io environment setup with health checks and validation.

```bash
#!/bin/bash
set -euo pipefail

# Form.io Bootstrap Script
# Usage: ./formio-bootstrap.sh [environment]
# Environments: development, test, production

ENVIRONMENT="${1:-development}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
ENV_FILE="${SCRIPT_DIR}/../.env.${ENVIRONMENT}"
if [ -f "$ENV_FILE" ]; then
    log_info "Loading environment from $ENV_FILE"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    log_error "Environment file not found: $ENV_FILE"
    exit 1
fi

# Configuration
FORMIO_URL="${FORMIO_URL:-http://localhost:3001}"
ROOT_EMAIL="${ROOT_EMAIL:-admin@example.com}"
ROOT_PASSWORD="${ROOT_PASSWORD:-ChangeMe123!}"
MAX_RETRIES=30
RETRY_DELAY=2

# Wait for service to be healthy
wait_for_service() {
    local url=$1
    local service_name=$2
    local retries=0

    log_info "Waiting for $service_name at $url..."

    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            log_info "$service_name is ready!"
            return 0
        fi
        retries=$((retries + 1))
        log_warn "Waiting for $service_name... ($retries/$MAX_RETRIES)"
        sleep $RETRY_DELAY
    done

    log_error "$service_name failed to start after $MAX_RETRIES attempts"
    return 1
}

# Check if admin user exists
check_admin_exists() {
    log_info "Checking if admin user exists..."

    local response=$(curl -s -X POST "$FORMIO_URL/user/login" \
        -H "Content-Type: application/json" \
        -d "{\"data\":{\"email\":\"$ROOT_EMAIL\",\"password\":\"$ROOT_PASSWORD\"}}")

    if echo "$response" | jq -e '.token' > /dev/null 2>&1; then
        log_info "Admin user already exists"
        echo "$response" | jq -r '.token'
        return 0
    else
        log_warn "Admin user does not exist"
        return 1
    fi
}

# Create admin user
create_admin_user() {
    log_info "Creating admin user: $ROOT_EMAIL"

    local response=$(curl -s -X POST "$FORMIO_URL/user/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"data\": {
                \"email\": \"$ROOT_EMAIL\",
                \"password\": \"$ROOT_PASSWORD\",
                \"role\": \"admin\"
            }
        }")

    if echo "$response" | jq -e '._id' > /dev/null 2>&1; then
        log_info "Admin user created successfully"
        USER_ID=$(echo "$response" | jq -r '._id')
        log_info "User ID: $USER_ID"
        return 0
    else
        log_error "Failed to create admin user"
        echo "$response" | jq '.'
        return 1
    fi
}

# Get JWT token
get_jwt_token() {
    log_info "Authenticating as $ROOT_EMAIL..."

    local response=$(curl -s -X POST "$FORMIO_URL/user/login" \
        -H "Content-Type: application/json" \
        -d "{\"data\":{\"email\":\"$ROOT_EMAIL\",\"password\":\"$ROOT_PASSWORD\"}}")

    if echo "$response" | jq -e '.token' > /dev/null 2>&1; then
        JWT_TOKEN=$(echo "$response" | jq -r '.token')
        log_info "Authentication successful"
        echo "$JWT_TOKEN"
        return 0
    else
        log_error "Authentication failed"
        echo "$response" | jq '.'
        return 1
    fi
}

# Create project
create_project() {
    local token=$1
    local project_name="${PROJECT_NAME:-testproject}"
    local project_title="${PROJECT_TITLE:-Test Project}"

    log_info "Creating project: $project_title"

    local response=$(curl -s -X POST "$FORMIO_URL/project" \
        -H "Content-Type: application/json" \
        -H "x-jwt-token: $token" \
        -d "{
            \"title\": \"$project_title\",
            \"name\": \"$project_name\",
            \"description\": \"Automated project setup\"
        }")

    if echo "$response" | jq -e '._id' > /dev/null 2>&1; then
        PROJECT_ID=$(echo "$response" | jq -r '._id')
        log_info "Project created: $PROJECT_ID"
        echo "$PROJECT_ID"
        return 0
    else
        log_error "Failed to create project"
        echo "$response" | jq '.'
        return 1
    fi
}

# Create file upload form
create_file_upload_form() {
    local token=$1
    local form_name="${FORM_NAME:-fileupload}"
    local tus_url="${TUS_UPLOAD_URL:-http://localhost:1080/files/}"

    log_info "Creating file upload form: $form_name"

    local response=$(curl -s -X POST "$FORMIO_URL/form" \
        -H "Content-Type: application/json" \
        -H "x-jwt-token: $token" \
        -d "{
            \"title\": \"File Upload Form\",
            \"name\": \"$form_name\",
            \"path\": \"$form_name\",
            \"type\": \"form\",
            \"display\": \"form\",
            \"components\": [
                {
                    \"type\": \"file\",
                    \"key\": \"attachment\",
                    \"label\": \"Upload File\",
                    \"storage\": \"url\",
                    \"url\": \"$tus_url\",
                    \"options\": \"{\\\"chunkSize\\\":262144,\\\"retryDelays\\\":[0,1000,3000,5000]}\",
                    \"input\": true,
                    \"fileMaxSize\": \"50MB\",
                    \"multiple\": true
                },
                {
                    \"type\": \"button\",
                    \"action\": \"submit\",
                    \"label\": \"Submit\",
                    \"theme\": \"primary\"
                }
            ]
        }")

    if echo "$response" | jq -e '._id' > /dev/null 2>&1; then
        FORM_ID=$(echo "$response" | jq -r '._id')
        log_info "Form created: $FORM_ID"
        echo "$FORM_ID"
        return 0
    else
        log_error "Failed to create form"
        echo "$response" | jq '.'
        return 1
    fi
}

# Save environment variables
save_env_vars() {
    local env_file="${SCRIPT_DIR}/../.env.${ENVIRONMENT}.generated"

    log_info "Saving generated environment to $env_file"

    cat > "$env_file" <<EOF
# Generated by formio-bootstrap.sh on $(date)
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# Form.io Server
FORMIO_URL=$FORMIO_URL
FORMIO_PROJECT_URL=$FORMIO_URL

# Authentication (WARNING: These credentials are for ${ENVIRONMENT} only!)
ROOT_EMAIL=$ROOT_EMAIL
ROOT_PASSWORD=$ROOT_PASSWORD
FORMIO_JWT_TOKEN=$JWT_TOKEN

# Project & Form IDs
FORMIO_PROJECT_ID=${PROJECT_ID:-}
FORMIO_FORM_ID=${FORM_ID:-}
FORMIO_FORM_PATH=${FORM_NAME:-fileupload}

# File Upload
TUS_UPLOAD_URL=${TUS_UPLOAD_URL:-http://localhost:1080/files/}

# Generated at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
EOF

    log_info "Environment saved successfully"
    log_warn "Remember to add .env.*.generated to .gitignore!"
}

# Health check summary
health_check_summary() {
    log_info "=== Health Check Summary ==="

    # Form.io Server
    if curl -sf "$FORMIO_URL/health" > /dev/null 2>&1; then
        log_info "✓ Form.io Server: HEALTHY"
    else
        log_error "✗ Form.io Server: UNHEALTHY"
    fi

    # Admin Authentication
    if [ -n "${JWT_TOKEN:-}" ]; then
        log_info "✓ Admin Auth: AUTHENTICATED"
    else
        log_error "✗ Admin Auth: FAILED"
    fi

    # Project Created
    if [ -n "${PROJECT_ID:-}" ]; then
        log_info "✓ Project: CREATED ($PROJECT_ID)"
    else
        log_warn "○ Project: NOT CREATED"
    fi

    # Form Created
    if [ -n "${FORM_ID:-}" ]; then
        log_info "✓ Form: CREATED ($FORM_ID)"
    else
        log_warn "○ Form: NOT CREATED"
    fi
}

# Main execution
main() {
    log_info "Starting Form.io bootstrap for environment: $ENVIRONMENT"
    log_info "Target URL: $FORMIO_URL"

    # Wait for Form.io to be ready
    wait_for_service "$FORMIO_URL/health" "Form.io Server" || exit 1

    # Check if admin exists or create
    if ! JWT_TOKEN=$(check_admin_exists); then
        create_admin_user || exit 1
        JWT_TOKEN=$(get_jwt_token) || exit 1
    fi

    # Create project (optional)
    if [ "${CREATE_PROJECT:-false}" = "true" ]; then
        PROJECT_ID=$(create_project "$JWT_TOKEN") || log_warn "Project creation failed"
    fi

    # Create form (optional)
    if [ "${CREATE_FORM:-true}" = "true" ]; then
        FORM_ID=$(create_file_upload_form "$JWT_TOKEN") || log_warn "Form creation failed"
    fi

    # Save environment
    save_env_vars

    # Summary
    health_check_summary

    log_info "Bootstrap completed successfully!"
    log_info "JWT Token: $JWT_TOKEN"
    log_info "Use 'source .env.${ENVIRONMENT}.generated' to load variables"
}

# Run main function
main "$@"
```

---

## Token Refresh Script

### get-fresh-token.sh

Authenticate and get a fresh JWT token.

```bash
#!/bin/bash
set -euo pipefail

# Get Fresh JWT Token
# Usage: ./get-fresh-token.sh [email] [password]

FORMIO_URL="${FORMIO_URL:-http://localhost:3001}"
EMAIL="${1:-${ROOT_EMAIL:-admin@example.com}}"
PASSWORD="${2:-${ROOT_PASSWORD:-}}"

if [ -z "$PASSWORD" ]; then
    echo "Error: Password required" >&2
    echo "Usage: ./get-fresh-token.sh [email] [password]" >&2
    echo "Or set ROOT_PASSWORD environment variable" >&2
    exit 1
fi

# Login and extract token
response=$(curl -s -X POST "$FORMIO_URL/user/login" \
    -H "Content-Type: application/json" \
    -d "{\"data\":{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}}")

# Check if token exists
if ! echo "$response" | jq -e '.token' > /dev/null 2>&1; then
    echo "Error: Login failed" >&2
    echo "$response" | jq '.' >&2
    exit 1
fi

# Extract and print token
token=$(echo "$response" | jq -r '.token')
echo "$token"

# Optionally save to file
if [ "${SAVE_TOKEN:-false}" = "true" ]; then
    echo "FORMIO_JWT_TOKEN=$token" > .token
    echo "Token saved to .token file" >&2
fi
```

---

## Form Creation Script

### create-form.sh

Create a Form.io form from JSON schema.

```bash
#!/bin/bash
set -euo pipefail

# Create Form from JSON Schema
# Usage: ./create-form.sh <form-schema.json> [token]

FORMIO_URL="${FORMIO_URL:-http://localhost:3001}"
FORM_SCHEMA="$1"
TOKEN="${2:-${FORMIO_JWT_TOKEN:-}}"

if [ ! -f "$FORM_SCHEMA" ]; then
    echo "Error: Form schema file not found: $FORM_SCHEMA" >&2
    exit 1
fi

if [ -z "$TOKEN" ]; then
    echo "Error: JWT token required" >&2
    echo "Usage: ./create-form.sh <form-schema.json> [token]" >&2
    echo "Or set FORMIO_JWT_TOKEN environment variable" >&2
    exit 1
fi

# Validate JSON
if ! jq empty "$FORM_SCHEMA" 2>/dev/null; then
    echo "Error: Invalid JSON in $FORM_SCHEMA" >&2
    exit 1
fi

# Create form
response=$(curl -s -X POST "$FORMIO_URL/form" \
    -H "Content-Type: application/json" \
    -H "x-jwt-token: $TOKEN" \
    -d "@$FORM_SCHEMA")

# Check if successful
if echo "$response" | jq -e '._id' > /dev/null 2>&1; then
    form_id=$(echo "$response" | jq -r '._id')
    form_name=$(echo "$response" | jq -r '.name')
    echo "✓ Form created successfully"
    echo "  ID: $form_id"
    echo "  Name: $form_name"
    echo "  Path: /$form_name"
    echo "$form_id"
else
    echo "✗ Form creation failed" >&2
    echo "$response" | jq '.' >&2
    exit 1
fi
```

---

## Cleanup Script

### cleanup-test-data.sh

Remove test data and reset Form.io environment.

```bash
#!/bin/bash
set -euo pipefail

# Cleanup Test Data
# Usage: ./cleanup-test-data.sh [token]

FORMIO_URL="${FORMIO_URL:-http://localhost:3001}"
TOKEN="${1:-${FORMIO_JWT_TOKEN:-}}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ -z "$TOKEN" ]; then
    log_error "JWT token required"
    echo "Usage: ./cleanup-test-data.sh [token]" >&2
    exit 1
fi

# Confirmation
read -p "⚠️  This will delete all forms and submissions. Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    log_info "Cleanup cancelled"
    exit 0
fi

# Delete all submissions
log_info "Fetching forms..."
forms=$(curl -s "$FORMIO_URL/form" \
    -H "x-jwt-token: $TOKEN" | jq -r '.[] | ._id')

for form_id in $forms; do
    log_info "Deleting submissions for form: $form_id"

    submissions=$(curl -s "$FORMIO_URL/form/$form_id/submission" \
        -H "x-jwt-token: $TOKEN" | jq -r '.[] | ._id')

    for sub_id in $submissions; do
        curl -s -X DELETE "$FORMIO_URL/form/$form_id/submission/$sub_id" \
            -H "x-jwt-token: $TOKEN" > /dev/null
        log_info "  Deleted submission: $sub_id"
    done
done

# Delete all forms
log_info "Deleting forms..."
for form_id in $forms; do
    curl -s -X DELETE "$FORMIO_URL/form/$form_id" \
        -H "x-jwt-token: $TOKEN" > /dev/null
    log_info "Deleted form: $form_id"
done

# Delete all projects
log_info "Fetching projects..."
projects=$(curl -s "$FORMIO_URL/project" \
    -H "x-jwt-token: $TOKEN" | jq -r '.[] | ._id')

for project_id in $projects; do
    curl -s -X DELETE "$FORMIO_URL/project/$project_id" \
        -H "x-jwt-token: $TOKEN" > /dev/null
    log_info "Deleted project: $project_id"
done

log_info "Cleanup completed successfully!"
```

---

## Health Check Script

### health-check.sh

Verify all services are running and healthy.

```bash
#!/bin/bash
set -euo pipefail

# Health Check Script
# Usage: ./health-check.sh

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    local name=$1
    local url=$2
    local expected=${3:-}

    if response=$(curl -sf "$url" 2>&1); then
        if [ -n "$expected" ] && echo "$response" | grep -q "$expected"; then
            echo -e "${GREEN}✓${NC} $name: HEALTHY"
            return 0
        elif [ -z "$expected" ]; then
            echo -e "${GREEN}✓${NC} $name: HEALTHY"
            return 0
        else
            echo -e "${YELLOW}⚠${NC} $name: RESPONDING (unexpected response)"
            return 1
        fi
    else
        echo -e "${RED}✗${NC} $name: UNHEALTHY"
        return 1
    fi
}

echo "=== Service Health Check ==="
echo ""

# Form.io Server
check_service "Form.io Server" "http://localhost:3001/health" "status"

# MongoDB
if docker-compose -f docker-compose.test.yml exec -T mongodb \
    mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} MongoDB: HEALTHY"
else
    echo -e "${RED}✗${NC} MongoDB: UNHEALTHY"
fi

# GCS Emulator
check_service "GCS Emulator" "http://localhost:4443/storage/v1/b"

# TUS Server
check_service "TUS Server" "http://localhost:1080/"

# React Test App
check_service "React Test App" "http://localhost:64849"

echo ""
echo "=== Docker Container Status ==="
docker-compose -f docker-compose.test.yml ps

echo ""
echo "Health check completed!"
```

---

## Installation

### Make Scripts Executable

```bash
chmod +x formio-bootstrap.sh
chmod +x get-fresh-token.sh
chmod +x create-form.sh
chmod +x cleanup-test-data.sh
chmod +x health-check.sh
```

### Usage Examples

```bash
# Bootstrap development environment
./formio-bootstrap.sh development

# Get fresh token
TOKEN=$(./get-fresh-token.sh admin@example.com SecurePass123!)

# Create form from schema
./create-form.sh my-form-schema.json "$TOKEN"

# Health check
./health-check.sh

# Cleanup test data
./cleanup-test-data.sh "$TOKEN"
```

---

## Integration with CI/CD

```yaml
# .github/workflows/e2e-tests.yml
- name: Bootstrap Form.io
  run: |
    chmod +x test-app/tests/setup/*.sh
    ./test-app/tests/setup/formio-bootstrap.sh test
  env:
    FORMIO_URL: http://localhost:3001
    ROOT_EMAIL: ${{ secrets.FORMIO_ADMIN_EMAIL }}
    ROOT_PASSWORD: ${{ secrets.FORMIO_ADMIN_PASSWORD }}

- name: Health Check
  run: ./test-app/tests/setup/health-check.sh
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-02
