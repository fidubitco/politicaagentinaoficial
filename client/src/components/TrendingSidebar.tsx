import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  categoryName: string;
  categoryColor: string;
}

export function TrendingSidebar() {
  const { data: trending, isLoading } = useQuery<TrendingArticle[]>({
    queryKey: ["trending-articles"],
    queryFn: async () => {
      const response = await fetch("/api/trending/articles?limit=10");
      if (!response.ok) throw new Error("Failed to fetch trending articles");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Más Leídas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Más Leídas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trending?.map((article, index) => (
            <Link key={article.id} href={`/articulo/${article.slug}`}>
              <div className="group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-primary/20 leading-none">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {article.categoryName && (
                        <Badge
                          variant="secondary"
                          style={{ backgroundColor: `${article.categoryColor}20` }}
                          className="text-xs"
                        >
                          {article.categoryName}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.viewCount.toLocaleString()} vistas
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
