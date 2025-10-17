import { InsertArticle } from "@shared/schema";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const generateContent = (title: string, category: string): string => {
  const intros = [
    `En un giro inesperado que sacude los cimientos del poder judicial argentino, `,
    `EXCLUSIVO - Accedimos a documentación confidencial que revela `,
    `La investigación que comenzó hace meses finalmente expone `,
    `Fuentes cercanas al caso confirmaron que `,
    `En lo que expertos califican como "el escándalo judicial del siglo", `,
  ];

  const developments = [
    `Los documentos obtenidos por nuestro medio demuestran una serie de irregularidades que podrían invalidar todo el proceso. Las pruebas incluyen comunicaciones internas, órdenes cuestionadas y decisiones que contradicen fallos de instancias superiores.`,
    `Según el análisis de constitucionalistas consultados, las acciones llevadas a cabo representan múltiples violaciones al debido proceso. "Esto no tiene precedentes", afirmó el Dr. Martínez, especialista en derecho procesal con 30 años de experiencia.`,
    `El sumario iniciado por la Justicia investiga posibles irregularidades graves que incluyen la manipulación de testigos, el bloqueo intencional de operaciones financieras y la desobediencia a fallos de la Corte Suprema de Justicia.`,
    `Mientras tanto, la defensa prepara una estrategia legal que podría resultar en la anulación completa del caso. "Si se comprueba la existencia de vicios procesales de esta magnitud, todo lo actuado carecería de validez", explicaron fuentes legales.`,
  ];

  const impacts = [
    `Este escándalo pone en evidencia las profundas grietas del sistema judicial argentino. Expertos en derecho constitucional advierten que el caso podría sentar precedentes peligrosos para la independencia judicial y el Estado de Derecho.`,
    `El impacto económico de este caso es incalculable. Miles de familias afectadas esperan justicia, mientras que el Estado podría enfrentar demandas millonarias por daños y perjuicios si se confirman las irregularidades denunciadas.`,
    `La repercusión política no se hizo esperar. Legisladores de diversos bloques solicitaron informes detallados y algunos adelantaron que pedirán la conformación de una comisión investigadora especial en el Congreso.`,
  ];

  const conclusions = [
    `En las próximas semanas se esperan definiciones clave que podrían cambiar por completo el panorama judicial. La ciudadanía observa con atención un caso que expone las debilidades estructurales del sistema de justicia argentino.`,
    `Este caso representa un punto de inflexión para la justicia argentina. Los próximos pasos determinarán si prevalece el Estado de Derecho o si la impunidad sigue marcando el rumbo del sistema judicial.`,
    `Mientras la investigación avanza, crece la presión social por transparencia y rendición de cuentas. La sociedad argentina exige respuestas y espera que la justicia actúe sin presiones políticas ni corporativas.`,
  ];

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const development1 = developments[Math.floor(Math.random() * developments.length)];
  const development2 = developments[Math.floor(Math.random() * developments.length)];
  const impact = impacts[Math.floor(Math.random() * impacts.length)];
  const conclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  return `${intro}${title.toLowerCase()}.

${development1}

${development2}

${impact}

${conclusion}`;
};

