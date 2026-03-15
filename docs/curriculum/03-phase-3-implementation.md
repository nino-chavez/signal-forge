# Phase 3: No-Code Implementation

## Building Working Solutions Without Writing Code

---

## Phase Overview

### WHY This Phase Matters

Workflow designs on paper don't create value. Implementation does. The barrier between "great idea" and "working system" used to require engineers. No longer.

No-code tools let you build real automation, connect real systems, and deliver real value — without writing a line of code.

**What goes wrong without implementation skills:**
- Beautiful workflow designs that never get built
- Dependence on engineering teams for simple automation
- Inability to prototype and validate ideas quickly
- Missed opportunities because "we don't have developer resources"

**What implementation skills unlock:**
- Build prototypes in hours, not weeks
- Demonstrate value before requesting engineering investment
- Automate your own work immediately
- Credibility as someone who ships, not just plans

### WHAT You'll Learn

| Module | Core Question | Key Outcome |
|--------|--------------|-------------|
| 3.1 Triggers and Actions | "How do automations run?" | Understand event-driven systems |
| 3.2 Tool Integration | "How do I connect AI to real systems?" | Build working integrations |
| 3.3 Data Flow Design | "How does information move?" | Design reliable data pipelines |
| 3.4 Error Handling | "What happens when things fail?" | Build resilient automation |

### HOW You'll Demonstrate Mastery

**Deliverable**: A **Working Automation** — a real system that connects AI to business tools, processes real data, and delivers useful output.

---

# Module 3.1: Triggers and Actions

## WHY: The Business Problem

Automation doesn't run continuously watching for things to do. It responds to events. Understanding triggers and actions is understanding how automation actually works.

### The Real-World Stakes

**Scenario**: You want AI to summarize every new support ticket.

**Without trigger understanding**:
- "AI should watch the inbox" — but how? Constantly polling? That's expensive and slow.
- Manual process: You check inbox, copy ticket, paste into ChatGPT, copy response. Still manual.

**With trigger understanding**:
- Trigger: "New email arrives in support inbox"
- Action: "AI summarizes email, posts summary to Slack channel"
- Implementation: 15 minutes in Zapier, runs forever.

---

## WHAT: Core Concepts

### The Trigger-Action Model

Every automation consists of:

```
TRIGGER (When this happens...)
    ↓
ACTION (Do this...)
    ↓
[Optional: More ACTIONS...]
```

**Example**:
```
TRIGGER: New row added to "Leads" spreadsheet
    ↓
ACTION 1: AI generates personalized email from template
    ↓
ACTION 2: Create draft in Gmail
    ↓
ACTION 3: Notify salesperson in Slack
```

### Types of Triggers

| Type | Description | Example |
|------|-------------|---------|
| **Webhook** | External system calls your automation | Stripe sends payment notification |
| **Schedule** | Time-based activation | Every Monday at 9am |
| **New Record** | Database/spreadsheet change | New row in Airtable |
| **Email** | Incoming email event | New email in specific inbox |
| **Form Submission** | User submits data | Typeform response received |
| **App Event** | Specific app action | New Slack message in channel |

### Types of Actions

| Type | Description | Example |
|------|-------------|---------|
| **AI Processing** | Send to AI, get response | Summarize text with ChatGPT |
| **Create Record** | Add data to system | Add row to spreadsheet |
| **Send Communication** | Outbound message | Send email, Slack message |
| **Update Record** | Modify existing data | Update CRM contact |
| **Conditional Logic** | Branch based on criteria | If amount > $1000, then... |
| **Delay** | Wait before next action | Wait 24 hours |

### Signal Forge Example: Tool Integration

Signal Forge's `tools/` directory shows how AI connects to external capabilities:

```
tools/
├── web-search.ts      # Perplexity-powered real-time search
├── document-reader.ts # Parse and extract from files
└── tool-registry.ts   # Discover and invoke tools
```

**The pattern**: AI doesn't "browse the web." It calls a web-search tool that returns structured results. AI doesn't "read files." It calls a document-reader tool that extracts content.

---

## HOW: Practical Application

### Exercise: Map Triggers and Actions

**Scenario**: Design automation for a job application tracker.

