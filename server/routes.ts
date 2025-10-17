import type { Express } from "express";
import { storage } from "./storage";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

// Configure Neon to use HTTP instead of WebSocket
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
import { articles, categories, sources, insertArticleSchema, insertCategorySchema, insertSourceSchema } from "@shared/schema";
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

  return createServer(app);
}
