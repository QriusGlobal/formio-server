# Form.io Server - Complete Project Context

**Form.io Version:** 4.5.2
**Node.js Requirements:** >=20.0.0
**License:** OSL-3.0
**Primary Stack:** Express.js + MongoDB + Mongoose
**Codebase:** 189 source files + 58 test files

## 🏗️ Project Architecture

### System Overview
Form.io is a form builder and submission management platform that provides:
- **Dynamic Form Builder**: JSON-based form definitions with 40+ component types
- **Submission Engine**: Data validation, transformation, and storage
- **Workflow Actions**: Post-submission triggers (email, webhooks, role assignment)
- **Permission System**: Multi-layer access control (form, submission, field level)
- **File Uploads**: TUS protocol with GCS storage integration
- **Template System**: Import/export of complete form applications

### Core Request Flow
```
1. Express Router (/index.js:31)
   ↓
2. Middleware Stack (47 middleware modules)
   ↓
3. Resource Handler (/src/resources/)
   ↓
4. Model Layer (/src/models/)
   ↓
5. MongoDB (via Mongoose)
   ↓
6. Action Triggers (/src/actions/)
```

## 📁 Directory Structure

```
formio/
├── src/                    # Core application code (189 files)
│   ├── actions/            # Workflow engine (11 files)
│   ├── authentication/     # Auth utilities (2 files)
│   ├── cache/              # Caching layer (1 file)
│   ├── db/                 # Database layer (40 files)
│   │   ├── updates/        # Schema migrations (33 versions)
│   │   └── manual/         # Complex migrations (1 file)
│   ├── export/             # Data export (5 files)
│   ├── middleware/         # Request processing (47 files)
│   ├── models/             # Data models (11 files)
│   ├── plugins/            # Mongoose plugins (3 files)
│   ├── resources/          # API resources (5 files)
│   ├── storage/            # File storage (4 files)
│   ├── templates/          # Form templates (4 files)
│   ├── upload/             # TUS upload (19 files)
│   ├── util/               # Utilities (29 files)
│   └── vm/                 # VM for sandboxed execution (8 files)
├── test/                   # Test suite (58 files, 35k+ lines)
├── portal/                 # Admin portal (pre-built)
└── config/                 # Configuration files
```

## 🔑 Key Files and Their Purpose

### Entry Points
| File | Lines | Purpose |
|------|-------|---------|
| `/index.js` | 349 | Main router factory, initializes all routes |
| `/server.js` | 146 | Express server configuration |
| `/install.js` | 404 | Database setup and initial data |
| `/main.js` | 10 | Application entry point |

### Data Models (`/src/models/`)
| File | Lines | Purpose |
|------|-------|---------|
| `Form.js` | 264 | Form schema, validation rules, component definitions |
| `Submission.js` | 109 | Submission data storage and metadata |
| `Action.js` | 131 | Workflow action configurations |
| `Role.js` | 79 | User roles and permission sets |
| `Token.js` | 69 | JWT token management |
| `AccessSchema.js` | 36 | Permission definition schema |

### API Resources (`/src/resources/`)
| File | Lines | Purpose |
|------|-------|---------|
| `FormResource.js` | 96 | Form CRUD operations |
| `SubmissionResource.js` | 244 | Submission API endpoints |
| `Validator.js` | 380 | **Core validation engine** |
| `RoleResource.js` | 33 | Role management |

### Action System (`/src/actions/`)
| File | Lines | Purpose |
|------|-------|---------|
| `actions.js` | 949 | **Main action orchestrator** |
| `EmailAction.js` | 302 | Email notification workflows |
| `LoginAction.js` | 324 | Authentication actions |
| `RoleAction.js` | 377 | Dynamic role assignment |
| `SaveSubmission.js` | 296 | Submission persistence |
| `WebhookAction.js` | 263 | External webhook triggers |
| `ResetPassword.js` | 463 | Password reset workflow |

### Critical Middleware (`/src/middleware/`)
| File | Lines | Purpose |
|------|-------|---------|
| `permissionHandler.js` | 788 | **Core permission system** |
| `submissionHandler.js` | 425 | **Submission processing pipeline** |
| `tokenHandler.js` | 246 | JWT authentication |
| `formHandler.js` | 56 | Form request processing |
| `accessHandler.js` | 88 | Access control enforcement |

### Utilities (`/src/util/`)
| File | Lines | Purpose |
|------|-------|---------|
| `util.js` | 887 | **Core utility functions** |
| `email/index.js` | 567 | Email service integration |
| `email/renderEmail.js` | 446 | Template rendering engine |
| `delete.js` | 280 | Cascading delete operations |
| `swagger.js` | 337 | API documentation generation |

### Database (`/src/db/`)
| File | Lines | Purpose |
|------|-------|---------|
| `index.js` | 819 | **Database initialization and connection** |
| `install.js` | 164 | Initial setup procedures |
| `updates/` | ~3000 | 33 migration scripts (1.0.0 → 3.3.20) |

## 🔍 Common Development Patterns

