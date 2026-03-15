# Design System: Font Configuration

## Overview

Font configuration is per-theme. Each theme in the theme registry specifies its own `fontPrimary`, `fontSecondary`, and `fontBold` values. The default `signal-forge` theme uses Rival Sans via Adobe Fonts (Typekit).

Fonts can be customized per deployment by:
1. Creating a custom theme with different font families
2. Updating font URLs in your `~/.signal-forge/config.json` (`fonts.primary`, `fonts.secondary`)

## Default Theme Fonts (Signal Forge)

**Rival Sans** is the default font family for the `signal-forge` theme. It is loaded via Adobe Fonts (Typekit).

### Adobe Fonts Configuration

> **Note**: Typekit kit IDs are tied to specific Adobe Creative Cloud accounts. The IDs below are for the Signal Forge project's Adobe Fonts subscription. If you fork this project, you will need your own Adobe Fonts subscription and kit IDs, or use system fonts instead.

**Font Loading:**
```html
<!-- Replace with your own Typekit kit ID -->
<link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css">

<!-- Preconnect for faster font loading -->
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
```

### Available Font Variants

#### Standard Rival Sans (Primary)
- **Regular:**
  - `font-family: "rival-sans", sans-serif;`
  - `font-weight: 400;`
  - `font-style: normal;`

- **Regular Italic:**
  - `font-family: "rival-sans", sans-serif;`
  - `font-weight: 400;`
  - `font-style: italic;`

- **Bold:**
  - `font-family: "rival-sans", sans-serif;`
  - `font-weight: 700;`
  - `font-style: normal;`

- **Bold Italic:**
  - `font-family: "rival-sans", sans-serif;`
  - `font-weight: 700;`
  - `font-style: italic;`

#### Rival Sans Narrow Variant
- **Regular Narrow:**
  - `font-family: "rival-sans-narrow", sans-serif;`
  - `font-weight: 400;`
  - `font-style: normal;`

- **Regular Narrow Italic:**
  - `font-family: "rival-sans-narrow", sans-serif;`
  - `font-weight: 400;`
  - `font-style: italic;`

- **Bold Narrow:**
  - `font-family: "rival-sans-narrow", sans-serif;`
  - `font-weight: 700;`
  - `font-style: normal;`

- **Bold Narrow Italic:**
  - `font-family: "rival-sans-narrow", sans-serif;`
  - `font-weight: 700;`
  - `font-style: italic;`

#### Komet Font Family (Alternate)
- **Komet Regular
  - `font-family: "komet", sans-serif;`
  - `font-weight: 400;`
  - `font-style: normal;`

- **Regular Italic:**
  - `font-family: "komet", sans-serif;`
  - `font-weight: 400;`
  - `font-style: italic;`

- **Bold:**
  - `font-family: "komet", sans-serif;`
  - `font-weight: 700;`
  - `font-style: normal;`

- **Bold Italic:**
  - `font-family: "komet", sans-serif;`
  - `font-weight: 700;`
  - `font-style: italic;`

#### Small Caps Variant (komet-sc)
- **Regular SC:**
  - `font-family: "komet-sc", sans-serif;`
  - `font-weight: 400;`
  - `font-style: normal;`

- **Regular SC Italic:**
  - `font-family: "komet-sc", sans-serif;`
  - `font-weight: 400;`
  - `font-style: italic;`

- **Bold SC:**
  - `font-family: "komet-sc", sans-serif;`
  - `font-weight: 700;`
  - `font-style: normal;`

- **Bold SC Italic:**
  - `font-family: "komet-sc", sans-serif;`
  - `font-weight: 700;`
  - `font-style: italic;`

### CSS Configuration

#### Base Typography
```css
/* Body text - Regular weight */
body {
    font-family: "rival-sans", "komet", sans-serif;
    font-weight: 400;
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Headings - Bold weight */
h1, h2, h3, h4, h5, h6 {
    font-family: "rival-sans", "komet", sans-serif;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.01em;
}

/* Universal application */
* {
    font-family: "rival-sans", "komet", sans-serif;
}
```

