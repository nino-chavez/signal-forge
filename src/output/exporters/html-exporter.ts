import { marked } from 'marked';
import { parseDeckFromMarkdown } from '../../content/templates/deck-template.js';
import { generateCSSVariables, getDesignTokens } from '../../content/design-system/presentation-theme.js';
import { loadConfig } from '../../core/config.js';

export interface HTMLExportOptions {
  title: string;
  content: string;
  outputPath: string;
  contentType: 'deck' | 'pov' | 'paper' | 'guide' | 'reference' | 'tutorial';
  author?: string;
}

/**
 * Export content to standalone HTML web page
 * Professional presentation design with design system integration
 */
export async function exportToHTML(options: HTMLExportOptions): Promise<void> {
  const config = loadConfig();
  const { title, content, outputPath, contentType, author = config.author } = options;
  
  // Convert markdown to HTML
  const htmlContent = await marked(content);
  
  // Generate HTML based on content type
  let html = '';

  if (contentType === 'deck') {
    html = generateDeckHTML(title, content, htmlContent, author);
  } else if (contentType === 'pov') {
    html = generatePOVHTML(title, htmlContent, author);
  } else if (contentType === 'guide' || contentType === 'reference' || contentType === 'tutorial') {
    html = generateDocumentationHTML(title, htmlContent, author, contentType);
  } else {
    html = generatePaperHTML(title, htmlContent, author);
  }
  
  const fs = await import('fs/promises');
  await fs.writeFile(outputPath, html, 'utf-8');
}

