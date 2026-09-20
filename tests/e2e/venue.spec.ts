import { expect, test } from "@playwright/test";
import { loadScene, role } from "./helpers";

test("unaccepted quote revisions retain earlier dates and require exact acceptance", async ({
  page,
}) => {
  await loadScene(page, "venue-quote", "venue");
  await page.goto("/bookings/alex-celebration");
  await page
    .getByLabel("Quoted event begins", { exact: true })
    .fill("2026-11-08T10:00");
  await page
    .getByLabel("Quoted event ends", { exact: true })
    .fill("2026-11-08T18:00");
  await page
    .getByLabel("Quoted access begins", { exact: true })
    .fill("2026-11-08T09:00");
  await page
    .getByLabel("Quoted access ends", { exact: true })
    .fill("2026-11-08T19:00");
  await page.getByLabel("Rental total (PHP)", { exact: true }).fill("22000");
  await page
    .getByRole("button", { name: "Send quote and hold space", exact: true })
    .click();
  await expect(
    page.getByText("Previous quote v1 · replaced", { exact: true }),
  ).toBeVisible();
  await role(page, "customer");
  await page.goto("/bookings/alex-celebration");
  await expect(
    page.getByRole("button", { name: "Accept quote", exact: true }),
  ).toBeDisabled();
  await expect(page.getByText(/Quoted event: Nov 8/)).toBeVisible();
  await page
    .getByRole("checkbox", {
      name: "I accept this quote and its terms",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Accept quote", exact: true }).click();
  await expect(page.getByText(/Accepted version 2 on/)).toBeVisible();
});
test("inquiry to venue-verified confirmation uses the same booking", async ({
  page,
}) => {
  await loadScene(page, "venue-inquiry", "customer");
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await page.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await expect(
    page.getByText(
      "Inquiry received. Awaiting venue response. No reservation has been made.",
    ),
  ).toBeVisible();
  await role(page, "venue");
  await page.goto("/venue/requests");
  await page
    .getByRole("button", { name: "Send quote and hold space", exact: true })
    .click();
  await role(page, "customer");
  await page.goto("/bookings/alex-celebration");
  await page
    .getByRole("checkbox", {
      name: "I accept this quote and its terms",
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Accept quote", exact: true }).click();
  await expect(page.getByTestId("booking-status")).toHaveText("Payment due");
  await page
    .getByLabel("Payment reference", { exact: true })
    .fill("DEMO-ALEX-10000");
  await page.getByLabel("Amount paid (PHP)", { exact: true }).fill("10000");
  await page
    .getByRole("button", { name: "Submit sample payment", exact: true })
    .click();
  await expect(page.getByTestId("booking-status")).toHaveText(
    "Payment under review",
  );
  await role(page, "venue");
  await page.goto("/venue/requests");
  await page
    .getByRole("button", { name: "Record receipt decision", exact: true })
    .click();
  await expect(page.getByTestId("booking-status")).toHaveText(
    "Confirmed · balance due",
  );
  await expect(page.getByTestId("collectible-balance")).toHaveText(
    "PHP 10,000.00",
  );
  await page.getByRole("tab", { name: "Calendar", exact: true }).click();
  await expect(page.getByRole("button", { name: /Alex/ })).toContainText(
    "confirmed",
  );
  await role(page, "customer");
  await page.goto("/bookings/alex-celebration");
  await expect(page.getByTestId("booking-status")).toHaveText(
    "Confirmed · balance due",
  );
});
test("overlapping inquiry cannot obtain a second hold", async ({ page }) => {
  await loadScene(page, "venue-conflict", "venue");
  await page.getByRole("button", { name: /Sample second customer/ }).click();
  await page
    .getByRole("button", { name: "Send quote and hold space", exact: true })
    .click();
  await expect(page.locator(".global-error")).toContainText(
    "overlaps an existing hold",
  );
  await expect(
    page.getByText(
      "Inquiry received. Awaiting venue response. No reservation has been made.",
    ),
  ).toBeVisible();
  await page.getByText("Questions & replies", { exact: true }).click();
  await page
    .getByLabel("Sample message", { exact: true })
    .fill(
      "Proposed alternative: 8 November, 09:00�19:00 access. Please confirm before a revised quote.",
    );
  await page
    .getByRole("button", { name: "Add sample message", exact: true })
    .click();
  await expect(
    page.getByText(
      "Proposed alternative: 8 November, 09:00�19:00 access. Please confirm before a revised quote.",
      { exact: true },
    ),
  ).toBeVisible();
});
