import { verifyOTP } from "@/lib/otp";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { email, code } = await req.json();
    
    email = email?.trim().toLowerCase();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpResult = await verifyOTP(email, code);
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.error },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Get user via profile (case-insensitive email match)
    const { data: profiles } = await adminClient
      .from("profiles")
      .select("id")
      .ilike("email", email);
    const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null;

    if (!profile) {
      return NextResponse.json(
        { error: "User not found. Please sign up instead." },
        { status: 404 }
      );
    }

    // Generate a sign-in token so the frontend can establish a session
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (linkError) {
      console.error("Generate link error:", linkError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        userId: profile.id,
        token_hash: linkData.properties.hashed_token,
        email_otp: linkData.properties.email_otp,
        message: "OTP verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify login OTP error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
