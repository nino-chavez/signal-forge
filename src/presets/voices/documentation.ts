import type { VoiceDefinition } from '../../core/registries/types.js';

export const documentationVoice: VoiceDefinition = {
  modeId: 'documentation',
  name: 'Documentation Voice',

  instructions: `
You are writing user documentation. Key principles:

1. **Lead with what the user will accomplish**
2. **Be direct and instructional**: "Run this command..." not "You might want to run..."
3. **Use numbered steps for procedures**
4. **Tables over paragraphs** for options and commands
5. **Show before you tell**: Example first, then explanation
6. **Code blocks generously** - copy-paste friendly

Voice markers to include:
- Imperative verbs (Run, Install, Configure, Create)
- Numbered steps for all procedures
- Code blocks with bash commands
- Tables for options, commands, parameters
- Direct "you" address

Avoid:
- Questions or tension openings
- Provisional language ("for now," "here's where I've landed")
- Exploratory or thought-leadership patterns
- Walls of text without structure
`,

  checkRules: {
    openingPatterns: {
      required: [
        /^(This|The) (guide|tutorial|document|reference)/im,
        /(shows|explains|covers|helps) (you|how)/i,
      ],
      forbidden: [/[?]$/, /I've been thinking|tension|uncomfortable/i],
    },
    voiceMarkers: {
      positive: [
        /^(Run|Install|Configure|Create|Add|Open|Click|Type|Enter)[\s:]/im,
        /```bash/i,
        /\d+\.\s+\w/m,
        /\|\s*Option\s*\||\|\s*Command\s*\|/i,
      ],
      negative: [
        /I think|I believe|perhaps/i,
        /for now|here's where I've landed/i,
        /tension|uncomfortable|dilemma/i,
      ],
    },
    structuralPatterns: {
      required: [
        /^#+\s*(Getting Started|Installation|Usage|Examples?|Prerequisites|Quick Start)/im,
      ],
    },
    jargonToAvoid: [],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    // Should have code blocks
    const codeBlockCount = (content.match(/```/g) || []).length / 2;
    if (codeBlockCount >= 2) {
      strengths.push('Good use of code examples');
      scoreAdjustment += 0.5;
    }

    // Should have numbered steps or bullet lists
    const hasSteps = /^\d+\.\s+/m.test(content) || /^[-*]\s+/m.test(content);
    if (hasSteps) {
      strengths.push('Uses numbered steps or lists');
      scoreAdjustment += 0.5;
    }

    // Should use "you" / "your"
    const youCount = (content.match(/\byou(r)?\b/gi) || []).length;
    if (youCount >= 5) {
      strengths.push('Good use of direct "you" address');
    } else if (youCount === 0) {
      issues.push('Missing direct "you" address to user');
      scoreAdjustment -= 0.5;
    }

    return { issues, strengths, scoreAdjustment };
  },
};
