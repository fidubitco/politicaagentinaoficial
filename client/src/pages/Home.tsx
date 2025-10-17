import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Article, Category } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { Button } from "@/components/ui/button";

interface DolarData {
  oficial: any;
  blue: any;
  mep: any;
  ccl: any;
  tarjeta: any;
  timestamp: string;
}

export default function Home() {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://politica-argentina.replit.app";
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "POLÍTICA ARGENTINA",
    "url": siteUrl,
    "description": "Portal líder de noticias políticas de Argentina. Cobertura 24/7, análisis experto, datos en tiempo real.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/buscar?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "POLÍTICA ARGENTINA",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`
    },
    "description": "Portal líder de noticias políticas de Argentina",
    "sameAs": [
      "https://twitter.com/PoliticaArg",
      "https://facebook.com/PoliticaArgentina"
    ]
  };
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 60000,
  });

  const { data: dolarData } = useQuery<DolarData>({
    queryKey: ['/api/dolar'],
    staleTime: 30000,
    refetchInterval: 30000,
  });

  // Get featured article (highest views) - NON-MUTATING
  const featuredArticle = [...(articles || [])]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))[0];
  
  // Get trending articles (by views) - NON-MUTATING
  const trendingArticles = [...(articles || [])]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 6);
  
  // Get latest articles (by published date, most recent first) - NON-MUTATING
  const latestArticles = [...(articles || [])]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA; // Descending (most recent first)
    })
    .slice(0, 9);

  // Loading state
  if (articlesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-[500px] bg-muted rounded"></div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-muted rounded"></div>)}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="POLÍTICA ARGENTINA - Noticias Políticas en Tiempo Real"
        description="Portal líder de noticias políticas de Argentina. Cobertura 24/7, análisis experto, datos en tiempo real y las últimas noticias del panorama político argentino."
        keywords={['política argentina', 'noticias', 'actualidad', 'análisis político', 'argentina', 'noticias en vivo']}
        canonical={siteUrl}
      />

      <div className="min-h-screen bg-background">
        <Navbar />
      
      {/* Live Breaking News Ticker */}
      {dolarData && (
        <div className="bg-[hsl(355,70%,48%)] text-white py-2.5 overflow-hidden relative">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center gap-6">
            <div className="flex items-center gap-2 font-semibold shrink-0 text-sm">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              EN VIVO
            </div>
            <div className="flex gap-8 text-sm font-medium">
              <span>💵 Blue: ${dolarData.blue?.venta?.toLocaleString('es-AR')}</span>
              <span>🏦 Oficial: ${dolarData.oficial?.venta?.toLocaleString('es-AR')}</span>
              <span>📊 MEP: ${dolarData.mep?.venta?.toLocaleString('es-AR')}</span>
              <span>💳 Tarjeta: ${dolarData.tarjeta?.venta?.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Hero Section - Immersive Lead Story with Parallax */}
        {featuredArticle && (
          <section className="py-8 lg:py-12">
            <Link href={`/articulo/${featuredArticle.slug}`}>
              <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-xl overflow-hidden group cursor-pointer shadow-2xl">
                <LazyImage 
                  src={featuredArticle.imageUrl || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1920'}
                  alt={featuredArticle.title}
                  aspectRatio="aspect-[21/9]"
                  enableZoom={true}
                  photographer={(featuredArticle.metadata as any)?.photographer}
                  photographerUrl={(featuredArticle.metadata as any)?.photographerUrl}
                  data-testid="img-hero-article"
                />
                
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500"></div>
                
                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 text-white z-10">
                  <div className="max-w-5xl">
                    {featuredArticle.categoryId && categories && (
                      <Badge 
                        style={{ 
                          backgroundColor: categories.find(c => c.id === featuredArticle.categoryId)?.color || 'hsl(355,70%,48%)',
                          backdropFilter: 'blur(8px)'
                        }}
                        className="mb-4 text-sm font-bold uppercase tracking-wider shadow-lg"
                        data-testid="badge-hero-category"
                      >
                        {categories.find(c => c.id === featuredArticle.categoryId)?.name || 'Noticias'}
                      </Badge>
                    )}
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight drop-shadow-2xl" data-testid="text-hero-title">
                      {featuredArticle.title}
                    </h1>
                    {featuredArticle.summary && (
                      <p className="text-base lg:text-xl opacity-95 mb-6 line-clamp-2 max-w-3xl drop-shadow-lg" data-testid="text-hero-summary">
                        {featuredArticle.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm font-medium opacity-90">
                      {featuredArticle.publishedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(featuredArticle.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{(featuredArticle.viewCount || 0).toLocaleString('es-AR')} lecturas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Masonry Grid Layout - Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 lg:py-12">
          {/* Main Column - Masonry Grid */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Últimas Noticias</h2>
              <Button variant="ghost" className="gap-2" asChild>
                <Link href="/admin">
                  Ver todas <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Masonry Grid with CSS */}
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {latestArticles.map((article, index) => {
                const category = categories?.find(c => c.id === article.categoryId);
                const isLarge = index % 4 === 0; // Every 4th card is larger
                
                return (
                  <Link key={article.id} href={`/articulo/${article.slug}`}>
                    <Card className="break-inside-avoid mb-6 hover-elevate active-elevate-2 transition-all duration-300 overflow-hidden group" data-testid={`card-article-${article.slug}`}>
                      <LazyImage 
                        src={article.imageUrl || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={article.title}
                        aspectRatio={isLarge ? "aspect-[4/3]" : "aspect-video"}
                        enableZoom={true}
                        photographer={(article.metadata as any)?.photographer}
                        photographerUrl={(article.metadata as any)?.photographerUrl}
                      />
                      <CardContent className="p-5">
                        {category && (
                          <Badge 
                            style={{ backgroundColor: category.color ?? '#6CACE4' }}
                            className="text-white text-xs font-semibold mb-3"
                          >
                            {category.name}
                          </Badge>
                        )}
                        <h3 className={`font-serif font-bold mb-3 line-clamp-2 group-hover:text-[hsl(355,70%,48%)] transition-colors ${isLarge ? 'text-2xl' : 'text-xl'}`}>
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                          {article.publishedAt && (
                            <>
                              <Clock className="h-3.5 w-3.5" />
                              <span>{format(new Date(article.publishedAt), "d MMM", { locale: es })}</span>
                            </>
                          )}
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{(article.viewCount || 0).toLocaleString('es-AR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar - Trending & Live Intelligence */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Trending Topics */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-[hsl(355,70%,48%)]" />
                    <h3 className="font-serif text-2xl font-bold">Tendencias</h3>
                  </div>
                  <div className="space-y-4">
                    {trendingArticles.slice(0, 5).map((article, index) => {
                      const category = categories?.find(c => c.id === article.categoryId);
                      return (
                        <Link key={article.id} href={`/articulo/${article.slug}`}>
                          <div className="flex gap-4 p-3 rounded-lg hover-elevate active-elevate-2 transition-all" data-testid={`card-trending-${article.slug}`}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(355,70%,48%)] text-white font-bold shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-sm line-clamp-2 mb-2 hover:text-[hsl(355,70%,48%)] transition-colors">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {category && (
                                  <Badge 
                                    style={{ backgroundColor: category.color ?? '#6CACE4' }}
                                    className="text-white text-[10px] py-0 px-2"
                                  >
                                    {category.name}
                                  </Badge>
                                )}
                                <span>{(article.viewCount || 0).toLocaleString('es-AR')} vistas</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Categories Quick Access */}
              {categories && categories.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-4">Categorías</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 8).map(category => (
                        <Link key={category.id} href={`/categoria/${category.slug}`}>
                          <Badge 
                            style={{ backgroundColor: category.color ?? '#6CACE4' }}
                            className="text-white hover-elevate cursor-pointer px-3 py-1.5"
                            data-testid={`badge-category-${category.slug}`}
                          >
                            {category.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      </div>
    </>
  );
}
