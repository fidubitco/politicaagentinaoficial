import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
}

const POLITICAL_REGEX = /dólar|cep|milei|política|gobierno|elecciones|congreso|senado|diputados/i;

async function fetchWithUserAgent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-AR,es;q=0.9',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.text();
}

async function scrapeClarinArticles(): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];

  try {
    const html = await fetchWithUserAgent('https://www.clarin.com/politica/');
    const $ = cheerio.load(html);
    
    const articleLinks: string[] = [];
    $('a[href*="/politica/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.includes('#') && !href.includes('videos') && href.startsWith('http')) {
        articleLinks.push(href);
      }
    });

    const uniqueLinks = Array.from(new Set(articleLinks)).slice(0, 5);

    for (const url of uniqueLinks) {
      try {
        const articleHtml = await fetchWithUserAgent(url);
        const article$ = cheerio.load(articleHtml);

        const title = article$('h1').first().text().trim() || 
                     article$('.title').first().text().trim() ||
                     article$('h2').first().text().trim();

        if (!title || !POLITICAL_REGEX.test(title)) {
          continue;
        }

        const paragraphs: string[] = [];
        article$('p').each((_, p) => {
          const text = article$(p).text().trim();
          if (text.length > 50 && paragraphs.length < 3) {
            paragraphs.push(text);
          }
        });

        const content = paragraphs.join('\n\n');

        if (!content || !POLITICAL_REGEX.test(content)) {
          continue;
        }

        const imageUrl = article$('article img, .article-image img, picture img').first().attr('src') || 
                        article$('img[data-src]').first().attr('data-src') ||
                        article$('meta[property="og:image"]').attr('content');

        const dateStr = article$('time').attr('datetime') || 
                       article$('.fecha, .date').first().text().trim();

        let publishedAt = new Date();
        if (dateStr) {
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            publishedAt = parsedDate;
          }
        }

        articles.push({
          title,
          content,
          url,
          source: 'Clarín',
          publishedAt,
          imageUrl: imageUrl || undefined,
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error scraping article ${url}:`, error);
        continue;
      }
    }

  } catch (error) {
    console.error('Error in scrapeClarinArticles:', error);
  }

  return articles;
}

export async function scrapeAllSources(): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];

  const clarinArticles = await scrapeClarinArticles();
  articles.push(...clarinArticles);

  return articles;
}

export { scrapeClarinArticles };
