/**
 * Slide Content Model (V2)
 *
 * A richer slide data model that supports 10 layout types and
 * content directives. The parseDeckFromMarkdownV2() function
 * auto-detects layout based on content patterns or explicit
 * HTML comment directives.
 *
 * Backward compatible: markdown without directives produces the
 * same output as the V1 parser (title + content slides).
 */

// ---------------------------------------------------------------------------
// Layout Types
// ---------------------------------------------------------------------------

export type SlideLayout =
  | 'title'              // Hero title slide (auto for first slide)
  | 'section-divider'    // Section break with large heading
  | 'content'            // Title + bullet list (default)
  | 'two-column-text'    // Title + two text columns
  | 'multi-column-image' // Columns with images + text
  | 'table'              // Title + data table
  | 'image-text'         // Image on one side, text on other
  | 'full-image'         // Full-bleed image with overlay
  | 'quote'              // Large quote with attribution
  | 'conclusion';        // Closing / thank-you slide

// ---------------------------------------------------------------------------
// Rich Text
// ---------------------------------------------------------------------------

export interface RichTextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;       // 6-char hex override
  fontSize?: number;     // pt override
  fontFace?: string;
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export interface TableCell {
  text: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableData {
  headers: TableCell[];
  rows: TableCell[][];
}

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

export interface SlideColumn {
  /** Heading for this column */
  heading?: string;
  /** Bullet items */
  bullets?: string[];
  /** Image path or URL */
  image?: string;
  /** Caption under image */
  caption?: string;
}

// ---------------------------------------------------------------------------
// Slide Data
// ---------------------------------------------------------------------------

export interface SlideData {
  /** Slide title */
  title: string;
  /** Layout type — determines which layout function renders this slide */
  layout: SlideLayout;
  /** Bullet content (for content, two-column-text, etc.) */
  bullets?: string[];
  /** Subtitle or supporting text line */
  subtitle?: string;
  /** Table data (for table layout) */
  table?: TableData;
  /** Column data (for two-column-text, multi-column-image) */
  columns?: SlideColumn[];
  /** Image path or URL (for image-text, full-image) */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Quote text (for quote layout) */
  quoteText?: string;
  /** Quote attribution */
  quoteAttribution?: string;
  /** Speaker notes (markdown) */
  notes?: string;
  /** Raw content lines (unparsed, for fallback) */
  rawContent?: string[];
}

// ---------------------------------------------------------------------------
// Deck Data
// ---------------------------------------------------------------------------

export interface DeckData {
  /** Deck title (from first slide) */
  title: string;
  /** Deck subtitle */
  subtitle?: string;
  /** Ordered slides */
  slides: SlideData[];
}

// ---------------------------------------------------------------------------
// Directive Parsing Helpers
// ---------------------------------------------------------------------------

const LAYOUT_DIRECTIVE_RE = /<!--\s*layout:\s*(\S+)\s*-->/i;
const SECTION_DIRECTIVE_RE = /<!--\s*section\s*-->/i;
const NOTES_DIRECTIVE_RE = /<!--\s*notes\s*-->/i;
const NOTES_END_RE = /<!--\s*\/notes\s*-->/i;
const TABLE_HEADER_RE = /^\|(.+)\|$/;
const TABLE_SEPARATOR_RE = /^\|[-:\s|]+\|$/;
const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)/;
const BLOCKQUOTE_RE = /^>\s?(.*)$/;
const HEADING_RE = /^(#{1,3})\s+(.+)$/;
const LIST_ITEM_RE = /^(?:[-*]|\d+\.)\s+(.+)$/;
const HR_RE = /^---+$/;

/**
 * Detect if a title looks like a conclusion slide.
 */
function isConclusion(title: string): boolean {
  const lower = title.toLowerCase();
  return /\b(question|thank|next\s*step|closing|wrap|summary|conclusion|q\s*&\s*a)\b/.test(lower);
}

/**
 * Parse a markdown table from consecutive lines starting at `startIdx`.
 * Returns the parsed TableData and the index after the last table line.
 */
function parseTableLines(lines: string[], startIdx: number): { table: TableData; endIdx: number } {
  const headerLine = lines[startIdx];
  const headerCells = headerLine
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

  // Skip separator line
  let idx = startIdx + 1;
  if (idx < lines.length && TABLE_SEPARATOR_RE.test(lines[idx])) {
    idx++;
  }

  const rows: TableCell[][] = [];
  while (idx < lines.length && TABLE_HEADER_RE.test(lines[idx]) && !TABLE_SEPARATOR_RE.test(lines[idx])) {
    const cells = lines[idx]
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => ({ text: c.trim() }));
    rows.push(cells);
    idx++;
  }

  return {
    table: {
      headers: headerCells.map((text) => ({ text, bold: true })),
      rows,
    },
    endIdx: idx,
  };
}

// ---------------------------------------------------------------------------
// V2 Parser
// ---------------------------------------------------------------------------

/**
 * Parse markdown into a DeckData structure with layout auto-detection.
 *
 * Layout assignment priority:
 * 1. Explicit directive: `<!-- layout: table -->` always wins
 * 2. First slide → `title`
 * 3. Markdown table detected → `table`
 * 4. Image reference (`![](path)`) → `image-text`
 * 5. Blockquote (`> ...`) → `quote`
 * 6. `---` separator or `<!-- section -->` → `section-divider`
 * 7. Last slide with conclusion keywords → `conclusion`
 * 8. Everything else → `content`
 */
