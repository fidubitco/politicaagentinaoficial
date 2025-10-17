import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required for article generation");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GeneratedArticle {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
}

export async function generateWorldClassArticle(
  topic?: string,
  categoryName?: string
): Promise<GeneratedArticle> {
  const topicPrompt = topic || "política argentina actual y análisis económico del momento";
  const categoryContext = categoryName ? ` en la categoría de ${categoryName}` : "";

  const systemPrompt = `Eres un periodista argentino profesional de nivel mundial, especializado en análisis político y económico de Argentina. 
Escribe artículos con la calidad editorial de The New York Times, Bloomberg y The Economist, pero enfocados en Argentina.

IMPORTANTE:
- Usa un tono profesional, objetivo y analítico
- Incluye datos concretos y contexto histórico cuando sea relevante
- Escribe en español argentino formal
- El contenido debe ser original, informativo y de alta calidad editorial
- Incluye perspectivas múltiples cuando sea apropiado
- Evita sensacionalismo, mantén rigor periodístico`;

  const userPrompt = `Genera un artículo periodístico profesional sobre: ${topicPrompt}${categoryContext}

El artículo debe incluir:
1. Un titular impactante y profesional (máximo 120 caracteres)
2. Un resumen ejecutivo de 2-3 oraciones (150-200 caracteres)
3. Contenido principal desarrollado en al menos 800 palabras, estructurado en:
   - Introducción contextual
   - Desarrollo con análisis profundo
   - Perspectivas y opiniones de expertos (pueden ser ficticias pero creíbles)
   - Implicaciones y conclusiones
4. Nombre de un autor creíble (periodista argentino)

Responde SOLO con JSON en este formato exacto:
{
  "title": "titular aquí",
  "summary": "resumen aquí",
  "content": "contenido completo aquí con párrafos separados por \\n\\n",
  "author": "Nombre del Autor"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            summary: { type: "string" },
            content: { type: "string" },
            author: { type: "string" },
          },
          required: ["title", "summary", "content", "author"],
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Respuesta vacía del modelo");
    }

    const data = JSON.parse(rawJson);
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      title: data.title,
      slug,
      summary: data.summary,
      content: data.content,
      author: data.author,
    };
  } catch (error) {
    console.error("Error generando artículo:", error);
    throw new Error(`Error al generar artículo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}
