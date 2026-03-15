/**
 * Memory Types
 *
 * Types for session and long-term memory storage.
 */

import type { ContentType } from './content.js';

export type MemoryScope = 'session' | 'long-term';

export interface MemoryEntry {
  key: string;
  value: unknown;
  scope: MemoryScope;
  timestamp: Date;
  metadata: MemoryMetadata;
}

export interface MemoryMetadata {
  taskId?: string;
  contentType?: ContentType;
  clientName?: string;
  tags?: string[];
  accessCount?: number;
  lastAccessed?: Date;
}
