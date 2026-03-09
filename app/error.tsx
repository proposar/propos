"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-6">
      <h1 className="font-serif text-2xl font-bold text-[#faf8f4] mb-2">Something went wrong</h1>
      <p className="text-[#888890] text-sm mb-6 text-center max-w-md">{error.message}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14]"
        >
          Try again
        </button>
        <Link href="/" className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890]">
          Home
        </Link>
      </div>
    </div>
  );
}
