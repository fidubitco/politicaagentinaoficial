import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Award, Users, Target, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://politica-argentina.replit.app";
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "POLÍTICA ARGENTINA",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`
    },
    "description": "Portal líder de noticias políticas de Argentina. Cobertura 24/7, análisis experto y datos en tiempo real.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/PoliticaArg",
      "https://facebook.com/PoliticaArgentina"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Editorial",
      "email": "redaccion@politica-argentina.com.ar"
    }
  };

  const teamMembers = [
    {
      name: "Dr. Martín Rodríguez",
      role: "Director Editorial",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      description: "20 años de experiencia en periodismo político"
    },
    {
      name: "Lic. Carolina Fernández",
      role: "Editora de Política",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      description: "Especialista en análisis legislativo"
    },
    {
      name: "Lic. Santiago Morales",
      role: "Editor de Economía",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      description: "Economista y analista de políticas públicas"
    },
    {
      name: "Dra. Laura Gómez",
      role: "Directora de Datos",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      description: "Experta en visualización y análisis de datos"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Precisión",
      description: "Verificamos cada dato y fuente antes de publicar. La exactitud es nuestro compromiso inquebrantable."
    },
    {
      icon: TrendingUp,
      title: "Independencia",
      description: "Sin afiliaciones políticas. Nuestro único compromiso es con la verdad y nuestros lectores."
    },
    {
      icon: CheckCircle2,
      title: "Transparencia",
      description: "Citamos fuentes, corregimos errores públicamente y mantenemos estándares éticos rigurosos."
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Fomentamos el debate informado y constructivo. Nuestra misión es fortalecer la democracia."
    }
  ];

  const timeline = [
    { year: "2024", event: "Lanzamiento de POLÍTICA ARGENTINA como portal premium de noticias políticas" },
    { year: "2024", event: "Implementación de sistema de datos en tiempo real y visualizaciones avanzadas" },
    { year: "2024", event: "Reconocimiento como uno de los portales más innovadores de Argentina" },
    { year: "2025", event: "Expansión de cobertura y equipo editorial de élite" }
  ];

  const awards = [
    { title: "Premio Digital Argentina 2024", category: "Mejor Portal de Noticias" },
    { title: "Reconocimiento ADEPA", category: "Excelencia en Periodismo Digital" },
    { title: "Innovation Award", category: "Visualización de Datos Políticos" }
  ];

  return (
    <>
      <SEOHead
        title="Sobre Nosotros"
        description="POLÍTICA ARGENTINA es el portal líder de noticias políticas de Argentina. Conoce nuestra misión, visión, equipo editorial y compromiso con el periodismo de excelencia."
        keywords={["política argentina", "periodismo", "noticias", "equipo editorial", "misión", "valores periodísticos"]}
        canonical={`${siteUrl}/nosotros`}
      />
      
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[hsl(355,70%,48%)] to-[hsl(355,70%,38%)] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 mb-6">
              Sobre Nosotros
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6" data-testid="text-about-title">
              Periodismo de Excelencia<br />para la Argentina
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed" data-testid="text-about-subtitle">
              Somos el portal líder de noticias políticas de Argentina, comprometidos con la verdad, 
              la independencia y el análisis profundo que fortalece nuestra democracia.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover-elevate">
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-[hsl(355,70%,48%)] mb-4" />
                  <h2 className="text-3xl font-serif font-bold mb-4">Nuestra Misión</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Informar con precisión, analizar con profundidad y contextualizar la política argentina 
                    para empoderar a los ciudadanos con el conocimiento necesario para participar activamente 
                    en la vida democrática del país.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-elevate">
                <CardContent className="p-8">
                  <TrendingUp className="h-12 w-12 text-[hsl(185,60%,45%)] mb-4" />
                  <h2 className="text-3xl font-serif font-bold mb-4">Nuestra Visión</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Ser el portal de referencia en Argentina para el análisis político, reconocido por nuestra 
                    independencia editorial, innovación tecnológica y compromiso inquebrantable con el periodismo 
                    de calidad que Argentina merece.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Nuestros Valores</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Principios que guían cada artículo, análisis y decisión editorial
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(355,70%,48%)]/10 mb-4">
                      <value.icon className="h-8 w-8 text-[hsl(355,70%,48%)]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Nuestro Equipo Editorial</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profesionales comprometidos con la excelencia periodística
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group" data-testid={`team-member-${index}`}>
                  <div className="relative mb-4 overflow-hidden rounded-full w-48 h-48 mx-auto">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-[hsl(355,70%,48%)] font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Nuestra Historia</h2>
              <p className="text-lg text-muted-foreground">
                El camino hacia la excelencia periodística
              </p>
            </div>
            
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 items-start" data-testid={`timeline-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[hsl(355,70%,48%)] text-white flex items-center justify-center font-bold">
                      {item.year}
                    </div>
                  </div>
                  <Card className="flex-1 hover-elevate">
                    <CardContent className="p-6">
                      <p className="text-lg leading-relaxed">{item.event}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-4">Premios y Reconocimientos</h2>
              <p className="text-lg text-muted-foreground">
                Nuestro compromiso reconocido por la industria
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {awards.map((award, index) => (
                <Card key={index} className="hover-elevate" data-testid={`award-${index}`}>
                  <CardContent className="p-8 text-center">
                    <Award className="h-12 w-12 text-[hsl(30,95%,55%)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
                    <p className="text-muted-foreground">{award.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
