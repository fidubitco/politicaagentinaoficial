import { Button } from "@/components/ui/button";
import { TrendingUp, Brain, Globe } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Quantum-inspired background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-3/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-chart-3/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Análisis en Tiempo Real</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
          <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Análisis Político
          </span>
          <br />
          <span className="bg-gradient-to-r from-accent via-chart-3 to-primary bg-clip-text text-transparent">
            Cuántico con IA
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
          Predicciones electorales con inteligencia artificial, visualización 3D de datos,
          y análisis predictivo en tiempo real. El futuro del periodismo político.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="min-w-[200px] text-base font-semibold hover-elevate active-elevate-2"
            data-testid="button-explore-predictions"
          >
            <Brain className="mr-2 h-5 w-5" />
            Explorar Predicciones
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-w-[200px] text-base font-semibold hover-elevate active-elevate-2"
            data-testid="button-view-dashboard"
          >
            <Globe className="mr-2 h-5 w-5" />
            Ver Dashboard
          </Button>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { icon: TrendingUp, label: "Predicción Electoral", value: "94% Precisión" },
            { icon: Brain, label: "Análisis IA", value: "5000+ Keywords" },
            { icon: Globe, label: "Cobertura Provincial", value: "24 Provincias" }
          ].map((metric, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-card-border hover-elevate"
              data-testid={`metric-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <metric.icon className="h-8 w-8 text-primary mb-3 mx-auto" />
              <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
