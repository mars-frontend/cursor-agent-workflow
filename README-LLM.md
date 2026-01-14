# CURSOR + LLM AGENT STRUCTURE - EXPERT LEVEL (2025 OFFICIAL)

## Updated According to Latest Cursor Official Documentation

---

## 🚨 BREAKING CHANGES IN CURSOR (2025)

### ❌ DEPRECATED (Legacy)

```markdown
project-root/
└─ .cursorrules          # Single file (DEPRECATED)
```

### ✅ NEW OFFICIAL STRUCTURE (2025)

```markdown
project-root/
├─ .cursor/
│  └─ rules/             # Directory containing .mdc files
│     ├─ general.mdc
│     ├─ frontend.mdc
│     ├─ backend.mdc
│     └─ feature-name/
│        └─ specific.mdc
```

---

## 📋 OFFICIAL STRUCTURE (PRODUCTION-READY)

```markdown
project-root/
├─ .cursor/
│  ├─ rules/                          # ⭐ NEW: MDC format
│  │  ├─ general.mdc                  # Core system rules
│  │  ├─ security.mdc                 # Security constraints
│  │  ├─ performance.mdc              # Performance rules
│  │  ├─ data-privacy.mdc            # GDPR/Privacy
│  │  ├─ dependencies.mdc            # Dependency management
│  │  ├─ observability.mdc           # Logging/monitoring
│  │  ├─ accessibility.mdc           # A11Y compliance
│  │  ├─ testing.mdc                 # Test discipline
│  │  │
│  │  ├─ frontend/                    # Scoped rules
│  │  │  ├─ react.mdc
│  │  │  ├─ vue.mdc
│  │  │  └─ components.mdc
│  │  │
│  │  ├─ backend/
│  │  │  ├─ api.mdc
│  │  │  ├─ database.mdc
│  │  │  └─ services.mdc
│  │  │
│  │  ├─ migration/
│  │  │  └─ refactor.mdc
│  │  │
│  │  ├─ prompts/                     # Task templates
│  │  │  ├─ bug-fix.mdc
│  │  │  ├─ refactor.mdc
│  │  │  ├─ feature.mdc
│  │  │  └─ optimization.mdc
│  │  │
│  │  └─ templates/                   # Reference files
│  │     ├─ service-template.ts
│  │     ├─ component-template.tsx
│  │     └─ api-endpoint-template.ts
│  │
│  └─ AGENTS.md                       # ⭐ NEW: Agent-specific config
│
└─ .cursorrules                       # Legacy support (optional)
```

---

## 🎯 MDC FILE FORMAT (New Official Format)

### What is MDC?

**MDC (Markdown with Metadata)** = Markdown + YAML frontmatter

- Supports metadata for rule behavior
- More powerful than plain text
- Version-controlled
- Scoped by file patterns

### MDC Structure

```markdown
---
description: "When to apply this rule"
globs:
  - "src/**/*.tsx"
  - "components/**/*.vue"
alwaysApply: false
---

# Rule Content (Markdown)

Your rule instructions here...

## Can reference files
@service-template.ts
@component-pattern.tsx

## Can include examples
```typescript
// Example code
```

```markdown


---

## 📁 RULE TYPES (Official Classification)

### 1. **Always Apply** (Global Rules)
```yaml
---
alwaysApply: true
---
```markdown
Applied to every AI interaction, regardless of context.

**Use for:**
- Core constraints
- Security policies
- Communication style

### 2. **Auto Attached** (Pattern-Based)
```yaml
---
globs:
  - "src/api/**/*.ts"
alwaysApply: false
---
```markdown
Automatically included when files matching pattern are referenced.

**Use for:**
- Frontend/Backend separation
- Framework-specific rules
- Module-specific guidelines

### 3. **Agent Requested** (On-Demand)
```yaml
---
description: "Use when refactoring legacy code"
alwaysApply: false
---
```markdown
Agent decides when to apply based on description.

