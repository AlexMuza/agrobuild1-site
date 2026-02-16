import { test, expect } from "@playwright/test";

test("RU/EN switch and lead form submits (mocked API)", async ({ page }) => {
  // Mock API so E2E works without backend/secrets.
  await page.route("**/api/captcha", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, a: 3, b: 4, token: "token", ttlMs: 60_000 }),
    });
  });
  await page.route("**/api/lead", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    expect(body.name).toBeTruthy();
    expect(body.phone).toMatch(/^\+7/);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, delivered: ["telegram"], failed: [] }),
    });
  });

  await page.goto("/");

  // Language switch
  await expect(page.getByText("О нас")).toBeVisible();
  await page.getByRole("button", { name: "EN" }).click();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();

  // Form
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByPlaceholder("Your name").fill("Ivan Ivanov");
  await page.getByPlaceholder("+7 (999) 999-99-99").fill("9802488485");
  await page.getByPlaceholder("Comment (optional)").fill("Hello");
  await page.getByPlaceholder("Answer").fill("7");

  await page.getByRole("button", { name: /Send request/i }).click();

  // Form clears on success
  await expect(page.getByPlaceholder("Your name")).toHaveValue("");
});

