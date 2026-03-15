import { expect, test } from "@playwright/test";

test("contact GET is method-guarded", async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/api/contact`);
  expect(response.status()).toBe(405);
});

test("protected APIs reject unauthenticated access", async ({ request, baseURL }) => {
  for (const path of ["/api/auth/session", "/api/proposals", "/api/invoices", "/api/contracts"]) {
    const response = await request.get(`${baseURL}${path}`);
    expect(response.status(), `expected ${path} to reject anonymous access`).toBe(401);
  }
});

test("auth APIs reject cross-origin requests", async ({ request, baseURL }) => {
  const cases = [
    {
      path: "/api/auth/send-otp",
      body: { email: "test@example.com", fullName: "Test User" },
    },
    {
      path: "/api/auth/verify-otp",
      body: {
        email: "test@example.com",
        code: "123456",
        fullName: "Test User",
        businessType: "freelancer",
        password: "Password123!",
      },
    },
    {
      path: "/api/auth/check-email",
      body: { email: "test@example.com" },
    },
    {
      path: "/api/auth/check-password-account",
      body: { email: "test@example.com" },
    },
  ];

  for (const entry of cases) {
    const response = await request.post(`${baseURL}${entry.path}`, {
      data: entry.body,
      headers: {
        Origin: "https://evil.example",
      },
    });
    expect(response.status(), `expected ${entry.path} to block cross-origin access`).toBe(403);
  }
});
