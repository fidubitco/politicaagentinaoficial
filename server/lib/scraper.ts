import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
}

const CLARIN_SELECTORS = {
  articles: 'article.nota, .col-12.col-md-4, a[href*="/politica/"], a[href*="/economia/"]',
  title: 'h1, .title, h2.mt-3',
  paragraphs: 'p',
  image: 'img[src*="cloudfront"], img[data-src], picture img',
  date: 'time, .fecha, [datetime]',
};

const POLITICAL_REGEX = /dólar|cep|milei|política|gobierno|elecciones|congreso|senado|diputados/i;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function scrapeClarinArticles(): Promise<ScrapedArticle[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
  });

  const articles: ScrapedArticle[] = [];

  try {
    const page = await browser.newPage();
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.clarin.com/politica/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    const articleLinks = await page.$$eval('a[href*="/politica/"]', (links) =>
      links
        .map((link) => (link as HTMLAnchorElement).href)
        .filter((href) => href && !href.includes('#') && !href.includes('videos'))
        .slice(0, 5)
    );

    for (const url of articleLinks) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

        const title = await page.$eval(
          CLARIN_SELECTORS.title,
          (el) => el.textContent?.trim() || ''
        ).catch(() => '');

        if (!title || !POLITICAL_REGEX.test(title)) {
          continue;
        }

        const paragraphs = await page.$$eval(CLARIN_SELECTORS.paragraphs, (pElements) =>
          pElements
            .map((p) => p.textContent?.trim() || '')
            .filter((text) => text.length > 50)
            .slice(0, 3)
        );

        const content = paragraphs.join('\n\n');

        if (!content || !POLITICAL_REGEX.test(content)) {
          continue;
        }

        const imageUrl = await page.$eval(
          CLARIN_SELECTORS.image,
          (img) => (img as HTMLImageElement).src || (img as HTMLImageElement).dataset.src || ''
        ).catch(() => '');

        const dateStr = await page.$eval(
          CLARIN_SELECTORS.date,
          (el) => el.getAttribute('datetime') || el.textContent?.trim() || ''
        ).catch(() => '');

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

      } catch (error) {
        console.error(`Error scraping article ${url}:`, error);
        continue;
      }
    }

  } catch (error) {
    console.error('Error in scrapeClarinArticles:', error);
  } finally {
    await browser.close();
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
