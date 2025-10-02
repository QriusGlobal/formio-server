# Form.io Setup Automation

Programmatic REST API automation for Form.io test environment setup.

## Quick Start

### Option 1: Automatic (Recommended)

The setup runs automatically during Playwright's global setup:

```bash
npm run test:e2e
```

### Option 2: Manual Bootstrap

Run the bootstrap script directly:

```bash
cd test-app
bash tests/setup/formio-bootstrap.sh
```

### Option 3: Custom Configuration

Set environment variables before running:

```bash
export FORMIO_URL=http://localhost:3001
export ROOT_EMAIL=admin@example.com
export ROOT_PASSWORD=CHANGEME
export TUS_ENDPOINT=http://localhost:1080/files/

bash tests/setup/formio-bootstrap.sh
```

## What Gets Created

The bootstrap process:

1. **Authenticates** with Form.io server using admin credentials
2. **Creates test project** (optional, for project-scoped forms)
3. **Creates file upload form** with TUS configuration
4. **Saves credentials** to `.env.test` for tests to use

## Files Created

### `.env.test`

Auto-generated environment file with:
- `FORMIO_JWT_TOKEN` - Authentication token
- `FORMIO_FORM_ID` - Created form ID
- `FORMIO_PROJECT_ID` - Created project ID (if applicable)
- `TUS_ENDPOINT` - File upload endpoint

### Backup: `.env.test.backup`

Previous `.env.test` is backed up before regeneration.

## TypeScript API Usage

Use the `FormioAPI` class for programmatic interactions:

```typescript
import { FormioAPI, createFileUploadForm } from '../setup/formio-api';

// Initialize API client
const api = new FormioAPI({
  baseURL: 'http://localhost:3001',
  timeout: 30000
});

// Authenticate
const auth = await api.login('admin@example.com', 'password');
console.log('Logged in with token:', auth.token);

// Create a form
const formDef = createFileUploadForm('http://localhost:1080/files/');
const form = await api.createForm(formDef);
console.log('Created form:', form._id);

// Submit data to form
const submission = await api.submitForm(form._id!, {
  title: 'Test Upload',
  attachment: [
    {
      name: 'test.pdf',
      url: 'http://localhost:1080/files/abc123',
      size: 12345
    }
  ],
  description: 'Test submission'
});

console.log('Submitted:', submission._id);
```

## Advanced Examples

### Custom Form Creation

```typescript
import { FormioAPI, FormioForm } from '../setup/formio-api';

const api = new FormioAPI();
await api.login('admin@example.com', 'password');

const customForm: FormioForm = {
  title: 'Custom Survey',
  name: 'customsurvey',
  path: 'customsurvey',
  type: 'form',
  display: 'form',
  components: [
    {
      type: 'textfield',
      key: 'firstName',
      label: 'First Name',
      input: true,
      validate: { required: true }
    },
    {
      type: 'email',
      key: 'email',
      label: 'Email Address',
      input: true,
      validate: { required: true }
    },
    {
      type: 'button',
      action: 'submit',
      label: 'Submit'
    }
  ]
};

const created = await api.createForm(customForm);
```

### Listing and Filtering Submissions

```typescript
// Get all submissions for a form
const submissions = await api.listSubmissions(formId);

// With pagination and filtering
const filtered = await api.listSubmissions(formId, {
  limit: 10,
  skip: 0,
  sort: '-created',
  'data.title': 'Test Upload'  // Filter by data field
});
```

### Cleanup

```typescript
// Delete test submissions
for (const submission of submissions) {
  await api.deleteSubmission(submission._id!);
}

// Delete test form
await api.deleteForm(formId);
```

## Playwright Integration

The bootstrap runs automatically in `global-setup.ts`:

```typescript
import { bootstrapFormio } from '../setup/formio-bootstrap';

async function globalSetup(config: FullConfig) {
  // ... verify servers running ...

  // Run bootstrap
  await bootstrapFormio();

  // ... load .env.test into process.env ...
}
```

## Troubleshooting

### Authentication Fails

**Problem:** `Login failed with HTTP 401`

**Solutions:**
1. Verify Form.io server is running: `curl http://localhost:3001/health`
2. Check credentials in environment variables
3. Try manual login in Form.io UI to verify credentials
4. Check Form.io logs for authentication errors

### Form Creation Fails

**Problem:** `Form creation failed with HTTP 403`

**Solutions:**
1. Ensure JWT token is valid and not expired
2. Verify user has permissions to create forms
3. Check if project ID is required for your Form.io setup
4. Review Form.io server logs for permission errors

### Bootstrap Script Hangs

**Problem:** Script hangs on "Waiting for Form.io server..."

**Solutions:**
1. Verify Form.io server is accessible: `curl http://localhost:3001`
2. Check Docker containers: `docker ps`
3. Review Docker logs: `docker logs formio`
4. Increase wait timeout in bootstrap script

### Missing Dependencies

**Problem:** `jq: command not found`

**Solution:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Windows (WSL)
sudo apt-get install jq
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FORMIO_URL` | `http://localhost:3001` | Form.io server URL |
| `ROOT_EMAIL` | `admin@example.com` | Admin email |
| `ROOT_PASSWORD` | `CHANGEME` | Admin password |
| `TUS_ENDPOINT` | `http://localhost:1080/files/` | TUS upload URL |
| `ENV_FILE` | `.env.test` | Output file path |

## Security Notes

⚠️ **Never commit `.env.test` to version control**

The `.env.test` file contains sensitive credentials (JWT tokens, passwords). Always:
- Add `.env.test` to `.gitignore`
- Use `.env.test.example` for documentation
- Rotate credentials after exposure
- Use different credentials for CI/CD environments

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Bootstrap Form.io
  run: |
    cd test-app
    export FORMIO_URL=http://localhost:3001
    export ROOT_EMAIL=${{ secrets.FORMIO_ADMIN_EMAIL }}
    export ROOT_PASSWORD=${{ secrets.FORMIO_ADMIN_PASSWORD }}
    bash tests/setup/formio-bootstrap.sh
  env:
    TUS_ENDPOINT: http://localhost:1080/files/
```

### Docker Compose Integration

```yaml
services:
  test-runner:
    build: .
    depends_on:
      - formio
      - tusd
    environment:
      FORMIO_URL: http://formio:3001
      ROOT_EMAIL: admin@example.com
      ROOT_PASSWORD: CHANGEME
    command: >
      bash -c "
        tests/setup/formio-bootstrap.sh &&
        npm run test:e2e
      "
```

## Contributing

When modifying the bootstrap process:

1. **Test locally** with fresh Form.io instance
2. **Verify idempotency** - script should work on re-runs
3. **Update documentation** for new environment variables
4. **Add error handling** for new failure modes
5. **Test CI/CD integration** before merging

## Related Files

- `/test-app/tests/setup/formio-bootstrap.sh` - Main bootstrap script
- `/test-app/tests/setup/formio-api.ts` - TypeScript API client
- `/test-app/.env.test.example` - Example environment variables
- `/test-app/tests/utils/global-setup.ts` - Playwright integration
