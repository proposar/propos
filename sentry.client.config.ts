// sentry.client.config.ts
// This file configures the initialization of Sentry on the browser side.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // Replay captures 10% of sessions, 100% of error sessions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Trace 10% of requests for performance insight
    tracesSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        // Mask PII
        maskAllText: true,
        blockAllMedia: false,
      }),
    ],
    // Don't print Sentry errors to the console in development
    debug: false,
    // Ignore common benign errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error exception captured",
      "Network request failed",
      "Failed to fetch",
      "Load failed",
    ],
  });
}
