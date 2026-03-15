# Presentation Design System

**Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Source of Truth:** `src/design-system/presentation-theme.ts`

---

## Overview

This design system provides a unified, professional foundation for generating presentation content that rivals Gamma and Canva output quality. It adapts the Athletic design system from `signal-dispatch-blog` with enhancements specifically for modern presentation design.

**Key Principles:**
- **Professional Quality:** Rivals Gamma/Canva presentation output
- **Consistent:** Single source of truth for all styling
- **Modern:** Incorporates 2024-2025 presentation design trends
- **Accessible:** WCAG AA compliant color contrasts
- **Performant:** Optimized animations and transitions

---

## Design Tokens

All design tokens are defined in `src/design-system/presentation-theme.ts`. This is the **single source of truth** for all presentation styling.

### Colors

#### Brand Colors (Athletic Design System)

```css
--color-brand-violet: #7c3aed;    /* Primary brand color */
--color-brand-orange: #ea580c;    /* Accent color */
--color-brand-navy: #1a365d;      /* Dark accent */
--color-brand-success: #10b981;   /* Success states */
--color-brand-warning: #f59e0b;   /* Warning states */
--color-brand-error: #ef4444;     /* Error states */
```

**Usage:**
- **Violet:** Primary accent for headings, borders, interactive elements
- **Orange:** Secondary accent for highlights, CTAs
- **Navy:** Dark backgrounds, section dividers
- **Success/Warning/Error:** Status indicators, feedback

#### Neutral Scale

```css
--color-neutral-50: #fafafa;   /* Lightest */
--color-neutral-100: #f5f5f5;
--color-neutral-200: #e5e5e5;
--color-neutral-300: #d4d4d4;
--color-neutral-400: #a3a3a3;
--color-neutral-500: #737373;
--color-neutral-600: #525252;
--color-neutral-700: #404040;
--color-neutral-800: #262626;
--color-neutral-900: #171717;
--color-neutral-950: #0a0a0a;  /* Darkest */
```

**Usage:**
- **50-200:** Light backgrounds, subtle borders
- **300-500:** Body text, secondary elements
- **600-800:** Headings, emphasis
- **900-950:** Dark backgrounds, high contrast text

#### Semantic Colors

```css
/* Text Colors */
--color-text-primary: #171717;      /* Main headings */
--color-text-secondary: #404040;     /* Subheadings */
--color-text-body: #525252;         /* Body text */
--color-text-muted: #a3a3a3;        /* Muted/secondary text */
--color-text-inverse: #fafafa;      /* Text on dark backgrounds */

/* Background Colors */
--color-bg-primary: #ffffff;         /* Main slide background */
--color-bg-secondary: #f5f5f5;       /* Card backgrounds */
--color-bg-accent: #f5e6ff;         /* Accent backgrounds */
--color-bg-dark: #111827;           /* Dark slide backgrounds */
```

---

### Typography

#### Font Family

**Primary:** Rival Sans (from Adobe Fonts)
```css
font-family: "rival-sans", "komet", "darkmode-off", system-ui, -apple-system, sans-serif;
```

**Font Stack:**
- **Rival Sans** (Primary) - Professional, modern sans-serif from Adobe Fonts
- **Komet** (Alternate) - Secondary font family from Adobe Fonts
- **Darkmode-Off** (Alternate) - Additional font variant from Adobe Fonts
- **System fonts** - Fallback for optimal performance

**Adobe Fonts Projects:**
- Rival Sans: Project ID `YOUR_KIT_ID` - Primary font family
- Komet & Darkmode-Off: Project ID `YOUR_KIT_ID` - Alternate font families

#### Font Sizes

```css
--font-size-display: 4.5rem;    /* 72px - Hero titles */
--font-size-h1: 3rem;           /* 48px - Slide titles */
--font-size-h2: 2rem;           /* 32px - Section headings */
--font-size-h3: 1.5rem;         /* 24px - Subheadings */
--font-size-body: 1.125rem;      /* 18px - Body text */
--font-size-small: 0.875rem;    /* 14px - Small text */
--font-size-tiny: 0.75rem;      /* 12px - Labels */
```

**Usage Guidelines:**
- **Display:** Only for title slides, hero statements
- **H1:** Main slide titles (one per slide)
- **H2:** Section headings within slides
- **H3:** Subsection headings
- **Body:** All paragraph and list content
- **Small/Tiny:** Metadata, labels, captions

