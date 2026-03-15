import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { marked } from 'marked';
import { loadConfig } from '../../core/config.js';

export interface WordExportOptions {
  title: string;
  content: string;
  author?: string;
  outputPath: string;
}

/**
 * Export content to Word document (.docx)
 */
export async function exportToWord(options: WordExportOptions): Promise<void> {
  const config = loadConfig();
  const { title, content, author = config.author, outputPath } = options;
  
  // Parse markdown to get structure
  const tokens = marked.lexer(content);
  const children: (Paragraph | Paragraph)[] = [];
  
  // Add title
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
    })
  );
  
  // Process markdown tokens
  for (const token of tokens) {
    if (token.type === 'heading') {
      const level = token.depth as 1 | 2 | 3 | 4 | 5 | 6;
      const headingLevels = {
        1: HeadingLevel.HEADING_1,
        2: HeadingLevel.HEADING_2,
        3: HeadingLevel.HEADING_3,
        4: HeadingLevel.HEADING_4,
        5: HeadingLevel.HEADING_5,
        6: HeadingLevel.HEADING_6,
      };
      
      children.push(
        new Paragraph({
          text: token.text,
          heading: headingLevels[level],
          spacing: { before: 200, after: 200 },
        })
      );
    } else if (token.type === 'paragraph') {
      const text = token.text || '';
      // Handle bold and italic
      const runs = parseInlineFormatting(text);
      children.push(
        new Paragraph({
          children: runs,
          spacing: { after: 200 },
        })
      );
    } else if (token.type === 'list') {
      for (const item of token.items || []) {
        const text = item.text || '';
        const runs = parseInlineFormatting(text);
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: '• ', bold: true }),
              ...runs,
            ],
            spacing: { after: 100 },
          })
        );
      }
    }
  }
  
  const doc = new Document({
    creator: author,
    title,
    sections: [
      {
        children,
      },
    ],
  });
  
  const buffer = await Packer.toBuffer(doc);
  const fs = await import('fs/promises');
  await fs.writeFile(outputPath, buffer);
}

function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let currentIndex = 0;
  
  // Simple regex-based parsing for bold and italic
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicRegex = /\*([^*]+)\*/g;
  
  const matches: Array<{ start: number; end: number; text: string; bold?: boolean; italic?: boolean }> = [];
  
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      bold: true,
    });
  }
  
  while ((match = italicRegex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      italic: true,
    });
  }
  
  matches.sort((a, b) => a.start - b.start);
  
  for (const m of matches) {
    if (currentIndex < m.start) {
      const plainText = text.substring(currentIndex, m.start);
      if (plainText) {
        runs.push(new TextRun(plainText));
      }
    }
    runs.push(new TextRun({
      text: m.text,
      bold: m.bold,
      italics: m.italic,
    }));
    currentIndex = m.end;
  }
  
  if (currentIndex < text.length) {
    const plainText = text.substring(currentIndex);
    if (plainText) {
      runs.push(new TextRun(plainText));
    }
  }
  
  return runs.length > 0 ? runs : [new TextRun(text)];
}

