# Form.io Programmatic Setup Guide

## Overview

Complete REST API automation for Form.io project setup without requiring portal access. This guide enables fully automated infrastructure provisioning for development, testing, and production environments.

## Table of Contents

- [Quick Start](#quick-start)
- [REST API Reference](#rest-api-reference)
- [Security Best Practices](#security-best-practices)
- [Environment Configuration](#environment-configuration)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## Quick Start

### 1. Bootstrap Development Environment

```bash
# Start Form.io server and dependencies
docker-compose -f docker-compose.test.yml up -d

# Wait for services to be healthy (30-60 seconds)
docker-compose -f docker-compose.test.yml ps

# Bootstrap Form.io with admin user
curl -X POST http://localhost:3001/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "email": "admin@example.com",
      "password": "SecurePassword123!",
      "role": "admin"
    }
  }'
```

### 2. Authenticate and Get Token

```bash
# Login to get JWT token
TOKEN=$(curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "email": "admin@example.com",
      "password": "SecurePassword123!"
    }
  }' | jq -r '.token')

echo "JWT Token: $TOKEN"
```

### 3. Create Project

```bash
# Create a new Form.io project
PROJECT_ID=$(curl -X POST http://localhost:3001/project \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "title": "My Application",
    "name": "myapp",
    "description": "Production application project"
  }' | jq -r '._id')

echo "Project ID: $PROJECT_ID"
```

### 4. Create File Upload Form

```bash
# Create form with TUS upload component
FORM_ID=$(curl -X POST http://localhost:3001/form \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "title": "File Upload Form",
    "name": "fileupload",
    "path": "fileupload",
    "type": "form",
    "display": "form",
    "components": [
      {
        "type": "file",
        "key": "attachment",
        "label": "Upload File",
        "storage": "url",
        "url": "http://localhost:1080/files/",
        "options": "{\"chunkSize\":262144,\"retryDelays\":[0,1000,3000,5000]}",
        "input": true,
        "fileMaxSize": "50MB",
        "multiple": true
      },
      {
        "type": "button",
        "action": "submit",
        "label": "Submit",
        "theme": "primary"
      }
    ]
  }' | jq -r '._id')

echo "Form ID: $FORM_ID"
```

### 5. Test Form Submission

```bash
# Submit form with file attachment
curl -X POST "http://localhost:3001/form/$FORM_ID/submission" \
  -H "Content-Type: application/json" \
  -H "x-jwt-token: $TOKEN" \
  -d '{
    "data": {
      "attachment": [{
        "name": "document.pdf",
        "size": 102400,
        "type": "application/pdf",
        "url": "http://storage.example.com/uploads/abc123.pdf"
      }]
    }
  }'
```

---

## REST API Reference

### Authentication

#### Register Admin User

**Endpoint**: `POST /user/register`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "data": {
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "role": "admin",
    "name": "System Administrator"
  }
}
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@example.com",
  "role": "admin",
  "created": "2025-10-02T12:00:00.000Z"
}
```

**Notes**:
- Password must meet complexity requirements (8+ chars, uppercase, lowercase, numbers)
- Admin role grants full permissions
- First user registered automatically becomes root admin

#### Login

**Endpoint**: `POST /user/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "data": {
    "email": "admin@example.com",
    "password": "SecurePassword123!"
  }
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Important Security Notes**:
⚠️ **LoginAction Double Response Bug**: The Form.io LoginAction.js has a known bug where it sends responses twice, causing `ERR_HTTP_HEADERS_SENT` errors.

**Fix** (required in `/app/src/actions/LoginAction.js` line 267):
```javascript
// Add response guard before res.send()
if (res.headersSent) {
  return;
}
res.send(response);
```

### Project Management

#### Create Project

**Endpoint**: `POST /project`

**Headers**:
```
Content-Type: application/json
x-jwt-token: <your-jwt-token>
```

**Request Body**:
```json
{
  "title": "Production Application",
  "name": "prodapp",
  "description": "Production deployment project",
  "settings": {
    "cors": "*",
    "email": {
      "type": "sendgrid",
      "apiKey": "SG.xxxxx"
    }
  }
}
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Production Application",
  "name": "prodapp",
  "created": "2025-10-02T12:00:00.000Z"
}
```

#### List Projects

**Endpoint**: `GET /project`

**Headers**:
```
x-jwt-token: <your-jwt-token>
```

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Production Application",
    "name": "prodapp"
  }
]
```

### Form Management

#### Create Form

**Endpoint**: `POST /form`

**Headers**:
```
Content-Type: application/json
x-jwt-token: <your-jwt-token>
```

**Request Body** (File Upload Form):
```json
{
  "title": "File Upload Form",
  "name": "fileupload",
  "path": "fileupload",
  "type": "form",
  "display": "form",
  "components": [
    {
      "type": "file",
      "key": "attachment",
      "label": "Upload Files",
      "storage": "url",
      "url": "http://localhost:1080/files/",
      "options": "{\"chunkSize\":262144,\"retryDelays\":[0,1000,3000,5000],\"parallelUploads\":3}",
      "input": true,
      "fileMaxSize": "50MB",
      "filePattern": ".pdf,.doc,.docx,.txt",
      "multiple": true,
      "validate": {
        "required": true
      }
    },
    {
      "type": "textfield",
      "key": "description",
      "label": "File Description",
      "input": true,
      "validate": {
        "maxLength": 500
      }
    },
    {
      "type": "button",
      "action": "submit",
      "label": "Submit",
      "theme": "primary"
    }
  ]
}
```

**TUS Upload Options**:
```json
{
  "chunkSize": 262144,          // 256KB chunks
  "retryDelays": [0, 1000, 3000, 5000],  // Retry delays in ms
  "parallelUploads": 3,         // Max concurrent uploads
  "removeFingerprintOnSuccess": true,
  "fingerprint": "function(file) { return file.name + '-' + file.size; }"
}
```

#### List Forms

**Endpoint**: `GET /form`

**Headers**:
```
x-jwt-token: <your-jwt-token>
```

**Query Parameters**:
- `type`: Filter by form type (`form`, `resource`)
- `limit`: Number of results (default: 10)
- `skip`: Pagination offset

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "File Upload Form",
    "name": "fileupload",
    "path": "fileupload",
    "type": "form"
  }
]
```

