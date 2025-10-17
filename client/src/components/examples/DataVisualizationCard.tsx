import DataVisualizationCard from '../DataVisualizationCard';

export default function DataVisualizationCardExample() {
  const mockData = [
    { label: "Milei", value: 45, trend: "up" as const, percentage: "+3.2%" },
    { label: "Massa", value: 38, trend: "down" as const, percentage: "-1.5%" },
    { label: "Bullrich", value: 17, trend: "neutral" as const, percentage: "0.0%" }
  ];

  return (
    <div className="p-8 max-w-md">
      <DataVisualizationCard
        title="Intención de Voto Nacional"
        data={mockData}
      />
    </div>
  );
}
