# Signal Forge Quick Reference Card - Input Context

## Document Purpose
Create a concise, scannable quick reference card for Signal Forge. This should be a "cheat sheet" that users can keep handy while using the tool. Focus on commands, options, and quick tips.

## Target Audience
Users who already understand Signal Forge basics and need quick command reference.

---

## SIGNAL FORGE QUICK REFERENCE

### Installation and Setup

```bash
# Clone and install
git clone <repo>
npm install

# Configure API keys
cp .env.example .env
# Edit .env with your API keys:
# - ANTHROPIC_API_KEY (recommended)
# - OPENAI_API_KEY
# - GOOGLE_API_KEY
# - PERPLEXITY_API_KEY
```

---

### Basic Commands

```bash
# Generate content
forge generate <type> --input <file> [options]

# Types: deck, pov, paper, brief, architecture, adr, roadmap

# Agentic workflow
forge agent generate <type> --input <file> [options]

# Research only
forge agent research "<topic>" --output context.json

# Publish only
forge agent publish <file> --format <formats>
```

---

### Common Options

| Option | Short | Description |
|--------|-------|-------------|
| --input | -i | Input file path |
| --output | -o | Output file/directory |
| --provider | -p | AI provider (anthropic, openai, google, perplexity) |
| --format | -f | Output formats (comma-separated) |
| --mode | -m | Content mode (thought-leadership, architecture, advisory) |
| --audience | | Target audience |
| --no-edit | | Skip editor review |

### Agentic Options

| Option | Description |
|--------|-------------|
| --research | Enable research agent before production |
| --iterate | Enable feedback loop until voice approval |
| --max-iterations | Maximum revision iterations (default: 5) |
| --memory | Enable long-term memory persistence |
| --verbose | Show detailed progress |

---

### Content Types Quick Reference

| Type | Mode | Best For | Typical Output |
|------|------|----------|----------------|
| deck | Advisory | Client presentations | 10-15 slides |
| brief | Advisory | Executive summaries | 1-3 pages |
| roadmap | Advisory | Strategic timelines | 5-10 pages |
| pov | Thought Leadership | Opinion pieces | 800-1200 words |
| paper | Thought Leadership | Long-form articles | 3000-8000 words |
| architecture | Architecture | System design docs | 15-30 pages |
| adr | Architecture | Decision records | 1-2 pages |

---

### Output Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| pptx | .pptx | PowerPoint presentations |
| docx | .docx | Word documents (editable) |
| pdf | .pdf | Final distribution |
| html | .html | Web pages, interactive decks |
| markdown | .md | Version control, platforms |
| slides | URL | Google Slides (needs credentials) |

---

### Mode Detection

Signal Forge auto-detects mode from input. Override with `--mode`:

**Triggers Advisory Mode**:
- Words: recommend, strategy, stakeholder, investment, roadmap
- Audience: executives, leadership, board

**Triggers Architecture Mode**:
- Words: system, API, database, component, deployment
- Audience: engineers, developers, architects

**Triggers Thought Leadership Mode**:
- Words: I think, exploring, reflecting, questioning
- Structure: observations, open questions

---

### Voice Score Guide

| Score | Status | Action |
|-------|--------|--------|
| 7-10 | Approved | Ready to use |
| 5-6.9 | Review | Consider --iterate |
| <5 | Issues | Check mode/input |

---

### Quick Examples

```bash
# Meeting notes to strategy deck
forge generate deck -i meeting-recap.md -f pptx,html

# Technical design to architecture doc
forge generate architecture -i design-notes.md -m architecture -f html,pdf

# Observations to thought piece
forge generate pov -i observations.md -m thought-leadership -f html

# Full agentic workflow with research
forge agent generate deck -i context.md --research --iterate -f pptx

# Research a topic first
forge agent research "AI governance 2024" -o research.json
```

---

### Provider Recommendations

| Provider | Strengths | Best For |
|----------|-----------|----------|
| Anthropic (Claude) | Strategic thinking, voice | Advisory, Thought Leadership |
| OpenAI (GPT-4) | General purpose | Technical, mixed content |
| Google (Gemini) | Long documents | Papers, architecture |
| Perplexity | Web research | Research-heavy content |

---

### Troubleshooting Quick Fixes

**Wrong tone?**
→ Use explicit `--mode` flag

**Low voice score?**
→ Add `--iterate` flag
→ Add more context to input

**No output?**
→ Check API keys in .env
→ Verify input file exists

**Missing diagrams?**
→ Architecture describes diagrams in text
→ Use Excalidraw to visualize

---

### Input Tips

**Good input includes**:
- Meeting context (who, what, when)
- Key decisions made
- Open questions
- Stakeholder concerns
- Constraints and requirements

**Advisory mode input**:
- Business context
- Stakeholder quotes
- Budget/timeline constraints
- Success criteria

**Architecture mode input**:
- Technical requirements
- Non-functional requirements
- Existing constraints
- Integration points

**Thought Leadership input**:
- Personal observations
- Questions you're exploring
- What changed your thinking
- Experiences that shaped your view

---

### Keyboard Shortcuts (Interactive HTML)

| Key | Action |
|-----|--------|
| → / Space | Next slide |
| ← | Previous slide |
| F | Fullscreen |
| Esc | Exit fullscreen |
| Home | First slide |
| End | Last slide |

---

### File Structure

```
project/
├── .env              # API keys
├── input/            # Your input files
│   └── meeting-recap.md
├── output/           # Generated content
│   ├── decks/
│   ├── povs/
│   └── papers/
└── .forge/
    └── memory.json   # Long-term memory (if enabled)
```

---

### Common Workflows

**1. Meeting → Deck**
```bash
# Capture notes
# Clean up to markdown
forge generate deck -i notes.md -f pptx,html
```

**2. Research → Paper**
```bash
forge agent research "topic" -o research.json
forge agent generate paper -i notes.md --research --iterate -f pdf
```

**3. Design → Architecture**
```bash
forge generate architecture -i design-session.md -m architecture -f html,pdf
```

**4. Observations → POV**
```bash
forge generate pov -i observations.md -m thought-leadership -f html
```

---

### Getting Help

```bash
# Show all commands
forge --help

# Show command options
forge generate --help
forge agent --help
forge agent generate --help
```

---

Keep this reference handy. For detailed examples, see the Use Cases Guide.
