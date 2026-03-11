"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserNotFound(false);
    try {
      // First check if account exists and has password auth
      const checkRes = await fetch("/api/auth/check-password-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const { exists, hasPassword } = await checkRes.json();

      if (!exists) {
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      if (!hasPassword) {
        setError("This account was created with Google or email code login. Please use that method to sign in instead.");
        setLoading(false);
        return;
      }

      // Send reset email
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=/reset-password`,
      });
      if (err) throw err;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setEmail("");
    setError(null);
    setSuccess(false);
    setUserNotFound(false);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Reset password
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          {success ? (
            <p className="text-foreground text-center py-4">
              Check your email. We&apos;ve sent you a link to reset your password.
            </p>
          ) : userNotFound ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3">
                <p className="text-red-400 text-sm font-medium">User not found</p>
                <p className="text-red-400/80 text-sm mt-1">
                  No account exists with this email address.
                </p>
              </div>
              <p className="text-muted text-sm">
                Don&apos;t have an account yet? Create one to get started.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                >
                  Back
                </button>
                <Link
                  href="/signup"
                  onClick={onClose}
                  className="flex-1 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-background hover:bg-gold-light transition-colors text-center"
                >
                  Sign up
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gold py-3 font-medium text-background hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
