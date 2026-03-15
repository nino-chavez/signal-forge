# Phase 2: Workflow Engineering

## Designing Processes That AI Can Execute

---

## Phase Overview

### WHY This Phase Matters

AI can't "do marketing." It can't "handle customer service." It can't "manage the supply chain."

But it *can*:
- Draft 50 personalized emails from a template
- Categorize 1,000 support tickets by urgency
- Flag inventory items below reorder threshold

**The gap between "do marketing" and "draft 50 emails" is workflow engineering.** This is your version of coding — and it happens on whiteboards, not in IDEs.

**What goes wrong without workflow engineering:**
- Vague AI projects that produce vague results
- Automation that breaks because edge cases weren't considered
- AI that "doesn't work" because tasks were poorly defined
- Expensive engineers rebuilding processes that should have been designed correctly upfront

**What workflow engineering unlocks:**
- Clear requirements that engineers can implement
- Automation that actually works in production
- The ability to evaluate AI tools ("can it do steps 3-7 of our process?")
- Career positioning as the person who bridges business and technology

### WHAT You'll Learn

| Module | Core Question | Key Outcome |
|--------|--------------|-------------|
| 2.1 Decomposition | "How do I break this into AI tasks?" | Convert business goals into atomic steps |
| 2.2 Role-Based Workflows | "Who (or what) does each part?" | Design handoffs and specialization |
| 2.3 Human-in-the-Loop | "Where do humans add value?" | Balance automation with judgment |
| 2.4 Quality and Iteration | "How do I ensure quality?" | Build feedback loops and guardrails |

### HOW You'll Demonstrate Mastery

**Deliverable**: A **Workflow Design Document** — a complete specification for automating a real business process, including current state, future state, role definitions, and handoff criteria.

---

# Module 2.1: Decomposition

## WHY: The Business Problem

"Use AI to improve our customer experience" is not a task. It's a wish. AI can't execute wishes — it executes specific, bounded operations.

Your superpower as a business professional is translating wishes into executable tasks.

### The Real-World Stakes

**The wish**: "Automate our content marketing"

**Naive interpretation**: One AI that "does content marketing"
**Result**: Disappointment, wasted budget, "AI doesn't work for us"

**Decomposed interpretation**:
1. Research trending topics in our industry (Perplexity)
2. Generate 10 headline options per topic (GPT-4)
3. Human selects best 3 headlines
4. Draft 800-word articles for selected headlines (Claude)
5. Human reviews and edits
6. Generate social media snippets from articles (GPT-3.5)
7. Human approves and schedules

**Result**: Clear implementation path, measurable outcomes, appropriate tool selection

---

## WHAT: Core Concepts

### The Decomposition Hierarchy

```
Business Goal (vague)
    ↓
Process (still broad)
    ↓
Tasks (specific but complex)
    ↓
Atomic Operations (AI-executable)
```

**Example**:

| Level | Example |
|-------|---------|
| Business Goal | "Improve customer retention" |
| Process | "Proactive outreach to at-risk customers" |
| Task | "Identify and contact customers showing churn signals" |
| Atomic Operations | 1. Query database for customers with declining engagement<br>2. Score each customer's churn probability<br>3. Generate personalized email for each high-risk customer<br>4. Human reviews emails before sending<br>5. Send approved emails<br>6. Track open/response rates |

### The "Robot Intern" Test

> If you can write instructions clear enough that a literal-minded new intern could follow them without asking clarifying questions, you can "program" an AI.

**Test your decomposition**:
- Is each step unambiguous?
- Are inputs and outputs clearly defined?
- Are decision criteria explicit (not "use judgment")?
- Could someone unfamiliar with the context execute this?

### Signal Forge Example: Content Mode Decomposition

Signal Forge doesn't just "generate content." It recognizes four distinct content modes, each with different decomposition:

**Thought Leadership Mode**:
```
Input: Topic + Key Points
    ↓
Ghost Writer: Generate exploratory draft (creative, high variance)
    ↓
Copywriter: Refine prose, maintain voice (balanced)
    ↓
Editor: Validate against voice guide, score quality
    ↓
Output: Polished article
```

**Solution Architecture Mode**:
```
Input: Technical Requirements
    ↓
Architect: Generate technical specification (precise, definitive)
    ↓
Tech Reviewer: Verify technical accuracy
    ↓
Editor: Check completeness, formatting
    ↓
Output: Implementation-ready spec
```

