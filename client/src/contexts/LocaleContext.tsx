import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { translations } from "@/i18n/translations";

export type SupportedLocale = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it' | 'ja' | 'zh' | 'ru' | 'ar';

export const SUPPORTED_LOCALES = {
  es: { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇦🇷' },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
} as const;

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  getLocalePath: (path: string) => string;
  isDefaultLocale: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [locale, setLocaleState] = useState<SupportedLocale>('es');

  // Extract locale from URL path
  useEffect(() => {
    const pathParts = location.split('/').filter(Boolean);
    const firstPart = pathParts[0];
    
    if (firstPart && firstPart in SUPPORTED_LOCALES) {
      setLocaleState(firstPart as SupportedLocale);
    } else {
      setLocaleState('es'); // Default to Spanish
    }
  }, [location]);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLocale') as SupportedLocale;
    if (savedLocale && savedLocale in SUPPORTED_LOCALES) {
      const pathParts = location.split('/').filter(Boolean);
      const firstPart = pathParts[0];
      
      // Only auto-redirect if we're on the default language and not already on a localized route
      if (savedLocale !== 'es' && (!firstPart || !(firstPart in SUPPORTED_LOCALES))) {
        // Don't auto-redirect, just store the preference
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferredLocale', newLocale);
  };

  const t = (key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[locale]?.[key as keyof typeof translations.es] || translations.es?.[key as keyof typeof translations.es] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([key, value]) => {
        translation = translation.replace(`{${key}}`, String(value));
      });
    }
    
    return translation;
  };

  const getLocalePath = (path: string) => {
    if (locale === 'es') {
      return path; // No prefix for default language
    }
    
    // Remove any existing locale prefix
    const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');
    return `/${locale}${cleanPath}`;
  };

  const isDefaultLocale = locale === 'es';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, getLocalePath, isDefaultLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
