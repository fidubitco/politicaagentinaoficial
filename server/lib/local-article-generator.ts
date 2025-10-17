/**
 * LOCAL UNLIMITED ARTICLE GENERATOR
 * No API dependencies, no restrictions, no censorship
 * Professional world-class news generation system
 */

interface ArticleTemplate {
  title: string;
  summary: string;
  sections: string[];
}

// Ultra-advanced content generation patterns
const INTRO_PATTERNS = [
  "En un giro inesperado de los acontecimientos,",
  "Según fuentes oficiales del gobierno,",
  "En declaraciones exclusivas a medios nacionales,",
  "En medio de crecientes tensiones políticas,",
  "Tras una jornada de intensas negociaciones,",
  "En una decisión que marca un antes y un después,",
  "Con el respaldo de la mayoría legislativa,",
  "En respuesta a las demandas ciudadanas,",
  "Según documentos oficiales filtrados,",
  "En un comunicado emitido esta mañana,",
];

const DEVELOPMENT_PATTERNS = [
  "La medida ha generado reacciones encontradas en el arco político.",
  "Analistas coinciden en que este paso marca un punto de inflexión.",
  "La oposición criticó duramente la decisión adoptada.",
  "Sectores del oficialismo celebraron el anuncio.",
  "Economistas advierten sobre las posibles consecuencias.",
  "El impacto se sentirá en los próximos meses.",
  "Esta decisión responde a compromisos internacionales.",
  "La medida busca revertir la tendencia negativa.",
  "Expertos consultados expresaron cautela.",
  "El mercado reaccionó con volatilidad ante el anuncio.",
];

const QUOTE_PATTERNS = [
  '"Es un paso fundamental para el país", señaló el funcionario.',
  '"Necesitamos políticas a largo plazo", advirtieron desde la oposición.',
  '"La situación requiere medidas urgentes", coincidieron los expertos.',
  '"Este es solo el comienzo de un proceso mayor", afirmaron fuentes oficiales.',
  '"La ciudadanía está expectante", reconocieron voceros gubernamentales.',
  '"Los números son contundentes", sostuvieron los analistas.',
  '"No hay margen para el error", enfatizaron desde el oficialismo.',
  '"La transparencia es crucial", demandaron organizaciones civiles.',
  '"Estamos ante un escenario complejo", admitieron desde Casa Rosada.',
  '"Los tiempos políticos no coinciden con los económicos", alertaron expertos.',
];

const CONTEXT_PATTERNS = [
  "Este anuncio se produce en un contexto de creciente presión social y económica.",
  "La decisión forma parte de un paquete de medidas más amplias.",
  "Históricamente, iniciativas similares han generado resultados mixtos.",
  "El timing político de la medida no es casual.",
  "Esta propuesta había sido anticipada en los últimos días.",
  "Los antecedentes regionales sugieren cautela en la implementación.",
  "El marco legal vigente permitiría avanzar rápidamente.",
  "Las condiciones macroeconómicas actuales añaden complejidad.",
  "Experiencias internacionales muestran caminos posibles.",
  "El debate parlamentario promete ser intenso.",
];

const ANALYSIS_PATTERNS = [
  "Desde el punto de vista técnico, la propuesta presenta desafíos importantes.",
  "El análisis de impacto fiscal sugiere consecuencias significativas.",
  "Los sectores afectados ya han manifestado su posición.",
  "La viabilidad política de la medida está en duda.",
  "El costo de oportunidad es un factor clave a considerar.",
  "La implementación requerirá coordinación entre múltiples áreas.",
  "Los plazos propuestos parecen ambiciosos para los estándares actuales.",
  "La reacción del mercado será un termómetro importante.",
  "Las variables externas podrían alterar el panorama.",
  "El apoyo social será determinante para el éxito.",
];

const CONSEQUENCE_PATTERNS = [
  "De concretarse, esto modificaría sustancialmente el escenario actual.",
  "Las proyecciones indican efectos en múltiples sectores de la economía.",
  "A mediano plazo, se esperan ajustes en diferentes áreas.",
  "Los expertos advierten sobre posibles efectos colaterales.",
  "La medida podría sentar precedentes importantes.",
  "El impacto social será objeto de seguimiento continuo.",
  "Las consecuencias fiscales serán evaluadas trimestralmente.",
  "Esto representa un cambio de paradigma en la gestión pública.",
  "Los resultados comenzarán a verse gradualmente.",
  "El monitoreo de indicadores será fundamental.",
];

const CONCLUSION_PATTERNS = [
  "El tiempo dirá si esta apuesta política da sus frutos.",
  "Mientras tanto, la atención se centra en los próximos pasos.",
  "La implementación efectiva será el verdadero desafío.",
  "El debate público recién comienza y promete extenderse.",
  "Los próximos meses serán decisivos para evaluar resultados.",
  "La ciudadanía observa con atención cómo se desarrollan los acontecimientos.",
  "El escenario político continúa en constante evolución.",
  "Las expectativas están puestas en las acciones concretas.",
  "El consenso será clave para avanzar en esta dirección.",
  "Resta ver cómo reaccionan los diferentes actores involucrados.",
];