**Why different decompositions?** The atomic operations differ:
- Thought leadership needs creative exploration, then refinement
- Architecture needs precision from the start, then validation

### The Input-Output Contract

Every atomic operation has:

| Element | Definition | Example |
|---------|------------|---------|
| **Input** | What the operation receives | "Customer record with purchase history" |
| **Processing** | What happens to the input | "Calculate recency, frequency, monetary scores" |
| **Output** | What the operation produces | "RFM segment label (Champion/At Risk/Lost)" |
| **Success Criteria** | How to know it worked | "Every customer has exactly one segment label" |

---

## HOW: Practical Application

### Exercise: The Decomposition Challenge

**Scenario**: A student organization wants to "improve event attendance."

**Task**: Decompose this into AI-executable atomic operations.

**Step 1 — Define the process**:
- Current: Send one mass email announcement
- Improved: Personalized, multi-touch outreach campaign

**Step 2 — List the tasks**:
1. Analyze past event attendance data
2. Segment members by engagement level
3. Create personalized messaging per segment
4. Send targeted invitations
5. Follow up with non-responders
6. Post-event feedback collection

**Step 3 — Decompose to atomic operations**:

| Task | Atomic Operations |
|------|-------------------|
| Analyze attendance | • Import attendance spreadsheet<br>• Calculate attendance rate per member<br>• Identify patterns (event type, day of week, etc.) |
| Segment members | • Define segment criteria (high/medium/low engagement)<br>• Assign each member to a segment<br>• Output: member list with segment labels |
| Create messaging | • Draft email template per segment<br>• Generate 3 subject line options per segment<br>• Human selects best subject lines |
| Send invitations | • Merge member data with templates<br>• Schedule sends (staggered by segment)<br>• Log sent status |
| Follow up | • Query members who didn't open/respond<br>• Generate follow-up message<br>• Human approves before sending |
| Collect feedback | • Generate survey questions<br>• Send to attendees 24h after event<br>• Summarize responses |

**Deliverable**: A decomposition diagram showing the flow from goal → process → tasks → atomic operations.

---

## Key Takeaways

1. **AI executes operations, not goals** — your job is translation
2. **The Robot Intern Test validates clarity** — if an intern needs to ask questions, refine further
3. **Input-output contracts define interfaces** — be explicit about what goes in and comes out
4. **Different goals need different decompositions** — don't force one pattern onto everything

---

# Module 2.2: Role-Based Workflows

## WHY: The Business Problem

Trying to do everything in one step produces mediocre results. A single prompt that tries to research, write, edit, and format produces worse output than specialized steps.

This mirrors how human organizations work: specialists focus on what they do best, then hand off to the next specialist.

### The Real-World Stakes

**Single-prompt approach**:
> "Write a marketing email that's engaging, on-brand, factually accurate, properly formatted, and optimized for mobile."

**Result**: Mediocre on all dimensions. The AI tries to satisfy every constraint simultaneously and optimizes for none.

**Role-based approach**:
1. **Researcher**: Gather relevant facts and data points
2. **Copywriter**: Write engaging, persuasive content
3. **Brand Voice Editor**: Ensure tone matches brand guidelines
4. **Formatter**: Optimize for email rendering and mobile

**Result**: Each role excels at its specialty. Final output is excellent across all dimensions.

---

## WHAT: Core Concepts

### Why Specialization Works

| Factor | Generalist Prompt | Specialized Roles |
|--------|------------------|-------------------|
| **Temperature** | Must compromise | Each role uses optimal setting |
| **Instructions** | Long, conflicting | Short, focused |
| **Evaluation** | Hard to assess | Clear success criteria per role |
| **Iteration** | Redo everything | Fix only what's broken |

### Signal Forge's Role System

Signal Forge implements four primary roles in `roles/`:

**Ghost Writer** (`ghost-writer.ts`):
- **Purpose**: Generate initial creative content
- **Temperature**: 0.8 (high — encourages exploration)
- **Optimizes for**: Ideas, coverage, raw material
- **Doesn't worry about**: Polish, formatting, strict voice adherence

