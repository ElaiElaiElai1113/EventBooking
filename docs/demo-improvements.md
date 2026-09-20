# Demo improvements — 20 September 2026

All six presentation improvements were authorized together. Work was implemented and reviewed inline on `demo-improvements`, preserving the original business rules, fictional fixtures, temporary name and browser-local storage schema.

| Improvement | Delivered behavior |
| --- | --- |
| Guided handoffs | Current-record handoffs for customer/venue inquiries, merchant/organizer applications and organizer/venue arrangement review. Presenter identity and navigation change; commands, drafts, receipts, scene and revision do not change simply because of a handoff. Organizer handoffs include the exact application query parameter. |
| Venue detail | Existing licensed photo plus original seating/market schematic gallery views, sample facility list, quote inclusions/exclusions guidance and a clearly labeled whole-venue starting price. No new real property, seating capacity, package inclusion or policy claims. |
| Availability | Public anonymous month calendar derived from existing active allocations. Selected-day intervals include setup/cleanup and use Philippine-time day boundaries with exclusive interval ends. Released holds disappear; timely proof protection follows authoritative allocation state. Day selection is exploratory and does not book, reserve or overwrite an inquiry. |
| Progress | Shared read-only selectors show stage, next actor and applicable deadline. Explicit handling for receipt review/corrections, canceled/expired/declined/replaced offers, separate refunds, required packet revisions, current agreement and publication checks. Confirmed balance review retains confirmed status. |
| Mobile forms | Compact expandable event-step navigator, required/optional field groups and full-width mobile form actions. Draft registration and validation remain unchanged. An experimental sticky footer was removed after visual review showed it covering the first field; actions remain in normal document flow. |
| Loading/device polish | Next local Latin fonts with four automatic preloads, swap/fallback, route and hydration loading feedback, image loading/fallback feedback and accurate detail-photo sizes. Added opt-in iPhone WebKit project. |

## Verification

Fresh lint, TypeScript, 64 unit/component tests and production build passed. See `docs/evidence/improvements-{lint,typecheck,unit,build}.txt`.

The initial expanded browser run passed 94/96 cases. Two WebKit harness races were investigated: checking a collapsed mobile navigator before hydration, and leaving a page before its application form had rendered. Tests now wait for the visible controls instead of making immediate visibility assumptions. Both targeted rechecks passed; the initial results are preserved in `improvements-browser.txt` and `improvements-webkit-recheck.txt`.

The final production-build browser run passed **96/96 tests in 2.5 minutes**, recorded separately in `improvements-browser-final.txt`. It exercises 32 scenarios across desktop Chromium, Pixel 5 Chromium and iPhone 13 WebKit, with retries disabled, including all original flows, new handoffs and accessibility scans.

`scripts/improvements-visual.mjs` checked venue, organizer setup and payment-review views at 320, 390, 768 and 1440 pixels: 12 combinations, zero page overflow, zero JavaScript page errors and zero broken images. It confirmed four font preloads. Mobile and desktop screenshots were visually reviewed; final screenshots reflect the footer correction. See `improvements-visual.json` and `improvements-*.png` under `docs/evidence`.

This is WebKit on Windows with iPhone emulation, not a physical iPhone or macOS Safari acceptance claim. The earlier hosted download delays were observed but their upstream cause was not established. Font delivery is now explicitly preloaded; no percentage speed improvement or field performance result is claimed.

## Reproduce

```powershell
node node_modules/@playwright/test/cli.js install webkit
$env:DEMO_WEBKIT='1'
# Uses the existing production-server fixture unless DEMO_BASE_URL is set.
node node_modules/@playwright/test/cli.js test
# Point this at a running production build or the hosted demo:
$env:DEMO_BASE_URL='http://127.0.0.1:3101'
node scripts/improvements-visual.mjs
```

Backend authentication, shared data, real uploads/payment verification and independent user acceptance remain separate future work. No Supabase integration was added.
