#!/bin/bash
# Update all test files to use new UPPY_FILE_INPUT_SELECTOR

echo "🔧 Updating test selectors across all E2E tests..."

# Find all test files that use the old selector
test_files=$(grep -rl "input\[type=\"file\"\]" /Users/mishal/code/work/formio-monorepo/test-app/tests --include="*.ts" --include="*.tsx")

count=0
for file in $test_files; do
  # Check if file doesn't already import the selector
  if ! grep -q "UPPY_FILE_INPUT_SELECTOR" "$file"; then
    echo "  📝 Adding import to: $file"

    # Add import statement after other imports
    if grep -q "from '../fixtures/" "$file"; then
      # Add after fixtures import
      sed -i '' "/from '\.\.\/fixtures\//a\\
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
" "$file"
    elif grep -q "from '@playwright/test'" "$file"; then
      # Add after playwright import
      sed -i '' "/from '@playwright\/test'/a\\
import { UPPY_FILE_INPUT_SELECTOR } from '../utils/test-selectors';
" "$file"
    fi
  fi

  # Update the selectors
  echo "  🔄 Updating selectors in: $file"
  sed -i '' "s/page\.locator('input\[type=\"file\"\]')/page.locator(UPPY_FILE_INPUT_SELECTOR)/g" "$file"
  sed -i '' 's/page\.locator("input\[type=\\"file\\"\]")/page.locator(UPPY_FILE_INPUT_SELECTOR)/g' "$file"
  sed -i '' "s/\.locator('input\[type=\"file\"\]')/.locator(UPPY_FILE_INPUT_SELECTOR)/g" "$file"
  sed -i '' 's/\.locator("input\[type=\\"file\\"\]")/.locator(UPPY_FILE_INPUT_SELECTOR)/g' "$file"

  count=$((count + 1))
done

echo "✅ Updated $count test files!"
echo "🎯 All tests now use: UPPY_FILE_INPUT_SELECTOR = '[data-testid=\"uppy-file-input\"]'"
