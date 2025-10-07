#!/bin/bash
#
# Setup Automated Security Cleanup Cron Job
#
# This script installs a cron job to run security-cleanup.js daily at 2 AM.
# It also creates necessary directories and log rotation configuration.
#
# Usage:
#   ./scripts/setup-cleanup-cron.sh [--user] [--system]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs"
CLEANUP_SCRIPT="$SCRIPT_DIR/security-cleanup.js"

echo "🔐 Setting up automated security cleanup..."
echo ""

# Create logs directory
mkdir -p "$LOG_DIR"

# Check if running as root for system-wide cron
if [[ "$1" == "--system" ]]; then
  if [[ $EUID -ne 0 ]]; then
    echo "❌ System-wide cron setup requires root privileges"
    echo "   Run with: sudo $0 --system"
    exit 1
  fi
  CRON_USER="root"
  CRON_FILE="/etc/cron.d/formio-security-cleanup"
else
  CRON_USER="$USER"
  CRON_FILE=""
fi

# Verify Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js first."
  exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Make cleanup script executable
chmod +x "$CLEANUP_SCRIPT"

# Create cron job
if [[ -n "$CRON_FILE" ]]; then
  # System-wide cron
  echo "📝 Creating system-wide cron job: $CRON_FILE"
  cat > "$CRON_FILE" <<EOF
# Form.io Security Cleanup - Daily at 2 AM
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=""

# Run cleanup daily at 2 AM
0 2 * * * $CRON_USER cd $PROJECT_ROOT && /usr/bin/node $CLEANUP_SCRIPT --report >> $LOG_DIR/cleanup.log 2>&1
EOF
  chmod 644 "$CRON_FILE"
  echo "✅ System cron job created"
else
  # User cron
  echo "📝 Adding cron job to user crontab ($CRON_USER)"

  # Check if cron job already exists
  if crontab -l 2>/dev/null | grep -q "security-cleanup.js"; then
    echo "⚠️  Cron job already exists. Updating..."
    crontab -l 2>/dev/null | grep -v "security-cleanup.js" | crontab -
  fi

  # Add new cron job
  (crontab -l 2>/dev/null; echo "# Form.io Security Cleanup - Daily at 2 AM"; echo "0 2 * * * cd $PROJECT_ROOT && /usr/bin/node $CLEANUP_SCRIPT --report >> $LOG_DIR/cleanup.log 2>&1") | crontab -
  echo "✅ User cron job added"
fi

# Create log rotation configuration
echo ""
echo "📝 Setting up log rotation..."
LOGROTATE_CONF="/etc/logrotate.d/formio-security-cleanup"

if [[ $EUID -eq 0 ]]; then
  cat > "$LOGROTATE_CONF" <<EOF
$LOG_DIR/cleanup.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    create 644 $CRON_USER $CRON_USER
}
EOF
  echo "✅ Log rotation configured: $LOGROTATE_CONF"
else
  echo "⚠️  Skipping log rotation (requires root). Run with sudo to configure."
fi

# Test the cleanup script (dry run)
echo ""
echo "🧪 Testing cleanup script (dry run)..."
node "$CLEANUP_SCRIPT" --dry-run || true

echo ""
echo "✅ Automated security cleanup setup complete!"
echo ""
echo "📅 Schedule: Daily at 2:00 AM"
echo "📁 Logs: $LOG_DIR/cleanup.log"
echo ""
echo "Manual commands:"
echo "  Dry run:  node $CLEANUP_SCRIPT --dry-run"
echo "  Live run: node $CLEANUP_SCRIPT"
echo "  Report:   node $CLEANUP_SCRIPT --report"
echo "  Custom:   node $CLEANUP_SCRIPT --days=14"
echo ""
echo "To view cron jobs:"
if [[ -n "$CRON_FILE" ]]; then
  echo "  cat $CRON_FILE"
else
  echo "  crontab -l"
fi
echo ""
