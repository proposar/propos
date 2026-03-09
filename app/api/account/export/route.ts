import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const userId = user.id;

  const [profileRes, proposalsRes, clientsRes, templatesRes] = await Promise.all([
    admin.from("profiles").select("*").eq("id", userId).single(),
    admin.from("proposals").select("id, title, project_type, status, client_name, client_company, budget_amount, budget_currency, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
    admin.from("clients").select("*").eq("user_id", userId),
    admin.from("templates").select("id, name, project_type, created_at").eq("user_id", userId),
  ]);

  const data = {
    exported_at: new Date().toISOString(),
    user_id: userId,
    email: user.email,
    profile: profileRes.data,
    proposals: proposalsRes.data ?? [],
    clients: clientsRes.data ?? [],
    templates: templatesRes.data ?? [],
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="proposar-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
