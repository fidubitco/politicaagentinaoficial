import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Article, Category } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, TrendingUp, Clock } from "lucide-react";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";

interface DolarData {
  oficial: any;
  blue: any;
  mep: any;
  ccl: any;
  tarjeta: any;
  timestamp: string;
}

export default function Home() {
  useGSAPAnimations();

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
    .slice(0, 8);
  
  // Get latest articles (by published date, most recent first) - NON-MUTATING
  const latestArticles = [...(articles || [])]
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA; // Descending (most recent first)
    })
    .slice(0, 12);
  
  // Get main articles (top 3 by views, excluding featured)
  const mainArticles = [...(articles || [])]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(1, 4);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Live Breaking News Ticker */}
      {dolarData && (
        <div className="ticker-container bg-[hsl(355,70%,48%)] text-white py-2 px-4">
          <div className="max-w-[1440px] mx-auto flex items-center gap-8 text-sm overflow-hidden">
            <div className="flex items-center gap-2 font-semibold shrink-0">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              EN VIVO
            </div>
            <div className="flex gap-8 animate-scroll">
              <span>Dólar Blue: ${dolarData.blue?.venta?.toLocaleString('es-AR')}</span>
              <span>Dólar Oficial: ${dolarData.oficial?.venta?.toLocaleString('es-AR')}</span>
              <span>MEP: ${dolarData.mep?.venta?.toLocaleString('es-AR')}</span>
              <span>Tarjeta: ${dolarData.tarjeta?.venta?.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        {/* Hero Section - Immersive Lead Story */}
        {featuredArticle && (
          <section className="hero-section py-8">
            <Link href={`/articulo/${featuredArticle.slug}`}>
              <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-lg overflow-hidden group cursor-pointer">
                {featuredArticle.imageUrl ? (
                  <img 
                    src={featuredArticle.imageUrl} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    data-testid="img-hero-article"
                  />
                ) : (
                  <div className="w-full h-full bg-muted"></div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12 text-white">
                  <div className="max-w-4xl">
                    {featuredArticle.categoryId && categories && (
                      <Badge 
                        className="hero-badge mb-4 bg-[hsl(355,70%,48%)] text-white hover:bg-[hsl(355,70%,45%)]"
                        data-testid="badge-hero-category"
                      >
                        {categories.find(c => c.id === featuredArticle.categoryId)?.name || 'Noticias'}
                      </Badge>
                    )}
                    <h1 className="hero-title font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight" data-testid="text-hero-title">
                      {featuredArticle.title}
                    </h1>
                    {featuredArticle.summary && (
                      <p className="hero-summary text-lg lg:text-xl opacity-90 mb-4 line-clamp-2" data-testid="text-hero-summary">
                        {featuredArticle.summary}
                      </p>
                    )}
                    <div className="hero-meta flex items-center gap-4 text-sm opacity-80">
                      {featuredArticle.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(featuredArticle.publishedAt), "d 'de' MMMM", { locale: es })}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{(featuredArticle.viewCount || 0).toLocaleString('es-AR')} vistas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Main Grid - 8 col main + 4 col sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
          {/* Main Column */}
          <div className="lg:col-span-8">
            {/* Top Stories Grid */}
            <div className="mb-12">
              <h2 className="section-header font-serif text-3xl font-bold mb-6">Principales Noticias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainArticles.map((article) => (
                  <Link key={article.id} href={`/articulo/${article.slug}`}>
                    <Card className="article-card h-full hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-main-article-${article.slug}`}>
                      {article.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={article.imageUrl} 
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        {article.categoryId && categories && (
                          <Badge 
                            style={{ backgroundColor: categories.find(c => c.id === article.categoryId)?.color || '#6CACE4' }}
                            className="text-white mb-3"
                          >
                            {categories.find(c => c.id === article.categoryId)?.name}
                          </Badge>
                        )}
                        <h3 className="font-serif text-2xl font-bold mb-3 line-clamp-2 hover:text-[hsl(355,70%,48%)] transition-colors">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {article.publishedAt && (
                            <span>{format(new Date(article.publishedAt), "d MMM", { locale: es })}</span>
                          )}
                          <span>•</span>
                          <span>{(article.viewCount || 0).toLocaleString('es-AR')} vistas</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Articles List */}
            <div>
              <h2 className="section-header font-serif text-3xl font-bold mb-6">Últimas Noticias</h2>
              <div className="space-y-6">
                {latestArticles.map((article) => (
                  <Link key={article.id} href={`/articulo/${article.slug}`}>
                    <Card className="latest-article-card hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-latest-${article.slug}`}>
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {article.imageUrl && (
                            <div className="w-48 h-32 shrink-0 overflow-hidden rounded">
                              <img 
                                src={article.imageUrl} 
                                alt={article.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            {article.categoryId && categories && (
                              <Badge 
                                style={{ backgroundColor: categories.find(c => c.id === article.categoryId)?.color || '#6CACE4' }}
                                className="text-white mb-2"
                              >
                                {categories.find(c => c.id === article.categoryId)?.name}
                              </Badge>
                            )}
                            <h3 className="font-serif text-xl font-bold mb-2 line-clamp-2 hover:text-[hsl(355,70%,48%)] transition-colors">
                              {article.title}
                            </h3>
                            {article.summary && (
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {article.summary}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {article.publishedAt && (
                                <span>{format(new Date(article.publishedAt), "d 'de' MMMM", { locale: es })}</span>
                              )}
                              <span>•</span>
                              <span>{(article.viewCount || 0).toLocaleString('es-AR')} vistas</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Live Intelligence */}
          <div className="lg:col-span-4">
            {/* Trending Topics */}
            <div className="sticky top-24">
              <Card className="sidebar-widget trending-section mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-5 w-5 text-[hsl(355,70%,48%)]" />
                    <h3 className="font-serif text-xl font-bold">Más Leídas</h3>
                  </div>
                  <div className="space-y-4">
                    {trendingArticles.map((article, index) => (
                      <Link key={article.id} href={`/articulo/${article.slug}`}>
                        <div className="flex gap-4 group cursor-pointer" data-testid={`trending-item-${index + 1}`}>
                          <div className="font-mono text-2xl font-bold text-[hsl(355,70%,48%)] shrink-0 w-8">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-[hsl(355,70%,48%)] transition-colors mb-1">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Eye className="h-3 w-3" />
                              <span>{(article.viewCount || 0).toLocaleString('es-AR')}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Updates */}
              <Card className="sidebar-widget insights-panel">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-[hsl(355,70%,48%)] animate-pulse"></div>
                    <h3 className="font-serif text-xl font-bold">Actualizaciones en Vivo</h3>
                  </div>
                  <div className="space-y-4">
                    {latestArticles.slice(0, 5).map((article) => (
                      <Link key={article.id} href={`/articulo/${article.slug}`}>
                        <div className="border-l-2 border-[hsl(355,70%,48%)] pl-4 py-2 hover-elevate transition-all cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {article.publishedAt && format(new Date(article.publishedAt), "HH:mm", { locale: es })}
                            </span>
                          </div>
                          <p className="text-sm font-medium line-clamp-2 hover:text-[hsl(355,70%,48%)] transition-colors">
                            {article.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
