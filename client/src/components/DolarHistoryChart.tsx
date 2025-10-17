import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DolarHistoryChartProps {
  tipo?: "blue" | "oficial" | "mep";
}

const mockHistoricalData = [
  { fecha: "1 Oct", blue: 1380, oficial: 1290, mep: 1395 },
  { fecha: "3 Oct", blue: 1398, oficial: 1292, mep: 1402 },
  { fecha: "5 Oct", blue: 1415, oficial: 1295, mep: 1418 },
  { fecha: "7 Oct", blue: 1408, oficial: 1298, mep: 1425 },
  { fecha: "9 Oct", blue: 1425, oficial: 1305, mep: 1438 },
  { fecha: "11 Oct", blue: 1432, oficial: 1318, mep: 1445 },
  { fecha: "13 Oct", blue: 1418, oficial: 1335, mep: 1452 },
  { fecha: "15 Oct", blue: 1445, oficial: 1358, mep: 1465 },
  { fecha: "17 Oct", blue: 1465, oficial: 1380, mep: 1478 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString('es-AR')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DolarHistoryChart({ tipo = "blue" }: DolarHistoryChartProps) {
  const colors = {
    blue: "hsl(var(--argentina-celeste))",
    oficial: "hsl(var(--primary))",
    mep: "hsl(var(--argentina-amarillo))",
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-serif">Evolución del Dólar - Octubre 2025</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Seguimiento histórico de las principales cotizaciones
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockHistoricalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="fecha" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              stroke="hsl(var(--border))"
              domain={['dataMin - 20', 'dataMax + 20']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="blue" 
              stroke={colors.blue}
              strokeWidth={3}
              dot={{ fill: colors.blue, r: 4 }}
              activeDot={{ r: 6 }}
              name="Dólar Blue"
            />
            <Line 
              type="monotone" 
              dataKey="oficial" 
              stroke={colors.oficial}
              strokeWidth={2}
              dot={{ fill: colors.oficial, r: 3 }}
              name="Dólar Oficial"
            />
            <Line 
              type="monotone" 
              dataKey="mep" 
              stroke={colors.mep}
              strokeWidth={2}
              dot={{ fill: colors.mep, r: 3 }}
              name="Dólar MEP"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Máximo Blue</p>
            <p className="text-lg font-bold" style={{ color: colors.blue }}>$1,465</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mínimo Blue</p>
            <p className="text-lg font-bold" style={{ color: colors.blue }}>$1,380</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Variación Mensual</p>
            <p className="text-lg font-bold text-red-500">+6.2%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
