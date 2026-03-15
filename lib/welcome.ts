import { sendWelcomeEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/server";

type WelcomeEligibilityResult = {
  sent: boolean;
  reason?: "already_sent" | "already_onboarded" | "missing_profile";
};

export async function sendWelcomeIfEligible(params: {
  userId: string;
  email: string;
  fullName?: string | null;
}): Promise<WelcomeEligibilityResult> {
  const adminClient = createAdminClient();

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("full_name, onboarding_completed, welcome_email_sent")
    .eq("id", params.userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Welcome profile lookup failed: ${profileError.message}`);
  }

  if (!profile) {
    return { sent: false, reason: "missing_profile" };
  }

  if (profile.welcome_email_sent) {
    return { sent: false, reason: "already_sent" };
  }

  if (profile.onboarding_completed) {
    return { sent: false, reason: "already_onboarded" };
  }

  await sendWelcomeEmail(params.email, params.fullName ?? profile.full_name ?? undefined);

  const { error: updateError } = await adminClient
    .from("profiles")
    .update({
      welcome_email_sent: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.userId);

  if (updateError) {
    throw new Error(`Welcome profile update failed: ${updateError.message}`);
  }

  return { sent: true };
}
