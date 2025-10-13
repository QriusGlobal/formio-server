#!/bin/bash
# Patch management utility for @qrius/formio-react
# 
# Usage: ./scripts/manage-patches.sh {generate|apply|check|list}

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ACTION=$1
PATCHES_DIR="patches"
UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="main"

# Ensure we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    echo -e "${RED}ERROR: Must be run from formio-react repository root${NC}"
    exit 1
fi

# Check if upstream remote exists
check_upstream() {
    if ! git remote | grep -q "^${UPSTREAM_REMOTE}$"; then
        echo -e "${YELLOW}WARNING: Upstream remote '${UPSTREAM_REMOTE}' not found${NC}"
        echo "Add upstream remote with:"
        echo "  git remote add ${UPSTREAM_REMOTE} https://github.com/formio/react.git"
        echo "  git fetch ${UPSTREAM_REMOTE}"
        return 1
    fi
    return 0
}

# Generate patches
generate_patches() {
    echo -e "${GREEN}Generating patches from ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}...${NC}"
    
    if ! check_upstream; then
        echo -e "${YELLOW}Skipping patch generation (no upstream remote)${NC}"
        return 1
    fi
    
    # Fetch latest upstream
    echo "Fetching upstream..."
    git fetch ${UPSTREAM_REMOTE} --quiet
    
    # Check if we're ahead of upstream
    AHEAD=$(git rev-list --count ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}..HEAD 2>/dev/null || echo "0")
    
    if [ "$AHEAD" -eq "0" ]; then
        echo -e "${YELLOW}No commits ahead of upstream. No patches to generate.${NC}"
        return 0
    fi
    
    echo -e "Found ${GREEN}${AHEAD}${NC} commit(s) ahead of upstream"
    
    # Clean old patches
    if [ -d "$PATCHES_DIR" ]; then
        rm -f "$PATCHES_DIR"/*.patch
    else
        mkdir -p "$PATCHES_DIR"
    fi
    
    # Generate patches
    PATCH_COUNT=$(git format-patch ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH} -o "$PATCHES_DIR/" | wc -l | tr -d ' ')
    
    if [ "$PATCH_COUNT" -gt "0" ]; then
        echo -e "${GREEN}✓ Generated ${PATCH_COUNT} patch file(s) in ${PATCHES_DIR}/${NC}"
        echo ""
        echo "Patches created:"
        ls -1 "$PATCHES_DIR"/*.patch | sed 's/^/  /'
    else
        echo -e "${YELLOW}No patches generated${NC}"
    fi
}

# Apply patches
apply_patches() {
    echo -e "${GREEN}Applying patches from ${PATCHES_DIR}/...${NC}"
    
    if [ ! -d "$PATCHES_DIR" ]; then
        echo -e "${RED}ERROR: Patches directory not found: ${PATCHES_DIR}${NC}"
        exit 1
    fi
    
    PATCH_FILES=("$PATCHES_DIR"/*.patch)
    
    if [ ! -f "${PATCH_FILES[0]}" ]; then
        echo -e "${YELLOW}No patch files found in ${PATCHES_DIR}/${NC}"
        return 0
    fi
    
    APPLIED=0
    FAILED=0
    
    for patch in "${PATCH_FILES[@]}"; do
        if [ -f "$patch" ]; then
            echo -n "Applying $(basename "$patch")... "
            
            if git am < "$patch" 2>&1 | grep -q "error"; then
                echo -e "${RED}FAILED${NC}"
                FAILED=$((FAILED + 1))
                echo -e "${RED}ERROR: Failed to apply $patch${NC}"
                echo "To resolve conflicts:"
                echo "  1. Fix conflicts in the affected files"
                echo "  2. git add <resolved-files>"
                echo "  3. git am --continue"
                echo ""
                echo "Or to skip this patch:"
                echo "  git am --skip"
                echo ""
                echo "Or to abort:"
                echo "  git am --abort"
                exit 1
            else
                echo -e "${GREEN}OK${NC}"
                APPLIED=$((APPLIED + 1))
            fi
        fi
    done
    
    echo ""
    echo -e "${GREEN}✓ Applied ${APPLIED} patch(es) successfully${NC}"
    
    if [ "$FAILED" -gt "0" ]; then
        echo -e "${RED}✗ Failed to apply ${FAILED} patch(es)${NC}"
        exit 1
    fi
}

# Check patches
check_patches() {
    echo -e "${GREEN}Checking patches in ${PATCHES_DIR}/...${NC}"
    
    if [ ! -d "$PATCHES_DIR" ]; then
        echo -e "${RED}ERROR: Patches directory not found: ${PATCHES_DIR}${NC}"
        exit 1
    fi
    
    PATCH_FILES=("$PATCHES_DIR"/*.patch)
    
    if [ ! -f "${PATCH_FILES[0]}" ]; then
        echo -e "${YELLOW}No patch files found in ${PATCHES_DIR}/${NC}"
        return 0
    fi
    
    CLEAN=0
    ISSUES=0
    
    for patch in "${PATCH_FILES[@]}"; do
        if [ -f "$patch" ]; then
            echo -n "Checking $(basename "$patch")... "
            
            if git apply --check "$patch" 2>/dev/null; then
                echo -e "${GREEN}OK${NC}"
                CLEAN=$((CLEAN + 1))
            else
                echo -e "${YELLOW}ISSUES${NC}"
                ISSUES=$((ISSUES + 1))
            fi
        fi
    done
    
    echo ""
    
    if [ "$ISSUES" -eq "0" ]; then
        echo -e "${GREEN}✓ All ${CLEAN} patch(es) apply cleanly${NC}"
    else
        echo -e "${YELLOW}⚠ ${ISSUES} patch(es) may have conflicts${NC}"
        echo "Run with 'apply' to attempt applying patches"
    fi
}

# List patches
list_patches() {
    echo -e "${GREEN}Current patches in ${PATCHES_DIR}/:${NC}"
    echo ""
    
    if [ ! -d "$PATCHES_DIR" ]; then
        echo -e "${YELLOW}No patches directory found${NC}"
        return 0
    fi
    
    PATCH_FILES=("$PATCHES_DIR"/*.patch)
    
    if [ ! -f "${PATCH_FILES[0]}" ]; then
        echo -e "${YELLOW}No patch files found${NC}"
        return 0
    fi
    
    COUNT=0
    for patch in "${PATCH_FILES[@]}"; do
        if [ -f "$patch" ]; then
            COUNT=$((COUNT + 1))
            echo "  $(basename "$patch")"
            
            # Extract subject line
            SUBJECT=$(grep "^Subject:" "$patch" | sed 's/^Subject: \[PATCH\] //')
            if [ -n "$SUBJECT" ]; then
                echo -e "    ${YELLOW}${SUBJECT}${NC}"
            fi
            echo ""
        fi
    done
    
    echo -e "${GREEN}Total: ${COUNT} patch(es)${NC}"
}

# Show help
show_help() {
    cat << EOF
Patch Management Utility for @qrius/formio-react

Usage: $0 {generate|apply|check|list|help}

Commands:
  generate    Generate patch files from current commits vs upstream/main
              Creates one .patch file per commit in ${PATCHES_DIR}/
              
  apply       Apply all patch files in order
              Use this after merging upstream to reapply customizations
              
  check       Check if patch files apply cleanly
              Useful before attempting to apply patches
              
  list        List all current patch files with descriptions
              
  help        Show this help message

Examples:
  # After making custom changes
  $ ./scripts/manage-patches.sh generate
  
  # After merging upstream
  $ git merge upstream/main
  $ ./scripts/manage-patches.sh apply
  
  # Check patch status
  $ ./scripts/manage-patches.sh check

Requirements:
  - Must be run from repository root
  - Upstream remote must be configured as '${UPSTREAM_REMOTE}'
    (git remote add ${UPSTREAM_REMOTE} https://github.com/formio/react.git)

For more information, see:
  - patches/README.md
  - ../docs/FORK_MAINTENANCE_BEST_PRACTICES.md
EOF
}

# Main command dispatcher
case "$ACTION" in
    generate)
        generate_patches
        ;;
        
    apply)
        apply_patches
        ;;
        
    check)
        check_patches
        ;;
        
    list)
        list_patches
        ;;
        
    help|--help|-h)
        show_help
        ;;
        
    *)
        echo -e "${RED}ERROR: Unknown command: $ACTION${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
