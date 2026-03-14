import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import {
  otpStoreSet,
  otpStoreGet,
  otpStoreIncrAttempts,
  otpStoreDelete,
} from "@/lib/otp-store";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  if (code.length !== 6) {
    console.warn(`[OTP] Generated code length mismatch: ${code}`);
  }
  return code;
}

/**
 * Send OTP via Resend email.
 * Uses Upstash Redis when configured (KV_REST_* or UPSTASH_*) — nothing in Supabase until auth.
 * Otherwise falls back to otp_codes table.
 */
export async function sendOTP(email: string, fullName?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();

    const stored = await otpStoreSet(normalizedEmail, otp);
    if (!stored) {
      console.error("[OTP SEND] Failed to store OTP");
      return { success: false, error: "Failed to send OTP" };
    }

    console.log(`[OTP SEND] Email: ${normalizedEmail} | Code: ${otp}`);

    const { error } = await resend.emails.send({
      from: "Proposar <noreply@proposar.com>",
      to: email,
      subject: "Your Proposar Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Verify Your Email</h2>
          <p>Hi${fullName ? ` ${fullName.split(" ")[0]}` : ""},</p>
          <p>Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #D4AF37; font-family: monospace;">
              ${otp}
            </div>
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[OTP SEND] Resend error:", error);
      await otpStoreDelete(normalizedEmail);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[OTP SEND] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send OTP",
    };
  }
}

/**
 * Verify OTP code.
 * User and profile are created ONLY after OTP is valid (in verify-otp route).
 */
export async function verifyOTP(
  email: string,
  code: string
): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = String(code).trim().replace(/\D/g, "").slice(0, 6);

    if (normalizedCode.length !== 6) {
      return { valid: false, error: "Please enter a valid 6-digit code." };
    }

    const stored = await otpStoreGet(normalizedEmail);

    if (!stored) {
      return {
        valid: false,
        error: `No verification code found for ${normalizedEmail}. Please request a new code.`,
      };
    }

    const storedCodeNorm = String(stored.code).trim().replace(/\D/g, "").slice(0, 6);

    if (normalizedCode !== storedCodeNorm) {
      const updated = await otpStoreIncrAttempts(normalizedEmail);
      if (!updated) {
        return { valid: false, error: "Too many attempts. Please request a new code." };
      }
      const remaining = updated.maxAttempts - updated.attempts;
      return {
        valid: false,
        error: `Invalid code. You have ${remaining} attempt${remaining === 1 ? "" : "s"} left.`,
      };
    }

    await otpStoreDelete(normalizedEmail);
    console.log(`[OTP] ✓ Verified for ${normalizedEmail}`);
    return { valid: true };
  } catch (err) {
    console.error("[OTP VERIFY] Error:", err);
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Failed to verify OTP",
    };
  }
}

/**
 * Clear expired OTPs (Supabase fallback only; Redis expires automatically)
 */
export async function clearExpiredOTPs(): Promise<void> {
  try {
    const redis = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    if (redis) return;

    const supabase = createAdminClient();
    await supabase
      .from("otp_codes")
      .delete()
      .lt("expires_at", new Date().toISOString());
  } catch (err) {
    console.error("[OTP] Error clearing expired codes:", err);
  }
}
