# OFF-LIMITS ZONES

Agent: NEVER modify these without explicit human approval.

---

## Authentication & Authorization

Path: `/src/auth/*`, `/src/permissions/*`
Reason: Security-critical
Approval required from: Security team

---

## Payment Processing

Path: `/src/billing/*`, `/src/payments/*`
Reason: Financial compliance
Approval required from: CTO + Legal

---

## Database Migrations

Path: `/migrations/*`
Reason: Data integrity
Approval required from: DBA + Tech Lead

---

## CI/CD Configuration

Path: `/.github/workflows/*`, `/deploy/*`
Reason: Production stability
Approval required from: DevOps lead

---

## Third-party Integrations

Path: `/src/integrations/*`
Reason: External dependencies
Approval required from: Integration owner