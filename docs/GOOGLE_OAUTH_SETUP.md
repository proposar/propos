# Google OAuth Setup Guide for Proposar

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click the **Project** dropdown at the top
4. Click **Create New Project**
5. **Project name**: `Proposar`
6. **Location**: Keep as default
7. Click **Create** → Wait 1-2 minutes for completion

---

## Step 2: Enable the Google+ API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **Google+ API**
3. Click on **Google+ API**
4. Click **Enable**

---

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, click **Configure Consent Screen** first:
   - **User Type**: Select `External`
   - Click **Create**
   - **App name**: `Proposar`
   - **User support email**: Use your email
   - Click **Save and Continue** through all screens
   - Skip optional scopes, click **Save and Continue**
   - No test users needed, click **Save and Continue** → **Back to Dashboard**

4. Now create OAuth credentials:
   - Go back to **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - **Application type**: `Web application`
   - **Name**: `Proposar Web`
   - Under **Authorized JavaScript origins**, click **Add URI**:
     - Add: `http://localhost:3000` (for local dev)
     - Add: `https://yourdomain.com` (replace with your production domain)
     - Add: `https://yourdomain.vercel.app` (if using Vercel)
   - Under **Authorized redirect URIs**, click **Add URI**:
     - Add: `http://localhost:3000/auth/callback`
     - Add: `https://yourdomain.com/auth/callback`
     - Add: `https://yourdomain.vercel.app/auth/callback`
   - Click **Create**

---

## Step 4: Configure Supabase

### 4a. Add Redirect URLs (Critical – required or Google login will redirect back to sign-in)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your Proposar project
3. Go to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for local dev)
   - `https://yourdomain.com/auth/callback` (replace with your production domain)
   - `https://yourdomain.vercel.app/auth/callback` (if using Vercel)
5. Set **Site URL** to your main domain (e.g. `https://yourdomain.com` or `http://localhost:3000` for dev)

### 4b. Enable Google Provider

1. Go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Click to enable it
4. You'll see a form:
   - **Client ID**: Copy from Google Cloud Console (OAuth 2.0 Client IDs)
     - Find your "Proposar Web" OAuth credentials
     - Copy the **Client ID**
   - **Client Secret**: Copy from same location
     - Copy the **Client Secret**
   - Click **Save**

---

## Step 5: Test Locally

1. Make sure you have the correct environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Start your dev server:
   ```bash
   npm run dev
   ```

3. Go to `http://localhost:3000/login`

4. Click **Continue with Google**

5. You should be redirected to Google login → select your account → redirected back to dashboard

---

## Step 6: Configure for Production

Once you're ready to go live:

1. **Update Google Cloud Console**:
   - Add your production domain as an authorized origin
   - Add your production callback URLs

2. **Ensure Supabase configuration is saved**:
   - Google OAuth credentials in Supabase should be the same

3. **Test in production**:
   - Visit `https://yourdomain.com/login`
   - Click **Continue with Google**
   - Verify the flow works

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Redirects back to sign-in after Google** | Add `https://yourdomain.com/auth/callback` to **Supabase** → Authentication → URL Configuration → Redirect URLs |
| **"Invalid credentials" error** | Verify Client ID and Client Secret are correct in Supabase |
| **Button doesn't work** | Check browser console for errors; make sure auth/callback route exists |
| **New users not created after Google signin** | Supabase should auto-create profile; check if auth trigger is set up |

---

## Email OTP Setup (Supabase Default)

Email OTP is already configured in the login page (`/app/(auth)/login/page.tsx`):

- User clicks "Email Code" tab
- Enters email
- Receives 6-digit code
- Enters code to sign in
- No password needed

**Note**: Supabase sends OTP using their default email sender. You can customize this in Supabase:
- Go to **Authentication** → **Email Templates**
- Customize the "Confirmation" template for OTP

---

## Next Steps

1. ✅ Complete Google OAuth setup above
2. ✅ Test OTP login on `/login` page
3. Test the complete user flow:
   - Sign up with Google → should redirect to onboarding
   - Sign up with email/password → receives verification email
   - Sign in with password → works
   - Sign in with email OTP → receives code, signs in
4. Monitor Supabase logs for any auth errors

---

## Email Configuration (Optional)

To use **Resend** for custom email templates instead of Supabase's default:

1. Go to Supabase **Authentication** → **Email Templates**
2. Option 1: Use Supabase's SMTP settings
   - Connect Resend via SMTP (requires extra setup)
3. Option 2: Create server-side OTP verification
   - See `docs/BILLING_GAPS.md` for email integration examples

---

## Security Best Practices

- ✅ Never commit Client Secret to git
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS in production
- ✅ Supabase handles token rotation automatically
- ✅ OTP codes expire after 10-15 minutes
- ✅ Redirect URI must match exactly

