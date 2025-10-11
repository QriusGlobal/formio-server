# 📋 Form.io Client Web Viewer

> **Simple web client for viewing and interacting with Form.io forms (no backend required)**

A standalone React application for rendering and testing Form.io forms using JSON definitions. Perfect for rapid prototyping, form validation testing, and client-side form demos.

---

## ✨ Features

- ✅ **No Backend Required** - Pure client-side form rendering
- ✅ **JSON-Based Forms** - Paste or select pre-built form definitions
- ✅ **Live Validation** - Client-side validation using @formio/react
- ✅ **Sample Forms** - Includes 3 ready-to-use form templates
- ✅ **Fast Development** - Vite for instant HMR (<50ms)
- ✅ **Bun Support** - Optional faster package management

---

## 🚀 Quick Start

### Option 1: Using pnpm (Recommended for Workspace)

```bash
cd form-client-web-app
pnpm install
pnpm dev
```

### Option 2: Using Bun (Faster Installs)

```bash
cd form-client-web-app
bun install
bun run dev
```

**Open**: http://localhost:64849

---

## 📦 What's Inside

```
form-client-web-app/
├── src/
│   ├── App.tsx              # Main app shell
│   ├── main.tsx             # Entry point
│   └── pages/
│       └── FormViewer.tsx   # Single-page form viewer
├── package.json             # Simplified dependencies
├── vite.config.ts           # Vite configuration
├── bunfig.toml              # Optional Bun config
└── README.md                # This file
```

---

## 🎯 Usage

### 1. **Select a Sample Form**
Choose from pre-built templates:
- **Simple Form** - Name & Email (basic validation)
- **Contact Form** - Panel with phone & textarea
- **Survey Form** - Radio, checkbox, select inputs

### 2. **Use Custom JSON**
Paste your own Form.io JSON definition:

```json
{
  "display": "form",
  "components": [
    {
      "type": "textfield",
      "key": "name",
      "label": "Name",
      "validate": { "required": true }
    },
    {
      "type": "button",
      "action": "submit",
      "label": "Submit"
    }
  ]
}
```

### 3. **Submit & View Data**
- Fill out the form
- Click submit
- View the submission data as formatted JSON

---

## 🧪 Testing

```bash
# Run unit tests (Vitest)
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# With Bun (alternative)
bun test
```

---

## 🏗️ Building for Production

```bash
# Build optimized bundle
pnpm build

# Preview production build
pnpm preview

# With Bun
bun run build
```

**Output**: `dist/` directory with optimized assets

---

## 🔧 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 19.0.0 | UI framework |
| **@formio/react** | latest | Form rendering |
| **@formio/js** | 5.2.2 | Form.io core engine |
| **Vite** | 5.0.0 | Dev server & bundler |
| **Vitest** | 1.0.4 | Unit testing |
| **TypeScript** | 5.3.3 | Type safety |
| **Bun** | optional | Fast package manager |

---

## 📚 Dependencies

**Core Dependencies** (4 total):
```json
{
  "@formio/js": "^5.2.2",
  "@formio/react": "file:../formio-react",
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

**Why so few?**
- No routing library (single page)
- No file upload libraries (client-only)
- No backend dependencies
- No testing frameworks beyond Vitest

---

## 🎨 Customization

### Add Your Own Sample Forms

Edit `src/pages/FormViewer.tsx`:

```typescript
const SAMPLE_FORMS = {
  myForm: {
    display: 'form',
    components: [
      // Your custom components
    ]
  }
};
```

### Change Port

Edit `vite.config.ts`:

```typescript
server: {
  port: 3000, // Change from 64849
}
```

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| **Cold Start** | ~2s (with Vite) |
| **Hot Reload** | <50ms |
| **Build Time** | ~5s |
| **Bundle Size** | ~400KB (gzipped) |
| **Dependencies** | 4 (vs 48 in old test-app) |

---

## 🔄 Migration from test-app

**What Changed:**
- ✅ Renamed `test-app` → `form-client-web-app`
- ✅ Removed React Router (no multi-page needed)
- ✅ Removed file upload dependencies (TUS, Uppy)
- ✅ Removed Playwright E2E tests (use Vitest only)
- ✅ Simplified to single-page viewer
- ✅ Reduced dependencies by 91% (48 → 4)

---

## 🐛 Troubleshooting

### Form not rendering?
- Check JSON syntax (must be valid JSON)
- Verify `display: "form"` is set
- Check browser console for errors

### Validation not working?
- Ensure `validate: { required: true }` in component definition
- Submit button must have `action: "submit"`

### Styles missing?
- Verify `@formio/js/dist/formio.full.css` is imported in `main.tsx`

---

## 📖 Form.io Documentation

- **Official Docs**: https://help.form.io/
- **Component Guide**: https://help.form.io/userguide/forms/components/
- **API Reference**: https://help.form.io/api/

---

## 🤝 Contributing

This is part of the Form.io monorepo. See main README for contribution guidelines.

---

## 📄 License

See LICENSE in monorepo root

---

**Built with ❤️ using Vite, React 19, and Form.io**
