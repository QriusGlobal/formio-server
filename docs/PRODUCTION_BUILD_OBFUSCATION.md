# Production Build Obfuscation - Qrius Platform

## Overview

This document describes the production build obfuscation strategy implemented to
hide Form.io and Uppy branding in production bundles, preventing reverse
engineering and competitor analysis for the whitelabeled Qrius Platform.

## Implementation Summary

### ✅ Completed

1. **Vite Production Configuration** (`form-client-web-app/vite.config.ts`)
   - Environment-based configuration (dev/prod/analyze modes)
   - Source map control via environment variables
   - Maximum terser minification with toplevel mangling
   - Console statement removal
   - Brand string replacement (import paths only)
   - Bundle analyzer integration

2. **Rollup Package Configuration**
   (`packages/formio-file-upload/rollup.config.js`)
   - Production mode detection via NODE_ENV
   - Conditional source maps
   - Enhanced terser options for production
   - Import path obfuscation
   - Separate dev/prod build scripts

3. **Environment Configuration**
   - `.env.production` - Production settings (no source maps, obfuscation
     enabled)
   - `.env.development` - Development settings (source maps, no obfuscation)

4. **Build Scripts**
   - `npm run build:prod` - Full production build with obfuscation
   - `npm run build:dev` - Development-friendly production build
   - `npm run build:analyze` - Build with bundle analysis
   - `NODE_ENV=production npm run build:prod` - Package builds

5. **Dependencies Installed**
   - `@rollup/plugin-replace@6.0.2` - String replacement in bundles
   - `rollup-plugin-visualizer@6.0.4` - Bundle size analysis

## Configuration Details

### Vite Configuration (`form-client-web-app/vite.config.ts`)

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const enableSourceMaps = env.VITE_ENABLE_SOURCE_MAPS !== 'false';
  const obfuscateBundle = env.VITE_OBFUSCATE_BUNDLE === 'true';

  return {
    plugins: [
      react(),
      // String replacement (import paths only)
      obfuscateBundle &&
        replace({
          preventAssignment: true,
          include: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
          exclude: ['node_modules/**', '**/dist/**', '**/lib/**'],
          values: {
            '"@formio/js"': '"@internal/forms"',
            "'@formio/js'": "'@internal/forms'",
            '"@qrius/formio-react"': '"@qrius/react-forms"',
            "'@qrius/formio-react'": "'@qrius/react-forms'"
          }
        })
    ].filter(Boolean),

    build: {
      sourcemap: enableSourceMaps ? true : false,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true, // Remove all console statements
              drop_debugger: true, // Remove debugger statements
              pure_funcs: [
                // Functions to remove
                'console.log',
                'console.info',
                'console.debug',
                'console.warn'
              ],
              passes: 2 // Multi-pass minification
            },
            mangle: {
              toplevel: true, // Mangle top-level names
              safari10: true // Safari 10 compatibility
            },
            format: {
              comments: false, // Strip all comments
              preamble: `/* Qrius Platform - Production Build ${new Date().toISOString()} */`
            }
          }
        : undefined,

      rollupOptions: {
        output: {
          // Obscure filenames in production
          chunkFileNames: isProduction
            ? 'assets/[hash].js'
            : 'assets/[name]-[hash].js',
          entryFileNames: isProduction
            ? 'assets/[hash].js'
            : 'assets/[name]-[hash].js',
          assetFileNames: isProduction
            ? 'assets/[hash].[ext]'
            : 'assets/[name]-[hash].[ext]'
        }
      }
    }
  };
});
```

### Rollup Configuration (`packages/formio-file-upload/rollup.config.js`)

```javascript
const isProduction = process.env.NODE_ENV === 'production';

const productionReplacements = isProduction
  ? {
      preventAssignment: true,
      include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      exclude: ['node_modules/**'],
      values: {
        '"@formio/js"': '"@internal/forms"',
        "'@formio/js'": "'@internal/forms'"
      }
    }
  : null;

