import { PostHog } from 'posthog-node'
import { getPostHogHost } from '@/lib/posthog-config'

let posthogInstance: PostHog | null = null

export function getPostHogServer() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = getPostHogHost()

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
