# Business Labs

## Hands-On Exercises for the AI Operator Curriculum

---

## Overview

Business Labs are practical exercises designed to build real skills through realistic scenarios. Each lab simulates situations you'll encounter in internships and early career roles.

### Lab Philosophy

- **Learn by doing** — reading about AI is not the same as using AI
- **Realistic scenarios** — based on actual business situations, not toy examples
- **Tangible deliverables** — each lab produces something for your portfolio
- **Progressive complexity** — labs build on previous skills

### Lab Structure

Each lab includes:
1. **The Scenario** — business context and role you're playing
2. **The Task** — specific assignment to complete
3. **The Lesson** — skill being developed
4. **Deliverable** — artifact to include in portfolio
5. **Evaluation Criteria** — how to assess your work

---

# Phase 1 Labs: The "Prompt Manager"

*Goal: Move beyond "asking questions" to "programming behavior via text."*

---

## Lab 1: The Persona Stress Test

### The Scenario

You are a Product Manager launching a new energy drink called "Spark" targeted at young professionals. Before finalizing your go-to-market strategy, you need feedback from three distinct demographics. Rather than conducting expensive focus groups, you'll use AI to simulate diverse perspectives.

**Product Details**:
- Name: Spark
- Target: Young professionals (25-35)
- Positioning: Clean energy, no crash
- Key features: Natural caffeine (green tea extract), zero sugar, B-vitamins
- Packaging: Recyclable aluminum cans, minimalist design
- Price: $3.50 per can
- Distribution: Starting with convenience stores and gyms

### The Task

Open a new chat in Claude, ChatGPT, or Gemini. Run three separate conversations using the personas below.

**Persona 1: Skeptical Gen-Z Consumer**

```
You are an 18-year-old college student who is extremely skeptical of
corporate marketing. You've grown up seeing through advertising tactics
and have strong opinions about authenticity, sustainability, and health.
You're quick to call out "cringe" marketing and performative corporate
social responsibility. You primarily communicate in direct, sometimes
sarcastic language. You care deeply about what your peers think.

I'm a product manager seeking honest feedback on a new energy drink
called "Spark" before we launch. Here's the concept:
- Target: Young professionals (25-35)
- Positioning: "Clean energy, no crash"
- Natural caffeine from green tea extract
- Zero sugar, added B-vitamins
- Recyclable aluminum cans with minimalist design
- $3.50 per can
- Initial distribution: convenience stores and gyms

Give me your unfiltered reaction. What would make you roll your eyes?
What might actually get you interested? What would your friends think
if they saw you drinking this? Be completely honest—I need real feedback,
not politeness.
```

**Persona 2: Conservative Investor**

```
You are a 60-year-old angel investor with 30 years of experience in
consumer packaged goods. You've seen countless beverage launches—most
failed. You made money by avoiding hype and focusing on fundamentals:
unit economics, distribution advantages, and sustainable competitive
moats. You've lost money on "the next big thing" twice and learned
your lesson. You're naturally skeptical and numbers-driven.

I'm seeking feedback on an energy drink investment opportunity:
- Product: "Spark" energy drink
- Target: Young professionals (25-35)
- Differentiation: Natural caffeine, zero sugar, clean label
- Price: $3.50 retail (industry avg: $2.50-4.00)
- Initial distribution: convenience stores and gyms
- Marketing position: "Clean energy, no crash"

Before I ask for investment, I want honest criticism. What concerns
you about this concept? What would you need to see before writing a
check? What questions would you ask management? What are the most
likely failure modes you've seen in similar ventures?
```

**Persona 3: FDA Compliance Specialist**

