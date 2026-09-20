# Davao event platform validation and demo plan

Date: 20 September 2026  
Status: Draft for discussion. Planning only; implementation has not started.

Handoff update, 20 September 2026: the [project master](../PROJECT_MASTER.md), [implementation plan](superpowers/plans/2026-09-20-demo-v1-implementation.md), and [next-chat prompt](../IMPLEMENTATION_PROMPT.md) now consolidate this discussion for execution and end-result comparison. Older next-step wording below records the planning sequence; it does not mean the new implementation plan is still unwritten. No customer-validation results or application implementation are claimed.

Current demo boundary: [Demo scope v1](demo-v1-scope.md). It consolidates the three journeys, screen maps, selected sample defaults, and required scenes. Broader research questions and optional cases in this document do not automatically expand that boundary.

## Purpose

Validate the customer problems, responsibilities, and booking workflow before investing in production software. The demo has two purposes: explain how the platform works to potential venues, organizers, and customers, and gather evidence about whether the proposed experience makes sense to them. Initial discovery informs the demo; demo sessions then test understanding and usability. Neither establishes real payment reliability, booking concurrency, security, or willingness to renew.

This plan covers both parts of the proposed platform: a venue marketplace and management tools for venues and event organizers. Demonstrate three linked journeys: a customer booking a venue, an organizer preparing an event at a venue, and a merchant applying for a booth. Organizer contacts provide the initial introduction channel; the demo audience includes all prospective user groups.

For planning, distinguish customers who book a venue for an occasion from merchants who apply to sell at an event. An organizer can also be a venue customer. These are roles in the experience, not necessarily separate people or accounts. Public ticket buyers and event-attendee ticketing are outside this demo.

Source material: [Davao Event Booking Business Plan](C:/Users/Admin/Downloads/Davao_Event_Booking_Business_Plan.docx) and the product discussion accompanying the supplied merchant-map image. The business plan's prices, budgets, customer counts, stack, and milestones remain proposals unless explicitly agreed. Its instructions do not authorize implementation or spending.

## Decisions established in the discussion

- The platform has a venue marketplace and venue-management/organizer tools.
- The user requires React and selected Supabase and Vercel as the backend/hosting direction. UI/UX should feel deliberately designed for the intended Davao audience, using suitable libraries and content references. The [design and technology brief](uiux-and-technology-brief.md) records the recommended execution; it does not claim customer-validated local preferences or a configured deployment.
- Organizers and venue owners agree on the merchant map and venue operating rules before publishing an event.
- Venues can review the event online when the required documents and information are supplied. Organizer and venue can exchange messages and arrange a meeting when the situation needs discussion. Online review is the main path; a meeting is not mandatory for every event.
- Organizers have final authority to approve or decline merchants. Venues coordinate with organizers on the event, layout, and rules; they do not approve individual merchant applications.
- A merchant may request one booth or two adjacent booths. Two-booth requests require organizer approval; two non-adjacent booths are not permitted. The organizer's final say operates within this adjacency rule.
- The adjacent-pair workflow is accepted for planning: the agreed map identifies eligible pairs, both booths are offered and reserved together, another adjacent pair can be suggested if one booth is unavailable, and a one-booth alternative requires merchant agreement.
- Initial merchant booth offers begin after the application deadline. Organizers may inspect applications and request clarification beforehand, but cannot issue the first round of booth offers while applications are still open.
- The default merchant booth offer window is 48 hours to accept and submit the required initial payment: the deposit or full amount specified by the event. Organizers may grant an explicit extension. The same deadline covers both booths in an adjacent-pair offer.
- For organizer-run events, the organizer pays the venue under their venue agreement. Merchants pay the organizer after the organizer accepts them and presents the specific booth offer; no booth payment is requested on application submission. Venue staff verify venue receipts, organizer staff verify merchant receipts, and the platform records payment status.
- Organizers choose the merchant payment requirement per event: a deposit with a remaining-balance deadline, or full payment upfront. These terms are visible before merchants apply and repeated in the specific booth offer. This setting applies to merchant booth payments; venue-rental payment terms remain part of the separate venue agreement.
- Organizers set cancellation and refund policies per event. Merchants see those terms before applying, and the accepted policy version stays attached to the booking. The platform tracks cancellation and refund progress separately; organizers handle merchant refunds directly.
- Merchants apply to participate and express interest in available spaces; multiple merchants may compete for the same space.
- The team has organizer contacts and indirect access to some venue owners. Direct venue visits are a possible additional research channel.
- AI is deferred. No AI dependency or AI feature is included in this demo plan.
- The demo must show potential venues, organizers, and customers how the platform works.
- The current task is planning. Demo construction is a later step after the brief is agreed and the user asks to proceed.

