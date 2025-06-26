
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LocaleContextType {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  translate: (arabic: string, english: string) => string;
  translateData: <T extends { name: string; name_en?: string; description?: string; description_en?: string }>(item: T) => Omit<T, 'name_en' | 'description_en'>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'restaurant_pos_locale';

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [direction, setDirection] = useState<Direction>('rtl');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (storedLocale) {
      setLocaleState(storedLocale);
      setDirection(storedLocale === 'en' ? 'ltr' : 'rtl');
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = direction;
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [locale, direction, isMounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setDirection(newLocale === 'en' ? 'ltr' : 'rtl');
  };

  const translate = (arabic: string, english: string): string => {
    if (!isMounted) return arabic; // Return default during SSR or before hydration
    return locale === 'en' ? english : arabic;
  };

  const translateData = <T extends { name: string; name_en?: string; description?: string; description_en?: string }>(item: T): Omit<T, 'name_en' | 'description_en'> => {
    if (!isMounted) return { ...item, name: item.name, description: item.description };
    const translatedItem = { ...item };
    if (locale === 'en') {
      translatedItem.name = item.name_en || item.name;
      if (item.description && item.description_en) {
        translatedItem.description = item.description_en;
      }
    }
    delete translatedItem.name_en;
    delete translatedItem.description_en;
    return translatedItem;
  };


  if (!isMounted) {
    return null; // Or a loading spinner, to prevent flash of unstyled content or incorrect language
  }

  return (
    <LocaleContext.Provider value={{ locale, direction, setLocale, translate, translateData }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
