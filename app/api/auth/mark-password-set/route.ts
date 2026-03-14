import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Called after user sets a password (reset-password flow).
 * Marks app_metadata.has_password = true for correct login error messages.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await createAdminClient();
    const { data: u } = await admin.auth.admin.getUserById(user.id);
    if (!u?.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...u.user.app_metadata, has_password: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark password set error:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
