import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend";

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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { sent: false, error: profileError.message },
        { status: 500 }
      );
    }

    if (profile?.onboarding_completed) {
      return NextResponse.json({ sent: false, reason: "already onboarded" });
    }

    await sendWelcomeEmail(user.email!, profile?.full_name ?? undefined);
    return NextResponse.json({ sent: true });
  } catch (e) {
    console.error("Welcome email error:", e);
    return NextResponse.json(
      { sent: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
