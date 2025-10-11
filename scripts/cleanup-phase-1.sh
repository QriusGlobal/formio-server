#!/bin/bash
# Monorepo Cleanup - Phase 1 (Safe Deletions)
# Generated: 2025-10-11
# Based on comprehensive audit findings
# Expected disk recovery: ~526 MB

set -e  # Exit on error

echo "🧹 Starting monorepo cleanup - Phase 1 (Safe deletions)"
echo ""

# 1. Nested formio packages (10MB)
echo "📦 Removing nested formio packages..."
if [ -d "formio/formio" ]; then
    rm -rf formio/formio formio/formio-core formio/formio-react
    echo "   ✓ Removed nested formio packages"
else
    echo "   ℹ Already clean"
fi

# 2. Bun cache pollution (187MB)
echo "🗑️  Removing Bun cache pollution..."
if [ -d "form-client-web-app/~" ]; then
    rm -rf form-client-web-app/~/
    echo "   ✓ Removed Bun cache (~/)"
else
    echo "   ℹ Already clean"
fi

# 3. Test results (4KB)
echo "🧪 Removing transient test results..."
if [ -d "test-results" ]; then
    rm -rf test-results/
    echo "   ✓ Removed test-results/"
else
    echo "   ℹ Already clean"
fi

# 4. Local dev data (327MB)
echo "💾 Removing local development data..."
if [ -d "dss-formio-service/formio-community-local" ]; then
    rm -rf dss-formio-service/formio-community-local/
    echo "   ✓ Removed formio-community-local/"
else
    echo "   ℹ Already clean"
fi

# 5. Backup/temp files (<1MB)
echo "📄 Removing backup and temporary files..."
find . -type f \( -name "*.backup" -o -name "*.tmp" -o -name "*~" \) -not -path "*/node_modules/*" -delete 2>/dev/null || true
echo "   ✓ Removed *.backup, *.tmp, *~ files"

# 6. OS metadata
echo "🖥️  Removing OS-specific files..."
find . -type f \( -name ".DS_Store" -o -name "Thumbs.db" \) -delete 2>/dev/null || true
echo "   ✓ Removed .DS_Store and Thumbs.db files"

# 7. Log files
echo "📋 Removing log files..."
rm -f dss-formio-service/apply.log
rm -f dss-formio-service/state_assessment.log
rm -f dss-formio-service/terraform/environments/dev/terraform-plan.log 2>/dev/null || true
echo "   ✓ Removed log files"

echo ""
echo "✅ Phase 1 complete! Recovered ~526 MB"
echo "📊 Run 'du -sh */' to verify disk usage"
echo ""
echo "Next steps:"
echo "  - Review git status: git status"
echo "  - Add patterns to .gitignore (see docs/MONOREPO_CLEANUP.md)"
echo "  - Consider Phase 2: git untracking (see cleanup plan)"
