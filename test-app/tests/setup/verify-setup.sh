#!/bin/bash
# verify-setup.sh - Quick verification of Form.io bootstrap setup
#
# Run this to verify all bootstrap components are correctly installed

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Form.io Bootstrap Setup Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check files exist
echo "📁 Checking files..."

FILES=(
  "formio-bootstrap.sh"
  "formio-api.ts"
  "test-bootstrap.ts"
  "example-usage.ts"
  "README.md"
)

all_files_exist=true
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✓${NC} $file"
  else
    echo -e "  ${RED}✗${NC} $file (missing)"
    all_files_exist=false
  fi
done

# Check .env.test.example
if [ -f "../../.env.test.example" ]; then
  echo -e "  ${GREEN}✓${NC} .env.test.example"
else
  echo -e "  ${RED}✗${NC} .env.test.example (missing)"
  all_files_exist=false
fi

echo ""

# Check bootstrap script is executable
echo "🔐 Checking permissions..."
if [ -x "formio-bootstrap.sh" ]; then
  echo -e "  ${GREEN}✓${NC} formio-bootstrap.sh is executable"
else
  echo -e "  ${RED}✗${NC} formio-bootstrap.sh is not executable"
  echo "     Fix with: chmod +x formio-bootstrap.sh"
fi

echo ""

# Check dependencies
echo "📦 Checking dependencies..."

if command -v curl &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} curl installed"
else
  echo -e "  ${RED}✗${NC} curl not found (required by bootstrap script)"
fi

if command -v jq &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} jq installed"
else
  echo -e "  ${RED}✗${NC} jq not found (required by bootstrap script)"
  echo "     Install with: brew install jq"
fi

if command -v npx &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} npx installed"
else
  echo -e "  ${YELLOW}⚠${NC} npx not found (needed for test scripts)"
fi

echo ""

# Check Node.js dependencies
echo "📚 Checking Node.js dependencies..."

cd ../..

if npm list axios &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} axios installed"
else
  echo -e "  ${YELLOW}⚠${NC} axios not found"
  echo "     Install with: npm install axios"
fi

if npm list dotenv &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} dotenv installed"
else
  echo -e "  ${YELLOW}⚠${NC} dotenv not found"
  echo "     Install with: npm install dotenv"
fi

if npm list typescript &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} typescript installed"
else
  echo -e "  ${YELLOW}⚠${NC} typescript not found"
fi

if npm list tsx &> /dev/null; then
  echo -e "  ${GREEN}✓${NC} tsx installed"
else
  echo -e "  ${YELLOW}⚠${NC} tsx not found (needed for test scripts)"
  echo "     Install with: npm install -D tsx"
fi

cd - > /dev/null

echo ""

# Check integration
echo "🔗 Checking Playwright integration..."

if grep -q "bootstrapFormio" "../../tests/utils/global-setup.ts" 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Bootstrap integrated into global-setup.ts"
else
  echo -e "  ${YELLOW}⚠${NC} Bootstrap not found in global-setup.ts"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if $all_files_exist; then
  echo -e "${GREEN}✅ All files present${NC}"
else
  echo -e "${RED}❌ Some files are missing${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "   1. Install missing dependencies if any"
echo "   2. Test bootstrap: bash formio-bootstrap.sh"
echo "   3. Verify with: npx tsx test-bootstrap.ts"
echo "   4. Run E2E tests: npm run test:e2e"
echo ""
echo "📖 Documentation: cat README.md"
echo ""
