import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { parseDeckFromMarkdown } from '../../content/templates/deck-template.js';
import { marked } from 'marked';

export interface SlidesExportOptions {
  title: string;
  content: string;
  presentationId?: string; // If provided, update existing; otherwise create new
  credentialsPath?: string;
}

/**
 * Export content to Google Slides
 * Requires Google API credentials
 */
export async function exportToGoogleSlides(options: SlidesExportOptions): Promise<string> {
  const { title, content, presentationId, credentialsPath } = options;
  
  // Load credentials
  const credentials = credentialsPath 
    ? JSON.parse(await readFile(credentialsPath, 'utf-8'))
    : JSON.parse(process.env.GOOGLE_SLIDES_CREDENTIALS || '{}');
  
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Slides credentials not configured. Set GOOGLE_SLIDES_CREDENTIALS env var or provide credentialsPath');
  }
  
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/presentations'],
  });
  
  const slides = google.slides({ version: 'v1', auth });
  
  let presentation;
  
  if (presentationId) {
    // Update existing presentation
    presentation = await slides.presentations.get({ presentationId });
  } else {
    // Create new presentation
    presentation = await slides.presentations.create({
      requestBody: {
        title,
      },
    });
  }
  
  const id = presentation.data.presentationId!;
  
  // Parse content
  const deckStructure = parseDeckFromMarkdown(content);
  
  // Create requests to add/update slides
  const requests: any[] = [];
  
  if (!presentationId) {
    // Delete default slide if creating new
    if (presentation.data.slides && presentation.data.slides.length > 0) {
      requests.push({
        deleteObject: {
          objectId: presentation.data.slides[0].objectId,
        },
      });
    }
  }
  
  // Add slides
  for (let i = 0; i < deckStructure.slides.length; i++) {
    const slide = deckStructure.slides[i];
    
    requests.push({
      createSlide: {
        insertionIndex: i,
        slideLayoutReference: {
          predefinedLayout: i === 0 ? 'TITLE' : 'BLANK',
        },
      },
    });
    
    // Get the slide ID (we'll need to get it after creation)
    // For now, create a simplified version
  }
  
  // Execute batch update
  if (requests.length > 0) {
    await slides.presentations.batchUpdate({
      presentationId: id,
      requestBody: {
        requests,
      },
    });
  }
  
  return `https://docs.google.com/presentation/d/${id}`;
}

