/**
 * Task Types
 *
 * Types for content tasks, options, constraints, and progress tracking.
 */

import type { AIProvider } from '../../providers/ai-provider.js';
import type { ContentMode, ContentType, OutputFormat } from './content.js';
import type { ResearchContext } from './research.js';
import type { AgentType } from './agents.js';

export interface ContentTask {
  id: string;
  type: ContentType;
  mode?: ContentMode; // Auto-detected if not specified
  input: string;
  context?: ResearchContext;
  constraints?: ContentConstraints;
  outputFormats?: OutputFormat[];
  options?: TaskOptions;
}

export interface ContentConstraints {
  maxTokens?: number;
  targetAudience?: string;
  clientName?: string;
  strategicObjectives?: string[];
  avoidTopics?: string[];
}

export interface TaskOptions {
  enableResearch?: boolean;
  enableIteration?: boolean;
  maxIterations?: number;
  enableMemory?: boolean;
  provider?: AIProvider;
}

export type TaskStatus =
  | 'pending'
  | 'classifying'
  | 'researching'
  | 'producing'
  | 'revising'
  | 'publishing'
  | 'completed'
  | 'failed';

export interface TaskProgress {
  taskId: string;
  status: TaskStatus;
  currentAgent?: AgentType;
  iteration?: number;
  voiceScore?: number;
  startTime: Date;
  lastUpdate: Date;
  error?: string;
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
