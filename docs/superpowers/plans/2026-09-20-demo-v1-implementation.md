# Davao Event Platform Demo v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in the destination chat. Steps use checkbox (`- [ ]`) syntax for tracking. The user requested a handoff to another chat; do not execute the application build in the planning chat. No subagent dispatch is needed for this plan.

**Goal:** Build a polished, resettable React demonstration of venue booking, organizer event preparation, and merchant application/allocation, satisfying R01–R48 in the master.

**Architecture:** One Next.js application with thin routes, reusable visual components, feature-specific forms/views, and a small typed domain layer. A shared browser-local demo store owns fictional records, a deterministic clock, and guarded state transitions; screens read the same records across simulated roles. A later Supabase adapter must enforce access and transactional inventory on the server; the local store does not claim those guarantees.

**Tech Stack:** React, Next.js App Router, TypeScript, Tailwind CSS, selected customized shadcn/ui/Radix controls, React Hook Form, Zod, Motion, Lucide, Vitest, Testing Library, Playwright, and axe-core. Supabase and Vercel are later integration/hosting destinations.

---

## 1. Execution boundary and reading order

Working directory for every relative file and command in this plan: **`C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking`**. All paths in Files lists are exact paths relative to this root. Existing source references are Markdown links; proposed application files do not exist yet.

Read [PROJECT_MASTER.md](../../../PROJECT_MASTER.md), [scope](../../demo-v1-scope.md), [design brief](../../uiux-and-technology-brief.md), [screen outline](../../demo-screen-outline.md), and [walkthrough](../../demo-walkthrough.md) before T01. Read the venue, organizer, and merchant detailed specifications before their tasks. The master preserves confirmed rules, demo defaults, and deferred research separately.

**Current verified workspace:** documentation only, no `package.json`, application, or Git repository. Recheck before editing; another chat may have added files. Preserve all existing documents and user work. Do not run a scaffold generator over this nonempty folder. Manual initialization below avoids moving or overwriting the planning files. Do not initialize Git, create commits/remotes, or push unless requested. If a repository is introduced later, inspect its root/status and applicable AGENTS instructions before changes.

**Required implementation output:** Stage A local demo and Stage B/C readiness notes (T14), not a connected or hosted product. Actual Supabase connection, real accounts, private uploads, notifications, real transactions, and Vercel publishing remain later scoped actions. Lack of cloud credentials does not block T01–T14. Do not repeatedly ask the user about settled decisions, branding, exact venue checklists, or sample policy values.

Use **Davao Event Platform** as a temporary brand. Use the master fixtures and illustrative labels. The user can adjust branding or actual business inputs later without holding up the local demo.

## 2. Delivery checkpoints and dependency order

| Checkpoint | Tasks | Reviewable output |
| --- | --- | --- |
| Foundation | T01–T04 | Runnable app, tokens, fixtures/store, meaningful domain checks |
| Visual standard | T05 | Three representative views at desktop and mobile with browser evidence |
| Event and venue journeys | T06–T07 | Venue agreement/publication and inquiry-to-confirmation work |
| Merchant journey | T08–T11 | Apply once, compare, offer, verify, waitlist/cancel and roster work |
| Complete demo | T12–T13 | Named scenes A–J, durable local navigation, tested responsive experience |
| Handoff | T14 | Explicit connected/hosting plan and final evidence comparison |

These are output checkpoints, not time estimates or mandatory user approvals between routine tasks. Fix failed checks before expanding the affected flow. Continue within the agreed scope until the full local demo is complete. Do not stop after attractive static screens. Incorporate user feedback if it arrives during implementation.

## 3. File responsibilities

Use this structure unless live workspace inspection supplies an existing convention; record any path changes in the evidence file and update references.

```text
package.json, package-lock.json, tsconfig.json, next-env.d.ts
next.config.ts, postcss.config.mjs, eslint.config.mjs
vitest.config.mts, playwright.config.ts, .gitignore
src/app/layout.tsx, globals.css, page.tsx, error.tsx, not-found.tsx
src/app/venues/page.tsx
src/app/venues/[venueId]/page.tsx
src/app/bookings/[bookingId]/page.tsx
src/app/venue/requests/page.tsx
src/app/venue/events/[eventId]/review/page.tsx
src/app/organizer/events/page.tsx
src/app/organizer/events/[eventId]/setup/page.tsx
src/app/events/[eventId]/page.tsx
src/app/events/[eventId]/apply/page.tsx
src/app/applications/[applicationId]/page.tsx
src/app/organizer/events/[eventId]/applications/page.tsx
src/app/organizer/events/[eventId]/roster/page.tsx
src/components/ui/                         selected primitive source
src/components/layout/{public-shell,workspace-shell}.tsx
src/components/shared/{status-label,money-summary,error-summary,save-status}.tsx
src/features/venues/{venue-catalog,venue-details,inquiry-form,booking-detail,venue-workspace,quote-form}.tsx
src/features/events/{event-setup,venue-review,event-public,review-packet,coordination-panel}.tsx
src/features/booths/{booth-map,booth-list,booth-choice}.tsx
src/features/applications/{merchant-form,application-detail,organizer-review,offer-editor}.tsx
src/features/payments/{payment-panel,cancellation-panel,roster}.tsx
src/domain/{model,commands,transition,selectors,validation,money,time,inventory}.ts
src/domain/{publication,venue-booking,applications,offers,payments,cancellation,coordination}.ts
src/demo/{fixtures,scenes,persistence}.ts
src/demo/{demo-provider,presenter-controls}.tsx
public/demo/                               locally stored illustrative assets
tests/unit/{fixtures,inventory,time,publication,coordination,venue-booking,applications,offers,payments,cancellation,persistence}.test.ts
tests/components/booth-choice.test.tsx
tests/e2e/{fixtures,helpers}.ts
tests/e2e/{visual-standard,venue,organizer,merchant,timing,cancellation,presenter,accessibility}.spec.ts
docs/{implementation-evidence,asset-register,connected-demo-readiness}.md
docs/evidence/                             browser screenshots/reports selected for review
README.md
```

Routes only resolve parameters and compose feature views. Domain modules contain state rules; neither JSX handlers nor presenter buttons can bypass them. `transition.ts` dispatches typed commands to feature transition functions; avoid an enormous switch containing every rule. `selectors.ts` derives inventory, displayed status, balances and role-appropriate view models. `fixtures.ts` is the single source of sample facts; `scenes.ts` produces consistent starting states from those facts.

No extra backend, monorepo, general form builder, analytics engine, 3D scene, arbitrary map editor, or broad plugin system is required.

## 4. Shared data and command contract

Use stable string identifiers and integer **centavos**, never floating-point money. Example: PHP 2,000 is `200_000` centavos. Keep stored timestamps as ISO strings with `+08:00` or normalized UTC, and always render in `Asia/Manila`. Date calculations use the demo clock passed into the transition; wall-clock time must not change a scene unexpectedly.