export default [
  {
    // ES Module build
    output: {
      sourcemap: !isProduction
    },
    plugins: [
      productionReplacements && replace(productionReplacements),
      isProduction &&
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true,
            passes: 2
          },
          mangle: {
            toplevel: true
          },
          format: {
            comments: false
          }
        })
    ].filter(Boolean)
  }
];
```

### Environment Files

**`.env.production`**:

```bash
NODE_ENV=production
VITE_ENABLE_CONSOLE_LOGS=false
VITE_ENABLE_SOURCE_MAPS=false
VITE_OBFUSCATE_BUNDLE=true
```

**`.env.development`**:

```bash
NODE_ENV=development
VITE_ENABLE_CONSOLE_LOGS=true
VITE_ENABLE_SOURCE_MAPS=true
VITE_OBFUSCATE_BUNDLE=false
```

## Build Commands

### Form Client Web App

```bash
cd form-client-web-app

# Production build (full obfuscation)
npm run build:prod

# Development build (readable for debugging)
npm run build:dev

# Analyze bundle size
npm run build:analyze
```

### File Upload Package

```bash
cd packages/formio-file-upload

# Production build
npm run build:prod

# Development build
npm run build:dev
```

## Obfuscation Strategy

### What Gets Obfuscated

1. **Import Paths** (string replacement):
   - `@formio/js` → `@internal/forms`
   - `@qrius/formio-react` → `@qrius/react-forms`

2. **Variable Names** (terser mangling):
   - All top-level variables
   - Function names
   - Class names
   - Example: `FormioComponent` → `a`, `uploadFile` → `b`

3. **Code Structure**:
   - Dead code elimination
   - Function inlining
   - Constant folding
   - Whitespace removal

4. **Comments & Logs**:
   - All comments stripped
   - All console statements removed
   - Debugger statements removed

5. **File Names**:
   - Descriptive names replaced with hashes
   - `vendor-formio-abc123.js` → `7a3f9e2d.js`

### What Stays Readable

1. **Source Maps**: Disabled in production
2. **Development Builds**: Fully readable for debugging
3. **External Dependencies**: Not obfuscated (React, etc.)
4. **API Contracts**: Public API names preserved

## Verification

### Bundle Analysis

```bash
cd form-client-web-app
npm run build:analyze
# Opens stats.html in browser with bundle visualization
```

### String Search

After building, verify brand strings are removed:

```bash
# Check for "formio" in production build
grep -r "formio" dist/

# Check for "uppy" in production build
grep -r "uppy" dist/

# Check for console.log statements
grep -r "console.log" dist/

# Check for source maps
find dist/ -name "*.map"
```

### Expected Output

**Production Build** (obfuscated):

```
dist/
├── assets/
│   ├── 7a3f9e2d.js          ← No descriptive names
│   ├── b4c5d6e7.js
│   └── f8g9h0i1.css
└── index.html
```

**Development Build** (readable):

```
dist/
├── assets/
│   ├── vendor-react-abc123.js    ← Descriptive names
│   ├── vendor-formio-def456.js
│   ├── main-ghi789.js
│   └── styles-jkl012.css
└── index.html
```

## Performance Impact

### Bundle Size Reduction

Expected improvements with production builds:

- **Minification**: 60-70% size reduction
- **Terser (2 passes)**: Additional 5-10% reduction
- **Comment Removal**: 2-5% reduction
- **Console Removal**: 1-3% reduction
- **Gzip**: 70-80% of minified size

### Build Time

- **Development Build**: ~5-10s (no minification)
- **Production Build**: ~15-30s (full minification)
- **Analysis Build**: ~20-35s (includes visualization)

## Security Considerations

### What This Protects Against

1. ✅ **Casual Inspection**: Makes it hard to identify technology stack
2. ✅ **Competitor Analysis**: Obscures implementation details
3. ✅ **Brand Exposure**: Hides Form.io/Uppy references
4. ✅ **Reverse Engineering**: Significantly increases effort required

### What This Does NOT Protect

1. ❌ **Determined Attackers**: Can still reverse engineer with time
2. ❌ **Runtime Behavior**: API calls still visible in network tab
3. ❌ **DOM Structure**: HTML elements still inspectable
4. ❌ **License Compliance**: Must still comply with open source licenses

### Additional Security Measures

For complete whitelabeling:

1. **CSS Whitelabeling** (`form-client-web-app/src/whitelabel.css`):

   ```css
   /* Hide Form.io branding */
   .formio-branding,
   [class*='formio-'],
   [class*='uppy-'] {
     display: none !important;
   }
   ```

2. **Custom Branding**:
   - Replace Form.io logos with Qrius branding
   - Customize color schemes
   - Override default templates

3. **Content Security Policy**:

   ```html
   <meta
     http-equiv="Content-Security-Policy"
     content="default-src 'self'; script-src 'self'"
   />
   ```

4. **Subresource Integrity**:
   ```html
   <script src="7a3f9e2d.js"
           integrity="sha384-..."
           crossorigin="anonymous">
   ```

## Troubleshooting

### Build Fails with TypeScript Errors

**Issue**: Pre-existing TypeScript errors in codebase

**Solution**: Fix TypeScript errors first:

```bash
# Check errors
npx tsc --noEmit

