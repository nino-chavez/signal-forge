# Executive Advisory Guide

## Purpose

This guide defines voice, structure, and quality standards for **Executive Advisory** content in Signal Forge. Use this when generating strategy decks, executive briefings, client presentations, and stakeholder alignment materials.

**Position in Taxonomy**: Executive Advisory sits between Thought Leadership (narrative, exploratory) and Solution Architecture (precise, technical). It combines confident recommendations with structured clarity.

**Perspective**: Examples in this guide use the `consultant` perspective ("I recommend", "your organization"). If your `perspective` is set to `internal`, adjust to "we recommend" / "our organization" framing. See the thought leadership voice guide for perspective details.

---

## Core Principles

### 1. Lead with Business Outcomes

Executives care about impact, not implementation. Start with what changes for the business.

```markdown
❌ "The system uses AWS Bedrock with agentic orchestration to route intent through semantic vector search."

✅ "This solution reduces 'I don't know' responses from LLMs by 60% within 90 days, directly improving brand visibility where purchase decisions are increasingly made."
```

### 2. Confident Recommendations

You're the advisor. Clients hire you for direction, not options without guidance.

```markdown
❌ "You might consider implementing semantic search, or alternatively you could explore keyword-based approaches."

✅ "I recommend semantic search using vector embeddings. Keyword search fails on the 40% of queries that don't match your exact terminology."
```

### 3. Pattern Recognition

Demonstrate experience across engagements. Show you've seen this before.

```markdown
❌ "This is a common challenge."

✅ "I've seen this tension across retail, manufacturing, and enterprise clients. The pattern: organizations optimize for the search they can measure while ignoring the AI-generated responses they can't."
```

### 4. Ground in Client Context

Reference actual conversations, stakeholder concerns, and specific situations.

```markdown
❌ "Stakeholders often express concerns about measurement."

✅ "Your VP of Engineering put it directly in the last review: 'We can't justify investment without before/after proof.' This architecture addresses that by pre-calculating weekly deltas."
```

### 5. Structured Clarity

Executives scan. Make it easy to extract key points.

```markdown
❌ [Wall of narrative text]

✅ **Recommendation**: Implement agentic RAG for AEO
   **Investment**: $X over 10 weeks
   **Expected Return**: 60% reduction in visibility gaps
   **Risk**: Dependent on Profound data coverage
```

---

## Voice Calibration

### What Executive Advisory IS

| Characteristic | Example |
|----------------|---------|
| **Consultant perspective** | "I recommend..." / "Based on what I've seen..." |
| **Outcome-focused** | "This improves X by Y%" |
| **Confident with caveats** | "This is the right approach, with one dependency to manage" |
| **Pattern-based** | "This pattern works across similar contexts" |
| **Action-oriented** | Clear next steps, owners, timelines |

### What Executive Advisory IS NOT

| Avoid | Why |
|-------|-----|
| Technical deep-dives | Save for architecture docs or appendices |
| Provisional hedging | "I think maybe..." undermines your value |
| Generic frameworks without application | Apply it to their context |
| Too much "we" | You're external; use "I recommend" + "your organization" |
| Storytelling without structure | Executives don't have time for narrative journeys |

---

## Narrative Frameworks

### Framework 1: Situation-Complication-Resolution (SCR)

Best for: Problem-focused presentations, diagnostic findings

```markdown
## SITUATION
[Neutral description of where the client is today]
"Your organization has invested significantly in SEO and paid search optimization over the past decade, achieving strong visibility in traditional search engines."

## COMPLICATION
[The tension, challenge, or change that creates urgency]
"However, 40% of product research now happens through AI assistants. When a consumer asks ChatGPT 'What's the best wireless speaker under $200?', your brand doesn't appear—even when you rank #1 on Google for that query."

## RESOLUTION
[Your recommended path forward]
"I recommend implementing an AEO (Answer Engine Optimization) capability that monitors your visibility in AI responses and systematically addresses gaps. This architecture makes that possible."
```

### Framework 2: Before-After-Breakthrough

Best for: Transformation initiatives, capability building

```markdown
## BEFORE (Current State)
- No visibility into AI-generated responses
- Content optimized for keywords, not semantic understanding
- Measurement limited to traditional search metrics

## AFTER (Future State)
- Real-time monitoring of brand mentions in LLM responses
- Content optimized for how AI systems understand your products
- Before/after measurement proving optimization ROI

## BREAKTHROUGH (How We Get There)
- Phase 1: Establish data foundation with Profound integration
- Phase 2: Build agentic analysis and optimization tools
- Phase 3: Implement measurement loop for continuous improvement
```

### Framework 3: The Recommendation Stack

Best for: Decision documents, investment cases

```markdown
## THE RECOMMENDATION
[Clear, unambiguous statement of what you're recommending]

## WHY NOW
[Urgency drivers, market timing, competitive pressure]

## WHAT IT TAKES
[Investment, timeline, resources, dependencies]

## WHAT YOU GET
[Outcomes, metrics, business value]

## WHAT COULD GO WRONG
[Risks with mitigations—show you've thought it through]

## NEXT STEPS
[Immediate actions with owners]
```

---

## Document Structures

### Strategy Deck Structure

| Slide | Content | Time |
|-------|---------|------|
| 1 | Title + Problem Statement | 30 sec |
| 2 | Market Context / Why Now | 1 min |
| 3 | Current State Assessment | 1 min |
| 4 | Recommendation Overview | 1 min |
| 5-7 | Solution Details (visual-heavy) | 3 min |
| 8 | Investment & Timeline | 1 min |
| 9 | Expected Outcomes | 1 min |
| 10 | Risks & Mitigations | 1 min |
| 11 | Next Steps | 30 sec |
| 12 | Discussion | Open |

