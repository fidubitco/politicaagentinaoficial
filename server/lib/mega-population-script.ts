import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { articles, categories, sources } from '@shared/schema';
import { defaultCategories } from './category-seed';
import { generateDiverseArticles } from './massive-article-generator';
import { scrapeAllCompetitors } from './enhanced-scraper';
import { imageEnrichmentService } from '../services/imageEnrichment';
import { eq } from 'drizzle-orm';

// Lazy initialization
let db: ReturnType<typeof drizzle> | null = null;

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

export interface PopulationStats {
  totalGenerated: number;
  totalScraped: number;
  categoriesPopulated: number;
  articlesWithImages: number;
  timeElapsed: string;
}

// Mapa de categorías del seed a categorías de generación
const CATEGORY_MAP: Record<string, string> = {
  "casa-rosada": "Casa Rosada",
  "congreso": "Congreso",
  "justicia": "Justicia",
  "economia": "Economía",
  "provincias": "Provincias",
  "municipios": "Municipios",
  "internacional": "Internacional",
  "seguridad": "Seguridad",
  "energia": "Energía",
  "educacion": "Educación",
  "opinion": "Opinión",
  "datos-visualizaciones": "Datos y Visualizaciones",
};

/**
 * MEGA SCRIPT: Pobla la base de datos con 600+ artículos profesionales
 * - 10-15 artículos scrapeados de competidores por categoría relevante
 * - 35-40 artículos generados con AI por categoría
 * - Imágenes contextuales para TODOS los artículos
 */
