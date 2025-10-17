import { GoogleGenAI } from "@google/genai";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { articles, categories, sources } from "../../shared/schema";
import { sql } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const IDEAS = [
  "BOMBA JUDICIAL: La fiscal Juliana Companys, sumariada por la Justicia por su rol en la causa Zoe",
  "EXCLUSIVO: Accedimos al documento que inicia el sumario contra la fiscal del caso Cositorto",
  "SE CAYÓ LA FARSA: La Justicia investiga a la fiscal que armó la causa Generación Zoe",
  "ÚLTIMO MOMENTO: Juliana Companys será llamada a descargos por irregularidades graves",
  "De acusadora a acusada: El giro de 180 grados en el caso más polémico de la década",
  "DESOBEDIENCIA Y ESCÁNDALO: El juicio ilegal que desobedeció a la Corte Suprema",
  "Dossier Secreto: Las pruebas de la manipulación de testigos por parte de la fiscalía",
  "El bloqueo intencional de pagos: La prueba reina del sabotaje para crear víctimas",
  "La conexión política: ¿Quién le dio la orden a Juliana Companys para avanzar a toda costa?",
  "La cazadora, cazada por su propia trampa legal",
  "Efecto Dominó: El sumario a la fiscal podría anular toda la causa Generación Zoe",
  "Si la fiscal es corrupta, el caso es nulo: La estrategia de la defensa",
  "El Estado deberá pagar una cifra millonaria por este escándalo",
  "Las 7 violaciones al debido proceso que le costaron el sumario a Companys",
  "LA BALANZA ROTA: 1.284 días preso por una promesa vs. CERO días presa por el saqueo del Estado",
  "EL CHIVO EXPIATORIO PERFECTO: Cómo usaron a Cositorto para tapar el saqueo K",
  "LA CONFESIÓN DEL 130%: El Estado paga a los bancos lo que a Cositorto le costó la libertad",
  "El Apartheid Financiero: Negocio para la élite, crimen para el pueblo",
  "La estafa que sí te comió la heladera: la inflación del 150% anual",
  "Te hipnotizaron con un gurú para que no vieras a la verdadera jefa de la asociación ilícita",
  "La cronología de la distracción: Cada escándalo de Zoe coincidió con una mala noticia para la expresidenta",
  "Mientras odiabas a Cositorto, ella garantizaba su impunidad",
  "El prontuario de la impunidad: Un repaso por todas las causas de la expresidenta que duermen en la justicia",
  "El día que la Corte anuló el caso Cositorto y nada pasó",
  "EXCLUSIVA: Las escuchas telefónicas que la fiscalía ocultó durante el juicio",
  "El testimonio prohibido: Testigo clave fue amenazado para no declarar",
  "Pericia contable reveladora: No hubo estafa, hubo mala administración del Estado",
  "La carta documento que demuestra la manipulación de pruebas",
  "Informe especial: Los 10 jueces que archivaron causas contra la expresidenta",
  "El poder judicial en crisis: Jueces denuncian presiones políticas para condenar",
  "Las contradicciones en la sentencia que podrían anularla en Casación",
  "Video filtrado: Fiscal admitió no tener pruebas suficientes",
  "El rol de los medios: Cómo la prensa condenó antes que los jueces",
  "Análisis: Por qué este caso cambiará la historia judicial argentina",
  "La defensa presenta nuevas pruebas que demostrarían inocencia",
  "Especialistas internacionales cuestionan el proceso judicial argentino",
  "El impacto económico: Inversores huyen por inseguridad jurídica",
  "Entrevista exclusiva: Un abogado de la defensa revela todo",
  "Las redes sociales y la justicia: El juicio paralelo que condenó sin pruebas",
  "Cronología completa: Todos los errores procesales del caso",
  "La movida política detrás del escándalo: Quiénes se benefician",
  "El costo de la prisión preventiva: Familias destruidas sin condena firme",
  "Comparativa internacional: Cómo se juzgaría este caso en otros países",
  "El voto disidente del juez que advirtió sobre las irregularidades",
  "Revelan chats entre fiscales coordinando la estrategia mediática",
  "La ONG que denuncia violación de derechos humanos en el caso",
  "El futuro del caso: Todos los escenarios posibles tras el sumario",
  "Expertos en derecho penal analizan las consecuencias del sumario a la fiscal",
  "El efecto cascada: Otros casos podrían caerse por las mismas irregularidades",
  "Balance final: Un año del escándalo que sacudió la justicia argentina"
];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generateArticle(idea: string, categoryId: string, sourceId: string) {
  const prompt = `Eres un periodista profesional argentino. Genera un artículo periodístico completo y profesional basado en esta idea:

"${idea}"

IMPORTANTE:
- Escribe en español argentino profesional
- Usa un tono editorial serio y objetivo
- Incluye datos, contexto y análisis profundo
- Mínimo 800 palabras
- Usa subtítulos para organizar el contenido
- Evita sensacionalismo, mantén objetividad periodística
- Cita fuentes genéricas ("fuentes judiciales", "según el expediente", "de acuerdo a documentos oficiales")
- Incluye consecuencias y posibles escenarios futuros

Responde SOLO con JSON en este formato exacto:
{
  "title": "Título del artículo (60-80 caracteres)",
  "summary": "Resumen ejecutivo del artículo (120-150 caracteres)",
  "content": "Contenido completo del artículo en HTML con <p>, <h2>, <h3>, <strong>, <em>",
  "slug": "slug-url-amigable-del-titulo"
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    }
  });
  
  const responseText = response.text || "";
  
  // Extract JSON from markdown code blocks if present
  let jsonText = responseText;
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1] || responseText;
  }
  
  const articleData = JSON.parse((jsonText || "{}").trim());
  
  // Insert into database
  const [inserted] = await db.insert(articles).values({
    title: articleData.title,
    slug: articleData.slug + `-${Date.now()}`, // Ensure uniqueness
    summary: articleData.summary,
    content: articleData.content,
    categoryId: categoryId,
    sourceId: sourceId,
    status: 'published',
    publishedAt: new Date(),
    viewCount: Math.floor(Math.random() * 5000) + 1000, // Random views between 1k-6k
    credibilityScore: 85,
  }).returning();
  
  return inserted;
}

async function main() {
  console.log('🚀 Iniciando generación de 50 artículos...\n');
  
  // Get or create category for "Escándalo Judicial"
  const [category] = await db.select().from(categories).where(sql`${categories.name} = 'Escándalo Judicial'`).limit(1);
  const categoryId = category?.id || (await db.insert(categories).values({
    name: 'Escándalo Judicial',
    slug: 'escandalo-judicial',
    description: 'Investigaciones y revelaciones sobre casos judiciales polémicos',
    color: '#DC2626',
    priority: 10,
    isFeatured: true,
  }).returning())[0].id;

  // Get or create source
  const [source] = await db.select().from(sources).where(sql`${sources.name} = 'POLÍTICA ARGENTINA'`).limit(1);
  const sourceId = source?.id || (await db.insert(sources).values({
    name: 'POLÍTICA ARGENTINA',
    url: 'https://politica-argentina.replit.app',
    credibilityScore: 95,
    isActive: true,
  }).returning())[0].id;

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < IDEAS.length; i++) {
    try {
      console.log(`📝 [${i + 1}/${IDEAS.length}] Generando: "${IDEAS[i].substring(0, 60)}..."`);
      const article = await generateArticle(IDEAS[i], categoryId, sourceId);
      console.log(`✅ Creado: ${article.title}\n`);
      successCount++;
      
      // Rate limiting: wait 2 seconds between requests
      if (i < IDEAS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Error generando artículo ${i + 1}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📈 Total: ${IDEAS.length}`);
  console.log('\n🎉 ¡Generación completada!');
  
  process.exit(0);
}

main().catch(console.error);
