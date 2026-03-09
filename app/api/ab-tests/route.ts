import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      testName,
      description,
      testType,
      variantA,
      variantB,
      minProposalsPerVariant = 15,
    } = await request.json();

    // Create test in database
    const { data, error } = await supabase
      .from("proposal_ab_tests")
      .insert({
        user_id: user.id,
        test_name: testName,
        description,
        test_type: testType,
        variant_a: variantA,
        variant_b: variantB,
        status: "draft",
        min_proposals_per_variant: minProposalsPerVariant,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create test" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("proposal_ab_tests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch tests" }, { status: 500 });
  }
}
