# GCS Testing Guide - Real Google Cloud Storage

**Status:** ✅ Ready to Execute
**Date:** October 5, 2025
**GCP Project:** `erlich-dev`
**Bucket:** `formio-test-uploads-erlich`

---

## 📋 Overview

This guide covers testing the consolidated Docker Compose infrastructure with **real Google Cloud Storage** using the existing `dev-mish` service account.

---

## 🔐 Credentials Configuration

### Service Account (Existing)

- **Account:** `dev-mish@dss-infra-terraform-admin.iam.gserviceaccount.com`
- **Key Path:** `$HOME/.config/gcloud/keys/dev-mish-key.json`
- **Project:** `erlich-dev`
- **Permissions:** ✅ `roles/storage.admin`

### GCS Bucket

- **Name:** `formio-test-uploads-erlich`
- **Location:** `us-central1`
- **Storage Class:** `STANDARD`
- **Access:** Uniform bucket-level access

---

## 🚀 Quick Start

### 1. Start Infrastructure with Real GCS

```bash
# Navigate to project root
cd /Users/mishal/code/work/formio-monorepo

# Start with real GCS configuration
docker-compose -f docker-compose.yml \
  -f docker-compose.real-gcs.yml \
  --env-file .env.real-gcs up -d

# Verify all services healthy
docker-compose ps

# Check Form.io server logs
docker-compose logs -f formio-server | grep -i gcs
```

### 2. Run Backend Integration Tests

```bash
# Test with GCS emulator (baseline)
cd formio
bun test src/upload/__tests__/integration.test.js

# Test with real GCS (4 tests)
bun test src/upload/__tests__/integration-real-gcs.test.js
```

### 3. Run E2E React Tests

```bash
cd test-app

# Standard E2E tests (4 tests)
bun run test:e2e tests/e2e/gcs-upload.spec.ts

# Stress tests (4 tests)
bun run test:e2e:stress tests/e2e/gcs-stress.spec.ts
```

---

## 🧪 Test Suites

### Suite 1: Infrastructure Validation

**Command:**
```bash
docker-compose ps
curl http://localhost:3001/health
docker exec formio-redis redis-cli ping
```

**Expected:**
- ✅ 5 services running (mongodb, redis, gcs-emulator, formio-server, tus-server)
- ✅ All health checks passing
- ✅ Redis responds to ping

---

### Suite 2: Backend Integration (GCS Emulator)

**File:** `formio/src/upload/__tests__/integration.test.js`
**Tests:** 5

```bash
cd formio
bun test src/upload/__tests__/integration.test.js
```

**Tests:**
1. ✅ Job enqueueing on TUS upload complete
2. ✅ BullMQ worker processes job
3. ✅ Upload to GCS emulator
4. ✅ MongoDB submission update
5. ✅ Retry logic with exponential backoff

---

### Suite 3: Backend Integration (Real GCS)

**File:** `formio/src/upload/__tests__/integration-real-gcs.test.js`
**Tests:** 4

```bash
cd formio
bun test src/upload/__tests__/integration-real-gcs.test.js
```

**Tests:**
1. ✅ Upload file to actual GCS bucket
2. ✅ Generate valid signed URL
3. ✅ File accessible via signed URL
4. ✅ Cleanup test files from bucket

**Verification:**
```bash
# List files in bucket
gsutil ls gs://formio-test-uploads-erlich

# View file metadata
gsutil stat gs://formio-test-uploads-erlich/test-file.txt
```

---

### Suite 4: E2E React Tests (Real GCS)

**File:** `test-app/tests/e2e/gcs-upload.spec.ts`
**Tests:** 4

```bash
cd test-app
bun run test:e2e tests/e2e/gcs-upload.spec.ts
```

**Tests:**
1. ✅ Form renders with upload component
2. ✅ Upload files via React form
3. ✅ Submission displays uploaded files
4. ✅ Bulk upload (15 files)

---

### Suite 5: Stress Tests

**File:** `test-app/tests/e2e/gcs-stress.spec.ts`
**Tests:** 4

```bash
cd test-app
bun run test:e2e:stress tests/e2e/gcs-stress.spec.ts
```

**Tests:**
1. ✅ 30 concurrent uploads (< 60s total)
2. ✅ 10+ jobs/second throughput
3. ✅ No memory leaks after 100 uploads (< 50MB increase)
4. ✅ >95% retry success rate

---

## 📊 Test Execution Timeline

| Phase | Duration | Command |
|-------|----------|---------|
| **Setup** | 2 min | `docker-compose up -d` |
| **Infrastructure Check** | 1 min | `docker-compose ps && curl health` |
| **Integration (Emulator)** | 2 min | `bun test integration.test.js` |
| **Integration (Real GCS)** | 3 min | `bun test integration-real-gcs.test.js` |
| **E2E Tests** | 5 min | `bun run test:e2e gcs-upload.spec.ts` |
| **Stress Tests** | 8 min | `bun run test:e2e:stress` |
| **Report Generation** | 2 min | Generate summary |
| **Cleanup** | 2 min | Delete bucket files, stop Docker |
| **Total** | **~25 min** | |

---

## 🔍 Monitoring & Debugging

### Check BullMQ Job Queue

```bash
# Redis CLI
docker exec -it formio-redis redis-cli

# List all jobs
KEYS "bull:gcs-upload:*"

# Get job details
HGETALL "bull:gcs-upload:123"

# Check job counts
bull:gcs-upload:waiting
bull:gcs-upload:active
bull:gcs-upload:completed
bull:gcs-upload:failed
```

### Check GCS Upload Status

```bash
# List all files in bucket
gsutil ls gs://formio-test-uploads-erlich

# Get file metadata
gsutil stat gs://formio-test-uploads-erlich/test-file.txt

# Download file for inspection
gsutil cp gs://formio-test-uploads-erlich/test-file.txt ./

# Check bucket size
gsutil du -sh gs://formio-test-uploads-erlich
```