**Requirements**:
- When new application submitted, AI summarizes resume
- AI scores candidate fit (1-10)
- High-fit candidates (>7) get fast-tracked notification
- All candidates logged to tracking spreadsheet

**Task**: Identify triggers and actions.

**Solution**:

```
TRIGGER: New form submission (application received)
    ↓
ACTION 1: Extract resume file from submission
    ↓
ACTION 2: AI summarizes resume (experience, skills, education)
    ↓
ACTION 3: AI scores fit against job requirements (returns 1-10)
    ↓
FILTER: If score > 7
    │
    ├── YES: ACTION 4a: Send "high priority" Slack notification
    │
    └── NO: ACTION 4b: (continue to next action)
    ↓
ACTION 5: Add row to tracking spreadsheet
    (Name, Email, Score, Summary, Submission Date)
    ↓
ACTION 6: Send confirmation email to candidate
```

### The No-Code Tool Landscape

| Tool | Best For | Free Tier | AI Integration |
|------|----------|-----------|----------------|
| **Zapier** | Simple automations, huge app library | 100 tasks/month | ChatGPT built-in |
| **Make** | Complex logic, visual workflows | 1,000 ops/month | OpenAI, custom |
| **n8n** | Technical users, self-hosting | Unlimited (self-host) | Any API |
| **IFTTT** | Simple personal automation | Limited | Basic AI |
| **Pipedream** | Developer-friendly, code when needed | 10,000 invocations | Full flexibility |

---

## Key Takeaways

1. **Everything is trigger → action** — understand this model and you understand automation
2. **Triggers come from events, not polling** — efficient automation responds to changes
3. **Actions chain sequentially** — output of one becomes input of next
4. **Filters enable conditional logic** — not every input needs the same path

---

# Module 3.2: Tool Integration

## WHY: The Business Problem

AI that just "talks" is limited. AI that can "do" — send emails, update databases, search the web — is powerful.

Tool integration is how AI takes action in the real world.

### The Real-World Stakes

**AI without tools**:
> "Based on the customer's inquiry, I recommend sending an apology email with a 15% discount code."

You: *Manually write email, apply discount, send*

**AI with tools**:
> "I've drafted an apology email, applied a 15% discount to the order, and scheduled the email to send in 30 minutes. Would you like me to send now instead?"

You: "Yes, send now."

---

## WHAT: Core Concepts

### The Tool Calling Pattern

Modern AI doesn't just generate text — it can call functions:

```
User: "What's the weather in Chicago?"
    ↓
AI Decision: I need to call the weather tool
    ↓
Tool Call: get_weather(location="Chicago")
    ↓
Tool Response: {temp: 45, condition: "cloudy", wind: "12mph"}
    ↓
AI Response: "It's 45°F and cloudy in Chicago with 12mph winds."
```

### Signal Forge Example: Research Agent Tools

Signal Forge's research agent (`agents/research-agent.ts`) uses tools to gather context:

```typescript
// Conceptual tool usage
const tools = [
  {
    name: "web_search",
    description: "Search the web for current information",
    invoke: async (query: string) => await perplexitySearch(query)
  },
  {
    name: "read_document",
    description: "Extract content from uploaded documents",
    invoke: async (path: string) => await documentReader.parse(path)
  }
];

// Agent can decide which tools to use based on task
async research(topic: string) {
  // AI determines: "I need current market data"
  const searchResults = await tools.web_search(`${topic} market analysis 2024`);

  // AI determines: "I should incorporate the brief document"
  const briefContent = await tools.read_document("./client-brief.pdf");

  // Combines tool results with AI reasoning
  return synthesize(searchResults, briefContent);
}
```

### Common Tool Categories

| Category | Tools | Business Use |
|----------|-------|--------------|
| **Communication** | Gmail, Outlook, Slack, Teams | Automated messages |
| **Data** | Sheets, Airtable, Notion, databases | Store and retrieve information |
| **CRM** | Salesforce, HubSpot, Pipedrive | Customer management |
| **Calendar** | Google Calendar, Outlook Calendar | Scheduling |
| **Documents** | Google Docs, Dropbox, Box | File management |
| **Payments** | Stripe, PayPal, Square | Transaction data |
| **Custom APIs** | Any REST API | Whatever you need |

### Building Integrations

