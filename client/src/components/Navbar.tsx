import { Search, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    staleTime: 60000,
  });

  // Get featured categories for navbar
  const navCategories = categories
    ?.filter(cat => cat.isFeatured)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 6) || [];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Editorial Style */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              POLÍTICA ARGENTINA
            </h1>
          </div>

          {/* Desktop Navigation - Clean Editorial */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              className="text-sm font-medium hover-elevate"
              data-testid="nav-home"
              asChild
            >
              <Link href="/">Inicio</Link>
            </Button>
            {navCategories.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                className="text-sm font-medium hover-elevate"
                data-testid={`nav-${cat.slug}`}
                asChild
              >
                <Link href={`/categoria/${cat.slug}`}>{cat.name}</Link>
              </Button>
            ))}
          </div>

          {/* Search Bar - Professional */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-10 w-56 border-border"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-admin" asChild>
              <Link href="/admin">
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Editorial Clean */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-2">
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full mb-4"
              data-testid="input-mobile-search"
            />
            <Button
              variant="ghost"
              className="w-full justify-start hover-elevate"
              data-testid="mobile-nav-home"
              asChild
            >
              <Link href="/">Inicio</Link>
            </Button>
            {navCategories.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                className="w-full justify-start hover-elevate"
                data-testid={`mobile-nav-${cat.slug}`}
                asChild
              >
                <Link href={`/categoria/${cat.slug}`}>{cat.name}</Link>
              </Button>
            ))}
            <Button
              variant="outline"
              className="w-full justify-start gap-2 mt-4"
              data-testid="mobile-button-admin"
              asChild
            >
              <Link href="/admin">
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
