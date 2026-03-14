export function register() {
  // No-op for initialization
}

export const onRequestError = async (err: any, request: any, context: any) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPostHogServer } = await import('./lib/posthog-server')
    const posthog = getPostHogServer()
    if (!posthog) return
    
    let distinctId = null
    
    if (request.headers.cookie) {
      // Normalize multiple cookie arrays to string
      const cookieString = Array.isArray(request.headers.cookie)
        ? request.headers.cookie.join('; ')
        : request.headers.cookie
        
      const postHogCookieMatch = cookieString.match(/ph_phc_.*?_posthog=([^;]+)/)
      
      if (postHogCookieMatch && postHogCookieMatch[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1])
          const postHogData = JSON.parse(decodedCookie)
          distinctId = postHogData.distinct_id
        } catch (e) {
          console.error('Error parsing PostHog cookie:', e)
        }
      }
    }
    
    // Capture the exception with the distinctId as the second argument
    await posthog.captureException(err, distinctId || 'anonymous_server_error', {
      source: 'server_request_error',
      url: request.url,
      method: request.method
    })
  }
}
