/**
 * Theme Registry
 *
 * Central registry for presentation themes. Provides lookup, listing,
 * and registration of custom themes at runtime.
 */

import type { PresentationTheme } from './theme-types.js';
import { signalForgeTheme } from './themes/signal-forge.js';
import { darkTheme } from './themes/dark.js';

export const DEFAULT_THEME_ID = 'signal-forge';

const themes = new Map<string, PresentationTheme>();

// Register built-in themes
themes.set(signalForgeTheme.id, signalForgeTheme);
themes.set(darkTheme.id, darkTheme);

/**
 * Get a theme by ID. Falls back to the default theme if not found.
 */
export function getTheme(id?: string): PresentationTheme {
  if (!id) return themes.get(DEFAULT_THEME_ID)!;
  const theme = themes.get(id);
  if (!theme) {
    console.warn(`[theme-registry] Theme "${id}" not found. Using default "${DEFAULT_THEME_ID}".`);
    return themes.get(DEFAULT_THEME_ID)!;
  }
  return theme;
}

/**
 * List all registered theme IDs and names.
 */
export function listThemes(): Array<{ id: string; name: string; description: string }> {
  return Array.from(themes.values()).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
  }));
}

/**
 * Register a custom theme at runtime.
 */
export function registerTheme(theme: PresentationTheme): void {
  themes.set(theme.id, theme);
}
