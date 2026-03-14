"use client";

// @ts-ignore
import posthog from "posthog-js";
// @ts-ignore
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if the keys are available
    if (
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only", 
        capture_pageview: true, // Enable automatic pageviews for instant tracking
        capture_exceptions: true, // This is the 'Error Tracking' code to replace Sentry
      });
    }
  }, []);

  return <CSPostHogProvider client={posthog}>{children}</CSPostHogProvider>;
}