#### Update Form

**Endpoint**: `PUT /form/:formId`

**Headers**:
```
Content-Type: application/json
x-jwt-token: <your-jwt-token>
```

**Request Body**: (Same as Create Form)

#### Delete Form

**Endpoint**: `DELETE /form/:formId`

**Headers**:
```
x-jwt-token: <your-jwt-token>
```

### Submission Management

#### Create Submission

**Endpoint**: `POST /form/:formId/submission`

**Headers**:
```
Content-Type: application/json
x-jwt-token: <your-jwt-token>
```

**Request Body**:
```json
{
  "data": {
    "attachment": [
      {
        "name": "document.pdf",
        "size": 102400,
        "type": "application/pdf",
        "url": "http://storage.example.com/uploads/abc123.pdf",
        "storage": "url"
      }
    ],
    "description": "Financial report Q3 2025"
  }
}
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "form": "507f1f77bcf86cd799439013",
  "data": {
    "attachment": [...],
    "description": "Financial report Q3 2025"
  },
  "created": "2025-10-02T12:00:00.000Z"
}
```

#### List Submissions

**Endpoint**: `GET /form/:formId/submission`

**Headers**:
```
x-jwt-token: <your-jwt-token>
```

**Query Parameters**:
- `limit`: Number of results
- `skip`: Pagination offset
- `sort`: Sort field (e.g., `-created` for newest first)