#### Font Weights

```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

**Usage:**
- **Regular (400):** Body text, descriptions
- **Medium (500):** Emphasis, links
- **Semibold (600):** Subheadings, labels
- **Bold (700):** Headings, strong emphasis
- **Extrabold (800):** Display text, hero titles

#### Line Heights

```css
--line-height-tight: 1.2;      /* Headings */
--line-height-normal: 1.5;     /* Standard text */
--line-height-relaxed: 1.75;   /* Body text, lists */
--line-height-loose: 2;        /* Spacious text */
```

**Usage:**
- **Tight (1.2):** Large headings, display text
- **Normal (1.5):** Standard paragraphs
- **Relaxed (1.75):** Body text, bullet lists
- **Loose (2):** Spacious layouts, quotes

#### Letter Spacing

```css
--letter-spacing-tight: -0.02em;  /* Large headings */
--letter-spacing-normal: 0;        /* Body text */
--letter-spacing-wide: 0.05em;     /* Uppercase labels */
```

---

### Spacing

8px base unit system for consistent spacing:

```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
--spacing-2xl: 4rem;    /* 64px */
--spacing-3xl: 6rem;    /* 96px */
```

**Usage Guidelines:**
- **XS:** Tight spacing (icon-text gaps)
- **SM:** Standard spacing (card padding)
- **MD:** Comfortable spacing (section gaps)
- **LG:** Generous spacing (slide padding)
- **XL:** Large spacing (slide margins)
- **2XL/3XL:** Hero spacing (title slides)

---

### Timing & Animations

#### Duration

```css
--duration-quick-snap: 90ms;    /* Instant feedback */
--duration-reaction: 120ms;     /* Hover states */
--duration-transition: 160ms;    /* Standard transitions */
--duration-sequence: 220ms;     /* Staggered animations */
--duration-flow: 300ms;         /* Slide transitions */
--duration-power: 400ms;        /* Major transitions */
```

**Usage:**
- **Quick Snap:** Button clicks, micro-interactions
- **Reaction:** Hover states, focus changes
- **Transition:** Color changes, opacity
- **Sequence:** Staggered content reveals
- **Flow:** Slide transitions, page changes
- **Power:** Major layout changes

#### Easing Functions

```css
--easing-snap: cubic-bezier(0.4, 0, 0.2, 1);           /* Quick, snappy */
--easing-flow: cubic-bezier(0.25, 0.1, 0.25, 1);       /* Smooth, natural */
--easing-precision: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Precise, controlled */
--easing-sprint: cubic-bezier(0.55, 0, 0.1, 1);        /* Fast start */
--easing-glide: cubic-bezier(0.25, 0, 0.75, 1);        /* Smooth glide */
```

**Usage:**
- **Snap:** UI interactions, button presses
- **Flow:** Content reveals, slide transitions
- **Precision:** Data visualizations, precise movements
- **Sprint:** Fast animations, urgency
- **Glide:** Smooth, elegant transitions

---

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**Usage:**
- **SM:** Subtle elevation (cards, buttons)
- **MD:** Standard elevation (modals, dropdowns)
- **LG:** Prominent elevation (slide containers)
- **XL:** Dramatic elevation (overlays)
- **2XL:** Maximum elevation (hero elements)

---

### Borders

#### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Cards, buttons */
--radius-lg: 0.75rem;   /* 12px - Large cards */
--radius-xl: 1rem;      /* 16px - Containers */
--radius-full: 9999px;  /* Pills, circles */
```

#### Border Width

```css
--border-width-thin: 1px;    /* Subtle borders */
--border-width-medium: 2px;   /* Standard borders */
--border-width-thick: 4px;   /* Accent borders */
```

---

## Component Library

### Slide Layouts

#### Title Slide
- Full-bleed background with subtle gradient
- Display typography (72px)
- Centered content with generous spacing
- Optional decorative accent (line/shape)

#### Content Slide
- White background with 64px padding
- Clear title hierarchy (48px H1)
- Card-based content sections
- Grid layouts for multi-column content

#### Section Divider
- Dark background (navy or neutral-900)
- Large section title in white
- Progress indicator
- Minimal content

