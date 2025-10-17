import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, desc, sql } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
import {
  type User,
  type InsertUser,
  type Article,
  type InsertArticle,
  type Source,
  type InsertSource,
  type Category,
  type InsertCategory,
  users,
  articles,
  sources,
  categories,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getArticles(limit?: number): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  incrementArticleViews(id: string): Promise<void>;
  
  getSources(): Promise<Source[]>;
  getSourceById(id: string): Promise<Source | undefined>;
  getSourceByName(name: string): Promise<Source | undefined>;
  createSource(source: InsertSource): Promise<Source>;
  updateSource(id: string, source: Partial<InsertSource>): Promise<Source>;
  deleteSource(id: string): Promise<void>;
  
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  getStats(): Promise<{
    totalArticles: number;
    publishedToday: number;
    activeSources: number;
    avgCredibility: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getArticles(limit: number = 20): Promise<Article[]> {
    return await this.db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(limit);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await this.db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0];
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const result = await this.db.insert(articles).values(insertArticle).returning();
    return result[0];
  }

  async getSources(): Promise<Source[]> {
    return await this.db.select().from(sources);
  }

  async getSourceByName(name: string): Promise<Source | undefined> {
    const result = await this.db.select().from(sources).where(eq(sources.name, name)).limit(1);
    return result[0];
  }

  async createSource(insertSource: InsertSource): Promise<Source> {
    const result = await this.db.insert(sources).values(insertSource).returning();
    return result[0];
  }

  async getCategories(): Promise<Category[]> {
    return await this.db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await this.db.insert(categories).values(insertCategory).returning();
    return result[0];
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    const result = await this.db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async updateArticle(id: string, updateData: Partial<InsertArticle>): Promise<Article> {
    const result = await this.db
      .update(articles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return result[0];
  }

  async deleteArticle(id: string): Promise<void> {
    await this.db.delete(articles).where(eq(articles.id, id));
  }

  async incrementArticleViews(id: string): Promise<void> {
    await this.db
      .update(articles)
      .set({ viewCount: sql`${articles.viewCount} + 1` })
      .where(eq(articles.id, id));
  }

  async getSourceById(id: string): Promise<Source | undefined> {
    const result = await this.db.select().from(sources).where(eq(sources.id, id)).limit(1);
    return result[0];
  }

  async updateSource(id: string, updateData: Partial<InsertSource>): Promise<Source> {
    const result = await this.db
      .update(sources)
      .set(updateData)
      .where(eq(sources.id, id))
      .returning();
    return result[0];
  }

  async deleteSource(id: string): Promise<void> {
    await this.db.delete(sources).where(eq(sources.id, id));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category> {
    const result = await this.db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await this.db.delete(categories).where(eq(categories.id, id));
  }

  async getStats(): Promise<{
    totalArticles: number;
    publishedToday: number;
    activeSources: number;
    avgCredibility: number;
  }> {
    const totalArticles = await this.db.select().from(articles);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const publishedToday = await this.db
      .select()
      .from(articles)
      .where(eq(articles.publishedAt, today));
    
    const activeSources = await this.db
      .select()
      .from(sources)
      .where(eq(sources.isActive, true));
    
    const avgCredibility = totalArticles.length > 0
      ? totalArticles.reduce((sum, a) => sum + (a.credibilityScore || 0), 0) / totalArticles.length
      : 0;

    return {
      totalArticles: totalArticles.length,
      publishedToday: publishedToday.length,
      activeSources: activeSources.length,
      avgCredibility: Math.round(avgCredibility),
    };
  }
}

export const storage = new DatabaseStorage();
