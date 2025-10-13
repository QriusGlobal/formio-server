#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

BRAND_KEYWORDS=(
  "formio"
  "form\.io"
  "form-io"
  "uppy"
  "uppyjs"
  "uppy\.io"
)

EXCLUDE_PATTERNS=(
  "node_modules"
  "dist"
  "build"
  "coverage"
  ".git"
  "*.lock"
  "*.log"
  "CLAUDE.md"
  "README.md"
  "docs/"
  "eslint-plugin-brand-security"
  "scripts/check-brand-exposure.sh"
  "formio/"
  "formio-core/"
  "formio-react/"
  "packages/*/src/"
  "*.test.js"
  "*.spec.js"
  "test/"
  "tests/"
  "patches/"
)

SEARCH_PATHS=(
  "form-client-web-app/src"
  "test-app/src"
  "packages/*/lib"
  "packages/*/dist"
)

REPORT_FILE="${ROOT_DIR}/brand-exposure-report.txt"
VIOLATIONS_COUNT=0

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          Brand Exposure Detection Report                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Scanning for brand references in production code..."
echo "Generated: $(date)"
echo ""

{
  echo "BRAND EXPOSURE DETECTION REPORT"
  echo "==============================="
  echo ""
  echo "Generated: $(date)"
  echo "Root Directory: ${ROOT_DIR}"
  echo ""
  echo "Searched Locations:"
  for path in "${SEARCH_PATHS[@]}"; do
    echo "  - ${path}"
  done
  echo ""
  echo "Brand Keywords:"
  for keyword in "${BRAND_KEYWORDS[@]}"; do
    echo "  - ${keyword}"
  done
  echo ""
  echo "==============================="
  echo ""
} > "${REPORT_FILE}"

build_exclude_args() {
  local args=""
  for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    args="${args} --glob=!${pattern}"
  done
  echo "${args}"
}

EXCLUDE_ARGS=$(build_exclude_args)

for search_path in "${SEARCH_PATHS[@]}"; do
  full_path="${ROOT_DIR}/${search_path}"
  
  if [[ ! -d "${full_path}" && ! -f "${full_path}" ]]; then
    continue
  fi
  
  echo "Scanning: ${search_path}"
  
  for keyword in "${BRAND_KEYWORDS[@]}"; do
    if command -v rg &> /dev/null; then
      results=$(eval "rg -i '${keyword}' ${EXCLUDE_ARGS} '${full_path}' || true")
    else
      results=$(eval "grep -ri '${keyword}' '${full_path}' \
        --exclude-dir=node_modules \
        --exclude-dir=dist \
        --exclude-dir=build \
        --exclude-dir=coverage \
        --exclude-dir=.git \
        --exclude='*.lock' \
        --exclude='*.log' || true")
    fi
    
    if [[ -n "${results}" ]]; then
      {
        echo "VIOLATION: Brand keyword '${keyword}' found in ${search_path}"
        echo "---"
        echo "${results}"
        echo ""
      } >> "${REPORT_FILE}"
      
      ((VIOLATIONS_COUNT++))
      echo "  ⚠️  Found '${keyword}' references"
    fi
  done
done

echo ""
echo "Checking for console.log statements with brand references..."

for search_path in "${SEARCH_PATHS[@]}"; do
  full_path="${ROOT_DIR}/${search_path}"
  
  if [[ ! -d "${full_path}" && ! -f "${full_path}" ]]; then
    continue
  fi
  
  if command -v rg &> /dev/null; then
    console_results=$(eval "rg -i 'console\.(log|debug|info|warn|error).*(' ${EXCLUDE_ARGS} '${full_path}' || true")
  else
    console_results=$(eval "grep -ri 'console\.\(log\|debug\|info\|warn\|error\).*(' '${full_path}' \
      --exclude-dir=node_modules \
      --exclude-dir=dist \
      --exclude-dir=build || true")
  fi
  
  if [[ -n "${console_results}" ]]; then
    {
      echo "WARNING: Console statements found in ${search_path}"
      echo "---"
      echo "${console_results}"
      echo ""
    } >> "${REPORT_FILE}"
    
    echo "  ⚠️  Console statements found in ${search_path}"
  fi
done

echo ""
echo "Checking for TODO/FIXME comments with brand references..."

for search_path in "${SEARCH_PATHS[@]}"; do
  full_path="${ROOT_DIR}/${search_path}"
  
  if [[ ! -d "${full_path}" && ! -f "${full_path}" ]]; then
    continue
  fi
  
  if command -v rg &> /dev/null; then
    todo_results=$(eval "rg -i '(todo|fixme).*(formio|uppy)' ${EXCLUDE_ARGS} '${full_path}' || true")
  else
    todo_results=$(eval "grep -ri '\(TODO\|FIXME\).*\(formio\|uppy\)' '${full_path}' \
      --exclude-dir=node_modules --exclude-dir=dist || true")
  fi
  
  if [[ -n "${todo_results}" ]]; then
    {
      echo "WARNING: TODO/FIXME with brand references in ${search_path}"
      echo "---"
      echo "${todo_results}"
      echo ""
    } >> "${REPORT_FILE}"
    
    echo "  ⚠️  TODO/FIXME comments with brand references"
  fi
done

echo ""
echo "Checking for source map files..."

if command -v rg &> /dev/null; then
  sourcemap_files=$(eval "rg -l '\.map$' ${EXCLUDE_ARGS} '${ROOT_DIR}' || true")
else
  sourcemap_files=$(find "${ROOT_DIR}" -name "*.map" -not -path "*/node_modules/*" -not -path "*/dist/*" || true)
fi

if [[ -n "${sourcemap_files}" ]]; then
  {
    echo "ERROR: Source map files detected"
    echo "---"
    echo "${sourcemap_files}"
    echo ""
  } >> "${REPORT_FILE}"
  
  echo "  ❌ Source map files found (security risk)"
  ((VIOLATIONS_COUNT++))
fi

{
  echo "==============================="
  echo "SUMMARY"
  echo "==============================="
  echo ""
  echo "Total Violations: ${VIOLATIONS_COUNT}"
  echo ""
  
  if [[ ${VIOLATIONS_COUNT} -eq 0 ]]; then
    echo "✅ No brand exposure violations detected"
  else
    echo "❌ Brand exposure violations found"
    echo ""
    echo "Action Required:"
    echo "1. Review violations listed above"
    echo "2. Replace brand references with generic terms or environment variables"
    echo "3. Remove console.log statements or use logging library"
    echo "4. Remove or disable source maps in production builds"
    echo ""
  fi
} >> "${REPORT_FILE}"

echo ""
echo "==============================="
echo "Report saved to: ${REPORT_FILE}"
echo ""

if [[ ${VIOLATIONS_COUNT} -gt 0 ]]; then
  echo "❌ Brand exposure check FAILED (${VIOLATIONS_COUNT} violations)"
  echo ""
  echo "To view full report:"
  echo "  cat ${REPORT_FILE}"
  echo ""
  exit 1
else
  echo "✅ Brand exposure check PASSED"
  echo ""
  exit 0
fi