**Use for:**
- Migration workflows
- Specialized tasks
- Advanced patterns

### 4. **Manual** (Explicit Invoke)
No automatic triggers - invoked via `@rule-name`

**Use for:**
- Templates
- One-off tasks
- Experimental rules

---

## 📝 COMPLETE FILE EXAMPLES

### `.cursor/rules/general.mdc` - CORE CONSTRAINTS

```markdown
---
description: "Core system rules applied to all agent interactions"
alwaysApply: true
---

# AGENT IDENTITY & ROLE

You are a disciplined execution agent operating within strict architectural boundaries.
- You do NOT own design decisions
- You ARE an implementation engine with reasoning capability

---

# DECISION AUTHORITY

## YOU MAY:
- Implement within given constraints
- Refactor for clarity (minimal scope)
- Fix obvious bugs
- Improve code readability

## YOU MUST ASK BEFORE:
- Changing public APIs
- Adding dependencies
- Modifying data schemas
- Introducing breaking changes
- Touching authentication/authorization
- Changing business logic

## YOU MUST NEVER:
- Assume missing requirements
- Expand scope beyond task
- Make architectural decisions
- Remove error handling
- Weaken type safety
- Introduce silent side effects

---

# SAFETY RULES (NON-NEGOTIABLE)

## 1. Minimal Diff Principle
- Prefer smallest possible change
- One responsibility per commit
- Reversible steps only

## 2. Explicit Over Implicit
- No hidden coupling
- No global state mutations
- No implicit side effects

## 3. Stop Conditions
STOP IMMEDIATELY if you detect:
- Ambiguous requirements
- Conflicting constraints
- Unexpected coupling
- Breaking change risk
- Security implications

---

# EXECUTION PROTOCOL

## Phase 1: ANALYZE (no code changes)
- Understand current architecture
- Identify affected components
- List assumptions
- Highlight risks

## Phase 2: PLAN (wait for approval)
- Propose step-by-step approach
- Show before/after behavior
- Explain trade-offs
- Estimate blast radius

## Phase 3: EXECUTE (incremental)
- Atomic, reversible commits
- Self-document changes
- Verify after each step

## Phase 4: VERIFY
- Type check passes
- Tests pass
- No new warnings
- Behavior matches intent

---

# OUTPUT DISCIPLINE

Every response must include:
✓ What changed
✓ Why it's safe
✓ What could go wrong
✓ Verification steps taken
```

---

### `.cursor/rules/frontend/react.mdc` - SCOPED RULE

```markdown
---
description: "React development guidelines with TypeScript and hooks"
globs:
  - "src/**/*.tsx"
  - "src/**/*.jsx"
  - "components/**/*.tsx"
alwaysApply: false
---

# REACT DEVELOPMENT RULES

## Framework Discipline
- Use functional components with hooks (no class components)
- Follow existing component structure
- One component per file
- Export component as default

## TypeScript
- Define prop types with interface (not type)
- Use generic types for reusable components
- Never use `any` unless explicitly needed
- Prefer explicit over implicit types

## State Management
- Use `useState` for local state
- Use context for shared state within feature
- No prop drilling beyond 2 levels
- Document state shape with JSDoc

## Performance
- Wrap expensive operations in `useMemo`
- Use `useCallback` for event handlers passed to children
- Lazy load components for routes
- Code split by feature

## Hooks Rules
- Only call hooks at top level
- Custom hooks must start with `use`
- Clean up side effects in `useEffect`
- List all dependencies in dependency array

## Component Structure
Follow this layout:
```tsx
// 1. Imports
import { FC } from 'react';

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Component
export const Component: FC<ComponentProps> = ({ prop }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div />;
};
```

## Reference Pattern

@component-template.tsx

```markdown

---

### `.cursor/rules/security.mdc` - CRITICAL RULES