| Record | Required data relationships |
| --- | --- |
| Venue | ID, name, illustrative area/address/capacity/amenities, whole-resource ID, asset reference and illustrative label |
| Venue booking | ID, venue/resource, payer/customer or organizer ID, draft/inquiry, full access interval, quote history/active quote, accepted version, allocation, receipt IDs, cancellation/refund history |
| Quote | ID/version, booking ID, access interval, line items/total, initial requirement, balance date, terms snapshot, issued/expiry times, response state |
| Event | ID/organizer/venue booking link, event/setup/cleanup timing, draft/published state, application window/decision time, contact/description, payment mode and policy versions, arrangement version |
| Arrangement and packet | Event ID, current version, access/map/rules, required items and applicability, supplied/reviewed versions, changes requested, agreed version/actor/time |
| Booth | Event ID, stable ID/number, zone/map coordinate, dimensions, price, inclusions, power/limits, allowed use, unavailable flag; adjacency in explicit pair list |
| Application | Stable business/event key, merchant ID, draft and submitted snapshots/version, quantity, ordered choices, needs, alternative consent, review state, questions/history and organizer-only notes |
| Offer | ID/application/event, version, exact booth IDs, quantity, immutable price/terms/payment snapshots, expiry/extensions, acceptance, status |
| Allocation | Venue interval or merchant booth IDs, owning booking/offer, held/confirmed/released state; one atomic record per pair |
| Payment record | Agreement type/ID, payer, recipient, reference/sample proof, submitted time, claimed/verified amounts, reviewer/outcome, duplicate/unmatched resolution; never provider credentials |
| Cancellation/refund | Agreement ID, requested/decided time/actor, accepted policy version, decision, future amount no longer collectible in sample case, refund due and explicitly recorded installments |
| Coordination | Event or booking context, sender/recipient, sample message; meeting proposer/recipient, time/duration/type/details, state and counterproposal history |
| Demo envelope | Schema version, revision, scene ID, clock, presenter role/identity, records, processed command IDs, stored form drafts/navigation and history |

Implement the corresponding TypeScript types in `model.ts` and discriminated command union in `commands.ts`. Use exact names in this table for domain concepts; components may have additional form fields. Keep a submitted/accepted snapshot separate from an editable draft. Invalid commands return structured errors and the original state, not partial mutations.

Core envelope pattern for `commands.ts`:

```ts
export type DemoRole = 'customer' | 'venue' | 'organizer' | 'merchant';
export type CommandMeta = {
  commandId: string;
  actorId: string;
  role: DemoRole;
  expectedRevision: number;
};
export type RuleIssue = { code: string; message: string; field?: string };
export type CommandResult<T> =
  | { ok: true; state: T }
  | { ok: false; state: T; issues: RuleIssue[] };
```

Command families to implement, with payloads typed to the relevant model:

| Family | Commands and checks |
| --- | --- |
| Demo | Set role/identity, load scene, advance clock, save draft; reset is explicit and does not impersonate a business event |
| Venue | Save inquiry, submit inquiry, request/reply information, draft/send/revise quote, accept/decline quote, verify venue receipt, expire unpaid hold |
| Event | Save draft, change booth facts/pairs, submit packet, request/reply changes, mark item reviewed/not applicable, agree current arrangement, publish |
| Coordination | Send sample message; propose, accept, counter, decline, cancel meeting; recipient/proposer checks |
| Application | Save/submit/revise application, request/reply clarification, shortlist/note, waitlist/decline/withdraw |
| Offer | Send/accept/decline/extend/withdraw/replace offer; expire unpaid offer; quantity revision explicit |
| Payment | Submit sample receipt, mark resolution needed, reject/verify matching amount, link duplicate/unmatched resolution; never auto-verify |
| Cancellation | Request, decline/confirm cancellation, record refund due and refund installment; release only after decision |

Validate actor and relationship in demo transitions to prevent accidental role mistakes in the presentation. This is not real authorization because the presenter and fictional records reside in the browser. Deduplicate command IDs and business/event application keys. Repeated receipt verification cannot increase verified totals twice. A stale `expectedRevision` returns a refresh/review message, preserving input.

## T01 — Initialize the application and verification harness

**Files — create:** `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `playwright.config.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `README.md`, `docs/implementation-evidence.md`.

**Requirements:** R40, R45, R47. **Dependencies:** none.

- [ ] Inspect workspace and applicable AGENTS files; read the master and specifications. Run `node --version`, `npm --version`, `git rev-parse --show-toplevel`. A non-repository result is expected at this baseline, not a reason to initialize Git. Use the bundled runtime if Node is missing, and record its path/version.
- [ ] Recheck framework compatibility before installing. Select a supported Node LTS version at least 22 for the planned Supabase path. Record installed versions in the evidence file and use `--save-exact` plus the lockfile. Do not silently upgrade a pre-existing project.
- [ ] In this documentation-only folder, initialize manually with the following commands, one at a time. If `package.json` now exists, adapt its scripts/dependencies instead of rerunning initialization.

```powershell
npm init -y
npm install --save-exact next react react-dom react-hook-form @hookform/resolvers zod motion lucide-react clsx tailwind-merge class-variance-authority
npm install -D --save-exact typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss postcss eslint eslint-config-next vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright
```

- [ ] Set `private: true`; add these scripts to `package.json` without removing dependency versions. Use explicit ESLint and typechecking rather than relying on the production build to lint.

```json
{
  "dev": "next dev --hostname 127.0.0.1",
  "build": "next build",
  "start": "next start --hostname 127.0.0.1",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

- [ ] Add the initial server layout and home page, then configure TypeScript via the first Next development run and set alias `@/*` to `./src/*`. The initial page is temporary scaffolding, not the completed public design.

```tsx
// src/app/layout.tsx
import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Davao Event Platform — Demo',
  description: 'Fictional venue and event booking demonstration.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
```

```tsx
// src/app/page.tsx
export default function HomePage() {
  return <main><h1>Davao Event Platform</h1><p>Fictional local demonstration.</p></main>;
}
```

```ts
// next.config.ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = { poweredByHeader: false };
export default nextConfig;
```

```js
// postcss.config.mjs
export default { plugins: { '@tailwindcss/postcss': {} } };
```

```js
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'docs/reference/**']),
]);
```

```ts
// vitest.config.mts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: { environment: 'jsdom', include: ['tests/unit/**/*.test.ts', 'tests/components/**/*.test.tsx'] },
});
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run start -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
```

- [ ] Ignore `.next`, `node_modules`, `.env*` except safe examples, Playwright runtime output and logs. Preserve source documents and selected evidence files. Do not ignore the dependency lockfile.
- [ ] Install a Playwright browser with `npx playwright install chromium` or configure a verified locally available browser; document which actually ran. Reserve port 3000 for verification or choose a free port consistently without killing unrelated processes.
- [ ] Run `npm run dev`, inspect the initial page, then stop the development server. Run `npm run lint`, `npm run typecheck`, `npm run build`. Expected: zero exit codes and the initial route renders; no product acceptance claim yet. Add tests from T03 onward before invoking the full test suite.
- [ ] Start `docs/implementation-evidence.md` with date, stage, runtime/dependency versions, task/R IDs, actual commands/results, browser details, known failures and next work. Initialize all master R rows as Not started until their work begins.

## T02 — Establish the product visual system and shared controls

**Files — create/modify:** `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/public-shell.tsx`, `src/components/layout/workspace-shell.tsx`, `src/components/shared/status-label.tsx`, `src/components/shared/money-summary.tsx`, `src/components/shared/error-summary.tsx`, `src/components/shared/save-status.tsx`, selected `src/components/ui/` files, `docs/asset-register.md`, `public/demo/` assets.

**Requirements:** R40, R42–R44. **Dependencies:** T01. Read frontend-design skill and the UI/UX brief.

- [ ] Define the following base tokens in `globals.css`; extend them with explicit focus/status/disabled tokens only after checking contrast. Keep structural dividers distinct from essential control boundaries.

```css
@import 'tailwindcss';

