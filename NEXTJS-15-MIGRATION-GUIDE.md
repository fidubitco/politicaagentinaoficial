# 🚀 POLÍTICA ARGENTINA - Next.js 15 Migration Guide
## World-Class News Portal - Complete Architectural Transformation

**Created:** 2025-10-17
**Timeline:** 4-6 Weeks
**Approach:** Incremental migration in parallel branch
**Goal:** Exceed "Aetherium" standards with Next.js 15 + App Router

---

## 📊 EXECUTIVE SUMMARY

### Why Migrate to Next.js 15?

**Current Stack (Vite + Express):**
- ✅ Lightweight and fast for client-side rendering
- ✅ Simple deployment
- ❌ Limited SEO (client-side rendering)
- ❌ No built-in optimization
- ❌ Manual i18n implementation
- ❌ No server-side rendering

**Next.js 15 Benefits:**
- ✅ **Server Components** - Ultra-fast initial page loads
- ✅ **App Router** - Advanced layouts, streaming, parallel routes
- ✅ **Built-in Optimization** - Images, fonts, scripts auto-optimized
- ✅ **True SSR/SSG Hybrid** - Best of both worlds
- ✅ **Edge Functions** - Global CDN delivery
- ✅ **next-intl** - Industry-standard i18n with automatic routing
- ✅ **Turbopack** - Rust-based bundler (10x faster than Webpack)
- ✅ **Better SEO** - 100/100 Lighthouse scores achievable
- ✅ **React 19 Ready** - Future-proof architecture

---

## 🎯 MIGRATION STRATEGY

### Phase 1: Foundation (Week 1)

#### 1.1 Create Next.js 15 Project

```bash
# Create new Next.js 15 app in 'nextjs' folder
npx create-next-app@latest nextjs-app --typescript --tailwind --app --src-dir

cd nextjs-app

# Install core dependencies
npm install @tanstack/react-query next-intl
npm install drizzle-orm @neondatabase/serverless
npm install framer-motion gsap
npm install sharp # For image optimization
npm install @vercel/analytics @vercel/speed-insights

# Install dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D drizzle-kit tsx
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

#### 1.2 Project Structure

```
nextjs-app/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── layout.tsx     # Root layout with providers
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── categoria/[slug]/
│   │   │   │   └── page.tsx   # Category pages
│   │   │   ├── articulo/[slug]/
│   │   │   │   └── page.tsx   # Article pages (SSG)
│   │   │   ├── nosotros/
│   │   │   │   └── page.tsx
│   │   │   └── contacto/
│   │   │       └── page.tsx
│   │   ├── admin/             # Admin panel (no locale)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── articles/
│   │   │   ├── analytics/
│   │   │   └── ...
│   │   ├── api/               # API Route Handlers
│   │   │   ├── articles/
│   │   │   │   ├── route.ts
│   │   │   │   └── [slug]/route.ts
│   │   │   ├── categories/route.ts
│   │   │   └── admin/
│   │   ├── layout.tsx         # Global layout
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── atoms/             # Atomic design system
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── lib/
│   │   ├── db/                # Database utilities
│   │   │   ├── schema.ts
│   │   │   ├── client.ts
│   │   │   └── queries.ts
│   │   ├── translations/       # Translation service
│   │   │   ├── service.ts
│   │   │   └── cache.ts
│   │   ├── i18n/              # next-intl configuration
│   │   │   ├── config.ts
│   │   │   └── request.ts
│   │   └── utils/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tokens.css         # Aetherium design tokens
│   │   └── animations.css
│   └── messages/              # Translation files
│       ├── en.json
│       ├── es.json
│       ├── pt.json
│       └── ... (50 languages)
├── public/
│   ├── images/
│   └── fonts/
├── prisma/                     # Prisma schema (alternative to Drizzle)
│   └── schema.prisma
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

#### 1.3 Configure next.config.js

```javascript
// next.config.js
const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
  // Enable Turbopack for dev
  // Next.js 15 uses Turbopack by default in dev mode
};

module.exports = withNextIntl(nextConfig);
```

---

### Phase 2: Internationalization (Week 1-2)

#### 2.1 next-intl Setup

