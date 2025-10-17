import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminGenerator() {
  const { toast } = useToast();
  const [count, setCount] = useState(30);
  const [result, setResult] = useState<{ created: number; total: number } | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (count: number) => {
      const response = await apiRequest('POST', '/api/admin/generate-articles', { count }) as { created: number; total: number; success: boolean; articles: any[] };
      return response;
    },
    onSuccess: (data) => {
      setResult({ created: data.created, total: data.total });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Artículos generados exitosamente",
        description: `Se crearon ${data.created} de ${data.total} artículos`,
      });
    },
    onError: () => {
      toast({
        title: "Error al generar artículos",
        description: "Ocurrió un error durante la generación",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Generador de Artículos</h1>
        <p className="text-muted-foreground">
          Genera artículos profesionales automáticamente basados en templates predefinidos
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generación Automática
            </CardTitle>
            <CardDescription>
              Crea múltiples artículos profesionales con un solo clic. Los artículos incluyen:
              títulos impactantes, contenido extendido, metadatos y credibilidad automática.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="count">Cantidad de artículos a generar (máx. 30)</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="30"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                disabled={generateMutation.isPending}
              />
            </div>

            <Button
              onClick={() => generateMutation.mutate(count)}
              disabled={generateMutation.isPending}
              size="lg"
              className="w-full"
            >
              {generateMutation.isPending ? (
                <>Generando artículos...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar {count} Artículos
                </>
              )}
            </Button>

            {result && (
              <Card className={`p-4 ${result.created > 0 ? 'bg-green-50 dark:bg-green-950' : 'bg-yellow-50 dark:bg-yellow-950'}`}>
                <div className="flex items-start gap-3">
                  {result.created > 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold mb-1">
                      {result.created > 0 ? 'Generación exitosa' : 'Artículos ya existen'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Se crearon {result.created} de {result.total} artículos.
                      {result.created < result.total && (
                        <> {result.total - result.created} ya existían en la base de datos.</>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características de los artículos generados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Títulos impactantes basados en casos judiciales reales</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Contenido profesional extendido (4-5 párrafos)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Resúmenes optimizados para SEO</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Índice de credibilidad automático (75-95%)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Metadatos y tags predefinidos</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>URLs amigables (slugs) generadas automáticamente</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
