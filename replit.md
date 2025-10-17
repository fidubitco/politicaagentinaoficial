# Política Argentina - Premium Editorial Intelligence Portal

## Overview

Política Argentina is a premium political news and analysis portal built with cutting-edge web technologies. The platform delivers AI-powered predictive analytics, real-time political data visualization, and professional editorial coverage of Argentine politics. The application combines sophisticated design inspired by world-class journalism outlets (NYT, Bloomberg, CNN) with advanced features including electoral predictions, sentiment analysis, and interactive data dashboards.

**Core Purpose**: Provide authoritative political intelligence through AI-driven analysis, targeting 500K+ monthly visits with comprehensive coverage of national, provincial, and international political developments.

**Tech Stack**: React + TypeScript frontend, Express.js backend, PostgreSQL database via Drizzle ORM, shadcn/ui component library, Tailwind CSS for styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### October 2025 - Hyperrealistic Contextual Images System (Latest)

**Pexels API Integration for Professional Photography**:
- Implemented intelligent ImageSearchService analyzing article title + category for precise keyword generation
- Category-to-keyword mapping covers all production categories (Política Nacional, Economía, Internacional, Justicia, Provincias, Casa Rosada, etc.)
- Automatic photographer attribution: metadata persisted in article.metadata JSON field ({ photographer, photographerUrl })
- LazyImage component enhanced with blur-up LQIP placeholders, smooth zoom hover effects, photographer credits overlay
- Fallback system ensures images always load even when Pexels API fails (category-specific Unsplash fallbacks)

**API & Error Handling**:
- POST /api/images/search endpoint for on-demand contextual image search with robust error handling
- Returns structured responses with fallback reasons: 'missing_api_key', 'no_results', 'search_error'
- Enhanced logging with emoji indicators (⚠️ ℹ️ ❌ 🔄) for better debugging visibility

**Design & Performance Optimizations**:
- Home page redesign: masonry grid layout, parallax hero with gradient overlays, professional micro-animations
- ArticlePage optimized with featured images, responsive layouts, photographer attribution on hover
- CSS animations in index.css provide smooth, subtle interaction feedback
- WebP/AVIF support with progressive loading for optimal performance

**Important Notes**:
- Only NEW articles generated after this update include Pexels images with photographer metadata
- Existing articles with Clarín/scraped images won't show photographer credits (expected behavior)
- PEXELS_API_KEY required in Replit Secrets for contextual image search
- Metadata structure: article.metadata = { photographer: "John Doe", photographerUrl: "https://..." }

### October 2025 - Enhanced Navigation & Dashboard

**Navigation System Upgrade**:
- Implemented bidirectional navigation between admin panel and public website
- Admin header includes "Ver Sitio Público" button to preview the live site
- Public navbar includes "Admin" button for quick access to management panel
- Both desktop and mobile navigation fully functional with proper asChild patterns

**Dynamic Category Navigation**:
- Navbar now dynamically loads featured categories from database (top 6 by priority)
- Category links route to dedicated CategoryPage at `/categoria/:slug`
- CategoryPage displays filtered articles by category with custom header styling
- Loading states with skeleton UI prevent flash of 404 errors
- TanStack Query cache ensures instant navigation after first load

**Enhanced Admin Dashboard**:
- 6 comprehensive metrics cards: Total Artículos, Vistas Totales, Publicados Hoy, Categorías Activas, Fuentes Activas, Credibilidad Promedio
- Top 5 categories ranked by article count with total views
- Top 5 most viewed articles with engagement metrics
- Quick Actions section with Card-based navigation to key admin functions
- All metrics calculate dynamically from actual article and category data

**Technical Improvements**:
- All navigation buttons use Button asChild pattern (no nested interactive elements)
- Comprehensive data-testid attributes on all interactive elements
- Mobile-first responsive design with collapsible navigation
- Color-coded category badges using database color values
- Professional hover and active states using custom elevation utilities

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript in SPA (Single Page Application) mode using Vite as the build tool and development server.

**Routing**: Wouter-based client-side routing with a simple route structure (currently home page and 404 fallback).

**State Management**: TanStack React Query (v5) for server state management, with infinite stale time and disabled refetching to optimize performance. Local component state managed with React hooks.

**UI Component System**: shadcn/ui component library (New York style variant) providing 40+ pre-built, accessible components built on Radix UI primitives. Components use Tailwind CSS with custom design tokens following editorial design principles.

**Design System**: 
- **Color Palette**: Light mode uses warm off-white backgrounds (30 15% 97%) with rich charcoal text. Dark mode features deep navy-charcoal (220 25% 8%). Editorial crimson accent (355 75% 45%) for primary actions.
- **Typography**: Playfair Display (serif) for headlines/display text, Inter (sans-serif) for UI/body, JetBrains Mono for data/code.
- **Spacing & Interaction**: Custom hover/active elevation states using CSS variables (`--elevate-1`, `--elevate-2`) for professional depth effects.

