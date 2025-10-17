import ArticleCard from '../ArticleCard';

export default function ArticleCardExample() {
  return (
    <div className="p-8 max-w-md">
      <ArticleCard
        title="Predicciones IA para Elecciones 2025: Análisis Provincial Completo"
        category="Análisis Predictivo"
        excerpt="Nuestro modelo de inteligencia artificial proyecta los escenarios más probables para las próximas elecciones presidenciales, con análisis detallado por provincia."
        author="IA Política Argentina"
        date="16 Oct"
        readTime="5 min"
        image="https://images.unsplash.com/photo-1541872703-74c34d9d3abd?w=800&q=80"
      />
    </div>
  );
}
