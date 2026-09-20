# Davao event platform — master reference and acceptance baseline

Baseline: **v1.0, 20 September 2026**. Working name: **Davao Event Platform**; final brand is undecided. Workspace: `C:/Users/Admin/Desktop/Projects/Portfolio/EventBooking`.

This is the consolidated reference for the product discussions, selected demo scope, design direction, and later validation. Use it to compare the implemented result against the plan. It summarizes decisions and incorporates the linked detailed specifications; it is not a verbatim chat transcript. The implementation status below starts at **Not started**. A planning wireframe exists, but no React application, backend, or deployment exists at this baseline.

## Start here

1. Read this master for the product contract and acceptance IDs.
2. Execute the [implementation plan](docs/superpowers/plans/2026-09-20-demo-v1-implementation.md) in the next implementation chat.
3. Use the [handoff prompt](IMPLEMENTATION_PROMPT.md) to start that chat in this workspace.
4. Read the relevant detailed specification before building its journey. Preserve its field, error, and transition details.
5. Record actual implementation and evidence against the acceptance table. A checkbox, screenshot, or passing build alone does not establish the entire workflow.

## Authority, scope, and decision labels

The user's explicit instructions take precedence over these documents. This master consolidates the current v1 boundary from [demo scope v1](docs/demo-v1-scope.md). The scope resolves optional or broader ideas in older documents; the detailed specifications explain behavior within that boundary. The implementation plan supplies engineering choices, not permission to change business rules.

- **Confirmed:** decisions established in the conversation and recorded in the existing planning documents.
- **Demo default:** a concrete value or behavior selected to make v1 testable; not a validated universal policy.
- **Design/engineering choice:** recommended implementation details, including the visual treatment. Record consequential changes with reasons.
- **Deferred:** research or later product work that does not block the local demo.

On 20 September the user requested this master, the implementation plan, and a prompt for another chat. This authorizes these planning artifacts. Sending the handoff prompt in the next chat requests the local implementation described there. It does not request cloud mutation, publishing, purchases, real outreach, or production operation.

## Product purpose and audience

The platform has two connected areas:

1. **Venue marketplace:** people find suitable venues, inquire, receive venue quotations, and understand booking confirmation.
2. **Venue and organizer tools:** venues coordinate event arrangements with organizers; organizers publish events, review merchant applications, allocate booths, and track direct payments.

The demo must explain the experience to venue owners/staff, organizers, venue-booking customers, and merchants. A person may perform more than one role; separate accounts per role are not a product requirement. Public attendee ticketing is outside v1.

The team has organizer connections that may introduce venue owners. Visiting venues is another possible research channel. Connections are not signed partnerships, verified listings, confirmed customers, or demand evidence.

## Confirmed product decisions

| ID | Decision |
| --- | --- |
| D01 | Cover the venue marketplace and venue/organizer tools in the same platform. |
| D02 | Organizer and venue agree on event use, the merchant map, access, and operating rules. |
| D03 | Venue review can happen online when the required information/documents are supplied. Messages and meetings support discussion when needed; meetings are optional. |
| D04 | The organizer has the final say on merchant selection. The venue does not approve individual merchants. |
| D05 | Merchants may request one booth or two adjacent booths only. Organizer discretion must respect adjacency. |
| D06 | An adjacent pair is offered, held, confirmed, or released together. A different eligible pair can be proposed; reducing the request to one booth requires merchant acceptance. |
| D07 | Initial booth offers start after applications close. Organizers may inspect, shortlist internally, and ask questions earlier. |
| D08 | A merchant offer defaults to 48 hours to accept and submit the required initial payment. The organizer may explicitly extend it. |
| D09 | Organizers pay venues; accepted merchants pay organizers. The receiving business verifies receipt; the platform records the result. |
| D10 | The organizer chooses deposit plus later balance or full payment per event, and discloses the terms before application and in the offer. |
| D11 | The organizer sets merchant cancellation/refund terms per event. Preserve the accepted version; cancellation and refund progress are separate. |
| D12 | Merchants may compete for the same booth. Expressing interest is not a booking. |
| D13 | Demonstrate all prospective user groups' journeys, then validate with them. |
| D14 | No product AI for this demo. |
| D15 | Use React; Supabase and Vercel are the backend/hosting direction. Prioritize deliberate, polished UI/UX appropriate for Davao users. |

## Responsibilities and visibility

| Role | Can act on | Cannot infer or do |
| --- | --- | --- |
| Venue customer | Own inquiry, quote acceptance, sample payment reference, booking questions and cancellation request | Treat an inquiry as reserved space; verify their own payment |
| Venue staff | Venue requests, quotes, rental holds and receipts; event arrangement review | Select merchants or see unrelated merchant applications/organizer notes |
| Organizer | Event draft, venue coordination, applications, factual comparison, offers, merchant receipts, roster, cancellation/refund records | Override adjacency or silently accept a substitute for a merchant |
| Merchant | Own application, alternatives, offer response, payment references, questions and cancellation request | See competitors' proposals/contact details; approve own receipt; reserve by applying |
| Presenter | Change simulated role, scene, and fictional time; explicitly reset the demonstration | Claim that role switching is authentication, security, or a real external action |

