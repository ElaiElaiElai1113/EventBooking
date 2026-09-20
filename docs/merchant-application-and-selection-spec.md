# Merchant application and organizer selection

Status: Proposed product flow for review, 20 September 2026. Planning only; this journey is not implemented or customer-validated.

Related: [Product plan](validation-and-demo-plan.md), [screen outline](demo-screen-outline.md), [event setup](organizer-event-setup-spec.md), and [sample walkthrough](demo-walkthrough.md).

## Current planning focus

The user asked to continue the plan and leave the exact venue-document requirements for later. Keep online venue review, supporting information, messages, and optional meetings in the agreed direction. Gathering a real venue's checklist and refining that checklist are deferred, not prerequisites to drafting this merchant journey. The existing setup wireframe remains a planning artifact.

The next flow starts with a published event and ends with a merchant's confirmed booth or an understandable alternative outcome. It must show both the merchant and organizer perspectives, using the same application, preferences, offer, payment record, and booth inventory.

## Confirmed rules and proposed interface choices

Preserve the user's decisions: organizers choose merchants; a request is for one booth or two adjacent booths only; initial offers start after applications close; the offer window defaults to 48 hours with explicit organizer extensions; merchants pay the organizer after selection and acceptance of a specific offer; the organizer selects deposit or full-payment terms and owns the event's cancellation/refund policy.

The three-step form, exact fields, one reusable application per business/event, maximum of three ranked alternatives, editing rules, and action wording below are proposed design choices. They are not new claims of user approval or customer validation. All example prices, deposit amounts, reminder timings, and verification targets retain their existing illustrative or proposed status.

## Recommended application structure

| Approach | Benefit | Tradeoff |
| --- | --- | --- |
| Three short steps — recommended | Separates business information, booth choices, and final review; easier to recover from an unavailable preference | Requires a clear back action and preserved draft values |
| One long form | All information is on one page | Booth and pair choices can get lost among business fields on a phone |
| Map-first application | Makes location prominent | Can encourage merchants to mistake choosing a booth for reserving it before understanding the event requirements |

Use three short steps after the event page. Keep save-and-return behavior and a clear route back to the event. Browsing the event, prices, requirements, and terms should not require completing the application first. The demo reuses a fictional merchant profile; production account onboarding is a later implementation detail.

## Merchant screens

### Event page: decide whether to apply

Show the event/organizer, dates, venue, product eligibility, application closing time, expected decisions, map and equivalent booth list, booth prices/inclusions, payment mode, cancellation/refund terms, and contact route. Use Philippine time with an explicit date and time.

The main action is Apply when applications are open. Before opening, show the opening date; after closing, explain that new applications are closed. Existing applicants can still open their own application. Do not imply that a visible unallocated booth allows an application after the event deadline.

Booth availability means accepting preferences, temporarily held, confirmed, or unavailable. It does not expose other merchants' proposals or contact details. Multiple applications may include an unallocated booth; this is normal competition, not an inventory error.

### Step 1: your business and event needs

Proposed standard fields: business/display name, responsible contact, product category, products being sold, useful product photos, and equipment/power or other operating needs. Reuse business information but let the merchant check the event-specific products and requirements.

Do not require people to restate profile details for each backup booth. Avoid a general form builder in the first demo. Mark optional fields clearly. Required-field errors preserve the draft rather than resetting the application.

Use a submission snapshot: later edits to the reusable business profile must not silently rewrite an application already being reviewed. A deliberate correction to an application appears in its history.

### Step 2: preferred booth or adjacent pair

1. Choose one booth or two adjacent booths.
2. Choose a first preference and optional ranked backups. Recommend up to three total choices for the first demo; the exact maximum remains proposed.
3. For a two-booth request, each choice is a complete eligible pair from the agreed map. For a one-booth request, each choice is one booth. Do not mix quantities silently within ranked choices.
4. Show each choice's location, size, operating suitability, price, and combined total for a pair. Explain any recorded requirement mismatch before submission.
5. Optionally indicate openness to organizer-suggested alternatives. That permission permits a suggestion, not automatic acceptance, relocation, or payment.

Example: first choice 23 + 24, backup 30 + 31. This is one application for two booths, not applications for four booths. Booths 26 + 27 are not a valid pair because the sample map places them across the walkway.

Keep the same map and list selection state. If a preference becomes unavailable before submission, preserve the business details and other choices, show the affected option, and let the merchant replace it. If there are no suitable choices, save the draft and explain the situation; do not invent an open waitlist application route after the deadline.

