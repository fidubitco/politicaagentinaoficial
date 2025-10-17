import InsightsPanel from '../InsightsPanel';

export default function InsightsPanelExample() {
  const mockInsights = [
    { scenario: "Victoria Milei 1ra Vuelta", probability: 42, trend: "up" as const },
    { scenario: "Ballotage Milei vs Massa", probability: 38, trend: "stable" as const },
    { scenario: "Victoria Bullrich", probability: 15, trend: "down" as const }
  ];

  return (
    <div className="p-8 max-w-md">
      <InsightsPanel
        title="Predicción Electoral IA"
        insights={mockInsights}
      />
    </div>
  );
}
