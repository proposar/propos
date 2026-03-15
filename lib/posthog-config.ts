const DIRECT_POSTHOG_HOST = "https://us.i.posthog.com";

export function getPostHogHost() {
  const configuredHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim();
  const proxyReady = process.env.NEXT_PUBLIC_POSTHOG_PROXY_READY === "1";

  if (configuredHost && proxyReady) {
    return configuredHost;
  }

  return DIRECT_POSTHOG_HOST;
}
