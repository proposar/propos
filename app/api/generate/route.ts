import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildProposalUserPrompt, generateProposal } from "@/lib/anthropic";
import { generateProposalWithOpenAI } from "@/lib/openai";
import { checkAIRateLimit } from "@/lib/rate-limit";
import { PLAN_LIMITS } from "@/lib/config";
import { TONE_OPTIONS } from "@/lib/constants";
import { proposalGenerateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const toISODate = (value?: string | null): string | null => {
      if (!value) return null;
      const v = value.trim();
      if (!v) return null;
      // Support dd-mm-yyyy
      const m = v.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      let d: Date;
      if (m) {
        const [, dd, mm, yyyy] = m;
        d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      } else {
        d = new Date(v);
      }
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString();
    };

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body with Zod
    const validationResult = proposalGenerateSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      console.error("[Generate API] Validation failed:", errors);
      console.error("[Generate API] Request body:", JSON.stringify(body, null, 2));
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: errors,
          received: body // Help debugging
        },
        { status: 400 }
      );
    }

    const {
      clientId,
      clientName,
      clientCompany,
      clientEmail,
      industry,
      projectTitle,
      projectType,
      customServiceDescription,
      customServices,
      projectScope,
      budgetAmount,
      budgetType,
      currency,
      timeline,
      startDate,
      paymentTerms,
      tone,
      sections,
      additionalContext,
      expiryDate,
      lineItemsEnabled,
      lineItems,
      subtotal,
      discountPercent,
      taxPercent,
      grandTotal,
    } = validationResult.data;

    const { data: profile } = await supabase.from("profiles").select("subscription_plan, proposals_used_this_month, full_name, business_name").eq("id", user.id).single();
    const plan = (profile?.subscription_plan as keyof typeof PLAN_LIMITS) ?? "free";
    const limits = PLAN_LIMITS[plan];
    const used = profile?.proposals_used_this_month ?? 0;
    const limit = limits.proposalsPerMonth;
    if (limit >= 0 && used >= limit) {
      return NextResponse.json(
        { error: "Proposal limit reached", upgradeUrl: "/#pricing" },
        { status: 402 }
      );
    }

    const rateCheck = checkAIRateLimit(user.id);
    if (!rateCheck.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment.", retryAfter: rateCheck.retryAfter },
        { status: 429, headers: rateCheck.retryAfter ? { "Retry-After": String(rateCheck.retryAfter) } : {} }
      );
    }

    const resolvedTone = tone ?? "professional";
    const toneDesc = TONE_OPTIONS.find((t) => t.value === resolvedTone)?.description ?? resolvedTone;
    const userPrompt = buildProposalUserPrompt({
      yourName: profile?.full_name ?? undefined,
      businessName: profile?.business_name ?? undefined,
      clientName,
      clientCompany: clientCompany ?? undefined,
      industry: industry ?? "Other",
      projectTitle,
      projectType: projectType ?? "Consulting",
      customServiceDescription: customServiceDescription ?? undefined,
      customServices: customServices ?? undefined,
      projectScope,
      budgetAmount: Number(budgetAmount),
      budgetType: budgetType ?? "Fixed Price",
      currency: currency ?? "USD",
      timeline: timeline ?? "1 month",
        paymentTerms: paymentTerms ?? "50% upfront / 50% on completion",
        startDate: startDate || undefined,
      tone: resolvedTone,
      toneDescription: toneDesc,
      sections: Array.isArray(sections) ? sections : [],
      additionalContext: additionalContext ?? undefined,
      lineItemsEnabled: !!lineItemsEnabled,
      lineItems: lineItemsEnabled ? lineItems : undefined,
      subtotal: lineItemsEnabled ? subtotal : undefined,
      discountPercent: lineItemsEnabled ? discountPercent : undefined,
      taxPercent: lineItemsEnabled ? taxPercent : undefined,
      grandTotal: lineItemsEnabled ? grandTotal : undefined,
    });

    // Use OpenAI as PRIMARY service (configured in Vercel), Claude as optional fallback for future
    let generatedContent: string;
    let usedService: "openai" | "claude" | "template" = "template";
    
    try {
      console.log("[Generate API] Starting proposal generation with OpenAI (GPT-4o)...");
      generatedContent = await generateProposalWithOpenAI(userPrompt);
      if (!generatedContent || generatedContent.trim().length === 0) {
        throw new Error("OpenAI generated empty content");
      }
      usedService = "openai";
      console.log("[Generate API] ✅ OpenAI generation succeeded");
    } catch (openaiError) {
      console.warn("[Generate API] OpenAI generation failed:", openaiError instanceof Error ? openaiError.message : openaiError);
      console.log("[Generate API] Trying Claude (Anthropic) as fallback...");
      try {
        generatedContent = await generateProposal(userPrompt);
        if (!generatedContent || generatedContent.trim().length === 0) {
          throw new Error("Claude generated empty content");
        }
        usedService = "claude";
        console.log("[Generate API] ✅ Claude generation succeeded");
      } catch (claudeError) {
        console.error("[Generate API] ❌ Both OpenAI and Claude generation failed");
        console.error("[Generate API] OpenAI error:", openaiError instanceof Error ? openaiError.message : openaiError);
        console.error("[Generate API] Claude error:", claudeError instanceof Error ? claudeError.message : claudeError);
        
        // Return error instead of template
        return NextResponse.json(
          { 
            error: "Proposal generation failed. Please try again.",
            details: "OpenAI API is not responding. Please check your OPENAI_API_KEY in Vercel environment variables."
          },
          { status: 500 }
        );
      }
    }
    
    console.log(`[Generate API] Used service: ${usedService.toUpperCase()}`);


    const { data: proposal, error: insertError } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        client_id: clientId || null,
        title: projectTitle,
        project_type: projectType ?? "Consulting",
        status: "draft",
        client_name: clientName,
        client_email: clientEmail || null,
        client_company: clientCompany || null,
        project_scope: projectScope,
        budget_amount: Number(budgetAmount),
        budget_currency: currency ?? "USD",
        timeline: timeline ?? null,
        tone: tone ?? "professional",
        generated_content: generatedContent,
        expires_at: toISODate(expiryDate),
        subtotal: lineItemsEnabled ? subtotal : null,
        discount_percent: lineItemsEnabled ? (discountPercent || null) : null,
        tax_percent: lineItemsEnabled ? (taxPercent || null) : null,
        grand_total: lineItemsEnabled ? grandTotal : null,
        line_items_enabled: !!lineItemsEnabled
      })
      .select("id")
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Failed to save proposal" }, { status: 500 });
    }

    if (lineItemsEnabled && lineItems?.length) {
      const serializedLineItems = lineItems.map((item: any, i: number) => ({
        proposal_id: proposal.id,
        sort_order: i,
        item_name: item.item_name,
        description: item.description || null,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate
        // Amount is GENERATED ALWAYS by the DB
      }));

      const { error: lineItemsError } = await supabase.from("proposal_line_items").insert(serializedLineItems);
      if (lineItemsError) {
         console.warn("Failed to insert line items (but proposal created)", lineItemsError);
      }
    }

    if (limit >= 0) {
      await supabase
        .from("profiles")
        .update({
          proposals_used_this_month: used + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    await supabase.from("activity_log").insert({
      user_id: user.id,
      proposal_id: proposal.id,
      event_type: "proposal_created",
      metadata: {},
    });

    return NextResponse.json({ id: proposal.id, content: generatedContent });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
