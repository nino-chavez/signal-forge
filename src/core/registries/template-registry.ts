/**
 * Template Registry
 *
 * Central registry for content structure templates. Templates define
 * the structural skeleton for a content type. Parsers (engine code)
 * consume these structures but don't define them.
 *
 * Built-in templates are registered at startup via registerBuiltInPresets().
 * Custom templates can be registered at runtime via registerTemplate().
 */

import type { TemplateDefinition } from './types.js';

const templates = new Map<string, TemplateDefinition>();

// Reverse lookup: content type -> template id
let typeToTemplateCache: Map<string, string> | null = null;

function invalidateCache(): void {
  typeToTemplateCache = null;
}

function buildTypeToTemplateMap(): Map<string, string> {
  if (typeToTemplateCache) return typeToTemplateCache;
  const map = new Map<string, string>();
  for (const template of templates.values()) {
    for (const contentType of template.forContentTypes) {
      map.set(contentType, template.id);
    }
  }
  typeToTemplateCache = map;
  return map;
}

/**
 * Register a template definition.
 */
export function registerTemplate(definition: TemplateDefinition): void {
  templates.set(definition.id, definition);
  invalidateCache();
}

/**
 * Get a template definition by ID. Returns undefined if not found.
 */
export function getTemplate(id: string): TemplateDefinition | undefined {
  return templates.get(id);
}

/**
 * Get the template for a given content type.
 * Returns undefined if no template is registered for the type.
 */
export function getTemplateForType(contentType: string): TemplateDefinition | undefined {
  const map = buildTypeToTemplateMap();
  const templateId = map.get(contentType);
  if (!templateId) return undefined;
  return templates.get(templateId);
}

/**
 * List all registered templates with metadata.
 */
export function listTemplates(): Array<{ id: string; name: string; description: string; forContentTypes: string[] }> {
  return Array.from(templates.values()).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    forContentTypes: t.forContentTypes,
  }));
}
