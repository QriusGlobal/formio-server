#!/bin/bash
set -euo pipefail

# Form.io File Upload Feature Deployment Script
# Usage: ./scripts/deploy-upload-feature.sh [staging|production]

ENVIRONMENT="${1:-staging}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Validate environment
validate_environment() {
    log_info "Validating deployment environment: ${ENVIRONMENT}"

    if [[ ! "${ENVIRONMENT}" =~ ^(staging|production)$ ]]; then
        log_error "Invalid environment: ${ENVIRONMENT}"
        log_info "Usage: $0 [staging|production]"
        exit 1
    fi

    log_success "Environment validated: ${ENVIRONMENT}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check for required commands
    local required_commands=("docker" "docker-compose" "npm" "node" "git" "jq")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "Required command not found: $cmd"
            exit 1
        fi
    done

    # Check Docker daemon
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi

    # Check Node.js version
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $node_version -lt 18 ]]; then
        log_error "Node.js version 18 or higher required (found: $(node --version))"
        exit 1
    fi

    log_success "All prerequisites met"
}

# Run tests
run_tests() {
    log_info "Running test suite..."

    cd "${PROJECT_ROOT}"

    # Unit tests
    log_info "Running unit tests..."
    make upload-test-unit || {
        log_error "Unit tests failed"
        exit 1
    }

    # Integration tests (if services are running)
    if make verify-services &> /dev/null; then
        log_info "Running integration tests..."
        make upload-test-integration || {
            log_warning "Integration tests failed (continuing anyway)"
        }
    else
        log_warning "Services not running, skipping integration tests"
    fi

    log_success "Tests completed"
}

# Build packages
build_packages() {
    log_info "Building all packages..."

    cd "${PROJECT_ROOT}"

    # Build in dependency order
    local packages=("formio-core" "formio-react" "formio" "test-app")

    for package in "${packages[@]}"; do
        if [[ -d "${package}" ]]; then
            log_info "Building ${package}..."
            cd "${PROJECT_ROOT}/${package}"

            # Install dependencies
            npm ci --prefer-offline --no-audit

            # Run build (if build script exists)
            if npm run | grep -q "build"; then
                npm run build
            fi

            log_success "${package} built"
        else
            log_warning "Package not found: ${package}"
        fi
    done

    log_success "All packages built"
}

# Build Docker images
build_docker_images() {
    log_info "Building Docker images..."

    cd "${PROJECT_ROOT}"

    # Build Form.io server image
    log_info "Building Form.io server image..."
    docker build \
        --tag "formio-server:${ENVIRONMENT}" \
        --tag "formio-server:latest" \
        --target production \
        --build-arg NODE_ENV="${ENVIRONMENT}" \
        --file formio/Dockerfile \
        formio/

    # Build processor image (if exists)
    if [[ -f "formio/Dockerfile.processor" ]]; then
        log_info "Building upload processor image..."
        docker build \
            --tag "formio-processor:${ENVIRONMENT}" \
            --tag "formio-processor:latest" \
            --target production \
            --file formio/Dockerfile.processor \
            formio/
    fi

    # Build webhook handler image (if exists)
    if [[ -f "formio/Dockerfile.webhook" ]]; then
        log_info "Building webhook handler image..."
        docker build \
            --tag "formio-webhook:${ENVIRONMENT}" \
            --tag "formio-webhook:latest" \
            --target production \
            --file formio/Dockerfile.webhook \
            formio/
    fi

    log_success "Docker images built"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."

    cd "${PROJECT_ROOT}/formio"

    # Check if migrations exist
    if [[ -d "migrations" ]]; then
        # Set up environment variables for migrations
        export MONGO="${MONGO:-mongodb://localhost:27017/formioapp}"

        # Run migrations
        if npm run | grep -q "migrate"; then
            npm run migrate
            log_success "Migrations completed"
        else
            log_warning "No migration script found"
        fi
    else
        log_warning "No migrations directory found"
    fi
}

# Update packages
update_packages() {
    log_info "Updating package dependencies..."

    cd "${PROJECT_ROOT}"

    # Update security patches only
    npm audit fix --only=prod || log_warning "Some audit issues remain"

    log_success "Packages updated"
}

