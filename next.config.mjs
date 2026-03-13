import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
    // Required to load Sentry server-side instrumentation
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qglxdxpohmxfmjzarnjj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

// Only wrap with Sentry when DSN is configured (safe for local dev without it)
export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      // Suppress source map upload logs
      silent: true,
      // Disable telemetry
      telemetry: false,
      // Upload source maps for better error stack traces in Sentry
      widenClientFileUpload: true,
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
      // Automatically capture tunnel route to avoid ad-blockers
      automaticVercelMonitors: false,
    })
  : nextConfig;
