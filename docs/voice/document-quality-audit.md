# Document Quality Audit Framework

## Purpose

Quality gate for all Signal Forge content. Apply these four checks to every document before sharing, regardless of voice mode. Derived from iterative document reviews across product strategy, technical feasibility, and CX initiative documents.

---

## The Four Checks

### 1. "So What?" Placement

**The test:** Read the first sentence of every section. Does it state the takeaway, or describe what the section contains?

| Failing | Passing |
|---------|---------|
| "This section outlines the competitive landscape..." | "We're launching Shopify-identical rates without Shopify's self-service infrastructure." |
| "The following table shows billing case data..." | "91% of billing cases are resolvable without support." |
| "This document assesses how to integrate..." | "An AI chat agent can be added with three new files." |

**The fix:** Move the conclusion to the first sentence. Use the evidence to support it, not to build up to it.

**Why it matters:** Executive readers decide in the first sentence whether to keep reading. If the takeaway is in paragraph 3, they've already moved on — or worse, they've formed their own conclusion from the evidence and it's different from yours.

---

### 2. Mental Math

**The test:** Look at every table and data presentation. Can the reader see the conclusion, or must they calculate it?

| Failing | Passing |
|---------|---------|
| 7-row table where the reader must add rows to realize "91% is automatable" | 2-row table: "91% automatable / 9% human-required" |
| Five benchmarks with different metrics (traffic reduction %, cost reduction %, resolution time %) mixed in one table | One headline number ("25-65% reduction") with the table as supporting evidence |
| A list of items with percentages that sum to >100% without explanation | Percentages that clearly represent different dimensions, with the methodology stated |

**The fix:** Add a summary row, a headline number, or a lead-in sentence that states the conclusion the table supports. If percentages don't add up, explain why.

**Why it matters:** If the reader has to do math, they either won't (and miss the point) or will (and might get a different answer than you intended).

---

### 3. Logic Gaps

**The test:** Read the document in sequence. Does any section contradict or confuse an earlier section?

Common gaps:
- **The categorization paradox:** Showing a detailed category breakdown then stating most data is uncategorized — if it's uncategorized, how was it categorized? State the methodology.
- **Overlapping coverage:** Priority 1 addresses 59%, Priority 2 addresses 82% (which includes Priority 1's 59%). Is the total 82% or 141%? Make the stacking explicit.
- **Title vs. recommendation mismatch:** Title says "before surcharges" but recommendation says "simultaneous." Align them.
- **Inconsistent tables:** Same data presented differently in two sections. A reader comparing them loses trust.

**The fix:** State methodology for any derived data. Show how priorities stack (not overlap). Use one canonical version of any repeated table. Align titles with conclusions.

**Why it matters:** A single logic gap makes a skeptical reader question every other number in the document.

---

### 4. Scannable Format

**The test:** Is there any paragraph longer than 3 sentences that contains multiple distinct data points? Could it be bullets or a table?

| Failing | Passing |
|---------|---------|
| "In December 2025, Comcast moved to all-in pricing for TV plans after 15+ years of fee-layering backlash, lawsuits (Washington State AG won a $9.1M judgment for 445,000+ consumer protection violations), and regulatory action. The FCC's broadband nutrition labels (mandatory since April 2024) now require transparent fee disclosure. The FTC's junk fee rule (effective May 2025) currently covers only ticketing and lodging but signals broader enforcement." | Three bullets: Comcast (Dec 2025, $9.1M judgment), FCC labels (Apr 2024), FTC rule (May 2025, broader trajectory) |
| A "burning platform" argument buried in a dense paragraph between two tables | A blockquote or callout that visually separates the key argument |

**The fix:** If a paragraph contains 3+ distinct data points, convert to bullets. If it contains a critical argument, give it visual separation (blockquote, callout, or its own section).

**Why it matters:** Dense paragraphs get skimmed. Key points buried in prose are functionally invisible.

---

## Cross-Document Checks

When a project produces multiple documents, also check:

### Redundancy
- Is the same table repeated across documents with slightly different wording? Use one canonical version and reference it.
- Is the same argument made in multiple places? Choose one home and reference from others.

### Reading Order
- Is there guidance on which document to read first?
- Do documents reference each other, or do they assume the reader has no context?

### Audience Consistency
- Does a leadership document contain engineering details? (Move them to the technical doc.)
- Does an engineering document contain strategic framing? (That's fine — engineers need context too.)

---

## When to Apply

- **Before sharing any document externally** — run all four checks
- **After merging content from multiple sources** — logic gaps are most common here
- **After AI-generated content** — AI tends to bury the lede and use dense paragraphs
- **After multiple revision rounds** — accumulated edits create redundancy and inconsistency

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-15 | Initial framework derived from P&P CX initiative document iterations |
