# KNOWN TECHNICAL DEBT

Agent: These are accepted trade-offs. Do not propose fixes unless explicitly asked.

---

## Legacy Auth Module

**Issue**: Uses Options API (rest of codebase is Composition)
**Why not fixed**: Migration would break mobile app integration
**Workaround**: Isolated behind adapter
**Impact**: Low
**Fix planned**: Q3 2024

⚠️ Agent: Do not touch /src/legacy/auth/

---

## Circular Dependency in Utils

**Issue**: utils/format ↔ utils/validate
**Why not fixed**: Breaking change requires major version bump
**Workaround**: Works, just ugly
**Impact**: Low

---

## N+1 Query in Dashboard

**Issue**: User list fetches per-user permissions
**Why not fixed**: Requires DB schema change
**Workaround**: Cached for 5 minutes
**Impact**: Medium (acceptable for now)
**Fix planned**: When we migrate to new permissions table

⚠️ Agent: Do not "optimize" this without schema migration approval