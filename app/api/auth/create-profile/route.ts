import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName, businessType } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if profile already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (existing) {
      // Profile already exists, just return success
      return NextResponse.json({ success: true, isNewUser: false });
    }

    // Create new profile
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      email: email.toLowerCase(),
      full_name: fullName,
      business_type: businessType,
      onboarding_completed: false,
    });

    if (error) {
      console.error("Profile creation error:", error);
      throw error;
    }

    return NextResponse.json(
      { success: true, isNewUser: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
