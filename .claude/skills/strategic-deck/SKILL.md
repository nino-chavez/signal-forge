---
name: strategic-deck
description: Create professional presentation decks for strategy, architecture, and executive communication. Use when asked to create slide decks, presentations, visual strategy documents, or HTML-based presentations. Supports multiple workflows including HTML generation and PPTX export.
---

# Strategic Deck Generator

Generate professional presentation decks for consulting engagements, architecture reviews, and executive communication.

## When to Use This Skill

- Creating strategy presentations for client executives
- Building architecture overview decks
- Generating workshop materials
- Creating visual documentation for technical concepts

## Supported Output Formats

| Format | Best For | Method |
|--------|----------|--------|
| HTML | Interactive, web-based viewing | Direct generation with embedded styles |
| PPTX | Client delivery, editing | PptxGenJS or HTML-to-PPTX conversion |
| PDF | Print, archival | Export from HTML or PPTX |

## Workflow

### 1. Content Planning

Before generating slides:
1. Identify the audience (executive, technical, mixed)
2. Determine key messages (3-5 maximum)
3. Plan visual hierarchy and flow
4. Select appropriate layout patterns

### 2. Design Principles

**MANDATORY - Read `references/design-system.md` for complete design system specifications.**

Key principles:
- **Content-informed design**: Match palette and style to subject matter
- **Visual hierarchy**: Clear distinction between headers, body, and supporting text
- **Consistency**: Uniform styling across all slides
- **Readability**: High contrast, appropriate font sizes

### 3. Layout Patterns

**Two-column layout (PREFERRED):**
- Full-width header
- Two columns below for text/visuals
- Best for most content types

**Full-slide layout:**
- Maximum impact for key messages
- Use sparingly for emphasis

**NEVER:** Vertically stack charts/tables below text

### 4. Color Palettes

Select based on content tone:

| Palette | Use Case |
|---------|----------|
| Classic Blue | Professional, trustworthy |
| Teal & Coral | Modern, engaging |
| Black & Gold | Premium, executive |
| Forest Green | Sustainability, growth |
| Charcoal & Red | Bold, action-oriented |

### 5. Typography

**Web-safe fonts only:**
- Headers: Arial, Helvetica, Impact
- Body: Verdana, Tahoma, Georgia
- Code/Data: Courier New

### 6. Validation

After generating slides:
1. Check text cutoff and overflow
2. Verify visual alignment
3. Confirm color contrast
4. Review on multiple screen sizes

## HTML Deck Structure

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Slide container */
    .slide {
      width: 1280px;
      height: 720px;
      padding: 60px;
      page-break-after: always;
    }
    /* Headers */
    h1 { font-size: 48px; margin-bottom: 40px; }
    h2 { font-size: 36px; }
    /* Body text */
    p, li { font-size: 24px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="slide">
    <!-- Slide content -->
  </div>
</body>
</html>
```

## Theme System (PPTX)

The PPTX engine supports multiple themes. Each theme controls colors, fonts, sizing, spacing, and shapes — all applied per-element since PptxGenJS has no native theme inheritance.

### Available Themes

| Theme | Fonts | Primary Color | Dimensions | Best For |
|-------|-------|--------------|------------|----------|
| `signal-forge` (default) | Rival Sans | Violet `#7c3aed` | 13.33" x 7.5" | Default brand presentations |
| `dark` | Arial | Indigo `#818cf8` | 13.33" x 7.5" | Dark mode presentations |

Custom themes can be registered via `registerTheme()`. See the extensibility guide.

### Usage

```bash
forge generate deck --input strategy.md --theme dark -f pptx
forge generate deck --input strategy.md -f pptx   # defaults to signal-forge
```

### Theme-Specific Content Density

When generating slide content, match density to the target theme:

| Theme | Bullets per slide | Body font size | Guideline |
|-------|-------------------|---------------|-----------|
| `signal-forge` | 6-8 | 14pt | Generous spacing, fewer items |
| `dark` | 6-8 | 14pt | Same as signal-forge |

## Layout Directives (PPTX)

Use HTML comment directives in markdown to control slide layout. Place the directive on the line before the slide heading.

### Available Layouts

| Layout | Directive | Auto-detected when |
|--------|-----------|-------------------|
| Title | `<!-- layout: title -->` | First slide |
| Section Divider | `<!-- layout: section-divider -->` or `---` | `---` separator or `<!-- section -->` |
| Content | `<!-- layout: content -->` | Default for all slides |
| Two-Column Text | `<!-- layout: two-column-text -->` | (explicit only) |
| Table | `<!-- layout: table -->` | Markdown table detected |
| Image + Text | `<!-- layout: image-text -->` | `![](path)` detected |
| Full Image | `<!-- layout: full-image -->` | (explicit only) |
| Quote | `<!-- layout: quote -->` | Blockquote (`>`) detected |
| Multi-Column Image | `<!-- layout: multi-column-image -->` | (explicit only) |
| Conclusion | `<!-- layout: conclusion -->` | Last slide with "Questions"/"Thank"/"Next Steps" |

### Directive Examples

```markdown
## Strategic Vision
- Point one
- Point two

---

## Market Analysis

| Metric | Q1 | Q2 | Q3 |
|--------|-----|-----|-----|
| Revenue | $10M | $12M | $15M |

<!-- layout: two-column-text -->
## Comparison
- Left column point A
- Left column point B
- Right column point C
- Right column point D

> The best strategy is one that adapts.
> — Industry Expert

## Questions & Next Steps
- Follow-up meeting scheduled
- Action items TBD
```

### Speaker Notes

Add speaker notes with `<!-- notes -->` blocks:

```markdown
## Key Findings
- Finding 1
- Finding 2

<!-- notes -->
Emphasize finding 1 — this is the most impactful data point.
Mention the Q3 deadline.
<!-- /notes -->
```

## Quality Checklist

Before finalizing any deck:

- [ ] 3-5 key messages clearly communicated
- [ ] Consistent visual styling throughout
- [ ] No text overflow or cutoff
- [ ] High contrast for readability
- [ ] Appropriate for target audience
- [ ] All diagrams have clear labels
- [ ] Speaker notes included where needed
- [ ] Correct theme selected for audience (`--theme`)
- [ ] Layout directives used for non-default slide types
- [ ] Content density matches theme guidelines

## Examples

See `projects/bby/decks/` for reference implementations.