#### Narrow Variant Utility Class
```css
.rival-sans-narrow {
    font-family: "rival-sans-narrow", "komet-sc", sans-serif;
}
```

#### Komet Alternate Utility Classes (for backwards compatibility)
```css
.komet {
    font-family: "komet", sans-serif;
}

.komet-sc {
    font-family: "komet-sc", sans-serif;
}
```

### Usage Guidelines

1. **Default Font Stack:** Always use `"rival-sans", "komet", sans-serif` as the primary font family
   - Rival Sans is the primary font
   - Komet is the alternate/fallback font
   - System fonts (`sans-serif`) are the final fallback
2. **Font Weights:**
   - Use `400` (Regular) for body text and standard content
   - Use `700` (Bold) for headings, emphasis, and important labels
3. **Narrow Variant:** Use `"rival-sans-narrow"` for condensed typography when needed
4. **Fallback:** The font stack ensures graceful degradation if fonts fail to load

### Implementation Examples

#### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Title</title>
    
    <!-- Rival Sans Font from Adobe Fonts (Primary) -->
    <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css">
    
    <!-- Komet Font from Adobe Fonts (Alternate) -->
    <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css">
    
    <link rel="preconnect" href="https://use.typekit.net" crossorigin>
    
    <style>
        body {
            font-family: "rival-sans", "komet", sans-serif;
            font-weight: 400;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: "rival-sans", "komet", sans-serif;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <!-- Content -->
</body>
</html>
```

#### React/JSX Component
```jsx
const Component = () => (
    <div style={{ fontFamily: '"rival-sans", "komet", sans-serif' }}>
        <h1 style={{ fontWeight: 700 }}>Heading</h1>
        <p style={{ fontWeight: 400 }}>Body text</p>
    </div>
);
```

#### Tailwind CSS Configuration
```javascript
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"rival-sans"', '"komet"', 'sans-serif'],
                'rival-sans': ['"rival-sans"', 'sans-serif'],
                'rival-sans-narrow': ['"rival-sans-narrow"', '"komet-sc"', 'sans-serif'],
                'komet': ['"komet"', 'sans-serif'],
                'komet-sc': ['"komet-sc"', 'sans-serif'],
            },
        },
    },
}
```

### Additional Font Families Available

#### Apparat SemiCond Light
- **Font Family:** `apparat-semicond-light`
- **Weights:** 400 (Light), 400 italic (Light Italic)
- **Usage:** Lightweight condensed text

#### Apparat SemiCond
- **Font Family:** `apparat-semicond`
- **Weights:** 400 (Medium), 400 italic (Medium Italic), 700 (Extrabold), 700 italic (Extrabold Italic)
- **Usage:** Condensed text with medium to heavy weights

#### Elza Narrow
- **Font Family:** `elza-narrow`
- **Weights:** 400 (Narrow), 400 italic (Narrow Oblique), 700 (Narrow Bold), 700 italic (Narrow Bold Oblique)
- **Usage:** Narrow condensed typography

#### Articulat CF
- **Font Family:** `articulat-cf`
- **Weights:** 400 (Normal), 400 italic (Normal Oblique), 700 (Demi Bold), 700 italic (Demi Bold Oblique)
- **Usage:** Standard geometric sans-serif

#### Articulat Heavy CF
- **Font Family:** `articulat-heavy-cf`
- **Weights:** 900 (Heavy), 900 italic (Heavy Oblique)
- **Usage:** Heavy weight display text

### Notes

- **Adobe Fonts Access:** Requires an active Adobe Creative Cloud subscription with Adobe Fonts access
- **Per-deployment:** Typekit kit IDs are account-specific. Replace with your own or use system fonts.
- **Performance:** Fonts are loaded asynchronously via Adobe Fonts CDN for optimal performance
- **Fallback:** Font stack ensures graceful degradation through the configured font families to system `sans-serif`
- **Custom themes:** Define your own `fontPrimary`/`fontSecondary`/`fontBold` in a custom theme. See [themes.md](themes.md).

### Related Documentation

- See [colors.md](colors.md) for color palette configuration
- See [themes.md](themes.md) for theme registry and custom theme creation

---

**Last Updated:** March 2025
**Maintained By:** Signal Forge Project

