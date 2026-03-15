# Design System: Color Palette

## Theme-Based Colors

Signal Forge uses a theme-based color system. Each registered theme defines its own color tokens. Colors are not global — they are applied per-theme when generating content.

See [Presentation Theme System](themes.md) for the full theme token reference and how to create custom themes.

### Default Theme Colors (Signal Forge)

The built-in `signal-forge` theme uses a violet accent palette:

**Primary Accent:** `#7c3aed` (violet)

### Color Token Structure

Every theme defines these color tokens (6-char hex, no `#` prefix — PptxGenJS convention):

| Token | Purpose |
|-------|---------|
| `primary` | Accent color for titles, bars, links |
| `secondary` | Supporting accent |
| `dark` | Dark backgrounds |
| `light` | Light backgrounds |
| `highlight` | Call-out / highlight accent |
| `textPrimary` | Heading text |
| `textSecondary` | Subheading text |
| `textBody` | Body text |
| `textMuted` | Footnotes, captions |
| `textInverse` | Text on dark backgrounds |
| `backgroundWhite` | Default slide background |
| `backgroundLight` | Alternate background |
| `backgroundAccent` | Accent background |
| `backgroundDark` | Dark slide background |
| `tableHeaderBg` | Table header fill |
| `tableHeaderText` | Table header text |
| `tableStripeBg` | Alternating row fill |
| `tableBorderColor` | Table border |
| `success` | Success indicator |
| `warning` | Warning indicator |
| `error` | Error indicator |

### Text Color Hierarchy

```css
:root {
    --text-primary: #1A1A1A;    /* Very dark gray for headings */
    --text-secondary: #333333;   /* Dark gray for subheadings */
    --text-body: #666666;        /* Medium gray for body text */
    --text-muted: #999999;       /* Light gray for muted text */
}
```

These values vary by theme. The above are the defaults used by the `signal-forge` theme for HTML exports.

### Usage Guidelines

1. **Primary Accent:** Use your theme's `primary` color for interactive elements, borders, and highlights
2. **Text Hierarchy:** Use `textPrimary` → `textSecondary` → `textBody` → `textMuted` for heading-to-caption hierarchy
3. **Backgrounds:** Use lighter shades for subtle backgrounds
4. **Contrast:** Ensure sufficient contrast ratios for accessibility (WCAG AA minimum)
5. **Custom themes:** Register via `registerTheme()` — see [themes.md](themes.md) and [extensibility guide](../guides/extensibility.md)

### Related Documentation

- See [themes.md](themes.md) for theme registry and custom theme creation
- See [fonts.md](fonts.md) for typography configuration

---

**Last Updated:** March 2025
**Maintained By:** Signal Forge Project

