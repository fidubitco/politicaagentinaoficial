import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface ArticleCardProps {
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
}

export default function ArticleCard({
  title,
  category,
  excerpt,
  author,
  date,
  readTime,
  image
}: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer group" data-testid={`card-article-${title.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`}>
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-4 left-4 z-20 bg-primary/90 backdrop-blur-sm" data-testid={`badge-category-${category.toLowerCase()}`}>
            {category}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors" data-testid="text-article-title">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2" data-testid="text-article-excerpt">
          {excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border/50">
          <span className="font-medium" data-testid="text-article-author">{author}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span data-testid="text-article-date">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span data-testid="text-article-readtime">{readTime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