### Step 3: check and submit

Summarize the business/products, requirements, requested quantity, ranked choices, published payment terms, cancellation/refund terms, and expected decision date. Make the amount an indicative quote for the requested choice; the eventual specific offer determines what the merchant accepts and pays.

The action is Submit application. State: "Applying does not reserve a booth. No booth payment is due now." After submission, show the received time and application reference, with a link to the same application. Repeated clicks or returning from the confirmation page must not create duplicate applications in the demo's sample state.

Proposed editing rule: allow deliberate updates until applications close, recording the latest submitted version. After closing, ordinary editing is locked; organizer-requested corrections or agreed preference changes use the existing application and visible history. They do not reopen the general application window or replace an outstanding offer silently.

### Application and booking detail: one place to return

Reuse the same detail page for questions, outcomes, offers, payment review, and confirmation. Show a concise current status, who acts next, the relevant deadline, and one main action. Keep prior choices, messages, and offers available in history without making the merchant interpret several conflicting status badges.

| Current situation | Merchant sees | Main action |
| --- | --- | --- |
| Submitted | Received; no booth reserved; decision expected by the published date | View application |
| Organizer needs information | Specific question and response deadline | Reply on this application |
| Preferred booth becomes unavailable | That choice is unavailable; other preferences remain under review | View remaining preferences |
| Waitlisted | No suitable allocation currently offered; no guaranteed queue position | Review or update acceptable alternatives through the organizer |
| Declined | Event application was not selected, with the organizer's contact route and appropriate reason | View outcome |
| Specific offer received | Exact booth(s), total, required initial payment, recipient, terms, deadline | Review offer |
| Offer accepted, payment due | Deposit or full amount required by the original offer deadline | View payment instructions and submit a payment reference |
| Timely payment submitted | Held while the organizer verifies the receipt | View payment record |
| Confirmed | Booth(s), setup instructions, verified receipt, remaining balance if any | Prepare for the event or pay the balance when due |
| Offer declined or expired | That offer no longer holds a booth; application history remains | Ask the organizer about another suitable option |

An unavailable preference does not automatically reject or waitlist the merchant. The organizer records the actual decision. A passed expected-decision date shows a delay and organizer follow-up, not an invented acceptance or a silent decline.

## Organizer review workspace

Use one application list with a linked detail panel and map view. Keep useful filters to review status, product category, requested quantity, and operational needs. Selecting a booth shows applications that name it, including applications that need it as part of a pair. Selecting an applicant shows their full request and ranked alternatives.

Compare factual business/product information, booth requirements, and preferences. Do not add AI selection, quality scores, automatic category quotas, or a fixed waitlist ranking. Internal notes and shortlist decisions are organizer-only. Shortlisting does not hold a booth or tell a merchant that they are confirmed.

Before the closing deadline, organizers can inspect, shortlist internally, and ask questions. The offer action explains when offers become available. After closing, the main selection action is Approve and offer booth. This combines the merchant selection with a concrete allocation proposal so the merchant has a meaningful next step.

If selection without space is needed, show "Selected; booth offer pending" and no payment action. Avoid adding it as a required intermediate stage in the main demo.

### Offer preparation

Show the applicant's requested quantity, ranked preferences and their current availability, allowed alternatives, booth line items, total, required deposit/full amount, any remaining balance and deadline, the default 48-hour expiry, and the applicable policy version.

Before the organizer sends an offer, recheck that the application is eligible, applications have closed, the proposed booth(s) are available and suitable, a pair is eligible and complete, and the payment schedule allows the full offer window. The application may have only one active offer. A booth may have only one exclusive hold. If any part of a pair fails, send no partial pair offer and show which choice needs changing.

Sending the offer places a temporary hold on the exact booth or pair; it does not confirm the booking. Other merchants retain their application records and remaining preferences. The organizer remains responsible for choosing who receives an alternative; the platform does not automatically choose the next merchant.

### Merchant response and receipt verification

The merchant can accept the exact offer, decline that offer, or ask about an alternative. Acceptance preserves the booth, price, payment terms, and policy version, and reveals the organizer's payment instructions. Acceptance alone does not restart the 48-hour clock or confirm the booking.

Proposed alternative-request handling: a question does not extend the current deadline or change its hold. The organizer must explicitly extend, withdraw, or replace the offer. A replacement needs a fresh availability check and merchant acceptance, with the previous offer retained as history. Reducing two booths to one requires an explicit quantity/price revision and merchant acceptance.

