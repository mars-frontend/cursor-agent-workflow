# Cursor Agent Usage Guide

## Purpose

This `.cursor/` directory controls AI agent behavior to ensure:

- Consistent code quality
- Architectural integrity
- Security compliance
- Team alignment

---

## Quick Start

### For Daily Tasks

Use templates in `prompts/`:

```bash
# Bug fix
Copy prompts/bug-fix.md → fill in details

# Refactor
Copy prompts/refactor.md → adjust constraints
```

### For Complex Changes

1. Start with `prompts/migration.md`
2. Add custom constraints
3. Review `memory/decisions.md` for context

---

## When NOT to Use Agent

❌ Major architectural decisions
❌ Security-critical changes (unless supervised)
❌ Business logic design
❌ Database schema design
❌ API contract design

---

## File Guide

### rules* - Non-negotiable constraints

Agent must obey these at all times.

### prompts/ - Task templates

Copy, customize, use.

### memory/ - Context injection

Prevents agent from proposing bad ideas.

### context/ - Big picture

Helps agent understand system architecture.

---

## Governance

### Who Can Modify

- `rules*`: Tech lead approval required
- `prompts/`: Any senior engineer
- `memory/`: Any engineer (with PR)

### Versioning

- Treat rule changes as architecture changes
- Tag versions: `v1.0`, `v1.1`, etc.
- Document breaking changes

---

## Troubleshooting

### Agent ignores rules

- Rules too long (>500 lines)
- Conflicting constraints
- User prompt overrides

### Agent produces bad code

- Check if task is too vague
- Add more constraints
- Use more specific template

### Context too large

- Update `.cursorignore`
- Use `@filename` for targeted context
- Break task into smaller pieces

---

## Support

Questions? Ask in #cursor-usage Slack channel

---

## 🎯 USAGE PATTERNS (Expert Level)

### Pattern 1: Safe Refactor

```markdown
@refactor.md

Goal: Extract authentication logic from UserController

Constraints:
- No behavior change
- Preserve error handling
- Maintain backward compatibility
- Keep existing tests passing

Context:
- Current auth is in UserController (lines 150-300)
- Used by 5 different endpoints
- Must work with legacy mobile app
```

### Pattern 2: Migration with Rollback

```markdown
@migration.md

Goal: Migrate Options API to Composition API in UserProfile.vue

Constraints:
- Feature parity required
- Component props must remain identical
- No parent component changes

Process:
1. Create UserProfile.composition.vue alongside old file
2. Switch via feature flag
3. A/B test for 1 week
4. Remove old file after validation
```

### Pattern 3: Bug Fix with Root Cause

```markdown
@bug-fix.md

Bug: Race condition in token refresh flow

Expected: Token refreshes silently
Actual: Occasional 401 errors

Context:
- Happens when multiple requests fire simultaneously
- Refresh token is shared across tabs
- No mutex/lock mechanism

Process:
1. Analyze token refresh flow (do not fix yet)
2. Propose mutex strategy
3. Wait for approval
4. Implement with tests
```

---

## 🚀 ADVANCED: Team Governance

### Rule Versioning

```bash
.cursor/
├─ rules.v1           # Stable
├─ rules.v2.draft     # Experimental
└─ rules → rules.v1   # Symlink
```

### Audit Trail

```markdown
# .cursor/CHANGELOG.md

## v1.2.0 - 2024-01-15
### Added
- `rules.security` for secret detection
- `memory/off-limits.md` for forbidden zones

### Changed
- `rules` now enforces Stop Conditions
- `prompts/refactor.md` requires explicit constraints

### Removed
- Deprecated `rules.legacy`
```

### Team Roles

```markdown
Tech Lead:
- Approves rule changes
- Reviews agent-generated PRs for critical paths

Senior Engineers:
- Create new prompt templates
- Update memory/ context
- Review agent output

Mid-level Engineers:
- Use existing templates
- Report rule violations
- Suggest improvements
```

---

## 📊 METRICS TO TRACK

### Agent Effectiveness

- % of agent PRs merged without changes
- Average review time (should decrease)
- Number of rollbacks (should be near zero)

### Quality Indicators

- Type errors introduced by agent
- Test coverage delta
- Performance regression incidents

### Team Adoption

- % of engineers using templates
- Number of custom prompts created
- Rule violation reports

---

## 🎓 EXPERT TIPS

### 1. Context is King

Bad: "Refactor this file"
Good: "Refactor UserService.ts to extract validation logic, preserve error handling, no behavior change"

### 2. Constrain Aggressively

More constraints → Better output
Let agent optimize within bounds, not expand scope

### 3. Phase Your Changes

Big refactor = many small, reversible steps
Each step independently testable

### 4. Trust but Verify

Agent output is a proposal, not truth
Senior judgment is final authority

### 5. Evolve Your Rules

Rules are code for AI behavior
Version, test, refine over time

---

## 🔒 SECURITY CHECKLIST

Before merging agent-generated code:

✓ No secrets exposed
✓ No new security vulnerabilities
✓ No privilege escalation
✓ No SQL injection vectors
✓ No XSS vulnerabilities
✓ Dependencies scanned
✓ Sensitive data redacted

---

## 📚 REFERENCES

- ReAct Paper: https://arxiv.org/abs/2210.03629
- Cursor Documentation: https://docs.cursor.com
- LangChain Agent Patterns: https://python.langchain.com/docs/modules/agents/

---