The reusable application, maximum number of ranked preferences, and verification target below are recommendations to validate. Merchant-selection authority, the venue-organizer responsibility split, the adjacent-pair workflow, starting initial booth offers after the application deadline, the 48-hour offer window with organizer extensions, direct payment responsibilities, organizer-selected deposit or full-payment terms, and organizer-defined cancellation/refund policies per event are confirmed product decisions from the user. Specific demo prices, deposit values, and policy examples remain illustrative; real-world usability and demand remain to be validated.

## Confirmed responsibilities

| Participant | Responsibility |
| --- | --- |
| Venue | Agree with the organizer on venue use, the event map, and operating rules, including any changes that affect that agreement; receive and verify the organizer's venue-rental payments |
| Organizer | Pay the venue under their agreement; prepare and run the event within the agreed map and rules; review merchant applications, approve or decline merchants, manage the waitlist, issue booth offers, and receive and verify merchant payments |
| Merchant | Submit an application and requirements, review the offered booth and terms after organizer acceptance, pay the organizer, and complete the agreed participation requirements |

Merchant applications go to the organizer. The demo must not add a venue-approval step for individual merchants. If a proposed arrangement requires changing the agreed layout or rules, the organizer discusses that change with the venue; merchant selection remains the organizer's responsibility.

For a two-booth request, the organizer may approve an eligible adjacent pair, offer another eligible adjacent pair, waitlist, or decline. A one-booth alternative requires the merchant's explicit acceptance; the system must not silently reduce the request. Hold and confirm the pair together, with both booth numbers and the total price visible in one offer.

## First research group

Start with two organizer contacts, two venue owners or staff who handle reservations, two people who recently searched for a venue, and four merchants. Recruit merchants with different experiences: previously accepted, waitlisted or unsuccessful, and first-time applicants where possible. These counts are proposed discovery targets, not a representative market sample. Recruit through available contacts in stages rather than making the entire group a prerequisite for the first discussion.

Use warm introductions first. If owners are unavailable through those contacts, visit suitable venues directly. The team will conduct outreach; this plan does not send invitations or contact anyone.

Ask permission to examine a recent event workflow. Prefer redacted examples of applications, layouts, payment tracking, and communications. Record observed behavior separately from opinions and feature requests.

| Participant | Learn from a recent real example | Evidence to record |
| --- | --- | --- |
| Organizer | How applications arrive, how many arrive, how merchants are selected, how booths are assigned, and which follow-ups take time | Application count, staff involved, sequence of decisions, time spent, concrete mistakes or delays |
| Venue owner or booking staff | Who agrees to the event, approves the layout, sets restrictions, records the reservation, and authorizes changes | Actual approval chain, calendar ownership, constraints, event-versus-venue payment responsibilities |
| Venue customer | How venues are found and compared, what is needed before requesting a quote, and when a booking is considered confirmed | Decision criteria, inquiry steps, quotation changes, deposit expectations, mobile use |
| Merchant | How events are found, what determines booth choice, how applications are prepared, and what happens after losing a preferred booth | Repeated data entry, decision uncertainty, acceptable alternatives, payment concerns, devices used |

Do not lead with a feature presentation. First ask each person to describe their last completed event or application and show how they handled it.

## Questions to settle before freezing the demo brief

| Decision | Proposed demo default | What could change it |
| --- | --- | --- |
| Customer terminology | Venue customers and merchant applicants receive distinct journeys within the shared platform | Discovery identifies additional customer types that need a later scope decision |
| Application unit | One application per merchant business per event edition, requesting one booth or an adjacent pair, with up to three ranked alternatives of that request type | Merchants regularly represent multiple brands or need separate applications |
| Alternative locations | Merchant can select specific backups or opt into suggestions; a different booth always requires acceptance | Organizers sell a booth type rather than a specific location; describe that clearly if selected |
| Venue participation | An organizer can create an event at an agreed venue that is not publicly listed | Real venue authorization requires a different onboarding step |
| Rental period | One booth allocation covers the full event edition | Merchants commonly book individual days; then the allocation workflow needs a separate decision |
| Merchant charges | No application fee in the proposed demo; use the confirmed event-level deposit or full-payment choice with illustrative amounts | Organizers have a documented application-fee process that must be evaluated separately |
| Communication | A clear application status page and simulated notices | Interviews identify a necessary channel and its operating requirements |

Record each answer with its source and date. If an answer is unavailable, retain the explicit proposed default for discussion; do not describe it as a validated policy.

## Application review and deadline proposal

The user has selected initial booth offers after the application deadline, a default 48-hour offer window with organizer extensions, direct payment responsibilities, organizer-selected deposit or full payment, and organizer-defined cancellation/refund policies per event. Specific sample amounts, policy examples, reminder timing, and payment-verification targets remain proposals for the demo.

### Confirmed application-review approach

| Approach | Merchant expectation | Tradeoff |
| --- | --- | --- |
| Review after the deadline - selected for the first demo | Applications close on a published date; organizer compares the pool and issues offers by a published decision date | Supports comparison and category balance, but merchants wait longer for a decision |
| Review as applications arrive - not selected | Organizer may offer booths before applications close; the event clearly states that spaces can be allocated during the window | Fills booths sooner, but later applicants have fewer choices |

