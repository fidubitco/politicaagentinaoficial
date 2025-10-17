import LiveMetricsTicker from '../LiveMetricsTicker';

export default function LiveMetricsTickerExample() {
  const mockMetrics = [
    { label: "Dólar Blue", value: "$1,045", change: "+2.3%" },
    { label: "Inflación", value: "8.3%", change: "-0.5%" },
    { label: "Aprobación Gobierno", value: "42%", change: "+1.2%" },
    { label: "Riesgo País", value: "2,150 pts", change: "+45" }
  ];

  return <LiveMetricsTicker metrics={mockMetrics} />;
}
