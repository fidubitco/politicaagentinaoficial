import { getRandomTemplate, type ArticleTemplate } from '../templates/articleTemplates';
import { rssScraperService } from './rssScraper';
import { imageSearchService } from './imageSearch';
import type { InsertArticle } from '@shared/schema';

interface GenerationOptions {
  category: string;
  sourceMaterial?: string;
  topic?: string;
  useRealData?: boolean;
}

interface GeneratedArticle {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  categoryId: string;
  sourceId?: string;
  credibilityScore: number;
  imageUrl?: string;
  status: 'draft' | 'published';
  publishedAt: Date;
}

const institutions = [
  'Congreso Nacional',
  'Senado de la Nación',
  'Cámara de Diputados',
  'Casa Rosada',
  'Ministerio de Economía',
  'Banco Central',
  'Poder Judicial',
  'Corte Suprema',
  'Fiscalía Nacional',
  'Ministerio de Relaciones Exteriores',
  'Procuración General',
  'Defensoría del Pueblo'
];

const authors = [
  'Redacción Política Argentina',
  'Equipo de Investigación PA',
  'Corresponsalía Buenos Aires',
  'Análisis Político PA',
  'Economía PA',
  'Justicia PA',
  'Internacional PA'
];

const detailsExamples = [
  'información confirmada por múltiples fuentes del oficialismo',
  'documentación que fue presentada en las últimas horas',
  'testimonios de legisladores presentes en la reunión',
  'datos que fueron revelados en conferencia de prensa',
  'informes técnicos que circulan entre los bloques',
  'versiones que coinciden con lo anticipado por analistas',
  'elementos probatorios que cambian el panorama político',
  'declaraciones que contradicen la versión oficial',
  'pruebas documentales que complican la situación',
  'testimonios clave que aportan nueva luz al caso'
];

const events = [
  'el debate sobre la reforma tributaria',
  'las negociaciones presupuestarias del próximo año',
  'la presentación del proyecto de ley antiinflación',
  'la discusión sobre el endeudamiento público',
  'el tratamiento de la reforma judicial',
  'las audiencias públicas sobre transparencia',
  'el análisis de la situación económica nacional',
  'la votación de la ley de emergencia',
  'el informe sobre el estado de la Nación',
  'la cumbre de gobernadores en Casa Rosada'
];

export class AutonomousContentGenerator {
  
  async generateArticle(options: GenerationOptions): Promise<Partial<InsertArticle>> {
    const template = getRandomTemplate(options.category);
    
    if (!template) {
      throw new Error(`No template found for category: ${options.category}`);
    }

    let topic = options.topic;
    
    if (!topic && options.useRealData) {
      const topics = await rssScraperService.getTopicsFromFeeds(options.category);
      topic = topics[Math.floor(Math.random() * topics.length)] || 'Reforma Política';
    }
    
    if (!topic) {
      topic = await this.generateGenericTopic(options.category);
    }

    const title = this.generateTitle(template, topic);
    const slug = this.generateSlug(title);
    const summary = this.generateSummary(template, topic);
    const content = this.generateContent(template, topic);
    const author = this.selectRandomAuthor();
    const credibilityScore = this.calculateCredibilityScore(template);

    return {
      title,
      slug,
      summary,
      content,
      author,
      credibilityScore,
      status: 'published',
      publishedAt: new Date(),
      viewCount: Math.floor(Math.random() * 500) + 100
    };
  }

  async generateBulkArticles(category: string, count: number): Promise<Partial<InsertArticle>[]> {
    const articles: Partial<InsertArticle>[] = [];

    for (let i = 0; i < count; i++) {
      const article = await this.generateArticle({ 
        category, 
        useRealData: true 
      });
      articles.push(article);
      
      await this.sleep(100);
    }

    return articles;
  }

