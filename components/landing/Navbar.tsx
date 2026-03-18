"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, type Locale } from "@/lib/i18n/dict";
import { AuthAwareLink } from "@/components/auth/AuthAwareLink";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.howItWorks, href: "/#how-it-works" },
    { label: t.nav.features, href: "/#features" },
    { label: t.nav.pricing, href: "/#pricing" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.help, href: "/help" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14]/80 backdrop-blur-md border-b border-[#1e1e2e]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/landscape.svg"
            alt="Proposar Professional Services"
            width={120}
            height={40}
            className="group-hover:opacity-80 transition-opacity"
            unoptimized
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#888890] hover:text-gold transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right: Language + Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#888890] hover:text-gold hover:bg-[#12121e] transition-all text-sm font-medium border border-transparent hover:border-[#1e1e2e]"
              aria-label="Select language"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden lg:inline">{currentLang.label}</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-[#1e1e2e] bg-[#12121e] shadow-2xl overflow-hidden"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { setLocale(lang.code as Locale); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#1e1e2e] ${locale === lang.code ? "text-gold font-semibold" : "text-[#c4c4cc]"}`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.label}</span>
                      <span className="text-xs text-[#888890]">{lang.country}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all font-semibold text-sm"
            >
              {t.nav.dashboard}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-[#faf8f4] hover:text-gold transition-colors text-sm font-medium"
              >
                {t.nav.signIn}
              </Link>
              <AuthAwareLink
                unauthenticatedHref="/signup"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all font-semibold text-sm"
              >
                {t.nav.getStarted}
              </AuthAwareLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gold p-2 hover:bg-[#12121e] rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[#1e1e2e] bg-[#12121e]"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-[#888890] hover:text-gold transition-colors text-sm font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="border-t border-[#1e1e2e] pt-3">
                <p className="text-xs text-[#888890] mb-2 uppercase tracking-wider">Language / Idioma / اللغة</p>
                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { setLocale(lang.code as Locale); setIsOpen(false); }}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs transition-colors ${locale === lang.code ? "bg-gold/10 border border-gold/40 text-gold" : "text-[#888890] hover:bg-[#0a0a14] border border-transparent"}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1e1e2e] pt-3 space-y-2">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="block text-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] font-semibold text-sm hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {t.nav.dashboard}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-center px-5 py-2.5 text-[#faf8f4] hover:text-gold transition-colors text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {t.nav.signIn}
                    </Link>
                    <AuthAwareLink
                      unauthenticatedHref="/signup"
                      className="block text-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] font-semibold text-sm hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      {t.nav.getStarted}
                    </AuthAwareLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