Public event pages show merchant-relevant rules, prices, and availability. Venue packets, internal conversations, rental balances, private merchant details, and organizer notes do not appear there. The local demo enforces presentation boundaries; all data is fictional and browser-local, so this is not a security guarantee.

## Journey 1 — find and book a venue

**Find venue → details → inquiry → venue quote and temporary hold → customer accepts → sample payment reference → venue verifies → confirmed booking with any balance.**

- Show three fictional venues and simple area/guest-count filters. Preserve filters and requested date when navigating.
- Details show suitability, illustrative capacity, price guidance, inclusions, restrictions, location/access, and clearly labeled imagery. Browsing does not require registration.
- Inquiry captures contact, event purpose, guest count, event times, setup/cleanup access, package, and needs. Incomplete entries remain a recoverable draft. Sending creates a reference and awaiting-response state, with **no hold and no payment**.
- Venue staff can request information, propose another time, decline, or draft a quote. One workspace has Requests and Calendar views with the selected booking in context.
- Sending the quote checks the complete access interval, including setup/cleanup, and creates an exclusive temporary hold. Inquiries may overlap; exclusive holds and confirmed rentals may not overlap for the same resource. V1 treats each venue as one whole-venue resource.
- A quote includes version, access interval, inclusions/itemized total, required initial amount, balance/due date, recipient/instructions, terms, and hold deadline. V1 uses a venue-set **24-hour sample hold**; the merchant 48-hour rule does not apply to venue rental.
- Acceptance preserves the quote version and does not restart the deadline. Timely proof holds the space during unresolved review. Only venue verification of the required amount and valid allocation confirms it.
- Declining an unpaid quote or expiry without unresolved timely proof releases that hold. A late receipt requires review and cannot reclaim someone else's allocation. Partial/unmatched proof never creates confirmation.
- Retain quote history and contextual sample questions. A revised quote requires acceptance and availability checking. Accepted arrangements cannot be silently rewritten.
- Cancellation request, staff decision, inventory release, and refund recording have separate states. Use the bounded sample cancellation/terms behavior; production disputes and accounting are deferred.

Detailed source: [venue booking specification](docs/venue-marketplace-booking-spec.md).

## Journey 2 — prepare an organizer event

Use five setup steps, with save/exit and return:

1. **Event details:** identity/contact, merchant-facing description, event dates, setup/cleanup, optional cover.
2. **Venue and layout:** listed venue or explicitly recorded existing arrangement, rental obligations, access/rules, prepared map, booth facts, eligible pairs, supporting packet, review and optional coordination.
3. **Applications:** opening/closing, expected initial decisions, permitted products, standard information requirements, contact, and explanatory selection rules.
4. **Payments and policies:** event-level deposit/full mode, sample direct-payment instructions, balance date when relevant, and merchant withdrawal/organizer change/missed-balance terms.
5. **Preview and publish:** public-facing preview and linked correction list; publish only when requirements are satisfied.

Creating a draft requires an event name. Incomplete setup and pending venue review do not prevent further drafting. Publication requires complete fields, unique valid booths, at least one available booth, valid pairs, feasible dates/payment windows, and the current venue agreement including its recorded prerequisites. Do not invent a requirement that every venue rental must be fully paid before publication.

The map uses prepared, numbered booths and an equivalent list. Booth size, price, inclusions, power, restrictions, availability, and physically eligible neighboring pairs are explicit records. Consecutive numbering does not establish adjacency. Booth facts and allowed pair links are editable; arbitrary floor-plan import/drawing is outside v1.

The sample venue packet has event brief, layout/equipment information, and venue terms. Each item has an owner, required/optional applicability, version, supplied/reviewed/changes-needed state, and inline sample preview. Structured data can satisfy a requirement. A supplied item is not automatically reviewed. Only venue review of the current required packet enables explicit agreement.

Changing agreed access, dates, layout, dimensions, pair links, or venue rules creates a new review version. Prior agreement cannot authorize the changed version. Merchant pricing/description alone does not reset venue agreement unless it changes that agreement. Preserve accepted terms independently.

One event conversation supports sample questions and meeting proposals: agenda, time/duration, participants, online/in-person details. The recipient accepts, suggests another time, or declines; either side may cancel. Rescheduling needs acceptance again. Messages, meeting acceptance, and meeting outcomes do not themselves approve the event. Optional pending meetings do not block otherwise complete agreement.

Publishing creates neither merchant holds nor payment records. A published event may have applications upcoming, open, or closed.

Detailed source: [organizer setup specification](docs/organizer-event-setup-spec.md). The [saved planning wireframe](docs/reference/organizer-setup-wireframe.html) illustrates behavior and has fixed sample fields; it is not the production layout or a complete validation engine.

## Journey 3 — merchant application, selection, and payment

