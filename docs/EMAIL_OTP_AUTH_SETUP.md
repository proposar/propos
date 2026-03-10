# Email OTP & Authentication Setup Guide

## Overview

Proposar supports **3 authentication methods**:
1. **Email + Password** (traditional)
2. **Email OTP** (passwordless, 6-digit code via email)
3. **Google OAuth** (single-click, SSO)

---

## Email OTP Flow

### How it Works

1. **User initiates OTP login**:
   - Goes to `/login`
   - Clicks "Email Code" tab
   - Enters email address
   - Clicks "Send code"

2. **Supabase sends OTP**:
   - Generates 6-digit code
   - Sends via email (Supabase default sender)
   - Code valid for ~10-15 minutes

3. **User verifies code**:
   - Receives email with code
   - Enters 6-digit code
   - Clicks "Verify code"
   - Automatically creates account if first-time user

4. **User signed in**:
   - Redirected to `/dashboard` or onboarding page
   - Session created
   - Can sign out and use same method again

---

## Configuration

### Supabase Email OTP (Default - Already Enabled)

Email OTP is configured by default in Supabase. No additional setup needed.

**What happens**:
- Users receive email from Supabase's mail service
- Default template is basic
- Code expires after ~10 minutes
- User can request new code if needed

### Custom Email Template (Optional)

To customize the OTP email template:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your Proposar project
3. Go to **Authentication** → **Email Templates**
4. Find **"Confirmation"** template
5. Edit the email subject and HTML body

**Example customization**:
```html
Your Proposar verification code is: {{.ConfirmationURL}}

This code expires in 10 minutes.
```

---

## Use Cases

### Use Email OTP When:
- ✅ User forgot their password
- ✅ User lost access to their account
- ✅ You want passwordless experience
- ✅ User prefers not to remember passwords
- ✅ Mobile users (easier than passwords)

### Use Password When:
- ✅ User has existing account with password
- ✅ User prefers password security
- ✅ You want to keep password-based authentication

### Use Google OAuth When:
- ✅ User has Google account
- ✅ Want social login
- ✅ Want single sign-on (SSO)

---

## Testing Email OTP Locally

### Prerequisites
- App running on `http://localhost:3000`
- Supabase project configured

### Steps

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Visit login page**:
   - Go to `http://localhost:3000/login`

3. **Click "Email Code" tab**

4. **Enter test email**:
   - Use an email you have access to
   - Example: `test@gmail.com`

5. **Click "Send code"**:
   - Button changes to input field
   - You should receive email within 1-2 seconds

6. **Check email**:
   - Look in inbox (and spam folder)
   - Copy the 6-digit code

7. **Enter code and verify**:
   - Paste code into the form
   - Click "Verify code"
   - Should redirect to dashboard/onboarding

---

## Testing Email OTP in Production

Same process as above, but:
- Use your production domain (`https://yourdomain.com`)
- Ensure email is deliverable
- Check production Supabase logs for errors

---

## Email Provider Integration

### Current Setup
- **Supabase default email**: Free, limited, not customizable
- **Resend integration**: Optional, allows custom templates

### Future: Use Resend for OTP (Optional)

If you want custom branded OTP emails:

1. Create custom OTP verification endpoint
2. Use Resend to send email with your branding
3. Manage OTP tokens in database

This is more complex but gives full control over email template.

---

## Troubleshooting Email OTP

| Problem | Cause | Solution |
|---------|-------|----------|
| **Code not received** | Email delivery delays | Wait 1-2 minutes; check spam folder |
| **Code expired** | Too long between sending and entering | Request new code (link on form) |
| **"Invalid code" error** | Wrong digits or typo | Copy/paste carefully, check for spaces |
| **Can't proceed after code** | Supabase auth error | Check browser console; try using different email |

---

## Password-Based Login

### Signup Flow

1. User goes to `/signup`
2. Enters: Name, Email, Password
3. Clicks "Sign up"
4. Receives verification email from Supabase
5. Clicks email confirmation link
6. Account activated

### Login Flow

1. User goes to `/login`
2. Clicks "Password" tab
3. Enters: Email + Password
4. Clicks "Sign in"
5. Redirected to dashboard

---

## Security Considerations

### Email OTP
- ✅ Code expires after 10-15 minutes
- ✅ Only valid for one use
- ✅ User must have email access
- ✅ No password to manage
- ✅ Vulnerable to email interception (use HTTPS always)

### Passwords
- ✅ Supabase hashes passwords with bcrypt
- ✅ Password strength checked during signup
- ✅ "Forgot password" allows reset
- ❌ Vulnerable to weak passwords
- ❌ Vulnerable to phishing

### Google OAuth
- ✅ Delegates auth to Google
- ✅ No passwords stored
- ✅ Secure token exchange
- ✅ User controls permissions
- ✅ Auto-create account on first signin

---

## API Routes Reference

### Authentication Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/auth/callback` | GET | Handle OAuth & email confirmation redirects |
| `/api/profile` | GET/PATCH | Get/update user profile (requires auth) |
| `/api/auth/logout` | POST | Sign out user |

---

## Environment Variables

All present in `.env.local`:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google OAuth (required for Google login)
# Set in Supabase UI (Authentication → Providers → Google)
```

---

## Common Patterns

### Force OTP Instead of Password

To disable password login and force OTP:

1. Modify login page (remove password tab)
2. Modify signup page (ask for OTP after signup)
3. Set Supabase auth to "Email" only in UI configuration

### Send Custom OTP Email via Resend

Example in backend:
```typescript
// Send OTP via Resend (instead of Supabase)
import { resend } from "@/lib/resend";

export async function sendOtpEmail(email: string, code: string) {
  await resend.emails.send({
    from: "Proposar <hello@proposar.com>",
    to: email,
    subject: "Your Proposar verification code",
    html: `Your code is: <strong>${code}</strong><br>Valid for 10 minutes.`,
  });
}
```

---

## Next Steps

1. ✅ Email OTP is ready to test
2. ✅ Google OAuth setup guide in `docs/GOOGLE_OAUTH_SETUP.md`
3. Test both flows:
   - Email OTP: `/login` → click "Email Code"
   - Password: `/login` → click "Password"
   - Google: `/login` → click "Continue with Google"
4. Configure Google OAuth (see separate guide)
5. Monitor auth errors in Supabase logs

