# =============================================================================
# FORM.IO CUSTOM EDITION - ENHANCED TERRAFORM MODULE
# =============================================================================
# This module deploys the customized Form.io server with enhanced file upload
# capabilities, railway-oriented atomic uploads, and performance optimizations
# Uses custom Docker image built from the monorepo

# Fetch secrets from Secret Manager
data "google_secret_manager_secret_version" "mongodb_connection_string" {
  provider = google-beta
  project  = var.project_id
  secret   = var.mongodb_connection_string_secret_id
}

data "google_secret_manager_secret_version" "formio_jwt_secret" {
  provider = google-beta
  project  = var.project_id
  secret   = var.formio_jwt_secret_secret_id
}

data "google_secret_manager_secret_version" "formio_db_secret" {
  provider = google-beta
  project  = var.project_id
  secret   = var.formio_db_secret_secret_id
}

data "google_secret_manager_secret_version" "formio_root_password" {
  provider = google-beta
  project  = var.project_id
  secret   = var.formio_root_password_secret_id
}

locals {
  # Service naming
  service_name_full = "formio-custom-${var.environment}"

  # Comprehensive labeling for operational excellence
  service_labels = merge(var.labels, {
    # Core service identification
    service       = "formio-custom"
    edition       = "custom-enhanced"
    environment   = var.environment
    version       = var.custom_image_tag

    # Cost and compliance tracking
    cost-center    = "dss-electrical"
    application-id = "formio-custom-service"
    owner          = "platform-team"

    # Operational metadata
    managed-by     = "terraform"
    project-type   = "form-management"
    backup-policy  = "daily"

    # Security and compliance
    data-classification = "confidential"
    compliance-scope    = "pci-dss"
  })

  # Backend service naming for load balancer integration
  backend_service_name = "formio-custom-backend-${var.environment}"

  # Use custom port (3001 for Form.io)
  container_port = 3001

  # Environment variables for Custom Enhanced Edition
  env_vars = [
    # MongoDB connection string from Secret Manager
    {
      name  = "MONGO"
      value = null
      value_source = {
        secret_key_ref = {
          secret  = var.mongodb_connection_string_secret_id
          version = "latest"
        }
      }
    },
    # JWT secret from Secret Manager
    {
      name  = "JWT_SECRET"
      value = null
      value_source = {
        secret_key_ref = {
          secret  = var.formio_jwt_secret_secret_id
          version = "latest"
        }
      }
    },
    # DB secret from Secret Manager
    {
      name  = "DB_SECRET"
      value = null
      value_source = {
        secret_key_ref = {
          secret  = var.formio_db_secret_secret_id
          version = "latest"
        }
      }
    },
    # Protocol and host configuration
    {
      name         = "PROTOCOL"
      value        = "https"
      value_source = null
    },
    {
      name         = "HOST"
      value        = "0.0.0.0"
      value_source = null
    },
    # Form.io configuration
    {
      name         = "PORTAL_ENABLED"
      value        = var.portal_enabled ? "1" : "0"
      value_source = null
    },
    {
      name         = "ROOT_EMAIL"
      value        = var.formio_root_email
      value_source = null
    },
    {
      name  = "ROOT_PASSWORD"
      value = null
      value_source = {
        secret_key_ref = {
          secret  = var.formio_root_password_secret_id
          version = "latest"
        }
      }
    },
    # Enhanced File Upload Configuration
    {
      name         = "ENABLE_ASYNC_GCS_UPLOAD"
      value        = var.enable_async_gcs_upload ? "true" : "false"
      value_source = null
    },
    {
      name         = "BULLMQ_WORKER_CONCURRENCY"
      value        = tostring(var.bullmq_worker_concurrency)
      value_source = null
    },
    {
      name         = "XXHASH_ENABLED"
      value        = var.xxhash_enabled ? "true" : "false"
      value_source = null
    },
    {
      name         = "RAILWAY_ORIENTED_UPLOADS"
      value        = var.railway_oriented_uploads ? "true" : "false"
      value_source = null
    },
    # S3-compatible storage configuration for file uploads
    {
      name         = "FORMIO_FILES_SERVER"
      value        = "s3"
      value_source = null
    },
    {
      name         = "FORMIO_S3_SERVER"
      value        = "https://storage.googleapis.com"
      value_source = null
    },
    {
      name         = "FORMIO_S3_BUCKET"
      value        = var.storage_bucket_name
      value_source = null
    },
    {
      name         = "GCS_PROJECT_ID"
      value        = var.project_id
      value_source = null
    },
    # Redis configuration for BullMQ
    {
      name         = "REDIS_HOST"
      value        = var.redis_host
      value_source = null
    },
    {
      name         = "REDIS_PORT"
      value        = tostring(var.redis_port)
      value_source = null
    },
    {
      name         = "REDIS_PASSWORD"
      value        = var.redis_password_secret_id != null ? null : ""
      value_source = var.redis_password_secret_id != null ? {
        secret_key_ref = {
          secret  = var.redis_password_secret_id
          version = "latest"
        }
      } : null
    },
    # Performance and Security
    {
      name         = "NODE_ENV"
      value        = var.environment == "prod" ? "production" : "development"
      value_source = null
    },
    {
      name         = "DEBUG"
      value        = var.debug_enabled ? "formio:*" : ""
      value_source = null
    },
    # TUS Upload Configuration
    {
      name         = "TUS_ENABLED"
      value        = var.tus_enabled ? "true" : "false"
      value_source = null
    },
    {
      name         = "TUS_PORT"
      value        = tostring(var.tus_port)
      value_source = null
    },
    {
      name         = "TUS_MAX_SIZE"
      value        = tostring(var.tus_max_size)
      value_source = null
    },
    # Email configuration
    {
      name         = "EMAIL_TYPE"
      value        = var.email_type
      value_source = null
    },
    {
      name         = "EMAIL_HOST"
      value        = var.email_host
      value_source = null
    },
    {
      name         = "EMAIL_PORT"
      value        = tostring(var.email_port)
      value_source = null
    },
    {
      name         = "EMAIL_SECURE"
      value        = var.email_secure ? "true" : "false"
      value_source = null
    },
    {
      name         = "EMAIL_USER"
      value        = var.email_user
      value_source = null
    },
    {
      name  = "EMAIL_PASS"
      value = var.email_password_secret_id != null ? null : ""
      value_source = var.email_password_secret_id != null ? {
        secret_key_ref = {
          secret  = var.email_password_secret_id
          version = "latest"
        }
      } : null
    },
    # CORS Configuration
    {
      name         = "CORS_ENABLED"
      value        = var.cors_enabled ? "true" : "false"
      value_source = null
    },
    {
      name         = "CORS_ORIGIN"
      value        = var.cors_origin
      value_source = null
    }
  ]

  # Filter out null value_source entries
  filtered_env_vars = [
    for env in local.env_vars : {
      name         = env.name
      value        = env.value
      value_source = env.value_source
    } if env.value_source != null || env.value != null
  ]
}

