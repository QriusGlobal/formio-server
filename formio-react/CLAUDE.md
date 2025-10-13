# Claude Code Instructions - @qrius/formio-react Fork

> **AI Assistant Guide**: Instructions for working with the @qrius/formio-react active development fork using StGit.

---

## 🎯 Repository Identity

**Name**: @qrius/formio-react  
**Type**: Active development fork of @formio/react  
**Purpose**: Custom Form.io React components with continuous development  
**Patch Management**: StGit (Stacked Git)  
**Package Registry**: GitHub Packages (`@qrius` scope)  
**Upstream**: https://github.com/formio/react

---

## 🏗️ Architecture Overview

### Fork Strategy - Active Development

```
Upstream (formio/react)
     ↓ periodic sync
QriusGlobal/formio-react (This Repo - ACTIVE DEVELOPMENT)
     ├── StGit patches (managed as commits)
     ├── CI/CD → GitHub Packages (@qrius/formio-react)
     └── git-subrepo ← formio-monorepo/formio-react/
                       (Development Environment)
```

### Key Architectural Decisions

**1. Active Development Model**

- This is NOT static patch maintenance
- Continuous feature development
- Regular customizations and enhancements
- Upstream syncs with active patch rebasing

**2. StGit for Patch Management**

- ✅ Patches ARE git commits (no export needed)
- ✅ Interactive patch reordering
- ✅ Safe upstream rebasing
- ✅ Undo capability for all operations
- ✅ Git-native tooling compatibility

**3. Dependency Bundling**

- `@formio/js` and `@formio/core` bundled as regular dependencies
- Consuming apps only install `@qrius/formio-react`
- Zero dependency management for consumers

---

## 📐 StGit Workflow for AI Assistants

### Understanding StGit

**Core Concept**: Patches are commits that can be interactively managed.

```
Stack Top  →  [Patch C] ← Current patch (topmost)
              [Patch B]
Stack Base →  [Patch A]
              [Base Commit] ← Upstream main
```

**Key Principle**: Unlike quilt, you DON'T export/import patch files unless needed for documentation. Patches ARE the commits.

---

## 💻 Common Development Patterns

### Pattern 1: Creating New Features

```bash
# Start new feature
stg new feature-name -m "Add feature description"

# Make changes
# ... edit files ...

# Capture in patch
stg refresh

# View the patch
stg show

# Edit commit message if needed
stg edit
```

**AI Assistant**: When user asks for new feature, use this pattern.

---

### Pattern 2: Updating Existing Features

```bash
# If feature is on top (current):
# ... make changes ...
stg refresh

# If feature is NOT on top:
stg goto feature-name
# ... make changes ...
stg refresh

# Return to previous position
stg goto <previous-patch>
```

**AI Assistant**: You can update ANY patch, not just the topmost. Use `stg refresh -p patch-name` for direct updates.

---

### Pattern 3: Reordering Patches

```bash
# Move patch to top
stg float patch-name

# Move patch to bottom
stg sink patch-name

# View current order
stg series --description
```

**AI Assistant**: Reordering is safe. StGit handles conflicts automatically.

---

### Pattern 4: Upstream Sync

```bash
# Fetch upstream
git fetch upstream

# Rebase all patches
stg rebase upstream/main

# Handle conflicts if they occur:
# 1. Resolve conflicts in files
# 2. git add <files>
# 3. stg refresh
# 4. stg push (continue with next patches)
```

**AI Assistant**: ALWAYS use `stg rebase` for upstream syncs, not plain `git merge`.

---

### Pattern 5: Squashing/Combining Patches

```bash
# Combine multiple patches
stg squash patch1 patch2 patch3

# Or squash with range
stg squash --all
```

**AI Assistant**: Use when patches should be combined.

---

### Pattern 6: Undoing Mistakes

```bash
# Undo last operation
stg undo

# Undo with working tree reset
stg undo --hard

# Undo multiple operations
stg undo -n 3
```

**AI Assistant**: CRITICAL - If something goes wrong, immediately use `stg undo`.

