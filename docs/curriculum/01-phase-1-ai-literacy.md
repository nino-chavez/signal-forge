# Phase 1: AI Literacy & Mechanics

## The Physics of AI — Understanding What You're Working With

---

## Phase Overview

### WHY This Phase Matters

You wouldn't manage a fleet of trucks without understanding fuel costs, maintenance schedules, and load capacity. Similarly, you can't effectively deploy AI without understanding its fundamental mechanics.

**What goes wrong without AI literacy:**
- Assigning impossible tasks to AI (expecting it to "know" things outside its training)
- Wasting money on unnecessary compute (using expensive models for simple tasks)
- Missing obvious applications (not recognizing where AI excels)
- Trusting outputs that should be verified (not understanding hallucination patterns)

**What AI literacy unlocks:**
- Accurate scoping of AI projects
- Credibility in technical conversations
- Better vendor evaluation
- Faster problem diagnosis when things go wrong

### WHAT You'll Learn

| Module | Core Question | Key Outcome |
|--------|--------------|-------------|
| 1.1 Economics of Intelligence | "What does AI actually cost?" | Calculate if a task is worth automating |
| 1.2 Context and Memory | "What can AI remember?" | Design information flows correctly |
| 1.3 Providers and Models | "Which AI should I use?" | Match tools to tasks |
| 1.4 Prompting as Management | "How do I get good output?" | Communicate effectively with AI |

### HOW You'll Demonstrate Mastery

**Deliverable**: A **Prompt Library** — a curated collection of effective prompts for your chosen business domain, with annotations explaining why each prompt works.

---

# Module 1.1: The Economics of Intelligence

## WHY: The Business Problem

Every AI call costs money. Not much — often fractions of a cent — but costs add up at scale. More importantly, **understanding cost structure reveals what AI is actually doing**.

When someone says "AI is expensive" or "AI is cheap," they're usually wrong because they don't understand the economics.

### The Real-World Stakes

**Scenario**: Your company wants to use AI to summarize 10,000 customer support tickets per month.

- **Naive approach**: Use GPT-4 for everything → $500-1,000/month
- **Smart approach**: Use GPT-3.5 for initial triage, GPT-4 only for complex cases → $50-100/month

The difference? Understanding that different tasks require different levels of intelligence.

---

## WHAT: Core Concepts

### Tokens: The Currency of AI

**Definition**: A token is roughly 4 characters or ¾ of a word. AI models process text as tokens, and you pay per token.

| Text | Approximate Tokens |
|------|-------------------|
| "Hello" | 1 token |
| "The quick brown fox" | 4 tokens |
| One page of text (~500 words) | ~650 tokens |
| A 10-page document | ~6,500 tokens |

**Why this matters**: You pay for both input tokens (what you send) and output tokens (what AI generates). Output tokens typically cost 2-4x more than input tokens.

### Inference vs. Training

| | Training | Inference |
|-|----------|-----------|
| **What** | Teaching a model new things | Using an existing model |
| **Who does it** | AI companies, researchers | You, every time you use ChatGPT |
| **Cost** | Millions of dollars | Fractions of cents |
| **Frequency** | Rare (months/years) | Constant (every API call) |

**The key insight**: You will almost never train a model. You will constantly run inference. Understanding inference costs is your job; training costs are someone else's problem.

### The Cost Hierarchy

```
Expensive ←――――――――――――――――――――――――――――→ Cheap

GPT-4/Claude Opus    GPT-3.5/Claude Haiku    Local/Open Source
(~$30/M tokens)      (~$0.50/M tokens)       (compute only)
     ↓                      ↓                       ↓
Complex reasoning     Simple tasks            High volume, simple
Strategic analysis    Summarization           Commodity tasks
```

### Signal Forge Example: Provider Economics

Look at Signal Forge's `providers/` directory. It supports multiple AI providers:

