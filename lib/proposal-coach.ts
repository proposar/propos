/**
 * AI Proposal Coach
 * Real-time feedback on proposal quality with actionable improvements
 */

export interface ProposalScoringCriteria {
  hasSpecificDeliverables: boolean;
  hasNamedPricing: boolean;
  hasSocialProof: boolean;
  hasPersonalization: boolean;
  hasTimeline: boolean;
  hasCompetitiveAnalysis: boolean;
  hasCallToAction: boolean;
  hasClientName: boolean;
  contentLength: number;
  hasVisualElements: boolean;
}

export interface CoachingFeedback {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  strengths: string[];
  improvements: CoachingSuggestion[];
  estimatedWinRateImprovement: number; // percentage points
}

export interface CoachingSuggestion {
  section: string;
  issue: string;
  fix: string;
  impactGain: number; // percentage points this fix adds to win rate
  difficulty: "easy" | "medium" | "hard";
  estimatedTimeToFix: string;
}

/**
 * Analyze proposal content and return a score
 */
export function analyzeProposalContent(content: string): ProposalScoringCriteria {
  const contentLower = content.toLowerCase();

  return {
    hasSpecificDeliverables: /deliverable[s]?\s*:|[\d]+\.\s+(?:design|develop|create|build)/i.test(
      content
    ),
    hasNamedPricing: /\$[\d,]+|pricing\s*:\s*\$|total\s*:\s*\$/i.test(content),
    hasSocialProof:
      /testimonial|case study|client|user said|review|rating|★|".*praise.*"/i.test(
        content
      ),
    hasPersonalization: /\b(you|your)\b/i.test(content) && content.length > 500,
    hasTimeline: /week|month|date|timeline|schedule|phase|deadline/i.test(
      content
    ),
    hasCompetitiveAnalysis: /competitor|vs|alternative|compared|instead/i.test(
      content
    ),
    hasCallToAction: /contact|click|call|get started|sign up|accept|approve|next step/i.test(
      content
    ),
    hasClientName: /dear|hi\s+[A-Z]|hello\s+[A-Z]/i.test(content),
    contentLength: content.length,
    hasVisualElements: /\[image\]|\[screenshot\]|\[diagram\]|visual|chart|graph/i.test(
      content
    ),
  };
}

/**
 * Generate coaching feedback based on analysis
 */
