# Davao event platform — demo scope v1

Date: 20 September 2026. Status: Scope baseline locked for demo planning in response to the user's request to map the screens, detail venue booking, and define the complete demo boundary. This is a planning deliverable, not a built application, implementation authorization, or evidence of customer validation.

Handoff update, 20 September 2026: [Project master](../PROJECT_MASTER.md) consolidates the decisions and acceptance comparison; the [implementation plan](superpowers/plans/2026-09-20-demo-v1-implementation.md) and [next-chat prompt](../IMPLEMENTATION_PROMPT.md) are now written. Application implementation has not started. This scope remains the source for v1 inclusion/exclusion.

## Purpose

Show potential venue owners, organizers, venue customers, and merchants how both platform areas work: discovering/booking venues and organizing merchant participation at an event. Each audience can follow its own journey, while a presenter can show the handoffs across roles.

Keep the first demo to three complete journeys with fictional data and a bounded set of exception states. Prefer a clear, connected experience to adding more independent modules. The walkthrough's 10–15-minute presentation allowance is not a development estimate.

## UI/UX and technology direction

The user requires React and selected Supabase and Vercel as the backend/hosting direction. The [UI/UX and technology brief](uiux-and-technology-brief.md) proposes React with Next.js and TypeScript, customized shared components, a coherent visual identity, purposeful animation, and explicit mobile/accessibility/performance criteria for Davao users. Libraries and reference websites support that product design; they do not determine its appearance by default.

The first UI review can use the fictional local fixtures, followed by a scoped Supabase connection and a Vercel preview at the appropriate implementation/deployment stage. Selecting these platforms does not activate real payments, public document upload, messages, or production operations. No service has been configured or deployed through this planning update.

## Planning sources and precedence

| Document | What it defines |
| --- | --- |
| This scope | Version 1 inclusion, exclusion, selected sample defaults, scenarios, and acceptance boundary |
| [Screen map](demo-screen-outline.md) | Screen families, merchant/organizer spatial sketches, navigation, and role handoffs |
| [Venue booking](venue-marketplace-booking-spec.md) | Customer inquiry, venue quotation/hold, direct payment, and confirmation |
| [Organizer setup](organizer-event-setup-spec.md) | Five setup steps, venue agreement, supporting packet, optional coordination, publication |
| [Merchant application and selection](merchant-application-and-selection-spec.md) | Apply once, preferences, organizer decisions, offers, payment review, confirmation |
| [Walkthrough](demo-walkthrough.md) | Shared fictional records and presentation sequence |
| [Validation plan](validation-and-demo-plan.md) | Research questions, evidence boundaries, and commercial assumptions |
| [UI/UX and technology brief](uiux-and-technology-brief.md) | React/Supabase/Vercel direction, library choices, visual system, motion, local usability, and quality criteria |

Explicit user decisions take precedence. For version 1 boundaries, this file resolves broader or optional ideas in earlier planning documents. Adding an out-of-scope feature requires an explicit scope revision; it is not implied by an example or a deferred research question. Venue-document specifics remain deferred as requested. The user-approved business rules remain distinct from the demo defaults chosen below.

## Three complete journeys

| Journey | Main flow | Completion visible to the prospect |
| --- | --- | --- |
| Book a venue | Browse → venue details → inquiry → venue quote and temporary hold → customer accepts and submits payment → venue verifies | Customer and venue see the same confirmed rental, access interval, receipt, and remaining balance |
| Prepare an organizer event | Draft → venue/map/rules and required packet → optional discussion → explicit venue agreement → application/payment/policy settings → publish | Event page displays the agreed map and merchant terms; publication never creates merchant bookings |
| Apply and allocate merchant space | Event → business information → one-booth or adjacent-pair preferences → submit once → organizer compares after deadline → exact offer → merchant accepts and pays → organizer verifies | Merchant sees confirmed booth(s); organizer roster and inventory agree; balances are clear |

Organizers choose merchants. Venue approval covers the event arrangement, map, and operating rules. Meetings, messages, and file submission do not substitute for agreement to the current version. The organizer pays the venue; accepted merchants pay the organizer. A private venue customer pays the venue in the separate booking journey.

## Included screen families

Use the nine families already established in the screen outline. Nested steps, detail panels, and status variants are not separate dashboards.

1. Venue discovery/details, with the booking inquiry form.
2. Customer booking detail, reused from inquiry through confirmation and follow-up.
3. Venue Requests/Calendar workspace, with quotation and receipt review on the selected booking.
4. Organizer event setup, with five steps and a scoped venue-review view.
5. Public event page, with map and equivalent booth list.
6. Merchant application, with three saved steps.
7. Merchant application/booking detail, including questions, offers, payment, and outcomes.
8. Organizer application workspace, with linked list/map, offer panel, and receipt review.
9. Organizer roster, with confirmed participants, booth(s), requirements, balances, and a simple print view.

A simple demo entry offers the three journeys. Presenter controls select a role, load/reset a named sample scene, and advance the fictional clock. These controls are visibly separate from the product experience. Role switching does not demonstrate authentication or authorization.

