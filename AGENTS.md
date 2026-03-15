# Signal Forge
> AI-powered presentation and document generation CLI

## Docs Index

### AI SDKs
- [Anthropic SDK](https://docs.anthropic.com/en/api): Claude models for content generation
- [OpenAI SDK](https://platform.openai.com/docs/api-reference): GPT models, vision

### Document Generation
- [PptxGenJS](https://github.com/gitbrent/PptxGenJS): PowerPoint generation
- [Unified/Remark](https://unifiedjs.com/): Markdown processing

### Libraries
- [Commander.js](https://github.com/tj/commander.js): CLI framework

## Project Index

### Entry Points
- `src/index.ts`: CLI entry point
- `src/generators/`: Document generators by type

### Key Directories
- `src/generators/`: Presentation, document generators
- `templates/`: PPTX templates, brand specs
- `brand-specs/`: Brand configuration files
- `output/`: Generated documents

### Examples
- `examples/`: Sample inputs and outputs

## Quick Commands
```bash
npm run build              # Build TypeScript
npm start -- [command]     # Run CLI
npm test                   # Run tests
```

## Boundaries
- `.env` - API keys (never commit)
- `brand-specs/` - Brand configurations

## Stack Notes
- TypeScript with strict mode
- Supports multiple AI providers (Anthropic, OpenAI)
- PPTX generation via PptxGenJS
- Brand-aware document generation
