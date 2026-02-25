# PMS Roadmap - Priority Action Plan

## 🎯 Quick Reference Card

### Current Status

- **Features**: ~75% MVP implemented
- **Production Ready**: ❌ NO
- **Critical Issues**: 7 blocking issues
- **Estimated Fix Time**: 12-17 weeks (or 4 weeks for basic hardening)

### Blocker Issues (Fix IMMEDIATELY)

1. ❌ No database persistence (JSON files)
2. ❌ No API authentication
3. ❌ No input validation
4. ❌ No error handling/user feedback
5. ❌ Race conditions on concurrent requests
6. ❌ No data integrity checks
7. ❌ Unencrypted sensitive data

---

## Phase 1: HARDENING (Weeks 1-4) 🔴

### Week 1: Authentication & Validation

#### Task 1.1: Add API Authentication

**File**: server/server.js
**Status**: Not started
**Effort**: 2-3 hours

```javascript
// Add to all data endpoints
app.get("/api/patients", ensureAuth(), (req, res) => {
  // Currently unprotected - ANYONE can access
});
```

**Required**:

- Apply `ensureAuth()` middleware to all `/api/*` endpoints (except auth)
- Verify tests with Postman/Insomnia

#### Task 1.2: Input Validation on Backend

**Library**: `joi` or `zod`
**Status**: Not started
**Effort**: 3-4 hours

```javascript
// All endpoints need validation
app.post("/api/patients", (req, res) => {
  // Currently accepts any data
  const patient = { id: ..., ...req.body } // ❌ No validation
});
```

**Required**:

- Define schemas for each entity
- Validate before DB write
- Return 400 for validation errors

#### Task 1.3: Frontend Error Handling

**Files**: src/app/Components/\*.tsx
**Status**: Partial (~20% done)
**Effort**: 2-3 hours

```tsx
// Currently just logs to console
catch (error) {
  console.error("Error saving billing data:", error);
  // ❌ User has NO IDEA what happened
}
```

**Required**:

- Add error state to all forms
- Show toast notifications on success/error
- Disable submit button during request

---

### Week 2: Database Migration

#### Task 2.1: Setup PostgreSQL

**Status**: Not started
**Effort**: 4-6 hours

```javascript
// Replace all JSON file operations
const patientsPath = path.join(__dirname, "data", "patients.json");
const getPatients = () => JSON.parse(fs.readFileSync(patientsPath));
// ❌ Change to:
const getPatients = async () => {
  return await db.query("SELECT * FROM patients");
};
```

**Required**:

- Docker Compose with PostgreSQL
- Connection pooling (pg module)
- Environment config for credentials

#### Task 2.2: Create Database Schema

**Status**: Not started
**Effort**: 3-4 hours

```sql
-- Create tables for all entities
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  status VARCHAR(50),
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Similar for other entities...
-- Add foreign keys
-- Add indexes on frequently queried fields
```

#### Task 2.3: Migrate Data

**Status**: Not started  
**Effort**: 2 hours

```
Migrate existing JSON data to PostgreSQL:
- patients.json → patients table
- treatments.json → treatments table
- casesheets.json → casesheets table
- billings.json → billings table
- invoices.json → invoices table
- payments.json → payments table
- users.json → users table
```

---

### Week 3: Authorization & Business Rules

#### Task 3.1: Add Authorization Layer

**Files**: server/authMiddleware.js
**Status**: Exists but not used
**Effort**: 2-3 hours

```javascript
// Define who can see what
function canViewPatient(req, patient) {
  if (req.user.role === "owner") return true;
  if (req.user.role === "doctor" && patient.doctorId === req.user.id)
    return true;
  return false;
}

app.get("/api/patients/:id", ensureAuth(), (req, res) => {
  const patient = getPatient(req.params.id);
  if (!canViewPatient(req, patient)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json(patient);
});
```

**Required**:

- Role checks on all endpoints
- Ownership checks for resource access
- Audit logging of who accessed what

#### Task 3.2: Add Business Rule Validation

**Files**: server/server.js
**Status**: Not started
**Effort**: 3-4 hours

