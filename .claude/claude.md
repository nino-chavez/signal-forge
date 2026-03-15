# Signal Forge - Project Instructions

## Project Overview

Signal Forge is a strategic content generation system that produces high-fidelity text (emails, Word docs, PDFs) and slides (PowerPoint/Google Slides) using multiple AI providers.

**Tech Stack**: Node.js, TypeScript, CLI tool

---

## Content Taxonomy (CRITICAL)

Signal Forge supports **four content modes** with distinct voice, structure, and workflows. **Selecting the correct mode is essential** for quality output.

Reference: `/docs/voice/content-taxonomy.md`

### Mode 1: Thought Leadership
**Use for**: Blog posts, opinion pieces, reflections, POVs exploring ideas
**Voice**: Narrative, provisional, question-led, show-the-work
**Guide**: `/docs/voice/thought-leadership-voice.md`

### Mode 2: Solution Architecture
**Use for**: Technical architecture docs, ADRs, specs, technical decks
**Voice**: Precise, definitive, diagram-heavy, reference-grade
**Guide**: `/docs/voice/solution-architecture-voice.md`

### Mode 3: Executive Advisory
**Use for**: Strategy decks, executive briefs, roadmaps, recommendations
**Voice**: Confident consultant, outcome-focused, pattern-recognizing
**Guide**: `/docs/voice/executive-advisory-voice.md`

### Mode 4: Documentation
**Use for**: User guides, tutorials, quick references, technical documentation
**Voice**: Instructional, direct, user-focused, copy-paste ready
**Guide**: `/docs/voice/documentation-voice.md`

### Mode Selection

1. **Explicit**: User specifies `--mode thought-leadership|architecture|advisory|documentation`
2. **Output type**: Map output to default mode (see taxonomy)
3. **Content signals**: Classify based on keywords and patterns
4. **Default**: Executive Advisory (safest for client work)

Reference: `/src/content/classifier/content-classifier.ts`

---

## Voice Principles by Mode

### Thought Leadership Voice
1. **Open with tension or questions**, never with thesis statements
2. **Show the work**, not just conclusions
3. **Include self-interrogation** without self-doubt
4. **End provisionally** ("Here's what I think today")
5. **Use intentional fragments** for rhythm
6. **Avoid corporate jargon** and academic distance
7. **Ground in actual experience**, not theory

### Solution Architecture Voice
1. **Lead with conclusions**, not questions
2. **Be definitive**: "The system uses X" not "Here's where I've landed"
3. **Complete sentences**, no fragments
4. **Diagrams over prose**
5. **Reference-grade precision** (implementable from documentation)
6. **No provisional language** ("I think", "perhaps", "for now")
7. **Structured templates** (arc42, C4, ADR)

### Executive Advisory Voice
1. **Lead with business outcomes**, not technical details
2. **Confident recommendations**: "I recommend..." not "You might consider..."
3. **Pattern recognition**: "I've seen this across retail, manufacturing..."
4. **Ground in client context**: Reference actual conversations
5. **Structured clarity**: Scannable headers, tables, bullets
6. **Consultant perspective**: External advisor, not internal team

### Documentation Voice
1. **Lead with user benefit**: What will they accomplish?
2. **Use imperative verbs**: "Run," "Install," "Configure" - not "You should run"
3. **Numbered steps** for all procedures
4. **Tables over paragraphs** for options and commands
5. **Code blocks generously**: Copy-paste ready
6. **Direct "you" address**: Talk to the user
7. **No provisional language**: This isn't thought leadership

---

## Workflows by Mode

Workflows are registry-driven. The CLI and production agent look up the workflow for a mode via `getWorkflowForMode()` instead of hardcoding role chains.

### Standard Workflow (Thought Leadership, Architecture, Advisory)
```
Raw Input → Ghost Writer → Copywriter → Editor → Final
```

### Documentation Workflow
```
Raw Input → Documentation Writer → Final
```

Custom workflows can be registered via `registerWorkflow()`. See `/docs/guides/extensibility.md`.

Reference: `/docs/voice/role-definitions.md`, `/src/presets/workflows/`

---

## Content Types and Default Modes

