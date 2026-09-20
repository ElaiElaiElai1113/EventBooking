# Davao Event Platform

A fictional, browser-local event demo with three connected journeys: venue inquiry → venue-verified booking; organizer setup → venue agreement → publication; merchant application → exact booth offer → organizer-verified confirmation.

**Live demo: [eventbooking-pi.vercel.app](https://eventbooking-pi.vercel.app).** Hosted on Vercel; Supabase is not connected. No real accounts, money, messages, calendar invitations, uploads or customer data. Presenter roles simulate perspectives; they are not authentication or security. Source repository: [EventBooking on GitHub](https://github.com/ElaiElaiElai1113/EventBooking).

## Run locally

Use Node 22.22+ within Node 22.x (verified locally with **Node 22.23.2**, npm 11.3.0) and the included `package-lock.json`. Vercel uses Node 22.x.

```powershell
cd C:\Users\Admin\Desktop\Projects\Portfolio\EventBooking
npm ci
npm run dev
```

Open [the local demo](http://127.0.0.1:3000). For a production build:

```powershell
npm run build
npm start
```

No `.env` file or provider credentials are required. Image and font assets are local. Use a different port with the direct CLI if another app uses 3000:

```powershell
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100
```

## Present the journeys

The **Journey progress** panel shows the current stage, who acts next and any applicable deadline. Use **Continue as venue reviewer/customer/organizer/merchant** when offered to switch perspective on the same record without resetting the scene. Detailed actions still run through the existing review, acceptance and receipt controls.

Venue pages now include a setting photo, two labeled layout concepts, quote guidance and an anonymous monthly availability calendar. Select a day to inspect held/confirmed access intervals, including setup and cleanup. “Available” means no recorded hold in this fictional demo, not guaranteed availability; choosing a day does not reserve it or change an inquiry. On mobile, use **Change step** to navigate event setup; drafts persist between steps.

Start on the home page and choose a journey. Starting a journey or loading a scene explicitly confirms replacing the current fictional scene. Ordinary links, form changes and refresh preserve local work. “Continue current scene” returns to your last product route.

The small **Demo controls** button switches role/fictional identity, loads named scenes, advances the deterministic Philippine sample clock, retries a failed save or resets. Advancing time changes the sample state; real wall-clock time does not expire offers. Merchant default is Paper and Clay; organizer is Sample Market Team; venue default is Sample Hall; customer is Alex.

| Walkthrough | Scene presets |
| --- | --- |
| A — Inquiry, quote, acceptance, payment review and confirmation | Find and inquire; Review venue quote |
| B — Conflicting whole-venue access | Conflicting venue request |
| C/D — Setup, packet review, current agreement and optional coordination | Prepare event; Revised arrangement |
| E/F — One application, alternatives and invalid/premature actions | Apply as a merchant; Review eight applications; Before applications close |
| E/G — Backup pair, timing, extension and review protection | Backup pair offered; Timely proof under review |
| H — Full payment and partial receipt | Full-payment offer |
| I — Waitlist and explicit single-booth substitute | No suitable pair |
| J — Cancellation decision and separate refund record | Cancellation and refund |

In the merchant entry scene Paper and Clay is a draft beside seven submitted applications. Submit it to make eight. After closing, offer Brew Corner booth 23 and Paper and Clay backup pair 30+31. Applying/shortlisting reserves nothing; a two-booth allocation is always handled together. Booths 26+27 are not adjacent. Merchant offers use 48 hours; sample venue quotes use 24 hours. Acceptance/proof alone never confirms. Switch to the receiving business to verify the fictional receipt.

Venue and merchant agreements, recipients, receipts and balances remain separate. Use contextual conversations for proposed changes after acceptance; accepted snapshots are never silently rewritten. The demo has one fixed market edition and a small set of fictional inquiry records, not a generalized event/database administration tool.

## Local persistence and recovery

Data lives under `eventbooking.demo.v1` in this browser origin's localStorage. Another port, browser/profile or machine has separate state. It is not multi-user synchronization; do not run simultaneous tabs expecting transactional consistency. Submitted and accepted snapshots are kept separately from editable drafts. Raw incomplete form fields are saved even before a form can advance.

The footer reports **Saved in this browser** or **Not saved**. Storage failures keep current in-memory edits, but cannot guarantee recovery after closing/refreshing; free space and use Retry save. Corrupt/incompatible saved data is not overwritten automatically: the recovery screen requires explicit reset. Scene load/reset discards the previous local scene. Use only fictional data.

## Verify

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium firefox
npm run test:e2e
```

Playwright starts the production build on `127.0.0.1:3100`, with desktop and Pixel 5 Chromium projects. Keep that port free for the final suite. `DEMO_DEV_CHECK=1` is an optional development-only reuse switch; do not set it for production acceptance. Tests reset their own browser-local scenes and do not access external services.

To run browser checks against the hosted fictional demo without starting a local server:

```powershell
$env:DEMO_BASE_URL='https://eventbooking-pi.vercel.app'
npm run test:e2e
Remove-Item Env:DEMO_BASE_URL
```

For the extended visual/performance checks, start the built server in one terminal:

```powershell
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100
```

Then run `node scripts/final-visual-check.mjs` in another terminal. It writes screenshots at six widths, enlarged-text/print/fallback evidence, local LCP/CLS samples and a Firefox inquiry smoke result. Inspect the screenshots as well as the JSON. A local lab result is not field performance or independent user acceptance.

## Evidence and architecture

- [Implementation evidence and all R01–R48 mappings](docs/implementation-evidence.md)
- [Vercel deployment and hosted verification](docs/vercel-deployment.md)
- [Demo improvements and browser verification](docs/demo-improvements.md)
- [Playful design and verification](docs/playful-design.md)
- [Master requirements](PROJECT_MASTER.md) — original requirement text retained
- [Connected-demo readiness](docs/connected-demo-readiness.md) — future Supabase security/transactions and Vercel preview gates
- [Asset register](docs/asset-register.md)
- [Walkthrough and exact fictional fixtures](docs/demo-walkthrough.md)

`src/domain` contains typed commands, pure transition guards, inventory/time/money rules and selectors. `src/demo` supplies deterministic fixtures/presets and validated versioned persistence. `src/features` composes role-specific UI from the same state and commands. Tests cover domain rules, component keyboard/pair behavior and complete browser journeys. `src/app` is the Next App Router shell; read this installed Next version's docs before changing framework integration, as directed by `AGENTS.md`.

Local evidence, hosted behavior, connected authorization/concurrency and user validation are separate stages. Real policies, staff review commitments, venue documents and commercial assumptions remain to be validated for a later pilot.
# EventBooking
