import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
  trend: "up" | "down" | "neutral";
  percentage: string;
}

interface DataVisualizationCardProps {
  title: string;
  data: DataPoint[];
}

export default function DataVisualizationCard({ title, data }: DataVisualizationCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-chart-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-chart-4";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="hover-elevate border-l-4 border-l-primary" data-testid={`card-data-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold" data-testid="text-card-title">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card hover-elevate" data-testid={`data-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex-1">
              <div className="font-medium text-sm mb-1" data-testid="text-data-label">{item.label}</div>
              <div className="text-2xl font-bold" data-testid="text-data-value">{item.value}%</div>
            </div>
            <div className={`flex items-center gap-2 ${getTrendColor(item.trend)}`}>
              {getTrendIcon(item.trend)}
              <span className="font-semibold" data-testid="text-data-trend">{item.percentage}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
