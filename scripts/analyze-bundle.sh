#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

REPORT_FILE="${ROOT_DIR}/bundle-security-report.txt"
VIOLATIONS_COUNT=0

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          Production Bundle Security Analysis                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

{
  echo "PRODUCTION BUNDLE SECURITY ANALYSIS"
  echo "===================================="
  echo ""
  echo "Generated: $(date)"
  echo "Root Directory: ${ROOT_DIR}"
  echo ""
} > "${REPORT_FILE}"

PACKAGES=(
  "packages/formio-file-upload"
  "form-client-web-app"
  "test-app"
)

echo "Building production bundles..."
echo ""

for package_path in "${PACKAGES[@]}"; do
  full_path="${ROOT_DIR}/${package_path}"
  
  if [[ ! -d "${full_path}" ]]; then
    continue
  fi
  
  echo "Building: ${package_path}"
  
  cd "${full_path}"
  
  if [[ -f "package.json" ]]; then
    if grep -q '"build"' package.json; then
      npm run build > /dev/null 2>&1 || {
        echo "  ⚠️  Build failed, skipping"
        continue
      }
      echo "  ✓ Build successful"
    else
      echo "  ⚠️  No build script found, skipping"
      continue
    fi
  fi
done

cd "${ROOT_DIR}"

echo ""
echo "Analyzing bundles for security issues..."
echo ""

BUNDLE_DIRS=(
  "packages/formio-file-upload/dist"
  "packages/formio-file-upload/lib"
  "form-client-web-app/dist"
  "test-app/dist"
)

BRAND_KEYWORDS=(
  "formio"
  "form\.io"
  "uppy"
)

for bundle_dir in "${BUNDLE_DIRS[@]}"; do
  full_path="${ROOT_DIR}/${bundle_dir}"
  
  if [[ ! -d "${full_path}" ]]; then
    continue
  fi
  
  {
    echo "Analyzing: ${bundle_dir}"
    echo "----------------------------------------"
    echo ""
  } >> "${REPORT_FILE}"
  
  echo "Checking: ${bundle_dir}"
  
  bundle_size=$(du -sh "${full_path}" | cut -f1)
  {
    echo "Bundle Size: ${bundle_size}"
    echo ""
  } >> "${REPORT_FILE}"
  
  echo "  Size: ${bundle_size}"
  
  for keyword in "${BRAND_KEYWORDS[@]}"; do
    if command -v rg &> /dev/null; then
      results=$(rg -i "${keyword}" "${full_path}" -l || true)
    else
      results=$(grep -ri "${keyword}" "${full_path}" -l || true)
    fi
    
    if [[ -n "${results}" ]]; then
      {
        echo "⚠️  Brand reference '${keyword}' found in:"
        echo "${results}"
        echo ""
      } >> "${REPORT_FILE}"
      
      echo "  ⚠️  Found '${keyword}' references"
      ((VIOLATIONS_COUNT++))
    fi
  done
  
  sourcemap_count=$(find "${full_path}" -name "*.map" | wc -l | tr -d ' ')
  
  if [[ ${sourcemap_count} -gt 0 ]]; then
    {
      echo "❌ ERROR: ${sourcemap_count} source map files found"
      find "${full_path}" -name "*.map"
      echo ""
    } >> "${REPORT_FILE}"
    
    echo "  ❌ ${sourcemap_count} source map files (security risk)"
    ((VIOLATIONS_COUNT++))
  else
    echo "  ✓ No source maps"
  fi
  
  console_statements=$(grep -r "console\.\(log\|debug\|info\|warn\|error\)" "${full_path}" || true)
  
  if [[ -n "${console_statements}" ]]; then
    {
      echo "⚠️  Console statements found:"
      echo "${console_statements}"
      echo ""
    } >> "${REPORT_FILE}"
    
    echo "  ⚠️  Console statements present"
  else
    echo "  ✓ No console statements"
  fi
  
  {
    echo "----------------------------------------"
    echo ""
  } >> "${REPORT_FILE}"
  
  echo ""
done

echo "Checking bundle size limits..."
echo ""

SIZE_LIMITS=(
  "packages/formio-file-upload/dist:500000"
  "form-client-web-app/dist:2000000"
  "test-app/dist:2000000"
)

