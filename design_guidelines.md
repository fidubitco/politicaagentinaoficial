# Design Guidelines: POLITICA ARGENTINA - Quantum Political Intelligence Portal

## Design Approach: Quantum Visionary Futurism

**Selected Approach**: Custom Quantum-Inspired Design System - A revolutionary fusion of cutting-edge web technology and political intelligence, transcending traditional news portals to create an immersive analytical experience.

**Design Philosophy**: "Política Cuántica" - Political reality exists in multiple states simultaneously, visualized through quantum-inspired interfaces where data, predictions, and analysis converge in a holographic information space.

---

## Color Palette

### Dark Mode Primary (Quantum Night)
- **Background Base**: 8 8% 4% (Deep space black with subtle blue undertone)
- **Surface Elevated**: 220 15% 8% (Midnight blue-grey for cards/panels)
- **Glassmorphism Overlay**: rgba(15, 25, 45, 0.7) with backdrop-blur-xl

### Quantum Accent Colors
- **Primary Quantum Blue**: 217 91% 60% (Electric azure for primary actions, neural connections)
- **Secondary Cyan**: 187 85% 55% (Holographic cyan for data streams)
- **Tertiary Purple**: 270 75% 60% (Quantum entanglement purple for predictions)
- **Alert Red**: 355 85% 58% (Political urgency indicators)
- **Success Green**: 142 76% 45% (Positive trends, confirmations)

### Data Visualization Spectrum
- **Neural Network Gradient**: From 217 91% 60% → 187 85% 55% → 270 75% 60%
- **Heat Map Scale**: 142 76% 45% (low) → 48 96% 58% (mid) → 355 85% 58% (high)
- **Particle Effects**: Multi-colored with 40% opacity, animated with mouse interaction

---

## Typography

### Font Families
- **Headlines/UI**: Inter (via Google Fonts) - Clean, modern, excellent for data displays
- **Body Text**: System font stack optimized for readability
- **Monospace/Data**: JetBrains Mono for code blocks, technical metrics

### Type Scale
- **Hero Headlines**: text-6xl md:text-7xl lg:text-8xl font-black tracking-tight
- **Section Headers**: text-4xl md:text-5xl font-bold tracking-tight
- **Card Titles**: text-2xl font-semibold
- **Body Text**: text-base leading-relaxed
- **Metadata/Captions**: text-sm text-neutral-400
- **Micro Copy**: text-xs uppercase tracking-wider font-medium

---

## Layout System

### Spacing Primitives
Primary units: **4, 8, 16, 24, 32, 48** (Tailwind scale)
- Container padding: px-4 md:px-8 lg:px-16
- Section spacing: py-16 md:py-24 lg:py-32
- Card gaps: gap-4 md:gap-6 lg:gap-8
- Element spacing: space-y-4, space-y-8, space-y-12

### Grid Systems
- **Homepage Hero**: Full viewport with 3D canvas background, centered content max-w-7xl
- **Dashboard**: 12-column grid with responsive breakpoints
- **Article Layout**: max-w-4xl centered prose with sidebar widgets
- **Data Visualizations**: Full-width containers with internal max-w-7xl

---

## Component Library

### Core Navigation
- **Quantum Navbar**: Glassmorphism header with backdrop-blur-xl, sticky top-0, contains logo, 5D navigation menu, search bar with voice input, user profile
- **Mega Menu**: Dropdown with 18 content silos displayed in 3-column grid, each with icon + title + description

### Hero Section (Homepage)
- **3D Quantum Canvas**: Full viewport Three.js background with rotating political globe, interactive particle system (120+ elements), neural network visualization
- **Centered Content**: Glassmorphism card with H1 "POLITICA ARGENTINA", tagline "Análisis Político Cuántico", dual CTAs (primary: "Explorar Predicciones" + outline: "Ver Dashboard")
- **Live Metrics Ticker**: Bottom overlay showing real-time political indicators

### Data Visualization Cards
- **Holographic Panels**: Frosted glass cards with border-l-4 accent colors, 3D CSS transforms on hover (translateZ, rotateY), containing:
  - Chart.js/Recharts visualizations
  - Real-time metrics with animated counters
  - Interactive sliders for scenario modeling
  - Blockchain verification badges

