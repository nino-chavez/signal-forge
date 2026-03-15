/**
 * Presentation Design System
 * 
 * Unified design system for professional presentation generation.
 * Adapted from signal-dispatch-blog Athletic design system with
 * enhancements for modern presentation design (Gamma/Canva quality).
 * 
 * This is the source of truth for all presentation styling.
 */

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  timing: TimingTokens;
  easing: EasingTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
}

export interface ColorTokens {
  // Athletic Brand Colors (from signal-dispatch-blog)
  brand: {
    violet: string;
    orange: string;
    navy: string;
    success: string;
    warning: string;
    error: string;
  };
  // Neutral Scale
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  // Semantic Colors
  semantic: {
    text: {
      primary: string;
      secondary: string;
      body: string;
      muted: string;
      inverse: string;
    };
    background: {
      primary: string;
      secondary: string;
      accent: string;
      dark: string;
    };
  };
}

export interface TypographyTokens {
  fontFamily: {
    primary: string;
    narrow: string;
    heavy: string;
    fallback: string;
  };
  fontSize: {
    display: string;    // 72px - Hero titles
    h1: string;         // 48px - Slide titles
    h2: string;         // 32px - Section headings
    h3: string;         // 24px - Subheadings
    body: string;       // 18px - Body text
    small: string;      // 14px - Small text
    tiny: string;       // 12px - Labels
  };
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface SpacingTokens {
  xs: string;   // 8px
  sm: string;   // 16px
  md: string;   // 24px
  lg: string;   // 32px
  xl: string;   // 48px
  '2xl': string; // 64px
  '3xl': string; // 96px
}

export interface TimingTokens {
  quickSnap: string;    // 90ms
  reaction: string;     // 120ms
  transition: string;    // 160ms
  sequence: string;     // 220ms
  flow: string;         // 300ms
  power: string;        // 400ms
}

export interface EasingTokens {
  snap: string;
  flow: string;
  precision: string;
  sprint: string;
  glide: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface BorderTokens {
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  width: {
    thin: string;
    medium: string;
    thick: string;
  };
}

/**
 * Design System Configuration
 * 
 * This is the single source of truth for all presentation styling.
 * Modify values here to update the entire design system.
 */
export const designSystem: DesignTokens = {
  colors: {
    brand: {
      violet: '#7c3aed',
      orange: '#ea580c',
      navy: '#1a365d',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    semantic: {
      text: {
        primary: '#171717',      // neutral-900
        secondary: '#404040',     // neutral-700
        body: '#525252',          // neutral-600
        muted: '#a3a3a3',         // neutral-400
        inverse: '#fafafa',        // neutral-50
      },
      background: {
        primary: '#ffffff',
        secondary: '#f5f5f5',     // neutral-100
        accent: '#f5e6ff',        // violet-50 equivalent
        dark: '#111827',          // neutral-800 equivalent
      },
    },
  },
  typography: {
    fontFamily: {
      primary: '"rival-sans", "komet", "darkmode-off", "apparat-semicond", "elza-narrow", "articulat-cf", system-ui, -apple-system, sans-serif',
      narrow: '"rival-sans-narrow", "komet-sc", "elza-narrow", "apparat-semicond-light", system-ui, -apple-system, sans-serif',
      heavy: '"articulat-heavy-cf", "rival-sans", system-ui, -apple-system, sans-serif',
      fallback: 'system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      display: '4.5rem',    // 72px
      h1: '3rem',           // 48px
      h2: '2rem',           // 32px
      h3: '1.5rem',         // 24px
      body: '1.125rem',     // 18px
      small: '0.875rem',    // 14px
      tiny: '0.75rem',      // 12px
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.05em',
    },
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
    '3xl': '6rem',  // 96px
  },
  timing: {
    quickSnap: '90ms',
    reaction: '120ms',
    transition: '160ms',
    sequence: '220ms',
    flow: '300ms',
    power: '400ms',
  },
  easing: {
    snap: 'cubic-bezier(0.4, 0, 0.2, 1)',
    flow: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    precision: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    sprint: 'cubic-bezier(0.55, 0, 0.1, 1)',
    glide: 'cubic-bezier(0.25, 0, 0.75, 1)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  borders: {
    radius: {
      sm: '0.25rem',   // 4px
      md: '0.5rem',    // 8px
      lg: '0.75rem',   // 12px
      xl: '1rem',      // 16px
      full: '9999px',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
};

/**
 * Generate CSS Custom Properties from Design System
 */
export function generateCSSVariables(): string {
  const tokens = designSystem;
  
  return `
:root {
  /* Brand Colors */
  --color-brand-violet: ${tokens.colors.brand.violet};
  --color-brand-orange: ${tokens.colors.brand.orange};
  --color-brand-navy: ${tokens.colors.brand.navy};
  --color-brand-success: ${tokens.colors.brand.success};
  --color-brand-warning: ${tokens.colors.brand.warning};
  --color-brand-error: ${tokens.colors.brand.error};
  
  /* Neutral Scale */
  --color-neutral-50: ${tokens.colors.neutral[50]};
  --color-neutral-100: ${tokens.colors.neutral[100]};
  --color-neutral-200: ${tokens.colors.neutral[200]};
  --color-neutral-300: ${tokens.colors.neutral[300]};
  --color-neutral-400: ${tokens.colors.neutral[400]};
  --color-neutral-500: ${tokens.colors.neutral[500]};
  --color-neutral-600: ${tokens.colors.neutral[600]};
  --color-neutral-700: ${tokens.colors.neutral[700]};
  --color-neutral-800: ${tokens.colors.neutral[800]};
  --color-neutral-900: ${tokens.colors.neutral[900]};
  --color-neutral-950: ${tokens.colors.neutral[950]};
  
  /* Semantic Text Colors */
  --color-text-primary: ${tokens.colors.semantic.text.primary};
  --color-text-secondary: ${tokens.colors.semantic.text.secondary};
  --color-text-body: ${tokens.colors.semantic.text.body};
  --color-text-muted: ${tokens.colors.semantic.text.muted};
  --color-text-inverse: ${tokens.colors.semantic.text.inverse};
  
  /* Semantic Background Colors */
  --color-bg-primary: ${tokens.colors.semantic.background.primary};
  --color-bg-secondary: ${tokens.colors.semantic.background.secondary};
  --color-bg-accent: ${tokens.colors.semantic.background.accent};
  --color-bg-dark: ${tokens.colors.semantic.background.dark};
  
  /* Typography */
  --font-family-primary: ${tokens.typography.fontFamily.primary};
  --font-size-display: ${tokens.typography.fontSize.display};
  --font-size-h1: ${tokens.typography.fontSize.h1};
  --font-size-h2: ${tokens.typography.fontSize.h2};
  --font-size-h3: ${tokens.typography.fontSize.h3};
  --font-size-body: ${tokens.typography.fontSize.body};
  --font-size-small: ${tokens.typography.fontSize.small};
  --font-size-tiny: ${tokens.typography.fontSize.tiny};
  
  --font-weight-regular: ${tokens.typography.fontWeight.regular};
  --font-weight-medium: ${tokens.typography.fontWeight.medium};
  --font-weight-semibold: ${tokens.typography.fontWeight.semibold};
  --font-weight-bold: ${tokens.typography.fontWeight.bold};
  --font-weight-extrabold: ${tokens.typography.fontWeight.extrabold};
  
  --line-height-tight: ${tokens.typography.lineHeight.tight};
  --line-height-normal: ${tokens.typography.lineHeight.normal};
  --line-height-relaxed: ${tokens.typography.lineHeight.relaxed};
  --line-height-loose: ${tokens.typography.lineHeight.loose};
  
  --letter-spacing-tight: ${tokens.typography.letterSpacing.tight};
  --letter-spacing-normal: ${tokens.typography.letterSpacing.normal};
  --letter-spacing-wide: ${tokens.typography.letterSpacing.wide};
  
  /* Spacing */
  --spacing-xs: ${tokens.spacing.xs};
  --spacing-sm: ${tokens.spacing.sm};
  --spacing-md: ${tokens.spacing.md};
  --spacing-lg: ${tokens.spacing.lg};
  --spacing-xl: ${tokens.spacing.xl};
  --spacing-2xl: ${tokens.spacing['2xl']};
  --spacing-3xl: ${tokens.spacing['3xl']};
  
  /* Timing */
  --duration-quick-snap: ${tokens.timing.quickSnap};
  --duration-reaction: ${tokens.timing.reaction};
  --duration-transition: ${tokens.timing.transition};
  --duration-sequence: ${tokens.timing.sequence};
  --duration-flow: ${tokens.timing.flow};
  --duration-power: ${tokens.timing.power};
  
  /* Easing */
  --easing-snap: ${tokens.easing.snap};
  --easing-flow: ${tokens.easing.flow};
  --easing-precision: ${tokens.easing.precision};
  --easing-sprint: ${tokens.easing.sprint};
  --easing-glide: ${tokens.easing.glide};
  
  /* Shadows */
  --shadow-sm: ${tokens.shadows.sm};
  --shadow-md: ${tokens.shadows.md};
  --shadow-lg: ${tokens.shadows.lg};
  --shadow-xl: ${tokens.shadows.xl};
  --shadow-2xl: ${tokens.shadows['2xl']};
  
  /* Borders */
  --radius-sm: ${tokens.borders.radius.sm};
  --radius-md: ${tokens.borders.radius.md};
  --radius-lg: ${tokens.borders.radius.lg};
  --radius-xl: ${tokens.borders.radius.xl};
  --radius-full: ${tokens.borders.radius.full};
  
  --border-width-thin: ${tokens.borders.width.thin};
  --border-width-medium: ${tokens.borders.width.medium};
  --border-width-thick: ${tokens.borders.width.thick};
}
`;
}

/**
 * Get design system tokens (for programmatic access)
 */
export function getDesignTokens(): DesignTokens {
  return designSystem;
}