Distinguish declining this offer from withdrawing from the event. Declining an unaccepted, unpaid offer releases that offer's booth or pair and leaves an outcome in the same application; it does not promise another offer. Withdrawing an application is an explicit choice. If payment or proof has already been recorded, route withdrawal to organizer review so the receipt and any refund are resolved rather than releasing a potentially paid allocation through a simple decline action. Once a booking is confirmed, use the existing cancellation-request workflow instead of treating it as an unpaid offer decline.

The merchant submits a payment reference or sample proof to the organizer. Only organizer verification of the required initial receipt, accepted terms, and a still-valid allocation confirms the booking. A verified deposit may leave a balance; full-payment mode requires the full offered amount. The organizer's venue-rental balance remains separate.

Timely proof enters pending verification and protects the held booth/pair while staff resolve it. The proposed 24-hour verification target is an organizer follow-up target, not an automatic release time. Unclear, partial, duplicate, or unmatched receipts require resolution and must not produce automatic confirmation. A late receipt against an expired allocation needs organizer review and cannot reclaim inventory already given elsewhere.

## Competition example for the first demo

Use the existing eight applications and the same 12 booths from the walkthrough. Paper and Clay starts as a draft alongside seven submitted applications; submitting it produces eight, not nine.

| Event in the example | Inventory effect | Merchant experience |
| --- | --- | --- |
| Paper and Clay requests 23 + 24, with 30 + 31 as backup | No hold | One submitted application for two adjacent booths |
| Brew Corner also requests booth 23 | Still no hold | Both applications remain valid; organizers compare them after closing |
| After closing, organizer offers 23 to Brew Corner | Only 23 is held | Paper and Clay's first pair is unavailable; booth 24 is not partly held for them |
| Organizer offers 30 + 31 to Paper and Clay | Both booths held under one offer | Paper and Clay reviews the backup without writing another proposal |
| Iced Sip also wanted 30 or 31 | No competing offer may hold these booths | Iced Sip's application stays active for another organizer decision |
| Paper and Clay accepts and submits the sample PHP 2,000 deposit on a PHP 4,000 pair | Both booths remain held during verification | Payment under review; no confirmed claim yet |
| Organizer verifies the required deposit | Both booths confirmed together | Confirmed; PHP 2,000 balance remains under the sample deposit terms |

If no eligible pair remains, the organizer can waitlist the applicant or discuss another valid arrangement. No automatic single-booth allocation, non-adjacent pair, duplicate application, or guaranteed queue position is created.

## Demo review checks

1. A merchant can explain the difference between a preference, an offer, and a confirmed booking without narration.
2. One submitted pair application contains multiple alternatives but never more than one active offer or confirmed allocation.
3. The 26 + 27 attempt is rejected with the adjacency explanation and preserved draft details.
4. Before closing, offer sending is unavailable; internal review and clarification remain available.
5. The shared-booth example preserves the losing merchant's application and shows a valid backup offer.
6. Offer rejection, expiry, and waitlisting preserve the application without automatically selecting another merchant.
7. Both booths in a pair are held, confirmed, or released together. Timely receipt review does not accidentally release either booth.
8. Deposit/full-payment examples show the correct required amount and remaining balance. A partial full-payment receipt does not confirm the booking.
9. Merchant screens expose only that merchant's application, and venue review has no merchant-selection controls.
10. Missing information, delayed decisions, and unavailable preferences each show who acts next and preserve existing work.

These are planning checks for the later demo, not claims of executed tests or production reliability. All sample notices, offers, allocations, and payments will be simulated.

## Planning handoff

The user requested the next planning steps. The [screen map](demo-screen-outline.md) now gives this flow stable view names, primary actions, mobile behavior, and spatial sketches. The [venue booking specification](venue-marketplace-booking-spec.md) details the separate customer/venue journey. [Demo scope v1](demo-v1-scope.md) defines the complete three-journey baseline, including up to three ranked choices as a demo default rather than a validated universal limit.

Only organizer event setup has a clickable planning wireframe so far; these merchant/organizer views are mapped in documents. The requested planning work is complete. Implementation planning and application construction are a later stage, and the existing prospect-session guide remains ready for future research use.

Exact venue-document lists, actual payment methods, commercial policy wording, and operational review targets remain later validation inputs. Do not let those deferred details turn into assumed universal rules. No AI, application implementation, integration, deployment, or real outreach is authorized by this planning document.
