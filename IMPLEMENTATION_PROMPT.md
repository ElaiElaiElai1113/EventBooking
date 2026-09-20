# Implementation prompt for the next chat

Copy the text inside the block below into a new chat opened in the **EventBooking** workspace. The master and plan files must be available in that chat. This file prepares the request; no new chat has been created or implementation started here.

```text
Implement the Davao Event Platform local demo using the planning documents in this workspace:
C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking

Start by reading these files:
1. C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking/PROJECT_MASTER.md
2. C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking/docs/superpowers/plans/2026-09-20-demo-v1-implementation.md
3. C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking/docs/demo-v1-scope.md
4. C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking/docs/uiux-and-technology-brief.md
5. C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking/docs/demo-screen-outline.md
6. C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking/docs/demo-walkthrough.md

Before implementing each journey, read its detailed specification:
- docs/venue-marketplace-booking-spec.md
- docs/organizer-event-setup-spec.md
- docs/merchant-application-and-selection-spec.md

The master consolidates our decisions and contains acceptance requirements R01–R48. Follow that baseline and the implementation plan. The planning discussion is complete enough to build the local demo. Do not restart discovery or ask me to reconfirm settled rules, sample prices, the temporary brand, or deferred venue-document requirements. Resolve ordinary engineering and visual details within the brief, recording material choices. Ask only if a new ambiguity materially affects a confirmed rule, an irreversible action, or a required input with no safe local alternative.

Build all three connected journeys:
1. Customer finds a venue, sends an inquiry, receives a venue quote/hold, accepts, submits a sample payment reference, and sees confirmation only after venue verification.
2. Organizer prepares an event; venue reviews the current layout, rules and sample packet; optional messages/meetings support discussion; explicit current-version agreement enables publication of a complete event.
3. Merchant submits one application with ranked booth alternatives; organizer reviews after closing, sends an exact offer, merchant accepts and submits sample payment, organizer verifies, and both sides see matching allocations and balances.

Preserve the business rules:
- Organizers alone select merchants. Venues approve the arrangement/map/rules, not individual merchants.
- One booth or two physically eligible adjacent booths only. A pair is held, confirmed and released together. Never infer adjacency from consecutive numbers. The sample pair 26+27 is invalid.
- One application per merchant business/event edition; up to three ranked choices is a demo default. Losing a preferred booth must preserve the same application and other choices.
- Applying and shortlisting reserve nothing and require no booth payment. Initial offers begin after applications close.
- One active offer per application; one exclusive hold per booth. Default merchant offer window is 48 hours to accept and submit the required initial payment, with explicit organizer extensions. Acceptance does not restart the clock.
- Organizer pays venue; merchant pays organizer; private venue customer pays venue. The receiving business verifies receipt. Keep those agreements and balances separate.
- Deposit plus balance or full payment follows the event's disclosed terms. Proof is not verification. Protect holds during unresolved timely proof review. Partial, duplicate, unclear or late receipts cannot falsely confirm or reclaim another allocation.
- Preserve submitted/accepted versions of applications, quotes, prices, policies and venue arrangements. Changes never silently rewrite accepted commitments.
- Cancellation request, staff decision, inventory release and refund records are separate. Use the documented sample policy cases and keep them labeled illustrative.
- No product AI.

Use React with the plan's Next.js App Router/TypeScript approach. Use a coherent Tailwind token system, customized shadcn/ui components, React Hook Form/Zod, Motion and Lucide where appropriate. Supabase and Vercel are the selected later backend/hosting direction. Build the complete local fictional demo first, so credentials do not block progress. T14 documents the later connection/deployment work; it does not authorize live cloud changes.

The UI must feel deliberately designed for venue customers, organizers, owners and merchants in Davao City. Follow the warm photography-led marketplace and practical workspace direction in the brief, with consistent typography, spacing, components and useful motion. Use clear PHP amounts, Philippine dates/times, suitable location details and mobile-friendly map/list views. Use appropriate licensed assets and record their sources. Label illustrative venue imagery; do not invent real venues, partner endorsements, reviews, verification badges or local demographic claims. Use Davao Event Platform as a temporary name.

Work through the plan's tasks T01–T14. Inspect existing files and applicable AGENTS instructions first; preserve existing documents and any newer code. This was a documentation-only, non-Git workspace at handoff, so recheck it before initialization. Do not overwrite the folder with a generator. Read the relevant available skills, including executing-plans, frontend-design, and verification guidance; read Supabase guidance before any later Supabase work. Use current official documentation for package/API compatibility and retain the dependency lockfile.

First establish and browser-check the three representative styled screens: venue discovery/details, merchant booth selection, and organizer application review. Fix usability or visual issues before extending those patterns. Then connect every required interaction and complete all nine screen families and scenes A–J. Do not stop at static screens, a landing page, another plan, or a partially wired walkthrough.

Keep a single shared local state model, versioned browser persistence, deterministic sample clock and clearly labeled presenter controls. Preserve drafts on navigation/refresh and show accurate saved/failed status. The same transitions must drive merchant, organizer, customer and venue views; presenter scene changes must not bypass business guards during normal actions. Only explicit reset/load should discard a scene. Role switching is a simulation, not authentication or security.

Use the master fixtures exactly where specified: three fictional venues, 12 booths, ten eligible pairs, eight merchants and separate private/organizer rental dates. Paper and Clay starts as a draft beside seven submitted applications, becoming the eighth when submitted. Demonstrate Brew Corner holding 23 while Paper and Clay is offered backup pair 30+31 through the same application. Keep the venue's sample 24-hour quote hold distinct from the merchant's 48-hour rule.

Run meaningful domain tests for allocation, timing, versions, payments and cancellation; run browser checks for all required journeys and exceptions. Check mobile/desktop layouts, keyboard/focus, errors, reduced motion, map/list parity, private-view presentation boundaries and performance. Record actual results and inspect screenshots. A passing build is not complete workflow verification.

Create/update docs/implementation-evidence.md as you work. Update the result/evidence columns for R01–R48 in PROJECT_MASTER.md, preserving the original requirement text. Log any agreed scope change separately. Distinguish implemented, verified locally, user accepted, connected and deployed. Never mark unavailable or failing checks as passed.

This request authorizes local application implementation, dependency installation, local tests and browser verification. It does not authorize creating/linking/mutating a Supabase cloud project, publishing to Vercel, making purchases, using real customer data, sending external messages, handling real money, or initializing/committing/pushing a Git repository. Keep those later stages documented. If I subsequently explicitly request them, follow that new authorization without asking for the same permission again.

Continue autonomously within this scope, provide concise progress updates, and resolve failures before claiming completion. At the end provide the local run instructions, implemented journeys, verification results, master requirement comparison, links to evidence, and any remaining gaps. If any required local behavior is incomplete, identify the affected R IDs and do not claim the demo is complete.

Begin by checking the workspace and reading the files, then start T01. Keep product-planning discussion in the original chat; use this chat for implementation and its necessary decisions.
```

For a different machine, transfer the entire project folder (including `docs/`) and update the workspace paths in the prompt. The original Downloads/Temp attachments are background references; their required product decisions are consolidated in the master and detailed specs.