  private generateTitle(template: ArticleTemplate, topic: string): string {
    const headlines = template.headlines;
    const selectedHeadline = headlines[Math.floor(Math.random() * headlines.length)];
    return selectedHeadline.replace('{topic}', topic);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 100) + `-${Date.now().toString().slice(-6)}`;
  }

  private generateSummary(template: ArticleTemplate, topic: string): string {
    const summaryTemplates = [
      `Un nuevo capítulo en ${topic} sacude el panorama político argentino. Las últimas revelaciones generan expectativa y controversia en todos los sectores.`,
      `${topic} se convierte en el centro del debate nacional. Expertos y legisladores analizan las consecuencias de esta situación sin precedentes.`,
      `La situación relacionada con ${topic} genera un punto de inflexión político. Las próximas horas serán cruciales para definir el rumbo de los acontecimientos.`,
      `En el marco de ${topic}, surgen nuevos elementos que modifican el escenario político argentino. La clase dirigente está en alerta máxima.`,
      `${topic} domina la agenda política nacional. Las implicancias de esta situación trascienden el corto plazo y definen estrategias futuras.`
    ];
    
    return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
  }

  private generateContent(template: ArticleTemplate, topic: string): string {
    const bodyTemplate = template.bodyTemplates[Math.floor(Math.random() * template.bodyTemplates.length)];
    
    const replacements = {
      topic,
      event: events[Math.floor(Math.random() * events.length)],
      institution: institutions[Math.floor(Math.random() * institutions.length)],
      details: detailsExamples[Math.floor(Math.random() * detailsExamples.length)],
      expert_opinion: template.expertOpinions[Math.floor(Math.random() * template.expertOpinions.length)],
      impact: template.impacts[Math.floor(Math.random() * template.impacts.length)],
      analysis: template.analyses[Math.floor(Math.random() * template.analyses.length)],
      outcome: topic.toLowerCase()
    };

    let content = bodyTemplate;
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    const additionalParagraphs = [
      `\n\nFuentes cercanas al caso confirmaron a POLÍTICA ARGENTINA que las próximas 48 horas serán determinantes. La expectativa en los pasillos del poder es máxima, mientras los principales actores políticos definen sus estrategias.`,
      `\n\nLa reacción de la opinión pública no se hizo esperar. En redes sociales y medios de comunicación, el tema genera debate intenso. Los ciudadanos exigen transparencia y respuestas concretas de sus representantes.`,
      `\n\nMientras tanto, los bloques parlamentarios analizan sus posiciones. Las negociaciones de último momento podrían modificar el escenario, según confirman legisladores consultados en estricta reserva.`,
      `\n\nEl impacto de esta situación trasciende lo coyuntural. Analistas políticos coinciden en que marca un punto de inflexión en la política argentina contemporánea, con consecuencias que se extenderán en el tiempo.`
    ];

    const randomParagraph = additionalParagraphs[Math.floor(Math.random() * additionalParagraphs.length)];
    content += randomParagraph;

    return content;
  }

  private async generateGenericTopic(category: string): Promise<string> {
    const topicsByCategory: Record<string, string[]> = {
      'Política Nacional': [
        'la Reforma Electoral',
        'el Proyecto de Transparencia',
        'la Ley de Financiamiento Político',
        'el Debate sobre Coparticipación',
        'la Reforma del Congreso',
        'el Acuerdo Federal',
        'la Modernización del Estado'
      ],
      'Economía': [
        'el Plan Antiinflación',
        'la Reforma Tributaria',
        'el Presupuesto Nacional',
        'la Política Monetaria',
        'el Comercio Exterior',
        'la Inversión Productiva',
        'el Desarrollo Regional'
      ],
      'Justicia': [
        'la Reforma Judicial',
        'el Código Procesal',
        'la Transparencia Judicial',
        'el Acceso a la Justicia',
        'la Modernización de Tribunales',
        'la Lucha contra la Corrupción',
        'la Independencia Judicial'
      ],
      'Internacional': [
        'el Acuerdo con Brasil',
        'la Cumbre del Mercosur',
        'las Relaciones con Europa',
        'la Integración Regional',
        'el Comercio Internacional',
        'la Diplomacia Multilateral',
        'la Cooperación Sur-Sur'
      ]
    };

    const topics = topicsByCategory[category] || topicsByCategory['Política Nacional'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private selectRandomAuthor(): string {
    return authors[Math.floor(Math.random() * authors.length)];
  }

  private calculateCredibilityScore(template: ArticleTemplate): number {
    const baseScore = 70 + Math.floor(Math.random() * 20);
    
    const keywordBonus = template.keywords.length > 5 ? 5 : 0;
    const opinionBonus = template.expertOpinions.length > 5 ? 5 : 0;
    
    return Math.min(95, baseScore + keywordBonus + opinionBonus);
  }

  async enrichArticleWithImage(article: Partial<InsertArticle>): Promise<Partial<InsertArticle>> {
    if (!article.title) return article;

    try {
      const imageResult = await imageSearchService.searchContextualImage(
        article.title,
        'Política Argentina'
      );
      
      if (imageResult && imageResult.url) {
        article.imageUrl = imageResult.url;
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }

    return article;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const autonomousContentGenerator = new AutonomousContentGenerator();