**Copywriter** (`copywriter.ts`):
- **Purpose**: Refine and polish content
- **Temperature**: 0.6 (balanced)
- **Optimizes for**: Flow, clarity, persuasion
- **Input**: Ghost Writer's draft
- **Output**: Publication-ready prose

**Editor** (`editor.ts`):
- **Purpose**: Validate quality and voice compliance
- **Temperature**: 0.4 (low — consistency matters)
- **Optimizes for**: Standards adherence, quality scoring
- **Input**: Copywriter's refined content
- **Output**: Score (0-10) + specific feedback

**Documentation Writer** (`documentation-writer.ts`):
- **Purpose**: Create instructional content
- **Temperature**: 0.5 (precise but readable)
- **Optimizes for**: Clarity, step-by-step structure, accuracy
- **Different from Copywriter**: No persuasion, all instruction

### The Handoff Pattern

```
Role A                    Role B                    Role C
  │                         │                         │
  ▼                         ▼                         ▼
[Generate]──────────────→[Refine]───────────────→[Validate]
  │                         │                         │
  │ Output:                 │ Output:                 │ Output:
  │ Raw draft               │ Polished draft          │ Score + Feedback
  │                         │                         │
  │ Success:                │ Success:                │ Success:
  │ Coverage > 90%          │ Readability > 70        │ Voice score > 7
```

**Critical**: Each handoff includes explicit artifacts. Role B shouldn't need to ask Role A clarifying questions.

### Quality Gates

A quality gate is a checkpoint that content must pass before proceeding:

```
[Draft] → Quality Gate: "Is coverage complete?"
              │
              ├── Yes → [Refinement]
              │
              └── No → Return to [Draft] with feedback
```

Signal Forge's Editor role functions as a quality gate:
- Scores content against voice guidelines
- If score < 7.0, triggers revision loop
- If score ≥ 7.0, content proceeds to export

---

## HOW: Practical Application

### Exercise: Design a Role-Based Workflow

**Scenario**: You're designing a workflow to generate weekly competitive intelligence reports.

**Requirements**:
- Monitor 5 competitors' websites and press releases
- Summarize key developments
- Assess strategic implications
- Format for executive consumption

**Task**: Define the roles and handoffs.

**Example Solution**:

| Role | Responsibility | Input | Output | Success Criteria |
|------|---------------|-------|--------|------------------|
| **Researcher** | Gather raw information | List of competitor URLs | Structured data: company, date, development, source | All 5 competitors covered |
| **Analyst** | Assess implications | Research data | Analysis: what it means, how it affects us | Each development has "so what" |
| **Synthesizer** | Find patterns | Individual analyses | Cross-competitor themes | 3-5 themes identified |
| **Writer** | Create executive summary | Themes + analyses | Formatted report | Under 2 pages, scannable |
| **Editor** | Quality check | Draft report | Approved report or feedback | Factual accuracy, completeness |

**Workflow Diagram**:
```
[Researcher] → [Analyst] → [Synthesizer] → [Writer] → [Editor]
     ↓              ↓            ↓             ↓          ↓
 Raw data      Implications   Themes      Draft      Final/Feedback
                                                          │
                                                          ↓
                                              If rejected, return to Writer
```

### Exercise: Map an Existing Workflow

**Task**: Take a process you've observed (internship, part-time job, student org) and map it as a role-based workflow.

**Template**:
```markdown
## Workflow: [Name]

### Current State
[How it works today, typically with humans doing everything]

### Proposed Role-Based Design

| Role | Human or AI? | Responsibility | Handoff To |
|------|--------------|----------------|------------|
| ... | ... | ... | ... |

### Quality Gates
- Gate 1: [Criteria]
- Gate 2: [Criteria]

### Why This Works Better
[Explanation of benefits]
```

---

## Key Takeaways

1. **Specialization beats generalization** — don't ask one prompt to do everything
2. **Handoffs must be explicit** — define exactly what passes between roles
3. **Quality gates prevent garbage propagation** — catch problems early
4. **Temperature matters** — creative roles need variance; validation roles need consistency

---

# Module 2.3: Human-in-the-Loop Design

## WHY: The Business Problem

Full automation sounds appealing, but it's often wrong:
- **Risk**: AI mistakes reach customers unchecked
- **Quality**: AI can't match human judgment on nuanced decisions
- **Learning**: Without human review, you don't know what AI gets wrong
- **Compliance**: Many processes legally require human oversight

