/**
 * Long-Form Strategy Paper Template Structure
 */

export interface PaperStructure {
  title: string;
  executiveSummary: string;
  introduction: string;
  context: string;
  patternRecognition: string;
  framework: string;
  deepDive: Array<{
    title: string;
    content: string;
  }>;
  implementation: string;
  questions: string;
  conclusion: string;
}

export const PAPER_TEMPLATE: PaperStructure = {
  title: '',
  executiveSummary: '',
  introduction: '',
  context: '',
  patternRecognition: '',
  framework: '',
  deepDive: [],
  implementation: '',
  questions: '',
  conclusion: '',
};

export function parsePaperFromMarkdown(markdown: string): Partial<PaperStructure> {
  const sections: Record<string, string> = {};
  const lines = markdown.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Check for section header (## or ###)
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/);
    if (headerMatch) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n\n').trim();
      }
      currentSection = headerMatch[1].toLowerCase().replace(/\s+/g, '');
      currentContent = [];
    } else if (line.trim() && currentSection) {
      currentContent.push(line.trim());
    }
  }
  
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n\n').trim();
  }
  
  return {
    title: sections['title'] || '',
    executiveSummary: sections['executivesummary'] || sections['summary'] || '',
    introduction: sections['introduction'] || sections['thetension'] || '',
    context: sections['context'] || sections['contextbackground'] || '',
    patternRecognition: sections['patternrecognition'] || sections['pattern'] || '',
    framework: sections['framework'] || sections['theframework'] || '',
    implementation: sections['implementation'] || sections['implementationconsiderations'] || '',
    questions: sections['questions'] || sections['thequestions'] || '',
    conclusion: sections['conclusion'] || sections['provisionallanding'] || '',
  };
}

