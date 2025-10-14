# Whitelabeling Guide

## Overview
This guide explains how to remove Form.io branding from the Qrius Platform to prevent end-users or developers from identifying the underlying framework.

## What Gets Exposed Without Whitelabeling

### 1. CSS Class Names
- `.formio-form` - Main form container
- `.formio-component` - Every form field
- `.formio-component-file` - File upload fields
- Browser DevTools shows these class names

### 2. HTML Element IDs
- `formio-<component>-<id>` patterns in element IDs
- Visible in "Inspect Element"

### 3. JavaScript Bundle
- Package names like `@formio/js` in source maps
- `Formio` global object in browser console
- Component class names in React DevTools

### 4. Network Requests
- API endpoints may contain `/formio/` in URLs
- Request headers may reference Form.io

### 5. Console Messages
- Development logs mentioning "Form.io"
- Error messages with Form.io stack traces

## Whitelabeling Implementation

### Phase 1: CSS Class Obfuscation (✅ COMPLETED)

**Files Modified:**
- `packages/formio-file-upload/src/config/whitelabel.ts` - Centralized config
- `packages/formio-file-upload/src/components/MultiImageUpload/Component.ts` - Uses generic classes
- `form-client-web-app/src/whitelabel.css` - Hides Form.io branding

**Changes:**
```typescript
// Before
element.querySelector('.formio-component-file')

// After  
element.querySelector(WHITELABEL_CONFIG.SELECTORS.UPLOAD_AREA)
// Resolves to: '.form-field-upload, .formio-component-file'
```

**Result:**
- Custom components use `qrius-upload-container` instead of `formio-component-multiimageupload`
- Element IDs use pattern: `{componentKey}-upload-widget` instead of `formio-{componentKey}-react-container`
- Fallback selectors ensure compatibility with Form.io's DOM structure

### Phase 2: CSS Branding Removal (✅ COMPLETED)

**File:** `form-client-web-app/src/whitelabel.css`

**Features:**
```css
/* Hide Form.io attribution */
.formio-footer,
.powered-by-formio,
[data-powered-by] {
  display: none !important;
}

/* Hide Uppy branding */
.uppy-Dashboard-poweredBy {
  display: none !important;
}

/* Generic class aliases */
.form-field-upload { /* styles */ }
.qrius-upload-container { /* styles */ }
```

### Phase 3: Production Build Configuration (⏳ PENDING)

**Required Changes:**

#### 1. Strip Console Logs
```javascript
// vite.config.ts or rollup.config.js
export default {
  define: {
    'console.log': process.env.NODE_ENV === 'production' ? '(() => {})' : 'console.log',
    'console.debug': process.env.NODE_ENV === 'production' ? '(() => {})' : 'console.debug',
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  }
}
```

#### 2. Remove Source Maps
```javascript
// vite.config.ts
export default {
  build: {
    sourcemap: false,  // Don't expose source files
    minify: 'terser',
    terser: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        toplevel: true,  // Mangle all names
      }
    }
  }
}
```

#### 3. Bundle Obfuscation
```bash
npm install --save-dev webpack-obfuscator

# webpack.config.js
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  plugins: [
    new WebpackObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayThreshold: 0.75
    }, ['excluded_bundle_name.js'])
  ]
};
```

### Phase 4: API Endpoint Obfuscation (⏳ PENDING)

**If using Form.io server:**

```typescript
// config/api.ts
export const API_CONFIG = {
  // Instead of: https://api.example.com/formio/v1/forms
  // Use:        https://api.example.com/api/v1/forms
  
  BASE_URL: process.env.VITE_API_URL || 'https://api.example.com',
  ENDPOINTS: {
    FORMS: '/api/v1/forms',           // Not /formio/forms
    SUBMISSIONS: '/api/v1/submissions', // Not /formio/submissions
    UPLOAD: '/api/v1/upload',          // Not /formio/upload
  }
};
```

**Nginx Reverse Proxy:**
```nginx
# nginx.conf
location /api/ {
  # Rewrite to Form.io backend
  rewrite ^/api/(.*)$ /formio/$1 break;
  proxy_pass http://formio-server:3001;
  proxy_hide_header X-Powered-By;
  proxy_hide_header Server;
}
```

### Phase 5: Global Object Obfuscation (⏳ PENDING)

**Problem:** `window.Formio` is exposed globally

**Solution:**
```typescript
// main.tsx - AFTER Formio initialization
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Remove global Formio reference
  delete (window as any).Formio;
  delete (window as any).FormioUtils;
  
  // Freeze to prevent re-assignment
  Object.freeze(window);
}
```