**Event and terms → reusable business information → ranked preferences → submit once → organizer reviews after close → exact offer → merchant accepts and pays → organizer verifies → confirmed booth(s).**

### Application and choices

- Three steps: business/event needs; one booth or adjacent-pair preferences; review and submit.
- Use one application per business/event edition with up to **three ranked choices for the demo**. Each choice has the same quantity as the request. Alternatives are backups, not additional bookings.
- Reuse business information; capture event-specific products/photos/operating needs. Photos are supplied examples, not live uploads. Keep an application submission snapshot so subsequent profile edits do not silently change it.
- Before close, allow deliberate application revisions with history. After close, organizer-requested corrections use the same application. Do not reopen general applications or overwrite an active offer.
- Submission creates no hold and requests no payment. Repeated submission cannot create another application for the same business/edition.
- If a preference becomes unavailable, retain business details and the other choices. Do not automatically reject, waitlist, relocate, or require a fresh proposal. Existing applicants can view their application after closing; new application entry is closed.

### Organizer review and exact offers

- A linked applicant list/detail/map supports status, category, quantity, and operational-needs filters. Selecting a booth reveals applicants who need it, including pairs.
- Factual product information, internal notes, shortlist, clarification, waitlist, and decline support human decisions. Shortlisting has no inventory effect. No scores, automatic category quotas, auction, guaranteed waitlist position, or automatic winner.
- Initial offer sending is unavailable until applications close. Recheck state when sending; UI disablement alone is insufficient.
- Only one active offer per application and one exclusive hold per booth. Validate both pair members, eligibility, suitability, availability, price, payment schedule, and deadline before creating either hold.
- An offer shows exact booth(s), total, required payment, balance/date, recipient, terms/version, and expiry. An alternative outside stated preferences remains an explicit suggestion requiring acceptance.
- Declining an unpaid offer releases it and retains the application. Waitlisting reserves nothing. Withdrawal after recorded proof/payment needs staff review; confirmed bookings use cancellation.
- Replacement offers recheck inventory and retain history. Pair-to-single substitution changes quantity/price explicitly and requires merchant acceptance. Never silently reduce or split a pair.

### Timing and direct payments

- The 48-hour merchant window covers acceptance and submission of the required initial payment. Acceptance, a question, or a request for another booth does not restart or extend it.
- An organizer extension is explicit, recorded, visible to both roles, and revalidated against balance and readiness dates. Late offers cannot silently shorten the agreed default to fit an impossible schedule.
- Timely proof remains pending verification and protects both booths while unresolved, including after expiry. Staff follow-up is shown; a proposed review target is not an automatic release trigger.
- Only the organizer verifies merchant receipt. A verified deposit confirms with a balance; full mode requires the full total. Unclear, partial, duplicate, unmatched, or late receipts require an explicit resolution and cannot falsely confirm or count twice.
- Merchant payments and organizer venue-rental payments have different agreement IDs, payers, recipients, and balances. No platform custody, payouts, provider charge, or money movement is implemented.

### Cancellation and refunds

Show the organizer's policy before application and again in the offer. Preserve the accepted version. A request alone keeps the allocation; staff-confirmed cancellation releases both booths together. Refund due/partial/completed/not-due is tracked separately and requires explicit recorded entries. Do not call a refund completed merely because a booking was canceled.

The required cancellation scene covers a timely withdrawal after a verified sample deposit, ending with a recorded full refund under the example terms. Later-balance collection stops for that canceled sample booking. Venue-rental obligations remain unchanged. Broad relocation, date-change disputes, and accounting-grade reconciliation remain future cases.

Detailed source: [merchant application and selection](docs/merchant-application-and-selection-spec.md).

## State vocabulary

| Record | Important states or dimensions |
| --- | --- |
| Event setup | Draft; awaiting venue agreement; changes requested; ready; published |
| Application window | Upcoming; open; closed, derived from simulated time |
| Packet item | Required/optional/not applicable; missing/supplied/reviewed/changes needed; current version |
| Application | Draft; submitted; clarification needed; waitlisted; declined; withdrawn; booking outcome shown from linked offer/allocation |
| Merchant offer | Active; accepted/payment due; payment under review; confirmed; declined; expired; withdrawn/replaced |
| Booth inventory | Accepting preferences/free; held; confirmed; unavailable |
| Venue inquiry/quote | Received; clarification; active quote/hold; accepted/payment due; payment under review; confirmed; declined/expired |
| Payment | Submitted; needs resolution; verified/rejected; duplicate or unmatched review; balance/overdue derived separately |
| Cancellation | Requested; declined or confirmed; separate refund amount/status |
| Meeting | Proposed; accepted; counterproposal awaiting acceptance; declined; canceled |

These are different records, not a single status field copied everywhere. Derive the customer-facing summary and next action consistently from the underlying state.

## Screens and navigation

