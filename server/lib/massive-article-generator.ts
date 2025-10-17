import { GoogleGenAI } from "@google/genai";
import type { InsertArticle } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ArticleGenerationConfig {
  categoryId: string;
  categoryName: string;
  sourceId: string;
  count: number;
}

const CATEGORY_TEMPLATES = {
  "Política Nacional": [
    "Análisis de última sesión del Congreso sobre {tema}",
    "Conflicto político entre {actor1} y {actor2} por {tema}",
    "Nueva estrategia del gobierno para {tema}",
    "Oposición cuestiona medidas sobre {tema}",
    "Encuesta revela opinión pública sobre {tema}",
  ],
  "Economía": [
    "Impacto económico de {tema} en Argentina",
    "Mercados reaccionan a {tema}",
    "Análisis del dólar y {tema}",
    "Inflación y su relación con {tema}",
    "Inversores evalúan {tema}",
  ],
  "Internacional": [
    "Argentina y {país} negocian sobre {tema}",
    "Impacto global de {tema} en Latinoamérica",
    "Comunidad internacional opina sobre {tema}",
    "Relaciones diplomáticas argentinas con {país} por {tema}",
  ],
  "Justicia": [
    "Nuevo fallo judicial sobre {tema}",
    "Causa judicial por {tema} avanza en tribunales",
    "Fiscalía investiga {tema}",
    "Defensa presenta alegatos en caso {tema}",
  ],
  "Provincias": [
    "Gobierno provincial de {provincia} anuncia medidas sobre {tema}",
    "Conflicto en {provincia} por {tema}",
    "Desarrollo regional en {provincia}: {tema}",
  ],
  "Sociedad": [
    "Movimientos sociales se movilizan por {tema}",
    "Debate público sobre {tema}",
    "Nuevo estudio revela datos sobre {tema}",
  ],
  "Opinión": [
    "Columna: La verdad detrás de {tema}",
    "Editorial: ¿Hacia dónde va {tema}?",
    "Análisis experto: {tema} y sus consecuencias",
  ],
};

const TEMAS_POR_CATEGORIA = {
  "Política Nacional": [
    "reforma previsional", "presupuesto 2025", "elecciones provinciales",
    "reforma judicial", "seguridad pública", "decreto presidencial",
    "sesiones extraordinarias", "acuerdo político multipartidario",
    "crisis de gabinete", "reforma electoral", "veto presidencial",
    "conflicto con provincias", "reforma tributaria", "política energética",
  ],
  "Economía": [
    "tipo de cambio", "inflación mensual", "déficit fiscal",
    "inversión extranjera", "reservas del BCRA", "bonos soberanos",
    "acuerdo con FMI", "exportaciones agropecuarias", "tasas de interés",
    "cepo cambiario", "blanqueo de capitales", "reforma impositiva",
  ],
  "Internacional": [
    "Brasil", "Chile", "Uruguay", "Estados Unidos", "China", "UE",
    "Mercosur", "cumbre presidencial", "relaciones comerciales",
    "deuda externa", "Venezuela", "México", "España",
  ],
  "Justicia": [
    "corrupción estatal", "causa de lavado de dinero", "reforma procesal",
    "narcotráfico", "trata de personas", "juicio oral y público",
    "prisión preventiva", "libertad condicional", "Corte Suprema",
  ],
  "Provincias": [
    "Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán",
    "infraestructura vial", "coparticipación federal", "obras públicas",
  ],
  "Sociedad": [
    "educación pública", "salud mental", "vivienda social",
    "derechos humanos", "medio ambiente", "cambio climático",
    "género y diversidad", "pueblos originarios",
  ],
  "Opinión": [
    "la crisis política", "el futuro económico", "la justicia social",
    "la democracia argentina", "el modelo de país",
  ],
};

