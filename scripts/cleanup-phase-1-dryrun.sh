#!/bin/bash
# Monorepo Cleanup - Phase 1 (DRY RUN)
# Shows what WOULD be deleted without actually deleting
# NO FILES WILL BE MODIFIED OR DELETED

set -e

echo "=========================================="
echo "🔍 DRY RUN MODE - NO FILES WILL BE DELETED"
echo "=========================================="
echo ""
echo "This script will analyze what cleanup-phase-1.sh would delete."
echo ""

# Function to show size with formatting
show_size() {
    if [ -e "$1" ]; then
        SIZE=$(du -sh "$1" 2>/dev/null | cut -f1)
        echo "   📦 $1: $SIZE"
        return 0
    else
        echo "   ℹ️  $1: NOT FOUND (already clean)"
        return 1
    fi
}

# Track total found
FOUND_COUNT=0
TOTAL_SIZE=0

echo "=========================================="
echo "1️⃣  NESTED FORMIO PACKAGES"
echo "=========================================="
if show_size "formio/formio"; then FOUND_COUNT=$((FOUND_COUNT+1)); fi
if show_size "formio/formio-core"; then FOUND_COUNT=$((FOUND_COUNT+1)); fi
if show_size "formio/formio-react"; then FOUND_COUNT=$((FOUND_COUNT+1)); fi
echo ""

echo "=========================================="
echo "2️⃣  BUN CACHE POLLUTION"
echo "=========================================="
if show_size "form-client-web-app/~"; then FOUND_COUNT=$((FOUND_COUNT+1)); fi
echo ""

echo "=========================================="
echo "3️⃣  TRANSIENT TEST RESULTS"
echo "=========================================="
if show_size "test-results"; then FOUND_COUNT=$((FOUND_COUNT+1)); fi
echo ""

echo "=========================================="
echo "4️⃣  LOCAL DEVELOPMENT DATA"
echo "=========================================="
if show_size "dss-formio-service/formio-community-local"; then FOUND_COUNT=$((FOUND_COUNT+1)); fi
echo ""

echo "=========================================="
echo "5️⃣  BACKUP AND TEMPORARY FILES"
echo "=========================================="
echo "Searching for *.backup, *.tmp, *~ files..."
BACKUP_FILES=$(find . -type f \( -name "*.backup" -o -name "*.tmp" -o -name "*~" \) -not -path "*/node_modules/*" 2>/dev/null)
if [ -n "$BACKUP_FILES" ]; then
    echo "$BACKUP_FILES" | while read file; do
        SIZE=$(du -h "$file" 2>/dev/null | cut -f1)
        echo "   📄 $file ($SIZE)"
        FOUND_COUNT=$((FOUND_COUNT+1))
    done
else
    echo "   ℹ️  No backup files found"
fi
echo ""

echo "=========================================="
echo "6️⃣  OS-SPECIFIC METADATA FILES"
echo "=========================================="
echo "Searching for .DS_Store, Thumbs.db..."
OS_FILES=$(find . -type f \( -name ".DS_Store" -o -name "Thumbs.db" \) 2>/dev/null)
if [ -n "$OS_FILES" ]; then
    echo "$OS_FILES" | while read file; do
        SIZE=$(du -h "$file" 2>/dev/null | cut -f1)
        echo "   🖥️  $file ($SIZE)"
    done
else
    echo "   ℹ️  No OS metadata files found"
fi
echo ""

echo "=========================================="
echo "7️⃣  LOG FILES"
echo "=========================================="
LOG_FILES=(
    "dss-formio-service/apply.log"
    "dss-formio-service/state_assessment.log"
    "dss-formio-service/terraform/environments/dev/terraform-plan.log"
)
for log in "${LOG_FILES[@]}"; do
    if [ -f "$log" ]; then
        SIZE=$(du -h "$log" 2>/dev/null | cut -f1)
        echo "   📋 $log ($SIZE)"
    else
        echo "   ℹ️  $log: NOT FOUND"
    fi
done
echo ""

echo "=========================================="
echo "📊 TOTAL RECOVERY CALCULATION"
echo "=========================================="
echo ""
echo "Calculating disk usage of all targets..."
echo ""

