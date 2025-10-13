# Fork Maintenance Best Practices

> **Guide**: Best practices for maintaining the @qrius/formio-react fork with
> patches and CHANGELOG management.

---

## Table of Contents

1. [Fork Maintenance Strategy](#fork-maintenance-strategy)
2. [Patch Management](#patch-management)
3. [CHANGELOG Management](#changelog-management)
4. [Upstream Synchronization](#upstream-synchronization)
5. [Conflict Resolution](#conflict-resolution)
6. [Release Management](#release-management)

---

## Fork Maintenance Strategy

### Overview

Our fork of `@formio/react` maintains custom changes while staying synchronized
with upstream. The key challenge is preserving our customizations during
upstream merges.

### Architecture

```
Upstream (formio/react)
     ↓ (merge strategy)
QriusGlobal/formio-react (Fork)
     ├── Custom changes tracked in patches/
     ├── Custom CHANGELOG in CHANGELOG.QRIUS.md
     └── Upstream CHANGELOG preserved in Changelog.md
              ↓ git-subrepo
formio-monorepo/formio-react/ (Development)
```

### Core Principles

1. **Minimal Divergence**: Only modify what's necessary
2. **Clear Documentation**: Every custom change is documented
3. **Upstream First**: Contribute fixes upstream when possible
4. **Clean History**: Use structured commits for easy tracking

---

## Patch Management

### What is a Patch File?

A patch file documents the exact differences between upstream and our fork. It
allows us to:

- Track all custom modifications
- Reapply changes after upstream merges
- Review what we've changed at a glance
- Contribute changes back upstream

### Patch File Structure

**Location**: `formio-react/patches/`

```
patches/
├── 0001-bundle-dependencies.patch
├── 0002-export-formio-instance.patch
├── 0003-add-custom-component-support.patch
└── README.md
```

### Creating Patches

#### Method 1: Automatic Patch Generation (Recommended)

```bash
# Generate patches for all custom commits
cd formio-react/
git format-patch upstream/main --output-directory patches/

# This creates one patch file per commit
# Example output:
# 0001-fix-bundle-dependencies.patch
# 0002-export-Formio-from-index.patch
```

#### Method 2: Manual Patch Creation

```bash
# Create patch from specific commits
git format-patch -1 <commit-sha> -o patches/

# Create patch for uncommitted changes
git diff > patches/0001-my-custom-change.patch
```

### Patch File Naming Convention

```
NNNN-short-description.patch

Where:
  NNNN = 4-digit sequence number (0001, 0002, etc.)
  short-description = kebab-case description of change
```

**Examples**:

- `0001-bundle-dependencies.patch`
- `0002-export-formio-instance.patch`
- `0003-add-github-packages-config.patch`

### Documenting Patches

Each patch should include:

```diff
From <commit-hash> Mon Sep 17 00:00:00 2001
From: Your Name <your.email@example.com>
Date: Mon, 13 Oct 2025 13:00:00 +0000
Subject: [PATCH] Short description

Detailed explanation of:
- Why this change is needed
- What problem it solves
- How it differs from upstream
- Any side effects or considerations

Qrius-Specific: This change is required for <reason>
Upstream Status: Cannot contribute / Contributed (link)

---
 src/index.ts | 1 +
 1 file changed, 1 insertion(+)

diff --git a/src/index.ts b/src/index.ts
index abc123..def456 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -1,2 +1,3 @@
 export * from './components';
+export { Formio } from '@formio/js';
```

### Applying Patches

```bash
# Apply all patches in order
cd formio-react/
for patch in patches/*.patch; do
  git am < "$patch"
done

# Or apply specific patch
git apply patches/0001-bundle-dependencies.patch

# Check what patch would do (dry run)
git apply --check patches/0001-bundle-dependencies.patch
```

### Maintaining Patches During Upstream Merges

**Workflow**:

1. **Before Merge**: Save current patches

   ```bash
   cd formio-react/
   git format-patch upstream/main -o patches/
   ```

2. **Merge Upstream**: Pull upstream changes

   ```bash
   git fetch upstream
   git merge upstream/main
   # Resolve conflicts
   ```

3. **Reapply Patches**: If merge loses changes

   ```bash
   git am patches/*.patch
   ```

4. **Regenerate Patches**: Update patches after merge
   ```bash
   rm patches/*.patch
   git format-patch upstream/main -o patches/
   ```

### Patch Management Script

**Create**: `formio-react/scripts/manage-patches.sh`

```bash
#!/bin/bash
# Patch management utility for @qrius/formio-react

set -e

ACTION=$1
PATCHES_DIR="patches"

case "$ACTION" in
  generate)
    echo "Generating patches from upstream/main..."
    rm -rf "$PATCHES_DIR"/*.patch 2>/dev/null || true
    git format-patch upstream/main -o "$PATCHES_DIR/"
    echo "Generated $(ls -1 $PATCHES_DIR/*.patch 2>/dev/null | wc -l) patches"
    ;;

  apply)
    echo "Applying patches..."
    for patch in "$PATCHES_DIR"/*.patch; do
      if [ -f "$patch" ]; then
        echo "Applying $(basename $patch)..."
        git am < "$patch" || {
          echo "ERROR: Failed to apply $patch"
          echo "Resolve conflicts and run: git am --continue"
          exit 1
        }
      fi
    done
    echo "All patches applied successfully"
    ;;

  check)
    echo "Checking patches..."
    for patch in "$PATCHES_DIR"/*.patch; do
      if [ -f "$patch" ]; then
        echo "Checking $(basename $patch)..."
        git apply --check "$patch" || {
          echo "WARNING: Patch $(basename $patch) may not apply cleanly"
        }
      fi
    done
    ;;

  list)
    echo "Current patches:"
    ls -1 "$PATCHES_DIR"/*.patch 2>/dev/null || echo "No patches found"
    ;;

  *)
    echo "Usage: $0 {generate|apply|check|list}"
    echo ""
    echo "Commands:"
    echo "  generate - Generate patches from current commits vs upstream/main"
    echo "  apply    - Apply all patches in order"
    echo "  check    - Check if patches apply cleanly"
    echo "  list     - List all patches"
    exit 1
    ;;
esac
```

**Usage**:

```bash
chmod +x scripts/manage-patches.sh

# Generate patches
./scripts/manage-patches.sh generate

# Check if patches apply
./scripts/manage-patches.sh check

# Apply patches
./scripts/manage-patches.sh apply
```

---

## CHANGELOG Management

### Dual CHANGELOG Strategy

We maintain **two separate CHANGELOG files** to avoid conflicts:

1. **`Changelog.md`** - Upstream changelog (never modify, merge conflicts
   accepted)
2. **`CHANGELOG.QRIUS.md`** - Qrius-specific changelog (our changes only)

### File Structure

```
formio-react/
├── Changelog.md           # Upstream changes (read-only for us)
├── CHANGELOG.QRIUS.md     # Our custom changes
└── patches/
    └── README.md          # Links both changelogs
```

### CHANGELOG.QRIUS.md Format

**Format**: [Keep a Changelog](https://keepachangelog.com/)

```markdown
# Qrius Changelog - @qrius/formio-react

All Qrius-specific changes to this fork are documented here.

For upstream changes, see [Changelog.md](./Changelog.md).

## Format

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes
- **Qrius**: Qrius-specific customizations

---

## [Unreleased]

### Qrius

- Preparing next release...

---

## [6.1.0-qrius.1] - 2025-10-13

### Changed

- **BREAKING**: Moved `@formio/js` and `@formio/core` from peer dependencies to
  regular dependencies
- Consuming apps now only need to install `@qrius/formio-react`, not
  `@formio/js`

### Added

- Exported `Formio` instance from main entry point (`src/index.ts`)
- GitHub Packages publishing workflow (`.github/workflows/publish.yml`)
- Fork-specific documentation (`README.FORK.md`, `CLAUDE.md`)
- Patch management system (`patches/` directory)

### Qrius

- **Rationale**: Private package should bundle all dependencies for zero-config
  consumption
- **Patch**: `0001-bundle-dependencies.patch`
- **Patch**: `0002-export-formio-instance.patch`
- **Upstream Status**: Cannot contribute (Qrius-specific requirement)

---

## [6.1.0] - 2024-XX-XX

### Changed

- Synced with upstream @formio/react v6.1.0
- See [Changelog.md](./Changelog.md) for full upstream changes

---

## Versioning

This fork follows **upstream version + Qrius pre-release tag**:
```

<upstream-version>-qrius.<increment>

Examples: 6.1.0-qrius.1 (First Qrius release based on upstream 6.1.0)
6.1.0-qrius.2 (Second Qrius release, same upstream) 6.2.0-qrius.1 (First Qrius
release based on upstream 6.2.0)

```

---

## Contributing

When making Qrius-specific changes:

1. Update `CHANGELOG.QRIUS.md` under `[Unreleased]`
2. Generate patch file: `./scripts/manage-patches.sh generate`
3. Document patch in `patches/README.md`
4. Commit with structured message:
```

feat(qrius): short description

Detailed explanation.

Qrius-Specific: Reason for change Upstream Status: Cannot contribute /
Contributed Patch: patches/NNNN-description.patch

```

---

## Links

- **Upstream Repository**: https://github.com/formio/react
- **Upstream CHANGELOG**: [Changelog.md](./Changelog.md)
- **Qrius Fork**: https://github.com/QriusGlobal/formio-react
- **Patch Directory**: [patches/](./patches/)
```

### Creating CHANGELOG.QRIUS.md

```bash
cd formio-react/
cat > CHANGELOG.QRIUS.md << 'EOF'
# Qrius Changelog - @qrius/formio-react

All Qrius-specific changes to this fork are documented here.

For upstream changes, see [Changelog.md](./Changelog.md).

## [Unreleased]

### Qrius
- Fork initialized with custom dependency bundling

---

## [6.1.0-qrius.1] - 2025-10-13

### Changed
- Moved `@formio/js` and `@formio/core` to regular dependencies

### Added
- Exported `Formio` from main entry point
- GitHub Packages publishing workflow
- Fork documentation and AI assistant guides

### Qrius
- **Rationale**: Zero-dependency management for consuming apps
- **Patches**: See `patches/README.md`

---
EOF
```

### Handling Upstream CHANGELOG Conflicts

**Strategy**: Always accept upstream's `Changelog.md` during merges

```bash
# During merge conflict on Changelog.md
git checkout upstream/main -- Changelog.md
git add Changelog.md

# Our changes are safe in CHANGELOG.QRIUS.md
# No data loss occurs
```

**Rationale**:

- Upstream `Changelog.md` is their history, not ours
- We have no stake in modifying their changelog
- Our changes are tracked in `CHANGELOG.QRIUS.md`
- Clean merge strategy, zero manual conflict resolution

---

## Upstream Synchronization

### Upstream Tracking Branch Strategy

**Create dedicated branch for upstream tracking**:

```bash
cd formio-react/
git remote add upstream https://github.com/formio/react.git
git fetch upstream

# Create tracking branch
git checkout -b upstream-sync upstream/main
git push -u origin upstream-sync
```

### Sync Workflow

**Step-by-Step Process**:

```bash
# 1. Save current state
cd formio-react/
./scripts/manage-patches.sh generate

# 2. Fetch upstream
git fetch upstream

# 3. Create merge branch
git checkout main
git checkout -b merge/upstream-$(date +%Y%m%d)

# 4. Merge upstream
git merge upstream/main

# 5. Resolve conflicts
# - Accept upstream's Changelog.md
# - Merge package.json carefully (preserve our changes)
# - Resolve other conflicts

# Auto-resolve Changelog.md
git checkout upstream/main -- Changelog.md
git add Changelog.md

# 6. Verify custom changes intact
git diff main package.json  # Check our custom fields
git diff main src/index.ts  # Check our export

# 7. Test build
npm install
npm test
npm run build

# 8. Update CHANGELOG.QRIUS.md
cat >> CHANGELOG.QRIUS.md << EOF

## [$(node -p "require('./package.json').version")] - $(date +%Y-%m-%d)

### Changed
- Synced with upstream @formio/react $(git describe upstream/main)
- See [Changelog.md](./Changelog.md) for upstream changes

EOF

# 9. Commit merge
git add CHANGELOG.QRIUS.md
git commit -m "chore: merge upstream $(date +%Y-%m-%d)"

# 10. Regenerate patches
./scripts/manage-patches.sh generate

# 11. Merge to main
git checkout main
git merge merge/upstream-$(date +%Y%m%d)
git push origin main
```

### Automated Upstream Sync Check

**Create**: `.github/workflows/upstream-sync-check.yml`

```yaml
name: Upstream Sync Check

on:
  schedule:
    # Check weekly on Monday at 9 AM UTC
    - cron: '0 9 * * 1'
  workflow_dispatch:

jobs:
  check-upstream:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Add upstream remote
        run: |
          git remote add upstream https://github.com/formio/react.git
          git fetch upstream

      - name: Check for upstream changes
        id: check
        run: |
          BEHIND=$(git rev-list --count HEAD..upstream/main)
          echo "commits_behind=$BEHIND" >> $GITHUB_OUTPUT

          if [ "$BEHIND" -gt 0 ]; then
            echo "::warning::Fork is $BEHIND commits behind upstream"
            echo "needs_sync=true" >> $GITHUB_OUTPUT
          else
            echo "::notice::Fork is up to date with upstream"
            echo "needs_sync=false" >> $GITHUB_OUTPUT
          fi

      - name: Create sync issue
        if: steps.check.outputs.needs_sync == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const behind = ${{ steps.check.outputs.commits_behind }};
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Upstream sync needed: ${behind} commits behind`,
              body: `The fork is ${behind} commits behind upstream.
              
              **Action Required**: Run upstream sync workflow
              
              \`\`\`bash
              # Follow sync workflow in docs/FORK_MAINTENANCE_BEST_PRACTICES.md
              git fetch upstream
              git merge upstream/main
              # ... resolve conflicts ...
              \`\`\`
              
              **Upstream Changes**: https://github.com/formio/react/compare/${context.sha}...main`,
              labels: ['upstream-sync', 'maintenance']
            });
```

---

## Conflict Resolution

### Common Conflict Scenarios

#### 1. Changelog.md Conflict

**Solution**: Always accept upstream's version

```bash
git checkout upstream/main -- Changelog.md
git add Changelog.md
```

#### 2. package.json Conflict

**Solution**: Merge carefully, preserve Qrius changes

```bash
# Open package.json in editor
# Preserve these Qrius-specific fields:
# - name: "@qrius/formio-react"
# - repository: QriusGlobal URL
# - dependencies: @formio/js, @formio/core (NOT peerDependencies)
# - publishConfig

# After manual merge:
git add package.json
```

#### 3. src/index.ts Conflict

**Solution**: Keep our Formio export

```bash
# Ensure this line exists after merge:
# export { Formio } from '@formio/js';

# Verify:
grep "export { Formio }" src/index.ts

# If missing, add it:
echo "export { Formio } from '@formio/js';" >> src/index.ts
git add src/index.ts
```

### Conflict Resolution Checklist

After resolving conflicts:

- [ ] `Changelog.md` is from upstream (no Qrius changes)
- [ ] `CHANGELOG.QRIUS.md` has new entry documenting merge
- [ ] `package.json` has correct `name`, `dependencies`, `publishConfig`
- [ ] `src/index.ts` exports Formio
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Patches regenerated (`./scripts/manage-patches.sh generate`)
- [ ] Changes committed with clear message

---

## Release Management

### Versioning Strategy

**Format**: `<upstream-version>-qrius.<increment>`

**Examples**:

```
6.1.0          → Upstream version
6.1.0-qrius.1  → First Qrius release
6.1.0-qrius.2  → Second Qrius release (hotfix)
6.2.0-qrius.1  → New upstream version
```

### Release Process

```bash
# 1. Verify clean state
git status  # Should be clean
npm test    # Should pass
npm run build  # Should succeed

# 2. Update version
UPSTREAM_VERSION=$(grep -m1 '"version"' package.json | grep -o '[0-9.]*')
QRIUS_INCREMENT=1  # Or 2, 3, etc.
NEW_VERSION="${UPSTREAM_VERSION}-qrius.${QRIUS_INCREMENT}"

npm version $NEW_VERSION --no-git-tag-version

# 3. Update CHANGELOG.QRIUS.md
# Move [Unreleased] to [$NEW_VERSION] with date

# 4. Commit release
git add package.json CHANGELOG.QRIUS.md
git commit -m "chore: release $NEW_VERSION"

# 5. Tag release
git tag -a "v$NEW_VERSION" -m "Release $NEW_VERSION"

# 6. Push to fork (triggers CI/CD)
git push origin main
git push origin "v$NEW_VERSION"

# 7. Push to monorepo via git-subrepo
cd ../  # Back to monorepo root
git subrepo push formio-react
```

### Release Checklist

- [ ] All tests passing
- [ ] Build succeeds
- [ ] CHANGELOG.QRIUS.md updated
- [ ] Version follows format: `<upstream>-qrius.<n>`
- [ ] Patches documented in `patches/README.md`
- [ ] Fork-specific docs updated (README.FORK.md, CLAUDE.md)
- [ ] CI/CD workflow will publish automatically
- [ ] Monorepo synced via git-subrepo

---

## Summary

### Key Files to Maintain

| File                 | Purpose          | Conflict Strategy                      |
| -------------------- | ---------------- | -------------------------------------- |
| `Changelog.md`       | Upstream history | Always accept upstream                 |
| `CHANGELOG.QRIUS.md` | Qrius history    | Never conflicts (our file)             |
| `patches/`           | Custom changes   | Regenerate after merges                |
| `package.json`       | Package config   | Merge carefully, preserve Qrius fields |
| `src/index.ts`       | Main entry       | Preserve Formio export                 |

### Maintenance Commands

```bash
# Generate patches
./scripts/manage-patches.sh generate

# Check patches
./scripts/manage-patches.sh check

# Apply patches
./scripts/manage-patches.sh apply

# Sync upstream
git fetch upstream && git merge upstream/main

# Release
npm version <version> --no-git-tag-version
git tag -a v<version> -m "Release <version>"
git push origin main --tags
```

### Best Practices Summary

1. ✅ **Minimal Divergence**: Only customize what's necessary
2. ✅ **Document Everything**: Patches + CHANGELOG.QRIUS.md
3. ✅ **Dual CHANGELOG**: Separate upstream and Qrius changes
4. ✅ **Automated Checks**: CI/CD for upstream sync detection
5. ✅ **Structured Commits**: Clear commit messages with patch references
6. ✅ **Test Everything**: Tests + builds before each release

---

**Last Updated**: 2025-10-13  
**Maintainer**: Qrius Global  
**Fork**: https://github.com/QriusGlobal/formio-react  
**Upstream**: https://github.com/formio/react
