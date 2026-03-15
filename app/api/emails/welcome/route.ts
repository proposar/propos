import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeIfEligible } from "@/lib/welcome";

interface WelcomeEmailResponse {
  sent: boolean;
  reason?: string;
  error?: string;
}

export async function POST(): Promise<NextResponse<WelcomeEmailResponse>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ sent: false, error: "Unauthorized" }, { status: 401 });

  try {
    const result = await sendWelcomeIfEligible({
      userId: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
    });

    if (!result.sent && result.reason === "already_sent") {
      return NextResponse.json({ sent: false, reason: "already sent" });
    }

    if (!result.sent && result.reason === "already_onboarded") {
      return NextResponse.json({ sent: false, reason: "already onboarded" });
    }

    if (!result.sent && result.reason === "missing_profile") {
      return NextResponse.json({ sent: false, reason: "profile missing" }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error("Welcome email error:", e);
    return NextResponse.json(
      { sent: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
