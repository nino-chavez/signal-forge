# Extensibility Guide

## Overview

Signal Forge separates **engine** (registries, pipelines, exporters) from **presets** (modes, voices, workflows, templates). This lets you add custom content modes, voice definitions, workflows, and templates without modifying core code.

All registries live in `src/core/registries/` and follow the same Map-based pattern: `register()`, `get()`, `list()`. Built-in presets live in `src/presets/` and are registered at startup via `registerBuiltInPresets()`.

## Architecture

```
src/core/registries/       # Engine — Map-based registries
  types.ts                 # Shared type definitions
  mode-registry.ts         # Content mode registry
  voice-registry.ts        # Voice definition registry
  workflow-registry.ts     # Workflow chain registry
  template-registry.ts     # Template structure registry
  index.ts                 # Barrel export

src/presets/               # Presets — registered at startup
  modes/                   # ContentModeDefinition objects
  voices/                  # VoiceDefinition objects
  workflows/               # WorkflowDefinition objects
  templates/               # TemplateDefinition objects
  index.ts                 # registerBuiltInPresets()
```

Custom modes work without type assertions because `ContentMode` is `string`, not a union type. The `BuiltInContentMode` union exists only for internal type safety in preset definitions.

---

## Content Mode Registry

A mode defines classification signals and default content type mappings. The classifier scores input against all registered modes and picks the highest match.

### Type: `ContentModeDefinition`

```typescript
interface ContentModeDefinition {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // When to use this mode
  defaultFor: string[];          // Content types this mode owns
  signals: {
    keywords: string[];          // Keywords that suggest this mode
    audience: string[];          // Audience markers
    structure: RegExp[];         // Structural heading patterns
  };
}
```

### API

| Function | Description |
|----------|-------------|
| `registerMode(definition)` | Register a custom mode |
| `getMode(id)` | Get mode by ID |
| `getModeForContentType(type)` | Get default mode for a content type |
| `isValidMode(mode)` | Check if a mode ID is registered |
| `getAllModes()` | Get all definitions (for classifier iteration) |
| `listModes()` | List modes with `id`, `name`, `description` |
| `getAllContentTypes()` | Get all content types across all modes |

### Example: Custom "marketing" mode

```typescript
import type { ContentModeDefinition } from '../core/registries/types.js';

export const marketingMode: ContentModeDefinition = {
  id: 'marketing',
  name: 'Marketing',
  description: 'Campaign briefs, landing pages, email sequences, and brand copy',
  defaultFor: ['campaign', 'landing-page', 'email-sequence'],
  signals: {
    keywords: [
      'campaign', 'conversion', 'CTA', 'brand', 'audience',
      'persona', 'funnel', 'engagement', 'messaging', 'positioning',
      'value proposition', 'headline', 'copy', 'launch',
    ],
    audience: [
      'prospects', 'customers', 'subscribers', 'leads',
      'target audience', 'buyer persona',
    ],
    structure: [
      /^#+\s*Campaign Overview/im,
      /^#+\s*Target Audience/im,
      /^#+\s*Key Messages/im,
      /^#+\s*Call to Action/im,
    ],
  },
};
```

---

## Voice Registry

A voice pairs system prompt instructions with validation rules for a specific content mode. Instructions tell the AI how to write; check rules score whether output matches the intended voice.

### Type: `VoiceDefinition`

```typescript
interface VoiceDefinition {
  modeId: string;              // Mode this voice applies to
  name: string;                // Display name
  instructions: string;        // System prompt (supports {author}, {persona}, {company})
  checkRules: {
    openingPatterns: {
      required: RegExp[];      // Must match in opening
      forbidden: RegExp[];     // Must not match in opening
    };
    voiceMarkers: {
      positive: RegExp[];      // Patterns that indicate correct voice
      negative: RegExp[];      // Patterns that indicate wrong voice
    };
    structuralPatterns: {
      required: RegExp[];      // Required structural elements
    };
    jargonToAvoid: string[];   // Words/phrases to flag
  };
  bonusChecks?: (content: string) => {
    issues: string[];
    strengths: string[];
    scoreAdjustment: number;
  };
}
```

### API