### Card Components

#### Card Primary
```css
background: white;
border: 2px solid var(--color-brand-violet);
border-radius: var(--radius-md);
padding: var(--spacing-md);
box-shadow: var(--shadow-md);
```

**Usage:** Primary content sections, key information

#### Card Secondary
```css
background: var(--color-bg-secondary);
border: 1px solid var(--color-neutral-200);
border-radius: var(--radius-md);
padding: var(--spacing-md);
box-shadow: var(--shadow-sm);
```

**Usage:** Supporting content, secondary information

#### Card Accent
```css
background: var(--color-bg-accent);
border: 2px solid var(--color-brand-violet);
border-radius: var(--radius-md);
padding: var(--spacing-md);
box-shadow: var(--shadow-sm);
```

**Usage:** Highlighted content, important callouts

#### Card Dark
```css
background: var(--color-bg-dark);
border: 1px solid var(--color-neutral-700);
border-radius: var(--radius-md);
padding: var(--spacing-md);
box-shadow: var(--shadow-lg);
color: var(--color-text-inverse);
```

**Usage:** Dark theme sections, contrast slides

### Typography Components

#### Slide Title
```css
font-size: var(--font-size-h1);
font-weight: var(--font-weight-bold);
color: var(--color-brand-violet);
line-height: var(--line-height-tight);
letter-spacing: var(--letter-spacing-tight);
margin-bottom: var(--spacing-lg);
```

#### Section Heading
```css
font-size: var(--font-size-small);
font-weight: var(--font-weight-bold);
color: var(--color-brand-violet);
text-transform: uppercase;
letter-spacing: var(--letter-spacing-wide);
margin-bottom: var(--spacing-sm);
```

#### Body Text
```css
font-size: var(--font-size-body);
font-weight: var(--font-weight-regular);
color: var(--color-text-body);
line-height: var(--line-height-relaxed);
```

---

## Animation Patterns

### Slide Transitions

**Fade + Slide:**
```css
@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide {
  animation: slideFadeIn var(--duration-flow) var(--easing-flow);
}
```

### Content Reveal

**Staggered Fade-In:**
```css
.slide-content > * {
  animation: fadeIn var(--duration-transition) var(--easing-precision);
  animation-fill-mode: both;
}

.slide-content > *:nth-child(1) { animation-delay: 0ms; }
.slide-content > *:nth-child(2) { animation-delay: 120ms; }
.slide-content > *:nth-child(3) { animation-delay: 240ms; }
```

### Hover States

**Subtle Scale:**
```css
.interactive {
  transition: transform var(--duration-reaction) var(--easing-snap);
}

.interactive:hover {
  transform: scale(1.02);
}
```

---

## Usage Guidelines

### Modifying the Design System

**To modify any design token:**

1. Edit `src/design-system/presentation-theme.ts`
2. Update the `designSystem` object
3. Regenerate presentations to see changes

**Example: Change primary brand color:**
```typescript
// In presentation-theme.ts
colors: {
  brand: {
    violet: '#8b5cf6', // Changed from #7c3aed
    // ...
  }
}
```

### Best Practices

1. **Consistency:** Always use design tokens, never hardcode values
2. **Hierarchy:** Use typography scale consistently (H1 > H2 > H3 > Body)
3. **Spacing:** Use spacing scale (8px base unit)
4. **Colors:** Use semantic colors for text/backgrounds
5. **Animations:** Keep animations subtle and purposeful
6. **Accessibility:** Ensure WCAG AA contrast ratios

---

## Implementation

### HTML Exporter

The HTML exporter automatically uses all design system tokens via CSS custom properties.

### PPTX Exporter

The PPTX exporter maps design tokens to PowerPoint properties:
- Colors → PowerPoint color scheme
- Typography → Font sizes and weights
- Spacing → Slide margins and padding

---

## Related Documentation

- **Style Guide:** `docs/style-guide.html` - Interactive demonstration of all components
- **Source Code:** `src/design-system/presentation-theme.ts` - Design token definitions
- **HTML Exporter:** `src/exporters/html-exporter.ts` - HTML implementation
- **PPTX Exporter:** `src/exporters/pptx-exporter.ts` - PowerPoint implementation

---

**Last Updated:** 2025-01-XX  
**Maintained By:** Signal Forge Project

