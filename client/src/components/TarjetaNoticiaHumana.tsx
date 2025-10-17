import { Clock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface TarjetaNoticiaHumanaProps {
  title: string;
  summary: string;
  imageUrl?: string;
  publishedAt: string | Date;
  author?: string;
  source?: string;
  credibilityScore?: number;
  category?: string;
  impactoHumano?: string;
  onClick?: () => void;
}

export default function TarjetaNoticiaHumana({
  title,
  summary,
  imageUrl,
  publishedAt,
  author,
  source,
  credibilityScore = 70,
  category,
  impactoHumano,
  onClick
}: TarjetaNoticiaHumanaProps) {
  
  const timeAgo = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale: es
  });

  const isVerified = credibilityScore >= 70;
  const badgeColor = credibilityScore >= 80 ? "bg-green-500/10 text-green-700 dark:text-green-400" :
                     credibilityScore >= 60 ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" :
                     "bg-red-500/10 text-red-700 dark:text-red-400";

  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all" 
      onClick={onClick}
      data-testid="tarjeta-noticia-humana"
    >
      <CardContent className="p-0">
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
            {category && (
              <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">
                {category}
              </Badge>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            {isVerified && (
              <Badge variant="outline" className="gap-1 bg-accent/10 border-accent/30">
                <CheckCircle2 className="h-3 w-3" />
                Verificado
              </Badge>
            )}
            {source && (
              <span className="text-xs text-muted-foreground font-medium">{source}</span>
            )}
          </div>

          <h3 className="text-xl font-serif font-bold mb-3 leading-tight line-clamp-2">
            {title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            {summary}
          </p>

          {impactoHumano && (
            <div className="mb-4 p-3 bg-accent/5 border-l-2 border-accent rounded-r">
              <p className="text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Impacto: </span>
                  {impactoHumano}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo}
              </span>
              {author && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {author}
                </span>
              )}
            </div>

            {credibilityScore && (
              <Badge variant="outline" className={badgeColor}>
                {credibilityScore}% confiable
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
