# Qrius Patches for @qrius/formio-react

This directory contains documentation of all customizations made to the upstream `@formio/react` repository.

## Patch Management Approach

This is an **active development fork** with frequent customizations and regular upstream syncs. We use **StGit (Stacked Git)** for interactive patch management.

### Why StGit?

**StGit** is the industry standard for active development forks:

- **Git-native**: Patches ARE commits, no separate patch files
- **Interactive**: Update any patch, not just the topmost
- **Reorderable**: Move patches up/down the stack
- **Safe**: Full undo capability with `stg undo`
- **Transparent**: Works with all git tools (gitk, git log, etc.)

**Used By**: Linux kernel subsystem maintainers, QEMU, PostgreSQL, and thousands of active forks

## Installation

```bash
# macOS
brew install stgit

# Debian/Ubuntu
apt install stgit

# Fedora/RHEL
dnf install stgit

# From source
git clone https://github.com/stacked-git/stgit.git
cd stgit && make install
```

## Basic Workflow

### Initialize StGit

```bash
# One-time setup in this repository
stg init
```

### Create New Customization

```bash
# Create new patch
stg new feature-name -m "Add new feature"

# Make changes to files
vim src/index.ts

# Capture changes in current patch
stg refresh

# View patch
stg show
```

### View Patch Stack

```bash
# List all patches
stg series

# Show detailed status
stg series -d

# View specific patch
stg show patch-name
```

### Navigate Patches

```bash
# Jump to specific patch
stg goto patch-name

# Move to next/previous patch
stg next
stg prev

# Go to top (all patches applied)
stg top

# Go to bottom (no patches applied)
stg pop -a
```

### Modify Existing Patches

```bash
# Jump to patch you want to modify
stg goto old-patch-name

# Make changes
vim src/component.ts

# Update the patch
stg refresh

# Return to top
stg top
```

### Reorder Patches

```bash
# Move patch to top of stack
stg float patch-name

# Move patch to bottom
stg sink patch-name

# List patches to see new order
stg series
```

## Upstream Merge Workflow with StGit

### Before Merging Upstream

```bash
# Check current patch stack
stg series -d

# Ensure all patches are applied and refreshed
stg top
stg refresh

# Fetch upstream changes
git fetch upstream
```

### Merge Upstream

```bash
# Rebase patch stack onto new upstream
stg rebase upstream/main
```

**What happens:**

- StGit temporarily pops all patches
- Rebases to `upstream/main`
- Reapplies patches one by one
- Stops if conflicts occur

### Handle Conflicts

If rebase stops due to conflicts:

```bash
# Fix conflicts in affected files
vim src/conflicted-file.ts

# Mark as resolved
git add src/conflicted-file.ts

# Continue rebase
stg refresh
stg goto --next

# Repeat until all patches applied
```

### Special Cases

**Always Accept Upstream's Changelog:**

```bash
# During conflict resolution
git checkout upstream/main -- Changelog.md
git add Changelog.md
stg refresh
```

**Preserve Qrius Customizations:**

- `package.json` - Keep Qrius package name, dependencies, publishConfig
- `src/index.ts` - Keep Formio export
- `.github/workflows/publish.yml` - Keep Qrius publishing workflow

### Verify After Merge

```bash
# Run tests
npm test

# Build package
npm run build

# Check patch stack integrity
stg series -d

# View all changes
stg show --all
```

### Undo If Needed

```bash
# Undo last operation
stg undo

# Undo multiple operations
stg undo --number 3

# View undo history
stg log
```

## Current Customizations (StGit Patches)

**View live patch stack:** `stg series -d`

### Expected Patches

1. **bundle-dependencies**
    - Moved `@formio/js` and `@formio/core` from `peerDependencies` to `dependencies`
    - Updated package name to `@qrius/formio-react`
    - Added `publishConfig` for GitHub Packages
    - **Rationale**: Zero-dependency management for consuming apps
    - **Upstream Status**: Cannot contribute (Qrius-specific requirement)

2. **export-formio-instance**
    - Added `export { Formio } from '@formio/js'` to `src/index.ts`
    - **Rationale**: Apps need Formio instance for component registration
    - **Upstream Status**: Cannot contribute (Qrius-specific requirement)

3. **github-packages-workflow**
    - Added `.github/workflows/publish.yml`
    - **Rationale**: CI/CD for GitHub Packages publishing
    - **Upstream Status**: Cannot contribute (Qrius infrastructure)

**Note:** After StGit initialization, convert existing commits to patches using:

```bash
stg uncommit --number 3  # Uncommit last 3 commits as patches
```

## Adding New Customizations

```bash
# Create new patch
stg new feature-name -m "feat(qrius): short description

Detailed explanation.

Qrius-Specific: Reason
Upstream Status: Cannot contribute / Will contribute"

# Make changes
vim src/component.ts

# Capture changes
stg refresh

# View what was captured
stg show

# Update CHANGELOG.QRIUS.md
vim CHANGELOG.QRIUS.md

# Add CHANGELOG to patch
stg refresh
```

## Commit Message Format

StGit patches follow standard commit format:

```
feat(qrius): short description

Detailed explanation of changes and motivation.

Qrius-Specific: Business/technical reason
Upstream Status: Cannot contribute / Contributed (PR link)
```

**Types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

## Advanced Operations

### Export Patches (Optional)

If you need patch files for documentation or sharing:

```bash
# Export all patches to patches/ directory
stg export --dir patches/

# Export specific patch
stg export --dir patches/ patch-name
```

**Note:** This is optional - StGit doesn't require exporting patches to function.

### Delete Patch

```bash
# Delete specific patch
stg delete patch-name

# Delete multiple patches
stg delete patch1 patch2 patch3
```

### Rename Patch

```bash
# Rename patch
stg rename old-name new-name
```

### Squash Patches

```bash
# Combine multiple patches into one
stg squash patch1 patch2 --name combined-patch
```

## Comparison to Other Tools

| Feature                | StGit           | Quilt          | git-rebase            |
| ---------------------- | --------------- | -------------- | --------------------- |
| **Active Development** | ✅ Best         | ❌ Static only | ⚠️ Manual             |
| **Git Integration**    | ✅ Native       | ❌ Separate    | ✅ Native             |
| **Update Any Patch**   | ✅ Yes          | ❌ Top only    | ❌ Complex            |
| **Reorder Patches**    | ✅ Commands     | ⚠️ Manual edit | ⚠️ Interactive rebase |
| **Undo Capability**    | ✅ Full history | ❌ None        | ⚠️ reflog only        |
| **Conflict Detection** | ✅ Immediate    | ⚠️ On apply    | ✅ On rebase          |

**Verdict:** StGit is superior for active development forks with frequent customizations.

## Links

- **StGit Documentation**: https://stacked-git.github.io/
- **Upstream Repository**: https://github.com/formio/react
- **Qrius Fork**: https://github.com/QriusGlobal/formio-react
- **Maintenance Guide**: See `../docs/FORK_MAINTENANCE_BEST_PRACTICES.md`
- **CHANGELOG**: See `../CHANGELOG.QRIUS.md`
