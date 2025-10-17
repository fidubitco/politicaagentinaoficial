import CategorySection from '../CategorySection';

export default function CategorySectionExample() {
  const mockCategory = {
    name: "Política Nacional",
    articles: [
      {
        title: "Reforma Electoral 2025: Impacto en las Provincias",
        category: "Nacional",
        excerpt: "Análisis completo de cómo la nueva reforma electoral afectará el mapa político argentino.",
        author: "Equipo Investigación",
        date: "15 Oct",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80"
      },
      {
        title: "Predicción IA: Escenarios para el Congreso 2025",
        category: "Análisis IA",
        excerpt: "Modelo predictivo muestra tres escenarios posibles para la composición del próximo Congreso.",
        author: "IA Política",
        date: "14 Oct",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=800&q=80"
      },
      {
        title: "Buenos Aires: Mapa Electoral Actualizado",
        category: "Provincial",
        excerpt: "Visualización interactiva muestra las tendencias electorales en la provincia más poblada.",
        author: "Data Team",
        date: "13 Oct",
        readTime: "4 min",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
      }
    ]
  };

  return <CategorySection category={mockCategory} />;
}
