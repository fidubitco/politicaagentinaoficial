interface Metric {
  label: string;
  value: string;
  change: string;
}

interface LiveMetricsTickerProps {
  metrics: Metric[];
}

export default function LiveMetricsTicker({ metrics }: LiveMetricsTickerProps) {
  return (
    <div className="bg-card/30 backdrop-blur-sm border-y border-border/50 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-muted-foreground">EN VIVO</span>
          </div>
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-3 whitespace-nowrap" data-testid={`ticker-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className="text-sm text-muted-foreground">{metric.label}:</span>
              <span className="font-semibold" data-testid="text-ticker-value">{metric.value}</span>
              <span className={`text-sm ${metric.change.startsWith('+') ? 'text-chart-4' : 'text-destructive'}`} data-testid="text-ticker-change">
                {metric.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
