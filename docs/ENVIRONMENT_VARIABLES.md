# Environment Variables Documentation

Complete reference for all environment variables used in the Form.io file upload feature.

## Table of Contents

- [Core Configuration](#core-configuration)
- [Database Configuration](#database-configuration)
- [File Storage (GCS/S3)](#file-storage-gcss3)
- [TUS Upload Server](#tus-upload-server)
- [Authentication & Security](#authentication--security)
- [CORS & Networking](#cors--networking)
- [Processing & Workers](#processing--workers)
- [Logging & Debugging](#logging--debugging)
- [Performance Tuning](#performance-tuning)
- [Environment-Specific Settings](#environment-specific-settings)

---

## Core Configuration

### `NODE_ENV`
- **Type**: String
- **Default**: `development`
- **Options**: `development`, `production`, `test`
- **Description**: Application environment mode
- **Example**: `NODE_ENV=production`

### `PORT`
- **Type**: Number
- **Default**: `3001`
- **Description**: HTTP server port for Form.io server
- **Example**: `PORT=3001`

### `HOST`
- **Type**: String
- **Default**: `0.0.0.0`
- **Description**: Server bind address
- **Example**: `HOST=0.0.0.0`

---

## Database Configuration

### `MONGO`
- **Type**: String
- **Required**: Yes
- **Description**: MongoDB connection string
- **Example**: `MONGO=mongodb://localhost:27017/formioapp`
- **Production Example**: `MONGO=mongodb://user:pass@mongo-cluster:27017/formioapp?authSource=admin&replicaSet=rs0`

### `DB_SECRET`
- **Type**: String
- **Required**: Yes
- **Description**: Database encryption secret (min 16 characters)
- **Example**: `DB_SECRET=your-secure-db-secret-key-here`
- **Security**: 🔐 **Keep this secret! Never commit to version control**

---

## File Storage (GCS/S3)

### `FORMIO_FILES_SERVER`
- **Type**: String
- **Default**: `local`
- **Options**: `local`, `s3`, `gcs`, `azure`
- **Description**: File storage backend type
- **Example**: `FORMIO_FILES_SERVER=gcs`

### `FORMIO_S3_SERVER`
- **Type**: String (URL)
- **Required**: When using GCS/S3
- **Description**: Storage server endpoint URL
- **Local Dev**: `http://gcs-emulator:4443`
- **GCS Production**: `https://storage.googleapis.com`
- **AWS S3**: `https://s3.amazonaws.com`
- **Example**: `FORMIO_S3_SERVER=http://gcs-emulator:4443`

### `FORMIO_S3_BUCKET`
- **Type**: String
- **Required**: When using GCS/S3
- **Description**: Storage bucket name
- **Example**: `FORMIO_S3_BUCKET=local-formio-uploads`
- **Production**: `FORMIO_S3_BUCKET=prod-formio-uploads-us-east-1`

### `FORMIO_S3_REGION`
- **Type**: String
- **Default**: `auto`
- **Description**: Storage region
- **Example**: `FORMIO_S3_REGION=us-east-1`
- **GCS**: Use `auto` for auto-detection

### `FORMIO_S3_KEY`
- **Type**: String
- **Required**: When using GCS/S3
- **Description**: Storage access key ID
- **Example**: `FORMIO_S3_KEY=AKIAIOSFODNN7EXAMPLE`
- **Security**: 🔐 **Keep this secret!**

### `FORMIO_S3_SECRET`
- **Type**: String
- **Required**: When using GCS/S3
- **Description**: Storage secret access key
- **Example**: `FORMIO_S3_SECRET=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- **Security**: 🔐 **Keep this secret!**

### `FORMIO_S3_PATH_STYLE`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Use path-style URLs (required for some S3-compatible services)
- **Example**: `FORMIO_S3_PATH_STYLE=true`

---

## TUS Upload Server

### `TUS_UPLOAD_DIR`
- **Type**: String (Path)
- **Default**: `/data/uploads`
- **Description**: Directory for storing temporary upload chunks
- **Example**: `TUS_UPLOAD_DIR=/var/formio/uploads`

### `TUS_MAX_SIZE`
- **Type**: Number (Bytes)
- **Default**: `5368709120` (5GB)
- **Description**: Maximum upload file size
- **Example**: `TUS_MAX_SIZE=10737418240` (10GB)

### `TUS_BASE_PATH`
- **Type**: String
- **Default**: `/files/`
- **Description**: Base path for TUS upload endpoints
- **Example**: `TUS_BASE_PATH=/uploads/`

### `TUS_SERVER_URL`
- **Type**: String (URL)
- **Default**: `http://tus-server:1080`
- **Description**: TUS server URL for internal communication
- **Example**: `TUS_SERVER_URL=http://tus-server:1080`

---

## Authentication & Security

### `JWT_SECRET`
- **Type**: String
- **Required**: Yes
- **Description**: JWT token signing secret (min 32 characters)
- **Example**: `JWT_SECRET=your-very-long-secure-random-jwt-secret-key-here`
- **Security**: 🔐 **Keep this secret! Never commit to version control**
- **Generation**: `openssl rand -base64 32`

### `ROOT_EMAIL`
- **Type**: String (Email)
- **Required**: Yes
- **Description**: Administrator email address
- **Example**: `ROOT_EMAIL=admin@example.com`

### `ROOT_PASSWORD`
- **Type**: String
- **Required**: Yes
- **Description**: Administrator password (min 8 characters)
- **Example**: `ROOT_PASSWORD=SecureAdminPass123!`
- **Security**: 🔐 **Use a strong password!**

### `WEBHOOK_SECRET`
- **Type**: String
- **Default**: Auto-generated
- **Description**: Secret for validating webhook signatures
- **Example**: `WEBHOOK_SECRET=webhook-signing-secret-key`
- **Security**: 🔐 **Keep this secret!**

---

## CORS & Networking

### `CORS_ORIGIN`
- **Type**: String (Comma-separated URLs)
- **Default**: `*` (dev only)
- **Description**: Allowed CORS origins
- **Example**: `CORS_ORIGIN=http://localhost:3000,https://app.example.com`
- **Production**: Always specify exact origins, never use `*`

### `CORS_METHODS`
- **Type**: String (Comma-separated)
- **Default**: `GET,POST,PUT,PATCH,DELETE,OPTIONS`
- **Description**: Allowed HTTP methods
- **Example**: `CORS_METHODS=GET,POST,PUT,DELETE`

### `CORS_ALLOW_CREDENTIALS`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Allow credentials in CORS requests
- **Example**: `CORS_ALLOW_CREDENTIALS=true`

---

## Processing & Workers

### `PROCESSOR_CONCURRENCY`
- **Type**: Number
- **Default**: `5`
- **Description**: Number of concurrent upload processing jobs
- **Example**: `PROCESSOR_CONCURRENCY=10`

### `PROCESSOR_BATCH_SIZE`
- **Type**: Number
- **Default**: `10`
- **Description**: Number of files to process per batch
- **Example**: `PROCESSOR_BATCH_SIZE=20`

### `PROCESSOR_POLL_INTERVAL`
- **Type**: Number (Milliseconds)
- **Default**: `5000`
- **Description**: Interval between processing polls
- **Example**: `PROCESSOR_POLL_INTERVAL=10000`

### `REDIS_URL`
- **Type**: String (URL)
- **Optional**: Yes
- **Description**: Redis connection URL for job queues
- **Example**: `REDIS_URL=redis://localhost:6379/0`

---

## Logging & Debugging

### `DEBUG`
- **Type**: String (Comma-separated namespaces)
- **Default**: None
- **Description**: Debug logging namespaces
- **Examples**:
  - All Form.io logs: `DEBUG=formio:*`
  - Upload logs only: `DEBUG=formio:upload:*`
  - Multiple: `DEBUG=formio:*,express:*`

### `LOG_LEVEL`
- **Type**: String
- **Default**: `info`
- **Options**: `error`, `warn`, `info`, `debug`, `trace`
- **Description**: Application log level
- **Example**: `LOG_LEVEL=debug`

### `LOG_FORMAT`
- **Type**: String
- **Default**: `json`
- **Options**: `json`, `text`, `pretty`
- **Description**: Log output format
- **Example**: `LOG_FORMAT=pretty`

---

## Performance Tuning

### `MAX_CONNECTIONS`
- **Type**: Number
- **Default**: `100`
- **Description**: Maximum concurrent database connections
- **Example**: `MAX_CONNECTIONS=200`

### `CONNECTION_TIMEOUT`
- **Type**: Number (Milliseconds)
- **Default**: `30000`
- **Description**: Database connection timeout
- **Example**: `CONNECTION_TIMEOUT=60000`

### `CACHE_ENABLED`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Enable response caching
- **Example**: `CACHE_ENABLED=true`

### `CACHE_TTL`
- **Type**: Number (Seconds)
- **Default**: `300`
- **Description**: Cache time-to-live
- **Example**: `CACHE_TTL=600`

---

## Environment-Specific Settings

### Local Development (`.env.local`)

```bash
# Local Development Environment
NODE_ENV=development
DEBUG=formio:*

# Server
PORT=3001
HOST=0.0.0.0

# Database
MONGO=mongodb://localhost:27017/formioapp

# Secrets (local dev only - DO NOT use in production!)
JWT_SECRET=local-dev-jwt-secret-change-in-production
DB_SECRET=local-dev-db-secret-change-in-production

# File Storage (GCS Emulator)
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=http://gcs-emulator:4443
FORMIO_S3_BUCKET=local-formio-uploads
FORMIO_S3_REGION=auto
FORMIO_S3_KEY=local-access-key
FORMIO_S3_SECRET=local-secret-key

# TUS Upload
TUS_UPLOAD_DIR=/data/uploads
TUS_MAX_SIZE=5368709120

# Admin
ROOT_EMAIL=admin@local.test
ROOT_PASSWORD=admin123

# CORS (allow test app)
CORS_ORIGIN=http://localhost:64849,http://localhost:3000
```

### Staging Environment (`.env.staging`)

```bash
# Staging Environment
NODE_ENV=staging
DEBUG=formio:error,formio:warn

# Server
PORT=3001
HOST=0.0.0.0

# Database (use actual staging MongoDB)
MONGO=mongodb://staging-user:${MONGO_PASSWORD}@mongo-staging:27017/formioapp?authSource=admin

# Secrets (from secure vault)
JWT_SECRET=${STAGING_JWT_SECRET}
DB_SECRET=${STAGING_DB_SECRET}

# File Storage (staging GCS bucket)
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=https://storage.googleapis.com
FORMIO_S3_BUCKET=staging-formio-uploads
FORMIO_S3_REGION=us-east-1
FORMIO_S3_KEY=${STAGING_GCS_KEY}
FORMIO_S3_SECRET=${STAGING_GCS_SECRET}

# TUS Upload
TUS_UPLOAD_DIR=/var/formio/uploads
TUS_MAX_SIZE=5368709120

# Admin
ROOT_EMAIL=${STAGING_ADMIN_EMAIL}
ROOT_PASSWORD=${STAGING_ADMIN_PASSWORD}

# CORS (staging domains only)
CORS_ORIGIN=https://staging-app.example.com,https://staging-admin.example.com

# Performance
PROCESSOR_CONCURRENCY=10
CACHE_ENABLED=true
```

### Production Environment (`.env.production`)

```bash
# Production Environment
NODE_ENV=production
DEBUG=formio:error

# Server
PORT=3001
HOST=0.0.0.0

# Database (production MongoDB cluster)
MONGO=mongodb://prod-user:${MONGO_PASSWORD}@mongo-prod-1:27017,mongo-prod-2:27017,mongo-prod-3:27017/formioapp?authSource=admin&replicaSet=rs0&ssl=true

# Secrets (from secure vault - NEVER hardcode!)
JWT_SECRET=${PROD_JWT_SECRET}
DB_SECRET=${PROD_DB_SECRET}

# File Storage (production GCS bucket with CDN)
FORMIO_FILES_SERVER=gcs
FORMIO_S3_SERVER=https://storage.googleapis.com
FORMIO_S3_BUCKET=prod-formio-uploads-us-east-1
FORMIO_S3_REGION=us-east-1
FORMIO_S3_KEY=${PROD_GCS_KEY}
FORMIO_S3_SECRET=${PROD_GCS_SECRET}

# TUS Upload
TUS_UPLOAD_DIR=/var/formio/uploads
TUS_MAX_SIZE=10737418240

# Admin
ROOT_EMAIL=${PROD_ADMIN_EMAIL}
ROOT_PASSWORD=${PROD_ADMIN_PASSWORD}

# CORS (production domains only)
CORS_ORIGIN=https://app.example.com,https://admin.example.com

# Performance (production optimized)
PROCESSOR_CONCURRENCY=20
PROCESSOR_BATCH_SIZE=50
CACHE_ENABLED=true
CACHE_TTL=600
MAX_CONNECTIONS=500

# Redis (for job queues)
REDIS_URL=${PROD_REDIS_URL}

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

---

## Security Best Practices

### ⚠️ Secret Management

1. **Never commit secrets to version control**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Use environment-specific secret management**
   - Local: `.env.local` (not committed)
   - Staging/Prod: Vault, AWS Secrets Manager, or similar

3. **Rotate secrets regularly**
   - JWT secrets: Every 90 days
   - Database secrets: Every 90 days
   - API keys: Every 90 days

4. **Use strong secrets**
   ```bash
   # Generate strong secrets
   openssl rand -base64 32
   ```

### 🔒 CORS Configuration

```bash
# ❌ NEVER use in production
CORS_ORIGIN=*

# ✅ Always specify exact origins
CORS_ORIGIN=https://app.example.com,https://admin.example.com
```

### 🛡️ File Upload Security

```bash
# Limit upload size
TUS_MAX_SIZE=5368709120  # 5GB max

# Use secure bucket permissions
# GCS: Private bucket with signed URLs
# S3: Bucket policy with strict permissions
```

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Verify connection string
echo $MONGO

# Test connection
mongosh $MONGO --eval "db.adminCommand('ping')"
```

**GCS Upload Failed**
```bash
# Check GCS emulator is running
curl http://localhost:4443/storage/v1/b

# Verify bucket exists
curl http://localhost:4443/storage/v1/b/local-formio-uploads

# Check credentials
echo $FORMIO_S3_KEY
echo $FORMIO_S3_SECRET
```

**TUS Upload Timeout**
```bash
# Increase timeout
TUS_MAX_SIZE=10737418240
PROCESSOR_POLL_INTERVAL=10000

# Check disk space
df -h /data/uploads
```

---

## Environment Variable Validation

Use this checklist before deployment:

- [ ] All required variables are set
- [ ] Secrets are NOT hardcoded
- [ ] CORS origins are explicitly defined (no `*`)
- [ ] Database connection string is correct
- [ ] Storage credentials are valid
- [ ] Upload limits are appropriate
- [ ] Admin credentials are secure
- [ ] Debug logging is appropriate for environment
- [ ] Performance settings are tuned

---

## Additional Resources

- [Form.io Documentation](https://help.form.io)
- [TUS Protocol Specification](https://tus.io/protocols/resumable-upload.html)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

**Last Updated**: 2025-09-30