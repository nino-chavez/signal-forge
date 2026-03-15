# Documentation Voice Guide

## Purpose

This guide defines voice, structure, and quality standards for **Documentation** content in Signal Forge. Use this when generating user guides, tutorials, quick references, and technical documentation intended to instruct users.

**Critical Distinction**: Documentation voice is neither exploratory (thought leadership) nor authoritative-technical (architecture). It is **instructional, clear, and user-focused**. The reader should be able to follow steps, understand features, and accomplish tasks.

---

## Core Principles

### 1. Lead with What the User Needs

**Thought Leadership**: Opens with tension, questions, exploration
**Architecture**: Opens with decisions and facts
**Documentation**: Opens with what the user will accomplish

```markdown
❌ "There's a fascinating tension in how tools evolve to serve multiple audiences..."

❌ "The system implements a multi-mode content generation architecture based on..."

✅ "This guide shows you how to generate professional content from meeting notes in under 5 minutes."
```

### 2. Be Direct and Instructional

**Thought Leadership**: Provisional ("Here's where I've landed—for now")
**Architecture**: Authoritative ("The system uses...")
**Documentation**: Imperative and clear ("Run this command...")

```markdown
❌ "I think you might want to consider running the generate command."

❌ "The CLI interface provides a generate subcommand that accepts input parameters."

✅ "Run `forge generate deck --input notes.md` to create a presentation."
```

### 3. Use Numbered Steps for Procedures

**Thought Leadership**: Narrative flow with intentional fragments
**Architecture**: Complete technical specifications
**Documentation**: Numbered, scannable steps

```markdown
❌ "First you'll want to install. Then configure. Finally, run."

❌ "Installation requires npm package manager execution followed by environment configuration."

✅
1. Install dependencies: `npm install`
2. Copy the environment template: `cp .env.example .env`
3. Add your API keys to `.env`
4. Run your first command: `forge generate deck --input notes.md`
```

### 4. Tables Over Paragraphs for Reference

When listing options, commands, or configurations, use tables.

```markdown
❌ The format option accepts pptx for PowerPoint, docx for Word documents, pdf for PDF files, and html for web pages.

✅
| Format | Output | Use Case |
|--------|--------|----------|
| pptx | PowerPoint | Presentations |
| docx | Word | Editable documents |
| pdf | PDF | Final distribution |
| html | Web page | Interactive viewing |
```

### 5. Show Before You Tell

Lead with examples, then explain.

```markdown
❌ "The --mode flag overrides automatic mode detection and forces a specific content mode."

✅
```bash
forge generate deck --input notes.md --mode architecture
```
Use `--mode` to override automatic detection when your content needs a specific voice.
```

### 6. Use Code Blocks Generously

Documentation should be copy-paste friendly.

```markdown
❌ Run the forge generate command with deck as the type and your input file.

✅
```bash
forge generate deck --input meeting-recap.md
```
```

---

## Document Structure

### User Guide Structure

1. **Overview** - What this does and why it matters (2-3 sentences)
2. **Quick Start** - Get running in 60 seconds
3. **Core Concepts** - What users need to understand
4. **Features** - Detailed feature explanations
5. **Examples** - Real-world usage scenarios
6. **Troubleshooting** - Common issues and solutions

### Tutorial Structure

1. **Goal** - What you'll build/accomplish
2. **Prerequisites** - What you need before starting
3. **Steps** - Numbered, detailed steps
4. **Verification** - How to confirm success
5. **Next Steps** - Where to go from here

### Quick Reference Structure

1. **Commands** - All commands with brief descriptions
2. **Options** - Table of all options
3. **Examples** - Common command patterns
4. **Troubleshooting** - Quick fixes

---

## Voice Characteristics

### DO

- **Use active voice**: "Run the command" not "The command should be run"
- **Use second person**: "You can configure..." not "Users can configure..."
- **Be specific**: "Add your API key" not "Configure authentication"
- **Use present tense**: "This creates a file" not "This will create a file"
- **Include expected output**: Show what success looks like

### DON'T

- **No questions or tension**: This isn't thought leadership
- **No excessive technical depth**: This isn't architecture docs
- **No provisional language**: "You might want to..." → "To do this..."
- **No jargon without explanation**: Define terms on first use
- **No walls of text**: Break up content with headers, bullets, code blocks

---

## Quality Checklist

### Before Generating Documentation

- [ ] Clear target audience identified
- [ ] Purpose of document defined
- [ ] Key tasks/features to cover listed
- [ ] Examples and code snippets planned

### Documentation Quality Indicators

- [ ] Opens with user benefit, not feature description
- [ ] All procedures are numbered steps
- [ ] Code examples are copy-paste ready
- [ ] Tables used for options/commands/references
- [ ] No provisional or exploratory language
- [ ] Expected outputs shown where relevant
- [ ] Troubleshooting section included

---

## Examples by Type

### Good User Guide Opening

```markdown
## Signal Forge User Guide

Signal Forge transforms rough notes into polished professional content.
Feed it meeting recaps, get back presentation decks.
This guide covers installation, configuration, and daily usage.

### Quick Start

1. Install: `npm install`
2. Configure: `cp .env.example .env` and add your API keys
3. Generate: `forge generate deck --input notes.md`

Your first deck is ready in `output/decks/`.
```

### Good Tutorial Opening

```markdown
## Tutorial: Creating Your First Strategy Deck

**Goal**: Turn meeting notes into a professional presentation in 5 minutes.

**Prerequisites**:
- Signal Forge installed
- API key configured
- Meeting notes in a markdown file

### Step 1: Prepare Your Input
...
```

### Good Quick Reference Entry

```markdown
## Content Types

| Type | Mode | Best For |
|------|------|----------|
| deck | Advisory | Client presentations |
| pov | Thought Leadership | Opinion pieces |
| architecture | Architecture | System designs |

### Generate a Deck

```bash
forge generate deck --input recap.md --format pptx,html
```
```

---

## Anti-Patterns

### Don't Do This

```markdown
❌ "I've been thinking about how to explain Signal Forge, and here's where I've landed..."

❌ "There's a tension between simplicity and power in CLI tools..."

❌ "The system implements a sophisticated multi-provider architecture leveraging..."

❌ "You might want to consider running the installation script, though there are other approaches you could explore depending on your specific situation..."
```

### Do This Instead

```markdown
✅ "Signal Forge generates professional content from your notes. Here's how to get started."

✅ "Run `npm install` to install dependencies."

✅ "Three content modes are available: thought-leadership, architecture, and advisory."
```

---

## Voice Comparison Matrix

| Aspect | Thought Leadership | Architecture | Documentation |
|--------|-------------------|--------------|---------------|
| Opening | Question/tension | Decision/fact | User benefit |
| Tone | Exploratory | Definitive | Instructional |
| Structure | Narrative | Technical | Step-by-step |
| Language | Provisional | Precise | Imperative |
| Visuals | Minimal | Diagrams | Screenshots/code |
| Reader Role | Fellow thinker | Implementer | Doer |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-30 | Initial documentation voice guide |
