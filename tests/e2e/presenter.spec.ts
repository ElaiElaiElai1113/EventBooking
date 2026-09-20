import { expect, test } from "@playwright/test";
import { loadScene, role } from "./helpers";
test("private records stay out of the wrong simulated perspective", async ({
  page,
}) => {
  await loadScene(page, "merchant-review", "organizer");
  await page
    .getByText("Internal notes & clarification", { exact: true })
    .click();
  await page
    .getByLabel("Organizer-only notes", { exact: true })
    .fill("PRIVATE NOTE: organizer-only sample");
  await page
    .getByRole("button", { name: "Save internal notes", exact: true })
    .click();
  await role(page, "merchant");
  await page.goto("/applications/paper-and-clay");
  await expect(
    page.getByText("PRIVATE NOTE: organizer-only sample"),
  ).toHaveCount(0);
  await page.goto("/applications/brew-corner");
  await expect(
    page.getByRole("heading", { name: "Switch demo perspective" }),
  ).toBeVisible();
  await page.goto("/organizer/events/makers-market-2026/applications");
  await expect(
    page.getByRole("heading", { name: "Switch demo perspective" }),
  ).toBeVisible();
  await page.goto("/events/makers-market-2026");
  await expect(
    page.getByText("PRIVATE NOTE: organizer-only sample"),
  ).toHaveCount(0);
  await expect(page.getByText("Current review packet")).toHaveCount(0);
  await role(page, "venue");
  await page.goto("/venue/events/makers-market-2026/review");
  await expect(
    page.getByRole("button", { name: "Approve and offer booth", exact: true }),
  ).toHaveCount(0);
});
test("corrupt saved data is preserved until explicit recovery", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("eventbooking.demo.v1", "{broken"),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Recover your local demo" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("eventbooking.demo.v1")),
  ).toBe("{broken");
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Reset saved demo", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Demo controls", exact: true }),
  ).toBeVisible();
});
test("save failure is honest and retains in-memory changes", async ({
  page,
}) => {
  await loadScene(page, "merchant-entry", "merchant");
  await page.goto("/events/makers-market-2026/apply");
  await page.evaluate(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Sample quota failure", "QuotaExceededError");
    };
  });
  await page
    .getByLabel("Business name", { exact: true })
    .fill("Unsaved sample business");
  await expect(page.getByText(/Not saved —/).first()).toBeVisible();
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue(
    "Unsaved sample business",
  );
});
test("waitlist keeps application and single substitute requires acceptance", async ({
  page,
}) => {
  await loadScene(page, "merchant-waitlist", "organizer");
  await expect(
    page.locator(".application-panel").getByText("waitlisted", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Approve and offer booth", exact: true })
    .click();
  await page
    .getByLabel("Offered booth or complete pair", { exact: true })
    .selectOption("24");
  await expect(page.getByText(/Explicit quantity substitution/)).toBeVisible();
  await page
    .getByRole("button", { name: "Send exact offer", exact: true })
    .click();
  await role(page, "merchant");
  await page.goto("/applications/paper-and-clay");
  await expect(page.getByTestId("allocation-summary")).toHaveText("Booths 24");
  await expect(page.getByTestId("application-status")).toHaveText(
    "Offer received",
  );
  await expect(
    page.getByRole("button", { name: "Accept offer", exact: true }),
  ).toBeDisabled();
});

test("scene loading refreshes the displayed clock and continue returns to the latest route", async ({
  page,
}) => {
  await loadScene(page, "merchant-entry", "merchant");
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await expect(page.getByLabel("Demo time", { exact: true })).toHaveValue(
    "2026-11-01T10:00",
  );
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
  await page.goto("/events/makers-market-2026/apply");
  await expect(page.getByLabel("Business name", { exact: true })).toBeVisible();
  await page.goto("/");
  await page
    .getByRole("link", { name: "Continue current scene", exact: true })
    .click();
  await expect(page).toHaveURL(/\/apply$/);
});
