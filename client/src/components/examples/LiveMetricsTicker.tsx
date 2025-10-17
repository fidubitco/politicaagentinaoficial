import LiveMetricsTicker from '../LiveMetricsTicker';

export default function LiveMetricsTickerExample() {
  const mockMetrics = [
    { label: "Dólar Blue", value: "$1,045", change: "+2.3%" },
    { label: "Inflación Mensual", value: "8.3%", change: "-0.5%" },
    { label: "Aprobación Gobierno", value: "42%", change: "+1.2%" },
    { label: "Tendencias Twitter", value: "#EleccionesAR", change: "Trending" }
  ];

  return <LiveMetricsTicker metrics={mockMetrics} />;
}