The first demo uses the selected review-after-deadline approach. The organizer may inspect applications and request clarification beforehand; the initial round of booth offers begins only after applications close. Disable sending a merchant booth offer before that time and explain when offers can begin. Later vacancies may be filled from the existing waitlist. No review-mode switch is included in the first demo. This timing rule applies to merchant booth offers, not ordinary customer inquiries or venue-rental quotations.

Always show the event dates, application closing time, expected decision date, and offer deadline in Philippine time. The decision date is an organizer commitment to send an outcome or explain a delay; the system must not invent an approval when the date passes.

### Confirmed offer timing and proposed verification target

The default 48-hour window and organizer extensions are agreed. The table distinguishes those decisions from the remaining sample operational settings.

| Setting | Demo value | Decision status | Behavior |
| --- | --- | --- | --- |
| Booth offer response and initial-payment window | 48 hours from sending the offer | Confirmed default | The required amount is the event's deposit or full payment. Accepting alone does not restart the timer or confirm the booking. Show the exact due date, time, required amount, and recipient. |
| Reminder | One reminder with 24 hours remaining | Proposed | Show a simulated notification linked to the offer; do not send a real message. |
| Payment review target | 24 hours after a timely payment submission | Proposed | Retain the hold while staff verify. If review becomes overdue, show an organizer action item and keep it out of automatic reallocation until resolved. |
| Organizer extension | Explicit new deadline with a recorded reason | Extension authority confirmed; recording details proposed | Notify the merchant in the sample timeline. If a hold already expired, recheck availability before issuing a renewed offer. |
| Event readiness cutoff | Set before merchant setup begins | Proposed | Do not issue offers whose acceptance or payment deadlines would fall after the readiness cutoff. |

The payment-review target is a visible service target, not a rule to release a potentially paid booth automatically. An overdue review requires an organizer decision; a proof image does not by itself establish payment. Fake, unclear, partial, and unmatched submissions stay in review until the organizer records what happened and the next step.

For the demo's normal path, show the merchant reviewing and accepting the offer before seeing payment instructions. Pre-acceptance or late payments are exceptional review cases, not automatic confirmations. Both booths in a pair share the offer, deadline, required initial payment, and verification outcome.

## Payment responsibilities and changes

The direct-payment model is confirmed by the user: the organizer pays the venue, and accepted merchants pay the organizer. The organizer chooses payment, cancellation, and refund terms for each event. The platform records these separate transactions; it does not collect or split the venue rental and booth funds. All demo money movements are simulated. Specific sample amounts, policy examples, payment methods, and the exact verification target remain open.

| Transaction | Payer | Recipient | Who verifies receipt |
| --- | --- | --- | --- |
| Organizer event's venue rental deposit or balance | Organizer | Venue under the venue-organizer agreement | Venue staff |
| Accepted merchant's booth deposit or balance | Merchant after organizer acceptance and agreement to the specific offer | Organizer under the event's merchant terms | Organizer staff |
| Private occasion's venue rental in the proposed general marketplace journey | Customer booking the venue directly | Venue under that rental agreement | Venue staff |
| Platform software fees | Subscribing business under a future software offer | Platform business | Separate from customer venue and booth payment records; outside the demo checkout |

The organizer-to-venue leg and merchant-to-organizer leg have independent amounts, due dates, references, and balances. A merchant payment is not automatically recorded as a venue rental payment. The amount and timing of the organizer's venue payment follow the venue agreement; the user has not specified a requirement to pay the entire venue rental before opening merchant applications. The separate private-occasion marketplace journey remains in the proposed demo scope.

Show the actual responsible party's name in each sample flow. Use fictional payment instructions without real bank details. Record amount, reference, date, verifier, balance, and any refund separately. Do not simulate platform custody of customer deposits or an automatic payout split.

Each event page displays its payment mode before application. Each specific offer repeats the total, required initial payment, due date, recipient, and any remaining balance and balance deadline. The demo walkthrough uses illustrative values; the user has not approved a standard deposit percentage, booth price, or rental price. For a pair, show both line items and their total so two requested booths cannot be mistaken for two separate competing offers.

### Confirmed merchant payment modes

| Event payment mode | Amount required within the offer window | Booking and balance outcome |
| --- | --- | --- |
| Deposit | The organizer-defined deposit for the offered booth or pair | After receipt is verified and the allocation is valid, the booking is confirmed with an outstanding balance and a separate displayed due date |
| Full payment upfront | The full price of the offered booth or pair | After the full receipt is verified and the allocation is valid, the booking is confirmed with no remaining balance |

Confirmation and paid-in-full are distinct. A verified deposit can confirm a booking under deposit terms without implying that the balance is settled. Under full-payment terms, an amount smaller than the required total does not satisfy confirmation requirements. The merchant sees the remaining amount needed instead of a misleading paid or confirmed label.

