import { expect, test } from "@playwright/test";
import { loadScene, role, advanceTime } from "./helpers";
test("one application survives competition through pair confirmation and roster", async ({
  page,
}) => {
  await loadScene(page, "merchant-entry", "merchant");
  await page
    .getByRole("link", { name: "Apply for a booth", exact: true })
    .click();
  await page
    .getByLabel("Products for this event", { exact: true })
    .fill("Handmade paper goods, pottery and sample gifts");
  await page
    .getByRole("button", { name: "Continue to booth preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "Booth 26", exact: true }).click();
  await page.getByRole("button", { name: "Booth 27", exact: true }).click();
  await page
    .getByRole("button", { name: "Add preference", exact: true })
    .click();
  await expect(
    page.getByText(
      "26 + 27 crosses the walkway. Choose a physically eligible adjacent pair within one row.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Review application", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText(
    "Application submitted",
  );
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await expect(page.getByText("8 applications", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Approve and offer booth", exact: true }),
  ).toBeDisabled();
  await advanceTime(page, "2026-11-06T18:00");
  await page.getByRole("button", { name: /Brew Corner/ }).click();
  await page
    .getByRole("button", { name: "Approve and offer booth", exact: true })
    .click();
  await page
    .getByLabel("Offered booth or complete pair", { exact: true })
    .selectOption("23");
  await page
    .getByRole("button", { name: "Send exact offer", exact: true })
    .click();
  await expect(page.getByTestId("allocation-summary")).toHaveText("Booths 23");
  await page.getByRole("button", { name: /Paper and Clay/ }).click();
  await expect(page.locator(".preference-row").first()).toContainText(
    "Unavailable",
  );
  await page
    .getByRole("button", { name: "Approve and offer booth", exact: true })
    .click();
  await page
    .getByLabel("Offered booth or complete pair", { exact: true })
    .selectOption("30+31");
  await page
    .getByRole("button", { name: "Send exact offer", exact: true })
    .click();
  await role(page, "merchant");
  await page.goto("/applications/paper-and-clay");
  await expect(page.getByTestId("allocation-summary")).toHaveText(
    "Booths 30 + 31",
  );
  await page
    .getByRole("checkbox", {
      name: "I accept this exact offer and its terms",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Accept offer", exact: true }).click();
  await page
    .getByLabel("Payment reference", { exact: true })
    .fill("DEMO-PAPER-2000");
  await page
    .getByRole("button", { name: "Submit sample payment", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText(
    "Payment under review",
  );
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await page
    .getByRole("button", { name: "Record receipt decision", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText(
    "Confirmed · balance due",
  );
  await expect(page.getByTestId("collectible-balance")).toHaveText(
    "PHP 2,000.00",
  );
  await page.getByRole("link", { name: "View roster", exact: true }).click();
  await expect(page.getByRole("row", { name: /Paper and Clay/ })).toContainText(
    "30 + 31",
  );
  await expect(page.getByRole("row", { name: /Paper and Clay/ })).toContainText(
    "PHP 2,000.00",
  );
  await page.goto("/bookings/organizer-rental");
  await expect(page.getByTestId("collectible-balance")).toHaveText(
    "PHP 10,000.00",
  );
});
test("map/list selection, draft recovery and profile snapshot", async ({
  page,
}) => {
  await loadScene(page, "merchant-entry", "merchant");
  await page.goto("/events/makers-market-2026/apply");
  await page
    .getByLabel("Business name", { exact: true })
    .fill("Paper and Clay long sample business name");
  await page.reload();
  await expect(page.getByLabel("Business name", { exact: true })).toHaveValue(
    "Paper and Clay long sample business name",
  );
  await page
    .getByRole("button", { name: "Continue to booth preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "Booth 23", exact: true }).click();
  await page.getByRole("button", { name: "Booth 24", exact: true }).click();
  await expect(page.getByTestId("current-booth-choice")).toHaveText("23 + 24");
  await page.getByRole("tab", { name: "List", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Booth 23", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Review application", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Paper and Clay long sample business name",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Review or correct application", exact: true })
    .click();
  await page
    .getByRole("button", { name: "1. Business & needs", exact: true })
    .click();
  await page.getByText("Edit reusable profile name", { exact: true }).click();
  await page
    .getByLabel("Reusable profile business name", { exact: true })
    .fill("Different profile");
  await page
    .getByRole("button", { name: "Save profile only", exact: true })
    .click();
  await page.goto("/applications/paper-and-clay");
  await expect(
    page.getByRole("heading", {
      name: "Paper and Clay long sample business name",
      exact: true,
    }),
  ).toBeVisible();
});

test("business edits survive jumping directly to review", async ({ page }) => {
  await loadScene(page, "merchant-entry", "merchant");
  await page.goto("/events/makers-market-2026/apply");
  await page
    .getByLabel("Business name", { exact: true })
    .fill("Paper draft through tabs");
  await page
    .getByRole("button", { name: "3. Review & submit", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Paper draft through tabs",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Paper draft through tabs",
      exact: true,
    }),
  ).toBeVisible();
});
