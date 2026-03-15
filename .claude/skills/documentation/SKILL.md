---
name: documentation
description: Generate user guides, tutorials, and quick references in instructional voice. Imperative verbs, numbered steps, tables, code blocks. Use when asked to write documentation, how-to guides, getting started guides, API references, or tutorials.
---

# Documentation Generator

Generate user-focused documentation — guides, tutorials, and references — in clear, instructional voice.

## When to Use This Skill

- Writing user guides or getting started guides
- Creating step-by-step tutorials
- Generating command references or API references
- Producing any instructional content where the reader needs to *do* something

## Voice: Documentation

**MANDATORY - Read `references/documentation-voice.md` completely for full voice specifications.**

### Core Voice Identity

| Characteristic | Description |
|----------------|-------------|
| Instructional | Tell the user what to do, not what to think |
| Direct | Imperative verbs: "Run," "Install," "Configure" |
| Structured | Numbered steps, tables, code blocks |
| Copy-paste ready | Code examples that work when pasted |
| User-focused | "You" address, leads with user benefit |

### Voice Markers

**Include:**
- Imperative verb openings ("Run this command", "Create a new file")
- Numbered steps for all procedures
- Tables for options, commands, parameters
- Code blocks with `bash` syntax highlighting
- Expected output shown after commands
- Troubleshooting section

**Avoid:**
- Questions or tension openings (thought leadership)
- Provisional language ("for now", "here's where I've landed")
- Exploratory or reflective framing
- Walls of text without structure
- Jargon without definition

## Document Structures

### User Guide

```markdown
## [Product/Feature] Guide

[One sentence: what this does and why it matters.]

### Quick Start

1. [First step]
2. [Second step]
3. [Third step]

### Core Concepts

#### [Concept 1]
[2-3 sentences. What it is, why it matters.]

### Features

#### [Feature 1]
[What it does, how to use it, example.]

### Examples

#### [Use Case 1]
```bash
[command]
```
[Brief explanation of what this does.]

### Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| [Error message] | [Why it happens] | [How to fix] |
```

### Tutorial

```markdown
## Tutorial: [What You'll Accomplish]

**Goal**: [One sentence outcome]

**Prerequisites**:
- [Requirement 1]
- [Requirement 2]

### Step 1: [Action]

[Brief context — 1 sentence max.]

```bash
[command]
```

**Expected output:**
```
[what the user should see]
```

### Step 2: [Action]
...

### Verify It Works

[How to confirm success.]

### Next Steps

- [Link or suggestion 1]
- [Link or suggestion 2]
```

### Quick Reference

```markdown
## [Product] Quick Reference

### Commands

| Command | Description |
|---------|-------------|
| `forge generate <type>` | Generate content |
| `forge init` | Initialize configuration |
| `forge themes list` | List available themes |

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-i, --input <file>` | Input file | (interactive prompt) |
| `-p, --provider <name>` | AI provider | anthropic |
| `-f, --format <formats>` | Output formats | varies by type |

### Examples

```bash
# Generate a deck
forge generate deck --input notes.md --format pptx,html

# Generate a tutorial
forge generate tutorial --input workflow.md
```

### Troubleshooting

| Issue | Fix |
|-------|-----|
| "No AI providers configured" | Add API key to `.env` |
| "Invalid content type" | Check `forge generate --help` for valid types |
```

## Output Formats

Documentation can be exported via the CLI:

```bash
# HTML (default for documentation)
forge generate guide --input notes.md

# Word document
forge generate guide --input notes.md --format word

# Multiple formats
forge generate guide --input notes.md --format html,word,pdf
```

## Quality Checklist

Before delivering documentation:

- [ ] Opens with what the user will accomplish (not feature description)
- [ ] All procedures use numbered steps
- [ ] Code examples are copy-paste ready and tested
- [ ] Tables used for options, commands, and comparisons
- [ ] No provisional or exploratory language
- [ ] Expected outputs shown where relevant
- [ ] Troubleshooting section included
- [ ] Direct "you" address throughout
- [ ] No unexplained jargon
