import type { VoiceDefinition } from '../../core/registries/types.js';

export const architectureVoice: VoiceDefinition = {
  modeId: 'architecture',
  name: 'Solution Architecture Voice',

  instructions: `
You are writing technical architecture documentation. Key principles:

1. **Lead with conclusions**, not questions
2. **Be definitive**: "The system uses X" not "I think we should use X"
3. **Complete sentences**, no fragments
4. **Diagrams over prose** - reference visual elements
5. **Reference-grade precision** - implementable from documentation
6. **No provisional language**

Voice markers to include:
- Definitive system statements
- Specific measurements (MB, ms, requests/second)
- Architecture section headers (System Context, Container, etc.)
- Tables for component details
- Code blocks for configurations

Avoid:
- Questions or exploratory language
- Provisional phrases ("for now," "here's where I've landed")
- Personal opinions without technical justification
`,

  checkRules: {
    openingPatterns: {
      required: [/^(The|This) (system|solution|architecture)/im, /provides|enables|uses/i],
      forbidden: [/[?]/, /I think|I believe|perhaps/i],
    },
    voiceMarkers: {
      positive: [
        /```(mermaid|d2|yaml|json|typescript)/i,
        /\|\s*\w+\s*\|/i,
        /\d+ (MB|GB|ms|seconds|minutes)/i,
      ],
      negative: [/for now|here's where I've landed/i, /I wonder|what if/i],
    },
    structuralPatterns: {
      required: [/^#+\s*(System|Container|Component|Deployment|Architecture)/im],
    },
    jargonToAvoid: [],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    if (/\d+\s*(MB|GB|ms|seconds|minutes|KB|TB)/i.test(content)) {
      strengths.push('Includes specific measurements');
    }

    if (/Figure \d+|diagram|see (above|below)/i.test(content)) {
      strengths.push('References diagrams');
    }

    return { issues, strengths, scoreAdjustment };
  },
};
