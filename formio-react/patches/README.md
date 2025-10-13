# Qrius Patches for @qrius/formio-react

This directory contains patch files documenting all customizations made to the upstream `@formio/react` repository.

## Current Patches

### 0001-bundle-dependencies.patch

**Status**: Active  
**Created**: 2025-10-13  
**Upstream Status**: Cannot contribute (Qrius-specific requirement)

**Changes**:

- Moved `@formio/js` and `@formio/core` from `peerDependencies` to `dependencies`
- Updated package name from `@formio/react` to `@qrius/formio-react`
- Added `publishConfig` for GitHub Packages

**Rationale**:
The entire point of this private package is zero-dependency management for consuming apps. Apps should only install `@qrius/formio-react`, not manage Form.io dependencies separately.

**Files Modified**:

- `package.json`

---

### 0002-export-formio-instance.patch

**Status**: Active  
**Created**: 2025-10-13  
**Upstream Status**: Cannot contribute (Qrius-specific requirement)

**Changes**:

- Added `export { Formio } from '@formio/js'` to `src/index.ts`

**Rationale**:
Consuming apps need access to the `Formio` instance for:

- Registering custom components: `Formio.Components.register()`
- Using Form.io modules: `Formio.use(module)`
- Accessing Form.io SDK: `new Formio(url)`

**Files Modified**:

- `src/index.ts`

---

### 0003-github-packages-workflow.patch

**Status**: Active  
**Created**: 2025-10-13  
**Upstream Status**: Cannot contribute (Qrius-specific infrastructure)

**Changes**:

- Added `.github/workflows/publish.yml` for automatic publishing to GitHub Packages

**Rationale**:
CI/CD pipeline for publishing private package to GitHub Packages on push to `main` branch.

**Files Modified**:

- `.github/workflows/publish.yml` (new file)

---

## Patch Management

### Generating Patches

```bash
# Generate all patches from upstream/main
cd formio-react/
./scripts/manage-patches.sh generate
```

### Applying Patches

```bash
# Apply all patches in sequence
./scripts/manage-patches.sh apply
```

### Checking Patches

```bash
# Verify patches apply cleanly
./scripts/manage-patches.sh check
```

### Listing Patches

```bash
# List all current patches
./scripts/manage-patches.sh list
```

## Upstream Merge Workflow

When merging upstream changes:

1. **Before merge**: Generate patches to save current state

    ```bash
    ./scripts/manage-patches.sh generate
    ```

2. **Merge upstream**: Pull changes from upstream

    ```bash
    git fetch upstream
    git merge upstream/main
    ```

3. **Resolve conflicts**: Handle any merge conflicts
    - Always accept upstream's `Changelog.md`
    - Carefully merge `package.json` (preserve Qrius customizations)
    - Preserve Formio export in `src/index.ts`

4. **Verify changes**: Ensure customizations are intact

    ```bash
    npm test
    npm run build
    ```

5. **Regenerate patches**: Update patch files

    ```bash
    ./scripts/manage-patches.sh generate
    ```

6. **Update CHANGELOG**: Document merge in `CHANGELOG.QRIUS.md`

## Patch File Format

Each patch file follows standard `git format-patch` format:

```diff
From <commit-hash> Mon Sep 17 00:00:00 2001
From: Author Name <author@example.com>
Date: Mon, 13 Oct 2025 13:00:00 +0000
Subject: [PATCH] Short description

Detailed explanation of change.

Qrius-Specific: Reason for customization
Upstream Status: Cannot contribute / Contributed (PR link)

---
 file.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

diff --git a/file.ts b/file.ts
index abc123..def456 100644
--- a/file.ts
+++ b/file.ts
@@ -1 +1 @@
-old line
+new line
```

## Contributing New Patches

When adding new customizations:

1. **Make changes**: Edit files as needed
2. **Commit**: Use structured commit message

    ```bash
    git commit -m "feat(qrius): short description

    Detailed explanation.

    Qrius-Specific: Reason
    Upstream Status: Cannot contribute / Will contribute
    "
    ```

3. **Generate patch**: Create patch file
    ```bash
    ./scripts/manage-patches.sh generate
    ```
4. **Document**: Add entry to this README
5. **Update CHANGELOG**: Add to `CHANGELOG.QRIUS.md`

## Links

- **Upstream Repository**: https://github.com/formio/react
- **Qrius Fork**: https://github.com/QriusGlobal/formio-react
- **Documentation**: See `../docs/FORK_MAINTENANCE_BEST_PRACTICES.md`
- **CHANGELOG**: See `../CHANGELOG.QRIUS.md`
