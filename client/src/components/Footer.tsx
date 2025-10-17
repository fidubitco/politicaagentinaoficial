import { Twitter, Linkedin, Mail, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const footerSections = {
    "Secciones": ["Nacional", "Provincial", "Economía", "Internacional", "Tecnología", "Deportes"],
    "Análisis": ["Dashboard IA", "Predicciones", "Encuestas", "Datos Abiertos", "Metodología"],
    "Información": ["Sobre Nosotros", "Equipo Editorial", "Contacto", "Anunciar", "Newsletter"]
  };

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">
              POLÍTICA ARGENTINA
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Análisis político con inteligencia artificial. Cobertura profesional de la política nacional y provincial.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-linkedin">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-mail">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links - Editorial Taxonomy */}
          {Object.entries(footerSections).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide" data-testid={`heading-footer-${section.toLowerCase()}`}>
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start font-normal"
                      data-testid={`link-footer-${link.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © 2024 Política Argentina. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Button variant="ghost" className="h-auto p-0 text-sm hover:text-foreground" data-testid="link-privacidad">
              Privacidad
            </Button>
            <Button variant="ghost" className="h-auto p-0 text-sm hover:text-foreground" data-testid="link-terminos">
              Términos de Uso
            </Button>
            <Button variant="ghost" className="h-auto p-0 text-sm hover:text-foreground" data-testid="link-cookies">
              Política de Cookies
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
