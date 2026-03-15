/**
 * Content Mode Registry
 *
 * Central registry for content mode definitions. Modes define classification
 * signals (keywords, audience markers, structural patterns) and their default
 * content type mappings.
 *
 * Built-in modes are registered at startup via registerBuiltInPresets().
 * Custom modes can be registered at runtime via registerMode().
 */

import type { ContentModeDefinition } from './types.js';

const DEFAULT_MODE_ID = 'advisory';

const modes = new Map<string, ContentModeDefinition>();

// Reverse lookup: content type -> mode id
let typeToModeCache: Map<string, string> | null = null;

function invalidateCache(): void {
  typeToModeCache = null;
}

function buildTypeToModeMap(): Map<string, string> {
  if (typeToModeCache) return typeToModeCache;
  const map = new Map<string, string>();
  for (const mode of modes.values()) {
    for (const contentType of mode.defaultFor) {
      map.set(contentType, mode.id);
    }
  }
  typeToModeCache = map;
  return map;
}

/**
 * Register a content mode definition.
 */
export function registerMode(definition: ContentModeDefinition): void {
  modes.set(definition.id, definition);
  invalidateCache();
}

/**
 * Get a mode definition by ID. Returns undefined if not found.
 */
export function getMode(id: string): ContentModeDefinition | undefined {
  return modes.get(id);
}

/**
 * Get the default mode ID for a content type.
 * Falls back to DEFAULT_MODE_ID if no mode claims this type.
 */
export function getModeForContentType(contentType: string): string {
  const map = buildTypeToModeMap();
  return map.get(contentType) ?? DEFAULT_MODE_ID;
}

/**
 * Check if a content type belongs to a specific mode.
 */
export function isContentTypeInMode(contentType: string, modeId: string): boolean {
  return getModeForContentType(contentType) === modeId;
}

/**
 * List all registered modes with metadata.
 */
export function listModes(): Array<{ id: string; name: string; description: string }> {
  return Array.from(modes.values()).map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
  }));
}

/**
 * Get all registered mode definitions (for classifier iteration).
 */
export function getAllModes(): ContentModeDefinition[] {
  return Array.from(modes.values());
}

/**
 * Check if a mode ID is registered.
 */
export function isValidMode(mode: string): boolean {
  return modes.has(mode);
}

/**
 * Get all content types registered across all modes.
 */
export function getAllContentTypes(): string[] {
  const map = buildTypeToModeMap();
  return Array.from(map.keys());
}

/**
 * Get the default mode ID used when no signals match.
 */
export function getDefaultModeId(): string {
  return DEFAULT_MODE_ID;
}
