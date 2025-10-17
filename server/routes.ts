import type { Express } from "express";
import { storage } from "./storage";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
import { articles, categories, sources, insertArticleSchema, insertCategorySchema, insertSourceSchema } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { generatePodcastStyleAudio } from "./lib/elevenlabs-service";
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
        .set({ viewCount: sql`${articles.viewCount} + 1` })
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

  // Users (minimal - using storage interface)
  app.get("/api/user", async (req, res) => {
    if ((req as any).isAuthenticated?.()) {
      return res.json((req as any).user);
    }
    res.status(401).json({ error: "Not authenticated" });
  });

  return createServer(app);
}
