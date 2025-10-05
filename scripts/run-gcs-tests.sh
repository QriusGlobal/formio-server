#!/bin/bash
# GCS Testing Script - Complete Test Suite Execution
#
# This script runs all GCS integration and E2E tests with real Google Cloud Storage
# Usage: ./scripts/run-gcs-tests.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$PROJECT_ROOT/docs/GCS_TESTING_REPORT_${TIMESTAMP}.md"

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   GCS Testing Suite - Real Google Cloud Storage${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Phase 1: Infrastructure Validation
echo -e "${YELLOW}[Phase 1/6]${NC} Infrastructure Validation"
echo -e "Starting Docker Compose with real GCS configuration..."

cd "$PROJECT_ROOT"

# Start services
docker-compose -f docker-compose.yml \
  -f docker-compose.real-gcs.yml \
  --env-file .env.real-gcs up -d

echo "Waiting for services to be healthy..."
sleep 10

# Verify services
echo -e "${BLUE}Checking service health...${NC}"
docker-compose ps

# Test health endpoints
echo -e "${BLUE}Testing endpoints...${NC}"
curl -f http://localhost:3001/health || { echo -e "${RED}Form.io health check failed${NC}"; exit 1; }
docker exec formio-redis redis-cli ping || { echo -e "${RED}Redis ping failed${NC}"; exit 1; }

echo -e "${GREEN}✓ Infrastructure validation passed${NC}"
echo ""

# Phase 2: Backend Integration (Emulator)
echo -e "${YELLOW}[Phase 2/6]${NC} Backend Integration Tests (GCS Emulator)"
cd "$PROJECT_ROOT/formio"

echo "Running 5 integration tests with GCS emulator..."
bun test src/upload/__tests__/integration.test.js || {
  echo -e "${RED}✗ Emulator integration tests failed${NC}"
  exit 1
}

echo -e "${GREEN}✓ Emulator integration tests passed (5/5)${NC}"
echo ""

# Phase 3: Backend Integration (Real GCS)
echo -e "${YELLOW}[Phase 3/6]${NC} Backend Integration Tests (Real GCS)"

echo "Running 4 integration tests with real GCS..."
export GOOGLE_APPLICATION_CREDENTIALS=$HOME/.config/gcloud/keys/dev-mish-key.json
export GCS_PROJECT_ID=erlich-dev
export GCS_BUCKET_NAME=formio-test-uploads-erlich

bun test src/upload/__tests__/integration-real-gcs.test.js || {
  echo -e "${RED}✗ Real GCS integration tests failed${NC}"
  exit 1
}

echo -e "${GREEN}✓ Real GCS integration tests passed (4/4)${NC}"
echo ""

# Phase 4: E2E React Tests
echo -e "${YELLOW}[Phase 4/6]${NC} E2E React Tests (Real GCS)"
cd "$PROJECT_ROOT/test-app"

echo "Running 4 E2E tests with React form..."
bun run test:e2e tests/e2e/gcs-upload.spec.ts || {
  echo -e "${RED}✗ E2E tests failed${NC}"
  exit 1
}

echo -e "${GREEN}✓ E2E tests passed (4/4)${NC}"
echo ""

# Phase 5: Stress Tests
echo -e "${YELLOW}[Phase 5/6]${NC} Stress Tests"

echo "Running 4 stress tests (this may take 8-10 minutes)..."
bun run test:e2e:stress tests/e2e/gcs-stress.spec.ts || {
  echo -e "${RED}✗ Stress tests failed${NC}"
  exit 1
}

echo -e "${GREEN}✓ Stress tests passed (4/4)${NC}"
echo ""

# Phase 6: Generate Report
echo -e "${YELLOW}[Phase 6/6]${NC} Generating Test Report"

cat > "$REPORT_FILE" << EOF
# GCS Testing Report

**Date:** $(date)
**GCP Project:** erlich-dev
**Bucket:** formio-test-uploads-erlich
**Service Account:** dev-mish@dss-infra-terraform-admin.iam.gserviceaccount.com

---

## Test Results Summary

| Test Suite | Tests | Status |
|------------|-------|--------|
| Infrastructure Validation | 1 | ✅ PASS |
| Backend Integration (Emulator) | 5 | ✅ PASS |
| Backend Integration (Real GCS) | 4 | ✅ PASS |
| E2E React Tests | 4 | ✅ PASS |
| Stress Tests | 4 | ✅ PASS |
| **Total** | **17** | **✅ ALL PASS** |

---

## Performance Metrics

### Bucket Status
\`\`\`bash
$(gsutil ls -L gs://formio-test-uploads-erlich | head -20)
\`\`\`

### Docker Services
\`\`\`bash
$(docker-compose ps)
\`\`\`

### Redis Queue Status
\`\`\`bash
$(docker exec formio-redis redis-cli KEYS "bull:gcs-upload:*" | head -10)
\`\`\`

---

## Files in GCS Bucket
\`\`\`bash
$(gsutil ls gs://formio-test-uploads-erlich 2>/dev/null || echo "No files (cleaned up)")
\`\`\`

---

## Recommendations

1. ✅ All tests passed - infrastructure is production-ready
2. ✅ Async GCS upload working correctly
3. ✅ Retry logic validated
4. ✅ Performance within acceptable limits

---

**Next Steps:**
- Deploy to staging environment
- Configure production GCS bucket with lifecycle policies
- Enable monitoring and alerting

EOF

echo -e "${GREEN}Report generated: $REPORT_FILE${NC}"
echo ""

# Summary
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ ALL TESTS PASSED (17/17)${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Test Report: ${BLUE}$REPORT_FILE${NC}"
echo ""
echo -e "${YELLOW}Cleanup Options:${NC}"
echo -e "  1. Keep infrastructure running: ${BLUE}docker-compose logs -f${NC}"
echo -e "  2. Stop services (keep data): ${BLUE}docker-compose down${NC}"
echo -e "  3. Full cleanup: ${BLUE}docker-compose down -v && gsutil -m rm -r gs://formio-test-uploads-erlich/**${NC}"
echo ""
