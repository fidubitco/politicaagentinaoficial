import type { InsertArticle } from "@shared/schema";
import { imageSearchService } from "../services/imageSearch";
import { generateLocalArticle, generateAuthor, calculateCredibilityScore, generateViewCount } from "./local-article-generator";

interface ArticleGenerationConfig {
  categoryId: string;
  categoryName: string;
  sourceId: string;
  count: number;
}

const CATEGORY_TEMPLATES = {
  "Casa Rosada": [
    "Presidente anuncia medidas sobre {tema} desde Casa Rosada",
    "Gabinete nacional debate estrategia para {tema}",
    "Vocero presidencial confirma postura oficial sobre {tema}",
    "Decreto del Ejecutivo regula {tema}",
    "Cumbre en Casa Rosada define política de {tema}",
    "Presidente recibe a {actor1} para tratar {tema}",
    "Jefe de Gabinete defiende decisión sobre {tema}",
    "Casa Rosada desmiente versiones sobre {tema}",
    "Gobierno nacional lanza plan integral de {tema}",
    "Mensaje presidencial aborda crisis de {tema}",
    "Reforma del Ejecutivo modifica {tema}",
    "Presidente viaja a {provincia} para anunciar {tema}",
    "Casa Rosada convoca al diálogo sobre {tema}",
    "Ministros coordinan acciones para {tema}",
    "Poder Ejecutivo envía proyecto sobre {tema} al Congreso",
  ],
  "Congreso": [
    "Senado aprueba proyecto de ley sobre {tema}",
    "Diputados debate modificaciones a {tema}",
    "Comisión bicameral analiza {tema}",
    "Oposición presenta proyecto alternativo sobre {tema}",
    "Legisladores alcanzan consenso sobre {tema}",
    "Sesión extraordinaria tratará {tema}",
    "Bloque oficialista impulsa {tema} en Congreso",
    "Senadores cuestionan falta de avances en {tema}",
    "Diputados aprueban por amplia mayoría {tema}",
    "Debate parlamentario sobre {tema} genera tensión",
    "Congreso cita a ministros por {tema}",
    "Comisión de {tema} emite dictamen favorable",
    "Legisladores de {provincia} reclaman por {tema}",
    "Sesión maratónica define futuro de {tema}",
    "Congreso sanciona ley histórica sobre {tema}",
  ],
  "Justicia": [
    "Corte Suprema falla sobre {tema}",
    "Fiscalía Federal investiga causa de {tema}",
    "Juez ordena medidas cautelares por {tema}",
    "Tribunal Oral avanza en juicio sobre {tema}",
    "Defensa apela fallo en caso {tema}",
    "Procurador General se expide sobre {tema}",
    "Cámara Federal confirma procesamiento por {tema}",
    "Peritos presentan informe clave en caso {tema}",
    "Fiscalía pide prisión preventiva en causa {tema}",
    "Querella amplía denuncia por {tema}",
    "Corte declara inconstitucional {tema}",
    "Juicio oral por {tema} comienza próxima semana",
    "Defensoría del Pueblo interviene en {tema}",
    "Suprema Corte provincial se expide sobre {tema}",
    "Casación revoca condena en caso {tema}",
  ],
  "Economía": [
    "Dólar registra nueva volatilidad por {tema}",
    "Banco Central interviene ante {tema}",
    "FMI evalúa impacto de {tema} en Argentina",
    "Mercados reaccionan con cautela a {tema}",
    "Inflación acelera debido a {tema}",
    "Ministerio de Economía anuncia medidas sobre {tema}",
    "Exportaciones afectadas por {tema}",
    "Inversores extranjeros analizan {tema}",
    "Bonos soberanos caen ante {tema}",
    "Reservas del BCRA impactadas por {tema}",
    "Cepo cambiario se endurece por {tema}",
    "Tasas de interés suben ante {tema}",
    "Déficit fiscal crece debido a {tema}",
    "Acuerdo con FMI condiciona {tema}",
    "Dólar blue alcanza récord por {tema}",
  ],
  "Provincias": [
    "Gobernador de {provincia} anuncia plan sobre {tema}",
    "Legislatura provincial aprueba {tema}",
    "Intendentes reclaman a Nación por {tema}",
    "Conflicto entre provincia y Nación por {tema}",
    "Obras públicas en {provincia} contemplan {tema}",
    "Coparticipación federal afecta {tema} en provincias",
    "Cumbre de gobernadores debate {tema}",
    "Desarrollo regional en {provincia}: {tema}",
    "{provincia} lidera innovación en {tema}",
    "Crisis en {provincia} por falta de fondos para {tema}",
    "Gobernador viaja a Casa Rosada para tratar {tema}",
    "Consejo Federal analiza {tema}",
    "Reforma provincial modifica {tema}",
    "Municipios de {provincia} reclaman por {tema}",
    "Acuerdo interprovincial sobre {tema}",
  ],
  "Municipios": [
    "Intendente lanza programa municipal de {tema}",
    "Concejo Deliberante debate ordenanza sobre {tema}",
    "Municipios reclaman fondos para {tema}",
    "Gestión local implementa {tema} con éxito",
    "Intendentes se reúnen para coordinar {tema}",
    "Obras municipales priorizan {tema}",
    "Secretaría comunal informa sobre {tema}",
    "Vecinos participan en audiencia pública por {tema}",
    "Municipio firma convenio sobre {tema}",
    "Descentralización permite avances en {tema}",
    "Comuna lidera ranking nacional en {tema}",
    "Intendente inaugura centro de {tema}",
    "Protesta vecinal por demoras en {tema}",
    "Municipio recibe premio por gestión de {tema}",
    "Plan estratégico municipal contempla {tema}",
  ],
  "Internacional": [
    "Argentina y {país} firman acuerdo sobre {tema}",
    "Cumbre presidencial aborda {tema}",
    "Mercosur debate posición conjunta sobre {tema}",
    "Relaciones con {país} se tensan por {tema}",
    "Embajador argentino presenta credenciales en {país} para tratar {tema}",
    "Organización internacional reconoce a Argentina por {tema}",
    "Gira presidencial por {país} incluye {tema}",
    "Comunidad internacional pide a Argentina sobre {tema}",
    "Tratado bilateral con {país} regula {tema}",
    "Argentina asume presidencia del grupo sobre {tema}",
    "Cancillería emite comunicado sobre {tema} internacional",
    "Visita de mandatario de {país} aborda {tema}",
    "Argentina se posiciona en la ONU sobre {tema}",
    "Relaciones comerciales con {país} impactan {tema}",
    "Diplomacia argentina negocia {tema} con {país}",
  ],
  "Seguridad": [
    "Fuerzas federales intervienen en operativo contra {tema}",
    "Ministerio de Seguridad anuncia plan para {tema}",
    "Gendarmería refuerza presencia por {tema}",
    "Policía Federal desbarata organización de {tema}",
    "Defensa Nacional adapta estrategia ante {tema}",
    "Protocolo de seguridad se actualiza para {tema}",
    "Ciberdelito: nuevas medidas contra {tema}",
    "Fronteras se blindan ante {tema}",
    "Capacitación de fuerzas en {tema}",
    "Cooperación internacional combate {tema}",
    "Tecnología de seguridad mejora control de {tema}",
    "Ministerio lanza app para denunciar {tema}",
    "Operativo conjunto desactiva {tema}",
    "Informe oficial revela datos sobre {tema}",
    "Seguridad pública prioriza prevención de {tema}",
  ],
  "Energía": [
    "Vaca Muerta alcanza récord en producción de {tema}",
    "Tarifas de {tema} se actualizan",
    "Inversión energética prioriza {tema}",
    "Renovables: Argentina avanza en {tema}",
    "YPF anuncia proyecto sobre {tema}",
    "Subsidios energéticos impactan {tema}",
    "Matriz energética argentina incluye {tema}",
    "Gasoducto nuevo transportará {tema}",
    "Energía eólica crece gracias a {tema}",
    "Solar: nueva planta generará {tema}",
    "Litio: producción nacional de {tema} crece",
    "Hidrocarburos: regulación de {tema}",
    "Eficiencia energética mejora {tema}",
    "Exportación de gas vinculada a {tema}",
    "Transición energética contempla {tema}",
  ],
  "Educación": [
    "Universidades nacionales debaten {tema}",
    "Ministerio de Educación lanza programa de {tema}",
    "Docentes reclaman mejoras en {tema}",
    "Reforma educativa incluye {tema}",
    "CONICET presenta avances en {tema}",
    "Conectividad: escuelas reciben {tema}",
    "Evaluación nacional mide {tema}",
    "Becas para estudiantes contemplan {tema}",
    "Educación técnica incorpora {tema}",
    "Nivel inicial prioriza {tema}",
    "Secundario: nuevos contenidos sobre {tema}",
    "Alfabetización digital mejora {tema}",
    "Infraestructura escolar necesita {tema}",
    "Educación superior debate {tema}",
    "Paritarias docentes incluyen {tema}",
  ],
  "Opinión": [
    "Columna: La verdad detrás de {tema}",
    "Editorial: ¿Hacia dónde va {tema}?",
    "Análisis experto: {tema} y sus consecuencias",
    "Perspectiva: El futuro de {tema} en Argentina",
    "Reflexión: {tema} y la democracia",
    "Debate: Diferentes miradas sobre {tema}",
    "Opinión: El impacto social de {tema}",
    "Punto de vista: {tema} en contexto histórico",
    "Ensayo: La complejidad de {tema}",
    "Mirada crítica: {tema} y el poder",
    "Análisis político: {tema} divide aguas",
    "Carta abierta sobre {tema}",
    "Voces: Ciudadanos opinan sobre {tema}",
    "Editorial: La urgencia de {tema}",
    "Columna: {tema} requiere consenso nacional",
  ],
  "Datos y Visualizaciones": [
    "Infografía: evolución de {tema} en Argentina",
    "Datos: radiografía del {tema}",
    "Mapa interactivo: {tema} por provincia",
    "Estadísticas revelan realidad de {tema}",
    "Gráfico: tendencia histórica de {tema}",
    "Visualización: impacto regional de {tema}",
    "Números: presupuesto destinado a {tema}",
    "Dashboard: monitoreo en tiempo real de {tema}",
    "Indicadores económicos sobre {tema}",
    "Comparativa internacional de {tema}",
    "Timeline: cronología del {tema}",
    "Análisis cuantitativo de {tema}",
    "Big data revela patrones en {tema}",
    "Estudio: correlación entre {tema} y desarrollo",
    "Visualización 3D: distribución de {tema}",
  ],
};

