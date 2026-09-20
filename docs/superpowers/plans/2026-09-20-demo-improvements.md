# Demo improvements implementation plan

> Execute inline with executing-plans, as requested by the user. The six improvements proposed in conversation were approved together.

**Goal:** Make the existing fictional demo easier to present, explore and use on mobile.

**Architecture:** Read-only selectors derive workflow guidance and public availability from current state. Handoffs change only presenter identity/navigation, never business state. Reuse existing routes, guarded commands, local persistence and visual tokens.

**Tech stack:** Next 16.3.5, React, TypeScript, CSS, Vitest, Playwright.

## Approved design and boundaries

Preserve temporary naming, existing prices, all payment/hold/version rules, original requirement text and browser-local storage. Keep public calendars anonymous. A clear day means no recorded hold, not guaranteed bookability. Use the existing licensed photo plus clearly labeled schematic layout and seating illustrations per venue; do not imply stock imagery depicts a real property. Keep optional information progressively disclosed and one product primary action.

## Tasks

- [ ] Add tests in `tests/unit/presentation.test.ts` for read-only guidance and PHT interval boundaries; fail first, then implement `src/domain/presentation.ts` and `src/domain/venue-calendar.ts`. Cover canceled/expired/replaced, receipts under review, identity, packet revision and released holds.
- [ ] Implement `src/components/shared/journey-progress.tsx`; integrate booking, merchant application, organizer review, event setup and venue review. Handoffs use `present` plus exact record navigation, including an application query parameter. Preserve scene, revision and drafts.
- [ ] Implement `src/features/venues/venue-gallery.tsx` and `venue-calendar.tsx`, add richer details and price basis to venue details. Calendar supports month navigation, a selected-day interval list and no public payer/receipt identifiers.
- [ ] Compact mobile event step navigation with a disclosure containing the existing step buttons. Improve form action positioning and group optional fields without changing registration, persistence or validation.
- [ ] Replace all-subset font CSS with Next local Latin fonts and preload. Add route/hydration loading UI, image loading feedback and accurate image sizes. Inspect evidence of slow downloads without claiming an unproven network cause.
- [ ] Add browser acceptance in `tests/e2e/improvements.spec.ts`: contextual handoff, calendar, gallery, mobile step preservation. Run lint/typecheck/unit, build, complete Chromium suite and WebKit with iPhone emulation. Inspect desktop/mobile screenshots and axe. Physical iPhone/Safari remains unverified unless a real device is available.
- [ ] Update evidence and README. Commit, fast-forward main, push, deploy, and verify hosted improvement flows. Keep previous local/hosted evidence distinct.

## Validation commands

Use the verified Node 22 executable in PATH. Run `node node_modules/vitest/vitest.mjs run tests/unit/presentation.test.ts` for selector coverage, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Run Playwright directly with `node node_modules/@playwright/test/cli.js test` so PowerShell/npm does not swallow flags. For hosted checks set `DEMO_BASE_URL` to the deployment URL and allow a documented network timeout; do not hide failed attempts.
