import { GoogleGenAI } from "@google/genai";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { translations, categoryTranslations, articles, categories } from "@shared/schema";
import type { Translation, CategoryTranslation } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required for translation");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Supported locales with their native names
export const SUPPORTED_LOCALES = {
  es: { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇦🇷' },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  en: 'English',
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ja: 'Japanese',
  zh: 'Chinese',
  ru: 'Russian',
  ar: 'Arabic',
};

interface TranslationResponse {
  title: string;
  summary?: string;
  content: string;
}

async function translateWithGemini(
  text: string,
  targetLocale: string,
  sourceLocale: string = 'es',
  type: 'article' | 'category' = 'article'
): Promise<string> {
  const targetLanguage = LANGUAGE_NAMES[targetLocale] || targetLocale;
  const sourceLanguage = LANGUAGE_NAMES[sourceLocale] || sourceLocale;

  const systemPrompt = `You are a professional translator specializing in journalistic and political content. 
Translate accurately while preserving:
- Journalistic tone and style
- Formatting (paragraphs, line breaks)
- Proper nouns (names, places, organizations) - keep unchanged
- Numbers and dates in appropriate format for target language
- Technical political terms with accurate equivalents`;

  const userPrompt = `Translate the following ${sourceLanguage} text to ${targetLanguage}.
Maintain professional journalistic tone and preserve all formatting.

Text to translate:
${text}

Respond ONLY with the translated text, no explanations or comments.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3, // Lower temperature for more consistent translations
      },
      contents: userPrompt,
    });

    const translatedText = response.text?.trim();
    if (!translatedText) {
      throw new Error("Empty translation response");
    }

    return translatedText;
  } catch (error) {
    console.error(`Translation error (${sourceLocale} -> ${targetLocale}):`, error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function translateArticle(
  articleId: string,
  targetLocale: SupportedLocale
): Promise<Translation> {
  // Check if translation already exists
  const [existingTranslation] = await db
    .select()
    .from(translations)
    .where(
      and(
        eq(translations.articleId, articleId),
        eq(translations.locale, targetLocale)
      )
    );

  if (existingTranslation) {
    return existingTranslation;
  }

  // Get original article
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId));

  if (!article) {
    throw new Error(`Article not found: ${articleId}`);
  }

  // Translate title, summary, and content
  const [translatedTitle, translatedSummary, translatedContent] = await Promise.all([
    translateWithGemini(article.title, targetLocale, 'es', 'article'),
    article.summary ? translateWithGemini(article.summary, targetLocale, 'es', 'article') : Promise.resolve(null),
    translateWithGemini(article.content, targetLocale, 'es', 'article'),
  ]);

  // Save translation to database
  const [newTranslation] = await db
    .insert(translations)
    .values({
      articleId,
      locale: targetLocale,
      title: translatedTitle,
      summary: translatedSummary,
      content: translatedContent,
    })
    .returning();

  return newTranslation;
}

export async function translateCategory(
  categoryId: string,
  targetLocale: SupportedLocale
): Promise<CategoryTranslation> {
  // Check if translation already exists
  const [existingTranslation] = await db
    .select()
    .from(categoryTranslations)
    .where(
      and(
        eq(categoryTranslations.categoryId, categoryId),
        eq(categoryTranslations.locale, targetLocale)
      )
    );

  if (existingTranslation) {
    return existingTranslation;
  }

  // Get original category
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId));

  if (!category) {
    throw new Error(`Category not found: ${categoryId}`);
  }

  // Translate name and description
  const [translatedName, translatedDescription] = await Promise.all([
    translateWithGemini(category.name, targetLocale, 'es', 'category'),
    category.description ? translateWithGemini(category.description, targetLocale, 'es', 'category') : Promise.resolve(null),
  ]);

  // Save translation to database
  const [newTranslation] = await db
    .insert(categoryTranslations)
    .values({
      categoryId,
      locale: targetLocale,
      name: translatedName,
      description: translatedDescription,
    })
    .returning();

  return newTranslation;
}

export async function translateText(
  text: string,
  targetLocale: SupportedLocale,
  sourceLocale: string = 'es'
): Promise<string> {
  return translateWithGemini(text, targetLocale, sourceLocale);
}

export function getSupportedLocales() {
  return Object.keys(SUPPORTED_LOCALES);
}

export function getLocaleInfo(locale: string) {
  return SUPPORTED_LOCALES[locale as SupportedLocale] || SUPPORTED_LOCALES.es;
}
