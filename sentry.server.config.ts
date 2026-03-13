// sentry.server.config.ts
// Sentry initialization for the Node.js server runtime.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    // Trace 5% of server requests for performance insight
    tracesSampleRate: 0.05,
    debug: false,
  });
}
