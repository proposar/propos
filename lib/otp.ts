import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const supabase = createAdminClient();

    // Delete any existing OTP for this email (to reset attempts)
    await supabase
      .from("otp_codes")
      .delete()
      .eq("email", normalizedEmail);

    // Store OTP in database
    const { error: dbError } = await supabase
      .from("otp_codes")
      .insert({
        email: normalizedEmail,
        code: otp,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
      });

    if (dbError) {
      console.error("[OTP SEND] Database error:", dbError);
      return { success: false, error: "Failed to send OTP" };
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[OTP SEND] Email: ${normalizedEmail}`);
    console.log(`[OTP SEND] Code: ${otp} (length: ${otp.length})`);
    console.log(`[OTP SEND] Expires: ${expiresAt.toISOString()}`);
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
      console.error("[OTP SEND] Resend error:", error);
      // Clean up the OTP from database if email send failed
      await supabase
        .from("otp_codes")
        .delete()
        .eq("email", normalizedEmail);
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
 * Verify OTP code
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
    const supabase = createAdminClient();

    if (normalizedCode.length !== 6) {
      return { valid: false, error: "Please enter a valid 6-digit code." };
    }

    // Fetch OTP from database (case-insensitive email match)
    const { data: rows, error: dbError } = await supabase
      .from("otp_codes")
      .select("*")
      .ilike("email", normalizedEmail);

    const stored = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (dbError && dbError.code !== "PGRST116") {
      console.error("[OTP VERIFY] Database error:", dbError);
      return { valid: false, error: "Failed to verify OTP. Please try again." };
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[OTP VERIFY] Email: ${normalizedEmail} | Code: ${normalizedCode}`);
    console.log(`[OTP VERIFY] Found in database: ${!!stored}`);
    
    if (stored) {
      console.log(`[OTP VERIFY] Stored code: ${stored.code}`);
      console.log(`[OTP VERIFY] Code match: ${String(stored.code).trim() === normalizedCode}`);
      console.log(`[OTP VERIFY] Expires at: ${stored.expires_at}`);
      console.log(`[OTP VERIFY] Now: ${new Date().toISOString()}`);
      console.log(`[OTP VERIFY] Expired: ${new Date() > new Date(stored.expires_at)}`);
      console.log(`[OTP VERIFY] Attempts: ${stored.attempts} / ${stored.max_attempts}`);
    }
    console.log(`${'='.repeat(60)}\n`);

    if (!stored) {
      return { valid: false, error: `No verification code found for ${normalizedEmail}. Please request a new code.` };
    }

    // Check expiration
    if (new Date() > new Date(stored.expires_at)) {
      // Delete expired OTP (use id for reliability)
      await supabase
        .from("otp_codes")
        .delete()
        .eq("id", stored.id);
      console.log(`[OTP] Code expired for ${normalizedEmail}`);
      return { valid: false, error: "Verification code expired. Please request a new one." };
    }

    // Check attempt limit
    if (stored.attempts >= stored.max_attempts) {
      // Delete OTP if max attempts exceeded
      await supabase
        .from("otp_codes")
        .delete()
        .eq("id", stored.id);
      console.log(`[OTP] Too many attempts for ${normalizedEmail}`);
      return { valid: false, error: "Too many attempts. Please request a new code." };
    }

    // Compare codes - normalize stored code same way as input (handles number/whitespace)
    const storedCodeNorm = String(stored.code).trim().replace(/\D/g, "").slice(0, 6);

    if (normalizedCode !== storedCodeNorm) {
      // Increment attempts
      await supabase
        .from("otp_codes")
        .update({ attempts: stored.attempts + 1 })
        .eq("id", stored.id);
      const remaining = stored.max_attempts - stored.attempts - 1;
      console.log(`[OTP] Wrong code for ${normalizedEmail}. Expected: ${stored.code}, Got: ${normalizedCode}`);
      return { 
        valid: false, 
        error: `Invalid code. You have ${remaining} attempt${remaining === 1 ? '' : 's'} left.`
      };
    }

    // OTP is valid, delete it
    await supabase
      .from("otp_codes")
      .delete()
      .eq("id", stored.id);
    console.log(`[OTP] ✓ Successfully verified for ${normalizedEmail}`);
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
 * Clear expired OTPs from database
 */
export async function clearExpiredOTPs(): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase
      .from("otp_codes")
      .delete()
      .lt("expires_at", new Date().toISOString());
  } catch (err) {
    console.error("[OTP] Error clearing expired codes:", err);
  }
}

// Run cleanup every 5 minutes
setInterval(clearExpiredOTPs, 5 * 60 * 1000);