const TEMAS_POR_CATEGORIA = {
  "Casa Rosada": [
    "reforma previsional", "presupuesto 2025", "decreto de necesidad y urgencia",
    "gira presidencial", "cumbre bilateral", "acuerdo político", "veto presidencial",
    "reforma del Estado", "reestructuración de ministerios", "política exterior",
    "agenda legislativa", "mensaje al Congreso", "nombramientos oficiales",
    "crisis de gabinete", "política de seguridad", "plan económico nacional",
    "relaciones institucionales", "diálogo social", "política energética",
    "acuerdo con gobernadores", "reforma tributaria", "política sanitaria",
    "digitalización del Estado", "transparencia gubernamental", "combate a la corrupción",
  ],
  "Congreso": [
    "reforma previsional", "presupuesto nacional", "ley de emergencia",
    "sesión extraordinaria", "debate parlamentario", "comisión bicameral",
    "acuerdo entre bloques", "dictamen de mayoría", "veto legislativo",
    "juicio político", "interpelación ministerial", "reforma electoral",
    "ley de alquileres", "reforma laboral", "ley de medios",
    "financiamiento político", "presupuesto universitario", "obra pública",
    "acuerdo con el FMI", "tratado internacional", "régimen promocional",
    "ley de educación", "código procesal", "reforma judicial",
  ],
  "Justicia": [
    "corrupción estatal", "lavado de dinero", "narcotráfico",
    "reforma procesal", "prisión preventiva", "libertad condicional",
    "juicio oral", "Corte Suprema", "fuero federal",
    "causa AMIA", "megacausa", "expropiación", "hábeas corpus",
    "derechos humanos", "femicidio", "ciberdelito", "trata de personas",
    "violencia de género", "fraude electoral", "espionaje ilegal",
    "deuda externa", "arbitraje internacional", "extradición",
  ],
  "Economía": [
    "dólar blue", "dólar oficial", "inflación mensual", "déficit fiscal",
    "reservas del BCRA", "bonos soberanos", "riesgo país", "tasas de interés",
    "cepo cambiario", "acuerdo con FMI", "exportaciones", "importaciones",
    "balanza comercial", "inversión extranjera", "blanqueo de capitales",
    "reforma impositiva", "ganancias cuarta categoría", "IVA",
    "retenciones agropecuarias", "tarifas de servicios", "salario mínimo",
    "paritarias", "inflación núcleo", "canasta básica", "PBI",
  ],
  "Provincias": [
    "Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán", "Entre Ríos",
    "Salta", "Jujuy", "San Juan", "La Rioja", "Catamarca", "Santiago del Estero",
    "coparticipación federal", "obras públicas", "infraestructura vial",
    "desarrollo productivo", "política tributaria provincial", "recursos naturales",
    "minería", "turismo provincial", "salud pública", "educación provincial",
  ],
  "Municipios": [
    "gestión de residuos", "transporte público", "seguridad municipal",
    "obras de infraestructura", "alumbrado público", "espacios verdes",
    "ordenamiento territorial", "desarrollo urbano", "tasas municipales",
    "tránsito y movilidad", "cultura comunitaria", "deportes municipales",
    "presupuesto participativo", "audiencias públicas", "descentralización",
  ],
  "Internacional": [
    "Brasil", "Chile", "Uruguay", "Estados Unidos", "China", "Rusia",
    "Unión Europea", "España", "México", "Venezuela", "Bolivia",
    "Mercosur", "CELAC", "G20", "ONU", "OEA", "FMI",
    "acuerdo comercial", "relaciones diplomáticas", "cumbre presidencial",
    "tratado bilateral", "inversión extranjera", "cooperación internacional",
  ],
  "Seguridad": [
    "narcotráfico", "crimen organizado", "ciberdelito", "terrorismo",
    "trata de personas", "femicidio", "violencia de género",
    "seguridad fronteriza", "fuerzas federales", "policía provincial",
    "gendarmería", "prefectura naval", "cárceles federales",
    "desarticulación de bandas", "protocolos de seguridad", "prevención del delito",
  ],
  "Energía": [
    "Vaca Muerta", "tarifas eléctricas", "tarifas de gas", "subsidios energéticos",
    "energías renovables", "energía eólica", "energía solar",
    "litio", "YPF", "hidrocarburos", "gasoducto", "refinerías",
    "matriz energética", "transición energética", "eficiencia energética",
  ],
  "Educación": [
    "universidades nacionales", "presupuesto educativo", "paritarias docentes",
    "evaluación Aprender", "secundario obligatorio", "educación técnica",
    "CONICET", "becas Progresar", "infraestructura escolar",
    "conectividad educativa", "alfabetización digital", "educación sexual integral",
  ],
  "Opinión": [
    "la crisis política", "el futuro económico", "la justicia social",
    "la democracia argentina", "el modelo de país", "la grieta política",
    "el rol del Estado", "la integración regional", "las próximas elecciones",
    "la deuda externa", "el cambio climático", "los derechos humanos",
  ],
  "Datos y Visualizaciones": [
    "la pobreza", "el desempleo", "la inflación", "el PBI",
    "las exportaciones", "la inversión", "el déficit fiscal",
    "la distribución del ingreso", "el acceso a servicios", "la violencia",
    "el presupuesto público", "la deuda pública", "las reservas",
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
    
    // Small delay between articles to avoid rate limiting
    if (i < config.count - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
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
  try {
    // Generate article using LOCAL generator (no API required!)
    console.log(`📝 Generando artículo local: "${idea}"`);
    const { content, summary } = generateLocalArticle(idea, categoryName);

    // Generate title and author
    const title = idea.charAt(0).toUpperCase() + idea.slice(1);
    const author = generateAuthor();
    const slug = idea.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Search for hyperrealistic contextual image using Pexels
    console.log(`🔍 Buscando imagen contextual para: "${title}"`);
    const contextualImage = await imageSearchService.searchContextualImage(
      title,
      categoryName,
      undefined,
      'landscape'
    );

    const imageUrl = contextualImage?.url || imageSearchService.getFallbackImage(categoryName);

    if (contextualImage) {
      console.log(`✅ Imagen contextual encontrada`);
    } else {
      console.log(`⚠️ Usando imagen fallback para categoría: ${categoryName}`);
    }

    return {
      title,
      slug: `${slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      summary,
      content,
      author,
      categoryId,
      sourceId,
      status: "published",
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
      viewCount: generateViewCount(),
      credibilityScore: calculateCredibilityScore(),
      imageUrl,
      metadata: contextualImage ? {
        photographer: contextualImage.photographer,
        photographerUrl: contextualImage.photographerUrl
      } : null,
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
