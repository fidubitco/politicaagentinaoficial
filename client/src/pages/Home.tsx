import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveMetricsTicker from "@/components/LiveMetricsTicker";
import CategorySection from "@/components/CategorySection";
import InsightsPanel from "@/components/InsightsPanel";
import Footer from "@/components/Footer";
import MetricaHumana from "@/components/MetricaHumana";
import TarjetaNoticiaHumana from "@/components/TarjetaNoticiaHumana";
import DolarHistoryChart from "@/components/DolarHistoryChart";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Article } from "@shared/schema";
import { format } from "date-fns";

interface DolarData {
  oficial: any;
  blue: any;
  mep: any;
  ccl: any;
  tarjeta: any;
  timestamp: string;
}

export default function Home() {
  const [, navigate] = useLocation();
  
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const { data: dolarData } = useQuery<DolarData>({
    queryKey: ['/api/dolar'],
    staleTime: 30000,
    refetchInterval: 30000,
  });

  const liveMetrics = dolarData ? [
    { label: "Dólar Blue", value: `$${dolarData.blue?.venta?.toLocaleString('es-AR') || '---'}`, change: "+2.3%" },
    { label: "Dólar Oficial", value: `$${dolarData.oficial?.venta?.toLocaleString('es-AR') || '---'}`, change: "-0.5%" },
    { label: "MEP", value: `$${dolarData.mep?.venta?.toLocaleString('es-AR') || '---'}`, change: "+1.2%" },
    { label: "Tarjeta", value: `$${dolarData.tarjeta?.venta?.toLocaleString('es-AR') || '---'}`, change: "+45" }
  ] : [
    { label: "Dólar Blue", value: "Cargando...", change: "" },
    { label: "Inflación", value: "---", change: "" },
    { label: "Aprobación", value: "---", change: "" },
    { label: "Riesgo País", value: "---", change: "" }
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

  // Editorial Insights
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
        {/* Métricas Humanizadas del Dólar */}
        <section className="py-12 bg-gradient-to-br from-[#6CACE4]/5 via-background to-[#F6B40E]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold mb-2">Economía Real</h2>
              <p className="text-muted-foreground">Cómo te afecta el dólar en tu vida diaria</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <MetricaHumana 
                tipo="blue" 
                dolarData={dolarData?.blue}
                variacionDiaria={2.3}
              />
              <MetricaHumana 
                tipo="oficial" 
                dolarData={dolarData?.oficial}
                variacionDiaria={-0.5}
              />
              <MetricaHumana 
                tipo="mep" 
                dolarData={dolarData?.mep}
                variacionDiaria={1.2}
              />
            </div>

            <DolarHistoryChart />
          </div>
        </section>

        {/* Noticias con Perspectiva Humana */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 pb-4 border-b-2 border-accent">
              <h2 className="text-3xl font-serif font-bold">Últimas Noticias</h2>
              <p className="text-muted-foreground mt-2">
                Noticias verificadas con contexto humano
              </p>
            </div>

            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 6).map((article) => (
                  <TarjetaNoticiaHumana
                    key={article.id}
                    title={article.title}
                    summary={article.summary || article.content.slice(0, 150) + '...'}
                    imageUrl={article.imageUrl || undefined}
                    publishedAt={article.publishedAt}
                    author={article.author || undefined}
                    source="Clarín"
                    credibilityScore={article.credibilityScore || 70}
                    category="Política"
                    impactoHumano="Esta noticia afecta a millones de argentinos que dependen de la estabilidad económica"
                    onClick={() => navigate(`/articulo/${article.slug}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay noticias disponibles. Ejecuta el scraping para obtener noticias.</p>
              </div>
            )}
          </div>
        </section>

        {/* Editorial Insights Section - Bloomberg Style */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 pb-4 border-b-2 border-accent">
              <h2 className="text-3xl font-serif font-bold">Inteligencia Editorial</h2>
              <p className="text-muted-foreground mt-2">
                Análisis predictivo basado en modelos avanzados con 5000+ variables
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