### Article Cards
- **Layout**: Grid of 3 columns (lg), 2 (md), 1 (sm)
- **Structure**: Image (16:9 aspect), category badge (top-left overlay), title, author + date metadata, excerpt (2 lines), read time + engagement metrics
- **Effects**: Hover lifts card (translateY -4px), glowing border animation

### Interactive Features
- **Neural Network Widget**: Canvas element showing 4-layer network with visible connections, color-coded activation patterns
- **3D Argentina Map**: Interactive provinces with hover tooltips, electoral data overlays, prediction heat maps
- **Quantum Scenario Modeler**: Tabs for multiple political scenarios, probability sliders, animated transitions between states
- **Audio Spectrum Analyzer**: 32-band visualization synced to political sentiment data

### Admin Dashboard Components
- **Tabbed Interface**: 6 primary sections (SEO, Analytics, GEO Metrics, Neural Network, Blockchain, AR Config)
- **Real-time Charts**: Line/area charts with live data streaming, comparative analysis overlays
- **AI Audit Reports**: Cards with traffic light indicators (red/yellow/green), expandable details, action buttons

---

## Animations & Effects

### GSAP ScrollTrigger
- Section reveals with stagger effects (0.1s delay per element)
- Parallax on background elements (0.5x scroll speed)
- Number counters animating on viewport entry
- 3D card rotations following scroll position

### Three.js/WebGL
- Quantum particle system with mouse repulsion/attraction
- Morphing geometric shapes (icosahedron → dodecahedron → octahedron)
- Custom GLSL shaders for quantum field effects
- Orbital camera controls with smooth damping

### Framer Motion
- Page transitions with fade + slide
- Modal animations with scale + opacity
- Loading states with skeleton shimmer
- Micro-interactions on buttons/inputs

### Performance Constraints
- Maximum 60 FPS target
- Reduced motion support via prefers-reduced-motion
- Lazy load heavy 3D elements below fold
- Progressive enhancement approach

---

## Images & Media

### Hero Image Strategy
**No traditional hero image** - Replaced with live 3D quantum visualization canvas providing dynamic, ever-changing backdrop.

### Article Images
- **Aspect Ratio**: 16:9 for cards, 21:9 for featured articles
- **Format**: AVIF primary, WebP fallback, optimized with Sharp
- **Loading**: Lazy load with blur-up placeholder (10px preview)
- **Overlays**: Gradient overlays (from transparent to rgba(0,0,0,0.7)) on card images for text readability

### Data Visualizations
- Export Chart.js as static images for SEO (with alt tags describing data)
- Infographics with descriptive alt text (e.g., "Gráfico predictivo electoral Argentina 2025 por provincia")
- Icon library: Heroicons for UI elements, custom SVG for political entities

### Multimedia Integration
- Video embeds with custom player UI matching design system
- Audio waveforms for podcast/speech analysis
- AR markers for camera-based overlays (future-ready)

---

## Accessibility & Responsiveness

### Mobile-First Approach
- Base styles for mobile (375px), progressive enhancement to 768px, 1024px, 1440px, 1920px
- Touch-friendly targets (min 44x44px)
- Simplified 3D effects on mobile (reduced particle count)
- Bottom navigation for mobile article reading

### Dark Mode Excellence
- Consistent dark theme across entire portal
- Form inputs: bg-neutral-800 with border-neutral-700
- Focus states: ring-2 ring-primary with ring-offset-2 ring-offset-neutral-900
- Sufficient contrast ratios (WCAG AAA where possible)

### Voice/Keyboard Navigation
- Skip links for main content
- Full keyboard navigation with visible focus indicators
- ARIA labels on interactive 3D elements
- Screen reader announcements for live data updates

---

## Key Differentiators

1. **Quantum Visualization Layer**: Unlike competitors' static designs, every element feels alive with quantum-inspired animations
2. **Holographic Information Architecture**: Multi-dimensional data presentation surpassing traditional 2D layouts
3. **AI-First Interface**: Neural network visualizations and predictive analytics front-and-center
4. **Performance Excellence**: Sub-80ms Core Web Vitals despite advanced effects
5. **Blockchain Transparency**: Visible cryptographic verification for trust signals

This design system positions POLITICA ARGENTINA as the world's most technologically advanced political analysis portal, far exceeding Argentine competitors like Clarín, La Nación, and Infobae in both visual sophistication and analytical depth.