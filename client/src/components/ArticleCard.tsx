import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="overflow-hidden hover-elevate transition-all cursor-pointer group border" data-testid={`card-article-${title.toLowerCase().replace(/\s+/g, '-').substring(0, 20)}`}>
      {/* Image - Editorial Style */}
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold" data-testid={`badge-category-${category.toLowerCase()}`}>
            {category}
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        {/* Serif Headline - NYT Style */}
        <h3 className="text-xl font-serif font-semibold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2" data-testid="text-article-title">
          {title}
        </h3>

        {/* Excerpt - Sans Serif */}
        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2" data-testid="text-article-excerpt">
          {excerpt}
        </p>

        {/* Metadata - Professional */}
        <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
          <span className="font-medium text-foreground" data-testid="text-article-author">{author}</span>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span data-testid="text-article-date">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span data-testid="text-article-readtime">{readTime}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
