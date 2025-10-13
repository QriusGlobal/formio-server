# Claude Code Instructions - @qrius/formio-react Fork

> **AI Assistant Guide**: Instructions for working with the @qrius/formio-react fork repository.

---

## 🎯 Repository Identity

**Name**: @qrius/formio-react  
**Type**: Private fork of @formio/react  
**Purpose**: Custom Form.io React components with bundled dependencies for Qrius Global  
**Package Registry**: GitHub Packages (`@qrius` scope)  
**Upstream**: https://github.com/formio/react

---

## 🏗️ Architecture Overview

### Fork Strategy

```
Upstream (formio/react)
     ↓
     fork → QriusGlobal/formio-react (This Repo)
              ├── CI/CD → GitHub Packages (@qrius/formio-react)
              └── git-subrepo ← formio-monorepo/formio-react/
                                (Development Environment)
```

### Key Architectural Decisions

**1. Dependency Bundling**

- ✅ `@formio/js` and `@formio/core` are **regular dependencies** (NOT peer dependencies)
- ✅ Consuming apps only install `@qrius/formio-react`
- ❌ Consuming apps should NOT install `@formio/js` separately

**Rationale**: The entire point of this private package is zero dependency management for consuming apps.

**2. Git-Subrepo Integration**

- This fork is managed via `git-subrepo` from `mishaal79/formio-monorepo-private`
- Development happens in monorepo, changes pushed to fork
- `.gitrepo` file contains subrepo metadata

**3. CI/CD Pipeline**

- Workflow: `.github/workflows/publish.yml`
- Trigger: Push to `main` branch
- Publishes: `@qrius/formio-react` to GitHub Packages

---

## 📐 File Structure

```
QriusGlobal/formio-react/
├── src/                        # React components
│   ├── components/            # Form, FormBuilder, etc.
│   ├── modules/               # Redux modules
│   ├── hooks/                 # React hooks
│   └── index.ts              # Main entry (MODIFIED: exports Formio)
├── .github/
│   └── workflows/
│       └── publish.yml        # CI/CD pipeline (CUSTOM)
├── package.json               # MODIFIED: name, dependencies, publishConfig
├── README.md                  # Original upstream README
├── README.FORK.md             # Fork-specific documentation (CUSTOM)
├── CLAUDE.md                  # This file (CUSTOM)
├── .gitrepo                   # Git-subrepo metadata (AUTO-GENERATED)
└── [other upstream files]
```

### Modified Files (vs Upstream)

1. **`package.json`**
    - `name`: `@formio/react` → `@qrius/formio-react`
    - `dependencies`: Added `@formio/js` and `@formio/core`
    - `peerDependencies`: Removed `@formio/js` and `@formio/core`
    - `publishConfig`: Added GitHub Packages registry

2. **`src/index.ts`**
    - Added: `export { Formio } from '@formio/js';`

3. **`.github/workflows/publish.yml`** (NEW)
    - Auto-publishes to GitHub Packages on push to `main`

---

## 💻 Development Patterns

### Making Changes to the Fork

#### Option 1: Via Monorepo (RECOMMENDED)

```bash
# Navigate to monorepo subrepo
cd formio-monorepo/formio-react/

# Make changes
# ... edit files ...

# Push changes to fork
git subrepo push formio-react

# This will:
# 1. Create a commit in the fork
# 2. Trigger CI/CD workflow
# 3. Publish new package version
```

#### Option 2: Direct in Fork (NOT RECOMMENDED)

```bash
# Clone fork directly
git clone git@github.com:QriusGlobal/formio-react.git
cd formio-react

# Make changes
# ... edit files ...

# Push to trigger CI/CD
git push origin main
```

**Why Option 1?** Git-subrepo keeps monorepo and fork in sync automatically.

### Syncing Upstream Changes

```bash
# From within monorepo subrepo
cd formio-monorepo/formio-react/

# Add upstream remote (if not already added)
git remote add upstream https://github.com/formio/react.git

# Fetch upstream changes
git fetch upstream

# Create upstream-sync branch
git checkout -b upstream-sync upstream/main

# Merge into main
git checkout main
git merge upstream-sync

# Resolve conflicts
# ... fix conflicts ...

# Push to fork via git-subrepo
cd ..
git subrepo push formio-react
```

### Dependency Management Rules

**CRITICAL**: Do NOT move `@formio/js` or `@formio/core` back to `peerDependencies`. They must remain as regular `dependencies`.

```json
// ✅ CORRECT (Current State)
{
  "dependencies": {
    "@formio/js": "^5.1.1",
    "@formio/core": "^2.4.0"
  }
}

// ❌ WRONG (Upstream State)
{
  "peerDependencies": {
    "@formio/js": "^5.1.1",
    "@formio/core": "^2.4.0"
  }
}
```

---

## 🧪 Testing Strategy

### Before Pushing Changes

```bash
# Run tests
npm test

# Build package
npm run build

# Check TypeScript
npm run typecheck

# Lint code
npm run lint
```

### Testing in Consuming App

```bash
# In monorepo
cd form-client-web-app/

# Install local package
npm install ../formio-react

# Test component registration
npm run dev
```

---

## 🚀 CI/CD Pipeline

### Workflow Trigger

**File**: `.github/workflows/publish.yml`

**Triggers**:

- Push to `main` branch
- Manual workflow dispatch

### Workflow Steps