| Function | Description |
|----------|-------------|
| `registerVoice(definition)` | Register a voice for a mode |
| `getVoice(modeId)` | Get voice definition by mode ID |
| `listVoices()` | List all voices with `modeId` and `name` |
| `hasVoice(modeId)` | Check if a voice exists for a mode |
| `getVoiceInstructionsFromRegistry(modeId, perspective, config)` | Get interpolated instructions with perspective framing |

### Placeholder interpolation

`getVoiceInstructionsFromRegistry()` replaces `{author}`, `{persona}`, and `{company}` in the instructions string with values from the config object, then appends perspective framing (see [Perspective Configuration](#perspective-configuration)).

### Example: Voice for "marketing" mode

```typescript
import type { VoiceDefinition } from '../core/registries/types.js';

export const marketingVoice: VoiceDefinition = {
  modeId: 'marketing',
  name: 'Marketing Voice',

  instructions: `
You are writing marketing content in {author}'s voice as a {persona} at {company}. Key principles:

1. **Lead with the audience benefit**, not the product feature
2. **Clear, compelling CTAs**: Tell the reader exactly what to do next
3. **Conversational but purposeful**: Every sentence drives toward action
4. **Use proof points**: Numbers, testimonials, case studies
5. **Short paragraphs and scannable structure**: Headers, bullets, bold

Voice markers to include:
- Benefit-first headlines
- Direct "you" address throughout
- Specific numbers and outcomes
- Action verbs in CTAs

Avoid:
- Jargon the target audience would not use
- Passive voice
- Feature dumps without benefits
`,

  checkRules: {
    openingPatterns: {
      required: [/you(r)?|discover|transform|ready/i],
      forbidden: [/I used to think/i, /here's where I've landed/i],
    },
    voiceMarkers: {
      positive: [
        /\b\d+%?\b.*\b(increase|growth|faster|reduction)\b/i,
        /get started|sign up|learn more|try it/i,
        /you(r)? (team|business|company|customers)/i,
      ],
      negative: [
        /I recommend/i,       // advisory voice leak
        /the system uses/i,   // architecture voice leak
        /I wonder|perhaps/i,  // thought leadership voice leak
      ],
    },
    structuralPatterns: {
      required: [/^#+\s*(Key Messages|Target Audience|Call to Action)/im],
    },
    jargonToAvoid: ['synergize', 'paradigm shift', 'leverage', 'circle back'],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    const ctaCount = (content.match(/get started|sign up|learn more|try it|contact us/gi) || []).length;
    if (ctaCount >= 1) {
      strengths.push('Contains clear call to action');
      scoreAdjustment += 1;
    } else {
      issues.push('Missing call to action');
      scoreAdjustment -= 1;
    }

    return { issues, strengths, scoreAdjustment };
  },
};
```

---

## Workflow Registry

A workflow defines the ordered chain of roles that content passes through during generation.

### Type: `WorkflowDefinition`

```typescript
interface WorkflowStep {
  role: string;                          // Role identifier
  config?: Record<string, unknown>;      // Optional overrides
}

interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  forModes: string[];       // Modes this workflow applies to
  steps: WorkflowStep[];    // Ordered role chain
}
```

### API

| Function | Description |
|----------|-------------|
| `registerWorkflow(definition)` | Register a workflow |
| `getWorkflow(id)` | Get workflow by ID |
| `getWorkflowForMode(mode)` | Get the workflow assigned to a mode |
| `listWorkflows()` | List all workflows with metadata |

### Built-in workflows

| ID | Steps | Modes |
|----|-------|-------|
| `standard` | ghost-writer, copywriter, editor | thought-leadership, advisory, architecture |
| `documentation` | documentation-writer | documentation |

### Example: Custom workflow for "marketing"

```typescript
import type { WorkflowDefinition } from '../core/registries/types.js';

export const marketingWorkflow: WorkflowDefinition = {
  id: 'marketing',
  name: 'Marketing Two-Pass',
  description: 'Copywriter drafts, Editor reviews for brand consistency',
  forModes: ['marketing'],
  steps: [
    { role: 'copywriter', config: { tone: 'persuasive' } },
    { role: 'editor' },
  ],
};
```

---

## Template Registry

Templates define the structural skeleton for a content type. Parsers (engine code) consume these structures but do not define them.

### Type: `TemplateDefinition`

```typescript
interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  forContentTypes: string[];                // Content types that use this template
  structure: Record<string, unknown>;       // Shape varies by template type
}
```

### API

| Function | Description |
|----------|-------------|
| `registerTemplate(definition)` | Register a template |
| `getTemplate(id)` | Get template by ID |
| `getTemplateForType(contentType)` | Get the template for a content type |
| `listTemplates()` | List all templates with metadata |

### Example: Campaign template

```typescript
import type { TemplateDefinition } from '../core/registries/types.js';

export const campaignTemplate: TemplateDefinition = {
  id: 'campaign',
  name: 'Campaign Brief',
  description: 'Structured campaign brief with audience, messaging, and CTA sections',
  forContentTypes: ['campaign'],
  structure: {
    sections: [
      { heading: 'Campaign Overview', required: true },
      { heading: 'Target Audience', required: true },
      { heading: 'Key Messages', required: true },
      { heading: 'Channels', required: false },
      { heading: 'Call to Action', required: true },
      { heading: 'Success Metrics', required: false },
    ],
  },
};
```

---

## Theme Registry

Presentation themes are managed by a separate registry in `src/content/design-system/theme-registry.ts`. The API follows the same pattern:

| Function | Description |
|----------|-------------|
| `registerTheme(theme)` | Register a custom presentation theme |
| `getTheme(id?)` | Get theme by ID (falls back to default) |
| `listThemes()` | List all themes |

See `docs/design-system/themes.md` for theme type definitions and examples.

---

## Perspective Configuration

Perspective controls pronoun usage and framing appended to voice instructions for all modes.

| Perspective | Framing | Use when |
|-------------|---------|----------|
| `consultant` | "you" / "your organization" -- external advisor | Writing for clients |
| `internal` | "we" / "our team" -- internal team member | Writing internal docs |
| `neutral` | No perspective framing added | General-purpose content |

Set in config or pass programmatically to `getVoiceInstructionsFromRegistry()`.

---

## Configuration

Store user-level configuration in `~/.signal-forge/config.json`:

```json
{
  "author": "Your Name",
  "persona": "your role",
  "company": "Your Company",
  "defaultMode": "advisory",
  "perspective": "consultant"
}
```

Run `forge init` to create the initial config file.

The `author`, `persona`, and `company` values are interpolated into voice instructions via the `{author}`, `{persona}`, and `{company}` placeholders.

---

## Putting It All Together

To add a complete custom "marketing" mode, create the definition files and register them at startup.

### 1. Create the preset files

```
src/presets/
  modes/marketing.ts          # marketingMode (see example above)
  voices/marketing.ts         # marketingVoice (see example above)
  workflows/marketing.ts      # marketingWorkflow (see example above)
  templates/campaign.ts       # campaignTemplate (see example above)
```

### 2. Register custom presets

Create a registration file (e.g., `src/presets/custom.ts`):

```typescript
import { registerMode } from '../core/registries/mode-registry.js';
import { registerVoice } from '../core/registries/voice-registry.js';
import { registerWorkflow } from '../core/registries/workflow-registry.js';
import { registerTemplate } from '../core/registries/template-registry.js';

import { marketingMode } from './modes/marketing.js';
import { marketingVoice } from './voices/marketing.js';
import { marketingWorkflow } from './workflows/marketing.js';
import { campaignTemplate } from './templates/campaign.js';

export function registerCustomPresets(): void {
  registerMode(marketingMode);
  registerVoice(marketingVoice);
  registerWorkflow(marketingWorkflow);
  registerTemplate(campaignTemplate);
}
```

### 3. Call at startup

In your application entry point, call custom registration after built-in presets:

```typescript
import { registerBuiltInPresets } from './presets/index.js';
import { registerCustomPresets } from './presets/custom.js';

registerBuiltInPresets();
registerCustomPresets();
```

### 4. Use the new mode

```bash
# Explicit mode selection
npm run generate campaign --mode marketing --input brief.md

# Auto-classification also works — the classifier will score input
# against marketing signals alongside built-in modes
npm run generate campaign --input brief.md
```

The classifier will now score input against your marketing signals (keywords, audience, structure patterns) alongside the built-in modes and pick the best match. If no signals match strongly, the system falls back to the default mode (`advisory`).
