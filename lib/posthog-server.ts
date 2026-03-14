import { PostHog } from 'posthog-node'

let posthogInstance: PostHog | null = null

export function getPostHogServer() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!key || !host) {
    return null
  }

  if (!posthogInstance) {
    posthogInstance = new PostHog(
      key,
      {
        host,
        flushAt: 1,
        flushInterval: 0,
      }
    )
  }
  return posthogInstance
}
