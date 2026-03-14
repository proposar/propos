'use client'

import posthog from "posthog-js"
import NextError from "next/error"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    try {
      if (typeof posthog !== "undefined" && posthog.captureException) {
        posthog.captureException(error, {
          source: "global_error_boundary",
          digest: error.digest,
          message: error.message,
        });
      }
    } catch (_) {
      // PostHog not ready or failed to capture
    }
  }, [error]);

  return (
    <html>
      <body>
        {/* NextError is the default Next.js error page component */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
