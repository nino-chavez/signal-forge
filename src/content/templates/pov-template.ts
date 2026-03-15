/**
 * POV (Point of View) Template Structure
 */

export interface POVStructure {
  title: string;
  openingHook: string;
  context: string;
  pattern: string;
  framework: string;
  recommendations: string;
  questions: string;
  nextSteps: string[];
}

export const POV_TEMPLATE: POVStructure = {
  title: '',
  openingHook: '',
  context: '',
  pattern: '',
  framework: '',
  recommendations: '',
  questions: '',
  nextSteps: [],
};

export function parsePOVFromMarkdown(markdown: string): Partial<POVStructure> {
  const sections: Record<string, string> = {};
  const lines = markdown.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Check for section header (##)
    const headerMatch = line.match(/^##\s+(.+)$/);
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
    openingHook: sections['openinghook'] || sections['thetension'] || '',
    context: sections['context'] || sections['thecontext'] || '',
    pattern: sections['pattern'] || sections['thepattern'] || '',
    framework: sections['framework'] || sections['theframework'] || '',
    recommendations: sections['recommendations'] || sections['therecommendations'] || '',
    questions: sections['questions'] || sections['thequestions'] || '',
    nextSteps: sections['nextsteps']?.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().substring(2)) || [],
  };
}