export function generateCoachingFeedback(
  criteria: ProposalScoringCriteria
): CoachingFeedback {
  const suggestions: CoachingSuggestion[] = [];
  let baseScore = 50;

  // Scoring logic (each criterion adds points)
  if (criteria.hasSpecificDeliverables) baseScore += 12;
  else
    suggestions.push({
      section: "Deliverables",
      issue:
        "Your proposal lists benefits but not specific deliverables. Clients need to know exactly what they'll receive.",
      fix: 'Add a numbered section like "5 Deliverables: 1. Strategy Session, 2. Wireframes, 3. Design, 4. Development, 5. Launch"',
      impactGain: 15,
      difficulty: "easy",
      estimatedTimeToFix: "5 minutes",
    });

  if (criteria.hasNamedPricing) baseScore += 14;
  else
    suggestions.push({
      section: "Pricing",
      issue:
        'You say "Request a quote" - clients see hidden pricing as expensive. Name your price.',
      fix: 'Change to: "Investment: $4,200" or "Price range: $3,800-$5,200". Include payment plan options.',
      impactGain: 18,
      difficulty: "easy",
      estimatedTimeToFix: "3 minutes",
    });

  if (criteria.hasSocialProof) baseScore += 11;
  else
    suggestions.push({
      section: "Social Proof",
      issue:
        "No testimonials. Clients trust other clients' experiences more than your claims.",
      fix: 'Add 1-2 testimonials: "Sarah Johnson increased her rate by 35% using these proposals." — Agency owner',
      impactGain: 12,
      difficulty: "medium",
      estimatedTimeToFix: "10 minutes (collect from past clients)",
    });

  if (criteria.hasPersonalization) baseScore += 9;
  else
    suggestions.push({
      section: "Opening",
      issue:
        "Generic opening. Looks like a mass template. Clients feel ignored.",
      fix: "Research their business. Start with: 'I noticed your website was built in 2018 and your mobile bounce rate is high.' Show you did homework.",
      impactGain: 10,
      difficulty: "medium",
      estimatedTimeToFix: "15 minutes",
    });

  if (criteria.hasTimeline) baseScore += 10;
  else
    suggestions.push({
      section: "Timeline",
      issue:
        "Vague timeline removes confidence. Clients don't know if you're realistic.",
      fix: "Use specific dates: 'Week 1: March 10-15, Kickoff + Strategy. Week 2: March 19-22, Wireframes. Week 3: March 26-29, Design.'",
      impactGain: 11,
      difficulty: "easy",
      estimatedTimeToFix: "10 minutes",
    });

  if (criteria.hasCompetitiveAnalysis) baseScore += 6;
  else
    suggestions.push({
      section: "Competitive Angle",
      issue:
        "You don't mention competition. Sounds like you haven't done your homework.",
      fix: 'Add 2-3 sentences about how your approach differs: "Unlike generic template builders, we create custom code for your brand."',
      impactGain: 7,
      difficulty: "medium",
      estimatedTimeToFix: "10 minutes",
    });

  if (criteria.hasCallToAction) baseScore += 8;
  else
    suggestions.push({
      section: "Call to Action",
      issue: "No clear next step. Client leaves proposal unsure what to do.",
      fix: 'End with: "Let\'s get started. Reply with your preferred start date or book a call: [calendar link]"',
      impactGain: 8,
      difficulty: "easy",
      estimatedTimeToFix: "2 minutes",
    });

  if (criteria.hasClientName) baseScore += 7;
  if (criteria.contentLength < 300)
    suggestions.push({
      section: "Length",
      issue: "Proposal too short. Clients need detail to feel confident.",
      fix: "Add more context, examples, and case studies. Aim for 800+ words minimum.",
      impactGain: 9,
      difficulty: "hard",
      estimatedTimeToFix: "30 minutes",
    });

  if (criteria.hasVisualElements) baseScore += 8;

  // Cap score at 100
  const score = Math.min(100, baseScore);

  // Determine grade
  let grade: "A" | "B" | "C" | "D" | "F";
  if (score >= 85) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 65) grade = "C";
  else if (score >= 55) grade = "D";
  else grade = "F";

  // Calculate total improvement potential
  const totalImprovementGain = suggestions.reduce(
    (sum, s) => sum + s.impactGain,
    0
  );

  // Get strengths
  const strengths: string[] = [];
  if (criteria.hasSpecificDeliverables)
    strengths.push("Clear, numbered deliverables");
  if (criteria.hasNamedPricing)
    strengths.push("Transparent, named pricing");
  if (criteria.hasSocialProof) strengths.push("Strong client testimonials");
  if (criteria.hasPersonalization)
    strengths.push("Personalized to this client");
  if (criteria.hasTimeline) strengths.push("Specific timeline with dates");
  if (criteria.hasCallToAction)
    strengths.push("Clear call to action");
  if (criteria.contentLength > 1000)
    strengths.push("Comprehensive detail level");

  return {
    score,
    grade,
    strengths: strengths.length > 0 ? strengths : ["Good foundation to build on"],
    improvements: suggestions,
    estimatedWinRateImprovement: Math.min(45, totalImprovementGain), // Cap at 45% improvement potential
  };
}

/**
 * Get coaching message for a specific tone
 */
export function getToneCoachingAdvice(
  tone: string
): { description: string; tips: string[] } {
  const toneAdvice: Record<
    string,
    { description: string; tips: string[] }
  > = {
    professional: {
      description: "Your proposal uses a professional tone. Effective for B2B.",
      tips: [
        "Maintain formal structure but add 1-2 personalization touches",
        "Use industry terminology confidently",
        "Leaders respond well to this tone",
      ],
    },
    bold: {
      description: "Your proposal is bold and confident. Good for startups.",
      tips: [
        "Ensure confidence is backed by case studies/results",
        "Works best for growth-focused companies",
        "Risk: Can seem overconfident without proof",
      ],
    },
    friendly: {
      description: "Your proposal is warm and friendly. Good for service businesses.",
      tips: [
        "Add 1-2 specific examples to stay credible",
        "Perfect for agencies and consultants",
        "Build trust through personality, not just words",
      ],
    },
  };

  return (
    toneAdvice[tone.toLowerCase()] || {
      description: "Your proposal tone is unique.",
      tips: ["Consider how your target client prefers to receive information"],
    }
  );
}
