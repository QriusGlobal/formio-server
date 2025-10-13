# @qrius/formio-react

> **IMPORTANT**: This is a private fork of [@formio/react](https://github.com/formio/react) maintained by Qrius Global for custom Form.io component integration.

## Fork Structure

```
formio/react (Upstream)
     ↓ fork
QriusGlobal/formio-react (This Repository)
     ├── Package: @qrius/formio-react (GitHub Packages)
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

**Why?** The entire point of this private package is that consuming apps should **ONLY** install `@qrius/formio-react`, not manage Form.io dependencies separately.

### 3. Exports

```typescript
// Additional export for component registration
export { Formio } from '@formio/js';
```

### 4. Publishing

- **Registry**: GitHub Packages (`ghcr.io`)
- **Scope**: `@qrius` (private package)
- **Workflow**: `.github/workflows/publish.yml` auto-publishes on push to `main`

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

## GitHub Packages Setup

See [docs/GITHUB_PACKAGES_SETUP.md](../docs/GITHUB_PACKAGES_SETUP.md) in the monorepo for authentication setup.

## Development Workflow

This fork is managed via **git-subrepo** from the main monorepo at `mishaal79/formio-monorepo-private`.

### From Monorepo (Recommended)

```bash
# Make changes in monorepo
cd formio-monorepo/formio-react/
# ... edit files ...

# Push changes to fork
git subrepo push formio-react

# Pull updates from fork
git subrepo pull formio-react
```

### Direct in Fork (Not Recommended)

```bash
# Clone fork directly
git clone git@github.com:QriusGlobal/formio-react.git
cd formio-react

# Make changes
# ... edit files ...

# Push to trigger CI/CD
git push origin main
```

## Syncing Upstream Changes

```bash
# Add upstream remote (if not already added)
git remote add upstream https://github.com/formio/react.git

# Fetch upstream changes
git fetch upstream

# Merge from upstream/main
git checkout main
git merge upstream/main

# Resolve conflicts (if any)
# ... fix conflicts ...

# Push to fork
git push origin main
```

**Best Practice**: Use `upstream-sync` branch for clean upstream tracking:

```bash
git checkout -b upstream-sync upstream/main
git push origin upstream-sync
```

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

**Package Versions**: Follows upstream version + custom pre-release tags

## Custom Component Registration

```typescript
import { Formio } from '@qrius/formio-react';

// Register custom components
Formio.Components.register('customComponent', CustomComponent);

// Or use modules
import FormioFileUploadModule from '@formio/file-upload';
Formio.use(FormioFileUploadModule);
```

## Repository Links

- **Upstream**: https://github.com/formio/react
- **This Fork**: https://github.com/QriusGlobal/formio-react
- **Monorepo**: https://github.com/mishaal79/formio-monorepo-private
- **Package Registry**: GitHub Packages (`@qrius` scope)

## Documentation

- **Original README**: See below or [upstream README](https://github.com/formio/react/blob/main/README.md)
- **Git-Subrepo Workflow**: See `docs/GIT_SUBREPO_FORMIO_REACT.md` in monorepo
- **GitHub Packages Setup**: See `docs/GITHUB_PACKAGES_SETUP.md` in monorepo

---

# Original @formio/react Documentation

The following is the original README from [@formio/react](https://github.com/formio/react):

---

[Original README content continues below - kept for reference]