@theme {
  --color-page: #f7f6f1;
  --color-surface: #ffffff;
  --color-ink: #23352b;
  --color-muted-ink: #5b665e;
  --color-clay: #a84c32;
  --color-divider: #d7ddd6;
  --color-control: #7c877e;
  --radius-control: 0.5rem;
  --radius-surface: 0.75rem;
}

html { color-scheme: light; }
body { margin: 0; color: var(--color-ink); background: var(--color-page); font-size: 1rem; line-height: 1.5; }
button, input, select, textarea { font: inherit; }
:focus-visible { outline: 3px solid var(--color-ink); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

- [ ] Load DM Sans body/UI and Fraunces selected public headings with readable system fallbacks. Store permitted font assets locally or use current Next font support; record origins/licenses. Font/network failure must leave the app readable and must not cause a hidden dependency on a paid service.
- [ ] Inspect `npx shadcn@latest --help` and the current init/component documentation. Initialize only its configuration and selected controls with a consistent primitive family. Review generated changes; map styles into the token system. Initial controls: button, input, textarea, label, dialog, select, checkbox, tabs, tooltip where genuinely needed. Use native semantic elements where sufficient.
- [ ] Create public and workspace shells with skip link, semantic navigation, one primary page heading, responsive content bounds and keyboard access. Keep presenter controls out of product navigation.
- [ ] Create shared status, money, error-summary and save indicators. Status is always text plus optional icon; money groups total, initial due, balance, payee and deadline. Error summary links to fields and leaves entered values intact. Saved appears only after the actual local write succeeds.
- [ ] Select licensed illustrative images, label them consistently, use descriptive alt text and reserved aspect ratios, and keep fallbacks. Asset register fields: local path, origin URL, author if known, license/source checked date, attribution, illustrative/owner-supplied designation, intended screen. No fake Davao listings, endorsements or external asset downloads used to bypass a display restriction.
- [ ] Use Motion only for panels/steps/preference changes; put `MotionConfig reducedMotion="user"` in a client provider and preserve focus/state behavior. No staged long entrance or animation delay on form use.
- [ ] Inspect tokens and shared controls in the real browser at desktop/mobile with keyboard focus. Record style decisions; no unit tests of static CSS values are required. The three real-screen design check is T05.

## T03 — Build consistent fixtures, local persistence, and presenter state

**Files — create:** `src/domain/model.ts`, `src/domain/commands.ts`, `src/demo/fixtures.ts`, `src/demo/scenes.ts`, `src/demo/persistence.ts`, `src/demo/demo-provider.tsx`, `src/demo/presenter-controls.tsx`, `tests/unit/fixtures.test.ts`, `tests/unit/persistence.test.ts`, `tests/e2e/helpers.ts`, `tests/e2e/fixtures.ts`. **Modify:** root layout/home to mount the provider and presenter entry.

**Requirements:** R07, R36, R37. **Dependencies:** T01–T02.

- [ ] Define the entity/command types from section 4, including exact snapshots, integer-centavo amounts and separate agreement IDs. Create the three venues, two distinct rentals, event, 12 booths, ten eligible pairs, eight merchants, packet items and sample policy copies from the master. No fabricated real bank details.
- [ ] Implement `createScene(sceneId)` returning a fresh, internally consistent state. Named scenes must match the table in T12. Use stable sample IDs: venue `sample-hall`, customer booking `alex-celebration`, event `makers-market-2026`, application `paper-and-clay`, merchant `paper-and-clay`, organizer `sample-market-team`. Keep other sample IDs in the same lowercase convention.
- [ ] Write fixture tests before filling the factory. Verify exactly 12 unique booth numbers, ten valid pair links, eight businesses, seven submitted plus Paper draft in merchant-entry, eight submitted in review, and nonoverlapping private/organizer access intervals. Do not derive physical adjacency by subtracting numbers.
- [ ] Implement a versioned `eventbooking.demo.v1` localStorage envelope with `schemaVersion`, records, role/scene/clock and last route/form step. Hydrate on the client before exposing mutations; no server-rendered private fixture content that flashes across roles. React Strict Mode must not duplicate initialization/submissions.
- [ ] Validate loaded data against Zod schemas. If storage is corrupt/incompatible, keep the raw value untouched, show a recovery explanation, and offer explicit sample reset. If saving fails, keep in-memory work, show Not saved, and provide retry; never display a successful save. Automatic hydration must not wipe a valid session.
- [ ] Provide context/store subscription for all feature views; one dispatch path applies a complete immutable transition and persists the resulting envelope. Separate presenter navigation from business commands. No network call is required.
- [ ] Implement visible presenter controls with accessible labels **Demo role**, **Demo scene**, **Demo time**, actions **Load scene**, **Advance time**, **Reset current scene**. Changing scenes/reset is explicit. Scene loading updates the role and route to its entry point; changing role preserves business state.
- [ ] Add the browser helper used by the concrete tests below. Do not add a test-only state mutation API that bypasses the product's commands.

```ts
// tests/e2e/helpers.ts
import type { Page } from '@playwright/test';

export async function loadScene(page: Page, scene: string, role: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Demo controls', exact: true }).click();
  await page.getByLabel('Demo scene', { exact: true }).selectOption(scene);
  await page.getByRole('button', { name: 'Load scene', exact: true }).click();
  await page.getByLabel('Demo role', { exact: true }).selectOption(role);
  await page.getByRole('button', { name: 'Close demo controls', exact: true }).click();
}

export async function advanceTime(page: Page, localTime: string) {
  await page.getByRole('button', { name: 'Demo controls', exact: true }).click();
  await page.getByLabel('Demo time', { exact: true }).fill(localTime);
  await page.getByRole('button', { name: 'Advance time', exact: true }).click();
  await page.getByRole('button', { name: 'Close demo controls', exact: true }).click();
}
```

- [ ] Run `npm run test -- tests/unit/fixtures.test.ts tests/unit/persistence.test.ts`. Expected: fixture integrity, valid restoration, corruption/recovery, write failure and no accidental reset pass. Verify save/back/refresh manually before more form work.

## T04 — Implement inventory, time, money, and transition guards

**Files — create:** `src/domain/time.ts`, `money.ts`, `inventory.ts`, `validation.ts`, `transition.ts`, `selectors.ts`, `tests/unit/time.test.ts`, `inventory.test.ts`. **Modify:** model/commands/provider.

**Requirements:** R04, R08–R10, R23, R27, R36. **Dependencies:** T03.

- [ ] Implement and test pure eligibility/interval/time helpers. This complete core example defines the required pair behavior; extend validation with unavailable/needs checks without weakening it.

```ts
// src/domain/inventory.ts
export type Choice = readonly string[];

export function isEligibleChoice(choice: Choice, allowedPairs: readonly Choice[]): boolean {
  if (new Set(choice).size !== choice.length) return false;
  if (choice.length === 1) return true;
  if (choice.length !== 2) return false;
  return allowedPairs.some(pair => pair.length === 2 && pair.every(id => choice.includes(id)));
}

export function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function choiceIsFree(choice: Choice, heldOrConfirmed: ReadonlySet<string>): boolean {
  return choice.every(id => !heldOrConfirmed.has(id));
}
```

```ts
// tests/unit/inventory.test.ts
import { describe, expect, it } from 'vitest';
import { choiceIsFree, intervalsOverlap, isEligibleChoice } from '../../src/domain/inventory';

describe('physical eligibility and exclusivity', () => {
  const pairs = [['23', '24'], ['30', '31']];
  it('accepts only an explicit eligible pair, regardless of order', () => {
    expect(isEligibleChoice(['24', '23'], pairs)).toBe(true);
    expect(isEligibleChoice(['26', '27'], pairs)).toBe(false);
    expect(isEligibleChoice(['23', '23'], pairs)).toBe(false);
    expect(isEligibleChoice(['23', '24', '25'], pairs)).toBe(false);
  });
  it('fails the whole candidate if either booth is already held', () => {
    const held = new Set(['23']);
    expect(choiceIsFree(['23', '24'], held)).toBe(false);
    expect(held.has('24')).toBe(false);
    expect(choiceIsFree(['30', '31'], held)).toBe(true);
  });
  it('uses the full access interval and permits touching endpoints', () => {
    expect(intervalsOverlap(9, 19, 18, 20)).toBe(true);
    expect(intervalsOverlap(9, 19, 19, 22)).toBe(false);
  });
});
```

- [ ] In the aggregate validator, reject unknown/disabled booths as well as invalid pairs, incorrect quantity, requirements mismatch, conflicting hold, duplicate active offer and wrong actor. A failed command leaves the whole prior state unchanged. Pair reserve/confirm/release edits one allocation containing both IDs.
- [ ] Implement `merchantExpiry(issuedAt)` and `applicationWindow(now, opensAt, closesAt)` in `time.ts` using numeric timestamps. Boundaries are `[opensAt, closesAt)`: new submissions close exactly at close; offers are permitted from close onward. For quote/offer proof, submissions strictly before expiry are timely; at expiry they enter late-review handling. This precise boundary is an engineering default to display/test consistently, not a new business SLA.

```ts
// src/domain/time.ts
export const HOUR_MS = 60 * 60 * 1000;
export function merchantExpiry(issuedAt: number): number { return issuedAt + 48 * HOUR_MS; }
export function applicationWindow(now: number, opensAt: number, closesAt: number) {
  if (now < opensAt) return 'upcoming' as const;
  return now < closesAt ? 'open' as const : 'closed' as const;
}
```

```ts
// tests/unit/time.test.ts
import { expect, it } from 'vitest';
import { applicationWindow, merchantExpiry } from '../../src/domain/time';
it('keeps the full merchant window and exact close boundary', () => {
  const issued = Date.parse('2026-11-06T18:00:00+08:00');
  expect(merchantExpiry(issued)).toBe(Date.parse('2026-11-08T18:00:00+08:00'));
  const open = Date.parse('2026-10-20T09:00:00+08:00');
  const close = Date.parse('2026-11-05T18:00:00+08:00');
  expect(applicationWindow(close - 1, open, close)).toBe('open');
  expect(applicationWindow(close, open, close)).toBe('closed');
});
```

- [ ] Validate schedule ordering: access start ≤ setup ≤ event start < event end ≤ cleanup ≤ access end; opening < closing < expected initial decision; full 48-hour initial window ends before readiness cutoff and no later than the deposit balance deadline. For a later offer/extension, validate again from its actual issue/expiry time; return a specific issue rather than shorten the period automatically.
- [ ] Define shared centavo formatting and balance selectors from verified receipts linked to the correct agreement. Do not sum claimed proof into verified totals. Reject negative/noninteger amounts. Deposit percentage must be greater than zero and below 100; derive the initial amount once per immutable offer with a documented centavo rounding rule.
- [ ] Add stable error codes for premature offers, invalid pair, inventory conflict, duplicate application/offer, stale revision, missing current agreement and infeasible schedule. Map each to a specific field or contextual explanation. Keep the merchant's form draft outside failed transition payload replacement.
- [ ] Run the two unit files, then tests for new guards. Expected: no half-held pair, no overlapping exclusive interval, no accidental use of system time, no negative balance from duplicate verification. Actual full transition tests are completed alongside T06–T11.

## T05 — Build and inspect three representative screens

**Files — create:** `src/features/venues/venue-catalog.tsx`, `venue-details.tsx`, `src/features/booths/booth-map.tsx`, `booth-list.tsx`, `booth-choice.tsx`, `src/features/applications/organizer-review.tsx`, relevant venue/public/application routes, `tests/components/booth-choice.test.tsx`, `tests/e2e/visual-standard.spec.ts`.

**Requirements:** R25, R32, R39, R41–R44. **Dependencies:** T02–T04.

- [ ] Compose venue discovery/details with a concise introduction, real functioning filters, clear fictional photography/captions, price guidance and location/suitability. Use the warm editorial treatment in the brief, keeping venue choices prominent.
- [ ] Compose the merchant booth-choice step with request quantity, synchronized map/list, up to three ranked alternatives, price/needs, selection summary and clear no-reservation wording. Map may use positioned semantic buttons over a static diagram; use the same selection component in list form. Booth buttons have names such as **Booth 23** and `aria-pressed` for selected state.
- [ ] Compose organizer review with applicant rows and linked detail/offer/map context. Status/category/quantity/needs filters are visible where relevant; avoid unrelated charts or repeated stat cards. The page's top action follows the selected application's real state.
- [ ] Ensure the three screens use the same components/tokens and their sample data comes from the shared store. An action whose domain command is not completed yet must honestly explain its unavailable state during this checkpoint; it must be wired before T13.
- [ ] Inspect at 1440, 768, 390 and 320px, including enlarged text, long venue/business names, no-results filters and missing imagery. Check keyboard map/list interaction and focus return from panels. Save labeled screenshots in `docs/evidence/` and record observations against R41; this is an implementation review, not user acceptance.
- [ ] Write the component interaction test using Testing Library: choose two valid booth buttons, assert selected text and combined PHP 4,000; switch to list, assert the same selection; reject 26+27 while retaining business information held by the form. Use the same domain eligibility helper instead of a different component-only rule.
- [ ] Build and run the visual-standard browser checks. Inspect screenshots manually; passing screenshot capture alone is insufficient. Fix composition, readability or mobile clipping before styling the rest of the product. Routine review does not require pausing for another user confirmation.

Concrete browser assertion to include once the selection step is linked:

```ts
import { expect, test } from '@playwright/test';
import { loadScene } from './helpers';

test('booth choices remain accessible across map and list', async ({ page }) => {
  await loadScene(page, 'merchant-entry', 'merchant');
  await page.goto('/events/makers-market-2026/apply?step=booths');
  await page.getByRole('radio', { name: 'Two adjacent booths', exact: true }).check();
  await page.getByRole('button', { name: 'Booth 23', exact: true }).click();
  await page.getByRole('button', { name: 'Booth 24', exact: true }).click();
  await expect(page.getByTestId('current-booth-choice')).toContainText('23 + 24');
  await page.getByRole('tab', { name: 'List', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Booth 23', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
```

## T06 — Complete organizer setup, venue review, and publication

**Files — create:** `src/domain/publication.ts`, `coordination.ts`, `src/features/events/event-setup.tsx`, `venue-review.tsx`, `review-packet.tsx`, `coordination-panel.tsx`, `event-public.tsx`, organizer event list/setup and venue event-review routes, `tests/unit/publication.test.ts`, `coordination.test.ts`, `tests/e2e/organizer.spec.ts`. **Modify:** model/commands/transitions/selectors, presenter scenes.

**Requirements:** R02–R03, R13, R16, R19–R24, R38. **Dependencies:** T05. Read the full organizer specification and saved wireframe review.

- [ ] Implement all five editable step groups from the specification, including name-only draft creation, conditional deposit fields, standard application requirements and policy sections. Preserve inactive draft values without applying them to the selected payment mode. Show inline errors and linked summary; save/continue and save/exit update the real local state.
- [ ] Add sample venue selection or explicitly recorded existing arrangement, access interval, separate rental balance and agreement prerequisites. Use the prepared map; edit booth facts and eligible pair links only within its physical geometry. **Use sample layout** must not open or imply arbitrary layout import.
- [ ] Implement packet items with inline example previews, current/supplied/reviewed versions and venue-recorded applicability. The venue can request a specific required change; organizer revision creates a new arrangement version and invalidates the affected review. Required missing/unreviewed items prevent agreement. Pricing/description-only changes do not invalidate an unrelated arrangement.
- [ ] Implement role-restricted demo agreement and publication commands. Publication rechecks all field, timetable, pair, packet, version and prerequisite conditions at command execution. It does not create applications, booth holds or receipts. Derive readiness from current state rather than a stale checkbox.
- [ ] Add the event conversation and meeting fields/states specified in the master. Guard recipient actions, counterproposal acceptance and either-party cancellation. Fixed initial sample text/times may be editable within local-only forms. An optional pending/declined/canceled meeting never substitutes for or cancels venue agreement.
- [ ] Render merchant preview through the same public view model used by the event route. Exclude packet content, rental balances, venue-organizer conversation and internal review notes.
- [ ] Unit-test missing/reviewed/revised packet gates, valid and invalid timetable, optional image, deposit/full conditional fields, required terms, current agreement, wrong-role actions and meeting state transitions. The complete browser case below anchors the publication scenario; add the missing-item and optional-meeting variants.

```ts
import { expect, test } from '@playwright/test';
import { loadScene } from './helpers';

test('current packet review gates agreement and publication', async ({ page }) => {
  await loadScene(page, 'event-setup', 'organizer');
  await page.goto('/organizer/events/makers-market-2026/setup?step=preview');
  await expect(page.getByRole('button', { name: 'Publish event', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Demo controls', exact: true }).click();
  await page.getByLabel('Demo role', { exact: true }).selectOption('venue');
  await page.getByRole('button', { name: 'Close demo controls', exact: true }).click();
  await page.goto('/venue/events/makers-market-2026/review');
  await expect(page.getByRole('button', { name: 'Agree to arrangement', exact: true })).toBeDisabled();
  await page.getByRole('checkbox', { name: 'I reviewed the current required packet', exact: true }).check();
  await page.getByRole('button', { name: 'Agree to arrangement', exact: true }).click();
  await expect(page.getByTestId('venue-agreement-status')).toHaveText('Agreed');
});
```

- [ ] Run `npm run test -- tests/unit/publication.test.ts tests/unit/coordination.test.ts`, then build and `npm run test:e2e -- tests/e2e/organizer.spec.ts`. Expected: current version required, drafting preserved, correct upcoming/open/closed view, no public private-content leakage, and no implicit meeting approval. Extend the case to return to organizer and publish the agreed complete event.

## T07 — Complete venue inquiry, quotation, rental hold, and confirmation

**Files — create:** `src/domain/venue-booking.ts`, `src/features/venues/inquiry-form.tsx`, `booking-detail.tsx`, `venue-workspace.tsx`, `quote-form.tsx`, customer booking and venue Requests routes, `tests/unit/venue-booking.test.ts`, `tests/e2e/venue.spec.ts`. **Modify:** catalog/details, commands/transitions/selectors and fixtures.

**Requirements:** R12, R15–R16, R25–R29, R34. **Dependencies:** T05 and shared guards; retain separate event arrangement from T06. Read the venue specification.

- [ ] Wire filters/details to a draft inquiry with contact, purpose, guests, event/access times, package and requirements. Missing/invalid entries keep state. Sending records inquiry/reference; no hold. Requests from a second customer may use the same interval.
- [ ] Build venue Requests and Calendar modes over the same bookings. Render the full access interval and explicit held/confirmed labels. A simple accessible interval/date list is sufficient for the initial calendar; it must show conflicts without implying external calendar sync.
- [ ] Implement itemized quote preparation, versioning, initial requirement, balance/due date, sample recipient/instructions, cancellation terms and venue-defined expiry. Sending quote and hold is one guarded action. Reject overlapping held/confirmed access intervals for the same venue resource without leaving a partial quote/hold.
- [ ] Customer acceptance captures the exact quote and original deadline. Add simulated proof/reference entry and venue receipt verification. Pending timely proof retains the hold after expiry; insufficient/unmatched evidence cannot confirm. Use shared receipt accounting rules with an explicit venue agreement ID, not the merchant payment record.
- [ ] Provide contextual information requests/replies, unpaid decline and quote expiry. Revisions show previous quotes and require fresh acceptance/availability. Accepted arrangements remain immutable; requested material changes are shown as proposals needing agreement. Full relocation/dispute machinery is outside v1.
- [ ] Use Alex's sample timeline and price exactly. Confirmed detail must show access 09:00–19:00, celebration 10:00–18:00, PHP 10,000 verified initial and PHP 10,000 balance, matching the venue workspace. The organizer rental remains a separate record and event agreement remains a separate decision.
- [ ] Test inquiry/no hold, overlapping inquiry allowed, overlapping quote rejected, touching intervals allowed, original deadline after acceptance, timely proof protection, late receipt no reclaim, revision snapshots, partial receipt and duplicate verification. Run unit and browser cases for scenes A and B.

```ts
import { expect, test } from '@playwright/test';
import { loadScene } from './helpers';

test('acceptance and proof do not confirm a venue booking', async ({ page }) => {
  await loadScene(page, 'venue-quote', 'customer');
  await page.goto('/bookings/alex-celebration');
  await page.getByRole('checkbox', { name: 'I accept this quote and its terms', exact: true }).check();
  await page.getByRole('button', { name: 'Accept quote', exact: true }).click();
  await expect(page.getByTestId('booking-status')).toHaveText('Payment due');
  await page.getByLabel('Payment reference', { exact: true }).fill('DEMO-ALEX-10000');
  await page.getByLabel('Amount paid (PHP)', { exact: true }).fill('10000');
  await page.getByRole('button', { name: 'Submit sample payment', exact: true }).click();
  await expect(page.getByTestId('booking-status')).toHaveText('Payment under review');
});
```

- [ ] Run `npm run test -- tests/unit/venue-booking.test.ts`, then build and `npm run test:e2e -- tests/e2e/venue.spec.ts`. Expected: both roles agree on state/balance; confirmation requires venue verification; scene B cannot create another hold. Inspect mobile inquiry and quote/payment detail in the browser before moving on.

## T08 — Complete merchant application and preference recovery

**Files — create:** `src/domain/applications.ts`, `src/features/applications/merchant-form.tsx`, `application-detail.tsx`, public event/apply/application routes, `tests/unit/applications.test.ts`, `tests/e2e/merchant.spec.ts`. **Modify:** booth components, public event, models/transitions/scenes.

**Requirements:** R04–R07, R16, R24, R30–R32, R38. **Dependencies:** T05–T06. Read merchant specification.

- [ ] Public event shows eligibility, dates, deadline/expected decisions, booth facts and prices, payment mode, policy and organizer contact. Apply is present only when open; existing application remains reachable when closed. Public availability contains no competitor identities.
- [ ] Implement three form steps with React Hook Form/Zod: business/products/contact and equipment needs; consistent-quantity ranked booth choices; full review/terms. Sample images/attachments are existing illustrative content, with no real upload action.
- [ ] Keep reusable profile and submitted application snapshot distinct. Draft/back/refresh preserves entered values. Before closing, explicit resubmission creates a new submitted version/history; after closing, only requested correction on the existing record is allowed.
- [ ] Choices permit one booth or an explicit eligible adjacent pair, up to three ranked alternatives, no duplicate choice or mixed quantity. Up/down controls provide accessible ranking; drag is optional. Recheck current availability on submit; preserve invalidated choice details and valid alternatives for replacement.
- [ ] Application submission is idempotent by business/event edition and does not create allocation/payment. Use **Applying does not reserve a booth. No booth payment is due now.** Show received time/reference and link to the same application.
- [ ] Preserve Paper and Clay as the eighth application, including when submission is repeated or the confirmation page is revisited. A new route or refreshed form must not create a ninth sample merchant. If no suitable choice remains, preserve draft and explain next action; no implicit after-deadline waitlist entry.
- [ ] Test invalid cross-walkway pair, duplicate/mixed choices, unavailable first preference, profile snapshot, late corrections, double-submit and reload. Add browser coverage for a complete unassisted form flow, map/list parity and same-record outcome.
- [ ] Run `npm run test -- tests/unit/applications.test.ts tests/components/booth-choice.test.tsx`, build and `npm run test:e2e -- tests/e2e/merchant.spec.ts`. Expected: scene E/F setup data is consistent, no hold/payment on submit, all entered information survives recoverable errors.

## T09 — Complete organizer review and atomic booth offers

**Files — create:** `src/domain/offers.ts`, `src/features/applications/offer-editor.tsx`, organizer application route, `tests/unit/offers.test.ts`. **Modify:** organizer-review, application-detail, shared commands/transitions/selectors and merchant browser tests.

**Requirements:** R02, R05–R10, R16–R17, R32–R34, R38. **Dependencies:** T08.

- [ ] Wire list filters and detail/map selection; clicking a booth includes applicants requesting it within a pair. Render factual products/needs/choices, private organizer notes, shortlist and clarification. No scoring, quotas or first-come selection.
- [ ] Before close, permit internal review/clarification only. Both the offer button explanation and the command guard prevent sending. After close, **Approve and offer booth** opens exact offer preparation.
- [ ] Prepare one valid complete choice or explicit proposed substitute. Show price, quantity, initial required amount, balance date, recipient, policy version and 48-hour expiry before sending. Validate availability, requirements, one active offer and schedule again on command execution; pair failure changes no allocation.
- [ ] Send Brew Corner booth 23 in the competition scene. Paper's 23+24 becomes unavailable, booth 24 remains free, and other preference 30+31 remains visible. Offer 30+31 to Paper without a new application. Iced Sip receives no automatic decision.
- [ ] Implement manual waitlist/decline and unpaid offer decline/withdrawal with history. A substitute can be one booth only through a clearly labeled quantity/price revision requiring merchant acceptance. Questions do not alter expiry. Replacement releases/rechecks the old/new choice as one transition; if it fails, retain the valid prior state.
- [ ] Unit-test all conflict/role/timing failures, application survival, pair atomicity, two organizers' sequential stale commands in the local store, and no double-offer/partial allocation. Local stale-command tests are not proof of database concurrency safety.
- [ ] Extend browser tests to execute the competition from review scene, change roles without resetting it, and inspect both merchants' outcomes. Expected: Paper remains application `paper-and-clay`, Brew holds 23, Paper holds 30+31, and no duplicate or automatic waitlist allocation exists.
- [ ] Run `npm run test -- tests/unit/offers.test.ts` and the merchant E2E suite after a fresh build. Record R02 and R09 evidence explicitly because these are core product constraints.

## T10 — Complete offer response, payment review, expiry, and balances

**Files — create:** `src/domain/payments.ts`, `src/features/payments/payment-panel.tsx`, `tests/unit/payments.test.ts`, `tests/e2e/timing.spec.ts`. **Modify:** offers, venue-booking, application-detail, organizer-review, selectors and scenes.

**Requirements:** R09–R16, R34. **Dependencies:** T07–T09.

- [ ] Merchant accepts the exact offer and terms. Show sample organizer payment instructions only in the correct offer state. Acceptance preserves original expiry and does not confirm. Partial/single substitute terms are explicit; no merchant action silently accepts another booth.
- [ ] Payment panel records a fictional reference, amount and submitted time. Organizer/venue verification is a separate receiving-party action with actual verified amount and decision. Payment status and sums use the correct agreement. No real bank/wallet detail or provider is required.
- [ ] Timely unresolved proof protects the complete held allocation. At expiry, show review overdue/follow-up without releasing. No proof and no other unresolved payment state permits expiration and whole-pair release. Extension records new expiry/reason and checks payment/readiness feasibility.
- [ ] Distinguish incomplete/unclear proof from verified insufficient money. Keep resolution explicit; no verified booking until the required initial total is reached and allocation/acceptance are valid. Reference collision surfaces review, not a second credit. Repeated command or verification remains idempotent.
- [ ] A late proof after expired/reallocated space becomes a payment-resolution record without recreating the allocation. A staff resolution must check current inventory; it cannot displace an existing hold/confirmation. For unresolved paid/proof withdrawals route to staff decision rather than ordinary unpaid decline.
- [ ] Show deposit confirmation with remaining balance; full-payment scene requires PHP 4,000 and ends at zero. Confirming merchant payment must not change organizer's PHP 10,000 venue balance. Remaining-balance receipt verification updates collectible balance without duplicating allocation. Show overdue and the sample follow-up state without automatic cancellation.
- [ ] Write unit cases for accepted/unaccepted offers, sufficient/insufficient verified totals, repeated command/reference, wrong recipient, timely proof past expiry, late proof after allocation and explicit extension. Use the independent expiry/proof/full scenarios from T12.

```ts
import { expect, test } from '@playwright/test';
import { advanceTime, loadScene } from './helpers';

test('timely proof protects a pair after offer expiry', async ({ page }) => {
  await loadScene(page, 'merchant-proof-review', 'merchant');
  await advanceTime(page, '2026-11-09T18:00');
  await page.goto('/applications/paper-and-clay');
  await expect(page.getByTestId('application-status')).toHaveText('Payment under review');
  await expect(page.getByTestId('allocation-summary')).toContainText('30 + 31');
  await expect(page.getByTestId('allocation-state')).toHaveText('Held');
});

test('unpaid pair expires together and application remains', async ({ page }) => {
  await loadScene(page, 'merchant-offer', 'merchant');
  await advanceTime(page, '2026-11-08T18:00');
  await page.goto('/applications/paper-and-clay');
  await expect(page.getByTestId('application-status')).toHaveText('Offer expired');
  await expect(page.getByTestId('allocation-state')).toHaveText('Released');
  await expect(page.getByTestId('application-reference')).toContainText('paper-and-clay');
});
```

- [ ] Run `npm run test -- tests/unit/offers.test.ts tests/unit/payments.test.ts tests/unit/venue-booking.test.ts`, build and run `tests/e2e/timing.spec.ts` plus the merchant/venue journeys affected by shared payment changes. Expected: all three agreements remain separate and no payment animation causes a state transition by itself.

## T11 — Complete cancellation/refund records and the organizer roster

**Files — create:** `src/domain/cancellation.ts`, `src/features/payments/cancellation-panel.tsx`, `roster.tsx`, roster route, `tests/unit/cancellation.test.ts`, `tests/e2e/cancellation.spec.ts`. **Modify:** booking/application detail, selectors/payment transitions and fixtures.

**Requirements:** R17–R18, R29, R34–R35. **Dependencies:** T10.

- [ ] Show accepted policy snapshot in the cancellation panel. Customer/merchant requests do not release space; venue/organizer staff respectively records the actual decision and reason. Reject using another agreement's policy or refund record.
- [ ] Implement the required Paper scene: verified PHP 2,000 deposit; cancellation requested 9 November; organizer confirmation releases both 30+31 and stops collection of that sample booking's future PHP 2,000 balance; refund PHP 2,000 due. Keep the original quote/receipts/policy/history intact.
- [ ] Record refund installments separately as manual fictional entries linked to the agreement. Derive due/partially recorded/completed state; a cancellation is not refund completion. Reject negative, duplicate or above-due refund entries. Show clearly that the platform does not send money.
- [ ] Support the equivalent bounded customer/venue cancellation request/decision and history under the separate sample venue policy. Do not introduce a generalized rules engine or infer arbitrary refunds from free text. Outside the explicit sample scenario, require staff-entered decision/amount based on the accepted policy and show it for review.
- [ ] Build roster from confirmed active allocations only, with business, booth(s), requirements, verified/remaining amounts and setup instructions. Show canceled records in a separate history/filter if needed; omit them from active roster counts. A private print view contains the same relevant data and no presenter controls.
- [ ] Test request vs confirmed cancellation, atomic pair release, unchanged venue rental, stopped canceled balance, partial/completed refund, duplicate/over-refund rejection and roster consistency.

```ts
import { expect, test } from '@playwright/test';
import { loadScene } from './helpers';

test('cancellation does not claim a completed refund', async ({ page }) => {
  await loadScene(page, 'merchant-cancellation', 'organizer');
  await page.goto('/organizer/events/makers-market-2026/applications?application=paper-and-clay');
  await page.getByRole('button', { name: 'Confirm cancellation', exact: true }).click();
  await expect(page.getByTestId('allocation-state')).toHaveText('Released');
  await expect(page.getByTestId('refund-status')).toHaveText('Refund due');
  await expect(page.getByTestId('collectible-balance')).toHaveText('PHP 0.00');
  await page.getByLabel('Refund reference', { exact: true }).fill('DEMO-REFUND-PAPER');
  await page.getByLabel('Refund amount (PHP)', { exact: true }).fill('2000');
  await page.getByRole('button', { name: 'Record sample refund', exact: true }).click();
  await expect(page.getByTestId('refund-status')).toHaveText('Refund recorded');
});
```

- [ ] Run unit/browser cancellation checks after building. Inspect the roster at phone and desktop widths and browser print preview. Expected: identical allocations/balances, explicit refund evidence, no future collection for the canceled sample booking.

## T12 — Connect the complete presenter experience and named scenes

**Files — modify:** `src/app/page.tsx`, demo provider/presenter/scenes, route shells, all feature navigation. **Create:** `src/app/error.tsx`, `not-found.tsx`, `tests/e2e/presenter.spec.ts`.

**Requirements:** R01, R36–R39, R45–R46. **Dependencies:** T06–T11.

Build these consistent presets. Scene variants are reset points over the same data model; they must not implement a separate scripted fake UI. The presenter can also reach outcomes through real local transitions. Preserve full history where a scene starts mid-journey, so receipt/terms/hold state agree.

| Scene ID / entry | Initial fictional state | Required master scene |
| --- | --- | --- |
| `venue-inquiry` / venue details | Alex draft, no quote/hold; 19 October 09:00 | A |
| `venue-quote` / customer booking | Active sample quote/hold, no acceptance/proof; 19 October 10:30 | A |
| `venue-conflict` / venue Requests | Alex hold plus second overlapping inquiry, second has no hold | B |
| `event-setup` / organizer setup | Complete draft/sample packet supplied, venue review pending; 19 October | C,D |
| `event-revision` / venue review | Required power clarification, changed current version, old agreement invalid | C,D |
| `merchant-entry` / event/apply | Published agreed event; Paper draft and seven submitted; 1 November 10:00 | E,F |
| `merchant-review` / organizer applications | Eight submitted, no holds; 6 November 18:00 | E |
| `merchant-before-close` / organizer applications | Eight submitted, no holds; 5 November 17:00 | F |
| `merchant-offer` / Paper application | Brew holds 23; Paper holds 30+31; no payment; expiry 8 November 18:00 | E,G |
| `merchant-proof-review` / Paper application | Accepted pair, PHP 2,000 timely proof at 8 November 17:00, unverified | G,H |
| `merchant-full-payment` / Paper application | Full-mode PHP 4,000 pair offer, no receipt; test partial then sufficient proof | H |
| `merchant-waitlist` / organizer review | No currently suitable free pair; Paper waitlisted, no hold/payment; other allocations have valid owners/history | I |
| `merchant-cancellation` / organizer review | Deposit-verified Paper pair, request on 9 November under accepted sample policy, no refund yet | J |

- [ ] Implement three journey entry cards with concise outcome/context, current sample identity and routes. Product navigation and back actions must stay coherent when entering via a deep link.
- [ ] Validate all scene factory states with the same invariant checks used for transitions. Do not create owners with nonexistent IDs, orphan receipts, simultaneously free/held booths, or a paid booking lacking accepted terms just to display an exception.
- [ ] Test browser refresh, step navigation, role switch, scene reset, forward-only clock advance, invalid/missing IDs, recoverable save failure and return to the same application/booking. Only explicit scene/reset can clear local work; show a warning if that would discard edited demo state.
- [ ] Keep role-specific selectors in every route, including direct URL access. Venue review sees no merchant selection; one merchant cannot browse another's detail through the product UI; public views contain no packets/notes. Display a demo role mismatch route message or correct simulated identity route, not false authentication.
- [ ] Test three complete journeys without scene jumping within each main flow. Then test A–J reset points independently. Confirm no real payment, email, calendar, upload, authentication or AI endpoint is called. Developer fixtures do not constitute a real user-data store.
- [ ] Run `npm run test -- tests/unit/fixtures.test.ts tests/unit/persistence.test.ts`, build and `npm run test:e2e -- tests/e2e/presenter.spec.ts`. Expected: reproducible full walkthrough and restored local state. Add scene IDs to README with entry roles and main actions.

## T13 — Verify full behavior, UI quality, and the master comparison

**Files — create/modify:** `tests/e2e/accessibility.spec.ts`, all affected test files, `docs/implementation-evidence.md`, `docs/evidence/`, `README.md`, `PROJECT_MASTER.md` result/evidence cells only.

**Requirements:** R01, R39, R41–R47. **Dependencies:** T12.

- [ ] Run the commands below from the project root in order, inspecting every exit code/output. A failing test is not an accepted limitation if it covers a required scene. Fix the relevant implementation and repeat affected checks; after the final changes, run the final suite once against the resulting build.

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

- [ ] Playwright should use the built app via the configured web server. Add a desktop Firefox or WebKit smoke run when the local supported browser is available; document browser gaps without implying they passed. Tests using inaccessible browsers may be marked unavailable with reason, but critical Chromium flows must still run.
- [ ] Create axe checks for venue discovery, inquiry, setup, public event/map, merchant form/detail and organizer review. Add manual keyboard/focus, accessible error/confirmation announcements and reduced-motion checks. Automated scan success is not WCAG conformance on its own.

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { loadScene } from './helpers';

test('merchant application exposes a usable accessible form', async ({ page }) => {
  await loadScene(page, 'merchant-entry', 'merchant');
  await page.goto('/events/makers-market-2026/apply');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

- [ ] Inspect critical screens at 320/360/390/768/1024/1440 CSS pixels, increased text size, long names, no results, invalid inputs, held/expired choices, pending proof and cancellation. Check horizontal clipping, tap targets, visible labels, contrast, menu/dialog focus return and list/map parity. Screenshots must be visually inspected, not only generated.
- [ ] Measure load/layout behavior using an available browser performance tool against the built app. Record device/emulation/network conditions, LCP/CLS readings and interaction observations; no invented INP percentile or production claim. Compare against the brief's targets, optimize oversized images/fonts/runtime, and state what field measurement remains unavailable.
- [ ] Inspect network/console errors across all journeys. No broken images, hydration warnings or hidden real external actions. Check fallback content if imagery/fonts fail. Avoid adding tests for static color values; use rendered review and targeted automated behavior checks.
- [ ] Update every R row in the master with its actual result and a link/reference into `docs/implementation-evidence.md`. Each Verified locally row needs relevant code/test/browser evidence; rows needing user feedback stay distinct. Do not change requirements to fit a shortcut or count local verification as user acceptance.
- [ ] Produce final comparison in the evidence file: requirement count by result, scenes A–J results, important deviations, remaining limitations, current environment, and exact reproduction instructions. All required local R rows must be verified or explicitly reported unresolved; unresolved required behavior means the demo is incomplete.
- [ ] README must explain install/start, supported Node, test commands, demo-only persistence, sample identity/clock/scenes, reset/recovery, no real transactions/communications and which Supabase/Vercel stages have actually happened. Keep implementation details out of normal product UI except the small demo context needed to avoid confusion.

## T14 — Document Supabase and Vercel readiness without silently expanding v1

**File — create:** `docs/connected-demo-readiness.md`. **Modify:** README, implementation evidence and master R48 result/evidence cell.

**Requirement:** R48. **Dependencies:** domain contracts and finished local workflows. This task produces a concrete later-stage design, not a live connection or cloud mutation.

- [ ] Document the mapping below from local records to a future dedicated Supabase environment. Record why client-side presenter role or arbitrary JWT user metadata cannot authorize access. No keys, project IDs or environment values are invented.

| Future persisted area | Required enforcement before connected claims |
| --- | --- |
| Users, organizations and memberships | Actual actor and venue/organizer/business relationships; role membership not self-editable |
| Venues/resources/booking quotes | Quote versions and exclusive held/confirmed access intervals; conflicting bookings rejected transactionally |
| Events/arrangement versions/packet items | Current-version agreement, participant-only packet access, correct ownership and publication checks |
| Booths/pair links/applications/preferences | Unique business/event submission, explicit pair geometry, correct merchant access and organizer review |
| Offers/allocation groups | Single active offer/application, exclusive booth claims, atomic pair reserve/confirm/release, race tests with two sessions |
| Receipts/cancellations/refunds | Agreement-specific payer/recipient, immutable accepted terms, idempotent review/amount recording, staff-only verification |
| Messages/meeting proposals | Context membership checks; optional external delivery remains a separate feature |
| Storage, if later enabled | Private buckets and policies, file access tests and actual upload scope; no public private documents |

- [ ] Specify server transaction boundaries for offer+pair allocation, receipt verification+confirmation, quote+interval hold, cancellation+release, and expiry checking unresolved timely proof. Require two-session conflict tests, transaction rollback on half-pair failure, and unauthorized cross-organization read/write tests. Local reducer tests do not replace them.
- [ ] Specify the minimal data adapter surface: load role-appropriate view, submit typed command with idempotency key/expected revision, refresh resulting state. Reuse UI and shared validation where appropriate, but enforce authoritative rules and permissions server-side. Do not publish the entire local fixture snapshot as a public database row.
- [ ] Before any future implementation, read current Supabase skill/changelog and docs, inspect selected project/Data API exposure, RLS and table privileges, choose actual supported SDK/runtime versions and generate migrations through the current tool workflow. Review server functions/views and private files, then run permission and concurrency checks before exposing private records. This document is not a complete SQL migration or authorization to apply one.
- [ ] Specify Vercel preview steps for a later publishing request: identify target/project, supported runtime, build command and branch/revision; determine whether preview uses local fictional state or connected demo; configure only required variables; keep secrets server-side; deploy to preview; test the actual URL and all relevant routes/refresh flows; record deployed revision/environment/known limits. Preserve explicit no-index/demo labels. Production/domain rollout is separate.
- [ ] Note remaining operating inputs: venue document examples, actual policies/payment instructions, staffing/review commitments, pricing/commercial validation and pilot scope. Do not turn them into blockers for the local demo.
- [ ] Mark R48 Verified locally only for the reviewed readiness document and accurate environment boundary. State **Supabase not connected / Vercel not deployed** unless later authorized work has actually completed and been verified.
- [ ] Refresh the final master comparison and evidence totals after recording R48, then deliver the T13 run instructions, verification results and remaining limitations. Do not leave the final report counting the readiness document as unfinished when it has been completed, or count cloud work as completed because this document exists.

## 5. Self-review and completion checklist

- [ ] Every R01–R48 maps to a task and final evidence entry; every required scene A–J is exercised.
- [ ] No invented user approval, pricing policy, project credentials, actual venue verification, or completed deployment claim.
- [ ] Pair rules, deadline boundaries, proof protection, versioning and agreement-specific money are consistent across model, command, selector, UI and tests.
- [ ] Test helpers, routes, IDs and accessible labels match the implementation. If useful wording changes, update assertions intentionally without changing business meaning.
- [ ] No disabled demo control is left standing in for a required action at completion.
- [ ] Existing planning files and unrelated work are preserved; no automatic commit, push, purchase, outreach or publication.
- [ ] Final response names what works, how it was tested, local run instructions, master comparison, any unresolved R IDs and later cloud/pilot stages. Do not report entire scope complete if required checks fail.

## 6. Documentation checked for the plan

Current official guidance was checked during planning; verify compatible versions again when executing. The engineering structure, labels and test contracts above are project design choices. Command/config examples are starting instructions for the selected toolchain, not evidence that dependencies were installed or checks run in the planning chat.

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation): manual initialization and App Router setup.
- [Next.js Vitest guidance](https://nextjs.org/docs/app/guides/testing/vitest): component/unit harness; use browser tests for full routes and asynchronous server behavior.
- [Next.js Playwright guidance](https://nextjs.org/docs/app/guides/testing/playwright): exercise the built application and browser journeys.
- [Supabase changelog](https://supabase.com/changelog): recheck runtime/SDK/Data API changes before later integration; current notes include Node 22+ client support and changed table exposure defaults.
- [UI/UX brief](../../uiux-and-technology-brief.md): source links for shadcn/ui, Radix, Tailwind, Motion, fonts, assets, accessibility and performance criteria.

Plan status at creation: **written for handoff; no application code or dependencies created, no tests executed, no Supabase/Vercel project configured.**
