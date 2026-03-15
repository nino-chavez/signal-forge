# Assessment Rubrics & Portfolio Guidelines

## Evaluation Framework for the AI Operator Curriculum

---

## Assessment Philosophy

### What We're Measuring

This curriculum doesn't test memorization. It tests **capability** — can you actually do the thing?

| Traditional Assessment | AI Operator Assessment |
|----------------------|----------------------|
| "Define RAG" | "Use RAG concepts to design a customer FAQ system" |
| "List AI risks" | "Identify and mitigate risks in this specific automation" |
| "Explain ROI formula" | "Calculate ROI for your project with real numbers" |

### The Portfolio Approach

Every assessment produces an artifact you can show to employers:
- **Prompt Library** → Shows communication skills with AI
- **Workflow Design** → Shows process thinking
- **Working Automation** → Shows implementation ability
- **Strategic Recommendation** → Shows business judgment
- **Capstone Project** → Shows end-to-end capability

---

## Phase 1 Deliverable: Prompt Library

### Requirements

- Minimum 10 effective prompts
- At least 3 using Chain of Thought
- At least 3 using different personas
- At least 2 requesting structured output
- Each prompt annotated explaining why it works

### Rubric

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|-----------|---------------|----------|--------------|----------------|
| **Quantity & Variety** | 15+ prompts across multiple categories and techniques | 10-14 prompts with good variety | 10 prompts, limited variety | Fewer than 10 or all same type |
| **Prompt Quality** | Prompts use RCTFC structure effectively; produce consistent, useful output | Most prompts well-structured; produce good output | Basic structure; output is acceptable | Vague prompts; unpredictable output |
| **Chain of Thought** | CoT prompts reveal auditible reasoning; demonstrates understanding of when to use | CoT prompts work but could be more sophisticated | CoT prompts present but basic | No CoT or incorrectly applied |
| **Persona Usage** | Personas produce distinctly different, valuable perspectives | Personas work but differences could be sharper | Personas present but outputs similar | No personas or ineffective use |
| **Structured Output** | Clear format specifications; output is machine-parseable | Format specified; output mostly consistent | Some format guidance; inconsistent output | No structure specified |
| **Annotations** | Insightful explanations of why each technique works | Good explanations; some depth | Basic explanations | No annotations or just restates prompt |

**Scoring**:
- 22-24 points: Excellent
- 18-21 points: Good
- 14-17 points: Adequate
- Below 14: Needs revision

### Portfolio Presentation Tips

```markdown
## My Prompt Library

### Category: Market Research

#### Prompt: Competitive Analysis with Chain of Thought

**Use Case**: When I need a structured analysis of competitors
that I can verify step-by-step.

**The Prompt**:
[Full prompt text]

**Why It Works**:
- Opens with clear role definition (strategic analyst)
- Specifies output structure upfront
- Requires showing reasoning at each step
- Enables fact-checking of each conclusion

**Sample Output**:
[Example of what this produces]

**When to Use**: Preliminary research before presenting
to stakeholders; situations where I need to defend my analysis.
```

---

## Phase 2 Deliverable: Workflow Design Document

### Requirements

- Document a real or realistic business process
- Current state analysis with pain points
- Decomposition into atomic operations
- Role assignments (AI vs. human)
- Quality gates and guardrails
- Human-in-the-loop design rationale

### Rubric

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|-----------|---------------|----------|--------------|----------------|
| **Process Selection** | Real process with genuine complexity; meaningful automation opportunity | Realistic process; clear opportunity | Process somewhat simple or generic | Trivial or unclear process |
| **Current State** | Thorough documentation; pain points quantified; stakeholders mapped | Good documentation; most pain points identified | Basic documentation; some gaps | Incomplete or superficial |
| **Decomposition** | All operations atomic and unambiguous; Robot Intern Test passed | Most operations atomic; minor ambiguities | Operations defined but some too broad | Vague or incomplete decomposition |
| **Role Design** | Clear rationale for AI vs. human; handoffs well-defined; appropriate specialization | Roles assigned with reasoning; some handoffs unclear | Roles present but rationale weak | No clear role separation |
| **Quality Gates** | Specific criteria; measurable thresholds; iteration logic defined | Quality gates present; some criteria vague | Basic quality concept; not operationalized | No quality gates |
| **Human-in-the-Loop** | Optimal placement with clear rationale; escalation paths defined | HITL present; reasoning mostly sound | Some HITL but placement questionable | No HITL consideration |

**Scoring**:
- 22-24 points: Excellent
- 18-21 points: Good
- 14-17 points: Adequate
- Below 14: Needs revision

### Portfolio Presentation Tips

Include a visual workflow diagram:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   TRIGGER   │────▶│    AI       │────▶│   HUMAN     │
│   (Auto)    │     │  Process    │     │   Review    │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                          │                    │
                          ▼                    ▼
                   ┌──────────────┐     ┌──────────────┐
                   │ Quality Gate │     │  Approved?   │
                   │  Score ≥ 7   │     │              │
                   └──────────────┘     └──────────────┘
