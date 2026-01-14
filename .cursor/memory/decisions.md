# ARCHITECTURAL DECISIONS

This file provides context to prevent agent from proposing already-rejected approaches.

---

## State Management

**Decision**: Keep Vuex for legacy modules, Pinia for new code
**Reason**: Migration cost too high, coexistence is stable
**Date**: 2024-Q1
**Status**: Active

⚠️ Agent: Do not propose full Vuex → Pinia migration

---

## API Client

**Decision**: Axios stays, no switch to fetch
**Reason**: Interceptor logic too complex to migrate
**Status**: Active

---

## Authentication

**Decision**: JWT with refresh token rotation
**Constraints**: Must remain backward compatible with mobile apps v1.x
**Status**: Active

⚠️ Agent: Never change auth flow without explicit approval

---

## Database

**Decision**: PostgreSQL with read replicas
**Constraints**: No MongoDB, no NoSQL for transactional data
**Status**: Active

---

## Monorepo Strategy

**Decision**: Nx workspace with strict module boundaries
**Status**: Active

⚠️ Agent: Respect @scope/package boundaries