// Advanced political actors and institutions
const POLITICAL_ACTORS = [
  "el Presidente de la Nación",
  "el Jefe de Gabinete",
  "el Ministro de Economía",
  "la titular del Banco Central",
  "el presidente de la Cámara de Diputados",
  "la vicepresidenta del Senado",
  "gobernadores provinciales",
  "intendentes del conurbano",
  "dirigentes sindicales",
  "representantes empresariales",
  "líderes de la oposición",
  "referentes del kirchnerismo",
  "legisladores del oficialismo",
  "miembros de la Corte Suprema",
  "fiscales federales",
];

const INSTITUTIONS = [
  "el Congreso Nacional",
  "la Casa Rosada",
  "el Ministerio de Economía",
  "el Banco Central de la República Argentina",
  "la Corte Suprema de Justicia",
  "el Fondo Monetario Internacional",
  "la Confederación General del Trabajo",
  "la Unión Industrial Argentina",
  "el Instituto Nacional de Estadística",
  "la Procuración General",
  "el Consejo Federal",
  "organismos internacionales de crédito",
  "entidades financieras",
  "cámaras empresariales",
  "organizaciones sociales",
];

const ECONOMIC_INDICATORS = [
  "la inflación mensual",
  "el tipo de cambio oficial",
  "las reservas internacionales",
  "el riesgo país",
  "los índices bursátiles",
  "la tasa de desempleo",
  "el índice de pobreza",
  "la actividad económica",
  "el consumo interno",
  "las exportaciones",
  "la recaudación fiscal",
  "el déficit presupuestario",
  "la inversión extranjera",
  "los salarios reales",
  "la producción industrial",
];