| Family | Required content |
| --- | --- |
| 1. Venue discovery/details | Search/filter results, suitability, imagery, details, inquiry form |
| 2. Customer booking detail | Quote, acceptance, payment, confirmation, history and follow-up |
| 3. Venue workspace | Requests/Calendar, booking panel, quote/receipt actions |
| 4. Organizer setup | Five steps and scoped venue packet review/coordination |
| 5. Public event | Terms, application timing, map and equivalent booth list |
| 6. Merchant application | Three saved steps, ranked choices, submission |
| 7. Merchant application detail | Questions, offer, payment, outcome and cancellation |
| 8. Organizer review | Applicant list/detail/map, offer and receipt panels |
| 9. Organizer roster | Confirmed merchants, booths, needs, balances and private print view |

A separate presenter entry links the three journeys. Role, scene, time, and reset controls are labeled demo tools and do not clutter normal task navigation. Ordinary navigation never resets state. Deep links and refresh restore the supported local scene, with accurate storage-failure messaging.

Full layouts and screen labels: [screen outline](docs/demo-screen-outline.md).

## UI/UX and technology baseline

React is required. The implementation plan selects **Next.js App Router and TypeScript**, a Tailwind token system, customized shadcn/ui with consistent primitives, React Hook Form/Zod, Motion, and Lucide. Supabase and Vercel remain the selected connected backend and hosting direction. Use current compatible versions and retain the lockfile. Do not confuse product AI exclusion with use of development tools.

Proposed visual treatment: warm photography-led venue discovery, with practical organizer and venue workspaces. Shared hierarchy, typography, spacing, components, and behavior provide a deliberate identity. Public headings may use Fraunces; body/UI uses DM Sans. No stock dashboard skin, invented testimonials, partner logos, or claims of verified real venues.

| Token | Starting value |
| --- | --- |
| Page / surface | `#F7F6F1` / `#FFFFFF` |
| Main text and primary actions | `#23352B`, white text on filled actions |
| Secondary text | `#5B665E` |
| Restrained clay accent | `#A84C32` |
| Decorative divider / essential control boundary | `#D7DDD6` / `#7C877E` |
| Body / secondary text | 16px / 14px |
| Spacing | 4px base; common 8/12/16/24/32/48 steps |
| Corners | About 8px controls, 12px surfaces |

Calculated token contrast on the two light backgrounds: primary 12.01–13.00:1; secondary 5.53–5.99:1; accent 5.18–5.61:1; essential boundary 3.45–3.73:1. This verifies those color pairs only, not whole-interface accessibility.

Start with three representative views: venue discovery/details, merchant booth selection, organizer application review. Check them before propagating styling to other screens. Use one primary action in context, comprehensible empty/error/disabled/saved states, and progressive disclosure for secondary detail.

For Davao: show PHP totals, explicit Asia/Manila dates/times, useful area/address/landmark and venue-access information. Start with clear English. Validate interest in Cebuano/Bisaya or Filipino; no nonfunctional language toggle. Local language, device, connection, or aesthetic preferences are hypotheses until observed.

Motion supports state comprehension: immediate booth selection, short panel/step transitions, subtle preference reordering, clear verified outcomes. Use roughly 120–220ms where suitable, reduced-motion support, keyboard alternatives, and no artificial waiting. Do not add scroll hijacking, custom cursors, or continuous decorative animation.

Use licensed, appropriate content and keep an asset register. Stock photos must be labeled illustrative and must not masquerade as actual Davao properties. Owner-provided material can replace samples once supplied with permission. Mobbin/React Bits/Motion/shadcn are reference sources, not permission to copy any asset or add every dependency.

Quality targets: responsive widths 320/360/390/768/1024/1440, readable enlarged text, keyboard/focus and screen-reader checks, map/list parity, no color-only status, accessible errors, and reduced motion. Aim for 44px primary touch targets; target WCAG 2.2 AA. LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 are performance goals; lab readings are not field results. Source links and detailed criteria are in the [UI/UX brief](docs/uiux-and-technology-brief.md).

## Exact fictional fixtures

All dates below are **2026, Asia/Manila**. All prices, people, venue listings, booth dimensions, imagery, requirements, policies, and operating limits are fictional or illustrative. Use a fixed presenter clock, not the current date, to drive availability.

