"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type Locale, getTranslations, type Translations } from "@/lib/i18n/dict";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "proposar_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // On mount: try to load saved preference or detect from browser
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved) {
      setLocaleState(saved);
      return;
    }
    // Auto-detect from browser language
    const browserLang = navigator.language.split("-")[0] as Locale;
    const supported: Locale[] = ["en", "pt", "es", "ar", "hi", "fr"];
    if (supported.includes(browserLang)) {
      setLocaleState(browserLang);
    }
  }, []);

  // Apply RTL direction to the document when Arabic is selected
  useEffect(() => {
    const t = getTranslations(locale);
    document.documentElement.setAttribute("dir", t.dir);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);

    // Let LocaleSync know this change was user-driven, so it doesn't
    // immediately overwrite with the previous profile locale.
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("proposar:locale-user-changed", { detail: newLocale })
      );
    }
    
    // Proactively sync with profile API if user is logged in
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => {
      // Background sync failed; we'll retry on next change or reload
    });
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: getTranslations(locale) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  // Graceful fallback: if used outside LanguageProvider (e.g. blog pages),
  // return English defaults instead of throwing. This keeps Navbar safe everywhere.
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      t: getTranslations("en"),
    };
  }
  return ctx;
}
