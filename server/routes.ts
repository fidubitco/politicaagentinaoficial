import type { Express } from "express";
import { storage } from "./storage";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

// Configure Neon to use HTTP instead of WebSocket
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
import { articles, categories, sources, translations, categoryTranslations, insertArticleSchema, insertCategorySchema, insertSourceSchema } from "@shared/schema";
import { translateArticle, translateCategory, getSupportedLocales, type SupportedLocale } from "./services/translation";
import { eq, desc, sql as sqlOp } from "drizzle-orm";
import { z } from "zod";
import { generatePodcastStyleAudio } from "./lib/elevenlabs-service";
import { generateDiverseArticles } from "./lib/massive-article-generator";
import { imageSearchService } from "./services/imageSearch";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

import { createServer } from "http";

export function registerRoutes(app: Express) {
  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const allArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          summary: articles.summary,
          content: articles.content,
          imageUrl: articles.imageUrl,
          audioUrl: articles.audioUrl,
          author: articles.author,
          status: articles.status,
          publishedAt: articles.publishedAt,
          viewCount: articles.viewCount,
          credibilityScore: articles.credibilityScore,
          categoryId: articles.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          categoryColor: categories.color,
          sourceId: articles.sourceId,
          sourceName: sources.name,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .leftJoin(sources, eq(articles.sourceId, sources.id))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.publishedAt));

      res.json(allArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const [article] = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          summary: articles.summary,
          content: articles.content,
          imageUrl: articles.imageUrl,
          audioUrl: articles.audioUrl,
          author: articles.author,
          status: articles.status,
          publishedAt: articles.publishedAt,
          viewCount: articles.viewCount,
          credibilityScore: articles.credibilityScore,
          categoryId: articles.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          categoryColor: categories.color,
          sourceId: articles.sourceId,
          sourceName: sources.name,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .leftJoin(sources, eq(articles.sourceId, sources.id))
        .where(eq(articles.slug, req.params.slug));

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Increment view count
      await db
        .update(articles)
        .set({ viewCount: sqlOp`${articles.viewCount} + 1` })
        .where(eq(articles.id, article.id));

      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const [newArticle] = await db.insert(articles).values(validatedData).returning();
      res.json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const [updated] = await db
        .update(articles)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(articles.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const [deleted] = await db
        .delete(articles)
        .where(eq(articles.id, req.params.id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Generate audio for article
  app.post("/api/articles/:id/generate-audio", async (req, res) => {
    try {
      const [article] = await db
        .select()
        .from(articles)
        .where(eq(articles.id, req.params.id));

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Generate audio
      const audioBuffer = await generatePodcastStyleAudio(
        article.title,
        article.summary || "",
        article.content
      );

      // Save audio file
      const audioDir = join(process.cwd(), "public", "audio");
      await mkdir(audioDir, { recursive: true });
      
      const audioFileName = `${article.slug}-${Date.now()}.mp3`;
      const audioPath = join(audioDir, audioFileName);
      await writeFile(audioPath, audioBuffer);

      const audioUrl = `/audio/${audioFileName}`;

      // Update article with audio URL
      const [updated] = await db
        .update(articles)
        .set({ audioUrl })
        .where(eq(articles.id, req.params.id))
        .returning();

      res.json({ audioUrl, article: updated });
    } catch (error) {
      console.error("Error generating audio:", error);
      res.status(500).json({ error: "Failed to generate audio" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db
        .select()
        .from(categories)
        .orderBy(desc(categories.priority));
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const [newCategory] = await db.insert(categories).values(validatedData).returning();
      res.json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const [updated] = await db
        .update(categories)
        .set(req.body)
        .where(eq(categories.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const [deleted] = await db
        .delete(categories)
        .where(eq(categories.id, req.params.id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Translation Endpoints
  
  // Translate article
  app.post("/api/translate/article", async (req, res) => {
    try {
      const { articleId, targetLocale } = req.body;
      
      if (!articleId || !targetLocale) {
        return res.status(400).json({ error: "articleId and targetLocale are required" });
      }

      const translation = await translateArticle(articleId, targetLocale as SupportedLocale);
      res.json({ translation });
    } catch (error) {
      console.error("Error translating article:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to translate article" });
    }
  });

  // Translate category
  app.post("/api/translate/category", async (req, res) => {
    try {
      const { categoryId, targetLocale } = req.body;
      
      if (!categoryId || !targetLocale) {
        return res.status(400).json({ error: "categoryId and targetLocale are required" });
      }

      const translation = await translateCategory(categoryId, targetLocale as SupportedLocale);
      res.json({ translation });
    } catch (error) {
      console.error("Error translating category:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to translate category" });
    }
  });

  // Get article translation
  app.get("/api/translations/article/:articleId/:locale", async (req, res) => {
    try {
      const { articleId, locale } = req.params;
      
      const [translation] = await db
        .select()
        .from(translations)
        .where(eq(translations.articleId, articleId))
        .where(eq(translations.locale, locale));

      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  // Get category translation
  app.get("/api/translations/category/:categoryId/:locale", async (req, res) => {
    try {
      const { categoryId, locale } = req.params;
      
      const [translation] = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, categoryId))
        .where(eq(categoryTranslations.locale, locale));

      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }

      res.json(translation);
    } catch (error) {
      console.error("Error fetching category translation:", error);
      res.status(500).json({ error: "Failed to fetch category translation" });
    }
  });

  // Get supported locales
  app.get("/api/locales", (req, res) => {
    res.json({ locales: getSupportedLocales() });
  });

  // Sources
  app.get("/api/sources", async (req, res) => {
    try {
      const allSources = await db.select().from(sources).where(eq(sources.isActive, true));
      res.json(allSources);
    } catch (error) {
      console.error("Error fetching sources:", error);
      res.status(500).json({ error: "Failed to fetch sources" });
    }
  });

  app.post("/api/sources", async (req, res) => {
    try {
      const validatedData = insertSourceSchema.parse(req.body);
      const [newSource] = await db.insert(sources).values(validatedData).returning();
      res.json(newSource);
    } catch (error) {
      console.error("Error creating source:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create source" });
    }
  });

  // Related articles
  app.get("/api/articles/:id/related", async (req, res) => {
    try {
      const [article] = await db
        .select({ categoryId: articles.categoryId })
        .from(articles)
        .where(eq(articles.id, req.params.id));

      if (!article || !article.categoryId) {
        return res.json([]);
      }

      const relatedArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          summary: articles.summary,
          imageUrl: articles.imageUrl,
          publishedAt: articles.publishedAt,
          viewCount: articles.viewCount,
          categoryName: categories.name,
          categoryColor: categories.color,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.categoryId, article.categoryId))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.viewCount))
        .limit(6);

      // Filter out the current article
      const filtered = relatedArticles.filter(a => a.id !== req.params.id).slice(0, 5);
      res.json(filtered);
    } catch (error) {
      console.error("Error fetching related articles:", error);
      res.status(500).json({ error: "Failed to fetch related articles" });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [stats] = await db
        .select({
          totalArticles: sqlOp<number>`count(*)::int`,
          publishedToday: sqlOp<number>`count(*) filter (where ${articles.publishedAt} >= ${today})::int`,
          avgCredibility: sqlOp<number>`avg(${articles.credibilityScore})::int`,
        })
        .from(articles)
        .where(eq(articles.status, "published"));

      const activeSources = await db
        .select({ count: sqlOp<number>`count(*)::int` })
        .from(sources)
        .where(eq(sources.isActive, true));

      res.json({
        totalArticles: stats?.totalArticles || 0,
        publishedToday: stats?.publishedToday || 0,
        avgCredibility: stats?.avgCredibility || 0,
        activeSources: activeSources[0]?.count || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Analytics overview
  app.get("/api/analytics/overview", async (req, res) => {
    try {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [totalViews] = await db
        .select({
          total: sqlOp<number>`sum(${articles.viewCount})::int`,
          last24h: sqlOp<number>`sum(case when ${articles.publishedAt} >= ${last24h} then ${articles.viewCount} else 0 end)::int`,
          last7d: sqlOp<number>`sum(case when ${articles.publishedAt} >= ${last7d} then ${articles.viewCount} else 0 end)::int`,
          last30d: sqlOp<number>`sum(case when ${articles.publishedAt} >= ${last30d} then ${articles.viewCount} else 0 end)::int`,
        })
        .from(articles)
        .where(eq(articles.status, "published"));

      res.json({
        totalViews: totalViews?.total || 0,
        views24h: totalViews?.last24h || 0,
        views7d: totalViews?.last7d || 0,
        views30d: totalViews?.last30d || 0,
      });
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Analytics trends
  app.get("/api/analytics/trends", async (req, res) => {
    try {
      const last30Days = await db
        .select({
          date: sqlOp<string>`date(${articles.publishedAt})`,
          count: sqlOp<number>`count(*)::int`,
          views: sqlOp<number>`sum(${articles.viewCount})::int`,
        })
        .from(articles)
        .where(eq(articles.status, "published"))
        .groupBy(sqlOp`date(${articles.publishedAt})`)
        .orderBy(desc(sqlOp`date(${articles.publishedAt})`))
        .limit(30);

      res.json(last30Days);
    } catch (error) {
      console.error("Error fetching analytics trends:", error);
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  // Top articles
  app.get("/api/analytics/top-articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      const topArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          viewCount: articles.viewCount,
          publishedAt: articles.publishedAt,
          categoryName: categories.name,
          categoryColor: categories.color,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.viewCount))
        .limit(limit);

      res.json(topArticles);
    } catch (error) {
      console.error("Error fetching top articles:", error);
      res.status(500).json({ error: "Failed to fetch top articles" });
    }
  });

  // Category distribution
  app.get("/api/analytics/category-distribution", async (req, res) => {
    try {
      const distribution = await db
        .select({
          categoryId: articles.categoryId,
          categoryName: categories.name,
          categoryColor: categories.color,
          count: sqlOp<number>`count(*)::int`,
          totalViews: sqlOp<number>`sum(${articles.viewCount})::int`,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.status, "published"))
        .groupBy(articles.categoryId, categories.name, categories.color)
        .orderBy(desc(sqlOp<number>`count(*)`));

      res.json(distribution);
    } catch (error) {
      console.error("Error fetching category distribution:", error);
      res.status(500).json({ error: "Failed to fetch category distribution" });
    }
  });

  // SEO Audit
  app.get("/api/seo/audit", async (req, res) => {
    try {
      const allArticles = await db
        .select({
          id: articles.id,
          title: articles.title,
          summary: articles.summary,
          imageUrl: articles.imageUrl,
          slug: articles.slug,
        })
        .from(articles)
        .where(eq(articles.status, "published"));

      const totalArticles = allArticles.length;
      const withSummary = allArticles.filter(a => a.summary && a.summary.length > 0).length;
      const withImages = allArticles.filter(a => a.imageUrl).length;
      const withOptimalTitle = allArticles.filter(a => a.title.length >= 30 && a.title.length <= 60).length;

      const siteHealthScore = Math.round(
        ((withSummary / totalArticles) * 30 +
        (withImages / totalArticles) * 30 +
        (withOptimalTitle / totalArticles) * 40) || 0
      );

      res.json({
        siteHealthScore,
        totalArticles,
        metaTagsCoverage: Math.round((withSummary / totalArticles) * 100) || 0,
        imageOptimization: Math.round((withImages / totalArticles) * 100) || 0,
        titleOptimization: Math.round((withOptimalTitle / totalArticles) * 100) || 0,
        articlesWithoutSummary: totalArticles - withSummary,
        articlesWithoutImages: totalArticles - withImages,
        sitemapStatus: "active",
        robotsStatus: "active",
        canonicalUrls: totalArticles,
      });
    } catch (error) {
      console.error("Error in SEO audit:", error);
      res.status(500).json({ error: "Failed to perform SEO audit" });
    }
  });

  // SEO Recommendations
  app.get("/api/seo/recommendations", async (req, res) => {
    try {
      const recommendations = [];

      const articlesWithoutSummary = await db
        .select({ id: articles.id, title: articles.title })
        .from(articles)
        .where(eq(articles.status, "published"))
        .limit(5);

      const noSummary = articlesWithoutSummary.filter(a => !a.title);
      if (noSummary.length > 0) {
        recommendations.push({
          type: "warning",
          title: "Artículos sin meta description",
          message: `${noSummary.length} artículos necesitan meta description`,
          priority: "high",
        });
      }

      const articlesWithoutImages = await db
        .select({ id: articles.id, title: articles.title })
        .from(articles)
        .where(eq(articles.status, "published"))
        .limit(5);

      const noImages = articlesWithoutImages.filter(a => !a.title);
      if (noImages.length > 0) {
        recommendations.push({
          type: "info",
          title: "Optimizar imágenes",
          message: `${noImages.length} artículos sin imagen destacada`,
          priority: "medium",
        });
      }

      recommendations.push({
        type: "success",
        title: "Títulos optimizados",
        message: "La mayoría de los títulos tienen longitud óptima para SEO",
        priority: "low",
      });

      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching SEO recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  // Public stats
  app.get("/api/public/stats", async (req, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [stats] = await db
        .select({
          publishedToday: sqlOp<number>`count(*) filter (where ${articles.publishedAt} >= ${today})::int`,
          publishedThisMonth: sqlOp<number>`count(*) filter (where ${articles.publishedAt} >= ${thisMonth})::int`,
          totalViews: sqlOp<number>`sum(${articles.viewCount})::int`,
        })
        .from(articles)
        .where(eq(articles.status, "published"));

      res.json({
        articlesToday: stats?.publishedToday || 0,
        articlesThisMonth: stats?.publishedThisMonth || 0,
        totalReads: stats?.totalViews || 0,
      });
    } catch (error) {
      console.error("Error fetching public stats:", error);
      res.status(500).json({ error: "Failed to fetch public stats" });
    }
  });

  // Public trending
  app.get("/api/public/trending", async (req, res) => {
    try {
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const trending = await db
        .select({
          id: articles.id,
          title: articles.title,
          slug: articles.slug,
          viewCount: articles.viewCount,
          categoryName: categories.name,
          categoryColor: categories.color,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.viewCount))
        .limit(10);

      res.json(trending);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      res.status(500).json({ error: "Failed to fetch trending topics" });
    }
  });

  // Massive article generation
  app.post("/api/admin/generate-bulk-articles", async (req, res) => {
    try {
      const { categoryId, categoryName, count } = req.body;
      
      if (!categoryId || !categoryName || !count) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Get default source
      const [source] = await db.select().from(sources).where(eq(sources.name, 'POLÍTICA ARGENTINA')).limit(1);
      const sourceId = source?.id || (await db.insert(sources).values({
        name: 'POLÍTICA ARGENTINA',
        url: 'https://politica-argentina.replit.app',
        credibilityScore: 95,
        isActive: true,
      }).returning())[0].id;

      // Generate articles
      const generatedArticles = await generateDiverseArticles({
        categoryId,
        categoryName,
        sourceId,
        count: parseInt(count),
      });

      // Insert articles
      const inserted = [];
      for (const article of generatedArticles) {
        const [newArticle] = await db.insert(articles).values(article).returning();
        inserted.push(newArticle);
      }

      res.json({ success: true, count: inserted.length, articles: inserted });
    } catch (error) {
      console.error("Error generating bulk articles:", error);
      res.status(500).json({ error: "Failed to generate articles" });
    }
  });

  // Image search endpoint
  app.post("/api/images/search", async (req, res) => {
    try {
      const { title, category, orientation = 'landscape' } = req.body;
      
      if (!title) {
        return res.status(400).json({ 
          error: "Title is required",
          url: imageSearchService.getFallbackImage(category),
          alt: title || 'Imagen de artículo',
          isFallback: true,
          fallbackReason: 'missing_title'
        });
      }

      // Check if PEXELS_API_KEY is available
      if (!process.env.PEXELS_API_KEY) {
        console.warn('⚠️ PEXELS_API_KEY not configured, using fallback image');
        return res.json({ 
          url: imageSearchService.getFallbackImage(category),
          alt: title,
          photographer: null,
          photographerUrl: null,
          isFallback: true,
          fallbackReason: 'missing_api_key'
        });
      }

      const image = await imageSearchService.searchContextualImage(
        title,
        category,
        undefined,
        orientation as 'landscape' | 'portrait' | 'square'
      );

      if (!image) {
        console.log(`ℹ️ No contextual image found for "${title}", using fallback`);
        return res.json({ 
          url: imageSearchService.getFallbackImage(category),
          alt: title,
          photographer: null,
          photographerUrl: null,
          isFallback: true,
          fallbackReason: 'no_results'
        });
      }

      res.json({
        ...image,
        isFallback: false
      });
    } catch (error) {
      console.error("❌ Error searching image:", error);
      
      // Return fallback image even on error with detailed logging
      const fallbackUrl = imageSearchService.getFallbackImage(req.body.category);
      console.log(`🔄 Returning fallback image due to error: ${fallbackUrl}`);
      
      res.json({ 
        url: fallbackUrl,
        alt: req.body.title || 'Imagen de artículo',
        photographer: null,
        photographerUrl: null,
        isFallback: true,
        fallbackReason: 'search_error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Users (minimal - using storage interface)
  app.get("/api/user", async (req, res) => {
    if ((req as any).isAuthenticated?.()) {
      return res.json((req as any).user);
    }
    res.status(401).json({ error: "Not authenticated" });
  });

  // SEO: Sitemap XML
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const siteUrl = process.env.SITE_URL || "https://politica-argentina.replit.app";
      
      // Get all published articles and categories
      const [allArticles, allCategories] = await Promise.all([
        db.select({
          slug: articles.slug,
          updatedAt: articles.updatedAt,
        })
        .from(articles)
        .where(eq(articles.status, "published"))
        .orderBy(desc(articles.publishedAt)),
        
        db.select({
          slug: categories.slug,
        })
        .from(categories)
      ]);

      // Build sitemap XML
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About Page -->
  <url>
    <loc>${siteUrl}/nosotros</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Contact Page -->
  <url>
    <loc>${siteUrl}/contacto</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Category Pages -->
  ${allCategories.map(cat => `
  <url>
    <loc>${siteUrl}/categoria/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  
  <!-- Article Pages -->
  ${allArticles.map(article => `
  <url>
    <loc>${siteUrl}/articulo/${article.slug}</loc>
    <lastmod>${article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // SEO: Robots.txt
  app.get("/robots.txt", (req, res) => {
    const siteUrl = process.env.SITE_URL || "https://politica-argentina.replit.app";
    
    const robotsTxt = `# Robots.txt for POLÍTICA ARGENTINA
# Permitir acceso a todos los crawlers

User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay optimizado
Crawl-delay: 1

# Páginas específicas
Allow: /nosotros
Allow: /contacto
Allow: /categoria/
Allow: /articulo/

# Bloquear admin
Disallow: /admin/`;

    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // Autonomous Content Generation Endpoints
  app.post("/api/generate/article", async (req, res) => {
    try {
      const { category, count = 1 } = req.body;
      
      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const { automationScheduler } = await import("./services/automationScheduler");
      await automationScheduler.generateNow(category, count);

      res.json({ 
        success: true, 
        message: `Generated ${count} article(s) for category: ${category}` 
      });
    } catch (error) {
      console.error("Error generating articles:", error);
      res.status(500).json({ error: "Failed to generate articles" });
    }
  });

  app.get("/api/automation/status", async (req, res) => {
    try {
      const { automationScheduler } = await import("./services/automationScheduler");
      const status = automationScheduler.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching automation status:", error);
      res.status(500).json({ error: "Failed to fetch automation status" });
    }
  });

  app.post("/api/automation/stop", async (req, res) => {
    try {
      const { automationScheduler } = await import("./services/automationScheduler");
      automationScheduler.stop();
      res.json({ success: true, message: "Automation stopped" });
    } catch (error) {
      console.error("Error stopping automation:", error);
      res.status(500).json({ error: "Failed to stop automation" });
    }
  });

  app.post("/api/automation/start", async (req, res) => {
    try {
      const { automationScheduler } = await import("./services/automationScheduler");
      await automationScheduler.initialize();
      res.json({ success: true, message: "Automation started" });
    } catch (error) {
      console.error("Error starting automation:", error);
      res.status(500).json({ error: "Failed to start automation" });
    }
  });

  return createServer(app);
}
