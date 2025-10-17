import * as cheerio from 'cheerio';
import { generateLocalArticle } from "./local-article-generator";

export interface ScrapedArticle {
  title: string;
  content: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
  author?: string;
  category?: string;
}

const POLITICAL_KEYWORDS = /milei|cristina|macri|fernández|kirchner|dólar|inflación|congreso|senado|diputados|casa rosada|gobierno|elecciones|política|economía|justicia|corte suprema|provincias|gobernador|intendente/i;

async function fetchWithHeaders(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return await response.text();
}

async function expandArticleWithAI(scrapedContent: string, title: string): Promise<{ content: string; summary: string }> {
  try {
    // Use LOCAL generator - No API required!
    console.log(`📝 Expandiendo artículo localmente: "${title}"`);
    const { content, summary } = generateLocalArticle(title, "Política Nacional");

    // Prepend original scraped content as intro
    const enhancedContent = `<p><strong>Según información oficial:</strong> ${scrapedContent}</p>\n\n${content}`;

    return {
      content: enhancedContent,
      summary
    };
  } catch (error) {
    console.error("Error expanding article locally:", error);
    // Fallback to just formatting the scraped content
    return {
      content: `<p>${scrapedContent}</p>`,
      summary: title.substring(0, 180)
    };
  }
}

// CLARÍN SCRAPER
async function scrapeClarinPolitica(): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];

  try {
    console.log('🔍 Scraping Clarín Política...');
    const html = await fetchWithHeaders('https://www.clarin.com/politica/');
    const $ = cheerio.load(html);

    const links = new Set<string>();
    $('a[href*="/politica/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http') && !href.includes('video') && !href.includes('#')) {
        links.add(href);
      }
    });

    const uniqueLinks = Array.from(links).slice(0, 10);

    for (const url of uniqueLinks) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Rate limiting

        const articleHtml = await fetchWithHeaders(url);
        const $article = cheerio.load(articleHtml);

        const title = $article('h1').first().text().trim() ||
                     $article('.article-title, .title, h2').first().text().trim();

        if (!title || title.length < 20 || !POLITICAL_KEYWORDS.test(title)) {
          continue;
        }

        const paragraphs: string[] = [];
        $article('article p, .article-body p, .content p').each((_, p) => {
          const text = $article(p).text().trim();
          if (text.length > 80 && !text.includes('Suscribite') && !text.includes('Compartir')) {
            paragraphs.push(text);
          }
        });

        if (paragraphs.length < 3) continue;

        const scrapedContent = paragraphs.join('\n\n');

        // Expand with AI
        const { content, summary } = await expandArticleWithAI(scrapedContent, title);

        const imageUrl = $article('article img, .article-image img, picture source').first().attr('srcset')?.split(' ')[0] ||
                        $article('meta[property="og:image"]').attr('content');

        const author = $article('.author-name, .article-author, [itemprop="author"]').first().text().trim() ||
                      "Redacción Clarín";

        articles.push({
          title,
          content,
          summary,
          url,
          source: 'Clarín',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          imageUrl,
          author,
          category: 'Política Nacional'
        });

        console.log(`✅ Scraped: ${title.substring(0, 60)}...`);

      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

  } catch (error) {
    console.error('Error in scrapeClarinPolitica:', error);
  }

  return articles;
}

