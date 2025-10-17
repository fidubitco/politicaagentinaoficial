import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, SUPPORTED_LOCALES, type SupportedLocale } from "@/contexts/LocaleContext";
import { useLocation } from "wouter";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [location, setLocation] = useLocation();

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    
    // Get current path without locale prefix
    const pathParts = location.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    
    let basePath = location;
    if (firstPart && firstPart in SUPPORTED_LOCALES) {
      // Remove existing locale prefix
      basePath = '/' + pathParts.slice(1).join('/');
    }
    
    // Add new locale prefix (unless it's Spanish - default)
    const newPath = newLocale === 'es' ? basePath : `/${newLocale}${basePath}`;
    setLocation(newPath || '/');
  };

  const currentLocaleInfo = SUPPORTED_LOCALES[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 hover-elevate"
          data-testid="button-language-selector"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLocaleInfo.nativeName}</span>
          <span className="sm:hidden">{currentLocaleInfo.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.values(SUPPORTED_LOCALES).map((localeInfo) => (
          <DropdownMenuItem
            key={localeInfo.code}
            onClick={() => handleLocaleChange(localeInfo.code as SupportedLocale)}
            className="flex items-center justify-between gap-2 cursor-pointer"
            data-testid={`language-option-${localeInfo.code}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{localeInfo.flag}</span>
              <span>{localeInfo.nativeName}</span>
            </div>
            {locale === localeInfo.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
