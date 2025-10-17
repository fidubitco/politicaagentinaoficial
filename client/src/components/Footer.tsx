import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const footerLinks = {
    "Secciones": ["Nacional", "Provincial", "Economía", "Internacional", "Tecnología"],
    "Recursos": ["Dashboard IA", "API Datos", "Metodología", "Documentación"],
    "Empresa": ["Sobre Nosotros", "Equipo", "Contacto", "Prensa"]
  };

  return (
    <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              POLÍTICA ARGENTINA
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Análisis político con inteligencia artificial. El futuro del periodismo.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-linkedin">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-github">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate" data-testid="button-social-mail">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4" data-testid={`heading-footer-${category.toLowerCase()}`}>{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground justify-start"
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

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2025 Política Argentina. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Button variant="ghost" className="h-auto p-0" data-testid="link-privacidad">Privacidad</Button>
            <Button variant="ghost" className="h-auto p-0" data-testid="link-terminos">Términos</Button>
            <Button variant="ghost" className="h-auto p-0" data-testid="link-cookies">Cookies</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
