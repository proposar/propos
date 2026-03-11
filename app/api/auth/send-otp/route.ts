import { sendOTP } from "@/lib/otp";
import { validateEmail } from "@/lib/email-validation";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { email, fullName } = await req.json();
    
    email = email?.trim().toLowerCase();
    fullName = fullName?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    if (!fullName) {
      return NextResponse.json({ error: "Full name required" }, { status: 400 });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check if email already has an account (via ANY method: Google, OTP, password)
    const adminClient = createAdminClient();
    
    // First check if auth user exists with this email (regardless of provider)
    const { data: { users: allUsers } } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    const existingAuthUser = allUsers?.find(u => u.email?.toLowerCase() === email);

    if (existingAuthUser) {
      // Auth user exists (could be from Google, password, or previous OTP)
      // Don't allow signing up again - they should sign in instead
      return NextResponse.json(
        { error: "Email already registered. Please sign in instead." },
        { status: 400 }
      );
    }

    // Also check for orphaned profiles (have profile but no auth user)
    const { data: existing } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      // Orphaned profile (no auth user) — clean it up silently
      await adminClient.from("profiles").delete().eq("id", existing.id);
      console.log(`[Signup] Cleaned orphaned profile for ${email}`);
    }

    // Send OTP
    const result = await sendOTP(email, fullName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "OTP sent to email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
