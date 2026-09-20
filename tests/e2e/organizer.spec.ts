import { expect, test } from "@playwright/test";
import { loadScene, role, advanceTime, setupStep } from "./helpers";
test("current packet review gates agreement and complete publication", async ({
  page,
}) => {
  await loadScene(page, "event-setup", "organizer");
  await setupStep(page, "5. Preview & publish");
  await expect(
    page.getByRole("button", { name: "Publish event", exact: true }),
  ).toBeDisabled();
  await role(page, "venue");
  await page.goto("/venue/events/makers-market-2026/review");
  await expect(
    page.getByRole("button", { name: "Agree to arrangement", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("checkbox", {
      name: "I reviewed the current required packet",
      exact: true,
    })
    .check();
  await page
    .getByRole("button", { name: "Agree to arrangement", exact: true })
    .click();
  await expect(page.getByTestId("venue-agreement-status")).toHaveText("Agreed");
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/setup");
  await setupStep(page, "5. Preview & publish");
  await page
    .getByRole("button", { name: "Publish event", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Event published · View public event →" })
    .click();
  await expect(
    page.getByText("Applications upcoming", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Current review packet")).toHaveCount(0);
  await expect(page.getByText("Separate rental balance:")).toHaveCount(0);
});
test("required revision blocks agreement; optional meeting never approves", async ({
  page,
}) => {
  await loadScene(page, "event-revision", "venue");
  await expect(
    page.getByRole("button", { name: "Agree to arrangement", exact: true }),
  ).toBeDisabled();
  await page
    .getByText("Private messages & optional meetings", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Propose sample meeting", exact: true })
    .click();
  await expect(page.getByText("proposed", { exact: true })).toBeVisible();
  await expect(page.getByTestId("venue-agreement-status")).toHaveText(
    "Awaiting current agreement",
  );
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/setup");
  await setupStep(page, "2. Venue & layout");
  await page
    .getByText("Private messages & optional meetings", { exact: true })
    .click();
  await page
    .getByRole("button", { name: "Accept meeting", exact: true })
    .click();
  await expect(page.getByText("accepted", { exact: true })).toBeVisible();
});

test("review filters show matching submissions and clarification permits a deliberate same-record correction", async ({
  page,
}) => {
  await loadScene(page, "merchant-entry", "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await expect(
    page.getByRole("heading", { name: "Paper and Clay", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText("7 applications", { exact: true })).toBeVisible();
  await page.getByLabel("Category", { exact: true }).selectOption("Coffee");
  await expect(page.getByText("2 applications", { exact: true })).toBeVisible();
  await page.getByLabel("Space", { exact: true }).selectOption("2");
  await expect(
    page.getByText("No applications match these filters.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Space", { exact: true }).selectOption("");
  await page.getByLabel("Category", { exact: true }).selectOption("");
  await page.getByRole("button", { name: /Brew Corner/ }).click();
  await page
    .getByRole("button", { name: "Shortlist internally", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove from shortlist", exact: true }),
  ).toBeVisible();
  await page
    .getByText("Internal notes & clarification", { exact: true })
    .click();
  await page
    .getByLabel("Clarification question", { exact: true })
    .fill("Please confirm the equipment wattage.");
  await page
    .getByRole("button", { name: "Request clarification", exact: true })
    .click();
  await page
    .getByLabel("Status", { exact: true })
    .selectOption("clarification");
  await expect(page.getByText("1 applications", { exact: true })).toBeVisible();
  await page
    .getByText("Inventory & competing preferences", { exact: true })
    .click();
  await page.getByRole("button", { name: "Booth 23", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Clear booth 23 filter", exact: true }),
  ).toBeVisible();
  await advanceTime(page, "2026-11-06T18:00");
  await role(page, "merchant");
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await page
    .getByLabel("Demo identity", { exact: true })
    .selectOption("brew-corner");
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
  await page.goto("/events/makers-market-2026/apply");
  await page.getByLabel("Equipment power (watts)", { exact: true }).fill("300");
  await page
    .getByRole("button", { name: "Continue to booth preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Review application", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Submit deliberate revision", exact: true })
    .click();
  await expect(page.getByTestId("application-status")).toHaveText(
    "Application submitted",
  );
  await role(page, "organizer");
  await page.goto("/organizer/events/makers-market-2026/applications");
  await expect(page.getByText("7 applications", { exact: true })).toBeVisible();
});
