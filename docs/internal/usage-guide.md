# Signal Forge Usage Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API keys**:
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

3. **Initialize user config**:
   ```bash
   forge init
   # Edit ~/.signal-forge/config.json to set your author, persona, company
   ```

4. **Generate content**:
   ```bash
   forge generate deck --input recap.md --format pptx,html
   ```

## Commands

### Initialize Configuration

```bash
forge init
```

Creates `~/.signal-forge/config.json` with fields:
- `author` — your name (used in voice instructions)
- `persona` — your role/title
- `company` — your organization
- `defaultMode` — fallback content mode (default: `advisory`)
- `perspective` — writing perspective: `consultant`, `internal`, or `neutral`

### Generate Content

```bash
forge generate <type> [options]
```

**Content Types**:
- `deck` — Strategic slide deck
- `pov` — Short-form strategy POV (800-1200 words)
- `paper` — Long-form strategy paper (3000-8000 words)
- `guide` — User guide
- `reference` — Quick reference document
- `tutorial` — Step-by-step tutorial

**Options**:
| Flag | Description |
|------|-------------|
| `-i, --input <file>` | Input file (meeting notes, recap, etc.) |
| `-o, --output <file>` | Output file path |
| `-p, --provider <provider>` | AI provider: openai, anthropic, google, perplexity |
| `-f, --format <formats>` | Output formats (comma-separated): word, pdf, pptx, slides, html |
| `-t, --theme <theme>` | Presentation theme for PPTX (e.g. signal-forge, dark) |
| `--audience <audience>` | Target audience |
| `--product <product>` | Product name (for documentation) |
| `--no-edit` | Skip editor review (use ghost writer + copywriter only) |

### Agentic Generation

```bash
forge agent generate <type> [options]
```

**Additional Options**:
| Flag | Description |
|------|-------------|
| `--mode <mode>` | Force content mode: thought-leadership, architecture, advisory, documentation |
| `--research` | Enable research agent |
| `--iterate` | Enable feedback loop with iterative refinement |
| `--max-iterations <n>` | Max feedback iterations (default: 5) |
| `--memory` | Enable session persistence |

### Theme Management

```bash
forge themes list
```

## Examples

### Generate a Deck

```bash
# From meeting recap with default theme
forge generate deck --input meeting-recap.md --format pptx,html

# With specific provider and theme
forge generate deck --input recap.md --provider anthropic --theme dark --format pptx
```

### Generate a POV

```bash
# Short-form strategy POV
forge generate pov --input notes.txt --format word,pdf

# For executive audience
forge generate pov --input context.md --audience executive --format word
```

### Generate Documentation

```bash
# User guide
forge generate guide --input product-notes.md --product "My Product"

# Tutorial
forge generate tutorial --input workflow-notes.md --format html

# Quick reference
forge generate reference --input cli-docs.md
```

### Agentic Generation with Research

```bash
# Research-backed deck with iterative refinement
forge agent generate deck --input strategy-notes.md --research --iterate --max-iterations 3
```

## Output Formats

| Format | Flag values | Notes |
|--------|-------------|-------|
| Word | `word`, `docx` | Microsoft Word document |
| PDF | `pdf` | PDF document |
| PowerPoint | `pptx`, `powerpoint` | Themed PPTX presentation |
| Google Slides | `slides`, `googleslides` | Requires credentials |
| HTML | `html`, `web`, `webpage` | Interactive for decks, formatted for docs |

**Default formats by type**:
- `deck` → pptx, html
- Documentation types → html
- All others → word, pdf, html

## Configuration

### Environment Variables (`.env`)

```env
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key
PERPLEXITY_API_KEY=your_key
DEFAULT_AI_PROVIDER=anthropic
GOOGLE_SLIDES_CREDENTIALS_PATH=path/to/credentials.json
FORGE_COMPANY=override_company_name
```

### User Config (`~/.signal-forge/config.json`)

```json
{
  "author": "Your Name",
  "persona": "your role",
  "company": "Your Company",
  "defaultMode": "advisory",
  "perspective": "consultant",
  "fonts": {
    "primary": "https://use.typekit.net/YOUR_KIT.css",
    "secondary": "https://use.typekit.net/YOUR_KIT.css"
  }
}
```

## Tips

1. **Input Quality**: Better input = better output. Include context, stakeholder concerns, and key questions.

2. **Provider Selection**:
   - Anthropic (Claude) — Best for strategic thinking
   - OpenAI (GPT-4) — Good general purpose
   - Google (Gemini) — Strong for technical content
   - Perplexity — Best for research-heavy content

3. **Mode Override**: Use `--mode` to force a specific content mode when the classifier might pick the wrong one.

4. **Perspective**: Set `perspective` in your config to match your role:
   - `consultant` — external advisor ("you" / "your organization")
   - `internal` — team member ("we" / "our team")
   - `neutral` — no perspective framing

5. **Iteration**: If output doesn't match expectations, try:
   - Different provider
   - More detailed input context
   - Explicit `--mode` flag
   - Adjusting audience parameter