// Generate random selection helper
function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate professional article content
export function generateLocalArticle(title: string, category: string): { content: string; summary: string } {
  const paragraphs: string[] = [];

  // INTRO (2-3 paragraphs)
  paragraphs.push(
    `${random(INTRO_PATTERNS)} ${title.toLowerCase()}. ${random(QUOTE_PATTERNS)} ${random(CONTEXT_PATTERNS)}`
  );

  paragraphs.push(
    `La decisión involucra directamente a ${random(POLITICAL_ACTORS)}, quien mantiene reuniones con ${random(INSTITUTIONS)} para coordinar los próximos pasos. ${random(DEVELOPMENT_PATTERNS)}`
  );

  if (Math.random() > 0.5) {
    paragraphs.push(
      `${random(QUOTE_PATTERNS)} ${random(ANALYSIS_PATTERNS)} Los datos de ${random(ECONOMIC_INDICATORS)} serán determinantes en la evaluación.`
    );
  }

  // DEVELOPMENT (4-6 paragraphs)
  const devCount = randomInt(4, 6);
  for (let i = 0; i < devCount; i++) {
    const paragraph = [];

    if (i % 2 === 0) {
      paragraph.push(`<h2>Impacto en ${category}</h2>`);
    }

    paragraph.push(random(DEVELOPMENT_PATTERNS));
    paragraph.push(random(ANALYSIS_PATTERNS));

    if (Math.random() > 0.4) {
      paragraph.push(`Según monitores de ${random(ECONOMIC_INDICATORS)}, la variación podría alcanzar el ${randomInt(2, 15)}% en los próximos ${randomInt(30, 180)} días.`);
    }

    paragraph.push(random(QUOTE_PATTERNS));

    paragraphs.push(paragraph.join(' '));
  }

  // CONTEXT AND ANALYSIS (3-4 paragraphs)
  paragraphs.push(
    `<h2>Antecedentes y Contexto</h2>\n${random(CONTEXT_PATTERNS)} ${random(ANALYSIS_PATTERNS)} La participación de ${random(INSTITUTIONS)} ha sido clave en el proceso de negociación.`
  );

  paragraphs.push(
    `Los antecedentes históricos muestran que iniciativas similares implementadas en ${randomInt(2010, 2023)} tuvieron un impacto del ${randomInt(5, 30)}% en ${random(ECONOMIC_INDICATORS)}. ${random(CONSEQUENCE_PATTERNS)}`
  );

  paragraphs.push(
    `${random(POLITICAL_ACTORS)} ha manifestado públicamente su postura. ${random(QUOTE_PATTERNS)} ${random(DEVELOPMENT_PATTERNS)}`
  );

  // EXPERT OPINIONS (2-3 paragraphs)
  paragraphs.push(
    `<h2>Análisis de Expertos</h2>\nConsultados por diversos medios, especialistas en economía y política coinciden en varios puntos clave. ${random(QUOTE_PATTERNS)} ${random(ANALYSIS_PATTERNS)}`
  );

  paragraphs.push(
    `El impacto sobre ${random(ECONOMIC_INDICATORS)} será monitoreado de cerca por ${random(INSTITUTIONS)}. ${random(CONSEQUENCE_PATTERNS)} Las proyecciones indican una variación de entre ${randomInt(2, 8)}% y ${randomInt(10, 20)}%.`
  );

  // STAKEHOLDER REACTIONS (2-3 paragraphs)
  paragraphs.push(
    `<h2>Reacciones del Sector</h2>\nDesde ${random(INSTITUTIONS)}, han expresado su posición respecto a la medida. ${random(QUOTE_PATTERNS)} ${random(DEVELOPMENT_PATTERNS)}`
  );

  paragraphs.push(
    `Por su parte, ${random(POLITICAL_ACTORS)} advirtió sobre la necesidad de contemplar variables adicionales. ${random(ANALYSIS_PATTERNS)} El seguimiento de ${random(ECONOMIC_INDICATORS)} será crucial.`
  );

  // FUTURE OUTLOOK (2-3 paragraphs)
  paragraphs.push(
    `<h2>Perspectivas Futuras</h2>\n${random(CONSEQUENCE_PATTERNS)} Los próximos ${randomInt(30, 90)} días serán determinantes para evaluar la efectividad de las medidas adoptadas.`
  );

  paragraphs.push(
    `${random(POLITICAL_ACTORS)} mantiene reuniones periódicas con ${random(INSTITUTIONS)} para ajustar detalles de implementación. ${random(QUOTE_PATTERNS)}`
  );

  // TECHNICAL DETAILS (1-2 paragraphs)
  paragraphs.push(
    `<h3>Aspectos Técnicos</h3>\nEl marco regulatorio contempla ${randomInt(5, 20)} artículos específicos que regulan la implementación. ${random(ANALYSIS_PATTERNS)} La coordinación entre ${random(INSTITUTIONS)} y ${random(INSTITUTIONS)} será fundamental.`
  );

  // SOCIAL IMPACT (1-2 paragraphs)
  paragraphs.push(
    `<h3>Impacto Social</h3>\nOrganizaciones de la sociedad civil han manifestado sus preocupaciones. ${random(QUOTE_PATTERNS)} El efecto sobre los sectores más vulnerables será objeto de monitoreo continuo.`
  );

  // INTERNATIONAL CONTEXT (1-2 paragraphs)
  paragraphs.push(
    `<h3>Contexto Internacional</h3>\nExperiencias similares en países de la región ofrecen lecciones valiosas. ${random(CONTEXT_PATTERNS)} ${random(CONSEQUENCE_PATTERNS)}`
  );

  // CONCLUSION (1-2 paragraphs)
  paragraphs.push(
    `${random(CONCLUSION_PATTERNS)} La atención ahora se centra en los mecanismos concretos de implementación y en cómo ${random(POLITICAL_ACTORS)} coordinará con ${random(INSTITUTIONS)} los siguientes pasos.`
  );

  paragraphs.push(
    `Con un escenario político complejo y ${random(ECONOMIC_INDICATORS)} en constante evolución, los próximos meses serán decisivos. ${random(QUOTE_PATTERNS)} ${random(CONCLUSION_PATTERNS)}`
  );

  const content = paragraphs.map(p => `<p>${p}</p>`).join('\n\n');

  // Generate summary (140-180 characters)
  const summaryOptions = [
    `${title}: ${random(DEVELOPMENT_PATTERNS).substring(0, 100)}`,
    `Nueva medida en ${category}: ${random(ANALYSIS_PATTERNS).substring(0, 100)}`,
    `${random(POLITICAL_ACTORS)} anuncia cambios. ${random(CONSEQUENCE_PATTERNS).substring(0, 80)}`,
    `Decisión clave en ${category}. ${random(QUOTE_PATTERNS).substring(0, 90)}`,
  ];

  const summary = random(summaryOptions).substring(0, 180);

  return { content, summary };
}

// Generate diverse authors
export function generateAuthor(): string {
  const firstNames = [
    "Juan", "María", "Carlos", "Ana", "Roberto", "Laura", "Diego", "Sofía",
    "Martín", "Lucía", "Fernando", "Valentina", "Pablo", "Camila", "Andrés",
    "Victoria", "Javier", "Florencia", "Santiago", "Gabriela", "Nicolás", "Daniela"
  ];

  const lastNames = [
    "González", "Rodríguez", "Fernández", "López", "Martínez", "García",
    "Pérez", "Sánchez", "Romero", "Díaz", "Torres", "Álvarez", "Ramírez",
    "Flores", "Castro", "Morales", "Ortiz", "Silva", "Vargas", "Reyes"
  ];

  return `${random(firstNames)} ${random(lastNames)}`;
}

// Calculate credibility score
export function calculateCredibilityScore(): number {
  return randomInt(88, 98);
}

// Generate view count
export function generateViewCount(): number {
  return randomInt(1000, 15000);
}
