/**
 * Dark Theme
 *
 * Dark variant demonstrating theme extensibility. Dark backgrounds,
 * light text, accent-driven highlights. Uses system fonts for
 * broad compatibility.
 */

import type { PresentationTheme } from '../theme-types.js';

export const darkTheme: PresentationTheme = {
  id: 'dark',
  name: 'Dark',
  description: 'Dark presentation theme — dark backgrounds, light text, system fonts',

  dimensions: { width: 13.33, height: 7.5 },

  colors: {
    primary: '818cf8',
    secondary: '34d399',
    dark: '0f172a',
    light: '1e293b',
    highlight: 'fbbf24',

    textPrimary: 'f8fafc',
    textSecondary: 'cbd5e1',
    textBody: 'e2e8f0',
    textMuted: '94a3b8',
    textInverse: '0f172a',

    backgroundWhite: '0f172a',
    backgroundLight: '1e293b',
    backgroundAccent: '1e1b4b',
    backgroundDark: '020617',

    tableHeaderBg: '818cf8',
    tableHeaderText: '0f172a',
    tableStripeBg: '1e293b',
    tableBorderColor: '334155',

    success: '34d399',
    warning: 'fbbf24',
    error: 'f87171',
  },

  typography: {
    fontPrimary: 'Arial',
    fontSecondary: 'Arial',
    fontBold: 'Arial',
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
    accentLineHeight: 0.1,
    showTitleDivider: false,
    titleDividerHeight: 0,
    pillRadius: 0.1,
  },

  footer: {
    template: '',
    showSlideNumbers: true,
    color: '94a3b8',
  },
};