```markdown
---
description: "Security and privacy constraints - non-negotiable"
alwaysApply: true
---

# SECURITY RULES - NON-NEGOTIABLE

## Secrets Management
STOP immediately if you detect:
- API keys in code
- Hardcoded passwords
- Database credentials
- Private keys
- OAuth tokens

**Action:** Flag and request human review

## Data Privacy
- No PII/PHI in logs
- No sensitive data in error messages
- Redact before sending to LLM
- No production data in prompts

## Code Security
Forbidden patterns:
- `eval()` / `new Function()`
- Unsafe deserialization
- Command injection vectors
- Path traversal vulnerabilities
- XSS-prone `innerHTML`

## Input Validation
- Validate all user input
- Sanitize before database queries
- Use parameterized queries
- Escape output in templates

## Dependencies
- No new dependencies without approval
- Check for known CVEs
- Prefer well-maintained packages
- No deprecated packages

## Audit Trail
- Log all security-relevant changes
- Document privilege escalations
- Track data access patterns
```

---

### `.cursor/rules/prompts/bug-fix.mdc` - TASK TEMPLATE

```markdown
---
description: "Use when investigating and fixing bugs"
alwaysApply: false
---

# BUG FIX WORKFLOW

Read and obey all .cursor rules.

## Required Information
- **Bug description:** {{what is broken}}
- **Expected behavior:** {{what should happen}}
- **Actual behavior:** {{what actually happens}}
- **Reproduction steps:** {{how to reproduce}}

## Process

### Phase 1: Root Cause Analysis
**Do NOT fix immediately**

1. Trace execution flow
2. Identify why it happens
3. List potential causes
4. Gather evidence (logs, stack trace)

**Output:** Root cause explanation with evidence

### Phase 2: Propose Solution
1. Explain fix approach
2. Show minimal patch
3. Highlight side effects
4. List test cases needed

**Output:** Fix proposal with impact analysis

### Phase 3: Wait for Approval
Human checkpoint before implementation

### Phase 4: Implement Fix
1. Apply minimal change
2. Add test coverage
3. Document edge cases
4. Verify no regression

## Verification Checklist
- [ ] Bug no longer reproduces
- [ ] No regression in related features
- [ ] Test coverage added
- [ ] Error handling improved
- [ ] Documentation updated

## Stop Conditions
If you encounter:
- Multiple possible root causes
- Fix requires breaking changes
- Impact unclear
- Security implications

→ STOP and request clarification
```

---

### `.cursor/AGENTS.md` - AGENT-SPECIFIC CONFIG