export async function generateDiverseArticles(config: ArticleGenerationConfig): Promise<InsertArticle[]> {
  const templates = CATEGORY_TEMPLATES[config.categoryName as keyof typeof CATEGORY_TEMPLATES] || [];
  const temas = TEMAS_POR_CATEGORIA[config.categoryName as keyof typeof TEMAS_POR_CATEGORIA] || [];
  
  if (templates.length === 0 || temas.length === 0) {
    throw new Error(`No templates or themes found for category: ${config.categoryName}`);
  }

  const articles: InsertArticle[] = [];

  for (let i = 0; i < config.count; i++) {
    const template = templates[i % templates.length];
    const tema = temas[Math.floor(Math.random() * temas.length)];
    
    let idea = template.replace("{tema}", tema);
    
    // Replace placeholders
    if (idea.includes("{actor1}")) {
      const actores = ["el oficialismo", "la oposición", "el PRO", "La Libertad Avanza", "el kirchnerismo", "la UCR"];
      idea = idea.replace("{actor1}", actores[Math.floor(Math.random() * actores.length)]);
    }
    if (idea.includes("{actor2}")) {
      const actores = ["el Senado", "Diputados", "gobernadores", "sindicatos", "empresarios"];
      idea = idea.replace("{actor2}", actores[Math.floor(Math.random() * actores.length)]);
    }
    if (idea.includes("{país}")) {
      const paises = ["Brasil", "Chile", "Estados Unidos", "China", "España", "Uruguay"];
      idea = idea.replace("{país}", paises[Math.floor(Math.random() * paises.length)]);
    }
    if (idea.includes("{provincia}")) {
      const provincias = ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos"];
      idea = idea.replace("{provincia}", provincias[Math.floor(Math.random() * provincias.length)]);
    }

    const article = await generateSingleArticle(idea, config.categoryId, config.sourceId, config.categoryName);
    articles.push(article);
    
    // Rate limit: 1 second between requests
    if (i < config.count - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return articles;
}

async function generateSingleArticle(
  idea: string,
  categoryId: string,
  sourceId: string,
  categoryName: string
): Promise<InsertArticle> {
  const prompt = `Eres un periodista profesional argentino especializado en ${categoryName}.

Genera un artículo periodístico COMPLETO Y EXTENSO basado en esta idea:
"${idea}"

REQUISITOS OBLIGATORIOS:
- Escribe en español argentino profesional
- Tono editorial serio, objetivo y balanceado
- MÍNIMO 1200 palabras (muy importante)
- Incluye: introducción, desarrollo con 4-6 subtemas, conclusión
- Usa subtítulos <h2> y <h3> para organizar
- Cita fuentes genéricas: "fuentes oficiales", "según el expediente", "documentos a los que accedió POLÍTICA ARGENTINA"
- Incluye datos concretos, estadísticas, contexto histórico
- Analiza consecuencias políticas, económicas y sociales
- Menciona posiciones de diferentes actores políticos
- Evita sensacionalismo, mantén rigor periodístico

Responde SOLO con JSON válido:
{
  "title": "Título periodístico impactante pero serio (60-90 caracteres)",
  "summary": "Bajada o copete del artículo (140-180 caracteres)",
  "content": "Contenido COMPLETO en HTML con <p>, <h2>, <h3>, <strong>, <em>, <blockquote>",
  "slug": "slug-url-amigable",
  "author": "Nombre del autor (usa nombres argentinos realistas)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.9, // More creative variety
      }
    });

    const responseText = response.text || "{}";
    let jsonText = responseText;
    
    // Extract JSON from markdown if needed
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1] || responseText;
    }

    const data = JSON.parse(jsonText.trim());

    return {
      title: data.title,
      slug: `${data.slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      summary: data.summary,
      content: data.content,
      author: data.author || "Redacción POLÍTICA ARGENTINA",
      categoryId,
      sourceId,
      status: "published",
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      viewCount: Math.floor(Math.random() * 8000) + 500,
      credibilityScore: Math.floor(Math.random() * 15) + 85, // 85-100
      imageUrl: getRandomImageForCategory(categoryName),
    };
  } catch (error) {
    console.error("Error generating article:", error);
    throw error;
  }
}

function getRandomImageForCategory(categoryName: string): string {
  const imagesByCategory: Record<string, string[]> = {
    "Política Nacional": [
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200",
      "https://images.unsplash.com/photo-1495573258723-2c7be7a646ce?w=1200",
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200",
    ],
    "Economía": [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200",
      "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=1200",
    ],
    "Internacional": [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
      "https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=1200",
    ],
    "Justicia": [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200",
    ],
    "Provincias": [
      "https://images.unsplash.com/photo-1558368436-f6e1de50629b?w=1200",
      "https://images.unsplash.com/photo-1523097467655-d8e38aeef72d?w=1200",
    ],
    "Sociedad": [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200",
    ],
    "Opinión": [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200",
    ],
  };

  const images = imagesByCategory[categoryName] || [
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200"
  ];

  return images[Math.floor(Math.random() * images.length)];
}
