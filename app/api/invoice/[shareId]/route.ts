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

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, business_name, email, phone, address, city, country, logo_url")
    .eq("id", data.user_id)
    .single();

  const logoPublicUrl = profile?.logo_url
    ? profile.logo_url.startsWith("http")
      ? profile.logo_url
      : admin.storage.from("logos").getPublicUrl(profile.logo_url).data.publicUrl
    : null;

  return NextResponse.json({
    ...data,
    freelancer_name: profile?.full_name ?? null,
    business_name: profile?.business_name ?? null,
    business_email: profile?.email ?? null,
    business_phone: profile?.phone ?? null,
    business_address: [profile?.address, profile?.city, profile?.country].filter(Boolean).join(", ") || null,
    logo_url: logoPublicUrl,
  });
}