```
You are an FDA regulatory compliance specialist with 15 years of
experience reviewing food and beverage marketing claims. You've seen
companies get warning letters, face lawsuits, and damage their brands
through careless language. Your job is to find problems before the
FDA does. You're not here to be helpful—you're here to find violations.

Review this energy drink marketing concept for regulatory concerns:

Product: "Spark" Energy Drink
Claims being considered:
- "Clean energy, no crash"
- "Natural caffeine from green tea extract"
- "Zero sugar"
- "B-vitamins for energy"
- "Fuel your focus"

Ingredients: Carbonated water, green tea extract (caffeine),
erythritol, citric acid, B-vitamin complex (B6, B12, niacin),
natural flavors.

What claims concern you? What language would trigger FDA scrutiny?
What documentation would be required to support these claims? What
rewording would you recommend? What common mistakes do beverage
companies make that I should avoid?
```

### The Lesson

**Understanding how context and persona change AI output.**

The same AI produces dramatically different responses based on the persona you assign. This is not just a trick—it's a fundamental capability:

- **Personas access different knowledge**: A "compliance officer" draws on regulatory knowledge; an "investor" draws on financial frameworks
- **Personas change evaluation criteria**: Each persona has different standards for what's "good"
- **Personas reveal blind spots**: Your own perspective limits what you consider; personas expand your view

This skill translates directly to using AI for market research, stakeholder analysis, risk assessment, and decision-making.

### Deliverable

**A Comparative Analysis Table**:

| Dimension | Gen-Z Consumer | Investor | Compliance |
|-----------|---------------|----------|------------|
| **Primary Concern** | [What worried them most] | | |
| **What They Liked** | [If anything] | | |
| **Key Question** | [Most important question they asked] | | |
| **Risk Identified** | [Specific risk they highlighted] | | |
| **Recommendation** | [Their main suggestion] | | |

Plus a **Synthesis Paragraph** (150-200 words):
- What did you learn from comparing these perspectives?
- How would you modify the product/marketing based on this feedback?
- Which perspective was most valuable and why?

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Persona Differentiation** | Responses clearly differ; each persona's voice is distinct | Responses differ but some overlap | Responses are similar despite different personas |
| **Insight Extraction** | Identifies non-obvious insights from each perspective | Summarizes obvious points | Just copies AI output without analysis |
| **Synthesis Quality** | Connects perspectives to actionable recommendations | Makes general observations | No synthesis across perspectives |

---

## Lab 2: The Chain of Thought Audit

### The Scenario

Your manager asks: "What's the market size for premium pet food in Austin, Texas? I need a number for the investor deck."

You could ask AI for "the answer," but you know that AI often hallucinates specific numbers. Your job is to get a defensible estimate with transparent methodology.

### The Task

**Part 1: The Naive Approach**

Ask your AI directly:
```
What is the market size for premium/luxury dog food in Austin, Texas?
```

Document:
- The answer it gives
- How confident it sounds
- Whether it cites any sources
- Whether the number is plausible

**Part 2: The Chain of Thought Approach**

```
I need to estimate the market size for premium/luxury dog food in the
Austin, Texas metropolitan area.

Think through this step-by-step, showing all work:

Step 1: Establish the Austin metro population (cite your knowledge
cutoff date)

Step 2: Estimate dog ownership rate (what percentage of households
have dogs?)

Step 3: Estimate average dogs per dog-owning household

Step 4: Calculate total dogs in Austin metro

Step 5: Estimate what percentage of dog owners buy premium/luxury
food (vs. standard/budget)

Step 6: Define "premium" price point (annual spend per dog)

Step 7: Calculate total market size

For each step:
- State your estimate
- Explain your reasoning
- Rate your confidence (high/medium/low)
- Note what data you'd want to verify

Final output: Market size estimate with confidence interval
```

**Part 3: The Audit**

Review the Chain of Thought response:
1. Which assumptions seem reasonable?
2. Which assumptions seem questionable?
3. Where would you want to verify with real data?
4. What's the range of plausible answers if assumptions are wrong?

**Part 4: Sensitivity Analysis**

Pick the 2-3 most uncertain assumptions. Calculate how the final answer changes if those assumptions are 20% higher or 20% lower.

### The Lesson

**Learning to audit AI logic rather than blindly trusting results.**

Key insights:
- AI sounds confident even when making up numbers
- Chain of Thought reveals the logic chain you can verify
- Market sizing is about defensible methodology, not "right answers"
- Your value is in the audit, not in getting a number

