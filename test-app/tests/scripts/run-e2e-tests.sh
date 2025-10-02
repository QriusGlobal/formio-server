#!/bin/bash

# E2E Test Runner Script for Form.io File Upload Module
# Usage: ./run-e2e-tests.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_SUITE="all"
HEADED=false
DEBUG=false
REPORT=false
BROWSERS="chromium"
PARALLEL=true

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --suite)
      TEST_SUITE="$2"
      shift 2
      ;;
    --headed)
      HEADED=true
      shift
      ;;
    --debug)
      DEBUG=true
      shift
      ;;
    --report)
      REPORT=true
      shift
      ;;
    --browsers)
      BROWSERS="$2"
      shift 2
      ;;
    --no-parallel)
      PARALLEL=false
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --suite [all|tus|uppy|submission|storage|network]  Test suite to run"
      echo "  --headed                                            Run tests in headed mode"
      echo "  --debug                                             Run tests in debug mode"
      echo "  --report                                            Generate and open HTML report"
      echo "  --browsers [chromium|firefox|webkit|all]           Browsers to test"
      echo "  --no-parallel                                       Disable parallel execution"
      echo "  --help                                              Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 Form.io File Upload E2E Test Runner${NC}"
echo "======================================="

# Step 1: Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js is not installed${NC}"
  exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Docker is not installed${NC}"
  exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
  echo -e "${RED}❌ Docker is not running${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"

# Step 2: Build the module
echo -e "${YELLOW}🔨 Building @formio/file-upload module...${NC}"
cd ../packages/formio-file-upload

if [ ! -d "node_modules" ]; then
  npm install
fi

npm run build
echo -e "${GREEN}✅ Module built successfully${NC}"

# Step 3: Start Docker infrastructure
echo -e "${YELLOW}🐳 Starting Docker test infrastructure...${NC}"
cd ../..

# Stop any existing containers
docker-compose -f docker-compose.test.yml down 2>/dev/null || true

# Start fresh containers
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be healthy
echo "Waiting for services to be ready..."
MAX_WAIT=60
WAIT_COUNT=0

while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
  if docker-compose -f docker-compose.test.yml ps | grep -q "healthy"; then
    break
  fi
  sleep 2
  WAIT_COUNT=$((WAIT_COUNT + 2))
  echo -n "."
done

echo ""

if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
  echo -e "${RED}❌ Services failed to start within timeout${NC}"
  docker-compose -f docker-compose.test.yml logs
  exit 1
fi

echo -e "${GREEN}✅ Docker infrastructure ready${NC}"

# Step 4: Install test dependencies
echo -e "${YELLOW}📦 Installing test dependencies...${NC}"
cd test-app

if [ ! -d "node_modules" ]; then
  npm install
fi

# Install Playwright browsers if needed
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
  npx playwright install --with-deps
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 5: Run tests
echo -e "${YELLOW}🧪 Running E2E tests...${NC}"

# Build test command
TEST_CMD="npx playwright test"

# Add test suite filter
case $TEST_SUITE in
  tus)
    TEST_CMD="$TEST_CMD tests/e2e/formio-module/formio-tus-upload.spec.ts"
    ;;
  uppy)
    TEST_CMD="$TEST_CMD tests/e2e/formio-module/formio-uppy-upload.spec.ts"
    ;;
  submission)
    TEST_CMD="$TEST_CMD tests/e2e/formio-module/formio-submission.spec.ts"
    ;;
  storage)
    TEST_CMD="$TEST_CMD tests/e2e/formio-module/server-storage.spec.ts"
    ;;
  network)
    TEST_CMD="$TEST_CMD tests/e2e/formio-module/network-resilience.spec.ts"
    ;;
  all)
    TEST_CMD="$TEST_CMD tests/e2e/formio-module"
    ;;
esac

# Add browser selection
if [ "$BROWSERS" = "all" ]; then
  # Run on all browsers
  TEST_CMD="$TEST_CMD --project=chromium --project=firefox --project=webkit"
else
  TEST_CMD="$TEST_CMD --project=$BROWSERS"
fi

# Add mode flags
if [ "$HEADED" = true ]; then
  TEST_CMD="$TEST_CMD --headed"
fi

if [ "$DEBUG" = true ]; then
  TEST_CMD="$TEST_CMD --debug"
fi

if [ "$PARALLEL" = false ]; then
  TEST_CMD="$TEST_CMD --workers=1"
fi

# Run the tests
echo "Running: $TEST_CMD"
eval $TEST_CMD

TEST_EXIT_CODE=$?

# Step 6: Generate report if requested
if [ "$REPORT" = true ] || [ $TEST_EXIT_CODE -ne 0 ]; then
  echo -e "${YELLOW}📊 Generating test report...${NC}"
  npx playwright show-report
fi

# Step 7: Cleanup (optional)
if [ "$CLEANUP" = true ]; then
  echo -e "${YELLOW}🧹 Cleaning up...${NC}"
  docker-compose -f docker-compose.test.yml down
  echo -e "${GREEN}✅ Cleanup complete${NC}"
fi

# Final status
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✨ All tests passed successfully!${NC}"
else
  echo -e "${RED}❌ Some tests failed. Check the report for details.${NC}"
fi

exit $TEST_EXIT_CODE