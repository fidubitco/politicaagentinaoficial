/**
 * SEO Service - Centralized SEO Metadata Generation
 * Generates comprehensive SEO metadata including Schema.org JSON-LD
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonical: string;
  schema: any;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  categoryName?: string | null;
  categorySlug?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

const SITE_URL = process.env.SITE_URL || 'https://politica-argentina.replit.app';
const SITE_NAME = 'POLÍTICA ARGENTINA';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200';

/**
 * Generate SEO metadata for HomePage
 */
export function generateHomeSEO(): SEOMetadata {
  const title = `${SITE_NAME} - Noticias Políticas en Tiempo Real`;
  const description = 'Portal líder de noticias políticas de Argentina. Cobertura 24/7, análisis experto, datos en tiempo real y las últimas noticias del panorama político argentino.';
  const keywords = ['política argentina', 'noticias', 'actualidad', 'análisis político', 'argentina', 'noticias en vivo'];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/buscar?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`
    },
    "sameAs": [
      "https://twitter.com/PoliticaArg",
      "https://facebook.com/PoliticaArgentina"
    ]
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: DEFAULT_IMAGE,
    ogUrl: SITE_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: DEFAULT_IMAGE,
    canonical: SITE_URL,
    schema: [websiteSchema, organizationSchema]
  };
}

/**
 * Generate SEO metadata for Article Page
 */
export function generateArticleSEO(article: Article): SEOMetadata {
  const title = `${article.title} - ${SITE_NAME}`;
  const description = article.summary || article.content.substring(0, 160) + '...';
  const keywords = [
    article.categoryName || 'política',
    'argentina',
    'noticias',
    ...(article.author ? [article.author] : [])
  ];
  const imageUrl = article.imageUrl || DEFAULT_IMAGE;
  const articleUrl = `${SITE_URL}/articulo/${article.slug}`;

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": description,
    "image": imageUrl,
    "datePublished": article.publishedAt?.toISOString(),
    "dateModified": article.updatedAt?.toISOString() || article.publishedAt?.toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author || "Redacción POLÍTICA ARGENTINA"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "articleSection": article.categoryName,
    "keywords": keywords.join(", ")
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.categoryName || "Artículos",
        "item": article.categorySlug ? `${SITE_URL}/categoria/${article.categorySlug}` : SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": articleUrl
      }
    ]
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: imageUrl,
    ogUrl: articleUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
    canonical: articleUrl,
    schema: [newsArticleSchema, breadcrumbSchema]
  };
}

/**
 * Generate SEO metadata for Category Page
 */
export function generateCategorySEO(category: Category): SEOMetadata {
  const title = `${category.name} - Noticias y Análisis - ${SITE_NAME}`;
  const description = category.description || `Últimas noticias de ${category.name}. Cobertura completa, análisis experto y actualizaciones en tiempo real sobre ${category.name.toLowerCase()} en Argentina.`;
  const keywords = [category.name, 'noticias', 'argentina', 'política', 'análisis'];
  const categoryUrl = `${SITE_URL}/categoria/${category.slug}`;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": description,
    "url": categoryUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category.name,
        "item": categoryUrl
      }
    ]
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: DEFAULT_IMAGE,
    ogUrl: categoryUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: DEFAULT_IMAGE,
    canonical: categoryUrl,
    schema: [collectionPageSchema, breadcrumbSchema]
  };
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`
    },
    "description": "Portal líder de noticias políticas de Argentina",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/PoliticaArg",
      "https://facebook.com/PoliticaArgentina"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Editorial",
      "email": "redaccion@politica-argentina.com.ar"
    }
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
