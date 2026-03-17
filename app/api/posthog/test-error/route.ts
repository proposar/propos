import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { enforceSameOrigin } from "@/lib/request-guards";
import { getPostHogServer } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  const prodEnv = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";

  if (prodEnv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const guard = enforceSameOrigin(req);
  if (guard) return guard;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posthog = getPostHogServer();
  if (!posthog) {
    return NextResponse.json(
      { error: "PostHog is not configured on server runtime" },
      { status: 500 }
    );
  }

  try {
    const error = new Error("PostHog manual test exception");
    await posthog.captureException(error, user.id, {
      source: "manual_test_endpoint",
      user_email: user.email,
      path: "/api/posthog/test-error",
      ts: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Test exception sent to PostHog" });
  } catch (e) {
    console.error("PostHog test-error route failure:", e);
    return NextResponse.json({ error: "Failed to send test exception" }, { status: 500 });
  }
}
