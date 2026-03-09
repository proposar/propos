"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [rememberMeEnabled, setRememberMeEnabled] = useState(false);

  useEffect(() => {
    // Check remember me flag
    const remembered = localStorage.getItem('rememberMe') === 'true';
    setRememberMeEnabled(remembered);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setIsLoggedIn(!!user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Help", href: "/help" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14]/80 backdrop-blur-md border-b border-[#1e1e2e]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/proposar-new-logo.svg"
            alt="Proposar Professional Services"
            width={40}
            height={48}
            className="group-hover:opacity-80 transition-opacity"
            unoptimized
          />
          <span className="text-xl font-serif font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent group-hover:opacity-80 transition-opacity hidden lg:inline">
            Proposar
          </span>
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn && rememberMeEnabled ? (
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all font-semibold text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-[#faf8f4] hover:text-gold transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all font-semibold text-sm"
              >
                Get Started
              </Link>
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
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
              <div className="border-t border-[#1e1e2e] pt-3 space-y-2">
                {isLoggedIn && rememberMeEnabled ? (
                  <Link
                    href="/dashboard"
                    className="block text-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] font-semibold text-sm hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-center px-5 py-2.5 text-[#faf8f4] hover:text-gold transition-colors text-sm font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block text-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold to-[#e8c76a] text-[#0a0a14] font-semibold text-sm hover:shadow-[0_0_24px_rgba(217,119,6,0.3)] transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
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
