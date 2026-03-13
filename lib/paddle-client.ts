import { initializePaddle, type Paddle } from "@paddle/paddle-js";

export type PaddlePlan = "starter" | "pro" | "agency";

const PRICE_IDS: Record<PaddlePlan, string> = {
  starter:
    process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID ??
    "pri_01kkb4b6emz06m4e04r88781d1",
  pro:
    process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ??
    "pri_01kkb4nc7avgf32vvav6neaerc",
  agency:
    process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID ??
    "pri_01kkb4r14m0n6v88w20tf6hwjz",
};

let paddleInstancePromise: Promise<Paddle | null> | null = null;

async function getPaddleInstance(): Promise<Paddle | null> {
  if (typeof window === "undefined") return null;

  if (!paddleInstancePromise) {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return null;

    paddleInstancePromise = initializePaddle({
      token,
      environment: "production",
    }).then((paddle) => paddle ?? null);
  }

  return paddleInstancePromise;
}

async function startClientCheckout(
  plan: PaddlePlan,
  successUrl: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const paddle = await getPaddleInstance();
  if (!paddle) {
    return { ok: false, error: "Paddle client is not configured" };
  }

  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return { ok: false, error: "Selected plan is not configured" };
  }

  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    settings: {
      displayMode: "overlay",
      successUrl,
      theme: "dark",
      locale: "en",
    },
  });

  return { ok: true };
}

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
    const clientResult = await startClientCheckout(plan, successUrl);
    if (clientResult.ok) {
      return clientResult;
    }

    console.warn("[openCheckout] Client checkout fallback:", clientResult.error);
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
