/**
 * Long-Term Memory Store
 *
 * JSON file-based persistent storage for cross-session memory.
 * Stores client context, successful patterns, and revision history.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { homedir } from 'os';
import { loadConfig } from '../../core/config.js';
import type { MemoryEntry, MemoryMetadata } from '../../core/types/index.js';
import type { MemoryStore } from './memory-system.js';

// =============================================================================
// Types
// =============================================================================

interface StoredEntry {
  key: string;
  value: unknown;
  metadata: MemoryMetadata;
  createdAt: string;
  updatedAt: string;
}

interface StoreData {
  version: string;
  entries: Record<string, StoredEntry>;
  stats: {
    totalWrites: number;
    totalReads: number;
    lastPruned?: string;
  };
}

// =============================================================================
// JSON File Store Implementation
// =============================================================================

export class JsonFileStore implements MemoryStore {
  private readonly filePath: string;
  private data: StoreData;
  private isDirty: boolean = false;
  private saveTimer?: ReturnType<typeof setTimeout>;
  private readonly saveDebounceMs: number;

  constructor(
    filePath?: string,
    options?: { saveDebounceMs?: number }
  ) {
    if (filePath) {
      this.filePath = filePath;
    } else {
      const config = loadConfig();
      if (process.env.FORGE_MEMORY_PATH) {
        this.filePath = process.env.FORGE_MEMORY_PATH;
      } else if (config.memory?.path) {
        this.filePath = config.memory.path;
      } else {
        this.filePath = join(homedir(), '.signal-forge', 'memory.json');
      }
    }
    this.saveDebounceMs = options?.saveDebounceMs ?? 1000;
    this.data = this.load();
  }

  /**
   * Store a value
   */
  async remember(key: string, value: unknown, metadata?: MemoryMetadata): Promise<void> {
    const now = new Date().toISOString();
    const existing = this.data.entries[key];

    this.data.entries[key] = {
      key,
      value,
      metadata: {
        ...metadata,
        accessCount: (existing?.metadata.accessCount ?? 0) + 1,
        lastAccessed: new Date(),
      },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.data.stats.totalWrites++;
    this.scheduleSave();
  }

  /**
   * Retrieve a value
   */
  async recall(key: string): Promise<unknown> {
    const entry = this.data.entries[key];
    if (entry) {
      // Update access metadata
      entry.metadata.accessCount = (entry.metadata.accessCount ?? 0) + 1;
      entry.metadata.lastAccessed = new Date();
      entry.updatedAt = new Date().toISOString();
      this.data.stats.totalReads++;
      this.scheduleSave();
      return entry.value;
    }
    return undefined;
  }

  /**
   * Remove a value
   */
  async forget(key: string): Promise<void> {
    if (this.data.entries[key]) {
      delete this.data.entries[key];
      this.scheduleSave();
    }
  }

  /**
   * Search for entries matching a pattern
   */
  async search(pattern: string): Promise<MemoryEntry[]> {
    const regex = new RegExp(pattern, 'i');
    const results: MemoryEntry[] = [];

    for (const [key, entry] of Object.entries(this.data.entries)) {
      if (regex.test(key)) {
        results.push({
          key,
          value: entry.value,
          scope: 'long-term',
          timestamp: new Date(entry.updatedAt),
          metadata: entry.metadata,
        });
      }
    }

    return results;
  }

  /**
   * List all keys
   */
  async keys(): Promise<string[]> {
    return Object.keys(this.data.entries);
  }

  /**
   * Clear all entries
   */
  async clear(): Promise<void> {
    this.data.entries = {};
    this.scheduleSave();
  }

  /**
   * Get store size
   */
  async size(): Promise<number> {
    return Object.keys(this.data.entries).length;
  }

  // ===========================================================================
  // Additional Methods
  // ===========================================================================

  /**
   * Get entries by tag
   */
  async getByTag(tag: string): Promise<MemoryEntry[]> {
    const results: MemoryEntry[] = [];

    for (const [key, entry] of Object.entries(this.data.entries)) {
      if (entry.metadata.tags?.includes(tag)) {
        results.push({
          key,
          value: entry.value,
          scope: 'long-term',
          timestamp: new Date(entry.updatedAt),
          metadata: entry.metadata,
        });
      }
    }

    return results;
  }

  /**
   * Get entries by client name
   */
  async getByClient(clientName: string): Promise<MemoryEntry[]> {
    const results: MemoryEntry[] = [];

    for (const [key, entry] of Object.entries(this.data.entries)) {
      if (entry.metadata.clientName === clientName) {
        results.push({
          key,
          value: entry.value,
          scope: 'long-term',
          timestamp: new Date(entry.updatedAt),
          metadata: entry.metadata,
        });
      }
    }

    return results;
  }

  /**
   * Get store statistics
   */
  getStats(): {
    entryCount: number;
    totalWrites: number;
    totalReads: number;
    lastPruned?: Date;
  } {
    return {
      entryCount: Object.keys(this.data.entries).length,
      totalWrites: this.data.stats.totalWrites,
      totalReads: this.data.stats.totalReads,
      lastPruned: this.data.stats.lastPruned
        ? new Date(this.data.stats.lastPruned)
        : undefined,
    };
  }

  /**
   * Prune old entries based on relevance decay
   */
  async prune(options?: {
    maxAge?: number; // Max age in days
    maxEntries?: number;
    minAccessCount?: number;
  }): Promise<number> {
    const maxAge = options?.maxAge ?? 90; // Default 90 days
    const maxEntries = options?.maxEntries ?? 1000;
    const minAccessCount = options?.minAccessCount ?? 1;

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - maxAge * 24 * 60 * 60 * 1000);

    let prunedCount = 0;
    const entries = Object.entries(this.data.entries);

    // First pass: remove old entries with low access
    for (const [key, entry] of entries) {
      const updatedAt = new Date(entry.updatedAt);
      const accessCount = entry.metadata.accessCount ?? 0;

      if (updatedAt < cutoffDate && accessCount < minAccessCount) {
        delete this.data.entries[key];
        prunedCount++;
      }
    }

    // Second pass: if still over limit, remove least accessed
    const remainingEntries = Object.entries(this.data.entries);
    if (remainingEntries.length > maxEntries) {
      const sortedByAccess = remainingEntries.sort(
        (a, b) => (a[1].metadata.accessCount ?? 0) - (b[1].metadata.accessCount ?? 0)
      );

      const removeCount = remainingEntries.length - maxEntries;
      for (let i = 0; i < removeCount; i++) {
        delete this.data.entries[sortedByAccess[i][0]];
        prunedCount++;
      }
    }

    this.data.stats.lastPruned = now.toISOString();
    this.scheduleSave();

    return prunedCount;
  }

  /**
   * Force save to disk
   */
  async flush(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
    }
    this.save();
  }

  /**
   * Export all data
   */
  export(): StoreData {
    return JSON.parse(JSON.stringify(this.data));
  }

  /**
   * Import data (merges with existing)
   */
  async import(data: Partial<StoreData>, merge: boolean = true): Promise<void> {
    if (merge && data.entries) {
      for (const [key, entry] of Object.entries(data.entries)) {
        this.data.entries[key] = entry;
      }
    } else if (data.entries) {
      this.data.entries = data.entries;
    }

    this.scheduleSave();
  }

  // ===========================================================================
  // Private Methods
  // ===========================================================================

  private load(): StoreData {
    try {
      if (existsSync(this.filePath)) {
        const content = readFileSync(this.filePath, 'utf-8');
        return JSON.parse(content) as StoreData;
      }
    } catch (error) {
      console.warn(`Failed to load memory from ${this.filePath}:`, error);
    }

    return this.createEmptyStore();
  }

  private save(): void {
    try {
      const dir = dirname(this.filePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const content = JSON.stringify(this.data, null, 2);
      writeFileSync(this.filePath, content, 'utf-8');
      this.isDirty = false;
    } catch (error) {
      console.error(`Failed to save memory to ${this.filePath}:`, error);
    }
  }

  private scheduleSave(): void {
    this.isDirty = true;

    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(() => {
      this.save();
      this.saveTimer = undefined;
    }, this.saveDebounceMs);
  }

  private createEmptyStore(): StoreData {
    return {
      version: '1.0.0',
      entries: {},
      stats: {
        totalWrites: 0,
        totalReads: 0,
      },
    };
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createLongTermStore(
  filePath?: string,
  options?: { saveDebounceMs?: number }
): JsonFileStore {
  return new JsonFileStore(filePath, options);
}
