/**
 * Publication Types
 *
 * Types for publishing content to various targets.
 */

export interface PublicationTarget {
  type: 'local' | 'cms' | 'email' | 'slides';
  platform: string;
  config?: Record<string, unknown>;
}

export interface PublicationResult {
  target: PublicationTarget;
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
  timestamp: Date;
}