---

## 🚨 Critical Rules for AI Assistants

### Rule 1: ALWAYS Initialize StGit

```bash
# Before any patch operations
stg init  # Initialize if not already done
stg series  # Check current state
```

### Rule 2: NEVER Mix Git and StGit Operations

❌ **WRONG**:

```bash
git commit -m "changes"  # Don't do this
stg refresh              # StGit won't see it properly
```

✅ **CORRECT**:

```bash
stg new my-patch
stg refresh
```

### Rule 3: Check State Before Operations

```bash
# Always check before modifying
stg series              # See all patches
stg status              # See working tree state
```

### Rule 4: Handle Conflicts Properly

```bash
# When rebase causes conflict:
# 1. DON'T panic
# 2. Resolve conflicts
# 3. git add <files>
# 4. stg refresh
# 5. stg push (continue)

# If too complex:
stg undo --hard  # Start over
```

### Rule 5: Export Patches Only for Documentation

```bash
# Patches ARE commits, no need to export normally
# Only export for documentation purposes:
stg export -d patches/
```

---

## 🔄 Workflow Examples

### Example 1: Add New Feature

**User Request**: "Add a new custom validator component"

**AI Response**:

```bash
# 1. Create patch
stg new custom-validator -m "Add custom email validator"

# 2. Create the files
# ... create src/validators/emailValidator.ts ...

# 3. Capture changes
stg refresh

# 4. Edit message for detail
stg edit
# Add detailed commit message

# 5. Test
npm test
npm run build

# 6. View the patch
stg show
```

---

### Example 2: Fix Bug in Existing Patch

**User Request**: "The custom-validator has a bug, fix it"

**AI Response**:

```bash
# 1. Jump to the patch
stg goto custom-validator

# 2. Fix the bug
# ... edit src/validators/emailValidator.ts ...

# 3. Update the patch
stg refresh

# 4. Return to top
stg push -a

# 5. Test
npm test
```

---

### Example 3: Upstream Sync

**User Request**: "Sync with upstream"

**AI Response**:

```bash
# 1. Check current state
stg series

# 2. Fetch upstream
git fetch upstream

# 3. Rebase
stg rebase upstream/main

# 4. If conflicts:
#    - Resolve conflicts
#    - git add <files>
#    - stg refresh
#    - stg push (continue)

# 5. Verify
stg series --description
npm test

# 6. Update CHANGELOG
# Edit CHANGELOG.QRIUS.md to document upstream sync
```

---

### Example 4: Reorder Patches

**User Request**: "Move the authentication patch before the validation patch"

**AI Response**:

```bash
# 1. View current order
stg series --description

# 2. Float authentication to top
stg float authentication-patch

# 3. Verify new order
stg series --description

# 4. If conflicts, resolve them
# 5. Test
npm test
```

---

## 🔍 Debugging StGit Issues

### Issue: "Conflicts during rebase"

**Solution**:

```bash
# 1. Don't panic
# 2. Resolve conflicts in files
# 3. Stage resolved files: git add <files>
# 4. Update patch: stg refresh
# 5. Continue: stg push
# 6. If too complex: stg undo --hard
```

### Issue: "Lost changes"

**Solution**:

```bash
# StGit uses git reflog
git reflog
stg undo
```

### Issue: "Patch order is wrong"

**Solution**:

```bash
# Reorder interactively
stg float <patch>
stg sink <patch>
stg goto <patch>
```

### Issue: "Need to see what patch does"

**Solution**:

```bash
stg show patch-name
stg series --description
```

---

## 📋 StGit Command Reference

### Patch Creation

| Command              | Purpose             |
| -------------------- | ------------------- |
| `stg new <name>`     | Create new patch    |
| `stg new -m "msg"`   | Create with message |
| `stg delete <patch>` | Delete a patch      |

### Patch Modification

| Command                  | Purpose               |
| ------------------------ | --------------------- |
| `stg refresh`            | Update current patch  |
| `stg refresh -p <patch>` | Update specific patch |
| `stg edit`               | Edit commit message   |

