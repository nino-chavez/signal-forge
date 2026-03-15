/**
 * Presentation Theme Type System
 *
 * Defines the shape of a presentation theme. Every visual property that
 * a layout function needs — colors, fonts, sizes, spacing, shapes — lives
 * here. PptxGenJS does not support presentation-level theme colors, so
 * every element receives its styling explicitly from these tokens.
 *
 * Colors are stored as 6-char hex WITHOUT the '#' prefix (PptxGenJS
 * convention) to avoid stripping at render time.
 */

// ---------------------------------------------------------------------------
// Sub-interfaces
// ---------------------------------------------------------------------------

export interface ThemeColors {
  /** Brand primary accent (titles, accent bars, links) */
  primary: string;
  /** Secondary accent (supporting highlights) */
  secondary: string;
  /** Dark color (dark backgrounds, dark text) */
  dark: string;
  /** Light color (light backgrounds, cards) */
  light: string;
  /** Highlight / call-out accent */
  highlight: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textBody: string;
  textMuted: string;
  textInverse: string;

  // Backgrounds
  backgroundWhite: string;
  backgroundLight: string;
  backgroundAccent: string;
  backgroundDark: string;

  // Table
  tableHeaderBg: string;
  tableHeaderText: string;
  tableStripeBg: string;
  tableBorderColor: string;

  // Semantic
  success: string;
  warning: string;
  error: string;
}

export interface ThemeTypography {
  /** Primary display / heading font */
  fontPrimary: string;
  /** Secondary / body font (may be same as primary) */
  fontSecondary: string;
  /** Bold / semibold variant name (PptxGenJS uses fontFace for weight) */
  fontBold: string;

  sizes: {
    hero: number;       // Title slide hero text (pt)
    slideTitle: number;  // Content slide titles (pt)
    sectionTitle: number; // Section divider titles (pt)
    subtitle: number;    // Subtitles (pt)
    body: number;        // Body / bullet text (pt)
    small: number;       // Captions, footnotes (pt)
    footer: number;      // Footer text (pt)
  };
}

export interface ThemeSpacing {
  /** Left margin (inches) */
  marginLeft: number;
  /** Right margin (inches) */
  marginRight: number;
  /** Top margin (inches) */
  marginTop: number;
  /** Bottom margin (inches) */
  marginBottom: number;
  /** Usable content width (inches) = dimensions.width - marginLeft - marginRight */
  contentWidth: number;
  /** Vertical gap between content items (inches) */
  contentGap: number;
  /** Gutter between columns (inches) */
  columnGutter: number;
}

export interface ThemeShapes {
  /** Show a colored accent line at top of content slides */
  showAccentLine: boolean;
  /** Height of accent line (inches) */
  accentLineHeight: number;
  /** Show a divider line under slide titles */
  showTitleDivider: boolean;
  /** Height of title divider (inches) */
  titleDividerHeight: number;
  /** Border radius for pill shapes / rounded rects (inches) */
  pillRadius: number;
}

export interface ThemeLogo {
  /** Path to logo image file (relative to project root) */
  path: string;
  /** Position on slide */
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Logo width (inches) */
  width: number;
  /** Logo height (inches) */
  height: number;
}

export interface ThemeFooter {
  /** Footer text template. Use {slideNumber} and {totalSlides} as placeholders. */
  template: string;
  /** Show slide numbers */
  showSlideNumbers: boolean;
  /** Footer font size (pt) — overrides typography.sizes.footer if set */
  fontSize?: number;
  /** Footer text color (6-char hex) — overrides colors.textMuted if set */
  color?: string;
}

// ---------------------------------------------------------------------------
// Main interface
// ---------------------------------------------------------------------------

export interface PresentationTheme {
  /** Unique theme identifier (used with --theme CLI flag) */
  id: string;
  /** Human-readable theme name */
  name: string;
  /** Short description */
  description: string;
  /** Slide dimensions in inches */
  dimensions: {
    width: number;
    height: number;
  };
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shapes: ThemeShapes;
  logo?: ThemeLogo;
  footer?: ThemeFooter;
}