# =============================================================================
# ARTIFACT REGISTRY
# =============================================================================

resource "google_artifact_registry_repository" "formio_custom" {
  provider      = google-beta
  project       = var.project_id
  location      = var.region
  repository_id = "formio-custom"
  description   = "Form.io custom enhanced edition Docker images"
  format        = "DOCKER"

  labels = local.service_labels

  # Cleanup policy for old images
  docker_config {
    immutable_tags = false
  }
}

# =============================================================================
# CLOUD RUN SERVICE
# =============================================================================

resource "google_cloud_run_service" "formio_custom" {
  provider     = google-beta
  project      = var.project_id
  location     = var.region
  name         = local.service_name_full
  description  = "Form.io Custom Enhanced Edition with file upload optimizations"

  template {
    spec {
      containers {
        # Use custom image from Artifact Registry
        image = "${var.region}-docker.pkg.dev/${var.project_id}/formio-custom/formio:${var.custom_image_tag}"

        # Environment variables from filtered list
        dynamic "env" {
          for_each = local.filtered_env_vars
          content {
            name = env.value.name
            value = env.value.value

            dynamic "value_source" {
              for_each = env.value.value_source != null ? [env.value.value_source] : []
              content {
                secret_key_ref {
                  secret = value_source.value.secret_key_ref.secret
                }
              }
            }
          }
        }

        # Resource limits and requests
        resources {
          limits = {
            cpu    = var.cpu_limit
            memory = var.memory_limit
          }
          requests = {
            cpu    = var.cpu_request
            memory = var.memory_request
          }
        }

        # Health check configuration
        startup_probe {
          http_get {
            path = "/health"
            port = container_port
          }
          failure_threshold     = 3
          initial_delay_seconds = 10
          period_seconds        = 5
          timeout_seconds       = 5
        }

        liveness_probe {
          http_get {
            path = "/health"
            port = container_port
          }
          failure_threshold = 3
          period_seconds    = 10
          timeout_seconds   = 5
        }

        # Security context
        security_context {
          run_as_non_root = true
          run_as_user     = 1001
        }
      }

      # Container concurrency and scaling
      container_concurrency = var.container_concurrency
      timeout_seconds       = var.request_timeout

      # Cloud Run service configuration
      service_account_name = google_service_account.formio_custom.email
    }

    # Traffic configuration
    traffic {
      percent         = 100
      latest_revision = true
    }

    # Scaling configuration
    max_instance_count = var.max_instance_count
    min_instance_count = var.min_instance_count
  }

  # Traffic split for blue-green deployments (optional)
  dynamic "traffic" {
    for_each = var.enable_blue_green ? [1] : []
    content {
      percent         = var.traffic_percent_new
      latest_revision = false
      revision_name   = var.new_revision_name
    }
  }

  labels = local.service_labels

  # IAM configuration
  traffic_statuses {
    type   = "TRAFFIC_TARGET_ALLOCATION"
    status = "SERVING"
  }
}

