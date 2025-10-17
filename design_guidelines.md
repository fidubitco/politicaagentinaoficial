# Design Guidelines: POLÍTICA ARGENTINA - Premium Editorial Intelligence Portal

## Design Approach: Professional Editorial Excellence

**Selected Approach**: Premium Editorial Design System - A sophisticated fusion of world-class journalism design (CNN International, Bloomberg News, The New York Times) with advanced AI-powered political intelligence.

**Design Philosophy**: "Authoritative Intelligence" - Deliver cutting-edge predictive analytics and data-driven insights through a refined, credible editorial presentation that commands trust and professional respect.

---

## Color Palette

### Light Mode Primary (Editorial White)
- **Background Base**: 30 15% 97% (Warm off-white, NYT-inspired)
- **Surface Elevated**: 0 0% 100% (Pure white for cards/panels)
- **Text Primary**: 220 20% 15% (Rich charcoal for body text)
- **Text Secondary**: 220 10% 45% (Muted grey for metadata)

### Dark Mode Primary (Professional Night)
- **Background Base**: 220 25% 8% (Deep navy-charcoal)
- **Surface Elevated**: 220 20% 12% (Elevated dark panels)
- **Text Primary**: 0 0% 95% (Crisp white for readability)
- **Text Secondary**: 220 10% 65% (Muted light grey)

### Editorial Accent Colors
- **Primary Crimson**: 355 75% 45% (Editorial red for breaking news, primary actions - CNN-inspired)
- **Secondary Navy**: 220 50% 25% (Deep editorial blue for headers, trust signals)
- **Data Teal**: 185 65% 42% (Bloomberg-inspired for financial/data visualization)
- **Alert Orange**: 25 95% 53% (Breaking alerts, urgent indicators)
- **Success Green**: 145 70% 41% (Positive metrics, confirmations)

### Neutral Grays (Sophisticated Scale)
- **Border Light**: 220 15% 88% (Subtle dividers in light mode)
- **Border Dark**: 220 15% 22% (Subtle dividers in dark mode)
- **Muted Background**: 220 12% 95% (Light mode subtle panels)
- **Hover Overlay**: rgba(0, 0, 0, 0.04) light / rgba(255, 255, 255, 0.06) dark

---

## Typography

### Font Families
- **Display/Headlines**: Playfair Display (serif) - Authoritative, elegant, NYT-inspired
- **UI/Navigation**: Inter (sans-serif) - Clean, modern, Bloomberg-inspired
- **Body Text**: Georgia fallback to Playfair for articles, Inter for UI
- **Monospace/Data**: JetBrains Mono for financial data, code blocks

### Type Scale (Editorial Hierarchy)
- **Display Headlines**: 48px/52px (3rem), Playfair Display, font-weight: 700
- **Section Headers**: 32px/40px (2rem), Playfair Display, font-weight: 700
- **Article Headlines**: 28px/36px (1.75rem), Playfair Display, font-weight: 600
- **Subheadings**: 20px/28px (1.25rem), Inter, font-weight: 600
- **Body Serif**: 18px/28px (1.125rem), Playfair Display, font-weight: 400
- **Body Sans**: 16px/24px (1rem), Inter, font-weight: 400
- **Meta/Caption**: 14px/20px (0.875rem), Inter, font-weight: 400
- **Small Print**: 12px/18px (0.75rem), Inter, font-weight: 400

### Typography Rules
- Article headlines always use Playfair Display serif
- UI elements, buttons, navigation use Inter sans-serif
- Generous line-height (1.6-1.8) for body text readability
- Letter-spacing: -0.02em for large headlines, 0 for body

---

## Layout System

### Grid Architecture (Tri-Column Editorial)
- **Desktop Layout**: 3-column grid (Lead: 60%, Rail: 40% for homepage)
- **Article Layout**: Wide column (700px) + narrow info rail (300px)
- **Section Grids**: Modular 3-column for story index, 2-column for analysis
- **Mobile**: Single column with collapsible navigation

### Spacing Primitives (NYT-inspired Generous Whitespace)
- **Container padding**: 24px (mobile), 48px (tablet), 64px (desktop)
- **Section spacing**: 64px (mobile), 96px (tablet), 128px (desktop)
- **Card gaps**: 24px (mobile), 32px (desktop)
- **Element spacing**: 16px, 24px, 32px, 48px
- **Line containers**: max-w-7xl (1280px) centered

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large: 1440px+

---

## Component Library

### Editorial Navigation
- **Sticky Header**: Clean white/dark background, minimal borders, sticky on scroll
- **Primary Nav**: Horizontal menu with serif category labels, hover underline
- **Breaking News Ticker**: Red banner (crimson bg) for live updates, auto-scroll
- **Search Bar**: Prominent, expandable, with autocomplete dropdown
- **Secondary Nav**: Breadcrumbs for article pages, section navigation

