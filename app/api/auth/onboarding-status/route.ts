import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Lightweight endpoint for onboarding guard - returns only onboarding_completed. */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (error || !data)
    return NextResponse.json({ onboarding_completed: false });
  return NextResponse.json({ onboarding_completed: !!data.onboarding_completed });
}
