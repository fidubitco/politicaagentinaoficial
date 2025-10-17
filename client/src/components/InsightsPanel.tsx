import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain } from "lucide-react";

interface Insight {
  scenario: string;
  probability: number;
  trend: "up" | "down" | "stable";
}

interface InsightsPanelProps {
  title: string;
  insights: Insight[];
}

export default function InsightsPanel({ title, insights }: InsightsPanelProps) {
  return (
    <Card className="hover-elevate bg-accent/5 border-accent/30" data-testid="card-insights-panel">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-accent" />
            <span data-testid="text-insights-title">{title}</span>
          </CardTitle>
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-sm">ANÁLISIS</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="space-y-2" data-testid={`insight-item-${idx}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" data-testid="text-scenario">{insight.scenario}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-semibold text-accent" data-testid="text-probability">
                  {insight.probability}%
                </span>
                {insight.trend === "up" && <TrendingUp className="h-4 w-4 text-chart-4" />}
                {insight.trend === "down" && <TrendingUp className="h-4 w-4 text-destructive rotate-180" />}
              </div>
            </div>
            {/* Probability Bar - Bloomberg Style */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${insight.probability}%` }}
              />
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Análisis basado en modelo predictivo con 5000+ variables políticas y económicas
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
