import { chromium, firefox } from "@playwright/test";
import fs from "node:fs";
const origin = "http://127.0.0.1:3100";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [],
  external = [],
  results = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("request", (r) => {
  if (!r.url().startsWith(origin) && !r.url().startsWith("data:"))
    external.push(r.url());
});
page.on("dialog", (d) => d.accept());
async function load(scene, path) {
  await page.goto(origin);
  await page
    .getByRole("button", { name: "Demo controls", exact: true })
    .click();
  await page.getByLabel("Demo scene", { exact: true }).selectOption(scene);
  await page.getByRole("button", { name: "Load scene", exact: true }).click();
  await page.waitForURL((url) => url.pathname !== "/");
  await page
    .getByRole("button", { name: "Close demo controls", exact: true })
    .click();
  await page.goto(origin + path);
  await page.locator("h1").waitFor();
}
const screens = [
  ["discovery", "venue-inquiry", "/venues"],
  ["venue", "venue-inquiry", "/venues/sample-hall"],
  ["booking", "venue-quote", "/bookings/alex-celebration"],
  ["venue-workspace", "venue-conflict", "/venue/requests"],
  ["setup", "event-setup", "/organizer/events/makers-market-2026/setup"],
  ["venue-review", "event-revision", "/venue/events/makers-market-2026/review"],
  ["public-event", "merchant-entry", "/events/makers-market-2026"],
  ["booths", "merchant-entry", "/events/makers-market-2026/apply"],
  [
    "review",
    "merchant-review",
    "/organizer/events/makers-market-2026/applications",
  ],
  ["proof", "merchant-proof-review", "/applications/paper-and-clay"],
  [
    "cancellation",
    "merchant-cancellation",
    "/organizer/events/makers-market-2026/applications",
  ],
  [
    "roster",
    "merchant-cancellation",
    "/organizer/events/makers-market-2026/roster",
  ],
];
for (const [name, scene, path] of screens) {
  await load(scene, path);
  if (name === "booths")
    await page
      .getByRole("button", { name: "2. Booth preferences", exact: true })
      .click();
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: `docs/evidence/final-${name}-${width}.png`,
      fullPage: true,
    });
    results.push({
      screen: name,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      brokenImages: await page
        .locator("img")
        .evaluateAll(
          (imgs) => imgs.filter((i) => i.complete && !i.naturalWidth).length,
        ),
    });
  }
}
await load("merchant-entry", "/events/makers-market-2026/apply");
await page
  .getByRole("button", { name: "2. Booth preferences", exact: true })
  .click();
await page.setViewportSize({ width: 390, height: 1000 });
await page.getByRole("tab", { name: "List", exact: true }).click();
await page.addStyleTag({
  content:
    "body{font-size:200%!important}button,input,select,textarea,label,p,small{font-size:inherit!important}",
});
await page.screenshot({
  path: "docs/evidence/final-enlarged-list-390.png",
  fullPage: true,
});
results.push({
  screen: "enlarged-list-200-percent",
  width: 390,
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
});
await load(
  "merchant-cancellation",
  "/organizer/events/makers-market-2026/roster",
);
await page.setViewportSize({width:794,height:1123});
await page.emulateMedia({ media: "print" });
await page.pdf({
  path: "docs/evidence/final-roster-print.pdf",
  format: "A4",
  printBackground: true,
});
await page.screenshot({
  path: "docs/evidence/final-roster-print.png",
  fullPage: true,
});
await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
results.push({
  screen: "reduced-motion",
  transition: await page
    .locator("button")
    .first()
    .evaluate((e) => getComputedStyle(e).transitionDuration),
});
// Intentional asset failure is isolated from normal-page console/network results.
const fallback = await browser.newPage();
await fallback.route("**/_next/image**", (route) => route.abort());
await fallback.goto(origin + "/venues");
await fallback
  .getByText("Illustrative photo unavailable. Venue details remain below.")
  .first()
  .waitFor();
results.push({
  screen: "image-fallback",
  visible: await fallback
    .getByText("Illustrative photo unavailable. Venue details remain below.")
    .first()
    .isVisible(),
});
await fallback.screenshot({
  path: "docs/evidence/final-image-fallback.png",
  fullPage: true,
});
await fallback.close();
const performance = [];
for (const profile of ["desktop-local", "mobile-constrained"])
  for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({
      viewport:
        profile === "desktop-local"
          ? { width: 1440, height: 1000 }
          : { width: 390, height: 844 },
      deviceScaleFactor: 1,
    });
    const p = await context.newPage();
    const cdp = await context.newCDPSession(p);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    if (profile === "mobile-constrained") {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 200000,
        uploadThroughput: 50000,
      });
    }
    await p.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__metrics.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.__metrics.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await p.goto(origin + "/venues");
    await p
      .getByRole("heading", { name: "A place for your next occasion." })
      .waitFor();
    await p.waitForLoadState("networkidle");
    await p.waitForTimeout(1000);
    performance.push({
      profile,
      run,
      ...(await p.evaluate(() => ({
        ...window.__metrics,
        resources: performance.getEntriesByType("resource").length,
        transferred: performance
          .getEntriesByType("resource")
          .reduce((n, r) => n + r.transferSize, 0),
      }))),
    });
    await context.close();
  }
let firefoxSmoke;
try {
  const ff = await firefox.launch();
  const p = await ff.newPage();
  await p.goto(origin + "/venues");
  await p
    .getByRole("heading", { name: "A place for your next occasion." })
    .waitFor();
  await p.getByRole("link", { name: "View Sample Hall", exact: true }).click();
  await p.getByRole("button", { name: "Request a quote", exact: true }).click();
  await p.getByRole("button", { name: "Send inquiry", exact: true }).click();
  await p
    .getByText(
      "Inquiry received. Awaiting venue response. No reservation has been made.",
    )
    .waitFor();
  firefoxSmoke = { passed: true, version: ff.version() };
  await ff.close();
} catch (e) {
  firefoxSmoke = { passed: false, error: e.message };
}
const report = {
  at: new Date().toISOString(),
  browser: browser.version(),
  results,
  errors,
  external: [...new Set(external)],
  performance,
  firefoxSmoke,
};
fs.writeFileSync(
  "docs/evidence/final-visual-results.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