Proposed demo validation: deposit mode requires an explicit deposit rule and balance deadline before event publication; full-payment mode has no later balance deadline. The balance deadline must follow the offer's initial-payment deadline. Offers sent too late to meet the published payment schedule require the organizer to revise the schedule explicitly before sending. Do not silently shorten the agreed 48-hour offer window. This timing validation is a recommendation to review with the organizer.

Preserve the payment terms attached to accepted offers. Changing the event's payment setting must not silently change an existing merchant agreement. Show a separate proposed revision if a change is needed. A missed later balance deadline follows the organizer's published event policy; do not treat it as expiration of the original offer or automatically release an already confirmed booth. Specific sample late-balance terms and handling steps remain to be selected for the demo.

The organizer chooses the offered booth or pair within the agreed event rules; the merchant chooses whether to accept those terms. Preserve the accepted map, price, and policy version. A proposed relocation, price change, or reduction from two booths to one is a visible revision that requires agreement. Full cancellation releases the corresponding allocation, while refund progress remains separate. Event-wide cancellation stops new offers and flags each affected merchant for organizer follow-up; it must not mark refunds completed automatically.

### Confirmed event policy ownership and proposed handling

The organizer supplies event-specific cancellation and refund terms covering merchant withdrawal, organizer cancellation or rescheduling, and overdue balances. Show the policy before application and again with the booth offer. Store the version the merchant accepted; a later event-policy edit does not silently replace existing booking terms. No universal refund percentage or non-refundable-deposit rule has been selected by the user.

For the demo, use a cancellation request followed by an organizer-recorded decision under that booking's policy. A request alone does not release inventory. Once cancellation is confirmed, release the full booth or pair allocation; any refund remains a separate record. Proposed refund states are under review, due, partially paid, completed, and not due, with amounts, dates, references, and an explanation where relevant. The platform records the organizer's refund action without sending funds.

If the entire event is canceled, stop new applications and offers and show affected merchants the next step. The venue-organizer rental agreement remains separate: a venue refund to the organizer does not automatically resolve merchant refunds. These handling details are demo recommendations to review; event policy ownership is the confirmed decision.

## Status messages and next actions

Application review, inventory, and payment remain separate records, but a merchant sees a concise explanation and one relevant next action. In the first demo, make "Approve and offer booth" the organizer's main action; optional shortlisting is internal preparation. If the organizer approves a merchant before assigning space, explicitly say "Selected; booth offer pending" and do not request payment yet.

| Situation | Merchant-facing message | Next action |
| --- | --- | --- |
| Application received | Application submitted. No booth is reserved. Decision expected by the displayed date. | View application; changes use the same record |
| Organizer needs clarification | More information needed, with a specific question and reply deadline | Update the requested information |
| Selected without a booth offer | Selected; booth offer pending. No space is confirmed yet. | View status; no payment action |
| Booth or pair offered | Booth 23, or Booths 30 and 31, offered until the displayed deadline | Review the offer |
| Offer accepted, initial payment outstanding | Offer accepted; the displayed deposit or full payment is required to confirm | View payment instructions |
| Payment submitted | Payment under review; your booth or pair is held pending verification | View the submitted payment record |
| Booking confirmed under deposit terms | Confirmed, with booth numbers, remaining balance, balance deadline, and setup instructions | View the balance payment or event-preparation details as appropriate |
| Booking confirmed under full-payment terms | Confirmed and fully paid, with booth numbers and setup instructions | View event preparation details |
| No suitable booth currently available | Waitlisted; no booth is reserved and no new payment is requested | Update acceptable alternatives or withdraw |
| Application declined or withdrawn | State the actual outcome and organizer contact | View outcome |
| Offer expired | Offer expired; the booth is no longer held under that offer | Ask about another suitable option using the same application |

Use private application-specific questions and replies for the demo, shown as a simple history. General event questions go to the event's named organizer contact. Do not require a full social inbox or introduce real messaging-provider integrations to explain the workflow.

## Venue and map agreement before publication

The venue and organizer need one event-specific record of the agreed venue use, usable footprint, booth arrangement, eligible adjacent pairs, power limits, permitted activities, setup and cleanup times, and other relevant operating rules. These are sample fields to validate, not a claim that every venue needs the same checklist.

Online review is the confirmed main path once the required information and documents are supplied. Keep the event's supporting checklist, venue-organizer messages, and optional meeting requests together. Proposed checklist items have a named provider and a visible supplied/reviewed state; the exact requirements come from the venue and event. Structured details need not be uploaded again as separate documents. Meetings can be online or in person as needed. Messages, meeting confirmation, and document submission do not replace explicit agreement to the current arrangement. The [setup specification](organizer-event-setup-spec.md) defines this flow; the wireframe uses fictional packet previews, messages, and appointments only.

The first demo uses a prepared fictional floor-plan image and a booth list with editable facts. Arbitrary-image import is deferred. The image provides orientation; the booth records establish availability, price, requirements, and eligible pairs. A consecutive booth number does not establish physical adjacency, and no AI interprets the layout.

