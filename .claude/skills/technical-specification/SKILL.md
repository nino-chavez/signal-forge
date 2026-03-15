---
name: technical-specification
description: Generate professional technical specification documents, framework standards, and protocol documentation. Use when creating open-source specifications, API documentation, framework guides, or technical standards documentation. Outputs high-fidelity HTML documents with dark theme styling.
---

# Technical Specification Generator

Generate professional technical specification documents for frameworks, protocols, standards, and open-source projects.

## When to Use This Skill

- Creating framework specification documents
- Writing protocol and standard definitions
- Generating API and SDK documentation
- Building open-source project documentation
- Creating technical reference guides

## Output Format

**Primary**: Single-page HTML with embedded styles (dark theme, responsive)
**Secondary**: Markdown for repository README/docs

## Design System

### Color Palette

Dark theme color palette for specification documents:

```css
:root {
  /* Backgrounds */
  --bg-primary: #0d0a14;
  --bg-secondary: #1a1625;
  --bg-tertiary: #252033;

  /* Text */
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;

  /* Accents */
  --accent-purple: #a78bfa;
  --accent-orange: #f97316;
  --accent-green: #34d399;
  --accent-cyan: #00D4D7;

  /* Semantic */
  --border: #2d2640;
  --positive: #34d399;
  --negative: #f87171;
}
```

### Typography

```css
/* Fonts */
font-family: 'Inter', system-ui, sans-serif;        /* Body */
font-family: 'IBM Plex Mono', monospace;            /* Code, labels */

/* Scale */
.display { font-size: 3.5rem; font-weight: 300; }
.headline { font-size: 1.5rem; font-weight: 400; }
.section-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.body { font-size: 1rem; line-height: 1.7; }
.code { font-size: 0.875rem; }
```

## Document Structure

### For Framework Specifications

```
1. Hero Section
   - Badge (e.g., "SPECIFICATION v0.1")
   - Title (framework name)
   - Subtitle (one-line value prop)
   - Meta (version, date, status)

2. Executive Summary
   - Problem statement
   - Solution overview
   - Core principles (3-5 bullets)

3. Core Concepts
   - Key abstractions
   - Terminology
   - Mental models

4. Specification Sections
   - Schema definitions
   - Interface specifications
   - Required behaviors
   - Optional extensions

5. Implementation Guide
   - Getting started
   - Reference implementations
   - Migration paths

6. Appendices
   - Full schemas
   - Examples
   - Changelog
```

### For Protocol Documentation

```
1. Overview
   - Protocol purpose
   - Transport requirements
   - Security model

2. Message Types
   - Request/response formats
   - Event types
   - Error codes

3. Workflows
   - Sequence diagrams
   - State machines
   - Edge cases

4. Conformance
   - Required features
   - Optional features
   - Test suite
```

## HTML Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Document Title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* CSS variables and base styles */
  </style>
</head>
<body>
  <header class="hero">
    <div class="hero-content">
      <span class="hero-badge">{BADGE}</span>
      <h1>{Title}</h1>
      <p class="hero-subtitle">{Subtitle}</p>
      <div class="hero-meta">
        <span>Version {X.Y}</span>
        <span>{Date}</span>
        <span>{Status}</span>
      </div>
    </div>
  </header>

  <nav class="toc">
    <!-- Table of contents -->
  </nav>

  <main class="content">
    <section id="summary">
      <!-- Executive summary -->
    </section>

    <section id="concepts">
      <!-- Core concepts -->
    </section>

    <!-- Additional sections -->
  </main>

  <footer>
    <!-- Footer with links, license -->
  </footer>
</body>
</html>
```

## Component Patterns

### Section Headers

```html
<section class="section">
  <span class="section-label">{SECTION NUMBER}</span>
  <h2 class="section-title">{Section Title}</h2>
  <p class="section-description">{Description}</p>
</section>
```

### Code Blocks

```html
<div class="code-block">
  <div class="code-header">
    <span class="code-lang">{language}</span>
    <span class="code-filename">{filename}</span>
  </div>
  <pre><code>{code}</code></pre>
</div>
```

### Specification Tables

```html
<table class="spec-table">
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>{property}</code></td>
      <td><code>{type}</code></td>
      <td>{Yes/No}</td>
      <td>{description}</td>
    </tr>
  </tbody>
</table>
```

### Callout Boxes

```html
<div class="callout callout-{type}">
  <span class="callout-icon">{icon}</span>
  <div class="callout-content">
    <strong>{Title}</strong>
    <p>{Content}</p>
  </div>
</div>
<!-- Types: info, warning, success, danger -->
```

### Diagrams

Use ASCII diagrams or reference external images:

```html
<figure class="diagram">
  <pre class="ascii-diagram">
┌─────────────┐     ┌─────────────┐
│  Component  │────▶│   Output    │
└─────────────┘     └─────────────┘
  </pre>
  <figcaption>{Caption}</figcaption>
</figure>
```

## Quality Checklist

Before finalizing any specification document:

- [ ] Clear value proposition in hero section
- [ ] Table of contents with anchor links
- [ ] All terminology defined in Core Concepts
- [ ] Schemas are syntactically valid
- [ ] Code examples are copy-pasteable
- [ ] Cross-references use anchor links
- [ ] Responsive on mobile devices
- [ ] Print-friendly (page breaks, no fixed widths)
- [ ] Version and date clearly visible
- [ ] Status indicator (Draft, RC, Stable)

## Voice Guidelines

### DO

- Lead with the "what" and "why" before the "how"
- Use definitive language ("The component MUST", "Implementations SHALL")
- Include rationale for design decisions
- Provide concrete examples for abstract concepts
- Use RFC 2119 keywords (MUST, SHOULD, MAY) for requirements

### DON'T

- Use hedging language ("might", "perhaps", "could possibly")
- Assume implementation details
- Mix specification with tutorial content
- Leave edge cases undefined
- Skip error handling documentation

## Examples

Reference implementations can be found in local `projects/` directories (gitignored). Generate your own examples using:

```bash
forge generate spec --input context.md --format html
```
