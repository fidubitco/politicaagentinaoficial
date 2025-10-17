interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

export interface ImageSearchResult {
  url: string;
  thumbnail: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  width: number;
  height: number;
}

export class ImageSearchService {
  private apiKey: string;
  private baseUrl = 'https://api.pexels.com/v1';

  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ PEXELS_API_KEY no encontrada. Las búsquedas de imágenes fallarán.');
    }
  }

  /**
   * Analiza el título y categoría del artículo para generar keywords óptimas de búsqueda
   * Enfocado en política argentina con contexto visual específico
   */
  private generateSearchKeywords(title: string, category?: string, content?: string): string {
    const categoryKeywords: Record<string, string[]> = {
      'Nacional': ['argentina política', 'congreso argentino', 'gobierno nacional', 'casa rosada'],
      'Política Nacional': ['argentina política', 'congreso argentino', 'gobierno nacional', 'casa rosada'],
      'Economía': ['economía argentina', 'mercado financiero', 'banco central', 'dólar argentina'],
      'Internacional': ['diplomacia internacional', 'política global', 'relaciones exteriores', 'cumbre mundial'],
      'Justicia': ['justicia argentina', 'corte suprema', 'tribunal federal', 'juicio argentina'],
      'Seguridad': ['seguridad argentina', 'policía federal', 'fuerzas seguridad', 'prevención delito'],
      'Sociedad': ['sociedad argentina', 'ciudadanos', 'manifestación', 'protesta social'],
      'Provincias': ['provincias argentina', 'gobierno provincial', 'intendente', 'desarrollo regional'],
      'Tecnología': ['tecnología innovación', 'digital argentina', 'ciberseguridad', 'tech startup'],
      'Opinión': ['análisis político', 'editorial periodismo', 'debate público', 'opinión experta'],
      'Casa Rosada': ['casa rosada argentina', 'gobierno argentina', 'presidente argentina', 'ejecutivo nacional'],
    };

    // Extraer palabras clave principales del título (nombres, lugares, conceptos)
    const titleWords = title
      .toLowerCase()
      .replace(/[¿?¡!]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['sobre', 'para', 'desde', 'hasta', 'entre', 'ante'].includes(word));

    // Detectar nombres propios y conceptos políticos clave
    const politicalTerms = [
      'milei', 'cristina', 'macri', 'massa', 'bullrich', 'larreta',
      'congreso', 'senado', 'diputados', 'casa rosada', 'gobierno',
      'provincia', 'intendente', 'gobernador', 'ministro',
      'elecciones', 'votación', 'campaña', 'partido',
      'crisis', 'reforma', 'proyecto', 'ley', 'decreto'
    ];

    const detectedTerms = titleWords.filter(word => 
      politicalTerms.some(term => word.includes(term) || term.includes(word))
    );

    // Combinar keywords de categoría con términos detectados
    const categoryKeys = category && categoryKeywords[category] ? categoryKeywords[category] : ['política argentina'];
    
    // Priorizar: términos específicos > keywords de categoría > genérico
    if (detectedTerms.length > 0) {
      // Usar términos políticos específicos + contexto argentino
      return `${detectedTerms.slice(0, 2).join(' ')} argentina political`;
    } else if (categoryKeys.length > 0) {
      // Usar primera keyword de categoría (más específica)
      return categoryKeys[0];
    } else {
      // Fallback genérico
      return 'argentina political news';
    }
  }

  /**
   * Busca imágenes hiperrealistas en Pexels con contexto político argentino
   * @param title Título del artículo
   * @param category Categoría del artículo
   * @param content Contenido del artículo (opcional, para análisis más profundo)
   * @param orientation 'landscape' | 'portrait' | 'square'
   * @returns URL de imagen optimizada o null si no hay resultados
   */
  async searchContextualImage(
    title: string,
    category?: string,
    content?: string,
    orientation: 'landscape' | 'portrait' | 'square' = 'landscape'
  ): Promise<ImageSearchResult | null> {
    if (!this.apiKey) {
      console.error('❌ PEXELS_API_KEY no disponible');
      return null;
    }

    try {
      const searchQuery = this.generateSearchKeywords(title, category, content);
      console.log(`🔍 Buscando imagen para: "${title}" → Keywords: "${searchQuery}"`);

      const response = await fetch(
        `${this.baseUrl}/search?query=${encodeURIComponent(searchQuery)}&per_page=15&orientation=${orientation}`,
        {
          headers: {
            'Authorization': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        console.error(`❌ Pexels API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data: PexelsSearchResponse = await response.json();

      if (!data.photos || data.photos.length === 0) {
        console.warn(`⚠️ No se encontraron imágenes para: "${searchQuery}"`);
        return null;
      }

      // Seleccionar la mejor imagen (primera = más relevante según Pexels)
      const photo = data.photos[0];
      
      console.log(`✅ Imagen encontrada: ${photo.alt || 'Sin descripción'} por ${photo.photographer}`);

      return {
        url: photo.src.large2x, // Alta resolución para hero/desktop
        thumbnail: photo.src.medium, // Thumbnail para preview/mobile
        alt: photo.alt || title,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        width: photo.width,
        height: photo.height,
      };
    } catch (error) {
      console.error('❌ Error buscando imagen en Pexels:', error);
      return null;
    }
  }

  /**
   * Busca múltiples imágenes para galería o carrusel
   */
  async searchMultipleImages(
    title: string,
    category?: string,
    count: number = 5,
    orientation: 'landscape' | 'portrait' | 'square' = 'landscape'
  ): Promise<ImageSearchResult[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const searchQuery = this.generateSearchKeywords(title, category);
      
      const response = await fetch(
        `${this.baseUrl}/search?query=${encodeURIComponent(searchQuery)}&per_page=${count}&orientation=${orientation}`,
        {
          headers: {
            'Authorization': this.apiKey,
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data: PexelsSearchResponse = await response.json();

      return data.photos.map(photo => ({
        url: photo.src.large2x,
        thumbnail: photo.src.medium,
        alt: photo.alt || title,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        width: photo.width,
        height: photo.height,
      }));
    } catch (error) {
      console.error('Error buscando múltiples imágenes:', error);
      return [];
    }
  }

  /**
   * Genera URL de fallback usando imágenes genéricas de política argentina
   */
  getFallbackImage(category?: string): string {
    const fallbacks: Record<string, string> = {
      'Nacional': 'https://images.pexels.com/photos/8828597/pexels-photo-8828597.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'Economía': 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'Internacional': 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'Justicia': 'https://images.pexels.com/photos/8112171/pexels-photo-8112171.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'default': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
    };

    return fallbacks[category || 'default'] || fallbacks['default'];
  }
}

// Singleton instance
export const imageSearchService = new ImageSearchService();
