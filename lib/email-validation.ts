/**
 * Email validation utilities
 * Detects disposable/fake email addresses
 */

// Comprehensive list of disposable/temporary email domains
const DISPOSABLE_DOMAINS = new Set([
  // Popular temp mail services
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
  
  // Additional temp/disposable services
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillapop.com",
  "pokemail.net",
  "spam.la",
  "spamgourmet.com",
  "mailnesia.com",
  "mytrashmail.com",
  "temp-mail.io",
  "tempmail.net",
  "15minutemail.com",
  "20minutemail.com",
  "throwawaymail.com",
  "cachedmail.com",
  "tempail.com",
  "mailhole.com",
  "getdisposableemail.com",
  "suremail.info",
  "temp.mail.ru",
  "fakeemail.net",
  "dispostable.com",
  "anonbox.net",
  "securemail.info",
  "trashmail.ws",
  "dropmail.me",
  "mail.tm",
  "moakt.com",
  "tempaddress.repl.co",
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
  "gmx.com",
  "tutanota.com",
  "posteo.de",
  "fastmail.com",
  "hey.com",
  "mailbox.org",
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
 * Check if domain looks like a test/fake domain
 */
export function isTestDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  
  // Check for common test patterns
  const testPatterns = [
    /test\./, // test.com, test.example.com
    /\.test$/, // example.test
    /^test/,  // test@...
    /localhost/,
    /\.local$/,
    /example\.com/,
    /^fake|^dummy|^invalid|^no-reply/,
  ];
  
  return testPatterns.some(pattern => pattern.test(domain));
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

  if (isTestDomain(email)) {
    return { valid: false, error: "This email domain is not valid" };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, error: "Temporary email addresses are not allowed. Use a real email address." };
  }

  if (!isValidEmailDomain(email)) {
    return { valid: false, error: "This email domain is not valid" };
  }

  return { valid: true };
}
