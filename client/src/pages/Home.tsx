import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveMetricsTicker from "@/components/LiveMetricsTicker";
import CategorySection from "@/components/CategorySection";
import InsightsPanel from "@/components/InsightsPanel";
import Footer from "@/components/Footer";

export default function Home() {
  // Live metrics for ticker
  const liveMetrics = [
    { label: "Dólar Blue", value: "$1,045", change: "+2.3%" },
    { label: "Inflación", value: "8.3%", change: "-0.5%" },
    { label: "Aprobación", value: "42%", change: "+1.2%" },
    { label: "Riesgo País", value: "2,150", change: "+45" }
  ];

  // Categories with articles
  const categories = [
    {
      name: "Política Nacional",
      articles: [
        {
          title: "Congreso Aprueba Reforma Electoral con Amplio Consenso",
          category: "Nacional",
          excerpt: "Tras meses de debate, ambas cámaras aprobaron modificaciones al sistema electoral que regirán las elecciones 2025.",
          author: "Redacción Política",
          date: "16 Oct",
          readTime: "8 min",
          image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80"
        },
        {
          title: "Análisis IA: Impacto de Inflación en Intención de Voto",
          category: "Análisis IA",
          excerpt: "Modelo predictivo correlaciona datos económicos con tendencias electorales en las últimas cinco décadas.",
          author: "IA Política",
          date: "15 Oct",
          readTime: "6 min",
          image: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=800&q=80"
        },
        {
          title: "Buenos Aires: Mapa Electoral por Municipio",
          category: "Provincial",
          excerpt: "Visualización interactiva muestra distribución de fuerzas políticas en la provincia más poblada del país.",
          author: "Data Team",
          date: "14 Oct",
          readTime: "5 min",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
        }
      ]
    },
    {
      name: "Economía & Mercados",
      articles: [
        {
          title: "Dólar: Proyección IA para los Próximos 30 Días",
          category: "Economía",
          excerpt: "Sistema de machine learning analiza variables macroeconómicas para proyectar comportamiento del tipo de cambio.",
          author: "Equipo Económico",
          date: "16 Oct",
          readTime: "5 min",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
        },
        {
          title: "Bonos Argentinos: Análisis de Riesgo País",
          category: "Mercados",
          excerpt: "Dashboard muestra evolución del riesgo país y correlación con eventos políticos clave.",
          author: "Analistas Financieros",
          date: "15 Oct",
          readTime: "7 min",
          image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
        },
        {
          title: "Impacto Electoral de Indicadores Económicos",
          category: "Análisis",
          excerpt: "Cómo las variables macroeconómicas influyen en la intención de voto según modelos predictivos.",
          author: "Data Política",
          date: "14 Oct",
          readTime: "6 min",
          image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
        }
      ]
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