**File:** `src/i18n/config.ts`
```typescript
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = [
  'es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'zh', 'ar',
  // ... all 50 languages
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**File:** `src/middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // /en/articulo/... but /articulo/... for Spanish
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

**File:** `src/app/[locale]/layout.tsx`
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### 2.2 Translation Service with JSONB

**File:** `src/lib/translations/service.ts`
```typescript
import { db } from '@/lib/db/client';
import { translations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { cache } from './cache';

export class TranslationService {
  /**
   * Get translated field for an entity
   * Implements multi-level caching: Memory → Redis → Database
   */
  async getTranslation(
    entityType: string,
    entityId: string,
    field: string,
    locale: string
  ): Promise<string | null> {
    const cacheKey = `trans:${entityType}:${entityId}:${field}:${locale}`;

    // 1. Check memory cache (LRU)
    const memCached = cache.get(cacheKey);
    if (memCached) return memCached;

    // 2. Check Redis cache
    const redisCached = await redis.get(cacheKey);
    if (redisCached) {
      cache.set(cacheKey, redisCached);
      return redisCached;
    }

    // 3. Query database
    const result = await db.query.translations.findFirst({
      where: and(
        eq(translations.translatable_type, entityType),
        eq(translations.translatable_id, entityId),
        eq(translations.field_name, field),
        eq(translations.locale, locale)
      ),
    });

    if (result) {
      // Cache in Redis (1 hour TTL)
      await redis.setex(cacheKey, 3600, result.value);
      // Cache in memory
      cache.set(cacheKey, result.value);
      return result.value;
    }

    return null;
  }

  /**
   * Batch translate multiple entities
   * Reduces database queries from N to 1
   */
  async batchTranslate<T extends Record<string, any>>(
    entities: T[],
    entityType: string,
    fields: string[],
    locale: string
  ): Promise<T[]> {
    if (locale === 'es') return entities; // Skip for default language

    const entityIds = entities.map((e) => e.id);

    // Batch query all translations
    const allTranslations = await db.query.translations.findMany({
      where: and(
        eq(translations.translatable_type, entityType),
        inArray(translations.translatable_id, entityIds),
        inArray(translations.field_name, fields),
        eq(translations.locale, locale)
      ),
    });

    // Build translation map
    const translationMap = new Map<string, string>();
    for (const trans of allTranslations) {
      const key = `${trans.translatable_id}:${trans.field_name}`;
      translationMap.set(key, trans.value);
    }

    // Apply translations
    return entities.map((entity) => {
      const translated = { ...entity };
      for (const field of fields) {
        const key = `${entity.id}:${field}`;
        const translation = translationMap.get(key);
        if (translation) {
          translated[field] = translation;
        }
      }
      return translated;
    });
  }
}
```

---

### Phase 3: Database Integration (Week 2)

#### 3.1 Drizzle ORM Setup

