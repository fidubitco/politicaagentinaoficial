import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Eye, Share2, Volume2, Facebook, Twitter, Linkedin, Link2, Clock } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SEOHead } from "@/components/SEOHead";
import { LazyImage } from "@/components/LazyImage";
import parse from 'html-react-parser';

export default function ArticlePage() {
  const [, params] = useRoute("/articulo/:slug");
  const slug = params?.slug;

  const { data: article, isLoading, error } = useQuery<Article & { categoryName?: string }>({
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
    <>
      <SEOHead
        title={article.title}
        description={article.summary || article.title}
        image={article.imageUrl || undefined}
        article={{
          publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
          modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
          author: article.author || undefined,
          section: article.categoryName || undefined,
          tags: article.categoryName ? [article.categoryName] : undefined,
        }}
        keywords={article.categoryName ? [article.categoryName, 'política argentina', 'noticias'] : undefined}
        canonical={`https://politica-argentina.replit.app/articulo/${article.slug}`}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back">
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

          {/* Metadata - Enhanced World-Class Style */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {article.author && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Por {article.author}</p>
                    <p className="text-xs">Redactor Senior</p>
                  </div>
                </div>
              )}
              <Separator orientation="vertical" className="h-10 hidden md:block" />
              {article.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(article.publishedAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </span>
                </div>
              )}
              <Separator orientation="vertical" className="h-10 hidden md:block" />
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount.toLocaleString('es-AR')} lecturas</span>
              </div>
              <Separator orientation="vertical" className="h-10 hidden md:block" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(article.content.length / 1000)} min de lectura</span>
              </div>
            </div>

            {/* Enhanced Social Sharing Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
              <span className="text-sm font-medium text-muted-foreground mr-2">Compartir:</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank');
                }}
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Enlace copiado al portapapeles');
                }}
                data-testid="button-copy-link"
              >
                <Link2 className="h-4 w-4" />
                Copiar enlace
              </Button>
              {navigator.share && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 md:hidden"
                  onClick={() => {
                    navigator.share({
                      title: article.title,
                      text: article.summary || article.title,
                      url: window.location.href,
                    });
                  }}
                  data-testid="button-share"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </Button>
              )}
            </div>
          </div>

          {/* Audio Player */}
          {article.audioUrl && (
            <Card className="p-6 mb-8 bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <Volume2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Escucha el artículo estilo podcast</h3>
              </div>
              <audio controls className="w-full" data-testid="article-audio-player">
                <source src={article.audioUrl} type="audio/mpeg" />
                Tu navegador no soporta la reproducción de audio.
              </audio>
            </Card>
          )}

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
              <LazyImage
                src={article.imageUrl}
                alt={article.title}
                aspectRatio="aspect-[16/9]"
                enableZoom={false}
                photographer={(article.metadata as any)?.photographer}
                photographerUrl={(article.metadata as any)?.photographerUrl}
                data-testid="article-image"
              />
            </div>
          )}

          {/* Article Content - World-Class Typography */}
          <div className="article-content prose prose-lg md:prose-xl max-w-none mb-12">
            <style>{`
              .article-content {
                font-family: 'Georgia', 'Times New Roman', serif;
                line-height: 1.8;
                color: var(--foreground);
              }
              .article-content p {
                margin-bottom: 1.5rem;
                font-size: 1.125rem;
                line-height: 1.9;
                text-align: justify;
              }
              .article-content h2 {
                font-size: 1.875rem;
                font-weight: 700;
                margin-top: 3rem;
                margin-bottom: 1.5rem;
                font-family: 'Inter', sans-serif;
                color: var(--foreground);
                border-left: 4px solid var(--primary);
                padding-left: 1rem;
              }
              .article-content h3 {
                font-size: 1.5rem;
                font-weight: 600;
                margin-top: 2rem;
                margin-bottom: 1rem;
                font-family: 'Inter', sans-serif;
                color: var(--foreground);
              }
              .article-content strong {
                font-weight: 700;
                color: var(--foreground);
              }
              .article-content a {
                color: var(--primary);
                text-decoration: underline;
                transition: opacity 0.2s;
              }
              .article-content a:hover {
                opacity: 0.8;
              }
              @media (max-width: 768px) {
                .article-content p {
                  font-size: 1rem;
                  text-align: left;
                }
                .article-content h2 {
                  font-size: 1.5rem;
                }
                .article-content h3 {
                  font-size: 1.25rem;
                }
              }
            `}</style>
            {parse(article.content)}
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
    </>
  );
}
