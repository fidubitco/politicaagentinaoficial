import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { articles, categories, sources } from "../../shared/schema";
import { eq, sql } from "drizzle-orm";
import { generateDiverseArticles } from "../lib/massive-article-generator";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const CATEGORY_ARTICLE_COUNTS = {
  "Política Nacional": 60,
  "Economía": 50,
  "Internacional": 40,
  "Justicia": 45,
  "Provincias": 35,
  "Sociedad": 30,
  "Opinión": 25,
};

async function main() {
  console.log('🚀 Iniciando generación masiva de artículos profesionales...\n');

  // Get or create source
  const [source] = await db.select().from(sources).where(eq(sources.name, 'POLÍTICA ARGENTINA')).limit(1);
  const sourceId = source?.id || (await db.insert(sources).values({
    name: 'POLÍTICA ARGENTINA',
    url: 'https://politica-argentina.replit.app',
    credibilityScore: 95,
    isActive: true,
  }).returning())[0].id;

  let totalGenerated = 0;
  let totalErrors = 0;

  for (const [categoryName, count] of Object.entries(CATEGORY_ARTICLE_COUNTS)) {
    try {
      console.log(`\n📰 Categoría: ${categoryName} (${count} artículos)`);
      console.log('─'.repeat(60));

      // Get or create category
      const [category] = await db.select().from(categories).where(eq(categories.name, categoryName)).limit(1);
      
      if (!category) {
        console.log(`⚠️  Categoría "${categoryName}" no encontrada, saltando...`);
        continue;
      }

      const categoryId = category.id;

      // Generate articles for this category
      const generatedArticles = await generateDiverseArticles({
        categoryId,
        categoryName,
        sourceId,
        count,
      });

      // Insert all articles
      for (const article of generatedArticles) {
        try {
          await db.insert(articles).values(article);
          totalGenerated++;
          console.log(`✅ ${totalGenerated}. ${article.title.substring(0, 80)}...`);
        } catch (error) {
          console.error(`❌ Error insertando artículo:`, error);
          totalErrors++;
        }
      }

      console.log(`\n✓ Completado: ${categoryName} - ${generatedArticles.length} artículos generados`);
    } catch (error) {
      console.error(`\n❌ Error en categoría ${categoryName}:`, error);
      totalErrors++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('═'.repeat(60));
  console.log(`✅ Artículos generados: ${totalGenerated}`);
  console.log(`❌ Errores: ${totalErrors}`);
  console.log(`📈 Total esperado: ${Object.values(CATEGORY_ARTICLE_COUNTS).reduce((a, b) => a + b, 0)}`);
  console.log('\n🎉 ¡Generación completada!\n');

  await pool.end();
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
