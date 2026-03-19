"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { type Locale } from "@/lib/i18n/dict";

export function LocaleSync() {
  const { locale, setLocale } = useLanguage();
  const { profile } = useProfile();
  const lastUserLocaleChangeAtRef = useRef<number>(0);

  useEffect(() => {
    function onUserLocaleChanged(e: Event) {
      const ce = e as CustomEvent<Locale>;
      if (ce?.detail) lastUserLocaleChangeAtRef.current = Date.now();
    }

    window.addEventListener("proposar:locale-user-changed", onUserLocaleChanged);
    return () => {
      window.removeEventListener("proposar:locale-user-changed", onUserLocaleChanged);
    };
  }, []);

  useEffect(() => {
    // If we have a profile with a locale that differs from current context, 
    // and it's not simply the default 'en' (unless explicitly set), sync them.
    if (profile?.locale && profile.locale !== locale) {
      // If the user just changed language via dropdown, don't immediately
      // override it with the previous profile locale (profile PATCH is async).
      if (Date.now() - lastUserLocaleChangeAtRef.current < 1500) {
        return;
      }

      // Small delay to avoid hydration mismatches or rapid firing
      const timer = setTimeout(() => {
        setLocale(profile.locale as Locale);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile?.locale, locale, setLocale]);

  return null;
}