The goal isn't "remove all humans." It's "put humans where they add value."

### The Real-World Stakes

**Full automation scenario**:
AI drafts customer response → AI sends customer response
**Risk**: One hallucinated policy (e.g., "We offer lifetime refunds") becomes company liability.

**Human-in-the-loop scenario**:
AI drafts customer response → Human reviews → Human sends
**Result**: AI does 90% of the work; human catches the 10% that would cause problems.

---

## WHAT: Core Concepts

### The 80/20 Split

Most processes follow a pattern:
- **80% of the work** is routine, predictable, and low-risk
- **20% of the work** requires judgment, handles exceptions, or carries risk

**Design principle**: Automate the 80%, keep humans for the 20%.

### Types of Human Involvement

| Type | Description | Example | When to Use |
|------|-------------|---------|-------------|
| **Human-in-the-Loop** | Human reviews every output | Approve each email before sending | High-risk, low-volume |
| **Human-on-the-Loop** | Human monitors but doesn't review all | Spot-check 10% of outputs | Medium-risk, medium-volume |
| **Human-out-of-Loop** | No human review | Automated password reset emails | Low-risk, high-volume |

### Designing Approval Gates

An approval gate specifies:
- **What** requires approval (criteria)
- **Who** approves (role/authority)
- **How** approval happens (mechanism)
- **What if** approval is denied (feedback path)

**Example**:
```
Criteria: Any customer refund > $100
Approver: Team Lead
Mechanism: Slack notification with approve/deny buttons
If denied: Return to support agent with reason
```

### Signal Forge Example: Editor as Human Proxy

In Signal Forge, the Editor role functions as a quality gate that simulates human judgment:

```typescript
// editor.ts (conceptual)
async review(content: string): Promise<{score: number, feedback: string}> {
  // Evaluates against voice guidelines
  // Returns score 0-10 and specific feedback

  if (score < THRESHOLD) {
    return { approved: false, feedback: "..." }
  }
  return { approved: true }
}
```

**In production use**, this could trigger actual human review:
- Score < 5: Require human rewrite
- Score 5-7: Human spot-check recommended
- Score > 7: Auto-approve for publication

### Escalation Paths

Not all exceptions are equal. Design tiered escalation:

```
Level 0: AI handles autonomously
    ↓
Level 1: AI flags for human review
    ↓
Level 2: AI escalates to specialist
    ↓
Level 3: AI escalates to manager
```

**Example — Customer Support**:

| Scenario | Level | Action |
|----------|-------|--------|
| Simple FAQ | 0 | AI responds directly |
| Refund request < $50 | 1 | AI drafts, agent approves |
| Angry customer | 2 | AI drafts, senior agent reviews |
| Legal threat | 3 | Immediate escalation to legal |

---

## HOW: Practical Application

### Exercise: Design Approval Gates

**Scenario**: You're designing an AI system that drafts personalized pricing proposals for sales team.

**Task**: Define the approval gates.

**Considerations**:
- Proposals go directly to customers
- Incorrect pricing could lose money or customers
- Sales reps have different authority levels
- Enterprise deals are higher stakes

**Example Solution**:

| Proposal Type | AI Autonomy | Approval Required |
|---------------|-------------|-------------------|
| Standard pricing, existing product | AI generates final | None (auto-send) |
| Standard pricing, custom configuration | AI generates draft | Sales rep reviews |
| Discount < 10% | AI proposes discount | Sales rep approves |
| Discount 10-25% | AI proposes discount | Manager approves |
| Discount > 25% or enterprise deal | AI assists drafting | VP approval + legal review |

**Escalation Triggers**:
- Customer mentions competitor pricing → Flag for competitive analysis team
- Customer mentions legal/compliance concerns → Escalate to legal
- Deal value > $500K → Automatic VP notification

### Exercise: Calculate Human Involvement ROI

**Scenario**: Processing 1,000 customer inquiries per day.

**Current state**: Humans handle all 1,000 (8 hours × 5 agents)
**Proposed state**: AI handles 800 autonomously, humans review 200

**Calculate**:
- Human time saved: (800 / 1000) × 40 hours = 32 hours/day
- Human time for review: 200 inquiries × 1 min each = 3.3 hours/day
- Net savings: 32 - 3.3 = 28.7 hours/day
- Agent reduction: From 5 to ~1.5 agents (or redeployment to higher-value work)