```javascript
// Validate business rules before save
app.post("/api/payments", async (req, res) => {
  const invoice = await getInvoice(req.body.invoiceId);

  // Validation on backend
  if (req.body.amount > invoice.finalAmount - invoice.paidAmount) {
    return res.status(400).json({ error: "Payment exceeds balance" });
  }

  // Only allow payments on unpaid/partially paid invoices
  if (invoice.status === "Paid") {
    return res.status(400).json({ error: "Invoice already paid" });
  }

  // Create payment
  const payment = await createPayment(req.body);
  res.json(payment);
});
```

---

### Week 4: Error Handling & Logging

#### Task 4.1: Global Error Handler

**Status**: Not started
**Effort**: 2 hours

```javascript
// Central error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  // Different responses for different errors
  if (err.validation) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.validation,
    });
  }

  if (err.status === 404) {
    return res.status(404).json({ error: "Not found" });
  }

  // Generic error
  res.status(500).json({ error: "Internal server error" });
});
```

#### Task 4.2: Frontend Error Boundary

**Files**: src/app/Components/ErrorBoundary.tsx
**Status**: Not started
**Effort**: 2 hours

```tsx
// Catch and display errors gracefully
class ErrorBoundary extends React.Component {
  renderError() {
    return <div>Something went wrong</div>;
  }
}

// Use in Layout
<ErrorBoundary>{children}</ErrorBoundary>;
```

---

## Phase 2: FRONTEND POLISH (Weeks 5-7) 🟡

### Week 5: Loading & Error States

#### Task 5.1: Loading Skeletons

**Components**: All data-fetching pages
**Status**: Not started
**Effort**: 3 hours

```tsx
// Show loading state while fetching
{
  loading ? <PatientSkeleton /> : <PatientForm />;
}
```

#### Task 5.2: Toast Notifications

**Library**: `react-toastify` or primereact Toast
**Status**: Not started
**Effort**: 2 hours

```tsx
const toast = useRef(null);

const onSave = () => {
  toast.current.show({
    severity: "success",
    summary: "Success",
    detail: "Patient saved successfully",
  });
};
```

---

### Week 6: Missing CRUD Operations

#### Task 6.1: Complete Delete Operations

**Pages**: Patients, Treatments, Casesheets
**Status**: Partially done
**Effort**: 2 hours

```tsx
// Add delete handlers to all tables
const handleDelete = async (rowData) => {
  if (confirm("Are you sure?")) {
    await fetch(`/api/patients/${rowData.id}`, { method: "DELETE" });
    // Refresh data
  }
};
```

#### Task 6.2: Complete Edit Operations

**Files**: All edit pages
**Status**: Incomplete
**Effort**: 3 hours

---

### Week 7: Environment Configuration

#### Task 7.1: Environment Variables

**Files**: .env files
**Status**: Partial
**Effort**: 1 hour

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://api.example.com

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/pms
API_PORT=5000
SESSION_SECRET=<generate-strong-secret>
CLIENT_URL=https://app.example.com
NODE_ENV=production
```

#### Task 7.2: Environment-Specific Config

**Status**: Not started
**Effort**: 2 hours

```javascript
// Load config based on NODE_ENV
const config = {
  development: {
    /* ... */
  },
  production: {
    /* ... */
  },
  test: {
    /* ... */
  },
};
```

---

## Phase 3: TESTING (Weeks 8-10) 🟡

### Week 8: Unit Tests

#### Task 8.1: Test Business Logic

**Framework**: Jest
**Status**: Not started
**Effort**: 4-6 hours

```javascript
// Example: Test payment calculation
describe("Invoice Payment", () => {
  it("should not allow payment exceeding invoice amount", () => {
    const invoice = { finalAmount: 1000, paidAmount: 500 };
    const canPay = (amount) =>
      amount <= invoice.finalAmount - invoice.paidAmount;
    expect(canPay(600)).toBe(false);
  });
});
```

### Week 9: Integration Tests

#### Task 9.1: Test API Workflows

**Status**: Not started
**Effort**: 6-8 hours

```javascript
// Example: Test patient creation workflow
describe("Patient Creation", () => {
  it("should create patient and validate fields", async () => {
    const res = await request(app)
      .post("/api/patients")
      .send({ name: "John", age: "30" });
    expect(res.status).toBe(201);
  });
});
```

### Week 10: E2E Tests

#### Task 10.1: User Workflows

**Framework**: Cypress or Playwright
**Status**: Not started
**Effort**: 8 hours

```javascript
// Test complete workflow
cy.visit("/login");
cy.get("[data-cy=email]").type("user@example.com");
cy.get("[data-cy=password]").type("password");
cy.get("[data-cy=login-btn]").click();
cy.url().should("include", "/dashboard");
```

---

## Phase 4: DEPLOYMENT (Weeks 11-12) 🟡

### Week 11: Containerization

#### Task 11.1: Docker Setup

**Files**: Dockerfile, docker-compose.yml
**Status**: Not started
**Effort**: 2-3 hours

```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Frontend
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pms
      POSTGRES_PASSWORD: <secret>
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/pms

  frontend:
    build: ./
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

