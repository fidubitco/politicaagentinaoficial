import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Article, InsertArticle, Category, Source } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

const articleFormSchema = z.object({
  title: z.string().min(10, "El título debe tener al menos 10 caracteres"),
  slug: z.string().min(1, "El slug es requerido"),
  summary: z.string().optional(),
  content: z.string().min(50, "El contenido debe tener al menos 50 caracteres"),
  imageUrl: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
  sourceId: z.string().optional(),
  categoryId: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published"]).default("published"),
  credibilityScore: z.number().min(0).max(100).optional(),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

export default function AdminArticleForm() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/admin/articles/:id/edit');
  const isEdit = !!match;
  const articleId = params?.id;
  const { toast } = useToast();
  const [isAutoGenDialogOpen, setIsAutoGenDialogOpen] = useState(false);
  const [autoGenTopic, setAutoGenTopic] = useState("");

  const { data: article } = useQuery<Article>({
    queryKey: ['/api/admin/articles', articleId],
    enabled: isEdit && !!articleId,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: sources } = useQuery<Source[]>({
    queryKey: ['/api/sources'],
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      imageUrl: "",
      status: "published",
      credibilityScore: 70,
    },
  });

  useEffect(() => {
    if (article && isEdit) {
      form.reset({
        title: article.title,
        slug: article.slug,
        summary: article.summary || "",
        content: article.content,
        imageUrl: article.imageUrl || "",
        sourceId: article.sourceId || "",
        categoryId: article.categoryId || "",
        author: article.author || "",
        status: (article.status as any) || "published",
        credibilityScore: article.credibilityScore || 70,
      });
    }
  }, [article, isEdit, form]);

  const mutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const payload = {
        ...data,
        publishedAt: data.status === "published" ? new Date() : null,
      } as any;

      if (isEdit && articleId) {
        return await apiRequest('PUT', `/api/admin/articles/${articleId}`, payload);
      } else {
        return await apiRequest('POST', '/api/admin/articles', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: isEdit ? "Artículo actualizado" : "Artículo creado",
        description: `El artículo ha sido ${isEdit ? 'actualizado' : 'creado'} exitosamente`,
      });
      navigate('/admin/articles');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el artículo",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    mutation.mutate(data);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const autoGenerateMutation = useMutation({
    mutationFn: async (data: { topic?: string; categoryId?: string }) => {
      return await apiRequest('POST', '/api/admin/auto-generate-article', data);
    },
    onSuccess: (data: any) => {
      const article = data.article;
      form.setValue('title', article.title);
      form.setValue('slug', article.slug);
      form.setValue('summary', article.summary);
      form.setValue('content', article.content);
      form.setValue('author', article.author);
      
      setIsAutoGenDialogOpen(false);
      setAutoGenTopic("");
      
      toast({
        title: "Artículo generado",
        description: "El artículo ha sido generado exitosamente. Revisa y ajusta según sea necesario.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al generar",
        description: error.message || "No se pudo generar el artículo automáticamente",
        variant: "destructive",
      });
    },
  });

  const handleAutoGenerate = () => {
    const categoryId = form.getValues('categoryId');
    autoGenerateMutation.mutate({
      topic: autoGenTopic || undefined,
      categoryId: categoryId || undefined,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/articles')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">
              {isEdit ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Modifica los detalles del artículo' : 'Crea un nuevo artículo para el portal'}
            </p>
          </div>
          
          {!isEdit && (
            <Dialog open={isAutoGenDialogOpen} onOpenChange={setIsAutoGenDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="button-auto-generate">
                  <Sparkles className="h-4 w-4" />
                  Generación Automática Premium
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generar Artículo de Nivel Mundial</DialogTitle>
                  <DialogDescription>
                    Utiliza inteligencia artificial de Google Gemini para crear contenido editorial profesional de alta calidad.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Tema del artículo (opcional)</Label>
                    <Input
                      value={autoGenTopic}
                      onChange={(e) => setAutoGenTopic(e.target.value)}
                      placeholder="Ej: Análisis del presupuesto 2025, Reforma judicial..."
                      className="mt-2"
                      data-testid="input-auto-gen-topic"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Si no especificas un tema, se generará un artículo sobre política argentina actual
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAutoGenDialogOpen(false);
                      setAutoGenTopic("");
                    }}
                    disabled={autoGenerateMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAutoGenerate}
                    disabled={autoGenerateMutation.isPending}
                    data-testid="button-generate-confirm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {autoGenerateMutation.isPending ? 'Generando...' : 'Generar Artículo'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Escribe el título del artículo"
                        onChange={(e) => {
                          field.onChange(e);
                          if (!isEdit) {
                            form.setValue('slug', generateSlug(e.target.value));
                          }
                        }}
                        data-testid="input-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL) *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="titulo-del-articulo" data-testid="input-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resumen</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Breve resumen del artículo"
                        rows={3}
                        data-testid="input-summary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Contenido completo del artículo"
                        rows={12}
                        data-testid="input-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Imagen</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." data-testid="input-image-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-source">
                            <SelectValue placeholder="Selecciona una fuente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sources?.map((source) => (
                            <SelectItem key={source.id} value={source.id}>
                              {source.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Autor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre del autor" data-testid="input-author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="scheduled">Programado</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credibilityScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credibilidad (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-credibility"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/articles')}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save">
              <Save className="h-4 w-4 mr-2" />
              {mutation.isPending ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')} Artículo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
