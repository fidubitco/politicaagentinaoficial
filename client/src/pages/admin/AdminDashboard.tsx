import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Radio, TrendingUp, CheckCircle, Eye, BarChart3, Folder, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article, Category } from "@shared/schema";

interface Stats {
  totalArticles: number;
  publishedToday: number;
  activeSources: number;
  avgCredibility: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/admin/stats'],
    staleTime: 30000,
  });

  const { data: articles } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 30000,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 60000,
  });

  // Calculate category stats
  const categoryStats = categories?.map(cat => {
    const categoryArticles = articles?.filter(a => a.categoryId === cat.id) || [];
    const totalViews = categoryArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
    return {
      ...cat,
      articleCount: categoryArticles.length,
      totalViews,
    };
  }).sort((a, b) => b.articleCount - a.articleCount).slice(0, 5) || [];

  // Top articles by views
  const topArticles = [...(articles || [])]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  // Total views
  const totalViews = articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) || 0;

  const statCards = [
    {
      title: "Total Artículos",
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Vistas Totales",
      value: totalViews.toLocaleString('es-AR'),
      icon: Eye,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Publicados Hoy",
      value: stats?.publishedToday || 0,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Categorías Activas",
      value: categories?.length || 0,
      icon: Folder,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Fuentes Activas",
      value: stats?.activeSources || 0,
      icon: Radio,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Credibilidad Promedio",
      value: `${stats?.avgCredibility || 0}%`,
      icon: CheckCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Panel de control y estadísticas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Categorías por Artículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryStats.length > 0 ? categoryStats.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate">
                  <div className="flex items-center gap-3">
                    <Badge style={{ backgroundColor: cat.color || '#gray' }} className="text-white">
                      {cat.articleCount}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.totalViews.toLocaleString('es-AR')} vistas
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No hay categorías disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Artículos Más Vistos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topArticles.length > 0 ? topArticles.map((article) => (
                <div key={article.id} className="p-3 rounded-lg bg-muted/50 hover-elevate">
                  <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {(article.viewCount || 0).toLocaleString('es-AR')} vistas
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No hay artículos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/admin/articles/new" className="p-4 rounded-lg border hover-elevate active-elevate-2 transition-colors">
              <FileText className="h-5 w-5 mb-2 text-primary" />
              <h4 className="font-medium">Nuevo Artículo</h4>
              <p className="text-xs text-muted-foreground mt-1">Crear contenido editorial</p>
            </a>
            <a href="/admin/generator" className="p-4 rounded-lg border hover-elevate active-elevate-2 transition-colors">
              <Sparkles className="h-5 w-5 mb-2 text-primary" />
              <h4 className="font-medium">Generador IA</h4>
              <p className="text-xs text-muted-foreground mt-1">Crear con Gemini AI</p>
            </a>
            <a href="/admin/categories" className="p-4 rounded-lg border hover-elevate active-elevate-2 transition-colors">
              <Folder className="h-5 w-5 mb-2 text-primary" />
              <h4 className="font-medium">Categorías</h4>
              <p className="text-xs text-muted-foreground mt-1">Gestionar taxonomía</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
