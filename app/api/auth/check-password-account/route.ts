import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();
    
    // List users to find by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      return NextResponse.json(
        { error: "Failed to check account" },
        { status: 500 }
      );
    }

    // Find user with matching email
    const user = users.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({
        exists: false,
        hasPassword: false,
      });
    }

    // Check if user has password auth (they would have app_metadata with providers)
    const hasPassword = 
      !user.app_metadata?.providers || 
      user.app_metadata.providers.includes("email");

    return NextResponse.json({
      exists: true,
      hasPassword,
    });
  } catch (error) {
    console.error("Check password account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