**But also consider**:
- What's the cost of an AI mistake that reaches a customer?
- How often does AI make mistakes? (Error rate)
- What's the cost of the review process itself?

---

## Key Takeaways

1. **The goal isn't zero humans — it's optimal humans** — put judgment where it matters
2. **The 80/20 split is your design principle** — automate routine, keep humans for exceptions
3. **Approval gates must be specific** — who, what, how, and what-if
4. **Escalation paths handle complexity** — not all exceptions need the same response

---

# Module 2.4: Quality and Iteration

## WHY: The Business Problem

AI output varies. Even with identical prompts, you get different results. Even good prompts produce occasional garbage.

Without quality systems, you're gambling. With quality systems, you're operating.

### The Real-World Stakes

**Without quality systems**:
- Publish AI content with factual errors
- Send AI emails with wrong customer names
- Release AI code with bugs
- "AI doesn't work" reputation builds

**With quality systems**:
- Errors caught before publication
- Consistent quality bar maintained
- Clear improvement tracking
- "AI works when we use it right" reputation

---

## WHAT: Core Concepts

### Quality Scoring

Transform subjective "is this good?" into measurable scores:

| Dimension | Score Range | Example Criteria |
|-----------|-------------|------------------|
| **Completeness** | 0-10 | Does it cover all required points? |
| **Accuracy** | 0-10 | Are facts verifiable and correct? |
| **Voice Compliance** | 0-10 | Does it match brand guidelines? |
| **Actionability** | 0-10 | Can the reader act on this? |

**Composite score**: Weight dimensions by importance.

### Signal Forge Example: Voice Scoring

Signal Forge's `voice/` directory implements quantified quality assessment:

```typescript
// voice-checker-v2.ts (conceptual)
interface VoiceScore {
  overall: number;          // 0-10
  dimensions: {
    tone: number;           // Matches brand voice?
    structure: number;      // Follows format guidelines?
    clarity: number;        // Easy to understand?
    engagement: number;     // Compelling to read?
  };
  violations: string[];     // Specific issues found
  suggestions: string[];    // How to improve
}
```

**Why quantify?**
- Sets clear thresholds: "We don't publish under 7.0"
- Enables tracking: "Our average voice score improved from 6.2 to 7.8"
- Guides revision: "Focus on tone and clarity"

### Iteration Loops

When quality isn't met, iterate:

```
Generate → Score → Threshold Check
                        │
                        ├── Pass (≥7.0) → Approve
                        │
                        └── Fail (<7.0) → Revise with Feedback → Re-Score
                                              │
                                              └── (Max 3-5 iterations, then human review)
```

### Signal Forge Example: Iteration Controller

From `agents/iteration-controller.ts`:

```typescript
// Conceptual representation
async iterate(content: string): Promise<string> {
  let currentScore = 0;
  let iterations = 0;
  let bestVersion = content;
  let bestScore = 0;

  while (currentScore < THRESHOLD && iterations < MAX_ITERATIONS) {
    const result = await this.editor.review(content);
    currentScore = result.score;

    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestVersion = content;
    }

    if (currentScore < THRESHOLD) {
      content = await this.revise(content, result.feedback);
    }

    iterations++;
  }

  return bestVersion; // Return best version even if threshold not met
}
```

**Key design decisions**:
- **Maximum iterations**: Prevent infinite loops
- **Track best version**: Don't lose good work to bad revisions
- **Diminishing returns detection**: Stop if improvement < 0.5 per iteration

### Guardrails

Guardrails are hard limits that can't be overridden:

| Type | Example | Implementation |
|------|---------|----------------|
| **Content guardrails** | No competitor mentions | Post-processing filter |
| **Format guardrails** | Response under 500 words | Truncate or regenerate |
| **Factual guardrails** | No invented statistics | Citation requirement |
| **Safety guardrails** | No harmful content | Content filtering API |

---

## HOW: Practical Application

### Exercise: Design a Quality System

**Scenario**: AI drafts weekly newsletter for company employees.

**Task**: Define the quality scoring system.

**Example Solution**:

