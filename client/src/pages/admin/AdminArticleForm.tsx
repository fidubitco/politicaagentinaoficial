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
import { ArrowLeft, Save, Sparkles, Lightbulb, Volume2, Loader2 } from "lucide-react";

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
  const [topicIdeas, setTopicIdeas] = useState<string[]>([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");

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
      setAudioUrl(article.audioUrl || "");
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

  const generateIdeasMutation = useMutation({
    mutationFn: async (data: { categoryId?: string }) => {
      return await apiRequest('POST', '/api/admin/generate-article-ideas', data);
    },
    onSuccess: (data: any) => {
      setTopicIdeas(data.ideas || []);
      toast({
        title: "Ideas generadas",
        description: "Selecciona una idea o escribe tu propio tema",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al generar ideas",
        description: error.message || "No se pudieron generar ideas de temas",
        variant: "destructive",
      });
    },
  });

  const handleGenerateIdeas = () => {
    const categoryId = form.getValues('categoryId');
    setTopicIdeas([]);
    generateIdeasMutation.mutate({
      categoryId: categoryId || undefined,
    });
  };

  const handleGenerateAudio = async () => {
    if (!articleId || !isEdit) {
      toast({
        title: "Error",
        description: "Guarda el artículo primero antes de generar audio",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAudio(true);
    try {
      const response = await apiRequest('POST', `/api/articles/${articleId}/generate-audio`, {});
      setAudioUrl(response.audioUrl);
      toast({
        title: "Audio generado",
        description: "El audio estilo podcast ha sido generado exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al generar audio",
        description: error.message || "No se pudo generar el audio",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
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
                    <div className="flex items-center justify-between mb-2">
                      <Label>Tema del artículo (opcional)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateIdeas}
                        disabled={generateIdeasMutation.isPending || autoGenerateMutation.isPending}
                        className="gap-1.5"
                        data-testid="button-generate-ideas"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        {generateIdeasMutation.isPending ? 'Generando...' : 'Generar Ideas SEO'}
                      </Button>
                    </div>
                    <Input
                      value={autoGenTopic}
                      onChange={(e) => setAutoGenTopic(e.target.value)}
                      placeholder="Ej: Análisis del presupuesto 2025, Reforma judicial..."
                      className="mt-2"
                      data-testid="input-auto-gen-topic"
                    />
                    
                    {topicIdeas.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Ideas trending optimizadas para SEO:
                        </p>
                        <div className="grid gap-1.5">
                          {topicIdeas.map((idea, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setAutoGenTopic(idea)}
                              className="text-left text-sm p-2 rounded-md hover-elevate active-elevate-2 bg-muted/50 transition-colors"
                              data-testid={`button-idea-${index}`}
                            >
                              {idea}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
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

          {isEdit && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Podcast Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Genera una narración profesional estilo podcast de este artículo usando inteligencia artificial de ElevenLabs.
                </p>
                
                {audioUrl && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Audio generado:</p>
                    <audio controls className="w-full" data-testid="audio-player">
                      <source src={audioUrl} type="audio/mpeg" />
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingAudio}
                  variant="outline"
                  className="w-full gap-2"
                  data-testid="button-generate-audio"
                >
                  {isGeneratingAudio ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando audio profesional...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      {audioUrl ? 'Regenerar Audio' : 'Generar Audio Podcast'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

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