**Response**:
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "data": {...},
    "created": "2025-10-02T12:00:00.000Z"
  }
]
```

---

## Security Best Practices

### Local Development

#### ✅ DO

1. **Store credentials in `.env.test` (gitignored)**
   ```bash
   # .env.test
   FORMIO_ADMIN_EMAIL=admin@test.local
   FORMIO_ADMIN_PASSWORD=TestPass123!
   FORMIO_JWT_SECRET=local-dev-secret-12345
   ```

2. **Use short-lived JWT tokens (1 hour max)**
   ```bash
   # Set token expiration in Form.io config
   JWT_EXPIRE_TIME=3600  # 1 hour in seconds
   ```

3. **Rotate tokens on each test run**
   ```bash
   # Login and get fresh token before tests
   ./test-app/tests/setup/get-token.sh
   ```

4. **Use isolated test databases**
   ```yaml
   # docker-compose.test.yml
   mongodb:
     environment:
       MONGO_INITDB_DATABASE: formioapp_test
   ```

#### ❌ DO NOT

1. ❌ Never commit tokens or API keys to version control
2. ❌ Never use production credentials in development
3. ❌ Never share JWT tokens between environments
4. ❌ Never disable authentication for convenience

### Production Deployment

#### ✅ DO

1. **Use environment variables for all credentials**
   ```bash
   # .env.production (never commit!)
   FORMIO_ADMIN_EMAIL=${ADMIN_EMAIL}
   FORMIO_ADMIN_PASSWORD=${ADMIN_PASSWORD}
   FORMIO_JWT_SECRET=${JWT_SECRET}  # 256-bit random string
   FORMIO_DB_SECRET=${DB_SECRET}     # 256-bit random string
   ```

2. **Create permanent API keys for embedded apps**
   ```bash
   # Create API key for production app
   curl -X POST http://api.formio.com/token \
     -H "x-jwt-token: $ADMIN_TOKEN" \
     -d '{
       "type": "permanent",
       "title": "Production App API Key",
       "permissions": ["read", "write", "create"],
       "description": "API key for production application"
     }'
   ```

3. **Implement token refresh mechanism**
   ```javascript
   // Auto-refresh token before expiration
   const refreshToken = async () => {
     if (tokenExpiresInLessThan(300)) { // 5 minutes
       const response = await fetch('/user/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           data: {
             email: process.env.FORMIO_ADMIN_EMAIL,
             password: process.env.FORMIO_ADMIN_PASSWORD
           }
         })
       });
       const { token } = await response.json();
       updateToken(token);
     }
   };
   ```

4. **Use HTTPS for all API calls**
   ```javascript
   const FORMIO_URL = process.env.NODE_ENV === 'production'
     ? 'https://api.formio.com'
     : 'http://localhost:3001';
   ```

5. **Implement rate limiting**
   ```yaml
   # nginx.conf
   limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

   location /api {
     limit_req zone=api burst=20;
     proxy_pass http://formio:3001;
   }
   ```

6. **Monitor authentication failures**
   ```javascript
   // Track failed login attempts
   const loginAttempts = new Map();

   app.post('/user/login', async (req, res) => {
     const email = req.body.data.email;
     const attempts = loginAttempts.get(email) || 0;

     if (attempts >= 5) {
       return res.status(429).json({
         error: 'Too many login attempts. Try again in 15 minutes.'
       });
     }

     // ... login logic
   });
   ```

#### ❌ DO NOT

1. ❌ Never expose admin credentials in client-side code
2. ❌ Never use HTTP in production (always HTTPS)
3. ❌ Never store tokens in localStorage (use httpOnly cookies)
4. ❌ Never disable CORS protections
5. ❌ Never log sensitive data (passwords, tokens)

### API Key Strategy

#### Create Permanent API Key

```bash
POST /token
x-jwt-token: <admin-token>

{
  "type": "permanent",
  "title": "Production App API Key",
  "permissions": ["read", "write", "admin"],
  "expiresAt": null,  // Never expires
  "restrictions": {
    "ip": ["10.0.0.0/8", "192.168.1.0/24"],  // IP whitelist
    "referer": ["https://myapp.com"]
  }
}
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "key": "perm_abc123xyz789",
  "title": "Production App API Key",
  "created": "2025-10-02T12:00:00.000Z"
}
```

#### Use API Key in Requests

```bash
# Use API key instead of JWT token
curl -X POST http://api.formio.com/form/xxx/submission \
  -H "x-token: perm_abc123xyz789" \
  -H "Content-Type: application/json" \
  -d '{"data": {...}}'
```

#### Rotate API Keys Regularly

```bash
# Best practice: Rotate every 90 days
# 1. Create new API key
NEW_KEY=$(curl -X POST /token ...)

# 2. Update application with new key
# 3. Verify new key works
# 4. Delete old key
curl -X DELETE /token/$OLD_KEY_ID \
  -H "x-jwt-token: $ADMIN_TOKEN"
```

---

## Environment Configuration

### Required Variables

```bash
# Form.io Server
FORMIO_URL=http://localhost:3001
FORMIO_PROJECT_URL=http://localhost:3001

