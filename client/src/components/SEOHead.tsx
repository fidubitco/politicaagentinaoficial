import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  canonical?: string;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200",
  article,
  canonical,
}: SEOHeadProps) {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://politica-argentina.replit.app";
  const fullTitle = `${title} | POLÍTICA ARGENTINA`;
  const canonicalUrl = canonical || siteUrl;

  const jsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: description,
        image: image,
        datePublished: article.publishedTime,
        dateModified: article.modifiedTime || article.publishedTime,
        author: {
          "@type": "Person",
          name: article.author || "Redacción POLÍTICA ARGENTINA",
        },
        publisher: {
          "@type": "Organization",
          name: "POLÍTICA ARGENTINA",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        articleSection: article.section,
        keywords: article.tags?.join(", "),
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "POLÍTICA ARGENTINA",
        url: siteUrl,
        description: description,
      };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="POLÍTICA ARGENTINA" />
      <meta property="og:locale" content="es_AR" />

      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime || article.publishedTime} />
          <meta property="article:author" content={article.author || "Redacción POLÍTICA ARGENTINA"} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@PoliticaArg" />
      <meta name="twitter:creator" content={article?.author ? `@${article.author.replace(/\s+/g, "")}` : "@PoliticaArg"} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="revisit-after" content="1 days" />
      <meta name="author" content={article?.author || "POLÍTICA ARGENTINA"} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
