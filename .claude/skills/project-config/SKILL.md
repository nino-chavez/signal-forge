---
name: project-config
description: Auto-detects project characteristics and generates a configuration file that anchors subsequent content generation. Similar to CLAUDE.md generation but focused on content generation context.
---

# Project Configuration Generator

Automatically detect project characteristics and generate a configuration that provides context for all subsequent Signal Forge content generation.

## When to Use This Skill

- First time using Signal Forge on a project
- After major architectural changes
- When content consistently misses project context
- To establish consistent terminology for content

## Detection Protocol

### Step 1: Project Identity

Detect from configuration files:

| File | Extract |
|------|---------|
| `package.json` | name, description, version |
| `go.mod` | module name |
| `pyproject.toml` | project name, description |
| `Cargo.toml` | package name |
| `README.md` | First paragraph as description |

### Step 2: Tech Stack

| Category | Files to Check | Extract |
|----------|---------------|---------|
| **Runtime** | `package.json`, `go.mod`, `requirements.txt` | Language + version |
| **Framework** | `next.config.*`, `nuxt.config.*`, `django`, `fastapi` | Framework name |
| **Database** | `prisma/`, `docker-compose.yml`, migrations | DB type |
| **Infrastructure** | `terraform/`, `kubernetes/`, `docker-compose.yml` | Platform |
| **CI/CD** | `.github/workflows/`, `.gitlab-ci.yml` | CI platform |

### Step 3: Business Domain

Scan for domain indicators:
- Directory names suggesting domain (`payments/`, `orders/`, `users/`)
- README business context
- Entity/model names

### Step 4: Content Preferences

Check for existing patterns:
- Existing documentation style
- Presentation templates used
- Terminology in existing docs

---

## Output: signal-forge.config.md

Generate in project root:

```markdown
# Signal Forge Configuration

> Auto-generated project context for content generation
> Regenerate with: `signal-forge /project-config`

## Project Identity

**Name:** [Project name]
**Description:** [One-line description]
**Domain:** [Business domain - e.g., "e-commerce", "fintech", "developer tools"]

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Language | [Language] | [Version] |
| Framework | [Framework] | [Version] |
| Database | [Database] | - |
| Infrastructure | [Platform] | - |

## Architecture Summary

**Style:** [Monolith | Microservices | Modular Monolith]
**Primary Patterns:** [List key patterns]

## Key Components

| Component | Purpose | Content Relevance |
|-----------|---------|-------------------|
| [Name] | [What it does] | [When to mention in content] |

## Terminology

Use these terms consistently in generated content:

| Term | Definition | Don't Use |
|------|------------|-----------|
| [Preferred term] | [What it means] | [Alternatives to avoid] |

## Stakeholders

| Role | Typical Content | Voice Mode |
|------|-----------------|------------|
| Engineering | Architecture docs, specs | Solution Architecture |
| Product | Feature briefs, roadmaps | Executive Advisory |
| End Users | Guides, tutorials | Documentation |

## Content Defaults

**Company/Client Name:** [Name or "the organization"]
**Author Attribution:** [Author name for generated content]
**Branding Notes:** [Any brand considerations]

## Exclusions

Avoid mentioning in external content:
- [Internal tools/systems to keep private]
- [Confidential business information]

---

## Usage

This file is automatically read by Signal Forge before content generation.
Update manually if detection was incorrect or context changes.
```

---

## Integration

After generation:

1. Review the config for accuracy
2. Adjust terminology and stakeholders as needed
3. Signal Forge will use this context automatically
4. Regenerate after major project changes

The config provides:
- Consistent terminology across all generated content
- Appropriate tech references without manual prompting
- Stakeholder-aware content targeting
- Brand and confidentiality awareness
