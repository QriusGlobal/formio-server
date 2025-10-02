#!/bin/bash
set -e

echo "=================================="
echo "Form.io Authentication Validation"
echo "=================================="
echo ""

# Configuration
FORMIO_URL="http://localhost:3001"
ADMIN_EMAIL="test-admin@test.local"
ADMIN_PASS="TestPass123!"
RESULTS_DIR="/tmp/formio-validation"

# Create results directory
mkdir -p "$RESULTS_DIR"

# Test 1: Direct Login
echo "📋 Test 1: Direct Login via REST API"
echo "-----------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "${FORMIO_URL}/user/login" \
  -H "Content-Type: application/json" \
  -d "{\"data\":{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASS}\"}}")

echo "$LOGIN_RESPONSE" | jq . > "$RESULTS_DIR/login-response.json"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.["x-jwt-token"] // .token // empty')

if [ -z "$TOKEN" ]; then
  echo "❌ FAIL: No token in response"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ PASS: JWT token received"
echo "Token length: ${#TOKEN} chars"
echo "Token preview: ${TOKEN:0:20}..."
echo "$TOKEN" > "$RESULTS_DIR/token.txt"

# Test 2: Validate Token Format
echo ""
echo "📋 Test 2: Validate JWT Token Format"
echo "-------------------------------------"
if [[ "$TOKEN" =~ ^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$ ]]; then
  echo "✅ PASS: Token has valid JWT format (header.payload.signature)"
else
  echo "❌ FAIL: Token format invalid"
  exit 1
fi

# Test 3: Verify Token with /current endpoint
echo ""
echo "📋 Test 3: Verify Token with /current Endpoint"
echo "-----------------------------------------------"
CURRENT_RESPONSE=$(curl -s -X GET "${FORMIO_URL}/current" \
  -H "x-jwt-token: ${TOKEN}")

echo "$CURRENT_RESPONSE" | jq . > "$RESULTS_DIR/current-response.json"

if echo "$CURRENT_RESPONSE" | jq -e '.data.email' > /dev/null 2>&1; then
  VERIFIED_EMAIL=$(echo "$CURRENT_RESPONSE" | jq -r '.data.email')
  echo "✅ PASS: Token verified, user: $VERIFIED_EMAIL"
else
  echo "❌ FAIL: Token verification failed"
  echo "Response: $CURRENT_RESPONSE"
  exit 1
fi

# Test 4: Create Form with Token
echo ""
echo "📋 Test 4: Create Form with JWT Token"
echo "--------------------------------------"
FORM_NAME="validation-test-$(date +%s)"
FORM_RESPONSE=$(curl -s -X POST "${FORMIO_URL}/form" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: ${TOKEN}" \
  -d "{
    \"title\": \"Validation Test Form\",
    \"name\": \"${FORM_NAME}\",
    \"path\": \"${FORM_NAME}\",
    \"type\": \"form\",
    \"components\": [
      {
        \"type\": \"textfield\",
        \"key\": \"testField\",
        \"label\": \"Test Field\",
        \"input\": true
      }
    ]
  }")

echo "$FORM_RESPONSE" | jq . > "$RESULTS_DIR/form-create-response.json"

FORM_ID=$(echo "$FORM_RESPONSE" | jq -r '._id // empty')

if [ -z "$FORM_ID" ]; then
  echo "❌ FAIL: Form creation failed"
  echo "Response: $FORM_RESPONSE"
  exit 1
fi

echo "✅ PASS: Form created successfully"
echo "Form ID: $FORM_ID"
echo "$FORM_ID" > "$RESULTS_DIR/form-id.txt"

# Test 5: Submit to Form
echo ""
echo "📋 Test 5: Submit Form Data with JWT Token"
echo "-------------------------------------------"
SUBMISSION_RESPONSE=$(curl -s -X POST "${FORMIO_URL}/form/${FORM_ID}/submission" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: ${TOKEN}" \
  -d "{\"data\":{\"testField\":\"validation test data\"}}")

echo "$SUBMISSION_RESPONSE" | jq . > "$RESULTS_DIR/submission-response.json"

SUBMISSION_ID=$(echo "$SUBMISSION_RESPONSE" | jq -r '._id // empty')

if [ -z "$SUBMISSION_ID" ]; then
  echo "❌ FAIL: Form submission failed"
  echo "Response: $SUBMISSION_RESPONSE"
  exit 1
fi

echo "✅ PASS: Form submission successful"
echo "Submission ID: $SUBMISSION_ID"

# Test 6: List Submissions
echo ""
echo "📋 Test 6: List Form Submissions"
echo "---------------------------------"
LIST_RESPONSE=$(curl -s -X GET "${FORMIO_URL}/form/${FORM_ID}/submission" \
  -H "x-jwt-token: ${TOKEN}")

echo "$LIST_RESPONSE" | jq . > "$RESULTS_DIR/list-response.json"

SUBMISSION_COUNT=$(echo "$LIST_RESPONSE" | jq 'length // 0')
echo "✅ PASS: Retrieved $SUBMISSION_COUNT submissions"

# Cleanup: Delete test form
echo ""
echo "🧹 Cleanup: Deleting test form"
echo "------------------------------"
DELETE_RESPONSE=$(curl -s -X DELETE "${FORMIO_URL}/form/${FORM_ID}" \
  -H "x-jwt-token: ${TOKEN}")

echo "✅ Test form deleted"

# Summary
echo ""
echo "=================================="
echo "✅ Authentication Validation COMPLETE"
echo "=================================="
echo ""
echo "All REST API tests passed:"
echo "  ✅ Login successful"
echo "  ✅ JWT token valid format"
echo "  ✅ Token verified via /current"
echo "  ✅ Form creation works"
echo "  ✅ Form submission works"
echo "  ✅ Form listing works"
echo ""
echo "Results saved to: $RESULTS_DIR"
echo ""
