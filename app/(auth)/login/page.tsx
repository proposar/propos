"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ForgotPasswordModal } from "@/components/auth/ForgotPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  
  // Password login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // OTP login state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) throw err;
      if (data.user) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        router.refresh();
        router.push("/dashboard");
      }
      else setError("Invalid credentials");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!otpSent) {
      // Send OTP
      try {
        const supabase = createClient();
        const { error: err } = await supabase.auth.signInWithOtp({
          email: otpEmail,
        });
        if (err) throw err;
        setOtpSent(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send OTP");
      } finally {
        setLoading(false);
      }
    } else {
      // Verify OTP
      try {
        const supabase = createClient();
        const { data, error: err } = await supabase.auth.verifyOtp({
          email: otpEmail,
          token: otpCode,
          type: 'email',
        });
        if (err) throw err;
        if (data.user) {
          router.refresh();
          router.push("/dashboard");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid OTP code");
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted mb-8">Sign in to your Proposar account</p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-foreground hover:bg-background transition-colors disabled:opacity-50 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
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

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "password"
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("otp")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "otp"
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Email Code
          </button>
        </div>

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              />
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="mt-2 text-sm text-gold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-border bg-surface accent-gold cursor-pointer"
              />
              <span className="text-sm text-muted">Remember me</span>
            </label>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gold py-3 font-medium text-background hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {/* OTP Tab */}
        {activeTab === "otp" && (
          <form onSubmit={handleOtpSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                disabled={otpSent}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50"
                required
              />
            </div>
            
            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter the 6-digit code sent to your email
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
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode("");
                    setError(null);
                  }}
                  className="mt-2 text-sm text-gold hover:underline"
                >
                  Use a different email
                </button>
              </div>
            )}
            
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gold py-3 font-medium text-background hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? (otpSent ? "Verifying..." : "Sending code...") : (otpSent ? "Verify code" : "Send code")}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-gold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
