import ArticleCard from '../ArticleCard';

export default function ArticleCardExample() {
  return (
    <div className="p-8 max-w-md">
      <ArticleCard
        title="Análisis Electoral 2025: Tres Escenarios Según Modelo IA"
        category="Análisis Predictivo"
        excerpt="Sistema de inteligencia artificial evalúa variables económicas, sociales y políticas para proyectar resultados electorales con 94% de precisión histórica."
        author="Equipo IA Política"
        date="16 Oct"
        readTime="5 min"
        image="https://images.unsplash.com/photo-1541872703-74c34d9d3abd?w=800&q=80"
      />
    </div>
  );
}
