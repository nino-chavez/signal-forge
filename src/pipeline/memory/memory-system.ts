/**
 * Memory System
 *
 * Unified memory interface for the agentic content system.
 * Supports both session (in-memory) and long-term (JSON file) storage.
 */

import type { MemoryEntry, MemoryMetadata, MemoryScope } from '../../core/types/index.js';

// =============================================================================
// Memory Interface
// =============================================================================

export interface MemoryStore {
  /**
   * Store a value
   */
  remember(key: string, value: unknown, metadata?: MemoryMetadata): Promise<void>;

  /**
   * Retrieve a value
   */
  recall(key: string): Promise<unknown>;

  /**
   * Remove a value
   */
  forget(key: string): Promise<void>;

  /**
   * Search for entries matching a pattern
   */
  search(pattern: string): Promise<MemoryEntry[]>;

  /**
   * List all keys
   */
  keys(): Promise<string[]>;

  /**
   * Clear all entries
   */
  clear(): Promise<void>;

  /**
   * Get store size
   */
  size(): Promise<number>;
}

// =============================================================================
// Unified Memory System
// =============================================================================

export interface MemorySystemConfig {
  sessionStore?: MemoryStore;
  longTermStore?: MemoryStore;
  defaultScope?: MemoryScope;
  maxEntries?: number;
  pruneThreshold?: number;
}

export class MemorySystem {
  private readonly sessionStore: MemoryStore;
  private readonly longTermStore?: MemoryStore;
  private readonly defaultScope: MemoryScope;
  private readonly maxEntries: number;
  private readonly pruneThreshold: number;

  constructor(config: MemorySystemConfig) {
    this.sessionStore = config.sessionStore ?? new InMemoryStore();
    this.longTermStore = config.longTermStore;
    this.defaultScope = config.defaultScope ?? 'session';
    this.maxEntries = config.maxEntries ?? 1000;
    this.pruneThreshold = config.pruneThreshold ?? 0.8; // Prune at 80% capacity
  }

  /**
   * Store a value in memory
   */
  async remember(
    key: string,
    value: unknown,
    scope: MemoryScope = this.defaultScope,
    metadata?: MemoryMetadata
  ): Promise<void> {
    const store = this.getStore(scope);

    // Check capacity and prune if needed
    const currentSize = await store.size();
    if (currentSize >= this.maxEntries * this.pruneThreshold) {
      await this.pruneOldEntries(store);
    }

    const enrichedMetadata: MemoryMetadata = {
      ...metadata,
      accessCount: 1,
      lastAccessed: new Date(),
    };

    await store.remember(key, value, enrichedMetadata);
  }

  /**
   * Retrieve a value from memory
   * Checks session first, then long-term if not found
   */
  async recall(key: string, scope?: MemoryScope): Promise<unknown> {
    // If scope specified, check only that store
    if (scope) {
      return this.getStore(scope).recall(key);
    }

    // Check session first
    const sessionValue = await this.sessionStore.recall(key);
    if (sessionValue !== undefined) {
      return sessionValue;
    }

    // Fall back to long-term
    if (this.longTermStore) {
      return this.longTermStore.recall(key);
    }

    return undefined;
  }

  /**
   * Remove a value from memory
   */
  async forget(key: string, scope?: MemoryScope): Promise<void> {
    if (scope) {
      await this.getStore(scope).forget(key);
    } else {
      // Remove from both stores
      await this.sessionStore.forget(key);
      if (this.longTermStore) {
        await this.longTermStore.forget(key);
      }
    }
  }

  /**
   * Search for entries across stores
   */
  async search(pattern: string, scope?: MemoryScope): Promise<MemoryEntry[]> {
    if (scope) {
      return this.getStore(scope).search(pattern);
    }

    // Search both stores and merge results
    const sessionResults = await this.sessionStore.search(pattern);
    const longTermResults = this.longTermStore
      ? await this.longTermStore.search(pattern)
      : [];

    // Deduplicate by key, preferring session entries
    const resultMap = new Map<string, MemoryEntry>();
    for (const entry of longTermResults) {
      resultMap.set(entry.key, entry);
    }
    for (const entry of sessionResults) {
      resultMap.set(entry.key, entry);
    }

    return Array.from(resultMap.values());
  }