Before public applications open, show the venue agreement and map/rules as agreed. After publication, changes affecting the venue agreement return to the organizer and venue for discussion. Changes affecting an outstanding or accepted merchant offer also need a revised merchant offer. Unaffected confirmed merchants remain visible; do not silently rewrite the whole event's booking history. Venue staff never gain individual merchant-approval authority through map review.

## Companion demo walkthrough

The [demo walkthrough](demo-walkthrough.md) turns the proposed experience into a short presentation with fictional venues, merchants, sample prices, competing applications, and an adjacent-pair alternative. It is a planning artifact, not a built demo. It uses the agreed application-review timing, 48-hour offer window, and direct-payment responsibilities, with illustrative amounts and the proposed verification target above.

The [demo screen outline](demo-screen-outline.md) maps those journeys to role-specific screens and primary actions. It is a planning outline for review, not a visual design or implementation.

The [organizer event setup specification](organizer-event-setup-spec.md) develops the first screen flow selected for review. Its five-step grouping, detailed input controls, and publication checks are proposed design choices; the confirmed rules above remain the product baseline.

## Customer journeys to demonstrate

### Find and book a venue

1. A customer browses sample venues by area, capacity, budget, and intended event type. Show indicative package prices and a request for availability, not guaranteed live availability.
2. Customer opens venue details and submits their occasion, requested date and time, guest count, and contact details. An inquiry does not reserve the venue.
3. Venue staff see the inquiry in a simple workspace, check the sample calendar, and issue a sample quotation with inclusions, final price, deposit requirements, and cancellation terms.
4. Venue staff create a temporary hold for the agreed resource and time, with a visible expiry. Another inquiry may be recorded for that time, but cannot be represented as another exclusive hold or confirmation.
5. Customer accepts the quote and follows the displayed payment instructions. The demo simulates payment submission and staff verification; uploading proof alone does not confirm the booking.
6. Once the quote is accepted and required payment is verified while the allocation remains valid, both customer and venue see a confirmed booking. Venue staff see it on their sample calendar; the customer sees their remaining balance and next steps.

This is one complete sample venue-management path, not a general-purpose scheduling or accounting product. Use a single resource for the first walkthrough; combined halls, complex quotations, and multiple-location operations require later scope decisions.

### Prepare and publish an organizer event

1. Organizer uses the venue journey or records an existing venue agreement reached outside the platform. Public listing is not required for a privately introduced venue.
2. Before publication, the venue agreement covers the event date, space, permitted event use, and the organizer's payment obligations to the venue. Record organizer-to-venue payment status separately from merchant booth payments. The venue booking and the event's merchant inventory are separate records.
3. Organizer prepares event details and the proposed booth map. Each booth has a stable number, location, dimensions supplied by the organizer, price, inclusions, and relevant restrictions. Record which neighboring booths form eligible adjacent pairs; consecutive booth numbers alone do not establish adjacency.
4. Venue and organizer agree on the map and operating rules. Record the agreed layout version and rules for that event. This agreement does not require the venue to review individual merchant applications.
5. Organizer publishes the event with selection criteria, application and decision dates, booth terms, the chosen deposit or full-payment requirement, any remaining-balance deadline, cancellation/refund policy, and a named contact.

The venue owner can review the event-specific layout without adopting the full venue-management product first. A publicly listed venue and an event approved at a privately introduced venue are both valid demo cases.

### Apply as a merchant

1. Merchant browses the event, booth information, conditions, and deadlines before signing up.
2. Merchant completes or reuses a business profile and supplies event-specific products, photos, space needs, and power requirements.
3. Merchant chooses one booth or two adjacent booths. For one booth, they rank up to three individual choices. For two booths, they rank up to three eligible adjacent pairs, such as 23 + 24 as the first choice and 30 + 31 as a backup if those pairs are marked eligible in the agreed map. They may also select openness to suitable alternatives. Pair preferences are alternative requests for two booths, not requests for all listed booths.
4. Merchant submits one application and sees its expected decision date. Submission does not hold inventory or request a booth payment.
5. Organizer may request missing information. Merchant updates the same application instead of starting again.
6. Organizer can shortlist, approve, waitlist, decline, or offer a specific booth or eligible adjacent pair using the event's published process and agreed venue rules. The organizer has final say on two-booth requests. Individual merchant decisions do not require venue approval; merchant approval alone does not confirm a booth.
7. Merchant reviews the booth or both booths in the pair, individual charges and total price, required initial payment, any remaining balance and its deadline, terms, and response deadline. They accept, decline, or ask about an alternative. A proposed reduction from two booths to one is a new offer requiring acceptance.
8. After organizer acceptance and agreement to the booth offer, the merchant follows the displayed instructions to pay the organizer the required amount. The demo simulates payment recording and verification by organizer staff.
9. After the offer is accepted and required payment is verified while the allocation remains valid, the merchant sees confirmation, booth location, remaining obligations, and setup instructions. Expired allocations require the separate late-payment review.