```
providers/
├── openai.ts      # GPT models - good balance of cost/capability
├── anthropic.ts   # Claude - excellent for long documents
├── gemini.ts      # Google - large context windows
└── perplexity.ts  # Web search + generation
```

**Why multiple providers?** Different tasks have different requirements:
- **Long document analysis** → Gemini (1M token context) or Claude (200K context)
- **Quick summarization** → GPT-3.5 or Claude Haiku (cheap, fast)
- **Real-time information** → Perplexity (web search built-in)
- **Complex reasoning** → GPT-4 or Claude Opus (expensive but capable)

---

## HOW: Practical Application

### Exercise: Calculate the "Cost of Intelligence"

**Scenario**: You want to use AI to analyze customer reviews for a product launch.

**Given**:
- 5,000 customer reviews
- Average review: 100 words (~130 tokens)
- You want a 50-word summary of each (~65 tokens output)
- GPT-4: $30 per million input tokens, $60 per million output tokens
- GPT-3.5: $0.50 per million input tokens, $1.50 per million output tokens

**Calculate**:

1. Total input tokens: 5,000 × 130 = 650,000 tokens
2. Total output tokens: 5,000 × 65 = 325,000 tokens

**GPT-4 Cost**:
- Input: 0.65M × $30 = $19.50
- Output: 0.325M × $60 = $19.50
- **Total: $39.00**

**GPT-3.5 Cost**:
- Input: 0.65M × $0.50 = $0.33
- Output: 0.325M × $1.50 = $0.49
- **Total: $0.82**

**The decision**: Is the quality difference worth 47x the cost? For simple summarization, probably not. For nuanced sentiment analysis, maybe.

### The Profitability Question

Before any AI project, ask:

> "If this costs $X per [unit], and we process Y [units], does the value created exceed the cost?"

**Framework**:
```
Value Created = (Time Saved × Hourly Rate) + (Errors Avoided × Error Cost) + (New Capabilities × Revenue)
Cost = (Tokens × Price) + (Integration Time × Developer Rate) + (Maintenance)

ROI = Value Created / Cost
```

---

## Key Takeaways

1. **Tokens are the unit of AI cost** — learn to estimate them
2. **Different models have different price/performance ratios** — match the tool to the task
3. **Output costs more than input** — be specific about what you need
4. **The "Cost of Intelligence" question separates operators from users** — always ask "is this worth it?"

---

# Module 1.2: Context and Memory

## WHY: The Business Problem

AI doesn't "know" your company. Every conversation starts fresh. If you don't understand this, you'll waste time repeating information, get inconsistent results, and wonder why AI "forgot" what you told it.

### The Real-World Stakes

**Scenario**: You're using AI to draft customer emails. You carefully explain your company's tone, product details, and customer history. Works great.

Next day, you start a new chat. AI has no idea who you are. All that context? Gone.

**The cost**: Hours spent re-explaining context, inconsistent outputs, frustrated users who think AI is "broken."

---

## WHAT: Core Concepts

### Context Window: AI's "Working Memory"

**Definition**: The context window is the maximum amount of text an AI can "see" at once — including your prompt AND its response.

| Model | Context Window | Equivalent To |
|-------|---------------|---------------|
| GPT-3.5 | 16K tokens | ~12,000 words (24 pages) |
| GPT-4 | 128K tokens | ~96,000 words (192 pages) |
| Claude 3 | 200K tokens | ~150,000 words (300 pages) |
| Gemini 1.5 | 1M tokens | ~750,000 words (1,500 pages) |

**Critical insight**: Once you exceed the context window, information is lost. The AI literally cannot see it.

### Session Memory vs. Long-Term Memory

| Type | Lasts | Scope | Example |
|------|-------|-------|---------|
| **Session Memory** | One conversation | What you've said in this chat | "Earlier you mentioned..." |
| **Long-Term Memory** | Across conversations | Stored externally, retrieved as needed | Company knowledge base |
| **Training Knowledge** | Forever (until retrained) | What the model learned during training | "Python is a programming language" |

