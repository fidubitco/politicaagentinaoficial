# POLÍTICA ARGENTINA - Complete Setup Guide

## World-Class News Portal - Full Integration Complete

This is a professional, world-class political news portal with advanced features including:
- Real-time trending articles and topics
- Advanced search and filtering
- Comments system with moderation
- Newsletter subscriptions
- Social sharing integration
- SEO optimization (sitemaps, robots.txt, structured data)
- Analytics dashboard
- Multi-language support
- Responsive design with premium UI

---

## Quick Start

### 1. Prerequisites

- **Node.js 18+** (Download from nodejs.org)
- **PostgreSQL Database** (Recommended: Free tier from Neon.tech)
- **Package Manager**: npm (included with Node.js)

### 2. Database Setup

#### Option A: Neon.tech (Recommended - Free Tier)

1. Visit [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host:5432/dbname`)

#### Option B: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database: `createdb politica_argentina`
3. Use connection string: `postgresql://localhost:5432/politica_argentina`

### 3. Installation

```bash
# Navigate to the project directory
cd "/Users/usuario/POLITICA ARGENTINA/PoliticaArgentina"

# Install dependencies (already done)
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your DATABASE_URL
nano .env
# or use any text editor to edit .env
```

### 4. Database Migration

```bash
# Push the schema to your database
npm run db:push

# This will create all tables:
# - users, sources, categories, articles
# - translations, comments, bookmarks
# - notifications, newsletter_subscribers
# - tags, trending_topics, article_analytics
```

### 5. Seed Initial Data (Optional)

Create a seed script or manually add categories:

```bash
# Example: Add initial categories via PostgreSQL
psql $DATABASE_URL -c "
INSERT INTO categories (name, slug, description, color, priority, is_featured) VALUES
('Política Nacional', 'politica-nacional', 'Noticias de política argentina', '#E53935', 100, true),
('Economía', 'economia', 'Análisis económico y financiero', '#1E88E5', 90, true),
('Internacional', 'internacional', 'Noticias internacionales', '#43A047', 80, true),
('Justicia', 'justicia', 'Poder judicial y casos legales', '#8E24AA', 70, true),
('Sociedad', 'sociedad', 'Temas sociales y culturales', '#F4511E', 60, true);
"
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin
- **API**: http://localhost:5000/api

---

## Features Overview

### Public Portal Features

1. **Homepage**
   - Hero section with latest articles
   - Trending articles sidebar (auto-updates every minute)
   - Category-based article sections
   - Newsletter subscription widget
   - Responsive masonry layout

2. **Article Pages**
   - Full article view with featured images
   - Social sharing (Facebook, Twitter, LinkedIn, WhatsApp)
   - Comments section with moderation
   - Related articles recommendations
   - View counter
   - Author information

3. **Search & Filtering**
   - Full-text search across articles
   - Filter by category, author, date range
   - Advanced search API endpoint

4. **SEO Optimization**
   - Dynamic XML sitemaps (`/sitemap.xml`)
   - Google News sitemap (`/news-sitemap.xml`)
   - Robots.txt (`/robots.txt`)
   - Structured data (JSON-LD)
   - Meta tags for social sharing

### Admin Dashboard Features

1. **Articles Management**
   - Create, edit, delete articles
   - Rich text editor
   - Image upload and management
   - Publish/schedule articles
   - Draft system

2. **Categories & Sources**
   - Manage article categories
   - Color-coded categorization
   - Priority ordering
   - Featured categories

3. **Analytics Dashboard**
   - Total articles and views
   - Top performing articles
   - Category statistics
   - Publishing trends
   - Real-time metrics

4. **Comments Moderation**
   - Approve/reject comments
   - Spam filtering
   - User management

5. **Newsletter Management**
   - Subscriber list
   - Email preferences
   - Subscription analytics

### API Endpoints

All endpoints are documented and fully functional:

```
GET    /api/articles                    - List all published articles
GET    /api/articles/:slug              - Get article by slug
POST   /api/articles                    - Create new article
PATCH  /api/articles/:id                - Update article
DELETE /api/articles/:id                - Delete article

GET    /api/search                      - Search articles (supports filters)
GET    /api/trending                    - Get trending topics
GET    /api/trending/articles           - Get most viewed articles

GET    /api/categories                  - List categories
POST   /api/categories                  - Create category
PATCH  /api/categories/:id              - Update category
DELETE /api/categories/:id              - Delete category

GET    /api/articles/:articleId/comments - Get article comments
POST   /api/articles/:articleId/comments - Add comment
PATCH  /api/comments/:id/approve        - Approve comment
DELETE /api/comments/:id                - Delete comment

GET    /api/bookmarks                   - Get user bookmarks
POST   /api/bookmarks                   - Add bookmark
DELETE /api/bookmarks/:id               - Remove bookmark

GET    /api/notifications               - Get user notifications
POST   /api/notifications               - Create notification
PATCH  /api/notifications/:id/read     - Mark as read

POST   /api/newsletter/subscribe        - Subscribe to newsletter
DELETE /api/newsletter/unsubscribe/:email - Unsubscribe

GET    /api/tags                        - List all tags
POST   /api/tags                        - Create tag

GET    /api/analytics/overview          - Get analytics overview
GET    /api/analytics/top-articles      - Get top articles
GET    /api/analytics/top-categories    - Get top categories

GET    /sitemap.xml                     - Main sitemap
GET    /news-sitemap.xml                - Google News sitemap
GET    /robots.txt                      - Robots.txt file
```

---

## Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter

### Directory Structure

```
PoliticaArgentina/
├── client/                  # Frontend application
│   └── src/
│       ├── components/      # React components
│       │   ├── admin/       # Admin dashboard components
│       │   ├── ui/          # shadcn/ui components
│       │   ├── SocialShare.tsx
│       │   ├── TrendingSidebar.tsx
│       │   ├── NewsletterSubscribe.tsx
│       │   └── CommentsSection.tsx
│       ├── pages/           # Page components
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utilities
│       └── App.tsx          # Main app component
├── server/                  # Backend application
│   ├── routes.ts            # API routes
│   ├── lib/                 # Server utilities
│   │   └── sitemap-generator.ts
│   ├── services/            # Business logic
│   └── index.ts             # Server entry point
├── shared/                  # Shared code
│   └── schema.ts            # Database schema (Drizzle)
├── .env.example             # Environment template
├── package.json             # Dependencies
└── README.md                # Documentation
```

---

## Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `SITE_URL` (your production URL)
   - Deploy

3. **Run Migrations**
   ```bash
   # After deployment, run migrations
   npm run db:push
   ```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://production_url_here
SITE_URL=https://www.yoursite.com
NODE_ENV=production
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in package.json dev script
```

### TypeScript Errors

```bash
# Regenerate types
npm run check
```

---

## Optional Enhancements

### Add AI Article Generation

1. Get Google AI API key from [ai.google.dev](https://ai.google.dev)
2. Add to `.env`: `GOOGLE_API_KEY=your_key_here`
3. Use the bulk generator in admin panel

### Add Professional Images

1. Get Pexels API key from [pexels.com/api](https://www.pexels.com/api/)
2. Add to `.env`: `PEXELS_API_KEY=your_key_here`
3. Images will auto-fetch for new articles

### Add Text-to-Speech

1. Get ElevenLabs API key from [elevenlabs.io](https://elevenlabs.io)
2. Add to `.env`: `ELEVENLABS_API_KEY=your_key_here`
3. Generate audio versions of articles

---

## Support & Maintenance

### Backup Database

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Monitor Performance

- Check `/api/analytics/overview` for site metrics
- Use Vercel Analytics for production monitoring
- Monitor database performance via Neon dashboard

### Update Dependencies

```bash
npm update
npm audit fix
```

---

## Conclusion

You now have a fully functional, world-class news portal with:
- ✅ Professional UI/UX with premium design
- ✅ Complete CMS with admin dashboard
- ✅ Advanced search and filtering
- ✅ Comments and engagement features
- ✅ SEO optimization
- ✅ Analytics and trending
- ✅ Newsletter system
- ✅ Social sharing
- ✅ Responsive design
- ✅ Production-ready architecture

**The portal is ready to launch!** 🚀

For questions or support, refer to the code documentation and API endpoints above.
