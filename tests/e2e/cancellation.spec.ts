import { expect, test } from "@playwright/test";
import { loadScene } from "./helpers";
test("cancellation releases pair; explicit refund remains separate", async ({
  page,
}) => {
  await loadScene(page, "merchant-cancellation", "organizer");
  await expect(page.getByTestId("allocation-state")).toHaveText("Confirmed");
  await page
    .getByRole("button", { name: "Confirm cancellation", exact: true })
    .click();
  await expect(page.getByTestId("allocation-state")).toHaveText("Released");
  await expect(page.getByTestId("refund-status")).toHaveText("Refund due");
  await expect(page.getByTestId("collectible-balance")).toHaveText("PHP 0.00");
  await page
    .getByLabel("Refund reference", { exact: true })
    .fill("DEMO-REFUND-PAPER");
  await page.getByLabel("Refund amount (PHP)", { exact: true }).fill("2000");
  await page
    .getByRole("button", { name: "Record sample refund", exact: true })
    .click();
  await expect(page.getByTestId("refund-status")).toHaveText("Refund recorded");
  await page.getByRole("link", { name: "View roster", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No confirmed merchants yet" }),
  ).toBeVisible();
});
