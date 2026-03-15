/**
 * Agents Module
 *
 * Exports all agent-related types, classes, and factories.
 */

// Types
export * from '../../core/types/index.js';

// Base Agent
export { BaseAgent, SimpleMemory, type AgentConfig, type AgentMemory } from './base-agent.js';

// Orchestrator
export {
  ForgeOrchestrator,
  createOrchestrator,
  type OrchestratorConfig,
  type TaskResult,
  type ContentClassifier,
  type ResearchAgentInterface,
  type ProductionAgentInterface,
  type PublicationAgentInterface,
} from './orchestrator.js';

// Production Agent
export {
  ProductionAgent,
  createProductionAgent,
  type ProductionAgentConfig,
  type ProductionConfig,
} from './production-agent.js';

// Revision Agent
export {
  RevisionAgent,
  createRevisionAgent,
  type RevisionAgentConfig,
} from './revision-agent.js';

// Iteration Controller
export {
  IterationController,
  createIterationController,
  estimateIterations,
  analyzeIterationHistory,
} from './iteration-controller.js';
