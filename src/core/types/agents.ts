/**
 * Agent Types
 *
 * Types for agent communication, input/output, and messaging.
 */

import type { ContentTask } from './tasks.js';
import type { ResearchContext } from './research.js';
import type { RevisionFeedback } from './voice.js';

export interface AgentMessage {
  from: AgentType;
  to: AgentType;
  type: MessageType;
  payload: unknown;
  timestamp: Date;
  correlationId: string;
}

export type AgentType =
  | 'orchestrator'
  | 'research'
  | 'production'
  | 'revision'
  | 'publication';

export type MessageType =
  | 'task-assignment'
  | 'task-complete'
  | 'task-failed'
  | 'revision-request'
  | 'feedback'
  | 'context-update';

export interface AgentInput {
  task: ContentTask;
  context?: ResearchContext;
  previousOutput?: AgentOutput;
  feedback?: RevisionFeedback;
}

export interface AgentOutput {
  agentType: AgentType;
  success: boolean;
  content?: string;
  metadata?: Record<string, unknown>;
  error?: string;
  duration?: number;
}

export function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
