import cron, { type ScheduledTask } from 'node-cron';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { articles, categories } from '@shared/schema';
import { autonomousContentGenerator } from './autonomousContentGenerator';
import { eq, lt, and, isNull } from 'drizzle-orm';
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

export class AutomationScheduler {
  private tasks: ScheduledTask[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('⚠️  Automation scheduler already initialized');
      return;
    }

    console.log('🤖 Initializing Autonomous Content Generation Scheduler...');

    this.scheduleArticleGeneration();
    this.scheduleImageEnrichment();
    this.scheduleOldArticleCleanup();

    this.isInitialized = true;
    console.log('✅ Automation scheduler initialized successfully');
  }

  private scheduleArticleGeneration(): void {
    const task = cron.schedule('0 */2 * * *', async () => {
      console.log('🔄 Starting automated article generation...');
      
      try {
        const allCategories = await getDb().select().from(categories);
        
        const mainCategories = allCategories
          .filter(cat => ['Política Nacional', 'Economía', 'Justicia'].includes(cat.name))
          .slice(0, 3);

        for (const category of mainCategories) {
          try {
            console.log(`📝 Generating article for category: ${category.name}`);
            
            const articleData = await autonomousContentGenerator.generateArticle({
              category: category.name,
              useRealData: true
            });

            const enrichedArticle = await autonomousContentGenerator.enrichArticleWithImage(articleData);

            await getDb().insert(articles).values({
              ...enrichedArticle,
              categoryId: category.id,
              status: 'published'
            } as any);

            console.log(`✅ Article generated for ${category.name}: ${enrichedArticle.title}`);
          } catch (error) {
            console.error(`❌ Error generating article for ${category.name}:`, error);
          }

          await this.sleep(2000);
        }

        console.log('✅ Automated article generation completed');
      } catch (error) {
        console.error('❌ Error in article generation task:', error);
      }
    });

    this.tasks.push(task);
    console.log('📅 Scheduled: Article generation every 2 hours');
  }

  private scheduleImageEnrichment(): void {
    const task = cron.schedule('0 */6 * * *', async () => {
      console.log('🖼️  Starting image enrichment for articles...');
      
      try {
        const articlesWithoutImages = await db
          .select()
          .from(articles)
          .where(
            and(
              isNull(articles.imageUrl),
              eq(articles.status, 'published')
            )
          )
          .limit(10);

        console.log(`Found ${articlesWithoutImages.length} articles without images`);

        for (const article of articlesWithoutImages) {
          try {
            const imageResult = await imageSearchService.searchContextualImage(
              article.title,
              'Política Argentina'
            );

            if (imageResult && imageResult.url) {
              await db
                .update(articles)
                .set({ imageUrl: imageResult.url })
                .where(eq(articles.id, article.id));

              console.log(`✅ Image added to article: ${article.title.substring(0, 50)}...`);
            }
          } catch (error) {
            console.error(`❌ Error adding image to article ${article.id}:`, error);
          }

          await this.sleep(1000);
        }

        console.log('✅ Image enrichment completed');
      } catch (error) {
        console.error('❌ Error in image enrichment task:', error);
      }
    });

    this.tasks.push(task);
    console.log('📅 Scheduled: Image enrichment every 6 hours');
  }

  private scheduleOldArticleCleanup(): void {
    const task = cron.schedule('0 0 * * *', async () => {
      console.log('🧹 Starting cleanup of old articles...');
      
      try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const deletedArticles = await db
          .delete(articles)
          .where(lt(articles.publishedAt, ninetyDaysAgo))
          .returning();

        console.log(`✅ Cleaned up ${deletedArticles.length} articles older than 90 days`);
      } catch (error) {
        console.error('❌ Error in cleanup task:', error);
      }
    });

    this.tasks.push(task);
    console.log('📅 Scheduled: Old article cleanup every 24 hours');
  }

  async generateNow(category?: string, count: number = 1): Promise<void> {
    console.log(`🚀 Manual generation triggered for ${category || 'all categories'}`);
    
    try {
      const allCategories = await getDb().select().from(categories);
      
      const targetCategories = category 
        ? allCategories.filter(cat => cat.name === category)
        : allCategories.slice(0, 3);

      for (const cat of targetCategories) {
        for (let i = 0; i < count; i++) {
          const articleData = await autonomousContentGenerator.generateArticle({
            category: cat.name,
            useRealData: true
          });

          const enrichedArticle = await autonomousContentGenerator.enrichArticleWithImage(articleData);

          await getDb().insert(articles).values({
            ...enrichedArticle,
            categoryId: cat.id,
            status: 'published'
          } as any);

          console.log(`✅ Manual article generated: ${enrichedArticle.title}`);
          
          if (i < count - 1) await this.sleep(1000);
        }
      }
    } catch (error) {
      console.error('❌ Error in manual generation:', error);
      throw error;
    }
  }

  stop(): void {
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    this.isInitialized = false;
    console.log('🛑 Automation scheduler stopped');
  }

  getStatus(): { initialized: boolean; taskCount: number } {
    return {
      initialized: this.isInitialized,
      taskCount: this.tasks.length
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const automationScheduler = new AutomationScheduler();
