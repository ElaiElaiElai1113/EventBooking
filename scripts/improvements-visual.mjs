import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const base = process.env.DEMO_BASE_URL ?? "http://127.0.0.1:3101";
const browser = await chromium.launch();
const results = [];
for (const width of [320, 390, 768, 1440]) {
  for (const [scene, role, path] of [
    ["venue-quote", "customer", "/venues/sample-pavilion"],
    ["event-setup", "organizer", "/organizer/events/makers-market-2026/setup"],
    ["merchant-proof-review", "merchant", "/applications/paper-and-clay"],
  ]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("dialog", (d) => d.accept());
    await page.goto(base);
    await page
      .getByRole("button", { name: "Demo controls", exact: true })
      .click();
    await page.getByLabel("Demo scene", { exact: true }).selectOption(scene);
    await page.getByRole("button", { name: "Load scene", exact: true }).click();
    await page.getByLabel("Demo role", { exact: true }).selectOption(role);
    await page
      .getByRole("button", { name: "Close demo controls", exact: true })
      .click();
    await page.goto(base + path);
    await page.locator("h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      fonts: performance
        .getEntriesByType("resource")
        .filter((r) => r.name.endsWith("woff2"))
        .map((r) => ({
          name: r.name.split("/").at(-1),
          bytes: r.transferSize,
        })),
      preloads: document.querySelectorAll('link[rel="preload"][as="font"]')
        .length,
      brokenImages: [...document.images]
        .filter((i) => i.complete && !i.naturalWidth)
        .map((i) => i.src),
    }));
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `docs/evidence/improvements-${scene}-${width}.png`,
        fullPage: true,
      });
    results.push({ width, scene, path, errors, ...metrics });
    if (scene === "venue-quote" && width === 390) {
      await page
        .getByRole("button", { name: "02 Seated gathering", exact: true })
        .click();
      await page.screenshot({
        path: "docs/evidence/improvements-gallery-390.png",
        fullPage: true,
      });
    }
    await page.close();
  }
}
await browser.close();
writeFileSync(
  "docs/evidence/improvements-visual.json",
  JSON.stringify(
    { base, checkedAt: new Date().toISOString(), results },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    checks: results.length,
    issues: results.filter(
      (r) => r.overflow || r.errors.length || r.brokenImages.length,
    ),
    fontPreloads: results[0].preloads,
  }),
);
