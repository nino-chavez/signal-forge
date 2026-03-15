/**
 * Agentic Commands
 *
 * CLI commands for the agentic content system.
 * Provides research, iterative generation, and publication capabilities.
 */

import type { Command } from 'commander';
import path from 'path';
import { readFileContent, ensureDir } from '../core/utils/file-utils.js';
import { createProvider, getDefaultProvider, getConfiguredProviders } from '../providers/index.js';
import type { AIProvider } from '../providers/ai-provider.js';
import { ForgeOrchestrator } from '../pipeline/agents/orchestrator.js';
import { ContentClassifier } from '../content/classifier/content-classifier.js';
import { ResearchAgent } from '../pipeline/agents/research-agent.js';
import { ProductionAgent } from '../pipeline/agents/production-agent.js';
import { PublicationAgent } from '../pipeline/agents/publication-agent.js';
import { MemorySystem } from '../pipeline/memory/memory-system.js';
import { JsonFileStore } from '../pipeline/memory/long-term-store.js';
import { createLocalFilePublisher } from '../output/publishers/local-file.js';
import { generateTaskId } from '../core/types/index.js';
import type { ContentMode, ContentTask, OutputFormat } from '../core/types/index.js';

// =============================================================================
// Register Agentic Commands
// =============================================================================

export function registerAgenticCommands(program: Command): void {
  const agentCommand = program
    .command('agent')
    .description('Agentic content generation with research and iterative refinement');

  // Generate command with full agentic workflow
  agentCommand
    .command('generate')
    .description('Generate content with optional research and iterative refinement')
    .argument('<type>', 'Content type: deck, pov, paper, brief, architecture, guide, reference, tutorial')
    .option('-i, --input <file>', 'Input file (meeting notes, recap, etc.)')
    .option('-o, --output <path>', 'Output directory or file path')
    .option('-p, --provider <provider>', 'AI provider: openai, anthropic, google, perplexity')
    .option('-f, --format <formats>', 'Output formats (comma-separated): markdown,html,docx,pdf,pptx')
    .option('-m, --mode <mode>', 'Content mode: thought-leadership, architecture, advisory, documentation')
    .option('-t, --theme <theme>', 'Presentation theme for PPTX (e.g. signal-forge, dark)')
    .option('--research', 'Enable research agent before production')
    .option('--iterate', 'Enable feedback loop until voice approval')
    .option('--max-iterations <n>', 'Maximum revision iterations (default: 5)', '5')
    .option('--memory', 'Enable long-term memory persistence')
    .option('--verbose', 'Show detailed progress')
    .action(async (type: string, options) => {
      await runAgenticGenerate(type, options);
    });

  // Research-only command
  agentCommand
    .command('research')
    .description('Gather research context without generating content')
    .argument('<topic>', 'Research topic or query')
    .option('-o, --output <file>', 'Output file for research context (JSON)')
    .option('-p, --provider <provider>', 'AI provider for research')
    .option('--docs <path>', 'Path to local documents to include')
    .option('--web', 'Include web search results (requires Perplexity)')
    .option('--verbose', 'Show detailed progress')
    .action(async (topic: string, options) => {
      await runResearchOnly(topic, options);
    });

  // Publish-only command
  agentCommand
    .command('publish')
    .description('Publish existing content to various formats')
    .argument('<input>', 'Input file (markdown content)')
    .option('-o, --output <path>', 'Output directory')
    .option('-f, --format <formats>', 'Output formats (comma-separated): markdown,html,docx,pdf,pptx')
    .option('-t, --title <title>', 'Content title')
    .option('--verbose', 'Show detailed progress')
    .action(async (input: string, options) => {
      await runPublishOnly(input, options);
    });
}

// =============================================================================
// Agentic Generate Command
// =============================================================================

