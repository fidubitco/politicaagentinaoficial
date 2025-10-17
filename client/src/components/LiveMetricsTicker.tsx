interface Metric {
  label: string;
  value: string;
  change?: string;
}

interface LiveMetricsTickerProps {
  metrics: Metric[];
}

export default function LiveMetricsTicker({ metrics }: LiveMetricsTickerProps) {
  return (
    <div className="bg-primary text-primary-foreground py-2 border-b border-primary-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
            <span>EN VIVO</span>
          </div>
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-2 whitespace-nowrap text-sm" data-testid={`ticker-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className="font-semibold">{metric.label}:</span>
              <span className="font-mono" data-testid="text-ticker-value">{metric.value}</span>
              {metric.change && (
                <span className={`font-mono ${metric.change.startsWith('+') ? 'opacity-90' : 'opacity-90'}`} data-testid="text-ticker-change">
                  {metric.change}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
