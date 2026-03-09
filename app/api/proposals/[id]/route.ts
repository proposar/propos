import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { proposalUpdateSchema } from "@/lib/validators";
import type { Proposal } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Proposal | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json<Proposal>(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Proposal | { error: string }>> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  
  // Validate request body
  const validationResult = proposalUpdateSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const allowed = ["title", "generated_content", "status", "expires_at", "sent_at"];
  const updates: Record<string, unknown> = {};
  const validated = validationResult.data;
  
  for (const k of allowed) {
    if (k in validated) {
      updates[k] = validated[k as keyof typeof validated];
    }
  }
  // When marking as sent, set sent_at if not provided
  if (validated.status === "sent" && !updates.sent_at) {
    updates.sent_at = new Date().toISOString();
  }
  
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("proposals")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json<Proposal>(data);
}
