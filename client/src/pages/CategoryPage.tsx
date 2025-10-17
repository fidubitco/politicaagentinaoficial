import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveMetricsTicker from "@/components/LiveMetricsTicker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Article, Category } from "@shared/schema";

interface DolarData {
  oficial: any;
  blue: any;
  mep: any;
  ccl: any;
  tarjeta: any;
  timestamp: string;
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 60000,
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 30000,
  });

  const { data: dolarData } = useQuery<DolarData>({
    queryKey: ['/api/dolar'],
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const category = categories?.find(cat => cat.slug === slug);
  const categoryArticles = articles?.filter(article => article.categoryId === category?.id) || [];
  
  const isLoading = categoriesLoading || articlesLoading;

  const liveMetrics = dolarData ? [
    { label: "Dólar Blue", value: `$${dolarData.blue?.venta?.toLocaleString('es-AR') || '---'}`, change: "+2.3%" },
    { label: "Dólar Oficial", value: `$${dolarData.oficial?.venta?.toLocaleString('es-AR') || '---'}`, change: "-0.5%" },
    { label: "MEP", value: `$${dolarData.mep?.venta?.toLocaleString('es-AR') || '---'}`, change: "+1.2%" },
    { label: "Tarjeta", value: `$${dolarData.tarjeta?.venta?.toLocaleString('es-AR') || '---'}`, change: "+45" }
  ] : [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LiveMetricsTicker metrics={liveMetrics} />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-12 bg-muted rounded w-96"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Categoría no encontrada</h1>
          <p className="text-muted-foreground">La categoría que buscas no existe.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LiveMetricsTicker metrics={liveMetrics} />

      {/* Category Header */}
      <section className="py-12 border-b" style={{ 
        backgroundColor: `${category.color || '#6CACE4'}10`,
        borderColor: category.color || '#6CACE4'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge 
            style={{ backgroundColor: category.color || '#6CACE4' }} 
            className="text-white mb-4"
            data-testid="badge-category"
          >
            {category.name}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" data-testid="text-category-name">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl" data-testid="text-category-description">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.map((article) => (
                <a key={article.id} href={`/articulo/${article.slug}`} data-testid={`link-article-${article.slug}`}>
                  <Card className="h-full hover-elevate active-elevate-2">
                    {article.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-article-${article.slug}`}
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="font-serif font-bold text-xl mb-2 line-clamp-2" data-testid={`text-article-title-${article.slug}`}>
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`text-article-summary-${article.slug}`}>
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {article.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(article.publishedAt), "d 'de' MMMM", { locale: es })}</span>
                          </div>
                        )}
                        {article.viewCount !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.viewCount.toLocaleString('es-AR')} vistas</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground" data-testid="text-no-articles">
                No hay artículos publicados en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
