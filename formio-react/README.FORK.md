# @qrius/formio-react

> **IMPORTANT**: This is a private fork of [@formio/react](https://github.com/formio/react) maintained by Qrius Global for active development of custom Form.io components and features.

## Fork Structure

```
formio/react (Upstream)
     ↓ fork
QriusGlobal/formio-react (This Repository - Active Development)
     ├── Package: @qrius/formio-react (GitHub Packages)
     ├── Patch Management: StGit (Stacked Git)
     ├── Bundles: @formio/js + @formio/core as dependencies
     └── CI/CD: .github/workflows/publish.yml
              ↓ git-subrepo
formio-monorepo/formio-react/ (Development Environment)
     └── Synced via: git subrepo pull/push
```

## Key Differences from Upstream

### 1. Package Name

- **Upstream**: `@formio/react`
- **This Fork**: `@qrius/formio-react`

### 2. Dependency Bundling

- **Upstream**: `@formio/js` as peer dependency (consuming apps must install separately)
- **This Fork**: `@formio/js` and `@formio/core` as regular dependencies (bundled with package)

**Why?** Zero-dependency management for consuming apps. They should **ONLY** install `@qrius/formio-react`.

### 3. Exports

```typescript
// Additional export for component registration
export { Formio } from '@formio/js';
```

### 4. Publishing

- **Registry**: GitHub Packages (`ghcr.io`)
- **Scope**: `@qrius` (private package)
- **Workflow**: `.github/workflows/publish.yml` auto-publishes on push to `main`

---

## Installation in Consuming Apps

```json
{
	"dependencies": {
		"@qrius/formio-react": "^6.1.0",
		"react": "^19.0.0",
		"react-dom": "^19.0.0"
	}
}
```

**Note**: You do NOT need to install `@formio/js` separately. It's bundled with `@qrius/formio-react`.

---

## Development Workflow with StGit

This fork uses **StGit (Stacked Git)** for patch-based development, enabling:

- ✅ Interactive patch management
- ✅ Easy reordering of changes
- ✅ Safe upstream rebasing
- ✅ Patches as git commits (no export needed)

### Prerequisites

Install StGit:

```bash
# macOS
brew install stgit

# Debian/Ubuntu
apt install stgit

# Or from source
git clone https://github.com/stacked-git/stgit.git
cd stgit && make prefix=$HOME/.local install
```

### Initial Setup

```bash
# Clone the fork
git clone git@github.com:QriusGlobal/formio-react.git
cd formio-react

# Add upstream remote
git remote add upstream https://github.com/formio/react.git
git fetch upstream

# Initialize StGit stack
stg init
```

### Active Development Workflow

#### 1. Create a New Feature/Change

```bash
# Create a new patch
stg new feature-name -m "Brief description of change"

# Make your changes
# ... edit files ...

# Capture changes in the patch
stg refresh

# View your changes
stg show

# Edit commit message if needed
stg edit
```

#### 2. Working with Multiple Patches

```bash
# Create multiple patches
stg new feature-a -m "Add feature A"
stg refresh

stg new feature-b -m "Add feature B"
stg refresh

# View all patches
stg series

# Jump to any patch to modify it
stg goto feature-a
# ... make changes ...
stg refresh

# Return to top
stg goto feature-b
```

#### 3. Reordering Patches

```bash
# Move a patch to the top
stg float patch-name

# Move a patch to bottom
stg sink patch-name

# View current order
stg series --description
```

#### 4. Updating Non-Top Patches

```bash
# Refresh any patch directly (StGit's power!)
stg refresh -p patch-name

# No need to pop/push manually
```

#### 5. Syncing with Upstream

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your patches onto upstream
stg rebase upstream/main

# If conflicts occur:
# 1. Resolve conflicts in the files
# 2. git add <resolved-files>
# 3. stg refresh
# 4. Continue with: stg push (to apply next patches)

# Undo if rebase goes wrong
stg undo --hard
```

#### 6. Exporting Patches (Optional)

```bash
# Export patches for documentation
stg export -d patches/

# This creates patches/series and patch files
```

#### 7. Publishing Changes

```bash
# When ready, commit patches to main branch
stg commit --all

# Push to fork (triggers CI/CD)
git push origin main
```

### Common StGit Commands Reference

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `stg new <name>`       | Create new patch                  |
| `stg refresh`          | Update current patch with changes |
| `stg series`           | List all patches                  |
| `stg show`             | Show current patch diff           |
| `stg goto <patch>`     | Jump to specific patch            |
| `stg float <patch>`    | Move patch to top                 |
| `stg sink <patch>`     | Move patch to bottom              |
| `stg push`             | Apply next unapplied patch        |
| `stg pop`              | Unapply current patch             |
| `stg rebase <branch>`  | Rebase patches onto branch        |
| `stg edit`             | Edit patch commit message         |
| `stg delete <patch>`   | Delete a patch                    |
| `stg squash <patches>` | Combine multiple patches          |
| `stg undo`             | Undo last operation               |
| `stg commit -a`        | Convert patches to commits        |

---

## Git-Subrepo Integration

This fork is managed via **git-subrepo** from the monorepo at `mishaal79/formio-monorepo-private`.

### From Monorepo (Recommended)

```bash
# Make changes in monorepo
cd formio-monorepo/formio-react/

# Use StGit for development
stg new my-feature
# ... edit files ...
stg refresh

# When ready, commit and push to fork
stg commit --all
cd ..
git subrepo push formio-react
```

### Syncing Between Monorepo and Fork

```bash
# Pull changes from fork to monorepo
cd formio-monorepo/
git subrepo pull formio-react

# Push changes from monorepo to fork
git subrepo push formio-react
```

---

## Upstream Sync Strategy

### Step-by-Step Upstream Merge

```bash
# 1. Ensure StGit stack is clean
stg series

# 2. Fetch upstream
git fetch upstream

# 3. Rebase patches onto upstream
stg rebase upstream/main

# 4. If conflicts occur:
#    a. Resolve conflicts in files
#    b. git add <resolved-files>
#    c. stg refresh
#    d. stg push (continue with remaining patches)

# 5. Verify all patches applied
stg series

# 6. Test
npm test && npm run build

# 7. Export patches for documentation (optional)
stg export -d patches/

# 8. Commit patches
stg commit --all

# 9. Push to fork
git push origin main
```

### Handling Changelog Conflicts

**Always accept upstream's `Changelog.md`:**

```bash
# During merge conflict:
git checkout upstream/main -- Changelog.md
git add Changelog.md

# Our changes are tracked in CHANGELOG.QRIUS.md
```

---

## CI/CD Pipeline

**Workflow**: `.github/workflows/publish.yml`

**Trigger**: Push to `main` branch

**Steps**:

1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run tests
5. Build package
6. Publish to GitHub Packages (`@qrius/formio-react`)

---

## Custom Component Registration

```typescript
import { Formio } from '@qrius/formio-react';

// Register custom components
Formio.Components.register('customComponent', CustomComponent);

// Or use modules
import FormioFileUploadModule from '@formio/file-upload';
Formio.use(FormioFileUploadModule);
```

---

## Dual CHANGELOG Strategy

- **`Changelog.md`**: Upstream history (never modify, always accept upstream's version)
- **`CHANGELOG.QRIUS.md`**: Qrius-specific changes (document all our customizations)

This prevents merge conflicts and maintains clear separation.

---

## Repository Links

- **Upstream**: https://github.com/formio/react
- **This Fork**: https://github.com/QriusGlobal/formio-react
- **Monorepo**: https://github.com/mishaal79/formio-monorepo-private
- **Package Registry**: GitHub Packages (`@qrius` scope)
- **StGit Documentation**: https://stacked-git.github.io/

---

## Documentation

- **Original README**: [README.md](./README.md) - Upstream @formio/react documentation
- **AI Assistant Guide**: [CLAUDE.md](./CLAUDE.md) - Instructions for AI coding assistants
- **Qrius Changelog**: [CHANGELOG.QRIUS.md](./CHANGELOG.QRIUS.md) - Our change history
- **Git-Subrepo Workflow**: See `docs/GIT_SUBREPO_FORMIO_REACT.md` in monorepo
- **GitHub Packages Setup**: See `docs/GITHUB_PACKAGES_SETUP.md` in monorepo

---

## Troubleshooting

### StGit Not Initialized

```bash
stg init
```

### Patch Conflicts During Rebase

```bash
# Resolve conflicts
# ... edit files ...
git add <resolved-files>
stg refresh

# Continue applying patches
stg push
```

### Undo Recent Operations

```bash
# Undo last operation
stg undo

# Undo with working tree reset
stg undo --hard

# Undo multiple operations
stg undo -n 3
```

### View Patch History

```bash
# See all patches
stg series --description

# Show specific patch
stg show patch-name

# View with git tools
git log
gitk
```

---

**Maintained By**: Qrius Global  
**Fork Strategy**: Active Development with StGit  
**Last Updated**: 2025-10-13