```

---

## Phase 3 Deliverable: Working Automation

### Requirements

- Functional automation (actually runs)
- Includes AI processing step
- Connects minimum 3 tools/services
- Implements error handling
- Documented for handoff

### Rubric

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|-----------|---------------|----------|--------------|----------------|
| **Functionality** | Runs reliably; handles edge cases; production-worthy | Runs well; occasional issues | Runs but fragile; needs monitoring | Doesn't work or major bugs |
| **AI Integration** | AI step well-designed; output validated; appropriate model selection | AI step works; some output inconsistency | AI step present but not optimized | No AI or poorly integrated |
| **Tool Connections** | 4+ tools; data flows correctly; appropriate tool selection | 3 tools; mostly correct data flow | 3 tools; some data issues | Fewer than 3 or broken connections |
| **Error Handling** | Retry logic; fallbacks; alerting; graceful degradation | Some error handling; room for improvement | Basic error handling | No error handling |
| **Documentation** | Complete; reproducible; includes troubleshooting | Good documentation; some gaps | Basic documentation | Undocumented or unclear |
| **Real Value** | Solves genuine problem; measurable time savings | Solves a problem; value clear | Works but value marginal | No clear value |

**Scoring**:
- 22-24 points: Excellent
- 18-21 points: Good
- 14-17 points: Adequate
- Below 14: Needs revision

### Portfolio Presentation Tips

Include:
1. **Screenshot of the automation** (Zapier/Make canvas)
2. **Demo video** (30-60 seconds using Loom)
3. **Sample inputs and outputs**
4. **Metrics**: "Saves X hours/week" or "Processed Y items"

---

## Phase 4 Deliverable: Strategic Recommendation

### Requirements

- Build vs. buy analysis for AI initiative
- Quantified ROI projection
- Risk assessment with mitigations
- Stakeholder adoption considerations
- Clear recommendation with supporting evidence

### Rubric

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|-----------|---------------|----------|--------------|----------------|
| **Research Quality** | Real vendors; accurate pricing; thorough comparison | Good research; mostly accurate | Some research; gaps in data | No real research; guesses |
| **Build vs. Buy Analysis** | Clear criteria; quantified comparison; defensible conclusion | Good analysis; some qualitative | Analysis present but weak | No real analysis |
| **ROI Calculation** | All costs and benefits quantified; conservative assumptions; sensitivity analysis | Most elements quantified; reasonable assumptions | Basic ROI; missing elements | No quantification |
| **Risk Assessment** | Comprehensive risks; specific mitigations; guardrail designs | Key risks identified; mitigations proposed | Some risks noted; vague mitigations | No risk consideration |
| **Adoption Planning** | Stakeholder analysis; phased rollout; success metrics | Some adoption thinking; could be stronger | Basic mention of adoption | No adoption consideration |
| **Recommendation Clarity** | Crystal clear; well-supported; actionable next steps | Clear recommendation; good support | Recommendation present but weak | No clear recommendation |

**Scoring**:
- 22-24 points: Excellent
- 18-21 points: Good
- 14-17 points: Adequate
- Below 14: Needs revision

### Portfolio Presentation Tips

Lead with the executive summary:

```markdown
# AI Customer Support: Strategic Recommendation

## Bottom Line Up Front

**Recommendation**: Buy Intercom Fin ($24K/year) rather than build custom ($150K+)

**Key Numbers**:
- 3-year savings vs. build: $78,000
- Time to deploy: 3 weeks vs. 6 months
- Risk reduction: Vendor maintains; we focus on customers

**One-line rationale**: Customer support AI is not our competitive advantage;
our service quality is. Buy commodity, focus on differentiation.
```

---

## Capstone Project Assessment

### Requirements

| Component | Weight | Description |
|-----------|--------|-------------|
| Current State Analysis | 15% | Documentation of real process with quantified pain points |
| Workflow Design | 25% | Complete design applying Phase 2 frameworks |
| Working Prototype | 30% | Functional automation demonstrating Phase 3 skills |
| Business Case | 20% | ROI, risks, and adoption plan from Phase 4 |
| Presentation | 10% | Clear 5-minute presentation of the project |

### Capstone Rubric

| Criterion | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|-----------|---------------|----------|--------------|----------------|
| **Process Selection** | Real, complex process with significant automation potential | Realistic process; good opportunity | Somewhat simple or generic | Trivial or unclear |
| **Current State** | Thorough; quantified (hours, $, errors); stakeholder input | Good documentation; mostly quantified | Basic; not fully quantified | Incomplete |
| **Workflow Design** | Sophisticated; applies all frameworks; ready for implementation | Good design; most frameworks applied | Basic design; some gaps | Incomplete or flawed |
| **Prototype Quality** | Works reliably; handles errors; real value demonstrated | Works; some refinement needed | Works but fragile | Doesn't work |
| **Business Case** | Compelling ROI; risks mitigated; adoption planned | Good case; some gaps | Basic case; missing elements | No business justification |
| **Integration** | All curriculum concepts visible; coherent end-to-end | Good integration; minor disconnects | Concepts present but disconnected | Feels like separate pieces |
| **Presentation** | Clear, confident, professional; handles questions | Good presentation; minor issues | Adequate; room for improvement | Unclear or unprofessional |

**Scoring**:
- 26-28 points: Excellent (A)
- 21-25 points: Good (B)
- 16-20 points: Adequate (C)
- Below 16: Needs significant revision

---

## Portfolio Assembly Guidelines

### Portfolio Structure

```
AI Operator Portfolio
├── About Me
│   └── Brief intro, career interests, AI journey
├── Phase 1: Prompt Engineering
│   ├── Prompt Library (PDF or web page)
│   └── Lab 1 & 2 highlights
├── Phase 2: Workflow Design
│   ├── Workflow Design Document
│   ├── Process diagram
│   └── Lab 3 & 4 highlights
├── Phase 3: Implementation
│   ├── Automation documentation
│   ├── Demo video (embedded)
│   └── Metrics/results
├── Phase 4: Strategy
│   ├── Buy vs. Build Memo
│   ├── Research Report
│   └── Key insights
├── Capstone Project
│   ├── Full project documentation
│   ├── Presentation slides
│   └── Demo video
└── Skills Summary
    └── What I can do now
