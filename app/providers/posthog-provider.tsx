"use client";

import posthog from "posthog-js";
import { PostHogProvider as CSPostHogProvider } from "posthog-js/react";
import { getPostHogHost } from "@/lib/posthog-config";
let posthogInitialized = false;

function initPostHog() {
  if (typeof window === "undefined" || posthogInitialized) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = getPostHogHost();

  if (!key || !host) return;

  posthog.init(key, {
    api_host: host,
    defaults: "2026-01-30",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_exceptions: true,
  });

  window.addEventListener("error", (event) => {
    if (event.error instanceof Error) {
      posthog.captureException(event.error, {
        source: "window_error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      return;
    }

    posthog.capture("window_error_event", {
      source: "window_error",
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (reason instanceof Error) {
      posthog.captureException(reason, { source: "unhandled_promise_rejection" });
      return;
    }

    posthog.capture("unhandled_promise_rejection", {
      source: "unhandled_promise_rejection",
      reason: typeof reason === "string" ? reason : JSON.stringify(reason),
    });
  });

  posthogInitialized = true;
}

initPostHog();

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <CSPostHogProvider client={posthog}>{children}</CSPostHogProvider>;
}
