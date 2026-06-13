import { expect, test } from "@playwright/test";

test("landing responds and shows the wordmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("BILLD");
});
