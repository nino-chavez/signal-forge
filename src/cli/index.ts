#!/usr/bin/env node
/**
 * Signal Forge CLI
 * 
 * Strategic content generation tool
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { readFileContent } from '../core/utils/file-utils.js';
import { createDefaultConfig, loadConfig, saveConfig, configExists, getDefaultConfigPath } from '../core/config.js';
import type { Perspective } from '../core/registries/types.js';
import { createProvider, getDefaultProvider, getConfiguredProviders } from '../providers/index.js';
import type { AIProvider } from '../providers/ai-provider.js';
import { GhostWriter } from '../pipeline/roles/ghost-writer.js';
import { Copywriter } from '../pipeline/roles/copywriter.js';
import { Editor } from '../pipeline/roles/editor.js';
import { DocumentationWriter, type DocumentationType } from '../pipeline/roles/documentation-writer.js';
import { exportToWord } from '../output/exporters/word-exporter.js';
import { exportToPDF } from '../output/exporters/pdf-exporter.js';
import { exportToPPTX } from '../output/exporters/pptx-exporter.js';
import { exportToGoogleSlides } from '../output/exporters/slides-exporter.js';
import { exportToHTML } from '../output/exporters/html-exporter.js';
import { generateSlug } from '../core/utils/slug.js';
import { ensureDir } from '../core/utils/file-utils.js';
import { registerAgenticCommands } from './agentic-commands.js';
import { listThemes } from '../content/design-system/theme-registry.js';
import { getModeForContentType } from '../core/registries/mode-registry.js';
import { getWorkflowForMode } from '../core/registries/workflow-registry.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerBuiltInPresets } from '../presets/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Register built-in content modes, voices, workflows, and templates
registerBuiltInPresets();

const program = new Command();

program
  .name('forge')
  .description('Signal Forge - Strategic content generation system')
  .version('1.0.0');

// Register agentic commands (forge agent ...)
registerAgenticCommands(program);

// Valid content types
const VALID_TYPES = ['deck', 'pov', 'paper', 'guide', 'reference', 'tutorial'];

program
  .command('init')
  .description('Initialize Signal Forge configuration')
  .option('--non-interactive', 'Skip prompts and write defaults')
  .action(async (options) => {
    try {
      if (options.nonInteractive) {
        createDefaultConfig();
        console.log('✨ Initialization complete.');
        return;
      }

      const existing = configExists();
      const currentConfig = existing ? loadConfig() : undefined;

      if (existing) {
        console.log(`\nConfiguration exists at ${getDefaultConfigPath()}`);
        const { overwrite } = await inquirer.prompt([{
          type: 'confirm',
          name: 'overwrite',
          message: 'Reconfigure?',
          default: false,
        }]);
        if (!overwrite) return;
      }

      console.log('\nSignal Forge Setup\n');

      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'author',
          message: 'Your name:',
          default: currentConfig?.author || undefined,
        },
        {
          type: 'input',
          name: 'persona',
          message: 'Your role/title:',
          default: currentConfig?.persona || undefined,
        },
        {
          type: 'input',
          name: 'company',
          message: 'Your company/organization (optional):',
          default: currentConfig?.company || undefined,
        },
        {
          type: 'list',
          name: 'perspective',
          message: 'Default writing perspective:',
          choices: [
            { name: 'Consultant — "you" / "your organization"', value: 'consultant' },
            { name: 'Internal — "we" / "our team"', value: 'internal' },
            { name: 'Neutral — no perspective framing', value: 'neutral' },
          ],
          default: currentConfig?.perspective || 'consultant',
        },
        {
          type: 'list',
          name: 'defaultMode',
          message: 'Default content mode:',
          choices: [
            { name: 'Executive Advisory', value: 'advisory' },
            { name: 'Thought Leadership', value: 'thought-leadership' },
            { name: 'Solution Architecture', value: 'architecture' },
            { name: 'Documentation', value: 'documentation' },
          ],
          default: currentConfig?.defaultMode || 'advisory',
        },
      ]);

      const config = {
        ...(currentConfig || loadConfig()),
        author: answers.author,
        persona: answers.persona,
        company: answers.company || undefined,
        perspective: answers.perspective as Perspective,
        defaultMode: answers.defaultMode,
      };

      saveConfig(config);
      console.log(`\n✨ Configuration saved to ${getDefaultConfigPath()}`);
    } catch (error) {
      console.error('❌ Initialization failed:', (error as Error).message);
    }
  });

program
  .command('generate')
  .description('Generate strategic content')
  .argument('<type>', 'Content type: deck, pov, paper, guide, reference, or tutorial')
  .option('-i, --input <file>', 'Input file (meeting notes, recap, etc.)')
  .option('-o, --output <file>', 'Output file path')
  .option('-p, --provider <provider>', 'AI provider: openai, anthropic, google, perplexity')
  .option('-f, --format <formats>', 'Output formats (comma-separated): word,pdf,pptx,slides,html')
  .option('-t, --theme <theme>', 'Presentation theme for PPTX (e.g. signal-forge, dark)')
  .option('--audience <audience>', 'Target audience')
  .option('--product <product>', 'Product name (for documentation)')
  .option('--no-edit', 'Skip editor review (use ghost writer + copywriter only)')
  .action(async (type: string, options) => {
    try {
      if (!VALID_TYPES.includes(type)) {
        console.error(`❌ Invalid content type: ${type}. Must be one of: ${VALID_TYPES.join(', ')}`);
        process.exit(1);
      }

      // Get input
      let inputContent = '';
      if (options.input) {
        inputContent = await readFileContent(options.input);
      } else {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'input',
            message: 'Enter input file path or paste content:',
          },
        ]);
        if (answer.input) {
          if (await import('fs').then(fs => fs.promises.access(answer.input).then(() => true).catch(() => false))) {
            inputContent = await readFileContent(answer.input);
          } else {
            inputContent = answer.input;
          }
        }
      }

      if (!inputContent) {
        console.error('❌ No input content provided');
        process.exit(1);
      }

      // Get provider
      let providerName: AIProvider = options.provider as AIProvider || getDefaultProvider();
      const configuredProviders = getConfiguredProviders();
      
      if (!configuredProviders.includes(providerName)) {
        console.warn(`⚠️  Provider ${providerName} not configured. Available: ${configuredProviders.join(', ')}`);
        if (configuredProviders.length > 0) {
          providerName = configuredProviders[0];
          console.log(`Using ${providerName} instead.`);
        } else {
          console.error('❌ No AI providers configured. Please set API keys in .env file.');
          process.exit(1);
        }
      }

      const provider = createProvider(providerName);

      // Generate content
      console.log(`\n🔨 Generating ${type} content using ${providerName}...\n`);

      let finalContent = '';

      // Determine workflow from mode registry
      const mode = getModeForContentType(type);
      const workflow = getWorkflowForMode(mode);
      const workflowSteps = workflow?.steps.map(s => s.role) ?? [];
      const isDocWorkflow = workflowSteps.includes('documentation-writer');

      if (isDocWorkflow) {
        // Documentation workflow
        console.log('📚 Documentation Writer: Generating documentation...');
        const docWriter = new DocumentationWriter(provider);
        const docOutput = await docWriter.generate({
          rawContent: inputContent,
          documentationType: type as DocumentationType,
          audience: options.audience,
          productName: options.product,
        });
        finalContent = docOutput.draft;
        console.log('✅ Documentation Writer complete\n');
      } else {
        // Standard multi-pass workflow
        // Ghost Writer
        console.log('👻 Ghost Writer: Generating initial draft...');
        const ghostWriter = new GhostWriter(provider);
        const ghostOutput = await ghostWriter.generate({
          rawContent: inputContent,
          contentType: type as 'deck' | 'pov' | 'paper',
          audience: options.audience,
        });
        console.log('✅ Ghost Writer complete\n');

        // Copywriter
        if (workflowSteps.includes('copywriter')) {
          console.log('✍️  Copywriter: Refining content...');
          const copywriter = new Copywriter(provider);
          const copywriterOutput = await copywriter.refine({
            draft: ghostOutput.draft,
            contentType: type as 'deck' | 'pov' | 'paper',
            audience: options.audience,
          });
          console.log('✅ Copywriter complete\n');
          finalContent = copywriterOutput.refined;
        } else {
          finalContent = ghostOutput.draft;
        }

        // Editor
        if (workflowSteps.includes('editor') && !options.noEdit) {
          console.log('📝 Editor: Reviewing content...');
          const editor = new Editor(provider);
          const editorOutput = await editor.review({
            content: finalContent,
            contentType: type as 'deck' | 'pov' | 'paper',
          });

          if (editorOutput.approved) {
            console.log(`✅ Editor approved (Voice score: ${editorOutput.voiceCheck.score}/10)\n`);
            finalContent = editorOutput.finalContent || finalContent;
          } else {
            console.warn(`⚠️  Editor found issues (Voice score: ${editorOutput.voiceCheck.score}/10)`);
            if (editorOutput.feedback) {
              console.log('\nFeedback:');
              console.log(editorOutput.feedback);
            }
            if (editorOutput.finalContent) {
              finalContent = editorOutput.finalContent;
              console.log('\n✅ Using auto-fixed version\n');
            } else {
              console.log('\n⚠️  Using content as-is (manual review recommended)\n');
            }
          }
        }
      }

      // Determine output formats based on content type
      let defaultFormats: string[];
      if (type === 'deck') {
        defaultFormats = ['pptx', 'html'];
      } else if (isDocWorkflow) {
        defaultFormats = ['html']; // Documentation defaults to HTML
      } else {
        defaultFormats = ['word', 'pdf', 'html'];
      }

      const formats = options.format
        ? options.format.split(',').map((f: string) => f.trim())
        : defaultFormats;

      // Determine output path
      const outputDir = options.output 
        ? path.dirname(options.output)
        : path.join(process.cwd(), 'content', type + 's');
      
      await ensureDir(outputDir);

      const baseName = options.output
        ? path.basename(options.output, path.extname(options.output))
        : generateSlug(finalContent.split('\n')[0] || 'content');

      // Export to requested formats
      console.log('📤 Exporting content...\n');

      for (const format of formats) {
        try {
          switch (format) {
            case 'word':
            case 'docx':
              const wordPath = path.join(outputDir, `${baseName}.docx`);
              await exportToWord({
                title: baseName,
                content: finalContent,
                outputPath: wordPath,
              });
              console.log(`✅ Word document: ${wordPath}`);
              break;

            case 'pdf':
              const pdfPath = path.join(outputDir, `${baseName}.pdf`);
              await exportToPDF({
                title: baseName,
                content: finalContent,
                outputPath: pdfPath,
              });
              console.log(`✅ PDF: ${pdfPath}`);
              break;

            case 'pptx':
            case 'powerpoint':
              const pptxPath = path.join(outputDir, `${baseName}.pptx`);
              await exportToPPTX({
                title: baseName,
                content: finalContent,
                outputPath: pptxPath,
                theme: options.theme,
              });
              console.log(`✅ PowerPoint: ${pptxPath}`);
              break;

            case 'slides':
            case 'googleslides':
              const slidesUrl = await exportToGoogleSlides({
                title: baseName,
                content: finalContent,
              });
              console.log(`✅ Google Slides: ${slidesUrl}`);
              break;

            case 'html':
            case 'web':
            case 'webpage':
              const htmlPath = path.join(outputDir, `${baseName}.html`);
              await exportToHTML({
                title: baseName,
                content: finalContent,
                outputPath: htmlPath,
                contentType: type as 'deck' | 'pov' | 'paper' | 'guide' | 'reference' | 'tutorial',
              });
              console.log(`✅ Web page: ${htmlPath}`);
              break;

            default:
              console.warn(`⚠️  Unknown format: ${format}`);
          }
        } catch (error: any) {
          console.error(`❌ Error exporting to ${format}:`, error.message);
        }
      }

      console.log('\n✨ Content generation complete!\n');

    } catch (error: any) {
      console.error('❌ Error:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

// Theme management
const themesCommand = program
  .command('themes')
  .description('Manage presentation themes');

themesCommand
  .command('list')
  .description('List available presentation themes')
  .action(() => {
    const themes = listThemes();
    console.log('\nAvailable themes:\n');
    for (const t of themes) {
      console.log(`  ${t.id.padEnd(16)} ${t.name} — ${t.description}`);
    }
    console.log('');
  });

program.parse();

