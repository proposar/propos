"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ok" | "redirect">("loading");

  useEffect(() => {
    fetch("/api/auth/onboarding-status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { onboarding_completed: false }))
      .then((d) => {
        if (d?.onboarding_completed) {
          setStatus("ok");
        } else {
          setStatus("redirect");
          router.replace("/onboarding");
        }
      })
      .catch(() => {
        setStatus("redirect");
        router.replace("/onboarding");
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
