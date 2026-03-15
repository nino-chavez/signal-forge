# Diátaxis Framework Templates

Signal Forge documentation mode uses the Diátaxis framework to structure user-facing documentation into four distinct quadrants. Each quadrant serves a different user need and requires a different voice.

## The Four Quadrants

```
                    PRACTICAL                    THEORETICAL
              ┌─────────────────────┬─────────────────────┐
    LEARNING  │     TUTORIALS       │    EXPLANATION      │
              │   "Follow along"    │   "Understand why"  │
              │   Learning-oriented │   Understanding     │
              ├─────────────────────┼─────────────────────┤
    WORKING   │      GUIDES         │    REFERENCE        │
              │   "How do I..."     │   "What is..."      │
              │   Task-oriented     │   Information       │
              └─────────────────────┴─────────────────────┘
```

## Critical Rule: Never Mix Quadrants

Each document belongs to ONE quadrant. Mixing creates confusion:
- Tutorials shouldn't contain reference tables
- Guides shouldn't teach concepts
- References shouldn't persuade
- Explanations shouldn't contain step-by-step procedures

---

## Template 1: Tutorial

**Purpose:** Help newcomers learn by doing
**User state:** "I want to learn"
**Tone:** Patient instructor, encouraging

```markdown
# Getting Started with [Feature]

Learn how to [outcome] in this hands-on tutorial. By the end, you'll be able to [concrete achievement].

**Time needed:** [X] minutes

## What You'll Need

Before you begin, make sure you have:
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

## Step 1: [Action Verb] Your First [Thing]

We'll start by [brief context for why this step matters].

1. [Specific instruction]
2. [Specific instruction]
3. [Specific instruction]

**What you should see:**
[Describe the expected result - be specific]

> **Tip:** [Helpful hint for this step]

## Step 2: [Action Verb] [Next Thing]

Now that you have [result of step 1], let's [next goal].

1. [Instruction]
2. [Instruction]

**What you should see:**
[Expected result]

## Step 3: [Continue Pattern]

[...]

## Congratulations!

You've successfully [achievement]. Here's what you learned:
- ✅ [Key skill 1]
- ✅ [Key skill 2]
- ✅ [Key skill 3]

## What's Next?

Ready to do more? Try these:
- [Link to related tutorial]
- [Link to how-to guide]

## Troubleshooting

### [Common problem]

**What you see:** [Symptom]
**Why it happens:** [Simple explanation]
**How to fix it:** [Solution]
```

---

## Template 2: How-To Guide

**Purpose:** Help users accomplish specific tasks
**User state:** "I need to do X"
**Tone:** Direct, efficient, assumes basic familiarity

```markdown
# How to [Accomplish Specific Goal]

[One sentence describing what this guide helps you do.]

## Prerequisites

- [What you need before starting]
- [Required access/permissions]

## Steps

### 1. [First Action]

[Brief context if needed - one sentence max]

[Instructions - be direct]

### 2. [Second Action]

[Instructions]

### 3. [Third Action]

[Instructions]

## Verification

Confirm it worked:
1. [How to check]
2. [What to look for]

## Common Issues

### [Problem 1]
**Solution:** [Quick fix]

### [Problem 2]
**Solution:** [Quick fix]

## Related

- [Link to related guide]
- [Link to reference]
```

---

## Template 3: Reference

**Purpose:** Provide accurate information for lookup
**User state:** "What is X?" or "What are the options?"
**Tone:** Precise, factual, no persuasion

```markdown
# [Feature/Area] Reference

## Overview

[Brief factual description - what this reference covers]

## [Category 1]

| Item | Description | Default | Options |
|------|-------------|---------|---------|
| [Name] | [What it does] | [Default] | [Allowed values] |

## [Category 2]

### [Item Name]

**Type:** [Data type or category]
**Default:** [Default value]
**Description:** [Factual description of what it is/does]

**Example:**
```
[Code or usage example]
```

## Glossary

| Term | Definition |
|------|------------|
| [Term] | [Precise definition] |

## See Also

- [Related reference]
- [Related guide]
```

---

## Template 4: Explanation

**Purpose:** Help users understand concepts
**User state:** "Why does X work this way?" or "What's the difference between A and B?"
**Tone:** Conversational, educational, can use analogies

```markdown
# Understanding [Concept]

## The Big Picture

[Start with context - why does this matter to the reader?]

## How It Works

[Explain the concept in accessible terms]

Think of it like [relatable analogy].

## Key Concepts

### [Concept 1]

[Clear explanation with examples]

### [Concept 2]

[Clear explanation]

## When to Use What

### Use [Option A] when:
- [Scenario 1]
- [Scenario 2]

### Use [Option B] when:
- [Scenario 1]
- [Scenario 2]

## Common Misconceptions

### "[Misconception]"

Actually, [correction with explanation].

## Frequently Asked Questions

### [Question 1]
[Answer]

### [Question 2]
[Answer]

## Learn More

- [Link to tutorial to try it]
- [Link to reference for details]
```

---

## Quadrant Selection Guide

| User's Question | Quadrant | Output |
|-----------------|----------|--------|
| "How do I get started?" | Tutorial | Step-by-step learning path |
| "How do I do X?" | Guide | Task-focused instructions |
| "What does X do?" | Reference | Factual description |
| "Why does X work that way?" | Explanation | Conceptual understanding |
| "What are my options?" | Reference | Options table |
| "When should I use A vs B?" | Explanation | Decision guidance |
| "Show me how to learn Y" | Tutorial | Hands-on walkthrough |
| "I need to accomplish Z" | Guide | Direct task completion |

---

## Quality Checklist

### All Quadrants
- [ ] Single quadrant only (no mixing)
- [ ] User-centered language ("you")
- [ ] Active voice
- [ ] No unexplained jargon

### Tutorial-Specific
- [ ] Hands-on steps throughout
- [ ] Expected results after each step
- [ ] Celebrates completion
- [ ] Links to next steps

### Guide-Specific
- [ ] Assumes basic knowledge
- [ ] Focused on single task
- [ ] Verification included
- [ ] No teaching/explaining

### Reference-Specific
- [ ] Consistent structure
- [ ] Complete information
- [ ] No persuasive language
- [ ] Alphabetical or logical order

### Explanation-Specific
- [ ] Answers "why" not "how"
- [ ] Uses analogies appropriately
- [ ] No step-by-step procedures
- [ ] Provides context and background
