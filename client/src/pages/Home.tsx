import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveMetricsTicker from "@/components/LiveMetricsTicker";
import CategorySection from "@/components/CategorySection";
import InsightsPanel from "@/components/InsightsPanel";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { format } from "date-fns";

export default function Home() {
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 30000,
  });

  // Live metrics for ticker
  const liveMetrics = [
    { label: "Dólar Blue", value: "$1,045", change: "+2.3%" },
    { label: "Inflación", value: "8.3%", change: "-0.5%" },
    { label: "Aprobación", value: "42%", change: "+1.2%" },
    { label: "Riesgo País", value: "2,150", change: "+45" }
  ];

  // Transform API articles to category format
  const categories = articles && articles.length > 0 ? [
    {
      name: "Últimas Noticias",
      articles: articles.slice(0, 6).map(article => ({
        title: article.title,
        category: "Política",
        excerpt: article.summary || article.content.slice(0, 150) + '...',
        author: article.author || "Redacción",
        date: format(new Date(article.publishedAt), "d MMM"),
        readTime: `${Math.ceil(article.content.length / 1000)} min`,
        image: article.imageUrl || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80"
      }))
    }
  ] : [
    {
      name: "Cargando Noticias",
      articles: []
    }
  ];

  // AI Insights
  const electoralInsights = [
    { scenario: "Victoria 1ra Vuelta", probability: 42, trend: "up" as const },
    { scenario: "Ballotage Necesario", probability: 38, trend: "stable" as const },
    { scenario: "Sorpresa Electoral", probability: 20, trend: "down" as const }
  ];

  const economicInsights = [
    { scenario: "Dólar Estable", probability: 55, trend: "up" as const },
    { scenario: "Volatilidad Media", probability: 30, trend: "stable" as const },
    { scenario: "Alta Volatilidad", probability: 15, trend: "down" as const }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LiveMetricsTicker metrics={liveMetrics} />
      <Hero />
      
      {/* Main Content */}
      <main>
        {/* Editorial Sections */}
        {categories.map((category, idx) => (
          <CategorySection key={idx} category={category} />
        ))}

        {/* AI Insights Section - Bloomberg Style */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 pb-4 border-b-2 border-accent">
              <h2 className="text-3xl font-serif font-bold">Análisis con Inteligencia Artificial</h2>
              <p className="text-muted-foreground mt-2">
                Predicciones basadas en modelos de machine learning con 5000+ variables
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InsightsPanel
                title="Escenarios Electorales 2025"
                insights={electoralInsights}
              />
              <InsightsPanel
                title="Proyección Económica"
                insights={economicInsights}
              />
              
              {/* CTA Card */}
              <div className="p-8 rounded-sm bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 flex flex-col justify-center">
                <h3 className="text-2xl font-serif font-bold mb-4">Dashboard Completo</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Accede a visualizaciones avanzadas, predicciones en tiempo real y análisis profundo
                </p>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-sm font-semibold hover-elevate active-elevate-2 transition-all" data-testid="button-dashboard-access">
                  Explorar Dashboard →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
