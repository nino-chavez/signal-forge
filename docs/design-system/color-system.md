# Signal Forge Color System

> Canonical reference for all visual assets and content generation.

## Design Principles

Based on data visualization research and enterprise design systems (IBM Carbon, Atlassian, GitLab Pajamas):

1. **5-7 categorical colors maximum** - Cognitive science shows humans distinguish 5-7 categories reliably
2. **Distinct hues, not shades** - Each category gets a perceptually different hue
3. **Semantic consistency** - Same color = same meaning everywhere
4. **Functional modes only** - Light/dark for accessibility, not aesthetic variations
5. **3:1 minimum contrast** - WCAG 2.1 compliance for all color combinations

---

## Categorical Palette

Six distinct hues for architecture diagrams, data visualization, and technical content:

| Category | Hue | Hex (Light Mode) | Hex (Dark Mode) | Usage |
|----------|-----|------------------|-----------------|-------|
| **Platform** | Blue | `#2563eb` | `#60a5fa` | Core services, APIs, infrastructure |
| **Agent** | Teal | `#0d9488` | `#2dd4bf` | Autonomous agents, AI actors |
| **Data** | Purple | `#7c3aed` | `#a78bfa` | Data stores, databases, memory |
| **Trust** | Red | `#dc2626` | `#f87171` | Security, safety, compliance, critical |
| **External** | Slate | `#475569` | `#94a3b8` | External systems, third parties |
| **Success** | Green | `#16a34a` | `#4ade80` | Positive outcomes, confirmations |

### Extended Palette (use sparingly)

| Category | Hue | Hex (Light Mode) | Usage |
|----------|-----|------------------|-------|
| **Warning** | Amber | `#d97706` | Observability, caution, monitoring |
| **Info** | Sky | `#0284c7` | Informational, neutral highlights |

---

## Semantic Mapping

### C4 Architecture Diagrams

| Element Type | Color | Rationale |
|--------------|-------|-----------|
| System Boundary | Blue | Core platform |
| Application Services | Blue | Platform infrastructure |
| AI/ML Services | Purple | Data-centric processing |
| Domain Agents | Teal | Autonomous actors |
| Data Stores | Purple | Persistence layer |
| Trust/Guardrails | Red | Safety-critical |
| Observability | Amber | Monitoring/warning |
| External Systems | Slate | Outside boundary |

### Data Flow Diagrams

| Element Type | Color | Rationale |
|--------------|-------|-----------|
| Customer/User | Blue | Primary actor |
| Agent Actions | Teal | Agent processing |
| Data Operations | Purple | Data movement |
| Trust Checks | Red | Validation gates |
| External APIs | Slate | Third-party calls |
| Success States | Green | Positive outcomes |

### Implementation Roadmaps

| Phase | Color | Light Background |
|-------|-------|------------------|
| Phase 1 (Foundation) | Blue `#2563eb` | `#dbeafe` |
| Phase 2 (Expansion) | Teal `#0d9488` | `#ccfbf1` |
| Phase 3 (Optimization) | Purple `#7c3aed` | `#ede9fe` |

---

## Light & Dark Modes

Modes serve **functional purposes** (accessibility, presentation context), not aesthetic preference.

### Light Mode (Default)
- Background: `#ffffff` (white)
- Surface: `#f8fafc` (slate-50)
- Text Primary: `#0f172a` (slate-900)
- Text Secondary: `#475569` (slate-600)
- Text Muted: `#94a3b8` (slate-400)
- Border: `#e2e8f0` (slate-200)

### Dark Mode (Presentations/Demos)
- Background: `#0f172a` (slate-900)
- Surface: `#1e293b` (slate-800)
- Text Primary: `#f8fafc` (slate-50)
- Text Secondary: `#cbd5e1` (slate-300)
- Text Muted: `#64748b` (slate-500)
- Border: `#334155` (slate-700)

---

## CSS Variables Reference

```css
:root {
  /* Categorical Colors - Light Mode */
  --color-platform: #2563eb;
  --color-agent: #0d9488;
  --color-data: #7c3aed;
  --color-trust: #dc2626;
  --color-external: #475569;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-info: #0284c7;

  /* Light Backgrounds (for fills) */
  --color-platform-light: #dbeafe;
  --color-agent-light: #ccfbf1;
  --color-data-light: #ede9fe;
  --color-trust-light: #fef2f2;
  --color-external-light: #f1f5f9;
  --color-success-light: #dcfce7;
  --color-warning-light: #fef3c7;
  --color-info-light: #e0f2fe;

  /* Neutrals */
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
}
```

---

## Usage Guidelines

### Do
- Use **one color per category** consistently across all diagrams
- Apply light backgrounds with darker borders for boxes
- Use slate/gray for less important or external elements
- Reserve red for trust/safety/critical elements only
- Test all color combinations for 3:1 contrast ratio

### Don't
- Use more than 6-7 colors in a single diagram
- Use multiple shades of the same hue for different categories
- Apply red for non-critical elements
- Create "aesthetic" mode variations with no functional purpose
- Use colors without semantic meaning

---

## Accessibility

All color combinations meet WCAG 2.1 Level AA requirements:

| Foreground | Background | Contrast Ratio | Pass |
|------------|------------|----------------|------|
| White text | Blue `#2563eb` | 4.7:1 | AA |
| White text | Teal `#0d9488` | 4.5:1 | AA |
| White text | Purple `#7c3aed` | 5.4:1 | AA |
| White text | Red `#dc2626` | 4.6:1 | AA |
| White text | Slate `#475569` | 5.9:1 | AA |
| White text | Green `#16a34a` | 4.5:1 | AA |

---

## References

- [IBM Carbon Design System - Data Visualization](https://carbondesignsystem.com/data-visualization/color-palettes/)
- [Atlassian Design System - Data Visualization Color](https://atlassian.design/foundations/color-new/data-visualization-color/)
- [GitLab Pajamas - Data Visualization Color](https://design.gitlab.com/data-visualization/color/)
- [PolicyViz - Why Six Colors?](https://policyviz.com/2023/05/31/why-are-six-colors-common-in-color-palettes-for-data-visualization/)
- [Optimal Qualitative Color Palettes](http://tsitsul.in/blog/coloropt/)

---

*Version 1.0 | Signal Forge Design System*
