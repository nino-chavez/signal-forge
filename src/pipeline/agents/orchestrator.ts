/**
 * Forge Orchestrator
 *
 * Central coordinator for the agentic content system.
 * Manages task routing, agent lifecycle, feedback loops, and task state.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import type { AgentMemory } from './base-agent.js';
import type {
  AgentMessage,
  AgentType,
  ClassificationResult,
  ContentTask,
  ContentMode,
  IterationConfig,
  ProductionResult,
  PublicationResult,
  PublicationTarget,
  ResearchContext,
  TaskProgress,
  TaskStatus,
} from '../../core/types/index.js';
import { generateTaskId } from '../../core/types/index.js';

// =============================================================================
// Orchestrator Configuration
// =============================================================================

export interface OrchestratorConfig {
  provider: AIProviderInterface;
  memory?: AgentMemory;
  iterationConfig?: Partial<IterationConfig>;
  verbose?: boolean;
}

const DEFAULT_ITERATION_CONFIG: IterationConfig = {
  maxIterations: 5,
  minScoreImprovement: 0.5,
  voiceScoreThreshold: 7,
  stallThreshold: 2,
};

// =============================================================================
// Task Result Types
// =============================================================================

export interface TaskResult {
  taskId: string;
  success: boolean;
  content?: string;
  voiceScore?: number;
  iterations?: number;
  researchContext?: ResearchContext;
  publications?: PublicationResult[];
  error?: string;
  duration: number;
}

// =============================================================================
// Orchestrator Class
// =============================================================================

export class ForgeOrchestrator {
  private readonly provider: AIProviderInterface;
  private readonly memory?: AgentMemory;
  private readonly iterationConfig: IterationConfig;
  private readonly verbose: boolean;

  // Task tracking
  private readonly activeTasks: Map<string, TaskProgress> = new Map();
  private readonly messageQueue: AgentMessage[] = [];

  // Agent registry (agents are registered lazily)
  private classifier?: ContentClassifier;
  private researchAgent?: ResearchAgentInterface;
  private productionAgent?: ProductionAgentInterface;
  private publicationAgent?: PublicationAgentInterface;

  constructor(config: OrchestratorConfig) {
    this.provider = config.provider;
    this.memory = config.memory;
    this.iterationConfig = {
      ...DEFAULT_ITERATION_CONFIG,
      ...config.iterationConfig,
    };
    this.verbose = config.verbose ?? false;
  }

  // ===========================================================================
  // Agent Registration
  // ===========================================================================

  registerClassifier(classifier: ContentClassifier): void {
    this.classifier = classifier;
    this.log('Registered classifier');
  }

  registerResearchAgent(agent: ResearchAgentInterface): void {
    this.researchAgent = agent;
    this.log('Registered research agent');
  }

  registerProductionAgent(agent: ProductionAgentInterface): void {
    this.productionAgent = agent;
    this.log('Registered production agent');
  }

  registerPublicationAgent(agent: PublicationAgentInterface): void {
    this.publicationAgent = agent;
    this.log('Registered publication agent');
  }

  // ===========================================================================
  // Task Submission
  // ===========================================================================

  /**
   * Submit a content task for processing
   */
  async submitTask(task: ContentTask): Promise<TaskResult> {
    const startTime = Date.now();
    const taskId = task.id || this.generateTaskId();
    task.id = taskId;

    this.log(`Submitting task: ${taskId}`, { type: task.type, mode: task.mode });

    // Initialize task tracking
    this.updateTaskProgress(taskId, {
      taskId,
      status: 'pending',
      startTime: new Date(),
      lastUpdate: new Date(),
    });

    try {
      // Step 1: Classify content mode if not specified
      let mode = task.mode;
      if (!mode && this.classifier) {
        this.updateTaskStatus(taskId, 'classifying');
        const classification = await this.classifier.classify(task.input, task.type);
        mode = classification.mode;
        task.mode = mode;
        this.log(`Classified as: ${mode} (confidence: ${classification.confidence})`);
      }

      // Step 2: Research (if enabled and agent available)
      let researchContext: ResearchContext | undefined;
      if (task.options?.enableResearch && this.researchAgent) {
        this.updateTaskStatus(taskId, 'researching');
        researchContext = await this.researchAgent.research(task);
        task.context = researchContext;
        this.log(`Research complete: ${researchContext.webResults?.length ?? 0} web results`);
      }

      // Step 3: Production (with optional iteration)
      if (!this.productionAgent) {
        throw new Error('Production agent not registered');
      }

      this.updateTaskStatus(taskId, 'producing');
      const enableIteration = task.options?.enableIteration ?? true;
      const maxIterations = task.options?.maxIterations ?? this.iterationConfig.maxIterations;

      const productionResult = await this.productionAgent.produce(task, {
        enableIteration,
        maxIterations,
        voiceScoreThreshold: this.iterationConfig.voiceScoreThreshold,
        minScoreImprovement: this.iterationConfig.minScoreImprovement,
      });

      this.updateTaskProgress(taskId, {
        taskId,
        status: productionResult.approved ? 'completed' : 'revising',
        iteration: productionResult.iterations,
        voiceScore: productionResult.voiceCheck.score,
        startTime: this.activeTasks.get(taskId)?.startTime ?? new Date(),
        lastUpdate: new Date(),
      });

      // Step 4: Publication (if targets specified and agent available)
      let publications: PublicationResult[] | undefined;
      if (task.outputFormats && this.publicationAgent) {
        this.updateTaskStatus(taskId, 'publishing');
        publications = await this.publicationAgent.publish(
          productionResult.content,
          task.outputFormats,
          task.type
        );
        this.log(`Published to ${publications.filter((p) => p.success).length} targets`);
      }

      // Complete
      this.updateTaskStatus(taskId, 'completed');
      const duration = Date.now() - startTime;

      return {
        taskId,
        success: productionResult.approved,
        content: productionResult.content,
        voiceScore: productionResult.voiceCheck.score,
        iterations: productionResult.iterations,
        researchContext,
        publications,
        duration,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.updateTaskStatus(taskId, 'failed', errorMessage);
      this.log(`Task failed: ${errorMessage}`);

      return {
        taskId,
        success: false,
        error: errorMessage,
        duration: Date.now() - startTime,
      };
    }
  }

  // ===========================================================================
  // Task Management
  // ===========================================================================

  /**
   * Get current status of a task
   */
  getTaskStatus(taskId: string): TaskProgress | undefined {
    return this.activeTasks.get(taskId);
  }

  /**
   * Get all active tasks
   */
  getActiveTasks(): TaskProgress[] {
    return Array.from(this.activeTasks.values()).filter(
      (t) => t.status !== 'completed' && t.status !== 'failed'
    );
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): boolean {
    const task = this.activeTasks.get(taskId);
    if (task && task.status !== 'completed' && task.status !== 'failed') {
      this.updateTaskStatus(taskId, 'failed', 'Cancelled by user');
      return true;
    }
    return false;
  }

  // ===========================================================================
  // Agent Communication
  // ===========================================================================

  /**
   * Route a message between agents
   */
  async routeMessage(message: AgentMessage): Promise<void> {
    this.messageQueue.push(message);
    this.log(`Message routed: ${message.from} -> ${message.to}`, { type: message.type });

    // Process message based on type
    switch (message.type) {
      case 'revision-request':
        if (this.productionAgent) {
          // Revision requests are handled within the production agent's loop
          this.log('Revision request queued for production agent');
        }
        break;
      case 'feedback':
        // Store feedback in memory for learning
        if (this.memory && message.payload) {
          await this.memory.remember(
            `feedback_${message.correlationId}`,
            message.payload,
            'session'
          );
        }
        break;
      default:
        this.log(`Unhandled message type: ${message.type}`);
    }
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private updateTaskProgress(taskId: string, progress: TaskProgress): void {
    this.activeTasks.set(taskId, progress);
  }

  private updateTaskStatus(taskId: string, status: TaskStatus, error?: string): void {
    const existing = this.activeTasks.get(taskId);
    if (existing) {
      this.activeTasks.set(taskId, {
        ...existing,
        status,
        error,
        lastUpdate: new Date(),
      });
    }
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(message: string, data?: unknown): void {
    if (this.verbose) {
      const timestamp = new Date().toISOString();
      if (data !== undefined) {
        console.log(`[${timestamp}] [Orchestrator] ${message}`, JSON.stringify(data, null, 2));
      } else {
        console.log(`[${timestamp}] [Orchestrator] ${message}`);
      }
    }
  }
}

// =============================================================================
// Agent Interfaces (for registration)
// =============================================================================

export interface ContentClassifier {
  classify(input: string, requestedType?: string): Promise<ClassificationResult>;
}

export interface ResearchAgentInterface {
  research(task: ContentTask): Promise<ResearchContext>;
}

export interface ProductionAgentInterface {
  produce(
    task: ContentTask,
    config: {
      enableIteration: boolean;
      maxIterations: number;
      voiceScoreThreshold: number;
      minScoreImprovement: number;
    }
  ): Promise<ProductionResult>;
}

export interface PublicationAgentInterface {
  publish(
    content: string,
    formats: string[],
    contentType: string
  ): Promise<PublicationResult[]>;
}

// =============================================================================
// Factory Function
// =============================================================================

export function createOrchestrator(config: OrchestratorConfig): ForgeOrchestrator {
  return new ForgeOrchestrator(config);
}
