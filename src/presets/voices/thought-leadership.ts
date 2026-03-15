import type { VoiceDefinition } from '../../core/registries/types.js';

export const thoughtLeadershipVoice: VoiceDefinition = {
  modeId: 'thought-leadership',
  name: 'Thought Leadership Voice',

  instructions: `
You are writing thought leadership content in {author}'s voice as a {persona}. Key principles:

1. **Open with tension or questions**, never with thesis statements
2. **Show the work**, not just conclusions
3. **Include self-interrogation** without self-doubt
4. **End provisionally** ("Here's what I think today")
5. **Use intentional fragments** for rhythm
6. **Avoid corporate jargon** and academic distance
7. **Ground in actual experience**, not theory
8. **Professional but conversational** - not sterile or overly formal

Voice markers to include:
- Question-first openings (not thesis statements)
- "I used to think X, now I think Y" evolution patterns
- Self-interrogation moments ("But that brings up a question...")
- Provisional language ("for now," "today," "here's where I've landed")
- Intentional fragments for rhythm
- Bold section headers for scannability
- Specific examples over abstract theory
- Pattern recognition across industries

Avoid:
- Corporate jargon ("leverage," "synergize," "drive value")
- Academic distance ("Research shows," "One could argue")
- Prescriptive authority ("You should always," "The right way to")
- Over-polished, sterile language
`,

  checkRules: {
    openingPatterns: {
      required: [/[?]/, /tension|uncomfortable|dilemma|challenge|paradox/i],
      forbidden: [/^In this (post|article)/im, /^This guide shows/im],
    },
    voiceMarkers: {
      positive: [
        /I used to|Now I|I've changed/i,
        /for now|today|here's where I've landed/i,
        /But that (brings up|raises)/i,
        /I wonder|What if/i,
      ],
      negative: [/you should always/i, /the right way to/i, /step \d+:/i],
    },
    structuralPatterns: {
      required: [/^\*\*[^*]+\*\*$/m],
    },
    jargonToAvoid: ['leverage', 'synergize', 'drive value', 'stakeholders'],
  },

  bonusChecks(content: string) {
    const issues: string[] = [];
    const strengths: string[] = [];
    let scoreAdjustment = 0;

    // Should show evolution
    if (/I used to|Now I|my thinking (has )?evolved/i.test(content)) {
      strengths.push('Shows evolution of thinking');
    }

    // Should end provisionally
    const lastParagraph = content.split('\n\n').pop() || '';
    if (/for now|today|where I've landed/i.test(lastParagraph)) {
      strengths.push('Ends provisionally');
    }

    return { issues, strengths, scoreAdjustment };
  },
};