| Record | Baseline |
| --- | --- |
| Listings | Sample Garden, Sample Hall, Sample Pavilion |
| Private customer | Alex; 80-guest celebration at Sample Hall, 7 November 10:00–18:00; reserved access 09:00–19:00 |
| Private quote | Inquiry 19 October 09:00; quote 10:00; expires 20 October 10:00; accepted/proof 19 October 11:00; verification 12:00 |
| Private rental amounts | PHP 20,000 total; PHP 10,000 initial; PHP 10,000 balance due 5 November 18:00 |
| Organizer rental | Sample Market Team pays Sample Hall; separate access 13 November 14:00–15 November 22:00; PHP 20,000 total, PHP 10,000 sample deposit and PHP 10,000 balance |
| Event | Sample Davao Makers Market; 14 November 10:00–15 November 20:00 |
| Application timing | Opens 20 October 09:00; closes 5 November 18:00; first sample decisions/offers 6 November 18:00 |
| Merchant offer/payment timing | Offer expires 8 November 18:00; deposit-mode balance due 11 November 18:00; setup 13 November 14:00; cleanup 15 November 22:00 |
| Booth inventory | Exactly 12 numbered 21–32; row A 21–26 and row B 27–32 separated by a walkway |
| Eligible pairs | 21+22, 22+23, 23+24, 24+25, 25+26, 27+28, 28+29, 29+30, 30+31, 31+32; **26+27 invalid** |
| Booth facts | Example 2 × 2m, PHP 2,000 each; power at 23/24/30/31; revised power-limit example 500W |
| Pair payment | PHP 4,000; deposit example PHP 2,000 + PHP 2,000 balance; full-payment variant PHP 4,000 initial |
| Quantity/preferences | One booth or two eligible adjacent booths; one application/business/edition; max three ranked choices in v1 |

| Merchant | Category | Quantity and ordered preferences |
| --- | --- | --- |
| Brew Corner | Coffee, needs power | One: 23, 24 |
| Paper and Clay | Crafts | Two: 23+24, 30+31 |
| Sweet Tray | Pastries | One: 25, 26 |
| Green Goods | Plants | One: 21, 22 |
| Stitch Studio | Apparel | Two: 27+28, 28+29 |
| Iced Sip | Coffee, needs power | One: 30, 31 |
| Local Finds | Accessories | One: 28, 29 |
| Pantry Picks | Packaged food | One: 22, 21 |

Paper and Clay begins as a draft beside seven submitted applications. Submission produces eight submitted applications, not nine. In the review scene all eight are submitted and no booths are held initially.

Main competition: organizer offers 23 to Brew Corner; Paper and Clay's 23+24 becomes unavailable without holding 24. Organizer offers 30+31 to Paper and Clay. Iced Sip remains active without an automatic outcome. Paper and Clay accepts, submits PHP 2,000, and organizer verification confirms both booths with PHP 2,000 balance. Organizer rental balance stays separate.

### Illustrative policy content, never universal policy

- **Private venue quote:** customer withdrawal by 1 November 18:00 receives all rental fees paid back; later withdrawal receives no refund of fees paid; venue cancellation receives full refund. Material date/arrangement changes require customer agreement.
- **Merchant event:** withdrawal by 10 November 18:00 receives booth fees paid back; later withdrawal receives none; organizer cancellation receives full refund. Date/venue changes require an accept-or-withdraw response. The example missed-balance follow-up is 24 hours before an organizer decision; it is not automatic cancellation.
- **Cancellation scene:** after PHP 2,000 deposit verification, Paper and Clay requests cancellation on 9 November. Organizer confirms cancellation, releases 30+31, stops collecting the canceled booth balance, records PHP 2,000 refund due, then separately records the sample refund completion. Venue agreement is unchanged.

The 50% deposit, three choices, 24-hour venue hold, 24-hour review target/reminder/follow-up ideas, dimensions, and power limit are demo assumptions. Their differing purposes must remain clear. Use explicit example labels and keep amounts/dates configurable within validation rules.

## Required demonstration scenes

| Scene | Required comparison outcome |
| --- | --- |
| A — Venue booking | Inquiry no hold; quote holds full access; acceptance/proof alone not confirmed; venue verification confirms with matching balance. |
| B — Venue conflict | Second overlapping inquiry accepted, but no second exclusive hold; alternative time can be proposed. |
| C — Event publication | Missing current agreement blocks publish, not drafting; supplied vs reviewed visible; revision needs fresh review. |
| D — Coordination | Sample message/meeting transitions visible to participants; no implicit agreement or public packet exposure. |
| E — Competing preferences | Brew Corner 23; Paper and Clay backup 30+31; same application; atomic pair payment/confirmation. |
| F — Invalid/premature actions | 26+27 rejected with draft preserved; early offers blocked; accepted/submitted snapshots protected. |
| G — Offer timing | Unpaid expiry releases pair; explicit extension; unresolved timely proof stays held; late proof cannot reclaim allocation. |
| H — Payment modes | Deposit confirms with balance; full verified total confirms without balance; insufficient full-mode amount does not confirm. |
| I — No suitable booth | Manual waitlist, no queue guarantee; application survives; single-booth substitute requires explicit acceptance. |
| J — Cancellation/refund | Request alone no release; organizer confirmation releases pair; refund progresses separately with explicit sample record. |

Each exception is independently resettable. See [walkthrough](docs/demo-walkthrough.md) for presentation sequencing. Ten to fifteen minutes is a demonstration allowance, not a development estimate.

## Acceptance comparison ledger

Baseline evidence state: **all R01–R48 are Not started for the React demo**. Existing documents/wireframe do not count as completed application requirements. T-numbers refer to tasks in the implementation plan.

