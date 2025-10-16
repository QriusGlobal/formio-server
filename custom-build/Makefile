# ═══════════════════════════════════════════════════════════════
#  Custom FormIO Build - Makefile
# ═══════════════════════════════════════════════════════════════
#
#  Platform: macOS M4 Pro (Apple Silicon ARM64)
#  Purpose: Local development and testing of FormIO custom build
#
#  Quick Start:
#    make help        # Show all targets
#    make install     # Install linting tools
#    make build       # Build Docker image
#    make up          # Start all services
#    make test        # Run integration tests
#    make down        # Stop services
#
# ═══════════════════════════════════════════════════════════════

.DEFAULT_GOAL := help

# ───────────────────────────────────────────────────────────────
#  Configuration
# ───────────────────────────────────────────────────────────────

SHELL := /bin/bash
.SHELLFLAGS := -euo pipefail -c

IMAGE_NAME := formio-custom
IMAGE_TAG := latest
PLATFORM := linux/arm64

COMPOSE_FILE := docker-compose.yml
COMPOSE_CMD := docker compose -f $(COMPOSE_FILE)

# ───────────────────────────────────────────────────────────────
#  Phony Targets
# ───────────────────────────────────────────────────────────────

.PHONY: help install lint lint-shell lint-makefile build up down restart logs test clean clean-all verify-deps

# ───────────────────────────────────────────────────────────────
#  Help Target
# ───────────────────────────────────────────────────────────────

help: ## Show this help message
	@echo "════════════════════════════════════════════════════════════"
	@echo "  Custom FormIO Build - Makefile Targets"
	@echo "════════════════════════════════════════════════════════════"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "════════════════════════════════════════════════════════════"
	@echo "  Quick Start: make install && make build && make up && make test"
	@echo "════════════════════════════════════════════════════════════"

# ───────────────────────────────────────────────────────────────
#  Installation
# ───────────────────────────────────────────────────────────────

install: verify-deps ## Install linting tools (shellcheck + checkmake)
	@echo "ℹ Checking linting tools..."
	@command -v shellcheck >/dev/null 2>&1 || { \
		echo "⚠️  shellcheck not found, installing..."; \
		brew install shellcheck; \
	}
	@command -v checkmake >/dev/null 2>&1 || { \
		echo "⚠️  checkmake not found, installing..."; \
		brew install checkmake; \
	}
	@echo "✅ All linting tools installed"

verify-deps: ## Verify required dependencies (Docker, docker-compose)
	@echo "ℹ Verifying dependencies..."
	@command -v docker >/dev/null 2>&1 || { \
		echo "❌ Docker not found. Install from: https://www.docker.com/products/docker-desktop"; \
		exit 1; \
	}
	@command -v docker compose version >/dev/null 2>&1 || { \
		echo "❌ Docker Compose not found. Install Docker Desktop with Compose V2"; \
		exit 1; \
	}
	@echo "✅ All dependencies installed"

# ───────────────────────────────────────────────────────────────
#  Linting
# ───────────────────────────────────────────────────────────────

lint: lint-shell lint-makefile ## Run all linters (shellcheck + checkmake)

lint-shell: ## Lint shell scripts with shellcheck
	@echo "ℹ Running shellcheck..."
	@shellcheck scripts/*.sh
	@echo "✅ All shell scripts passed shellcheck"

lint-makefile: ## Lint Makefile with checkmake
	@echo "ℹ Running checkmake..."
	@checkmake Makefile
	@echo "✅ Makefile passed checkmake"

# ───────────────────────────────────────────────────────────────
#  Docker Build
# ───────────────────────────────────────────────────────────────

build: verify-deps ## Build Docker image with plugin (production-grade tarball)
	@echo "ℹ Building Docker image: $(IMAGE_NAME):$(IMAGE_TAG)"
	@echo "  Platform: $(PLATFORM)"
	@echo "  Build strategy: pnpm pack tarball (no runtime symlinks)"
	@docker build \
		--platform=$(PLATFORM) \
		--file=Dockerfile \
		--target=production \
		--tag=$(IMAGE_NAME):$(IMAGE_TAG) \
		--progress=plain \
		..
	@echo "✅ Build complete: $(IMAGE_NAME):$(IMAGE_TAG)"

# ───────────────────────────────────────────────────────────────
#  Service Management
# ───────────────────────────────────────────────────────────────

up: verify-deps ## Start all services (MongoDB, Redis, GCS, TUS, FormIO)
	@echo "ℹ Starting all services..."
	$(COMPOSE_CMD) up -d
	@echo "✅ All services started"
	@echo ""
	@echo "════════════════════════════════════════════════════════════"
	@echo "  FormIO Custom Build is starting up..."
	@echo "  Wait 30s for services to become healthy, then run:"
	@echo ""
	@echo "    make test"
	@echo ""
	@echo "  Access FormIO at: http://localhost:3001"
	@echo "════════════════════════════════════════════════════════════"

down: ## Stop all services (keep data)
	@echo "ℹ Stopping all services..."
	$(COMPOSE_CMD) down
	@echo "✅ All services stopped (data preserved)"

restart: down up ## Restart all services

logs: ## View logs from all services
	$(COMPOSE_CMD) logs -f

# ───────────────────────────────────────────────────────────────
#  Testing
# ───────────────────────────────────────────────────────────────

test: ## Run integration tests (health checks, plugin verification)
	@echo "ℹ Running integration tests..."
	@./scripts/test.sh

# ───────────────────────────────────────────────────────────────
#  Cleanup
# ───────────────────────────────────────────────────────────────

clean: down ## Stop services and remove containers
	@echo "ℹ Cleaning up containers..."
	$(COMPOSE_CMD) down --remove-orphans
	@echo "✅ Containers removed (volumes preserved)"

clean-all: ## Stop services and DELETE ALL DATA (volumes)
	@echo "⚠️  WARNING: This will delete all data (MongoDB, Redis, uploads)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo ""; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "ℹ Removing all containers and volumes..."; \
		$(COMPOSE_CMD) down -v --remove-orphans; \
		echo "✅ All data deleted"; \
	else \
		echo "ℹ Cleanup cancelled"; \
	fi

# ═══════════════════════════════════════════════════════════════
#  Development Workflow
# ═══════════════════════════════════════════════════════════════
#
#  1. First time setup:
#     make install        # Install linting tools
#     make verify-deps    # Check Docker installed
#
#  2. Build custom FormIO with plugin:
#     make lint           # Check code quality
#     make build          # Build Docker image
#
#  3. Start services:
#     make up             # Start all services
#     make test           # Verify everything works
#
#  4. View logs:
#     make logs           # Follow all logs
#
#  5. Clean up:
#     make down           # Stop (keep data)
#     make clean-all      # Stop and delete data
#
# ═══════════════════════════════════════════════════════════════
