"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/email-validation";

export default function SignupPage() {
  const router = useRouter();
  
  // Step 1: Basic info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("freelancer");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Step 2: OTP verification
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    
    if (!fullName.trim()) errs.fullName = "Name is required";
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      errs.email = emailValidation.error || "Invalid email";
    }
    
    if (!agreeTerms) errs.agreeTerms = "You must agree to the Terms of Service";
    
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Send custom OTP
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }
      
      setOtpSent(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Verify OTP and create user
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otpCode,
          fullName,
          businessType,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to verify code");
        setLoading(false);
        return;
      }
      
      // Get new session
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      router.refresh();
      
      // If session exists, go to onboarding, else need to wait for session refresh
      if (session) {
        router.push("/onboarding");
      } else {
        // Session will be established by auth callback, refresh and redirect
        setTimeout(() => {
          router.refresh();
          router.push("/onboarding");
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
        Create your account
      </h1>
      <p className="text-muted mb-8">Start winning proposals with Proposar</p>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-foreground hover:bg-background transition-colors disabled:opacity-50 mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#0a0a14] px-4 text-muted">
            Or continue with email
          </span>
        </div>
      </div>

      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
              required
            />
            {fieldErrors.fullName && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                fieldErrors.email ? "border-red-500/50 bg-surface" : "border-border bg-surface"
              }`}
              required
              placeholder="your@email.com"
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Type
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="freelancer">Freelancer</option>
              <option value="agency">Agency</option>
              <option value="consultant">Consultant</option>
              <option value="other">Other</option>
            </select>
          </div>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded border-border bg-surface text-gold focus:ring-gold/50"
            />
            <span className="text-sm text-muted">
              I agree to the{" "}
              <Link href="/terms" className="text-gold hover:underline">
                Terms of Service
              </Link>
            </span>
          </label>
          {fieldErrors.agreeTerms && (
            <p className="text-red-400 text-sm">{fieldErrors.agreeTerms}</p>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm mb-2">{error}</p>
              {error.includes("already registered") && (
                <Link href="/login" className="text-gold hover:underline text-sm">
                  Go to sign in →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-3 font-medium text-background hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Sending verification code..." : "Continue"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-foreground mb-2">
              ✓ Email verified: <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted">
              We&apos;ve sent a 6-digit verification code to your email. Enter it below to complete your signup.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-gold/50"
              required
            />
            <p className="text-xs text-muted mt-2 text-center">
              Check your spam folder if you don&apos;t see the email
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full rounded-lg bg-gold py-3 font-medium text-background hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify code"}
          </button>

          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtpCode("");
              setError(null);
            }}
            className="w-full text-sm text-gold hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
