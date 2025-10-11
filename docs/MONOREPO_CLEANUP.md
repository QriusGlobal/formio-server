# Monorepo Cleanup Plan

**Audit Date**: October 11, 2025  
**Total Recoverable Space**: ~630 MB  
**Status**: Phase 1 ready for execution

---

## Executive Summary

Comprehensive audit identified:

- **7 major redundancy issues**
- **630 MB recoverable disk space**
- **5 critical issues** requiring immediate action
- **4-phase cleanup plan** with risk-based prioritization

### Key Findings

1. ❌ **CRITICAL**: `test-app/` (81MB) - Redundant with `form-client-web-app/`
2. ❌ **CRITICAL**: `form-client-web-app/~/` (187MB) - Bun cache pollution
3. ❌ **CRITICAL**: `dss-formio-service/formio-community-local/` (327MB) - Local
   Docker data
4. ⚠️ **HIGH**: Committed build artifacts (25MB in git history)
5. ⚠️ **HIGH**: Committed .env files (security issue)

---

## Phase 1: Safe Deletions (ZERO RISK) 🟢

**Status**: ✅ Ready to execute  
**Recovery**: ~526 MB  
**Risk**: Zero

### Execution

```bash
# Run automated cleanup script
bash scripts/cleanup-phase-1.sh
```

### What Gets Deleted

| Item                                         | Size   | Reason                          |
| -------------------------------------------- | ------ | ------------------------------- |
| `formio/formio*` nested dirs                 | 10 MB  | Git-subrepo migration artifacts |
| `form-client-web-app/~/`                     | 187 MB | Bun cache misconfiguration      |
| `test-results/`                              | 4 KB   | Transient Playwright output     |
| `dss-formio-service/formio-community-local/` | 327 MB | Local dev data                  |
| `*.backup`, `*.tmp` files                    | 1 MB   | Backup files                    |
| `.DS_Store`, `Thumbs.db`                     | <1 KB  | OS metadata                     |
| `*.log` files                                | 1 MB   | Application logs                |

### Verification

```bash
# Check disk recovery
du -sh */ | sort -h

# Verify no broken references
grep -r "formio/formio/" . --exclude-dir=node_modules
grep -r "test-results" . --exclude-dir=node_modules
```

---

## Phase 2: Git Untracking (LOW RISK) 🟡

**Status**: ⚠️ Requires review  
**Recovery**: ~25 MB (git history)  
**Risk**: Low (can be reverted)

### Issues

1. **Committed .env files** (security risk)
2. **Build artifacts** tracked in git (dist/, lib/)
3. **Large binary files** in git history

### Execution

```bash
# 1. IMPORTANT: Check for secrets first!
git show .env | grep -E "SECRET|PASSWORD|KEY"
# If secrets found, rotate them before proceeding

# 2. Untrack .env files
git rm --cached .env
git rm --cached dss-formio-service/.env
git rm --cached dss-formio-service/data/.env

# 3. Untrack build artifacts
git rm -r --cached formio-core/dist
git rm -r --cached formio-core/lib
git rm -r --cached formio/portal/dist
git rm -r --cached packages/formio-file-upload/lib
git rm -r --cached packages/formio-file-upload/dist

# 4. Commit changes
git add .gitignore  # Make sure .gitignore is updated first
git commit -m "chore: untrack build artifacts and environment files"

# 5. Reclaim space (optional but recommended)
git gc --aggressive --prune=now
```

### Verification

```bash
# Check .env files are untracked
git status | grep ".env"  # Should show nothing

# Verify build artifacts ignored
git status | grep -E "dist|lib"  # Should show nothing
```

---

## Phase 3: Consolidation (MEDIUM RISK) 🟠

**Status**: ⚠️ Decision required  
**Recovery**: ~81 MB  
**Risk**: Medium (requires testing)

### Decision: test-app vs form-client-web-app

**Evidence for deletion**:

- ✅ `form-client-web-app/` is newer (active development)
- ✅ Docker Compose only references `form-client-web-app`
- ✅ Makefile only has `form-client-web-app` targets
- ✅ Documentation primarily references `form-client-web-app`

**Evidence for keeping**:

- ⚠️ `test-app/` has unique E2E test scripts (15+ scripts)
- ⚠️ Contains @formio/file-upload and @uppy dependencies
- ⚠️ More comprehensive test setup

**Recommended Action**: **Delete test-app** after migration

### Migration Steps

