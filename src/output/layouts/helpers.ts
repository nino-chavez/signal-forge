/**
 * Layout Helpers
 *
 * Shared utilities used across layout functions — background rendering,
 * rich text conversion, footer/logo placement, hex conversion.
 */

import type PptxGenJS from 'pptxgenjs';
import type { PresentationTheme } from '../../content/design-system/theme-types.js';

/**
 * Convert hex color (with or without #) to 6-char hex string for PptxGenJS.
 */
export function hexToRgb(hex: string): string {
  const cleaned = hex.replace(/^#/, '');
  if (/^[a-f\d]{6}$/i.test(cleaned)) return cleaned;
  return '363636'; // fallback gray
}

/**
 * Strip markdown bold/italic markers from a string.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1');
}

/**
 * Add the theme's accent line at the top of a content slide.
 */
export function addAccentLine(
  pres: PptxGenJS,
  slide: PptxGenJS.Slide,
  theme: PresentationTheme,
): void {
  if (!theme.shapes.showAccentLine) return;
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: theme.dimensions.width,
    h: theme.shapes.accentLineHeight,
    fill: { color: theme.colors.primary },
    line: { color: theme.colors.primary, width: 0 },
  });
}

/**
 * Add the theme's title divider line below a title.
 */
export function addTitleDivider(
  pres: PptxGenJS,
  slide: PptxGenJS.Slide,
  theme: PresentationTheme,
  y: number,
): void {
  if (!theme.shapes.showTitleDivider) return;
  slide.addShape(pres.ShapeType.rect, {
    x: theme.spacing.marginLeft,
    y,
    w: theme.spacing.contentWidth,
    h: theme.shapes.titleDividerHeight,
    fill: { color: theme.colors.primary },
    line: { color: theme.colors.primary, width: 0 },
  });
}

/**
 * Add a slide title and return the Y position after the title block
 * (including optional divider).
 */
export function addSlideTitle(
  pres: PptxGenJS,
  slide: PptxGenJS.Slide,
  title: string,
  theme: PresentationTheme,
): number {
  const { spacing, typography, colors } = theme;
  const titleY = spacing.marginTop + (theme.shapes.showAccentLine ? theme.shapes.accentLineHeight : 0);
  const titleH = 0.8;

  slide.addText(title, {
    x: spacing.marginLeft,
    y: titleY,
    w: spacing.contentWidth,
    h: titleH,
    fontSize: typography.sizes.slideTitle,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.primary,
    align: 'left',
    valign: 'bottom',
  });

  const dividerY = titleY + titleH + 0.1;
  addTitleDivider(pres, slide, theme, dividerY);

  const contentStart = dividerY + (theme.shapes.showTitleDivider ? theme.shapes.titleDividerHeight + 0.15 : 0.15);
  return contentStart;
}

/**
 * Add footer text and optional slide number.
 */
export function addFooter(
  slide: PptxGenJS.Slide,
  theme: PresentationTheme,
  slideNumber?: number,
  totalSlides?: number,
): void {
  if (!theme.footer) return;

  const { footer, spacing, dimensions, typography, colors } = theme;
  const footerY = dimensions.height - spacing.marginBottom;
  const fontSize = footer.fontSize ?? typography.sizes.footer;
  const color = footer.color ?? colors.textMuted;

  // Footer text (left)
  if (footer.template) {
    slide.addText(footer.template, {
      x: spacing.marginLeft,
      y: footerY,
      w: spacing.contentWidth * 0.7,
      h: 0.3,
      fontSize,
      fontFace: typography.fontSecondary,
      color,
      align: 'left',
      valign: 'bottom',
    });
  }

  // Slide number (right)
  if (footer.showSlideNumbers && slideNumber !== undefined) {
    const numText = totalSlides ? `${slideNumber} / ${totalSlides}` : `${slideNumber}`;
    slide.addText(numText, {
      x: spacing.marginLeft + spacing.contentWidth * 0.7,
      y: footerY,
      w: spacing.contentWidth * 0.3,
      h: 0.3,
      fontSize,
      fontFace: typography.fontSecondary,
      color,
      align: 'right',
      valign: 'bottom',
    });
  }
}

/**
 * Add logo to the slide based on theme configuration.
 */
export function addLogo(
  slide: PptxGenJS.Slide,
  theme: PresentationTheme,
): void {
  if (!theme.logo) return;

  const { logo, spacing, dimensions } = theme;
  let x: number;
  let y: number;

  switch (logo.position) {
    case 'top-left':
      x = spacing.marginLeft;
      y = spacing.marginTop;
      break;
    case 'top-right':
      x = dimensions.width - spacing.marginRight - logo.width;
      y = spacing.marginTop;
      break;
    case 'bottom-left':
      x = spacing.marginLeft;
      y = dimensions.height - spacing.marginBottom - logo.height;
      break;
    case 'bottom-right':
    default:
      x = dimensions.width - spacing.marginRight - logo.width;
      y = dimensions.height - spacing.marginBottom - logo.height;
      break;
  }

  slide.addImage({
    path: logo.path,
    x,
    y,
    w: logo.width,
    h: logo.height,
  });
}

/**
 * Render a list of bullets onto a slide as a single text box.
 *
 * Uses one addText() call with an array of text runs so PptxGenJS
 * handles wrapping and line spacing natively. autoFit shrinks the
 * font if content exceeds the available height.
 */
export function renderBullets(
  slide: PptxGenJS.Slide,
  bullets: string[],
  theme: PresentationTheme,
  startY: number,
  opts?: {
    x?: number;
    w?: number;
    maxH?: number;
    maxItems?: number;
    color?: string;
    fontSize?: number;
  },
): void {
  const { spacing, typography, colors, dimensions } = theme;
  const x = opts?.x ?? spacing.marginLeft + 0.2;
  const w = opts?.w ?? spacing.contentWidth - 0.2;
  const maxItems = opts?.maxItems ?? 20;
  const color = opts?.color ?? colors.textBody;
  const fontSize = opts?.fontSize ?? typography.sizes.body;
  const items = bullets.slice(0, maxItems);
  if (items.length === 0) return;

  // Available height: from startY to footer area
  const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
  const maxH = opts?.maxH ?? (dimensions.height - startY - spacing.marginBottom - footerReserve);

  // Build array of text runs — one paragraph per bullet
  const textRows: Array<{ text: string; options: Record<string, unknown> }> = items.map((bullet) => ({
    text: stripMarkdown(bullet),
    options: {
      bullet: { code: '2022' },
      breakLine: true,
      fontSize,
      fontFace: typography.fontSecondary,
      color,
      align: 'left',
      paraSpaceAfter: 4,
    },
  }));

  slide.addText(textRows as any, {
    x,
    y: startY,
    w,
    h: maxH,
    valign: 'top',
    autoFit: true,
    lineSpacingMultiple: 1.1,
  });
}
