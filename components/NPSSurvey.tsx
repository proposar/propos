'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ThumbsUp } from 'lucide-react';

export default function NPSSurvey() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Show survey to 10% of users randomly
  useEffect(() => {
    const surveySeen = localStorage.getItem('nps_survey_seen');
    if (!surveySeen && Math.random() < 0.1) {
      const timer = setTimeout(() => {
        setShowSurvey(true);
        localStorage.setItem('nps_survey_seen', 'true');
      }, 5000); // Show after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === null) {
      alert('Please select a score');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          feedback: feedback.trim(),
          email: email.trim(),
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShowSurvey(false);
          setScore(null);
          setFeedback('');
          setEmail('');
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showSurvey) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-in slide-in-from-bottom-4">
      <div className="rounded-lg border border-[#1e1e2e] bg-[#12121e] shadow-lg p-6">
        {/* Close button */}
        <button
          onClick={() => setShowSurvey(false)}
          className="absolute top-3 right-3 text-[#888890] hover:text-[#faf8f4] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <ThumbsUp className="h-8 w-8 text-gold mx-auto mb-3" />
            <p className="text-sm font-medium text-[#faf8f4]">Thank you!</p>
            <p className="text-xs text-[#888890] mt-1">Your feedback helps us improve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#faf8f4] mb-3">
                How likely are you to recommend Proposar to a friend?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setScore(num)}
                    className={`h-10 rounded-lg text-xs font-medium transition-all ${
                      score === num
                        ? 'bg-gold text-[#0a0a14] ring-2 ring-gold'
                        : 'bg-[#1e1e2e] text-[#c4c4cc] hover:bg-[#2a2a32]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#888890] mt-2">
                <span>Not likely</span>
                <span>Very likely</span>
              </div>
            </div>

            {score !== null && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#faf8f4] mb-2">
                    What could we improve? (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your feedback..."
                    className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] p-2 text-xs text-[#faf8f4] placeholder-[#666672] focus:border-gold focus:outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#faf8f4] mb-2">
                    Your email (optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] p-2 text-xs text-[#faf8f4] placeholder-[#666672] focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gold text-[#0a0a14] py-2 text-xs font-medium hover:bg-[#e8c76a] transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Feedback'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