```bash
# 1. Audit unique dependencies
diff test-app/package.json form-client-web-app/package.json

# 2. Copy unique test scripts
# Review test-app/tests/ and migrate to tests/

# 3. Update workspace configuration
# Edit pnpm-workspace.yaml:
#   Remove: 'test-app'
#   Add: 'form-client-web-app', 'tests'

# 4. Delete test-app
rm -rf test-app/

# 5. Update documentation
# Search and replace references
```

### Other Consolidation Tasks

**Empty Directories** (11 found):

```bash
# Remove empty placeholders
find dss-formio-service -type d -empty -delete
find formio-core/.github -type d -empty -delete
find formio-react/.github -type d -empty -delete
```

**Workspace Configuration**:

```yaml
# pnpm-workspace.yaml - BEFORE:
packages:
  - 'packages/*'
  - 'formio'
  - 'formio-core'
  - 'formio-react'
  - 'test-app'

# AFTER:
packages:
  - 'packages/*'
  - 'formio'
  - 'formio-core'
  - 'formio-react'
  - 'form-client-web-app'   # ADD
  - 'tests'                 # ADD
```

---

## Phase 4: .gitignore Enhancements 🔵

**Status**: ✅ Ready to apply  
**Recovery**: 0 MB (prevents future waste)  
**Risk**: Zero

### Enhanced Patterns

Add to root `.gitignore`:

```gitignore
# ============================================
# MONOREPO CLEANUP - NEW PATTERNS (2025-10-11)
# ============================================

# OS-specific files
**/.DS_Store
**/Thumbs.db
**/*.swp
**/*~

# Package manager caches
**/~/
**/.bun/install/cache/
**/.pnpm-store/
**/.npm/
**/.yarn/cache/

# Test artifacts
test-results/
**/test-results/
playwright-report/
**/playwright-report/
.last-run.json
**/.nyc_output/
**/coverage/

# Build outputs (comprehensive)
**/dist/
**/lib/
**/build/
**/*.tsbuildinfo
**/portal/dist/

# Local development data
**/formio-community-local/
**/data/mongodb/
**/.mongodb/

# Logs
*.log
**/*.log
!**/docs/**/*.log
apply.log
state_assessment.log
terraform-plan.log

# Temporary/backup files
*.tmp
*.temp
*.bak
*.backup

# Terraform
**/.terraform/
**/*.tfstate
**/*.tfstate.backup

# AI Assistant caches
**/.serena/cache/
**/.serena/memories/
**/.claude/settings.local.json

# IDE
.vscode/settings.json
.idea/workspace.xml
```

### Application

```bash
# Append to .gitignore
cat >> .gitignore << 'EOF'

# ============================================
# MONOREPO CLEANUP - NEW PATTERNS (2025-10-11)
# ============================================
[paste patterns above]
EOF

# Commit
git add .gitignore
git commit -m "chore: enhance .gitignore with comprehensive patterns"
```

---

## Workspace Best Practices

### 1. Monorepo Structure

**Current Issues**:

- Inconsistent workspace configuration
- Missing packages in `pnpm-workspace.yaml`
- Broken script references in root `package.json`

**Recommended Structure**:

```
formio-monorepo/
├── packages/           # Shared libraries
│   └── formio-file-upload/
├── apps/               # Applications (rename from current structure)
│   ├── form-client-web-app/
│   └── formio-server/  (move formio/ here)
├── tests/              # E2E test framework
├── scripts/            # Build/deployment scripts
├── docs/               # Documentation
└── infrastructure/     # Docker, Terraform
```

### 2. Dependency Management

**Use Workspace Protocol**:

```json
// package.json
{
  "dependencies": {
    "@formio/file-upload": "workspace:*"
  }
}
```

**Shared Dependencies**:

```json
// Root package.json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 3. Build Orchestration

**Add Turbo Tasks**:

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "lib/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "clean": {
      "cache": false
    }
  }
}
```

### 4. Git Workflow

**Pre-commit Hooks** (using Husky):

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Prevent committing build artifacts
git diff --cached --name-only | grep -E "dist/|lib/|*.log$" && {
  echo "❌ Build artifacts detected in commit"
  exit 1
}

# Prevent committing .env files
git diff --cached --name-only | grep "\.env$" && {
  echo "❌ .env file detected in commit"
  exit 1
}

# Run lint-staged
npx lint-staged
```

### 5. Package Naming

**Convention**: `@formio/package-name`

```json
// packages/formio-file-upload/package.json
{
  "name": "@formio/file-upload"
}

