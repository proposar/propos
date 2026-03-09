import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateTestStats } from "@/lib/ab-testing";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get test
    const { data: test, error: testError } = await supabase
      .from("proposal_ab_tests")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (testError || !test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Get results for both variants
    const { data: results, error: resultsError } = await supabase
      .from("proposal_test_results")
      .select("*")
      .eq("test_id", params.id);

    if (resultsError) throw resultsError;

    // Split by variant
    const variantAResults = results?.filter((r) => r.variant === "a") || [];
    const variantBResults = results?.filter((r) => r.variant === "b") || [];

    // Calculate statistics
    const stats = calculateTestStats(variantAResults, variantBResults);

    return NextResponse.json({
      test,
      stats,
      resultsCount: {
        variantA: variantAResults.length,
        variantB: variantBResults.length,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
