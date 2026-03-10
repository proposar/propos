import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { code: string; expiresAt: number; attempts: number }>();

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP via Resend email
 */
export async function sendOTP(email: string, fullName?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(email, {
      code: otp,
      expiresAt,
      attempts: 0,
    });

    // Send via Resend
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
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("OTP send error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send OTP",
    };
  }
}

/**
 * Verify OTP code
 */
export function verifyOTP(
  email: string,
  code: string
): {
  valid: boolean;
  error?: string;
} {
  const stored = otpStorage.get(email);

  if (!stored) {
    return { valid: false, error: "No OTP found for this email" };
  }

  if (Date.now() > stored.expiresAt) {
    otpStorage.delete(email);
    return { valid: false, error: "OTP expired. Please request a new code." };
  }

  stored.attempts++;

  if (stored.attempts > 5) {
    otpStorage.delete(email);
    return { valid: false, error: "Too many attempts. Please request a new code." };
  }

  if (stored.code !== code) {
    return { valid: false, error: "Invalid verification code" };
  }

  // OTP is valid, delete it
  otpStorage.delete(email);
  return { valid: true };
}

/**
 * Clear expired OTPs periodically
 */
export function clearExpiredOTPs(): void {
  const now = Date.now();
  otpStorage.forEach((data, email) => {
    if (now > data.expiresAt) {
      otpStorage.delete(email);
    }
  });
}

// Run cleanup every 5 minutes
setInterval(clearExpiredOTPs, 5 * 60 * 1000);
