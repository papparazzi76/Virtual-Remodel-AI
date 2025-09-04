
import React, { createContext, useState, useContext, useMemo } from 'react';
import { en } from './translations/en';
import { fr } from './translations/fr';
import { es } from './translations/es';
import { de } from './translations/de';
import { it } from './translations/it';
import { pt } from './translations/pt';

type Locale = 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt';

const translations = { en, fr, es, de, it, pt };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('es');

  const t = useMemo(() => (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to Spanish if translation is missing
        let fallbackResult: any = translations['es'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) return key;
        }
        return fallbackResult;
      }
    }
    return result as string;
  }, [locale]);

  const value = { locale, setLocale, t };

  // FIX: Replaced JSX with React.createElement to fix parsing errors in a .ts file.
  // The JSX syntax was causing errors because the file is not processed as a TSX file.
  return React.createElement(LanguageContext.Provider, { value }, children);
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