export async function populateEntireDatabase(): Promise<PopulationStats> {
  const startTime = Date.now();
  console.log('\n🚀 INICIANDO MEGA POBLACIÓN DE BASE DE DATOS\n');
  console.log('=' .repeat(60));

  let totalGenerated = 0;
  let totalScraped = 0;
  let articlesWithImages = 0;

  try {
    // PASO 1: Crear categorías si no existen
    console.log('\n📁 PASO 1: Verificando categorías...\n');
    const existingCategories = await getDb().select().from(categories);

    if (existingCategories.length === 0) {
      console.log('Creando categorías base...');
      await getDb().insert(categories).values(defaultCategories);
      console.log('✅ Categorías creadas exitosamente');
    } else {
      console.log(`✅ ${existingCategories.length} categorías ya existen`);
    }

    // PASO 2: Crear fuente principal
    console.log('\n📰 PASO 2: Verificando fuente principal...\n');
    let [source] = await getDb()
      .select()
      .from(sources)
      .where(eq(sources.name, 'POLÍTICA ARGENTINA'))
      .limit(1);

    if (!source) {
      [source] = await getDb().insert(sources).values({
        name: 'POLÍTICA ARGENTINA',
        url: 'https://politica-argentina.com',
        credibilityScore: 95,
        isActive: true,
      }).returning();
      console.log('✅ Fuente principal creada');
    } else {
      console.log('✅ Fuente principal ya existe');
    }

    // PASO 3: Scrapear artículos de competidores
    console.log('\n🔍 PASO 3: Scrapeando competidores (Clarín, La Nación, Infobae)...\n');
    console.log('Este proceso puede tomar varios minutos...\n');

    const scrapedData = await scrapeAllCompetitors();
    const allScraped = [
      ...scrapedData.clarín,
      ...scrapedData.laNacion,
      ...scrapedData.infobae
    ];

    console.log(`\n✅ Scraping completado: ${scrapedData.total} artículos obtenidos`);
    console.log(`   - Clarín: ${scrapedData.clarín.length} artículos`);
    console.log(`   - La Nación: ${scrapedData.laNacion.length} artículos`);
    console.log(`   - Infobae: ${scrapedData.infobae.length} artículos`);

    // PASO 4: Insertar artículos scrapeados
    console.log('\n💾 PASO 4: Guardando artículos scrapeados en base de datos...\n');

    for (const scrapedArticle of allScraped) {
      try {
        // Buscar categoría correspondiente
        const categorySlug = scrapedArticle.category === 'Economía' ? 'economia' :
                           scrapedArticle.category === 'Política Nacional' ? 'casa-rosada' :
                           'congreso';

        const [category] = await getDb()
          .select()
          .from(categories)
          .where(eq(categories.slug, categorySlug))
          .limit(1);

        if (!category) continue;

        await getDb().insert(articles).values({
          title: scrapedArticle.title,
          slug: `${scrapedArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          summary: scrapedArticle.summary,
          content: scrapedArticle.content,
          author: scrapedArticle.author || 'Redacción',
          categoryId: category.id,
          sourceId: source.id,
          status: 'published',
          publishedAt: scrapedArticle.publishedAt,
          viewCount: Math.floor(Math.random() * 5000) + 1000,
          credibilityScore: 92,
          imageUrl: scrapedArticle.imageUrl || null,
        });

        totalScraped++;
        if (scrapedArticle.imageUrl) articlesWithImages++;

        console.log(`  ✓ Guardado: ${scrapedArticle.title.substring(0, 60)}...`);

      } catch (error) {
        console.error(`  ✗ Error guardando artículo: ${error}`);
      }
    }

    console.log(`\n✅ ${totalScraped} artículos scrapeados guardados exitosamente`);

    // PASO 5: Generar artículos AI para cada categoría (50 por categoría)
    console.log('\n🤖 PASO 5: Generando artículos con AI (50 por categoría)...\n');
    console.log('Este es el proceso más extenso. Generando 600+ artículos profesionales...\n');

    const allCategories = await getDb().select().from(categories);

    for (const category of allCategories) {
      const categoryName = CATEGORY_MAP[category.slug];

      if (!categoryName) {
        console.log(`⚠️  Saltando categoría sin mapa: ${category.slug}`);
        continue;
      }

      console.log(`\n📝 Generando 50 artículos para: ${category.name}...`);
      console.log(`   Categoría AI: ${categoryName}`);

      try {
        const generatedArticles = await generateDiverseArticles({
          categoryId: category.id,
          categoryName: categoryName,
          sourceId: source.id,
          count: 50,
        });

        // Insertar artículos generados
        for (const article of generatedArticles) {
          await getDb().insert(articles).values(article);
          totalGenerated++;
          if (article.imageUrl) articlesWithImages++;
        }

        console.log(`   ✅ ${generatedArticles.length} artículos generados e insertados`);

      } catch (error) {
        console.error(`   ❌ Error generando artículos para ${category.name}:`, error);
      }

      // Pequeña pausa entre categorías para evitar rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // PASO 6: Enriquecer artículos sin imágenes
    console.log('\n🖼️  PASO 6: Enriqueciendo artículos sin imágenes...\n');

    const stats = await imageEnrichmentService.getImageStats();
    console.log(`   Total de artículos: ${stats.totalArticles}`);
    console.log(`   Con imágenes: ${stats.withImages} (${stats.coverage}%)`);
    console.log(`   Sin imágenes: ${stats.withoutImages}`);

    if (stats.withoutImages > 0) {
      console.log(`\n   Enriqueciendo ${stats.withoutImages} artículos...`);
      const enrichResult = await imageEnrichmentService.enrichAllArticles();

      console.log(`   ✅ Enriquecimiento completado:`);
      console.log(`      - Exitosos: ${enrichResult.success}`);
      console.log(`      - Fallidos: ${enrichResult.failed}`);

      articlesWithImages += enrichResult.success;
    }

    // PASO 7: Estadísticas finales
    const endTime = Date.now();
    const timeElapsed = `${((endTime - startTime) / 1000 / 60).toFixed(2)} minutos`;

    console.log('\n' + '='.repeat(60));
    console.log('🎉 POBLACIÓN COMPLETADA EXITOSAMENTE\n');
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log(`   - Artículos scrapeados: ${totalScraped}`);
    console.log(`   - Artículos generados con AI: ${totalGenerated}`);
    console.log(`   - Total de artículos: ${totalScraped + totalGenerated}`);
    console.log(`   - Categorías pobladas: ${allCategories.length}`);
    console.log(`   - Artículos con imágenes: ${articlesWithImages}`);
    console.log(`   - Tiempo transcurrido: ${timeElapsed}`);
    console.log('=' .repeat(60) + '\n');

    return {
      totalGenerated,
      totalScraped,
      categoriesPopulated: allCategories.length,
      articlesWithImages,
      timeElapsed,
    };

  } catch (error) {
    console.error('\n❌ ERROR EN POBLACIÓN:', error);
    throw error;
  }
}

/**
 * Populate a single category with articles
 */
export async function populateSingleCategory(
  categorySlug: string,
  count: number = 50
): Promise<number> {
  console.log(`\n🚀 Poblando categoría: ${categorySlug} con ${count} artículos\n`);

  const [category] = await getDb()
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);

  if (!category) {
    throw new Error(`Categoría no encontrada: ${categorySlug}`);
  }

  const [source] = await getDb()
    .select()
    .from(sources)
    .where(eq(sources.name, 'POLÍTICA ARGENTINA'))
    .limit(1);

  if (!source) {
    throw new Error('Fuente principal no encontrada');
  }

  const categoryName = CATEGORY_MAP[categorySlug];
  if (!categoryName) {
    throw new Error(`Sin mapeo para categoría: ${categorySlug}`);
  }

  const generatedArticles = await generateDiverseArticles({
    categoryId: category.id,
    categoryName: categoryName,
    sourceId: source.id,
    count,
  });

  let inserted = 0;
  for (const article of generatedArticles) {
    await getDb().insert(articles).values(article);
    inserted++;
  }

  console.log(`✅ ${inserted} artículos insertados para ${category.name}\n`);
  return inserted;
}

// Ejecutar script si se llama directamente
// Note: ES module check disabled to allow API imports