### View Form.io Logs

```bash
# All logs
docker-compose logs -f formio-server

# GCS-specific logs
docker-compose logs formio-server | grep -i gcs

# Upload workflow logs
docker-compose logs formio-server | grep -i upload

# BullMQ worker logs
docker-compose logs formio-server | grep -i bullmq
```

### Monitor MongoDB

```bash
# MongoDB shell
docker exec -it formio-mongo mongosh formioapp_gcs_test

# Find submissions with GCS uploads
db.submissions.find({ "data.testFile.storage": "gcs" }).pretty()

# Count GCS submissions
db.submissions.countDocuments({ "data.testFile.url": { $regex: "storage.googleapis.com" } })

# View latest submission
db.submissions.find().sort({ created: -1 }).limit(1).pretty()
```

---

## 🧹 Cleanup

### Delete Test Files from GCS

```bash
# Delete all files (keeps bucket)
gsutil -m rm -r gs://formio-test-uploads-erlich/**

# Or delete specific test files
gsutil rm gs://formio-test-uploads-erlich/test-*.txt
```

### Delete GCS Bucket (Optional)

```bash
# Delete bucket and all contents
gcloud storage buckets delete gs://formio-test-uploads-erlich --project=erlich-dev
```

### Stop Docker Services

```bash
# Stop and remove containers (keeps volumes)
docker-compose down

# Stop and remove containers + volumes (full cleanup)
docker-compose down -v
```

---

## 📈 Performance Benchmarks

### Expected Results

| Metric | Target | Actual |
|--------|--------|--------|
| Upload Latency (per file) | < 2s | TBD |
| Bulk Upload (15 files) | < 30s | TBD |
| Concurrent Uploads (30 files) | < 60s | TBD |
| Throughput | > 10 jobs/sec | TBD |
| Memory Leak (100 uploads) | < 50MB increase | TBD |
| Retry Success Rate | > 95% | TBD |

### Performance Tuning

```bash
# Increase BullMQ concurrency
# In .env.real-gcs:
BULLMQ_WORKER_CONCURRENCY=10  # Default: 5

# Increase TUS max size
TUS_MAX_SIZE=10737418240  # 10GB

# Enable Redis persistence (optional)
# Modify docker-compose.yml redis service:
command: redis-server --appendonly yes
```

---

## 🐛 Troubleshooting

### Issue: GCS authentication fails

```bash
# Verify credentials file exists
ls -lah ~/.config/gcloud/keys/dev-mish-key.json

# Test authentication
gcloud auth activate-service-account \
  --key-file=$HOME/.config/gcloud/keys/dev-mish-key.json

# Check service account permissions
gcloud projects get-iam-policy erlich-dev \
  --flatten="bindings[].members" \
  --filter="bindings.members:dev-mish@dss-infra-terraform-admin.iam.gserviceaccount.com"
```

### Issue: Docker can't access credentials

```bash
# Verify volume mount
docker inspect formio-server | grep -A 5 Mounts

# Check file exists in container
docker exec formio-server ls -lah /app/gcs-credentials.json

# Verify environment variable
docker exec formio-server env | grep GOOGLE_APPLICATION_CREDENTIALS
```

### Issue: Files not uploading to GCS

```bash
# Check formio-server logs
docker-compose logs formio-server | grep -i error

# Check BullMQ queue status
docker exec formio-redis redis-cli KEYS "bull:gcs-upload:failed:*"

# Test GCS connectivity from container
docker exec formio-server curl -I https://storage.googleapis.com
```

### Issue: Tests failing

```bash
# Run tests with debug output
DEBUG=* bun test src/upload/__tests__/integration-real-gcs.test.js

# Check test fixtures
ls -lah formio/src/upload/__tests__/fixtures/

# Verify Form.io server is healthy
curl http://localhost:3001/health
```

---

## 📝 Configuration Files

### .env.real-gcs
Location: `/Users/mishal/code/work/formio-monorepo/.env.real-gcs`

### docker-compose.real-gcs.yml
Location: `/Users/mishal/code/work/formio-monorepo/docker-compose.real-gcs.yml`

### Test Files
- `formio/src/upload/__tests__/integration-real-gcs.test.js` (4 tests)
- `test-app/tests/e2e/gcs-upload.spec.ts` (4 tests)
- `test-app/tests/e2e/gcs-stress.spec.ts` (4 tests)

---

## ✅ Success Criteria

### Infrastructure
- ✅ GCS bucket created: `formio-test-uploads-erlich`
- ✅ Service account authenticated
- ✅ All Docker services healthy
- ✅ Credentials mounted correctly

### Testing
- ✅ 5 integration tests pass (emulator)
- ✅ 4 integration tests pass (real GCS)
- ✅ 4 E2E tests pass
- ✅ 4 stress tests pass
- ✅ **Total: 17 tests passing**

### Performance
- ✅ Upload latency < 2s
- ✅ Bulk upload (15 files) < 30s
- ✅ Retry success rate > 95%
- ✅ No memory leaks

---

## 🚀 Next Steps

1. **Execute Test Suite:**
   ```bash
   # Run all tests
   ./scripts/run-gcs-tests.sh
   ```

2. **Review Test Report:**
   - Location: `docs/GCS_TESTING_REPORT.md`
   - Includes: Performance metrics, pass/fail status, recommendations

3. **Production Deployment:**
   - Update `.env` with production GCS credentials
   - Configure real bucket with appropriate lifecycle policies
   - Enable monitoring and alerting

---

**Status:** ✅ Ready to Execute
**Last Updated:** October 5, 2025
**Maintained By:** Form.io Development Team