**In Zapier** (most accessible):

1. **Trigger**: Choose app and event (e.g., "New email in Gmail")
2. **Action**: Choose AI step ("ChatGPT: Generate text")
3. **Action**: Choose destination ("Google Sheets: Create row")
4. **Map fields**: Connect trigger data to action inputs
5. **Test**: Run with real data
6. **Publish**: Turn on automation

**The key insight**: You're not coding — you're drawing connections between existing capabilities.

---

## HOW: Practical Application

### Exercise: Build an AI-Powered News Summarizer

**Goal**: Automatically summarize industry news and deliver to Slack.

**Implementation Steps**:

1. **Create RSS feed or Google Alert for your industry**
   - Example: Google Alert for "artificial intelligence business applications"

2. **Set up Zapier automation**:
   ```
   TRIGGER: New item in RSS feed (or Google Alert)
       ↓
   ACTION 1: ChatGPT - Summarize
       Prompt: "Summarize this article in 3 bullet points,
                focusing on business implications: [article content]"
       ↓
   ACTION 2: Filter - Only if summary contains "relevant"
       (Optional: Add your own relevance check)
       ↓
   ACTION 3: Slack - Send message to channel
       Message: "📰 *[Article Title]*\n\n[Summary]\n\nSource: [URL]"
   ```

3. **Test with sample article**
4. **Refine prompt based on output quality**
5. **Turn on and let it run**

**Expected outcome**: Your Slack channel receives 3-5 AI-summarized articles per day, pre-filtered for relevance.

### Exercise: Connect Multiple Tools

**Scenario**: Build a lead qualification system.

**Requirements**:
- New leads from webform
- AI scores lead quality
- High-quality leads go to CRM
- All leads logged to spreadsheet
- Sales notified of hot leads

**Implementation**:

```
TRIGGER: New Typeform submission
    ↓
ACTION 1: ChatGPT - Score lead
    Input: Form responses
    Prompt: "Score this lead 1-10 based on:
            - Budget mentioned: [field]
            - Timeline: [field]
            - Company size: [field]
            Return JSON: {score: N, reasoning: '...'}"
    ↓
FILTER: Parse score from response
    ↓
ACTION 2: Google Sheets - Add row
    (All leads logged)
    ↓
FILTER: If score >= 7
    ├── YES:
    │     ACTION 3a: HubSpot - Create contact
    │         ↓
    │     ACTION 3b: Slack - Notify sales team
    │         "🔥 Hot lead: [Name] - Score: [Score]"
    │
    └── NO: (End - lead only in spreadsheet)
```

---

## Key Takeaways

1. **Tools extend AI from "talking" to "doing"** — real business value requires action
2. **No-code platforms are the connective tissue** — they link AI to your existing systems
3. **Start simple, add complexity** — get basic flow working before adding filters and branches
4. **Test with real data** — demo data often hides integration issues

---

# Module 3.3: Data Flow Design

## WHY: The Business Problem

Data is the fuel for AI automation. Bad data flow = bad automation. Understanding how information moves through your system is critical for reliability.

### The Real-World Stakes

**Scenario**: AI-generated reports showing wrong customer names.

**Root cause investigation**:
- Form collects "Full Name"
- CRM stores "First Name" + "Last Name" separately
- Integration mapped "Full Name" to "First Name" field
- Last name lost entirely
- AI used incomplete data

**Cost**: Embarrassing customer communications, lost trust, hours debugging.

---

## WHAT: Core Concepts

### Data Flow Components

```
SOURCE → TRANSFORMATION → DESTINATION
   │           │               │
   │           │               └── Where data ends up
   │           └── How data is modified
   └── Where data comes from
```

### Field Mapping

Connecting fields between systems:

| Source Field | Transformation | Destination Field |
|--------------|----------------|-------------------|
| `full_name` | Split on space | `first_name`, `last_name` |
| `signup_date` | Format as ISO | `created_at` |
| `inquiry_text` | AI summarize | `summary` |
| `[various]` | AI score | `lead_score` |

### Signal Forge Example: Export Pipeline

Signal Forge's `exporters/` show data transformation in action:

```
Generated Markdown Content
    ↓
[html-exporter.ts]  → HTML page with styling
[pptx-exporter.ts]  → PowerPoint presentation
[word-exporter.ts]  → Word document
[pdf-exporter.ts]   → PDF file
```

