/**
 * Utility Types
 *
 * Generic utility types used across the codebase.
 */

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
