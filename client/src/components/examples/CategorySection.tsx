import CategorySection from '../CategorySection';

export default function CategorySectionExample() {
  const mockCategory = {
    name: "Política Nacional",
    articles: [
      {
        title: "Congreso Aprueba Reforma Electoral con Amplio Consenso",
        category: "Nacional",
        excerpt: "Tras meses de debate, ambas cámaras aprobaron modificaciones al sistema electoral que regirán las elecciones 2025.",
        author: "Redacción",
        date: "15 Oct",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80"
      },
      {
        title: "Análisis IA: Impacto de la Inflación en Intención de Voto",
        category: "Análisis IA",
        excerpt: "Modelo predictivo correlaciona datos económicos con tendencias electorales en las últimas cinco décadas.",
        author: "IA Política",
        date: "14 Oct",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=800&q=80"
      },
      {
        title: "Buenos Aires: Mapa Electoral Actualizado por Municipio",
        category: "Provincial",
        excerpt: "Visualización interactiva muestra distribución de fuerzas políticas en la provincia más poblada del país.",
        author: "Data Team",
        date: "13 Oct",
        readTime: "4 min",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
      }
    ]
  };

  return <CategorySection category={mockCategory} />;
}