## Included interactions

- Browse three sample venues and carry venue/date choices into one inquiry. Preserve draft information and show a received state.
- Venue staff prepare the sample quote with explicit terms, create a timed hold, record a sample receipt, and confirm after verifying the required amount. The calendar and customer record share the result.
- Prepare a sample event using the five setup steps. Support basic editable event/application dates and payment/policy fields, a prepared 12-booth map, editable booth facts and eligible adjacent relationships, and a merchant-facing preview. Validate the rules needed for the listed sample cases; no free-form map drawing.
- Review a supplied sample information packet, record a version-specific venue agreement, request a change, and require review of the revision. Keep drafting available while agreement is pending.
- Provide an event-specific sample conversation and optional online/in-person meeting proposal with accept, suggest another time, decline, and cancel states. These are local simulations; actual files, messages, appointments, and call links are not created.
- Reuse a sample merchant profile, enter event-specific information, select one booth or two adjacent booths, rank up to three alternatives, review terms, and submit once. Allow profile/draft corrections without restarting when a preference is unavailable.
- Organizer filters applicants by status/category/space needs, checks operational requirements and competing preferences, asks for clarification, shortlists internally, sends a concrete offer after closing, waitlists, or declines. Human choice remains final.
- Show one active offer per application, exclusive holds, both booths in a pair handled together, the 48-hour default with explicit organizer extension, merchant acceptance, sample proof/reference submission, and organizer verification.
- Show deposit and full-payment variants; confirmed-with-balance and fully-paid outcomes; a cancellation request, organizer-recorded cancellation, and separately recorded refund progress under sample terms.

The demo should preserve state during a walkthrough and recover a saved sample draft within its supported local demo session. Cross-device synchronization and production durability are not promised. Ordinary navigation must not silently reset a scenario; only the visible presenter reset does so.

## Selected demo fixtures and defaults

These choices make the demo concrete. They are not validated pricing, real policies, platform-wide limits, or assertions of separate user approval for every detail.

| Item | Version 1 value |
| --- | --- |
| Listings | Sample Garden, Sample Hall, Sample Pavilion; fictional content only |
| Private booking | Alex at Sample Hall; celebration 7 November 2026, 10:00–18:00; held access 09:00–19:00 |
| Private rental money | PHP 20,000 total; PHP 10,000 initial payment; PHP 10,000 balance due 5 November, 18:00 |
| Venue quote/hold | Issued 19 October, 10:00; expires 20 October, 10:00; fictional 24-hour hold set by the venue, not the merchant 48-hour rule |
| Private rental cancellation copy | Illustrative: customer withdrawal by 1 November, 18:00 receives all rental fees paid back; later customer withdrawal receives no refund of fees paid; venue cancellation receives a full refund. Date or material arrangement changes require customer agreement. This is sample copy only, to be replaced with actual venue terms before any live use. |
| Organizer rental | Separate Sample Market Team agreement at Sample Hall, access 13 November, 14:00 through 15 November, 22:00; PHP 20,000 total, PHP 10,000 sample deposit and PHP 10,000 balance |
| Merchant event | Sample Davao Makers Market, 14–15 November 2026 |
| Booths | Exactly 12: 21–26 in row A, 27–32 in row B; walkway separates the rows |
| Pair eligibility | Ten neighboring pairs within rows; 26 + 27 is invalid |
| Booth facts and price | Sample 2 × 2 m; PHP 2,000 per booth; power at 23, 24, 30, 31; location/power differences make choices meaningful |
| Application unit | One per merchant business/event edition; maximum three ranked choices for this demo; pair choices are alternatives, not extra bookings |
| Applicants | Eight named in the walkthrough; Paper and Clay starts as a draft beside seven submitted records, then becomes the eighth submitted record |
| Sample deadline | Applications close 5 November, 18:00; first offers 6 November, 18:00; expiry 8 November, 18:00 |
| Pair payment | PHP 4,000 total; deposit scene requires PHP 2,000 with PHP 2,000 balance due 11 November, 18:00; full-payment scene requires PHP 4,000 |
| Merchant cancellation copy | Use the existing wireframe's clearly labeled example: withdrawal by 10 November, 18:00 receives booth fees paid back; later withdrawal receives no refund; organizer cancellation receives a full refund; date/venue changes require a response to the revised arrangement. The sample late-balance follow-up is 24 hours. These are illustrative organizer terms, not platform policy. |
| Time and currency | Asia/Manila; PHP; explicit dates/times. The presenter advances sample time; wall-clock time does not mutate a demonstration unexpectedly. |

The venue-rental cancellation copy and merchant cancellation copy belong to different agreements. A refund on one does not resolve the other. Requirements lists, a 50% deposit, the three-choice limit, sample dimensions/power limits, and 24-hour follow-up targets are examples or demo defaults, not universal business rules.

## Required scenes and acceptance checklist

