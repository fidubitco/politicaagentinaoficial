# Design Guidelines: POLÍTICA ARGENTINA - World-Class Editorial Intelligence Portal

## Design Approach: Premium Digital Journalism

**Selected Approach**: Elite Editorial Design System - Synthesizing visual excellence from NYT (serif typography, editorial hierarchy), Bloomberg (data visualization), Financial Times (sophisticated restraint), La Nación + Clarín (Argentine journalistic authority).

**Design Philosophy**: "Authoritative Clarity" - Deliver political intelligence through impeccable editorial design that commands instant credibility and professional trust.

---

## Color Palette

### Light Mode (Editorial Precision)
- **Background Base**: 0 0% 100% (Pure white, FT-inspired)
- **Surface Elevated**: 0 0% 98% (Subtle off-white for cards)
- **Text Primary**: 0 0% 10% (Deep black, maximum readability)
- **Text Secondary**: 0 0% 45% (Mid-gray for metadata)
- **Border Subtle**: 0 0% 90% (Light dividers)

### Dark Mode (Professional Night)
- **Background Base**: 220 20% 8% (Rich charcoal-navy)
- **Surface Elevated**: 220 15% 12% (Elevated panels)
- **Text Primary**: 0 0% 95% (Crisp white)
- **Text Secondary**: 0 0% 65% (Muted gray)
- **Border Subtle**: 220 10% 20% (Dark dividers)

### Editorial Accents
- **Primary Crimson**: 355 70% 48% (Breaking news, CTAs, editorial emphasis)
- **Data Teal**: 185 60% 45% (Charts, financial metrics)
- **Alert Amber**: 30 95% 55% (Urgent updates, live indicators)
- **Success Sage**: 145 40% 50% (Positive metrics)
- **Navy Deep**: 220 50% 25% (Section headers, trust signals)

---

## Typography

### Font System
- **Headlines/Display**: Playfair Display (700/600) - Editorial authority
- **UI/Body Sans**: Inter (400/500/600) - Modern clarity
- **Data/Mono**: JetBrains Mono - Financial precision

### Scale (Editorial Hierarchy)
- **Hero Display**: 56px/64px, Playfair Display 700 (desktop) / 36px/44px (mobile)
- **Main Headlines**: 40px/48px, Playfair Display 700
- **Section Headers**: 32px/40px, Playfair Display 600
- **Article Titles**: 24px/32px, Playfair Display 600
- **Subheads**: 20px/28px, Inter 600
- **Body Text**: 18px/30px, Inter 400 (articles) / 16px/24px (UI)
- **Metadata**: 14px/20px, Inter 500
- **Captions**: 13px/18px, Inter 400

---

## Layout System

### Asymmetric Grid Architecture
- **Homepage Hero**: 8-column main + 4-column sidebar (desktop), full-width (mobile)
- **Main Content**: 65% primary column + 35% trending/live sidebar
- **Article Layout**: 700px main text + 350px info/related rail
- **Section Grids**: 3-column cards (desktop) → 2-column (tablet) → 1-column (mobile)
- **Breaking Banner**: Full-width sticky top bar (40px height)

### Spacing System (Generous Editorial)
- **Core Units**: 4px base, multiply by 2/4/6/8/12/16/20/24
- **Section Gaps**: 96px (desktop), 64px (tablet), 48px (mobile)
- **Card Padding**: 32px (desktop), 24px (mobile)
- **Container Max**: 1440px with 64px horizontal padding
- **Reading Width**: 700px max for article bodies

### Responsive Breakpoints
- Mobile: 640px / Tablet: 1024px / Desktop: 1280px / XL: 1440px

---

## Component Library

### Navigation & Header
- **Sticky Masthead**: 72px height, white/dark background, subtle bottom border
- **Logo**: Left-aligned, 180px width, Playfair Display wordmark
- **Primary Nav**: Horizontal menu (Análisis, Economía, Internacional, Política), Inter 600, 16px
- **Breaking Ticker**: Crimson banner above masthead, auto-scroll, white text, 36px height
- **Search**: Prominent icon (top-right), expandable overlay with autocomplete
- **Dark Mode Toggle**: Icon button, smooth transition, remembers preference

### Hero Section (Immersive Lead)
- **Featured Story**: Full-width image (16:9, 1400x788px), gradient overlay (bottom 40%, black to transparent)
- **Headline Overlay**: Bottom-left positioned, Playfair Display 56px, white text, max-width 800px
- **Deck Text**: 20px Inter, white, 70% opacity, 2-line max
- **Metadata Bar**: Author photo (32px circle), name, timestamp, category badge
- **Secondary Grid**: 3 smaller stories below (image 3:2, headline 24px, excerpt 2-lines)
- **CTA Buttons**: On hero have blurred background (backdrop-blur-md bg-white/10), white text

