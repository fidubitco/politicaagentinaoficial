import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminArticles() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: "Artículo eliminado",
        description: "El artículo ha sido eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el artículo",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status?: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      published: { variant: "default", label: "Publicado" },
      draft: { variant: "secondary", label: "Borrador" },
      scheduled: { variant: "outline", label: "Programado" },
    };
    
    const config = variants[status || "published"] || variants.published;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Artículos</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Artículo
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Artículos</h1>
          <p className="text-muted-foreground">Gestiona todos tus artículos</p>
        </div>
        <Button onClick={() => navigate('/admin/articles/new')} data-testid="button-new-article">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Artículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Artículos ({articles?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                  data-testid={`article-row-${article.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{article.title}</h3>
                      {getStatusBadge(article.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {article.summary || article.content.slice(0, 100)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {article.publishedAt && (
                        <span>
                          Publicado: {format(new Date(article.publishedAt), "dd MMM yyyy", { locale: es })}
                        </span>
                      )}
                      {article.author && <span>Por: {article.author}</span>}
                      {article.credibilityScore && (
                        <span>Credibilidad: {article.credibilityScore}%</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                      data-testid={`button-edit-${article.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(article.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${article.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No hay artículos disponibles</p>
                <Button onClick={() => navigate('/admin/articles/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Artículo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
