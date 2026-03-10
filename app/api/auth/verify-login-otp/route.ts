import { verifyOTP } from "@/lib/otp";
import { createClient } from "@/lib/supabase/server";
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

    const supabase = await createClient();

    // Get user via profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update last sign in
    await supabase
      .from("profiles")
      .update({ updated_at: new Date().toISOString() })
      .eq("email", email.toLowerCase());

    return NextResponse.json(
      {
        success: true,
        userId: profile.id,
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