# =============================================================================
# SERVICE ACCOUNT
# =============================================================================

resource "google_service_account" "formio_custom" {
  project      = var.project_id
  account_id   = "formio-custom-${var.environment}"
  display_name = "Form.io Custom Enhanced Edition Service Account"
  description  = "Service account for Form.io custom service with enhanced capabilities"

  # Account will be used by Cloud Run service
  disabled = false
}

# Grant service account access to required resources
resource "google_project_iam_member" "formio_custom_roles" {
  for_each = toset([
    "roles/secretmanager.secretAccessor",    # Access secrets
    "roles/logging.logWriter",              # Write logs
    "roles/monitoring.metricWriter",        # Write metrics
    "roles/cloudtrace.agent",              # Write traces
    "roles/opsconfigviewer",               # View operations
    "roles/storage.objectViewer",          # Access GCS bucket
  ])

  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.formio_custom.email}"
}

# Grant access to specific secrets
resource "google_secret_manager_secret_iam_member" "formio_custom_secrets" {
  for_each = toset([
    var.mongodb_connection_string_secret_id,
    var.formio_jwt_secret_secret_id,
    var.formio_db_secret_secret_id,
    var.formio_root_password_secret_id,
    var.redis_password_secret_id,
    var.email_password_secret_id,
  ])

  secret_id = each.value
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.formio_custom.email}"

  # Skip null secret IDs
  count = each.value != null ? 1 : 0
}

# =============================================================================
# CLOUD CDN AND LOAD BALANCER INTEGRATION
# =============================================================================

# Backend service for Cloud Load Balancer integration
resource "google_compute_backend_service" "formio_custom" {
  project     = var.project_id
  name        = local.backend_service_name
  port_name   = "http"
  protocol    = "HTTP"
  timeout_sec = var.request_timeout

  # Health check configuration
  health_checks = [google_compute_health_check.formio_custom.id]

  # CDN configuration for performance optimization
  enable_cdn = true

  cdn_policy {
    cache_mode = "CACHE_ALL_STATIC"

    default_ttl = var.cache_default_ttl
    max_ttl     = var.cache_max_ttl
    client_ttl  = var.cache_client_ttl

    negative_caching {
      enabled = true
      ttl     = 300  # Cache 404s for 5 minutes
    }

    # Cache key configuration
    cache_key_policy {
      include_protocol           = true
      include_host               = true
      include_query_string       = true
      query_string_whitelist     = var.cache_query_whitelist
      include_http_headers       = var.cache_headers
      include_named_http_headers = var.cache_named_headers
    }

    # Bypass cache for specific paths
    bypass_cache_on_request_headers = var.bypass_cache_headers
  }

  # Cloud CDN negative caching configuration
  cdn_policy {
    negative_caching {
      enabled = true
      ttl     = 300
    }
  }

  # Log configuration
  log_config {
    enable = true
    sample_rate = var.log_sample_rate
  }

  # Instance group or NEG for Cloud Run
  backend {
    group = google_compute_network_endpoint_group.formio_custom.id
  }

  # IAP configuration for additional security
  iap {
    enabled = var.iap_enabled
    oauth2_client_info {
      client_id     = var.iap_client_id
      client_secret = var.iap_client_secret
    }
  }

  labels = local.service_labels
}

# NEG for Cloud Run
resource "google_compute_network_endpoint_group" "formio_custom" {
  project               = var.project_id
  name                  = "${local.service_name_full}-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region

  cloud_run {
    service = google_cloud_run_service.formio_custom.name
  }
}

# Health check for backend service
resource "google_compute_health_check" "formio_custom" {
  project = var.project_id
  name    = "${local.service_name_full}-hc"

  check_interval_sec = 10
  timeout_sec        = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3

  http_health_check {
    port         = container_port
    request_path = "/health"
    host         = ""
  }

  log_config {
    enabled = true
  }
}

