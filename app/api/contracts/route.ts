import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("contracts")
    .select("id, share_id, title, status, client_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { proposalId, title, content, clientName, clientEmail } = body;
  if (!title || !content || !clientName)
    return NextResponse.json({ error: "title, content, clientName required" }, { status: 400 });

  const { data, error } = await supabase
    .from("contracts")
    .insert({
      proposal_id: proposalId || null,
      user_id: user.id,
      title,
      content,
      client_name: clientName,
      client_email: clientEmail || null,
      status: "draft",
    })
    .select("id, share_id, title, status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
