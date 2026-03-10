/**
 * Email validation utilities
 * Detects disposable/fake email addresses
 */

// List of common disposable email domains
const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "mailinator.com",
  "10minutemail.com",
  "emailondeck.com",
  "tempmail.io",
  "temp-mail.org",
  "trashmail.com",
  "sharklasers.com",
  "yopmail.com",
  "maildrop.cc",
  "mintemail.com",
  "temp-email.org",
  "throwawaymail.com",
  "fakeinbox.com",
  "spam4.me",
  "testing123.com",
]);

// Corporate/common free email domains (allowed)
const ALLOWED_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "protonmail.com",
  "icloud.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
]);

/**
 * Validate email format
 */
export function isValidEmailFormat(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
}

/**
 * Check if email is from a disposable (fake) provider
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Check if email domain is a known corporate/free provider
 */
export function isValidEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  
  // Allow known free/corporate domains
  if (ALLOWED_DOMAINS.has(domain)) return true;
  
  // Allow company domains (contain a dot and are 3+ chars)
  if (domain.includes(".") && domain.length >= 3) return true;
  
  // Reject single-letter domains
  if (domain.length < 3) return false;
  
  return true;
}

/**
 * Full email validation (format + domain check + fake email check)
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  email = email.trim().toLowerCase();

  if (!email) {
    return { valid: false, error: "Email is required" };
  }

  if (!isValidEmailFormat(email)) {
    return { valid: false, error: "Enter a valid email address" };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, error: "Please use a real email address (not a temp email service)" };
  }

  if (!isValidEmailDomain(email)) {
    return { valid: false, error: "This email domain is not valid" };
  }

  return { valid: true };
}