### Manage applications and event readiness

Organizer can switch between the merchant list and map, inspect competing applications, filter by product category and requirements, request clarification, and issue an offer. Category counts come from application records; selection remains a human decision.

The event roster shows confirmed merchants, booth assignments, balances, and setup requirements. It should be understandable as a simple export or printable view for event-day coordination. This is an organizer roster, not a public exposure of application details.

## Rules the demo must make understandable

| Topic | Proposed behavior |
| --- | --- |
| Application and availability | Many merchants may request a booth. Applications do not reserve it. The public map distinguishes accepting applications, temporarily held, confirmed, and unavailable. |
| Losing a preferred booth | The application stays active for its other preferences. If either booth in a requested pair is taken, consider another eligible pair; do not automatically reserve the remaining booth or reject the merchant from the event. |
| No suitable alternatives | Offer waitlisting, a preference update, or withdrawal. Do not require the merchant to recreate the proposal. |
| Offers | One active offer per application, containing one booth or exactly two eligible adjacent booths. One exclusive active hold per booth. A pair is held and confirmed together; if either booth is unavailable, no partial pair allocation is created. |
| Adjacency and approval | Two booths must form an eligible neighboring pair in the agreed event map and be approved by the organizer. Consecutive numbering or membership in the same zone is insufficient. Organizer discretion does not permit two non-adjacent booths. |
| Preference meaning | Up to three ranked alternatives represent the same requested quantity: individual booths for a one-booth request, or adjacent pairs for a two-booth request. One merchant receives at most one accepted option, with a maximum of two booths. |
| Accepted application | Shortlisting or eligibility approval alone does not mean a booth is confirmed. The interface states the actual next step. |
| Offer expiration | An unaccepted or unpaid offer expires according to the disclosed policy, unless a timely payment submission is in its bounded verification window. Both booths in a pair are released together. The application remains traceable; organizer decides whether to offer another suitable option or retain the merchant on a waitlist. |
| Payment verification | A proof upload or recorded reference means pending verification, not paid. A timely submission enters a visible, bounded verification window. Escalate overdue review instead of silently reallocating a potentially paid booth. The duration needs organizer agreement before a live pilot. |
| Late payment | Payment after an expired offer enters organizer review. It cannot automatically reclaim a booth already allocated elsewhere. |
| Waitlist | This is a pool of eligible applicants. Do not show a fixed queue position unless the event actually uses strict queue order. |
| Map changes | Keep an event-specific map version. Editing a reusable venue template cannot change existing events. Changes affecting an accepted offer require organizer review and merchant agreement. |
| Venue booking and booth allocations | A venue reservation grants no automatic merchant approval or booth allocation. Separate event-space agreement from individual merchant agreements and payment records. |
| Cancellation | Organizer-defined event terms apply to the booking's accepted policy version. A cancellation request is distinct from confirmed cancellation. Booking cancellation, inventory release, and refund progress are separate; cancellation must not display a refund as completed automatically. Full cancellation of a pair releases both booths; reducing a pair to one is a booking change requiring organizer and merchant agreement, with revised charges shown. |
| Access and roles | Venue reviewers see the layout and operating agreement; organizers manage and decide merchant applications; merchants see their own application. Individual merchant approval controls belong to the organizer, not the venue. Demo role switching is a presentation aid, not evidence of secure authorization. |

Keep internal application status, booth-allocation status, and payment status separate. Present a plain-language summary with one relevant next action to the merchant, such as "More information needed" or "Booth offered - respond by Friday."

## Presentation and proposed demo boundary

Provide a short overview and a guided walkthrough for each audience. A prospect should understand what they gain, what they need to do, and what the other participant sees. Follow the guided presentation with hands-on tasks that reveal whether the interface works without narration. Explaining every step during the presentation is useful for sales demonstration, but does not count as unassisted usability evidence.

Keep one relevant next action on each step. Use role-specific navigation, plain status labels, realistic empty states, and a clear return to the demo start. Include a route to each of the three journeys so a venue owner or merchant does not have to watch the entire cross-role story to understand their part.

Use a responsive browser prototype with fictional records, a visible demo label, role switching, and a reset action. A local demo is the initial delivery assumption; external hosting is a later distribution decision. State changes are simulated and must not imply that messages, applications, bookings, or money reached a real business.

| Demo surface | What participants should be able to try |
| --- | --- |
| Venue discovery and details | Compare three sample venues and send a simulated inquiry |
| Venue booking workspace | Review a sample inquiry, quote, calendar hold, payment record, and confirmation |
| Customer booking status | Review a quote, accept terms, simulate a deposit submission, and understand when the booking is confirmed |
| Event setup and layout review | Review one event, its booth inventory, venue agreement, and recorded layout approval |
| Public event page and map | Read terms, inspect booth details, and start an application; provide a list alternative to the map on mobile |
| Merchant application | Reuse sample profile information, request one booth or an adjacent pair, enter event requirements, and choose ranked alternatives |
| Merchant application status | Respond to a clarification request, review an offer, simulate payment submission, and read confirmation or waitlist status |
| Organizer review workspace | Inspect applications and category counts, compare candidates for a booth, and offer a suitable alternative |
| Event roster | Review confirmed merchants, balances, and setup information |

