import { useState } from "react";
import { useLocale, SUPPORTED_LOCALES, SupportedLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function LanguageSwitcher() {
  const { locale, setLocale, getLocalePath } = useLocale();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);

    // Get current path without locale prefix
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');

    // Navigate to new locale path
    const newPath = newLocale === 'es' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    setLocation(newPath);

    // Reload to apply translation
    window.location.href = newPath;
  };

  const currentLocaleInfo = SUPPORTED_LOCALES[locale];

  // Group locales by region
  const localeGroups = {
    "América": ['es', 'en', 'pt'] as SupportedLocale[],
    "Europa": ['fr', 'de', 'it', 'ru'] as SupportedLocale[],
    "Asia": ['ja', 'zh'] as SupportedLocale[],
    "Medio Oriente": ['ar'] as SupportedLocale[],
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 font-medium hover:bg-primary/10 transition-all duration-300"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{currentLocaleInfo.flag}</span>
          <span className="hidden lg:inline">{currentLocaleInfo.nativeName}</span>
          <span className="lg:hidden">{currentLocaleInfo.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-2 bg-card/95 backdrop-blur-xl border-border/50">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Selecciona tu idioma
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            El contenido se traducirá automáticamente
          </p>
        </div>

        <AnimatePresence>
          {Object.entries(localeGroups).map(([region, locales]) => (
            <div key={region}>
              <div className="px-3 py-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {region}
                </p>
              </div>

              {locales.map((localeCode) => {
                const localeInfo = SUPPORTED_LOCALES[localeCode];
                const isActive = locale === localeCode;

                return (
                  <motion.div
                    key={localeCode}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownMenuItem
                      onClick={() => handleLocaleChange(localeCode)}
                      className={`
                        flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-md
                        transition-all duration-200
                        ${isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{localeInfo.flag}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {localeInfo.nativeName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {localeInfo.name}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </DropdownMenuItem>
                  </motion.div>
                );
              })}

              <DropdownMenuSeparator className="my-2" />
            </div>
          ))}
        </AnimatePresence>

        <div className="px-3 py-2 mt-2 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Traducción automática:</strong> Todo el contenido se traduce instantáneamente a tu idioma preferido.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile
export function LanguageSwitcherCompact() {
  const { locale, setLocale } = useLocale();
  const [, setLocation] = useLocation();

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);

    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath = newLocale === 'es' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;

    setLocation(newPath);
    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {Object.values(SUPPORTED_LOCALES).map((localeInfo) => (
        <Button
          key={localeInfo.code}
          variant={locale === localeInfo.code ? "default" : "outline"}
          size="sm"
          onClick={() => handleLocaleChange(localeInfo.code)}
          className="min-w-fit gap-1.5 text-xs"
        >
          <span>{localeInfo.flag}</span>
          <span className="hidden sm:inline">{localeInfo.code.toUpperCase()}</span>
        </Button>
      ))}
    </div>
  );
}