1. **Setup**
    - Checkout code
    - Setup Node.js 20
    - Setup GitHub Packages authentication

2. **Build**
    - Install dependencies
    - Run tests
    - Build package

3. **Publish**
    - Publish to GitHub Packages (`@qrius/formio-react`)
    - Tag commit with version

### Checking Workflow Status

```bash
# List recent workflow runs
gh run list --repo QriusGlobal/formio-react --limit 5

# Watch active workflow
gh run watch --repo QriusGlobal/formio-react

# View workflow logs
gh run view <run-id> --repo QriusGlobal/formio-react
```

---

## ✅ AI Assistant Best Practices

### When Working with This Repository

1. **Always Respect Dependency Bundling**
    - Never suggest moving `@formio/js` to `peerDependencies`
    - Never suggest adding `@formio/js` to consuming apps

2. **Understand Git-Subrepo Context**
    - This repo is managed from monorepo
    - Changes should ideally happen in monorepo, not directly in fork
    - `.gitrepo` file is auto-generated, do NOT edit manually

3. **Follow Upstream Conventions**
    - Code style should match upstream `@formio/react`
    - Only add custom changes when necessary
    - Document all deviations from upstream

4. **CI/CD Awareness**
    - Every push to `main` triggers CI/CD
    - CI/CD failures block package publishing
    - Always run tests before pushing

### Code Review Checklist

When reviewing or suggesting code changes:

- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] TypeScript types are correct (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] `@formio/js` remains in `dependencies` (not `peerDependencies`)
- [ ] Changes documented in commit message
- [ ] Upstream compatibility considered

### Security Considerations

1. **Never commit secrets**
    - No GitHub tokens in code
    - No API keys in source files
    - Use GitHub Secrets for CI/CD credentials

2. **Validate custom components**
    - Always sanitize user input
    - Follow Form.io security best practices
    - Test components for XSS vulnerabilities

3. **Dependency auditing**
    - Run `npm audit` before releases
    - Keep dependencies up to date
    - Monitor upstream security advisories

---

## 🗺️ Navigation Map

### Key Files for AI Assistants

| File                            | Purpose                             | Modify?                     |
| ------------------------------- | ----------------------------------- | --------------------------- |
| `src/index.ts`                  | Main entry point with Formio export | ✅ Yes (custom export)      |
| `package.json`                  | Package configuration               | ✅ Yes (name, deps)         |
| `.github/workflows/publish.yml` | CI/CD pipeline                      | ✅ Yes (custom workflow)    |
| `README.FORK.md`                | Fork documentation                  | ✅ Yes (fork-specific)      |
| `CLAUDE.md`                     | This file                           | ✅ Yes (AI instructions)    |
| `.gitrepo`                      | Git-subrepo metadata                | ❌ No (auto-generated)      |
| `src/components/*`              | React components                    | ⚠️ Rarely (prefer upstream) |

### Common Tasks

**Task**: Add new custom component

```bash
1. Create component in src/components/
2. Export from src/index.ts
3. Add tests
4. Update README.FORK.md
5. Push via git-subrepo
```

**Task**: Update from upstream

```bash
1. git fetch upstream
2. git merge upstream/main
3. Resolve conflicts
4. Verify custom changes intact
5. Push via git-subrepo
```

**Task**: Fix CI/CD failure

```bash
1. Check workflow logs: gh run view <run-id>
2. Reproduce locally: npm test && npm run build
3. Fix issue
4. Push fix
5. Monitor workflow: gh run watch
```

---

## 📚 Related Documentation

- **Monorepo CLAUDE.md**: `../CLAUDE.md` - Main development environment
- **Git-Subrepo Workflow**: `../docs/GIT_SUBREPO_FORMIO_REACT.md` - Subrepo operations
- **GitHub Packages Setup**: `../docs/GITHUB_PACKAGES_SETUP.md` - Authentication
- **Upstream README**: `README.md` - Original @formio/react docs

---

## 🔄 Workflow Examples

### Complete Development Workflow

```bash
# 1. Navigate to monorepo subrepo
cd formio-monorepo/formio-react/

# 2. Create feature branch in monorepo
git checkout -b feature/custom-component

# 3. Make changes
# ... edit files ...

# 4. Test locally
npm test
npm run build

# 5. Commit in monorepo
git add .
git commit -m "feat: add custom component"

# 6. Push to monorepo
git push origin feature/custom-component

# 7. After PR merge to monorepo main, push to fork
git checkout main
git pull
git subrepo push formio-react

# 8. Verify CI/CD
gh run watch --repo QriusGlobal/formio-react
```

### Emergency Hotfix Workflow

```bash
# 1. Clone fork directly
git clone git@github.com:QriusGlobal/formio-react.git
cd formio-react

# 2. Create hotfix branch
git checkout -b hotfix/critical-bug

# 3. Fix bug
# ... edit files ...

# 4. Test
npm test
npm run build

# 5. Push to fork
git push origin hotfix/critical-bug

# 6. Create PR to fork main
gh pr create --title "Hotfix: Critical Bug" --body "Description"

# 7. After merge, sync back to monorepo
cd ../formio-monorepo/
git subrepo pull formio-react
```

---

**Last Updated**: 2025-01-13  
**Fork Version**: Based on @formio/react v6.1.x  
**Maintained By**: Qrius Global  
**AI Assistant**: Optimized for Claude Code

---