**The key limitation**: Most AI tools only have session memory. When you close the chat, it's gone.

### RAG: Retrieval-Augmented Generation

**Definition**: RAG is a technique that connects AI to external data sources, allowing it to "know" information beyond its training.

**How it works**:
```
User Query → Search Company Database → Retrieve Relevant Documents →
    → Inject Documents into Context → AI Generates Response
```

**Why this matters for business**: RAG is how AI "learns" your company's information without expensive retraining. It's how chatbots know about your specific products, policies, and customers.

### Signal Forge Example: Memory System

Signal Forge implements memory in `memory/`:

```
memory/
├── memory-system.ts   # Interface for storing/retrieving context
├── long-term-store.ts # Persistent storage across sessions
└── index.ts
```

**What this enables**:
- Research context persists across content generation sessions
- Previous outputs inform new generations
- Pattern recognition across multiple projects

---

## HOW: Practical Application

### Exercise: Context Window Planning

**Scenario**: You need to analyze a 50-page contract and compare it to your company's standard terms.

**Given**:
- Contract: ~25,000 words (~32,500 tokens)
- Standard terms: ~10,000 words (~13,000 tokens)
- Your instructions: ~500 words (~650 tokens)
- Buffer for response: ~2,000 tokens

**Total needed**: ~48,150 tokens

**Analysis**:
- GPT-3.5 (16K): ❌ Won't fit
- GPT-4 (128K): ✅ Fits comfortably
- Claude 3 (200K): ✅ Room to spare

**The strategic choice**: Use a model with sufficient context, or break the task into chunks.

### Chunking Strategy

When content exceeds context windows, break it into pieces:

```
Large Document
     ↓
Split into sections
     ↓
Analyze each section separately
     ↓
Synthesize section analyses into final output
```

**Trade-off**: Chunking loses cross-section context. The AI analyzing Section 5 doesn't "know" what was in Section 2.

---

## Key Takeaways

1. **Context windows are hard limits** — plan around them
2. **Sessions are ephemeral** — don't expect AI to remember previous conversations
3. **RAG connects AI to your data** — it's how AI "knows" your business
4. **Chunking is a necessary compromise** — understand what's lost when you split

---

# Module 1.3: Providers and Models

## WHY: The Business Problem

Not all AI is created equal. Using GPT-4 for everything is like hiring a PhD to do data entry — expensive and wasteful. Using GPT-3.5 for everything is like asking an intern to do brain surgery — cheap but dangerous.

### The Real-World Stakes

**Scenario**: Your team evaluates AI vendors. One offers "GPT-4 powered" at $500/month. Another offers "Claude" at $200/month. Which is better?

**Without this knowledge**: You guess based on price or brand recognition.
**With this knowledge**: You evaluate based on your specific use case — context needs, reasoning requirements, speed requirements, and cost structure.

---

## WHAT: Core Concepts

### The Major Providers

| Provider | Models | Strengths | Weaknesses |
|----------|--------|-----------|------------|
| **OpenAI** | GPT-4, GPT-3.5 | Best all-around, huge ecosystem | Expensive at scale |
| **Anthropic** | Claude 3 (Opus, Sonnet, Haiku) | Long context, safety, nuanced writing | Smaller ecosystem |
| **Google** | Gemini (Ultra, Pro, Flash) | Massive context (1M), multimodal | Less refined for text |
| **Perplexity** | pplx-* models | Real-time web search built-in | Less control, citation focus |
| **Open Source** | Llama, Mistral | Free, private, customizable | Requires infrastructure |

### Model Tiers Within Providers

Most providers offer tiered models:

