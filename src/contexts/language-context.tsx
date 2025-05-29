"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "@/types";
import { LANGUAGES } from "@/lib/constants";

import en from "@/lib/locales/en.json";
import ru from "@/lib/locales/ru.json";
import uz from "@/lib/locales/uz.json";

type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations, fallback?: string) => string;
}

const translations: Record<Language, Translations> = { en, ru, uz };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang && LANGUAGES.some(l => l.code === storedLang)) {
      setLanguageState(storedLang);
    } else {
      // You might want to detect browser language here as a default
      setLanguageState("en");
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: keyof Translations, fallback?: string): string => {
    return translations[language]?.[key] || fallback || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
