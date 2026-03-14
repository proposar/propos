# Auth Deployment Checklist

**Prevents "Database error: saving new user" and "Account creation failed"**

Run this **before** or **immediately after** deploying to a new environment.

---

## 1. Run Supabase Migrations

All migrations must be applied. Critical for auth:

```bash
supabase db push
```

Or via Supabase Dashboard → SQL Editor, run migrations in order (001 through 014).

**Migration 014** fixes OAuth and OTP signup. It:
- Adds RLS policy for profile creation during user signup (trigger context)
- Fixes `handle_new_user` trigger with `SET search_path = public` and `public.profiles`

---

## 2. Verify handle_new_user Trigger

In Supabase SQL Editor:

```sql
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';
```

The function **must** include:
- `SECURITY DEFINER`
- `SET search_path = public`
- `INSERT INTO public.profiles`

---

## 3. Verify RLS Policies on profiles

```sql
SELECT policyname, cmd, with_check FROM pg_policies WHERE tablename = 'profiles' AND cmd = 'INSERT';
```

You should see:
- `Users can insert own profile` (auth.uid() = id)
- `Allow profile creation for new auth users` (auth.uid() IS NULL)

---

## 4. Supabase URL Configuration (OAuth)

Authentication → URL Configuration:

- **Redirect URLs**: Add `https://yourdomain.com/auth/callback` (and `http://localhost:3000/auth/callback` for dev)
- **Site URL**: Your production domain

---

## 5. Environment Variables

Ensure in production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never expose)
- `RESEND_API_KEY` (for OTP emails)

---

## If Signup Still Fails

1. **Check Supabase Dashboard → Logs** for the raw database error
2. **Verify migration 014** was applied: `supabase migration list`
3. **Re-run migration 014** if needed
4. **Use Google sign-in** as workaround while debugging