for limit_spec in "${SIZE_LIMITS[@]}"; do
  IFS=':' read -r bundle_path max_size <<< "${limit_spec}"
  full_path="${ROOT_DIR}/${bundle_path}"
  
  if [[ ! -d "${full_path}" ]]; then
    continue
  fi
  
  actual_size=$(du -sb "${full_path}" | cut -f1)
  
  {
    echo "Size Check: ${bundle_path}"
    echo "  Limit: $(numfmt --to=iec-i --suffix=B ${max_size})"
    echo "  Actual: $(numfmt --to=iec-i --suffix=B ${actual_size})"
  } >> "${REPORT_FILE}"
  
  if [[ ${actual_size} -gt ${max_size} ]]; then
    {
      echo "  ❌ EXCEEDS LIMIT"
      echo ""
    } >> "${REPORT_FILE}"
    
    echo "  ❌ ${bundle_path} exceeds size limit"
    ((VIOLATIONS_COUNT++))
  else
    {
      echo "  ✓ Within limit"
      echo ""
    } >> "${REPORT_FILE}"
    
    echo "  ✓ ${bundle_path} within size limit"
  fi
done

echo ""
echo "Checking for exposed secrets..."
echo ""

SECRET_PATTERNS=(
  "api[_-]?key.*['\"][a-zA-Z0-9]{20,}['\"]"
  "secret.*['\"][^'\"]{8,}['\"]"
  "password.*['\"][^'\"]{8,}['\"]"
  "token.*['\"][a-zA-Z0-9_-]{20,}['\"]"
  "mongodb://[^'\"]+:[^'\"]+@"
)

for bundle_dir in "${BUNDLE_DIRS[@]}"; do
  full_path="${ROOT_DIR}/${bundle_dir}"
  
  if [[ ! -d "${full_path}" ]]; then
    continue
  fi
  
  for pattern in "${SECRET_PATTERNS[@]}"; do
    if command -v rg &> /dev/null; then
      results=$(rg -i "${pattern}" "${full_path}" || true)
    else
      results=$(grep -ri -E "${pattern}" "${full_path}" || true)
    fi
    
    if [[ -n "${results}" ]]; then
      {
        echo "❌ CRITICAL: Potential secret exposed in ${bundle_dir}"
        echo "Pattern: ${pattern}"
        echo "${results}"
        echo ""
      } >> "${REPORT_FILE}"
      
      echo "  ❌ CRITICAL: Potential secret in ${bundle_dir}"
      ((VIOLATIONS_COUNT++))
    fi
  done
done

{
  echo "===================================="
  echo "SUMMARY"
  echo "===================================="
  echo ""
  echo "Total Security Issues: ${VIOLATIONS_COUNT}"
  echo ""
  
  if [[ ${VIOLATIONS_COUNT} -eq 0 ]]; then
    echo "✅ All security checks PASSED"
    echo ""
    echo "Bundle is production-ready:"
    echo "  ✓ No brand exposure"
    echo "  ✓ No source maps"
    echo "  ✓ Size within limits"
    echo "  ✓ No exposed secrets"
  else
    echo "❌ Security checks FAILED"
    echo ""
    echo "Issues found:"
    echo "  - Review violations listed above"
    echo "  - Remove brand references"
    echo "  - Delete source map files"
    echo "  - Reduce bundle size if needed"
    echo "  - Remove exposed secrets"
    echo ""
    echo "Recommended Actions:"
    echo "  1. Run: npm run build:production"
    echo "  2. Enable terser minification"
    echo "  3. Disable source maps in production"
    echo "  4. Use environment variables for secrets"
  fi
  echo ""
} >> "${REPORT_FILE}"

echo "==============================="
echo "Report saved to: ${REPORT_FILE}"
echo ""

if [[ ${VIOLATIONS_COUNT} -gt 0 ]]; then
  echo "❌ Bundle security check FAILED (${VIOLATIONS_COUNT} issues)"
  echo ""
  cat "${REPORT_FILE}"
  exit 1
else
  echo "✅ Bundle security check PASSED"
  echo ""
  exit 0
fi
