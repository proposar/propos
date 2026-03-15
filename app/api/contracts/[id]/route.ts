import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  sendContractFullySignedToClient,
  sendContractFullySignedToFreelancer,
} from "@/lib/resend";

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

  const { data: existingContract, error: existingError } = await supabase
    .from("contracts")
    .select("id, status, freelancer_signature, client_signature")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (existingError || !existingContract) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed = ["title", "content", "status", "freelancer_signature", "freelancer_signed_at", "client_signature", "client_signed_at", "sent_at"];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }
  if (updates.freelancer_signature && !updates.freelancer_signed_at) {
    updates.freelancer_signed_at = new Date().toISOString();
  }

  const nextFreelancerSignature =
    typeof updates.freelancer_signature === "string"
      ? (updates.freelancer_signature as string)
      : existingContract.freelancer_signature;
  const nextClientSignature =
    typeof updates.client_signature === "string"
      ? (updates.client_signature as string)
      : existingContract.client_signature;

  if (nextFreelancerSignature && nextClientSignature) {
    updates.status = "signed";
  } else if (
    (nextFreelancerSignature || nextClientSignature || updates.sent_at) &&
    !updates.status &&
    existingContract.status === "draft"
  ) {
    updates.status = "sent";
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

  if (existingContract.status !== "signed" && data?.status === "signed") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://proposar.io";
    const contractLink = `${appUrl}/contract/${data.share_id}`;
    const freelancerName = profile?.full_name ?? "Freelancer";

    if (profile?.email) {
      sendContractFullySignedToFreelancer(
        profile.email,
        freelancerName,
        data.client_name,
        data.title,
        contractLink,
      ).catch(console.error);
    }

    if (data.client_email) {
      sendContractFullySignedToClient(
        data.client_email,
        data.client_name,
        freelancerName,
        data.title,
        contractLink,
      ).catch(console.error);
    }
  }

  return NextResponse.json(data);
}
