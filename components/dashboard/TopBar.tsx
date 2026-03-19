"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

function getPageTitle(pathname: string, t: any): string {
  if (pathname === "/proposals/new") return t.dashboard.topbar.newProposal;
  if (pathname.startsWith("/proposals/") && pathname !== "/proposals") return t.dashboard.sidebar.proposals;
  return t.dashboard.topbar.titles[pathname] ?? t.dashboard.topbar.titles["/dashboard"];
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const title = getPageTitle(pathname, t);
  const { profile } = useProfile();
  const avatarUrl = profile?.avatar_url ?? null;
  const initial = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : profile?.email
      ? profile.email.charAt(0).toUpperCase()
      : "U";

  return (
    <header className="h-16 border-b border-[#1e1e2e] bg-[#0a0a14] flex items-center justify-between px-4 md:px-6 shrink-0">
      <h1 className="text-lg font-semibold text-[#faf8f4]">
        {title}
      </h1>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 rounded-lg border border-[#1e1e2e] bg-[#12121e] px-3 py-2 text-sm text-[#888890] hover:text-[#faf8f4] transition-colors w-48"
        >
          <span>{t.dashboard.topbar.searchPlaceholder}</span>
          <span className="text-xs ml-auto">⌘K</span>
        </button>

        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 md:bg-transparent md:relative md:pt-0 md:inset-auto">
            <input
              type="search"
              placeholder={t.dashboard.topbar.searchPlaceholder}
              autoFocus
              className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-2 text-[#faf8f4] w-full max-w-md md:w-64 focus:outline-none focus:ring-2 focus:ring-gold/50"
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        )}

        <Link
          href="/help"
          className="hidden md:inline-flex text-sm text-[#888890] hover:text-gold transition-colors"
        >
          {t.dashboard.topbar.help}
        </Link>
        <Link
          href="/proposals/new"
          className="hidden md:inline-flex rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a] transition-colors"
        >
          {t.dashboard.topbar.newProposal}
        </Link>

        <button
          type="button"
          className="relative rounded-full w-9 h-9 bg-[#12121e] border border-[#1e1e2e] flex items-center justify-center text-[#888890] hover:text-[#faf8f4] transition-colors"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold text-[#0a0a14] text-[10px] font-bold flex items-center justify-center">
            0
          </span>
        </button>

        <LanguageSwitcher />

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-center rounded-full w-9 h-9 bg-gold/30 border border-gold text-[#faf8f4] font-medium overflow-hidden"
          >
            {avatarUrl ? (
              <Image src={avatarUrl || ""} alt="Avatar" className="object-cover" fill />
            ) : (
              initial
            )}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[#1e1e2e] bg-[#12121e] py-1 shadow-xl z-50">
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-[#faf8f4] hover:bg-[#0a0a14]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {t.dashboard.topbar.profile}
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-[#faf8f4] hover:bg-[#0a0a14]"
                  onClick={() => setUserMenuOpen(false)}
                >
                  {t.dashboard.topbar.billing}
                </Link>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#0a0a14]"
                onClick={() => { setUserMenuOpen(false); handleSignOut(); }}
              >
                  {t.dashboard.topbar.signOut}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