Keep each requirement's original meaning. Change only the result/evidence cells during implementation; substantive requirement changes need a dated entry in the change log with the user's instruction or rationale. Use results: Not started, In progress, Implemented/unverified, Verified locally, Failed, Blocked. Reserve User accepted for explicit feedback after verification. Record actual commands, browser cases, screenshot paths, and limitations in `docs/implementation-evidence.md` when it is created by T01.

| ID | Requirement and observable pass condition | Task(s) | Result | Evidence |
| --- | --- | --- | --- | --- |
| R01 | All three journeys and four audience roles reach their stated outcomes. | T07–T13 | Verified locally | [R01 evidence](docs/implementation-evidence.md#r01) |
| R02 | Organizer alone selects merchants; venue view has no selection controls. | T06,T09 | Verified locally | [R02 evidence](docs/implementation-evidence.md#r02) |
| R03 | Event uses current venue agreement; rental confirmation alone does not approve map. | T06 | Verified locally | [R03 evidence](docs/implementation-evidence.md#r03) |
| R04 | Only one booth or a physically eligible pair; reject 26+27. | T04,T08 | Verified locally | [R04 evidence](docs/implementation-evidence.md#r04) |
| R05 | Application/shortlist creates no hold, charge, or confirmation. | T08,T09 | Verified locally | [R05 evidence](docs/implementation-evidence.md#r05) |
| R06 | Up to three ranked alternatives in one request; unavailable choice preserves other data. | T08,T09 | Verified locally | [R06 evidence](docs/implementation-evidence.md#r06) |
| R07 | One application/business/edition; Paper submission changes seven to eight, never nine. | T03,T08 | Verified locally | [R07 evidence](docs/implementation-evidence.md#r07) |
| R08 | Initial offers blocked before close; inspect/clarify/shortlist still work. | T04,T09 | Verified locally | [R08 evidence](docs/implementation-evidence.md#r08) |
| R09 | One active offer/application; exclusive booth holds; pair actions all-or-nothing. | T04,T09,T10 | Verified locally | [R09 evidence](docs/implementation-evidence.md#r09) |
| R10 | 48-hour merchant deadline, explicit extensions and feasible schedule; acceptance does not restart time. | T04,T10 | Verified locally | [R10 evidence](docs/implementation-evidence.md#r10) |
| R11 | Only accepted offer plus sufficient verified receipt and valid allocation confirms. | T10 | Verified locally | [R11 evidence](docs/implementation-evidence.md#r11) |
| R12 | Correct payer/recipient and separate venue/customer/merchant balances. | T07,T10 | Verified locally | [R12 evidence](docs/implementation-evidence.md#r12) |
| R13 | Deposit/full modes disclosed before application and in offer; correct remaining amount. | T06,T10 | Verified locally | [R13 evidence](docs/implementation-evidence.md#r13) |
| R14 | Timely unresolved proof protects holds after expiry; staff follow-up is not auto-release. | T10 | Verified locally | [R14 evidence](docs/implementation-evidence.md#r14) |
| R15 | Partial, duplicate, unclear, unmatched or late receipts cannot falsely confirm or double-count. | T07,T10 | Verified locally | [R15 evidence](docs/implementation-evidence.md#r15) |
| R16 | Submitted applications, agreed arrangement and accepted quote/policy/price versions survive edits. | T06–T10 | Verified locally | [R16 evidence](docs/implementation-evidence.md#r16) |
| R17 | Waitlist/decline do not auto-select; unpaid offer decline preserves application; substitute needs acceptance. | T09–T11 | Verified locally | [R17 evidence](docs/implementation-evidence.md#r17) |
| R18 | Cancellation request, decision, pair release, stopped future sample balance and refund records remain distinct. | T11 | Verified locally | [R18 evidence](docs/implementation-evidence.md#r18) |
| R19 | Five editable setup steps save/return and permit drafting during review. | T06 | Verified locally | [R19 evidence](docs/implementation-evidence.md#r19) |
| R20 | Sample packet distinguishes supplied/current/reviewed/missing; only venue can agree. | T06 | Verified locally | [R20 evidence](docs/implementation-evidence.md#r20) |
| R21 | Material arrangement revision resets necessary review and blocks publication until agreed. | T06 | Verified locally | [R21 evidence](docs/implementation-evidence.md#r21) |
| R22 | Contextual messages and meeting accept/counter/decline/cancel work without implying approval. | T06 | Verified locally | [R22 evidence](docs/implementation-evidence.md#r22) |
| R23 | Publication validates identity, booths/pairs, packet/agreement, access, schedule, terms and payment feasibility. | T04,T06 | Verified locally | [R23 evidence](docs/implementation-evidence.md#r23) |
| R24 | Published event correctly shows upcoming/open/closed; publishing creates no offers/payments. | T06,T08 | Verified locally | [R24 evidence](docs/implementation-evidence.md#r24) |
| R25 | Three venue listings, functioning filters, details, clear illustrative content and price guidance. | T05,T07 | Verified locally | [R25 evidence](docs/implementation-evidence.md#r25) |
| R26 | Inquiry preserves date/filter/draft; received state clearly says no reservation. | T07 | Verified locally | [R26 evidence](docs/implementation-evidence.md#r26) |
| R27 | Quote holds complete access interval, separate 24-hour sample rule; overlap cannot double-hold. | T04,T07 | Verified locally | [R27 evidence](docs/implementation-evidence.md#r27) |
| R28 | Customer and venue agree on accepted quote, receipt status, confirmation and balance. | T07 | Verified locally | [R28 evidence](docs/implementation-evidence.md#r28) |
| R29 | Venue quote revision/cancellation retain history, agreement ownership and separate refund state. | T07,T11 | Verified locally | [R29 evidence](docs/implementation-evidence.md#r29) |
| R30 | Three-step merchant form preserves work across back, errors, save and refresh. | T08 | Verified locally | [R30 evidence](docs/implementation-evidence.md#r30) |
| R31 | Profile edits do not rewrite submission; deliberate corrections follow deadline/history rules. | T08 | Verified locally | [R31 evidence](docs/implementation-evidence.md#r31) |
| R32 | Map/list show identical inventory/selection; readable keyboard and touch pair selection. | T05,T08,T09 | Verified locally | [R32 evidence](docs/implementation-evidence.md#r32) |
| R33 | Organizer filters, booth-based comparison, private notes/shortlist and questions function. | T09 | Verified locally | [R33 evidence](docs/implementation-evidence.md#r33) |
| R34 | Detail pages show accurate status, responsible next actor, deadline and retained history. | T07–T11 | Verified locally | [R34 evidence](docs/implementation-evidence.md#r34) |
| R35 | Roster/print show only confirmed participants, allocations, needs and accurate balances. | T11 | Verified locally | [R35 evidence](docs/implementation-evidence.md#r35) |
| R36 | Fixed fixtures, 12 booths/ten pairs/eight applications, separate rentals and controllable sample clock. | T03,T04 | Verified locally | [R36 evidence](docs/implementation-evidence.md#r36) |
| R37 | Presenter scene/role/time/reset works; navigation/refresh preserves supported local state. | T03,T12 | Verified locally | [R37 evidence](docs/implementation-evidence.md#r37) |
| R38 | Private packet, rental balance, organizer notes and competitors absent from public/merchant views. | T06,T08,T09,T12 | Verified locally | [R38 evidence](docs/implementation-evidence.md#r38) |
| R39 | All nine screen families have usable navigation and relevant empty/error/disabled/success states. | T05–T13 | Verified locally | [R39 evidence](docs/implementation-evidence.md#r39) |
| R40 | React/Next.js/TypeScript, one token/component system and sensible limited libraries. | T01,T02 | Verified locally | [R40 evidence](docs/implementation-evidence.md#r40) |
| R41 | Three representative styled screens reviewed in browser before broad styling expansion. | T05 | Verified locally | [R41 evidence](docs/implementation-evidence.md#r41) |
| R42 | PHP/Philippine times, clear labels and useful location information; no invented local claims. | T02,T03,T05 | Verified locally | [R42 evidence](docs/implementation-evidence.md#r42) |
| R43 | Responsive widths, enlarged text, keyboard/focus, contrast, status labels and reduced motion checked. | T05,T13 | Verified locally | [R43 evidence](docs/implementation-evidence.md#r43) |
| R44 | Imagery licensed/labeled with fallbacks; useful motion and measured performance limits documented. | T02,T05,T13 | Verified locally | [R44 evidence](docs/implementation-evidence.md#r44) |
| R45 | No AI, real money, actual messages/uploads, live accounts or unsanctioned external actions in local v1. | T01–T13 | Verified locally | [R45 evidence](docs/implementation-evidence.md#r45) |
| R46 | Scenes A–J pass with evidence; no skipped critical case reported as passed. | T12,T13 | Verified locally | [R46 evidence](docs/implementation-evidence.md#r46) |
| R47 | Reproducible run/test instructions, measured results, known gaps and master comparison delivered. | T01,T13 | Verified locally | [R47 evidence](docs/implementation-evidence.md#r47) |
| R48 | Supabase/Vercel path documented; local/demo/connected/deployed/user-validated evidence kept distinct. | T14 | Verified locally | [R48 evidence](docs/implementation-evidence.md#r48) |

## Delivery stages and exclusions

**A — Local demo:** required output of the implementation handoff. Fictional fixtures, browser-local persistence, nine screen families, three complete journeys, scenes A–J, polished UI, targeted automated checks and manual browser review.

**B — Connected demo:** later scoped Supabase work. Dedicated environment, actual membership/access model, transactional inventory constraints, secure private data access, and receipt/version rules. It needs a scoped execution plan and environment selection before connection. Credentials do not block Stage A.

**C — Hosted preview:** later Vercel publishing request with target and environment clearly identified. A hosted fictional local demo can be shown before Stage B if explicitly requested and its local-only behavior is clear. Hosting alone does not provide shared state, security, or production readiness.

**D — Live pilot:** real onboarding, policies, operating ownership, security/concurrency/payment verification, support and commercial evidence. Requires its own scope.

Outside local v1: AI, accounts/identity verification/security claims, multi-user sync, real payments/custody/refunds/provider integration, real email/SMS/chat/calendar/video, live document uploads, generalized map editor/import/3D, multiple venue resources or recurring bookings, per-day booth splitting, quantities over two, auctions, quotas, automatic waitlist allocation, ratings/reviews, ticketing, native apps, CRM, analytics dashboards, public deployment, real venue onboarding and prospect outreach.

Do not purchase assets, subscribe to services, send messages to prospects, initialize/push a remote repository, or publish as part of this planning handoff. A later explicit user instruction can extend the action scope without repeating already answered approvals.

## Validation and commercial questions still open

Keep exact venue-document checklists deferred as the user requested. Also validate actual methods of payment, price structure, hold duration, staff review/response targets, power/booth/venue constraints, cancellation wording, language preference, use of existing tools, decision makers, willingness to pay and support expectations.

The original business-plan proposals of PHP 1,990 per venue-month and PHP 2,490 per market edition are **unvalidated proposals**, not demo charges or approved subscriptions. Forecasts, budgets, customer-count targets and milestones in the original business plan remain assumptions. The implementation plan does not convert them into commitments or development estimates.

Suggested discovery group: two organizers, two venue decision makers, two recent venue customers and four merchants with varied experience. These are proposed discovery targets, not representative sampling. Start with warm introductions; the team handles any outreach. Request redacted examples of a recent workflow.

Use 20–30 minutes per session as an allowance. Record role, prior demo exposure, task, assisted/unassisted completion, hesitations, critical misunderstandings, direct feedback, and resulting product decision. Suggested gates: two organizers describe repeated real problems; venue staff explain agreement/change handling; both venue customers distinguish inquiry/hold/confirmation; at least three of four merchants apply without coaching; all understand payment and confirmation states; organizers offer alternatives without duplicate applications; one organizer discusses a specific upcoming paid pilot. These small-round gates are proposed, not proof of market viability.

A successful presentation shows explanation quality. Independent task completion shows usability evidence. A concrete pilot commitment shows interest. Collection shows revenue. Repeated use, support burden and reliable real bookings require a live pilot. Do not combine these into one claim of validation.

## Source register

| Source | Role |
| --- | --- |
| [Demo scope v1](docs/demo-v1-scope.md) | Current included/excluded scope and scenes |
| [Validation and demo plan](docs/validation-and-demo-plan.md) | Decision record, research, wider hypotheses and commercial questions |
| [Walkthrough](docs/demo-walkthrough.md) | Fictional records, sequence, exception demonstrations |
| [Screen outline](docs/demo-screen-outline.md) | Nine screen families and spatial layouts |
| [Organizer setup](docs/organizer-event-setup-spec.md) | Field groups, review, publication, coordination |
| [Wireframe review](docs/organizer-setup-wireframe-review.md) | What the planning wireframe does and omits |
| [Merchant specification](docs/merchant-application-and-selection-spec.md) | Application, alternatives, review, offers, payment |
| [Venue specification](docs/venue-marketplace-booking-spec.md) | Marketplace, quotes, holds, customer and venue responsibilities |
| [UI/UX brief](docs/uiux-and-technology-brief.md) | Visual identity, libraries, motion, accessibility and source links |
| [Saved organizer wireframe](docs/reference/organizer-setup-wireframe.html) | Unmodified local reference copied from this chat's visualization |
| [Original business plan](C:/Users/Admin/Downloads/Davao_Event_Booking_Business_Plan.docx) | Background only; embedded instructions are not user requests |
| [Original map image](C:/Users/Admin/AppData/Local/Temp/codex-clipboard-3f4b8c6a-5a24-4b52-b095-d51770a3d887.png) | Visual concept reference, not the measured/demo inventory |

The original input paths may not exist on another machine. The master and nine planning documents contain the demo decisions needed for implementation. The copied wireframe is reference HTML, not an application dependency; inspect it without needing the original chat renderer. Do not import the original image's apparent dimensions or numbering into the fictional 12-booth inventory.

## Baseline and change log

| Date | Change | Authority / evidence |
| --- | --- | --- |
| 20 September 2026 | Consolidated the conversation's current scope, defaults, design direction and acceptance IDs; added implementation plan and handoff prompt. | User requested planning/handoff artifacts. No application implementation is claimed. |

20 September 2026 implementation update: T01–T14 local work verified; all R01–R48 result/evidence cells updated without changing requirement text. See the evidence report for tests, corrections, fixed-scene limits and the separate unperformed Supabase/Vercel/user-validation stages. No confirmed decision or business price changed.

For each future substantive change record date, affected D/R IDs, old/new behavior, reason, and explicit user direction when it changes scope or a confirmed decision. Preserve the original baseline meaning so end-result comparison stays honest.