# Authentication
ROOT_EMAIL=admin@example.com
ROOT_PASSWORD=SecurePassword123!
JWT_SECRET=randomly-generated-256-bit-secret
DB_SECRET=randomly-generated-256-bit-secret

# Database
MONGO=mongodb://localhost:27017/formioapp
MONGO_HIGH_AVAILABILITY=1

# File Storage (TUS)
TUS_UPLOAD_URL=http://localhost:1080/files/
TUS_CHUNK_SIZE=262144  # 256KB
TUS_MAX_FILE_SIZE=52428800  # 50MB

# Application
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# CORS
CORS_ORIGIN=https://myapp.com,https://admin.myapp.com
```

### Optional Variables

```bash
# Email Configuration
EMAIL_TYPE=sendgrid
EMAIL_APIKEY=SG.xxxxx
EMAIL_FROM=noreply@myapp.com

# SSL/TLS
SSL_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/formio.crt
SSL_KEY_PATH=/etc/ssl/private/formio.key

# Logging
DEBUG=formio:*
LOG_LEVEL=info

# Performance
CACHE_ENABLED=true
REDIS_URL=redis://localhost:6379

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000  # 1 minute
```

### Generate Secrets

```bash
# Generate secure random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### Environment-Specific Configs

```bash
# .env.development
FORMIO_URL=http://localhost:3001
NODE_ENV=development
DEBUG=formio:*

# .env.test
FORMIO_URL=http://localhost:3001
NODE_ENV=test
MONGO=mongodb://localhost:27017/formioapp_test

# .env.production
FORMIO_URL=https://api.myapp.com
NODE_ENV=production
DEBUG=  # Disable debug logs
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/formio-setup.yml
name: Form.io Setup and E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  setup-and-test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.adminCommand(\"ping\")'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      gcs-emulator:
        image: fsouza/fake-gcs-server:latest
        ports:
          - 4443:4443
        options: >-
          --health-cmd "wget --spider -q http://localhost:4443/storage/v1/b"

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Start Form.io server
        run: |
          docker-compose -f docker-compose.test.yml up -d formio-server
          sleep 30  # Wait for Form.io to be ready
        env:
          ROOT_EMAIL: ${{ secrets.FORMIO_ADMIN_EMAIL }}
          ROOT_PASSWORD: ${{ secrets.FORMIO_ADMIN_PASSWORD }}

      - name: Bootstrap Form.io
        run: |
          cd test-app/tests/setup
          ./formio-bootstrap.sh
        env:
          FORMIO_URL: http://localhost:3001
          ROOT_EMAIL: ${{ secrets.FORMIO_ADMIN_EMAIL }}
          ROOT_PASSWORD: ${{ secrets.FORMIO_ADMIN_PASSWORD }}

      - name: Health check
        run: |
          curl -f http://localhost:3001/health || exit 1

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true
          FORMIO_URL: http://localhost:3001

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: test-app/playwright-report/
          retention-days: 30

      - name: Upload test videos
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-videos
          path: test-app/test-results/
          retention-days: 7
```

### GitLab CI Example

```yaml
# .gitlab-ci.yml
stages:
  - setup
  - test

variables:
  FORMIO_URL: http://formio:3001
  MONGO_URL: mongodb://mongo:27017/formioapp_test

services:
  - name: mongo:6
    alias: mongo
  - name: fsouza/fake-gcs-server:latest
    alias: gcs

formio_setup:
  stage: setup
  image: node:20
  script:
    - npm ci
    - docker-compose -f docker-compose.test.yml up -d formio-server
    - sleep 30
    - cd test-app/tests/setup && ./formio-bootstrap.sh
  artifacts:
    paths:
      - test-app/.env.test
    expire_in: 1 hour

e2e_tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0
  dependencies:
    - formio_setup
  script:
    - npm ci
    - npx playwright install
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - test-app/playwright-report/
      - test-app/test-results/
    expire_in: 30 days
```

