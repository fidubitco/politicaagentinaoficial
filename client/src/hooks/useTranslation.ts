import { useLocale } from '@/contexts/LocaleContext';

export function useTranslation() {
  const { locale, t, setLocale, getLocalePath, isDefaultLocale } = useLocale();
  
  return {
    locale,
    t,
    setLocale,
    getLocalePath,
    isDefaultLocale,
  };
}
