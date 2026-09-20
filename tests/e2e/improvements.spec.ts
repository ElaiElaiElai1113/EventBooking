import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loadScene, setupStep } from "./helpers";

test("guided inquiry handoffs keep the same record through receipt review", async ({
  page,
}) => {
  await loadScene(page, "venue-inquiry", "customer");
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  const before = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("eventbooking.demo.v1")!),
  );
  await page
    .getByRole("button", { name: "Continue as venue reviewer", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Send quote and hold space",
      exact: true,
    }),
  ).toBeVisible();
  const after = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("eventbooking.demo.v1")!),
  );
  expect(after.revision).toBe(before.revision);
  expect(after.bookings).toEqual(before.bookings);
  expect(after.scene).toBe(before.scene);
  await page
    .getByRole("button", { name: "Send quote and hold space", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Continue as customer", exact: true })
    .click();
  await page
    .getByRole("checkbox", {
      name: "I accept this quote and its terms",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Accept quote", exact: true }).click();
  await page
    .getByLabel("Payment reference", { exact: true })
    .fill("DEMO-GUIDED-10000");
  await page.getByLabel("Amount paid (PHP)", { exact: true }).fill("10000");
  await page
    .getByRole("button", { name: "Submit sample payment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Continue as venue reviewer", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Record receipt decision", exact: true })
    .click();
  await expect(page.getByTestId("booking-status")).toHaveText(
    "Confirmed · balance due",
  );
  await expect(page).toHaveURL(/\/bookings\/alex-celebration$/);
});

test("merchant receipt handoff opens its application, not another applicant", async ({
  page,
}) => {
  await loadScene(page, "merchant-proof-review", "merchant");
  await page
    .getByRole("button", { name: "Continue as organizer", exact: true })
    .click();
  await expect(page).toHaveURL(/application=paper-and-clay/);
  await expect(
    page.getByRole("heading", { name: "Paper and Clay", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Record receipt decision", exact: true }),
  ).toBeVisible();
});

test("venue gallery and anonymous calendar expose meaningful sample states", async ({
  page,
}) => {
  await loadScene(page, "venue-quote", "customer");
  await page.goto("/venues/sample-hall");
  await page.getByRole("button", { name: "Next month", exact: true }).click();
  await page
    .getByRole("button", { name: "2026-11-07 · Held", exact: true })
    .click();
  await expect(page.locator(".selected-day")).toContainText(
    "Includes setup and cleanup",
  );
  await expect(page.locator(".venue-calendar")).not.toContainText("Alex");
  await page
    .getByRole("button", { name: "02 Seated gathering", exact: true })
    .click();
  await expect(
    page.getByRole("img", { name: /Seated gathering concept/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "03 Market layout", exact: true })
    .click();
  await expect(
    page.getByRole("img", { name: /Market layout concept/ }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("compact setup navigation preserves drafts and supports the venue handoff", async ({
  page,
}) => {
  await loadScene(page, "event-setup", "organizer");
  await page
    .getByLabel("Event name", { exact: true })
    .fill("Demo layout review");
  await setupStep(page, "2. Venue & layout");
  await setupStep(page, "1. Event details");
  await expect(page.getByLabel("Event name", { exact: true })).toHaveValue(
    "Demo layout review",
  );
  await page.reload();
  await expect(page.getByLabel("Event name", { exact: true })).toHaveValue(
    "Demo layout review",
  );
  await page
    .getByRole("button", { name: "Continue as venue reviewer", exact: true })
    .click();
  await expect(page).toHaveURL(/\/venue\/events\/makers-market-2026\/review$/);
  await page
    .getByRole("checkbox", {
      name: "I reviewed the current required packet",
      exact: true,
    })
    .check();
  await page
    .getByRole("button", { name: "Agree to arrangement", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Continue as organizer", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Publish event", exact: true }),
  ).toBeVisible();
});