## Configuration Reference

### Whitelabel Config (`packages/formio-file-upload/src/config/whitelabel.ts`)

```typescript
export const WHITELABEL_CONFIG = {
  CLASS_PREFIX: 'qrius',  // Change to your brand
  
  CLASSES: {
    FORM_CONTAINER: 'qrius-form',
    UPLOAD_WIDGET: 'qrius-upload-container',
    // ... other classes
  },
  
  SELECTORS: {
    // Fallback to Form.io classes for compatibility
    UPLOAD_AREA: '.form-field-upload, .formio-component-file',
  },
  
  FEATURES: {
    HIDE_FORMIO_BRANDING: true,
    HIDE_UPPY_BRANDING: true,
    STRIP_DATA_ATTRIBUTES: true,
  },
  
  BRAND_NAME: 'Qrius Platform',  // Your brand name
};
```

### Custom Branding

To rebrand for a different client:

1. Update `WHITELABEL_CONFIG.CLASS_PREFIX`
2. Update `WHITELABEL_CONFIG.BRAND_NAME`
3. Replace `whitelabel.css` with client's brand colors
4. Update `WHITELABEL_CONFIG.URLS` with client's support links

## Testing Whitelabeling

### Browser DevTools Inspection
```bash
# 1. Open browser DevTools (F12)
# 2. Inspect any form field
# 3. Check for exposed strings:

# ❌ BAD - Exposes Form.io
<div class="formio-component formio-component-file">

# ✅ GOOD - Generic
<div class="form-field form-field-upload">
  <div class="qrius-upload-container" id="site_images-upload-widget">
```

### Network Tab Check
```bash
# Check API requests don't expose Form.io
# ❌ BAD
GET https://api.example.com/formio/v1/forms/specialist-report

# ✅ GOOD
GET https://api.example.com/api/v1/forms/specialist-report
```

### Console Check
```javascript
// Open console (F12 → Console)
// Check for exposed globals

console.log(window.Formio);  // Should be undefined in production
console.log(window.FormioUtils);  // Should be undefined
```

### Bundle Analysis
```bash
# Analyze production bundle
npm run build
npx vite-bundle-visualizer

# Check for exposed package names
grep -r "formio" dist/assets/*.js
# Should return minimal or obfuscated results
```

## Security Considerations

### 1. Source Maps
- **NEVER** deploy source maps to production
- Source maps expose original file names and structure
- Set `sourcemap: false` in build config

### 2. Console Logs
- Remove all development logging in production
- Use `logger` utility with environment checks
- Strip console statements in build process

### 3. Error Messages
- Don't expose internal error details to users
- Log detailed errors server-side only
- Show generic "Something went wrong" to users

### 4. API Endpoints
- Use reverse proxy to hide backend structure
- Don't expose `/formio/` in public URLs
- Add rate limiting to prevent reconnaissance

## Deployment Checklist

- [ ] `NODE_ENV=production` set
- [ ] Source maps disabled (`sourcemap: false`)
- [ ] Console logs stripped (drop_console: true)
- [ ] Bundle minified and obfuscated
- [ ] `window.Formio` removed
- [ ] API endpoints proxied (no `/formio/` URLs)
- [ ] `whitelabel.css` imported in main.tsx
- [ ] Custom error boundaries with generic messages
- [ ] Server headers don't expose Form.io (`X-Powered-By` removed)
- [ ] `@formio/js` package name not visible in bundle analysis

## Current Status

### ✅ Completed
- Generic CSS class names (`.qrius-upload-container`)
- Generic element IDs (`{key}-upload-widget`)
- Whitelabel CSS hiding Form.io branding
- Centralized whitelabel configuration

### ⏳ Pending
- Production build config (console stripping, source maps)
- API endpoint obfuscation (reverse proxy)
- Global object removal (`window.Formio`)
- Bundle obfuscation

### 📅 Future
- Anti-Corruption Layer (ACL) architecture (Phase 2)
- Complete decoupling from Form.io (Qrius Platform vision)

## Maintenance

When adding new components:

1. Import `WHITELABEL_CONFIG` from `../../config/whitelabel`
2. Use `WHITELABEL_CONFIG.CLASSES.*` for class names
3. Use `WHITELABEL_CONFIG.SELECTORS.*` for DOM queries
4. Use `WHITELABEL_CONFIG.ID_PATTERNS.*` for element IDs
5. Never hardcode "formio" in new code

## Support

For whitelabeling questions:
- Documentation: `/docs/whitelabeling`
- Architecture: `ARCHITECTURE.md`
- Config Reference: `packages/formio-file-upload/src/config/whitelabel.ts`