function generateDeckHTML(title: string, markdown: string, htmlContent: string, author: string): string {
  const deckStructure = parseDeckFromMarkdown(markdown);
  const slides = deckStructure.slides.length > 0 ? deckStructure.slides : [];
  const tokens = getDesignTokens();
  const config = loadConfig();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    
    <!-- Adobe Fonts: Default Project (includes Rival Sans, Komet, Darkmode-Off, Apparat, Elza, Articulat) -->
    <link rel="stylesheet" href="${config.fonts.secondary}">
    
    <!-- Adobe Fonts: Rival Sans Project (backup/alternative) -->
    <link rel="stylesheet" href="${config.fonts.primary}">
    
    <!-- Preconnect for faster font loading -->
    <link rel="preconnect" href="https://use.typekit.net" crossorigin>
    
    <style>
        ${generateCSSVariables()}
        
        /* Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-family-primary);
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            background: var(--color-bg-primary);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
        }
        
        /* Navigation Bar */
        .nav-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: var(--color-bg-primary);
            border-bottom: var(--border-width-thin) solid var(--color-neutral-200);
            box-shadow: var(--shadow-sm);
            z-index: 1000;
            padding: var(--spacing-sm) var(--spacing-lg);
        }
        
        .nav-content {
            max-width: 1600px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-title {
            font-size: var(--font-size-h3);
            font-weight: var(--font-weight-bold);
            color: var(--color-brand-violet);
        }
        
        .nav-controls {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }
        
        .nav-button {
            background: var(--color-bg-primary);
            border: var(--border-width-thin) solid var(--color-neutral-300);
            border-radius: var(--radius-md);
            padding: var(--spacing-xs) var(--spacing-md);
            font-size: var(--font-size-small);
            font-weight: var(--font-weight-medium);
            color: var(--color-text-primary);
            cursor: pointer;
            transition: all var(--duration-reaction) var(--easing-snap);
        }
        
        .nav-button:hover:not(:disabled) {
            background: var(--color-bg-secondary);
            border-color: var(--color-brand-violet);
            transform: translateY(-1px);
        }
        
        .nav-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        
        .nav-button-primary {
            background: var(--color-brand-violet);
            color: white;
            border-color: var(--color-brand-violet);
        }
        
        .nav-button-primary:hover:not(:disabled) {
            background: var(--color-brand-navy);
        }
        
        .nav-progress {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
        }
        
        .nav-progress-dot {
            width: 8px;
            height: 8px;
            border-radius: var(--radius-full);
            background: var(--color-neutral-300);
            transition: all var(--duration-transition) var(--easing-flow);
            cursor: pointer;
        }
        
        .nav-progress-dot.active {
            width: 32px;
            background: var(--color-brand-violet);
        }
        
        .nav-progress-dot:hover {
            background: var(--color-brand-violet);
            opacity: 0.6;
        }
        
        .nav-counter {
            font-size: var(--font-size-small);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-secondary);
            min-width: 60px;
            text-align: center;
        }
        
        /* Slide Container */
        .slides-container {
            margin-top: 80px;
            min-height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--spacing-2xl) var(--spacing-lg);
        }
        
        .slide {
            display: none;
            width: 100%;
            max-width: 1400px;
            animation: slideFadeIn var(--duration-flow) var(--easing-flow);
        }
        
        .slide.active {
            display: block;
        }
        
        @keyframes slideFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Slide Content */
        .slide-content {
            background: var(--color-bg-primary);
            border-radius: var(--radius-xl);
            padding: var(--spacing-2xl);
            box-shadow: var(--shadow-xl);
            min-height: 600px;
            display: flex;
            flex-direction: column;
        }
        
        .slide-title {
            font-size: var(--font-size-h1);
            font-weight: var(--font-weight-bold);
            color: var(--color-brand-violet);
            line-height: var(--line-height-tight);
            letter-spacing: var(--letter-spacing-tight);
            margin-bottom: var(--spacing-xl);
            padding-bottom: var(--spacing-md);
            border-bottom: var(--border-width-medium) solid var(--color-brand-violet);
        }
        
        .slide-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }
        
        .slide-body ul {
            list-style: none;
            padding: 0;
        }
        
        .slide-body li {
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            margin-bottom: var(--spacing-md);
            padding-left: var(--spacing-lg);
            position: relative;
            animation: fadeInStagger var(--duration-transition) var(--easing-precision);
            animation-fill-mode: both;
        }
        
        .slide-body li:nth-child(1) { animation-delay: 0ms; }
        .slide-body li:nth-child(2) { animation-delay: 120ms; }
        .slide-body li:nth-child(3) { animation-delay: 240ms; }
        .slide-body li:nth-child(4) { animation-delay: 360ms; }
        .slide-body li:nth-child(5) { animation-delay: 480ms; }
        .slide-body li:nth-child(6) { animation-delay: 600ms; }
        .slide-body li:nth-child(7) { animation-delay: 720ms; }
        .slide-body li:nth-child(8) { animation-delay: 840ms; }
        
        @keyframes fadeInStagger {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .slide-body li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--color-brand-violet);
            font-weight: var(--font-weight-bold);
            font-size: 1.5em;
            line-height: 1;
        }
        
        .slide-body strong {
            color: var(--color-text-primary);
            font-weight: var(--font-weight-semibold);
        }
        
        .slide-body em {
            font-style: italic;
            color: var(--color-text-secondary);
        }
        
        /* Title Slide Special Styling */
        .slide-title-slide .slide-content {
            background: linear-gradient(135deg, var(--color-brand-violet) 0%, var(--color-brand-navy) 100%);
            color: white;
            text-align: center;
            justify-content: center;
        }
        
        .slide-title-slide .slide-title {
            color: white;
            border-bottom: none;
            font-size: var(--font-size-display);
            font-weight: var(--font-weight-extrabold);
            margin-bottom: var(--spacing-lg);
        }
        
        .slide-title-slide .slide-subtitle {
            font-size: var(--font-size-h3);
            color: rgba(255, 255, 255, 0.9);
            font-weight: var(--font-weight-regular);
        }
        
        /* Keyboard Shortcuts Hint */
        .keyboard-hint {
            position: fixed;
            bottom: var(--spacing-lg);
            right: var(--spacing-lg);
            background: var(--color-bg-dark);
            color: var(--color-text-inverse);
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--radius-md);
            font-size: var(--font-size-tiny);
            opacity: 0.7;
            transition: opacity var(--duration-transition) var(--easing-flow);
        }
        
        .keyboard-hint:hover {
            opacity: 1;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .slide-content {
                padding: var(--spacing-lg);
            }
            
            .slide-title {
                font-size: var(--font-size-h2);
            }
            
            .nav-progress-dot {
                width: 6px;
                height: 6px;
            }
            
            .nav-progress-dot.active {
                width: 24px;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="nav-bar">
        <div class="nav-content">
            <div class="nav-title">${escapeHtml(title)}</div>
            <div class="nav-controls">
                <button id="prevBtn" class="nav-button">← Previous</button>
                <div class="nav-progress" id="progressDots"></div>
                <div class="nav-counter">
                    <span id="currentSlide">1</span> / <span id="totalSlides">${slides.length || 1}</span>
                </div>
                <button id="nextBtn" class="nav-button nav-button-primary">Next →</button>
            </div>
        </div>
    </nav>
    
    <!-- Slides Container -->
    <div class="slides-container">
        ${slides.length > 0 ? generateSlidesHTML(slides) : generateFallbackHTML(htmlContent)}
    </div>
    
    <!-- Keyboard Shortcuts Hint -->
    <div class="keyboard-hint">
        Use ← → arrow keys or spacebar to navigate
    </div>
    
    <script>
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        function updateSlideDisplay() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentSlideIndex) {
                    slide.classList.add('active');
                }
            });
            
            // Update counter
            document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
            
            // Update buttons
            document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
            document.getElementById('nextBtn').disabled = currentSlideIndex === totalSlides - 1;
            
            // Update progress dots
            updateProgressDots();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        function updateProgressDots() {
            const dotsContainer = document.getElementById('progressDots');
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'nav-progress-dot' + (i === currentSlideIndex ? ' active' : '');
                dot.addEventListener('click', () => {
                    currentSlideIndex = i;
                    updateSlideDisplay();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        function nextSlide() {
            if (currentSlideIndex < totalSlides - 1) {
                currentSlideIndex++;
                updateSlideDisplay();
            }
        }
        
        function prevSlide() {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSlideDisplay();
            }
        }
        
        // Button event listeners
        document.getElementById('nextBtn').addEventListener('click', nextSlide);
        document.getElementById('prevBtn').addEventListener('click', prevSlide);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                currentSlideIndex = 0;
                updateSlideDisplay();
            } else if (e.key === 'End') {
                e.preventDefault();
                currentSlideIndex = totalSlides - 1;
                updateSlideDisplay();
            }
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Initialize
        updateSlideDisplay();
    </script>
</body>
</html>`;
}

function generateSlidesHTML(slides: any[]): string {
  return slides.map((slide, index) => {
    const isTitleSlide = index === 0 || slide.type === 'title';
    const slideClass = isTitleSlide ? 'slide-title-slide' : '';
    
    return `
    <div class="slide ${slideClass} ${index === 0 ? 'active' : ''}">
        <div class="slide-content">
            <h1 class="slide-title">${escapeHtml(slide.title)}</h1>
            ${isTitleSlide && slide.content.length > 0 ? `
                <div class="slide-subtitle">${escapeHtml(slide.content[0])}</div>
            ` : ''}
            ${!isTitleSlide && slide.content.length > 0 ? `
                <div class="slide-body">
                    <ul>
                        ${slide.content.map((item: string) => {
                          // Parse markdown-like formatting
                          let formatted = escapeHtml(item);
                          // Convert **bold** to <strong>
                          formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
                          // Convert *italic* to <em>
                          formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
                          return `<li>${formatted}</li>`;
                        }).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    </div>
  `;
  }).join('');
}

