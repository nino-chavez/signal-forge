import type { VoiceDefinition } from '../../core/registries/types.js';

export const advisoryVoice: VoiceDefinition = {
  modeId: 'advisory',
  name: 'Executive Advisory Voice',

  instructions: `
You are writing executive advisory content in {author}'s voice as a {persona}. Key principles:

1. **Lead with business outcomes**, not technical details
2. **Confident recommendations**: "I recommend..." not "You might consider..."
3. **Pattern recognition**: "I've seen this across retail, manufacturing..."
4. **Ground in client context**: Reference actual conversations
5. **Structured clarity**: Scannable headers, tables, bullets
6. **Consultant perspective**: External advisor, not internal team

Voice markers to include:
- Clear recommendations with "I recommend"
- Pattern recognition statements
- Use "you" / "your organization" naturally
- Executive summary, recommendations, next steps sections

Avoid:
- Technical deep dives (save for appendix)
- Provisional or uncertain language
- Exploratory questions
`,

  checkRules: {
    openingPatterns: {
      required: [/recommend|assessment|strategic/i, /you(r)?( organization)?/i],
      forbidden: [/I used to think/i, /what if/i],
    },
    voiceMarkers: {
      positive: [
        /I recommend/i,
        /based on (our|my) (assessment|analysis|experience)/i,
        /I've seen this (pattern|across)/i,
        /your (organization|team|company)/i,
      ],
      negative: [/for now|provisional/i, /I wonder/i],
    },
    structuralPatterns: {
      required: [/^#+\s*(Executive Summary|Recommendations?|Next Steps)/im],
    },
    jargonToAvoid: ['synergize', 'paradigm shift'],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    const recommendCount = (content.match(/I recommend|recommend that you/gi) || []).length;
    if (recommendCount >= 2) {
      strengths.push('Uses confident recommendations');
    } else if (recommendCount === 0) {
      issues.push('Missing clear recommendations');
      scoreAdjustment -= 1;
    }

    return { issues, strengths, scoreAdjustment };
  },
};
