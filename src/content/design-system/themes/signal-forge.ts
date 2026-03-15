/**
 * Signal Forge Theme
 *
 * Default theme — ported from the existing presentation-theme.ts design tokens.
 * Rival Sans font family, violet (#7c3aed) primary, 13.33" x 7.5" widescreen.
 */

import type { PresentationTheme } from '../theme-types.js';

export const signalForgeTheme: PresentationTheme = {
  id: 'signal-forge',
  name: 'Signal Forge',
  description: 'Default Signal Forge brand — Rival Sans, violet accent, widescreen 16:9',

  dimensions: { width: 13.33, height: 7.5 },

  colors: {
    primary: '7c3aed',
    secondary: 'ea580c',
    dark: '111827',
    light: 'f5f5f5',
    highlight: 'f59e0b',

    textPrimary: '171717',
    textSecondary: '404040',
    textBody: '525252',
    textMuted: 'a3a3a3',
    textInverse: 'fafafa',

    backgroundWhite: 'FFFFFF',
    backgroundLight: 'f5f5f5',
    backgroundAccent: 'f5e6ff',
    backgroundDark: '111827',

    tableHeaderBg: '7c3aed',
    tableHeaderText: 'FFFFFF',
    tableStripeBg: 'f5f5f5',
    tableBorderColor: 'e5e5e5',

    success: '10b981',
    warning: 'f59e0b',
    error: 'ef4444',
  },

  typography: {
    fontPrimary: 'rival-sans',
    fontSecondary: 'rival-sans',
    fontBold: 'rival-sans',
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

  footer: {
    template: 'Signal Forge',
    showSlideNumbers: true,
  },
};
