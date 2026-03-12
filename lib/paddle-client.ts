export type PaddlePlan = "starter" | "pro" | "agency";

async function startServerCheckout(
  plan: PaddlePlan,
  successUrl?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch("/api/paddle/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, successUrl }),
  });

  let payload: { url?: string; error?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return { ok: false, error: payload?.error ?? "Checkout unavailable" };
  }

  if (!payload?.url) {
    return { ok: false, error: payload?.error ?? "No checkout URL returned" };
  }

  window.location.href = payload.url;
  return { ok: true };
}

export async function openCheckout(
  plan: PaddlePlan,
  options?: { successUrl?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const successUrl = options?.successUrl ?? `${window.location.origin}/billing`;
    console.log("[openCheckout] Starting server-side checkout for plan:", plan, "successUrl:", successUrl);

    // Always use server-side checkout via our API route.
    // This avoids any environment mismatch between Paddle.js (sandbox vs live)
    // and keeps all secrets on the server.
    return await startServerCheckout(plan, successUrl);
  } catch (error) {
    console.error("[openCheckout] Error:", error);
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Checkout unavailable. Please try again.",
    };
  }
}
