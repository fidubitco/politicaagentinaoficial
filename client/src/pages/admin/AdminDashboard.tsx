import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Radio, TrendingUp, CheckCircle } from "lucide-react";

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

  const statCards = [
    {
      title: "Total Artículos",
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Publicados Hoy",
      value: stats?.publishedToday || 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Fuentes Activas",
      value: stats?.activeSources || 0,
      icon: Radio,
      color: "text-purple-500",
    },
    {
      title: "Credibilidad Promedio",
      value: `${stats?.avgCredibility || 0}%`,
      icon: CheckCircle,
      color: "text-orange-500",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vista de actividad próximamente disponible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publicaciones Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calendario de publicaciones próximamente disponible
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
