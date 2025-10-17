import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeAllSources } from "./lib/scraper";
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
      res.json(article);
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

  const httpServer = createServer(app);

  return httpServer;
}
