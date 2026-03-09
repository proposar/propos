import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Anthropic } from "@anthropic-ai/sdk";
import {
  analyzeProposalContent,
  generateCoachingFeedback,
  getToneCoachingAdvice,
} from "@/lib/proposal-coach";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { proposal_content, tone } = await request.json();

    if (!proposal_content) {
      return NextResponse.json(
        { error: "Proposal content required" },
        { status: 400 }
      );
    }

    // Step 1: Analyze proposal structure
    const criteria = analyzeProposalContent(proposal_content);
    const coachingFeedback = generateCoachingFeedback(criteria);
    const toneAdvice = getToneCoachingAdvice(tone || "professional");

    // Step 2: Use Anthropic to generate personalized improvement suggestions
    const anthropic = new Anthropic();

    const coachingPrompt = `
You are a proposal coaching expert. A freelancer has written this proposal:

${proposal_content.substring(0, 1000)}...

Their proposal currently scores: ${coachingFeedback.score}/100 (Grade: ${coachingFeedback.grade})

Main issues to address:
${coachingFeedback.improvements
  .slice(0, 3)
  .map((imp) => `- ${imp.issue}`)
  .join("\n")}

Please generate 2-3 specific, actionable coaching tips to improve this proposal immediately. Keep each tip to 1-2 sentences. Focus on what will have the biggest impact on win rate.

Format as JSON:
{
  "tips": ["tip1", "tip2", "tip3"],
  "encouragement": "1-2 sentences of positive feedback"
}
`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: coachingPrompt,
        },
      ],
    });

    let aiTips: string[] = [];
    let aiEncouragement = "";

    try {
      const responseText =
        message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiTips = parsed.tips || [];
        aiEncouragement = parsed.encouragement || "";
      }
    } catch {
      // If AI response parsing fails, use default tips
      aiTips = coachingFeedback.improvements
        .slice(0, 3)
        .map((imp) => imp.fix);
    }

    // Step 3: Return comprehensive coaching data
    return NextResponse.json({
      score: coachingFeedback.score,
      grade: coachingFeedback.grade,
      strengths: coachingFeedback.strengths,
      improvements: coachingFeedback.improvements.slice(0, 4), // Top 4 improvements
      estimatedWinRateImprovement:
        coachingFeedback.estimatedWinRateImprovement,
      aiTips,
      aiEncouragement,
      toneAdvice,
    });
  } catch (error) {
    console.error("Coaching error:", error);
    return NextResponse.json(
      { error: "Failed to generate coaching" },
      { status: 500 }
    );
  }
}