### Stack Navigation

| Command                    | Purpose               |
| -------------------------- | --------------------- |
| `stg series`               | List all patches      |
| `stg series --description` | List with messages    |
| `stg goto <patch>`         | Jump to patch         |
| `stg push`                 | Apply next patch      |
| `stg pop`                  | Unapply current patch |

### Stack Manipulation

| Command                | Purpose            |
| ---------------------- | ------------------ |
| `stg float <patch>`    | Move to top        |
| `stg sink <patch>`     | Move to bottom     |
| `stg squash <patches>` | Combine patches    |
| `stg rebase <branch>`  | Rebase onto branch |

### Inspection

| Command            | Purpose                   |
| ------------------ | ------------------------- |
| `stg show`         | Show current patch        |
| `stg show <patch>` | Show specific patch       |
| `stg diff`         | Show working tree changes |
| `stg status`       | Git status alias          |

### Safety

| Command             | Purpose              |
| ------------------- | -------------------- |
| `stg undo`          | Undo last operation  |
| `stg undo --hard`   | Undo with tree reset |
| `stg undo -n <num>` | Undo multiple        |

### Finalization

| Command               | Purpose                    |
| --------------------- | -------------------------- |
| `stg commit -a`       | Convert patches to commits |
| `stg export -d <dir>` | Export patch files         |

---

## ✅ AI Assistant Checklist

Before suggesting changes:

- [ ] Is StGit initialized? (`stg series`)
- [ ] Check current patch state
- [ ] Use `stg new` for new features
- [ ] Use `stg refresh` to capture changes
- [ ] Use `stg goto` to modify non-top patches
- [ ] Use `stg rebase` for upstream syncs
- [ ] Test after changes (`npm test && npm run build`)
- [ ] Consider `stg undo` if something goes wrong

---

## 🚫 Common Mistakes to Avoid

### ❌ Mistake 1: Using git commit

**Wrong**:

```bash
git commit -m "changes"
```

**Right**:

```bash
stg new feature
stg refresh
```

### ❌ Mistake 2: Forgetting to refresh

**Wrong**:

```bash
stg new feature
# ... edit files ...
stg new next-feature  # Previous patch is empty!
```

**Right**:

```bash
stg new feature
# ... edit files ...
stg refresh  # Capture changes first!
stg new next-feature
```

### ❌ Mistake 3: Manual conflict resolution without stg

**Wrong**:

```bash
stg rebase upstream/main
# ... conflicts ...
git add .
git commit  # Wrong!
```

**Right**:

```bash
stg rebase upstream/main
# ... conflicts ...
git add <resolved-files>
stg refresh  # Update the patch
stg push  # Continue
```

---

## 🔗 Related Documentation

- **Fork README**: [README.FORK.md](./README.FORK.md) - User guide
- **Qrius Changelog**: [CHANGELOG.QRIUS.md](./CHANGELOG.QRIUS.md) - Change history
- **StGit Official Docs**: https://stacked-git.github.io/
- **StGit Tutorial**: https://stacked-git.github.io/guides/tutorial/
- **Monorepo Guide**: `../CLAUDE.md` - Main development environment

---

## 🎓 Learning Resources

### For AI Assistants

1. **StGit is NOT quilt** - Patches are commits, not files
2. **Interactive by default** - Can jump to any patch
3. **Git-native** - Works with all git tools
4. **Safe** - Full undo capability
5. **Active development** - Not static patch maintenance

### Quick Mental Model

```
StGit Stack = Git Branch with Interactive Rebase Superpowers

Each patch = A commit you can:
  - Jump to
  - Modify
  - Reorder
  - Squash
  - Undo
```

---

**Last Updated**: 2025-10-13  
**Fork Version**: Based on @formio/react v6.1.x  
**Maintained By**: Qrius Global  
**Patch Management**: StGit (Stacked Git)  
**AI Assistant**: Optimized for active development workflows