**File:** `src/lib/db/schema.ts`
```typescript
import { pgTable, serial, varchar, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  summary: text('summary'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  audioUrl: text('audio_url'),
  author: varchar('author', { length: 255 }),
  status: varchar('status', { length: 50 }).default('draft'),
  publishedAt: timestamp('published_at'),
  viewCount: integer('view_count').default(0),
  credibilityScore: integer('credibility_score'),
  categoryId: varchar('category_id', { length: 255 }),
  sourceId: varchar('source_id', { length: 255 }),
  metadata: jsonb('metadata'), // For photographer info, etc.
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const translations = pgTable('translations', {
  id: serial('id').primaryKey(),
  translatable_type: varchar('translatable_type', { length: 255 }).notNull(),
  translatable_id: varchar('translatable_id', { length: 255 }).notNull(),
  locale: varchar('locale', { length: 10 }).notNull(),
  field_name: varchar('field_name', { length: 255 }).notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }),
  icon: varchar('icon', { length: 100 }),
  priority: integer('priority').default(0),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**File:** `src/lib/db/client.ts`
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

---

### Phase 4: Server Components & SSG (Week 2-3)

#### 4.1 Article Page with ISR (Incremental Static Regeneration)

**File:** `src/app/[locale]/articulo/[slug]/page.tsx`
```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/client';
import { articles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { TranslationService } from '@/lib/translations/service';
import ArticleContent from '@/components/organisms/ArticleContent';
import { unstable_cache } from 'next/cache';

const translationService = new TranslationService();

// Generate static params for top articles (SSG)
export async function generateStaticParams() {
  const topArticles = await db.query.articles.findMany({
    where: eq(articles.status, 'published'),
    orderBy: (articles, { desc }) => [desc(articles.viewCount)],
    limit: 1000, // Pre-render top 1000 articles
  });

  return topArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Revalidate every hour
export const revalidate = 3600;

async function getArticle(slug: string, locale: string) {
  // Use Next.js caching
  return unstable_cache(
    async () => {
      const article = await db.query.articles.findFirst({
        where: eq(articles.slug, slug),
      });

      if (!article) return null;

      // Translate if not Spanish
      if (locale !== 'es') {
        const titleTranslation = await translationService.getTranslation(
          'article',
          article.id,
          'title',
          locale
        );
        const summaryTranslation = await translationService.getTranslation(
          'article',
          article.id,
          'summary',
          locale
        );
        const contentTranslation = await translationService.getTranslation(
          'article',
          article.id,
          'content',
          locale
        );

        return {
          ...article,
          title: titleTranslation || article.title,
          summary: summaryTranslation || article.summary,
          content: contentTranslation || article.content,
        };
      }

      return article;
    },
    [`article-${slug}-${locale}`],
    {
      revalidate: 3600,
      tags: [`article-${slug}`],
    }
  )();
}

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const article = await getArticle(slug, locale);

  if (!article) return {};

  return {
    title: article.title,
    description: article.summary || article.title,
    openGraph: {
      title: article.title,
      description: article.summary || article.title,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const article = await getArticle(slug, locale);

  if (!article) notFound();

  return <ArticleContent article={article} />;
}
```

---

### Phase 5: "Aetherium" Design System (Week 3-4)

#### 5.1 Design Tokens

**File:** `src/styles/tokens.css`
```css
:root {
  /* Luxury Color Palette */
  --color-luxury-gold: #D4AF37;
  --color-luxury-gold-light: #F4E5C3;
  --color-luxury-platinum: #E5E4E2;
  --color-luxury-midnight: #0A0E27;
  --color-luxury-royal: #4169E1;
  --color-luxury-crimson: #DC143C;

  /* Gradients */
  --gradient-luxury-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-luxury-gold: linear-gradient(135deg, #D4AF37 0%, #F4E5C3 100%);
  --gradient-luxury-royal: linear-gradient(135deg, #4169E1 0%, #6495ED 100%);
  --gradient-glassmorphism: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));

  /* Typography - Playfair Display + Inter */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font Sizes - Fluid Typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.9rem + 1.75vw, 3rem);
  --text-5xl: clamp(3rem, 2.5rem + 2.5vw, 4rem);

  /* Spacing - 8pt Grid */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */

  /* Shadows - Luxury Depth */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-luxury: 0 30px 60px rgba(0, 0, 0, 0.3);

  /* Effects */
  --blur-glass: blur(20px);
  --blur-backdrop: blur(40px);

  /* Animations */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-luxury: 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

#### 5.2 Tailwind Configuration

**File:** `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          'gold-light': '#F4E5C3',
          platinum: '#E5E4E2',
          midnight: '#0A0E27',
          royal: '#4169E1',
          crimson: '#DC143C',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', ...fontFamily.serif],
        body: ['var(--font-body)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

---

### Phase 6: Testing Infrastructure (Week 4)

#### 6.1 Vitest Setup

**File:** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
      ],
      threshold: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 6.2 Playwright E2E Tests

**File:** `tests/e2e/translation-flow.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Full Translation Workflow', () => {
  test('user can navigate site in multiple languages', async ({ page }) => {
    // Start on Spanish (default)
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('POLÍTICA ARGENTINA');

    // Open language selector
    await page.click('[data-testid="language-selector"]');

    // Change to English
    await page.click('[data-testid="language-en"]');
    await expect(page).toHaveURL('/en');
    await expect(page.locator('h1')).toContainText('ARGENTINE POLITICS');

    // Navigate to article
    await page.click('[data-testid="article-card-first"]');
    await expect(page).toHaveURL(/\/en\/articulo\/.+/);

    // Verify article is in English
    await expect(page.locator('article')).not.toContainText('Por');
    await expect(page.locator('article')).toContainText('By');

    // Change to French
    await page.click('[data-testid="language-selector"]');
    await page.click('[data-testid="language-fr"]');
    await expect(page).toHaveURL(/\/fr\/articulo\/.+/);

    // Verify article is in French
    await expect(page.locator('article')).toContainText('Par');
  });

  test('SEO meta tags are translated correctly', async ({ page }) => {
    await page.goto('/en/articulo/some-article-slug');

    const title = await page.title();
    expect(title).toContain('ARGENTINE POLITICS');

    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();
  });
});
```

---

### Phase 7: PayloadCMS Integration (Week 4-5)

#### 7.1 PayloadCMS Configuration

**File:** `payload.config.ts`
```typescript
import { buildConfig } from 'payload/config';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- POLÍTICA ARGENTINA CMS',
      favicon: '/favicon.ico',
    },
  },
  editor: lexicalEditor({}),
  collections: [
    {
      slug: 'articles',
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'status', 'publishedAt', 'category'],
      },
      access: {
        read: () => true,
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'summary',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          localized: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
          required: true,
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'viewCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'credibilityScore',
          type: 'number',
          min: 0,
          max: 100,
        },
      ],
    },
    {
      slug: 'categories',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'color',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticURL: '/media',
        staticDir: 'media',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'users',
      auth: true,
      admin: {
        useAsTitle: 'email',
      },
      fields: [],
    },
  ],
  localization: {
    locales: ['es', 'en', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'zh', 'ar'],
    defaultLocale: 'es',
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter: s3Adapter({
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
            },
            bucket: process.env.S3_BUCKET!,
          }),
        },
      },
    }),
  ],
  typescript: {
    outputFile: './src/payload-types.ts',
  },
});
```

---

### Phase 8: Deployment & DevOps (Week 5-6)

#### 8.1 GitHub Actions CI/CD

**File:** `.github/workflows/nextjs.yml`
```yaml
name: Next.js CI/CD