// apps/form-client-web-app/package.json
{
  "name": "@formio/client-web-app",
  "private": true
}
```

---

## Cleanup Checklist

### Pre-Execution

- [ ] Read full cleanup plan
- [ ] Review audit report findings
- [ ] Create backup: `git branch backup-before-cleanup`
- [ ] Ensure working directory is clean: `git status`

### Phase 1 (Safe)

- [ ] Run: `bash scripts/cleanup-phase-1.sh`
- [ ] Verify: `du -sh */ | sort -h`
- [ ] Commit:
      `git add -A && git commit -m "chore: phase 1 cleanup - remove dead code"`

### Phase 2 (Git Untracking)

- [ ] Check for secrets in .env files
- [ ] Rotate secrets if needed
- [ ] Untrack files with `git rm --cached`
- [ ] Update .gitignore FIRST
- [ ] Commit: `git commit -m "chore: untrack build artifacts and env files"`
- [ ] Run: `git gc --aggressive --prune=now`

### Phase 3 (Consolidation)

- [ ] Decide: Keep or delete test-app?
- [ ] Migrate unique dependencies
- [ ] Update workspace configuration
- [ ] Test: `pnpm install && pnpm build`
- [ ] Commit: `git commit -m "chore: consolidate test infrastructure"`

### Phase 4 (.gitignore)

- [ ] Add enhanced patterns to .gitignore
- [ ] Commit: `git commit -m "chore: enhance .gitignore patterns"`
- [ ] Verify: `git status` should show clean tree

### Post-Cleanup

- [ ] Run tests: `pnpm test`
- [ ] Verify services: `docker-compose up -d && docker-compose ps`
- [ ] Update documentation
- [ ] Delete backup branch if all good: `git branch -D backup-before-cleanup`

---

## Risk Mitigation

### Backup Strategy

```bash
# Before any cleanup
git branch backup-before-cleanup
git tag cleanup-baseline-$(date +%Y%m%d)

# If something goes wrong
git checkout backup-before-cleanup
```

### Reverting Changes

**Phase 1** (file deletions):

```bash
# Restore from git
git checkout HEAD -- <file-or-directory>
```

**Phase 2** (git untracking):

```bash
# Re-track files
git add <file>
git commit -m "chore: revert untracking of <file>"
```

**Phase 3** (consolidation):

```bash
# Restore deleted directory
git checkout backup-before-cleanup -- test-app/
git commit -m "chore: restore test-app directory"
```

---

## Expected Outcomes

### Disk Space

- **Before**: 3.6 GB
- **After Phase 1**: 3.1 GB (~526 MB saved)
- **After Phase 2**: 3.1 GB (~25 MB saved from git history)
- **After Phase 3**: 3.0 GB (~81 MB saved)
- **Total**: ~630 MB recovered

### Repository Health

- ✅ No dead code
- ✅ No redundant directories
- ✅ Proper .gitignore coverage
- ✅ Clean git history (build artifacts removed)
- ✅ Consistent workspace configuration
- ✅ No security issues (untracked .env files)

### Developer Experience

- ✅ Faster `git clone` (smaller repo)
- ✅ Faster builds (no cache pollution)
- ✅ Clearer structure (no confusion about test-app vs form-client-web-app)
- ✅ Better CI/CD performance (smaller artifacts)

---

## Maintenance Plan

### Weekly

- [ ] Check for new build artifacts: `git status | grep -E "dist|lib"`
- [ ] Review .gitignore effectiveness
- [ ] Clean local caches: `pnpm store prune`

### Monthly

- [ ] Audit disk usage: `du -sh */ | sort -h`
- [ ] Review test-results/ for committed artifacts
- [ ] Check for OS files: `find . -name ".DS_Store"`

### Quarterly

- [ ] Full monorepo audit (re-run analysis)
- [ ] Update .gitignore patterns
- [ ] Review workspace dependencies
- [ ] Prune git history: `git gc --aggressive`

---

## References

- **Audit Report**: See subagent output in conversation history
- **Monorepo Best Practices**: See docs/MONOREPO_BEST_PRACTICES.md (to be
  created)
- **Git Subrepo Workflow**: docs/GIT_SUBREPO_WORKFLOW.md
- **Architecture**: ARCHITECTURE.md

---

**Next Actions**: Execute Phase 1 cleanup script when ready
