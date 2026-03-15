/**
 * Core Types - Barrel Export
 *
 * Re-exports all type definitions for convenient importing.
 */

// Content modes and types
export type {
  ContentMode,
  BuiltInContentMode,
  ContentType,
  OutputFormat,
} from './content.js';
export {
  isDocumentationType,
  getModeForType,
} from './content.js';

// Research context
export type {
  ResearchContext,
  WebSearchResult,
  DocumentResult,
  VerifiedFact,
  CompetitiveInsight,
} from './research.js';

// Tasks
export type {
  ContentTask,
  ContentConstraints,
  TaskOptions,
  TaskStatus,
  TaskProgress,
} from './tasks.js';
export {
  generateTaskId,
} from './tasks.js';

// Agents
export type {
  AgentMessage,
  AgentType,
  MessageType,
  AgentInput,
  AgentOutput,
} from './agents.js';
export {
  generateCorrelationId,
} from './agents.js';

// Voice
export type {
  RevisionFeedback,
  EnhancedVoiceCheckResult,
  RevisionSuggestion,
  TextRange,
} from './voice.js';

// Production
export type {
  ProductionResult,
  IterationState,
  RevisionStrategy,
  IterationConfig,
} from './production.js';

// Memory
export type {
  MemoryScope,
  MemoryEntry,
  MemoryMetadata,
} from './memory.js';

// Publication
export type {
  PublicationTarget,
  PublicationResult,
} from './publication.js';

// Tools
export type {
  AgentTool,
  ToolParams,
  ToolResult,
} from './tools.js';

// Classification
export type {
  ClassificationResult,
  ClassificationSignal,
  AlternativeMode,
} from './classification.js';

// Utility types
export type { DeepPartial } from './utils.js';
