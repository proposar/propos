"use client";

import { useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error, {
      source: "dashboard_error_boundary",
      digest: error.digest,
      message: error.message,
    });
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="font-serif text-xl font-bold text-[#faf8f4]">Something went wrong</h2>
      <p className="text-[#888890] text-sm text-center max-w-md">{error.message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890] hover:text-[#faf8f4]"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