function generateFallbackHTML(htmlContent: string): string {
  return `
    <div class="slide active">
        <div class="slide-content">
            <div class="slide-body">
                ${htmlContent}
            </div>
        </div>
    </div>
  `;
}

function generatePOVHTML(title: string, htmlContent: string, author: string): string {
  const tokens = getDesignTokens();
  const config = loadConfig();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    
    <!-- Adobe Fonts: Default Project (includes Rival Sans, Komet, Darkmode-Off, Apparat, Elza, Articulat) -->
    <link rel="stylesheet" href="${config.fonts.secondary}">
    
    <!-- Adobe Fonts: Rival Sans Project (backup/alternative) -->
    <link rel="stylesheet" href="${config.fonts.primary}">
    
    <!-- Preconnect for faster font loading -->
    <link rel="preconnect" href="https://use.typekit.net" crossorigin>
    
    <style>
        ${generateCSSVariables()}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-family-primary);
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            background: var(--color-bg-primary);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .header {
            background: linear-gradient(135deg, var(--color-brand-violet) 0%, var(--color-brand-navy) 100%);
            color: var(--color-text-inverse);
            padding: var(--spacing-3xl) var(--spacing-2xl);
            margin-bottom: var(--spacing-3xl);
        }
        
        .header-content {
            max-width: 900px;
            margin: 0 auto;
        }
        
        .header h1 {
            font-size: var(--font-size-display);
            font-weight: var(--font-weight-extrabold);
            margin-bottom: var(--spacing-md);
        }
        
        .header-meta {
            font-size: var(--font-size-h3);
            opacity: 0.9;
        }
        
        .content {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 var(--spacing-2xl) var(--spacing-3xl);
        }
        
        .article {
            background: var(--color-bg-primary);
            border-radius: var(--radius-xl);
            padding: var(--spacing-3xl);
            box-shadow: var(--shadow-xl);
        }
        
        .article h1 {
            font-size: var(--font-size-h1);
            font-weight: var(--font-weight-bold);
            color: var(--color-brand-violet);
            margin-bottom: var(--spacing-xl);
        }
        
        .article h2 {
            font-size: var(--font-size-h2);
            font-weight: var(--font-weight-bold);
            color: var(--color-text-primary);
            margin-top: var(--spacing-2xl);
            margin-bottom: var(--spacing-lg);
            padding-bottom: var(--spacing-sm);
            border-bottom: var(--border-width-medium) solid var(--color-brand-violet);
        }
        
        .article h3 {
            font-size: var(--font-size-h3);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-secondary);
            margin-top: var(--spacing-xl);
            margin-bottom: var(--spacing-md);
        }
        
        .article p {
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            margin-bottom: var(--spacing-lg);
        }
        
        .article ul, .article ol {
            margin: var(--spacing-lg) 0;
            padding-left: var(--spacing-xl);
        }
        
        .article li {
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            margin-bottom: var(--spacing-sm);
        }
        
        .article strong {
            color: var(--color-text-primary);
            font-weight: var(--font-weight-semibold);
        }
        
        .article em {
            font-style: italic;
            color: var(--color-text-secondary);
        }
        
        .article blockquote {
            border-left: var(--border-width-thick) solid var(--color-brand-violet);
            padding-left: var(--spacing-lg);
            margin: var(--spacing-xl) 0;
            font-style: italic;
            color: var(--color-text-secondary);
        }
        
        .footer {
            background: var(--color-bg-secondary);
            border-top: var(--border-width-thin) solid var(--color-neutral-200);
            padding: var(--spacing-xl) var(--spacing-2xl);
            margin-top: var(--spacing-3xl);
            text-align: center;
        }
        
        .footer-text {
            font-size: var(--font-size-small);
            color: var(--color-text-muted);
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <h1>${escapeHtml(title)}</h1>
            <div class="header-meta">By ${escapeHtml(author)} • ${new Date().toLocaleDateString()}</div>
        </div>
    </header>
    
    <main class="content">
        <article class="article">
            ${htmlContent}
        </article>
    </main>
    
    <footer class="footer">
        <p class="footer-text">Generated by Signal Forge</p>
    </footer>
</body>
</html>`;
}

function generatePaperHTML(title: string, htmlContent: string, author: string): string {
  const tokens = getDesignTokens();
  const config = loadConfig();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    
    <!-- Adobe Fonts: Default Project (includes Rival Sans, Komet, Darkmode-Off, Apparat, Elza, Articulat) -->
    <link rel="stylesheet" href="${config.fonts.secondary}">
    
    <!-- Adobe Fonts: Rival Sans Project (backup/alternative) -->
    <link rel="stylesheet" href="${config.fonts.primary}">
    
    <!-- Preconnect for faster font loading -->
    <link rel="preconnect" href="https://use.typekit.net" crossorigin>
    
    <style>
        ${generateCSSVariables()}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-family-primary);
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            background: var(--color-bg-primary);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .header {
            background: linear-gradient(135deg, var(--color-brand-violet) 0%, var(--color-brand-navy) 100%);
            color: var(--color-text-inverse);
            padding: var(--spacing-3xl) var(--spacing-2xl);
            margin-bottom: var(--spacing-3xl);
        }
        
        .header-content {
            max-width: 1100px;
            margin: 0 auto;
        }
        
        .header h1 {
            font-size: var(--font-size-display);
            font-weight: var(--font-weight-extrabold);
            margin-bottom: var(--spacing-md);
        }
        
        .header-meta {
            font-size: var(--font-size-h3);
            opacity: 0.9;
        }
        
        .content {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 var(--spacing-2xl) var(--spacing-3xl);
        }
        
        .article {
            background: var(--color-bg-primary);
            border-radius: var(--radius-xl);
            padding: var(--spacing-3xl);
            box-shadow: var(--shadow-xl);
        }
        
        .article h1 {
            font-size: var(--font-size-h1);
            font-weight: var(--font-weight-bold);
            color: var(--color-brand-violet);
            margin-bottom: var(--spacing-xl);
        }
        
        .article h2 {
            font-size: var(--font-size-h2);
            font-weight: var(--font-weight-bold);
            color: var(--color-text-primary);
            margin-top: var(--spacing-2xl);
            margin-bottom: var(--spacing-lg);
            padding-bottom: var(--spacing-sm);
            border-bottom: var(--border-width-medium) solid var(--color-brand-violet);
        }
        
        .article h3 {
            font-size: var(--font-size-h3);
            font-weight: var(--font-weight-semibold);
            color: var(--color-text-secondary);
            margin-top: var(--spacing-xl);
            margin-bottom: var(--spacing-md);
        }
        
        .article p {
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            margin-bottom: var(--spacing-lg);
        }
        
        .article ul, .article ol {
            margin: var(--spacing-lg) 0;
            padding-left: var(--spacing-xl);
        }
        
        .article li {
            font-size: var(--font-size-body);
            line-height: var(--line-height-relaxed);
            color: var(--color-text-body);
            margin-bottom: var(--spacing-sm);
        }
        
        .article strong {
            color: var(--color-text-primary);
            font-weight: var(--font-weight-semibold);
        }
        
        .article em {
            font-style: italic;
            color: var(--color-text-secondary);
        }
        
        .article blockquote {
            border-left: var(--border-width-thick) solid var(--color-brand-violet);
            padding-left: var(--spacing-lg);
            margin: var(--spacing-xl) 0;
            font-style: italic;
            color: var(--color-text-secondary);
            font-size: var(--font-size-h3);
        }
        
        .article code {
            background: var(--color-bg-secondary);
            padding: 0.125rem 0.375rem;
            border-radius: var(--radius-sm);
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.875em;
            color: var(--color-brand-violet);
        }
        
        .article pre {
            background: var(--color-bg-dark);
            color: var(--color-text-inverse);
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            overflow-x: auto;
            margin: var(--spacing-xl) 0;
        }
        
        .article pre code {
            background: transparent;
            color: inherit;
            padding: 0;
        }
        
        .footer {
            background: var(--color-bg-secondary);
            border-top: var(--border-width-thin) solid var(--color-neutral-200);
            padding: var(--spacing-xl) var(--spacing-2xl);
            margin-top: var(--spacing-3xl);
            text-align: center;
        }
        
        .footer-text {
            font-size: var(--font-size-small);
            color: var(--color-text-muted);
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <h1>${escapeHtml(title)}</h1>
            <div class="header-meta">By ${escapeHtml(author)} • ${new Date().toLocaleDateString()}</div>
        </div>
    </header>
    
    <main class="content">
        <article class="article">
            ${htmlContent}
        </article>
    </main>
    
    <footer class="footer">
        <p class="footer-text">Generated by Signal Forge</p>
    </footer>
</body>
</html>`;
}

