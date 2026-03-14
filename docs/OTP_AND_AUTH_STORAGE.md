# OTP & Auth Storage — No Supabase Until Auth Completes

We do **not** store users in Supabase until they have fully completed authentication.

---

## OTP Flow (Manual Signup)

1. **Send OTP** — User enters email, clicks "Send OTP"
   - OTP is stored in **Upstash Redis** (if `KV_REST_API_URL` / `KV_REST_API_TOKEN` are set)
   - OR in **otp_codes** table (fallback when Redis is not configured)
   - **No** `auth.users` or `profiles` row is created

2. **Verify OTP** — User enters code, clicks "Verify"
   - OTP is checked (Redis or otp_codes)
   - **Only if valid**: `auth.users` and `profiles` are created
   - Session is established

---

## Google OAuth Flow

- User is created in Supabase **only after** they complete Google sign-in
- Auth callback runs after Google returns the code — at that point auth is complete

---

## Recommended: Use Upstash Redis for OTP

To avoid storing any signup data in Supabase before auth:

1. Add Redis from [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=redis) (Upstash)
2. Env vars are set automatically: `KV_REST_API_URL`, `KV_REST_API_TOKEN`
3. OTP is stored in Redis; Supabase has no signup-related data until verify-otp runs

---

## Fallback: otp_codes Table

If Redis is not configured, OTP is stored in `otp_codes`. This is temporary verification data, not a user account. `auth.users` and `profiles` are still only created after OTP verification.