#### Task 11.2: CI/CD Pipeline

**Status**: Not started
**Effort**: 3-4 hours

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker
        run: docker build -t pms:latest .
      - name: Deploy to server
        run: ssh deploy@server "cd /app && docker-compose pull && docker-compose up -d"
```

### Week 12: Monitoring & Documentation

#### Task 12.1: Health Checks

**Status**: Not started
**Effort**: 1 hour

```javascript
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.get("/ready", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});
```

#### Task 12.2: API Documentation

**Status**: Not started
**Effort**: 3-4 hours

```javascript
// Add Swagger/OpenAPI documentation
const swaggerDocs = {
  openapi: "3.0.0",
  info: { title: "PMS API", version: "1.0.0" },
  paths: {
    "/api/patients": {
      get: {
        summary: "Get all patients",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of patients" },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

---

## QUICK START IMPLEMENTATION

### If you want 50% improvement in 1 week:

**Monday-Tuesday**: Add API Auth + Basic Validation

```bash
npm install joi express-middleware
# Add ensureAuth() to /api/* endpoints
# Add schema validation
```

**Wednesday-Thursday**: Database Migration to SQLite (simpler than PostgreSQL for MVP)

```bash
npm install sqlite3 better-sqlite3
# Create database schema
# Migrate JSON data
```

**Friday**: Error Handling & Testing

```bash
npm install jest supertest
# Add try-catch and error responses
# Write 10 basic tests
```

### If you want Production Ready in 4 weeks:

Follow Phases 1-2 completely
Skip Phase 3 initially (add tests incrementally)
Do Phase 4 minimum viable deployment

---

## EFFORT ALLOCATION

```
Phase 1 (Hardening):    120-150 hours  (20-25% critical fixes)
Phase 2 (Polish):        40-50 hours   (15-20% improvement)
Phase 3 (Testing):       60-80 hours   (25% coverage)
Phase 4 (Deployment):    40-50 hours   (operational ready)

Total: 260-330 hours (~7-8 developer weeks)
```

### For a Team:

- **1 Developer**: 12-17 weeks
- **2 Developers**: 6-9 weeks (one per frontend/backend)
- **3 Developers**: 4-6 weeks (add QA-focused dev)

---

## SUCCESS CRITERIA

### ✅ End of Phase 1 (Week 4)

- [ ] All API endpoints require authentication
- [ ] All inputs validated server-side
- [ ] Data in PostgreSQL (not JSON)
- [ ] No more than 1 error per 100 requests
- [ ] Authorization checks in place

### ✅ End of Phase 2 (Week 7)

- [ ] All forms show error messages
- [ ] All data operations complete (CRUD)
- [ ] Loading states visible
- [ ] Environment-specific config working

### ✅ End of Phase 3 (Week 10)

- [ ] 50%+ test coverage
- [ ] All critical workflows tested
- [ ] E2E tests for happy path

### ✅ End of Phase 4 (Week 12)

- [ ] Deployable with Docker
- [ ] CI/CD pipeline working
- [ ] Health checks passing
- [ ] Ready for beta launch

---

## DECISION POINT

**After Phase 1 (Week 4)**, evaluate:

- Do you want to launch MVP with core hardening only?
- Or continue to Phase 2-3 for more features?
- Or stop here and refactor other areas?

**My Recommendation**:
Complete Phase 1 (CRITICAL) → Launch internal beta → Then decide on Phase 2-3 based on user feedback.

---

Would you like me to implement any specific phase? I can start with Phase 1 tasks right away.