**Total: ~12 slides, 10-15 minutes of content**

### Executive Brief Structure (1-3 pages)

```markdown
# [Title]: Executive Brief

## Summary (1 paragraph)
[Problem + Recommendation + Expected outcome in 3-4 sentences]

## Context
[Why this matters now—market forces, competitive pressure, client-specific drivers]

## Recommendation
[Clear statement of what you're recommending]

### Key Components
- [Component 1]: [One line description]
- [Component 2]: [One line description]
- [Component 3]: [One line description]

## Investment & Timeline
| Phase | Duration | Investment | Outcome |
|-------|----------|------------|---------|
| 1 | X weeks | $X | [Deliverable] |
| 2 | X weeks | $X | [Deliverable] |

## Expected Outcomes
- [Metric 1]: [Target]
- [Metric 2]: [Target]
- [Metric 3]: [Target]

## Risks & Mitigations
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| [Risk] | [H/M/L] | [How we address it] |

## Next Steps
1. [Action] — [Owner] — [Date]
2. [Action] — [Owner] — [Date]
```

### Roadmap Document Structure

```markdown
# [Initiative]: Strategic Roadmap

## Vision
[Where we're headed in 2-3 sentences]

## Current State
[Where we are today—honest assessment]

## Phase Overview

### Phase 1: [Name] (Weeks X-Y)
**Objective**: [What we're trying to achieve]
**Key Activities**:
- [Activity 1]
- [Activity 2]
**Success Criteria**: [How we know we're done]
**Dependencies**: [What needs to be true]

### Phase 2: [Name] (Weeks X-Y)
[Same structure]

## Resource Requirements
| Role | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| [Role] | X FTE | X FTE | X FTE |

## Decision Points
| Date | Decision | Options | Recommendation |
|------|----------|---------|----------------|
| [Date] | [Decision needed] | [A, B, C] | [Your recommendation] |

## Success Metrics
| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| [Metric] | [Current] | [Goal] | [When] |
```

---

## Client Reference Patterns

### Natural Consultant Voice

**DO**:
- "For your organization..." / "In your context..."
- "I recommend..." / "Based on what I've seen..."
- "You" / "your team" / "your org"
- Client name only when necessary for clarity

**DON'T**:
- Repeated client name when "you" works better
- "We recommend" (implies internal team)
- "The organization should" (too distant)
- "[Client] must implement" (too formal)

### Grounding in Actual Context

Reference real conversations and stakeholders:

```markdown
✅ "Your CMO raised this in our last session: 'We're optimizing for metrics we can see while ignoring the channel we can't measure.' This architecture gives you that measurement."

✅ "The concern Ram expressed—'How do we know it worked?'—is addressed by the pre-calculated reporting layer."

✅ "Your team mentioned integration with the existing CMS is critical. The architecture supports both push (API) and pull (export) patterns."
```

---

## Technical Content in Executive Documents

### When to Include Technical Detail

| Include | Exclude |
|---------|---------|
| High-level architecture diagram | Component specifications |
| Technology choices with business rationale | Implementation details |
| Data flow at conceptual level | API contracts |
| Security approach summary | Security configuration |
| Integration touchpoints | Integration specifications |

### How to Present Technical Content

**Visual First**: Always lead with a diagram, not prose.

**Business Lens**: Explain technology in terms of what it enables.

```markdown
❌ "OpenSearch provides kNN vector search with HNSW algorithm."

✅ "The system can find relevant content even when customers use different words than your product descriptions—'eco-friendly' matches your 'sustainable' products automatically."
```

**Appendix Strategy**: Put technical detail in appendices for interested stakeholders.

---

## Quality Checklist

### Structure
- [ ] Clear recommendation stated in first page/slide
- [ ] SCR, Before-After-Breakthrough, or Recommendation Stack framework used
- [ ] Scannable with clear headers and bullets
- [ ] Investment and timeline clearly stated
- [ ] Next steps with owners and dates

### Voice
- [ ] Consultant perspective ("I recommend")
- [ ] Confident without arrogant
- [ ] Pattern recognition demonstrated
- [ ] Grounded in client context (references to actual conversations)
- [ ] Outcome-focused language

### Content
- [ ] Business value leads, technical detail follows
- [ ] Risks acknowledged with mitigations
- [ ] Appropriate level of detail for audience
- [ ] Diagrams and visuals where appropriate
- [ ] No jargon without explanation

### Client Alignment
- [ ] Addresses known stakeholder concerns
- [ ] References actual discussions where relevant
- [ ] Realistic about constraints and dependencies
- [ ] Clear on what success looks like

---

## Comparison: Three Modes

| Aspect | Thought Leadership | Executive Advisory | Solution Architecture |
|--------|-------------------|-------------------|----------------------|
| **Opening** | Question/tension | Problem + recommendation | Executive summary |
| **Voice** | Exploratory, provisional | Confident, directive | Precise, definitive |
| **Structure** | Narrative arc | Scannable sections | Formal templates |
| **Detail level** | Conceptual | Strategic | Technical |
| **Hedging** | Encouraged | Minimal | None |
| **Diagrams** | Optional | Supporting | Primary |
| **Length** | Variable | Constrained | Comprehensive |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-11-25 | Initial guide based on content taxonomy analysis |