**Same source, multiple outputs** — each exporter transforms the data appropriately for its format.

### Data Types and Validation

| Type | Validation | Example Issue |
|------|------------|---------------|
| **Text** | Length, format | Truncated at 255 chars |
| **Numbers** | Range, precision | "1,000" vs 1000 vs "1000.00" |
| **Dates** | Format consistency | "Jan 5, 2024" vs "2024-01-05" |
| **Email** | Valid format | Typos, fake emails |
| **JSON** | Valid structure | Malformed AI output |

### The "Garbage In, Garbage Out" Principle

AI automation amplifies data quality issues:
- **Human process**: Person notices "John Doe" in wrong field, fixes it
- **Automated process**: AI happily uses wrong data, produces wrong output, sends to 1,000 customers

**Solution**: Validate at entry points, transform explicitly, verify before output.

---

## HOW: Practical Application

### Exercise: Design a Data Flow

**Scenario**: Customer feedback → AI analysis → Dashboard report

**Task**: Map the complete data flow.

**Solution**:

```
SOURCE: Customer Survey (Typeform)
├── Response ID (text)
├── Customer Email (email)
├── Satisfaction Score (number, 1-5)
├── Open Feedback (text, max 1000 chars)
└── Submission Date (datetime)

    ↓ [VALIDATION]
    - Email format valid
    - Score in range 1-5
    - Feedback not empty

TRANSFORMATION 1: AI Sentiment Analysis
├── Input: Open Feedback
├── Prompt: "Analyze sentiment and extract themes..."
├── Output: {sentiment: 'positive'|'negative'|'neutral',
│            themes: ['price', 'quality', ...],
│            urgency: 1-10}
└── Validation: JSON structure, required fields present

TRANSFORMATION 2: Enrichment
├── Input: Customer Email
├── Action: Lookup in CRM
├── Output: {customer_tier, lifetime_value, account_manager}
└── Fallback: If not found, use defaults

DESTINATION 1: Google Sheets (Raw Data)
├── Columns: All fields, flattened
├── Format: One row per response
└── Purpose: Audit trail

DESTINATION 2: Dashboard (Aggregated)
├── Metrics: Avg score, sentiment distribution, trending themes
├── Refresh: Daily
└── Purpose: Executive visibility

DESTINATION 3: Slack Alert (Conditional)
├── Trigger: Urgency >= 8 OR Sentiment == 'negative' AND tier == 'enterprise'
├── Channel: #customer-success-alerts
└── Purpose: Immediate action on critical feedback
```

### Exercise: Handle Data Type Mismatches

**Scenario**: AI returns unstructured text, but you need structured data.

**Problem**:
```
AI Response: "I'd rate this lead as a 7 out of 10 because they
mentioned budget and timeline, though company size is unclear."
```

**You need**:
```json
{"score": 7, "has_budget": true, "has_timeline": true, "company_size": "unknown"}
```

**Solution — Structured Output Prompting**:
```
Analyze this lead and return ONLY a JSON object with no other text:
{
  "score": <number 1-10>,
  "has_budget": <true|false>,
  "has_timeline": <true|false>,
  "company_size": <"small"|"medium"|"enterprise"|"unknown">
}

Lead information:
[lead data here]
```

**Fallback — Parse with Filter**:
- Extract number from text with regex
- Apply defaults for missing fields
- Log parsing errors for review

---

## Key Takeaways

1. **Map the complete data flow** — source to destination, every transformation
2. **Validate at boundaries** — catch issues when data enters your system
3. **Transform explicitly** — don't assume systems will handle format differences
4. **Design for AI's structured output** — tell AI exactly what format you need

---

# Module 3.4: Error Handling

## WHY: The Business Problem

Automation fails. APIs time out. AI hallucinates. Data is malformed. The difference between a prototype and a production system is how it handles failure.

### The Real-World Stakes

**No error handling**:
- AI API times out
- Automation stops silently
- No one notices for 3 days
- 3 days of customer emails unprocessed

**With error handling**:
- AI API times out
- Automation retries 3 times
- After 3 failures, sends alert to Slack: "⚠️ Email automation failed - manual review needed"
- Logged for debugging

