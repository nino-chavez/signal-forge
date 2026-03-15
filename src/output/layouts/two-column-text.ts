/**
 * Two-Column Text Layout
 *
 * Header band with title, two side-by-side white card panels on a
 * light background. Each card has its own accent bar and optional heading.
 */

import type PptxGenJS from 'pptxgenjs';
import type { LayoutFunction } from './layout-types.js';
import { renderBullets, stripMarkdown } from './helpers.js';

export const renderTwoColumnTextSlide: LayoutFunction = (pres, slide, data, theme) => {
  const { colors, spacing, dimensions, typography } = theme;
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

  // Determine left/right content
  let leftBullets: string[] = [];
  let rightBullets: string[] = [];
  let leftHeading: string | undefined;
  let rightHeading: string | undefined;

  if (data.columns && data.columns.length >= 2) {
    leftBullets = data.columns[0].bullets || [];
    rightBullets = data.columns[1].bullets || [];
    leftHeading = data.columns[0].heading;
    rightHeading = data.columns[1].heading;
  } else if (data.bullets && data.bullets.length > 0) {
    const mid = Math.ceil(data.bullets.length / 2);
    leftBullets = data.bullets.slice(0, mid);
    rightBullets = data.bullets.slice(mid);
  }

  const gutter = spacing.columnGutter;
  const colWidth = (spacing.contentWidth - gutter) / 2;
  const leftX = spacing.marginLeft;
  const rightX = spacing.marginLeft + colWidth + gutter;

  // Card geometry
  const cardY = headerH + 0.15;
  const footerReserve = theme.footer?.showSlideNumbers ? 0.5 : 0.2;
  const cardH = H - cardY - spacing.marginBottom - footerReserve + 0.05;

  // Left card
  slide.addShape(pres.ShapeType.roundRect, {
    x: leftX,
    y: cardY,
    w: colWidth,
    h: cardH,
    fill: { color: colors.backgroundWhite },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  // Left accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: leftX,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: colors.primary },
    line: { width: 0 },
  });

  // Right card
  slide.addShape(pres.ShapeType.roundRect, {
    x: rightX,
    y: cardY,
    w: colWidth,
    h: cardH,
    fill: { color: colors.backgroundWhite },
    line: { width: 0 },
    rectRadius: 0.08,
  });

  // Right accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: rightX,
    y: cardY,
    w: 0.06,
    h: cardH,
    fill: { color: colors.secondary },
    line: { width: 0 },
  });

  // Column headings
  let leftContentY = cardY + 0.2;
  let rightContentY = cardY + 0.2;

  if (leftHeading) {
    slide.addText(stripMarkdown(leftHeading), {
      x: leftX + 0.2,
      y: leftContentY,
      w: colWidth - 0.4,
      h: 0.4,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontBold,
      bold: true,
      color: colors.primary,
      align: 'left',
    });
    leftContentY += 0.5;
  }

  if (rightHeading) {
    slide.addText(stripMarkdown(rightHeading), {
      x: rightX + 0.2,
      y: rightContentY,
      w: colWidth - 0.4,
      h: 0.4,
      fontSize: typography.sizes.subtitle,
      fontFace: typography.fontBold,
      bold: true,
      color: colors.secondary,
      align: 'left',
    });
    rightContentY += 0.5;
  }

  const leftMaxH = cardY + cardH - leftContentY - 0.15;
  const rightMaxH = cardY + cardH - rightContentY - 0.15;

  // Left column bullets
  if (leftBullets.length > 0) {
    renderBullets(slide, leftBullets, theme, leftContentY, {
      x: leftX + 0.2,
      w: colWidth - 0.4,
      maxH: leftMaxH,
    });
  }

  // Right column bullets
  if (rightBullets.length > 0) {
    renderBullets(slide, rightBullets, theme, rightContentY, {
      x: rightX + 0.2,
      w: colWidth - 0.4,
      maxH: rightMaxH,
    });
  }
};
