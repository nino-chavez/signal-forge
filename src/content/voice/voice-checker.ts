import { VOICE_RULES, PROVISIONAL_PHRASES } from './voice-guide.js';

export interface VoiceCheckResult {
  score: number; // 0-10
  passed: boolean;
  issues: string[];
  strengths: string[];
}

/**
 * Check if content matches voice guidelines
 */
export function checkVoice(content: string): VoiceCheckResult {
  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 10;

  // Check opening
  const firstParagraph = content.split('\n\n')[0] || '';
  const hasQuestion = /[?]/.test(firstParagraph);
  const hasTension = /tension|uncomfortable|dilemma|challenge/.test(firstParagraph.toLowerCase());
  
  if (!hasQuestion && !hasTension) {
    issues.push('Opening lacks question or tension hook');
    score -= 2;
  } else {
    strengths.push('Strong opening with question/tension');
  }

  // Check for corporate jargon
  for (const jargon of VOICE_RULES.avoid.corporateJargon) {
    if (content.toLowerCase().includes(jargon.toLowerCase())) {
      issues.push(`Contains corporate jargon: "${jargon}"`);
      score -= 1;
    }
  }

  // Check for academic distance
  for (const phrase of VOICE_RULES.avoid.academicDistance) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`Contains academic distance: "${phrase}"`);
      score -= 1;
    }
  }

  // Check for prescriptive authority
  for (const phrase of VOICE_RULES.avoid.prescriptiveAuthority) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`Contains prescriptive authority: "${phrase}"`);
      score -= 1;
    }
  }

  // Check for provisional language
  const hasProvisional = PROVISIONAL_PHRASES.some(phrase => 
    content.toLowerCase().includes(phrase.toLowerCase())
  );
  if (!hasProvisional) {
    issues.push('Missing provisional language ("for now," "today," etc.)');
    score -= 1;
  } else {
    strengths.push('Uses provisional language appropriately');
  }

  // Check for evolution pattern
  const hasEvolution = /I used to|Now I|That sounds like progress/.test(content);
  if (!hasEvolution) {
    issues.push('Missing evolution pattern ("I used to think X, now Y")');
    score -= 0.5;
  } else {
    strengths.push('Shows evolution/learning');
  }

  // Check for self-interrogation
  const hasSelfInterrogation = /But that brings up|I wonder|What if/.test(content);
  if (!hasSelfInterrogation) {
    issues.push('Missing self-interrogation moments');
    score -= 0.5;
  } else {
    strengths.push('Includes self-interrogation');
  }

  // Check for bold headers
  const hasBoldHeaders = /^\*\*[^*]+\*\*$/m.test(content);
  if (!hasBoldHeaders) {
    issues.push('Missing bold section headers');
    score -= 0.5;
  } else {
    strengths.push('Uses bold headers for scannability');
  }

  // Check for intentional fragments
  const hasFragments = /^[A-Z][^.!?]*\.$/m.test(content);
  if (!hasFragments) {
    // Not a requirement, but a strength
  } else {
    strengths.push('Uses intentional fragments for rhythm');
  }

  // Check for excessive client name repetition (should use "you" / "your organization")
  // This is a heuristic - if a capitalized word appears more than 10 times in 1000 words, flag it
  const words = content.split(/\s+/);
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    const clean = word.replace(/[^\w]/g, '').trim();
    if (clean.length > 3 && /^[A-Z]/.test(clean)) {
      wordCounts[clean] = (wordCounts[clean] || 0) + 1;
    }
  });
  
  const contentLength = words.length;
  const threshold = Math.max(5, Math.floor(contentLength / 200)); // Roughly 5 per 1000 words
  
  for (const [word, count] of Object.entries(wordCounts)) {
    // Skip common words that start with capitals
    if (['The', 'This', 'That', 'There', 'These', 'Those', 'When', 'Where', 'What', 'Why', 'How'].includes(word)) {
      continue;
    }
    
    if (count > threshold) {
      // Check if it's likely a client name (appears frequently)
      const ratio = count / contentLength;
      if (ratio > 0.02) { // More than 2% of words
        issues.push(`Excessive repetition of "${word}" - consider using "you" / "your organization" instead`);
        score -= 1;
      }
    }
  }

  // Check for natural "you" usage (strength)
  const youCount = (content.match(/\byou\b/gi) || []).length;
  const yourCount = (content.match(/\byour\b/gi) || []).length;
  if (youCount + yourCount > 5) {
    strengths.push('Uses natural "you" / "your" references');
  }

  score = Math.max(0, Math.min(10, score));

  return {
    score,
    passed: score >= 7,
    issues,
    strengths,
  };
}

