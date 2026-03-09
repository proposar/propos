import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const { data, error } = await admin
    .from("invoices")
    .select("*")
    .eq("share_id", shareId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
