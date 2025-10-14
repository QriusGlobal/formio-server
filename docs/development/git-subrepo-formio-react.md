# Git-Subrepo Setup for formio-react

## Overview

`formio-react/` is managed as a **git-subrepo** linked to our fork at `QriusGlobal/formio-react`.

**Fork**: https://github.com/QriusGlobal/formio-react
**Upstream**: https://github.com/formio/react

## Architecture

```
QriusGlobal/formio-react (Fork Repository)
├── main branch                # Qrius customizations
│   ├── Package: @qrius/formio-react
│   ├── Formio export added
│   ├── GitHub Packages publishConfig
│   └── Workflow: .github/workflows/publish.yml
│
├── upstream-sync branch       # Clean upstream tracking
│   └── Synced with formio/react
│
└── git-subrepo pulls into monorepo/formio-react/
```

## Qrius Customizations

### 1. Package Name
```json
{
  "name": "@qrius/formio-react"
}
```

### 2. Formio Export (src/index.ts)
```typescript
export { Formio, Components, Utils, Templates } from '@formio/js';
```

### 3. GitHub Packages Config
```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 4. Publishing Workflow
Located in fork at `.github/workflows/publish.yml`
- Publishes to GitHub Packages on push to main
- Creates `@qrius/formio-react` package

## Git-Subrepo Commands

### Pull Latest from Fork
```bash
cd /path/to/monorepo
git subrepo pull formio-react
```

### Push Local Changes to Fork
```bash
cd /path/to/monorepo
git subrepo push formio-react
```

### Check Subrepo Status
```bash
git subrepo status formio-react
```

### View Subrepo Configuration
```bash
cat formio-react/.gitrepo
```

## Syncing Upstream Changes

### 1. Update Fork's upstream-sync Branch
```bash
# Clone fork locally
git clone https://github.com/QriusGlobal/formio-react.git
cd formio-react

# Fetch upstream
git remote add upstream https://github.com/formio/react.git
git fetch upstream

# Update upstream-sync branch
git checkout upstream-sync
git merge upstream/main
git push origin upstream-sync
```

### 2. Merge into Fork's Main
```bash
git checkout main
git merge upstream-sync

# Resolve conflicts (keep Qrius changes):
# - package.json: Keep @qrius/formio-react name
# - src/index.ts: Keep Formio export
# - publishConfig: Keep GitHub Packages config

git commit
git push origin main
```

### 3. Pull into Monorepo
```bash
cd /path/to/monorepo
git subrepo pull formio-react
```

## Workflow: Making Changes

### Option A: Change in Monorepo (Quick Iteration)
```bash
# Make changes in monorepo/formio-react/
vim formio-react/src/SomeComponent.tsx

# Commit to monorepo
git add formio-react/
git commit -m "feat: update component"

# Push to fork
git subrepo push formio-react

# Fork workflow auto-publishes to GitHub Packages
```

### Option B: Change in Fork (Major Updates)
```bash
# Clone fork
git clone https://github.com/QriusGlobal/formio-react.git
cd formio-react

# Make changes
vim src/SomeComponent.tsx

# Commit and push
git commit -am "feat: update component"
git push origin main

# Workflow auto-publishes to GitHub Packages

# Pull into monorepo
cd /path/to/monorepo
git subrepo pull formio-react
```

## Publishing

### Automatic (Recommended)
Push to fork's `main` branch triggers workflow:
- Builds package
- Runs tests
- Publishes to GitHub Packages as `@qrius/formio-react@6.1.0`

### Manual
```bash
cd formio-react
npm version patch  # or minor, major
git push origin main  # Triggers workflow
```

## Troubleshooting

### "Subrepo out of sync"
```bash
git subrepo clean formio-react
git subrepo pull formio-react
```

### "Conflicts during pull"
```bash
git subrepo pull formio-react
# Resolve conflicts
git add .
git commit
```

### "Want to reset to fork state"
```bash
git subrepo clone https://github.com/QriusGlobal/formio-react.git formio-react --force
```

## References

- Git-Subrepo Docs: https://github.com/ingydotnet/git-subrepo
- Fork Repository: https://github.com/QriusGlobal/formio-react
- GitHub Packages: https://github.com/orgs/QriusGlobal/packages
- Upstream: https://github.com/formio/react
