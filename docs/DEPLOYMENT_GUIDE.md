# Form.io Custom Enhanced Edition - Deployment Guide

## Overview

This guide covers deploying the customized Form.io server with enhanced file upload capabilities to Google Cloud Platform using the DSS Form.io service Terraform configuration.

## Prerequisites

### Required Tools

1. **Google Cloud SDK**
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL

   # Initialize gcloud
   gcloud init
   gcloud auth login
   gcloud auth application-default login

   # Set project
   gcloud config set project erlich-dev
   gcloud config set region australia-southeast1
   ```

2. **Docker Desktop**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Ensure Docker is running locally

3. **Terraform**
   ```bash
   # Install Terraform 1.5+
   brew install terraform  # macOS
   # Or download from terraform.io
   ```

4. **Make**
   - macOS/Linux: Pre-installed
   - Windows: Install via WSL or Git Bash

### Authentication Setup

1. **Service Account Key**
   ```bash
   # Create service account directory
   mkdir -p ~/.config/gcloud/keys

   # Download service account key from GCP Console
   # Save as: ~/.config/gcloud/keys/dev-mish-key.json

   # Set environment variable
   export GOOGLE_APPLICATION_CREDENTIALS=~/.config/gcloud/keys/dev-mish-key.json
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable \
     cloudbuild.googleapis.com \
     run.googleapis.com \
     artifactregistry.googleapis.com \
     secretmanager.googleapis.com \
     sqladmin.googleapis.com \
     compute.googleapis.com
   ```

## Deployment Steps

### 1. Clone and Initialize Repository

```bash
# Clone with submodules
git clone --recurse-submodules <repository-url>
cd formio-monorepo

# Initialize submodules (if needed)
git submodule update --init --recursive
```

### 2. Configure Environment Variables

Create `.env` file in `dss-formio-service/`:
```bash
# Form.io Configuration
export TF_VAR_formio_root_email="admin@dsselectrical.com.au"
export TF_VAR_formio_license_key="your-license-key"  # Not needed for custom

# MongoDB Atlas Configuration
export MONGODB_ATLAS_PUBLIC_KEY="your-atlas-public-key"
export MONGODB_ATLAS_PRIVATE_KEY="your-atlas-private-key"
export TF_VAR_mongodb_atlas_org_id="your-atlas-org-id"
```

### 3. Build Custom Docker Image (Local)

```bash
# Navigate to dss-formio-service directory
cd dss-formio-service

# Build Docker image locally
make docker-build CUSTOM_TAG=v4.5.2-enhanced-local

# Or use automatic tag
make docker-build

# Authenticate with Artifact Registry
make docker-auth

# Push to Artifact Registry
make docker-push
```

### 4. Deploy Infrastructure with Terraform

```bash
# Navigate to environment directory
cd terraform/environments/dev

# Initialize Terraform
make init

# Plan deployment
make plan

# Apply infrastructure
make apply

# Verify deployment
make status
```

### 5. Deploy Custom Form.io Service

#### Option A: Using Pre-built Image
```bash
# Deploy using the image you just pushed
make deploy-custom IMG_CUSTOM=australia-southeast1-docker.pkg.dev/erlich-dev/formio-custom/formio:v4.5.2-enhanced-local

# Or update terraform.tfvars with your image tag
# Then apply again
terraform apply
```

#### Option B: Build and Deploy in One Step
```bash
# Build and deploy in one command
make deploy-custom-local

# This will:
# 1. Build the Docker image
# 2. Tag and push to Artifact Registry
# 3. Deploy to Cloud Run
```

## Configuration Details

### Terraform Variables

Key variables in `terraform/environments/dev/terraform.tfvars`:

```hcl
# Enable custom service
deploy_custom = true

# Custom image tag
custom_image_tag = "v4.5.2-enhanced"

# Enhanced features
enable_async_gcs_upload = true
bullmq_worker_concurrency = 3
xxhash_enabled = true
railway_oriented_uploads = true

# Performance settings
min_instance_count = 0
max_instance_count = 10
memory_limit = "1Gi"
cpu_limit = "1000m"

# Storage
storage_bucket_name = "formio-uploads-dev"
```

### Environment Variables

The custom service is configured with these environment variables:

```bash
# Database
MONGO=mongodb://connection-string/formioapp
JWT_SECRET=<from-secret-manager>
DB_SECRET=<from-secret-manager>

# Enhanced Features
ENABLE_ASYNC_GCS_UPLOAD=true
BULLMQ_WORKER_CONCURRENCY=3
XXHASH_ENABLED=true
RAILWAY_ORIENTED_UPLOADS=true

# Storage
FORMIO_FILES_SERVER=s3
FORMIO_S3_SERVER=https://storage.googleapis.com
FORMIO_S3_BUCKET=formio-uploads-dev
GCS_PROJECT_ID=erlich-dev

# Redis (BullMQ)
REDIS_HOST=10.8.0.2
REDIS_PORT=6379

# Service Configuration
PORTAL_ENABLED=1
ROOT_EMAIL=admin@dsselectrical.com.au
NODE_ENV=development
```

## Verification Steps

### 1. Check Service Status
```bash
# Get service URL
SERVICE_URL=$(cd terraform/environments/dev && terraform output -raw service_url)
echo "Service URL: $SERVICE_URL"

# Health check
curl -f "$SERVICE_URL/health"