Each criterion below is a requirement for the later demo, not a passed test today. The normal journeys and exception scenes use the same underlying sample records; each exception can be loaded/reset independently.

| Scene | Pass condition |
| --- | --- |
| A. Venue inquiry to confirmation | Inquiry creates no hold; staff quote creates one hold over the complete access interval; acceptance and proof alone do not confirm; required receipt verification confirms on both sides with the same balance |
| B. Venue timing conflict | A second inquiry may exist for the held interval, but cannot create another exclusive hold or confirmation; staff can propose another time |
| C. Organizer event publication | Missing current venue agreement blocks publication while drafting continues; supplied packet is distinguished from reviewed; a revision resets required review; explicit agreement enables publication of a complete event |
| D. Optional communication | Sample message and meeting proposal/acceptance are visible to the intended two roles; neither approves the event nor exposes the private packet/conversation to merchants |
| E. Merchant competition and backup | Brew Corner receives booth 23 after closing; Paper and Clay's 23 + 24 preference becomes unavailable without holding 24; organizer offers 30 + 31; the same application continues to payment review and pair confirmation |
| F. Invalid or premature action | 26 + 27 is rejected with preserved form data; an offer before applications close is unavailable; profile changes cannot silently replace a submitted application or accepted offer |
| G. Timing and unresolved payment | An unpaid merchant offer expires and releases the pair together; an explicit extension updates both sides; timely submitted proof remains held during overdue staff review; a late receipt does not reclaim already allocated booths |
| H. Payment modes | Deposit verification confirms with a balance; full-payment verification confirms without a balance; a partial receipt in full-payment mode remains incomplete |
| I. No suitable space | Organizer can waitlist without a promised queue position; unavailable preferences do not erase or duplicate the application; a one-booth substitute is an explicit offer requiring merchant acceptance |
| J. Cancellation and refund | Confirmed merchant requests cancellation; request alone leaves inventory intact; organizer records cancellation, releases the pair, and tracks the sample refund separately; no automatic completed-refund claim |

For scene J, use an independent example where Paper and Clay's PHP 2,000 deposit was verified and the merchant requests cancellation on 9 November, before the illustrative 10 November deadline. The organizer confirms cancellation, stops collection of the canceled booking's future booth balance under this sample scenario, and records PHP 2,000 refund due. A later explicit simulated refund entry can mark completion. The separate venue rental stays unchanged.

Across all scenes: preserve accepted prices/terms/versions, keep merchant and venue payments separate, show one clear next action, retain understandable history, support map/list parity and narrow screens, and avoid conflicting state across roles. The print view is private organizer information, not a public merchant list with contact details.

## Explicitly outside version 1

- AI assistance, scoring, matching, auto-selection, or generated operating decisions.
- Real accounts, identity verification, access enforcement, multi-user synchronization, or production availability guarantees.
- Real payments, custody, payouts, refunds, bank/wallet integrations, tax/accounting systems, or platform subscription checkout.
- Real email/SMS/chat delivery, external calendar synchronization, video calls, document upload/storage, or document authenticity checks.
- Arbitrary floor-plan import, automatic booth recognition, wall drawing, 3D views, or a general map editor.
- Multiple rooms/resources booked together, recurring venue reservations, per-day merchant booth splitting, or booth quantities above two.
- Auctions, bidding, category quotas, automatic waitlist allocation, reviews/ratings, attendee ticketing, native mobile apps, CRM, or analytics dashboards.
- Public deployment, real venue onboarding, real prospect outreach, or collecting customer information as part of building the sample demo.

Broader map changes after accepted bookings, accounting-grade reconciliation, and complex cancellation disputes stay as documented future operating cases; version 1 only demonstrates the bounded states listed above. They are not silently solved by the wireframe.

## Validation deferred without blocking this plan

Collect the exact document checklist from a venue later, as requested. Also validate actual payment methods, quoted hold durations, review/response targets, refund wording, detailed prices, physical booth constraints, and willingness to use/pay. User-approved rules describe intended product behavior; interviews, a working demo, and a live pilot supply different evidence.

Prospect sessions should ask users to explain what is reserved, who acts next, who receives payment, and what to do when a preferred booth is taken. Record assisted and unassisted completion separately. The [validation plan](validation-and-demo-plan.md) already contains the research questions and evidence criteria; no outreach has been sent.

## Current deliverable and next stage

Planning now includes the three journey definitions, merchant/organizer screen layouts, venue/customer screen map, the existing clickable organizer setup wireframe, selected demo fixtures, and this bounded scope. Only organizer setup currently has a clickable planning wireframe; the other maps are documents, not implemented views.

The requested screen mapping, venue-booking definition, and version 1 scope are documented. The React/Supabase/Vercel direction and UI/UX requirement are recorded in the design brief. The user subsequently requested a master reference, a task-by-task implementation plan, and a prompt for another chat; these are linked above. The next stage is executing that plan in the implementation chat, starting with the local fictional demo. No code scaffold, application build, real transaction, publication, or deployment has occurred through this planning work.
