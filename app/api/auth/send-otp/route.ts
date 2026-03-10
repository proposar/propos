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

    // Check if email already registered
    const adminClient = createAdminClient();
    const { data: existing } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      // Check if a real auth user exists for this profile
      // If no auth user exists, this is an orphaned profile from a failed signup — clean it up
      const { data: { user }, error: authLookupError } = await adminClient.auth.admin.getUserById(existing.id);
      
      if (authLookupError || !user) {
        // Orphaned profile — delete it so the user can re-register
        await adminClient.from("profiles").delete().eq("id", existing.id);
        console.log(`[Signup] Cleaned up orphaned profile for ${email}`);
      } else {
        // Real account exists
        return NextResponse.json(
          { error: "Email already registered. Please sign in instead." },
          { status: 400 }
        );
      }
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