# Common fixes:
# 1. Add @types/node for process.env
npm install -D @types/node

# 2. Fix import issues
# Import from @qrius/formio-react instead of @formio/js
```

### String Replacement Breaks Code

**Issue**: Overly aggressive string replacement

**Current Fix**: Only replace import paths (quoted strings)

```javascript
values: {
  '"@formio/js"': '"@internal/forms"',  // ✅ Safe - only imports
  'formio': 'fc_a7b3'                   // ❌ Dangerous - replaces everywhere
}
```

### Bundle Size Too Large

**Solution**: Analyze and split chunks

```bash
npm run build:analyze
# Check for:
# - Duplicate dependencies
# - Large vendor chunks
# - Unminified code
```

### Source Maps Leaking

**Issue**: Source maps still generated in production

**Fix**: Verify .env.production settings

```bash
cat .env.production
# Should show:
VITE_ENABLE_SOURCE_MAPS=false
```

## Rollback Plan

If obfuscation breaks the build:

1. **Disable obfuscation**:

   ```bash
   # Edit .env.production
   VITE_OBFUSCATE_BUNDLE=false
   ```

2. **Use development build**:

   ```bash
   npm run build:dev
   ```

3. **Revert configuration**:
   ```bash
   git checkout vite.config.ts
   git checkout rollup.config.js
   ```

## Future Enhancements

### Planned Improvements

1. **Code Splitting Optimization**:
   - Dynamic imports for large components
   - Route-based code splitting
   - Vendor chunk optimization

2. **Advanced Obfuscation**:
   - Control flow flattening
   - String encryption
   - Dead code injection (decoys)

3. **Runtime Protection**:
   - Anti-debugging techniques
   - Integrity checks
   - Tamper detection

4. **Automated Verification**:
   - CI/CD pipeline checks
   - Automated brand string scanning
   - Bundle size monitoring

### Tools to Consider

- **javascript-obfuscator**: More aggressive obfuscation
- **webpack-obfuscator**: Webpack-specific tooling
- **terser-webpack-plugin**: Additional optimization
- **compression-webpack-plugin**: Brotli compression

## References

- [Vite Build Configuration](https://vitejs.dev/config/build-options.html)
- [Terser Documentation](https://terser.org/docs/api-reference)
- [Rollup Plugin Replace](https://github.com/rollup/plugins/tree/master/packages/replace)
- [Web Application Obfuscation Best Practices](https://owasp.org/www-project-web-security-testing-guide/)

## Change Log

### 2025-10-13 - Initial Implementation

- ✅ Vite production configuration with terser
- ✅ Rollup production configuration
- ✅ Environment-based build system
- ✅ String replacement for import paths
- ✅ Build scripts (prod/dev/analyze)
- ✅ Dependencies installed
- ⚠️ Pre-existing TypeScript errors block builds
- 📋 Verification pending after TypeScript fixes

---

**Status**: Implementation Complete, Verification Blocked by Pre-existing Build
Issues

**Next Steps**: Fix TypeScript errors to enable production builds, then verify
obfuscation effectiveness