---

## WHAT: Core Concepts

### Failure Modes

| Failure Type | Example | Impact |
|--------------|---------|--------|
| **API Timeout** | OpenAI takes >30 seconds | Automation stalls |
| **Rate Limiting** | Too many requests | Automation blocked |
| **Invalid Data** | Email field contains phone number | Downstream failures |
| **AI Hallucination** | AI invents customer name | Wrong data propagates |
| **Integration Down** | Salesforce maintenance | Can't save records |
| **Authentication** | Token expired | All actions fail |

### Error Handling Strategies

| Strategy | When to Use | Implementation |
|----------|-------------|----------------|
| **Retry** | Transient failures | Retry 3x with exponential backoff |
| **Fallback** | Primary unavailable | Use backup provider or cached data |
| **Skip** | Non-critical step | Continue workflow, log skip |
| **Alert** | Human needed | Send notification, pause workflow |
| **Queue** | High volume | Store for later processing |

### Signal Forge Example: Iteration as Error Recovery

Signal Forge's iteration controller (`agents/iteration-controller.ts`) handles quality failures:

```typescript
// When content quality fails threshold
if (score < THRESHOLD) {
  // Don't fail — iterate with feedback
  const revisedContent = await revise(content, feedback);

  // Track improvement
  if (revisedContent.score <= previousScore) {
    // Not improving — stop iteration, use best version
    return bestVersion;
  }

  // Continue iterating
  iterations++;
}
```

**Key pattern**: Failure isn't always "stop" — sometimes it's "try differently."

### Monitoring and Alerting

What to monitor in AI automation:

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| **Success rate** | < 95% | Investigate failures |
| **Latency** | > 30 seconds | Check API performance |
| **AI quality scores** | Average < 7.0 | Review prompts |
| **Cost** | > daily budget | Pause or optimize |
| **Error rate by type** | Spikes | Fix specific issue |

---

## HOW: Practical Application

### Exercise: Design Error Handling for News Summarizer

**Original automation** (from Module 3.2):
```
TRIGGER: New RSS item
ACTION 1: AI Summarize
ACTION 2: Post to Slack
```

**Task**: Add error handling.

**Enhanced automation**:
```
TRIGGER: New RSS item
    ↓
ACTION 1: AI Summarize
    ├── Success → Continue
    ├── Timeout → Retry up to 3x with 30s delay
    ├── Rate Limited → Queue for later (delay 5 min)
    └── Failed 3x →
          ├── Post original article link to Slack (fallback)
          └── Log error for review
    ↓
ACTION 2: Validate AI Response
    ├── Has 3 bullet points → Continue
    ├── Malformed → Re-prompt with stricter format
    └── Gibberish → Skip article, log for review
    ↓
ACTION 3: Post to Slack
    ├── Success → End
    └── Failed →
          ├── Retry 2x
          └── Email backup notification
```

### Exercise: Build a Resilient Lead Scorer

**Task**: Add comprehensive error handling to lead qualification system.

**Error scenarios and responses**:

| Scenario | Detection | Response |
|----------|-----------|----------|
| AI timeout | > 30 seconds | Retry 3x, then assign default score (5) with flag |
| Invalid JSON from AI | Parse fails | Re-prompt with strict JSON instruction |
| AI returns score outside 1-10 | Validation | Clamp to range, log warning |
| CRM unavailable | Connection error | Queue lead for later sync, continue with spreadsheet |
| Duplicate lead | Email already exists | Update existing record instead of create |
| Empty form submission | Required fields missing | Skip, notify form owner |

**Implementation in Zapier**:

```
TRIGGER: New form submission
    ↓
FILTER: All required fields present?
    ├── NO → Send error notification, end
    │
    └── YES ↓

ACTION 1: ChatGPT - Score lead
    ├── Success → Parse JSON, validate score
    │     ├── Valid → Continue
    │     └── Invalid → Set score = 5, flag for review
    │
    └── Error →
          ├── Retry path (built-in Zapier retry)
          └── After 3 fails → Score = 5, flag for manual review
    ↓

ACTION 2: Google Sheets - Log lead
    ├── Success → Continue
    └── Error → Critical alert (data loss risk)
    ↓

FILTER: Score >= 7?
    ├── NO → End (lead logged only)
    │
    └── YES ↓

ACTION 3: HubSpot - Create contact
    ├── Success → Continue
    ├── Duplicate → Update existing, continue
    └── Error →
          ├── Add to retry queue
          └── Still create Slack notification
    ↓

ACTION 4: Slack - Notify sales
    ├── Success → End
    └── Error → Email backup notification
```