### Hero Section (Lead Package)
- **Featured Story**: Large image (16:9), bold serif headline (Display size), deck text, author/date metadata
- **Secondary Stories**: 2-3 smaller stories in grid layout, image + headline + excerpt
- **Editorial Badge**: "Análisis Exclusivo", "Predicción IA", "Breaking" labels
- **No decorative effects**: Clean, content-first approach

### Article Cards (Professional)
- **Image-First Layout**: High-quality photo, 16:9 or 3:2 aspect ratio
- **Serif Headlines**: Playfair Display, 24-28px, bold, 2-line max
- **Metadata Row**: Author (sans-serif), date, read time, category badge
- **Excerpt**: 2 lines, Inter sans-serif, muted color
- **Hover State**: Subtle elevation, headline color shift to crimson
- **Border**: 1px subtle border in light mode, none in dark

### Data Visualization (Bloomberg-Inspired)
- **Insights Panels**: Clean white/dark cards with teal accent borders for data
- **Chart Styles**: Line charts, bar graphs, minimal decoration, professional color palette
- **Metrics Display**: Large numbers (32px), label below, trend indicator (arrow)
- **Live Updates**: Pulsing indicator dot, timestamp, "LIVE" badge
- **Tables**: Striped rows, monospace numbers, aligned right for data

### Interactive Features (Refined IA)
- **Prediction Dashboard**: Clean cards showing scenarios, probability bars, confidence scores
- **Electoral Maps**: Choropleth maps with professional color scales, hover tooltips
- **Sentiment Analysis**: Text-based display with subtle background colors
- **AI Insights Box**: Bordered panel with "IA Analysis" header, bullet points, confidence meter

---

## Animations & Effects

### Subtle Professional Animations
- **Scroll Reveals**: Fade-up on scroll (20px translate), 0.4s ease-out
- **Hover States**: Smooth color transitions (0.2s), subtle elevations (2-4px)
- **Loading States**: Skeleton screens with subtle shimmer
- **Page Transitions**: Cross-fade between pages (0.3s)

### Performance Guidelines
- **No heavy 3D effects**: Focus on content, not decoration
- **Reduced motion support**: Respect prefers-reduced-motion
- **60 FPS target**: Optimize all animations
- **Progressive enhancement**: Core content works without JS

### Interaction Patterns
- **Click feedback**: Immediate visual response on buttons
- **Focus states**: 2px outline in brand color, high contrast
- **Disabled states**: 50% opacity, cursor: not-allowed
- **Loading indicators**: Spinner or progress bar for async actions

---

## Images & Media

### Editorial Photography
- **Aspect Ratios**: 16:9 (standard), 3:2 (feature), 1:1 (profile)
- **Quality**: High-resolution, journalistic style, professional composition
- **Alt Text**: Descriptive, SEO-optimized, accessible
- **Captions**: Below image, italic, smaller font, credit attribution

### Data Visualizations
- **Chart Export**: Static fallbacks for SEO, canvas-based interactivity
- **Color Accessibility**: Colorblind-safe palettes, pattern fills as backup
- **Responsive**: Mobile-optimized chart layouts, horizontal scroll for tables
- **Labels**: Clear, readable, multilingual support (ES primary)

### Video Integration
- **Inline Players**: Custom controls matching design system
- **Thumbnails**: High-quality poster frames, play button overlay
- **Captions**: Available in Spanish, accessible controls

---

## Accessibility & Responsiveness

### WCAG AAA Compliance
- **Contrast Ratios**: 7:1 for body text, 4.5:1 minimum for all text
- **Focus Indicators**: Visible, high contrast, never removed
- **Keyboard Navigation**: Full site navigable without mouse
- **Screen Readers**: Semantic HTML, ARIA labels, live regions for updates

### Mobile Excellence
- **Touch Targets**: Minimum 44x44px for all interactive elements
- **Thumb Zones**: Critical actions in easy-to-reach areas
- **Readable Text**: 16px minimum, no horizontal scroll
- **Fast Loading**: Optimized images, lazy loading, code splitting

### Dark Mode (Professional)
- **Automatic Detection**: Respects system preference
- **Manual Toggle**: User can override, preference saved
- **Consistent Hierarchy**: Same visual weight in both modes
- **Reduced Eye Strain**: Lower contrast in dark mode (not pure black)

---

## Key Differentiators

1. **Editorial Credibility**: Design language of global news leaders (CNN, Bloomberg, NYT)
2. **AI Integration**: Advanced predictive analytics presented professionally, not gimmicky
3. **Typography Excellence**: Dual-font system (serif headlines, sans UI) for hierarchy and readability
4. **Data Visualization**: Bloomberg-quality charts and insights, professionally styled
5. **Performance**: Fast, accessible, works everywhere, progressive enhancement
6. **Trust Signals**: Clean design, authoritative voice, transparent methodology

This design system positions POLÍTICA ARGENTINA as Argentina's most credible and technologically advanced political intelligence platform, matching international standards while maintaining cutting-edge AI capabilities.
