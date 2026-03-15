# Architecture Decision Record Template

Use this template for documenting architectural decisions in Solution Architecture mode.

---

```markdown
# ADR-[NUMBER]: [TITLE]

**Date:** [YYYY-MM-DD]
**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]
**Deciders:** [List of people involved in decision]

## Context

[Describe the issue that motivates this decision. What is the problem we're facing? What are the forces at play? Include any relevant constraints (technical, business, organizational).]

## Decision

[State the decision clearly. Use active voice: "We will..." not "It was decided that..."]

**We will [decision].**

## Rationale

[Explain why this decision was made. What makes this the best choice among alternatives?]

### Key factors:
- [Factor 1]
- [Factor 2]
- [Factor 3]

## Alternatives Considered

### Alternative 1: [Name]

**Description:** [What this alternative is]
**Pros:**
- [Advantage]

**Cons:**
- [Disadvantage]

**Why rejected:** [Reason]

### Alternative 2: [Name]

[Same structure]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Neutral
- [Change that's neither good nor bad]

## Implementation

[Optional: Key implementation notes, timeline, or next steps]

### Action Items
- [ ] [Task 1]
- [ ] [Task 2]

## References

- [Link to related documentation]
- [Link to relevant discussion]
```

---

## ADR Writing Guidelines

### Title
- Use present tense verb: "Use PostgreSQL for user data"
- Be specific: Not "Choose a database" but "Use PostgreSQL for transactional data"

### Context
- State the problem, not the solution
- Include constraints that affect the decision
- Mention what triggered the need for a decision

### Decision
- One clear statement
- Use "We will..." not passive voice
- Specific enough to be actionable

### Alternatives
- Include at least 2 alternatives
- Be fair in pros/cons assessment
- Clearly state why each was rejected

### Consequences
- Be honest about trade-offs
- Include operational impact
- Note any follow-up decisions needed