```markdown
# AGENT CONFIGURATION

This file configures agent-specific behaviors in Cursor.

## Model Preferences

### Primary Model
Claude Sonnet 4 - for complex reasoning and architecture decisions

### Fast Model
Claude Haiku - for quick refactors and simple fixes

### Specialized Tasks
- Code generation: Claude Sonnet
- Code review: GPT-4 Turbo
- Documentation: Claude Sonnet

## Context Management

### Maximum Context Size
- Keep context under 20k tokens
- Use @mentions for targeted context
- Prefer specific files over full codebase

### Context Priority
1. Current file
2. Referenced files (@filename)
3. Active rules
4. Related modules

## Behavior Preferences

### Communication Style
- Concise and technical
- No unnecessary explanation
- Bullet points for lists
- Code examples when helpful

### Code Generation
- Prefer existing patterns
- Follow project conventions
- Minimal diffs
- Self-documenting code

### Error Handling
- Stop on ambiguity
- Ask for clarification
- Never guess requirements
- Document assumptions

## Safety Settings

### Auto-apply Limits
- Max 10 files changed per session
- Max 500 lines per file
- Require approval for breaking changes

### Protected Paths
Never modify without explicit approval:
- `/src/auth/**`
- `/migrations/**`
- `/.github/workflows/**`
- `/config/production/**`
```

---

## 🎯 USER RULES vs PROJECT RULES

### User Rules (Global)

**Location:** Cursor Settings → General → Rules for AI

**Use for:**

- Personal coding style
- Output language preference
- Communication preferences
- Global conventions

**Example:**

```markdown
- Always reply in English
- Keep explanations concise
- Use TypeScript for all JavaScript
- Follow functional programming style
```

### Project Rules (Scoped)

**Location:** `.cursor/rules/*.mdc`

**Use for:**

- Project-specific constraints
- Team conventions
- Framework requirements
- Domain knowledge

---

## 🚀 MIGRATION GUIDE (Legacy → New Format)

### If you have `.cursorrules`

**Step 1:** Create new structure

```bash
mkdir -p .cursor/rules
```

**Step 2:** Split into MDC files

```bash
# Old: .cursorrules (single file)
# New: .cursor/rules/*.mdc (multiple files)
```

**Step 3:** Add metadata

```yaml
---
description: "Core rules"
alwaysApply: true
---
```

**Step 4:** Test and verify

```bash
# Check rules are loaded
Cmd/Ctrl + Shift + P → "Cursor: Show Rules"
```

**Step 5:** Remove legacy file

```bash
# Once verified, you can delete
rm .cursorrules
```

---

## 📊 RULE ORGANIZATION BEST PRACTICES

### ✅ DO

```markdown
.cursor/rules/
├─ general.mdc                    # Always apply
├─ security.mdc                   # Always apply
├─ frontend/
│  ├─ react.mdc                   # Auto attach: **/*.tsx
│  └─ vue.mdc                     # Auto attach: **/*.vue
└─ backend/
   ├─ api.mdc                     # Auto attach: api/**/*.ts
   └─ database.mdc                # Auto attach: db/**/*.ts
```

### ❌ DON'T

```markdown
.cursor/rules/
├─ everything.mdc                 # Too broad
├─ rule1.mdc, rule2.mdc...       # No clear naming
└─ my-rules/
   └─ stuff.mdc                   # Vague organization
```

---

## 🎓 ADVANCED PATTERNS

### Pattern 1: Chained Rules

```markdown
---
description: "API endpoint creation"
globs:
  - "src/api/**/*.ts"
---

# API ENDPOINT RULES

Follow these patterns:
@api-template.ts
@validation-template.ts
@error-handling-template.ts
```

### Pattern 2: Conditional Rules

```markdown
---
description: "Use when migrating from Options API to Composition API"
alwaysApply: false
---

# MIGRATION RULES

Only apply when user explicitly requests migration.
```

### Pattern 3: Feature-Scoped Rules

```markdown
.cursor/rules/
└─ features/
   ├─ auth/
   │  └─ rules.mdc
   ├─ billing/
   │  └─ rules.mdc
   └─ notifications/
      └─ rules.mdc
```

---

## 🔧 CREATING RULES (Official Methods)

### Method 1: Command Palette

```markdown
Cmd/Ctrl + Shift + P
→ "Cursor: New Rule"
→ Choose type (Always/Auto/Manual)
→ Fill in metadata + content
```

### Method 2: Chat Command

```markdown
In chat:
/Generate Cursor Rules

Agent will analyze conversation and create rules
```

### Method 3: Manual Creation

```bash
# Create file
touch .cursor/rules/my-rule.mdc

# Add metadata + content
---
description: "..."
globs: ["..."]
---