**Key Pages/Components**:
- Home page with hero section, live metrics ticker, category sections, insights panels
- Reusable editorial components: ArticleCard, DataVisualizationCard, InsightsPanel, LiveMetricsTicker
- Responsive navbar with search and mobile menu
- Editorial footer with social links and site taxonomy

### Backend Architecture

**Server Framework**: Express.js with TypeScript, serving both API routes and static files in production.

**Development Setup**: Vite middleware integration for HMR (Hot Module Replacement) during development. Custom error overlay and dev tools for Replit environment.

**API Structure**: RESTful API design with `/api` prefix for all endpoints. Centralized route registration in `server/routes.ts`. Custom request logging middleware tracking method, path, status, duration, and response JSON.

**Session Management**: Infrastructure for connect-pg-simple session store (PostgreSQL-backed sessions), though authentication is not yet fully implemented.

**Storage Layer**: Abstracted storage interface (`IStorage`) with in-memory implementation (`MemStorage`) for user CRUD operations. Designed to be swappable with database-backed implementations.

### Data Architecture

**ORM**: Drizzle ORM for type-safe database operations with PostgreSQL dialect.

**Database Provider**: Neon serverless PostgreSQL configured via `@neondatabase/serverless` driver.

**Schema Definition**: 
- Users table with UUID primary keys, username/password fields
- Zod integration via drizzle-zod for runtime validation
- Migration system using `drizzle-kit` with migrations output to `/migrations` directory

**Validation**: Zod schemas generated from Drizzle tables for insert operations, ensuring type safety across the full stack.

**Current State**: Minimal schema (users only) suggesting the application is in early development stages. Database may be provisioned but schema needs expansion for political content (articles, predictions, analytics, etc.).

### Build & Deployment

**Development**: `npm run dev` runs tsx server with Vite middleware for full-stack hot reloading.

**Production Build**: 
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` as ESM module
- Deployment: `npm start` runs compiled Node.js server

**Environment**: Node.js with ES modules (`"type": "module"`), TypeScript with strict mode, path aliases for clean imports (`@/` for client, `@shared/` for shared code).

## External Dependencies

### Core Dependencies

**Frontend Framework**: React 18.3.1 with react-dom for rendering

**Build Tools**: 
- Vite 5.x for development server and production builds
- esbuild for server-side bundling
- tsx for TypeScript execution in development

**UI & Styling**:
- Tailwind CSS 3.x with PostCSS and Autoprefixer
- shadcn/ui components (40+ Radix UI-based components)
- Radix UI primitives for accessible, unstyled components
- class-variance-authority and clsx for dynamic className composition

**Data & Forms**:
- TanStack React Query v5 for server state
- React Hook Form with @hookform/resolvers for form validation
- Zod for schema validation
- date-fns for date manipulation

**Database & ORM**:
- Drizzle ORM 0.39.x with drizzle-zod integration
- @neondatabase/serverless for PostgreSQL connection
- drizzle-kit for migrations and schema management
- connect-pg-simple for PostgreSQL session storage

**Routing & Navigation**: wouter for lightweight client-side routing

**Additional UI Libraries**:
- cmdk for command palette
- embla-carousel-react for carousels
- vaul for drawers
- input-otp for OTP inputs
- recharts for data visualization

### Development Dependencies

**TypeScript**: TypeScript 5.x with strict type checking

**Replit Integration**:
- @replit/vite-plugin-runtime-error-modal for error handling
- @replit/vite-plugin-cartographer for code mapping
- @replit/vite-plugin-dev-banner for development UI

**Environment**: Node.js types, Vite client types for full TypeScript coverage

### SEO & Marketing Strategy (Documentation-Based)

**Optimization Targets**:
- Voice search optimization with speakable schema markup
- AI search optimization (Google SGE, Bing Copilot) with structured data
- Mobile-first with Core Web Vitals targets (LCP <1s, FID <50ms, CLS 0)
- 80% keyword dominance in "política argentina" niche
- 500K+ organic visits/month goal

**Content Strategy**:
- Multi-platform social media (X, Instagram, TikTok, Facebook, LinkedIn)
- Email marketing with 10K subscriber target
- SEO-optimized content with 3000+ keyword targets
- Influencer collaborations and guest posts

**Technical SEO Infrastructure**:
- Hierarchical URL structure with silos
- Auto-generated XML sitemaps
- Schema.org markup (NewsArticle, DataSet, FAQPage, Speakable)
- Google News registration
- AMP pages for mobile