```
Capability
    ↑
    │  ┌─────────────┐
    │  │   Opus      │  Complex reasoning, highest quality
    │  │   (GPT-4)   │  $$$
    │  └─────────────┘
    │  ┌─────────────┐
    │  │   Sonnet    │  Good balance, most use cases
    │  │   (GPT-4o)  │  $$
    │  └─────────────┘
    │  ┌─────────────┐
    │  │   Haiku     │  Fast, cheap, simple tasks
    │  │   (GPT-3.5) │  $
    │  └─────────────┘
    └──────────────────→ Speed / Cost Efficiency
```

### Matching Models to Tasks

| Task Type | Recommended Tier | Why |
|-----------|------------------|-----|
| Simple Q&A, summarization | Haiku/GPT-3.5 | Speed matters, complexity doesn't |
| Content writing, analysis | Sonnet/GPT-4o | Balance of quality and cost |
| Complex reasoning, strategy | Opus/GPT-4 | Quality matters more than cost |
| Real-time information | Perplexity | Web search required |
| Very long documents | Claude/Gemini | Large context windows |

### Signal Forge Example: Provider Selection

Signal Forge's provider system (`providers/ai-provider.ts`) implements a unified interface:

```typescript
// All providers implement the same interface
interface AIProviderInterface {
  generateContent(prompt: string, options: Options): Promise<string>
  // ...
}
```

**Why this architecture?** It allows:
1. Swapping providers without changing code
2. Selecting the right provider for each task
3. Falling back to alternatives when one fails

The CLI lets users choose: `--provider anthropic` or `--provider openai`

---

## HOW: Practical Application

### Exercise: Provider Selection Matrix

Create a decision matrix for a hypothetical company:

| Use Case | Volume | Quality Need | Speed Need | Recommended |
|----------|--------|--------------|------------|-------------|
| Customer email drafts | 1000/day | Medium | High | GPT-3.5 |
| Legal contract review | 10/week | High | Low | GPT-4 |
| Real-time chat support | 500/day | Medium | Very High | Claude Haiku |
| Market research reports | 5/month | Very High | Low | Claude Opus |
| Social media monitoring | Continuous | Low | High | Perplexity |

### Vendor Evaluation Checklist

When evaluating AI vendors, ask:

1. **Which model(s) do they use?** (The underlying capability)
2. **What's the pricing structure?** (Per token? Per seat? Flat rate?)
3. **What's the context limit?** (Can it handle your documents?)
4. **What's the latency?** (For real-time use cases)
5. **What's the uptime guarantee?** (For production systems)
6. **Where is data processed?** (For compliance)
7. **Can you switch providers?** (Avoid lock-in)

---

## Key Takeaways

1. **No single model is best for everything** — match tool to task
2. **Provider choice affects cost, capability, and compliance** — evaluate holistically
3. **Tiered models exist within providers** — don't pay for capability you don't need
4. **Abstraction enables flexibility** — design systems that can swap providers

---

# Module 1.4: Prompting as Management

## WHY: The Business Problem

AI is like a brilliant but literal-minded consultant. Give vague instructions, get vague results. Give precise instructions, get precise results.

The difference between "AI doesn't work for us" and "AI transformed our process" is often just prompt quality.

### The Real-World Stakes

**Bad prompt**: "Write a marketing email"
**Result**: Generic, unusable content

**Good prompt**: "Write a 150-word email for existing customers announcing our 20% summer sale on outdoor furniture. Tone: friendly but urgent. Include one clear CTA. Mention the sale ends Friday."
**Result**: Usable content that might only need minor edits

**The difference**: The second prompt is specific about audience, length, offer, tone, and action. This specificity is a skill.

---

## WHAT: Core Concepts

### The Anatomy of an Effective Prompt