on:
  push:
    branches: [main, nextjs-15]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test

      - name: Build Next.js app
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### 8.2 Vercel Configuration

**File:** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXT_PUBLIC_SITE_URL": "@site_url",
    "PEXELS_API_KEY": "@pexels_api_key"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url"
    }
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "crons": [
    {
      "path": "/api/cron/generate-articles",
      "schedule": "0 */2 * * *"
    },
    {
      "path": "/api/cron/enrich-images",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

---

## 📈 PERFORMANCE TARGETS

### Lighthouse Scores (100/100 Achievable)
- **Performance:** 95-100
- **Accessibility:** 95-100
- **Best Practices:** 100
- **SEO:** 100

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 1.2s
- **FID (First Input Delay):** < 50ms
- **CLS (Cumulative Layout Shift):** < 0.05

### Load Times
- **TTFB (Time to First Byte):** < 300ms (Edge Functions)
- **FCP (First Contentful Paint):** < 1s
- **TTI (Time to Interactive):** < 2s

---

## 💰 COST BREAKDOWN (Cost-Conscious)

### Free Tier Services
- **Vercel Hobby:** $0/month (100GB bandwidth, 100 serverless functions)
- **Neon Database:** $0/month (3GB storage, 1GB RAM)
- **GitHub Actions:** $0/month (2000 minutes/month)
- **Vercel Analytics:** $0/month (basic analytics)
- **Self-hosted Sentry:** $0/month (Docker container)

### Paid Services (Optional)
- **Vercel Pro:** $20/month (if you need more bandwidth)
- **Neon Pro:** $19/month (if you need more database resources)
- **Vercel Analytics Pro:** $10/month (advanced analytics)

**Total Monthly Cost:** $0-$50 depending on traffic

---

## 🚀 MIGRATION TIMELINE

### Week 1: Foundation
- ✅ Create Next.js 15 project
- ✅ Set up App Router structure
- ✅ Configure next-intl
- ✅ Set up database connection
- ✅ Create design tokens

### Week 2: Core Features
- ✅ Port existing components
- ✅ Implement Server Components
- ✅ Build translation service
- ✅ Create API route handlers
- ✅ Set up Redis caching

### Week 3: Content & Design
- ✅ Integrate PayloadCMS
- ✅ Build "Aetherium" design system
- ✅ Implement GSAP animations
- ✅ Create responsive layouts
- ✅ Add micro-interactions

### Week 4: Testing
- ✅ Write unit tests (Vitest)
- ✅ Write E2E tests (Playwright)
- ✅ Set up Storybook
- ✅ Performance optimization
- ✅ Accessibility audit

### Week 5: DevOps & Deployment
- ✅ GitHub Actions pipeline
- ✅ Vercel deployment
- ✅ Self-hosted Sentry setup
- ✅ Configure monitoring
- ✅ Set up cron jobs

### Week 6: Polish & Launch
- ✅ Final testing
- ✅ Documentation
- ✅ Performance tuning
- ✅ SEO optimization
- ✅ Production launch

---

## 🎯 SUCCESS METRICS

### Technical Excellence
- ✅ 100% TypeScript coverage
- ✅ 80%+ test coverage
- ✅ < 2s page load time
- ✅ 95+ Lighthouse scores
- ✅ Zero console errors
- ✅ Full WCAG AAA accessibility

### User Experience
- ✅ Seamless language switching
- ✅ Instant page transitions
- ✅ Smooth animations
- ✅ Mobile-first design
- ✅ Touch-friendly UI (48x48px targets)
- ✅ Offline support (PWA)

### Business Goals
- ✅ 50-language support
- ✅ Real-time content updates
- ✅ Easy content management (PayloadCMS)
- ✅ Scalable architecture
- ✅ SEO-optimized structure
- ✅ Analytics integration

---

## 📝 NEXT STEPS

### Immediate Actions (This Week)
1. **Review this migration guide** - Understand the full scope
2. **Create `nextjs-15` branch** - Start migration in parallel
3. **Set up Next.js project** - Follow Phase 1 instructions
4. **Configure database** - Set up Neon or keep existing PostgreSQL

### This Month
1. **Port core components** - Migrate homepage and article pages
2. **Implement i18n** - Set up next-intl with 10 languages first
3. **Test locally** - Ensure everything works before deployment
4. **Deploy to Vercel** - Get the Next.js version online

### Next 2 Months
1. **Complete migration** - All features from Vite → Next.js
2. **Add PayloadCMS** - Modern content management
3. **Optimize performance** - Achieve 100/100 Lighthouse
4. **Full launch** - Switch DNS to Next.js version

---

## 📞 SUPPORT & RESOURCES

### Official Documentation
- **Next.js 15:** https://nextjs.org/docs
- **next-intl:** https://next-intl-docs.vercel.app
- **PayloadCMS:** https://payloadcms.com/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs
- **Vercel:** https://vercel.com/docs

### Community
- **Next.js Discord:** https://nextjs.org/discord
- **Vercel Community:** https://github.com/vercel/next.js/discussions

---

## 🎉 CONCLUSION

This migration will transform POLÍTICA ARGENTINA into a **truly world-class news portal** that exceeds the "Aetherium" vision:

✅ **Ultra-Fast Performance** - Edge rendering, ISR, Server Components
✅ **Best-in-Class SEO** - 100/100 Lighthouse scores achievable
✅ **50-Language Support** - Automatic URL routing, translation caching
✅ **Modern CMS** - PayloadCMS for easy content management
✅ **Production-Ready** - Full CI/CD, monitoring, testing
✅ **Cost-Effective** - $0-$50/month with free tiers
✅ **Scalable Architecture** - Ready for millions of users
✅ **Luxury Design** - "Aetherium" design system with GSAP + Framer Motion

**Timeline:** 4-6 weeks for complete migration
**Result:** A news portal that sets the gold standard in its category

---

**Built with ❤️ using Next.js 15, TypeScript, TailwindCSS, PayloadCMS, Drizzle ORM, and Vercel**

**© 2025 POLÍTICA ARGENTINA - All Rights Reserved**
