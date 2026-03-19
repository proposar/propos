"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { type Locale } from "@/lib/i18n/dict";

export function LocaleSync() {
  const { locale, setLocale } = useLanguage();
  const { profile } = useProfile();

  useEffect(() => {
    // If we have a profile with a locale that differs from current context, 
    // and it's not simply the default 'en' (unless explicitly set), sync them.
    if (profile?.locale && profile.locale !== locale) {
      // Small delay to avoid hydration mismatches or rapid firing
      const timer = setTimeout(() => {
        setLocale(profile.locale as Locale);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile?.locale, locale, setLocale]);

  return null;
}
