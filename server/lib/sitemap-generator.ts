import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { articles, categories } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(baseUrl: string = 'https://www.politicaargentina.com'): Promise<string> {
  const urls: SitemapUrl[] = [];

  // Add homepage
  urls.push({
    loc: baseUrl,
    changefreq: 'hourly',
    priority: 1.0,
    lastmod: new Date().toISOString()
  });

  // Add static pages
  urls.push(
    {
      loc: `${baseUrl}/nosotros`,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/contacto`,
      changefreq: 'monthly',
      priority: 0.8
    }
  );

  // Add categories
  const allCategories = await db.select().from(categories);
  for (const category of allCategories) {
    urls.push({
      loc: `${baseUrl}/categoria/${category.slug}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: category.createdAt.toISOString()
    });
  }

  // Add articles
  const publishedArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt));

  for (const article of publishedArticles) {
    urls.push({
      loc: `${baseUrl}/articulo/${article.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: article.updatedAt.toISOString()
    });
  }

  // Generate XML
  const xml = generateSitemapXML(urls);
  return xml;
}

export async function generateNewsSitemap(baseUrl: string = 'https://www.politicaargentina.com'): Promise<string> {
  // News sitemap for Google News - only articles from last 2 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentArticles = await db
    .select({
      title: articles.title,
      slug: articles.slug,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(1000);

  const newsItems = recentArticles
    .filter(article => article.publishedAt && new Date(article.publishedAt) >= twoDaysAgo)
    .map(article => ({
      loc: `${baseUrl}/articulo/${article.slug}`,
      publicationDate: article.publishedAt?.toISOString() || new Date().toISOString(),
      title: article.title
    }));

  return generateNewsSitemapXML(newsItems);
}

function generateSitemapXML(urls: SitemapUrl[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

function generateNewsSitemapXML(newsItems: { loc: string; publicationDate: string; title: string }[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  for (const item of newsItems) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(item.loc)}</loc>\n`;
    xml += '    <news:news>\n';
    xml += '      <news:publication>\n';
    xml += '        <news:name>Política Argentina</news:name>\n';
    xml += '        <news:language>es</news:language>\n';
    xml += '      </news:publication>\n';
    xml += `      <news:publication_date>${item.publicationDate}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(item.title)}</news:title>\n`;
    xml += '    </news:news>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function generateRobotsTxt(baseUrl: string = 'https://www.politicaargentina.com'): Promise<string> {
  return `# Política Argentina - Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/news-sitemap.xml

# Crawl-delay for specific bots
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 0

User-agent: Slurp
Crawl-delay: 1
`;
}
