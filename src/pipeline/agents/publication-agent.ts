/**
 * Publication Agent
 *
 * Coordinates content export to various targets.
 * Currently supports local file export with architecture for future CMS/email integrations.
 */

import type { AIProviderInterface } from '../../providers/ai-provider.js';
import { BaseAgent, type AgentConfig, type AgentMemory } from './base-agent.js';
import type {
  AgentInput,
  AgentOutput,
  ContentTask,
  ContentType,
  OutputFormat,
  PublicationResult,
  PublicationTarget,
} from '../../core/types/index.js';

// =============================================================================
// Publisher Interface
// =============================================================================

export interface Publisher {
  readonly name: string;
  readonly type: 'local' | 'cms' | 'email' | 'slides';
  publish(
    content: string,
    format: OutputFormat,
    options: PublishOptions
  ): Promise<PublicationResult>;
  isConfigured(): boolean;
}

export interface PublishOptions {
  title?: string;
  contentType?: ContentType;
  outputPath?: string;
  metadata?: Record<string, unknown>;
  /** Presentation theme ID for PPTX export */
  theme?: string;
}

// =============================================================================
// Publication Agent Configuration
// =============================================================================

export interface PublicationAgentConfig {
  provider: AIProviderInterface;
  memory?: AgentMemory;
  publishers?: Publisher[];
  defaultOutputPath?: string;
  verbose?: boolean;
}

// =============================================================================
// Publication Agent Implementation
// =============================================================================

export class PublicationAgent extends BaseAgent {
  private readonly publishers: Map<string, Publisher> = new Map();
  private readonly defaultOutputPath: string;

  constructor(config: PublicationAgentConfig) {
    super({
      name: 'PublicationAgent',
      type: 'publication',
      provider: config.provider,
      memory: config.memory,
      verbose: config.verbose,
    });

    this.defaultOutputPath = config.defaultOutputPath ?? './output';

    // Register provided publishers
    if (config.publishers) {
      for (const publisher of config.publishers) {
        this.registerPublisher(publisher);
      }
    }
  }

  /**
   * Register a publisher
   */
  registerPublisher(publisher: Publisher): void {
    this.publishers.set(publisher.name, publisher);
    this.log(`Registered publisher: ${publisher.name}`);
  }

  /**
   * Check if this agent can handle the task
   */
  canHandle(task: ContentTask): boolean {
    return (task.outputFormats?.length ?? 0) > 0;
  }

  /**
   * Execute publication workflow
   */
  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    const content = input.previousOutput?.content ?? '';

    if (!content) {
      return this.failureOutput('No content to publish');
    }

    const formats = input.task.outputFormats ?? ['markdown'];

    try {
      const results = await this.publish(content, formats, input.task.type);

      const successCount = results.filter((r) => r.success).length;

      return this.successOutput(
        `Published to ${successCount}/${results.length} targets`,
        {
          results,
          duration: Date.now() - startTime,
        }
      );
    } catch (error) {
      return this.failureOutput(
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Publish content to specified formats
   */
  async publish(
    content: string,
    formats: (OutputFormat | string)[],
    contentType: ContentType | string
  ): Promise<PublicationResult[]> {
    const results: PublicationResult[] = [];

    for (const format of formats) {
      const publisher = this.getPublisherForFormat(format as OutputFormat);

      if (!publisher) {
        results.push({
          target: { type: 'local', platform: format },
          success: false,
          error: `No publisher available for format: ${format}`,
          timestamp: new Date(),
        });
        continue;
      }

      if (!publisher.isConfigured()) {
        results.push({
          target: { type: publisher.type, platform: publisher.name },
          success: false,
          error: `Publisher ${publisher.name} is not configured`,
          timestamp: new Date(),
        });
        continue;
      }

      try {
        this.log(`Publishing to ${publisher.name} as ${format}`);

        const result = await publisher.publish(content, format as OutputFormat, {
          contentType: contentType as ContentType,
          outputPath: this.defaultOutputPath,
        });

        results.push(result);

        // Record in memory
        await this.remember(
          `publication_${Date.now()}`,
          {
            format,
            publisher: publisher.name,
            success: result.success,
            path: result.path,
          },
          'session'
        );
      } catch (error) {
        results.push({
          target: { type: publisher.type, platform: publisher.name },
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  /**
   * Get the appropriate publisher for a format
   */
  private getPublisherForFormat(format: OutputFormat): Publisher | undefined {
    // Check for format-specific publisher
    const formatPublisher = this.publishers.get(format);
    if (formatPublisher) return formatPublisher;

    // Check for local file publisher (handles most formats)
    const localPublisher = this.publishers.get('local');
    if (localPublisher) return localPublisher;

    return undefined;
  }

  /**
   * Get list of available publishers
   */
  getAvailablePublishers(): string[] {
    return Array.from(this.publishers.keys());
  }

  /**
   * Check if a format can be published
   */
  canPublish(format: OutputFormat): boolean {
    return this.getPublisherForFormat(format) !== undefined;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createPublicationAgent(
  config: PublicationAgentConfig
): PublicationAgent {
  return new PublicationAgent(config);
}
