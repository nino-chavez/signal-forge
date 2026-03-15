/**
 * Multi-Column Image Layout
 *
 * Header band with title, then individual white card panels per column
 * on a light background. Each card holds an image, optional heading,
 * and bullets.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { renderBullets, stripMarkdown } from './helpers.js';

export const renderMultiColumnImageSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, spacing, typography, dimensions } = theme;
  const W = dimensions.width;
  const H = dimensions.height;
  const headerH = 1.1;

  // Light background
  slide.background = { color: colors.backgroundLight };

  // Header band
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: W, h: headerH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Title in header band
  slide.addText(data.title, {
    x: spacing.marginLeft + 0.15,
    y: 0.1,
    w: spacing.contentWidth - 0.3,
    h: headerH - 0.2,
    fontSize: typography.sizes.slideTitle,
    fontFace: typography.fontBold,
    bold: true,
    color: colors.textInverse,
    align: 'left',
    valign: 'middle',
    autoFit: true,
  });

  const columns = data.columns || [];
  if (columns.length === 0) return;

  const colCount = Math.min(columns.length, 4);
  const gutter = spacing.columnGutter;
  const totalGutter = gutter * (colCount - 1);
  const colWidth = (spacing.contentWidth - totalGutter) / colCount;

  const cardY = headerH + 0.15;
  const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
  const cardH = H - cardY - spacing.marginBottom - footerReserve + 0.05;
  const imgHeight = cardH * 0.45;

  // Accent colors per column for visual variety
  const accentColors = [colors.primary, colors.secondary, colors.highlight, colors.primary];

  for (let i = 0; i < colCount; i++) {
    const col = columns[i];
    const colX = spacing.marginLeft + i * (colWidth + gutter);

    // Card panel
    slide.addShape(pres.ShapeType.roundRect, {
      x: colX,
      y: cardY,
      w: colWidth,
      h: cardH,
      fill: { color: colors.backgroundWhite },
      line: { width: 0 },
      rectRadius: 0.08,
    });

    // Top accent bar on card
    slide.addShape(pres.ShapeType.rect, {
      x: colX,
      y: cardY,
      w: colWidth,
      h: 0.06,
      fill: { color: accentColors[i] },
      line: { width: 0 },
    });

    let y = cardY + 0.2;

    // Image
    if (col.image) {
      slide.addImage({
        path: col.image,
        x: colX + 0.1,
        y,
        w: colWidth - 0.2,
        h: imgHeight,
      });
      y += imgHeight + 0.15;
    }

    // Heading
    if (col.heading) {
      slide.addText(stripMarkdown(col.heading), {
        x: colX + 0.1,
        y,
        w: colWidth - 0.2,
        h: 0.35,
        fontSize: typography.sizes.subtitle,
        fontFace: typography.fontBold,
        bold: true,
        color: colors.primary,
        align: 'left',
      });
      y += 0.4;
    }

    // Caption
    if (col.caption) {
      slide.addText(stripMarkdown(col.caption), {
        x: colX + 0.1,
        y,
        w: colWidth - 0.2,
        h: 0.3,
        fontSize: typography.sizes.small,
        fontFace: typography.fontSecondary,
        color: colors.textMuted,
        align: 'left',
      });
      y += 0.35;
    }

    // Bullets
    if (col.bullets && col.bullets.length > 0) {
      const bulletMaxH = cardY + cardH - y - 0.15;
      renderBullets(slide, col.bullets, theme, y, {
        x: colX + 0.15,
        w: colWidth - 0.3,
        maxH: bulletMaxH,
      });
    }
  }
};
