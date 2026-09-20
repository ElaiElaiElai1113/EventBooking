import { chromium } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync("docs/evidence", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (d) => d.accept());
const load = async (scene, role) => {
  await page.goto("http://127.0.0.1:3100");
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await page.getByLabel("Demo scene", { exact: true }).selectOption(scene);
  await page.getByRole("button", { name: "Load scene", exact: true }).click();
  await page.waitForURL(
    scene === "merchant-entry"
      ? "**/events/makers-market-2026"
      : scene === "merchant-review"
        ? "**/organizer/events/makers-market-2026/applications"
        : "**/venues/sample-hall",
  );
  await page.getByLabel("Demo role", { exact: true }).selectOption(role);
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
};
const results = [];
for (const [name, scene, role, path] of [
  ["venues", "venue-inquiry", "customer", "/venues"],
  ["booths", "merchant-entry", "merchant", "/events/makers-market-2026/apply"],
  [
    "review",
    "merchant-review",
    "organizer",
    "/organizer/events/makers-market-2026/applications",
  ],
]) {
  await load(scene, role);
  await page.goto("http://127.0.0.1:3100" + path);
  await page.locator("h1").waitFor();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: `docs/evidence/t05-${name}-${width}.png`,
      fullPage: true,
    });
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    results.push({ name, width, overflow: over });
  }
}
await load("merchant-entry", "merchant");
await page.goto("http://127.0.0.1:3100/events/makers-market-2026/apply");
await page.getByRole("button", { name: "Booth 23", exact: true }).click();
await page.getByRole("button", { name: "Booth 24", exact: true }).click();
results.push({
  selection: await page.getByTestId("current-booth-choice").innerText(),
});
await page.getByRole("tab", { name: "List", exact: true }).click();
results.push({
  listSelected: await page
    .getByRole("button", { name: "Booth 23", exact: true })
    .getAttribute("aria-pressed"),
});
fs.writeFileSync(
  "docs/evidence/t05-results.json",
  JSON.stringify({ results, errors }, null, 2),
);
console.log(JSON.stringify({ results, errors }));
await browser.close();
