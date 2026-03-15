# Presentation Theme System

Signal Forge supports multiple presentation themes for PPTX generation. Each theme defines colors, fonts, sizes, spacing, and shapes that layout functions use to render pixel-accurate slides.

## Architecture

```
Content (Markdown + directives)
        ↓
   parseDeckFromMarkdownV2()     → DeckData (theme-agnostic)
        ↓
   PPTX Engine (pptx-engine.ts)  ← getTheme('signal-forge')
        ↓
   Layout Registry               → selects layout function per slide
        ↓
   Layout Functions (10 types)   ← receives SlideData + PresentationTheme
        ↓
   PptxGenJS API calls           → .pptx file
```

PptxGenJS does not support presentation-level theme colors. Every element receives its colors, fonts, and positioning explicitly from theme tokens. This is why themes are applied programmatically per-element, not inherited from a master.

## Built-in Themes

| Theme ID | Name | Primary | Font | Dimensions |
|----------|------|---------|------|------------|
| `signal-forge` | Signal Forge | `7c3aed` (violet) | Rival Sans | 13.33" x 7.5" |
| `dark` | Dark | `818cf8` (indigo) | Arial | 13.33" x 7.5" |

## Usage

```bash
# Use default theme (signal-forge)
forge generate deck --input strategy.md -f pptx

# Specify a theme
forge generate deck --input strategy.md --theme dark -f pptx

# List available themes
forge themes list
```

## Creating a Custom Theme

1. Create a new file in `src/content/design-system/themes/`:

```typescript
// src/content/design-system/themes/acme-corp.ts
import type { PresentationTheme } from '../theme-types.js';

export const acmeCorpTheme: PresentationTheme = {
  id: 'acme-corp',
  name: 'Acme Corp',
  description: 'Acme Corp client brand',
  dimensions: { width: 13.33, height: 7.5 },
  colors: {
    primary: '0066CC',
    secondary: 'E8F0FE',
    dark: '1A1A2E',
    light: 'F0F4F8',
    highlight: 'FF6B35',
    textPrimary: '1A1A2E',
    textSecondary: '4A5568',
    textBody: '2D3748',
    textMuted: '718096',
    textInverse: 'FFFFFF',
    backgroundWhite: 'FFFFFF',
    backgroundLight: 'F0F4F8',
    backgroundAccent: 'E8F0FE',
    backgroundDark: '1A1A2E',
    tableHeaderBg: '0066CC',
    tableHeaderText: 'FFFFFF',
    tableStripeBg: 'F0F4F8',
    tableBorderColor: 'E2E8F0',
    success: '38A169',
    warning: 'D69E2E',
    error: 'E53E3E',
  },
  typography: {
    fontPrimary: 'Helvetica',
    fontSecondary: 'Helvetica',
    fontBold: 'Helvetica',
    sizes: {
      hero: 54,
      slideTitle: 36,
      sectionTitle: 42,
      subtitle: 18,
      body: 14,
      small: 10,
      footer: 9,
    },
  },
  spacing: {
    marginLeft: 0.5,
    marginRight: 0.5,
    marginTop: 0.5,
    marginBottom: 0.5,
    contentWidth: 12.33,
    contentGap: 0.35,
    columnGutter: 0.4,
  },
  shapes: {
    showAccentLine: true,
    accentLineHeight: 0.15,
    showTitleDivider: true,
    titleDividerHeight: 0.05,
    pillRadius: 0.1,
  },
  logo: {
    path: 'assets/acme-logo.png',
    position: 'bottom-right',
    width: 1.2,
    height: 0.4,
  },
  footer: {
    template: 'Acme Corp Confidential',
    showSlideNumbers: true,
  },
};
```

2. Register it. You have two options:

**Option A** — Add to built-in presets (if you control the codebase):
```typescript
// In src/presets/index.ts, import and register:
import { registerTheme } from '../content/design-system/theme-registry.js';
import { acmeCorpTheme } from './themes/acme-corp.js';

registerTheme(acmeCorpTheme);
```

**Option B** — Register at runtime (for external/plugin usage):
```typescript
import { registerTheme } from 'signal-forge/content/design-system/theme-registry.js';
import { acmeCorpTheme } from './my-themes/acme-corp.js';

registerTheme(acmeCorpTheme);
```

3. Use it:

```bash
forge generate deck --input strategy.md --theme acme-corp -f pptx
```

## Theme Token Reference

### Colors (6-char hex, no `#` prefix)

| Token | Purpose |
|-------|---------|
| `primary` | Accent color for titles, bars, links |
| `secondary` | Supporting accent |
| `dark` | Dark backgrounds |
| `light` | Light backgrounds |
| `highlight` | Call-out / highlight accent |
| `textPrimary` | Heading text |
| `textBody` | Body text |
| `textMuted` | Footnotes, captions |
| `textInverse` | Text on dark backgrounds |
| `backgroundWhite` | Default slide bg |
| `backgroundLight` | Alternate bg |
| `backgroundDark` | Dark slide bg |
| `tableHeaderBg` | Table header fill |
| `tableStripeBg` | Alternating row fill |

### Typography

| Token | Type | Purpose |
|-------|------|---------|
| `fontPrimary` | string | Display/heading font name |
| `fontSecondary` | string | Body text font name |
| `fontBold` | string | Bold variant font name |
| `sizes.hero` | number (pt) | Title slide hero text |
| `sizes.slideTitle` | number (pt) | Content slide titles |
| `sizes.body` | number (pt) | Bullet/body text |
| `sizes.footer` | number (pt) | Footer text |

### Spacing (inches)

| Token | Purpose |
|-------|---------|
| `marginLeft` | Left page margin |
| `contentWidth` | Usable width = dimensions.width - marginLeft - marginRight |
| `contentGap` | Vertical gap between bullets |
| `columnGutter` | Gap between columns |

### Shapes

| Token | Type | Purpose |
|-------|------|---------|
| `showAccentLine` | boolean | Top accent bar on content slides |
| `accentLineHeight` | number | Height of accent bar |
| `showTitleDivider` | boolean | Divider line under titles |

## Slide Layouts

The engine supports 10 layout types, auto-detected from markdown content or set explicitly with directives:

| Layout | Trigger |
|--------|---------|
| `title` | First slide |
| `section-divider` | `---` or `<!-- section -->` |
| `content` | Default |
| `two-column-text` | `<!-- layout: two-column-text -->` |
| `table` | Markdown table detected |
| `image-text` | `![](image)` detected |
| `full-image` | `<!-- layout: full-image -->` |
| `quote` | Blockquote (`>`) detected |
| `multi-column-image` | `<!-- layout: multi-column-image -->` |
| `conclusion` | Last slide with "Questions"/"Thank"/"Next Steps" |
