# Production Build Guide - form-client-web-app

## Quick Start

```bash
pnpm run build        # Production build (optimized)
pnpm run preview      # Test production build locally
```

## Build Configuration

### Build Commands

- **`pnpm run build`** - Full production build with Terser minification
- **`pnpm run build:dev`** - Development build (no minification, faster)
- **`pnpm run build:analyze`** - Production build with bundle analyzer
- **`pnpm run preview`** - Preview production build on http://localhost:64849

### Build Performance

| Metric       | Value                   |
| ------------ | ----------------------- |
| Build Time   | ~9.2 seconds            |
| Bundle Size  | 2.9 MB (total)          |
| Gzipped Size | ~700 KB                 |
| Chunks       | 4 main bundles + assets |

### Build Artifacts

```
dist/
├── index.html                  # Entry point (1.48 KB)
├── assets/
│   ├── DYRuGnOB.js           # Main application bundle (1.09 MB / 264 KB gzipped)
│   ├── CFJ-6qf_.js           # Form.io vendor chunk (980 KB / 302 KB gzipped)
│   ├── hjfgsSLn.js           # React vendor chunk (221 KB / 68 KB gzipped)
│   ├── CPX9CHwV.js           # Third-party libs chunk (189 KB / 59 KB gzipped)
│   ├── CBdO3sPr.css          # Main stylesheet (119 KB / 23 KB gzipped)
│   └── *.woff, *.woff2       # Font assets
```

## Configuration

### Vite Configuration (vite.config.ts)

**Key Features:**

1. **Terser Minification** (production only)
   - Removes console logs and debugger statements
   - Top-level mangling for maximum compression
   - Custom preamble comment with build timestamp

2. **Code Splitting**
   - `vendor-react` - React + React DOM
   - `vendor-formio` - Form.io packages
   - `vendor-libs` - Other third-party libraries

3. **CommonJS Support**
   - `@rollup/plugin-commonjs` handles workspace packages
   - Proper interop for `@qrius/formio-react` (CommonJS build)

4. **Source Maps**
   - Enabled by default (configure via `.env.production`)
   - Helps with production debugging

5. **React Compiler**
   - Babel plugin for React 19 optimizations
   - Automatic memoization and optimizations

### Environment Variables

Production builds use `.env.production`:

```env
# Source Maps
VITE_ENABLE_SOURCE_MAPS=true

# Bundle Obfuscation (optional)
VITE_OBFUSCATE_BUNDLE=false

# Form.io Server (if needed)
# VITE_FORMIO_SERVER_URL=https://api.example.com
```

**Note:** All `VITE_*` variables are embedded at build time and visible in the
client.

## Deployment

### Static Hosting (Recommended)

The `dist/` directory contains a fully static SPA that can be deployed to:

#### Vercel

```bash
pnpm run build
vercel deploy --prod
```

#### Netlify

```bash
pnpm run build
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront

```bash
pnpm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### GitHub Pages

```bash
pnpm run build
# Push dist/ to gh-pages branch
```

### Server Configuration

**Important:** This is a Single Page Application (SPA). Configure your server
to:

1. **Serve `index.html` for all routes** (client-side routing)
2. **Set proper MIME types** for `.js`, `.css`, `.woff2` files
3. **Enable gzip/brotli compression**
4. **Set cache headers**:
   - HTML: `no-cache` or short TTL
   - Assets: `max-age=31536000` (1 year, content-hashed filenames)

**Nginx Example:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/form-client-web-app/dist;
    index index.html;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Optimization

### Bundle Size Optimization

**Current State:**

- Two chunks exceed 1 MB (pre-gzip)
- Main bundle: 1.09 MB → 264 KB gzipped (76% reduction)
- Form.io vendor: 980 KB → 302 KB gzipped (69% reduction)

**Optimization Strategies:**

1. **Route-Based Code Splitting** (if adding more pages):

```typescript
const FormViewer = lazy(() => import('./pages/FormViewer'));
const TusBulkUpload = lazy(() => import('./pages/TusBulkUploadTest'));
```

2. **Dynamic Form.io Import** (if not always needed):

```typescript
const { Form } = await import('@qrius/formio-react');
```

3. **Disable Source Maps in Production**:

```env
# .env.production
VITE_ENABLE_SOURCE_MAPS=false
```

4. **Enable Obfuscation** (if needed):

```env
VITE_OBFUSCATE_BUNDLE=true
```

### Performance Monitoring

**Bundle Analyzer:**

```bash
pnpm run build:analyze
# Opens dist/stats.html with interactive treemap
```

## Troubleshooting

### Build fails with "Form is not exported"

**Cause:** Vite's Rollup bundler cannot parse CommonJS named exports from
`@qrius/formio-react`.

**Solution:** Install `@rollup/plugin-commonjs` (already configured):

```bash
pnpm add -D @rollup/plugin-commonjs
```

### Preview server shows blank page

**Check:**

1. Browser console for errors
2. Network tab for failed requests
3. Environment variables (VITE\_\* must be set at build time)

**Solution:**

```bash
# Rebuild with correct env vars
rm -rf dist/
pnpm run build
pnpm run preview
```

### Large bundle size warnings

**Expected:** Form.io is a large library (~1 MB compressed). This is normal.

**Mitigation:**

- Enable code splitting (route-based)
- Use dynamic imports for heavy features
- Consider lazy loading Form.io itself

### Build is slow (> 30s)

**Check:**

1. TypeScript type checking (disable in production)
2. Terser minification (switch to esbuild for speed)

**Speed up:**

```typescript
// vite.config.ts
build: {
  minify: 'esbuild', // Faster than terser
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: |
          cd form-client-web-app
          pnpm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: form-client-web-app/dist
```

## Build Artifacts Checklist

Before deploying, verify:

- ✅ `dist/index.html` exists and is valid HTML
- ✅ JavaScript bundles are minified (check file size)
- ✅ CSS files are present
- ✅ Font files (.woff, .woff2) are copied
- ✅ Source maps available (if enabled)
- ✅ No TypeScript errors in build output
- ✅ Preview server loads the app successfully

## Version History

| Date       | Build Time | Bundle Size             | Notes                                       |
| ---------- | ---------- | ----------------------- | ------------------------------------------- |
| 2025-10-14 | 9.16s      | 2.9 MB (700 KB gzipped) | Phase 5C - Vite production build configured |

---

**Related Documentation:**

- [Main README](../README.md)
- [CLAUDE.md](../CLAUDE.md) - AI Assistant Guide
- [Vite Documentation](https://vitejs.dev/)
- [Form.io React SDK](https://github.com/formio/react)
