import { TrendingUp, TrendingDown, Minus, Coffee, ShoppingCart, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DolarData {
  compra: number;
  venta: number;
  nombre: string;
  fechaActualizacion: string;
}

interface MetricaHumanaProps {
  tipo: "blue" | "oficial" | "mep";
  dolarData?: DolarData;
  variacionDiaria?: number;
}

const EJEMPLOS_HUMANOS = {
  blue: [
    { item: "Café en bar", precio: 2500, icon: Coffee },
    { item: "Super mensual", precio: 150000, icon: ShoppingCart },
  ],
  oficial: [
    { item: "Nafta (litro)", precio: 1300, icon: Home },
    { item: "Luz (mes)", precio: 45000, icon: Home },
  ],
  mep: [
    { item: "Dólar ahorro", precio: 1800, icon: TrendingUp },
  ],
};

export default function MetricaHumana({ tipo, dolarData, variacionDiaria = 0 }: MetricaHumanaProps) {
  if (!dolarData) {
    return (
      <Card className="hover-elevate">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-4"></div>
            <div className="h-8 bg-muted rounded w-32 mb-2"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const valor = dolarData.venta;
  const ejemplos = EJEMPLOS_HUMANOS[tipo] || [];
  const isPositive = variacionDiaria > 0;
  const isNegative = variacionDiaria < 0;

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const trendColor = isPositive ? "text-red-500" : isNegative ? "text-green-500" : "text-muted-foreground";

  return (
    <Card className="hover-elevate border-l-4 border-l-accent" data-testid={`metrica-${tipo}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{dolarData.nombre}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-serif">${valor.toLocaleString('es-AR')}</span>
              {variacionDiaria !== 0 && (
                <span className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
                  <TrendIcon className="h-4 w-4" />
                  {Math.abs(variacionDiaria).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Impacto en tu vida
          </p>
          {ejemplos.map((ejemplo, idx) => {
            const IconComponent = ejemplo.icon;
            const variacion = variacionDiaria !== 0 ? ((ejemplo.precio * Math.abs(variacionDiaria)) / 100) : 0;
            
            return (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-accent" />
                  <span className="text-sm">{ejemplo.item}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${ejemplo.precio.toLocaleString('es-AR')}</p>
                  {variacion > 0 && (
                    <p className={`text-xs ${trendColor}`}>
                      {isPositive ? '+' : '-'}${Math.round(variacion).toLocaleString('es-AR')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
          Actualizado: {new Date(dolarData.fechaActualizacion).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardContent>
    </Card>
  );
}
