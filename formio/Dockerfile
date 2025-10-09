# ============================================================================
# Multi-Stage Dockerfile for Form.io Server
# Optimized for Node v20 compatibility and fast dependency installation
# ============================================================================

# ----------------------------------------------------------------------------
# Stage 1: Dependencies Installation
# Uses Node v20 LTS for isolated-vm compatibility
# Uses pnpm for concurrent network downloads
# ----------------------------------------------------------------------------
FROM node:20-alpine AS dependencies

# Install build dependencies for native modules (bcrypt, isolated-vm)
# isolated-vm requires: python3, make, g++, git, libstdc++, icu-data-full
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        python3 \
        make \
        g++ \
        git \
        linux-headers \
        libstdc++ \
        icu-data-full

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files first for layer caching
COPY package.json ./
COPY .npmrc ./

# Copy source files needed for build:vm prepare script
COPY src/ ./src/
COPY config/ ./config/
COPY portal/ ./portal/
COPY *.js ./
COPY *.txt ./

# Configure git to use https (no SSH keys needed)
RUN git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"

# Install dependencies with pnpm
# --frozen-lockfile=false: no lockfile exists yet
# --network-concurrency=16: max parallel downloads
RUN pnpm install \
    --frozen-lockfile=false \
    --network-concurrency=16

# Manually rebuild isolated-vm native module
# pnpm's prebuild-install fails to download prebuilt binary, but doesn't fallback to rebuild
# Force manual rebuild to generate ./out/isolated_vm.node
RUN cd node_modules/isolated-vm && \
    npx node-gyp rebuild --release -j max && \
    ls -la out/ && \
    cd /app

# Verify webpack bundles were created during pnpm install prepare hook
# Webpack config writes directly to src/vm/bundles/ (see webpack.vm.config.js:14)
RUN ls -la src/vm/bundles/

# Fix bugs in install.js:
# 1. Add missing return statements when ROOT_EMAIL is set (lines 159, 221)
# 2. Use environment variables when prompts are skipped (lines 356, 367)
RUN sed -i '159s/done();$/return done();/' install.js && \
    sed -i '221s/done();$/return done();/' install.js && \
    sed -i '356s/result.password/process.env.ROOT_PASSWORD || result.password/' install.js && \
    sed -i '367s/result.email/process.env.ROOT_EMAIL || result.email/' install.js && \
    echo "✅ Patched install.js lines 159, 221, 356, 367"

# Add /health endpoint to index.js BEFORE alias middleware (line 90)
# This prevents "Invalid alias" error from Form.io trying to treat /health as a form
# Must be registered before alias middleware to bypass form alias lookup
RUN sed -i "90a\\        // Health check endpoint (must be before alias middleware)\\n        router.get('/health', function(req, res) {\\n          res.json({\\n            status: 'ok',\\n            database: router.formio && router.formio.db ? 'connected' : 'disconnected',\\n            timestamp: new Date().toISOString()\\n          });\\n        });" index.js && \
    echo "✅ Added /health endpoint before alias middleware"

# ----------------------------------------------------------------------------
# Stage 2: Build Application
# Run any build steps (webpack, etc.)
# ----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy EVERYTHING from dependencies stage (includes compiled native modules + webpack bundles)
COPY --from=dependencies /app ./

# ----------------------------------------------------------------------------
# Stage 3: Production Runtime
# Minimal runtime image with only production dependencies
# ----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Install runtime dependencies for native modules
# isolated-vm needs libstdc++ and icu-data-full at runtime
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        tini \
        libstdc++ \
        icu-data-full

# Create non-root user for security
RUN addgroup -g 1001 formio && \
    adduser -D -u 1001 -G formio formio

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=formio:formio /app ./

# Ensure writable permissions for installation process (needs to download client.zip)
RUN chmod -R 755 /app && \
    chown -R formio:formio /app

# Switch to non-root user
USER formio

# Set environment variables
ENV DEBUG="" \
    NODE_ENV=production \
    PORT=3001

# Expose application port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use tini as PID 1 to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start application
CMD ["node", "--no-node-snapshot", "main"]