export function parseDeckFromMarkdownV2(markdown: string): DeckData {
  const lines = markdown.split('\n');
  const slides: SlideData[] = [];
  let current: SlideData | null = null;
  let inNotes = false;
  let noteLines: string[] = [];
  let pendingLayout: SlideLayout | null = null;
  let pendingSectionDivider = false;

  function flushSlide() {
    if (!current) return;

    // Finalize notes
    if (noteLines.length > 0) {
      current.notes = noteLines.join('\n').trim();
      noteLines = [];
    }

    // Auto-detect layout if still 'content' (no explicit directive)
    if (current.layout === 'content') {
      if (current.table) {
        current.layout = 'table';
      } else if (current.image) {
        current.layout = 'image-text';
      } else if (current.quoteText) {
        current.layout = 'quote';
      } else if (current.columns && current.columns.length >= 2) {
        current.layout = 'two-column-text';
      }
    }

    // Demote section-dividers that have real content — section dividers
    // should be pure visual breaks, not content carriers
    if (current.layout === 'section-divider') {
      const hasBullets = current.bullets && current.bullets.length > 0;
      const hasTable = !!current.table;
      if (hasTable) {
        current.layout = 'table';
      } else if (hasBullets) {
        current.layout = 'content';
      }
    }

    slides.push(current);
    current = null;
    inNotes = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // --- Directive: layout
    const layoutMatch = trimmed.match(LAYOUT_DIRECTIVE_RE);
    if (layoutMatch) {
      pendingLayout = layoutMatch[1] as SlideLayout;
      continue;
    }

    // --- Directive: section
    if (SECTION_DIRECTIVE_RE.test(trimmed)) {
      pendingSectionDivider = true;
      continue;
    }

    // --- Directive: notes block
    if (NOTES_DIRECTIVE_RE.test(trimmed) && !NOTES_END_RE.test(trimmed)) {
      inNotes = true;
      continue;
    }
    if (NOTES_END_RE.test(trimmed)) {
      if (current && noteLines.length > 0) {
        current.notes = noteLines.join('\n').trim();
        noteLines = [];
      }
      inNotes = false;
      continue;
    }
    if (inNotes) {
      noteLines.push(line);
      continue;
    }

    // --- Horizontal rule → section divider (next heading becomes divider)
    if (HR_RE.test(trimmed)) {
      pendingSectionDivider = true;
      continue;
    }

    // --- Heading: start a new slide
    const headingMatch = trimmed.match(HEADING_RE);
    if (headingMatch) {
      flushSlide();

      const title = headingMatch[2].trim();
      let layout: SlideLayout = 'content';

      // Priority 1: explicit directive overrides everything
      if (pendingLayout) {
        layout = pendingLayout;
        pendingLayout = null;
        pendingSectionDivider = false;
      }
      // Priority 2: first slide → title
      else if (slides.length === 0) {
        layout = 'title';
        pendingSectionDivider = false;
      }
      // Priority 6: section divider
      else if (pendingSectionDivider) {
        layout = 'section-divider';
        pendingSectionDivider = false;
      }

      current = {
        title,
        layout,
        bullets: [],
        rawContent: [],
      };
      continue;
    }

    // Skip blank lines when no current slide
    if (!current) continue;
    if (!trimmed) continue;

    // --- Table detection
    if (TABLE_HEADER_RE.test(trimmed)) {
      // Peek ahead for separator line
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (TABLE_SEPARATOR_RE.test(nextLine)) {
        const { table, endIdx } = parseTableLines(lines.map((l) => l.trim()), i);
        // Adjust i — parseTableLines works on trimmed lines starting at i
        // We need to find how many original lines were consumed
        const linesConsumed = endIdx - i;
        i += linesConsumed - 1; // -1 because for-loop increments
        current.table = table;
        continue;
      }
    }

    // --- Image detection
    const imageMatch = trimmed.match(IMAGE_RE);
    if (imageMatch) {
      current.image = imageMatch[2];
      current.imageAlt = imageMatch[1] || undefined;
      continue;
    }

    // --- Blockquote detection
    const quoteMatch = trimmed.match(BLOCKQUOTE_RE);
    if (quoteMatch) {
      const quoteContent = quoteMatch[1].trim();
      // Check if this is an attribution line (starts with — or --)
      if (current.quoteText && /^[—–-]{1,2}\s*/.test(quoteContent)) {
        current.quoteAttribution = quoteContent.replace(/^[—–-]{1,2}\s*/, '');
      } else {
        current.quoteText = current.quoteText
          ? current.quoteText + ' ' + quoteContent
          : quoteContent;
      }
      continue;
    }

    // --- List item
    const listMatch = trimmed.match(LIST_ITEM_RE);
    if (listMatch) {
      current.bullets!.push(listMatch[1]);
      current.rawContent!.push(trimmed);
      continue;
    }

    // --- Subtitle detection (first non-list, non-special line after title)
    if (current.bullets!.length === 0 && !current.subtitle && !current.table && !current.quoteText) {
      current.subtitle = trimmed;
      current.rawContent!.push(trimmed);
      continue;
    }

    // --- Plain text as bullet
    current.bullets!.push(trimmed);
    current.rawContent!.push(trimmed);
  }

  // Flush final slide
  flushSlide();

  // Post-processing: detect conclusion on last slide
  if (slides.length > 1) {
    const last = slides[slides.length - 1];
    if (last.layout === 'content' && isConclusion(last.title)) {
      last.layout = 'conclusion';
    }
  }

  return {
    title: slides[0]?.title || '',
    subtitle: slides[0]?.subtitle,
    slides,
  };
}