# Content
```

---

## ✅ RULE QUALITY CHECKLIST

### Good Rule Characteristics

- [ ] Focused on single concern
- [ ] Actionable (clear what to do)
- [ ] Scoped appropriately (globs or description)
- [ ] References examples when helpful
- [ ] Documents stop conditions
- [ ] Versioned with project

### Bad Rule Characteristics

- [ ] Vague guidance ("write good code")
- [ ] Too broad (applies everywhere)
- [ ] No examples
- [ ] No clear trigger
- [ ] Conflicts with other rules

---

## 📈 PRODUCTION DEPLOYMENT CHECKLIST

### Phase 1: Core Rules (Week 1)

```markdown
.cursor/rules/
├─ general.mdc          ✓ Core constraints
├─ security.mdc         ✓ Security policy
└─ AGENTS.md            ✓ Agent config
```

### Phase 2: Domain Rules (Week 2)

```markdown
.cursor/rules/
├─ frontend/
│  └─ react.mdc
├─ backend/
│  └─ api.mdc
└─ testing.mdc
```

### Phase 3: Advanced (Month 2+)

```markdown
.cursor/rules/
├─ performance.mdc
├─ accessibility.mdc
├─ data-privacy.mdc
└─ prompts/
   ├─ bug-fix.mdc
   ├─ refactor.mdc
   └─ feature.mdc
```

---

## 🎯 FINAL STRUCTURE (COMPLETE)

```markdown
project-root/
├─ .cursor/
│  ├─ rules/
│  │  ├─ general.mdc                  # Always apply
│  │  ├─ security.mdc                 # Always apply
│  │  ├─ performance.mdc              # Always apply
│  │  ├─ data-privacy.mdc            # Always apply
│  │  ├─ dependencies.mdc            # Always apply
│  │  ├─ observability.mdc           # Always apply
│  │  ├─ accessibility.mdc           # Always apply
│  │  ├─ testing.mdc                 # Auto attach
│  │  │
│  │  ├─ frontend/
│  │  │  ├─ react.mdc                # Auto: **/*.tsx
│  │  │  ├─ vue.mdc                  # Auto: **/*.vue
│  │  │  └─ components.mdc           # Auto: components/**
│  │  │
│  │  ├─ backend/
│  │  │  ├─ api.mdc                  # Auto: api/**/*.ts
│  │  │  ├─ database.mdc             # Auto: db/**/*.ts
│  │  │  └─ services.mdc             # Auto: services/**
│  │  │
│  │  ├─ prompts/
│  │  │  ├─ bug-fix.mdc              # Manual invoke
│  │  │  ├─ refactor.mdc             # Manual invoke
│  │  │  ├─ feature.mdc              # Manual invoke
│  │  │  ├─ migration.mdc            # Agent requested
│  │  │  └─ optimization.mdc         # Agent requested
│  │  │
│  │  └─ templates/
│  │     ├─ service-template.ts
│  │     ├─ component-template.tsx
│  │     └─ api-template.ts
│  │
│  └─ AGENTS.md                       # Agent config
│
└─ .cursorrules                       # Legacy (optional)
```

---

## 🏆 KEY TAKEAWAYS (2025 Update)

### 1. **MDC is the new standard**

- Not plain text anymore
- Metadata-driven behavior
- More powerful scoping

### 2. **Multiple files > Single file**

- Better organization
- Clearer scoping
- Version control friendly
- Team collaboration easier

### 3. **Four rule types**

- Always Apply (global)
- Auto Attached (pattern-based)
- Agent Requested (smart)
- Manual (explicit)

### 4. **Directory structure matters**

```markdown
.cursor/rules/
├─ general.mdc          # Core
├─ domain/              # Scoped
└─ prompts/             # Templates
```

### 5. **Reference files with @**

```markdown
Follow this pattern:
@template.ts
@example-component.tsx
```

---

## 📚 OFFICIAL RESOURCES

- [**Cursor Docs**](https://docs.cursor.com/context/rules)
- [**Rules for AI**](https://docs.cursor.com/context/rules-for-ai)
- [**Community Rules**](https://cursor.directory/)
- [**Best Practices**](https://cursor101.com/cursor/rules)

---

**THIS STRUCTURE IS 100% ALIGNED WITH CURSOR OFFICIAL DOCUMENTATION (2025)**
**PRODUCTION-READY • ENTERPRISE-GRADE • FUTURE-PROOF**
