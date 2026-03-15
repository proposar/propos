"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ONBOARDING_CACHE_KEY = "Proposar_onboarding_completed";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");

  useEffect(() => {
    // Fast path: skip API if we've cached that user completed onboarding this session
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(ONBOARDING_CACHE_KEY);
      if (cached === "1") {
        setStatus("ok");
        return;
      }
    }

    fetch("/api/auth/onboarding-status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { onboarding_completed: false }))
      .then((d) => {
        if (d?.onboarding_completed) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(ONBOARDING_CACHE_KEY, "1");
          }
          setStatus("ok");
        } else {
          setStatus("redirect");
          router.replace("/onboarding");
        }
      })
      .catch(() => {
        // Avoid false redirects during transient network/API issues.
        setStatus("ok");
      });
  }, [router]);

  if (status === "redirect") {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="animate-pulse text-[#888890] text-sm">Redirecting to onboarding…</div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <div className="animate-pulse h-8 w-32 rounded bg-[#1e1e2e]" />
      </div>
    );
  }

  return <>{children}</>;
}