### Jenkins Pipeline Example

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        FORMIO_URL = 'http://localhost:3001'
        ROOT_EMAIL = credentials('formio-admin-email')
        ROOT_PASSWORD = credentials('formio-admin-password')
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm ci'
                sh 'docker-compose -f docker-compose.test.yml up -d'
                sh 'sleep 30'
            }
        }

        stage('Bootstrap Form.io') {
            steps {
                dir('test-app/tests/setup') {
                    sh './formio-bootstrap.sh'
                }
            }
        }

        stage('Health Check') {
            steps {
                sh 'curl -f http://localhost:3001/health'
            }
        }

        stage('E2E Tests') {
            steps {
                sh 'npx playwright install --with-deps'
                sh 'npm run test:e2e'
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'test-app/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])

            archiveArtifacts artifacts: 'test-app/test-results/**/*',
                             allowEmptyArchive: true
        }

        cleanup {
            sh 'docker-compose -f docker-compose.test.yml down -v'
        }
    }
}
```

---

## Troubleshooting

### Login Returns No Token

**Symptoms**:
```json
{
  "user": {...}
  // Missing "token" field
}
```

**Root Cause**: LoginAction.js sends response twice due to missing response guard

**Solution**:
```javascript
// File: /app/src/actions/LoginAction.js (line 267)
// Add before res.send():
if (res.headersSent) {
  return;
}
res.send(response);
```

**Verification**:
```bash
# Test login endpoint
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{"data":{"email":"admin@test.local","password":"TestPass123!"}}' \
  | jq '.token'

# Should output: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ERR_HTTP_HEADERS_SENT

**Symptoms**:
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

**Root Cause**: Same as "Login Returns No Token" - double response

**Solution**: Apply LoginAction.js patch (see above)

**Check Server Logs**:
```bash
docker-compose -f docker-compose.test.yml logs formio-server | grep ERR_HTTP
```

### Form Creation Fails

**Symptoms**:
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

**Possible Causes**:

1. **Expired JWT Token**
   ```bash
   # Token expires after 1 hour by default
   # Solution: Re-authenticate
   TOKEN=$(curl -X POST http://localhost:3001/user/login ...)
   ```

2. **Missing Admin Permissions**
   ```bash
   # Check user role
   curl http://localhost:3001/current \
     -H "x-jwt-token: $TOKEN" \
     | jq '.role'

   # Should be: "admin"
   ```

3. **Invalid Form Schema**
   ```bash
   # Validate JSON before sending
   cat form.json | jq '.'

   # Common issues:
   # - Missing required fields (title, name, path)
   # - Invalid component types
   # - Malformed JSON
   ```

**Debugging**:
```bash
# Enable debug logging
docker-compose -f docker-compose.test.yml exec formio-server \
  sh -c 'DEBUG=formio:* npm start'
```

### File Upload Fails

**Symptoms**:
- Upload starts but never completes
- Network errors in browser console
- TUS server returns 404

**Solutions**:

1. **Check TUS Server is Running**
   ```bash
   curl http://localhost:1080/
   # Should return: 404 page not found (expected)

   # Check container
   docker-compose -f docker-compose.test.yml ps tus-server
   ```

2. **Verify TUS URL in Form**
   ```bash
   # Form component should have correct URL
   curl http://localhost:3001/form/$FORM_ID \
     -H "x-jwt-token: $TOKEN" \
     | jq '.components[] | select(.type=="file") | .url'

   # Should output: "http://localhost:1080/files/"
   ```

3. **Check CORS Configuration**
   ```yaml
   # docker-compose.test.yml
   formio-server:
     environment:
       CORS_ORIGIN: "http://localhost:64849,http://localhost:3000"
   ```

4. **Monitor TUS Uploads**
   ```bash
   # Watch TUS server logs
   docker-compose -f docker-compose.test.yml logs -f tus-server
   ```

### Database Connection Issues

**Symptoms**:
```
MongoNetworkError: failed to connect to server [localhost:27017]
```

**Solutions**:

1. **Check MongoDB is Running**
   ```bash
   docker-compose -f docker-compose.test.yml ps mongodb

   # Should show: Up (healthy)
   ```

2. **Verify Connection String**
   ```bash
   # In Form.io container
   docker-compose -f docker-compose.test.yml exec formio-server \
     printenv | grep MONGO

   # Should output: mongodb://mongodb:27017/formioapp_test
   ```

3. **Test MongoDB Connection**
   ```bash
   docker-compose -f docker-compose.test.yml exec mongodb \
     mongosh --eval "db.adminCommand('ping')"
   ```

### Service Health Checks Failing

**Symptoms**:
```
ERROR: for formio-server  Container "xxx" is unhealthy
```

**Debugging**:

