import type { Page } from "@playwright/test";
import { scenes } from "../../src/demo/scenes";
export async function role(page: Page, value: string) {
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await page.getByLabel("Demo role", { exact: true }).selectOption(value);
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
}
export async function setupStep(page: Page, label: string) {
  const toggle = page.getByRole("button", { name: /Step \d of 5/ });
  if ((page.viewportSize()?.width ?? 1440) <= 600) await toggle.click();
  await page.getByRole("button", { name: label, exact: true }).click();
}
export async function loadScene(page: Page, scene: string, value: string) {
  await page.goto("/");
  page.on("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await page.getByLabel("Demo scene", { exact: true }).selectOption(scene);
  await page.getByRole("button", { name: "Load scene", exact: true }).click();
  await page.waitForURL("**" + scenes.find((s) => s[0] === scene)![3]);
  await page.getByLabel("Demo role", { exact: true }).selectOption(value);
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
}
export async function advanceTime(page: Page, value: string) {
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await page.getByLabel("Demo time", { exact: true }).fill(value);
  await page.getByRole("button", { name: "Advance time", exact: true }).click();
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
}