### The "Graceful Degradation" Principle

When perfect isn't possible, provide something useful:

| Full Capability | Degraded Capability |
|-----------------|---------------------|
| AI-scored lead with analysis | Default score + "needs manual review" flag |
| Personalized email from AI | Template email with merge fields only |
| Real-time Slack notification | Queued email digest |
| Full CRM integration | Spreadsheet logging (manual sync later) |

**The goal**: Never lose data, always notify humans when quality degrades.

---

## Key Takeaways

1. **Plan for failure** — it's not if, it's when
2. **Match strategy to failure type** — retry transients, alert on critical, skip non-essential
3. **Degrade gracefully** — partial capability beats complete failure
4. **Monitor and alert** — you can't fix what you don't see

---

# Phase 3 Summary

## What You've Learned

| Module | Core Concept | Business Application |
|--------|--------------|---------------------|
| 3.1 Triggers and Actions | Event-driven automation | Build responsive systems |
| 3.2 Tool Integration | Connecting AI to real systems | Make AI "do" not just "talk" |
| 3.3 Data Flow Design | Information movement and transformation | Ensure data quality and consistency |
| 3.4 Error Handling | Resilient automation | Production-ready systems |

## Phase 3 Deliverable: Working Automation

Build a real automation that:

### Requirements

1. **Solves a Real Problem**
   - Addresses an actual pain point (yours or organization you're part of)
   - Replaces or augments a manual process
   - Provides measurable value

2. **Includes AI Processing**
   - At least one step uses AI (summarization, scoring, generation, etc.)
   - AI output is properly validated
   - Structured output where appropriate

3. **Connects Multiple Tools**
   - At least 3 different tools/services
   - Proper field mapping between systems
   - Data flows correctly through pipeline

4. **Handles Errors**
   - Retry logic for transient failures
   - Fallback for critical paths
   - Alerting when human intervention needed

5. **Is Documented**
   - Flow diagram showing triggers, actions, data flow
   - Error handling matrix
   - Instructions for monitoring and maintenance

### Suggested Projects

| Project | Difficulty | Tools | AI Use |
|---------|------------|-------|--------|
| **News Summarizer** | Beginner | RSS + ChatGPT + Slack | Summarization |
| **Lead Qualifier** | Intermediate | Form + ChatGPT + Sheets + CRM | Scoring |
| **Meeting Prep Bot** | Intermediate | Calendar + ChatGPT + Email | Research synthesis |
| **Customer Feedback Analyzer** | Intermediate | Survey + ChatGPT + Dashboard | Sentiment + themes |
| **Content Repurposer** | Advanced | Blog + ChatGPT + Social platforms | Multi-format generation |

### Documentation Format

```markdown
# Automation: [Name]

## Problem Solved
[What manual process does this replace? What value does it provide?]

## Flow Diagram
[Visual or text diagram of triggers → actions]

## Tools Used
- [Tool 1]: [Purpose]
- [Tool 2]: [Purpose]
- [AI step]: [What it does]

## Data Flow
| Source | Field | Transformation | Destination |
|--------|-------|----------------|-------------|
| ... | ... | ... | ... |

## Error Handling
| Error Type | Detection | Response |
|------------|-----------|----------|
| ... | ... | ... |

## Monitoring
- How to check if it's working
- Key metrics to watch
- Alert conditions

## Maintenance
- What might break
- How to update
- Dependencies to track
```

## Readiness Check

Before moving to Phase 4, you should be able to:

- [ ] Explain the trigger-action model of automation
- [ ] Set up a working automation in Zapier or similar tool
- [ ] Connect AI (ChatGPT/Claude) to no-code workflows
- [ ] Map data flow between systems
- [ ] Design error handling for common failure modes
- [ ] Document an automation for handoff to others

---

**Next**: Phase 4 — AI Strategy & Economics
