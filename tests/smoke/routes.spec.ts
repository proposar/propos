import { expect, test, type Page } from "@playwright/test";

const publicRoutes = [
  {
    path: "/",
    assertVisible: (page: Page) =>
      expect(page.getByRole("heading", { name: /write proposals that win/i })).toBeVisible(),
  },
  {
    path: "/login",
    assertVisible: (page: Page) =>
      expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible(),
  },
  {
    path: "/signup",
    assertVisible: (page: Page) =>
      expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible(),
  },
  {
    path: "/about",
    assertVisible: (page: Page) =>
      expect(page.getByRole("heading", { name: /about/i })).toBeVisible(),
  },
  {
    path: "/contact",
    assertVisible: (page: Page) =>
      expect(page.getByRole("heading", { name: /contact/i })).toBeVisible(),
  },
];

const protectedRoutes = [
  "/dashboard",
  "/proposals",
  "/invoices",
  "/contracts",
  "/templates",
  "/onboarding",
];

for (const route of publicRoutes) {
  test(`public route ${route.path} loads`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `expected ${route.path} to return 200`).toBe(200);
    await route.assertVisible(page);
  });
}

for (const route of protectedRoutes) {
  test(`protected route ${route} redirects to login`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login(\?|$)/);
  });
}
