import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeAllSources } from "./lib/scraper";
import { generateArticles } from "./lib/article-generator";
import { defaultCategories } from "./lib/category-seed";
import { generateWorldClassArticle } from "./lib/article-auto-generator";
import { insertArticleSchema, insertSourceSchema, insertCategorySchema } from "@shared/schema";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const articles = await storage.getArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      // Increment view count and get updated article
      await storage.incrementArticleViews(article.id);
      const updatedArticle = await storage.getArticleById(article.id);
      res.json(updatedArticle || article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/scrape", async (req, res) => {
    try {
      console.log("Starting scraping process...");
      const scrapedArticles = await scrapeAllSources();
      console.log(`Scraped ${scrapedArticles.length} articles`);

      const savedArticles = [];

      for (const article of scrapedArticles) {
        try {
          let source = await storage.getSourceByName(article.source);
          
          if (!source) {
            source = await storage.createSource({
              name: article.source,
              url: article.url.split('/').slice(0, 3).join('/'),
              credibilityScore: 70,
              isActive: true,
            });
          }

          const slug = generateSlug(article.title);
          
          const existingArticle = await storage.getArticleBySlug(slug);
          if (existingArticle) {
            console.log(`Article already exists: ${slug}`);
            continue;
          }

          const savedArticle = await storage.createArticle({
            title: article.title,
            slug,
            summary: article.content.slice(0, 200) + '...',
            content: article.content,
            imageUrl: article.imageUrl,
            sourceId: source.id,
            categoryId: null,
            author: null,
            publishedAt: article.publishedAt,
            viewCount: 0,
            credibilityScore: source.credibilityScore,
            metadata: { originalUrl: article.url },
          });

          savedArticles.push(savedArticle);
        } catch (error) {
          console.error(`Error saving article "${article.title}":`, error);
        }
      }

      res.json({
        success: true,
        scraped: scrapedArticles.length,
        saved: savedArticles.length,
        articles: savedArticles,
      });
    } catch (error) {
      console.error("Error in scraping:", error);
      res.status(500).json({ error: "Failed to scrape articles" });
    }
  });

  app.get("/api/sources", async (req, res) => {
    try {
      const sources = await storage.getSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching sources:", error);
      res.status(500).json({ error: "Failed to fetch sources" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  let dolarCache: { data: any; timestamp: number } | null = null;
  const DOLAR_CACHE_TTL = 30000; // 30 seconds

  app.get("/api/dolar", async (req, res) => {
    try {
      const now = Date.now();
      
      if (dolarCache && (now - dolarCache.timestamp) < DOLAR_CACHE_TTL) {
        return res.json(dolarCache.data);
      }

      const response = await fetch('https://dolarapi.com/v1/dolares');
      if (!response.ok) {
        throw new Error(`DolarAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formatted = {
        oficial: data.find((d: any) => d.casa === 'oficial'),
        blue: data.find((d: any) => d.casa === 'blue'),
        mep: data.find((d: any) => d.casa === 'bolsa'),
        ccl: data.find((d: any) => d.casa === 'contadoconliqui'),
        tarjeta: data.find((d: any) => d.casa === 'tarjeta'),
        timestamp: new Date().toISOString(),
      };

      dolarCache = { data: formatted, timestamp: now };
      
      res.json(formatted);
    } catch (error) {
      console.error("Error fetching dolar:", error);
      res.status(500).json({ error: "Failed to fetch dolar data" });
    }
  });

  // Admin API Routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  app.post("/api/admin/articles", async (req, res) => {
    try {
      const article = await storage.createArticle(req.body);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.put("/api/admin/articles/:id", async (req, res) => {
    try {
      const article = await storage.updateArticle(req.params.id, req.body);
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  app.delete("/api/admin/articles/:id", async (req, res) => {
    try {
      await storage.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  app.put("/api/admin/sources/:id", async (req, res) => {
    try {
      const source = await storage.updateSource(req.params.id, req.body);
      res.json(source);
    } catch (error) {
      console.error("Error updating source:", error);
      res.status(500).json({ error: "Failed to update source" });
    }
  });

  app.delete("/api/admin/sources/:id", async (req, res) => {
    try {
      await storage.deleteSource(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting source:", error);
      res.status(500).json({ error: "Failed to delete source" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Seed default categories
  app.post("/api/admin/seed-categories", async (req, res) => {
    try {
      const createdCategories = [];
      const skippedCategories = [];

      for (const categoryData of defaultCategories) {
        try {
          const existing = await storage.getCategoryBySlug(categoryData.slug);
          if (existing) {
            skippedCategories.push(existing);
            console.log(`Category already exists: ${categoryData.slug}`);
            continue;
          }

          const category = await storage.createCategory(categoryData as any);
          createdCategories.push(category);
        } catch (error) {
          console.error(`Error creating category "${categoryData.name}":`, error);
        }
      }

      res.json({
        success: true,
        created: createdCategories.length,
        skipped: skippedCategories.length,
        total: defaultCategories.length,
        categories: createdCategories,
      });
    } catch (error) {
      console.error("Error seeding categories:", error);
      res.status(500).json({ error: "Failed to seed categories" });
    }
  });

  // Generate articles from templates
  app.post("/api/admin/generate-articles", async (req, res) => {
    try {
      const { count = 30, categorySlug = "justicia" } = req.body;
      
      // Create or get category
      let category = await storage.getCategoryBySlug(categorySlug);
      if (!category) {
        category = await storage.createCategory({
          name: "Justicia",
          slug: "justicia",
          description: "Poder Judicial, Corte Suprema, causas judiciales y fallos",
          color: "#8B4513",
          icon: "Scale",
          priority: 85,
          isFeatured: true,
        });
      }

      // Create or get source
      let source = await storage.getSourceByName("Política Argentina");
      if (!source) {
        source = await storage.createSource({
          name: "Política Argentina",
          url: "https://politica-argentina.com",
          logoUrl: null,
          credibilityScore: 90,
          isActive: true,
        });
      }

      // Generate articles
      const articleTemplates = generateArticles(source.id, category.id, count);
      const createdArticles = [];

      for (const template of articleTemplates) {
        try {
          // Check if article with this slug exists
          const existing = await storage.getArticleBySlug(template.slug);
          if (existing) {
            console.log(`Article already exists: ${template.slug}`);
            continue;
          }

          const article = await storage.createArticle(template as any);
          createdArticles.push(article);
        } catch (error) {
          console.error(`Error creating article "${template.title}":`, error);
        }
      }

      res.json({
        success: true,
        created: createdArticles.length,
        total: articleTemplates.length,
        articles: createdArticles,
      });
    } catch (error) {
      console.error("Error generating articles:", error);
      res.status(500).json({ error: "Failed to generate articles" });
    }
  });

  // Auto-generate world-class article with Gemini AI
  app.post("/api/admin/auto-generate-article", async (req, res) => {
    try {
      const { topic, categoryId } = req.body;

      // Get category info if provided
      let categoryName: string | undefined;
      if (categoryId) {
        const category = await storage.getCategoryById(categoryId);
        categoryName = category?.name;
      }

      // Generate article with Gemini
      const generatedArticle = await generateWorldClassArticle(topic, categoryName);

      // Check if article with this slug already exists
      const existing = await storage.getArticleBySlug(generatedArticle.slug);
      if (existing) {
        return res.status(409).json({ 
          error: "Ya existe un artículo con este título. Intenta con otro tema." 
        });
      }

      res.json({
        success: true,
        article: generatedArticle,
      });
    } catch (error) {
      console.error("Error auto-generating article:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Error al generar el artículo" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
