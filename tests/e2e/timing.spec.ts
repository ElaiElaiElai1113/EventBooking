import { expect, test } from "@playwright/test";
import { loadScene, advanceTime, role } from "./helpers";
test("timely proof protects both booths after expiry", async ({ page }) => {
  await loadScene(page, "merchant-proof-review", "merchant");
  await advanceTime(page, "2026-11-09T18:00");
  await expect(page.getByTestId("application-status")).toHaveText(
    "Payment under review",
  );
  await expect(page.getByTestId("allocation-state")).toHaveText("Held");
  await expect(page.getByTestId("allocation-summary")).toHaveText(
    "Booths 30 + 31",
  );
});
test("unpaid offer expires atomically without deleting application", async ({
  page,
}) => {
  await loadScene(page, "merchant-offer", "merchant");
  await advanceTime(page, "2026-11-08T18:00");
  await expect(page.getByTestId("application-status")).toHaveText(
    "Offer expired",
  );
  await expect(page.getByTestId("allocation-state")).toHaveText("Released");
  await expect(page.getByTestId("application-reference")).toContainText(
    "paper-and-clay",
  );
});
test("explicit extension is visible to merchant", async ({ page }) => {
  await loadScene(page, "merchant-offer", "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await page.getByText("Extend deadline explicitly", { exact: true }).click();
  await page
    .getByLabel("Extension reason", { exact: true })
    .fill("Extra sample review time");
  await page
    .getByRole("button", { name: "Extend deadline", exact: true })
    .click();
  await role(page, "merchant");
  await page.goto("/applications/paper-and-clay");
  await expect(
    page.getByText(/Nov 9, 2026, 6:00 PM PHT/).first(),
  ).toBeVisible();
  await advanceTime(page, "2026-11-08T18:00");
  await expect(page.getByTestId("allocation-state")).toHaveText("Held");
});
test("full mode partial receipt cannot confirm; sufficient total can", async ({
  page,
}) => {
  await loadScene(page, "merchant-full-payment", "merchant");
  await page
    .getByRole("checkbox", {
      name: "I accept this exact offer and its terms",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Accept offer", exact: true }).click();
  await page
    .getByLabel("Payment reference", { exact: true })
    .fill("FULL-PART-1");
  await page.getByLabel("Amount paid (PHP)", { exact: true }).fill("2000");
  await page
    .getByRole("button", { name: "Submit sample payment", exact: true })
    .click();
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await page
    .getByRole("button", { name: "Record receipt decision", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText(
    "Payment due",
  );
  await expect(page.getByTestId("allocation-state")).toHaveText("Held");
  await role(page, "merchant");
  await page.goto("/applications/paper-and-clay");
  await page
    .getByLabel("Payment reference", { exact: true })
    .fill("FULL-PART-2");
  await page
    .getByRole("button", { name: "Submit sample payment", exact: true })
    .click();
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await page
    .getByRole("button", { name: "Record receipt decision", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText(
    "Confirmed · fully paid",
  );
  await expect(page.getByTestId("collectible-balance")).toHaveText("PHP 0.00");
});

test("late proof cannot reclaim a booth reallocated to another merchant", async ({
  page,
}) => {
  await loadScene(page, "merchant-offer", "merchant");
  await page
    .getByRole("checkbox", {
      name: "I accept this exact offer and its terms",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Accept offer", exact: true }).click();
  await advanceTime(page, "2026-11-08T18:00");
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await page.getByRole("button", { name: /Green Goods/ }).click();
  await page
    .getByRole("button", { name: "Approve and offer booth", exact: true })
    .click();
  await page
    .getByLabel("Offered booth or complete pair", { exact: true })
    .selectOption("30");
  await page
    .getByRole("button", { name: "Send exact offer", exact: true })
    .click();
  await role(page, "merchant");
  await page.goto("/applications/paper-and-clay");
  await page
    .getByText("Submit a sample payment reference", { exact: true })
    .click();
  await page
    .getByLabel("Payment reference", { exact: true })
    .fill("LATE-PAPER-REVIEW");
  await page
    .getByRole("button", { name: "Submit sample payment", exact: true })
    .click();
  await expect(page.getByTestId("allocation-state")).toHaveText("Released");
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await page.getByRole("button", { name: /Paper and Clay/ }).click();
  await page
    .getByRole("button", { name: "Record receipt decision", exact: true })
    .click();
  await expect(page.locator(".global-error")).toContainText(
    "No valid accepted allocation remains",
  );
  await page.getByRole("button", { name: /Green Goods/ }).click();
  await expect(page.getByTestId("allocation-summary")).toHaveText("Booths 30");
  await expect(page.getByTestId("allocation-state")).toHaveText("Held");
});