| Output Type | Default Mode | Description |
|-------------|--------------|-------------|
| `post`, `article` | Thought Leadership | Blog/opinion content |
| `pov` | Thought Leadership | Short-form strategy POV (800-1200 words) |
| `paper` | Thought Leadership | Long-form thought leadership (3000-8000 words) |
| `architecture` | Solution Architecture | Full solution design document |
| `adr` | Solution Architecture | Architecture Decision Record |
| `tech-deck` | Solution Architecture | Technical architecture presentation |
| `spec` | Solution Architecture | Technical specification |
| `deck` | Executive Advisory | Strategic slide deck |
| `brief` | Executive Advisory | Executive brief (1-3 pages) |
| `roadmap` | Executive Advisory | Strategic implementation roadmap |
| `guide` | Documentation | User guide, getting started guide |
| `reference` | Documentation | Quick reference, command reference |
| `tutorial` | Documentation | Step-by-step tutorial |
| `whitepaper` | (Classify by content) | Can be any mode |

---

## Templates

### Thought Leadership
- No rigid template; follow structural patterns in voice guide
- Evolution Pattern, Question-First Hook, Compare/Contrast

### Solution Architecture
- `/templates/architecture/adr-template.md` - Architecture decisions
- `/templates/architecture/architecture-deck-template.md` - Tech presentations
- arc42 structure for full documents (see solution-architecture-guide.md)

### Executive Advisory
- SCR (Situation-Complication-Resolution)
- Before-After-Breakthrough
- Recommendation Stack

### Documentation
- User Guide: Overview → Quick Start → Concepts → Features → Examples → Troubleshooting
- Tutorial: Goal → Prerequisites → Steps → Verification → Next Steps
- Reference: Commands Table → Options Table → Examples → Troubleshooting

---

## Usage

```bash
# Thought Leadership
npm run generate post --input observations.md
npm run generate pov --input notes.txt --provider claude

# Solution Architecture
npm run generate architecture --input meeting-notes.md --output solution-design.md
npm run generate adr --input decision-context.md
npm run generate tech-deck --input architecture.md

# Executive Advisory
npm run generate deck --input recap.md --output deck.pptx
npm run generate brief --input meeting-notes.md
npm run generate roadmap --input strategy-session.md

# Documentation
npm run generate guide --input product-notes.md
npm run generate reference --input cli-docs.md
npm run generate tutorial --input workflow-notes.md

# Explicit mode override
npm run generate deck --mode architecture --input tech-context.md
```

---

## Quality Checklists

### Before Generating Content
- [ ] Correct mode identified (thought-leadership, architecture, advisory, documentation)
- [ ] Appropriate voice guide referenced
- [ ] Input contains sufficient context for the mode

### Thought Leadership Quality
- [ ] Opens with tension or question
- [ ] Shows evolution of thinking
- [ ] Ends provisionally
- [ ] No corporate jargon

### Solution Architecture Quality
- [ ] Includes appropriate C4 diagrams
- [ ] All decisions in ADR format
- [ ] No provisional language
- [ ] Specifications are implementable

### Executive Advisory Quality
- [ ] Clear recommendation stated early
- [ ] Business outcomes lead
- [ ] Grounded in client context
- [ ] Scannable structure

### Documentation Quality
- [ ] Opens with user benefit statement
- [ ] All procedures use numbered steps
- [ ] Code blocks are copy-paste ready
- [ ] Tables used for options/commands
- [ ] No provisional or exploratory language
- [ ] Troubleshooting section included

---

## Configuration

### API Keys (`.env`)
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `PERPLEXITY_API_KEY`
- `DEFAULT_AI_PROVIDER` (default: anthropic)
- `FORGE_COMPANY` (override company name)

### User Config (`~/.signal-forge/config.json`)

Run `forge init` to create. Fields:
- `author` — your name (used in voice instructions)
- `persona` — your role/title
- `company` — your organization name
- `defaultMode` — fallback mode when classifier has no signal (default: `advisory`)
- `perspective` — writing perspective: `consultant` | `internal` | `neutral`

---

## Registry & Preset System

Signal Forge separates **engine** (registries, pipelines, exporters) from **presets** (modes, voices, workflows, templates). This enables custom content modes without modifying core code.

### Registries (`src/core/registries/`)

All registries follow the same Map-based pattern as the theme registry: `register()`, `get()`, `list()`.

| Registry | Purpose | Key functions |
|----------|---------|---------------|
| **Mode** | Content mode definitions with classification signals | `registerMode()`, `getModeForContentType()`, `getAllModes()` |
| **Voice** | Per-mode voice instructions + validation rules | `registerVoice()`, `getVoiceInstructionsFromRegistry()` |
| **Workflow** | Role chains per mode | `registerWorkflow()`, `getWorkflowForMode()` |
| **Template** | Content structure skeletons | `registerTemplate()`, `getTemplateForType()` |
| **Theme** | Presentation themes (PPTX) | `registerTheme()`, `getTheme()` |