### Article Cards (Elevated Editorial)
- **Standard Card**: White/dark elevated surface, 4px rounded corners, subtle shadow
- **Image Treatment**: 16:9 aspect, sharp corners top, lazy-loaded, optimized WebP
- **Category Badge**: Top-left absolute, crimson/teal pill, 12px Inter 600, uppercase
- **Headline**: Playfair Display 24px, 2-line clamp, hover crimson underline
- **Excerpt**: Inter 16px, muted color, 3-line clamp
- **Metadata Row**: Author + date + read-time, 14px, icon + text pattern
- **Hover State**: Lift 4px, shadow intensity increase, 0.3s smooth transition

### Sidebar Components (Live Intelligence)
- **Trending Topics**: Numbered list (1-10), bold numbers, headline links, update timestamp
- **Live Updates Feed**: Pulsing red indicator, timestamp, headline, auto-refresh every 60s
- **Poll Widget**: Question + options with percentage bars, teal accent, vote button
- **Newsletter Signup**: Headline + email input + CTA, white/dark card, icon decoration
- **Ad Placement**: Clearly labeled "Publicidad", 300x250px, bordered container

### Data Visualization (Bloomberg-Grade)
- **Chart Cards**: Elevated panel, 24px padding, teal accent top-border
- **Line/Bar Charts**: Minimal axes, data labels on hover, responsive scaling
- **Metrics Display**: 48px number (JetBrains Mono), label below, trend arrow (green/red)
- **Electoral Maps**: Choropleth with party colors, hover tooltips, province boundaries
- **Tables**: Striped rows (subtle bg), right-aligned numbers, sticky headers on scroll

---

## Images & Media

### Editorial Photography
- **Hero Images**: 1400x788px minimum, journalistic style, high emotional impact, human-focused when possible
- **Card Images**: 800x450px (16:9) or 600x400px (3:2), sharp focus, professional composition
- **Author Photos**: 80px circles (article headers), 32px (metadata), grayscale filter option
- **Infographic Assets**: Vector SVGs for data stories, accessible color palettes
- **Image Captions**: Below image, italic Inter 13px, photographer credit right-aligned

### Placement Strategy
- **Homepage Hero**: 1 large immersive image (political event, congressional scene, street protest)
- **Section Heroes**: Smaller 800px width images per category
- **Article Lead**: Full-width hero image with gradient overlay
- **Inline Article Images**: 700px width max, centered, generous margin
- **Sidebar**: Small thumbnails (120x80px) for trending stories

### Technical Specs
- **Format**: WebP with JPEG fallback, progressive loading
- **Lazy Loading**: Below-fold images, intersection observer
- **Alt Text**: Descriptive for SEO, screen reader optimized
- **Responsive**: 3 sizes (mobile/tablet/desktop), srcset implementation

---

## Animations & Interactions

### Micro-Interactions (Refined)
- **Scroll Reveals**: Fade-up 16px, 0.4s ease-out, stagger 100ms for card grids
- **Hover States**: Color shift 0.2s, elevation change 0.3s, scale 1.02 for cards
- **Loading States**: Skeleton screens (shimmer effect), progress bars for data fetch
- **Sticky Elements**: Smooth lock on scroll, shadow appearance on stick
- **Dark Mode Switch**: 0.3s cross-fade, smooth color transitions

### Performance Rules
- **60 FPS Target**: GPU-accelerated transforms only, avoid layout thrashing
- **Reduced Motion**: Disable animations for prefers-reduced-motion users
- **Progressive Enhancement**: Core functionality works without JavaScript

---

## Accessibility & Dark Mode

### WCAG AAA Standards
- **Contrast Ratios**: 7:1 body text, 4.5:1 minimum all elements
- **Focus States**: 3px crimson outline, never removed, high visibility
- **Keyboard Nav**: Tab order logical, skip links present, all interactive elements reachable
- **Screen Readers**: Semantic HTML5, ARIA landmarks, live regions for breaking news

### Dark Mode Excellence
- **Automatic Detection**: System preference, localStorage override
- **Toggle Placement**: Header right side, moon/sun icon, instant switch
- **Consistent Hierarchy**: Same visual weight both modes, adjusted contrast only
- **Image Handling**: 10% opacity overlay on images in dark mode for integration

---

## Key Differentiators

1. **Asymmetric Editorial Grid**: NYT-inspired hierarchy with modern digital flexibility
2. **Immersive Hero Imagery**: Full-width emotional storytelling, gradient overlays
3. **Live Intelligence Sidebar**: Real-time updates, trending topics, interactive polls
4. **Data Visualization Integration**: Bloomberg-quality charts as first-class content
5. **Dual Typography System**: Serif authority (headlines) + sans clarity (UI/body)
6. **Elevated Card Design**: Subtle shadows, hover animations, professional polish
7. **Extreme Performance**: Lazy loading, WebP images, code splitting, edge caching for SEO

This system establishes POLÍTICA ARGENTINA as Argentina's most visually sophisticated and technically advanced political news platform, matching international editorial standards while delivering cutting-edge digital journalism.