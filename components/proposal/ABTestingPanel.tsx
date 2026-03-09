"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, AlertCircle } from "lucide-react";
import { ABTestTemplates } from "@/lib/ab-testing";

interface TestStats {
  variantA: {
    totalProposals: number;
    opens: number;
    acceptances: number;
    openRate: number;
    acceptanceRate: number;
    avgViewTime: number;
  };
  variantB: {
    totalProposals: number;
    opens: number;
    acceptances: number;
    openRate: number;
    acceptanceRate: number;
    avgViewTime: number;
  };
  winner: "a" | "b" | "tied" | "inconclusive";
  confidence: number;
  recommendation: string;
}

interface ABTest {
  id: string;
  test_name: string;
  status: string;
  stats?: TestStats;
}

interface TestTemplate {
  name: string;
  description: string;
  variantA: { name: string; tone?: string };
  variantB: { name: string; tone?: string };
}

export function ABTestingPanel() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [testTemplate, setTestTemplate] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TestTemplate>(
    ABTestTemplates.tone[0] as unknown as TestTemplate
  );

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ab-tests");
      if (res.ok) {
        const data = await res.json();
        setTests(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const createTest = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/ab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testName: selectedTemplate.name,
          description: selectedTemplate.description,
          testType: "tone",
          variantA: selectedTemplate.variantA,
          variantB: selectedTemplate.variantB,
          minProposalsPerVariant: 15,
        }),
      });

      if (res.ok) {
        setShowCreate(false);
        fetchTests();
      }
    } finally {
      setCreating(false);
    }
  };

  // Load stats for running tests
  const getTestStats = async (testId: string) => {
    try {
      const res = await fetch(`/api/ab-tests/${testId}/stats`);
      if (res.ok) {
        const data = await res.json();
        return data.stats;
      }
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Proposal A/B Testing
            </h3>
            <p className="text-sm text-[#888890] mt-1">
              Test which proposal version wins more deals
            </p>
          </div>
        </div>

        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full rounded-lg bg-gold px-4 py-2 text-[#0a0a14] font-medium text-sm hover:bg-[#e8c76a]"
          >
            + Start New Test
          </button>
        ) : (
          <div className="space-y-4 p-4 rounded-lg bg-[#0a0a14] border border-[#1e1e2e]">
            <div>
              <label className="text-sm font-medium text-[#faf8f4] block mb-3">
                Choose Test Template
              </label>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {[...ABTestTemplates.tone, ...ABTestTemplates.structure].map(
                  (template, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedTemplate(template as TestTemplate);
                        setTestTemplate(i);
                      }}
                      className={`w-full text-left rounded-lg border p-3 transition-colors ${
                        testTemplate === i
                          ? "border-gold bg-gold/10"
                          : "border-[#1e1e2e] hover:border-gold/30"
                      }`}
                    >
                      <p className="text-sm font-medium text-[#faf8f4]">
                        {template.name}
                      </p>
                      <p className="text-xs text-[#888890] mt-1">
                        {template.description}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 rounded-lg border border-[#1e1e2e] text-[#888890] py-2 text-sm hover:text-[#faf8f4]"
              >
                Cancel
              </button>
              <button
                onClick={createTest}
                disabled={creating}
                className="flex-1 rounded-lg bg-gold text-[#0a0a14] py-2 text-sm font-medium hover:bg-[#e8c76a] disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Test"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Tests */}
      {tests.length > 0 && (
        <div className="space-y-3">
          {tests.map((test) => (
            <div
              key={test.id}
              className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[#faf8f4]">{test.test_name}</p>
                  <span
                    className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
                      test.status === "running"
                        ? "bg-green-500/20 text-green-400"
                        : test.status === "completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </div>
              </div>

              {test.stats && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#0a0a14] rounded-lg p-3">
                      <p className="text-[#888890] text-xs mb-1">
                        Variant A
                      </p>
                      <p className="font-semibold text-[#faf8f4]">
                        {test.stats.variantA.acceptanceRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-[#888890]">
                        {test.stats.variantA.acceptances}/
                        {test.stats.variantA.totalProposals}
                      </p>
                    </div>
                    <div className="bg-[#0a0a14] rounded-lg p-3">
                      <p className="text-[#888890] text-xs mb-1">
                        Variant B
                      </p>
                      <p className="font-semibold text-[#faf8f4]">
                        {test.stats.variantB.acceptanceRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-[#888890]">
                        {test.stats.variantB.acceptances}/
                        {test.stats.variantB.totalProposals}
                      </p>
                    </div>
                  </div>

                  {test.stats.winner !== "inconclusive" && (
                    <div
                      className={`rounded-lg p-3 flex items-start gap-3 ${
                        test.stats.winner === "tied"
                          ? "bg-yellow-500/10 border border-yellow-500/20"
                          : "bg-green-500/10 border border-green-500/20"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 mt-1 flex-shrink-0 text-green-400" />
                      <p className="text-sm text-green-300">
                        {test.stats.recommendation}
                      </p>
                    </div>
                  )}

                  {test.stats.winner === "inconclusive" && (
                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0 text-blue-400" />
                      <p className="text-sm text-blue-300">
                        Keep testing until each variant has 15+ proposals
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && tests.length === 0 && !showCreate && (
        <p className="text-center text-[#888890] text-sm py-8">
          No tests yet. Start your first A/B test to find what works best.
        </p>
      )}
    </div>
  );
}