async function runAgenticGenerate(type: string, options: Record<string, unknown>): Promise<void> {
  const verbose = options.verbose as boolean;

  try {
    // Validate content type
    const validTypes = ['deck', 'pov', 'paper', 'brief', 'architecture', 'adr', 'roadmap', 'guide', 'reference', 'tutorial'];
    if (!validTypes.includes(type)) {
      console.error(`❌ Invalid content type: ${type}. Must be one of: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    // Get input content
    const inputContent = await getInputContent(options.input as string | undefined);
    if (!inputContent) {
      console.error('❌ No input content provided');
      process.exit(1);
    }

    // Get provider
    const provider = getProvider(options.provider as string | undefined);
    if (verbose) {
      console.log(`📡 Using provider: ${getProviderName(options.provider as string | undefined)}`);
    }

    // Determine content mode
    let mode: ContentMode | undefined;
    if (options.mode) {
      mode = options.mode as ContentMode;
    }

    // Parse output formats
    const formats = parseFormats(
      options.format as string | undefined,
      type
    );

    // Create memory system
    const memory = new MemorySystem({
      longTermStore: options.memory ? new JsonFileStore() : undefined,
    });

    // Create orchestrator with agents
    const classifier = new ContentClassifier();
    const researchAgent = new ResearchAgent({
      provider,
      memory,
      verbose,
    });
    const productionAgent = new ProductionAgent({
      provider,
      memory,
      verbose,
    });
    const publicationAgent = new PublicationAgent({
      provider,
      memory,
      publishers: [createLocalFilePublisher()],
      defaultOutputPath: (options.output as string) || './output',
      verbose,
    });

    const orchestrator = new ForgeOrchestrator({
      provider,
      memory,
      verbose,
    });

    // Register agents
    orchestrator.registerClassifier(classifier);
    orchestrator.registerResearchAgent(researchAgent);
    orchestrator.registerProductionAgent(productionAgent);
    orchestrator.registerPublicationAgent(publicationAgent);

    // Build content task
    const task: ContentTask = {
      id: generateTaskId(),
      type: type as ContentTask['type'],
      input: inputContent,
      outputFormats: formats,
      mode,
      options: {
        enableResearch: options.research as boolean,
        enableIteration: options.iterate as boolean,
        maxIterations: parseInt(options.maxIterations as string, 10) || 5,
      },
    };

    // Execute workflow
    console.log(`\n🚀 Starting agentic workflow for ${type}...\n`);

    if (options.research) {
      console.log('🔍 Research agent enabled');
    }
    if (options.iterate) {
      console.log('🔄 Iterative refinement enabled');
    }
    console.log('');

    const result = await orchestrator.submitTask(task);

    if (result.success) {
      console.log('\n✨ Content generation complete!\n');

      if (result.publications) {
        console.log('📤 Published to:');
        for (const pub of result.publications) {
          if (pub.success && pub.path) {
            console.log(`   ✅ ${pub.path}`);
          }
        }
      }

      if (result.iterations) {
        console.log(`\n📊 Iterations: ${result.iterations}`);
      }
      if (result.voiceScore) {
        console.log(`📊 Final voice score: ${result.voiceScore}/10`);
      }
    } else {
      console.error(`\n❌ Generation failed: ${result.error || 'Unknown error'}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// =============================================================================
// Research-Only Command
// =============================================================================

async function runResearchOnly(topic: string, options: Record<string, unknown>): Promise<void> {
  const verbose = options.verbose as boolean;

  try {
    const provider = getProvider(options.provider as string | undefined);

    const memory = new MemorySystem({});

    const researchAgent = new ResearchAgent({
      provider,
      memory,
      verbose,
    });

    console.log(`\n🔍 Researching: "${topic}"...\n`);

    const result = await researchAgent.execute({
      task: {
        id: generateTaskId(),
        type: 'pov', // Default type for research
        input: topic,
        options: {
          enableResearch: true,
        },
      },
    });

    if (result.success && result.metadata?.researchContext) {
      const context = result.metadata.researchContext;

      // Output results
      if (options.output) {
        const outputPath = options.output as string;
        await ensureDir(path.dirname(outputPath));

        const fs = await import('fs');
        fs.writeFileSync(outputPath, JSON.stringify(context, null, 2), 'utf-8');
        console.log(`✅ Research context saved to: ${outputPath}`);
      } else {
        console.log('\n📚 Research Context:\n');
        console.log(JSON.stringify(context, null, 2));
      }

      // Summary
      const webCount = (context as { webResults?: unknown[] }).webResults?.length ?? 0;
      const docCount = (context as { documents?: unknown[] }).documents?.length ?? 0;
      const factCount = (context as { facts?: unknown[] }).facts?.length ?? 0;

      console.log(`\n📊 Summary:`);
      console.log(`   Web results: ${webCount}`);
      console.log(`   Documents: ${docCount}`);
      console.log(`   Facts extracted: ${factCount}`);
    } else {
      console.error(`\n❌ Research failed: ${result.error || 'Unknown error'}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// =============================================================================
// Publish-Only Command
// =============================================================================

async function runPublishOnly(input: string, options: Record<string, unknown>): Promise<void> {
  const verbose = options.verbose as boolean;

  try {
    const content = await readFileContent(input);
    if (!content) {
      console.error('❌ Could not read input file');
      process.exit(1);
    }

    const formats = parseFormats(options.format as string | undefined, 'paper');
    const outputPath = (options.output as string) || './output';
    const title = (options.title as string) || path.basename(input, path.extname(input));

    const publisher = createLocalFilePublisher({
      outputDir: outputPath,
      createDirs: true,
    });

    console.log(`\n📤 Publishing to ${formats.length} format(s)...\n`);

    for (const format of formats) {
      if (verbose) {
        console.log(`   Publishing as ${format}...`);
      }

      const result = await publisher.publish(content, format, {
        title,
        contentType: 'paper',
        outputPath,
      });

      if (result.success) {
        console.log(`   ✅ ${format}: ${result.path}`);
      } else {
        console.error(`   ❌ ${format}: ${result.error}`);
      }
    }

    console.log('\n✨ Publication complete!\n');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

async function getInputContent(inputPath?: string): Promise<string> {
  if (inputPath) {
    return readFileContent(inputPath);
  }

  // Try to read from stdin if available
  const { stdin } = process;
  if (!stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of stdin) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  return '';
}

function getProviderName(providerName?: string): AIProvider {
  let name: AIProvider = (providerName as AIProvider) || getDefaultProvider();
  const configured = getConfiguredProviders();

  if (!configured.includes(name)) {
    if (configured.length > 0) {
      console.warn(`⚠️  Provider ${name} not configured. Using ${configured[0]}.`);
      name = configured[0];
    } else {
      throw new Error('No AI providers configured. Please set API keys in .env file.');
    }
  }

  return name;
}

function getProvider(providerName?: string) {
  const name = getProviderName(providerName);
  return createProvider(name);
}

function parseFormats(formatString: string | undefined, contentType: string): OutputFormat[] {
  if (formatString) {
    return formatString.split(',').map((f) => f.trim() as OutputFormat);
  }

  // Default formats by content type
  const defaults: Record<string, OutputFormat[]> = {
    deck: ['pptx', 'html'],
    pov: ['markdown', 'html'],
    paper: ['markdown', 'docx', 'pdf'],
    brief: ['markdown', 'docx'],
    architecture: ['markdown', 'html'],
    adr: ['markdown'],
    roadmap: ['markdown', 'html', 'pptx'],
    // Documentation types default to HTML
    guide: ['html'],
    reference: ['html'],
    tutorial: ['html'],
  };

  return defaults[contentType] || ['markdown'];
}
