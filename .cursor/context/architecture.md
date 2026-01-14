# SYSTEM ARCHITECTURE

This file helps agent understand the big picture.

---

## Architecture Style

**Type**: Modular monolith (preparing for microservices)
**Pattern**: Layered architecture with domain boundaries

## Layers

```text
Presentation (Vue 3 + Nuxt)
     ↓
Application (Use cases)
     ↓
Domain (Business logic)
     ↓
Infrastructure (DB, APIs)
```

## Key Modules

- **Auth**: JWT-based, refresh token rotation
- **User Management**: RBAC with fine-grained permissions
- **Content**: CMS-style with versioning
- **Notifications**: Event-driven (Redis pub/sub)
- **Analytics**: Real-time aggregation (Postgres + TimescaleDB)

## Data Flow

User → API Gateway → Service → Domain → Repository → Database

## Critical Constraints

- All services must be stateless
- No direct database access from UI layer
- Events are append-only
- Backward compatibility required for APIs