  /**
   * Promote an entry from session to long-term storage
   */
  async promote(key: string): Promise<boolean> {
    if (!this.longTermStore) {
      return false;
    }

    const value = await this.sessionStore.recall(key);
    if (value === undefined) {
      return false;
    }

    await this.longTermStore.remember(key, value);
    return true;
  }

  /**
   * Get memory statistics
   */
  async getStats(): Promise<{
    sessionSize: number;
    longTermSize: number;
    maxEntries: number;
  }> {
    return {
      sessionSize: await this.sessionStore.size(),
      longTermSize: this.longTermStore ? await this.longTermStore.size() : 0,
      maxEntries: this.maxEntries,
    };
  }

  /**
   * Clear session memory
   */
  async clearSession(): Promise<void> {
    await this.sessionStore.clear();
  }

  /**
   * Export all memory (for backup/debugging)
   */
  async export(): Promise<{
    session: MemoryEntry[];
    longTerm: MemoryEntry[];
  }> {
    const sessionKeys = await this.sessionStore.keys();
    const sessionEntries: MemoryEntry[] = [];
    for (const key of sessionKeys) {
      const value = await this.sessionStore.recall(key);
      sessionEntries.push({
        key,
        value,
        scope: 'session',
        timestamp: new Date(),
        metadata: {},
      });
    }

    const longTermEntries: MemoryEntry[] = [];
    if (this.longTermStore) {
      const longTermKeys = await this.longTermStore.keys();
      for (const key of longTermKeys) {
        const value = await this.longTermStore.recall(key);
        longTermEntries.push({
          key,
          value,
          scope: 'long-term',
          timestamp: new Date(),
          metadata: {},
        });
      }
    }

    return {
      session: sessionEntries,
      longTerm: longTermEntries,
    };
  }

  private getStore(scope: MemoryScope): MemoryStore {
    if (scope === 'long-term' && this.longTermStore) {
      return this.longTermStore;
    }
    return this.sessionStore;
  }

  private async pruneOldEntries(store: MemoryStore): Promise<void> {
    // Get all entries and sort by last accessed
    const allEntries = await store.search('.*');
    const sortedEntries = allEntries.sort((a, b) => {
      const aTime = a.metadata.lastAccessed?.getTime() ?? 0;
      const bTime = b.metadata.lastAccessed?.getTime() ?? 0;
      return aTime - bTime;
    });

    // Remove oldest 20% of entries
    const removeCount = Math.floor(sortedEntries.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      await store.forget(sortedEntries[i].key);
    }
  }
}

// =============================================================================
// In-Memory Store Implementation
// =============================================================================

export class InMemoryStore implements MemoryStore {
  private readonly store: Map<string, { value: unknown; metadata: MemoryMetadata }> =
    new Map();

  async remember(key: string, value: unknown, metadata?: MemoryMetadata): Promise<void> {
    this.store.set(key, {
      value,
      metadata: metadata ?? {},
    });
  }

  async recall(key: string): Promise<unknown> {
    const entry = this.store.get(key);
    if (entry) {
      // Update access metadata
      entry.metadata.accessCount = (entry.metadata.accessCount ?? 0) + 1;
      entry.metadata.lastAccessed = new Date();
      return entry.value;
    }
    return undefined;
  }

  async forget(key: string): Promise<void> {
    this.store.delete(key);
  }

  async search(pattern: string): Promise<MemoryEntry[]> {
    const regex = new RegExp(pattern, 'i');
    const results: MemoryEntry[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (regex.test(key)) {
        results.push({
          key,
          value: entry.value,
          scope: 'session',
          timestamp: new Date(),
          metadata: entry.metadata,
        });
      }
    }

    return results;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async size(): Promise<number> {
    return this.store.size;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createMemorySystem(config?: MemorySystemConfig): MemorySystem {
  return new MemorySystem(config ?? {});
}
