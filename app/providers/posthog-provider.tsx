"use client";

// @ts-ignore
import posthog from "posthog-js";
// @ts-ignore
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== 'undefined') {
  if (
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", 
      capture_pageview: true,
      capture_exceptions: true,
    });
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <CSPostHogProvider client={posthog}>{children}</CSPostHogProvider>;
}
