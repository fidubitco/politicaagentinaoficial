import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { articles } from '@shared/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { imageSearchService } from './imageSearch';

// Lazy initialization of database
let db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql);
  }
  return db;
}

export class ImageEnrichmentService {
  /**
   * Enrich a single article with a contextual image
   */
  async enrichArticle(articleId: string): Promise<boolean> {
    try {
      const [article] = await getDb()
        .select()
        .from(articles)
        .where(eq(articles.id, articleId))
        .limit(1);

      if (!article) {
        console.error(`❌ Article ${articleId} not found`);
        return false;
      }

      if (article.imageUrl) {
        console.log(`ℹ️ Article already has an image: ${article.title}`);
        return true;
      }

      // Search for contextual image
      const imageResult = await imageSearchService.searchContextualImage(
        article.title,
        'Política Argentina'
      );

      if (!imageResult || !imageResult.url) {
        console.warn(`⚠️ No image found for article: ${article.title}`);
        return false;
      }

      // Update article with image
      await getDb()
        .update(articles)
        .set({
          imageUrl: imageResult.url,
          updatedAt: new Date()
        })
        .where(eq(articles.id, articleId));

      console.log(`✅ Image added to article: ${article.title.substring(0, 50)}...`);
      return true;
    } catch (error) {
      console.error(`❌ Error enriching article ${articleId}:`, error);
      return false;
    }
  }

  /**
   * Enrich all articles without images
   */
  async enrichAllArticles(limit?: number): Promise<{ success: number; failed: number; total: number }> {
    console.log('🖼️  Starting bulk image enrichment...');

    try {
      let query = getDb()
        .select()
        .from(articles)
        .where(and(
          isNull(articles.imageUrl),
          eq(articles.status, 'published')
        ));

      if (limit) {
        query = query.limit(limit);
      }

      const articlesWithoutImages = await query;

      console.log(`Found ${articlesWithoutImages.length} articles without images`);

      let success = 0;
      let failed = 0;

      for (const article of articlesWithoutImages) {
        const result = await this.enrichArticle(article.id);
        if (result) {
          success++;
        } else {
          failed++;
        }

        // Rate limiting: wait 1 second between requests
        await this.sleep(1000);
      }

      console.log(`✅ Image enrichment completed: ${success} success, ${failed} failed`);

      return {
        success,
        failed,
        total: articlesWithoutImages.length
      };
    } catch (error) {
      console.error('❌ Error in bulk enrichment:', error);
      throw error;
    }
  }

  /**
   * Replace image for a specific article with a new search
   */
  async replaceArticleImage(articleId: string, searchQuery?: string): Promise<boolean> {
    try {
      const [article] = await getDb()
        .select()
        .from(articles)
        .where(eq(articles.id, articleId))
        .limit(1);

      if (!article) {
        console.error(`❌ Article ${articleId} not found`);
        return false;
      }

      const query = searchQuery || article.title;
      const imageResult = await imageSearchService.searchContextualImage(
        query,
        'Política Argentina'
      );

      if (!imageResult || !imageResult.url) {
        console.warn(`⚠️ No image found for query: ${query}`);
        return false;
      }

      await getDb()
        .update(articles)
        .set({
          imageUrl: imageResult.url,
          updatedAt: new Date()
        })
        .where(eq(articles.id, articleId));

      console.log(`✅ Image replaced for article: ${article.title}`);
      return true;
    } catch (error) {
      console.error(`❌ Error replacing image for article ${articleId}:`, error);
      return false;
    }
  }

  /**
   * Get statistics about image coverage
   */
  async getImageStats(): Promise<{
    totalArticles: number;
    withImages: number;
    withoutImages: number;
    coverage: number;
  }> {
    try {
      const allArticles = await getDb()
        .select({
          id: articles.id,
          imageUrl: articles.imageUrl
        })
        .from(articles)
        .where(eq(articles.status, 'published'));

      const totalArticles = allArticles.length;
      const withImages = allArticles.filter(a => a.imageUrl).length;
      const withoutImages = totalArticles - withImages;
      const coverage = totalArticles > 0 ? (withImages / totalArticles) * 100 : 0;

      return {
        totalArticles,
        withImages,
        withoutImages,
        coverage: Math.round(coverage * 100) / 100
      };
    } catch (error) {
      console.error('❌ Error getting image stats:', error);
      return {
        totalArticles: 0,
        withImages: 0,
        withoutImages: 0,
        coverage: 0
      };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const imageEnrichmentService = new ImageEnrichmentService();