```

### Presentation Formats

**Option A: Notion Portfolio** (Recommended for beginners)
- Free, easy to update
- Good for rich content
- Shareable via link

**Option B: GitHub Pages** (For technical credibility)
- Shows GitHub familiarity
- Permanent URL
- More professional appearance

**Option C: Personal Website**
- Most professional
- Requires more setup
- Best for job applications

### What Employers Look For

When reviewing your portfolio, employers assess:

1. **Can you actually do things?** (Not just talk about them)
   - Working automations prove this
   - Quantified results prove impact

2. **Do you think clearly?** (Not just follow instructions)
   - Annotations on prompts show thinking
   - Workflow designs show process thinking
   - Business cases show strategic thinking

3. **Can you communicate?** (Not just to AI, but to humans)
   - Documentation quality matters
   - Presentation clarity matters

4. **Are you self-directed?** (Will you need hand-holding?)
   - Project scope and ambition
   - Problem-solving when stuck

### Interview Preparation

Be ready to discuss any portfolio piece:

**For each deliverable, prepare**:
- "Here's the problem I was solving..."
- "Here's the approach I took..."
- "Here's what I learned..."
- "Here's what I'd do differently..."

**Common questions**:
- "Walk me through your capstone project"
- "What was the hardest part of building your automation?"
- "How did you decide on build vs. buy?"
- "How would you apply these skills to [company's process]?"

---

## Self-Assessment Checklist

Before submitting any deliverable, ask yourself:

### Completeness
- [ ] All requirements met?
- [ ] All sections present?
- [ ] No placeholder text?

### Quality
- [ ] Would I be proud to show this to an employer?
- [ ] Can I explain every decision I made?
- [ ] Does it demonstrate the skill it's supposed to?

### Clarity
- [ ] Could someone else understand this without asking questions?
- [ ] Is it well-organized?
- [ ] Is the writing professional?

### Value
- [ ] Does it solve a real problem?
- [ ] Is the value measurable or at least articulable?
- [ ] Would someone actually use this?

---

## Grade Interpretation

| Grade | Meaning | Employment Readiness |
|-------|---------|---------------------|
| **Excellent** | Exceeds expectations; demonstrates mastery | Ready to contribute immediately; would impress in interview |
| **Good** | Meets all expectations; solid understanding | Ready for entry-level AI-adjacent roles; competitive candidate |
| **Adequate** | Meets minimum requirements; some gaps | Foundation present; more practice needed before interviews |
| **Needs Work** | Below expectations; significant gaps | Not ready; revision required |

---

## Continuous Improvement

### After Completing the Curriculum

Your learning doesn't stop here. Continue developing by:

1. **Building More Projects**
   - Apply skills to new processes
   - Increase complexity
   - Explore new tools

2. **Staying Current**
   - AI capabilities change rapidly
   - New tools emerge constantly
   - Business applications evolve

3. **Teaching Others**
   - Explaining concepts deepens understanding
   - Helping peers builds reputation
   - Writing about your work creates content

4. **Networking**
   - Connect with AI product managers
   - Join AI-focused communities
   - Attend meetups and events

### Portfolio Evolution

Your portfolio should grow over time:

| 6 Months Post-Completion | 1 Year Post-Completion |
|--------------------------|------------------------|
| Curriculum projects + 1-2 new projects | 5+ diverse projects |
| Basic metrics | Strong quantified results |
| General business focus | Industry specialization emerging |
| Learning stance | Practitioner stance |

---

## Final Thoughts

The goal of this curriculum is not to give you a certificate. It's to give you capabilities.

After completing this program, you should be able to:

1. **Walk into a meeting** about AI and contribute intelligently
2. **Evaluate AI tools** and make recommendations
3. **Design AI-augmented processes** that actually work
4. **Build working automations** that create real value
5. **Make the business case** for AI investments
6. **Bridge the gap** between technical and business teams

These capabilities are rare and valuable. The portfolio proves you have them.

Go build things. Go create value. Go be an AI Operator.
