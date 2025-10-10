#!/bin/bash
# Validate no weak credentials in .env

if [ ! -f .env ]; then
  echo "❌ .env file not found"
  exit 1
fi

WEAK_PATTERNS=(
  "PASSWORD=admin"
  "PASSWORD=password"
  "SECRET=secret"
  "SECRET=dev-"
  "SECRET=test"
)

for pattern in "${WEAK_PATTERNS[@]}"; do
  if grep -q "$pattern" .env; then
    echo "❌ Weak credential found: $pattern"
    exit 1
  fi
done

echo "✅ No weak credentials detected"
exit 0
