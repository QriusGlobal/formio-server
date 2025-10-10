# Security Hardening Guide

## Container Security

- All containers run as non-root user (uid 1000)
- No sensitive data in images

## Network Security

- CORS restricted to known origins
- Security headers enabled in nginx
- Rate limiting via Redis

## Secrets Management

- Never commit .env files
- Rotate credentials every 90 days
- Use strong random values (min 24 chars)

## Validation

Run: `./scripts/validate-credentials.sh`
