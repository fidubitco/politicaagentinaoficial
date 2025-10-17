import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
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
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  getSources(): Promise<Source[]>;
  getSourceByName(name: string): Promise<Source | undefined>;
  createSource(source: InsertSource): Promise<Source>;
  
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
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
}

export const storage = new DatabaseStorage();
