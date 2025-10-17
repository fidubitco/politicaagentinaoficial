import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Source, InsertSource } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminSources() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [formData, setFormData] = useState<Partial<InsertSource>>({
    name: "",
    url: "",
    logoUrl: "",
    credibilityScore: 50,
    isActive: true,
  });

  const { data: sources, isLoading } = useQuery<Source[]>({
    queryKey: ['/api/sources'],
    staleTime: 10000,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSource) => {
      await apiRequest('POST', '/api/sources', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sources'] });
      toast({ title: "Fuente creada exitosamente" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSource> }) => {
      await apiRequest('PUT', `/api/admin/sources/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sources'] });
      toast({ title: "Fuente actualizada" });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/sources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sources'] });
      toast({ title: "Fuente eliminada" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      logoUrl: "",
      credibilityScore: 50,
      isActive: true,
    });
    setEditingSource(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSource) {
      updateMutation.mutate({ id: editingSource.id, data: formData as InsertSource });
    } else {
      createMutation.mutate(formData as InsertSource);
    }
  };

  const handleEdit = (source: Source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      url: source.url,
      logoUrl: source.logoUrl || "",
      credibilityScore: source.credibilityScore || 50,
      isActive: source.isActive,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-serif font-bold mb-8">Fuentes</h1>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
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
          <h1 className="text-3xl font-serif font-bold mb-2">Fuentes</h1>
          <p className="text-muted-foreground">Gestiona las fuentes de noticias</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-new-source">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Fuente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSource ? 'Editar' : 'Nueva'} Fuente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Clarín, La Nación..."
                  required
                />
              </div>
              <div>
                <Label>URL *</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input
                  value={formData.logoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Credibilidad (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.credibilityScore || 50}
                  onChange={(e) => setFormData({ ...formData, credibilityScore: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Fuente Activa</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingSource ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Fuentes ({sources?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources && sources.length > 0 ? (
              sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{source.name}</h3>
                      {source.isActive ? (
                        <Badge variant="default">Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{source.url}</p>
                    {source.credibilityScore && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Credibilidad: {source.credibilityScore}%
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(source)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(source.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No hay fuentes disponibles</p>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Fuente
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