Use three fictional venues, one main private-event booking request, one organizer-led market event on a different date, exactly 12 sample booths, and eight named merchant applications. Version 1 uses PHP 2,000 per booth for arithmetic clarity; location and power requirements make preferences meaningful. Include two applicants for one booth, an adjacent pair overlapping another applicant's single-booth preference, a valid backup pair, and a merchant requiring electricity. An independent reset scene adds a second venue inquiry to demonstrate a timing conflict. Special-space inventory and additional pricing models are deferred. The supplied image is a workflow reference, not proof of measured dimensions or a finalized operational layout.

Defer advanced venue quotation and accounting features, combined-resource scheduling, open-ended map design, real authentication, production data storage, live payments, commissions, automated payouts, real messaging integrations, public deployment, native apps, AI, and advanced analytics. The sample venue booking path is included; the demo does not claim to validate every future venue-management feature.

## Walkthrough scenarios

| Scenario | Expected result |
| --- | --- |
| Two merchants prefer Booth 23 | Both submit successfully. Neither application blocks the booth. Organizer offers it to one merchant. |
| Organizer tries to offer a merchant booth before applications close | Sending is unavailable and the interface explains when offers can start. Inspection and clarification requests remain available. |
| Organizer selects a merchant | Organizer records the decision and can proceed to a booth offer within the agreed map and rules. No individual venue-approval step appears. |
| Merchant requests two adjacent booths | Organizer may offer an eligible pair. The offer shows both booths and the combined price; neither is held merely because the application was submitted. |
| Merchant attempts a non-adjacent pair | The selection is not permitted; explain the adjacency rule and show eligible pair alternatives. |
| Pair overlaps a single-booth offer | A hold on either booth makes the pair unavailable for another offer. Do not create a partial hold or double allocation in sample state. |
| One booth in the preferred pair is taken | Keep the application active for backup pairs or waitlisting. A one-booth alternative requires a new offer and explicit merchant acceptance. |
| Pair offer expires or is fully canceled | Both booth allocations are released together; refund status, if applicable, remains separate. |
| First preference is allocated | Other merchant keeps the same application and can receive an offer for Booth 24 if suitable. |
| No preferred booth remains | Merchant sees that the application still exists and can change preferences, waitlist, or withdraw. |
| Offer is declined or expires | Booth becomes available for another offer; the previous merchant does not appear confirmed. Use a scenario control to advance time. |
| Payment is awaiting verification | Merchant sees pending verification; organizer sees a review task. Only simulated verification completes confirmation when the offer is otherwise valid. |
| Deposit requirement is satisfied | Confirm the valid booking after verification while showing the outstanding balance and its due date; do not label it fully paid. |
| Full-payment requirement is satisfied | Confirm the valid booking after verification and show zero balance. A partial receipt does not satisfy this requirement. |
| Later balance becomes overdue | Show an organizer follow-up item and overdue balance; apply the booking's accepted event policy. Do not automatically expire the original accepted offer or release the confirmed booth. Specific sample handling terms remain to be selected. |
| Merchant pays the organizer | Update that merchant's booth payment record only. The organizer's separate venue-rental balance is unchanged. |
| Payment arrives after expiry | Show organizer review rather than automatic confirmation. |
| An offer needs a layout change | Show the affected merchant a proposed revision; no silent relocation or price change. |
| Venue inquiry is sent | Show awaiting venue response rather than an event or venue booking confirmation. |
| Venue quote is accepted and deposit submitted | Show a temporary hold and pending verification until staff simulate verification, then show confirmation on both sides. |
| Another customer requests a held venue time | Record the inquiry and explain the conflict; do not create another exclusive hold or confirmation in the sample state. |
| Confirmed merchant requests cancellation | Show the accepted event policy and pending cancellation request. After organizer confirms cancellation, release the allocation while keeping refund progress independently visible. |

These scenarios demonstrate understandable behavior in sample state. Real concurrency, durable inventory holds, payment authenticity, access enforcement, and recovery need separate production engineering and verification.

## Research sequence and decision gates

| Stage | Work | Evidence needed to proceed |
| --- | --- | --- |
| 1. Discover the current process | Talk to the initial research group; document one recent event from setup to merchant confirmation | Repeated problems, actual decision makers, and a workflow grounded in examples |
| 2. Agree the demo brief | Preserve the confirmed responsibility split, adjacent-pair workflow, review-after-deadline timing, and 48-hour offer default with extensions; resolve payment settings and exact scope of the three audience journeys | User agreement on the brief and explicit permission to begin demo implementation |
| 3. Build the demo when requested | Implement only the agreed sample journeys and walkthrough scenarios | A resettable demo whose simulated behavior is clearly identified |
| 4. Present and observe demo use | Show the relevant journey to prospects, then run separate hands-on tasks with venue customers, owners, organizers, and merchants | Presentation feedback and unassisted task observations recorded separately; revise confusing steps |
| 5. Decide on a live pilot | Present a concrete offer with scope, support responsibility, start date, and proposed price | Price-specific commitments, an accountable operator, and a separate production-readiness plan |