function generateDocumentationHTML(title: string, htmlContent: string, author: string, docType: 'guide' | 'reference' | 'tutorial'): string {
  const docTypeLabels = {
    guide: 'User Guide',
    reference: 'Reference',
    tutorial: 'Tutorial',
  };
  const docTypeLabel = docTypeLabels[docType];

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>

    <style>
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #141414;
            --bg-tertiary: #1a1a1a;
            --text-primary: #f5f5f5;
            --text-secondary: #a0a0a0;
            --accent: #3b82f6;
            --accent-hover: #60a5fa;
            --border: #2a2a2a;
            --success: #22c55e;
            --warning: #eab308;
            --code-bg: #1e1e1e;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 24px;
        }

        header {
            border-bottom: 1px solid var(--border);
            padding: 24px 0;
        }

        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .doc-type {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--accent);
            margin-bottom: 8px;
        }

        .title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .version {
            font-size: 0.875rem;
            color: var(--text-secondary);
            background: var(--bg-tertiary);
            padding: 4px 12px;
            border-radius: 4px;
        }

        main {
            padding: 48px 0;
        }

        .content {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 32px;
        }

        .content h1 {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid var(--accent);
        }

        .content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-top: 32px;
            margin-bottom: 16px;
        }

        .content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-top: 24px;
            margin-bottom: 12px;
        }

        .content p {
            color: var(--text-secondary);
            margin-bottom: 16px;
        }

        .content ul, .content ol {
            margin: 16px 0;
            padding-left: 24px;
        }

        .content li {
            color: var(--text-secondary);
            margin-bottom: 8px;
        }

        .content strong {
            color: var(--text-primary);
            font-weight: 600;
        }

        .content code {
            background: var(--code-bg);
            color: var(--accent);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Fira Code', 'Monaco', monospace;
            font-size: 0.875em;
        }

        .content pre {
            background: var(--code-bg);
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
        }

        .content pre code {
            background: transparent;
            padding: 0;
            color: var(--text-primary);
        }

        .content table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 0.9375rem;
        }

        .content th {
            text-align: left;
            padding: 12px 16px;
            background: var(--bg-tertiary);
            border-bottom: 1px solid var(--border);
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
        }

        .content td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            color: var(--text-secondary);
        }

        .content tr:hover td {
            background: var(--bg-tertiary);
        }

        .content blockquote {
            border-left: 4px solid var(--accent);
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
            color: var(--text-secondary);
        }

        footer {
            padding: 32px 0;
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.875rem;
            border-top: 1px solid var(--border);
        }

        @media (max-width: 768px) {
            .content {
                padding: 24px 16px;
            }

            .content h1 {
                font-size: 1.75rem;
            }

            .content h2 {
                font-size: 1.25rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container header-content">
            <div>
                <div class="doc-type">${escapeHtml(docTypeLabel)}</div>
                <h1 class="title">${escapeHtml(title)}</h1>
            </div>
            <span class="version">v1.0.0</span>
        </div>
    </header>

    <main class="container">
        <div class="content">
            ${htmlContent}
        </div>
    </main>

    <footer>
        <div class="container">
            <p>Generated by Signal Forge</p>
        </div>
    </footer>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
