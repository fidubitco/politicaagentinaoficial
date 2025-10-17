import { GoogleGenAI } from "@google/genai";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { translations, categoryTranslations, articles, categories } from "@shared/schema";
import type { Translation, CategoryTranslation } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Lazy initialization of database connection
let db: ReturnType<typeof drizzle> | null = null;
let ai: GoogleGenAI | null = null;

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

function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required for translation");
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

// Supported locales with their native names - 50 languages
export const SUPPORTED_LOCALES = {
  // Primary languages
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇦🇷', rtl: false },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },

  // European languages
  nl: { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
  pl: { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', rtl: false },
  da: { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', rtl: false },
  no: { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', rtl: false },
  fi: { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', rtl: false },
  cs: { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', rtl: false },
  hu: { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', rtl: false },
  ro: { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', rtl: false },
  el: { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', rtl: false },

  // Asian languages
  ko: { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  th: { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
  vi: { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  id: { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  ms: { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false },

  // Middle Eastern languages
  fa: { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  he: { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  tr: { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },

  // Other European
  uk: { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', rtl: false },
  bg: { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', rtl: false },
  sr: { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', rtl: false },
  hr: { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', rtl: false },
  sk: { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', rtl: false },
  sl: { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', rtl: false },

  // Americas
  ca: { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', rtl: false },
  eu: { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', rtl: false },
  gl: { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', rtl: false },

  // African languages
  sw: { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', rtl: false },
  zu: { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', rtl: false },
  xh: { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', rtl: false },

  // Additional major languages
  lt: { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', rtl: false },
  lv: { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', rtl: false },
  et: { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', rtl: false },
  is: { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', rtl: false },
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish', en: 'English', pt: 'Portuguese', fr: 'French', de: 'German',
  it: 'Italian', ja: 'Japanese', zh: 'Chinese', ru: 'Russian', ar: 'Arabic',
  nl: 'Dutch', pl: 'Polish', sv: 'Swedish', da: 'Danish', no: 'Norwegian',
  fi: 'Finnish', cs: 'Czech', hu: 'Hungarian', ro: 'Romanian', el: 'Greek',
  ko: 'Korean', th: 'Thai', vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay',
  hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu', mr: 'Marathi',
  fa: 'Persian', ur: 'Urdu', he: 'Hebrew', tr: 'Turkish',
  uk: 'Ukrainian', bg: 'Bulgarian', sr: 'Serbian', hr: 'Croatian',
  sk: 'Slovak', sl: 'Slovenian', ca: 'Catalan', eu: 'Basque', gl: 'Galician',
  sw: 'Swahili', zu: 'Zulu', xh: 'Xhosa',
  lt: 'Lithuanian', lv: 'Latvian', et: 'Estonian', is: 'Icelandic',
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
    const response = await getAI().models.generateContent({
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
  const database = getDb();
  const [existingTranslation] = await database
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
  const [article] = await database
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
  const [newTranslation] = await database
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
  const database = getDb();
  const [existingTranslation] = await database
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
  const [category] = await database
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
  const [newTranslation] = await database
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
