import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const sources = pgTable("sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  logoUrl: text("logo_url"),
  credibilityScore: integer("credibility_score").default(50),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSourceSchema = createInsertSchema(sources).omit({
  id: true,
  createdAt: true,
});

export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sources.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  color: text("color").default("#6CACE4"),
  icon: text("icon").default("Folder"),
  priority: integer("priority").default(0),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  audioUrl: text("audio_url"),
  sourceId: varchar("source_id").references(() => sources.id),
  categoryId: varchar("category_id").references(() => categories.id),
  author: text("author"),
  status: text("status").notNull().default("published"), // draft | scheduled | published
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  credibilityScore: integer("credibility_score"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  scrapedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").references(() => articles.id).notNull(),
  locale: text("locale").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

export const categoryTranslations = pgTable("category_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  locale: text("locale").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategoryTranslationSchema = createInsertSchema(categoryTranslations).omit({
  id: true,
  createdAt: true,
});

export type InsertCategoryTranslation = z.infer<typeof insertCategoryTranslationSchema>;
export type CategoryTranslation = typeof categoryTranslations.$inferSelect;

// Comments System
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").references(() => articles.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  parentId: varchar("parent_id").references(() => comments.id),
  isApproved: boolean("is_approved").default(false).notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Article Analytics
export const articleAnalytics = pgTable("article_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").references(() => articles.id).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  views: integer("views").default(0).notNull(),
  uniqueViews: integer("unique_views").default(0).notNull(),
  avgTimeSpent: integer("avg_time_spent").default(0).notNull(), // in seconds
  bounceRate: integer("bounce_rate").default(0).notNull(), // percentage
  shares: jsonb("shares").default({}), // {facebook: 10, twitter: 5, etc}
  referrers: jsonb("referrers").default({}), // {google: 50, direct: 30, etc}
});

export const insertArticleAnalyticsSchema = createInsertSchema(articleAnalytics).omit({
  id: true,
  date: true,
});

export type InsertArticleAnalytics = z.infer<typeof insertArticleAnalyticsSchema>;
export type ArticleAnalytics = typeof articleAnalytics.$inferSelect;

// Trending Topics
export const trendingTopics = pgTable("trending_topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyword: text("keyword").notNull().unique(),
  count: integer("count").default(1).notNull(),
  sentiment: integer("sentiment").default(0).notNull(), // -100 to 100
  relatedArticles: jsonb("related_articles").default([]),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrendingTopicSchema = createInsertSchema(trendingTopics).omit({
  id: true,
  createdAt: true,
});

export type InsertTrendingTopic = z.infer<typeof insertTrendingTopicSchema>;
export type TrendingTopic = typeof trendingTopics.$inferSelect;

// Bookmarks
export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  articleId: varchar("article_id").references(() => articles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // breaking_news, article_published, comment_reply, etc
  link: text("link"),
  isRead: boolean("is_read").default(false).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  isActive: boolean("is_active").default(true).notNull(),
  preferences: jsonb("preferences").default({}), // categories, frequency, etc
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Article Tags (Many-to-Many)
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export const articleTags = pgTable("article_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").references(() => articles.id).notNull(),
  tagId: varchar("tag_id").references(() => tags.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleTagSchema = createInsertSchema(articleTags).omit({
  id: true,
  createdAt: true,
});

export type InsertArticleTag = z.infer<typeof insertArticleTagSchema>;
export type ArticleTag = typeof articleTags.$inferSelect;