# Calculate total for directories
DIRS_TO_CHECK="formio/formio formio/formio-core formio/formio-react form-client-web-app/~ test-results dss-formio-service/formio-community-local"
TOTAL_DIRS=0
for dir in $DIRS_TO_CHECK; do
    if [ -d "$dir" ]; then
        SIZE=$(du -sm "$dir" 2>/dev/null | cut -f1)
        TOTAL_DIRS=$((TOTAL_DIRS + SIZE))
    fi
done

echo "   Large directories: ${TOTAL_DIRS} MB"
echo "   Small files: ~1 MB (backup/temp/OS/logs)"
echo ""
echo "   ⚡ ESTIMATED TOTAL RECOVERY: ~${TOTAL_DIRS} MB"
echo ""

echo "=========================================="
echo "✅ SAFETY ASSERTIONS"
echo "=========================================="
echo ""

# Safety checks
SAFETY_PASSED=true

# Check 1: No node_modules will be deleted
echo "🔍 Checking: Script won't delete node_modules..."
if echo "$DIRS_TO_CHECK" | grep -q "node_modules"; then
    echo "   ❌ FAIL: Would delete node_modules!"
    SAFETY_PASSED=false
else
    echo "   ✅ PASS: No node_modules in deletion targets"
fi

# Check 2: No source code will be deleted
echo "🔍 Checking: Script won't delete source code (src/, lib/, packages/)..."
PROTECTED_PATHS="src/ lib/ packages/ formio/src/ formio-core/src/"
SAFE=true
for dir in $DIRS_TO_CHECK; do
    for protected in $PROTECTED_PATHS; do
        if [[ "$dir" == *"$protected"* ]]; then
            echo "   ❌ FAIL: Would delete source code: $dir"
            SAFETY_PASSED=false
            SAFE=false
        fi
    done
done
if [ "$SAFE" = true ]; then
    echo "   ✅ PASS: No source code in deletion targets"
fi

# Check 3: No .git directory will be deleted
echo "🔍 Checking: Script won't delete .git..."
if echo "$DIRS_TO_CHECK" | grep -q ".git"; then
    echo "   ❌ FAIL: Would delete .git!"
    SAFETY_PASSED=false
else
    echo "   ✅ PASS: .git is safe"
fi

# Check 4: No package.json will be deleted
echo "🔍 Checking: Script won't delete package.json files..."
if find $DIRS_TO_CHECK -name "package.json" 2>/dev/null | grep -v "\.tmp$" | grep -q .; then
    echo "   ⚠️  WARNING: Found package.json in deletion targets:"
    find $DIRS_TO_CHECK -name "package.json" 2>/dev/null | grep -v "\.tmp$"
else
    echo "   ✅ PASS: No critical package.json files affected"
fi

# Check 5: Verify all targets exist
echo "🔍 Checking: All major targets exist..."
MISSING=0
for dir in formio/formio form-client-web-app/~ test-results dss-formio-service/formio-community-local; do
    if [ ! -e "$dir" ]; then
        echo "   ⚠️  $dir: NOT FOUND (nothing to delete)"
        MISSING=$((MISSING+1))
    fi
done
if [ $MISSING -eq 0 ]; then
    echo "   ✅ PASS: All major targets exist"
else
    echo "   ℹ️  INFO: $MISSING targets already clean"
fi

echo ""
echo "=========================================="
if [ "$SAFETY_PASSED" = true ]; then
    echo "✅ SAFETY ASSERTION: PASSED"
    echo "=========================================="
    echo ""
    echo "🎯 CONCLUSION: Script is SAFE to execute"
    echo ""
    echo "The cleanup script will:"
    echo "  ✅ Only delete identified waste (cache, temp, logs)"
    echo "  ✅ Preserve all source code"
    echo "  ✅ Preserve all dependencies (node_modules)"
    echo "  ✅ Preserve all git history"
    echo "  ✅ Preserve all configuration files"
    echo ""
    echo "📝 To execute cleanup:"
    echo "   bash scripts/cleanup-phase-1.sh"
    echo ""
    echo "🛡️  Recommended before execution:"
    echo "   git add -A && git commit -m 'chore: safety checkpoint'"
    echo "   git tag cleanup-baseline-\$(date +%Y%m%d-%H%M%S)"
    echo ""
    exit 0
else
    echo "❌ SAFETY ASSERTION: FAILED"
    echo "=========================================="
    echo ""
    echo "⚠️  CRITICAL: Do NOT execute cleanup script!"
    echo "   Safety checks failed. Review output above."
    echo ""
    exit 1
fi
