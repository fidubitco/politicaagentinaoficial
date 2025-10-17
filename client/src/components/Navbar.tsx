import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    "Nacional", "Provincial", "Economía", "Internacional", 
    "Tecnología", "Análisis IA", "Dashboard"
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              POLÍTICA ARGENTINA
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                className="text-sm font-medium hover-elevate"
                data-testid={`nav-${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar noticias..."
                className="pl-10 w-64 bg-card/50"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full mb-4 bg-background/50"
              data-testid="input-mobile-search"
            />
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                className="w-full justify-start hover-elevate"
                data-testid={`mobile-nav-${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