```
┌─────────────────────────────────────────────┐
│ ROLE: Who the AI should be                  │
│ "You are a senior financial analyst..."     │
├─────────────────────────────────────────────┤
│ CONTEXT: Background information             │
│ "The company is a mid-size retailer..."     │
├─────────────────────────────────────────────┤
│ TASK: What you want done                    │
│ "Analyze these three scenarios..."          │
├─────────────────────────────────────────────┤
│ FORMAT: How to structure the output         │
│ "Present as a table with columns for..."    │
├─────────────────────────────────────────────┤
│ CONSTRAINTS: Limits and requirements        │
│ "Keep under 500 words. Use only data from...│
└─────────────────────────────────────────────┘
```

### Chain of Thought (CoT): Making AI Show Its Work

**The problem**: AI often jumps to conclusions, making errors invisible.

**The solution**: Force it to reason step-by-step.

**Without CoT**:
> "What's the market size for luxury pet food in Austin?"
> "The market size is approximately $45 million."

**With CoT**:
> "Estimate the market size for luxury pet food in Austin. Think step by step: first estimate population, then pet ownership rates, then luxury segment percentage, then average spend."

> "Step 1: Austin metro population ~2.3 million
> Step 2: Dog ownership ~40%, Cat ownership ~25% → ~920K dog owners, ~575K cat owners
> Step 3: Luxury segment typically 15-20% of pet owners → ~138K-184K luxury pet owners
> Step 4: Average luxury pet food spend ~$100/month → $1,200/year
> Estimate: 150K × $1,200 = $180 million annually"

**The difference**: You can audit each step. The $45M answer was wrong; the $180M answer shows its work.

### Personas: Changing How AI Thinks

Different personas produce different outputs because they change the AI's framing:

| Persona | Output Characteristics |
|---------|----------------------|
| "Senior McKinsey consultant" | Structured, framework-heavy, executive-focused |
| "Skeptical CFO" | Risk-focused, numbers-driven, questioning |
| "Creative director at an ad agency" | Bold, unconventional, emotion-focused |
| "FDA compliance officer" | Regulatory, cautious, citation-heavy |

### Structured Output: Getting Machine-Readable Results

When AI output feeds into other systems, request structured formats:

**Instead of**: "Tell me about these customers"
**Use**: "Analyze these customers. Return a JSON array with fields: customer_id, segment (high/medium/low), risk_score (1-10), recommended_action"

```json
[
  {"customer_id": "C001", "segment": "high", "risk_score": 2, "recommended_action": "upsell"},
  {"customer_id": "C002", "segment": "low", "risk_score": 8, "recommended_action": "retention_call"}
]
```

### Signal Forge Example: Role-Based Prompting

Signal Forge's `roles/` directory implements distinct personas:

**Ghost Writer** (`ghost-writer.ts`):
- High temperature (0.8) — more creative
- Focus on generating initial ideas
- Produces raw, exploratory content

**Copywriter** (`copywriter.ts`):
- Medium temperature (0.6) — balanced
- Focus on refinement and polish
- Produces publication-ready prose

**Editor** (`editor.ts`):
- Focus on validation, not generation
- Checks against voice guidelines
- Produces scores and feedback

**Why separate roles?** Each optimizes for a different part of the process. Trying to do everything in one prompt produces mediocre results.

---

## HOW: Practical Application

### Exercise: The Persona Stress Test (Business Lab 1)

**Scenario**: You're a Product Manager launching a new energy drink.

**Task**:
1. Open Claude or ChatGPT
2. Use this prompt for three different personas:

**Persona 1 - Angry Gen-Z Customer**:
```
You are an 18-year-old who is extremely skeptical of corporate marketing
and has strong opinions about authenticity, sustainability, and health.
You're quick to call out "cringe" marketing and have zero patience for
corporate speak.

I'm launching a new energy drink called "Spark" targeted at young
professionals. The drink has natural caffeine, no sugar, and comes
in recyclable cans. Price point is $3.50.

Critique this product idea. What would make you roll your eyes?
What might actually get you interested? Be honest and harsh if needed.
```