# Deploy to staging
deploy_staging() {
    log_info "Deploying to staging environment..."

    cd "${PROJECT_ROOT}"

    # Stop existing services
    log_info "Stopping existing services..."
    docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml down

    # Start services with new images
    log_info "Starting services..."
    docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml up -d

    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 15

    # Initialize GCS emulator
    log_info "Initializing GCS emulator..."
    ./scripts/init-gcs-local.sh

    # Verify services
    log_info "Verifying service health..."
    make upload-verify || {
        log_error "Service health check failed"
        docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml logs
        exit 1
    }

    log_success "Staging deployment completed"
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production environment..."

    # Production deployment requires manual confirmation
    log_warning "This will deploy to PRODUCTION!"
    read -p "Type 'DEPLOY' to confirm: " confirmation

    if [[ "${confirmation}" != "DEPLOY" ]]; then
        log_error "Deployment cancelled"
        exit 1
    fi

    # Production-specific steps
    cd "${PROJECT_ROOT}"

    # Tag images with production labels
    log_info "Tagging production images..."
    docker tag "formio-server:${ENVIRONMENT}" "formio-server:production-$(date +%Y%m%d-%H%M%S)"

    # Push to container registry (if configured)
    if [[ -n "${DOCKER_REGISTRY:-}" ]]; then
        log_info "Pushing images to registry..."
        docker push "${DOCKER_REGISTRY}/formio-server:${ENVIRONMENT}"
        docker push "${DOCKER_REGISTRY}/formio-server:production-$(date +%Y%m%d-%H%M%S)"
    fi

    # Deploy using production configuration
    log_warning "Production deployment configuration not yet implemented"
    log_info "Manual production deployment required"

    log_success "Production deployment preparation completed"
}

# Health check
health_check() {
    log_info "Running post-deployment health checks..."

    local max_attempts=30
    local attempt=0

    while [[ $attempt -lt $max_attempts ]]; do
        if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
            log_success "Form.io server is healthy"

            # Check file upload capability
            if curl -sf http://localhost:1080/ > /dev/null 2>&1; then
                log_success "TUS server is healthy"
            else
                log_warning "TUS server health check failed"
            fi

            # Check GCS emulator
            if curl -sf http://localhost:4443/storage/v1/b > /dev/null 2>&1; then
                log_success "GCS emulator is healthy"
            else
                log_warning "GCS emulator health check failed"
            fi

            return 0
        fi

        attempt=$((attempt + 1))
        sleep 2
    done

    log_error "Health check failed after ${max_attempts} attempts"
    return 1
}

# Rollback on failure
rollback() {
    log_error "Deployment failed, initiating rollback..."

    cd "${PROJECT_ROOT}"

    # Stop new services
    docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml down

    # Restore previous images (if available)
    # This would need to be implemented with proper image tagging

    log_warning "Rollback completed. Manual intervention may be required."
}

# Generate deployment report
generate_report() {
    log_info "Generating deployment report..."

    local report_file="${PROJECT_ROOT}/deployment-report-$(date +%Y%m%d-%H%M%S).txt"

    cat > "${report_file}" << EOF
Form.io File Upload Feature Deployment Report
Generated: $(date)
Environment: ${ENVIRONMENT}
Deployed by: ${USER}
Git commit: $(git rev-parse HEAD)

Services Status:
$(docker-compose -f docker-compose.local.yml -f docker-compose.upload.yml ps)

Docker Images:
$(docker images | grep formio)

Package Versions:
formio-core: $(cd formio-core && node -p "require('./package.json').version")
formio-react: $(cd formio-react && node -p "require('./package.json').version")
formio: $(cd formio && node -p "require('./package.json').version")

Environment Variables:
$(docker-compose -f docker-compose.local.yml exec -T formio-server env | grep -E '^FORMIO_|^MONGO|^PORT')
EOF

    log_success "Deployment report saved to: ${report_file}"
}

# Main deployment flow
main() {
    log_info "Starting Form.io File Upload Feature Deployment"
    log_info "Environment: ${ENVIRONMENT}"

    # Set up error handling
    trap rollback ERR

    # Run deployment steps
    validate_environment
    check_prerequisites
    run_tests
    build_packages
    build_docker_images
    update_packages

    # Deploy based on environment
    case "${ENVIRONMENT}" in
        staging)
            deploy_staging
            ;;
        production)
            deploy_production
            ;;
    esac

    # Run migrations
    run_migrations

    # Verify deployment
    if health_check; then
        generate_report
        log_success "Deployment completed successfully! 🎉"
    else
        log_error "Deployment health check failed"
        rollback
        exit 1
    fi
}

# Run main deployment
main "$@"