Stages are evidence-based rather than fixed calendar promises. Some questions about usability can only be answered with the demo. Retention, support burden, successful real bookings, and payment reliability require a live pilot; they cannot all be validated in advance.

## Demo session and evidence record

Use roughly 20 to 30 minutes per session as a planning allowance. For a sales demonstration, begin with a short guided overview. For usability testing, start with a fresh participant or an unfamiliar task and avoid explaining the interface before they try it. Observe venue search and quote acceptance for venue customers; inquiry-to-confirmation for venue staff; and merchant application, competing-slot, and offer/payment-status situations for organizers and merchants. Record prior exposure to the guided demo when interpreting task success.

Record participant role, workflow volume, task attempted, completion without assistance, help required, important misunderstanding, direct feedback, and the resulting product decision. Ask what would keep them using their current process. Treat intent to use or pay as interview evidence; only a specific commitment establishes pilot interest, and only collection establishes revenue.

Proposed internal gates for revising or proceeding:

- At least two organizers independently identify a repeated problem and explain it using a recent event.
- At least one venue decision maker can follow the layout-and-rules agreement process and explain how changes would be handled with the organizer. Record any mismatch with their current process for discussion; the confirmed product scope assigns merchant selection to organizers.
- Both venue-customer participants can find a suitable sample venue, submit an inquiry, and distinguish inquiry, quote, hold, and confirmation.
- At least three of four merchant participants complete the application and preference selection without coaching.
- Include a two-booth task: participants can select an eligible adjacent pair, distinguish backup pairs from additional bookings, and understand that the organizer decides whether to approve the request.
- Every merchant participant correctly distinguishes submitted, offered, pending payment verification, and confirmed after using the relevant screens. Any confusion that could cause mistaken payment or attendance requires revision and another check.
- Both organizer participants can review applicants and offer an alternative without recreating an application or losing track of booth status.
- At least one organizer identifies an upcoming event and agrees to discuss a scoped paid pilot. This is sufficient to continue discovery, not proof of a viable business.

These are proposed decision rules for a small research round, not statistical market validation. Revisit the larger commitment targets in the business plan before production investment.

## Commercial validation

Test venue and organizer offers separately. The business plan proposes PHP 1,990 per venue-month and PHP 2,490 per market edition; neither is validated or approved pricing. Present the relevant price only after the participant understands the proposed scope, and record what support and functionality they expect in return.

Ask who approves spending, which upcoming booking cycle or event could be used, what replaces the current process, and what outcome would justify renewing. Do not count organizer enthusiasm as evidence that venue owners will subscribe, or venue listings as evidence that merchants will apply.

The proposed demo requires no customer payments or paid integrations. An implementation budget and delivery estimate should follow the agreed demo brief; this planning document authorizes neither spending nor production launch.

## Next product management steps

The user asked to map the merchant/organizer screens, detail the venue marketplace booking journey, and define the complete demo scope. Those planning deliverables are now recorded below. The exact venue-document requirements remain deferred; the online review and optional messages/meetings direction remains in scope using sample content.

| Order | Planning work | Concrete outcome |
| --- | --- | --- |
| 1 | Merchant and organizer screens — mapped | Three-step application, shared status detail, organizer review/offer/receipt panels, roster, and spatial sketches in the screen map |
| 2 | Venue marketplace journey — detailed | Inquiry, venue-set quote/hold, direct payment, verification, and customer/venue confirmation in the venue booking specification |
| 3 | Version 1 demo scope — bounded | Three complete journeys, nine screen families, fixed fictional records, required scenes, and explicit exclusions in the scope baseline |
| 4 | Implementation planning and build — later stage | Select the local demo approach and ordered work when the user chooses to move to building; no application scaffold or implementation exists yet |
| 5 | Prospect sessions and evidence gathering — later stage | Use the existing walkthrough and research guide; collect exact venue requirements and real operating examples without confusing presentation success with demand or reliability |

Start with [demo scope v1](demo-v1-scope.md) for the current boundary. The [screen map](demo-screen-outline.md), [venue booking specification](venue-marketplace-booking-spec.md), [merchant specification](merchant-application-and-selection-spec.md), and [organizer setup wireframe review](organizer-setup-wireframe-review.md) provide supporting detail. Exact venue-document requirements are deferred at the user's request. Sample prices/policies, payment methods, and operational targets still need real-world validation. Only organizer setup has a clickable planning wireframe; the other screens are mapped in documents. All work remains planning only.
