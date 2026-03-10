import { verifyOTP } from "@/lib/otp";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    let { email, code, fullName, businessType } = await req.json();
    
    email = email?.trim().toLowerCase();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpResult = verifyOTP(email, code);
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    const userId = existingProfile?.id || crypto.randomUUID();
    const isNewUser = !existingProfile;

    // Create or update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: email.toLowerCase(),
        full_name: fullName,
        business_type: businessType,
        onboarding_completed: isNewUser ? false : undefined,
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        userId,
        email,
        isNewUser,
        message: "Email verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
