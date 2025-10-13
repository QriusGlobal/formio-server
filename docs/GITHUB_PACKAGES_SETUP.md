# GitHub Packages Setup for @qrius/formio-react

This document explains how to use and publish the `@qrius/formio-react` package
via GitHub Packages.

## 📦 Package Information

- **Package Name**: `@qrius/formio-react`
- **Registry**: GitHub Packages (https://npm.pkg.github.com)
- **Repository**:
  [QriusGlobal/formio-react](https://github.com/QriusGlobal/formio-react)
- **Visibility**: Private
- **Current Version**: 6.1.0

## 🔑 Authentication

### For Local Development

1. Create a GitHub Personal Access Token (PAT):
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Select scopes: `read:packages`, `write:packages` (if publishing)
   - Copy the token (starts with `ghp_`)

2. Configure npm to use GitHub Packages:

   ```bash
   # Add to ~/.npmrc (global) or project .npmrc (local)
   @qrius:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT_HERE
   ```

3. Alternatively, use environment variable:
   ```bash
   export GITHUB_TOKEN=your_github_pat_here
   npm install
   ```

### For CI/CD

GitHub Actions automatically provides `GITHUB_TOKEN` with necessary permissions.
No additional configuration needed for workflows.

## 📥 Installing the Package

### In Development (Monorepo)

The package is linked via `workspace` protocol:

```json
{
  "dependencies": {
    "@formio/react": "file:../formio-react" // Local file reference
  }
}
```

Changes to `formio-react/` are immediately available.

### In Production (After Publishing)

Install from GitHub Packages:

```bash
npm install @qrius/formio-react@6.1.0
```

Or add to package.json:

```json
{
  "dependencies": {
    "@qrius/formio-react": "^6.1.0"
  }
}
```

## 📤 Publishing New Versions

### Automated Publishing (Recommended)

The package auto-publishes when changes are pushed to `formio-react/` on the
`main` branch.

**Workflow**: `.github/workflows/publish-formio-react.yml`

1. Make changes to `formio-react/`
2. Commit and push to `main`:
   ```bash
   git add formio-react/
   git commit -m "feat: add new component"
   git push origin main
   ```
3. GitHub Actions automatically:
   - Runs tests
   - Builds the package
   - Publishes to GitHub Packages
   - Creates git tag

### Manual Publishing

If you need to publish manually:

```bash
cd formio-react

# Authenticate (if not already)
npm login --scope=@qrius --registry=https://npm.pkg.github.com

# Bump version
npm version patch  # or minor, major

# Build
npm run build

# Publish
npm publish
```

### Version Bumping Strategy

- **Patch** (6.1.0 → 6.1.1): Bug fixes, small changes
- **Minor** (6.1.0 → 6.2.0): New features, backward compatible
- **Major** (6.1.0 → 7.0.0): Breaking changes

## 🔧 Key Changes from Upstream

### 1. Package Name

- **Upstream**: `@formio/react`
- **Qrius**: `@qrius/formio-react`

### 2. Formio Export Added

```typescript
// formio-react/src/index.ts
export { Formio, Components, Utils, Templates } from '@formio/js';
```

**Why**: Allows convenient import in monorepo without direct `@formio/js`
dependency.

### 3. Peer Dependencies Maintained

```json
{
  "peerDependencies": {
    "@formio/js": "^5.1.1",
    "react": "^15.3.0 || ... || ^19.0.0",
    "react-dom": "^15.3.0 || ... || ^19.0.0"
  }
}
```

**Why**: App controls `@formio/js` version, not the library.

## 🏗️ Architecture Decisions

### Why Peer Dependencies?

**Separation of Concerns**:

- App decides `@formio/js` version
- Library compatible with range `^5.1.1`
- Multiple apps can use different versions
- Single `@formio/js` instance guaranteed by package manager

### Why GitHub Packages?

**Zero Infrastructure**:

- No server maintenance
- Free for private repos
- Integrated with GitHub Actions
- Access control via GitHub teams
- Version history in GitHub UI

### Development vs Production

**Development** (workspace):

```bash
pnpm install  # Uses local formio-react/
pnpm dev      # Instant hot reload
```

**Production** (registry):

```bash
npm install @qrius/formio-react@1.2.4  # From GitHub Packages
docker build  # Isolated build
```

## 🐛 Troubleshooting

### "401 Unauthorized" when installing

**Problem**: Missing or invalid GitHub PAT

**Solution**:

```bash
# Verify token has read:packages scope
gh auth status

# Or regenerate token
gh auth login --with-token < new_token.txt
```

### "404 Not Found" for @qrius/formio-react

**Problem**: Package not published yet

**Solution**:

```bash
# Check if package exists
gh api /user/packages?package_type=npm

# Manually trigger publish workflow
gh workflow run "Publish @qrius/formio-react to GitHub Packages" --ref main
```

### Import error: Cannot find module '@formio/react'

**Problem**: TypeScript looking for old package name

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or rebuild formio-react
cd formio-react && npm run build
```

### CSS files missing in build

**Problem**: `copy-files` script not run

**Solution**:

```bash
cd formio-react
npm run copy-files
```

## 📚 Related Documentation

- [GitHub Packages npm registry docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Peer Dependencies guide](https://nodejs.org/en/blog/npm/peer-dependencies/)
- [Semantic Versioning](https://semver.org/)
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Qrius Platform architecture
- [GIT_SUBREPO_WORKFLOW.md](./GIT_SUBREPO_WORKFLOW.md) - Upstream sync workflow

## 🔄 Upstream Sync

When syncing from upstream `formio/react`:

```bash
# Pull upstream changes (git-subrepo)
git subrepo pull formio-react --branch=main

# Reapply Qrius changes (automated via patch)
cd formio-react
git apply ../patches/formio-react-qrius.patch

# Test and publish
npm run build && npm test
npm version minor
git push  # Auto-publishes via CI/CD
```

---

**Last Updated**: 2025-01-13 **Maintainer**: Qrius Development Team