### Working with Forms
```javascript
// Key files for form operations:
/src/models/Form.js           // Schema and validation
/src/resources/FormResource.js // API endpoints
/src/middleware/formHandler.js // Request processing
/src/middleware/formLoader.js  // Data loading

// Common patterns:
- Forms stored as JSON with component tree
- Components have unique keys for data binding
- Validation rules attached to components
- Form revisions tracked automatically
```

### Working with Submissions
```javascript
// Key files for submission operations:
/src/models/Submission.js               // Data model
/src/resources/SubmissionResource.js    // API layer
/src/middleware/submissionHandler.js    // Processing
/src/actions/SaveSubmission.js          // Persistence

// Common patterns:
- Submissions reference parent form
- Data stored in flexible JSON structure
- Validation runs before save
- Actions trigger after successful save
```

### Working with Permissions
```javascript
// Key files for permission system:
/src/middleware/permissionHandler.js    // Core logic
/src/models/AccessSchema.js             // Permission model
/src/middleware/accessHandler.js        // Enforcement
/src/models/Role.js                     // Role definitions

// Permission levels:
1. Form-level (who can view/edit forms)
2. Submission-level (who can submit/view/edit data)
3. Field-level (conditional field access)
4. Resource-level (API endpoint access)
```

### Working with Actions
```javascript
// Key files for action system:
/src/actions/actions.js         // Main orchestrator
/src/models/Action.js           // Action configuration
/src/actions/EmailAction.js     // Email example
/src/actions/WebhookAction.js   // Webhook example

// Action flow:
1. Form submission validated
2. Actions triggered in priority order
3. Each action executes independently
4. Errors logged but don't block submission
```

## 🧪 Testing Infrastructure

### Test Coverage
- **5,657 lines**: Form API tests (`/test/form.js`)
- **5,772 lines**: Submission tests (`/test/submission.js`)
- **5,998 lines**: Action workflow tests (`/test/actions.js`)
- **11,155 lines**: Access control tests (`/test/submission-access.js`)
- **1,958 lines**: Authentication tests (`/test/auth.js`)
- **3,897 lines**: Template system tests (`/test/templates.js`)

### Running Tests
```bash
# Full test suite
npm test

# Specific test file
mocha test/form.js -b -t 60000

# With coverage
npm run test:coverage
```

## 🚀 Development Commands

### Setup and Run
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run start:dev

# Production server
npm start

# Build VM bundle
npm run build:vm

# Build admin portal
npm run build:portal
```

### Database Management
```bash
# Initialize new project
node install.js

# Run specific migration
node src/db/updates/3.1.4.js

# Check database connection
node src/db/index.js
```

## 🔧 Configuration

### Environment Variables
```javascript
// config/default.json structure:
{
  "port": 3001,
  "host": "localhost",
  "mongodb": "mongodb://localhost:27017/formio",
  "redis": {
    "host": "localhost",
    "port": 6379
  },
  "jwt": {
    "secret": "CHANGEME",
    "expireTime": 240
  }
}
```

### Docker Support
```yaml
# docker-compose.yml provides:
- MongoDB container
- Redis container (optional)
- Form.io application container
```

## 💡 Architecture Insights

### Design Principles
1. **Plugin Architecture**: Extensible via hooks and middleware
2. **JSON-Driven**: Forms, submissions, and actions all JSON-based
3. **RESTful API**: Standard HTTP verbs for all operations
4. **Multi-Tenancy**: Project-based isolation built-in
5. **Event-Driven**: Actions system for workflows

### Performance Considerations
- MongoDB indexes on form._id, submission.form
- Redis caching for frequently accessed data
- Lazy loading of form components
- Batch processing for large submissions
- Stream processing for exports

### Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Field-level encryption support
- ReCAPTCHA integration
- Input sanitization and validation
- CORS configuration

## 🛠️ Troubleshooting Guide

### Common Issues
1. **Permission Denied**: Check `/src/middleware/permissionHandler.js`
2. **Validation Errors**: Debug in `/src/resources/Validator.js`
3. **Action Not Firing**: Trace through `/src/actions/actions.js`
4. **Database Issues**: Check `/src/db/index.js` connection

### Debug Points
```javascript
// Add debug logging:
DEBUG=* npm run start:dev           // All debug output
DEBUG=formio:* npm run start:dev    // Form.io specific
DEBUG=formio:submission:* npm start // Submission specific
```

### Key Log Locations
- Application logs: Console output
- MongoDB logs: MongoDB log file
- Action logs: Database action collection
- Error tracking: `/src/util/error.js`

## 📚 Additional Resources

### Internal Documentation
- API routes: Auto-documented via Swagger at `/spec.json`
- Database schema: See model files in `/src/models/`
- Middleware order: Defined in `/index.js`

### External Dependencies
- **@formio/core**: Core form rendering logic
- **@formio/js**: JavaScript form renderer
- **mongoose**: MongoDB ORM
- **express**: Web framework
- **jsonwebtoken**: JWT implementation
- **nodemailer**: Email sending

---

**Note**: This is a living document. When exploring the codebase, use the file paths and line numbers as starting points, then trace through the code flow to understand the complete picture.