| Dimension | Weight | Criteria | Scoring |
|-----------|--------|----------|---------|
| **Relevance** | 30% | Content relates to company/industry | 0-10: How many items are relevant? |
| **Accuracy** | 25% | Facts are verifiable | 0-10: % with valid sources |
| **Engagement** | 20% | Writing is interesting | 0-10: Subjective assessment |
| **Brand Voice** | 15% | Matches company tone | 0-10: Per voice guide checklist |
| **Formatting** | 10% | Correct structure, length | 0-10: Passes format validation |

**Thresholds**:
- Score ≥ 8.0: Auto-publish
- Score 6.0-7.9: Editor review required
- Score < 6.0: Regenerate with feedback

**Guardrails**:
- No discussion of unannounced products
- No individual employee callouts without approval
- Maximum 800 words
- Must include at least one company update

### Exercise: Build Iteration Logic

**Task**: Design the iteration loop for the newsletter system.

```markdown
## Newsletter Quality Iteration

### Iteration 1: Initial Generation
- Generate newsletter draft
- Score against all dimensions
- If score < 6.0: Flag top 2 failing dimensions

### Iteration 2: Targeted Revision
- Regenerate with specific feedback on failing dimensions
- Re-score
- If score < 6.0 and no improvement: Escalate to human

### Iteration 3: Human-Assisted (if needed)
- Human reviews failing dimensions
- Human provides specific edits or guidance
- AI incorporates feedback
- Final score logged for process improvement

### Maximum Path
- Best case: 1 generation, auto-publish (score ≥ 8.0)
- Typical: 2 generations, editor review
- Worst case: 3 generations + human intervention
```

---

## Key Takeaways

1. **Quantify quality** — subjective assessments don't scale
2. **Set thresholds** — define what "good enough" means before starting
3. **Iterate with feedback** — don't just regenerate; explain what to fix
4. **Guardrails prevent disasters** — some rules can't be negotiated

---

# Phase 2 Summary

## What You've Learned

| Module | Core Concept | Business Application |
|--------|--------------|---------------------|
| 2.1 Decomposition | Break goals into atomic operations | Translate business wishes into AI tasks |
| 2.2 Role-Based Workflows | Specialization and handoffs | Design efficient multi-step processes |
| 2.3 Human-in-the-Loop | Optimal human placement | Balance automation with judgment |
| 2.4 Quality and Iteration | Scoring and feedback loops | Ensure consistent output quality |

## Phase 2 Deliverable: Workflow Design Document

Create a complete workflow specification for a real business process:

### Requirements

1. **Current State Analysis**
   - Document existing process (who does what, in what order)
   - Identify pain points and inefficiencies
   - Quantify current time/cost

2. **Future State Design**
   - Decomposition into atomic operations
   - Role assignments (AI vs. human for each step)
   - Handoff specifications
   - Quality gates and thresholds

3. **Implementation Considerations**
   - Human-in-the-loop placement rationale
   - Escalation paths for exceptions
   - Guardrails and constraints

4. **Success Metrics**
   - How you'll measure improvement
   - Quality scoring system
   - Expected ROI

### Format

```markdown
# Workflow Design: [Process Name]

## Executive Summary
[1 paragraph overview]

## Current State
### Process Map
[Visual or text description]
### Pain Points
[Bulleted list]
### Current Metrics
[Time, cost, error rate]

## Future State Design
### Decomposition
[Atomic operations list]
### Role Assignments
[Table: operation, role, AI/human, rationale]
### Handoffs
[What passes between each role]
### Quality Gates
[Criteria and thresholds]

## Human-in-the-Loop Design
### Approval Gates
[What requires human approval]
### Escalation Paths
[How exceptions are handled]

## Implementation Plan
### Guardrails
[Hard constraints]
### Iteration Logic
[How quality issues are resolved]

## Success Metrics
### KPIs
[Specific measurable outcomes]
### Expected Improvement
[Quantified before/after]
```

## Readiness Check

Before moving to Phase 3, you should be able to:

- [ ] Decompose a business goal into AI-executable atomic operations
- [ ] Design a role-based workflow with clear handoffs
- [ ] Determine optimal human placement (in-loop, on-loop, out-of-loop)
- [ ] Create a quality scoring system with dimensions and weights
- [ ] Design iteration logic with thresholds and escalation
- [ ] Specify guardrails that prevent critical failures

---

**Next**: Phase 3 — No-Code Implementation
