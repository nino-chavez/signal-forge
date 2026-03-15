/**
 * Production Agent
 *
 * Orchestrates the content production workflow with feedback loops.
 * Coordinates Ghost Writer → Copywriter → Editor → Revision cycles
 * until voice score threshold is met or max iterations reached.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import { GhostWriter, type GhostWriterInput } from '../roles/ghost-writer.js';
import { Copywriter, type CopywriterInput } from '../roles/copywriter.js';
import { Editor, type EditorInput } from '../roles/editor.js';
import { DocumentationWriter, type DocumentationType } from '../roles/documentation-writer.js';
import { checkVoiceEnhanced } from '../../content/voice/voice-checker-v2.js';
import { checkVoiceForMode } from '../../content/voice/mode-voice-checker.js';
import { BaseAgent, type AgentConfig, type AgentMemory } from './base-agent.js';
import { RevisionAgent, type RevisionAgentConfig } from './revision-agent.js';
import {
  IterationController,
  createIterationController,
} from './iteration-controller.js';
import type {
  AgentInput,
  AgentOutput,
  ContentTask,
  ContentType,
  ContentMode,
  IterationConfig,
  ProductionResult,
  ResearchContext,
} from '../../core/types/index.js';
import { getModeForContentType } from '../../core/registries/mode-registry.js';
import { getWorkflowForMode } from '../../core/registries/workflow-registry.js';

// =============================================================================
// Production Agent Configuration
// =============================================================================

export interface ProductionAgentConfig {
  provider: AIProviderInterface;
  memory?: AgentMemory;
  iterationConfig?: Partial<IterationConfig>;
  verbose?: boolean;
}

export interface ProductionConfig {
  enableIteration: boolean;
  maxIterations: number;
  voiceScoreThreshold: number;
  minScoreImprovement: number;
}

// =============================================================================
// Production Agent Implementation
// =============================================================================

export class ProductionAgent extends BaseAgent {
  private readonly ghostWriter: GhostWriter;
  private readonly copywriter: Copywriter;
  private readonly editor: Editor;
  private readonly documentationWriter: DocumentationWriter;
  private readonly revisionAgent: RevisionAgent;
  private readonly iterationConfig: Partial<IterationConfig>;

  constructor(config: ProductionAgentConfig) {
    super({
      name: 'ProductionAgent',
      type: 'production',
      provider: config.provider,
      memory: config.memory,
      verbose: config.verbose,
    });

    // Initialize sub-roles
    this.ghostWriter = new GhostWriter(config.provider);
    this.copywriter = new Copywriter(config.provider);
    this.editor = new Editor(config.provider);
    this.documentationWriter = new DocumentationWriter(config.provider);
    this.revisionAgent = new RevisionAgent({
      provider: config.provider,
      memory: config.memory,
      verbose: config.verbose,
    });
    this.iterationConfig = config.iterationConfig ?? {};
  }

  /**
   * Check if this agent can handle the task
   */
  canHandle(task: ContentTask): boolean {
    // Production agent handles all content types including documentation
    const supportedTypes: ContentType[] = [
      'deck',
      'pov',
      'paper',
      'brief',
      'roadmap',
      'guide',
      'reference',
      'tutorial',
    ];
    return supportedTypes.includes(task.type);
  }

  /**
   * Execute production workflow
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();

    try {
      const result = await this.produce(input.task, {
        enableIteration: input.task.options?.enableIteration ?? true,
        maxIterations: input.task.options?.maxIterations ?? 5,
        voiceScoreThreshold: 7,
        minScoreImprovement: 0.5,
      });

      return this.successOutput(result.content, {
        voiceScore: result.voiceCheck.score,
        iterations: result.iterations,
        approved: result.approved,
        warning: result.warning,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      return this.failureOutput(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Main production workflow with feedback loops
   */
  async produce(task: ContentTask, config: ProductionConfig): Promise<ProductionResult> {
    // Determine mode from task type if not specified
    const mode = task.mode || getModeForContentType(task.type);
    this.log('Starting production', { type: task.type, mode });

    // Route to appropriate workflow based on registered workflow
    const workflow = getWorkflowForMode(mode);
    const workflowSteps = workflow?.steps.map(s => s.role) ?? [];
    if (workflowSteps.includes('documentation-writer')) {
      return this.produceDocumentation(task, config, mode);
    }

    // Map content type to role-compatible type
    const roleContentType = this.mapToRoleContentType(task.type);

    // Step 1: Ghost Writer generates initial draft
    this.log('Phase 1: Ghost Writer generating draft');
    const ghostWriterInput: GhostWriterInput = {
      rawContent: task.input,
      contentType: roleContentType,
      context: this.buildContext(task.context),
      audience: task.constraints?.targetAudience,
    };

    const ghostWriterOutput = await this.ghostWriter.generate(ghostWriterInput);
    let content = ghostWriterOutput.draft;
    this.log('Ghost Writer complete', { length: content.length });

    // Step 2: Copywriter refines
    this.log('Phase 2: Copywriter refining');
    const copywriterInput: CopywriterInput = {
      draft: content,
      contentType: roleContentType,
      audience: task.constraints?.targetAudience,
      strategicObjectives: task.constraints?.strategicObjectives,
    };

    const copywriterOutput = await this.copywriter.refine(copywriterInput);
    content = copywriterOutput.refined;
    this.log('Copywriter complete', { length: content.length });

    // Step 3: Editor reviews (initial check)
    this.log('Phase 3: Editor reviewing');
    const editorInput: EditorInput = {
      content,
      contentType: roleContentType,
      strategicObjectives: task.constraints?.strategicObjectives,
    };

    const editorOutput = await this.editor.review(editorInput);

    // If approved immediately or iteration disabled, return
    if (editorOutput.approved || !config.enableIteration) {
      this.log('Editor approved on first pass or iteration disabled');
      return {
        content: editorOutput.finalContent ?? content,
        voiceCheck: editorOutput.voiceCheck,
        iterations: 1,
        approved: editorOutput.approved,
        metadata: {
          provider: this.provider.getProvider(),
        },
      };
    }

    // Step 4: Feedback Loop (if enabled and needed)
    this.log('Phase 4: Starting feedback loop');
    return this.runFeedbackLoop(content, config, roleContentType, task);
  }

  /**
   * Run the feedback loop until voice threshold met or max iterations
   */
  private async runFeedbackLoop(
    initialContent: string,
    config: ProductionConfig,
    contentType: 'deck' | 'pov' | 'paper',
    task: ContentTask
  ): Promise<ProductionResult> {
    const controller = createIterationController(
      {
        maxIterations: config.maxIterations,
        voiceScoreThreshold: config.voiceScoreThreshold,
        minScoreImprovement: config.minScoreImprovement,
        stallThreshold: 2,
      },
      this.verbose
    );

    let content = initialContent;
    let voiceCheck = checkVoiceEnhanced(content);

    // Record initial score
    controller.recordIteration(voiceCheck.score);

    while (controller.shouldContinue(voiceCheck.score)) {
      this.log(`Iteration ${controller.getState().current}: score ${voiceCheck.score}`);

      // Build feedback for revision agent
      const feedback = controller.buildFeedback(voiceCheck);

      // Revision agent applies fixes
      const revisionOutput = await this.revisionAgent.execute({
        task,
        previousOutput: {
          agentType: 'production',
          success: true,
          content,
        },
        feedback,
      });

      if (!revisionOutput.success || !revisionOutput.content) {
        this.log('Revision failed, breaking loop');
        break;
      }

      content = revisionOutput.content;

      // Run through copywriter for polish (optional on later iterations)
      if (controller.getState().current <= 2) {
        const copywriterOutput = await this.copywriter.refine({
          draft: content,
          contentType,
          audience: task.constraints?.targetAudience,
          strategicObjectives: task.constraints?.strategicObjectives,
        });
        content = copywriterOutput.refined;
      }

      // Re-check voice
      voiceCheck = checkVoiceEnhanced(content);
      controller.recordIteration(voiceCheck.score);

      // Store iteration in memory
      await this.remember(
        `iteration_${task.id}_${controller.getState().current}`,
        {
          score: voiceCheck.score,
          strategy: controller.getStrategy(),
          issues: voiceCheck.issues.length,
        },
        'session'
      );
    }

    const summary = controller.getSummary();
    this.log('Feedback loop complete', summary);

    return {
      content,
      voiceCheck,
      iterations: summary.iterations,
      approved: voiceCheck.score >= config.voiceScoreThreshold,
      warning: summary.stalled ? 'Iteration stalled without reaching threshold' : undefined,
      metadata: {
        provider: this.provider.getProvider(),
      },
    };
  }

  // ===========================================================================
  // Documentation Workflow
  // ===========================================================================

  /**
   * Produce documentation with documentation-specific workflow
   */
  private async produceDocumentation(
    task: ContentTask,
    config: ProductionConfig,
    mode: ContentMode
  ): Promise<ProductionResult> {
    this.log('Using documentation workflow', { type: task.type });

    // Step 1: Documentation Writer generates draft
    this.log('Phase 1: Documentation Writer generating draft');
    const docOutput = await this.documentationWriter.generate({
      rawContent: task.input,
      documentationType: task.type as DocumentationType,
      context: this.buildContext(task.context),
      audience: task.constraints?.targetAudience,
    });

    let content = docOutput.draft;
    this.log('Documentation Writer complete', { length: content.length });

    // Step 2: Voice check using mode-aware checker
    this.log('Phase 2: Voice check');
    let voiceCheck = checkVoiceForMode(content, mode);
    this.log('Initial voice score', { score: voiceCheck.score, issues: voiceCheck.issues.length });

    // If approved or iteration disabled, return
    if (voiceCheck.passed || !config.enableIteration) {
      return {
        content,
        voiceCheck: {
          score: voiceCheck.score,
          passed: voiceCheck.passed,
          issues: voiceCheck.issues,
          strengths: voiceCheck.strengths,
        },
        iterations: 1,
        approved: voiceCheck.passed,
        metadata: {
          provider: this.provider.getProvider(),
        },
      };
    }

    // Step 3: Feedback loop for documentation
    this.log('Phase 3: Documentation feedback loop');
    return this.runDocumentationFeedbackLoop(content, config, task, mode);
  }

  /**
   * Run feedback loop for documentation with mode-aware voice checking
   */
  private async runDocumentationFeedbackLoop(
    initialContent: string,
    config: ProductionConfig,
    task: ContentTask,
    mode: ContentMode
  ): Promise<ProductionResult> {
    const controller = createIterationController(
      {
        maxIterations: config.maxIterations,
        voiceScoreThreshold: config.voiceScoreThreshold,
        minScoreImprovement: config.minScoreImprovement,
        stallThreshold: 2,
      },
      this.verbose
    );

    let content = initialContent;
    let voiceCheck = checkVoiceForMode(content, mode);

    // Record initial score
    controller.recordIteration(voiceCheck.score);

    while (controller.shouldContinue(voiceCheck.score)) {
      this.log(`Iteration ${controller.getState().current}: score ${voiceCheck.score}`);

      // Build feedback for revision
      const feedback = {
        voiceCheck: {
          score: voiceCheck.score,
          passed: voiceCheck.passed,
          issues: voiceCheck.issues,
          strengths: voiceCheck.strengths,
          suggestions: voiceCheck.issues.map((issue) => ({
            issue,
            priority: 'high' as const,
          })),
          preservationZones: [],
          problemZones: [],
          confidence: 0.8,
        },
        preserveStrengths: voiceCheck.strengths,
        targetScore: config.voiceScoreThreshold,
      };

      // Revision agent applies fixes
      const revisionOutput = await this.revisionAgent.execute({
        task: { ...task, mode },
        previousOutput: {
          agentType: 'production',
          success: true,
          content,
        },
        feedback,
      });

      if (!revisionOutput.success || !revisionOutput.content) {
        this.log('Revision failed, breaking loop');
        break;
      }

      content = revisionOutput.content;

      // Re-check voice with mode-aware checker
      voiceCheck = checkVoiceForMode(content, mode);
      controller.recordIteration(voiceCheck.score);

      // Store iteration in memory
      await this.remember(
        `iteration_${task.id}_${controller.getState().current}`,
        {
          score: voiceCheck.score,
          strategy: controller.getStrategy(),
          issues: voiceCheck.issues.length,
          mode,
        },
        'session'
      );
    }

    const summary = controller.getSummary();
    this.log('Documentation feedback loop complete', summary);

    return {
      content,
      voiceCheck: {
        score: voiceCheck.score,
        passed: voiceCheck.passed,
        issues: voiceCheck.issues,
        strengths: voiceCheck.strengths,
      },
      iterations: summary.iterations,
      approved: voiceCheck.score >= config.voiceScoreThreshold,
      warning: summary.stalled ? 'Iteration stalled without reaching threshold' : undefined,
      metadata: {
        provider: this.provider.getProvider(),
      },
    };
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  /**
   * Map content types to role-compatible types
   */
  private mapToRoleContentType(type: ContentType): 'deck' | 'pov' | 'paper' {
    switch (type) {
      case 'deck':
      case 'brief':
      case 'roadmap':
        return 'deck';
      case 'pov':
        return 'pov';
      case 'paper':
      case 'architecture':
      case 'adr':
      case 'tech-deck':
      case 'spec':
        return 'paper';
      default:
        return 'pov';
    }
  }

  /**
   * Build context string from research context
   */
  private buildContext(context?: ResearchContext): string | undefined {
    if (!context) return undefined;

    const parts: string[] = [];

    if (context.webResults && context.webResults.length > 0) {
      parts.push('Web Research:');
      for (const result of context.webResults.slice(0, 3)) {
        parts.push(`- ${result.title}: ${result.snippet}`);
      }
    }

    if (context.localDocuments && context.localDocuments.length > 0) {
      parts.push('\nRelevant Documents:');
      for (const doc of context.localDocuments.slice(0, 3)) {
        parts.push(`- ${doc.title || doc.path}: ${doc.content.substring(0, 200)}...`);
      }
    }

    if (context.facts && context.facts.length > 0) {
      parts.push('\nVerified Facts:');
      for (const fact of context.facts.filter((f) => f.verified).slice(0, 5)) {
        parts.push(`- ${fact.claim}`);
      }
    }

    return parts.length > 0 ? parts.join('\n') : undefined;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createProductionAgent(config: ProductionAgentConfig): ProductionAgent {
  return new ProductionAgent(config);
}
