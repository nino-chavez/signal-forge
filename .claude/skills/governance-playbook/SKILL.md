---
name: governance-playbook
description: Generate multi-volume governance playbooks with client-agnostic content, quality rubric validation, and consistent terminology. Use when asked to create frameworks, methodology playbooks, comprehensive governance documentation, or multi-chapter reference guides with appendices and cross-references.
---

# Governance Playbook Generator

Generate comprehensive, client-agnostic playbooks for governance frameworks, methodologies, and operational guidance.

## When to Use This Skill

- Creating enterprise governance frameworks
- Building methodology playbooks for consulting practices
- Generating reusable reference documentation
- Developing multi-volume training or operational guides

## Key Characteristics

| Attribute | Requirement |
|-----------|-------------|
| Client-Agnostic | No client-specific names in core content |
| Tech-Agnostic | Generic patterns in methodology; specific options in appendices |
| Actionable | Checklists, templates, decision trees throughout |
| Self-Validating | Content scored against quality rubric |

## Required References

**MANDATORY - Read these files completely before generating content:**

1. `references/style-guide.json` - Terminology, tone, formatting rules
2. `references/quality-rubric.json` - Scoring criteria, validation checks

## Document Structure

### Standard Volume Organization

```
Volume 1: Strategic Framework
├── Chapter 1: The Imperative (why this matters)
├── Chapter 2: Strategic Work Tracks (what to do)
└── Chapter 3: Maturity Model (how to measure progress)

Volume 2: Methodology Playbooks
├── Chapter 4: Discovery & Assessment
├── Chapter 5: [Domain-specific methodology]
├── Chapter 6: [Domain-specific methodology]
├── Chapter 7: Measurement & Optimization
└── Chapter 8: Governance Operations

Volume 3: Delivery Execution
├── Chapter 9: Engagement Models
├── Chapter 10: Team & Staffing
└── Chapter 11: Risk & Dependencies

Volume 4: Reference Appendices
├── Appendix A: Technology Reference Architectures
├── Appendix B: Platform Options Comparison
├── Appendix C: Industry Templates
└── Appendix D: Worksheets & Templates
```

### Chapter Structure

Each chapter MUST include:

1. **TL;DR Box** - 2-4 bullet key takeaways
2. **Introduction** - Context and why it matters
3. **Core Content** - Main sections with subsections
4. **Practical Application** - How to use this
5. **Common Pitfalls** - What to avoid
6. **Next Steps** - Where to go from here
7. **Related Chapters** - Cross-references

## Terminology Standards

### Preferred Terms

| Term | Definition | Avoid |
|------|------------|-------|
| `{{client.name}}` | Variable for client name | Hardcoded client names |
| `{{tech.platform}}` | Variable for technology | Hardcoded product names |
| the client's primary domain | Generic reference | Specific URLs |
| the selected LLM platform | Generic reference | AWS Bedrock, Azure OpenAI |
| the AEO measurement platform | Generic reference | Profound, Authoritas |

### Variable Substitution

Use mustache-style variables for client customization:

```markdown
For {{client.name}}, implementation on {{client.domain}}
should begin with {{tech.platform}} integration.
```

## Tone Guidelines

**Primary tone: authoritative-practical**

| Attribute | Good Example | Bad Example |
|-----------|--------------|-------------|
| Confident | "Use a minimum of 400 prompts" | "You might want to consider around 400" |
| Actionable | "Step 1: Export your catalog" | "It's important to understand your catalog" |
| Direct | "GEO requires three capabilities" | "When thinking about GEO, there are many factors..." |
| Practical | "Expect 15-25% improvement in 90 days" | "Improvements can vary based on factors" |

**Avoid:**
- Marketing hyperbole ("revolutionary", "game-changing")
- Excessive hedging ("might", "could potentially")
- Passive voice where active is clearer
- Unexplained acronyms

## Formatting Rules

### Headings
- H1: Volume titles only
- H2: Chapter titles
- H3: Major sections
- H4: Subsections
- Style: Sentence case
- Numbering: Hierarchical (1.1, 1.2)

### Lists
- Bulleted: Unordered items
- Numbered: Sequential steps
- Maximum 2 levels of nesting
- Parallel grammatical structure

### Callouts

```markdown
> **TL;DR**
> - Key point 1
> - Key point 2

> **Warning**: Anti-pattern to avoid

> **Tip**: Best practice recommendation
```

## Quality Validation

### Automated Checks

| Check | Threshold |
|-------|-----------|
| Chapter word count | Minimum 2,000 words |
| Section word count | Minimum 500 words |
| Variable resolution | No unresolved `{{variables}}` |
| Internal links | All cross-references valid |

### Quality Dimensions

Score each chapter against these dimensions (from `quality-rubric.json`):

1. **Completeness** (20%) - All sections present and thorough
2. **Accuracy** (20%) - Factually correct, no hallucination
3. **Clarity** (20%) - Clear, organized, accessible
4. **Actionability** (20%) - Checklists, templates, next steps
5. **Visual Quality** (10%) - Diagrams, tables where appropriate
6. **Consistency** (10%) - Uniform terminology, tone, formatting

**Pass threshold: 85% overall, 75% per dimension**

## Workflow

1. **Plan structure** - Define volumes, chapters, sections
2. **Generate content** - Follow chapter structure template
3. **Validate terminology** - Check against style guide
4. **Score quality** - Evaluate against rubric
5. **Iterate** - Fix issues until passing threshold
6. **Compile** - Assemble into final output format

## Output Formats

| Format | Features |
|--------|----------|
| HTML | Interactive, searchable, collapsible sections |
| PDF | Print-ready with TOC, page numbers |
| Markdown | Source format for version control |

## Examples

See `projects/geo-playbook/` for a complete 4-volume playbook implementation.
