# Authentication Guide

## Form.io Server Authentication

### Default Admin Credentials

**Development Environment:**

```
Email: admin@formio.local
Password: admin123
```

> ⚠️ **Security Warning**: These are default development credentials. **DO NOT**
> use in production.

### Environment Configuration

The Form.io server reads authentication configuration from environment
variables:

```bash
# .env
ROOT_EMAIL=admin@formio.local
ROOT_PASSWORD=admin123  # Default from .env.example

# Security secrets (auto-generated, DO NOT share)
JWT_SECRET=<generated-secret>
DB_SECRET=<generated-secret>
```

### Authentication Flow

1. **Initial Installation** (First Run)
   - Form.io server checks if admin user exists
   - If not, creates admin user from `ROOT_EMAIL` and `ROOT_PASSWORD`
   - Password is hashed with bcrypt ($2a$10$ prefix)
   - Admin role automatically assigned

2. **Subsequent Runs**
   - Uses existing admin user in MongoDB
   - `ROOT_PASSWORD` changes in `.env` do **NOT** update existing password
   - Password must be reset via API or MongoDB directly

### Login via API

```bash
# Login to get JWT token
curl -X POST http://localhost:3001/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "email": "admin@formio.local",
      "password": "admin123"
    }
  }'

# Response includes JWT token
{
  "_id": "...",
  "form": "...",
  "data": {
    "email": "admin@formio.local"
  },
  "roles": ["..."]
}
```

### Using JWT Token

```bash
# Extract token from login response (use jq or similar)
TOKEN="<jwt-token-from-login>"

# Make authenticated request
curl -X GET http://localhost:3001/form \
  -H "x-jwt-token: $TOKEN"
```

### Password Reset

**Option 1: MongoDB Direct Update** (Development Only)

```bash
# Connect to MongoDB
docker exec -it formio-mongo mongosh formioapp

# Find admin user
db.submissions.findOne({"data.email": "admin@formio.local"})

# Generate new bcrypt hash (use external tool)
# Update password
db.submissions.updateOne(
  {"data.email": "admin@formio.local"},
  {$set: {"data.password": "<new-bcrypt-hash>"}}
)
```

**Option 2: API Password Reset** (Recommended)

```bash
# Send password reset email
curl -X POST http://localhost:3001/user/forgot \
  -H "Content-Type: application/json" \
  -d '{"data": {"email": "admin@formio.local"}}'

# Use reset link from email to set new password
```

### Security Best Practices

1. **Production Deployment**
   - Change `ROOT_EMAIL` and `ROOT_PASSWORD` before first deployment
   - Use strong, randomly generated passwords (20+ characters)
   - Rotate `JWT_SECRET` and `DB_SECRET` periodically
   - Enable HTTPS/TLS for all connections

2. **Credential Storage**
   - Never commit `.env` files to git
   - Use secrets management (e.g., AWS Secrets Manager, HashiCorp Vault)
   - Restrict `.env` file permissions (`chmod 600 .env`)

3. **Access Control**
   - Create separate admin accounts for each team member
   - Use role-based access control (RBAC)
   - Implement API key authentication for service-to-service calls
   - Enable audit logging for authentication events

### Troubleshooting

**Problem: Login returns "User or password was incorrect"**

- Verify credentials match `.env.example` defaults for new installations
- Check if admin user exists:
  `db.submissions.findOne({"data.email": "admin@formio.local"})`
- Verify password hash format (should start with `$2a$10$`)

**Problem: JWT token invalid or expired**

- Tokens expire after configured time (default: 1 hour)
- Re-authenticate to get new token
- Verify `JWT_SECRET` hasn't changed (invalidates all tokens)

**Problem: Cannot access authenticated endpoints**

- Ensure `x-jwt-token` header is set correctly
- Check token format (no quotes or extra whitespace)
- Verify user has appropriate role permissions

### Related Documentation

- [Form.io Authentication Docs](https://help.form.io/userguide/authentication/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [bcrypt Password Hashing](https://en.wikipedia.org/wiki/Bcrypt)
