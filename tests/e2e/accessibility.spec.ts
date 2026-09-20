import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loadScene } from "./helpers";
const screens = [
  ["venue-inquiry", "customer", "/venues"],
  ["venue-inquiry", "customer", "/venues/sample-hall"],
  ["event-setup", "organizer", "/organizer/events/makers-market-2026/setup"],
  ["merchant-entry", "merchant", "/events/makers-market-2026"],
  ["merchant-entry", "merchant", "/events/makers-market-2026/apply"],
  ["merchant-offer", "merchant", "/applications/paper-and-clay"],
  [
    "merchant-review",
    "organizer",
    "/organizer/events/makers-market-2026/applications",
  ],
];
for (const [scene, role, path] of screens)
  test(`accessibility ${path}`, async ({ page }) => {
    await loadScene(page, scene, role);
    await page.goto(path);
    await page.locator("h1").waitFor();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("keyboard dialog focus returns and errors preserve input", async ({
  page,
}) => {
  await loadScene(page, "merchant-entry", "merchant");
  await page.goto("/events/makers-market-2026/apply");
  const trigger = page.getByRole("button", {
    name: "Demo controls",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page
    .getByLabel("Responsible contact email", { exact: true })
    .fill("invalid");
  await page
    .getByRole("button", { name: "Continue to booth preferences", exact: true })
    .click();
  await expect(page.getByText("Check the highlighted fields.")).toBeVisible();
  await expect(
    page.getByLabel("Responsible contact email", { exact: true }),
  ).toHaveValue("invalid");
});