1. **Check Health Endpoint**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok"}
   ```

2. **View Container Logs**
   ```bash
   docker-compose -f docker-compose.test.yml logs formio-server
   ```

3. **Increase Health Check Timeout**
   ```yaml
   # docker-compose.test.yml
   formio-server:
     healthcheck:
       interval: 10s
       timeout: 5s
       retries: 20
       start_period: 30s  # Increase from 20s
   ```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Generate secure random secrets (JWT_SECRET, DB_SECRET)
- [ ] Configure HTTPS with valid SSL certificates
- [ ] Set up MongoDB replica set for high availability
- [ ] Configure email service (SendGrid, AWS SES, etc.)
- [ ] Set up file storage (AWS S3, GCS, Azure Blob)
- [ ] Enable rate limiting and DDoS protection
- [ ] Configure monitoring and alerting
- [ ] Set up automated backups
- [ ] Review and harden CORS settings
- [ ] Implement IP whitelisting for admin endpoints
- [ ] Enable audit logging
- [ ] Test disaster recovery procedures

### Production Environment Variables

```bash
# Security
JWT_SECRET=$(openssl rand -hex 32)
DB_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE_TIME=3600  # 1 hour

# Database (MongoDB Atlas)
MONGO="mongodb+srv://username:password@cluster.mongodb.net/formio?retryWrites=true&w=majority"
MONGO_HIGH_AVAILABILITY=1

# File Storage (AWS S3)
FORMIO_FILES_SERVER=s3
FORMIO_S3_SERVER=https://s3.amazonaws.com
FORMIO_S3_BUCKET=myapp-formio-uploads
FORMIO_S3_REGION=us-east-1
FORMIO_S3_KEY=${AWS_ACCESS_KEY_ID}
FORMIO_S3_SECRET=${AWS_SECRET_ACCESS_KEY}

# Email (SendGrid)
EMAIL_TYPE=sendgrid
EMAIL_APIKEY=${SENDGRID_API_KEY}
EMAIL_FROM=noreply@myapp.com

# Application
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# CORS
CORS_ORIGIN=https://myapp.com,https://admin.myapp.com

# SSL
SSL_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/formio.crt
SSL_KEY_PATH=/etc/ssl/private/formio.key

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
LOG_LEVEL=warn

# Performance
CACHE_ENABLED=true
REDIS_URL=redis://redis.myapp.internal:6379
```

### Kubernetes Deployment

```yaml
# kubernetes/formio-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: formio-server
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: formio
  template:
    metadata:
      labels:
        app: formio
    spec:
      containers:
      - name: formio
        image: formio/formio:latest
        ports:
        - containerPort: 3001
        env:
        - name: MONGO
          valueFrom:
            secretKeyRef:
              name: formio-secrets
              key: mongo-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: formio-secrets
              key: jwt-secret
        - name: DB_SECRET
          valueFrom:
            secretKeyRef:
              name: formio-secrets
              key: db-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: formio-service
  namespace: production
spec:
  selector:
    app: formio
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  formio:
    image: formio/formio:latest
    restart: always
    ports:
      - "3001:3001"
    environment:
      MONGO: ${MONGO_URL}
      JWT_SECRET: ${JWT_SECRET}
      DB_SECRET: ${DB_SECRET}
      NODE_ENV: production
      CORS_ORIGIN: ${CORS_ORIGIN}
    env_file:
      - .env.production
    depends_on:
      - mongodb
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  mongodb:
    image: mongo:6
    restart: always
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - formio

volumes:
  mongo-data:
```

### Monitoring Setup

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"

volumes:
  grafana-data:
```

---

## Additional Resources

- **Form.io Documentation**: https://help.form.io/developers/api
- **Form.io GitHub**: https://github.com/formio/formio
- **TUS Protocol Specification**: https://tus.io/protocols/resumable-upload.html
- **MongoDB High Availability**: https://docs.mongodb.com/manual/replication/
- **Kubernetes Best Practices**: https://kubernetes.io/docs/concepts/configuration/overview/

---

## Support

For issues or questions:
1. Check Form.io server logs: `docker-compose logs formio-server`
2. Review MongoDB logs: `docker-compose logs mongodb`
3. Check TUS server logs: `docker-compose logs tus-server`
4. Enable debug mode: `DEBUG=formio:*`
5. Review this troubleshooting guide

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-02
**Maintainer**: DevOps Team
