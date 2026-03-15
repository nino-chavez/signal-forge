/**
 * Content Types and Modes
 *
 * Core type definitions for content classification and output formats.
 * ContentMode is a string to allow custom modes registered at runtime.
 * BuiltInContentMode provides type safety for the four built-in modes.
 */

import { getModeForContentType, isContentTypeInMode } from '../registries/mode-registry.js';

/** Runtime content mode identifier — any registered string */
export type ContentMode = string;

/** Built-in modes for type safety in preset definitions */
export type BuiltInContentMode = 'thought-leadership' | 'architecture' | 'advisory' | 'documentation';

export type ContentType =
  | 'deck'
  | 'pov'
  | 'paper'
  | 'architecture'
  | 'adr'
  | 'tech-deck'
  | 'spec'
  | 'brief'
  | 'roadmap'
  | 'guide'
  | 'reference'
  | 'tutorial';

export type OutputFormat = 'pptx' | 'docx' | 'pdf' | 'html' | 'slides' | 'markdown';

/**
 * Check if a content type is documentation.
 * Delegates to the mode registry.
 */
export function isDocumentationType(type: ContentType): boolean {
  return isContentTypeInMode(type, 'documentation');
}

/**
 * Get the content mode for a content type.
 * Delegates to the mode registry.
 */
export function getModeForType(type: ContentType): ContentMode {
  return getModeForContentType(type);
}
