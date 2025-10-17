import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lead Story Package - Editorial Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Story - Large */}
          <div className="lg:col-span-2">
            <div className="group cursor-pointer">
              <div className="relative aspect-[16/9] overflow-hidden rounded-sm mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1541872703-74c34d9d3abd?w=1200&q=80"
                  alt="Featured story"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-sm">
                    ANÁLISIS EXCLUSIVO
                  </span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight group-hover:text-primary transition-colors" data-testid="text-hero-headline">
                Análisis Electoral 2025: Tres Escenarios Clave
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed" data-testid="text-hero-excerpt">
                Nuestro equipo analiza 5000+ variables políticas y económicas 
                para proyectar los escenarios más probables en las próximas elecciones presidenciales. 
                Análisis provincial completo y proyección de resultados por distrito.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Equipo Editorial</span>
                <span>•</span>
                <span>16 Oct 2024</span>
                <span>•</span>
                <span>8 min lectura</span>
              </div>
            </div>
          </div>

          {/* Secondary Stories - Right Rail */}
          <div className="lg:col-span-1 space-y-6">
            {[
              {
                title: "Dólar Blue: Proyección Exclusiva para Próximos 30 Días",
                category: "Economía",
                time: "5 min",
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80"
              },
              {
                title: "Congreso Nacional: Mapeo de Bloques y Alianzas",
                category: "Política",
                time: "6 min",
                image: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=400&q=80"
              },
              {
                title: "Provincias Clave: Análisis Electoral Detallado",
                category: "Provincial",
                time: "7 min",
                image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80"
              }
            ].map((story, idx) => (
              <div key={idx} className="group cursor-pointer flex gap-4" data-testid={`story-secondary-${idx}`}>
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-sm">
                  <img 
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{story.category}</span>
                  <h3 className="font-serif font-semibold text-base leading-tight mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">{story.time}</span>
                </div>
              </div>
            ))}
            
            {/* CTA to Dashboard */}
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full justify-between group hover-elevate" data-testid="button-dashboard-cta">
                Ver Dashboard Completo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