// LA NACIÓN SCRAPER
async function scrapeLaNacionPolitica(): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];

  try {
    console.log('🔍 Scraping La Nación Política...');
    const html = await fetchWithHeaders('https://www.lanacion.com.ar/politica/');
    const $ = cheerio.load(html);

    const links = new Set<string>();
    $('a[href*="/politica/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && (href.startsWith('http') || href.startsWith('/'))) {
        const fullUrl = href.startsWith('http') ? href : `https://www.lanacion.com.ar${href}`;
        if (!fullUrl.includes('video') && !fullUrl.includes('#')) {
          links.add(fullUrl);
        }
      }
    });

    const uniqueLinks = Array.from(links).slice(0, 10);

    for (const url of uniqueLinks) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const articleHtml = await fetchWithHeaders(url);
        const $article = cheerio.load(articleHtml);

        const title = $article('h1, .com-title, .article-title').first().text().trim();

        if (!title || title.length < 20 || !POLITICAL_KEYWORDS.test(title)) {
          continue;
        }

        const paragraphs: string[] = [];
        $article('.com-paragraph p, article p, .article-body p').each((_, p) => {
          const text = $article(p).text().trim();
          if (text.length > 80 && !text.includes('Suscribite')) {
            paragraphs.push(text);
          }
        });

        if (paragraphs.length < 3) continue;

        const scrapedContent = paragraphs.join('\n\n');
        const { content, summary } = await expandArticleWithAI(scrapedContent, title);

        const imageUrl = $article('meta[property="og:image"]').attr('content') ||
                        $article('article img').first().attr('src');

        articles.push({
          title,
          content,
          summary,
          url,
          source: 'La Nación',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          imageUrl,
          author: "Redacción La Nación",
          category: 'Política Nacional'
        });

        console.log(`✅ Scraped: ${title.substring(0, 60)}...`);

      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

  } catch (error) {
    console.error('Error in scrapeLaNacionPolitica:', error);
  }

  return articles;
}

// INFOBAE SCRAPER
async function scrapeInfobaeEconomia(): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];

  try {
    console.log('🔍 Scraping Infobae Economía...');
    const html = await fetchWithHeaders('https://www.infobae.com/economia/');
    const $ = cheerio.load(html);

    const links = new Set<string>();
    $('a[href*="/economia/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http') && !href.includes('video')) {
        links.add(href);
      }
    });

    const uniqueLinks = Array.from(links).slice(0, 10);

    for (const url of uniqueLinks) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const articleHtml = await fetchWithHeaders(url);
        const $article = cheerio.load(articleHtml);

        const title = $article('h1').first().text().trim();

        if (!title || title.length < 20 || !POLITICAL_KEYWORDS.test(title)) {
          continue;
        }

        const paragraphs: string[] = [];
        $article('article p, .article-text p').each((_, p) => {
          const text = $article(p).text().trim();
          if (text.length > 80) {
            paragraphs.push(text);
          }
        });

        if (paragraphs.length < 3) continue;

        const scrapedContent = paragraphs.join('\n\n');
        const { content, summary } = await expandArticleWithAI(scrapedContent, title);

        const imageUrl = $article('meta[property="og:image"]').attr('content');

        articles.push({
          title,
          content,
          summary,
          url,
          source: 'Infobae',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
          imageUrl,
          author: "Redacción Infobae",
          category: 'Economía'
        });

        console.log(`✅ Scraped: ${title.substring(0, 60)}...`);

      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

  } catch (error) {
    console.error('Error in scrapeInfobaeEconomia:', error);
  }

  return articles;
}

// MAIN SCRAPER FUNCTION
export async function scrapeAllCompetitors(): Promise<{
  clarín: ScrapedArticle[];
  laNacion: ScrapedArticle[];
  infobae: ScrapedArticle[];
  total: number;
}> {
  console.log('\n🚀 Iniciando scraping de competidores...\n');

  const [clarínArticles, laNacionArticles, infobaeArticles] = await Promise.all([
    scrapeClarinPolitica(),
    scrapeLaNacionPolitica(),
    scrapeInfobaeEconomia(),
  ]);

  const total = clarínArticles.length + laNacionArticles.length + infobaeArticles.length;

  console.log(`\n✅ Scraping completado: ${total} artículos profesionales obtenidos\n`);

  return {
    clarín: clarínArticles,
    laNacion: laNacionArticles,
    infobae: infobaeArticles,
    total
  };
}

export { scrapeClarinPolitica, scrapeLaNacionPolitica, scrapeInfobaeEconomia };
