"use client";

import { useState } from "react";
import { Zap, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

interface CoachingFeedback {
  score: number;
  grade: string;
  strengths: string[];
  improvements: Array<{
    section: string;
    issue: string;
    fix: string;
    impactGain: number;
    difficulty: string;
    estimatedTimeToFix: string;
  }>;
  estimatedWinRateImprovement: number;
  aiTips: string[];
  aiEncouragement: string;
  toneAdvice: {
    description: string;
    tips: string[];
  };
}

interface ProposalCoachPanelProps {
  proposalContent: string;
  tone?: string;
  onClose?: () => void;
}

export function ProposalCoachPanel({
  proposalContent,
  tone = "professional",
  onClose,
}: ProposalCoachPanelProps) {
  const [coaching, setCoaching] = useState<CoachingFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const generateCoaching = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/proposals/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_content: proposalContent,
          tone,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate coaching");

      const data = await response.json();
      setCoaching(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (!coaching) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-gold/20 p-3 shrink-0">
            <Zap className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gold mb-1">
              AI Proposal Coach
            </h3>
            <p className="text-sm text-[#888890] mb-4">
              Get instant feedback on your proposal. I&apos;ll score it 0-100 and
              tell you exactly what to fix to win more deals.
            </p>
            <button
              onClick={generateCoaching}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Get Coaching"}
            </button>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Score color
  const scoreColor =
    coaching.score >= 80
      ? "text-green-400"
      : coaching.score >= 70
        ? "text-yellow-400"
        : coaching.score >= 50
          ? "text-orange-400"
          : "text-red-400";

  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] p-6 mb-6 space-y-6">
      {/* Score Card */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#faf8f4] mb-1">
            Proposal Quality Score
          </h3>
          <p className="text-sm text-[#888890]">
            Your proposal is ready to send!
          </p>
        </div>
        <div className="text-center">
          <div className={`text-4xl font-bold ${scoreColor}`}>
            {coaching.score}
          </div>
          <div className="text-sm text-[#888890] mt-1">Grade: {coaching.grade}</div>
        </div>
      </div>

      {/* Win Rate Improvement */}
      {coaching.estimatedWinRateImprovement > 0 && (
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-300 mb-1">
              Potential Win Rate Boost
            </p>
            <p className="text-sm text-blue-200">
              Fix the top issues below and gain +
              {coaching.estimatedWinRateImprovement}% win rate improvement
            </p>
          </div>
        </div>
      )}

      {/* Strengths */}
      {coaching.strengths.length > 0 && (
        <div>
          <h4 className="font-medium text-[#faf8f4] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            What&apos;s Working Well
          </h4>
          <ul className="space-y-2">
            {coaching.strengths.map((strength, i) => (
              <li key={i} className="text-sm text-[#888890] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Tips */}
      {coaching.aiTips.length > 0 && (
        <div>
          <h4 className="font-medium text-[#faf8f4] mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold" />
            Top Improvements (AI Recommended)
          </h4>
          <div className="space-y-2">
            {coaching.aiTips.map((tip, i) => (
              <div
                key={i}
                className="rounded-lg bg-gold/10 border border-gold/20 px-4 py-3"
              >
                <p className="text-sm text-[#faf8f4]">{tip}</p>
              </div>
            ))}
          </div>
          {coaching.aiEncouragement && (
            <p className="text-sm text-[#888890] mt-4 italic">
              &quot;{coaching.aiEncouragement}&quot;
            </p>
          )}
        </div>
      )}

      {/* Detailed Improvements */}
      {coaching.improvements.length > 0 && (
        <div>
          <h4 className="font-medium text-[#faf8f4] mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            Detailed Feedback ({coaching.improvements.length} items)
          </h4>
          <div className="space-y-2">
            {coaching.improvements.map((imp, i) => (
              <div
                key={i}
                className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14] overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === i ? null : i)
                  }
                  className="w-full px-4 py-3 flex items-start justify-between gap-4 hover:bg-[#12121e] transition-colors"
                >
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-[#faf8f4]">
                      {imp.section}
                    </p>
                    <p className="text-xs text-[#888890] mt-1">{imp.issue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-medium text-green-400 mb-1">
                      +{imp.impactGain}%
                    </div>
                    <div className="text-xs text-[#888890]">
                      {expandedSection === i ? "−" : "+"}
                    </div>
                  </div>
                </button>

                {expandedSection === i && (
                  <div className="border-t border-[#1e1e2e] px-4 py-3 bg-[#0f0f1e] space-y-2">
                    <div>
                      <p className="text-xs font-medium text-gold mb-1">
                        How to Fix:
                      </p>
                      <p className="text-sm text-[#d4d4d8]">{imp.fix}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-[#888890]">
                      <span>
                        Difficulty:{" "}
                        <span
                          className={
                            imp.difficulty === "easy"
                              ? "text-green-400"
                              : imp.difficulty === "medium"
                                ? "text-yellow-400"
                                : "text-orange-400"
                          }
                        >
                          {imp.difficulty}
                        </span>
                      </span>
                      <span>Time: {imp.estimatedTimeToFix}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tone Advice */}
      {coaching.toneAdvice && (
        <div className="rounded-lg bg-[#1e1e2e]/50 border border-[#1e1e2e] p-4">
          <p className="text-sm text-[#888890] mb-2">
            <span className="font-medium text-[#faf8f4]">Tone Note:</span>{" "}
            {coaching.toneAdvice.description}
          </p>
          <ul className="space-y-1">
            {coaching.toneAdvice.tips.map((tip, i) => (
              <li key={i} className="text-xs text-[#888890] flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#1e1e2e]">
        <button
          onClick={() => setCoaching(null)}
          className="flex-1 rounded-lg border border-gold/30 text-gold py-2 text-sm font-medium hover:bg-gold/10"
        >
          Make Edits
        </button>
        <button
          onClick={() => {
            setCoaching(null);
            onClose?.();
          }}
          className="flex-1 rounded-lg bg-gold/20 text-gold py-2 text-sm font-medium hover:bg-gold/30"
        >
          Looks Good!
        </button>
      </div>
    </div>
  );
}