# Should return:
# {
#   "status": "ok",
#   "database": "connected",
#   "timestamp": "2025-01-08T10:30:00.000Z"
# }
```

### 2. Verify Enhanced Features
```bash
# Check file upload endpoint
curl -X POST "$SERVICE_URL/form" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "title": "Test Upload Form",
    "components": [{
      "type": "file",
      "key": "upload",
      "label": "Upload File"
    }]
  }'

# Upload should use:
# - TUS resumable upload protocol
# - xxHash integrity validation
# - Railway-oriented atomic processing
# - Async BullMQ processing
```

### 3. Check Logs
```bash
# View service logs
gcloud logs tail "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=formio-custom-dev"

# Check for custom features
grep -E "(async.*upload|xxhash|railway.*upload|bullmq)"
```

### 4. Test File Upload
```bash
# Create test file
echo "Test content" > test.txt

# Upload using TUS protocol
curl -X PATCH "$SERVICE_URL/tus" \
  -H "TUS-Resumable: 1.0.0" \
  -H "Upload-Length: 13" \
  -H "Content-Type: application/offset+octet-stream" \
  -H "Content-Range: bytes 0-12/13" \
  -H "Upload-Metadata: filename dGVzdC50eHQ=" \
  -d @test.txt
```

## Monitoring and Debugging

### Logs
```bash
# Service logs
make logs-custom

# Or via gcloud
gcloud logs read "resource.type=cloud_run_revision" \
  --limit 50 \
  --format "table(timestamp,textPayload)"
```

### Metrics
```bash
# Check Cloud Run metrics
gcloud monitoring metrics list \
  --filter="metric.type=run.googleapis.com"

# View custom metrics (if configured)
gcloud monitoring metrics list \
  --filter="metric.type.startsWith('custom.googleapis.com')"
```

### Common Issues

1. **Build Fails**
   ```bash
   # Check Node.js version
   node --version  # Should be >=20.0.0

   # Clean Docker cache
   docker system prune -a
   make docker-clean
   ```

2. **Push Fails**
   ```bash
   # Re-authenticate
   gcloud auth login
   make docker-auth

   # Check permissions
   gcloud artifacts repositories list
   ```

3. **Deployment Fails**
   ```bash
   # Check Terraform state
   cd terraform/environments/dev
   terraform show

   # Check Cloud Run logs
   gcloud run services describe formio-custom-dev \
     --region=australia-southeast1 \
     --format="yaml"
   ```

4. **Service Not Responding**
   ```bash
   # Check if service is running
   gcloud run services list \
     --filter="metadata.name=formio-custom-dev"

   # Check revision status
   gcloud run revisions list \
     --service=formio-custom-dev \
     --region=australia-southeast1
   ```

## Production Deployment

### For Production Environment

1. **Update terraform.tfvars**
   ```hcl
   environment = "prod"
   custom_image_tag = "v4.5.2-enhanced-prod"

   min_instance_count = 1  # Keep warm
   memory_limit = "2Gi"
   cpu_limit = "2000m"

   enable_alerting = true
   ```

2. **Build and Tag Production Image**
   ```bash
   make docker-build CUSTOM_TAG=v4.5.2-enhanced-prod
   make docker-push
   ```

3. **Deploy to Production**
   ```bash
   cd terraform/environments/prod
   make plan
   make apply
   ```

4. **Verify Production**
   ```bash
   # Health check
   curl -f "$(terraform output -raw service_url)/health"

   # Load testing (optional)
   k6 run --vus 50 --duration 5m -e BASE_URL="$(terraform output -raw service_url)" \
     ../tests/performance/load-test.js
   ```

## Rollback Plan

### Quick Rollback
```bash
# Get previous revision
gcloud run revisions list \
  --service=formio-custom-dev \
  --region=australia-southeast1 \
  --limit=2

# Rollback to previous revision
gcloud run services update-traffic formio-custom-dev \
  --to-revisions=<previous-revision>=100 \
  --region=australia-southeast1
```

### Full Rollback
```bash
# Redeploy community edition
make deploy-com

# Or use backup image
make deploy-custom IMG_CUSTOM=formio/formio:4.5.2
```

## Maintenance

### Regular Tasks

1. **Weekly**
   - Check for Form.io updates
   - Review security scan results
   - Monitor performance metrics

2. **Monthly**
   - Update dependencies
   - Rotate secrets
   - Backup database

3. **Quarterly**
   - Security audit
   - Performance optimization review
   - Capacity planning

### Backup Strategy

```bash
# MongoDB Atlas backups (automatic)
# Check backup status via Atlas console

# GCS bucket versioning
gsutil versioning set on gs://formio-uploads-dev

# Terraform state backup
gsutil cp terraform/environments/dev/terraform.tfstate \
  gs://your-backup-bucket/terraform/
```

## Support

### Documentation
- [Form.io Custom Features](../README_DEPLOYMENT.md)
- [Terraform Configuration](../dss-formio-service/CLAUDE.md)
- [Dockerfile Details](../formio/Dockerfile)

### Contact
- Platform Team: platform-team@dsselectrical.com.au
- Support: support@dsselectrical.com.au

### Escalation
1. Check logs and metrics
2. Review [Troubleshooting Guide](../README_DEPLOYMENT.md#troubleshooting)
3. Create issue in GitHub repository
4. Contact on-call engineer

---

**Last Updated**: 2025-01-08
**Version**: 1.0.0