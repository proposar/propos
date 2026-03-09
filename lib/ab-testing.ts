/**
 * A/B Testing Framework for Proposals
 * Track which proposal versions, tones, and structures win more deals
 */

export interface ProposalTest {
  id: string;
  userId: string;
  testName: string;
  description: string;
  status: "draft" | "running" | "completed" | "paused";
  testType: "tone" | "structure" | "pricing" | "length"; // What we're testing
  variant_a: {
    name: string;
    tone?: string; // professional, bold, friendly
    description: string;
  };
  variant_b: {
    name: string;
    tone?: string;
    description: string;
  };
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  minProposalsPerVariant: number; // How many proposals per variant before deciding
}

export interface ProposalTestResult {
  id: string;
  testId: string;
  proposalId: string;
  variant: "a" | "b";
  toneUsed: string;
  sentAt: string;
  openedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  viewDuration: number; // seconds
  scrollPercentage: number; // 0-100
}

export interface TestStatistics {
  variantA: {
    totalProposals: number;
    opens: number;
    acceptances: number;
    openRate: number;
    acceptanceRate: number;
    avgViewTime: number;
    avgScrollDepth: number;
  };
  variantB: {
    totalProposals: number;
    opens: number;
    acceptances: number;
    openRate: number;
    acceptanceRate: number;
    avgViewTime: number;
    avgScrollDepth: number;
  };
  winner: "a" | "b" | "tied" | "inconclusive";
  confidence: number; // 0-100%, how confident are we in the winner
  recommendation: string;
}

/**
 * Calculate test statistics from results
 */
export function calculateTestStats(
  resultsA: ProposalTestResult[],
  resultsB: ProposalTestResult[]
): TestStatistics {
  const calcVariantStats = (results: ProposalTestResult[]) => {
    const opens = results.filter((r) => r.openedAt).length;
    const acceptances = results.filter((r) => r.acceptedAt).length;
    const avgViewTime =
      results.reduce((sum, r) => sum + r.viewDuration, 0) / results.length || 0;
    const avgScrollDepth =
      results.reduce((sum, r) => sum + r.scrollPercentage, 0) / results.length ||
      0;

    return {
      totalProposals: results.length,
      opens,
      acceptances,
      openRate: results.length > 0 ? (opens / results.length) * 100 : 0,
      acceptanceRate:
        results.length > 0 ? (acceptances / results.length) * 100 : 0,
      avgViewTime: Math.round(avgViewTime),
      avgScrollDepth: Math.round(avgScrollDepth),
    };
  };

  const variantA = calcVariantStats(resultsA);
  const variantB = calcVariantStats(resultsB);

  // Determine winner (statistical significance)
  let winner: "a" | "b" | "tied" | "inconclusive" = "inconclusive";
  let confidence = 0;

  if (
    variantA.totalProposals >= 10 &&
    variantB.totalProposals >= 10
  ) {
    const diff = Math.abs(
      variantA.acceptanceRate - variantB.acceptanceRate
    );

    if (diff > 15) {
      // 15% difference = clear winner
      winner =
        variantA.acceptanceRate > variantB.acceptanceRate ? "a" : "b";
      confidence = Math.min(95, 50 + diff * 2); // Up to 95% confidence
    } else if (diff > 8) {
      // 8-15% difference = moderate difference
      winner =
        variantA.acceptanceRate > variantB.acceptanceRate ? "a" : "b";
      confidence = Math.min(80, 40 + diff * 2);
    } else if (diff < 2) {
      winner = "tied";
      confidence = 80;
    }
  }

  // Generate recommendation
  let recommendation = "";
  if (winner === "inconclusive") {
    recommendation =
      "Need more data. Keep the test running until each variant has at least 10 proposals.";
  } else if (winner === "tied") {
    recommendation =
      "Both variants perform equally. Choose based on your preference or test a different variable.";
  } else {
    const winnerVariant = winner === "a" ? variantA : variantB;
    const loserVariant = winner === "a" ? variantB : variantA;
    const improvement = (
      ((winnerVariant.acceptanceRate - loserVariant.acceptanceRate) /
        loserVariant.acceptanceRate) *
      100
    ).toFixed(0);

    recommendation =
      `Variant ${winner.toUpperCase()} wins! It has a ${improvement}% higher acceptance rate. ` +
      `Use this version for all future proposals (Variant ${winner.toUpperCase()}: ${winnerVariant.acceptanceRate.toFixed(1)}% vs Variant ${winner === "a" ? "B" : "A"}: ${loserVariant.acceptanceRate.toFixed(1)}%).`;
  }

  return {
    variantA,
    variantB,
    winner,
    confidence,
    recommendation,
  };
}

/**
 * Get common A/B test templates
 */
export const ABTestTemplates = {
  tone: [
    {
      name: "Tone Test: Professional vs Bold",
      description:
        "Test if professional tone wins more deals than bold confidence",
      variantA: { name: "Professional", tone: "professional" },
      variantB: { name: "Bold", tone: "bold" },
    },
    {
      name: "Tone Test: Professional vs Friendly",
      description:
        "Test if professional tone wins more deals than warm, friendly approach",
      variantA: { name: "Professional", tone: "professional" },
      variantB: { name: "Friendly", tone: "friendly" },
    },
  ],
  structure: [
    {
      name: "Structure Test: Price First vs Price Last",
      description: "Test if pricing upfront vs at the end changes acceptance",
      variantA: { name: "Price in Overview" },
      variantB: { name: "Price at Bottom" },
    },
    {
      name: "Structure Test: Case Study Impact",
      description: "Test if adding a case study increases win rate",
      variantA: { name: "Without Case Study" },
      variantB: { name: "With Case Study" },
    },
  ],
  length: [
    {
      name: "Length Test: Short vs Detailed",
      description: "Test if concise proposals win more often than detailed ones",
      variantA: { name: "Concise (500 words)" },
      variantB: { name: "Detailed (1500 words)" },
    },
  ],
};

/**
 * Format test statistics for display
 */
export function formatTestStats(stats: TestStatistics) {
  return {
    winner: stats.winner.toUpperCase(),
    confidence: `${stats.confidence}%`,
    variantAAcceptance: `${stats.variantA.acceptanceRate.toFixed(1)}%`,
    variantBAcceptance: `${stats.variantB.acceptanceRate.toFixed(1)}%`,
    recommendation: stats.recommendation,
  };
}