**Persona 2 - Conservative 60-year-old Investor**:
```
You are a 60-year-old investor with 30 years of experience in consumer
packaged goods. You've seen countless energy drink launches, most of
which failed. You're skeptical of trends and focus on fundamentals:
margins, distribution, and sustainable competitive advantage.

I'm seeking investment for a new energy drink called "Spark" targeted
at young professionals. Natural caffeine, no sugar, recyclable cans,
$3.50 price point.

Evaluate this from an investment perspective. What concerns you?
What would you need to see before investing? Be direct about the risks.
```

**Persona 3 - FDA Compliance Officer**:
```
You are an FDA compliance specialist reviewing marketing claims for
beverages. You're specifically looking for claims that could be
considered misleading, unsubstantiated health claims, or regulatory
violations.

Review this product concept: An energy drink called "Spark" that
claims to have "natural caffeine" and "clean energy." Marketing
copy says it "boosts focus without the crash."

What claims concern you? What documentation would you require?
What language changes would you recommend?
```

**Deliverable**: A side-by-side comparison table of the three critiques, with a synthesis of what you learned from each perspective.

### Exercise: Chain of Thought Audit (Business Lab 2)

**Scenario**: You need to estimate a market size, but you can't trust AI's raw answers.

**Task**:
1. Ask directly: "What's the market size for luxury dog food in Austin, TX?"
2. Note the answer (likely a confident but unverified number)
3. Ask again with CoT:

```
Estimate the market size for premium/luxury dog food in Austin, Texas.

Think through this step-by-step:
1. First, establish Austin metro population
2. Then, estimate dog ownership rate (cite source if known)
3. Then, estimate what percentage of dog owners buy premium/luxury food
4. Then, estimate average annual spend on premium dog food
5. Calculate the market size
6. Note your confidence level and key assumptions

Show all your work and math at each step.
```

4. Identify where the AI made assumptions you'd want to verify
5. Create a corrected logic flow, noting which numbers you'd research further

**Deliverable**: A market sizing worksheet showing the CoT methodology, with your own annotations on which assumptions seem reasonable vs. need verification.

---

## Key Takeaways

1. **Prompts are instructions** — specificity determines output quality
2. **Chain of Thought reveals reasoning** — always verify logic, not just conclusions
3. **Personas change perspective** — use them to stress-test ideas
4. **Structured output enables automation** — request formats that machines can parse
5. **Role separation improves quality** — don't try to do everything in one prompt

---

# Phase 1 Summary

## What You've Learned

| Module | Core Concept | Business Application |
|--------|--------------|---------------------|
| 1.1 Economics | Tokens, cost tiers | Calculate AI ROI, choose efficient models |
| 1.2 Context | Windows, memory, RAG | Design information flows, plan for scale |
| 1.3 Providers | Model matching | Evaluate vendors, avoid over-spending |
| 1.4 Prompting | CoT, personas, structure | Get useful outputs, verify quality |

## Phase 1 Deliverable: Prompt Library

Create a curated collection of 10+ effective prompts for your chosen business domain:

**Requirements**:
- Each prompt uses proper structure (Role, Context, Task, Format, Constraints)
- At least 3 prompts use Chain of Thought methodology
- At least 3 prompts use different personas
- At least 2 prompts request structured output
- Each prompt includes annotation explaining why it works

**Format**:
```markdown
## Prompt: [Name]

### Use Case
[When to use this prompt]

### The Prompt
[Actual prompt text]

### Why It Works
[Explanation of techniques used]

### Example Output
[Sample of what this produces]
```

## Readiness Check

Before moving to Phase 2, you should be able to:

- [ ] Estimate token counts for a document
- [ ] Calculate approximate AI costs for a use case
- [ ] Explain why different models exist and when to use each
- [ ] Describe what RAG is and why it matters
- [ ] Write prompts that use Chain of Thought
- [ ] Use personas to get different perspectives
- [ ] Request structured output for automation

---

**Next**: Phase 2 — Workflow Engineering
