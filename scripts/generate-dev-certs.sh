#!/bin/bash
#
# Generate Self-Signed TLS Certificates for Development
#
# This script creates self-signed certificates for local HTTPS testing.
# DO NOT use these certificates in production! Use Let's Encrypt for production.
#
# Usage:
#   ./scripts/generate-dev-certs.sh
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CERT_DIR="$PROJECT_ROOT/nginx/ssl"

echo "🔐 Generating Self-Signed TLS Certificates for Development"
echo ""

# Create SSL directory if it doesn't exist
mkdir -p "$CERT_DIR"

# Check if certificates already exist
if [[ -f "$CERT_DIR/cert.pem" && -f "$CERT_DIR/key.pem" ]]; then
  read -p "⚠️  Certificates already exist. Regenerate? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "✅ Keeping existing certificates"
    exit 0
  fi
fi

# Generate private key
echo "📝 Generating 2048-bit RSA private key..."
openssl genrsa -out "$CERT_DIR/key.pem" 2048

# Generate certificate signing request (CSR) with SAN
echo "📝 Generating Certificate Signing Request..."
cat > "$CERT_DIR/openssl.cnf" <<EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[dn]
C=US
ST=Development
L=LocalDev
O=Form.io Development
OU=Development
CN=localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
DNS.3 = formio-server
DNS.4 = formio-nginx
DNS.5 = tus-server
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate self-signed certificate (valid for 365 days)
echo "📝 Generating self-signed certificate (valid for 365 days)..."
openssl req -new -x509 \
  -key "$CERT_DIR/key.pem" \
  -out "$CERT_DIR/cert.pem" \
  -days 365 \
  -config "$CERT_DIR/openssl.cnf" \
  -extensions req_ext

# Set proper permissions
chmod 600 "$CERT_DIR/key.pem"
chmod 644 "$CERT_DIR/cert.pem"

# Display certificate info
echo ""
echo "✅ Certificates generated successfully!"
echo ""
echo "📁 Certificate location:"
echo "   Private Key: $CERT_DIR/key.pem"
echo "   Certificate: $CERT_DIR/cert.pem"
echo ""
echo "📊 Certificate details:"
openssl x509 -in "$CERT_DIR/cert.pem" -noout -subject -dates -ext subjectAltName
echo ""

# Optional: Generate DH parameters for stronger security (takes a few minutes)
if [[ ! -f "$CERT_DIR/dhparam.pem" ]]; then
  read -p "🔐 Generate DH parameters for stronger security? (takes ~3-5 minutes) (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Generating 2048-bit DH parameters (this will take a while)..."
    openssl dhparam -out "$CERT_DIR/dhparam.pem" 2048
    echo "✅ DH parameters generated: $CERT_DIR/dhparam.pem"
  fi
fi

# Cleanup
rm -f "$CERT_DIR/openssl.cnf"

echo ""
echo "⚠️  DEVELOPMENT ONLY - Trust the certificate in your browser:"
echo ""
echo "   Chrome/Edge:"
echo "     1. Navigate to chrome://settings/certificates"
echo "     2. Import $CERT_DIR/cert.pem as 'Trusted Root Certification Authority'"
echo ""
echo "   Firefox:"
echo "     1. Navigate to about:preferences#privacy"
echo "     2. View Certificates → Authorities → Import"
echo "     3. Import $CERT_DIR/cert.pem and trust for websites"
echo ""
echo "   macOS (system-wide):"
echo "     sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain $CERT_DIR/cert.pem"
echo ""
echo "🚀 Ready to use HTTPS! Start services with:"
echo "   docker-compose --profile full up -d"
echo ""