### Deliverable

**1. Market Sizing Worksheet**:

| Step | AI's Estimate | AI's Reasoning | Your Assessment | Data Source (if you'd verify) |
|------|--------------|----------------|-----------------|-------------------------------|
| Population | | | | |
| Dog ownership % | | | | |
| Dogs per household | | | | |
| Total dogs | | | | |
| Premium buyer % | | | | |
| Annual spend | | | | |
| **Market Size** | | | | |

**2. Sensitivity Analysis**:

| Assumption Changed | Low Case (-20%) | Base Case | High Case (+20%) |
|-------------------|-----------------|-----------|------------------|
| [Most uncertain] | $X | $Y | $Z |
| [Second uncertain] | | | |
| Combined impact | | | |

**3. Final Recommendation** (1 paragraph):
- Your recommended market size range
- Confidence level
- Key assumptions that need validation
- Suggested next steps

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Methodology** | Clear CoT with all steps shown | Steps present but incomplete | No clear methodology |
| **Critical Analysis** | Identifies questionable assumptions, suggests verification | Notes some issues | Accepts AI output uncritically |
| **Sensitivity Analysis** | Quantifies impact of assumption changes | Discusses uncertainty qualitatively | No sensitivity analysis |

---

# Phase 2 Labs: The "Process Architect"

*Goal: Thinking in workflows and identifying automation opportunities.*

---

## Lab 3: The SOP Translation

### The Scenario

You're a board member of a student organization. The current expense reimbursement process is a mess:

**Current Reality**:
- Members email the treasurer with receipts (sometimes)
- Treasurer responds when they remember
- Approvals happen via text message, sometimes
- Reimbursements happen "eventually"
- No one knows the actual policy
- The president gets involved when someone complains

Members are frustrated. The treasurer is overwhelmed. Money gets lost.

### The Task

**Part 1: Document the Current State**

Write out the current process as it actually happens (not as it should happen). Include:
- How requests come in (multiple channels?)
- What information is usually included/missing
- Who makes decisions
- Where things get stuck
- How long it typically takes

**Part 2: Write a Rigorous SOP**

Create a Standard Operating Procedure so clear that:
- A robot could follow it
- A new intern on day one could execute it without asking questions
- Every decision has explicit criteria

**SOP Template**:

```markdown
# Expense Reimbursement SOP

## Scope
- What expenses are reimbursable
- Who is eligible
- Maximum amounts

## Process

### Step 1: Request Submission
- Required information: [list]
- Accepted formats: [list]
- Submission method: [exactly one method]
- Deadline: [specific]

### Step 2: Initial Validation
- IF [all required information present] THEN proceed to Step 3
- IF [information missing] THEN [specific action with template response]
- Validation checklist:
  - [ ] Receipt image is legible
  - [ ] Amount matches receipt
  - [ ] Date is within [X] days
  - [ ] Category is valid

### Step 3: Approval Routing
- IF amount <= $50 THEN Treasurer auto-approves
- IF amount > $50 AND <= $200 THEN Treasurer approves
- IF amount > $200 THEN President approval required
- Approval deadline: [X] business days

### Step 4: Processing
- [Specific actions for each outcome]

### Step 5: Confirmation
- [What requester receives and when]
```

**Part 3: AI Simulation**

Paste your SOP into an AI and run this prompt:

```
You are a rules-based expense processing system. You can ONLY follow
the SOP below. You cannot make judgment calls—only apply the rules.

[Paste your SOP here]

Process these 5 expense requests and state your action for each:

Request 1: Email from Sarah: "Hey can I get reimbursed for the pizza
I bought for last week's meeting? It was like $45."

Request 2: Form submission from Mike: Receipt attached for $127.50
in office supplies, dated 3 days ago, category: "supplies"

Request 3: Text message to treasurer: "I paid $250 for the speaker
gift cards, need that back ASAP"

Request 4: Form submission from Alex: Receipt attached for $38.00,
dated 45 days ago, category: "food", description: "Team celebration"

Request 5: Email from Jordan with receipt: $89.00 for "event decorations"
dated yesterday, but the receipt shows a different name on the card.

For each request, state:
1. Can you process this? (Yes/No)
2. What specific action does the SOP require?
3. What response should be sent?
```

**Part 4: Iterate**

Based on the simulation, identify:
- Scenarios your SOP didn't handle
- Rules that were ambiguous
- Edge cases to add

Revise your SOP and run again.

### The Lesson

**AI is only as good as the process rules you give it. Garbage in, garbage out.**

If your SOP requires "judgment" or has ambiguous rules, AI will either refuse to process or make random decisions. The discipline of writing robot-readable processes is the discipline of clear thinking.

### Deliverable

**1. Current State Process Map**:
- Diagram or description of actual current process
- Identified pain points

**2. Final SOP**:
- Complete, unambiguous standard operating procedure
- All decision criteria explicit
- All edge cases handled

**3. Simulation Results**:
- How AI processed each test case
- Iterations made to improve SOP

**4. Reflection** (100-150 words):
- What was hard about making the SOP unambiguous?
- What "judgment calls" did you have to convert to rules?
- How would this SOP help even without AI (just for humans)?

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Completeness** | All scenarios handled, no gaps | Most scenarios handled | Many gaps and ambiguities |
| **Clarity** | No interpretation required | Some ambiguous rules | Requires "judgment" to follow |
| **AI Simulation** | AI processes all cases correctly | AI struggles with some cases | AI can't follow the SOP |

---

## Lab 4: The Unstructured Data Cleanup

### The Scenario

It's week 3 of the semester. You have syllabi from 5 different classes, each formatted differently. Some are PDFs, some are Word docs, one is just a webpage. You need a single, unified calendar of all deadlines.

This is exactly the kind of task AI is good at—but only if you give it clear instructions about output format.

### The Task

**Part 1: Gather Your Syllabi**

Collect syllabi from 3-5 of your current classes (or use sample syllabi if needed). Note the variety in how they present dates:
- "Week 3: Paper due"
- "February 15: Midterm"
- "Homework due every Friday"
- "TBD"

**Part 2: Upload and Extract**

Use an AI with document upload capability (Claude, ChatGPT with file upload, Gemini).

**First attempt** (intentionally vague):
```
Here are my course syllabi. Create a calendar of all deadlines.
```

Note what goes wrong:
- Inconsistent date formats?
- Missing information?
- Unclear what counts as a "deadline"?

**Part 3: Structured Extraction**

```
I need to extract all deadlines and important dates from these course
syllabi into a structured format for import into my calendar.

For each deadline, extract:
- Course: [Course code/name exactly as it appears]
- Date: [YYYY-MM-DD format only. If date is relative like "Week 3",
  use the semester start date I'll provide]
- Time: [HH:MM 24-hour format, or "23:59" if no time specified]
- Type: [One of: exam, paper, homework, presentation, reading, other]
- Description: [Brief description of what's due]
- Notes: [Any special instructions or conditions]

Semester start date: [Your semester start date]
Semester end date: [Your semester end date]

Output format: CSV with headers:
course,date,time,type,description,notes

Important rules:
- If a deadline is recurring (e.g., "homework every Friday"),
  create separate entries for each instance
- If a date is truly TBD, use "TBD" in date field but include
  everything else
- If you're uncertain about a date, add "[VERIFY]" in notes

After the CSV, list any items you couldn't parse with reasons why.
```

**Part 4: Validate and Import**

1. Review the CSV output
2. Check for obvious errors (dates in the past, impossible dates, etc.)
3. Verify a sample of entries against original syllabi
4. Import into Google Calendar or your calendar app
5. Note any cleanup you had to do manually

### The Lesson

**Data hygiene and structuring unstructured data is 80% of real AI work.**

The messy extraction and formatting isn't a bug—it's the actual work. Skills demonstrated:
- Specifying exact output formats
- Handling inconsistent inputs
- Building in validation checkpoints
- Knowing when to verify AI output

### Deliverable

**1. Raw vs. Structured Comparison**:
- Screenshot/sample of vague prompt output
- Screenshot/sample of structured prompt output
- Brief note on what improved

**2. Final Calendar CSV**:
- Cleaned, validated CSV file
- All dates in consistent format
- Ready for calendar import

**3. Validation Report**:
- How many entries extracted
- How many required manual correction
- Types of errors encountered
- Time spent on cleanup vs. if done manually

**4. Process Reflection** (100-150 words):
- What prompt modifications made the biggest difference?
- What would you do differently next time?
- How much time did this save vs. manual extraction?

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Output Structure** | Perfect CSV, consistent formats | Minor inconsistencies | Unstructured or unusable output |
| **Data Quality** | Verified, corrected errors | Some validation done | Unvalidated AI output |
| **Prompt Engineering** | Sophisticated format specification | Basic structure requested | No format guidance given |

---

# Phase 3 Lab: The "No-Code Builder"

*Goal: Connecting tools together.*

---

## Lab 5: The Zapier Hello World

### The Scenario

You want to stay informed about developments in your target industry without spending an hour daily reading news. You need a system that:
1. Monitors relevant news automatically
2. Filters for relevance
3. Summarizes key points
4. Delivers to where you'll actually see it

### The Task

**Part 1: Choose Your Focus**

Select an industry or topic you genuinely care about:
- "AI in healthcare"
- "Sustainable fashion"
- "Fintech startups"
- "Sports analytics"
- Or your actual career interest

**Part 2: Set Up the Trigger**

Create a content source:

**Option A: Google Alerts**
1. Go to google.com/alerts
2. Create an alert for your topic
3. Set to "as it happens" and "RSS feed"
4. Copy the RSS feed URL

**Option B: RSS Feed**
1. Find a relevant industry publication
2. Locate their RSS feed (usually /rss or /feed)
3. Copy the URL

**Part 3: Build in Zapier**

Create a free Zapier account and build this zap:

```
TRIGGER: New item in RSS feed
    │
    ├─ Zapier extracts: Title, Link, Description
    │
    ▼
ACTION 1: ChatGPT - Summarize
    │
    ├─ Input: Article title and description
    │
    ├─ Prompt: "Summarize this news article in 3 bullet points.
    │   Focus on: 1) What happened, 2) Why it matters,
    │   3) What to watch next.
    │
    │   Article: {{title}}
    │   Description: {{description}}
    │
    │   Keep each bullet under 50 words."
    │
    ├─ Output: 3 bullet summary
    │
    ▼
ACTION 2: Send to destination
    │
    ├─ Option A: Slack message to yourself
    ├─ Option B: Email digest
    ├─ Option C: Google Sheet row
    │
    └─ Format: Include title, summary, and link
```

**Part 4: Test and Refine**

1. Test with a sample article
2. Review the AI summary quality
3. Adjust the prompt if needed
4. Turn on the automation
5. Let it run for 2-3 days
6. Review what you received

### The Lesson

**Understanding triggers, actions, and API calls without writing code.**

Key concepts demonstrated:
- **Trigger**: An event that starts automation (new RSS item)
- **Action**: Something the automation does (AI summarize, send message)
- **Data mapping**: Connecting output of one step to input of another
- **API orchestration**: Multiple services working together

This is the same pattern used in enterprise automation—just simpler tools.

### Deliverable

**1. Zap Documentation**:
- Screenshot of your completed zap
- Description of each step
- The exact prompt you used

**2. Sample Output**:
- 3-5 actual summaries received
- Assessment: Were they useful? Accurate? Well-formatted?

**3. Iteration Log**:
- What you changed from first version
- Why you made those changes
- Final prompt text

**4. Reflection** (150-200 words):
- What was easier than expected?
- What was harder than expected?
- How would you expand this automation?
- What other processes could you automate with similar patterns?

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Working Automation** | Runs reliably, produces useful output | Runs but needs refinement | Doesn't work or produces garbage |
| **Prompt Quality** | Summaries are concise, useful, well-formatted | Summaries work but aren't optimized | AI output is too long or irrelevant |
| **Documentation** | Complete, reproducible by someone else | Missing some details | Incomplete or unclear |

---

# Phase 4 Labs: The "AI Strategist"

*Goal: Defining value and ROI.*

---

## Lab 6: The Buy vs. Build Memo

### The Scenario

You're an intern at a mid-size company. Your manager mentions: "Leadership wants us to build a customer support chatbot. They're thinking of hiring a contractor for $100K."

You suspect there might be a better way. Your task: Research the alternatives and write a recommendation memo.

### The Task

**Part 1: Define Requirements**

Before comparing solutions, clarify what's actually needed:

```markdown
## Requirements Clarification

### Volume
- Current support tickets/month: [Estimate or research typical]
- Expected growth: [%/year]

### Functionality Needed
- [ ] Answer FAQs
- [ ] Access customer account info
- [ ] Process simple requests (refunds, changes)
- [ ] Escalate to human when needed
- [ ] Available 24/7
- [ ] Multi-language
- [ ] [Other]

### Constraints
- Budget: ~$100K first year
- Timeline: [When needed]
- Integration: [What systems must it connect to]
- Compliance: [Any regulatory requirements]
```

**Part 2: Research Off-the-Shelf Options**

Research at least 3 vendor solutions. For each, document:

| Vendor | Pricing Model | Est. Annual Cost | Key Features | Limitations |
|--------|---------------|------------------|--------------|-------------|
| [Vendor 1] | | | | |
| [Vendor 2] | | | | |
| [Vendor 3] | | | | |

**Suggested vendors to research**:
- Intercom Fin
- Zendesk AI
- Freshdesk Freddy
- Drift
- Ada
- Tidio

**Part 3: Analyze Build Option**

```markdown
## Build Analysis

### Costs
- Contractor: $100,000 (one-time)
- AI API costs: $X/month based on volume
- Hosting/infrastructure: $X/month
- Maintenance (ongoing): $X/year

### Timeline
- Development: [X] months
- Testing: [X] months
- Total time to launch: [X] months

### Risks
- Contractor availability/quality
- Scope creep
- Maintenance after contractor leaves
- Falling behind vendor features

### Advantages
- Full customization
- No per-seat costs
- Data stays internal
```

**Part 4: Write the Memo**

```markdown
# AI Customer Support: Build vs. Buy Recommendation

**To:** [Manager Name]
**From:** [Your Name]
**Date:** [Date]
**Re:** Customer Support Chatbot Investment Decision

## Executive Summary
[2-3 sentences: Your recommendation and key reason]

## Background
[Why we're considering this, what problem we're solving]

## Options Analyzed

### Option 1: Build Custom Solution
[3-4 bullet summary]
- **Cost**: $X first year, $Y ongoing
- **Timeline**: X months to deploy
- **Risk level**: [High/Medium/Low]

### Option 2: Buy [Recommended Vendor]
[3-4 bullet summary]
- **Cost**: $X first year, $Y ongoing
- **Timeline**: X weeks to deploy
- **Risk level**: [High/Medium/Low]

### Option 3: Buy [Alternative Vendor]
[Brief summary if notably different]

## Comparison Matrix

| Factor | Build | Buy (Vendor A) | Buy (Vendor B) |
|--------|-------|----------------|----------------|
| First year cost | | | |
| Ongoing annual cost | | | |
| Time to deploy | | | |
| Customization | | | |
| Maintenance burden | | | |
| Scalability | | | |

## Recommendation

I recommend **[Build/Buy Vendor X]** because:

1. [Primary reason with supporting data]
2. [Secondary reason]
3. [Third reason]

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| [Main risk] | [How to address] |
| [Secondary risk] | [How to address] |

## Next Steps

1. [Immediate action]
2. [Follow-up action]
3. [Decision deadline]

## Appendix
[Detailed vendor comparison, pricing breakdowns, etc.]
```

### The Lesson

**Most business AI problems are solved by buying, not building.**

Economic reasoning skills:
- Understanding total cost of ownership
- Valuing time-to-market
- Assessing ongoing maintenance burden
- Evaluating opportunity cost

The meta-lesson: Your value isn't in having opinions ("we should build!"). It's in doing rigorous analysis that enables good decisions.

### Deliverable

**1. Complete 1-Page Memo** (max 2 pages with appendix)
**2. Vendor Research Summary Table**
**3. 3-Year Cost Projection**:

| Year | Build Cost | Buy Cost |
|------|------------|----------|
| 1 | | |
| 2 | | |
| 3 | | |
| **Total** | | |

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Research Quality** | Real vendors, accurate pricing | Some vendor research | No actual research |
| **Analysis Rigor** | Quantified comparison, clear criteria | Qualitative comparison | Opinion without analysis |
| **Recommendation Clarity** | Clear position with supporting evidence | Position stated but weakly supported | Unclear or no recommendation |

---

## Lab 7: The Agentic Research Report

### The Scenario

Your manager needs a competitive analysis for an upcoming strategy meeting. She wants to understand how three companies approach pricing in a specific market. She needs this by end of day.

Previously, this would take a research analyst a full day. You'll demonstrate how AI-assisted research changes this equation.

### The Task

**Part 1: Select Your Companies**

Choose a real competitive set (or use this example):
- **Option A**: Ride-sharing (Uber, Lyft, local taxi service)
- **Option B**: Food delivery (DoorDash, UberEats, Grubhub)
- **Option C**: Streaming (Netflix, Disney+, Max)
- **Option D**: [Your choice — 3 direct competitors]

**Part 2: Use Agentic AI Research**

Use Perplexity, ChatGPT with browsing, or Claude with web access.

**Prompt**:
```
I need a competitive pricing analysis of [Company A], [Company B],
and [Company C] in [specific market].

For each company, research and report:

1. **Pricing Model**
   - How do they charge? (subscription, per-use, freemium, etc.)
   - What are the specific price points?
   - Any notable tiers or packages?

2. **Recent Pricing Changes**
   - Any changes in the past 12 months?
   - Market reaction to changes?

3. **Competitive Positioning**
   - How do they position on price vs. competitors?
   - Premium, value, or mid-market?

4. **Hidden Costs / Fees**
   - Any fees not obvious in headline pricing?
   - What do customers complain about?

For each fact, note your source so I can verify.

Output as a structured comparison with a summary table at the end.
```

**Part 3: The Human-in-the-Loop Audit**

AI will research autonomously, but you must verify:

1. **Fact-check 5 specific claims**
   - Pick 5 facts from the AI report
   - Manually verify each (visit the actual company website, find the news article, etc.)
   - Note: Was AI correct? Partially correct? Wrong? Outdated?

2. **Identify gaps**
   - What important information is missing?
   - What would you want to know that AI didn't cover?

3. **Correct and supplement**
   - Fix any errors
   - Add missing information
   - Note your additions clearly

### The Lesson

**Human-in-the-loop: AI does 80% of the work, you do 20% verification.**

Key skills demonstrated:
- Leveraging AI for rapid research
- Critical evaluation of AI output
- Knowing what to verify and how
- Adding human judgment to AI capability

This is the model for how knowledge work actually changes with AI—not replacement, but augmentation with human oversight.

### Deliverable

**1. Research Report**:

```markdown
# Competitive Pricing Analysis: [Market]

## Executive Summary
[3-4 sentences: Key findings and recommendation]

## Company Profiles

### [Company A]
- **Pricing Model**: [Description]
- **Key Price Points**: [Table or list]
- **Recent Changes**: [What changed and when]
- **Positioning**: [Premium/value/mid]

### [Company B]
[Same structure]

### [Company C]
[Same structure]

## Comparison Matrix

| Factor | Company A | Company B | Company C |
|--------|-----------|-----------|-----------|
| Base price | | | |
| Premium tier | | | |
| Hidden fees | | | |
| Recent direction | ↑ ↓ → | | |

## Key Insights
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

## Sources
[List of sources AI used]
```

**2. Verification Log**:

| Claim | AI Said | Verification Source | Status |
|-------|---------|--------------------|---------|
| [Claim 1] | [What AI reported] | [Where you verified] | ✓ Correct / ⚠️ Partially / ✗ Wrong |
| [Claim 2] | | | |
| ... | | | |

**3. Time Analysis**:
- How long did AI research take?
- How long did your verification take?
- Estimated time if done fully manually?
- Net time savings?

### Evaluation Criteria

| Criterion | Excellent | Adequate | Needs Work |
|-----------|-----------|----------|------------|
| **Research Depth** | Comprehensive, insightful findings | Covers basics | Superficial or incomplete |
| **Verification** | 5+ facts verified, errors caught | Some verification done | No verification attempted |
| **Error Identification** | Caught and corrected AI errors | Noted errors but didn't correct | Accepted AI output uncritically |

---

# Capstone Lab: The Shadow Project

*Goal: Synthesize all skills into a complete portfolio piece.*

---

## The Capstone Project

### Overview

The Shadow Project is the culmination of the AI Operator Curriculum. You'll take a real process you've observed, analyze it, design an AI-augmented future state, build a working prototype, and present a business case.

### Project Phases

**Phase A: Select and Document (Week 1)**

Choose a process from:
- An internship or part-time job
- A student organization you're part of
- A personal workflow that frustrates you
- A hypothetical business process (with clear scope)

Document the current state:
- Who is involved?
- What triggers the process?
- What are the steps?
- What are the pain points?
- What does it cost (time, errors, frustration)?

**Phase B: Design (Week 2)**

Apply Phase 2 skills:
- Decompose into atomic operations
- Design role-based workflow
- Determine human-in-the-loop placement
- Define quality gates and guardrails

Deliverable: Complete workflow design document

**Phase C: Build (Week 3)**

Apply Phase 3 skills:
- Build a working prototype (no-code)
- Connect AI to real actions
- Implement error handling
- Document the automation

Deliverable: Working automation with documentation

**Phase D: Analyze and Present (Week 4)**

Apply Phase 4 skills:
- Calculate ROI
- Assess risks
- Develop adoption plan
- Create executive presentation

Deliverable: Strategic recommendation + presentation

### Final Submission

```markdown
# Shadow Project: [Process Name]

## Part 1: Current State Analysis
[From Phase A]

## Part 2: Workflow Design
[From Phase B]

## Part 3: Implementation
[From Phase C - include screenshots, links to automation]

## Part 4: Business Case
[From Phase D]

## Part 5: Reflection
- What worked well?
- What would you do differently?
- What did you learn?
- How will you apply this going forward?
```

### Evaluation Criteria

| Dimension | Weight | Excellent | Adequate | Needs Work |
|-----------|--------|-----------|----------|------------|
| **Problem Selection** | 10% | Real, meaningful process | Reasonable scope | Too simple or vague |
| **Current State Analysis** | 15% | Thorough, quantified pain points | Documented but surface-level | Incomplete |
| **Workflow Design** | 20% | Complete, follows curriculum frameworks | Reasonable design | Missing key elements |
| **Working Prototype** | 25% | Functions reliably, handles errors | Works but needs refinement | Doesn't work |
| **Business Case** | 20% | Quantified ROI, clear recommendation | Some analysis | No business justification |
| **Presentation** | 10% | Clear, compelling, professional | Adequate communication | Unclear or unprofessional |

---

## Portfolio Assembly

Upon completing all labs and the capstone, you should have:

1. **Phase 1**: Prompt Library (10+ effective prompts with annotations)
2. **Phase 2**: Workflow Design Document
3. **Phase 3**: Working Automation (documented)
4. **Phase 4**: Strategic Recommendation Memo
5. **Capstone**: Shadow Project (complete package)

This portfolio demonstrates:
- AI literacy and effective prompting
- Process thinking and workflow design
- No-code implementation capability
- Business and strategic reasoning
- End-to-end project execution

**Presentation tip**: Create a simple website or PDF portfolio that showcases these artifacts with brief explanations of what each demonstrates.
