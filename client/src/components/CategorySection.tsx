import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ArticleCard from "./ArticleCard";

interface Category {
  name: string;
  articles: Array<{
    title: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image?: string;
  }>;
}

interface CategorySectionProps {
  category: Category;
}

export default function CategorySection({ category }: CategorySectionProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black" data-testid={`heading-${category.name.toLowerCase()}`}>
            {category.name}
          </h2>
          <Button variant="ghost" className="group hover-elevate" data-testid={`button-ver-mas-${category.name.toLowerCase()}`}>
            Ver más
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.articles.map((article, idx) => (
            <ArticleCard key={idx} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