### Presets (`src/presets/`)

Built-in presets are registered at startup via `registerBuiltInPresets()` (called in `src/cli/index.ts`).

- `src/presets/modes/` — 4 mode definitions with keyword/audience/structure signals
- `src/presets/voices/` — 4 voice definitions with instructions + check rules + bonus checks
- `src/presets/workflows/` — standard (3-pass) and documentation (1-pass) workflows
- `src/presets/templates/` — deck, POV, paper structure templates

### Extensibility

- `ContentMode` is `string` (not a union type) — custom modes work without type assertions
- Register custom modes/voices/workflows at runtime before content generation
- Perspective is configurable: `consultant` | `internal` | `neutral`
- See `/docs/guides/extensibility.md` for full guide

---

## Project Structure

```
signal-forge/
├── src/
│   ├── cli/           # CLI interface
│   ├── core/          # Types, utilities, and registries
│   │   ├── types/     # Domain-specific type definitions
│   │   ├── registries/# Mode, voice, workflow, template registries
│   │   └── utils/     # File utilities, slugs
│   ├── content/       # Content processing
│   │   ├── voice/     # Voice validation (delegates to voice registry)
│   │   ├── classifier/# Content classification (uses mode registry)
│   │   ├── templates/ # Content templates and parsers
│   │   └── design-system/ # Presentation themes
│   ├── pipeline/      # Production pipeline
│   │   ├── roles/     # Ghost Writer, Copywriter, Editor, Doc Writer
│   │   ├── agents/    # Orchestrator, Production, Research agents
│   │   └── memory/    # Session and long-term memory
│   ├── output/        # Output generation
│   │   ├── exporters/ # PPTX, DOCX, PDF, HTML exporters
│   │   └── publishers/# Local file, CMS publishers
│   ├── providers/     # AI provider integrations
│   ├── presets/       # Built-in preset definitions
│   │   ├── modes/     # 4 content mode definitions
│   │   ├── voices/    # 4 voice definitions
│   │   ├── workflows/ # Standard + documentation workflows
│   │   └── templates/ # Deck, POV, paper templates
│   └── tools/         # Tool registry
├── docs/
│   ├── voice/         # Voice guides by content mode
│   ├── design-system/ # Design system documentation
│   ├── guides/        # User-facing documentation + extensibility guide
│   ├── internal/      # Development reference docs
│   └── curriculum/    # Training materials
├── templates/         # Markdown templates for generation
│   ├── architecture/  # ADR, architecture deck templates
│   └── governance/    # Playbook templates
├── projects/          # Client work (gitignored)
└── .claude/
    └── skills/        # Claude skills (references symlinked)
```

---

## Development

```bash
npm run build    # Build TypeScript
npm run dev      # Run in development mode
npm run generate # Generate content
```

---

## Common Mistakes to Avoid

### Mode Mismatches

| Mistake | Impact | Correction |
|---------|--------|------------|
| Using blog voice for architecture docs | Prose-heavy, unimplementable output | Switch to architecture mode |
| Using architecture voice for strategy decks | Too technical for executives | Switch to advisory mode |
| Using advisory voice for technical specs | Lacks precision for implementation | Switch to architecture mode |
| Using blog voice for user guides | Exploratory, not instructional | Switch to documentation mode |
| Using advisory voice for tutorials | Too high-level, not actionable | Switch to documentation mode |

### Voice Contamination

| Contamination | Example | Fix |
|---------------|---------|-----|
| Provisional language in architecture | "I think we should use Lambda" | "The system uses Lambda" |
| Technical depth in executive brief | Full API specifications | Move to appendix or separate doc |
| Missing self-interrogation in thought leadership | Pure assertion without questioning | Add "But that raises a question..." |
| Exploratory language in documentation | "Here's where I've landed on..." | "Run this command to..." |
| Questions in user guides | "What if we tried X?" | "To do X, follow these steps:" |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Single voice guide, three-role workflow |
| 2.0 | 2024-11-25 | Three content modes, specialized roles, classification logic |
| 3.0 | 2024-12-30 | Four content modes - added Documentation mode with instructional voice |
| 4.0 | 2025-01-24 | Major reorganization: core/content/pipeline/output src structure, docs reorganized, templates at root, skill symlinks |
| 5.0 | 2025-03-15 | Engine/preset separation: registry pattern for modes, voices, workflows, templates. Configurable perspective. Extensible ContentMode (string). Personal defaults removed from config. |
