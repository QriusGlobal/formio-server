# Production Build Obfuscation - Quick Start Guide

## TL;DR

**Obfuscation implemented but blocked by pre-existing TypeScript errors.**

## Quick Commands

### Build Production Bundle (Full Obfuscation)

```bash
cd form-client-web-app
npm run build:prod
```

### Build Development Bundle (Readable)

```bash
cd form-client-web-app
npm run build:dev
```

### Analyze Bundle Size

```bash
cd form-client-web-app
npm run build:analyze
# Opens stats.html in browser
```

### Build Package (Production)

```bash
cd packages/formio-file-upload
npm run build:prod
```

## What Gets Obfuscated

| Feature        | Development                     | Production        |
| -------------- | ------------------------------- | ----------------- |
| Variable Names | `uploadFile`, `formioComponent` | `a`, `b`, `c`     |
| Console Logs   | ✅ Kept                         | ❌ Removed        |
| Comments       | ✅ Kept                         | ❌ Stripped       |
| Source Maps    | ✅ Generated                    | ❌ None           |
| File Names     | `vendor-formio-abc123.js`       | `7a3f9e2d.js`     |
| Import Paths   | `@formio/js`                    | `@internal/forms` |

## Verification Checklist

After `npm run build:prod`:

```bash
# 1. No brand strings
grep -r "formio" dist/     # Should be EMPTY
grep -r "uppy" dist/       # Should be EMPTY

# 2. No console statements
grep -r "console.log" dist/   # Should be EMPTY

# 3. No source maps
find dist/ -name "*.map"   # Should be EMPTY

# 4. Hash-only filenames
ls dist/assets/            # Should see: 7a3f9e2d.js (not vendor-formio-abc123.js)
```

## Configuration Files

### Environment Variables

**Production** (`.env.production`):

```bash
VITE_ENABLE_SOURCE_MAPS=false
VITE_OBFUSCATE_BUNDLE=true
```

**Development** (`.env.development`):

```bash
VITE_ENABLE_SOURCE_MAPS=true
VITE_OBFUSCATE_BUNDLE=false
```

### Build Scripts

```json
{
  "scripts": {
    "build:prod": "vite build --mode production",
    "build:dev": "vite build --mode development",
    "build:analyze": "vite build --mode analyze"
  }
}
```

## Current Blockers

### ⚠️ Pre-existing TypeScript Errors

**These existed BEFORE obfuscation was added:**

1. Missing `@formio/js` module in form-client-web-app
2. Private property access in `src/main.tsx:42`
3. Unused variables in `packages/formio-file-upload`
4. Missing `@types/node` package

### Quick Fixes

```bash
# Fix 1: Add missing types
cd packages/formio-file-upload
npm install -D @types/node

# Fix 2: Install @formio/js OR update imports
cd form-client-web-app
npm install @formio/js
# OR change imports to use @qrius/formio-react exports

# Fix 3: Remove unused variables
# Edit: packages/formio-file-upload/src/components/TusFileUpload/Component.ts
# Remove or comment out unused variables
```

## Rollback

### Temporary Disable

```bash
echo "VITE_OBFUSCATE_BUNDLE=false" >> form-client-web-app/.env.production
npm run build:prod
```

### Full Rollback

```bash
git checkout HEAD -- form-client-web-app/vite.config.ts
git checkout HEAD -- form-client-web-app/package.json
git checkout HEAD -- packages/formio-file-upload/rollup.config.js
```

## Terser Configuration (What Makes It Work)

```javascript
terserOptions: {
  compress: {
    drop_console: true,        // Remove console.log
    drop_debugger: true,        // Remove debugger
    passes: 2                   // Optimize twice
  },
  mangle: {
    toplevel: true             // Rename everything
  },
  format: {
    comments: false            // Strip comments
  }
}
```

## Bundle Size Expectations

| Build Type  | Size    | Gzipped |
| ----------- | ------- | ------- |
| Development | ~800 KB | ~200 KB |
| Production  | ~300 KB | ~90 KB  |
| **Savings** | **62%** | **55%** |

## Security Level

| Protection Against         | Level     |
| -------------------------- | --------- |
| Casual Inspection          | 🟢 High   |
| Competitor Analysis        | 🟢 High   |
| Brand Discovery            | 🟢 High   |
| Determined Attacker        | 🟡 Medium |
| Expert Reverse Engineering | 🔴 Low    |

**Note**: No client-side obfuscation is 100% secure. This is security through
obscurity.

## Testing Production Build

```bash
# 1. Build
npm run build:prod

# 2. Preview locally
npm run preview

# 3. Test in browser
open http://localhost:64849

# 4. Check DevTools
# - Network tab: Verify no .map files
# - Sources tab: Code should be unreadable
# - Console: No console.log output
```

## Documentation

📚 **Full Documentation**: `docs/PRODUCTION_BUILD_OBFUSCATION.md`  
📋 **Implementation Summary**: `OBFUSCATION_IMPLEMENTATION_SUMMARY.md`  
⚡ **Quick Start**: This file

## Support

**Issues?** Check:

1. TypeScript errors blocking builds
2. Environment variables correctly set
3. Dependencies installed (`@rollup/plugin-replace`, `rollup-plugin-visualizer`)
4. Build mode specified (`--mode production`)

---

**Status**: ✅ Configured | ⚠️ Verification Pending (TypeScript fixes required)
