import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map<string, { code: string; expiresAt: number; attempts: number }>();

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  // Ensure exactly 6 digits
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  if (code.length !== 6) {
    console.warn(`[OTP] Generated code length mismatch: ${code} (length: ${code.length})`);
  }
  return code;
}

/**
 * Send OTP via Resend email
 */
export async function sendOTP(email: string, fullName?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP with normalized email
    otpStorage.set(normalizedEmail, {
      code: otp,
      expiresAt,
      attempts: 0,
    });

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[OTP SEND] Email: ${normalizedEmail}`);
    console.log(`[OTP SEND] Code: ${otp} (length: ${otp.length})`);
    console.log(`[OTP SEND] Expires: ${new Date(expiresAt).toISOString()}`);
    console.log(`[OTP SEND] All stored: ${Array.from(otpStorage.keys()).join(', ')}`);
    console.log(`${'='.repeat(60)}\n`);

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
  const normalizedEmail = email.trim().toLowerCase();
  const stored = otpStorage.get(normalizedEmail);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`[OTP VERIFY] Email: ${normalizedEmail} | Code: ${code}`);
  console.log(`[OTP VERIFY] Found in storage: ${!!stored}`);
  console.log(`[OTP VERIFY] All stored emails:`, Array.from(otpStorage.keys()));
  
  if (stored) {
    console.log(`[OTP VERIFY] Stored code: ${stored.code}`);
    console.log(`[OTP VERIFY] Code match: ${stored.code === code}`);
    console.log(`[OTP VERIFY] Expires at: ${new Date(stored.expiresAt).toISOString()}`);
    console.log(`[OTP VERIFY] Now: ${new Date(Date.now()).toISOString()}`);
    console.log(`[OTP VERIFY] Expired: ${Date.now() > stored.expiresAt}`);
  }
  console.log(`${'='.repeat(60)}\n`);

  if (!stored) {
    return { valid: false, error: `No verification code found for ${normalizedEmail}. Please request a new code.` };
  }

  if (Date.now() > stored.expiresAt) {
    otpStorage.delete(normalizedEmail);
    console.log(`[OTP] Code expired for ${normalizedEmail}`);
    return { valid: false, error: "Verification code expired. Please request a new one." };
  }

  stored.attempts++;

  if (stored.attempts > 5) {
    otpStorage.delete(normalizedEmail);
    console.log(`[OTP] Too many attempts for ${normalizedEmail}`);
    return { valid: false, error: "Too many attempts. Please request a new code." };
  }

  if (stored.code !== code) {
    console.log(`[OTP] Wrong code for ${normalizedEmail}. Expected: ${stored.code}, Got: ${code}`);
    return { valid: false, error: `Invalid code. You have ${5 - stored.attempts} attempts left.` };
  }

  // OTP is valid, delete it
  otpStorage.delete(normalizedEmail);
  console.log(`[OTP] ✓ Successfully verified for ${normalizedEmail}`);
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
