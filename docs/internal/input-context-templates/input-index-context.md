# Signal Forge Documentation Hub - Input Context

## Document Purpose
Create a landing page that serves as the main entry point for Signal Forge documentation. This should link to all available guides and provide a quick overview.

## Target Audience
All Signal Forge users looking for documentation.

---

## Welcome to Signal Forge

Signal Forge transforms your rough notes, meeting recaps, and observations into polished professional content. Whether you're creating strategy decks, technical architecture documents, or thought leadership pieces, Signal Forge applies the right voice and structure automatically.

---

## Documentation Guides

### Getting Started
**User Guide** - Complete introduction to Signal Forge
- What is Signal Forge?
- Three content modes explained
- Installation and configuration
- Basic commands and options
- Voice quality and iteration

Best for: New users wanting to understand Signal Forge

---

### Practical Examples
**Use Cases Guide** - Real-world examples with sample inputs and outputs
- Executive presentations from meeting notes
- Technical documentation from design sessions
- Thought leadership from observations
- Agentic workflows with research
- Multi-format publishing

Best for: Users looking for specific examples

---

### Output Reference
**Expected Outputs Gallery** - What you'll get from each content type
- Executive advisory outputs (decks, briefs, roadmaps)
- Solution architecture outputs (docs, ADRs, specs)
- Thought leadership outputs (POVs, papers)
- Quality indicators and voice scores
- Format-specific previews

Best for: Users evaluating Signal Forge or choosing content types

---

### Command Reference
**Quick Reference Card** - Cheat sheet for daily use
- All commands at a glance
- Common options table
- Content type quick reference
- Provider recommendations
- Troubleshooting tips

Best for: Experienced users needing quick command lookup

---

## Quick Start

```bash
# Install
npm install

# Configure (edit .env with your API keys)
cp .env.example .env

# Generate your first deck
forge generate deck --input meeting-notes.md --format pptx,html
```

---

## Content Modes at a Glance

| Mode | Use For | Voice | Output Types |
|------|---------|-------|--------------|
| **Executive Advisory** | Strategy, recommendations | Confident consultant | deck, brief, roadmap |
| **Solution Architecture** | Technical documentation | Precise, definitive | architecture, adr, spec |
| **Thought Leadership** | Ideas, opinions | Provisional, questioning | pov, paper, post |

---

## Why Signal Forge?

**Not another generic AI writer.** Signal Forge understands that:
- Blog voice doesn't work for architecture docs
- Technical detail overwhelms executives
- Strategy decks need confidence, thought pieces need questions

The right voice for the right content. Automatically.

---

## Getting Help

- **In-tool**: `forge --help` or `forge <command> --help`
- **Guides**: This documentation hub
- **Issues**: GitHub repository

---

Choose a guide above to get started, or jump straight to the Quick Reference if you know what you're looking for.
