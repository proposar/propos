import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const allowed = ["title", "content", "status", "freelancer_signature", "freelancer_signed_at", "client_signature", "client_signed_at", "sent_at"];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }
  if (updates.freelancer_signature && !updates.freelancer_signed_at) {
    updates.freelancer_signed_at = new Date().toISOString();
  }
  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });

  const { data, error } = await supabase
    .from("contracts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
