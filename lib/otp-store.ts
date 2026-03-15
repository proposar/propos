/**
 * OTP storage - uses Upstash Redis when configured.
 * Nothing is stored in Supabase until auth completes (verify-otp creates user).
 * Fallback to otp_codes table when Redis is not configured.
 */

import { createAdminClient } from "@/lib/supabase/server";

const OTP_TTL_SEC = 10 * 60; // 10 minutes
const MAX_ATTEMPTS = 5;

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const { Redis } = require("@upstash/redis");
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export type OtpRecord = {
  code: string;
  attempts: number;
  maxAttempts: number;
};

export async function otpStoreSet(email: string, code: string): Promise<boolean> {
  const redis = getRedis();
  if (redis) {
    const key = `otp:${email.toLowerCase()}`;
    const data: OtpRecord = { code, attempts: 0, maxAttempts: MAX_ATTEMPTS };
    await redis.set(key, JSON.stringify(data), { ex: OTP_TTL_SEC });
    return true;
  }
  const supabase = createAdminClient();
  await supabase.from("otp_codes").delete().eq("email", email.toLowerCase());
  const { error } = await supabase.from("otp_codes").insert({
    email: email.toLowerCase(),
    code,
    expires_at: new Date(Date.now() + OTP_TTL_SEC * 1000).toISOString(),
    attempts: 0,
    max_attempts: MAX_ATTEMPTS,
  });
  return !error;
}

export async function otpStoreGet(email: string): Promise<OtpRecord | null> {
  const redis = getRedis();
  if (redis) {
    const key = `otp:${email.toLowerCase()}`;
    const raw = await redis.get(key);
    if (raw && typeof raw === "object") {
      const rec = raw as Partial<OtpRecord>;
      if (typeof rec.code === "string") {
        return {
          code: rec.code,
          attempts: Number(rec.attempts ?? 0),
          maxAttempts: Number(rec.maxAttempts ?? MAX_ATTEMPTS),
        };
      }
    }
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw) as OtpRecord;
      } catch {
        return null;
      }
    }
    return null;
  }
  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("otp_codes")
    .select("code, attempts, max_attempts, expires_at, id")
    .ilike("email", email.toLowerCase());
  const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
  if (!row) return null;
  const r = row as { id: string; code: string; attempts: number; max_attempts: number; expires_at: string };
  if (new Date() > new Date(r.expires_at)) {
    await supabase.from("otp_codes").delete().eq("id", r.id);
    return null;
  }
  return {
    code: r.code,
    attempts: r.attempts ?? 0,
    maxAttempts: r.max_attempts ?? MAX_ATTEMPTS,
  };
}

export async function otpStoreIncrAttempts(email: string): Promise<OtpRecord | null> {
  const redis = getRedis();
  if (redis) {
    const key = `otp:${email.toLowerCase()}`;
    const raw = await redis.get(key);
    let rec: OtpRecord;

    if (raw && typeof raw === "object") {
      const parsed = raw as Partial<OtpRecord>;
      if (typeof parsed.code !== "string") return null;
      rec = {
        code: parsed.code,
        attempts: Number(parsed.attempts ?? 0),
        maxAttempts: Number(parsed.maxAttempts ?? MAX_ATTEMPTS),
      };
    } else if (typeof raw === "string") {
      try {
        rec = JSON.parse(raw);
      } catch {
        return null;
      }
    } else {
      return null;
    }

    rec.attempts += 1;
    if (rec.attempts >= rec.maxAttempts) {
      await redis.del(key);
      return null;
    }
    await redis.set(key, JSON.stringify(rec), { ex: OTP_TTL_SEC });
    return rec;
  }
  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("otp_codes")
    .select("id, code, attempts, max_attempts, expires_at")
    .ilike("email", email.toLowerCase());
  const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
  if (!row) return null;
  const r = row as { id: string; code: string; attempts: number; max_attempts: number };
  const nextAttempts = (r.attempts ?? 0) + 1;
  if (nextAttempts >= (r.max_attempts ?? MAX_ATTEMPTS)) {
    await supabase.from("otp_codes").delete().eq("id", r.id);
    return null;
  }
  await supabase
    .from("otp_codes")
    .update({ attempts: nextAttempts })
    .eq("id", r.id);
  return {
    code: r.code,
    attempts: nextAttempts,
    maxAttempts: r.max_attempts ?? MAX_ATTEMPTS,
  };
}

export async function otpStoreDelete(email: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(`otp:${email.toLowerCase()}`);
    return;
  }
  const supabase = createAdminClient();
  await supabase.from("otp_codes").delete().eq("email", email.toLowerCase());
}
