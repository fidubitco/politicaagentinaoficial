import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye, Share2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ArticlePage() {
  const [, params] = useRoute("/articulo/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-8"></div>
            <div className="h-12 bg-muted animate-pulse rounded mb-4"></div>
            <div className="h-6 bg-muted animate-pulse rounded mb-8 w-2/3"></div>
            <div className="h-96 bg-muted animate-pulse rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          {article.categoryId && (
            <Badge variant="default" className="mb-4">
              Política
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Summary */}
          {article.summary && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {article.summary}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-muted-foreground">
            {article.author && (
              <span className="font-medium">Por {article.author}</span>
            )}
            {article.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(article.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.viewCount.toLocaleString('es-AR')} vistas</span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Credibility Score */}
          {article.credibilityScore && (
            <Card className="p-6 mb-8 bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Índice de Credibilidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Basado en análisis de fuentes y verificación de datos
                  </p>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {article.credibilityScore}%
                </div>
              </div>
            </Card>
          )}

          {/* Back to Home */}
          <div className="pt-8 border-t">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver más noticias
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
