import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import type { Category } from "@shared/schema";

export default function AdminBulkGenerator() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [articleCount, setArticleCount] = useState<number>(20);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const bulkGenerateMutation = useMutation({
    mutationFn: async ({ categoryId, categoryName, count }: { categoryId: string; categoryName: string; count: number }) => {
      const response = await fetch('/api/admin/generate-bulk-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, categoryName, count }),
      });
      if (!response.ok) throw new Error('Failed to generate');
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "¡Artículos generados exitosamente!",
        description: `Se generaron ${data.count} artículos con contenido AI profesional.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: () => {
      toast({
        title: "Error al generar artículos",
        description: "Hubo un problema al generar los artículos en masa.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!selectedCategory) {
      toast({
        title: "Selecciona una categoría",
        description: "Debes seleccionar una categoría antes de generar artículos.",
        variant: "destructive",
      });
      return;
    }

    const category = categories?.find(c => c.id === selectedCategory);
    if (!category) return;

    bulkGenerateMutation.mutate({
      categoryId: category.id,
      categoryName: category.name,
      count: articleCount,
    });
  };

  const handleGenerateAll = async () => {
    if (!categories) return;

    const totalArticles = categories.reduce((acc, cat) => acc + (cat.isFeatured ? 30 : 20), 0);

    toast({
      title: "Generación masiva iniciada",
      description: `Se generarán ${totalArticles} artículos para ${categories.length} categorías. Esto puede tardar varios minutos...`,
    });

    let successCount = 0;
    let errorCount = 0;

    for (const category of categories) {
      const articlesPerCategory = category.isFeatured ? 30 : 20;
      
      try {
        const result = await fetch('/api/admin/generate-bulk-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            categoryId: category.id, 
            categoryName: category.name, 
            count: articlesPerCategory 
          }),
        });

        if (result.ok) {
          successCount += articlesPerCategory;
        } else {
          errorCount += 1;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        errorCount += 1;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['/api/articles'] });

    toast({
      title: "¡Generación completa!",
      description: `Se generaron ${successCount} artículos exitosamente.${errorCount > 0 ? ` ${errorCount} categorías fallaron.` : ''}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold mb-2">Generador Masivo de Artículos</h1>
        <p className="text-muted-foreground">Crea contenido profesional con IA para múltiples categorías</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generación por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="count">Cantidad de Artículos</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="50"
                value={articleCount}
                onChange={(e) => setArticleCount(parseInt(e.target.value) || 1)}
                data-testid="input-article-count"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={bulkGenerateMutation.isPending || !selectedCategory}
              className="w-full"
              data-testid="button-generate-category"
            >
              {bulkGenerateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar Artículos
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Generación Completa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Genera artículos para TODAS las categorías automáticamente. Las categorías destacadas recibirán 30 artículos, el resto 20.
            </p>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total de categorías:</span>
                <span>{categories?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Artículos estimados:</span>
                <span>
                  {categories?.reduce((acc, cat) => acc + (cat.isFeatured ? 30 : 20), 0) || 0}
                </span>
              </div>
            </div>

            <Button
              onClick={handleGenerateAll}
              disabled={bulkGenerateMutation.isPending || !categories}
              variant="default"
              className="w-full"
              data-testid="button-generate-all"
            >
              {bulkGenerateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar Todo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
