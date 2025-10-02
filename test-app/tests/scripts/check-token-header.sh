#!/bin/bash

echo "Testing login with header inspection..."
echo "========================================"

curl -i -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"data":{"email":"test-admin@test.local","password":"TestPass123!"}}' \
  2>&1 | tee /tmp/login-with-headers.txt

echo ""
echo "========================================"
echo "Checking for x-jwt-token header..."
grep -i "x-jwt-token" /tmp/login-with-headers.txt || echo "NO x-jwt-token header found!"

echo ""
echo "Response body:"
tail -1 /tmp/login-with-headers.txt | jq .
