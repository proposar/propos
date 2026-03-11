import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PADDLE_PLANS } from "@/lib/paddle";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? null;
  const isSandbox = process.env.PADDLE_ENVIRONMENT !== "production";

  return NextResponse.json({
    clientToken,
    isSandbox,
    priceIds: {
      starter: PADDLE_PLANS.starter,
      pro: PADDLE_PLANS.pro,
      agency: PADDLE_PLANS.agency,
    },
  });
}