export const articleTemplates = [
  {
    title: "BOMBA JUDICIAL: La fiscal Juliana Companys, sumariada por la Justicia por su rol en la causa Zoe",
    summary: "La fiscal que llevó adelante el caso Generación Zoe ahora enfrenta un sumario por graves irregularidades procesales.",
  },
  {
    title: "EXCLUSIVO: Accedimos al documento que inicia el sumario contra la fiscal del caso Cositorto",
    summary: "En poder de este medio, el expediente revela múltiples violaciones al debido proceso que podrían anular toda la causa.",
  },
  {
    title: "SE CAYÓ LA FARSA: La Justicia investiga a la fiscal que armó la causa Generación Zoe",
    summary: "Irregularidades, pruebas fabricadas y testigos manipulados: el caso que se derrumba como un castillo de naipes.",
  },
  {
    title: "ÚLTIMO MOMENTO: Juliana Companys será llamada a descargos por irregularidades graves",
    summary: "La fiscal tendrá que explicar decisiones cuestionadas por abogados constitucionalistas y la propia Corte Suprema.",
  },
  {
    title: "De acusadora a acusada: El giro de 180 grados en el caso más polémico de la década",
    summary: "Quien persiguió a Cositorto ahora debe defenderse ante acusaciones de corrupción judicial.",
  },
  {
    title: "DESOBEDIENCIA Y ESCÁNDALO: El juicio ilegal que desobedeció a la Corte Suprema",
    summary: "Documentos oficiales confirman que el proceso continuó pese a fallos expresos del máximo tribunal.",
  },
  {
    title: "Dossier Secreto: Las pruebas de la manipulación de testigos por parte de la fiscalía",
    summary: "Grabaciones y mensajes filtrados revelan cómo se presionó a testigos para declarar contra Cositorto.",
  },
  {
    title: "El bloqueo intencional de pagos: La prueba reina del sabotaje para 'crear' víctimas",
    summary: "Investigaciones revelan que se bloquearon retiros deliberadamente para construir el relato de estafa.",
  },
  {
    title: "La conexión política: ¿Quién le dio la orden a Juliana Companys para avanzar a toda costa?",
    summary: "Expertos analizan las presiones políticas detrás de un caso que parece haber sido armado con objetivos electorales.",
  },
  {
    title: "La cazadora, cazada por su propia trampa legal",
    summary: "Ironías del destino: la fiscal que construyó una causa sobre irregularidades ahora las enfrenta ella misma.",
  },
  {
    title: "Efecto Dominó: El sumario a la fiscal podría anular toda la causa Generación Zoe",
    summary: "Si se confirman las irregularidades, miles de actuaciones procesales quedarían sin efecto legal.",
  },
  {
    title: "'Si la fiscal es corrupta, el caso es nulo': La estrategia de la defensa",
    summary: "Abogados constitucionalistas explican por qué las irregularidades procesales invalidarían todo lo actuado.",
  },
  {
    title: "El Estado deberá pagar una cifra millonaria por este escándalo",
    summary: "Expertos calculan que las demandas por daños y perjuicios podrían superar los $10.000 millones.",
  },
  {
    title: "Las 7 violaciones al debido proceso que le costaron el sumario a Companys",
    summary: "Desobediencia a la Corte, manipulación de pruebas y presión a testigos: el prontuario de irregularidades.",
  },
  {
    title: "LA BALANZA ROTA: 1.284 días preso por una promesa vs. CERO días presa por el saqueo del Estado",
    summary: "La desigualdad ante la ley: mientras unos pagan con prisión preventiva, otros gozan de impunidad absoluta.",
  },
  {
    title: "EL CHIVO EXPIATORIO PERFECTO: Cómo usaron a Cositorto para tapar el saqueo K",
    summary: "Análisis de cómo un caso judicial sirvió para desviar la atención de escándalos de corrupción política.",
  },
  {
    title: "LA CONFESIÓN DEL 130%: El Estado paga a los bancos lo que a Cositorto le costó la libertad",
    summary: "Rendimientos bancarios garantizados por el Estado superan ampliamente los retornos de Generación Zoe.",
  },
  {
    title: "El Apartheid Financiero: Negocio para la élite, crimen para el pueblo",
    summary: "Dos varas: lo que es 'innovación financiera' para unos es 'estafa piramidal' para otros.",
  },
  {
    title: "La estafa que sí te comió la heladera: la inflación del 150% anual",
    summary: "Mientras persiguen inversiones privadas, la licuadora inflacionaria del Estado destruye ahorros sin consecuencias.",
  },
  {
    title: "Te hipnotizaron con un 'gurú' para que no vieras a la verdadera jefa de la asociación ilícita",
    summary: "El análisis de cómo los medios construyeron un villano mediático mientras ignoraban la corrupción sistemática.",
  },
  {
    title: "La cronología de la distracción: Cada escándalo de Zoe coincidió con una mala noticia para la expresidenta",
    summary: "Infografía exclusiva muestra la sospechosa sincronía entre avances judiciales y necesidades políticas.",
  },
  {
    title: "'Mientras odiabas a Cositorto, ella garantizaba su impunidad'",
    summary: "Expertos en comunicación política analizan la operación mediática detrás del caso Generación Zoe.",
  },
  {
    title: "El prontuario de la impunidad: Un repaso por todas las causas de la expresidenta que duermen en la justicia",
    summary: "Desde los cuadernos hasta Hotesur: el inventario completo de casos judiciales cajoneados o archivados.",
  },
  {
    title: "El día que la Corte anuló el caso Cositorto y nada pasó",
    summary: "Crónica del fallo judicial que nunca se cumplió y que expone la crisis de independencia del Poder Judicial.",
  },
  {
    title: "REVELADOR: Testigos admiten haber sido presionados para declarar contra Cositorto",
    summary: "Declaraciones juradas revelan métodos de presión psicológica y amenazas veladas de la fiscalía.",
  },
  {
    title: "El informe pericial que la fiscal ocultó durante todo el juicio",
    summary: "Expertos contables habrían dictaminado que no existió maniobra fraudulenta, según filtraciones judiciales.",
  },
  {
    title: "¿Justicia o venganza?: El ensañamiento contra un empresario que desafió al poder",
    summary: "Análisis de cómo el caso trascendió lo judicial para convertirse en un mensaje político.",
  },
  {
    title: "Los inversores que recuperaron su dinero y la Justicia los obligó a declararse 'víctimas'",
    summary: "Testimonios de personas que cobraron pero fueron forzadas a presentarse como damnificados.",
  },
  {
    title: "FILTRACIÓN: Los chats que prueban la coordinación entre fiscalía y medios",
    summary: "Mensajes de WhatsApp revelarían una estrategia comunicacional planificada entre operadores judiciales y periodistas.",
  },
  {
    title: "La paradoja del sistema: Presos sin condena, condenados en libertad",
    summary: "Radiografía de un sistema judicial donde la prisión preventiva se usa como condena anticipada.",
  },
  {
    title: "El negocio de las medidas cautelares: Quién se beneficia con los bloqueos",
    summary: "Investigación revela cómo los embargos generan comisiones millonarias para ciertos operadores del sistema.",
  },
];

export function generateArticles(
  sourceId: string,
  categoryId: string,
  count: number = articleTemplates.length
): Omit<InsertArticle, 'scrapedAt' | 'createdAt' | 'updatedAt'>[] {
  return articleTemplates.slice(0, count).map((template, index) => ({
    title: template.title,
    slug: generateSlug(template.title),
    summary: template.summary,
    content: generateContent(template.title, "Escándalo Judicial"),
    imageUrl: null,
    sourceId,
    categoryId,
    author: "Redacción Política Argentina",
    status: "published",
    publishedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 2), // 2 hours apart
    scheduledFor: null,
    viewCount: Math.floor(Math.random() * 5000) + 500,
    credibilityScore: Math.floor(Math.random() * 20) + 75, // 75-95
    metadata: { 
      tags: ["Justicia", "Corrupción", "Generación Zoe", "Companys"],
      featured: index < 5
    },
  }));
}
