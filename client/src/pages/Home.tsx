import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveMetricsTicker from "@/components/LiveMetricsTicker";
import CategorySection from "@/components/CategorySection";
import DataVisualizationCard from "@/components/DataVisualizationCard";
import Footer from "@/components/Footer";

export default function Home() {
  // Mock data for live metrics ticker
  const liveMetrics = [
    { label: "Dólar Blue", value: "$1,045", change: "+2.3%" },
    { label: "Inflación Mensual", value: "8.3%", change: "-0.5%" },
    { label: "Aprobación Gobierno", value: "42%", change: "+1.2%" },
    { label: "Riesgo País", value: "2,150", change: "+45" },
    { label: "Tendencia Twitter", value: "#EleccionesAR", change: "🔥" }
  ];

  // Mock categories with articles
  const categories = [
    {
      name: "Política Nacional",
      articles: [
        {
          title: "Predicciones IA para Elecciones 2025: Análisis Provincial Completo",
          category: "Análisis Predictivo",
          excerpt: "Nuestro modelo de inteligencia artificial proyecta los escenarios más probables para las próximas elecciones presidenciales.",
          author: "IA Política Argentina",
          date: "16 Oct",
          readTime: "5 min",
          image: "https://images.unsplash.com/photo-1541872703-74c34d9d3abd?w=800&q=80"
        },
        {
          title: "Reforma Electoral: Cómo Afecta a Cada Provincia",
          category: "Nacional",
          excerpt: "Análisis detallado del impacto provincial de la nueva reforma electoral y sus implicancias para 2025.",
          author: "Equipo Investigación",
          date: "15 Oct",
          readTime: "8 min",
          image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80"
        },
        {
          title: "Congreso 2025: Tres Escenarios Posibles según IA",
          category: "Análisis IA",
          excerpt: "Modelo predictivo revela tres posibles composiciones para el próximo Congreso Nacional.",
          author: "Data Team",
          date: "14 Oct",
          readTime: "6 min",
          image: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=800&q=80"
        }
      ]
    },
    {
      name: "Economía & Mercados",
      articles: [
        {
          title: "Dólar Blue: Predicción IA para los Próximos 30 Días",
          category: "Economía",
          excerpt: "Análisis con machine learning proyecta comportamiento del dólar paralelo hasta fin de año.",
          author: "IA Económica",
          date: "16 Oct",
          readTime: "4 min",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
        },
        {
          title: "Inflación: Impacto Político en las Elecciones",
          category: "Análisis",
          excerpt: "Cómo la inflación mensual influye en la intención de voto según nuestros modelos predictivos.",
          author: "Equipo Económico",
          date: "15 Oct",
          readTime: "7 min",
          image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
        },
        {
          title: "Bonos Argentinos: Análisis de Riesgo País",
          category: "Mercados",
          excerpt: "Dashboard interactivo muestra evolución del riesgo país y su correlación con eventos políticos.",
          author: "Data Finance",
          date: "14 Oct",
          readTime: "5 min",
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
        }
      ]
    }
  ];

  // Mock data for visualization cards
  const intentionVotoData = [
    { label: "Milei", value: 45, trend: "up" as const, percentage: "+3.2%" },
    { label: "Massa", value: 38, trend: "down" as const, percentage: "-1.5%" },
    { label: "Bullrich", value: 17, trend: "neutral" as const, percentage: "0.0%" }
  ];

  const provinciasData = [
    { label: "Buenos Aires", value: 42, trend: "up" as const, percentage: "+2.1%" },
    { label: "Córdoba", value: 35, trend: "down" as const, percentage: "-0.8%" },
    { label: "Santa Fe", value: 29, trend: "up" as const, percentage: "+1.5%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <LiveMetricsTicker metrics={liveMetrics} />
      
      {/* Main content */}
      <main>
        {categories.map((category, idx) => (
          <CategorySection key={idx} category={category} />
        ))}

        {/* Data Visualization Section */}
        <section className="py-16 bg-card/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black mb-8">Análisis en Tiempo Real</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DataVisualizationCard
                title="Intención de Voto Nacional"
                data={intentionVotoData}
              />
              <DataVisualizationCard
                title="Provincias Clave"
                data={provinciasData}
              />
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover-elevate flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold mb-4">Dashboard Completo</h3>
                <p className="text-muted-foreground mb-6">
                  Accede a visualizaciones 3D, predicciones IA y análisis avanzado
                </p>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover-elevate active-elevate-2" data-testid="button-access-dashboard">
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
