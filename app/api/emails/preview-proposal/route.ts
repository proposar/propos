import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderProposalEmailHtml } from "@/lib/resend";
import { z } from "zod";

const previewProposalSchema = z.object({
  clientName: z.string().min(1).max(255),
  projectTitle: z.string().min(1).max(500),
  personalMessage: z.string().max(1000).optional(),
  proposalLink: z.string().url(),
});

export async function POST(request: Request): Promise<NextResponse<string | { error: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate request body
  const validationResult = previewProposalSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: `Validation error: ${validationResult.error.message}` },
      { status: 400 }
    );
  }

  const { clientName, projectTitle, personalMessage, proposalLink } = validationResult.data;

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const html = renderProposalEmailHtml(
      clientName,
      projectTitle,
      personalMessage ?? "",
      proposalLink,
      profile?.full_name ?? undefined
    );

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (e) {
    console.error("Preview email error:", e);
    return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 });
  }
}
