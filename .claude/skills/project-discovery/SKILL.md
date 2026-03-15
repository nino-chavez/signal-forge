---
name: project-discovery
description: Performs structured four-pass codebase discovery to understand project architecture, patterns, dependencies, and data flows before content generation. Use before solution-architecture or technical-specification content.
---

# Project Discovery Protocol

Analyze a codebase systematically to understand its architecture before generating technical content. This enables accurate, contextual content generation.

## When to Use This Skill

- Before generating solution architecture documents
- Before creating technical specifications
- When starting work on an unfamiliar codebase
- When content requires accurate technical context

## The Four-Pass Protocol

### Pass 1: Structural Discovery

Map the high-level structure:

```bash
tree -L 3 -I 'node_modules|vendor|.git|dist|build|__pycache__|.venv' --dirsfirst
```

**Identify:**
- **Entry points**: `main.*`, `index.*`, `app.*`, `server.*`
- **Core domains**: Business logic directories
- **Infrastructure**: Database, cache, queue adapters
- **API layer**: Controllers, routes, handlers
- **Shared utilities**: Common, utils, helpers, lib

**Output:** Component inventory with locations and purposes.

### Pass 2: Pattern Recognition

Analyze the codebase for architectural patterns:

| Pattern | Indicators |
|---------|-----------|
| **MVC** | `controllers/`, `models/`, `views/` separation |
| **Clean/Hexagonal** | `domain/`, `application/`, `infrastructure/`, `ports/`, `adapters/` |
| **CQRS** | Separate read/write models, `commands/`, `queries/` |
| **Event-Driven** | `events/`, `handlers/`, `subscribers/`, message queue integration |
| **Microservices** | Independent service directories with own configs |
| **Modular Monolith** | Feature folders with internal layering |
| **Repository Pattern** | `repositories/` or `*Repository.*` files |
| **Service Layer** | `services/` with business logic orchestration |

**Action:** Read 3-5 representative files to confirm patterns.

**Output:** Primary architectural pattern(s) with evidence.

### Pass 3: Dependency Mapping

Trace dependencies:

1. Read main entry point
2. Follow primary imports
3. Identify external service integrations (HTTP clients, SDKs)
4. Map database connections
5. Identify message queue/event bus usage

**Scan for:**
- `package.json` / `go.mod` / `requirements.txt` / `Cargo.toml`
- Docker compose services
- Environment variables referencing external systems
- SDK imports and configurations

**Output:** External dependency inventory with purposes.

### Pass 4: Data Flow Analysis

Trace one critical path (e.g., user creation, order placement):

1. API endpoint → Controller
2. Controller → Service/Use Case
3. Service → Repository/Database
4. Side effects (events, notifications, cache invalidation)

**Output:** Sequence of operations for critical business flow.

---

## Output Format

Generate a discovery report:

```markdown
# Project Discovery Report

**Project:** [Name from package.json/go.mod]
**Generated:** [Date]

## Structure Summary

**Type:** [Monolith | Microservices | Monorepo | Library]
**Primary Language:** [Language + version]
**Framework:** [Detected framework]

## Component Inventory

| Component | Location | Purpose |
|-----------|----------|---------|
| [Name] | `src/path/` | [Description] |

## Architectural Patterns

**Primary:** [Pattern name]
**Evidence:** [Files/structures that demonstrate this]

**Secondary Patterns:**
- [Pattern]: [Where used]

## External Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| [Name] | Database/API/Queue/etc | [What it does] |

## Critical Data Flow: [Flow Name]

```
[Step-by-step flow through the system]
```

## Context for Content Generation

[Summary paragraph that can be used as context for subsequent content generation]
```

---

## Integration with Content Generation

After running discovery, use the output as context for:

- **Solution Architecture**: Include component inventory and patterns
- **Technical Specification**: Reference data flows and dependencies
- **Architecture Decks**: Use diagrams derived from structure

Pass the discovery report as input context to subsequent content generation skills.
