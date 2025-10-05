# Form.io Authentication - Root Cause Analysis

**Date:** October 5, 2025  
**Status:** ❌ Blocked - Form.io Not Installed  
**Issue:** E2E tests fail with 401 Unauthorized

---

## 🔍 Root Cause Identified

### The Core Problem
**Form.io server is running but NOT properly installed** - it's missing the complete project setup required for authentication.

### Evidence

**1. Missing Database Collections**
```bash
$ docker exec formio-mongo mongosh formioapp_gcs_test --quiet --eval 'db.getCollectionNames()'
[ 'submissions' ]  # ❌ Only submissions, no forms/roles/actions
```

**2. No Forms Created**
```bash
$ db.forms.countDocuments()
0  # ❌ Should have user, admin, userLogin, userRegister forms
```

**3. Installation Incomplete**
```
formio-server  | Installing...
formio-server  | Downloading client...
formio-server  | Unable to download project. Please try again.
formio-server  | undefined
```

**4. No Authentication Endpoints**
```bash
$ curl -X POST http://localhost:3001/user/login
Invalid alias  # ❌ No /user resource exists
```

---

## 🧪 What We Tried

### Attempt 1: PROJECT_TEMPLATE=default
```bash
# .env.real-gcs
PROJECT_TEMPLATE=default
```
**Result:** ❌ Download failed - "Unable to download project"

### Attempt 2: Manual User Creation
```javascript
// Created admin@example.com in submissions collection
const User = mongoose.model('submission', userSchema);
await User.create({
  email: 'admin@example.com',
  password: bcrypt.hashSync('TestPass123!', 10)
});
```
**Result:** ❌ Wrong approach - user not in proper Form.io resource

### Attempt 3: NO_PROJECT_TEMPLATE=1
```bash
NODE_ENV=production
NO_PROJECT_TEMPLATE=1
```
**Result:** ⚠️  Server runs but no forms/resources created

---

## 📊 Expected vs Actual State

### Expected Form.io Installation
```
MongoDB Collections:
├── forms (user, admin, userLogin, userRegister)
├── roles (administrator, authenticated, anonymous)
├── actions (login, save, email)
└── submissions (user data)

Endpoints:
├── POST /user/register
├── POST /user/login
└── GET /user/:userId
```

### Actual State
```
MongoDB Collections:
└── submissions (only)  # ❌

Endpoints:
└── None  # ❌
```

---

## 🔧 Resolution Options

### Option 1: Use Form.io Install Script (RECOMMENDED)
```bash
# Run Form.io installation directly in container
docker exec -it formio-server node dist/install.js

# This will:
# 1. Create forms (user, admin, etc.)
# 2. Create roles (administrator, etc.)
# 3. Create actions (login, save)
# 4. Set up admin user interactively
```

**Pros:** Official method, guaranteed to work  
**Cons:** Interactive, requires manual input

---

### Option 2: Programmatic Form Creation
Create forms via API using Form.io's JSON schema:

```javascript
// 1. Create user resource form
POST /form
{
  "type": "resource",
  "name": "user",
  "title": "User",
  "components": [
    {
      "type": "email",
      "key": "email",
      "label": "Email",
      "input": true
    },
    {
      "type": "password",
      "key": "password",
      "label": "Password",
      "input": true
    }
  ]
}

// 2. Create login action
POST /form/:formId/action
{
  "name": "login",
  "title": "Login",
  "handler": ["before"],
  "method": ["create"],
  "condition": {
    "field": "submit",
    "eq": "login"
  },
  "settings": {
    "username": "email",
    "password": "password"
  }
}

// 3. Register admin user
POST /user/register
{
  "data": {
    "email": "admin@example.com",
    "password": "TestPass123!"
  }
}
```

**Pros:** Scriptable, repeatable  
**Cons:** Complex, requires exact Form.io schema

---

### Option 3: Mock Authentication for Tests
Skip Form.io auth entirely and mock it in tests:

```typescript
// global-setup.ts
test.beforeEach(async ({ page }) => {
  // Inject mock JWT
  await page.addInitScript(() => {
    localStorage.setItem('formioToken', 'mock-jwt-token');
  });
  
  // Mock API responses
  await page.route('**/user/login', async route => {
    await route.fulfill({
      status: 200,
      headers: { 'x-jwt-token': 'mock-jwt-token' },
      body: JSON.stringify({ _id: 'mock-user-id' })
    });
  });
});
```

**Pros:** Simple, no Form.io dependency  
**Cons:** Not testing real authentication

---

## 🎯 Recommended Approach

**Use Option 1 + Update Test Config**

1. **Install Form.io properly**:
   ```bash
   docker exec -it formio-server node dist/install.js
   # Follow prompts to create admin user
   ```

2. **Update test bootstrap script**:
   ```bash
   # test-app/tests/setup/formio-bootstrap.sh
   ROOT_EMAIL="admin@gcs-test.local"  # Match Docker env
   ROOT_PASSWORD="admin123"           # Match Docker env
   ```

3. **Run tests**:
   ```bash
   cd test-app && bun run test:e2e
   ```

---

## 📈 Impact Assessment

### Infrastructure Status
- ✅ Docker Compose: Consolidated and healthy
- ✅ GCS Configuration: Working (bucket + credentials)
- ✅ Redis: Connected and responding
- ✅ MongoDB: Connected and responding
- ⚠️  Form.io: Running but not configured

### Test Status
- ❌ Backend Integration (5 tests): Blocked on axios dependency
- ❌ Backend Integration Real GCS (4 tests): Blocked on axios dependency
- ❌ E2E React (4 tests): Blocked on Form.io auth
- ❌ Stress Tests (4 tests): Blocked on Form.io auth
- **Total: 0/17 tests passing**

### Time to Fix
- Option 1 (Install Script): 5-10 minutes
- Option 2 (Programmatic): 30-45 minutes
- Option 3 (Mock Auth): 15-20 minutes

---

## 📝 Lessons Learned

1. **Form.io requires proper installation** - can't just run the server
2. **PROJECT_TEMPLATE download fails** in Docker without internet/DNS
3. **Manual user creation doesn't work** - must use Form.io's user resource
4. **Environment variables aren't enough** - need actual database setup
5. **Test expectations must match deployment** - credentials should align

---

## 🚀 Next Steps

1. **Choose resolution approach** (recommend Option 1)
2. **Run Form.io installation**
3. **Align test credentials with Docker env**
4. **Execute full test suite**
5. **Document working setup**

---

**Commit:** cfecb208 - Form.io authentication root cause documented  
**Related Docs:**  
- [GCS Environment Setup Report](./GCS_ENVIRONMENT_SETUP_REPORT.md)
- [Docker Consolidation Summary](./DOCKER_CONSOLIDATION_SUMMARY.md)
