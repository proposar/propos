'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, MessageSquare, AlertCircle } from 'lucide-react';

interface Feedback {
  id: string;
  nps_score: number;
  feedback_text: string;
  user_email: string;
  feedback_url: string;
  created_at: string;
}

interface FeedbackStats {
  total_responses: number;
  average_score: string;
  nps_score: string;
  distribution: {
    promoters: number;
    passives: number;
    detractors: number;
  };
  recent_feedback: Feedback[];
}

export default function FeedbackDashboard() {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  function isFeedbackStats(value: unknown): value is FeedbackStats {
    if (!value || typeof value !== 'object') return false;
    const v = value as Partial<FeedbackStats>;
    return (
      typeof v.total_responses === 'number' &&
      typeof v.average_score === 'string' &&
      typeof v.nps_score === 'string' &&
      !!v.distribution &&
      typeof v.distribution.promoters === 'number' &&
      typeof v.distribution.passives === 'number' &&
      typeof v.distribution.detractors === 'number' &&
      Array.isArray(v.recent_feedback)
    );
  }

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('/api/feedback');
        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          setApiError((errBody as { error?: string })?.error ?? 'Failed to load feedback');
          setStats(null);
          return;
        }
        const data = await response.json();
        if (!isFeedbackStats(data)) {
          setApiError('Invalid feedback response');
          setStats(null);
          return;
        }
        setApiError(null);
        setStats(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setApiError('Failed to load feedback');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
    // Don't poll on dashboard - removed to prevent lag
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-12 w-32 bg-[#1e1e2e] rounded animate-pulse mb-6"></div>
          <div className="h-screen bg-[#12121e] rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total_responses === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a14] p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#faf8f4] mb-6">User Feedback</h1>
          <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-8 text-center">
            <AlertCircle className="h-12 w-12 text-[#666672] mx-auto mb-3" />
            <p className="text-[#888890]">{apiError ? `Unable to load feedback: ${apiError}` : 'No feedback yet. Check back later.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#faf8f4] mb-2">User Feedback Dashboard</h1>
          <p className="text-[#888890]">Track NPS, user sentiment, and feedback trends</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* NPS Score */}
          <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-gold" />
              <p className="text-sm text-[#888890] font-medium">NPS Score</p>
            </div>
            <p className="text-4xl font-bold text-gold">{stats.nps_score}</p>
            <p className="text-xs text-[#888890] mt-2">
              {parseFloat(stats.nps_score) > 50
                ? '✅ Excellent'
                : parseFloat(stats.nps_score) > 30
                  ? '⚡ Good'
                  : '⚠️ Needs work'}
            </p>
          </div>

          {/* Total Responses */}
          <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-gold" />
              <p className="text-sm text-[#888890] font-medium">Responses</p>
            </div>
            <p className="text-4xl font-bold text-[#faf8f4]">{stats.total_responses}</p>
            <p className="text-xs text-[#888890] mt-2">Total responses collected</p>
          </div>

          {/* Average Score */}
          <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⭐</span>
              <p className="text-sm text-[#888890] font-medium">Avg Rating</p>
            </div>
            <p className="text-4xl font-bold text-[#faf8f4]">{stats.average_score}/10</p>
            <p className="text-xs text-[#888890] mt-2">Average satisfaction</p>
          </div>

          {/* Response Rate */}
          <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="h-5 w-5 text-gold" />
              <p className="text-sm text-[#888890] font-medium">Status</p>
            </div>
            <p className="text-2xl font-bold text-[#faf8f4] mt-2">Active</p>
            <p className="text-xs text-[#888890] mt-2">Collecting responses</p>
          </div>
        </div>

        {/* Distribution */}
        <div className="mb-8 rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
          <h3 className="text-lg font-semibold text-[#faf8f4] mb-6">Score Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-[#888890] mb-2">Promoters (9-10)</p>
              <div className="flex items-end gap-2">
                <div
                  className="flex-1 bg-[#10b981] rounded"
                  style={{
                    height: `${Math.max((stats.distribution.promoters / stats.total_responses) * 100, 5)}px`,
                  }}
                ></div>
                <p className="text-lg font-bold text-[#faf8f4] min-w-12 text-right">
                  {stats.distribution.promoters}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#888890] mb-2">Passives (7-8)</p>
              <div className="flex items-end gap-2">
                <div
                  className="flex-1 bg-[#f59e0b] rounded"
                  style={{
                    height: `${Math.max((stats.distribution.passives / stats.total_responses) * 100, 5)}px`,
                  }}
                ></div>
                <p className="text-lg font-bold text-[#faf8f4] min-w-12 text-right">
                  {stats.distribution.passives}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#888890] mb-2">Detractors (0-6)</p>
              <div className="flex items-end gap-2">
                <div
                  className="flex-1 bg-[#ef4444] rounded"
                  style={{
                    height: `${Math.max((stats.distribution.detractors / stats.total_responses) * 100, 5)}px`,
                  }}
                ></div>
                <p className="text-lg font-bold text-[#faf8f4] min-w-12 text-right">
                  {stats.distribution.detractors}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] p-6">
          <h3 className="text-lg font-semibold text-[#faf8f4] mb-6">Recent Feedback</h3>
          {stats.recent_feedback.length === 0 ? (
            <p className="text-[#888890] text-sm">No feedback yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recent_feedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-[#1e1e2e] bg-[#0a0a14]/50 p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#faf8f4]">
                        {item.nps_score}
                      </span>
                      <span className="text-xs font-medium text-[#888890]">
                        {item.nps_score >= 9
                          ? '🎉 Promoter'
                          : item.nps_score >= 7
                            ? '👍 Passive'
                            : '⚠️ Detractor'}
                      </span>
                    </div>
                    <span className="text-xs text-[#666672]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {item.feedback_text && (
                    <p className="text-sm text-[#c4c4cc] mb-2">{item.feedback_text}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {item.user_email && (
                      <a
                        href={`mailto:${item.user_email}`}
                        className="text-xs text-gold hover:underline"
                      >
                        {item.user_email}
                      </a>
                    )}
                    {item.feedback_url && (
                      <span className="text-xs text-[#666672]">{item.feedback_url}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
