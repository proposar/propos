import { expect, test, type Page } from "@playwright/test";

const authEmail = process.env.PLAYWRIGHT_AUTH_EMAIL;
const authPassword = process.env.PLAYWRIGHT_AUTH_PASSWORD;

async function login(page: Page) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.getByLabel(/email/i).fill(authEmail ?? "");
  await page.getByLabel(/password/i).fill(authPassword ?? "");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).toHaveURL(/\/(dashboard|onboarding)(\?|$)/);
}

test.describe("authenticated smoke", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!authEmail || !authPassword, "PLAYWRIGHT_AUTH_EMAIL and PLAYWRIGHT_AUTH_PASSWORD are required.");
    await login(page);
  });

  test("dashboard loads for authenticated user", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/recent proposals/i)).toBeVisible();
    await expect(page.getByText(/total proposals/i)).toBeVisible();
  });

  test("proposals module loads for authenticated user", async ({ page }) => {
    await page.goto("/proposals", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /proposals/i })).toBeVisible();
  });

  test("invoices module loads for authenticated user", async ({ page }) => {
    await page.goto("/invoices", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /invoices/i })).toBeVisible();
  });

  test("contracts module loads for authenticated user", async ({ page }) => {
    await page.goto("/contracts", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /contracts/i })).toBeVisible();
  });

  test("authenticated APIs respond without unauthorized errors", async ({ page, baseURL }) => {
    const api = page.context().request;
    for (const path of ["/api/proposals", "/api/invoices", "/api/contracts"]) {
      const response = await api.get(`${baseURL}${path}`);
      expect(response.status(), `expected ${path} to work for authenticated user`).not.toBe(401);
    }
  });
});
