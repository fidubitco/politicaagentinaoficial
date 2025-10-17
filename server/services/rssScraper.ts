import Parser from 'rss-parser';

interface RSSItem {
  title: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  categories?: string[];
}

interface ScrapedNewsItem {
  title: string;
  url: string;
  date: Date;
  category: string;
  snippet?: string;
}

const parser = new Parser();

const publicSources = [
  {
    url: 'https://www.argentina.gob.ar/noticias/rss.xml',
    category: 'Política Nacional',
    name: 'Argentina.gob.ar'
  },
  {
    url: 'https://www.telam.com.ar/rss2/politica.xml',
    category: 'Política Nacional',
    name: 'Télam Política'
  },
  {
    url: 'https://www.telam.com.ar/rss2/economia.xml',
    category: 'Economía',
    name: 'Télam Economía'
  },
  {
    url: 'https://www.ambito.com/rss/home.xml',
    category: 'Economía',
    name: 'Ámbito Financiero'
  }
];

export class RSSScraperService {
  private cache: Map<string, { items: ScrapedNewsItem[], timestamp: number }> = new Map();
  private cacheTimeout = 1800000; // 30 minutes

  async scrapePublicFeeds(forceRefresh = false): Promise<ScrapedNewsItem[]> {
    const cacheKey = 'all_feeds';
    const cached = this.cache.get(cacheKey);
    
    if (!forceRefresh && cached && (Date.now() - cached.timestamp < this.cacheTimeout)) {
      return cached.items;
    }

    const allItems: ScrapedNewsItem[] = [];

    for (const source of publicSources) {
      try {
        const items = await this.scrapeFeed(source.url, source.category);
        allItems.push(...items);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error instanceof Error ? error.message : 'Unknown error');
      }
    }

    this.cache.set(cacheKey, {
      items: allItems,
      timestamp: Date.now()
    });

    return allItems;
  }

  async scrapeFeed(feedUrl: string, defaultCategory: string): Promise<ScrapedNewsItem[]> {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      return feed.items.slice(0, 10).map(item => ({
        title: this.sanitizeTitle(item.title || 'Sin título'),
        url: item.link || '',
        date: item.pubDate ? new Date(item.pubDate) : new Date(),
        category: this.mapCategory(item.categories, defaultCategory),
        snippet: item.contentSnippet?.substring(0, 200)
      }));
    } catch (error) {
      console.error(`Error parsing feed ${feedUrl}:`, error);
      return [];
    }
  }

  private sanitizeTitle(title: string): string {
    return title
      .replace(/<[^>]*>/g, '')
      .replace(/&[^;]+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 150);
  }

  private mapCategory(feedCategories: string[] | undefined, defaultCategory: string): string {
    if (!feedCategories || feedCategories.length === 0) {
      return defaultCategory;
    }

    const categoryMap: Record<string, string> = {
      'politica': 'Política Nacional',
      'política': 'Política Nacional',
      'economy': 'Economía',
      'economia': 'Economía',
      'economía': 'Economía',
      'justicia': 'Justicia',
      'internacional': 'Internacional',
      'world': 'Internacional',
      'mundo': 'Internacional'
    };

    for (const cat of feedCategories) {
      const normalized = cat.toLowerCase();
      if (categoryMap[normalized]) {
        return categoryMap[normalized];
      }
    }

    return defaultCategory;
  }

  async getTopicsFromFeeds(category?: string): Promise<string[]> {
    const items = await this.scrapePublicFeeds();
    
    const filteredItems = category 
      ? items.filter(item => item.category === category)
      : items;

    return filteredItems
      .map(item => this.extractTopicFromTitle(item.title))
      .filter(topic => topic.length > 10)
      .slice(0, 20);
  }

  private extractTopicFromTitle(title: string): string {
    const cleaned = title
      .replace(/^(ÚLTIMA HORA|URGENTE|EXCLUSIVO|BREAKING)[:|\s]*/i, '')
      .replace(/\s*-\s*.*/g, '')
      .trim();
    
    return cleaned;
  }

  async getRecentKeywords(category?: string, limit = 30): Promise<string[]> {
    const items = await this.scrapePublicFeeds();
    
    const filteredItems = category 
      ? items.filter(item => item.category === category)
      : items;

    const allWords = filteredItems
      .map(item => item.title.toLowerCase().split(/\s+/))
      .flat()
      .filter(word => word.length > 4);

    const wordFrequency = new Map<string, number>();
    for (const word of allWords) {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    }

    const stopWords = new Set([
      'sobre', 'tras', 'desde', 'hasta', 'para', 'ante', 'bajo',
      'argentina', 'buenos', 'aires', 'país', 'nacional', 'gobierno'
    ]);

    return Array.from(wordFrequency.entries())
      .filter(([word]) => !stopWords.has(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const rssScraperService = new RSSScraperService();