# =============================================================================
# DNS AND DOMAIN CONFIGURATION
# =============================================================================

# DNS record for the service (optional)
resource "google_dns_record_set" "formio_custom" {
  count        = var.create_dns_record ? 1 : 0
  project      = var.dns_project_id
  managed_zone = var.dns_managed_zone
  name         = "${var.dns_name}.${var.dns_managed_zone}."
  type         = "CNAME"
  ttl          = 300
  rrdatas      = [google_cloud_run_service.formio_custom.status[0].url]
}

# =============================================================================
# MONITORING AND ALERTING
# =============================================================================

# Service monitoring
resource "google_monitoring_service" "formio_custom" {
  project      = var.project_id
  service_id   = local.service_name_full
  display_name = "Form.io Custom Enhanced Service"

  basic_service {
    service_type = "CLOUD_RUN"
  }

  # Custom service labels
  service_labels = {
    service_name = google_cloud_run_service.formio_custom.name
    location     = var.region
    project_id   = var.project_id
  }
}

# Alert policies for critical metrics
resource "google_monitoring_alert_policy" "formio_custom_error_rate" {
  count        = var.enable_alerting ? 1 : 0
  project      = var.project_id
  display_name = "Form.io Custom High Error Rate"

  combiner     = "OR"
  conditions {
    display_name = "Error rate > ${var.error_rate_threshold}%"
    condition_threshold {
      filter = format("metric.type=\"run.googleapis.com/container/error_count\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"%s\"", local.service_name_full)

      aggregations {
        alignment_period     = "300s"
        per_series_aligner  = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_PERCENTILE_99"
      }

      comparison      = "COMPARISON_GT"
      duration        = "900s"
      trigger {
        count   = 1
        percent = 100
      }
      threshold_value = var.error_rate_threshold
    }
  }

  notification_channels = var.notification_channels
  enabled              = true
}

resource "google_monitoring_alert_policy" "formio_custom_latency" {
  count        = var.enable_alerting ? 1 : 0
  project      = var.project_id
  display_name = "Form.io Custom High Latency"

  combiner = "OR"
  conditions {
    display_name = "P99 latency > ${var.latency_threshold}ms"
    condition_threshold {
      filter = format("metric.type=\"run.googleapis.com/container/latencies\" resource.type=\"cloud_run_revision\" resource.label.\"service_name\"=\"%s\"", local.service_name_full)

      aggregations {
        alignment_period     = "300s"
        per_series_aligner  = "ALIGN_PERCENTILE_99"
        cross_series_reducer = "REDUCE_PERCENTILE_99"
      }

      comparison      = "COMPARISON_GT"
      duration        = "900s"
      trigger {
        count   = 1
        percent = 100
      }
      threshold_value = var.latency_threshold / 1000  # Convert ms to seconds
    }
  }

  notification_channels = var.notification_channels
  enabled              = true
}

# =============================================================================
# OUTPUTS
# =============================================================================

# Export service URL and configuration
output "service_url" {
  description = "Form.io Custom Service URL"
  value       = google_cloud_run_service.formio_custom.status[0].url
}

output "service_name" {
  description = "Cloud Run service name"
  value       = google_cloud_run_service.formio_custom.name
}

output "backend_service_id" {
  description = "Backend service ID for load balancer integration"
  value       = google_compute_backend_service.formio_custom.id
}

output "service_account_email" {
  description = "Service account email"
  value       = google_service_account.formio_custom.email
}

output "image_repository" {
  description = "Artifact Registry repository path"
  value       = google_artifact_registry_repository.formio_custom.repository_id
}

output "docker_image_path" {
  description = "Full Docker image path for deployment"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/formio-custom/formio"
}

output "health_check_url" {
  description = "Health check endpoint URL"
  value       = "${google_cloud_run_service.formio_custom.status[0].url}/health"
}

# Output configuration values for debugging
output "configuration" {
  description = "Service configuration summary"
  value = {
    version                    = var.custom_image_tag
    environment               = var.environment
    enable_async_gcs_upload   = var.enable_async_gcs_upload
    bullmq_worker_concurrency = var.bullmq_worker_concurrency
    xxhash_enabled            = var.xxhash_enabled
    railway_oriented_uploads  = var.railway_oriented_uploads
    min_instances             = var.min_instance_count
    max_instances             = var.max_instance_count
    memory_limit              = var.memory_limit
    cpu_limit                 = var.cpu_limit
  }
}